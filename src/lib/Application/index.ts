import { Layer } from '$lib/Renderer/layer'
import type { EventMetaData, Handler, Renderer } from '../Renderer'
import { Info } from '../Renderer/info'

export abstract class Application extends Info implements Application {
  layer: Layer = new Layer()

  constructor() {
    super()
  }

  abstract performNextStep(): void
  abstract getOnDragHandler(): Handler<[MouseEvent, EventMetaData]>
  abstract getOnKeyDownHandler(): Handler<[KeyboardEvent, EventMetaData]>
  abstract getOnWheelHandler(): Handler<[MouseEvent, EventMetaData]>
  abstract getOnClickHandler(): Handler<[MouseEvent, EventMetaData]>
}
