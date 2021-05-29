export {LinkedTree} from './linkedTree';
export const DELIMETER = ':';

interface BaseEdge {
    from: string;
    to: string;
}

interface BaseNode {
    name: string;
}

export type TreeNode<NodeData = void> = BaseNode & NodeData;
export type TreeEdge<EdgeData = void> = BaseEdge & EdgeData;

export interface Tree<NodeData, EdgeData> {
    onNodeChange(callback: (node: TreeNode<NodeData>) => void): () => void;
    onEdgeChange(callback: (edge: TreeEdge<EdgeData>) => void): () => void;

    getNodes(): TreeNode<NodeData>[];
    getNode(name: string): TreeNode<NodeData>;
    getEdges(name?: string): TreeEdge<EdgeData>[];

    set(node: TreeNode<NodeData>): TreeNode<NodeData>;
    remove(name: string): void;

    link(from: string, to: string, data: EdgeData): void;
    unlink(from: string, to?: string): void;

    import(exportString: string): void;
    export(): string;
}
