
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
  TextQuote,
  Type,
  Palette
} from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface FloatingFormatToolbarProps {
  position: {
    top: number;
    left: number;
  };
  onFormatAction: (action: string, value?: string) => void;
}

const textSizes = [
  { label: 'Small', value: '1' },
  { label: 'Normal', value: '3' },
  { label: 'Medium', value: '4' },
  { label: 'Large', value: '5' },
  { label: 'XL', value: '6' },
  { label: 'XXL', value: '7' }
];

const colors = [
  { label: 'Default', value: '#ffffff', bg: '#ffffff' },
  { label: 'Gray', value: '#9BA1A6', bg: '#9BA1A6' },
  { label: 'Brown', value: '#A46E51', bg: '#A46E51' },
  { label: 'Orange', value: '#D9730D', bg: '#D9730D' },
  { label: 'Yellow', value: '#DFAB01', bg: '#DFAB01' },
  { label: 'Green', value: '#0F7B6C', bg: '#0F7B6C' },
  { label: 'Blue', value: '#0B6E99', bg: '#0B6E99' },
  { label: 'Purple', value: '#6940A5', bg: '#6940A5' },
  { label: 'Pink', value: '#AD1A72', bg: '#AD1A72' },
  { label: 'Red', value: '#E03E3E', bg: '#E03E3E' }
];

const backgrounds = [
  { label: 'Default', value: 'transparent', bg: 'transparent' },
  { label: 'Gray', value: '#4E5255', bg: '#4E5255' },
  { label: 'Brown', value: '#5E4036', bg: '#5E4036' },
  { label: 'Orange', value: '#874B19', bg: '#874B19' },
  { label: 'Yellow', value: '#8B6F11', bg: '#8B6F11' },
  { label: 'Green', value: '#0C5956', bg: '#0C5956' },
  { label: 'Blue', value: '#04486C', bg: '#04486C' },
  { label: 'Purple', value: '#451D71', bg: '#451D71' },
  { label: 'Pink', value: '#78194A', bg: '#78194A' },
  { label: 'Red', value: '#9E2F2F', bg: '#9E2F2F' }
];

const FontSizeSelector = ({ onFormatAction }: { onFormatAction: (action: string, value?: string) => void }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button className="p-1 text-white hover:bg-gray-700 rounded">
        <Type size={16} />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
      {textSizes.map((size) => (
        <DropdownMenuItem 
          key={size.value} 
          onClick={() => onFormatAction('fontSize', size.value)}
          className="hover:bg-gray-700 cursor-pointer"
        >
          {size.label}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

const ColorSelector = ({ onFormatAction }: { onFormatAction: (action: string, value?: string) => void }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button className="p-1 text-white hover:bg-gray-700 rounded">
        <Palette size={16} />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white p-2">
      <div className="mb-2">
        <p className="text-xs text-gray-400 mb-1">Text color</p>
        <div className="grid grid-cols-5 gap-1">
          {colors.map((color) => (
            <div 
              key={color.value} 
              onClick={() => onFormatAction('foreColor', color.value)}
              className="w-5 h-5 rounded-full cursor-pointer hover:scale-110 transition-transform border border-gray-600"
              style={{ backgroundColor: color.bg }}
              title={color.label}
            />
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-1">Highlight</p>
        <div className="grid grid-cols-5 gap-1">
          {backgrounds.map((bg) => (
            <div 
              key={bg.value} 
              onClick={() => onFormatAction('hiliteColor', bg.value)}
              className="w-5 h-5 rounded-full cursor-pointer hover:scale-110 transition-transform border border-gray-600"
              style={{ backgroundColor: bg.bg }}
              title={bg.label}
            />
          ))}
        </div>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
);

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
      <button onClick={() => onFormatAction('strikeThrough')} className="p-1 text-white hover:bg-gray-700 rounded">
        <Strikethrough size={16} />
      </button>
      
      <span className="h-4 w-px bg-gray-600 mx-1"></span>
      
      <FontSizeSelector onFormatAction={onFormatAction} />
      <ColorSelector onFormatAction={onFormatAction} />
      
      <span className="h-4 w-px bg-gray-600 mx-1"></span>
      
      <button onClick={() => onFormatAction('formatBlock', '<h1>')} className="p-1 text-white hover:bg-gray-700 rounded">
        <Heading1 size={16} />
      </button>
      <button onClick={() => onFormatAction('formatBlock', '<h2>')} className="p-1 text-white hover:bg-gray-700 rounded">
        <Heading2 size={16} />
      </button>
      <button onClick={() => onFormatAction('formatBlock', '<h3>')} className="p-1 text-white hover:bg-gray-700 rounded">
        <Heading3 size={16} />
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
      <button onClick={() => onFormatAction('formatBlock', '<blockquote>')} className="p-1 text-white hover:bg-gray-700 rounded">
        <Quote size={16} />
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
      <button onClick={() => onFormatAction('formatBlock', '<blockquote>')} className="p-1 text-white hover:bg-gray-700 rounded">
        <TextQuote size={16} />
      </button>
    </div>
  );
};

export default FloatingFormatToolbar;
