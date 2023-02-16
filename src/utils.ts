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
    previousScreen: Array<Screen>
}
export const formatNodesData = (data: Array<INode>) => {
    let nodes: Array<any> = [];
    let edges: Array<any> = [];
    data.map(item => {
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
                type: 'straight',
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: 'black',
                    height: 20,
                    width: 20
                }
            })
        })
        item?.previousScreen?.length && item.previousScreen.map((prevScreen) => {
            edges.push({
                id: uuid(),
                source: prevScreen.id,
                target: item.id,
            })
        })
    })
    return {
        nodes,
        edges
    }
}