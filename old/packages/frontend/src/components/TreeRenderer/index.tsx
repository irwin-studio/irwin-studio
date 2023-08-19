import {KonvaEventObject} from 'konva/types/Node';
import {Vector2d} from 'konva/types/types';
import React, {ReactNode, useCallback, useEffect, useRef, useState} from 'react';
import {Stage, Layer, Group, Line} from 'react-konva';
import {subtract} from '../../helpers/location';
import {Route, Coordinates} from '../../helpers/location';
import {Tree, TreeNode} from '../../helpers/tree';
import grid from '../../assets/images/grid.png';

const BACKGROUND_SIZE = 50;
interface Props<NodeData extends {location: Coordinates}, EdgeData extends {route: Route}> {
    tree: Tree<NodeData, EdgeData>;
    renderNode: (node: TreeNode<NodeData>) => ReactNode;
    onClick?: (event: KonvaEventObject<MouseEvent>) => void;
    onSelect?: (node: TreeNode<NodeData>, event: KonvaEventObject<MouseEvent>) => void;
}

export interface RequiredNodeData {
    location: Coordinates;
}

export interface RequiredEdgeData {
    route: Route;
}

const TreeGraph = function TreeGraph<
    NodeData extends RequiredNodeData,
    EdgeData extends RequiredEdgeData
>({tree, renderNode, onClick, onSelect}: Props<NodeData, EdgeData>): JSX.Element {
    const canvas = useRef<any>();
    const [currentNodes, setCurrentNodes] = useState<TreeNode<NodeData>[]>(tree.getNodes());
    const [edges, setEdges] = useState<Route[]>([]);
    const [scale, setScale] = useState<Vector2d>({x: 1, y: 1});
    const [stagePosition, setStagePosition] = useState<Vector2d>({x: 0, y: 0});

    const updateNode = useCallback(
        (node: TreeNode<NodeData>) => {
            tree.set(node);
            updateEdges();
        },
        [tree],
    );

    const updateRenderedNodes = useCallback(() => {
        setCurrentNodes(tree.getNodes());
    }, [tree]);

    const updateEdges = useCallback(() => {
        tree.getEdges().forEach(edge => {
            tree.link(edge.from, edge.to, {
                ...edge,
                route: {
                    from: tree.getNode(edge.from)?.location,
                    to: tree.getNode(edge.to)?.location,
                },
            });
        });

        setEdges(tree.getEdges().map(({route}) => route));
    }, [tree]);

    const onWheel = (event: KonvaEventObject<MouseEvent>) => {
        const delta = ((event.evt as any).wheelDelta || 0) / 1500;
        const newScale = {x: scale.x + delta, y: scale.y + delta};
        setScale({x: newScale.x < 0 ? 0 : newScale.x, y: newScale.y < 0 ? 0 : newScale.y});
    };

    useEffect(() => {
        updateRenderedNodes();
        updateEdges();

        return tree.onNodeChange(() => updateRenderedNodes());
    }, [tree]);

    return (
        <Stage
            draggable
            ref={canvas}
            x={stagePosition.x}
            y={stagePosition.y}
            style={{
                backgroundImage: `url(${grid})`,
                backgroundRepeat: 'repeat',
                backgroundSize: `${BACKGROUND_SIZE * scale.x}px ${BACKGROUND_SIZE * scale.y}px`,
                backgroundPosition: `${stagePosition.x}px ${stagePosition.y}px`,
            }}
            width={window.innerWidth}
            height={window.innerHeight}
            onDragMove={event => {
                if (event.target === canvas.current)
                    setStagePosition({x: event.target.x(), y: event.target.y()});
            }}
            scale={scale}
            onWheel={onWheel}
            onClick={e => {
                if (e.target === canvas.current) onClick?.(e);
            }}
        >
            {/* EDGES */}
            <Layer>
                {edges.map((route, index) => {
                    return (
                        <Group key={index}>
                            <Line
                                x={route.from.x}
                                y={route.from.y}
                                points={(() => {
                                    const destination = subtract(route.to, route.from);
                                    return [0, 0, destination.x, destination.y];
                                })()}
                                tension={1}
                                closed
                                stroke="#373A43"
                            />
                        </Group>
                    );
                })}
            </Layer>

            {/* NODES */}
            <Layer>
                {[...currentNodes.values()].map((node, index) => (
                    <Group
                        draggable
                        key={index}
                        x={node.location.x}
                        y={node.location.y}
                        onDragEnd={() => updateRenderedNodes()}
                        onDragMove={event => {
                            updateNode({
                                ...node,
                                location: {x: event.target.x(), y: event.target.y(), z: 0},
                            });
                        }}
                        onClick={event => {
                            onSelect?.(node, event);
                            // updateRenderedNodes();
                        }}
                    >
                        {renderNode(node)}
                    </Group>
                ))}
            </Layer>
        </Stage>
    );
};

export default TreeGraph;
