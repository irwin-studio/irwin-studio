import { Vec2, type MaybeVec2 } from './vec2';
import { onMouseDrag } from '$lib/util/onMouseDrag';
import { Info } from './info';
import { onWheel } from '$lib/util/onWheel';
import { onKey } from '$lib/util/onKey';
import { onMouseMove } from '$lib/util/onMouseMove';
import { Circle } from '$lib/shapes/circle';
import type { Layer } from './layer';

export type Handler<I = never, O = void> = (input: I) => O
export type CoorindateContext = 'SCREEN' | 'CANVAS'

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
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  
  layers: Set<Layer> = new Set<Layer>();

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
    onKeyDown: new Set<Handler<[KeyboardEvent, EventMetaData]>>(),
    onWheel: new Set<Handler<[MouseEvent, EventMetaData]>>(),
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

    this.canvas.addEventListener('click', (event: MouseEvent) => {
      if (cancelNext) {
        cancelNext = false
        return
      };

      if (event.ctrlKey) {
        this.moveOriginTo([0, 0])
        return
      }

      const meta = this.getEventMeta(new Vec2(event.clientX, event.clientY))
      this.callbacks.onClick.forEach(callback => {
        callback([event, meta])
      })
    })

    onMouseDrag(this.canvas, (event) => {
      cancelNext = true
      const pos = this.scaleAbsolutePosition(new Vec2(event.movementX, event.movementY))
      this.moveOriginBy(pos.x, pos.y);
    })

    onMouseDrag(this.canvas, (event: MouseEvent) => {
      const meta = this.getEventMeta(new Vec2(event.clientX, event.clientY))
      this.callbacks.onDrag.forEach(callback => {
        callback([event, meta])
      })
    })

    onMouseMove((event) => {
      this.addInfo("mouse", new Vec2(event.clientX, event.clientY).toString())
    })

    onKey(/.*/, (event: KeyboardEvent) => {
      const meta = this.getEventMeta(this.mousePosition)
      this.callbacks.onKeyDown.forEach(callback => {
        callback([event, meta])
      })
    }, 'DOWN')

    onWheel(this.canvas, (event: MouseEvent) => {
      const meta = this.getEventMeta(this.mousePosition)
      this.callbacks.onWheel.forEach(callback => {
        callback([event, meta])
      })
    });

    onWheel(this.canvas, async (event) => {
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
    })
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
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.layers.forEach(layer => {
      layer.getShapes().forEach(shape => {
        const meta = this.getRenderMeta(shape.position, shape.config.parallax)
        shape.draw(this.context, meta)
      })
    })
  }

  /**
   * UTIL
   */

  /** scales and transaltes the given screen coordinates */
  // translateRelativePosition(vec2: MaybeVec2, parallax = 1): Vec2 {
  //   return Vec2.coerce(vec2)
  //     .add(this._originShift)
  //     .add(this._screenCenterOffset)
  // }

  /** scales and transaltes the given screen coordinates */
  translateRelativePosition(vec2: MaybeVec2, parallax = 1): Vec2 {
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

  scaleRelativePosition(vec2: MaybeVec2, parallax = 1): Vec2 {
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

  private getRenderMeta(position: Vec2, parallax: number = 1): RenderMetaData {
    return {
      canvasSize: this.canvasSize,
      scale: this.renderScale,
      relativePosition: this.scaleRelativePosition(this.translateRelativePosition(position, parallax), parallax),
      absolutePosition: position,
    }
  }

  private getEventMeta(position: Vec2): EventMetaData {
    return {
      relativePosition: this.screenSpaceToCanvas(position),
      absolutePosition: position,
    }
  }

  getInfo(): Record<string, string> {
    const ownInfo = super.getInfo()

    return {
      canvasToScreen: this.canvasToScreenspace([0,0]).toString(),
      screenspaceOffset: this._screenCenterOffset.toString(),
      originShift: this._originShift.toString(),
      scale: `${this.renderScale}`,
      mouse: this.mousePosition.toString(),
      ...ownInfo
    }
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

  onKeyDown(handler: Handler<[KeyboardEvent, EventMetaData]>) {
    this.callbacks.onKeyDown.add(handler)
    return () => this.callbacks.onKeyDown.delete(handler)
  }

  onWheel(handler: Handler<[MouseEvent, EventMetaData]>) {
    this.callbacks.onWheel.add(handler)
    return () => this.callbacks.onWheel.delete(handler)
  }
}
