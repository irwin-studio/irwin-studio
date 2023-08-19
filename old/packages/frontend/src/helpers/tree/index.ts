export {LinkedTree} from './linkedTree';
export const DELIMETER = ':';

interface BaseEdge {
    from: string;
    to: string;
}

interface BaseNode {
    name: string;
}

export type Callback<T = void> = (change?: T) => void;
export type TreeNode<NodeData = void> = BaseNode & NodeData;
export type TreeEdge<EdgeData = void> = BaseEdge & EdgeData;

export interface Tree<NodeData, EdgeData> {
    onNodeChange(callback: Callback<TreeNode<NodeData>>): Callback;
    onEdgeChange(callback: Callback<TreeEdge<EdgeData>>): Callback;

    getNodes(): TreeNode<NodeData>[];
    getNode(name: string): TreeNode<NodeData> | undefined;
    getEdges(name?: string): TreeEdge<EdgeData>[];

    set(node: TreeNode<NodeData>): void;
    remove(name: string): void;

    link(from: string, to: string, data: EdgeData): void;
    unlink(from: string, to?: string): void;

    import(exportString: string): void;
    export(): string;
}
