import { Vec2, type MaybeVec2 } from './vec2';
import { onMouseDrag } from '$lib/util/onMouseDrag';
import { Info } from './info';
import { onWheel } from '$lib/util/onWheel';
import { onKey, type OnKeyMeta } from '$lib/util/onKey';
import { onMouseMove } from '$lib/util/onMouseMove';
import type { Layer } from './layer';
import { onClick } from '$lib/util/onClick';
import type { Shape } from './shape';

export type Handler<I = never, O = void> = (input: I) => O
const FPS_AVG_OVER = 50

function runCallbacks<Args extends any[]>(callbacks: Set<(...args: Args) => void>) {
  return (...args: Args) => {
    callbacks.forEach(cb => cb(...args))
  }
}

export interface RenderMetaData {
  relativePosition: Vec2;
  absolutePosition: Vec2;
  scale: number;
  canvasSize: Vec2
}

export interface EventMetaData {
  relativePosition: Vec2
  absolutePosition: Vec2
}

export class Renderer extends Info {
  private _cleanups: Set<() => void> = new Set()

  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  
  layers: Set<Layer> = new Set<Layer>();

  private _renderTimes: number[] = new Array(FPS_AVG_OVER).fill(0)

  /** Every coordinate must add this number to center itself on the canvas  */
  private _screenCenterOffset: Vec2 = new Vec2(0, 0)

  setScreenOffset(vec2: MaybeVec2) {
    this._screenCenterOffset.moveTo(vec2)
  }

  getScreenOffset(): Vec2 {
    return this._screenCenterOffset.clone()
  }

  get canvasSize(): Vec2 {
    return new Vec2(this.canvas.width, this.canvas.height)
  }

  /** The X and Y distance of the origin from the center of the screen */
  private _originShift: Vec2

  moveOriginTo(vec2: MaybeVec2) {
    this._originShift.moveTo(vec2);
  }

  moveOriginBy(width: number, height: number) {
    this._originShift.add(new Vec2(width, height));
  }

  getOriginShift(): Vec2 {
    return this._originShift.clone()
  }

  /** default = 1 */
  renderScale: number = 1
  mousePosition: Vec2 = new Vec2(0, 0)

  callbacks = {
    onClick: new Set<Handler<[MouseEvent, EventMetaData]>>(),
    onDrag: new Set<Handler<[MouseEvent, EventMetaData]>>(),
    onKeyDown: new Set<Handler<[KeyboardEvent, EventMetaData & OnKeyMeta]>>(),
    onWheel: new Set<Handler<[MouseEvent, EventMetaData]>>(),
    onMouseMove: new Set<Handler<[MouseEvent, EventMetaData]>>(),
  }

  constructor(canvas: HTMLCanvasElement) {
    super()

    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error("Failed to create Renderer - could not get a 2d context")
    }

    this.canvas = canvas;
    this.context = context;
    this._originShift = new Vec2(0, 0)
    this.registerHandlers()
  }

  private registerHandlers() {
    let cancelNext = false;

    const moveOriginOnDrag = (event: MouseEvent) => {
      cancelNext = true
      const pos = this.scaleAbsolutePosition(new Vec2(event.movementX, event.movementY))
      this.moveOriginBy(pos.x, pos.y);
    }

    const updateCursorPos = (event: MouseEvent) => {
      this.addInfo("mouse", new Vec2(event.clientX, event.clientY).toString())
    }

    const handleZoom = (event: WheelEvent) => {
      event.stopPropagation()
      event.stopImmediatePropagation()
      event.preventDefault()

      const mouse = new Vec2(event.clientX, event.clientY)
      const screenSpaceStart = this.screenSpaceToCanvas(mouse)

      const scaleRate = 0.5
      const delta = -(event.deltaY / Math.abs(event.deltaY))
      this.renderScale = this.renderScale + (delta * (this.renderScale * scaleRate))
      this.renderScale = Math.max(this.renderScale, 0.01)

      const screenSpaceEnd = this.screenSpaceToCanvas(mouse)

      const diff = screenSpaceEnd.subtract(screenSpaceStart)
      this.moveOriginBy(diff.x, diff.y)
    }

    [
      onMouseDrag(this.canvas, moveOriginOnDrag),
      onMouseMove(updateCursorPos),
      onWheel(this.canvas, handleZoom),

      onClick(this.canvas, (event: MouseEvent) => {
        if (cancelNext) {
          cancelNext = false
          return
        };
  
        if (event.ctrlKey) {
          this.moveOriginTo([0, 0])
          return
        }

        const meta = this.getEventMeta([event.clientX, event.clientY])
        runCallbacks(this.callbacks.onClick)([event, meta])
      }),
      onMouseDrag(this.canvas, (event: MouseEvent) => {
        const meta = this.getEventMeta([event.clientX, event.clientY])
        runCallbacks(this.callbacks.onDrag)([event, meta])
      }),
      onKey(/.*/, (event: KeyboardEvent, keyEventMeta) => {
        const meta = this.getEventMeta(this.mousePosition)
        runCallbacks(this.callbacks.onKeyDown)([event, {
          ...meta,
          ...keyEventMeta
        }])
      }, 'EITHER'),
      onWheel(this.canvas, (event: MouseEvent) => {
        const meta = this.getEventMeta([event.clientX, event.clientY])
        runCallbacks(this.callbacks.onWheel)([event, meta])
      }),
      onMouseMove((event) => {
        const meta = this.getEventMeta([event.clientX, event.clientY])
        runCallbacks(this.callbacks.onMouseMove)([event, meta])
      })
    ].forEach(cb => this._cleanups.add(cb))
  }

  tearDown() {
    // console.log('tearing down')
    this._cleanups.forEach(cb => cb())

    this.callbacks.onClick.clear()
    this.callbacks.onDrag.clear()
    this.callbacks.onKeyDown.clear()
    this.callbacks.onWheel.clear()
  }

  /**
   * CONFIG
   */
  addLayer(byoLayer: Layer) {
    const newLayer = byoLayer
    this.layers.add(newLayer)
    return () => this.removeLayer(newLayer)
  }

  removeLayer(layer: Layer) {
    this.layers.delete(layer)
  }

  setRenderScale(scale: number) {
    this.renderScale = scale
  }

  /**
   * ACTIONS
   */

  render() {
    this._renderTimes.push(performance.now())
    this._renderTimes.shift()

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

    const sorted = this.sortShapes()
    sorted.forEach(shape => {
      const meta = this.getRenderMeta(shape.position)
      shape.draw(this.context, meta)
    })
  }

  sortShapes(): Shape[] {
    const allShapes = [...this.layers].map(layer => ([...layer.getShapes()])).flat()
    const orderShapes = (shapeA: Shape, shapeB: Shape) => {
      return (shapeA.config.renderLayer ?? 1) - (shapeB.config.renderLayer ?? 1)
    }

    return allShapes.sort(orderShapes)
  }

  /**
   * UTIL
   */

  /** scales and transaltes the given screen coordinates */
  translateRelativePosition(vec2: MaybeVec2): Vec2 {
    const start = Vec2.coerce(vec2)
    return start.clone()
      .add(this._originShift.clone())
      .add(this._screenCenterOffset.clone().divide(this.renderScale))
  }

  translateAbsolutePosition(vec2: MaybeVec2): Vec2 {
    return Vec2.coerce(vec2)
      .subtract(this._originShift)
      .subtract(this._screenCenterOffset.clone().divide(this.renderScale))
  }

  scaleRelativePosition(vec2: MaybeVec2): Vec2 {
    return Vec2.coerce(vec2)
      .multiply(this.renderScale)
  }

  scaleAbsolutePosition(vec2: MaybeVec2): Vec2 {
    return Vec2.coerce(vec2).divide(this.renderScale)
  }

  screenSpaceToCanvas(vec2: MaybeVec2) {
    return this.translateAbsolutePosition(this.scaleAbsolutePosition(vec2))
  }

  canvasToScreenspace(vec2: MaybeVec2) {
    const start = Vec2.coerce(vec2)
    return this.scaleRelativePosition(this.translateRelativePosition(start))
  }

  private getRenderMeta(position: Vec2): RenderMetaData {
    return {
      canvasSize: this.canvasSize,
      scale: this.renderScale,
      relativePosition: this.scaleRelativePosition(this.translateRelativePosition(position)),
      absolutePosition: position,
    }
  }

  private getEventMeta(position: MaybeVec2): EventMetaData {
    return {
      relativePosition: this.screenSpaceToCanvas(Vec2.coerce(position)),
      absolutePosition: Vec2.coerce(position),
    }
  }

  getInfo(): Record<string, string> {
    const ownInfo = super.getInfo()

    return {
      screenspaceOffset: this._screenCenterOffset.toString(),
      originShift: this._originShift.toString(),
      scale: `${this.renderScale}`,
      mouse: this.mousePosition.toString(),
      fps: this.getFps(),
      ...ownInfo
    }
  }

  getFps(): number {
    const nonZero = this._renderTimes.filter(v => v !== 0)
    const diffs = nonZero.map((newest, index) => {
      const older = nonZero[index + 1] ?? newest
      return older - newest
    })

    const diffTotal = diffs.reduce((acc, a) => acc + a, 0)
    const avgDiff = diffTotal / nonZero.length

    const diff = avgDiff
    const jitter = 100
    const unrounded = 1000 / diff
    return Math.round(unrounded * jitter) / jitter ;
  }

  /**
   * HANDLER REGISTERS
   */

  onClick(handler: Handler<[MouseEvent, EventMetaData]>) {
    this.callbacks.onClick.add(handler)
    return () => this.callbacks.onClick.delete(handler)
  }

  onDrag(handler: Handler<[MouseEvent, EventMetaData]>) {
    this.callbacks.onDrag.add(handler)
    return () => this.callbacks.onDrag.delete(handler)
  }

  onKeyDown(handler: Handler<[KeyboardEvent, EventMetaData & OnKeyMeta]>) {
    this.callbacks.onKeyDown.add(handler)
    return () => this.callbacks.onKeyDown.delete(handler)
  }

  onWheel(handler: Handler<[MouseEvent, EventMetaData]>) {
    this.callbacks.onWheel.add(handler)
    return () => this.callbacks.onWheel.delete(handler)
  }

  onMouseMove(handler: Handler<[MouseEvent, EventMetaData]>) {
    this.callbacks.onMouseMove.add(handler)
    return () => this.callbacks.onMouseMove.delete(handler)
  }
}
