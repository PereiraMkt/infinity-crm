
import React from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Link,
  Code,
  Image,
  List,
  ListOrdered
} from 'lucide-react';

interface FloatingFormatToolbarProps {
  position: {
    top: number;
    left: number;
  };
  onFormatAction: (action: string, value?: string) => void;
}

const FloatingFormatToolbar: React.FC<FloatingFormatToolbarProps> = ({ position, onFormatAction }) => {
  return (
    <div 
      className="floating-format-toolbar absolute z-50 bg-gray-800 dark:bg-gray-900 rounded-md shadow-lg p-1 flex items-center gap-1 transition-opacity"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateX(-50%)',
      }}
    >
      <button onClick={() => onFormatAction('bold')} className="p-1 text-white hover:bg-gray-700 rounded">
        <Bold size={16} />
      </button>
      <button onClick={() => onFormatAction('italic')} className="p-1 text-white hover:bg-gray-700 rounded">
        <Italic size={16} />
      </button>
      <button onClick={() => onFormatAction('underline')} className="p-1 text-white hover:bg-gray-700 rounded">
        <Underline size={16} />
      </button>
      <span className="h-4 w-px bg-gray-600 mx-1"></span>
      
      <button onClick={() => onFormatAction('formatBlock', '<h1>')} className="p-1 text-white hover:bg-gray-700 rounded">
        <Heading1 size={16} />
      </button>
      <button onClick={() => onFormatAction('formatBlock', '<h2>')} className="p-1 text-white hover:bg-gray-700 rounded">
        <Heading2 size={16} />
      </button>
      <span className="h-4 w-px bg-gray-600 mx-1"></span>
      
      <button onClick={() => onFormatAction('justifyLeft')} className="p-1 text-white hover:bg-gray-700 rounded">
        <AlignLeft size={16} />
      </button>
      <button onClick={() => onFormatAction('justifyCenter')} className="p-1 text-white hover:bg-gray-700 rounded">
        <AlignCenter size={16} />
      </button>
      <button onClick={() => onFormatAction('justifyRight')} className="p-1 text-white hover:bg-gray-700 rounded">
        <AlignRight size={16} />
      </button>
      <button onClick={() => onFormatAction('justifyFull')} className="p-1 text-white hover:bg-gray-700 rounded">
        <AlignJustify size={16} />
      </button>
      <span className="h-4 w-px bg-gray-600 mx-1"></span>
      
      <button onClick={() => onFormatAction('insertUnorderedList')} className="p-1 text-white hover:bg-gray-700 rounded">
        <List size={16} />
      </button>
      <button onClick={() => onFormatAction('insertOrderedList')} className="p-1 text-white hover:bg-gray-700 rounded">
        <ListOrdered size={16} />
      </button>
      <span className="h-4 w-px bg-gray-600 mx-1"></span>
      
      <button onClick={() => {
        const url = prompt('Enter link URL:');
        if (url) onFormatAction('createLink', url);
      }} className="p-1 text-white hover:bg-gray-700 rounded">
        <Link size={16} />
      </button>
      <button onClick={() => onFormatAction('formatBlock', '<pre>')} className="p-1 text-white hover:bg-gray-700 rounded">
        <Code size={16} />
      </button>
      <button onClick={() => {
        const url = prompt('Enter image URL:');
        if (url) onFormatAction('insertImage', url);
      }} className="p-1 text-white hover:bg-gray-700 rounded">
        <Image size={16} />
      </button>
    </div>
  );
};

export default FloatingFormatToolbar;
