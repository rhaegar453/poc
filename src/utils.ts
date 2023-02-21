import { v4 as uuid } from 'uuid';
import { MarkerType } from 'reactflow';
import { uniqBy } from 'lodash';



interface Screen {
    id: string,
    condition: {
        expression: string
    }
}
interface INode {
    id: string,
    nextScreens: Array<Screen>,
    previousScreen: Screen
}

export const formatNodesData = (data: Array<INode>) => {
    let impNodes = data.map(item => item.id);
    let impNodeSet = new Set(impNodes)
    let nodes: Array<any> = [];
    let edges: Array<any> = [];
    data.map(item => {
        let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        nodes.push({
            id: item.id,
            draggable: true,
            data: { label: item.id, color },
            type: 'custom'
        })
        item.nextScreens.forEach((node) => {
            let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
            if (!impNodeSet.has(node.id)) {
                /* nodes.push({
                    id: node.id,
                    draggable: true,
                    data: { label: node.id, color },
                    type: 'orphan'
                }) */
            }
            else {
                nodes.push({
                    id: node.id,
                    draggable: true,
                    data: { label: node.id, color },
                    type: 'custom'
                })
            }
        })
        item?.nextScreens?.map((nextScreen) => {
            edges.push({
                id: uuid(),
                source: item.id,
                target: nextScreen.id,
                type: 'simplebezier',
                style: { stroke: color },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: 'black',
                    height: 10,
                    width: 10
                }
            })
        })
    })
    nodes = uniqBy(nodes, (data) => data.id)
    return {
        nodes,
        edges
    }
}