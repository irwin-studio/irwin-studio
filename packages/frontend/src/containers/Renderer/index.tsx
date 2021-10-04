import React from 'react';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import Splash from '../../components/Splash';
import triangle from '../../renderers/Triangle';
import boids from '../../renderers/Boids';
import {Renderer, RendererInitializer} from '../../renderers';
import RenderStage from '../../components/RenderStage';

const renderers: Record<string, RendererInitializer<any>> = {
    triangle,
    boids,
};

const Renderer: React.FC = () => {
    const {rendererName} = useParams<{rendererName: string}>();
    const renderer = renderers[rendererName];

    return (
        <>
            {!renderer && (
                <Splash>
                    <Missing>The renderer you&apos;re looking for does not exist</Missing>
                </Splash>
            )}
            {!!renderer && <RenderStage renderer={renderer} />}
        </>
    );
};

const Missing = styled.h1`
    color: black;
`;

export default Renderer;
