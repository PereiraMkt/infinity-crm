
import { useState, useRef, useCallback } from "react";
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
  useReactFlow,
  NodeChange,
  Connection
} from "reactflow";
import { useToast } from "@/hooks/use-toast";
import CustomNode from "./CustomNode";
import SidebarPanel from "./SidebarPanel";
import { initialNodes, initialEdges, snapGrid } from "./constants";
import MindMapControls from "./MindMapControls";
import NodeEditDialog from "./NodeEditDialog";
import { NodeDialog, EdgeDialog } from "./NodeDialogs";
import { useNodeTemplates } from "./NodeTemplates";

// Main component for mind map flow
function MindMapFlow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { fitView, setViewport, getViewport } = useReactFlow();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [nodeName, setNodeName] = useState("");
  const [isNodeDialogOpen, setIsNodeDialogOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isEditingNode, setIsEditingNode] = useState(false);
  const [isEditingEdge, setIsEditingEdge] = useState(false);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const { toast } = useToast();
  const { templates, createTemplateNode } = useNodeTemplates();

  const nodeTypes = {
    customNode: CustomNode,
  };

  // Connection handlers
  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  // Node event handlers
  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();

    const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
    const type = event.dataTransfer.getData("application/reactflow");

    if (typeof type === "undefined" || !type || !reactFlowBounds) return;

    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    };

    const newNode = {
      id: Date.now().toString(),
      type,
      position,
      data: { 
        label: `${type} node`,
        onNameChange: handleNodeNameChange,
        onDescriptionChange: handleNodeDescriptionChange,
        onEdit: handleNodeEdit
      },
      style: {
        backgroundColor: '#ffffff',
        borderColor: '#000000',
        color: '#000000',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderRadius: '4px',
        fontSize: '14px',
      }
    };

    setNodes((nds) => nds.concat(newNode));
  };

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  // Node management functions
  const addNode = () => {
    if (nodeName.trim() === "") return;

    const newNode = {
      id: Date.now().toString(),
      type: "customNode",
      data: { 
        label: nodeName,
        onNameChange: handleNodeNameChange,
        onDescriptionChange: handleNodeDescriptionChange,
        onEdit: handleNodeEdit
      },
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
      style: {
        backgroundColor: '#ffffff',
        borderColor: '#000000',
        color: '#000000',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderRadius: '4px',
        fontSize: '14px',
      }
    };

    setNodes((nds) => nds.concat(newNode));
    setNodeName("");
    toast({
      title: "Nó adicionado",
      description: `Nó "${nodeName}" criado com sucesso.`,
    });
  };

  // Node property change handlers
  const handleNodeNameChange = (id: string, newName: string) => {
    setNodes(nodes.map(node => 
      node.id === id 
        ? { ...node, data: { ...node.data, label: newName } } 
        : node
    ));
  };

  const handleNodeDescriptionChange = (id: string, description: string) => {
    setNodes(nodes.map(node => 
      node.id === id 
        ? { ...node, data: { ...node.data, description } } 
        : node
    ));
  };

  // Open node edit dialog
  const handleNodeEdit = (id: string) => {
    const node = nodes.find(node => node.id === id);
    if (node) {
      setSelectedNode(node);
      setIsEditingNode(true);
    }
  };

  // Save node edit changes
  const handleSaveNodeEdit = (nodeId: string, updates: { data: any, style: any }) => {
    setNodes(nodes.map(node => 
      node.id === nodeId 
        ? { 
            ...node, 
            data: { ...node.data, ...updates.data }, 
            style: { ...node.style, ...updates.style }
          } 
        : node
    ));
    toast({
      title: "Nó atualizado",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  // Node interaction handlers
  const handleNodeDoubleClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setIsNodeDialogOpen(true);
  };

  const handleNodeDelete = () => {
    if (!selectedNode) return;

    setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
    setIsNodeDialogOpen(false);
    setSelectedNode(null);
    toast({
      title: "Nó removido",
      description: "O nó foi removido com sucesso.",
    });
  };

  // Edge handlers
  const handleEdgeUpdate = (event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge);
    setIsEditingEdge(true);
  };

  const handleEdgeDelete = () => {
    if (!selectedEdge) return;

    setEdges((edges) => edges.filter((edge) => edge.id !== selectedEdge.id));
    setIsEditingEdge(false);
    setSelectedEdge(null);
    toast({
      title: "Conexão removida",
      description: "A conexão foi removida com sucesso.",
    });
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
    toast({
      title: "Conexão atualizada",
      description: "A conexão foi atualizada com sucesso.",
    });
  };

  // Viewport control functions
  const handleZoomIn = () => {
    const viewport = getViewport();
    setViewport({
      x: viewport.x,
      y: viewport.y,
      zoom: viewport.zoom * 1.1
    });
  };

  const handleZoomOut = () => {
    const viewport = getViewport();
    setViewport({
      x: viewport.x,
      y: viewport.y,
      zoom: viewport.zoom * 0.9
    });
  };

  const handleFitView = () => {
    fitView({ padding: 0.2 });
  };

  // Template node function
  const addTemplateNode = (template: any) => {
    const nodeHandlers = { 
      onNameChange: handleNodeNameChange,
      onDescriptionChange: handleNodeDescriptionChange,
      onEdit: handleNodeEdit
    };
    
    const newNode = createTemplateNode(template, nodeHandlers);
    setNodes((nds) => nds.concat(newNode));
  };

  return (
    <div className="h-[calc(100vh-13rem)] flex">
      <SidebarPanel 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        nodeName={nodeName}
        setNodeName={setNodeName}
        onAddNode={addNode}
        templates={templates}
        onAddTemplate={addTemplateNode}
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
            snapToGrid={true}
            snapGrid={snapGrid}
            onNodeDoubleClick={handleNodeDoubleClick}
            onEdgeDoubleClick={handleEdgeUpdate}
            fitViewOptions={{ padding: 0.1 }}
            className="bg-secondary/50"
          >
            <Controls />
            <MiniMap zoomable pannable nodeClassName="bg-primary" />
            <Background />
            <MindMapControls
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onFitView={handleFitView}
            />
          </ReactFlow>
        </div>
      </div>

      {/* Node Edit Dialog */}
      <NodeEditDialog 
        isOpen={isEditingNode}
        onClose={() => setIsEditingNode(false)}
        node={selectedNode}
        onSave={handleSaveNodeEdit}
      />

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
