import tailwind from '../../tailwind.js';

const breakpoints: Record<string, number> = {};
Object.entries(tailwind.theme.screens).map(([name, value]: [string, string]) => {
    breakpoints[name] = Number.parseInt(value.replace('px', ''), 10);
});

export default breakpoints;
