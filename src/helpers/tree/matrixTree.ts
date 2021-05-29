import {Tree, TreeEdge, TreeNode} from '.';

type Callback<T = void> = (change: T) => void;

interface ExportedTree<NodeData, EdgeData> {
    matrix: Record<string, Record<string, EdgeData>>;
    nodes: TreeNode<NodeData>[];
}

class MatrixTree<NodeData = void, EdgeData = void> implements Tree<NodeData, EdgeData> {
    nodeCallbacks: Callback<TreeNode<NodeData>>[];
    edgeCallbacks: Callback<TreeEdge<EdgeData>>[];

    matrix: Record<string, Record<string, EdgeData>> = {};
    nodes: Map<string, TreeNode<NodeData>> = new Map<string, TreeNode<NodeData>>();

    constructor(exportString?: string) {
        if (exportString === undefined) return;
        const data = JSON.parse(atob(exportString)) as ExportedTree<NodeData, EdgeData>;

        data.nodes.forEach(node => this.nodes.set(node.name, node));
        this.matrix = data.matrix;
    }

    onEdgeChange(callback: Callback<TreeEdge<EdgeData>>): Callback {
        this.edgeCallbacks.push(callback);
        return () => {
            this.edgeCallbacks = this.edgeCallbacks.filter(cb => cb === callback);
        };
    }

    onNodeChange(callback: Callback<TreeNode<NodeData>>): Callback {
        this.nodeCallbacks.push(callback);
        return () => {
            this.nodeCallbacks = this.nodeCallbacks.filter(cb => cb === callback);
        };
    }

    getNodes(): TreeNode<NodeData>[] {
        return [...this.nodes.values()];
    }

    getNode(name: string): TreeNode<NodeData> {
        return this.nodes.get(name);
    }

    getEdges(name: string): TreeEdge<EdgeData>[] {
        const from = this.getNode(name);
        if (!from) return;

        const edges: TreeEdge<EdgeData>[] = [];

        Object.entries(this.matrix[name] || {}).forEach(([to, data]) => {
            if (data !== undefined) {
                edges.push({
                    from: name,
                    to,
                    ...data,
                });
            }
        });

        return edges;
    }

    set(node: TreeNode<NodeData>): TreeNode<NodeData> {
        const name = node.name;
        this.nodes.set(name, node);

        if (!(name in this.matrix)) {
            this.matrix[name] = {};
            Object.keys(this.matrix).forEach(key => {
                this.matrix[key][name] = undefined;
            });
        }

        return this.getNode(name);
    }

    update(node: TreeNode<NodeData>): TreeNode<NodeData> {
        if (node.name in this.nodes) {
            this.nodes.set(node.name, node);
            return node;
        }
    }

    remove(name: string): void {
        this.unlink(name);

        delete this.matrix[name];
        Object.keys(this.matrix).forEach(key => delete this.matrix[key][name]);

        this.nodes.delete(name);
    }

    link(from: string, to: string, data: EdgeData): void {
        this.matrix[from] = this.matrix[from] || {};
        this.matrix[from][to] = data;
    }

    unlink(from: string, to?: string): void {
        if (to === undefined) {
            // delete all edges FROM origin
            this.matrix[from] = {};

            // delete all edges TO the origin
            Object.keys(this.matrix).forEach(key => {
                this.matrix[key][from] = undefined;
            });
        } else {
            this.matrix[from][to] = undefined;
        }
    }

    export(): string {
        const exportData: ExportedTree<NodeData, EdgeData> = {
            matrix: this.matrix,
            nodes: [...this.nodes.values()],
        };

        return btoa(JSON.stringify(exportData));
    }
}

export {MatrixTree};
