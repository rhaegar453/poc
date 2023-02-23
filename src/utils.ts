import { v4 as uuid } from 'uuid';
import { isNode, MarkerType } from 'reactflow';
import { uniqBy } from 'lodash';
import { hierarchy, tree } from 'd3-hierarchy';

import data from './data.json';



export interface Screen {
    id: string,
    condition: {
        expression: string
    }
}
export interface INode {
    id: string,
    nextScreens: Array<Screen>,
    previousScreen: Screen
}

const formatData=(data:any)=> {
    let hierarchy:Record<string, any> = {} ;
    for (let parent in data) {
        let children = data[parent].map((child:any) => {
            return { id: child, children: [] };
        });
        hierarchy[parent] = { id: parent, children: children };
    }

    for (let parent in hierarchy) {
        let children = hierarchy[parent].children;
        children.forEach((child:any) => {
            if (child.id in hierarchy) {
                child.children = hierarchy[child.id].children;
            }
        });
    }
    return hierarchy[Object.keys(hierarchy)[0]];
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

function bfs(data:Array<Screen>, startingNode:string) {
    const screensMap:Record<string, any> = {};
    const visited = new Set();
    const queue = [];
    let final:Record<string, any> = {} 
    visited.add(startingNode);
    queue.push(startingNode);
    data.map(screen => {
        screensMap[screen.id] = screen;
    })

    while (queue.length > 0) {
        let currentItem = queue.shift();
        final[currentItem as string] = []
        screensMap[currentItem as string]?.nextScreens.map((item:{id:string}) => {
            if (!visited.has(item.id)) {
                final[currentItem as string].push(item.id)
                queue.push(item.id);
                visited.add(item.id)
            }
        })
    }
    return formatData(final);
}


export const generateTreeData=(data:any, startingNode:string)=>{
    /* Generate the BFS tree here */
    const bfsTree=bfs(data, startingNode);
    /* Create a Graph Hierarchy using the BFS tree generated */
    const treeHierarchy=hierarchy(bfsTree);
    const treeLayout=tree().size([600,400]).nodeSize([400,200]).separation((a,b)=>a.parent===b.parent?1:2);
    const d3Tree=treeLayout(treeHierarchy);

    const nodes=d3Tree.descendants().map((node:any)=>{
        return {
            id:node.data.id,
            type:'custom',
            position:{x:node.x,y:node.y},
            data:{label:node.data.id}
        }
    })
    return nodes;
}

export const generateEdges=(data:Array<INode>)=>{
    let edges=[] as Array<any>;
    data.map(screen=>{
        /* Figure out if the screen has next screens */
        screen?.nextScreens?.map(child=>{
            edges.push({
                id:uuid(),
                source:screen.id,
                target:child.id,
                type: 'smoothstep',  
            })
        })
        /* If there are previous screens mark them too */
        if(screen?.previousScreen){
            edges.push({
                id:uuid(),
                source:screen.id, 
                target:screen.previousScreen.id,
                type:'smoothstep'
            })
        }
    })
    return edges;
}






console.log(generateTreeData(data,  'INTRO_SCREEN'))



/* Task: Filter out the nodes that are not necessary nodes. */