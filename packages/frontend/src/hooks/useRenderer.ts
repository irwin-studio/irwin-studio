import {useEffect, useState} from 'react';
import {IParameters, Renderer, RendererInitializer} from '../renderers';
import {useWebGPU} from './useWebGPU';

/**
 * Initialise the renderer by request the GPU adapter and device and providing
 * those plus to the renderer and returning its controls and parameters
 * @param initRenderer Renderer initialization function
 * @param canvas React reference to canvas element
 * @returns Renderer Controls
 */
const useRenderer = <Parameters extends IParameters>(
    initRenderer: RendererInitializer<Parameters>,
    canvasRef: React.RefObject<HTMLCanvasElement>,
): Partial<Renderer<Parameters>> => {
    const {adapter, device} = useWebGPU();
    const [renderer, setRenderer] = useState<Renderer<Parameters>>();

    useEffect(() => {
        // don't run if the renderer has already been defined
        console.log({renderer, adapter, device, canvasRef});
        if (renderer) return;

        // don't create renderer if some of the parts are missing
        if (!adapter || !device || !canvasRef.current) return;

        console.log('creating renderer');
        setRenderer(
            initRenderer({
                device,
                adapter,
                canvasRef,
            }),
        );
    }, [adapter, device, canvasRef.current]);

    return renderer || {};
};

export {useRenderer};
