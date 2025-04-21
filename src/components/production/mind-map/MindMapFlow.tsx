
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
  Connection,
  Panel
} from "reactflow";
import { 
  useToast
} from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Palette, Settings, ZoomIn, ZoomOut } from "lucide-react";

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
  const [showStylePanel, setShowStylePanel] = useState(false);
  const [defaultNodeColor, setDefaultNodeColor] = useState("#ffffff");
  const [defaultBorderColor, setDefaultBorderColor] = useState("#000000");
  const [defaultTextColor, setDefaultTextColor] = useState("#000000");
  const [defaultBorderStyle, setDefaultBorderStyle] = useState("solid");
  const [defaultBorderWidth, setDefaultBorderWidth] = useState("1px");
  const [defaultBorderRadius, setDefaultBorderRadius] = useState("4px");
  
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
        backgroundColor: defaultNodeColor,
        borderColor: defaultBorderColor,
        color: defaultTextColor,
        borderStyle: defaultBorderStyle,
        borderWidth: defaultBorderWidth,
        borderRadius: defaultBorderRadius,
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
        backgroundColor: defaultNodeColor,
        borderColor: defaultBorderColor,
        color: defaultTextColor,
        borderStyle: defaultBorderStyle,
        borderWidth: defaultBorderWidth,
        borderRadius: defaultBorderRadius,
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

  // Style all nodes with the current default styles
  const applyStylesToAllNodes = () => {
    const updatedNodes = nodes.map(node => ({
      ...node,
      style: {
        ...node.style,
        backgroundColor: defaultNodeColor,
        borderColor: defaultBorderColor,
        color: defaultTextColor,
        borderStyle: defaultBorderStyle,
        borderWidth: defaultBorderWidth,
        borderRadius: defaultBorderRadius,
      }
    }));
    
    setNodes(updatedNodes);
    
    toast({
      title: "Estilos aplicados",
      description: "Os estilos foram aplicados a todos os nós com sucesso.",
    });
  };

  // Template node function
  const addTemplateNode = (template: any) => {
    const nodeHandlers = { 
      onNameChange: handleNodeNameChange,
      onDescriptionChange: handleNodeDescriptionChange,
      onEdit: handleNodeEdit
    };
    
    const newNode = createTemplateNode(template, nodeHandlers);
    // Apply current default styles to template node
    newNode.style = {
      ...newNode.style,
      backgroundColor: defaultNodeColor,
      borderColor: defaultBorderColor,
      color: defaultTextColor,
      borderStyle: defaultBorderStyle,
      borderWidth: defaultBorderWidth,
      borderRadius: defaultBorderRadius,
    };
    
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
            
            {/* Style Panel */}
            <Panel position="top-right" className="z-10">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setShowStylePanel(!showStylePanel)}
                  className="bg-white dark:bg-gray-800 shadow-md"
                >
                  <Palette size={18} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleZoomIn}
                  className="bg-white dark:bg-gray-800 shadow-md"
                >
                  <ZoomIn size={18} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleZoomOut}
                  className="bg-white dark:bg-gray-800 shadow-md"
                >
                  <ZoomOut size={18} />
                </Button>
              </div>
              
              {showStylePanel && (
                <div className="mt-2 p-4 bg-white dark:bg-gray-800 rounded-md shadow-md border min-w-[230px]">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">Estilos dos Nós</h3>
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setShowStylePanel(false)}>
                      <span>×</span>
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="node-color" className="text-xs">Cor do Fundo</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="node-color"
                          type="color"
                          value={defaultNodeColor}
                          onChange={(e) => setDefaultNodeColor(e.target.value)}
                          className="w-12 h-8 p-1"
                        />
                        <Input 
                          type="text"
                          value={defaultNodeColor}
                          onChange={(e) => setDefaultNodeColor(e.target.value)}
                          className="flex-1 h-8"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="border-color" className="text-xs">Cor da Borda</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="border-color"
                          type="color"
                          value={defaultBorderColor}
                          onChange={(e) => setDefaultBorderColor(e.target.value)}
                          className="w-12 h-8 p-1"
                        />
                        <Input 
                          type="text"
                          value={defaultBorderColor}
                          onChange={(e) => setDefaultBorderColor(e.target.value)}
                          className="flex-1 h-8"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="text-color" className="text-xs">Cor do Texto</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="text-color"
                          type="color"
                          value={defaultTextColor}
                          onChange={(e) => setDefaultTextColor(e.target.value)}
                          className="w-12 h-8 p-1"
                        />
                        <Input 
                          type="text"
                          value={defaultTextColor}
                          onChange={(e) => setDefaultTextColor(e.target.value)}
                          className="flex-1 h-8"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="border-style" className="text-xs">Estilo da Borda</Label>
                      <Select value={defaultBorderStyle} onValueChange={setDefaultBorderStyle}>
                        <SelectTrigger id="border-style" className="h-8">
                          <SelectValue placeholder="Estilo da borda" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solid">Sólida</SelectItem>
                          <SelectItem value="dashed">Tracejada</SelectItem>
                          <SelectItem value="dotted">Pontilhada</SelectItem>
                          <SelectItem value="double">Dupla</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="border-width" className="text-xs">Espessura da Borda</Label>
                      <Select value={defaultBorderWidth} onValueChange={setDefaultBorderWidth}>
                        <SelectTrigger id="border-width" className="h-8">
                          <SelectValue placeholder="Espessura da borda" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1px">Fina (1px)</SelectItem>
                          <SelectItem value="2px">Média (2px)</SelectItem>
                          <SelectItem value="3px">Grossa (3px)</SelectItem>
                          <SelectItem value="4px">Muito Grossa (4px)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="border-radius" className="text-xs">Arredondamento</Label>
                      <Select value={defaultBorderRadius} onValueChange={setDefaultBorderRadius}>
                        <SelectTrigger id="border-radius" className="h-8">
                          <SelectValue placeholder="Arredondamento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0px">Sem arredondamento</SelectItem>
                          <SelectItem value="4px">Suave (4px)</SelectItem>
                          <SelectItem value="8px">Médio (8px)</SelectItem>
                          <SelectItem value="16px">Alto (16px)</SelectItem>
                          <SelectItem value="24px">Muito Alto (24px)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      className="w-full mt-2" 
                      onClick={applyStylesToAllNodes}
                      size="sm"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Aplicar a Todos os Nós
                    </Button>
                  </div>
                </div>
              )}
            </Panel>
            
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
