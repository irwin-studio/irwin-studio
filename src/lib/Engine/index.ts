import type { IApplication } from '$lib/Application';
import type { Renderer } from '$lib/Renderer';
import { Info } from '$lib/Renderer/info';
import type { ShapeConfig } from '$lib/Renderer/shape';
import { Grid } from '$lib/Renderer/shapes/grid';

type THEMES = 'MAIN_GRID' | 'SECONDARY_GRID' | 'RED_DOT'
const themes: ShapeConfig<THEMES>['themes'] = {
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
  private application: IApplication

  constructor(renderer: Renderer, application: IApplication) {
    super()

    this.application = application
    this.addInfoChild('renderer', renderer)

    this.renderer = renderer
    this.renderer.setShapeRepository(application.shapes)

    this.renderer.addShape(new Grid(20, 20, 20, 20, 'SECONDARY_GRID', { themes }))
    this.renderer.addShape(new Grid(100, 100, 4, 4, 'MAIN_GRID', { themes }))

    // pair events
    this.renderer.onDrag(this.application.handleOnDrag)
    this.renderer.onKeyDown(this.application.handleOnKeyDown)
    this.renderer.onWheel(this.application.handleOnWheel)
    this.renderer.onClick(this.application.handleOnClick)
  }

  start() {
    this.render()
    const request = requestAnimationFrame(() => this.start())
    return () => {
      cancelAnimationFrame(request)
    }
  }

  render() {
    this.renderer.render()
  }
}
