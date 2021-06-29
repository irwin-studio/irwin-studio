import {DELIMETER, Tree, TreeEdge, TreeNode} from '..';

type Callback<T = void> = (change?: T) => void;

interface ExportedTree<NodeData, EdgeData> {
    edges: TreeEdge<EdgeData>[];
    nodes: TreeNode<NodeData>[];
}

class LinkedTree<NodeData = {}, EdgeData = {}> implements Tree<NodeData, EdgeData> {
    nodeCallbacks: Callback<TreeNode<NodeData>>[] = [];
    edgeCallbacks: Callback<TreeEdge<EdgeData>>[] = [];

    nodes: Map<string, TreeNode<NodeData>> = new Map<string, TreeNode<NodeData>>();
    edges: Map<string, TreeEdge<EdgeData>> = new Map<string, TreeEdge<EdgeData>>();

    constructor(exportString?: string) {
        if (exportString) this.import(exportString);
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

    getEdges(name?: string): TreeEdge<EdgeData>[] {
        if (name === undefined) {
            return [...this.edges.values()];
        } else {
            return [...this.edges.values()].filter(({from, to}) => [from, to].includes(name));
        }
    }

    set(node: TreeNode<NodeData>): TreeNode<NodeData> {
        if (this.nodes.get(node.name) !== node) {
            this.nodes.set(node.name, node);
            this.nodeCallbacks.forEach(callback => callback(node));
            return this.getNode(node.name);
        }
    }

    remove(name: string): TreeNode<NodeData> | undefined {
        this.unlink(name);
        const node = this.nodes.get(name);
        if (!node) return;

        this.nodes.delete(name);
        this.nodeCallbacks.forEach(callback => callback(node));
        return node;
    }

    link(from: string, to: string, data: EdgeData): void {
        const origin = this.nodes.get(from);
        const destination = this.nodes.get(to);
        if (!origin || !destination) return;

        const key = `${from}${DELIMETER}${to}`;
        const edge = {
            from,
            to,
            ...data,
        };

        if (JSON.stringify(this.edges.get(key)) !== JSON.stringify(edge)) {
            this.edges.set(key, edge);
            this.edgeCallbacks.forEach(callback => callback(edge));
        }
    }

    unlink(from: string, to?: string): void {
        if (to === undefined) {
            // delete all edges to and from the origin
            this.edges.forEach((edge, key) => {
                if ([edge.from, edge.to].includes(from)) {
                    this.edges.delete(key);
                    this.edgeCallbacks.forEach(callback => callback(edge));
                }
            });
        } else {
            this.edges.forEach((edge, key) => {
                if (edge.from === from && edge.to === to) {
                    this.edges.delete(key);
                    this.edgeCallbacks.forEach(callback => callback(edge));
                }
            });
        }
    }

    import(exportString?: string): void {
        if (exportString === undefined) return;
        let data: ExportedTree<NodeData, EdgeData>;

        try {
            data = JSON.parse(atob(exportString));
        } catch (ex) {
            throw new Error('Failed to deserialize import string');
        }

        if (
            typeof data !== 'object' ||
            !('edges' in data) ||
            !('nodes' in data) ||
            !Array.isArray(data.edges) ||
            !Array.isArray(data.nodes) ||
            data.edges.some(edge => typeof edge !== 'object' || !edge.from || !edge.to) ||
            data.nodes.some(node => typeof node !== 'object' || !node.name)
        ) {
            throw new Error('Import string was malformed');
        }

        data.edges.forEach(edge => {
            this.edges.set(`${edge.from}${DELIMETER}${edge.to}`, edge);
        });

        data.nodes.forEach(node => {
            this.nodes.set(node.name, node);
        });
    }

    export(): string {
        return btoa(
            JSON.stringify({
                edges: [...this.edges.values()],
                nodes: [...this.nodes.values()],
            }),
        );
    }
}

export {LinkedTree};
