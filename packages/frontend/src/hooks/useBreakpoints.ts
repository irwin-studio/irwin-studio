import _ from 'lodash';
import {useState, useEffect} from 'react';

type Breakpoints = Record<string, number>;
interface Breakpoint {
    name: string;
    value: number;
}

interface BreakpointsAPI {
    currentHeight: number;
    currentWidth: number;
    currentBreakpoint: Breakpoint;
    breakpoints: Breakpoints;
}

export const DEFAULT_BREAKPOINTS = {
    unknown: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
};

export function useBreakpointsAPI(breakpoints: Breakpoints = DEFAULT_BREAKPOINTS): BreakpointsAPI {
    const [sortedBreakpoints, setSortedBreakpoints] = useState<Breakpoint[]>([]);
    const [currentHeight, setCurrentHeight] = useState(window.innerHeight);
    const [currentWidth, setCurrentWidth] = useState(window.innerWidth);
    const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>({
        name: 'unknown',
        value: 0,
    });

    /*
     * if and when the provided breakpoints change - re-sort the values
     */
    useEffect(() => {
        const formatted = Object.entries(breakpoints).map(([name, value]) => ({name, value}));

        const sorted = _.sortBy(formatted, ['value']);
        setSortedBreakpoints(sorted);
    }, [breakpoints]);

    /*
     * when the breakpoints are updated or the page width changes, update the breakpoint
     */
    useEffect(() => {
        const breakpoint = sortedBreakpoints.find((breakpoint, index) => {
            const nextBreakpoint = sortedBreakpoints[index + 1];
            const isLastBreakpoint = index === sortedBreakpoints.length - 1;

            return (
                (isLastBreakpoint && currentWidth >= breakpoint.value) ||
                (currentWidth >= breakpoint.value && currentWidth < nextBreakpoint?.value)
            );
        });

        setCurrentBreakpoint(
            breakpoint || {
                name: 'unknown',
                value: 0,
            },
        );
    }, [sortedBreakpoints, currentWidth]);

    useEffect(() => {
        const setValues = () => {
            setCurrentHeight(window.innerHeight);
            setCurrentWidth(window.innerWidth);
        };

        window.addEventListener('resize', setValues);
        () => window.removeEventListener('resize', setValues);
    });

    return {
        currentHeight,
        currentWidth,
        currentBreakpoint,
        breakpoints,
    };
}
