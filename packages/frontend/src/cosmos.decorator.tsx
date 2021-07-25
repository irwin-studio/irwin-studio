import React from 'react';
import {breakpoints} from '.';
import {BreakpointContext} from './services/BreakPoints';
import BaseStyle from './styles';

const Wrap: React.FC = ({children}) => {
    return (
        <BreakpointContext breakpoints={breakpoints}>
            <BaseStyle />
            {children}
        </BreakpointContext>
    );
};

export default Wrap;
