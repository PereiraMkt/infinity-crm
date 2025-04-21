
import { useState, useCallback } from "react";
import ReactFlow, {
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  MarkerType,
} from "reactflow";
import CustomNode from "./CustomNode";
import MindMapControls from "./MindMapControls";
import NodeTemplates from "./NodeTemplates";
import NodeDialogs from "./NodeDialogs";
import { initialNodes, initialEdges } from "./constants";
import SidebarPanel from "./SidebarPanel";

const nodeTypes = {
  custom: CustomNode,
};

const MindMapFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [isNodeDialogOpen, setIsNodeDialogOpen] = useState(false);
  const [isEdgeDialogOpen, setIsEdgeDialogOpen] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const onConnect = useCallback((params: Connection) => {
    const newEdge = {
      ...params,
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#555', strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#555',
      },
    };
    setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges]);

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setIsNodeDialogOpen(true);
  };

  const onEdgeClick = (_: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge);
    setIsEdgeDialogOpen(true);
  };

  const handleAddNode = (nodeType: string) => {
    const position = { x: 100, y: 100 };
    
    const newNode: Node = {
      id: `node-${nodes.length + 1}`,
      type: 'custom',
      position,
      data: { 
        label: `New ${nodeType}`,
        type: nodeType,
      },
    };
    
    setNodes([...nodes, newNode]);
    setSelectedNode(newNode);
    setIsNodeDialogOpen(true);
    setShowTemplates(false);
  };

  return (
    <div className="w-full h-full flex" style={{ height: '842px' }}> {/* A4 height */}
      <div className="w-full h-full relative">
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          fitView
          snapToGrid
          snapGrid={[15, 15]}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        >
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <Controls />
          <MindMapControls onAddNode={() => setShowTemplates(!showTemplates)} />
          {showTemplates && (
            <NodeTemplates onSelectTemplate={handleAddNode} />
          )}
        </ReactFlow>
        
        <NodeDialogs
          selectedNode={selectedNode}
          selectedEdge={selectedEdge}
          isNodeDialogOpen={isNodeDialogOpen}
          isEdgeDialogOpen={isEdgeDialogOpen}
          setIsNodeDialogOpen={setIsNodeDialogOpen}
          setIsEdgeDialogOpen={setIsEdgeDialogOpen}
          setNodes={setNodes}
          setEdges={setEdges}
        />
      </div>
    </div>
  );
};

export default MindMapFlow;
