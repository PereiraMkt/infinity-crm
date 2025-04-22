
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
  Heading3,
  Link,
  Code,
  Image,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
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
      className="floating-format-toolbar absolute z-50 bg-gray-800 dark:bg-gray-900 rounded-md shadow-lg p-0.5 flex items-center gap-0.5 transition-opacity"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateX(-50%)',
      }}
    >
      <button onClick={() => onFormatAction('bold')} className="p-0.5 text-white hover:bg-gray-700 rounded">
        <Bold size={14} />
      </button>
      <button onClick={() => onFormatAction('italic')} className="p-0.5 text-white hover:bg-gray-700 rounded">
        <Italic size={14} />
      </button>
      <button onClick={() => onFormatAction('underline')} className="p-0.5 text-white hover:bg-gray-700 rounded">
        <Underline size={14} />
      </button>
      <button onClick={() => onFormatAction('strikeThrough')} className="p-0.5 text-white hover:bg-gray-700 rounded">
        <Strikethrough size={14} />
      </button>
      
      <span className="h-3 w-px bg-gray-600 mx-0.5"></span>
      
      <button onClick={() => onFormatAction('formatBlock', '<h1>')} className="p-0.5 text-white hover:bg-gray-700 rounded">
        <Heading1 size={14} />
      </button>
      <button onClick={() => onFormatAction('formatBlock', '<h2>')} className="p-0.5 text-white hover:bg-gray-700 rounded">
        <Heading2 size={14} />
      </button>
      <button onClick={() => onFormatAction('formatBlock', '<h3>')} className="p-0.5 text-white hover:bg-gray-700 rounded">
        <Heading3 size={14} />
      </button>
      
      <span className="h-3 w-px bg-gray-600 mx-0.5"></span>
      
      <button onClick={() => onFormatAction('justifyLeft')} className="p-0.5 text-white hover:bg-gray-700 rounded">
        <AlignLeft size={14} />
      </button>
      <button onClick={() => onFormatAction('justifyCenter')} className="p-0.5 text-white hover:bg-gray-700 rounded">
        <AlignCenter size={14} />
      </button>
      <button onClick={() => onFormatAction('justifyRight')} className="p-0.5 text-white hover:bg-gray-700 rounded">
        <AlignRight size={14} />
      </button>
      <button onClick={() => onFormatAction('justifyFull')} className="p-0.5 text-white hover:bg-gray-700 rounded">
        <AlignJustify size={14} />
      </button>
      
      <span className="h-3 w-px bg-gray-600 mx-0.5"></span>
      
      <button onClick={() => onFormatAction('insertUnorderedList')} className="p-0.5 text-white hover:bg-gray-700 rounded">
        <List size={14} />
      </button>
      <button onClick={() => onFormatAction('insertOrderedList')} className="p-0.5 text-white hover:bg-gray-700 rounded">
        <ListOrdered size={14} />
      </button>
      <button onClick={() => onFormatAction('formatBlock', '<blockquote>')} className="p-0.5 text-white hover:bg-gray-700 rounded">
        <Quote size={14} />
      </button>
      
      <span className="h-3 w-px bg-gray-600 mx-0.5"></span>
      
      <button onClick={() => {
        const url = prompt('Enter link URL:');
        if (url) onFormatAction('createLink', url);
      }} className="p-0.5 text-white hover:bg-gray-700 rounded">
        <Link size={14} />
      </button>
      <button onClick={() => onFormatAction('formatBlock', '<pre>')} className="p-0.5 text-white hover:bg-gray-700 rounded">
        <Code size={14} />
      </button>
      <button onClick={() => {
        const url = prompt('Enter image URL:');
        if (url) onFormatAction('insertImage', url);
      }} className="p-0.5 text-white hover:bg-gray-700 rounded">
        <Image size={14} />
      </button>
    </div>
  );
};

export default FloatingFormatToolbar;
