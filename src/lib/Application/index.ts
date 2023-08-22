import { Layer } from '$lib/Renderer/layer'
import type { Handler, RendererCanvasMetaData } from '../Renderer'
import { Info } from '../Renderer/info'
import type { Shape } from '../Renderer/shape'

export abstract class Application extends Info implements Application {
  layer: Layer = new Layer()

  constructor() {
    super()
  }

  abstract performNextStep(): void
  abstract getOnDragHandler(): Handler<[MouseEvent, RendererCanvasMetaData]>
  abstract getOnKeyDownHandler(): Handler<[KeyboardEvent, RendererCanvasMetaData]>
  abstract getOnWheelHandler(): Handler<[MouseEvent, RendererCanvasMetaData]>
  abstract getOnClickHandler(): Handler<[MouseEvent, RendererCanvasMetaData]>
}
