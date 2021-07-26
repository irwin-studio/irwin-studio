import {createGlobalStyle} from 'styled-components';
import typography from './typography';

export default createGlobalStyle`
    :root {
        --primary: 252, 251, 248;
        --secondary: 55, 58, 67;
    }

    * {
        margin: 0;
        padding: 0;
    }

    body {
        overflow: hidden;
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

    ${typography}
`;
