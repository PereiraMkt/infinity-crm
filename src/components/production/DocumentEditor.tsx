
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Image, FileText, Save, Download, Share, Plus } from "lucide-react";

const DocumentEditor = () => {
  const [documents, setDocuments] = useState([
    { id: "doc-1", name: "Relatório de Projeto", createdAt: new Date(), content: "Conteúdo do relatório de projeto..." },
    { id: "doc-2", name: "Contrato de Serviço", createdAt: new Date(), content: "Conteúdo do contrato de serviço..." },
    { id: "doc-3", name: "Proposta Comercial", createdAt: new Date(), content: "Conteúdo da proposta comercial..." }
  ]);
  
  const [activeDocument, setActiveDocument] = useState(documents[0]);
  const [fontSize, setFontSize] = useState("16");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [viewMode, setViewMode] = useState("edit"); // edit or preview

  const availableFonts = [
    "Arial", "Times New Roman", "Helvetica", "Courier New", "Georgia", "Verdana", "Palatino"
  ];

  const fontSizes = [
    "10", "12", "14", "16", "18", "20", "24", "28", "32", "36", "42", "48", "56", "64", "72"
  ];

  const handleAddDocument = () => {
    const newDoc = {
      id: `doc-${documents.length + 1}`,
      name: `Novo Documento ${documents.length + 1}`,
      createdAt: new Date(),
      content: "Insira seu conteúdo aqui..."
    };
    setDocuments([...documents, newDoc]);
    setActiveDocument(newDoc);
  };

  return (
    <div className="bg-card rounded-lg shadow-md flex flex-col h-[calc(100vh-16rem)]">
      {/* Document header with controls */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-4">
          <Select value={activeDocument.id} onValueChange={(value) => setActiveDocument(documents.find(doc => doc.id === value)!)}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Selecione um documento" />
            </SelectTrigger>
            <SelectContent>
              {documents.map((doc) => (
                <SelectItem key={doc.id} value={doc.id}>{doc.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="ghost" size="sm" onClick={handleAddDocument}>
            <Plus size={18} className="mr-1" />
            Novo
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Save size={16} />
            <span className="hidden sm:inline">Salvar</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Download size={16} />
            <span className="hidden sm:inline">Exportar</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Share size={16} />
            <span className="hidden sm:inline">Compartilhar</span>
          </Button>
        </div>
      </div>

      {/* Document toolbar */}
      <div className="p-2 border-b flex flex-wrap items-center gap-2 bg-muted/30">
        <Tabs defaultValue="paragraph" className="w-auto">
          <TabsList className="h-8">
            <TabsTrigger value="paragraph" className="text-xs">Texto</TabsTrigger>
            <TabsTrigger value="headings" className="text-xs">Títulos</TabsTrigger>
            <TabsTrigger value="lists" className="text-xs">Listas</TabsTrigger>
            <TabsTrigger value="media" className="text-xs">Mídia</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-1 ml-2">
          <Select value={fontFamily} onValueChange={setFontFamily}>
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <SelectValue placeholder="Fonte" />
            </SelectTrigger>
            <SelectContent>
              {availableFonts.map((font) => (
                <SelectItem key={font} value={font}>{font}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={fontSize} onValueChange={setFontSize}>
            <SelectTrigger className="w-[70px] h-8 text-xs">
              <SelectValue placeholder="Tamanho" />
            </SelectTrigger>
            <SelectContent>
              {fontSizes.map((size) => (
                <SelectItem key={size} value={size}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1 ml-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bold size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Italic size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <AlignLeft size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <AlignCenter size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <AlignRight size={16} />
          </Button>
        </div>

        <div className="flex items-center gap-1 ml-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <List size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ListOrdered size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Image size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <FileText size={16} />
          </Button>
        </div>

        {/* View mode toggle */}
        <div className="ml-auto">
          <Tabs value={viewMode} onValueChange={setViewMode}>
            <TabsList className="h-8">
              <TabsTrigger value="edit" className="text-xs">Edição</TabsTrigger>
              <TabsTrigger value="preview" className="text-xs">Visualização</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Document content area */}
      <div className="flex-1 overflow-auto p-8 bg-white dark:bg-gray-900 flex justify-center">
        <div className="w-[210mm] min-h-[297mm] shadow-lg bg-white dark:bg-gray-800 p-[2cm] mx-auto border">
          {viewMode === "edit" ? (
            <div 
              contentEditable={true}
              className="min-h-full focus:outline-none"
              style={{ fontFamily, fontSize: `${fontSize}px` }}
              suppressContentEditableWarning
            >
              <h1 className="text-2xl font-bold mb-4">{activeDocument.name}</h1>
              <p>{activeDocument.content}</p>
            </div>
          ) : (
            <div className="min-h-full" style={{ fontFamily, fontSize: `${fontSize}px` }}>
              <h1 className="text-2xl font-bold mb-4">{activeDocument.name}</h1>
              <p>{activeDocument.content}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;
