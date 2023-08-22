export function onWheel(element: HTMLElement, callback: (event: WheelEvent) => void): () => void {
  element.addEventListener('wheel', callback)
  return () => {
    element.removeEventListener('wheel', callback)  
  }
}
