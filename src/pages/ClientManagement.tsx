import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MoreHorizontal, Search, Plus, Download } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ClientList } from "@/components/clients/ClientList";
import { ClientAnalytics } from "@/components/clients/ClientAnalytics";
import { ClientCard } from "@/components/clients/ClientCard";

// Mock data for NPS chart
const npsData = [
  { name: 'Detratores', value: 15, color: '#EF4444' },
  { name: 'Neutros', value: 25, color: '#F59E0B' },
  { name: 'Promotores', value: 60, color: '#10B981' }
];

// Mock data for LTV chart
const ltvData = [
  { month: 'Jan', value: 2400 },
  { month: 'Fev', value: 3200 },
  { month: 'Mar', value: 4100 },
  { month: 'Abr', value: 4800 },
  { month: 'Mai', value: 5400 },
  { month: 'Jun', value: 6200 }
];

// Mock data for clients
const clientsData = [
  {
    id: '1',
    name: 'Empresa XYZ Ltda',
    contact: 'João Silva',
    email: 'joao@xyz.com',
    phone: '(11) 9999-8888',
    status: 'active',
    nps: 9,
    ltv: 25000,
    lastContact: '2023-07-15',
    nextMeeting: '2023-07-30'
  },
  {
    id: '2',
    name: 'Tech Innovations Inc',
    contact: 'Maria Oliveira',
    email: 'maria@techinnovations.com',
    phone: '(11) 8888-7777',
    status: 'active',
    nps: 8,
    ltv: 42000,
    lastContact: '2023-07-10',
    nextMeeting: '2023-07-25'
  },
  {
    id: '3',
    name: 'Green Solutions',
    contact: 'Pedro Santos',
    email: 'pedro@greensolutions.com',
    phone: '(11) 7777-6666',
    status: 'inactive',
    nps: 6,
    ltv: 18000,
    lastContact: '2023-06-28',
    nextMeeting: null
  },
  {
    id: '4',
    name: 'Global Marketing Group',
    contact: 'Ana Ferreira',
    email: 'ana@globalmarketing.com',
    phone: '(11) 6666-5555',
    status: 'active',
    nps: 10,
    ltv: 65000,
    lastContact: '2023-07-18',
    nextMeeting: '2023-08-02'
  },
  {
    id: '5',
    name: 'Quantum Cybersecurity',
    contact: 'Rafael Lima',
    email: 'rafael@quantumcyber.com',
    phone: '(11) 5555-4444',
    status: 'at-risk',
    nps: 4,
    ltv: 30000,
    lastContact: '2023-07-05',
    nextMeeting: '2023-07-22'
  }
];

const ClientManagement = () => {
  const [viewType, setViewType] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  const filteredClients = clientsData.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    client.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClient = (client) => {
    setClientToDelete(client);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    console.log("Client would be deleted:", clientToDelete);
    // In a real implementation, this would delete the client data
    setDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full sm:max-w-[400px]">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Tabs value={viewType} onValueChange={setViewType} className="w-auto">
            <TabsList className="grid grid-cols-2 h-8 w-[160px]">
              <TabsTrigger value="list" className="text-xs">Lista</TabsTrigger>
              <TabsTrigger value="cards" className="text-xs">Cards</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button size="sm" className="h-8">
            <Plus className="h-4 w-4 mr-1" />
            <span>Novo Cliente</span>
          </Button>
          
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <ClientAnalytics npsData={npsData} ltvData={ltvData} />
      
      <Tabs value={viewType} onValueChange={setViewType} className="w-auto">
        <TabsContent value="list" className="p-0 m-0">
          <Card>
            <CardContent className="p-0">
              <ClientList clients={filteredClients} onDeleteClient={handleDeleteClient} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cards" className="p-0 m-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredClients.map(client => (
            <ClientCard key={client.id} client={client} onDeleteClient={handleDeleteClient} />
          ))}
        </TabsContent>
      </Tabs>
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o cliente {clientToDelete?.name}? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmDelete}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientManagement;
