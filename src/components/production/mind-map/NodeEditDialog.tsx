
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { HexColorPicker } from "react-colorful";
import { Node } from 'reactflow';

interface NodeEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  node: Node | null;
  onSave: (nodeId: string, data: any) => void;
}

const NodeEditDialog = ({ isOpen, onClose, node, onSave }: NodeEditDialogProps) => {
  const [label, setLabel] = useState(node?.data?.label || '');
  const [description, setDescription] = useState(node?.data?.description || '');
  const [backgroundColor, setBackgroundColor] = useState<string>(node?.style?.backgroundColor || '#ffffff');
  const [borderColor, setBorderColor] = useState<string>(node?.style?.borderColor || '#000000');
  const [textColor, setTextColor] = useState<string>(node?.style?.color || '#000000');
  const [borderStyle, setBorderStyle] = useState<string>(node?.style?.borderStyle || 'solid');
  const [borderWidth, setBorderWidth] = useState<string>(node?.style?.borderWidth || '1px');
  const [borderRadius, setBorderRadius] = useState<string>(node?.style?.borderRadius || '4px');
  const [fontSize, setFontSize] = useState<string>(node?.style?.fontSize || '14px');
  const [link, setLink] = useState(node?.data?.link || '');
  const [activeColorPicker, setActiveColorPicker] = useState<'background' | 'border' | 'text' | null>(null);

  React.useEffect(() => {
    if (isOpen && node) {
      setLabel(node.data?.label || '');
      setDescription(node.data?.description || '');
      setBackgroundColor(node.style?.backgroundColor || '#ffffff');
      setBorderColor(node.style?.borderColor || '#000000');
      setTextColor(node.style?.color || '#000000');
      setBorderStyle(node.style?.borderStyle || 'solid');
      setBorderWidth(node.style?.borderWidth || '1px');
      setBorderRadius(node.style?.borderRadius || '4px');
      setFontSize(node.style?.fontSize || '14px');
      setLink(node.data?.link || '');
    }
  }, [isOpen, node]);

  const handleSave = () => {
    if (!node) return;

    const updatedData = {
      ...node.data,
      label,
      description,
      link
    };

    const updatedStyle = {
      backgroundColor,
      borderColor,
      color: textColor,
      borderStyle,
      borderWidth,
      borderRadius,
      fontSize
    };

    onSave(node.id, { data: updatedData, style: updatedStyle });
    onClose();
  };

  const handleColorChange = (color: string) => {
    if (activeColorPicker === 'background') setBackgroundColor(color);
    if (activeColorPicker === 'border') setBorderColor(color);
    if (activeColorPicker === 'text') setTextColor(color);
  };

  if (!node) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Nó</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="node-label" className="text-right">
              Texto
            </Label>
            <Input
              id="node-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="node-description" className="text-right">
              Descrição
            </Label>
            <Textarea
              id="node-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="node-link" className="text-right">
              Link
            </Label>
            <Input
              id="node-link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="col-span-3"
              placeholder="https://..."
            />
          </div>
          
          <div className="border-t pt-4 mt-2">
            <h3 className="font-medium mb-4">Estilo e Cores</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">Cores</Label>
                <div className="flex space-x-2 mb-4">
                  <div>
                    <div 
                      className="w-8 h-8 rounded border cursor-pointer" 
                      style={{ backgroundColor }}
                      onClick={() => setActiveColorPicker(activeColorPicker === 'background' ? null : 'background')}
                    />
                    <span className="text-xs">Fundo</span>
                  </div>
                  <div>
                    <div 
                      className="w-8 h-8 rounded border cursor-pointer" 
                      style={{ backgroundColor: borderColor }}
                      onClick={() => setActiveColorPicker(activeColorPicker === 'border' ? null : 'border')}
                    />
                    <span className="text-xs">Borda</span>
                  </div>
                  <div>
                    <div 
                      className="w-8 h-8 rounded border cursor-pointer flex items-center justify-center" 
                      style={{ color: textColor }}
                      onClick={() => setActiveColorPicker(activeColorPicker === 'text' ? null : 'text')}
                    >
                      <span>T</span>
                    </div>
                    <span className="text-xs">Texto</span>
                  </div>
                </div>
                
                {activeColorPicker && (
                  <div className="mb-4">
                    <HexColorPicker 
                      color={
                        activeColorPicker === 'background' ? backgroundColor : 
                        activeColorPicker === 'border' ? borderColor : textColor
                      } 
                      onChange={handleColorChange}
                    />
                  </div>
                )}
              </div>
              
              <div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="border-style">Estilo da Borda</Label>
                    <Select value={borderStyle} onValueChange={setBorderStyle}>
                      <SelectTrigger id="border-style" className="w-full">
                        <SelectValue placeholder="Estilo de borda" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solid">Sólida</SelectItem>
                        <SelectItem value="dashed">Tracejada</SelectItem>
                        <SelectItem value="dotted">Pontilhada</SelectItem>
                        <SelectItem value="double">Dupla</SelectItem>
                        <SelectItem value="none">Sem borda</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="border-width">Espessura da Borda</Label>
                    <Select value={borderWidth} onValueChange={setBorderWidth}>
                      <SelectTrigger id="border-width" className="w-full">
                        <SelectValue placeholder="Espessura" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1px">Fina</SelectItem>
                        <SelectItem value="2px">Média</SelectItem>
                        <SelectItem value="3px">Grossa</SelectItem>
                        <SelectItem value="4px">Extra Grossa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="border-radius">Arredondamento</Label>
                    <Select value={borderRadius} onValueChange={setBorderRadius}>
                      <SelectTrigger id="border-radius" className="w-full">
                        <SelectValue placeholder="Arredondamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Sem arredondamento</SelectItem>
                        <SelectItem value="4px">Leve</SelectItem>
                        <SelectItem value="8px">Médio</SelectItem>
                        <SelectItem value="12px">Alto</SelectItem>
                        <SelectItem value="50%">Circular</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="font-size">Tamanho da Fonte</Label>
                    <Select value={fontSize} onValueChange={setFontSize}>
                      <SelectTrigger id="font-size" className="w-full">
                        <SelectValue placeholder="Tamanho" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12px">Pequena</SelectItem>
                        <SelectItem value="14px">Normal</SelectItem>
                        <SelectItem value="16px">Grande</SelectItem>
                        <SelectItem value="18px">Muito Grande</SelectItem>
                        <SelectItem value="24px">Enorme</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <Label className="mb-2 block">Pré-visualização</Label>
            <div 
              className="p-4 rounded overflow-hidden text-center"
              style={{
                backgroundColor,
                borderColor,
                color: textColor,
                borderStyle,
                borderWidth,
                borderRadius,
                fontSize,
                border: `${borderWidth} ${borderStyle} ${borderColor}`
              }}
            >
              {label || "Texto do Nó"}
              {description && <div className="text-xs mt-1 opacity-80">{description}</div>}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NodeEditDialog;
