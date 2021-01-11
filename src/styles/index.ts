import {createGlobalStyle} from 'styled-components';
import typography from './typography';

export default createGlobalStyle`
    :root {
        --primary: #FCFBF8;
        --secondary: #373A43;
    }

    body {
        margin: 0;
        padding: 0;
        background-color: var(--primary);
        color: var--secondary);
    }

    ${typography}
`;
