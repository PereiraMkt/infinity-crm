
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
  useReactFlow,
} from "reactflow";
import CustomNode from "./CustomNode";
import MindMapControls from "./MindMapControls";
import NodeTemplates, { useNodeTemplates } from "./NodeTemplates";
import { initialNodes, initialEdges } from "./constants";
import SidebarPanel from "./SidebarPanel";
import NodeDialog from "./NodeDialog";
import EdgeDialog from "./EdgeDialog";

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [nodeName, setNodeName] = useState("");
  const { templates, createTemplateNode } = useNodeTemplates();
  const reactFlowInstance = useReactFlow();

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

  const handleDeleteNode = () => {
    if (selectedNode) {
      setNodes(nodes.filter((node) => node.id !== selectedNode.id));
      setIsNodeDialogOpen(false);
    }
  };

  const handleDeleteEdge = () => {
    if (selectedEdge) {
      setEdges(edges.filter((edge) => edge.id !== selectedEdge.id));
      setIsEdgeDialogOpen(false);
    }
  };

  const handleUpdateEdge = (source: string, target: string) => {
    if (selectedEdge) {
      setEdges(edges.map((edge) => 
        edge.id === selectedEdge.id ? { ...edge, source, target } : edge
      ));
      setIsEdgeDialogOpen(false);
    }
  };

  const handleZoomIn = () => {
    reactFlowInstance.zoomIn();
  };

  const handleZoomOut = () => {
    reactFlowInstance.zoomOut();
  };

  const handleFitView = () => {
    reactFlowInstance.fitView();
  };

  const handleAddTemplateNode = (template: any) => {
    const newNode = createTemplateNode(template, {});
    setNodes([...nodes, newNode]);
  };

  return (
    <div className="w-full h-full flex" style={{ height: '842px' }}> {/* A4 height */}
      <SidebarPanel
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        nodeName={nodeName}
        setNodeName={setNodeName}
        onAddNode={() => {
          if (nodeName.trim()) {
            const newNode = {
              id: `node-${Date.now()}`,
              type: 'custom',
              position: { x: 100, y: 100 },
              data: { label: nodeName },
            };
            setNodes([...nodes, newNode]);
            setNodeName("");
          }
        }}
        templates={templates}
        onAddTemplate={handleAddTemplateNode}
      />
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
          <MindMapControls 
            onZoomIn={handleZoomIn} 
            onZoomOut={handleZoomOut} 
            onFitView={handleFitView} 
          />
          {showTemplates && (
            <NodeTemplates 
              templates={templates} 
              onAddTemplate={handleAddTemplateNode} 
            />
          )}
        </ReactFlow>
        
        <NodeDialog
          isOpen={isNodeDialogOpen}
          onOpenChange={setIsNodeDialogOpen}
          selectedNode={selectedNode}
          onDelete={handleDeleteNode}
        />
        
        <EdgeDialog
          isOpen={isEdgeDialogOpen}
          edge={selectedEdge}
          onClose={() => setIsEdgeDialogOpen(false)}
          onUpdate={handleUpdateEdge}
          onDelete={handleDeleteEdge}
        />
      </div>
    </div>
  );
};

export default MindMapFlow;
