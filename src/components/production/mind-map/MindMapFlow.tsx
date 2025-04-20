
import { useState, useRef } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  useReactFlow
} from "reactflow";
import { useToast } from "@/hooks/use-toast";
import CustomNode from "./CustomNode";
import NodeDialog from "./NodeDialog";
import EdgeDialog from "./EdgeDialog";
import SidebarPanel from "./SidebarPanel";
import { initialNodes, initialEdges, snapGrid } from "./constants";

// Main component for mind map flow
function MindMapFlow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { fitView, addNodes, setViewport } = useReactFlow();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [nodeName, setNodeName] = useState("");
  const [isNodeDialogOpen, setIsNodeDialogOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isEditingEdge, setIsEditingEdge] = useState(false);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const { toast } = useToast();

  const nodeTypes = {
    customNode: CustomNode,
  };
  
  const edgeTypes = {};

  const onConnect = (params: any) => setEdges((eds) => addEdge(params, eds));

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();

    const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
    const type = event.dataTransfer.getData("application/reactflow");

    // check if the dropped element is valid
    if (typeof type === "undefined" || !type) {
      return;
    }

    if (!reactFlowBounds) return;

    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    };

    const newNode = {
      id: Date.now().toString(),
      type,
      position,
      data: { label: `${type} node` },
    };

    setNodes((nds) => nds.concat(newNode));
  };

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const addNode = () => {
    if (nodeName.trim() === "") return;

    const newNode = {
      id: Date.now().toString(),
      data: { label: nodeName },
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
    };

    setNodes((nds) => nds.concat(newNode));
    setNodeName("");
  };

  const handleNodeDoubleClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setIsNodeDialogOpen(true);
  };

  const handleNodeDelete = () => {
    if (!selectedNode) return;

    setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
    setIsNodeDialogOpen(false);
    setSelectedNode(null);
  };

  const handleEdgeUpdate = (event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge);
    setIsEditingEdge(true);
  };

  const handleEdgeDelete = () => {
    if (!selectedEdge) return;

    setEdges((edges) => edges.filter((edge) => edge.id !== selectedEdge.id));
    setIsEditingEdge(false);
    setSelectedEdge(null);
  };

  const handleEdgeUpdateConfirm = (source: string, target: string) => {
    if (!selectedEdge) return;

    const updatedEdge = {
      ...selectedEdge,
      source,
      target,
    };

    setEdges((edges) =>
      edges.map((edge) => (edge.id === selectedEdge.id ? updatedEdge : edge))
    );
    setIsEditingEdge(false);
    setSelectedEdge(null);
  };

  // Fixed viewport handling
  const handleZoomIn = () => {
    setViewport({
      x: 0,
      y: 0,
      zoom: 1.1, // Increase zoom level
    });
  };

  const handleZoomOut = () => {
    setViewport({
      x: 0, 
      y: 0,
      zoom: 0.9, // Decrease zoom level
    });
  };

  const handleFitView = () => {
    fitView();
  };

  return (
    <div className="h-[calc(100vh-13rem)] flex">
      <SidebarPanel 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        nodeName={nodeName}
        setNodeName={setNodeName}
        onAddNode={addNode}
      />

      {/* Mind Map */}
      <div className="flex-1">
        <div className="h-full" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            snapToGrid={true}
            snapGrid={snapGrid}
            onNodeDoubleClick={handleNodeDoubleClick}
            onEdgeDoubleClick={handleEdgeUpdate}
            fitViewOptions={{ padding: 0.1 }}
            className="bg-secondary/50"
          >
            <Controls />
            <MiniMap />
            <Background />
          </ReactFlow>
        </div>
      </div>

      {/* Node Delete Dialog */}
      <NodeDialog 
        isOpen={isNodeDialogOpen}
        onOpenChange={setIsNodeDialogOpen}
        selectedNode={selectedNode}
        onDelete={handleNodeDelete}
      />

      {/* Edge Edit Dialog */}
      <EdgeDialog 
        isOpen={isEditingEdge}
        edge={selectedEdge}
        onClose={() => setIsEditingEdge(false)}
        onUpdate={handleEdgeUpdateConfirm}
        onDelete={handleEdgeDelete}
      />
    </div>
  );
}

export default MindMapFlow;
