import React from 'react';
import styled from 'styled-components';
import Links from './Links';

const Nav: React.FC = () => {
    return (
        <Wrap>
            <Gutter>
                <Banner>
                    <h1>Irwin</h1>
                </Banner>
            </Gutter>

            <Center>
                <img src="/favicon.svg" height="100%" />
            </Center>

            <Gutter className="reverse">
                <Links />
            </Gutter>
        </Wrap>
    );
};

const Wrap = styled.div`
    width: 100vw;
    height: 4rem;
    margin: 0;

    z-index: 10;
    display: flex;
    top: 0;
    left: 0;

    justify-content: space-between;
    position: fixed;

    background-color: var(--primary);
    box-shadow: 0px 0px 5px 0.2px var(--secondary);
    -webkit-box-shadow: 0px 0px 5px 0.2px var(--secondary);
    -moz-box-shadow: 0px 0px 5px 0.2px var(--secondary);
`;

const Center = styled.div`
    display: flex;
    justify-content: center;
    padding: 0;
`;

const Gutter = styled.div`
    width: 50%;
    justify-content: flex-start;
    display: flex;

    * {
    }

    &.reverse {
        justify-content: flex-end;
    }
`;

const Banner = styled.div`
    display: flex;
    align-items: end;
    padding: 0 5px;

    h1 {
        line-height: 1;
        font-weight: 400;
        transform: translateY(0.5rem);
        display: inline;
        font-size: 2.8rem;
        text-transform: uppercase;
    }
`;

export default Nav;
