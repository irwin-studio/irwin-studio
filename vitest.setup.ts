import "vitest-canvas-mock"
import { expect } from 'vitest';
import { MaybeVec2, Vec2 } from './src/lib/Renderer/vec2'

expect.extend({
	toEqualVec2(received: MaybeVec2, expected: MaybeVec2) {
		const _received = Vec2.coerce(received)
		const _expected = Vec2.coerce(expected)

		const equalX = _received.x === _expected.x
		const equalY = _received.y === _expected.y
		const equal = equalX && equalY

		const diff = _received.clone().subtract(_expected)

		return {
			// do not alter your "pass" based on isNot. Vitest does it for you
			pass: equal,
			message: () => {
				if (this.isNot) {
					return `Both vectors are ${_expected.toString()}`
				} else {
					return `received vector off by ${diff.toString()}`
				}
			},
			// these are required - if the values are the same, vitest wont render them 
			actual: "Received: " + _received.toString(),
			expected: "Expected: " + _expected.toString()
		}
	}
})
