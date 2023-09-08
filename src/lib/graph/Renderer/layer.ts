import type { Shape } from './shape';

export class Layer {
  _shapes: Set<Shape> = new Set<Shape>()

  constructor(...shapes: Shape[]) {
    this.addShape(...shapes)
  }

  addShape(...shapes: Shape[]) {
    shapes.forEach((shape) => this._shapes.add(shape))
    return () => {
      shapes.forEach((shape) => this._shapes.delete(shape))
    }
  }

  removeShape(shape: Shape) {
    this._shapes.delete(shape)
  }

  getShapes(): Set<Shape> {
    return new Set(this._shapes)
  }
}
