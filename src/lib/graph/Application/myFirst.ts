import type { ShapeConfig } from '$lib/graph/Renderer/shape';
import { Vec2, type MaybeVec2 } from '$lib/graph/Renderer/vec2';
import { Line } from '$lib/graph/shapes/line';
import { Application } from '.';
import { Node } from './node';

const config: ShapeConfig = {
  themes: {
    default: {
      fillColor: "white",
      strokeColor: "black",
      strokeWidth: 2,
    },
    highlighted: {
      fillColor: "lightgreen",
      strokeColor: "darkgreen",
      strokeWidth: 2,
    },
    invisible: {
      fillColor: "transparent",
      strokeColor: "transparent",
      strokeWidth: 0,
    },
    template_line: {
      fillColor: "red",
      strokeColor: "red",
      strokeWidth: 2,
    }
  }
}

export class TreeApp extends Application {
  private latestId = 0
  private lastMousePos = new Vec2(0,0)
  private adding = false

  templateLine: Line;
  hoveredNode: Node | undefined;
  selectedNode: Node | undefined;
  nodes: Set<Node> = new Set<Node>()
  step = 0;

  constructor() {
    super()

    this.templateLine = new Line(new Vec2(0, 0), 0, 0, 'invisible', config)
    this.layer.addShape(this.templateLine)
    this.templateLine.setTheme('invisible')

    this.addNode(new Vec2(0,0))
    this.addNode(new Vec2(0,100))
    this.addNode(new Vec2(0,200))
    this.addNode(new Vec2(0,-100))
    this.addNode(new Vec2(0,-200))
    this.addNode(new Vec2(100, 0))
    this.addNode(new Vec2(200, 0))
    this.addNode(new Vec2(-100, 0))
    this.addNode(new Vec2(-200, 0))
  }

  performNextStep(): void {
    console.log('performNextStep: step', this.step++)
  }

  private generateNewId(): string {
    return String(this.latestId++)
  }

  private addNode(vec2: MaybeVec2): Node {
    const nodeLocation = Vec2.coerce(vec2)
    
    const node = new Node(this.generateNewId(), nodeLocation, config)
    this.layer.addShape(node)
    this.nodes.add(node)
    return node;
  }

  private onNodeClick(node: Node) {
    if (this.selectedNode) {
      if (this.adding) {
        this.selectedNode.connectTo(node)
      }

      this.selectNode(node)
    } else {
      this.selectNode(node)
    }
  }

  private onNodeHover(node: Node | undefined) {
    if (this.hoveredNode === node) return
    if (this.hoveredNode && this.hoveredNode !== this.selectedNode) {
      this.hoveredNode.setTheme('default')
      this.hoveredNode = undefined
    }

    if (!node) return
    this.hoveredNode = node
    node.setTheme('highlighted')
  }

  private getNodeAt(vec2: MaybeVec2): Node | undefined {
    return [...this.nodes].reverse().find(node => node.isWithin(Vec2.coerce(vec2)))
  }

  selectNode(node: Node) {
    if (!this.nodes.has(node)) return

    if (this.selectedNode) {
      this.deselectNode()
    }

    this.selectedNode = node
    this.templateLine.setPos(node.position)
    this.templateLine.pointTo(this.lastMousePos)
    node.setTheme('highlighted')
  }

  deselectNode(node: Node | undefined = this.selectedNode) {
    if (!node) return
    if (this.nodes.has(node)) {
      this.selectedNode = undefined
      node.setTheme('default')
    }
  }

  getOnDragHandler(): ReturnType<Application['getOnDragHandler']> {
    return ([event, meta]) => {
      // console.log(`application onDrag`, event, meta)
    }
  }

  getOnKeyDownHandler(): ReturnType<Application['getOnKeyDownHandler']> {
    return ([event, meta]) => {
      const show = !!this.selectedNode && meta.direction === 'DOWN' && event.key === "Shift"
      this.templateLine.setTheme(show ? "template_line" : "invisible")
      this.adding = show;

      if (event.key === "Escape") {
        this.deselectNode()
      }
    }
  }

  getOnWheelHandler(): ReturnType<Application['getOnWheelHandler']> {
    return ([event, meta]) => {
      // console.log(`application onWheel`, event, meta)
    }
  }

  getOnMouseMoveHandler(): ReturnType<Application['getOnWheelHandler']> {
    return ([event, meta]) => {
      this.lastMousePos = meta.relativePosition;
      this.templateLine.pointTo(meta.relativePosition)
      this.onNodeHover(this.getNodeAt(meta.relativePosition))
    } 
  }

  getOnClickHandler(): ReturnType<Application['getOnClickHandler']> {
    return ([event, meta]) => {
      const clicked = this.getNodeAt(meta.relativePosition)
      if (clicked) {
          this.onNodeClick(clicked)
      } else {
        if (!this.adding) {
          if (!this.selectedNode) this.addNode(meta.relativePosition)
          this.deselectNode()
        }
      }
    }
  }
}
