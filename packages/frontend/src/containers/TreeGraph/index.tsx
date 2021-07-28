import React, {useEffect} from 'react';
import {Coordinates, Route} from '../../helpers/location';
import {LinkedTree, TreeNode} from '../../helpers/tree';
import TreeGraph from '../../components/TreeRenderer';
import {KonvaEventObject} from 'konva/types/Node';
import queryString from 'query-string';
import {Circle, Text} from 'react-konva';
import {useHistory, useLocation} from 'react-router';
import {Observable} from 'rxjs';
import {throttleTime} from 'rxjs/operators';
import * as presets from './presets';
interface NodeData {
    selected: boolean;
    location: Coordinates;
}

interface EdgeData {
    route: Route;
}

const Graph: React.FC = () => {
    const saveThrottleTime = 600; // ms
    const {search} = useLocation();
    const history = useHistory();
    const result = queryString.parse(search);

    const hash = Array.isArray(result.hash) ? result.hash[0] : result.hash;
    const tree = new LinkedTree<NodeData, EdgeData>(hash || presets.standard);

    const onSelect = (node: TreeNode<NodeData>, event: KonvaEventObject<MouseEvent>) => {
        if (!event.evt.ctrlKey) {
            const selected = tree.getNodes().filter(({selected}) => selected);
            selected.forEach(node => tree.set({...node, selected: false}));

            if (selected.length > 1) {
                tree.set({...node, selected: true});
                return;
            }
        }

        tree.set({...node, selected: !node.selected});
    };

    const renderNode = (node: TreeNode<NodeData>) => {
        return (
            <>
                <Circle
                    radius={40}
                    fill={node.selected ? 'green' : 'red'}
                    stroke="black"
                    strokeWidth={1.7}
                />
                <Text text={node.name} />
            </>
        );
    };

    const onClick = (event: KonvaEventObject<MouseEvent>) => {
        const {target, evt} = event;
        tree.set({
            name: (tree.getNodes().length + 1).toString(),
            selected: false,
            location: {
                x: (evt.x - target.x()) / target.attrs.scaleX,
                y: (evt.y - target.y()) / target.attrs.scaleY,
                z: 0,
            },
        });
    };

    useEffect(() => {
        const source = new Observable(observer => {
            return tree.onNodeChange(() => observer.next());
        });

        const subscriptions = [
            source // prevent page reload until saved
                .pipe(throttleTime(saveThrottleTime, undefined, {leading: true}))
                .subscribe(() => {
                    window.onbeforeunload = () => true;
                }),
            source // save and re-enable page reload
                .pipe(throttleTime(saveThrottleTime, undefined, {trailing: true}))
                .subscribe(() => {
                    history.push(`${window.location.pathname}?hash=${tree.export()}`);
                    window.onbeforeunload = undefined;
                }),
        ];

        return () => subscriptions.forEach(sub => sub.unsubscribe());
    }, [tree]);

    return <TreeGraph tree={tree} onSelect={onSelect} renderNode={renderNode} onClick={onClick} />;
};

export default Graph;
