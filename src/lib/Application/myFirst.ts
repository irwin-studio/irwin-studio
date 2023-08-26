import type { ShapeConfig, Shape } from '$lib/Renderer/shape';
import { Vec2, type MaybeVec2 } from '$lib/Renderer/vec2';
import { Circle } from '$lib/shapes/circle';
import { Line } from '$lib/shapes/line';
import { Application } from '.';
import { Node } from './node';

const config: ShapeConfig = {
  parallax: 1,
  stage: 'CANVAS',
  themes: {
    default: {
      strokeColor: 'black',
      fillColor: 'white',
      strokeWidth: 1
    },
    highlight: {
      strokeColor: 'yellow',
      fillColor: 'black',
      strokeWidth: 1
    }
  }
}

function createCircle(position: Vec2) {
  return new Circle(5, position.x, position.y, 'default', config)
}

export class TreeApp extends Application {
  private latestId = 0

  previousNode: Node | undefined

  nodes: Set<Node> = new Set<Node>()
  step = 0;

  constructor() {
    super()
  }

  performNextStep(): void {
    console.log('performNextStep: step', this.step++)
  }

  private generateNewId(): string {
    return String(this.latestId++)
  }

  private addNode(vec2: MaybeVec2) {
    const nodeLocation = Vec2.coerce(vec2)
    
    const node = new Node(this.generateNewId(), nodeLocation)
    this.layer.addShape(node)

    if (this.previousNode) {
      node.connectTo(this.previousNode)
    }
    this.previousNode = node
  }

  getOnDragHandler(): ReturnType<Application['getOnDragHandler']> {
    return ([event, meta]) => {
      // console.log(`application onDrag`, event, meta)
    }
  }

  getOnKeyDownHandler(): ReturnType<Application['getOnKeyDownHandler']> {
    return ([event, meta]) => {
      this.nodes.forEach(node => node)
    }
  }

  getOnWheelHandler(): ReturnType<Application['getOnWheelHandler']> {
    return ([event, meta]) => {
      // console.log(`application onWheel`, event, meta)
    }
  }

  getOnClickHandler(): ReturnType<Application['getOnClickHandler']> {
    return ([event, meta]) => {
      this.addNode(meta.relativePosition) 
    }
  }
}
