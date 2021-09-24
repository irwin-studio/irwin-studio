import {LinkedTree} from './linkedTree';
import {Tree} from '.';
// import {MatrixTree} from './matrixTree';

describe.each<[string, () => Tree<any, any>]>([
    ['LinkedTree', () => new LinkedTree()],
    // ['MatrixTree', () => new MatrixTree()],
])('%s', (_, create) => {
    let tree: Tree<{isNode: boolean}, {isEdge: boolean}> = create();
    beforeEach(() => {
        tree = create();
        tree.set({name: '0', isNode: true}); // one outgoing edge
        tree.set({name: '1', isNode: true}); // one incoming edge
        tree.set({name: '2', isNode: true}); // two incoming edges
        tree.set({name: '3', isNode: true}); // two outgoing edges
        tree.set({name: '4', isNode: true}); // no edges

        tree.link('0', '2', {isEdge: true});
        tree.link('3', '1', {isEdge: true});
        tree.link('3', '2', {isEdge: true});
    });

    describe('onEdgeChange()', () => {
        it('should run callback when linking nodes', () => {
            const callback = jest.fn();
            const removeCallback = tree.onEdgeChange(callback);

            tree.link('0', '0', {isEdge: false});

            removeCallback();
            expect(callback).toBeCalledWith({from: '0', to: '0', isEdge: false});
        });

        it('should run callback when unlinking nodes', () => {
            const callback = jest.fn();
            const removeCallback = tree.onEdgeChange(callback);

            tree.unlink('0', '2');

            removeCallback();
            expect(callback).toBeCalledWith({from: '0', to: '2', isEdge: true});
        });

        it('should run callback when removing linked nodes', () => {
            const callback = jest.fn();
            const removeCallback = tree.onEdgeChange(callback);

            tree.remove('1');
            tree.remove('4'); // <-- 4 has no edges

            removeCallback();
            expect(callback).toBeCalledWith({from: '3', to: '1', isEdge: true});
        });

        it('should run multiple callbacks', () => {
            const callbacks = [jest.fn(), jest.fn()];
            const removeCallbacks = callbacks.map(callback => tree.onEdgeChange(callback));

            tree.remove('1');

            removeCallbacks.forEach(remove => remove());

            expect(callbacks[0]).toBeCalledWith({from: '3', to: '1', isEdge: true});
            expect(callbacks[1]).toBeCalledWith({from: '3', to: '1', isEdge: true});
        });

        it('should cleanup callbacks', () => {
            const callbacks = [jest.fn(), jest.fn()];
            const removeCallbacks = callbacks.map(callback => tree.onEdgeChange(callback));

            tree.remove('0');

            // cleanup first callback
            removeCallbacks.pop()?.();

            tree.remove('1');

            // cleanup second callback
            removeCallbacks.pop()?.();

            expect(callbacks[0]).toBeCalledTimes(1);
            expect(callbacks[1]).toBeCalledTimes(2);
        });
    });

    describe('onNodeChange()', () => {
        it('should run callback when adding nodes', () => {
            const callback = jest.fn();
            const removeCallback = tree.onNodeChange(callback);

            tree.set({name: '1', isNode: false});

            removeCallback();
            expect(callback).toBeCalledWith({name: '1', isNode: false});
        });

        it('should run callback when removing nodes', () => {
            const callback = jest.fn();
            const removeCallback = tree.onNodeChange(callback);

            tree.remove('1');

            removeCallback();
            expect(callback).toBeCalledWith({name: '1', isNode: true});
        });

        it('should run multiple callbacks', () => {
            const callbacks = [jest.fn(), jest.fn()];
            const removeCallbacks = callbacks.map(callback => tree.onEdgeChange(callback));

            tree.remove('1');

            removeCallbacks.forEach(remove => remove());

            expect(callbacks[0]).toBeCalledWith({from: '3', to: '1', isEdge: true});
            expect(callbacks[1]).toBeCalledWith({from: '3', to: '1', isEdge: true});
        });

        it('should cleanup callbacks', () => {
            const callbacks = [jest.fn(), jest.fn()];
            const removeCallbacks = callbacks.map(callback => tree.onNodeChange(callback));

            tree.remove('0');

            // cleanup first callback
            removeCallbacks.pop()?.();

            tree.remove('1');

            // cleanup second callback
            removeCallbacks.pop()?.();

            expect(callbacks[0]).toBeCalledTimes(1);
            expect(callbacks[1]).toBeCalledTimes(2);
        });
    });

    describe('getNodes()', () => {
        it('should get nodes', () => {
            const nodes = tree.getNodes();
            expect(nodes).toMatchObject(
                ['0', '1', '2', '3', '4'].map(name => ({name, isNode: true})),
            );
        });
    });

    describe('getNode()', () => {
        it('should get node of a given name', () => {
            expect(tree.getNode('1')).toMatchObject({name: '1', isNode: true});
        });

        it('should not return node if node name does not exist', () => {
            expect(tree.getNode('invalid')).toBeUndefined();
        });
    });

    describe('getEdges()', () => {
        it('should get edges', () => {
            expect(tree.getEdges('0')).toMatchObject([{from: '0', to: '2', isEdge: true}]);

            expect(tree.getEdges('3')).toMatchObject([
                {from: '3', to: '1', isEdge: true},
                {from: '3', to: '2', isEdge: true},
            ]);
        });

        it('should get updated edges', () => {
            tree.unlink('3', '2');
            expect(tree.getEdges('3')).toMatchObject([{from: '3', to: '1', isEdge: true}]);

            tree.link('3', '3', {isEdge: false});

            expect(tree.getEdges('3')).toMatchObject([
                {from: '3', to: '1', isEdge: true},
                {from: '3', to: '3', isEdge: false},
            ]);
        });

        it('should return no edges for a node that does no exist', () => {
            expect(tree.getEdges('hello world')).toMatchObject([]);
        });
    });

    describe('set()', () => {
        it('should add a node', () => {
            const node = {name: 'new node', isNode: false};

            tree.set(node);
            expect(tree.getNode('new node')).toMatchObject(node);
        });

        it('should return the updated/created node', () => {
            const node = {name: 'new node', isNode: false};
            expect(tree.set(node)).toMatchObject(node);
        });

        it('should update a node', () => {
            expect(tree.getNode('1')).toMatchObject({name: '1', isNode: true});

            const updatedNode = {name: '1', isNode: false};
            expect(tree.set(updatedNode)).toMatchObject(updatedNode);
            expect(tree.getNode(updatedNode.name)).toMatchObject(updatedNode);
        });
    });

    describe('remove()', () => {
        it('should remove a node', () => {
            tree.remove('1');
            expect(tree.getNode('1')).toBeUndefined();
        });

        it('should return the removed node', () => {
            expect(tree.remove('1')).toMatchObject({name: '1', isNode: true});
        });

        it('should return undefined if the node does not exist', () => {
            expect(tree.remove('hello world')).toBeUndefined();
        });

        it('should unlink any previously linked nodes', () => {
            // unlink a 'to' and a 'from' edge
            tree.remove('0'); // connected TO '2'
            tree.remove('1'); // connected FROM '3'

            const edges = tree.getEdges();
            const relatedEdges = edges.filter(
                ({from, to}) => [from, to].includes('0') || [from, to].includes('1'),
            );

            expect(relatedEdges.length).toEqual(0);
        });
    });

    describe('link()', () => {
        it('should link two nodes', () => {
            const [from, to] = ['4', '0'];
            const edgeData = {isEdge: true};

            tree.link(from, to, edgeData);
            expect(tree.getEdges(from)).toMatchObject([{from, to, ...edgeData}]);

            // ensure there are no double-ups created
            const relevantEdges = tree
                .getEdges()
                .filter(edge => edge.from === from && edge.to === to);

            expect(relevantEdges.length).toEqual(1);
        });

        it('should not link nodes if one does not exist', () => {
            const [from, to] = ['4', 'non existant node'];
            const edgeData = {isEdge: true};

            tree.link(from, to, edgeData);
            expect(tree.getEdges(from)).toMatchObject([]);

            // ensure there are no double-ups created
            const relevantEdges = tree
                .getEdges()
                .filter(edge => edge.from === from && edge.to === to);

            expect(relevantEdges.length).toEqual(0);
        });
    });

    describe('unlink()', () => {
        it('Should unlink a specific edge', () => {
            const [from, to] = ['3', '1'];

            tree.unlink(from, to);
            expect(tree.getEdges(from)).toMatchObject([{from, to: '2', isEdge: true}]);
        });

        it('should unlink all edges from a node', () => {
            const from = '4';

            tree.unlink(from);
            expect(tree.getEdges(from)).toMatchObject([]);
        });
    });

    describe('import()', () => {
        it('should successfully impor the exported string', () => {
            expect(() => tree.import(tree.export())).not.toThrow();
        });

        it('should throw error when given non-base64 string', () => {
            expect(() => tree.import('hello world')).toThrowError(
                'Failed to deserialize import string',
            );
        });

        it('should throw error when import malformed data', () => {
            const data = {nodes: 'hello', edges: [{0: 'world'}]};
            const base64 = Buffer.from(JSON.stringify(data)).toString('base64');
            const importCall = () => tree.import(base64);

            expect(importCall).toThrowError('Import string was malformed');
        });
    });

    describe('export()', () => {
        it('should export data to some string value', () => {
            expect(typeof tree.export()).toEqual('string');
        });
    });
});
