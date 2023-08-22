import type { RendererCanvasMetaData } from '..';
import { Shape, type ShapeConfig } from '../shape';
import { Vec2 } from '../vec2';

export class Circle extends Shape {
  radius: number;

  constructor(radius: number, x: number, y: number, state?: string, config?: ShapeConfig) {
    super(new Vec2(x, y), state, config)
    this.radius = radius;
  }

  draw(ctx: CanvasRenderingContext2D, meta: RendererCanvasMetaData): void {
    const style = this.getStyle()
    if (!style) return;

    ctx.beginPath();

    // set styles
    ctx.strokeStyle = style.strokeColor;
    ctx.fillStyle = style.fillColor;
    ctx.lineWidth = style.strokeWidth

    // draw
    const radius = Math.abs(meta.scale * this.radius)
    ctx.arc(meta.calculatedPosition.x, meta.calculatedPosition.y, radius, 0, 2 * Math.PI);

    // apply
    ctx.fill()
    ctx.stroke()
    ctx.closePath()
  }
}
