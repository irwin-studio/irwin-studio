import {parse} from 'node-html-parser';
import {GithubStats} from '../types/github';
import fetch from 'node-fetch';

const DEFAULT_USERNAME = 'lauchlan105';

export async function getGithubStats(username: string = DEFAULT_USERNAME): Promise<GithubStats> {
    const response = await fetch(`https://github.com/${username}`);

    if (response.status !== 200) {
        throw new Error(`Github failed to respond: ${response.statusText} (${response.status})`);
    }

    const html = await response.text();

    const root = parse(html);
    const container = root.querySelector('div.js-calendar-graph');
    const graph = root.querySelector('#js-pjax-container svg.js-calendar-graph-svg');

    const from = container.getAttribute('data-from');
    const to = container.getAttribute('data-to');

    if (from === undefined || to === undefined) {
        throw new Error(`Failed to scrape page ({ to: ${to}, from: ${from}})`);
    }

    const commits = graph.querySelectorAll('rect');
    const commitCounts = commits.map(el => {
        const count = el.getAttribute('data-count');

        if (count === undefined) {
            throw new Error(`Failed to scrape page - some 'count' values were not found`);
        }

        return Number.parseInt(count || '0');
    });

    return {
        username,
        contributions: {
            total: commitCounts.reduce((total, count) => total + count, 0),
            commits: commitCounts,
            from: new Date(from),
            to: new Date(to),
        },
    };
}
