export function onMouseDrag(element: HTMLElement, callback: (event: MouseEvent) => void, sensitivity: number = 5): () => void {
  let mouseIsDown = false
  let dragEvents = 0;

  const mouseUp = () => {
    dragEvents = 0
    mouseIsDown = false
  }

  const mouseDown = () => {
    dragEvents = 0
    mouseIsDown = true
  }

  const mouseMove = (event: MouseEvent) => {
    if (mouseIsDown && dragEvents > sensitivity) {
      callback(event)
    } else if (mouseIsDown) {
      dragEvents++
    }
  }

  element.addEventListener('mousedown', mouseDown)
  element.addEventListener('mouseup', mouseUp)
  element.addEventListener('mousemove', mouseMove)

  return () => {
    element.removeEventListener('mousedown', mouseDown)  
    element.removeEventListener('mouseUp', mouseUp)
    element.removeEventListener('mousemove', mouseMove)
  }
}
