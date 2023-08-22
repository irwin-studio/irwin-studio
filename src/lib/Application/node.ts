import type { IShape } from '$lib/Renderer/shape';

export interface GraphicNode<UTheme extends string> {
  id: string;
}

export class GraphicNode<UTheme extends string> {
  private shape: IShape<UTheme>

  private connectionsFrom: Set<GraphicNode<string>> = new Set<GraphicNode<string>>()
  private connectionsTo: Set<GraphicNode<string>> = new Set<GraphicNode<string>>()

  id: string;

  constructor(id: string, shape: IShape<UTheme>) {
    this.id = id;
    this.shape = shape
    this.draw = this.shape.draw
  }

  connectTo(node: GraphicNode<string>) {
    node.connectionsFrom.add(this)
    this.connectionsTo.add(node)
  }

  draw: IShape<UTheme>['draw'] = () => {
    throw new Error("Cannot call draw on GraphicNode before initialisation")
  }
}
