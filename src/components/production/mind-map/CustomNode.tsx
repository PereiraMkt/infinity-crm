
import { memo } from 'react';
import { Handle, Position } from 'reactflow';

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
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    data.onNameChange(id, e.target.value);
  };

  const handleEdit = () => {
    data.onEdit(id);
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
        onDoubleClick={handleEdit}
      >
        {data.link && (
          <div 
            className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full cursor-pointer"
            onClick={openLink}
            title="Abrir link"
          />
        )}
        <div className="text-center">
          {data.label}
        </div>
        {data.description && (
          <div className="text-xs opacity-70 mt-1 text-center">
            {data.description}
          </div>
        )}
        
        {selected && (
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded shadow-sm flex">
            <button
              className="px-2 py-1 text-xs border-r"
              onClick={handleEdit}
            >
              Editar
            </button>
          </div>
        )}
      </div>
      {/* Handles on all sides */}
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
