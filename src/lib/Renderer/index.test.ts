// sum.test.js
import { describe, it, expect } from 'vitest'
import { Renderer } from '.'
import { Vec2 } from './vec2'
import { Layer } from './layer'

const SHARED_CANVAS = document.createElement('canvas')

describe('Renderxer', () => {
  const createRender = () => {
    return new Renderer(SHARED_CANVAS)
  }

  describe('addLayer', () => {
    it("should add given layer to the renderer", () => {
      const renderer = createRender()
      const layer = new Layer()
      expect(renderer.layers.has(layer)).toBeFalsy()
      renderer.addLayer(layer)
      expect(renderer.layers.has(layer)).toBeTruthy()
    })

    it("should return function that removes layer from renderer", () => {
      const renderer = createRender()
      const layer = new Layer()

      expect(renderer.layers.has(layer)).toBeFalsy()

      const remove = renderer.addLayer(layer)
      expect(renderer.layers.has(layer)).toBeTruthy()

      remove()
      expect(renderer.layers.has(layer)).toBeFalsy()
    })
  })

  describe("removeLayer", () => {
    it("should remove the given layer", () => {
      const renderer = createRender()
      const layer = new Layer()

      renderer.addLayer(layer)
      expect(renderer.layers.has(layer)).toBeTruthy()

      renderer.removeLayer(layer)
      expect(renderer.layers.has(layer)).toBeFalsy()
    })
  })

  describe('setRenderScale', () => {
    it("should set the render scale", () => {
      const renderer = createRender()
      const current = renderer.renderScale;
      renderer.setRenderScale(current + 5)
      expect(renderer.renderScale).toEqual(current + 5)
    })
  })

  describe.todo("render")

  describe("moveOriginBy", () => {
    it("should move the origin to the given location", () => {
      const renderer = createRender()

      renderer.moveOriginBy(100, 1000)
      expect(renderer.getOriginShift()).toEqualVec2([100, 1000])

      renderer.moveOriginBy(-200, -2000)
      expect(renderer.getOriginShift()).toEqualVec2([-100, -1000])
    })
  })

  describe("moveOriginTo", () => {
    it("should move the origin to the given location", () => {
      const renderer = createRender()

      renderer.moveOriginTo([100, 1000])
      expect(renderer.getOriginShift()).toEqualVec2([100, 1000])

      renderer.moveOriginTo([-200, -2000])
      expect(renderer.getOriginShift()).toEqualVec2([-200, -2000])
    })
  })

  describe("translateRelativePosition", () => {
    it("should return the same value when there is no translation", () => {
      const renderer = createRender()
      const pos = new Vec2(100, 200)
      const result = renderer.translateRelativePosition(pos)
      expect(result).toEqualVec2([100, 200])
    })
    it("should shift by screen offset", () => {
      const renderer = createRender()
      const pos = new Vec2(100, 200)
      renderer.setScreenOffset([300, -500])

      const result = renderer.translateRelativePosition(pos)
      expect(result).toEqualVec2([400, -300])
    })
    it("should shift by origin shift", () => {
      const renderer = createRender()
      const pos = new Vec2(100, 200)
      renderer.moveOriginBy(300, -500)

      const result = renderer.translateRelativePosition(pos)
      expect(result).toEqualVec2([400, -300])
    })
    it("should shift by both screenoffset and origin shift", () => {
      const renderer = createRender()
      const pos = new Vec2(100, 200)
      renderer.moveOriginBy(250, -300)
      renderer.setScreenOffset([-50, 100])
      const result = renderer.translateRelativePosition(pos)
      expect(result).toEqualVec2([300, 0])
    })
  })

  describe("translateAbsolutePosition", () => {
    it("should return the same value when there is no translation", () => {
      const renderer = createRender()
      const pos = new Vec2(100, 200)
      const result = renderer.translateAbsolutePosition(pos)
      expect(result).toEqualVec2([100, 200])
    })
    it("should shift by screen offset", () => {
      const renderer = createRender()
      const pos = new Vec2(100, 200)
      renderer.setScreenOffset([300, -500])

      const result = renderer.translateAbsolutePosition(pos)
      expect(result).toEqualVec2([-200, 700])
    })
    it("should shift by origin shift", () => {
      const renderer = createRender()
      const pos = new Vec2(100, 200)
      renderer.moveOriginBy(300, -500)

      const result = renderer.translateAbsolutePosition(pos)
      expect(result).toEqualVec2([-200, 700])
    })
    it("should shift by both screenoffset and origin shift", () => {
      const renderer = createRender()
      const pos = new Vec2(100, 200)
      renderer.moveOriginBy(250, -300)
      renderer.setScreenOffset([-50, 100])
      const result = renderer.translateAbsolutePosition(pos)
      expect(result).toEqualVec2([-100, 400])
    })
  })

  describe("scaleRelativePosition", () => {
    it("should increase with the scale", () => {
      const renderer = createRender()
      renderer.setRenderScale(2)
      const pos = new Vec2(100, 1000)
      const result = renderer.scaleRelativePosition(pos)
      expect(result).toEqualVec2([200, 2000])
    })
  })

  describe("scaleAbsolutePosition", () => {
    it("should decrease with the scale", () => {
      const renderer = createRender()
      renderer.setRenderScale(2)
      const pos = new Vec2(100, 1000)
      const result = renderer.scaleAbsolutePosition(pos)
      expect(result).toEqualVec2([50, 500])
    })
  })
})
