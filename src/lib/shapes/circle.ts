import type { RenderMetaData } from '$lib/Renderer';
import { Shape, type ShapeConfig } from '$lib/Renderer/shape';
import { Vec2 } from '$lib/Renderer/vec2';

export class Circle extends Shape implements Shape {
  radius: number;

  constructor(radius: number, x: number, y: number, state?: string, config?: ShapeConfig) {
    super(new Vec2(x, y), state, config)
    this.radius = radius;
  }

  draw(ctx: CanvasRenderingContext2D, meta: RenderMetaData): void {
    const style = this.getStyle()
    if (!style) return;
    const radius = Math.abs(meta.scale * this.radius)
    
    // set styles
    ctx.beginPath();
    ctx.strokeStyle = style.strokeColor
    ctx.fillStyle = style.fillColor
    ctx.lineWidth = style.strokeWidth

    const pos = meta.relativePosition
    ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);

    ctx.fill()
    ctx.stroke()
    ctx.closePath()
  }

  isWithin(vec2: Vec2): boolean {
    const diff = this.position.clone().subtract(vec2).map(Math.abs)
    const distance = Math.sqrt(Math.pow(diff.x, 2) + Math.pow(diff.y, 2))
    return distance < this.radius
  }
}
