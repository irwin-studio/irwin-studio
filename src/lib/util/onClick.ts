export function onClick(element: HTMLElement, callback: (event: MouseEvent) => void): () => void {
  const click = (event: MouseEvent) => {
    callback(event)
  }

  element.addEventListener('click', click)
  return () => {
    element.removeEventListener('click', click)  
  }
}
