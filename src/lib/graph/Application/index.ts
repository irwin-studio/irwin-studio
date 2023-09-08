import { Layer } from '$lib/graph/Renderer/layer'
import type { OnKeyMeta } from '$lib/util/onKey'
import type { Handler, EventMetaData } from '../Renderer'
import { Info } from '../Renderer/info'

export abstract class Application extends Info implements Application {
  layer: Layer = new Layer()

  constructor() {
    super()
  }

  abstract performNextStep(): void
  abstract getOnDragHandler(): Handler<[MouseEvent, EventMetaData]>
  abstract getOnKeyDownHandler(): Handler<[KeyboardEvent, EventMetaData & OnKeyMeta]>
  abstract getOnWheelHandler(): Handler<[MouseEvent, EventMetaData]>
  abstract getOnClickHandler(): Handler<[MouseEvent, EventMetaData]>
  abstract getOnMouseMoveHandler(): Handler<[MouseEvent, EventMetaData]>
}
