
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PreviewContentProps {
  content: string;
  fontFamily: string;
  textColor?: string;
  backgroundColor?: string;
  textAlignment?: string;
  lineHeight?: string;
}

const PreviewContent: React.FC<PreviewContentProps> = ({ 
  content, 
  fontFamily,
  textColor = 'black',
  backgroundColor = 'transparent',
  textAlignment = 'left',
  lineHeight = '1.5'
}) => {
  return (
    <ScrollArea className="h-full">
      <div 
        className="prose dark:prose-invert max-w-none" 
        style={{ 
          fontFamily,
          color: textColor !== 'default' ? textColor : undefined,
          backgroundColor: backgroundColor !== 'default' ? backgroundColor : undefined,
          textAlign: textAlignment as any,
          lineHeight
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      >
      </div>
    </ScrollArea>
  );
};

export default PreviewContent;
