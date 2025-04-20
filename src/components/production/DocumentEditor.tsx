
import { useState, useEffect } from "react";
import { Pencil, Eye, ChevronLeft, ChevronRight, FileText, Folder, FolderPlus, FilePlus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tree, TreeItem } from "@/components/ui/tree";
import FormatToolbar from "./document-editor/FormatToolbar";
import EditorContent from "./document-editor/EditorContent";
import PreviewContent from "./document-editor/PreviewContent";
import { cn } from "@/lib/utils";

interface DocumentFolder {
  id: string;
  name: string;
  files: Document[];
  folders?: DocumentFolder[];
}

interface Document {
  id: string;
  name: string;
  content: string;
  fontFamily: string;
  textColor: string;
  backgroundColor: string;
  textAlignment: string;
}

const DocumentEditor = () => {
  const [view, setView] = useState<"edit" | "preview">("edit");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [content, setContent] = useState<string>("# Documento sem título\n\nComece a digitar seu conteúdo aqui...");
  const [fontFamily, setFontFamily] = useState<string>("Inter");
  const [textColor, setTextColor] = useState<string>("#1f2937");
  const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff");
  const [textAlignment, setTextAlignment] = useState<string>("left");
  const [folders, setFolders] = useState<DocumentFolder[]>([
    {
      id: "1",
      name: "Documentos",
      files: [
        { id: "1", name: "Documento 1", content: "# Documento 1\n\nConteúdo do documento 1...", fontFamily: "Inter", textColor: "#1f2937", backgroundColor: "#ffffff", textAlignment: "left" },
        { id: "2", name: "Documento 2", content: "# Documento 2\n\nConteúdo do documento 2...", fontFamily: "Inter", textColor: "#1f2937", backgroundColor: "#ffffff", textAlignment: "left" }
      ],
      folders: [
        {
          id: "2",
          name: "Procedimentos",
          files: [
            { id: "3", name: "Procedimento 1", content: "# Procedimento 1\n\nPassos do procedimento 1...", fontFamily: "Inter", textColor: "#1f2937", backgroundColor: "#ffffff", textAlignment: "left" }
          ]
        }
      ]
    }
  ]);
  const [activeDocument, setActiveDocument] = useState<Document | null>(null);
  const [newItemName, setNewItemName] = useState<string>("");
  const [isCreatingFile, setIsCreatingFile] = useState<boolean>(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState<boolean>(false);
  const [currentFolderId, setCurrentFolderId] = useState<string>("1");

  useEffect(() => {
    // Set the first document as active by default
    if (folders.length > 0 && folders[0].files.length > 0 && !activeDocument) {
      setActiveDocument(folders[0].files[0]);
      setContent(folders[0].files[0].content);
      setFontFamily(folders[0].files[0].fontFamily);
      setTextColor(folders[0].files[0].textColor);
      setBackgroundColor(folders[0].files[0].backgroundColor);
      setTextAlignment(folders[0].files[0].textAlignment);
    }
  }, [folders, activeDocument]);

  const findFolderById = (id: string, folderList: DocumentFolder[]): DocumentFolder | null => {
    for (const folder of folderList) {
      if (folder.id === id) return folder;
      if (folder.folders) {
        const found = findFolderById(id, folder.folders);
        if (found) return found;
      }
    }
    return null;
  };

  const findDocumentById = (id: string, folderList: DocumentFolder[]): Document | null => {
    for (const folder of folderList) {
      const file = folder.files.find(f => f.id === id);
      if (file) return file;
      if (folder.folders) {
        const found = findDocumentById(id, folder.folders);
        if (found) return found;
      }
    }
    return null;
  };

  const handleUpdateContent = (newContent: string) => {
    setContent(newContent);
    if (activeDocument) {
      // Update the content in the activeDocument
      const updatedDocument = { ...activeDocument, content: newContent };
      setActiveDocument(updatedDocument);
      
      // Update the content in the folders structure
      const updateDocumentInFolders = (folderList: DocumentFolder[]): DocumentFolder[] => {
        return folderList.map(folder => {
          const updatedFiles = folder.files.map(file => 
            file.id === activeDocument.id ? updatedDocument : file
          );
          
          return {
            ...folder,
            files: updatedFiles,
            folders: folder.folders ? updateDocumentInFolders(folder.folders) : undefined
          };
        });
      };
      
      setFolders(updateDocumentInFolders(folders));
    }
  };

  const handleUpdateFormatting = (property: string, value: string) => {
    if (property === 'fontFamily') setFontFamily(value);
    if (property === 'textColor') setTextColor(value);
    if (property === 'backgroundColor') setBackgroundColor(value);
    if (property === 'textAlignment') setTextAlignment(value);
    
    if (activeDocument) {
      // Update the formatting in the activeDocument
      const updatedDocument = { ...activeDocument, [property]: value };
      setActiveDocument(updatedDocument);
      
      // Update the formatting in the folders structure
      const updateDocumentInFolders = (folderList: DocumentFolder[]): DocumentFolder[] => {
        return folderList.map(folder => {
          const updatedFiles = folder.files.map(file => 
            file.id === activeDocument.id ? updatedDocument : file
          );
          
          return {
            ...folder,
            files: updatedFiles,
            folders: folder.folders ? updateDocumentInFolders(folder.folders) : undefined
          };
        });
      };
      
      setFolders(updateDocumentInFolders(folders));
    }
  };

  const handleCreateFile = () => {
    if (newItemName.trim() === "") return;
    
    const newFile: Document = {
      id: Date.now().toString(),
      name: newItemName,
      content: `# ${newItemName}\n\nNovo documento...`,
      fontFamily: "Inter",
      textColor: "#1f2937",
      backgroundColor: "#ffffff",
      textAlignment: "left"
    };
    
    const updateFoldersWithNewFile = (folderList: DocumentFolder[]): DocumentFolder[] => {
      return folderList.map(folder => {
        if (folder.id === currentFolderId) {
          return {
            ...folder,
            files: [...folder.files, newFile]
          };
        }
        
        return {
          ...folder,
          folders: folder.folders ? updateFoldersWithNewFile(folder.folders) : undefined
        };
      });
    };
    
    setFolders(updateFoldersWithNewFile(folders));
    setIsCreatingFile(false);
    setNewItemName("");
    setActiveDocument(newFile);
    setContent(newFile.content);
  };

  const handleCreateFolder = () => {
    if (newItemName.trim() === "") return;
    
    const newFolder: DocumentFolder = {
      id: Date.now().toString(),
      name: newItemName,
      files: []
    };
    
    const updateFoldersWithNewFolder = (folderList: DocumentFolder[]): DocumentFolder[] => {
      return folderList.map(folder => {
        if (folder.id === currentFolderId) {
          return {
            ...folder,
            folders: [...(folder.folders || []), newFolder]
          };
        }
        
        return {
          ...folder,
          folders: folder.folders ? updateFoldersWithNewFolder(folder.folders) : undefined
        };
      });
    };
    
    setFolders(updateFoldersWithNewFolder(folders));
    setIsCreatingFolder(false);
    setNewItemName("");
  };

  const handleDeleteDocument = (documentId: string) => {
    const updateFoldersRemoveDocument = (folderList: DocumentFolder[]): DocumentFolder[] => {
      return folderList.map(folder => {
        return {
          ...folder,
          files: folder.files.filter(file => file.id !== documentId),
          folders: folder.folders ? updateFoldersRemoveDocument(folder.folders) : undefined
        };
      });
    };
    
    setFolders(updateFoldersRemoveDocument(folders));
    
    // If active document is deleted, set the first available document as active
    if (activeDocument && activeDocument.id === documentId) {
      let firstAvailableDoc: Document | null = null;
      
      const findFirstDoc = (folderList: DocumentFolder[]) => {
        for (const folder of folderList) {
          if (folder.files.length > 0) {
            firstAvailableDoc = folder.files[0];
            return;
          }
          if (folder.folders) findFirstDoc(folder.folders);
        }
      };
      
      findFirstDoc(folders);
      setActiveDocument(firstAvailableDoc);
      if (firstAvailableDoc) {
        setContent(firstAvailableDoc.content);
        setFontFamily(firstAvailableDoc.fontFamily);
        setTextColor(firstAvailableDoc.textColor);
        setBackgroundColor(firstAvailableDoc.backgroundColor);
        setTextAlignment(firstAvailableDoc.textAlignment);
      } else {
        setContent("");
      }
    }
  };

  const handleDeleteFolder = (folderId: string) => {
    const updateFoldersRemoveFolder = (folderList: DocumentFolder[]): DocumentFolder[] => {
      return folderList
        .filter(folder => folder.id !== folderId)
        .map(folder => ({
          ...folder,
          folders: folder.folders ? updateFoldersRemoveFolder(folder.folders) : undefined
        }));
    };
    
    setFolders(updateFoldersRemoveFolder(folders));
  };

  const renderTreeItems = (folderList: DocumentFolder[]) => {
    return folderList.map(folder => (
      <TreeItem 
        key={folder.id}
        id={`folder-${folder.id}`}
        icon={<Folder className="h-4 w-4" />}
        label={folder.name}
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Pencil className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => {
                  setCurrentFolderId(folder.id);
                  setIsCreatingFile(true);
                }}
              >
                <FilePlus className="h-4 w-4 mr-2" />
                Novo Documento
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => {
                  setCurrentFolderId(folder.id);
                  setIsCreatingFolder(true);
                }}
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                Nova Pasta
              </DropdownMenuItem>
              {folder.id !== "1" && (
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={() => handleDeleteFolder(folder.id)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Excluir Pasta
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        }
      >
        {folder.files.map(file => (
          <TreeItem 
            key={file.id}
            id={`file-${file.id}`}
            icon={<FileText className="h-4 w-4" />}
            label={file.name}
            onClick={() => {
              setActiveDocument(file);
              setContent(file.content);
              setFontFamily(file.fontFamily);
              setTextColor(file.textColor);
              setBackgroundColor(file.backgroundColor);
              setTextAlignment(file.textAlignment);
            }}
            className={activeDocument?.id === file.id ? "bg-primary/10" : ""}
            actions={
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => handleDeleteDocument(file.id)}
              >
                <Trash className="h-3 w-3 text-red-500" />
              </Button>
            }
          />
        ))}
        {folder.folders && renderTreeItems(folder.folders)}
      </TreeItem>
    ));
  };

  return (
    <div className="h-[calc(100vh-13rem)] flex">
      {/* Documents Sidebar */}
      <div 
        className={cn(
          "flex-shrink-0 border-r transition-all duration-300 flex flex-col",
          sidebarOpen ? "w-[240px]" : "w-0 overflow-hidden"
        )}
      >
        <div className="flex items-center justify-between p-3 border-b">
          <h2 className="font-medium text-sm">Documentos</h2>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={() => {
                setCurrentFolderId("1");
                setIsCreatingFile(true);
              }}
            >
              <FilePlus className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={() => {
                setCurrentFolderId("1");
                setIsCreatingFolder(true);
              }}
            >
              <FolderPlus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-2">
          <Tree>
            {renderTreeItems(folders)}
          </Tree>
          
          {isCreatingFile && (
            <div className="mt-2 p-2 bg-secondary/50 rounded-md">
              <Input
                placeholder="Nome do documento"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="mb-2 text-xs"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => {
                  setIsCreatingFile(false);
                  setNewItemName("");
                }}>
                  Cancelar
                </Button>
                <Button size="sm" onClick={handleCreateFile}>
                  Criar
                </Button>
              </div>
            </div>
          )}
          
          {isCreatingFolder && (
            <div className="mt-2 p-2 bg-secondary/50 rounded-md">
              <Input
                placeholder="Nome da pasta"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="mb-2 text-xs"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => {
                  setIsCreatingFolder(false);
                  setNewItemName("");
                }}>
                  Cancelar
                </Button>
                <Button size="sm" onClick={handleCreateFolder}>
                  Criar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Sidebar Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-4 left-0 z-10 h-7 w-7 bg-card shadow-md rounded-r-md rounded-l-none border-l-0"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        <div className="border-b p-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm">{activeDocument?.name || "Sem título"}</h3>
          </div>
          <Tabs 
            value={view} 
            onValueChange={(v) => setView(v as "edit" | "preview")}
            className="ml-auto"
          >
            <TabsList className="h-8">
              <TabsTrigger value="edit" className="text-xs px-3">
                <Pencil className="h-3.5 w-3.5 mr-1.5" />
                Editar
              </TabsTrigger>
              <TabsTrigger value="preview" className="text-xs px-3">
                <Eye className="h-3.5 w-3.5 mr-1.5" />
                Visualizar
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {view === "edit" && (
          <>
            <FormatToolbar 
              fontFamily={fontFamily}
              textColor={textColor}
              backgroundColor={backgroundColor}
              textAlignment={textAlignment}
              onUpdateFormatting={handleUpdateFormatting}
            />
            <Separator />
            <div className="flex-1 overflow-auto">
              <Card className="m-4 shadow-sm h-[calc(100%-2rem)]">
                <CardContent className="p-0">
                  <EditorContent 
                    content={content} 
                    fontFamily={fontFamily}
                    textColor={textColor}
                    backgroundColor={backgroundColor}
                    textAlignment={textAlignment}
                    onUpdateContent={handleUpdateContent}
                  />
                </CardContent>
              </Card>
            </div>
          </>
        )}
        
        {view === "preview" && (
          <div className="flex-1 overflow-auto">
            <Card className="m-4 shadow-sm h-[calc(100%-2rem)]">
              <CardContent className="p-4">
                <PreviewContent 
                  content={content}
                  fontFamily={fontFamily}
                  textColor={textColor}
                  backgroundColor={backgroundColor}
                  textAlignment={textAlignment}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentEditor;
