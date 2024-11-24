import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './custom-node';

const nodeTypes = {
  customNode: CustomNode,
};

interface ReactFlowChartProps {
  question: string;
  cards: JSX.Element[];
  onCreateDoc: (content: string) => void;
  onCreatePowerPoint: (content: string) => void;
  onCreateChart: (tableId: string) => void;
}

const ReactFlowChart: React.FC<ReactFlowChartProps> = ({
  question,
  cards,
  onCreateDoc,
  onCreatePowerPoint,
  onCreateChart,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const updatedNodes: Node[] = [
      {
        id: 'question-node',
        type: 'input',
        data: { label: question },
        position: { x: 250, y: 0 },
      },
      ...cards.map((cardElement, index) => ({
        id: `card-node-${index}`,
        type: 'customNode',
        data: {
          cardElement, // Pass the card JSX element directly
          index,
          onCreateDoc,
          onCreatePowerPoint,
          onCreateChart,
        },
        position: { x: 250, y: (index + 1) * 250 },
      })),
    ];

    const updatedEdges: Edge[] = cards.map((_, index) => ({
      id: `edge-${index}`,
      source: 'question-node',
      target: `card-node-${index}`,
      animated: true,
    }));

    setNodes(updatedNodes);
    setEdges(updatedEdges);
  }, [cards, question, onCreateDoc, onCreatePowerPoint, onCreateChart, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
    >
      <Background />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
};

export default ReactFlowChart;
