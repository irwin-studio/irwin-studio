import React from 'react';
import styled from 'styled-components';

const Splash: React.FC = ({children}) => (
    <Fullscreen>
        <Container>{children}</Container>
    </Fullscreen>
);

const Container = styled.div`
    margin: auto;
    text-align: center;
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
