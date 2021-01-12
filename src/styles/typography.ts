import {css} from 'styled-components';

export default css`
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        font-family: 'moon_2.0regular';

        &.bold {
            font-family: 'moon_2.0bold';
        }

        &.light {
            font-family: 'moon_2.0light';
        }
    }

    h1 {
        font-size: 6rem;
    }

    p {
        font-family: 'Montserrat', sans-serif;
        font-size: 1.8rem;

        &.bold {
            font-weight: 500;
        }

        &.light {
            font-weight: 300;
        }
    }
`;
