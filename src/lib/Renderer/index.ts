import type { IShape } from './shape';
import { Vec2, type MaybeVec2 } from './vec2';
import { onMouseDrag } from '$lib/util/onMouseDrag';
import { Info } from './info';
import { onWheel } from '$lib/util/onWheel';
import { onKey } from '$lib/util/onKey';
import { onMouseMove } from '$lib/util/onMouseMove';

export type Handler<I = never, O = void> = (input: I) => O

export interface RendererCanvasMetaData {
  calculatedPosition: Vec2;
  screenCenterOffset: Vec2
  originShift: Vec2
  canvasSize: Vec2
  scale: number
}

export class Renderer extends Info {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  shapes: Set<IShape>

  /** Every coordinate must add this number to center itself on the canvas  */
  screenCenterOffset: Vec2
  canvasSize: Vec2

  /** The X and Y distance of the origin from the center of the screen */
  originShift: Vec2

  /** default = 1 */
  renderScale: number = 3
  mousePosition: Vec2 = new Vec2(0, 0)

  callbacks = {
    onClick: new Set<Handler<[MouseEvent, RendererCanvasMetaData]>>(),
    onDrag: new Set<Handler<[MouseEvent, RendererCanvasMetaData]>>(),
    onKeyDown: new Set<Handler<[KeyboardEvent, RendererCanvasMetaData]>>(),
    onWheel: new Set<Handler<[MouseEvent, RendererCanvasMetaData]>>(),
  }

  constructor(canvas: HTMLCanvasElement) {
    super()

    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error("Failed to create Renderer - could not get a 2d context")
    }

    this.canvas = canvas;
    this.context = context;
    this.shapes = new Set<IShape>([])
    this.originShift = new Vec2(0, 0)
    this.canvasSize = new Vec2(this.canvas.width, this.canvas.height)
    this.screenCenterOffset = new Vec2(
      window.innerWidth / 2,
      window.innerHeight / 2,
    )

    this.registerHandlers()
  }

  private registerHandlers() {
    let cancelNext = false;

    this.canvas.addEventListener('click', (event: MouseEvent) => {
      if (cancelNext) {
        cancelNext = false
        return
      };

      if (event.ctrlKey) {
        this.moveOriginTo(0, 0)
        return
      }

      const position = new Vec2(event.clientX, event.clientY)
      this.callbacks.onClick.forEach(callback => {
        callback([event, this.getMetadata(position)])
      })
    })

    onMouseDrag(this.canvas, (event: MouseEvent) => {
      const position = new Vec2(event.clientX, event.clientY)
      this.callbacks.onDrag.forEach(callback => {
        callback([event, this.getMetadata(position)])
      })
    })

    onMouseMove((event) => {
      this.addInfo('mouse', new Vec2(event.clientX, event.clientY).toString())
    })

    onKey(/.*/, (event: KeyboardEvent) => {
      this.callbacks.onKeyDown.forEach(callback => {
        callback([event, this.getMetadata(this.mousePosition)])
      })
    }, 'DOWN')

    onWheel(this.canvas, (event: MouseEvent) => {
      this.callbacks.onWheel.forEach(callback => {
        callback([event, this.getMetadata(this.mousePosition)])
      })
    });

    onWheel(this.canvas, async (event) => {
      event.stopPropagation()
      event.stopImmediatePropagation()
      event.preventDefault()

      const mouseStart = this.screenspaceCoordsToCanvas([event.clientX, event.clientY])

      const scaleRate = 0.5
      const delta = -(event.deltaY / Math.abs(event.deltaY))
      this.renderScale = this.renderScale + (delta * (this.renderScale * scaleRate))
      this.renderScale = Math.max(this.renderScale, 0.01)

      const mouseEnd = this.screenspaceCoordsToCanvas([event.clientX, event.clientY])
      const diff = mouseEnd.clone().subtract(mouseStart).multiply(this.renderScale)

      this.moveOriginBy(diff.x, diff.y)
    })

    onMouseDrag(this.canvas, (event) => {
      cancelNext = true
      this.moveOriginBy(event.movementX, event.movementY);
    })
  }

  /**
   * CONFIG
   */

  addShape(shape: IShape): () => void {
    this.shapes.add(shape)
    return () => {
      this.shapes.delete(shape)
    }
  }

  removeShape(shape: IShape) {
    this.shapes.delete(shape)
  }

  setShapeRepository(shapes: Set<IShape>) {
    this.shapes.forEach(shape => shapes.add(shape))
    this.shapes = shapes;
  }

  setRenderScale(scale: number) {
    this.renderScale = scale
  }

  /**
   * ACTIONS
   */

  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.shapes.forEach(shape => {
      const meta = this.getMetadata(shape.position, shape.config.parallax)
      shape.draw(this.context, meta)
    })
  }

  moveOriginBy(width: number, height: number) {
    this.originShift.add(new Vec2(width, height));
  }

  moveOriginTo(x: number, y: number) {
    this.originShift.moveTo(new Vec2(x, y));
  }

  /**
   * HANDLER REGISTERS
   */

  onClick(handler: Handler<[MouseEvent, RendererCanvasMetaData]>) {
    this.callbacks.onClick.add(handler)
    return () => this.callbacks.onClick.delete(handler)
  }

  onDrag(handler: Handler<[MouseEvent, RendererCanvasMetaData]>) {
    this.callbacks.onDrag.add(handler)
    return () => this.callbacks.onDrag.delete(handler)
  }

  onKeyDown(handler: Handler<[KeyboardEvent, RendererCanvasMetaData]>) {
    this.callbacks.onKeyDown.add(handler)
    return () => this.callbacks.onKeyDown.delete(handler)
  }

  onWheel(handler: Handler<[MouseEvent, RendererCanvasMetaData]>) {
    this.callbacks.onWheel.add(handler)
    return () => this.callbacks.onWheel.delete(handler)
  }

  /**
   * UTIL
   */

  private screenspaceCoordsToCanvas(vec2: MaybeVec2): Vec2 {
    return Vec2.coerce(vec2)
      .subtract(this.screenCenterOffset)
      .subtract(this.originShift)
      .divide(this.renderScale)
  }

  private getMetadata(position: Vec2, parallax: number = 1): RendererCanvasMetaData {
    this.canvasSize = new Vec2(this.canvas.width, this.canvas.height)

    const scaledParallax = this.renderScale * (parallax - 1)
    const parallaxTranslation = this.originShift.clone().multiply(scaledParallax)
    const absolutePosition = position.clone().multiply(this.renderScale).add(this.originShift)
    const calculatedPosition = absolutePosition.clone()
      .add(this.screenCenterOffset.clone())
      .add(parallaxTranslation)

    return {
      calculatedPosition,
      screenCenterOffset: this.screenCenterOffset,
      originShift: this.originShift,
      canvasSize: this.canvasSize,
      scale: this.renderScale * parallax,
    }
  }

  getInfo(): Record<string, string> {
    const ownInfo = super.getInfo()

    return {
      screenspaceOffset: this.screenCenterOffset.toString(),
      originShift: this.originShift.toString(),
      scale: `${this.renderScale}`,
      mouse: this.mousePosition.toString(),
      ...ownInfo
    }
  }


}
