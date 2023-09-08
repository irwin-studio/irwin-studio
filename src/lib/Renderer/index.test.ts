// sum.test.js
import { describe, it, expect, afterEach } from 'vitest'
import { mock } from 'vitest-mock-extended';
import { Renderer } from '.'
import { Vec2 } from './vec2'
import { Layer } from './layer'
import type { Shape } from './shape';

describe('Renderer', () => {
  const createRender = (): [Renderer, CanvasRenderingContext2D, HTMLCanvasElement] => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d') as CanvasRenderingContext2D
    const renderer = new Renderer(canvas)

    if (context === null) {
      throw new Error("Failed to get canvas context")
    }

    return [renderer, context, canvas]
  }

  describe('addLayer', () => {
    it("should add given layer to the renderer", () => {
      const [renderer] = createRender()
      const layer = new Layer()
      expect(renderer.layers.has(layer)).toBeFalsy()
      renderer.addLayer(layer)
      expect(renderer.layers.has(layer)).toBeTruthy()
    })

    it("should return function that removes layer from renderer", () => {
      const [renderer] = createRender()
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
      const [renderer] = createRender()
      const layer = new Layer()

      renderer.addLayer(layer)
      expect(renderer.layers.has(layer)).toBeTruthy()

      renderer.removeLayer(layer)
      expect(renderer.layers.has(layer)).toBeFalsy()
    })
  })

  describe('setRenderScale', () => {
    it("should set the render scale", () => {
      const [renderer] = createRender()
      const current = renderer.renderScale;
      renderer.setRenderScale(current + 5)
      expect(renderer.renderScale).toEqual(current + 5)
    })
  })

  describe.todo("render")

  describe("moveOriginBy", () => {
    it("should move the origin to the given location", () => {
      const [renderer] = createRender()

      renderer.moveOriginBy(100, 1000)
      expect(renderer.getOriginShift()).toEqualVec2([100, 1000])

      renderer.moveOriginBy(-200, -2000)
      expect(renderer.getOriginShift()).toEqualVec2([-100, -1000])
    })
  })

  describe("moveOriginTo", () => {
    it("should move the origin to the given location", () => {
      const [renderer] = createRender()

      renderer.moveOriginTo([100, 1000])
      expect(renderer.getOriginShift()).toEqualVec2([100, 1000])

      renderer.moveOriginTo([-200, -2000])
      expect(renderer.getOriginShift()).toEqualVec2([-200, -2000])
    })
  })

  describe("translateRelativePosition", () => {
    it("should return the same value when there is no translation", () => {
      const [renderer] = createRender()
      const pos = new Vec2(100, 200)
      const result = renderer.translateRelativePosition(pos)
      expect(result).toEqualVec2([100, 200])
    })
    it("should shift by screen offset", () => {
      const [renderer] = createRender()
      const pos = new Vec2(100, 200)
      renderer.setScreenOffset([300, -500])

      const result = renderer.translateRelativePosition(pos)
      expect(result).toEqualVec2([400, -300])
    })
    it("should shift by origin shift", () => {
      const [renderer] = createRender()
      const pos = new Vec2(100, 200)
      renderer.moveOriginBy(300, -500)

      const result = renderer.translateRelativePosition(pos)
      expect(result).toEqualVec2([400, -300])
    })
    it("should shift by both screenoffset and origin shift", () => {
      const [renderer] = createRender()
      const pos = new Vec2(100, 200)
      renderer.moveOriginBy(250, -300)
      renderer.setScreenOffset([-50, 100])
      const result = renderer.translateRelativePosition(pos)
      expect(result).toEqualVec2([300, 0])
    })
  })

  describe("translateAbsolutePosition", () => {
    it("should return the same value when there is no translation", () => {
      const [renderer] = createRender()
      const pos = new Vec2(100, 200)
      const result = renderer.translateAbsolutePosition(pos)
      expect(result).toEqualVec2([100, 200])
    })
    it("should shift by screen offset", () => {
      const [renderer] = createRender()
      const pos = new Vec2(100, 200)
      renderer.setScreenOffset([300, -500])

      const result = renderer.translateAbsolutePosition(pos)
      expect(result).toEqualVec2([-200, 700])
    })
    it("should shift by origin shift", () => {
      const [renderer] = createRender()
      const pos = new Vec2(100, 200)
      renderer.moveOriginBy(300, -500)

      const result = renderer.translateAbsolutePosition(pos)
      expect(result).toEqualVec2([-200, 700])
    })
    it("should shift by both screenoffset and origin shift", () => {
      const [renderer] = createRender()
      const pos = new Vec2(100, 200)
      renderer.moveOriginBy(250, -300)
      renderer.setScreenOffset([-50, 100])
      const result = renderer.translateAbsolutePosition(pos)
      expect(result).toEqualVec2([-100, 400])
    })
  })

  describe("scaleRelativePosition", () => {
    it("should increase with the scale", () => {
      const [renderer] = createRender()
      renderer.setRenderScale(2)
      const pos = new Vec2(100, 1000)
      const result = renderer.scaleRelativePosition(pos)
      expect(result).toEqualVec2([200, 2000])
    })
  })

  describe("scaleAbsolutePosition", () => {
    it("should decrease with the scale", () => {
      const [renderer] = createRender()
      renderer.setRenderScale(2)
      const pos = new Vec2(100, 1000)
      const result = renderer.scaleAbsolutePosition(pos)
      expect(result).toEqualVec2([50, 500])
    })
  })

  describe("render", () => {
    it("should clear the canvas every time", () => {
      const [renderer, context] = createRender()

      renderer.render()
      renderer.render()
      renderer.render()

      const clearRect = mock(context.clearRect)
      expect(clearRect).toHaveBeenCalledTimes(3)
    })

    it("should call shape render method", () => {
      const [renderer] = createRender()

      const circle = mock<Shape>({ position: new Vec2(0, 0) })
      renderer.addLayer(new Layer(circle))

      renderer.render()
      expect(circle.draw).toHaveBeenCalled()
    })

    it("should render shapes from sorting method", () => {
      const [renderer] = createRender()

      // note that the shape is not added to the renderer's layers
      const shape = mock<Shape>({ position: new Vec2(0, 0) })
      Object.assign(renderer, {
        sortShapes: () => [shape]
      })

      renderer.render()
      expect(shape.draw).toHaveBeenCalled()
    })
  })

  describe("sortShapes", () => {
    const drawCalls: string[] = []
    const resetDrawCalls = () => {
      while (drawCalls.length) drawCalls.shift()
    }

    afterEach(() => {
      resetDrawCalls()
    })

    const shapeTop = mock<Shape>({ position: new Vec2(0, 0) })
    shapeTop.draw.mockImplementation(() => drawCalls.push("top"))
    shapeTop.config.renderLayer = 2

    const shapeBottom = mock<Shape>({ position: new Vec2(0, 0) })
    shapeBottom.draw.mockImplementation(() => drawCalls.push("bottom"))
    shapeBottom.config.renderLayer = 1

    describe("should order shapes correctly even when", () => {
      it.each([
        ["in different layers", new Layer(shapeBottom), new Layer(shapeTop)],
        ["in different layers (reverse)", new Layer(shapeTop), new Layer(shapeBottom)],
        ["same layer", new Layer(shapeBottom, shapeTop)],
        ["same layer (reverse)", new Layer(shapeTop, shapeBottom)],
      ])("%s", (_: string, ...layers: Layer[]) => {
        const [renderer] = createRender()
      
        layers.forEach(layer => renderer.addLayer(layer))
        renderer.render()
        expect(drawCalls).toEqual(["bottom", "top"])
  
        resetDrawCalls()
      })
    })
  })
})
