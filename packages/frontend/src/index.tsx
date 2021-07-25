import React from 'react';
import ReactDOM from 'react-dom';
import BaseStyle from './styles';
import App from './containers/App';
import {BreakpointContext} from './services/BreakPoints';

export const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
};

ReactDOM.render(
    <BreakpointContext breakpoints={breakpoints}>
        <BaseStyle />
        <App />
    </BreakpointContext>,
    document.getElementById('root'),
);
