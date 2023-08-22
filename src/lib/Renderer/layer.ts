import type { Shape } from './shape';

export class Layer {
  _shapes: Set<Shape> = new Set<Shape>()

  constructor() {
    //
  }

  addShape(shape: Shape) {
    this._shapes.add(shape)
    return () => this._shapes.delete(shape)
  }

  removeShape(shape: Shape) {
    this._shapes.delete(shape)
  }

  getShapes(): Set<Shape> {
    return new Set(this._shapes)
  }
}
