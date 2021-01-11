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
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
`;

export default Splash;
