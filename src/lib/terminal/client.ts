export class TerminalClient {
  lines: string[] = []

  constructor() {

  }

  addLines(...lines: string[]) {
    this.lines.push(...lines)
  }

  getLines(start: number, count: number): string[] {
    return [...this.lines].slice(start, start + count)
  }
}
