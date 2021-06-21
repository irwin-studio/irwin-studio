import {createGlobalStyle} from 'styled-components';
import typography from './typography';

export default createGlobalStyle`
    :root {
        --primary: #FCFBF8;
        --secondary: #373A43;
    }

    * {
        margin: 0;
        padding: 0;
    }

    body {
        overflow: hidden;
        background-color: var(--primary);
    }

    ${typography}
`;
