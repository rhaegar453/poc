import React, { useCallback, useEffect, useMemo, useState } from "react";
import 'reactflow/dist/style.css';
import ReactFlow, { Controls, Background, MiniMap, useNodesState, Node, Edge, Position, useEdgesState, addEdge, ConnectionLineType, useReactFlow, ReactFlowInstance } from 'reactflow';
import screenTransitions from './data.json';
import { formatNodesData } from "./utils";
import dagre from 'dagre';
import CustomNode from "./components/Node";
import OrphanNode from "./components/OrphanNode";
import Tooltip from "./components/tooltip";
import Modal from "./components/dialogue";
import NodeTransitionDetails from "./components/NodeTransitionDetails";



const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}))

const { nodes: initialNodes, edges: initialEdges } = formatNodesData(screenTransitions as any) as any
const nodeWidth = 200;
const nodeHeight = 36;




const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'HL') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction, ranker: 'network-simplex', marginx: 0, marginy: 0, align: 'DL' });

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
  const { nodes: computedNodes, edges: computedEdges } = useMemo(() => getLayoutedElements(initialNodes, initialEdges), [screenTransitions])
  const [nodes, setNodes, onNodesChange] = useNodesState(computedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(computedEdges);
  const [selectedNode, setSelectedNode] = useState<any>();
  const [modalOpen, setModalOpen] = useState<boolean>(false)


  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) =>
        addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)
      ),
    []
  );

  const handleNodeClick = (data: any, node: Node) => {
    let modifiedEdges = edges.map(item => {
      if (item.source === node.id) {
        return { ...item, animated: true, style: { strokeWidth: '2px', stroke: item.style?.stroke } }
      }
      return { ...item, animated: false };
    })
    setEdges(modifiedEdges)
  }
  const customNodeTypes = useMemo(() => ({
    'custom': CustomNode,
    'orphan': OrphanNode
  }), [])

  useEffect(() => {
    document.addEventListener('view_screen_definition', (e: Event) => {
      let customEvent = e as CustomEvent;
      let id = customEvent.detail.label;
      let selectedData = screenTransitions.filter(item => item.id === id);
      setSelectedNode(selectedData[0])
      setModalOpen(true)
    })
    document.addEventListener('edit_screen_definition', (e: Event) => {
      let customEvent = e as CustomEvent;
      let nodeId = customEvent.detail.label;
      console.log("Open the modal for editing the screen definition of this particular screen")
    })
    return () => {
      document.removeEventListener('view_screen_definition', () => { })
      document.removeEventListener('edit_screen_definition', () => { })
    }
  }, [])

  return (
    <div>
      <div style={{ height: '800px' }}>
        <Modal open={modalOpen} onOpenChange={(open) => setModalOpen(open)} title="View Screen Transitions"
        >
          <div>
            {selectedNode ? <div>
              <div>
                <NodeTransitionDetails {...selectedNode} />
              </div>
            </div> : null}
          </div>
        </Modal>
        <ReactFlow nodes={nodes} edges={edges}
          onNodesChange={onNodesChange}
          onNodeClick={handleNodeClick}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={customNodeTypes}
          fitView
          fitViewOptions={{ nodes: [{ id: 'INTRO_SCREEN' }] }}
        >
          <Background />
          <Controls />
          <MiniMap zoomable pannable />
        </ReactFlow>
      </div>
    </div>
  );
}

export default App;