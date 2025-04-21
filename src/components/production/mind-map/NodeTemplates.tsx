
import { useToast } from "@/hooks/use-toast";
import { Node } from "reactflow";

export interface NodeTemplate {
  id: string;
  name: string;
  shape: string;
  color: string;
}

interface NodeTemplatesProps {
  templates: NodeTemplate[];
  onAddTemplate: (template: NodeTemplate) => void;
}

const NodeTemplates = ({ templates, onAddTemplate }: NodeTemplatesProps) => {
  return (
    <div className="mt-4">
      <h3 className="mb-2 text-sm font-medium">Templates</h3>
      <div className="grid grid-cols-2 gap-2">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onAddTemplate(template)}
            className="flex items-center p-2 rounded border border-border hover:bg-accent transition-colors"
          >
            <div
              className="h-4 w-4 rounded-sm mr-2"
              style={{ backgroundColor: template.color }}
            ></div>
            <span className="text-xs">{template.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NodeTemplates;

export const useNodeTemplates = () => {
  const { toast } = useToast();
  
  const templates: NodeTemplate[] = [
    { id: 'decision', name: 'Decisão', shape: 'diamond', color: '#fee2e2' },
    { id: 'process', name: 'Processo', shape: 'rectangle', color: '#dbeafe' },
    { id: 'input', name: 'Entrada', shape: 'ellipse', color: '#dcfce7' },
    { id: 'output', name: 'Saída', shape: 'roundedRectangle', color: '#f3e8ff' },
    { id: 'funnel', name: 'Funil', shape: 'funnel', color: '#fef3c7' },
  ];
  
  const createTemplateNode = (template: NodeTemplate, handleNodeFunctions: any) => {
    const newNode = {
      id: Date.now().toString(),
      type: "customNode",
      data: { 
        label: template.name,
        backgroundColor: template.color,
        shape: template.shape,
        ...handleNodeFunctions
      },
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
      style: {
        backgroundColor: template.color
      }
    };
    
    toast({
      title: "Template adicionado",
      description: `Template "${template.name}" criado com sucesso.`,
    });
    
    return newNode;
  };
  
  return { templates, createTemplateNode };
};
