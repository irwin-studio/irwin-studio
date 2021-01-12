import React from 'react';
import styled from 'styled-components';
import Splash from '../../../components/Splash';
import FloatingParticles from './FloatingParticles';

const ComingSoon: React.FC = () => (
    <>
        <FloatingParticles style={{position: 'absolute'}} height="100vh" width="100vw" />
        <Splash>
            <Title>
                Irwin<span>Studio</span>
            </Title>
            <p>coming soon</p>
        </Splash>
    </>
);

const Title = styled.h1`
    span {
        font-weight: 400;
        margin-left: 0.6rem;
    }
`;

export default ComingSoon;
