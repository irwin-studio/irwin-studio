import _, { update } from 'lodash';
import createService from '@adamdickinson/react-service';
import { useEffect, useState } from 'react';

type Breakpoints = Record<string, number>;
interface Breakpoint {
    name: string;
    value: number;
}

interface ServiceInput {
    breakpoints: Breakpoints;
}

interface BreakpointsAPI {
    currentHeight: number;
    currentWidth: number;
    currentBreakpoint: string;
    breakpoints: Breakpoints;
}

function useBreakpointsAPI({breakpoints}: ServiceInput) {
    const [sortedBreakpoints, setSortedBreakpoints] = useState<Breakpoint[]>([]);
    const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>();
    const [currentHeight, setCurrentHeight] = useState(window.innerHeight);
    const [currentWidth, setCurrentWidth] = useState(window.innerWidth);

    /*
     * if and when the provided breakpoints change - re-sort the values
    */
    useEffect(() => {
        const formatted = Object.entries(breakpoints)
            .map(([name, value]) => ({ name, value }));

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

            return isLastBreakpoint && currentWidth >= breakpoint.value ||
                currentWidth >= breakpoint.value && currentWidth < nextBreakpoint?.value
        });

        setCurrentBreakpoint(breakpoint);
    }, [sortedBreakpoints, currentWidth]);

    window.onresize = () => {
        setCurrentHeight(window.innerHeight);
        setCurrentWidth(window.innerWidth);
    };

    return {
        currentHeight,
        currentWidth,
        currentBreakpoint,
        breakpoints,
    }
}

const [BreakpointContext, useBreakpoints] = createService<BreakpointsAPI, ServiceInput>(useBreakpointsAPI);

export {
    BreakpointsAPI,
    BreakpointContext,
    useBreakpoints
}
