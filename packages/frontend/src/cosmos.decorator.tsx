import React from 'react';
import {BreakpointContext} from './services/BreakPoints';
import breakpoints from './helpers/breakpoints';
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
