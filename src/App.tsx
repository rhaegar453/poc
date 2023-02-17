import React, { useCallback } from "react";
import 'reactflow/dist/style.css';
import ReactFlow, { Controls, Background, useNodesState, Node, Edge, Position, useEdgesState, addEdge, ConnectionLineType } from 'reactflow';
import screenTransitions from './data.json';
import { formatNodesData } from "./utils";
import dagre from 'dagre';


const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}))

const { nodes: initialNodes, edges: initialEdges } = formatNodesData(screenTransitions as any) as any
const nodeWidth = 200;
const nodeHeight = 36;





const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'HL') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction, ranksep: 100, nodesep: 1, edgesep: 50, ranker: 'network-simplex', marginx: 0, marginy: 0, align: 'DL' });

  nodes.forEach((node: any) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges && edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};


const App = () => {
  const { nodes: computedNodes, edges: computedEdges } = getLayoutedElements(initialNodes, initialEdges)
  const [nodes, setNodes, onNodesChange] = useNodesState(computedNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(computedEdges)


  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) =>
        addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)
      ),
    []
  );

  const handleNodeClick = (data: any, node:Node) => {
    let modifiedEdges=edges.map(item=>{
      if(item.source===node.id){
        return {...item, animated:true, style:{ strokeWidth:'2px', stroke:item.style?.stroke}}
      }
      return {...item, animated:false};
    })
    setEdges(modifiedEdges)
  }

  console.log("These are the nodes", edges, nodes)

  return (
    <div>
      <h1>Hello World this is React Flow POC</h1>
      <div style={{ height: '800px', width: '800px' }}>
        <ReactFlow nodes={nodes} edges={edges}
          onNodesChange={onNodesChange}
          onNodeClick={handleNodeClick}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

export default App;