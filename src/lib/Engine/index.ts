import type { Application } from '$lib/Application';
import type { Renderer } from '$lib/Renderer';
import { Info } from '$lib/Renderer/info';
import { Layer } from '$lib/Renderer/layer';
import type { ShapeConfig } from '$lib/Renderer/shape';
import { Grid } from '$lib/shapes/grid';

const themes: ShapeConfig['themes'] = {
  default: {
    strokeWidth: 1,
    fillColor: 'blue',
    strokeColor: 'lightgrey'
  },
  MAIN_GRID: {
    strokeWidth: 1,
    fillColor: 'black',
    strokeColor: 'black'
  },
  SECONDARY_GRID: {
    strokeWidth: 1,
    fillColor: 'lightgrey',
    strokeColor: 'lightgrey'
  },
  RED_DOT: {
    strokeWidth: 1,
    fillColor: 'blue',
    strokeColor: 'lightgrey'
  }
}

export class Engine extends Info {
  private renderer: Renderer;
  private application: Application
  private baseLayer = new Layer()
  private _request: number | undefined;

  private cleanups: Set<() => void> = new Set<() => void>()

  constructor(renderer: Renderer, application: Application) {
    super()

    this.application = application
    this.addInfoChild('renderer', renderer)

    this.renderer = renderer
    this.renderer.addLayer(this.baseLayer)
    this.renderer.addLayer(this.application.layer)

    this.baseLayer.addShape(new Grid(20, 20, undefined, undefined, 'SECONDARY_GRID', { themes }))
    // this.baseLayer.addShape(new Grid(100, 100, 4, 4, 'MAIN_GRID', { themes }))

    // pair events
    ;[
      this.renderer.onDrag(this.application.getOnDragHandler()),
      this.renderer.onKeyDown(this.application.getOnKeyDownHandler()),
      this.renderer.onWheel(this.application.getOnWheelHandler()),
      this.renderer.onClick(this.application.getOnClickHandler()),
      this.renderer.onMouseMove(this.application.getOnMouseMoveHandler()),
    ].forEach(callback => this.cleanups.add(callback))
  }

  start() {
    if (this._request) {
      cancelAnimationFrame(this._request)
      this._request = undefined;
    }

    this.render()
    const request = requestAnimationFrame(() => this.start())
    this._request = request

    return this.stop.bind(this)
  }

  stop() {
    if (this._request) {
      cancelAnimationFrame(this._request)
      this._request = undefined;
    }

    this.cleanups.forEach(cb => cb())
    this.renderer.tearDown()
  }

  render() {
    this.renderer.render()
  }
}
