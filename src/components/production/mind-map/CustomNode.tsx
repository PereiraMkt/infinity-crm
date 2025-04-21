
import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

interface CustomNodeProps {
  data: {
    label: string;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    shape?: string;
    link?: string;
  };
  isConnectable: boolean;
  selected?: boolean;
}

const CustomNode = ({ data, isConnectable, selected }: CustomNodeProps) => {
  const handleClick = () => {
    if (data.link) {
      window.open(data.link, '_blank');
    }
  };

  return (
    <div
      className={`custom-node px-4 py-2 shadow-md transition-colors ${selected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        backgroundColor: data.backgroundColor || '#8B5CF6',
        color: data.textColor || '#ffffff',
        borderColor: data.borderColor || '#6D28D9',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderRadius: data.shape === 'roundedRect' ? '8px' : 
                    data.shape === 'circle' ? '50%' : 
                    '0px',
        transform: data.shape === 'diamond' ? 'rotate(45deg)' : 'none',
        cursor: data.link ? 'pointer' : 'default'
      }}
      onClick={handleClick}
    >
      {/* Top handle */}
      <Handle
        type="source"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-2 h-2"
      />
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-2 h-2"
      />
      
      {/* Right handle */}
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-2 h-2"
      />
      <Handle
        type="target"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-2 h-2"
      />
      
      {/* Bottom handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-2 h-2"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-2 h-2"
      />
      
      {/* Left handle */}
      <Handle
        type="source"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-2 h-2"
      />
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-2 h-2"
      />
      
      <div style={{ transform: data.shape === 'diamond' ? 'rotate(-45deg)' : 'none' }}>
        {data.label}
      </div>
    </div>
  );
};

export default memo(CustomNode);
