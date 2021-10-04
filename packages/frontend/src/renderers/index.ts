import {ParameterSchema} from '../helpers/parameters';

/**
 * All the items the renderer needs
 */
export interface RendererProps<Parameters extends IParameters | undefined = undefined> {
    device: GPUDevice;
    adapter: GPUAdapter;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    defaultParameters?: Parameters extends undefined ? undefined : Partial<Parameters>;
}

/**
 * What is required to control animation
 */
export interface RendererControls {
    play: () => void;
    pause: () => void;
    nextFrame: () => void;
    previousFrame: () => void;
    reset: () => void;
}

/**
 * The methods and values to interface with the renderer's runtime parameters/values/settings
 */
export interface RendererParameterAPI<Parameters extends IParameters | undefined = undefined> {
    update: (updatedParameters?: Partial<Parameters>) => void;
    onUpdated: (callback: (parameters: Parameters) => void) => () => void;
    current: Parameters;
}

/**
 * Generic Renderer Parameter Schemas
 */
export type IParameters = {
    compute: ParameterSchema;
    render: ParameterSchema;
};

/**
 * Renderer API to control and animation and runtime parameters
 */
export interface Renderer<Parameters extends IParameters | undefined = undefined> {
    controls: RendererControls;
    parameters: Parameters extends undefined ? undefined : RendererParameterAPI<Parameters>;
}

/**
 * This function returns a Renderer
 */
export type RendererInitializer<Parameters extends IParameters | undefined = undefined> = (
    props: RendererProps<Parameters>,
) => Renderer<Parameters>;
