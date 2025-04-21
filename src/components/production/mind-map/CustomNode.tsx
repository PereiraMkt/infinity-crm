
import { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CustomNodeProps {
  id: string;
  data: {
    label: string;
    description?: string;
    link?: string;
    onNameChange: (id: string, name: string) => void;
    onDescriptionChange: (id: string, description: string) => void;
    onEdit: (id: string) => void;
  };
  selected: boolean;
  style?: React.CSSProperties;
}

const CustomNode = memo(({ id, data, selected, style }: CustomNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(data.label);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    data.onNameChange(id, e.target.value);
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    data.onDescriptionChange(id, e.target.value);
  };

  const handleEditButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    data.onEdit(id);
  };
  
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditText(data.label);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      data.onNameChange(id, editText);
      setIsEditing(false);
    }
    
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(data.label);
    }
  };
  
  const handleBlur = () => {
    data.onNameChange(id, editText);
    setIsEditing(false);
  };

  const openLink = () => {
    if (data.link) {
      window.open(data.link, '_blank');
    }
  };

  // Default styles if none provided
  const nodeStyle = {
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '4px',
    color: '#000000',
    fontSize: '14px',
    ...style
  };

  return (
    <>
      <div 
        className="px-4 py-2 min-w-[150px] shadow-sm min-h-[50px] flex flex-col items-center justify-center relative"
        style={nodeStyle}
        onDoubleClick={handleDoubleClick}
      >
        {/* Botão de edição visível em todos os nós */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute -top-6 -right-6 h-8 w-8 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:bg-blue-100 dark:hover:bg-blue-800/40"
          onClick={handleEditButtonClick}
        >
          <Edit size={14} />
        </Button>
        
        {data.link && (
          <div 
            className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full cursor-pointer"
            onClick={openLink}
            title="Abrir link"
          />
        )}
        
        <div className="text-center w-full">
          {isEditing ? (
            <input
              type="text" 
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              className="w-full bg-transparent border-b border-dashed border-gray-400 text-center focus:outline-none"
              autoFocus
            />
          ) : (
            data.label
          )}
        </div>
        
        {data.description && (
          <div className="text-xs opacity-70 mt-1 text-center">
            {data.description}
          </div>
        )}
      </div>
      
      {/* Handles em todos os lados */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 border-2"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 border-2"
      />
      <Handle
        type="source"
        position={Position.Left}
        className="w-3 h-3 border-2"
        id="left"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 border-2"
        id="right"
      />
    </>
  );
});

export default CustomNode;
