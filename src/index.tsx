import React from 'react';
import ReactDOM from 'react-dom';
import BaseStyle from './styles';
import App from './containers/App';
import {BreakpointContext} from './services/BreakPoints';
import tailwind from '../tailwind.js';

const breakpoints: Record<string, number> = {};
Object.entries(tailwind.theme.screens).map(([name, value]: [string, string]) => {
    breakpoints[name] = Number.parseInt(value.replace('px', ''), 10);
});

ReactDOM.render(
    <BreakpointContext breakpoints={breakpoints}>
        <BaseStyle />
        <App />
    </BreakpointContext>,
    document.getElementById('root'),
);
