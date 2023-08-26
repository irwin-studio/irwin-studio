import type { RenderMetaData } from '$lib/Renderer'
import { Shape, type ShapeConfig } from '$lib/Renderer/shape'
import { Vec2, type MaybeVec2 } from '$lib/Renderer/vec2'

export class Line extends Shape {
  private degrees
  private distance

  constructor(startingPoint: Vec2, degrees: number, length: number, theme: string, config: ShapeConfig) {
    super(startingPoint, theme, config)

    this.degrees = degrees
    this.distance = length
  }

  public static Between(firstPoint: Vec2, secondPoint: Vec2, theme: string, config: ShapeConfig): Line {
    const diff = firstPoint.clone()
      .subtract(secondPoint)

    const rad = Math.atan2(diff.x, -diff.y)
    const degrees = rad * (180 / Math.PI)
    const distance = Math.sqrt(Math.pow(diff.x, 2) + Math.pow(diff.y, 2))
    return new Line(firstPoint, degrees + 90, distance, theme, config)
  }

  pointTo(vec2: MaybeVec2) {
    const lineTo = Line.Between(this.position, Vec2.coerce(vec2), this.theme, this.config)
    this.distance = lineTo.distance
    this.degrees = lineTo.degrees
  }

  draw(ctx: CanvasRenderingContext2D, meta: RenderMetaData): void {
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

    const destination = meta.relativePosition.clone().add(translation)
    ctx.lineTo(meta.relativePosition.x, meta.relativePosition.y)
    ctx.lineTo(destination.x, destination.y)

    // apply
    ctx.fill()
    ctx.stroke();
    ctx.closePath()
  }

  isWithin(vec2: Vec2): boolean {
    return false
  }

}
