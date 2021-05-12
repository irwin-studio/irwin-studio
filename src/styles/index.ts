import {createGlobalStyle} from 'styled-components';
import typography from './typography';

export default createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
    }

    body {
        overflow: hidden;
    }

    ${typography}
`;
