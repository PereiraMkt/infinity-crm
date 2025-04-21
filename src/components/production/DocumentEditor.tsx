
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import FormatToolbar from './document-editor/FormatToolbar';
import EditorContent from './document-editor/EditorContent';
import PreviewContent from './document-editor/PreviewContent';
import { Button } from '@/components/ui/button';
import { Folder, Save, FileText, Download, Upload } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentEditor = () => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [content, setContent] = useState<string>('<h1>Documento Novo</h1><p>Comece a digitar seu conteúdo aqui...</p>');
  const [fontFamily, setFontFamily] = useState<string>('Inter, sans-serif');
  const [textColor, setTextColor] = useState<string>('#000000');
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
  const [textAlignment, setTextAlignment] = useState<string>('left');
  const [lineHeight, setLineHeight] = useState<string>('1.5');
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      title: 'Documento Inicial',
      content: '<h1>Documento Novo</h1><p>Comece a digitar seu conteúdo aqui...</p>',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  const [activeDocument, setActiveDocument] = useState<Document | null>(documents[0]);
  const [showFileExplorer, setShowFileExplorer] = useState(true);
  
  const { toast } = useToast();

  useEffect(() => {
    // When active document changes, update content
    if (activeDocument) {
      setContent(activeDocument.content);
    }
  }, [activeDocument]);

  const handleUpdateFormatting = (property: string, value: string) => {
    switch (property) {
      case 'fontFamily':
        setFontFamily(value);
        break;
      case 'textColor':
        setTextColor(value);
        break;
      case 'backgroundColor':
        setBackgroundColor(value);
        break;
      case 'textAlignment':
        setTextAlignment(value);
        break;
      case 'lineHeight':
        setLineHeight(value);
        break;
    }
  };

  const handleUpdateContent = (newContent: string) => {
    setContent(newContent);
    
    if (activeDocument) {
      const updatedDoc = {
        ...activeDocument,
        content: newContent,
        updatedAt: new Date()
      };
      
      // Update documents array
      setDocuments(docs => 
        docs.map(doc => doc.id === activeDocument.id ? updatedDoc : doc)
      );
      
      // Update active document
      setActiveDocument(updatedDoc);
    }
  };

  const handleSave = () => {
    if (activeDocument) {
      const updatedDoc = {
        ...activeDocument,
        content: content,
        updatedAt: new Date()
      };
      
      setDocuments(docs => 
        docs.map(doc => doc.id === activeDocument.id ? updatedDoc : doc)
      );
      
      setActiveDocument(updatedDoc);
      
      toast({
        title: "Documento salvo",
        description: `${activeDocument.title} foi salvo com sucesso.`,
      });
    }
  };

  const handleNewDocument = () => {
    const newDoc: Document = {
      id: Date.now().toString(),
      title: `Novo Documento ${documents.length + 1}`,
      content: '<h1>Documento Novo</h1><p>Comece a digitar seu conteúdo aqui...</p>',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setDocuments(prev => [...prev, newDoc]);
    setActiveDocument(newDoc);
    setContent(newDoc.content);
    
    toast({
      title: "Novo documento criado",
      description: "Um novo documento foi criado. Comece a editar!"
    });
  };

  const handleExport = () => {
    if (!activeDocument) return;
    
    // Create a Blob with the document content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${activeDocument.title}</title>
          <style>
            body {
              font-family: ${fontFamily};
              color: ${textColor};
              background-color: ${backgroundColor};
              line-height: ${lineHeight};
              text-align: ${textAlignment};
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeDocument.title}.html`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Documento exportado",
      description: `${activeDocument.title} foi exportado como HTML.`
    });
  };

  const selectDocument = (doc: Document) => {
    setActiveDocument(doc);
  };

  return (
    <div className="h-[calc(100vh-13rem)] bg-card/80 dark:bg-gray-800/40 backdrop-blur-md shadow-md border border-border/40 rounded-lg overflow-hidden flex flex-col">
      {/* Top toolbar */}
      <div className="flex items-center justify-between border-b p-2 bg-muted/30">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowFileExplorer(!showFileExplorer)}
          >
            <Folder size={18} className="mr-1" />
            {showFileExplorer ? "Ocultar arquivos" : "Mostrar arquivos"}
          </Button>
          
          <div className="h-5 border-r border-gray-300 mx-1"></div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleNewDocument}
          >
            <FileText size={18} className="mr-1" /> 
            Novo
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSave}
          >
            <Save size={18} className="mr-1" />
            Salvar
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleExport}
          >
            <Download size={18} className="mr-1" />
            Exportar
          </Button>
        </div>
        
        <div className="text-sm font-medium">
          {activeDocument?.title || "Sem título"}
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* File explorer (left sidebar) */}
        {showFileExplorer && (
          <div className="w-64 border-r overflow-auto flex flex-col bg-muted/20">
            <div className="p-3 border-b bg-muted/30 font-medium text-sm flex justify-between items-center">
              <span>Documentos</span>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleNewDocument}>
                <FileText size={16} />
              </Button>
            </div>
            <div className="overflow-auto flex-1">
              {documents.map((doc) => (
                <div 
                  key={doc.id} 
                  className={`p-2 border-b text-sm cursor-pointer hover:bg-muted/30 flex items-center ${
                    activeDocument?.id === doc.id ? 'bg-muted/40 font-medium' : ''
                  }`}
                  onClick={() => selectDocument(doc)}
                >
                  <FileText size={14} className="mr-2 text-gray-500" />
                  <div className="flex-1 overflow-hidden">
                    <div className="truncate">{doc.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(doc.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Format toolbar */}
          <FormatToolbar
            fontFamily={fontFamily}
            textColor={textColor}
            backgroundColor={backgroundColor}
            textAlignment={textAlignment}
            lineHeight={lineHeight}
            onUpdateFormatting={handleUpdateFormatting}
          />
          
          {/* Editor/Preview tabs */}
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as 'edit' | 'preview')}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="border-b bg-muted/30">
              <TabsList className="bg-transparent">
                <TabsTrigger value="edit" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">Editar</TabsTrigger>
                <TabsTrigger value="preview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">Visualizar</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="edit" className="p-2 flex-1 overflow-hidden">
              <EditorContent
                content={content}
                fontFamily={fontFamily}
                textColor={textColor}
                backgroundColor={backgroundColor}
                textAlignment={textAlignment}
                onUpdateContent={handleUpdateContent}
              />
            </TabsContent>
            
            <TabsContent value="preview" className="p-4 flex-1 overflow-auto">
              <PreviewContent
                content={content}
                fontFamily={fontFamily}
                textColor={textColor}
                backgroundColor={backgroundColor}
                textAlignment={textAlignment}
                lineHeight={lineHeight}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;
