import {css} from 'styled-components';

const styles = css`
    input {
        transition: border ease-in-out 0.2s;
        border: 1px solid rgba(var(--secondary), 0.4);
        border-radius: 0.2rem;
        outline: none;

        &:focus {
            border: 1px solid rgba(var(--secondary), 0.8);
        }
    }
`;

export {styles};
