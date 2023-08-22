import type { Shape, ShapeConfig } from '$lib/Renderer/shape';
import { Circle } from '$lib/Renderer/shapes/circle';
import { Line } from '$lib/Renderer/shapes/line';
import { Vec2, type MaybeVec2 } from '$lib/Renderer/vec2';
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

  previousShape: Shape | undefined
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
    const newShape = createCircle(nodeLocation)
    this.layer.addShape(newShape)

    const node = new Node(this.generateNewId())
    this.nodes.add(node)

    if (this.previousNode) {
      node.connectTo(this.previousNode)
    }
    this.previousNode = node

    if (this.previousShape) {
      const line = Line.Between(
        this.previousShape.position,
        newShape.position
      )

      this.layer.addShape(line)
    }
    this.previousShape = newShape
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
      this.addNode(meta.calculatedPosition) 
    }
  }
}
