
import { useState } from "react";
import { Handle, Position } from "reactflow";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface CustomNodeProps {
  data: any; 
  isConnectable: boolean;
  id: string;
}

const nodeShapes = [
  { value: "rectangle", label: "Retângulo" },
  { value: "roundedRectangle", label: "Retângulo Arredondado" },
  { value: "circle", label: "Círculo" },
  { value: "ellipse", label: "Elipse" },
  { value: "diamond", label: "Diamante" },
  { value: "triangle", label: "Triângulo" },
  { value: "hexagon", label: "Hexágono" },
  { value: "cloud", label: "Nuvem" },
  { value: "funnel", label: "Funil" },
];

const CustomNode = ({ data, isConnectable, id }: CustomNodeProps) => {
  const [nodeName, setNodeName] = useState(data?.label || "Novo Nó");
  const [isEditing, setIsEditing] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [nodeColor, setNodeColor] = useState(data?.backgroundColor || "#ffffff");
  const [textColor, setTextColor] = useState(data?.textColor || "#000000");
  const [nodeShape, setNodeShape] = useState(data?.shape || "rectangle");
  const [nodeWidth, setNodeWidth] = useState(data?.width || 150);
  const [nodeHeight, setNodeHeight] = useState(data?.height || 50);
  const [isExpanded, setIsExpanded] = useState(false);
  const [nodeDescription, setNodeDescription] = useState(
    data?.description || "Adicione uma descrição..."
  );
  const [showCustomization, setShowCustomization] = useState(false);

  const handleNodeNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNodeName(event.target.value);
    if (data.onNameChange) {
      data.onNameChange(id, event.target.value);
    }
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNodeDescription(event.target.value);
    if (data.onDescriptionChange) {
      data.onDescriptionChange(id, event.target.value);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleColorChange = (color: string) => {
    setNodeColor(color);
    if (data.onStyleChange) {
      data.onStyleChange(id, { backgroundColor: color });
    }
  };

  const handleTextColorChange = (color: string) => {
    setTextColor(color);
    if (data.onStyleChange) {
      data.onStyleChange(id, { textColor: color });
    }
  };

  const handleShapeChange = (shape: string) => {
    setNodeShape(shape);
    if (data.onStyleChange) {
      data.onStyleChange(id, { shape });
    }
  };

  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value[0]);
    if (data.onStyleChange) {
      data.onStyleChange(id, { fontSize: value[0] });
    }
  };

  const handleSizeChange = (width: number, height: number) => {
    setNodeWidth(width);
    setNodeHeight(height);
    if (data.onStyleChange) {
      data.onStyleChange(id, { width, height });
    }
  };

  // Create a path for the node shape
  const getNodePath = () => {
    // Calculate dimensions based on shape
    switch (nodeShape) {
      case "diamond":
        return `M${nodeWidth/2},0 L${nodeWidth},${nodeHeight/2} L${nodeWidth/2},${nodeHeight} L0,${nodeHeight/2} Z`;
      case "triangle":
        return `M${nodeWidth/2},0 L${nodeWidth},${nodeHeight} L0,${nodeHeight} Z`;
      case "hexagon":
        const hexW = nodeWidth / 4;
        return `M${hexW},0 L${nodeWidth - hexW},0 L${nodeWidth},${nodeHeight/2} L${nodeWidth - hexW},${nodeHeight} L${hexW},${nodeHeight} L0,${nodeHeight/2} Z`;
      case "funnel":
        const topWidth = nodeWidth * 0.9;
        const bottomWidth = nodeWidth * 0.3;
        return `M${(nodeWidth - topWidth) / 2},0 
                L${(nodeWidth + topWidth) / 2},0 
                L${(nodeWidth + bottomWidth) / 2},${nodeHeight} 
                L${(nodeWidth - bottomWidth) / 2},${nodeHeight} Z`;
      default:
        return "";
    }
  };

  // Define the shape of the node
  const getNodeShape = () => {
    const style = {
      width: `${nodeWidth}px`,
      height: `${nodeHeight}px`,
      background: nodeColor,
      color: textColor,
      fontSize: `${fontSize}px`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "10px",
      transition: "all 0.2s ease",
      position: "relative" as "relative",
      border: "1px solid rgba(0,0,0,0.1)",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    };

    if (nodeShape === "circle") {
      return {
        ...style,
        borderRadius: "50%",
        width: `${Math.max(nodeWidth, nodeHeight)}px`,
        height: `${Math.max(nodeWidth, nodeHeight)}px`,
      };
    } else if (nodeShape === "roundedRectangle") {
      return { ...style, borderRadius: "10px" };
    } else if (nodeShape === "ellipse") {
      return { ...style, borderRadius: "50%", width: `${nodeWidth}px`, height: `${nodeHeight}px` };
    } else if (nodeShape === "cloud") {
      return { 
        ...style, 
        borderRadius: "30px",
        background: `radial-gradient(circle at 50% 50%, ${nodeColor} 30%, ${adjustBrightness(nodeColor, 10)} 100%)`,
      };
    } else if (["diamond", "triangle", "hexagon", "funnel"].includes(nodeShape)) {
      return { 
        ...style,
        background: "transparent", 
        border: "none",
        boxShadow: "none",
      };
    }

    return style;
  };

  // Helper to adjust brightness for gradients
  const adjustBrightness = (color: string, amount: number) => {
    const hexToRgb = (hex: string) => {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 0, b: 0 };
    };

    const rgb = hexToRgb(color);
    const newR = Math.min(255, rgb.r + amount);
    const newG = Math.min(255, rgb.g + amount);
    const newB = Math.min(255, rgb.b + amount);

    return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`;
  };

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        style={{ background: "#555" }}
      />
      <div className="relative group">
        <div style={getNodeShape()} onClick={() => setIsEditing(true)}>
          {["diamond", "triangle", "hexagon", "funnel"].includes(nodeShape) ? (
            <svg style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
              <path d={getNodePath()} fill={nodeColor} stroke="rgba(0,0,0,0.1)" />
            </svg>
          ) : null}
          
          <div 
            className={`z-10 overflow-hidden text-center ${isExpanded ? "" : "truncate"}`} 
            style={{ maxWidth: '100%', maxHeight: isExpanded ? 'none' : '100%' }}
          >
            {isEditing ? (
              <Input
                type="text"
                value={nodeName}
                onChange={handleNodeNameChange}
                autoFocus
                onBlur={() => setIsEditing(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setIsEditing(false);
                }}
                style={{ color: textColor, background: 'transparent', border: 'none', textAlign: 'center' }}
                className="focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            ) : (
              <div className="font-medium">{nodeName}</div>
            )}
            {isExpanded && (
              <div className="mt-2 text-sm opacity-75">{nodeDescription}</div>
            )}
          </div>
        </div>
        
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-5 w-5 bg-background"
            onClick={toggleExpand}
          >
            {isExpanded ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
          </Button>
        </div>
        
        <Popover open={showCustomization} onOpenChange={setShowCustomization}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute -top-6 -right-6 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity bg-background"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-3">
              <h4 className="font-medium">Personalizar Nó</h4>
              
              <div className="space-y-2">
                <Label>Cor do Nó</Label>
                <div className="flex gap-2">
                  {['#ffffff', '#f3f4f6', '#fee2e2', '#fef3c7', '#dcfce7', '#dbeafe', '#f3e8ff'].map(color => (
                    <div
                      key={color}
                      className="w-6 h-6 rounded-full cursor-pointer border"
                      style={{ backgroundColor: color, borderColor: nodeColor === color ? '#000' : 'transparent' }}
                      onClick={() => handleColorChange(color)}
                    />
                  ))}
                  <input 
                    type="color" 
                    value={nodeColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-6 h-6 cursor-pointer border-0 p-0 m-0"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Cor do Texto</Label>
                <div className="flex gap-2">
                  {['#000000', '#4b5563', '#dc2626', '#d97706', '#16a34a', '#2563eb', '#7c3aed'].map(color => (
                    <div
                      key={color}
                      className="w-6 h-6 rounded-full cursor-pointer border"
                      style={{ backgroundColor: color, borderColor: textColor === color ? '#fff' : 'transparent' }}
                      onClick={() => handleTextColorChange(color)}
                    />
                  ))}
                  <input 
                    type="color" 
                    value={textColor}
                    onChange={(e) => handleTextColorChange(e.target.value)}
                    className="w-6 h-6 cursor-pointer border-0 p-0 m-0"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Forma do Nó</Label>
                <Select 
                  value={nodeShape} 
                  onValueChange={handleShapeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha a forma" />
                  </SelectTrigger>
                  <SelectContent>
                    {nodeShapes.map(shape => (
                      <SelectItem key={shape.value} value={shape.value}>{shape.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Tamanho da Fonte: {fontSize}px</Label>
                <Slider
                  value={[fontSize]}
                  min={10}
                  max={24}
                  step={1}
                  onValueChange={handleFontSizeChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Largura: {nodeWidth}px</Label>
                  <Slider
                    value={[nodeWidth]}
                    min={50}
                    max={300}
                    step={10}
                    onValueChange={(val) => handleSizeChange(val[0], nodeHeight)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Altura: {nodeHeight}px</Label>
                  <Slider
                    value={[nodeHeight]}
                    min={30}
                    max={200}
                    step={10}
                    onValueChange={(val) => handleSizeChange(nodeWidth, val[0])}
                    className="mt-2"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={nodeDescription}
                  onChange={handleDescriptionChange}
                  rows={3}
                  placeholder="Adicione uma descrição"
                  className="resize-none"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        style={{ background: "#555" }}
      />
    </>
  );
};

export default CustomNode;
