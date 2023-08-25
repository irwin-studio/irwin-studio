import type { RendererCanvasMetaData } from '..';
import { Shape } from '../shape';
import { Vec2 } from '../vec2';

export class Line extends Shape {
  private degrees
  private distance

  constructor(startingPoint: Vec2, degrees: number, length: number) {
    super(startingPoint, 'h', {
      themes: {
        h: {
          fillColor: 'red',
          strokeColor: "purple",
          strokeWidth: 2
        }
      }
    })

    this.degrees = degrees
    this.distance = length
  }

  public static Between(firstPoint: Vec2, secondPoint: Vec2): Line {
    const diff = firstPoint.clone()
      .subtract(secondPoint)

    const rad = Math.atan2(diff.x, -diff.y)
    const degrees = rad * (180 / Math.PI)
    const distance = Math.sqrt(Math.pow(diff.x, 2) + Math.pow(diff.y, 2))
    return new Line(firstPoint, degrees + 90, distance)
  }

  draw(ctx: CanvasRenderingContext2D, meta: RendererCanvasMetaData): void {
    const style = this.getStyle()
    if (!style) return;

    // ctx.beginPath();

    // // set styles
    // ctx.strokeStyle = style.strokeColor;
    // ctx.fillStyle = style.fillColor;
    // ctx.lineWidth = style.strokeWidth

    // // draw
    // const radius = Math.abs(meta.scale * this.length)
    // ctx.arc(meta.calculatedPosition.x, meta.calculatedPosition.y, 10, 0, 2 * Math.PI);

    // apply
    ctx.fill()
    ctx.stroke()
    ctx.closePath()

    ctx.beginPath();

    // set styles
    ctx.strokeStyle = style.strokeColor
    ctx.fillStyle = style.fillColor
    ctx.lineWidth = style.strokeWidth

    // draw
    const angle = (Math.PI / 180) * this.degrees
    const distance = this.distance
    const translation = new Vec2(Math.cos(angle),Math.sin(angle))
      .multiply(distance)
      .multiply(meta.scale)

    const destination = meta.calculatedPosition.clone().add(translation)
    ctx.lineTo(meta.calculatedPosition.x, meta.calculatedPosition.y)
    ctx.lineTo(destination.x, destination.y)

    // apply
    ctx.fill()
    ctx.stroke();
    ctx.closePath()
  }

}
