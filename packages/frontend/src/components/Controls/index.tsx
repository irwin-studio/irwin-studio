import React from 'react';
import styled from 'styled-components';
import {RendererControls} from '../../renderers';

interface Props {
    controls: RendererControls;
}

const Controls: React.FC<Props> = ({controls}) => {
    return (
        <Wrap>
            <ControlButton onClick={controls?.play}>PLAY</ControlButton>
            <ControlButton onClick={controls?.pause}>PAUSE</ControlButton>
            <ControlButton onClick={controls?.nextFrame}>NEXT FRAME</ControlButton>
            <ControlButton onClick={controls?.previousFrame}>PREVIOUS FRAME</ControlButton>
        </Wrap>
    );
};

export default Controls;

const ControlButton = styled.h5`
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    letter-spacing: 2px;
    padding: 0;
    margin: 0.2rem;

    &:hover {
        transform: scale(1.1);
    }

    &:active {
        transform: scale(1.3);
    }
`;

const Wrap = styled.div`
    background-color: rgba(var(--primary), 0.8);
    position: fixed;
    bottom: 1rem;
    left: 1rem;
    padding: 0.5rem;
    border: 1px solid red;
    margin: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
`;
