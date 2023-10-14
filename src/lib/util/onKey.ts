export type KeyDirection = 'UP' | 'DOWN' | 'EITHER'
export interface OnKeyMeta {
  ctrlKey: boolean
  direction: KeyDirection
}

export function onKey(key: string | RegExp, callback: (event: KeyboardEvent, meta: OnKeyMeta) => void, direction: KeyDirection = 'DOWN'): () => void {
  const upHandler = (event: KeyboardEvent) => {
    if (direction === "DOWN") {
      return
    }

    const call = () => {
      callback(event, {
        ctrlKey: event.ctrlKey,
        direction: 'UP'
      })
    }

    if (typeof key === 'string') {
      if ([event.code, event.key].includes(key)) {
        call()
      }
    } else if (key instanceof RegExp) {
      if (key.test(event.code) || key.test(event.key)) {
        call()
      }
    }
  }

  const downHandler = (event: KeyboardEvent) => {
    if (direction === "UP") {
      return
    }

    if (event.key) {
      callback(event, {
        ctrlKey: event.ctrlKey,
        direction: 'DOWN'
      })
    }
  }

  window.addEventListener('keydown', downHandler)
  window.addEventListener('keyup', upHandler)
  return () => {
    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)
  }
}
