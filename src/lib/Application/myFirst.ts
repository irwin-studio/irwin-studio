import { Circle } from '$lib/Renderer/shapes/circle';
import { Application, type IApplication } from '.';


export class MyFirstApplication extends Application implements IApplication {
  // nodes: Set<GraphicNode> = new Set<GraphicNode>()

  constructor() {
    super()
    this.shapes.add(new Circle(3, 0, 0, 'default', { parallax: 1 }))
  }

  private addNode() {

  }

  handleOnDrag = ([event, meta]) => {
    const handle = (a: any, b: any) => {}
    handle(event, meta)
  }

  handleOnKeyDown = ([event, meta]) => {
    const handle = (a: any, b: any) => {}
    handle(event, meta)
  }

  handleOnWheel = ([event, meta]) => {
    const handle = (a: any, b: any) => {}
    handle(event, meta)
  }

  handleOnClick = ([event, meta]) => {
    const handle = (a: any, b: any) => {}
    handle(event, meta)
  }

  performNextStep(): void {
    throw new Error('Method not implemented.');
  }
}
