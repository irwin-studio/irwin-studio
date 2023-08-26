import type { RenderMetaData } from '$lib/Renderer';
import { Shape } from '$lib/Renderer/shape';
import type { MaybeVec2 } from '$lib/Renderer/vec2';
import { Circle } from '$lib/shapes/circle';
import { Line } from '$lib/shapes/line';

export class Node extends Shape {
  private connectionsFrom: Set<string> = new Set<string>()
  private connectionsTo: Set<string> = new Set<string>()

  lines: Map<Node, Line>

  id: string;

  constructor(id: string, position: MaybeVec2) {
    super(position, 'default')
    this.id = id;
    this.lines = new Map<Node, Line>()
  }

  connectTo(node: Node) {
    node.connectionsFrom.add(this.id)
    this.connectionsTo.add(node.id)
    const line = this.lines.get(node) ?? Line.Between(this.position, node.position)
    this.lines.set(node, line)
  }

  draw(context: CanvasRenderingContext2D, metadata: RenderMetaData): void {
    new Circle(5, this.position.x, this.position.y).draw(context, metadata)
    this.lines.forEach(line => {
      line.draw(context, metadata)
    })
  }
}
