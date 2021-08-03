import {createGlobalStyle} from 'styled-components';
import * as typography from './typography';
import * as shadows from './shadows';
import * as inputs from './input';
import normalize from 'normalize.css';

export default createGlobalStyle`
    ${normalize}

    :root {
        --primary: 252, 251, 248;
        --secondary: 55, 58, 67;
        --error: 240, 82, 25;
        --warning: 243, 182, 31;
        --info: 116, 209, 234;
        --success: 119, 207, 157;
        ${shadows.roots}
    }

    body {
        background-color: rgba(var(--primary), 1);
    }

    .mdi-icon {
        &.spinning {
            @keyframes spin {
                from {transform:rotate(0deg);}
                to {transform:rotate(360deg);}
            }

            animation: spin 2.4s infinite linear;
        }
    }

    ${typography.styles}
    ${inputs.styles}
`;
