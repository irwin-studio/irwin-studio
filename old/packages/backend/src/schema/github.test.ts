import {DEFAULT_SERVER_CONFIGURATION} from '../server';
import {createServer} from '../server';
import {getQueryMethod} from '../utils/testing';

const server = createServer(DEFAULT_SERVER_CONFIGURATION);
const query = getQueryMethod(server);

describe('Github Schema', () => {
    beforeAll(() => server.start());

    describe('Queries', () => {
        describe('githubStats', () => {
            it('should get github information', async () => {
                const result = await query(`
                    query {
                        githubStats {
                            username
                            contributions {
                                from
                                to
                                total
                                commits
                            }
                        }
                    }
                `);

                expect(result.data).toMatchObject({
                    githubStats: {
                        username: expect.any(String),
                        contributions: {
                            total: expect.any(Number),
                            from: expect.any(Number),
                            to: expect.any(Number),
                            commits: expect.arrayContaining([expect.any(Number)]),
                        },
                    },
                });
            });
        });
    });
});
