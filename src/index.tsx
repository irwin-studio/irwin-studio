import React from 'react';
import ReactDOM from 'react-dom';
import BaseStyle from './styles';
import App from './containers/App';
import breakpoints from './breakpoints';
import {BreakpointContext} from './services/BreakPoints';

ReactDOM.render(
    <BreakpointContext breakpoints={breakpoints}>
        <BaseStyle />
        <App />
    </BreakpointContext>,
    document.getElementById('root'),
);
