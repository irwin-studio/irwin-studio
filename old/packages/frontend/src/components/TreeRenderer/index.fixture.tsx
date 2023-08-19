import React from 'react';
import {KonvaEventObject} from 'konva/types/Node';
import {Circle, Text} from 'react-konva';
import {LinkedTree, TreeNode} from '../../helpers/tree';
import TreeRenderer, {RequiredEdgeData, RequiredNodeData} from './index';

const Fixture: React.FC = () => {
    const tree = new LinkedTree<RequiredNodeData, RequiredEdgeData>();

    const renderNode = (node: TreeNode<RequiredNodeData>) => {
        return (
            <>
                <Circle radius={40} fill={'green'} stroke="black" strokeWidth={1.7} />
                <Text text={node.name} />
            </>
        );
    };

    const onClick = (event: KonvaEventObject<MouseEvent>) => {
        const {target, evt} = event;
        tree.set({
            name: (tree.getNodes().length + 1).toString(),
            location: {
                x: (evt.x - target.x()) / target.attrs.scaleX,
                y: (evt.y - target.y()) / target.attrs.scaleY,
                z: 0,
            },
        });
    };

    return <TreeRenderer tree={tree} renderNode={renderNode} onClick={onClick} />;
};

export default Fixture;
