export function onMouseMove(callback: (event: MouseEvent) => void): () => void {
  window.addEventListener('mousemove', callback)
  return () => window.removeEventListener('mousemove', callback)
}
