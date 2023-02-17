import { v4 as uuid } from 'uuid';
import { MarkerType } from 'reactflow';


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
    let nodes: Array<any> = [];
    let edges: Array<any> = [];
    data.map(item => {
        let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        nodes.push({
            id: item.id,
            draggable: true,
            data: { label: item.id }
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
        if (item.previousScreen) {
            edges.push({
                id: uuid(),
                source: item.id,
                target: item.previousScreen.id,
                color: color
            })
        }
    })
    return {
        nodes,
        edges
    }
}