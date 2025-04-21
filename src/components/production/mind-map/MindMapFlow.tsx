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
  Viewport
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
  const { fitView, addNodes, setViewport, getViewport } = useReactFlow();
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

  const onConnect = useCallback((params: any) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

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
      data: { 
        label: `${type} node`,
        onNameChange: handleNodeNameChange,
        onDescriptionChange: handleNodeDescriptionChange,
        onStyleChange: handleNodeStyleChange
      },
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
      type: "customNode",
      data: { 
        label: nodeName,
        onNameChange: handleNodeNameChange,
        onDescriptionChange: handleNodeDescriptionChange,
        onStyleChange: handleNodeStyleChange
      },
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
    };

    setNodes((nds) => nds.concat(newNode));
    setNodeName("");
    toast({
      title: "Nó adicionado",
      description: `Nó "${nodeName}" criado com sucesso.`,
    });
  };

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

  const handleNodeStyleChange = (id: string, styleProps: any) => {
    setNodes(nodes.map(node => 
      node.id === id 
        ? { ...node, data: { ...node.data, ...styleProps } } 
        : node
    ));
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
    toast({
      title: "Nó removido",
      description: "O nó foi removido com sucesso.",
    });
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

  const handleZoomIn = () => {
    const currentViewport = getViewport();
    setViewport({
      x: currentViewport.x,
      y: currentViewport.y,
      zoom: currentViewport.zoom * 1.1
    });
  };

  const handleZoomOut = () => {
    const currentViewport = getViewport();
    setViewport({
      x: currentViewport.x,
      y: currentViewport.y,
      zoom: currentViewport.zoom * 0.9
    });
  };

  const handleFitView = () => {
    fitView({ padding: 0.2 });
  };

  const onNodesChangeCustom = (changes: NodeChange[]) => {
    onNodesChange(changes);
  };

  const templates = [
    { id: 'decision', name: 'Decisão', shape: 'diamond', color: '#fee2e2' },
    { id: 'process', name: 'Processo', shape: 'rectangle', color: '#dbeafe' },
    { id: 'input', name: 'Entrada', shape: 'ellipse', color: '#dcfce7' },
    { id: 'output', name: 'Saída', shape: 'roundedRectangle', color: '#f3e8ff' },
    { id: 'funnel', name: 'Funil', shape: 'funnel', color: '#fef3c7' },
  ];

  const addTemplateNode = (template: any) => {
    const newNode = {
      id: Date.now().toString(),
      type: "customNode",
      data: { 
        label: template.name,
        backgroundColor: template.color,
        shape: template.shape,
        onNameChange: handleNodeNameChange,
        onDescriptionChange: handleNodeDescriptionChange,
        onStyleChange: handleNodeStyleChange
      },
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
    };

    setNodes((nds) => nds.concat(newNode));
    toast({
      title: "Template adicionado",
      description: `Template "${template.name}" criado com sucesso.`,
    });
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
            onNodesChange={onNodesChangeCustom}
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
