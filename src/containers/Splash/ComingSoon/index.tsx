import React from 'react';
import styled from 'styled-components';
import Splash from '../../../components/Splash';
import FloatingParticles from './FloatingParticles';
import pkg from '../../../../package.json';

const ComingSoon: React.FC = () => (
    <>
        <FloatingParticles style={{position: 'absolute'}} height="100vh" width="100vw" />
        <Splash>
            <Title>
                Irwin<span>Studio</span>
            </Title>
            <p>coming soon</p>
        </Splash>
        <Version>v{pkg.version}</Version>
    </>
);

const Version = styled.p`
    font-size: 1.25rem;

    margin: 0;
    padding: 2rem;

    position: fixed;
    bottom: 0rem;
    right: 0rem;
`;
const Title = styled.h1`
    span {
        font-weight: 400;
        margin-left: 0.6rem;
    }
`;

export default ComingSoon;
