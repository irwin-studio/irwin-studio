import React, {createRef, useEffect} from 'react';
import styled from 'styled-components';
import {useRenderer} from '../../hooks/useRenderer';
import {IParameters, RendererInitializer} from '../../renderers';
import Controls from '../Controls';
import RendererParameterControls from '../RendererParameterControls';

interface Props<Parameters extends IParameters> {
    renderer: RendererInitializer<Parameters>;
}

const RenderStage = function RenderStage<Parameters extends IParameters>({
    renderer,
}: Props<Parameters>) {
    const canvasRef = createRef<HTMLCanvasElement>();
    const {controls, parameters} = useRenderer(renderer, canvasRef);

    useEffect(() => {
        controls?.play();
    }, [controls]);

    return (
        <Wrap>
            <canvas
                height="100"
                width="100"
                style={{height: '100vh', width: '100vw', backgroundColor: 'black'}}
                ref={canvasRef}
            />
            <Overlay>
                {controls && <Controls controls={controls} />}
                {parameters && <RendererParameterControls parameters={parameters} />}
            </Overlay>
        </Wrap>
    );
};

const Wrap = styled.div`
    height: 100vh;
    width: 100vw;
    overflow: hidden;
`;

const Overlay = styled.div`
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
`;

export default RenderStage;
