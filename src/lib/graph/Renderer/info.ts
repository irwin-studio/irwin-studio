export class Info {
  private children: Map<string, Info> = new Map<string, Info>()
  private _info: Record<string, string> = {}

  _getInfo(visitedChildren: Set<Info>) {
    if (visitedChildren.has(this)) {
      console.error(`Failed to call getInfo(): Info instance has cyclic references to itself`)
      return {}
    }

    visitedChildren.add(this)
    return this.getInfo()
  }

  addInfo(key: string, value: string) {
    this._info[key] = value
  }

  clearInfo(key: string) {
    delete this._info[key]
  }

  getInfo() {
    const info = JSON.parse(JSON.stringify(this._info))

    this.children.forEach((child, key) => {
      const visitedChildren: Set<Info> = new Set([this])
      info[key] = child._getInfo(visitedChildren)
    })

    return info
  }

  addInfoChild(key: string, child: Info) {
    this.children.set(key, child)
  }

  removeChild(key: string) {
    this.children.delete(key)
  }
}
