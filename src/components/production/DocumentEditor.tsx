
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Bold, Italic, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, 
  ListOrdered, Image, FileText, Save, Download, Share, Plus, 
  Heading1, Heading2, Heading3, Underline, Link, Code, 
  FileSpreadsheet, FilePlus, FolderPlus, Folder, Table, Trash,
  Paintbrush, Type, Clipboard, Scissors, Play, Undo, Redo, Copy
} from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import EditorContent from "./document-editor/EditorContent";
import PreviewContent from "./document-editor/PreviewContent";

const initialDocuments = [
  { id: "doc-1", name: "Relatório de Projeto", type: "text", createdAt: new Date(), content: "# Relatório de Projeto\n\nEste é um relatório detalhado sobre o andamento do projeto.", folder: "root" },
  { id: "doc-2", name: "Contrato de Serviço", type: "text", createdAt: new Date(), content: "## Contrato de Serviço\n\nTermos e condições do contrato de prestação de serviços.", folder: "root" },
  { id: "doc-3", name: "Proposta Comercial", type: "text", createdAt: new Date(), content: "### Proposta Comercial\n\nPrezado cliente, segue nossa proposta comercial conforme solicitado.", folder: "root" },
  { id: "spreadsheet-1", name: "Orçamento 2023", type: "spreadsheet", createdAt: new Date(), content: "", folder: "Financeiro" },
  { id: "spreadsheet-2", name: "Cronograma", type: "spreadsheet", createdAt: new Date(), content: "", folder: "Projetos" }
];

const initialFolders = [
  { id: "root", name: "Raiz", parent: null },
  { id: "folder-1", name: "Projetos", parent: "root" },
  { id: "folder-2", name: "Financeiro", parent: "root" },
  { id: "folder-3", name: "Clientes", parent: "root" },
  { id: "folder-4", name: "Planejamento", parent: "folder-1" }
];

const DocumentEditor = () => {
  const [documents, setDocuments] = useState(initialDocuments);
  const [folders, setFolders] = useState(initialFolders);
  const [activeDocument, setActiveDocument] = useState(documents[0]);
  const [content, setContent] = useState(activeDocument.content);
  const [fontSize, setFontSize] = useState("16");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [textColor, setTextColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("transparent");
  const [textAlignment, setTextAlignment] = useState("left");
  const [viewMode, setViewMode] = useState("edit");
  const [currentFolder, setCurrentFolder] = useState("root");
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isNewFileDialogOpen, setIsNewFileDialogOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [newFileType, setNewFileType] = useState("text");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [itemToRename, setItemToRename] = useState<any>(null);
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);
  const [tableRows, setTableRows] = useState("3");
  const [tableColumns, setTableColumns] = useState("3");
  
  const { toast } = useToast();
  const editorRef = useRef<HTMLDivElement>(null);

  const availableFonts = [
    "Arial", "Times New Roman", "Helvetica", "Courier New", "Georgia", "Verdana", "Palatino", "Tahoma", "Trebuchet MS", "Impact"
  ];

  const fontSizes = [
    "10", "12", "14", "16", "18", "20", "24", "28", "32", "36", "42", "48", "56", "64", "72"
  ];

  const handleAddDocument = (newDoc: any) => {
    setDocuments([...documents, newDoc]);
    setActiveDocument(newDoc);
    setContent(newDoc.content);
    setIsNewFileDialogOpen(false);
    setNewFileName("");
    
    toast({
      title: "Documento criado",
      description: `${newDoc.name} foi criado com sucesso.`
    });
  };

  const handleNewFile = () => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: newFileName || `Novo Documento ${documents.length + 1}`,
      type: newFileType,
      createdAt: new Date(),
      content: newFileType === "text" ? "Digite seu conteúdo aqui..." : "",
      folder: currentFolder
    };
    
    handleAddDocument(newDoc);
  };

  const handleAddFolder = () => {
    if (!newFolderName) return;
    
    const newFolder = {
      id: `folder-${Date.now()}`,
      name: newFolderName,
      parent: currentFolder
    };
    
    setFolders([...folders, newFolder]);
    setIsNewFolderDialogOpen(false);
    setNewFolderName("");
    
    toast({
      title: "Pasta criada",
      description: `A pasta ${newFolderName} foi criada com sucesso.`
    });
  };

  const handleUpdateContent = (newContent: string) => {
    setContent(newContent);
    
    setDocuments(docs => docs.map(doc => 
      doc.id === activeDocument.id ? { ...doc, content: newContent } : doc
    ));
  };

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;
    
    const newDocuments = documents.filter(doc => !selectedItems.includes(doc.id));
    
    const foldersToDelete = new Set(selectedItems);
    let foundNew = true;
    
    while (foundNew) {
      foundNew = false;
      folders.forEach(folder => {
        if (!foldersToDelete.has(folder.id) && folder.parent && foldersToDelete.has(folder.parent)) {
          foldersToDelete.add(folder.id);
          foundNew = true;
        }
      });
    }
    
    const newFolders = folders.filter(folder => !foldersToDelete.has(folder.id));
    
    setDocuments(newDocuments);
    setFolders(newFolders);
    setSelectedItems([]);
    
    if (selectedItems.includes(activeDocument.id)) {
      if (newDocuments.length > 0) {
        setActiveDocument(newDocuments[0]);
        setContent(newDocuments[0].content);
      } else {
        setActiveDocument({ id: '', name: '', type: 'text', createdAt: new Date(), content: '', folder: 'root' });
        setContent('');
      }
    }
    
    toast({
      title: "Itens excluídos",
      description: `${selectedItems.length} item(s) excluído(s) com sucesso.`
    });
  };

  const handleSave = () => {
    setDocuments(docs => docs.map(doc => 
      doc.id === activeDocument.id ? { ...doc, content } : doc
    ));
    
    toast({
      title: "Documento salvo",
      description: `${activeDocument.name} foi salvo com sucesso.`
    });
  };

  const handleExport = () => {
    const element = document.createElement("a");
    
    if (activeDocument.type === "text") {
      const file = new Blob([content], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${activeDocument.name}.txt`;
    } else if (activeDocument.type === "spreadsheet") {
      const csvContent = "data:text/csv;charset=utf-8," + content;
      element.href = encodeURI(csvContent);
      element.download = `${activeDocument.name}.csv`;
    }
    
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Documento exportado",
      description: `${activeDocument.name} foi exportado com sucesso.`
    });
  };

  const handleRenameItem = () => {
    if (!itemToRename || !newName) return;
    
    if (itemToRename.type) {
      setDocuments(docs => docs.map(doc => 
        doc.id === itemToRename.id ? { ...doc, name: newName } : doc
      ));
      
      if (activeDocument.id === itemToRename.id) {
        setActiveDocument({...activeDocument, name: newName});
      }
    } else {
      setFolders(fs => fs.map(folder => 
        folder.id === itemToRename.id ? { ...folder, name: newName } : folder
      ));
    }
    
    setIsRenameDialogOpen(false);
    setItemToRename(null);
    setNewName("");
    
    toast({
      title: "Item renomeado",
      description: `O item foi renomeado para ${newName} com sucesso.`
    });
  };

  const handleNavigateToFolder = (folderId: string) => {
    setCurrentFolder(folderId);
    setSelectedItems([]);
  };

  const getCurrentFolderPath = () => {
    const path: { id: string, name: string }[] = [];
    let current = folders.find(f => f.id === currentFolder);
    
    while (current) {
      path.unshift({ id: current.id, name: current.name });
      current = folders.find(f => f.id === current.parent);
    }
    
    return path;
  };

  const handleInsertTable = () => {
    const rows = parseInt(tableRows);
    const cols = parseInt(tableColumns);
    
    let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%;">\n';
    
    for (let i = 0; i < rows; i++) {
      tableHTML += '  <tr>\n';
      
      for (let j = 0; j < cols; j++) {
        if (i === 0) {
          tableHTML += '    <th style="border: 1px solid #ddd; padding: 8px;">Cabeçalho</th>\n';
        } else {
          tableHTML += '    <td style="border: 1px solid #ddd; padding: 8px;">Célula</td>\n';
        }
      }
      
      tableHTML += '  </tr>\n';
    }
    
    tableHTML += '</table>';
    
    const newContent = content + '\n' + tableHTML;
    handleUpdateContent(newContent);
    
    setIsTableDialogOpen(false);
  };

  const getCurrentFolderItems = () => {
    const folderItems = folders.filter(folder => folder.parent === currentFolder);
    const documentItems = documents.filter(doc => doc.folder === currentFolder);
    
    return [...folderItems, ...documentItems];
  };

  const folderItems = getCurrentFolderItems();
  const breadcrumbPath = getCurrentFolderPath();

  return (
    <div className="bg-card rounded-lg shadow-md flex flex-col h-[calc(100vh-16rem)]">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-4">
          <Select 
            value={activeDocument.id} 
            onValueChange={(value) => {
              const doc = documents.find(d => d.id === value);
              if (doc) {
                setActiveDocument(doc);
                setContent(doc.content);
              }
            }}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Selecione um documento" />
            </SelectTrigger>
            <SelectContent>
              {documents.map((doc) => (
                <SelectItem key={doc.id} value={doc.id}>{doc.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="ghost" size="sm" onClick={() => setIsNewFileDialogOpen(true)}>
            <Plus size={18} className="mr-1" />
            Novo
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1" onClick={handleSave}>
            <Save size={16} />
            <span className="hidden sm:inline">Salvar</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1" onClick={handleExport}>
            <Download size={16} />
            <span className="hidden sm:inline">Exportar</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Share size={16} />
            <span className="hidden sm:inline">Compartilhar</span>
          </Button>
        </div>
      </div>

      <div className="p-2 border-b flex flex-wrap items-center gap-2 bg-muted/30">
        <Tabs defaultValue="paragraph" className="w-auto">
          <TabsList className="h-8">
            <TabsTrigger value="paragraph" className="text-xs">Texto</TabsTrigger>
            <TabsTrigger value="headings" className="text-xs">Títulos</TabsTrigger>
            <TabsTrigger value="lists" className="text-xs">Listas</TabsTrigger>
            <TabsTrigger value="media" className="text-xs">Mídia</TabsTrigger>
            <TabsTrigger value="tables" className="text-xs">Tabelas</TabsTrigger>
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
          
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsTableDialogOpen(true)}>
            <Table size={16} />
          </Button>
        </div>

        <div className="flex items-center gap-1 ml-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => document.execCommand('bold')}
          >
            <Bold size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => document.execCommand('italic')}
          >
            <Italic size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => document.execCommand('underline')}
          >
            <Underline size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 ${textAlignment === 'left' ? 'bg-muted' : ''}`}
            onClick={() => setTextAlignment('left')}
          >
            <AlignLeft size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 ${textAlignment === 'center' ? 'bg-muted' : ''}`}
            onClick={() => setTextAlignment('center')}
          >
            <AlignCenter size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 ${textAlignment === 'right' ? 'bg-muted' : ''}`}
            onClick={() => setTextAlignment('right')}
          >
            <AlignRight size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 ${textAlignment === 'justify' ? 'bg-muted' : ''}`}
            onClick={() => setTextAlignment('justify')}
          >
            <AlignJustify size={16} />
          </Button>
        </div>

        <div className="flex items-center gap-1 ml-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => document.execCommand('insertUnorderedList')}
          >
            <List size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => document.execCommand('insertOrderedList')}
          >
            <ListOrdered size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => document.execCommand('createLink', false, prompt('Enter link URL:'))}
          >
            <Link size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Image size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Code size={16} />
          </Button>
        </div>
        
        <div className="flex items-center gap-1 ml-2">
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="h-6 w-6 cursor-pointer border rounded p-0 m-0"
          />
          <Type size={16} className="ml-1 mr-1" />
          
          <input
            type="color"
            value={backgroundColor === "transparent" ? "#ffffff" : backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="h-6 w-6 cursor-pointer border rounded p-0 m-0"
          />
          <PaintBucket size={16} className="ml-1" />
        </div>

        <div className="flex items-center gap-1 ml-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => document.execCommand('undo')}
          >
            <Undo size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => document.execCommand('redo')}
          >
            <Redo size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => document.execCommand('copy')}
          >
            <Copy size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => document.execCommand('cut')}
          >
            <Cut size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => document.execCommand('paste')}
          >
            <Paste size={16} />
          </Button>
        </div>

        <div className="ml-auto">
          <Tabs value={viewMode} onValueChange={setViewMode}>
            <TabsList className="h-8">
              <TabsTrigger value="edit" className="text-xs">Edição</TabsTrigger>
              <TabsTrigger value="preview" className="text-xs">Visualização</TabsTrigger>
              <TabsTrigger value="files" className="text-xs">Arquivos</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-transparent dark:bg-gray-900/30">
        <TabsContent value="edit" className="h-full">
          <div className="h-full p-8 flex justify-center">
            <div className="w-[210mm] min-h-[297mm] shadow-lg bg-white dark:bg-gray-800 p-[2cm] mx-auto border">
              <EditorContent
                content={content}
                fontFamily={fontFamily}
                textColor={textColor}
                backgroundColor={backgroundColor}
                textAlignment={textAlignment}
                onUpdateContent={handleUpdateContent}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className="h-full">
          <div className="h-full p-8 flex justify-center">
            <div className="w-[210mm] min-h-[297mm] shadow-lg bg-white dark:bg-gray-800 p-[2cm] mx-auto border">
              <PreviewContent
                content={content}
                fontFamily={fontFamily}
                textColor={textColor}
                backgroundColor={backgroundColor}
                textAlignment={textAlignment}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="files" className="h-full p-4">
          <div className="bg-white dark:bg-gray-800 h-full rounded-lg border shadow-sm overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <div className="text-sm font-medium">Explorador de Arquivos</div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsNewFolderDialogOpen(true)}
                >
                  <FolderPlus size={16} className="mr-1" />
                  Nova Pasta
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsNewFileDialogOpen(true)}
                >
                  <FilePlus size={16} className="mr-1" />
                  Novo Arquivo
                </Button>
                {selectedItems.length > 0 && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        const item = folderItems.find(item => item.id === selectedItems[0]);
                        if (item) {
                          setItemToRename(item);
                          setNewName(item.name || '');
                          setIsRenameDialogOpen(true);
                        }
                      }}
                      disabled={selectedItems.length !== 1}
                    >
                      Renomear
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={handleDeleteSelected}
                    >
                      <Trash size={16} className="mr-1" />
                      Excluir
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            <div className="p-2 border-b flex items-center text-sm">
              {breadcrumbPath.map((item, index) => (
                <div key={item.id} className="flex items-center">
                  {index > 0 && <span className="mx-1">/</span>}
                  <button 
                    className="hover:underline text-blue-600 dark:text-blue-400"
                    onClick={() => handleNavigateToFolder(item.id)}
                  >
                    {item.name}
                  </button>
                </div>
              ))}
            </div>
            
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentFolder !== "root" && (
                <div 
                  className="p-3 border rounded-md flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    const currentFolderObj = folders.find(f => f.id === currentFolder);
                    if (currentFolderObj && currentFolderObj.parent) {
                      handleNavigateToFolder(currentFolderObj.parent);
                    } else {
                      handleNavigateToFolder("root");
                    }
                  }}
                >
                  <Folder size={20} className="text-yellow-500" />
                  <span>..</span>
                </div>
              )}
              
              {folderItems.map((item) => (
                <div 
                  key={item.id}
                  className={`p-3 border rounded-md flex items-center gap-2 cursor-pointer ${
                    selectedItems.includes(item.id) 
                      ? 'bg-blue-100 dark:bg-blue-800/30 border-blue-300 dark:border-blue-500' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={(e) => {
                    if (e.ctrlKey || e.metaKey) {
                      setSelectedItems(prev => 
                        prev.includes(item.id) 
                          ? prev.filter(id => id !== item.id)
                          : [...prev, item.id]
                      );
                    } else if (e.shiftKey && selectedItems.length > 0) {
                      const allIds = folderItems.map(i => i.id);
                      const lastSelectedIndex = allIds.indexOf(selectedItems[selectedItems.length - 1]);
                      const currentIndex = allIds.indexOf(item.id);
                      const start = Math.min(lastSelectedIndex, currentIndex);
                      const end = Math.max(lastSelectedIndex, currentIndex);
                      const rangeIds = allIds.slice(start, end + 1);
                      setSelectedItems([...new Set([...selectedItems, ...rangeIds])]);
                    } else {
                      setSelectedItems([item.id]);
                      
                      if ('name' in item && 'parent' in item) {
                        handleNavigateToFolder(item.id);
                      } else if ('type' in item) {
                        setActiveDocument(item);
                        setContent(item.content);
                        setViewMode('edit');
                      }
                    }
                  }}
                  onDoubleClick={() => {
                    if ('name' in item && 'parent' in item) {
                      handleNavigateToFolder(item.id);
                    } else if ('type' in item) {
                      setActiveDocument(item);
                      setContent(item.content);
                      setViewMode('edit');
                    }
                  }}
                >
                  {'parent' in item ? (
                    <Folder size={20} className="text-yellow-500" />
                  ) : ('type' in item && item.type === 'spreadsheet') ? (
                    <FileSpreadsheet size={20} className="text-green-500" />
                  ) : (
                    <FileText size={20} className="text-blue-500" />
                  )}
                  <span className="truncate">
                    {'name' in item && item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </div>

      <Dialog open={isNewFolderDialogOpen} onOpenChange={setIsNewFolderDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nova Pasta</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="folder-name" className="mb-2 block">
              Nome da Pasta
            </Label>
            <Input
              id="folder-name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Digite o nome da pasta"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewFolderDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddFolder}>Criar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isNewFileDialogOpen} onOpenChange={setIsNewFileDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Novo Arquivo</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="file-name" className="mb-2 block">
                Nome do Arquivo
              </Label>
              <Input
                id="file-name"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="Digite o nome do arquivo"
                autoFocus
              />
            </div>
            <div>
              <Label htmlFor="file-type" className="mb-2 block">
                Tipo
              </Label>
              <Select value={newFileType} onValueChange={setNewFileType}>
                <SelectTrigger id="file-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Documento de Texto</SelectItem>
                  <SelectItem value="spreadsheet">Planilha</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewFileDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleNewFile}>Criar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Renomear</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="new-name" className="mb-2 block">
              Novo Nome
            </Label>
            <Input
              id="new-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Digite o novo nome"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleRenameItem}>Renomear</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isTableDialogOpen} onOpenChange={setIsTableDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Inserir Tabela</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="table-rows" className="mb-2 block">
                Linhas
              </Label>
              <Input
                id="table-rows"
                type="number"
                min="1"
                max="20"
                value={tableRows}
                onChange={(e) => setTableRows(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="table-columns" className="mb-2 block">
                Colunas
              </Label>
              <Input
                id="table-columns"
                type="number"
                min="1"
                max="10"
                value={tableColumns}
                onChange={(e) => setTableColumns(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTableDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleInsertTable}>Inserir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentEditor;
