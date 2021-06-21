import React from 'react';
import ReactDOM from 'react-dom';
import BaseStyle from './styles';
import App from './containers/App';
import {BreakpointContext} from './services/BreakPoints';
import breakpoints from './helpers/breakpoints';

ReactDOM.render(
    <BreakpointContext breakpoints={breakpoints}>
        <BaseStyle />
        <App />
    </BreakpointContext>,
    document.getElementById('root'),
);
