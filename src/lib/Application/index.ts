import type { Handler, RendererCanvasMetaData } from '../Renderer'
import { Info } from '../Renderer/info'
import type { IShape } from '../Renderer/shape'

export interface IApplication extends Application {
  shapes: Set<IShape>
  handleOnDrag: Handler<[MouseEvent, RendererCanvasMetaData]>
  handleOnKeyDown: Handler<[KeyboardEvent, RendererCanvasMetaData]>
  handleOnWheel: Handler<[MouseEvent, RendererCanvasMetaData]>
  handleOnClick: Handler<[MouseEvent, RendererCanvasMetaData]>
  performNextStep(): void;
}

export class Application extends Info {
  shapes: Set<IShape> = new Set<IShape>()

  constructor() {
    super()
  }
}
