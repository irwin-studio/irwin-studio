import {Subject} from 'rxjs';
import {deepPreservativeMerge} from '../../helpers/objects';
import {Type} from '../../helpers/parameters';
import {IParameters, Renderer, RendererInitializer, RendererProps} from '../index';

type DeepPartial<T extends {}> = {
    [K in keyof T]?: T[K] extends {} ? DeepPartial<T[K]> : T[K];
};

import spriteWGSL from './shaders/sprite.wgsl';
import updateSpritesWGSL from './shaders/updateSprites.wgsl';
import {createGroupedBuffer} from './util';

const INITIAL_PARAMETERS: IParameters = {
    compute: {
        deltaT: {
            type: Type.NUMBER,
            value: 0.04,
            min: 0,
            max: 1,
            step: 0.01,
        },
        rule1Distance: {
            type: Type.NUMBER,
            value: 0.1,
            min: 0,
            max: 1,
            step: 0.01,
        },
        rule2Distance: {
            type: Type.NUMBER,
            value: 0.025,
            min: 0,
            max: 1,
            step: 0.01,
        },
        rule3Distance: {
            type: Type.NUMBER,
            value: 0.025,
            min: 0,
            max: 1,
            step: 0.01,
        },
        rule1Scale: {
            type: Type.NUMBER,
            value: 0.02,
            min: 0,
            max: 1,
            step: 0.01,
        },
        rule2Scale: {
            type: Type.NUMBER,
            value: 0.05,
            min: 0,
            max: 1,
            step: 0.01,
        },
        rule3Scale: {
            type: Type.NUMBER,
            value: 0.005,
            min: 0,
            max: 1,
            step: 0.01,
        },
    },
    render: {
        count: {
            type: Type.NUMBER,
            value: 10000,
            min: 1,
            max: 10000,
            step: 1,
        },
    },
};

type Parameters = typeof INITIAL_PARAMETERS;

function initBoids({
    device,
    adapter,
    canvasRef,
    defaultParameters,
}: RendererProps<Parameters>): Renderer<Parameters> {
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

    const spriteShaderModule = device.createShaderModule({code: spriteWGSL});
    const renderPipeline = device.createRenderPipeline({
        vertex: {
            module: spriteShaderModule,
            entryPoint: 'vert_main',
            buffers: [
                {
                    // instanced particles buffer
                    arrayStride: 4 * 4,
                    stepMode: 'instance',
                    attributes: [
                        {
                            // instance position
                            shaderLocation: 0,
                            offset: 0,
                            format: 'float32x2',
                        },
                        {
                            // instance velocity
                            shaderLocation: 1,
                            offset: 2 * 4,
                            format: 'float32x2',
                        },
                    ],
                },
                {
                    // vertex buffer
                    arrayStride: 2 * 4,
                    stepMode: 'vertex',
                    attributes: [
                        {
                            // vertex positions
                            shaderLocation: 2,
                            offset: 0,
                            format: 'float32x2',
                        },
                    ],
                },
            ],
        },
        fragment: {
            module: spriteShaderModule,
            entryPoint: 'frag_main',
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

    const computePipeline = device.createComputePipeline({
        compute: {
            module: device.createShaderModule({
                code: updateSpritesWGSL,
            }),
            entryPoint: 'main',
        },
    });

    const renderPassDescriptor: GPURenderPassDescriptor = {
        colorAttachments: [
            {
                view: context.getCurrentTexture().createView(),
                loadValue: {r: 0.0, g: 0.0, b: 0.0, a: 1.0},
                storeOp: 'store',
            },
        ],
    };

    // prettier-ignore
    const vertexBufferData = new Float32Array([
        -0.01, -0.02, 0.01,
        -0.02, 0.0, 0.02,
    ]);

    const spriteVertexBuffer = device.createBuffer({
        size: vertexBufferData.byteLength,
        usage: GPUBufferUsage.VERTEX,
        mappedAtCreation: true,
    });

    new Float32Array(spriteVertexBuffer.getMappedRange()).set(vertexBufferData);
    spriteVertexBuffer.unmap();

    const parametersUpdated$ = new Subject<Parameters>();
    let previousParameters: Parameters = Object.assign(INITIAL_PARAMETERS, defaultParameters);
    const currentParameters: Parameters = Object.assign(INITIAL_PARAMETERS, defaultParameters);

    // Create buffer for parameters
    const simParamBufferSize =
        Object.keys(currentParameters.compute).length * Float32Array.BYTES_PER_ELEMENT;
    const simParamBuffer = device.createBuffer({
        size: simParamBufferSize,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const updateParameters = (updatedValues: DeepPartial<Parameters> = {}) => {
        previousParameters = JSON.parse(JSON.stringify(currentParameters)) as Parameters;
        Object.assign(currentParameters, deepPreservativeMerge(currentParameters, updatedValues));
        parametersUpdated$.next(currentParameters);
    };

    const writeParameters = () => {
        const {compute} = currentParameters;
        device.queue.writeBuffer(
            simParamBuffer,
            0,
            new Float32Array([
                compute.deltaT.value,
                compute.rule1Distance.value,
                compute.rule2Distance.value,
                compute.rule3Distance.value,
                compute.rule1Scale.value,
                compute.rule2Scale.value,
                compute.rule3Scale.value,
            ]),
        );
    };

    writeParameters();
    parametersUpdated$.subscribe(() => writeParameters());

    const bufferCount = 2;
    const items = new Array(bufferCount).fill(undefined);
    const bufferBackups: Float32Array[] = items.map(() => new Float32Array(0));
    const particleBuffers: GPUBuffer[] = items.map((_, i) =>
        device.createBuffer({
            size: bufferBackups[i].byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE,
            mappedAtCreation: true,
        }),
    );
    const storageBuffers: GPUBuffer[] = items.map((_, i) =>
        device.createBuffer({
            size: bufferBackups[i].byteLength,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
        }),
    );
    const particleBindGroups: GPUBindGroup[] = new Array(bufferCount);

    let t = 0;
    let playing = false;

    const backupBuffers = async () => {
        console.warn('### BACKING UP ###');
        const previousCount = previousParameters.render.count.value;
        const currentCount = currentParameters.render.count.value;
        const readSize = Math.min(previousCount, currentCount) * 4 * 4;
        const commandEncoder = device.createCommandEncoder();

        const backups = bufferBackups.map(async (_, index) => {
            console.log(`storage buffer is ${readSize} bytes`);
            storageBuffers[index] = device.createBuffer({
                size: readSize,
                usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
            });

            // try to read values out of current buffer
            console.log(`1. Copying values from particle buffer into storage buffer ${index + 1}`);
            commandEncoder.copyBufferToBuffer(
                particleBuffers[index],
                0,
                storageBuffers[index],
                0,
                readSize,
            );
            await storageBuffers[index].mapAsync(GPUMapMode.READ);

            // console.log(`2. Reading storage buffer ${index + 1}`);
            console.log(`reading ${readSize} bytes from storage`);
            const bufferValues = storageBuffers[index].getMappedRange(0, readSize);
            let backup = new Float32Array(bufferValues);

            // calculate number of new values needed
            const newBoidCount = currentParameters.render.count.value - backup.length / 4;
            console.log(`filling random values for ${newBoidCount} boids`);

            // generate fill values
            const fillValues = createGroupedBuffer(newBoidCount, 4, () => [
                2 * (Math.random() - 0.5),
                2 * (Math.random() - 0.5),
                2 * (Math.random() - 0.5) * 0.1,
                2 * (Math.random() - 0.5) * 0.1,
            ]);

            // const logF32Array = (items: Float32Array) => {
            //     const arr: any = [];
            //     for (let item of items.values()) {
            //         arr.push(item);
            //     }
            //     return arr;
            // };

            // create new array and fill with values
            const newBufferCopy = new Float32Array(backup.length + fillValues.length);
            newBufferCopy.set([...backup.values(), ...fillValues.values()]);

            // console.log(`3. Filling bufferBackup with copied and new data ${index + 1}`);
            bufferBackups[index] = newBufferCopy;
            console.log({
                backup: backup,
                fillValues: fillValues,
                newBufferCopy: newBufferCopy,
            });
            storageBuffers[index].unmap();
            storageBuffers[index].destroy();
        });

        await Promise.all(backups);
    };

    const restoreBuffers = () => {
        console.warn('### RESTORING ###');
        for (let i = 0; i < bufferCount; ++i) {
            particleBuffers[i].destroy();

            // console.log(`4. Creating particle buffer ${i + 1} of ${bufferCount}`);
            particleBuffers[i] = device.createBuffer({
                size: bufferBackups[i].byteLength,
                usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE,
                mappedAtCreation: true,
            });

            // console.log(`6. Writing bufferBackup to particleBuffer ${i + 1} of ${bufferCount}`);
            new Float32Array(particleBuffers[i].getMappedRange()).set(bufferBackups[i]);
            particleBuffers[i].unmap();
        }
    };

    const reassignBuffers = () => {
        console.warn('### REASSINGING ###');
        // bind latest buffers to device
        for (let i = 0; i < bufferCount; ++i) {
            particleBindGroups[i] = device.createBindGroup({
                layout: computePipeline.getBindGroupLayout(0),
                entries: [
                    {
                        binding: 0,
                        resource: {
                            buffer: simParamBuffer,
                        },
                    },
                    {
                        binding: 1,
                        resource: {
                            buffer: particleBuffers[i],
                            offset: 0,
                            size: bufferBackups[i].byteLength,
                        },
                    },
                    {
                        binding: 2,
                        resource: {
                            buffer: particleBuffers[(i + 1) % bufferCount],
                            offset: 0,
                            size: bufferBackups[(i + 1) % bufferCount].byteLength,
                        },
                    },
                ],
            });
        }
    };

    let backingUp = true;
    backupBuffers().then(() => {
        restoreBuffers();
        reassignBuffers();
        backingUp = false;
    });

    parametersUpdated$.subscribe(async () => {
        if (backingUp) return;
        pause();
        backingUp = true;

        await backupBuffers();
        restoreBuffers();
        reassignBuffers();

        backingUp = false;
        playing = true;
        play();
    });

    function animateFrame() {
        // Sample is no longer the active page.
        if (!canvas) return;

        //@ts-ignore
        renderPassDescriptor.colorAttachments[0].view = context.getCurrentTexture().createView();

        const commandEncoder = device.createCommandEncoder();
        {
            const passEncoder = commandEncoder.beginComputePass();
            passEncoder.setPipeline(computePipeline);
            passEncoder.setBindGroup(0, particleBindGroups[t % bufferCount]);
            passEncoder.dispatch(Math.ceil(currentParameters.render.count.value / 64));
            passEncoder.endPass();
        }
        {
            const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
            passEncoder.setPipeline(renderPipeline);
            passEncoder.setVertexBuffer(0, particleBuffers[(t + 1) % bufferCount]);
            passEncoder.setVertexBuffer(1, spriteVertexBuffer);
            passEncoder.draw(3, currentParameters.render.count.value, 0, 0);
            passEncoder.endPass();
        }
        device.queue.submit([commandEncoder.finish()]);

        ++t;
    }

    let animationFrame: number | undefined = undefined;
    const play = async () => {
        if (backingUp || !playing) return;
        animateFrame();

        if (animationFrame !== undefined) {
            cancelAnimationFrame(animationFrame);
        }

        animationFrame = requestAnimationFrame(play);
    };

    const pause = () => {
        console.log('pause');
        playing = false;
        if (animationFrame !== undefined) {
            cancelAnimationFrame(animationFrame);
        }
    };

    return {
        parameters: {
            update: updateParameters,
            current: {...currentParameters},
            onUpdated: (callback: (parameters: Parameters) => void) => {
                const subscription = parametersUpdated$.subscribe(latestParameters =>
                    callback({...latestParameters}),
                );

                return () => subscription.unsubscribe();
            },
        },
        controls: {
            nextFrame: () => {
                console.log('nextFrame');
                playing = false;
                requestAnimationFrame(animateFrame);
            },
            play: () => {
                playing = true;
                play();
            },
            pause,
            previousFrame: () => console.log('previousFrame'),
            reset: () => console.log('reset'),
        },
    };
}

const init: RendererInitializer<Parameters> = initBoids;
export default init;
