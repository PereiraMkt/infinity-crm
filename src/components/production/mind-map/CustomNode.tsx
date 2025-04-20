
import { useState } from "react";
import { Handle, Position } from "reactflow";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface CustomNodeProps {
  data: any; 
  isConnectable: boolean;
  id: string;
}

const CustomNode = ({ data, isConnectable, id }: CustomNodeProps) => {
  const [nodeName, setNodeName] = useState(data?.label || "Novo Nó");
  const [isEditing, setIsEditing] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [nodeColor, setNodeColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#000000");
  const [nodeShape, setNodeShape] = useState("rectangle");
  const [nodeWidth, setNodeWidth] = useState(150);
  const [nodeHeight, setNodeHeight] = useState(50);
  const [isExpanded, setIsExpanded] = useState(false);
  const [nodeDescription, setNodeDescription] = useState(
    data?.description || "Adicione uma descrição..."
  );

  const handleNodeNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNodeName(event.target.value);
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNodeDescription(event.target.value);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const nodeStyle = {
    background: nodeColor,
    color: textColor,
    fontSize: `${fontSize}px`,
    width: `${nodeWidth}px`,
    height: `${nodeHeight}px`,
    borderRadius: nodeShape === "circle" ? "50%" : "0px",
    textAlign: "center" as const,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "5px",
    wordBreak: "break-word" as const,
  };

  return (
    <div className="group relative">
      {isEditing ? (
        <div className="flex flex-col">
          <Input
            type="text"
            value={nodeName}
            onChange={handleNodeNameChange}
            onBlur={() => setIsEditing(false)}
            autoFocus
            className="text-xs"
          />
        </div>
      ) : (
        <div style={nodeStyle} onClick={() => setIsEditing(true)} className="cursor-pointer">
          {nodeName}
        </div>
      )}

      <Handle type="source" position={Position.Top} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      <Handle type="target" position={Position.Right} isConnectable={isConnectable} />

      {/* Expand Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-5 w-5"
        onClick={toggleExpand}
      >
        {isExpanded ? <Minus size={14} /> : <Plus size={14} />}
      </Button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="absolute top-0 left-0 w-full h-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-10 p-4 flex flex-col">
          <h4 className="text-sm font-medium mb-2">Detalhes do Nó</h4>
          <Label htmlFor={`description-${id}`} className="text-xs">
            Descrição:
          </Label>
          <Input
            type="text"
            id={`description-${id}`}
            value={nodeDescription}
            onChange={handleDescriptionChange}
            className="text-xs mb-2"
          />
          <Label htmlFor={`font-size-${id}`} className="text-xs">
            Tamanho da Fonte:
          </Label>
          <Slider
            id={`font-size-${id}`}
            defaultValue={[fontSize]}
            min={8}
            max={32}
            step={1}
            onValueChange={(value) => setFontSize(value[0])}
            className="mb-2"
          />
          <Label htmlFor={`node-color-${id}`} className="text-xs">
            Cor do Nó:
          </Label>
          <Input
            type="color"
            id={`node-color-${id}`}
            value={nodeColor}
            onChange={(e) => setNodeColor(e.target.value)}
            className="h-8 mb-2"
          />
          <Label htmlFor={`text-color-${id}`} className="text-xs">
            Cor do Texto:
          </Label>
          <Input
            type="color"
            id={`text-color-${id}`}
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="h-8 mb-2"
          />
          <Label htmlFor={`node-width-${id}`} className="text-xs">
            Largura do Nó:
          </Label>
          <Slider
            id={`node-width-${id}`}
            defaultValue={[nodeWidth]}
            min={50}
            max={300}
            step={1}
            onValueChange={(value) => setNodeWidth(value[0])}
            className="mb-2"
          />
          <Label htmlFor={`node-height-${id}`} className="text-xs">
            Altura do Nó:
          </Label>
          <Slider
            id={`node-height-${id}`}
            defaultValue={[nodeHeight]}
            min={30}
            max={200}
            step={1}
            onValueChange={(value) => setNodeHeight(value[0])}
            className="mb-2"
          />
          <Label htmlFor={`node-shape-${id}`} className="text-xs">
            Forma do Nó:
          </Label>
          <select
            id={`node-shape-${id}`}
            value={nodeShape}
            onChange={(e) => setNodeShape(e.target.value)}
            className="w-full p-2 border rounded text-xs"
          >
            <option value="rectangle">Retângulo</option>
            <option value="circle">Círculo</option>
          </select>
          <Button variant="outline" size="sm" className="mt-auto" onClick={toggleExpand}>
            Fechar
          </Button>
        </div>
      )}
    </div>
  );
};

export default CustomNode;
