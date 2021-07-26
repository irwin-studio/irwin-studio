import React from 'react';
import styled from 'styled-components';
import Splash from '../../../components/Splash';
import pkg from '../../../../package.json';
import Embers from '../../../components/Embers';

const Background = <Embers style={{position: 'absolute'}} height="100vh" width="100vw" />;

const ComingSoon: React.FC = () => (
    <>
        <Splash background={Background}>
            <Title>
                Irwin<span>Studio</span>
            </Title>
            <Subtitle>coming soon</Subtitle>
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
    font-size: 6rem;
    font-weight: 400;

    span {
        margin-left: 0.6rem;
    }
`;
const Subtitle = styled.p`
    font-size: 1.8rem;
`;

export default ComingSoon;
