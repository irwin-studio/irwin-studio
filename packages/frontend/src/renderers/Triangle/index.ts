import {Renderer, RendererControls, RendererInitializer, RendererProps} from '../index';

import triangleVertWGSL from './shaders/triangle.vert.wgsl';
import redFragWGSL from './shaders/red.frag.wgsl';

function initTriangle({device, adapter, canvasRef}: RendererProps): Renderer {
    const canvas = canvasRef.current;
    if (!canvas) {
        throw new Error('Failed to get canvas reference');
    }

    const context = canvas?.getContext('webgpu');
    if (!adapter || !device || !context) {
        throw new Error(
            'webgpu context is not available. Please see https://github.com/mikbry/awesome-webgpu#browser-support for more information',
        );
    }

    const devicePixelRatio = window.devicePixelRatio || 1;
    const presentationSize = [
        canvas.clientWidth * devicePixelRatio,
        canvas.clientHeight * devicePixelRatio,
    ];
    const presentationFormat = context.getPreferredFormat(adapter);

    context.configure({
        device,
        format: presentationFormat,
        size: presentationSize,
    });

    const pipeline = device.createRenderPipeline({
        vertex: {
            module: device.createShaderModule({
                code: triangleVertWGSL,
            }),
            entryPoint: 'main',
        },
        fragment: {
            module: device.createShaderModule({
                code: redFragWGSL,
            }),
            entryPoint: 'main',
            targets: [
                {
                    format: presentationFormat,
                },
            ],
        },
        primitive: {
            topology: 'triangle-list',
        },
    });

    const animateFrame = () => {
        // Sample is no longer the active page.
        if (!canvas) return;

        const commandEncoder = device.createCommandEncoder();
        const textureView = context.getCurrentTexture().createView();

        const renderPassDescriptor: GPURenderPassDescriptor = {
            colorAttachments: [
                {
                    view: textureView,
                    loadValue: {r: 0.0, g: 0.0, b: 1.0, a: 1.0},
                    storeOp: 'store',
                },
            ],
        };

        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(pipeline);
        passEncoder.draw(3, 1, 0, 0);
        passEncoder.endPass();

        device.queue.submit([commandEncoder.finish()]);
    };

    const play = () => {
        animateFrame();
        requestAnimationFrame(play);
    };

    const controls: RendererControls = {
        nextFrame: () => {
            requestAnimationFrame(animateFrame);
        },
        play,
        pause: () => console.log('pause'),
        previousFrame: () => console.log('previousFrame'),
        reset: () => console.log('reset'),
    };

    return {
        controls,
        parameters: undefined,
    };
}

const init: RendererInitializer = initTriangle;
export default init;
