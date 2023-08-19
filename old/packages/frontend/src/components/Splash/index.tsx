import React from 'react';
import styled from 'styled-components';

interface Props {
    background?: React.ReactElement;
}

const Splash: React.FC<Props> = ({background, children}) => (
    <Fullscreen>
        <Background>{background}</Background>
        <Container>{children}</Container>
    </Fullscreen>
);

const Container = styled.div`
    z-index: 5;
    margin: auto;
    text-align: center;
`;

const Background = styled.div`
    z-index: 1;
    position: absolute;
    height: 100%;
    width: 100%;
`;

const Fullscreen = styled.div`
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    display: flex;
    justify-content: center;
`;

export default Splash;
