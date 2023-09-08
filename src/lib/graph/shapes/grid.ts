import { Shape, type ShapeConfig } from '$lib/graph/Renderer/shape'
import { Vec2 } from '$lib/graph/Renderer/vec2'
import type { RenderMetaData } from '../Renderer'

function getLinePosition(index: number, cellSize: Vec2, relativePosition: Vec2, canvasSize: Vec2, axis: 'x' | 'y') {
  const start = index * cellSize[axis]
  const absolute = start + (relativePosition[axis] % cellSize[axis])
  const wrapped = absolute % (canvasSize[axis] + 1)
  return wrapped - (wrapped % absolute)
}

export class Grid<UStates extends string> extends Shape {
  constructor(
    public cellWidth: number,
    public cellHeight: number,
    public maxX: number | undefined = undefined,
    public maxY: number | undefined = undefined,
    state?: UStates,
    config?: ShapeConfig
  ) {
    super(new Vec2(0, 0), state, config)
  }

  draw(ctx: CanvasRenderingContext2D, meta: RenderMetaData): void {
    const style = this.getStyle()
    if (!style) return;

    const scalledCellSize = new Vec2(
      Math.abs(this.cellWidth * meta.scale),
      Math.abs(this.cellHeight * meta.scale)
    )

    const lineCounts = meta.canvasSize.clone().divide(scalledCellSize).map(Math.ceil)

    // calculate the min/max points (top left, bottom right) of the graph
    const maxLineCount = new Vec2(this.maxX ?? Infinity, this.maxY ?? Infinity)
    const maxDistanceFromOrigin = maxLineCount.clone().multiply(scalledCellSize)

    // the min and max points (outside canvas)
    const pos = meta.relativePosition
    const minPoint = pos.clone().subtract(maxDistanceFromOrigin).subtract(1)
    const maxPoint = pos.clone().add(maxDistanceFromOrigin).add(1)

    // Max lines defaults to Infinity when undefined, and the canvas does not like Infinite values
    // so we clamp them to the screen's borders
    const drawableMin = minPoint.clone().max(0)
    const drawableMax = maxPoint.clone().min([meta.canvasSize.x, meta.canvasSize.y])

    // generate and filter all visible y values
    const yValues: number[] = Array.from({ length: lineCounts.y })
      .map((_, index) => getLinePosition(index, scalledCellSize, pos, meta.canvasSize, 'y'))
      .filter(y => y > minPoint.y && y < maxPoint.y)

    // generate and filter all visible x values
    const xValues: number[] = Array.from({ length: lineCounts.x })
      .map((_, index) => getLinePosition(index, scalledCellSize, pos, meta.canvasSize, 'x'))
      .filter(x => x > minPoint.x && x < maxPoint.x)

    const xCoords = xValues.map(x => ([
      new Vec2(x, drawableMin.y),
      new Vec2(x, drawableMax.y)
    ]))

    const yCoords = yValues.map(y => ([
      new Vec2(drawableMin.x, y),
      new Vec2(drawableMax.x, y)
    ]));

    const allCoords = [...xCoords, ...yCoords]
    allCoords.forEach(([start, end]) => {
      ctx.beginPath();

      // set styles
      ctx.strokeStyle = style.strokeColor
      ctx.fillStyle = style.fillColor
      ctx.lineWidth = style.strokeWidth

      // draw
      ctx.lineTo(start.x, start.y)
      ctx.lineTo(end.x, end.y)

      // apply
      ctx.fill()
      ctx.stroke();
      ctx.closePath()
    })
  }

  isWithin(): boolean {
    return false;
  }
}
