export type MaybeVec2 = Vec2 | number | [number, number]

export class Vec2 {
  private _x: number
  get x() {
    return this._x
  }

  private _y: number
  get y() {
    return this._y
  }

  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  static New (x: number, y: number): Vec2 {
    return new Vec2(x, y)
  }

  static coerce(value: MaybeVec2): Vec2 {
    if (Array.isArray(value)) return new Vec2(...value)
    if (value instanceof Vec2) return value.clone()
    if (typeof value === 'number') return new Vec2(value, value);
    throw new Error(`Failed to coerce ${typeof value} to Vec2`)
  }

  add(vec2: MaybeVec2): Vec2 {
    this._x += Vec2.coerce(vec2).x
    this._y += Vec2.coerce(vec2).y
    return this;
  }

  subtract(vec2: MaybeVec2): Vec2 {
    this._x -= Vec2.coerce(vec2).x
    this._y -= Vec2.coerce(vec2).y
    return this;
  }

  multiply(vec2: MaybeVec2): Vec2 {
    this._x *= Vec2.coerce(vec2)._x
    this._y *= Vec2.coerce(vec2)._y
    return this
  }

  modulo(vec2: MaybeVec2): Vec2 {
    this._x %= Vec2.coerce(vec2)._x
    this._y %= Vec2.coerce(vec2)._y
    return this
  }

  divide(vec2: MaybeVec2): Vec2 {
    this._x /= Vec2.coerce(vec2)._x
    this._y /= Vec2.coerce(vec2)._y
    return this
  }

  min(vec2: MaybeVec2): Vec2 {
    this._x = Math.min(this._x, Vec2.coerce(vec2)._x)
    this._y = Math.min(this._y, Vec2.coerce(vec2)._y)
    return this
  }

  max(vec2: MaybeVec2): Vec2 {
    this._x = Math.max(this._x, Vec2.coerce(vec2)._x)
    this._y = Math.max(this._y, Vec2.coerce(vec2)._y)
    return this
  }

  pow(vec2: MaybeVec2): Vec2 {
    this._x = Math.pow(this._x, Vec2.coerce(vec2)._x)
    this._y = Math.pow(this._y, Vec2.coerce(vec2)._y)
    return this
  }

  flip(): Vec2 {
    this._x = this._y
    this._y = this._x
    return this
  }

  moveTo(vec2: MaybeVec2): Vec2 {
    this._x = Vec2.coerce(vec2).x;
    this._y = Vec2.coerce(vec2).y;
    return this;
  }

  moveBy(distance: number, angle: number): Vec2 {
    const alpha = (angle % 360) - 90;
    this._x = this._x + (distance * Math.cos(alpha))
    this._y = this._y + (distance * Math.sin(alpha))
    return this
  }

  map(method: (number: number) => number): Vec2 {
    this._x = method(this._x)
    this._y = method(this._y)
    return this;
  }

  clone(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  toString(): string {
    return `[X: ${this._x}, Y: ${this._y}]`
  }
}
