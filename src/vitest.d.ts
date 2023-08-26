/* eslint-disable @typescript-eslint/no-empty-interface */
import type { Assertion, AsymmetricMatchersContaining } from 'vitest'
import { MaybeVec2 } from './src/lib/Renderer/vec2'

interface CustomMatchers<R = unknown> {
  toEqualVec2(expected: MaybeVec2): R
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
