
import React from 'react';
import FontControls from './toolbar/FontControls';
import ColorControls from './toolbar/ColorControls';
import AlignmentControls from './toolbar/AlignmentControls';
import LineHeightControls from './toolbar/LineHeightControls';
import TextStyleControls from './toolbar/TextStyleControls';
import HeadingControls from './toolbar/HeadingControls';
import ListControls from './toolbar/ListControls';
import MediaControls from './toolbar/MediaControls';
import ToolbarDivider from './toolbar/ToolbarDivider';
import ParagraphControls from './toolbar/ParagraphControls';

interface FormatToolbarProps {
  fontFamily: string;
  textColor?: string;
  backgroundColor?: string;
  textAlignment?: string;
  lineHeight?: string;
  onUpdateFormatting?: (property: string, value: string) => void;
}

const FormatToolbar: React.FC<FormatToolbarProps> = ({
  fontFamily,
  textColor = "#000000",
  backgroundColor = "#ffffff",
  textAlignment = "left",
  lineHeight = "1.5",
  onUpdateFormatting
}) => {
  const handleUpdateFormat = (property: string, value: string) => {
    if (onUpdateFormatting) {
      onUpdateFormatting(property, value);
    }
  };

  const handleFormatAction = (action: string) => {
    // Handle formatting actions like bold, italic, etc.
    console.log('Format action:', action);
  };

  return (
    <div className="border-b p-2 flex flex-wrap gap-1 items-center">
      <FontControls 
        fontFamily={fontFamily} 
        handleFormatAction={(action, value) => handleUpdateFormat(action, value)} 
      />
      <ToolbarDivider />
      <HeadingControls handleFormatAction={handleFormatAction} />
      <ToolbarDivider />
      <TextStyleControls handleFormatAction={handleFormatAction} />
      <ToolbarDivider />
      <ParagraphControls handleFormatAction={handleFormatAction} />
      <ToolbarDivider />
      <AlignmentControls 
        currentAlignment={textAlignment} 
        handleFormatAction={(action) => {
          const value = action.replace('align-', '');
          handleUpdateFormat('textAlignment', value);
        }} 
      />
      <ToolbarDivider />
      <LineHeightControls 
        lineHeight={lineHeight} 
        handleFormatAction={(action, value) => handleUpdateFormat(action, value)} 
      />
      <ToolbarDivider />
      <ListControls handleFormatAction={handleFormatAction} />
      <ToolbarDivider />
      <ColorControls 
        currentTextColor={textColor} 
        currentBackgroundColor={backgroundColor} 
        handleFormatAction={(action) => {
          if (action.startsWith('color-')) {
            const value = action.replace('color-', '');
            handleUpdateFormat('textColor', value);
          } else if (action.startsWith('bg-')) {
            const value = action.replace('bg-', '');
            handleUpdateFormat('backgroundColor', value);
          }
        }}
      />
      <ToolbarDivider />
      <MediaControls handleFormatAction={handleFormatAction} />
    </div>
  );
};

export default FormatToolbar;
