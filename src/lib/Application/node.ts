import type { RenderMetaData } from '$lib/Renderer';
import type { ShapeConfig } from '$lib/Renderer/shape';
import { Vec2, type MaybeVec2 } from '$lib/Renderer/vec2';
import { Circle } from '$lib/shapes/circle';
import { Line } from '$lib/shapes/line';

const NODE_SIZE = 20;

export class Node extends Circle {
  private connectionsFrom: Set<string> = new Set<string>()
  private connectionsTo: Set<string> = new Set<string>()

  lines: Map<Node, Line>

  id: string;

  constructor(id: string, position: MaybeVec2, config: ShapeConfig) {
    super(
      NODE_SIZE,
      Vec2.coerce(position).x,
      Vec2.coerce(position).y,
      'default',
      config
    )

    this.id = id;
    this.lines = new Map<Node, Line>()
  }

  connectTo(node: Node) {
    node.connectionsFrom.add(this.id)
    this.connectionsTo.add(node.id)
    const line = this.lines.get(node) ?? Line.Between(this.position, node.position, this.theme, this.config)
    this.lines.set(node, line)
  }

  draw(context: CanvasRenderingContext2D, metadata: RenderMetaData): void {
    this.lines.forEach(line => {
      line.draw(context, metadata)
    })

    super.draw(context, metadata)

    context.beginPath()
    const fontSize = 20 * metadata.scale
    context.font = `${fontSize}px sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.strokeText(
      this.id,
      metadata.relativePosition.x,
      metadata.relativePosition.y,
    );
  }

  isWithin(vec2: Vec2): boolean {
    return super.isWithin(vec2)
  }

}
