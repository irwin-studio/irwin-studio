export class Node {
  private connectionsFrom: Set<string> = new Set<string>()
  private connectionsTo: Set<string> = new Set<string>()

  id: string;

  constructor(id: string) {
    this.id = id;
  }

  connectTo(node: Node) {
    node.connectionsFrom.add(this.id)
    this.connectionsTo.add(node.id)
  }
}
