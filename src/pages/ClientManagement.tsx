
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";
import ClientLtvFunnel from "@/components/clients/ClientLtvFunnel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ClientManagement = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [newClientDialogOpen, setNewClientDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here we would typically save the client to a database
    // For now, we'll just show a success toast
    toast({
      title: "Cliente adicionado",
      description: "O novo cliente foi adicionado com sucesso.",
    });
    
    setNewClientDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-2 text-xs bg-card dark:bg-gray-800/60 shadow-sm"
          >
            Filtrar
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-2 text-xs bg-card dark:bg-gray-800/60 shadow-sm"
          >
            Exportar
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-2 text-xs bg-card dark:bg-gray-800/60 shadow-sm"
          >
            Relatórios
          </Button>
        </div>
        <Button size="sm" onClick={() => setNewClientDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full md:w-fit mb-6 shadow-sm bg-muted/80">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="ltv">Funil LTV</TabsTrigger>
          <TabsTrigger value="related">Relacionamento</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-0 space-y-6">
          <div className="border rounded-lg p-6 bg-card dark:bg-gray-900/70 shadow-md">
            <h3 className="text-lg font-medium mb-4">Visão Geral dos Clientes</h3>
            <p className="text-muted-foreground">
              Esta área mostrará estatísticas e informações sobre seus clientes.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="ltv" className="mt-0">
          <ClientLtvFunnel />
        </TabsContent>
        
        <TabsContent value="related" className="mt-0 space-y-6">
          <div className="border rounded-lg p-6 bg-card dark:bg-gray-900/70 shadow-md">
            <h3 className="text-lg font-medium mb-4">Atividades de Relacionamento</h3>
            <p className="text-muted-foreground">
              Aqui você verá contatos, reuniões e outras interações com seus clientes.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="reports" className="mt-0 space-y-6">
          <div className="border rounded-lg p-6 bg-card dark:bg-gray-900/70 shadow-md">
            <h3 className="text-lg font-medium mb-4">Relatórios disponíveis</h3>
            <p className="text-muted-foreground">
              Selecione um relatório para visualizar métricas de clientes.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* New Client Dialog */}
      <Dialog open={newClientDialogOpen} onOpenChange={setNewClientDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Cliente</DialogTitle>
            <DialogDescription>
              Preencha as informações abaixo para adicionar um novo cliente ao sistema.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddClient}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nome</Label>
                <Input id="name" placeholder="Nome do cliente" className="col-span-3" required />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" type="email" placeholder="email@exemplo.com" className="col-span-3" required />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Telefone</Label>
                <Input id="phone" placeholder="(00) 00000-0000" className="col-span-3" />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company" className="text-right">Empresa</Label>
                <Input id="company" placeholder="Nome da empresa" className="col-span-3" />
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" size="sm">Cancelar</Button>
              </DialogClose>
              <Button type="submit" size="sm">Adicionar Cliente</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientManagement;
