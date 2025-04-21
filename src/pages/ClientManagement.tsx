
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, X, Filter, Download, Calendar, Mail, Phone, Tag, Edit, Trash, Search, BarChart, Users, FileText, Sort } from "lucide-react";
import ClientLtvFunnel from "@/components/clients/ClientLtvFunnel";
import { StatsCard } from "@/components/ui/stats-card";
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
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Client } from "@/types/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Mock data for clients
const mockClients: Client[] = [
  {
    id: "cl-001",
    name: "Empresa ABC Ltda",
    contact: "João Silva",
    email: "joao@empresaabc.com",
    phone: "(11) 98765-4321",
    segment: "Tecnologia",
    status: "Ativo",
    last_contact: "2023-04-01T10:30:00",
    street: "Av. Paulista, 1000",
    city: "São Paulo",
    state: "SP",
    zip: "01310-100",
    company_id: "comp-001",
    created_at: "2022-01-15T08:00:00",
    updated_at: "2023-03-20T14:45:00"
  },
  {
    id: "cl-002",
    name: "Comércio XYZ",
    contact: "Maria Oliveira",
    email: "maria@comercioxyz.com",
    phone: "(21) 99876-5432",
    segment: "Varejo",
    status: "Ativo",
    last_contact: "2023-04-10T14:20:00",
    street: "Rua do Comércio, 123",
    city: "Rio de Janeiro",
    state: "RJ",
    zip: "20010-010",
    company_id: "comp-001",
    created_at: "2022-03-05T10:15:00",
    updated_at: "2023-04-05T11:30:00"
  },
  {
    id: "cl-003",
    name: "Indústrias Modelo S/A",
    contact: "Carlos Souza",
    email: "carlos@industriasmodelo.com",
    phone: "(31) 97654-3210",
    segment: "Manufatura",
    status: "Inativo",
    street: "Distrito Industrial, 500",
    city: "Belo Horizonte",
    state: "MG",
    zip: "30666-123",
    company_id: "comp-001",
    created_at: "2021-11-10T09:45:00",
    updated_at: "2023-02-15T10:00:00"
  },
  {
    id: "cl-004",
    name: "Consultoria Eficaz",
    contact: "Ana Pereira",
    email: "ana@consultoriaeficaz.com",
    phone: "(41) 98877-6655",
    segment: "Serviços",
    status: "Ativo",
    last_contact: "2023-04-15T16:00:00",
    street: "Rua dos Consultores, 789",
    city: "Curitiba",
    state: "PR",
    zip: "80000-123",
    company_id: "comp-001",
    created_at: "2022-06-20T13:30:00",
    updated_at: "2023-04-10T09:15:00"
  }
];

// Cliente típico para criação
const emptyClient: Omit<Client, 'id' | 'company_id' | 'created_at' | 'updated_at'> = {
  name: "",
  contact: "",
  email: "",
  phone: "",
  segment: "",
  status: "Ativo",
  last_contact: "",
  street: "",
  city: "",
  state: "",
  zip: ""
};

// Interface para as notas do cliente
interface ClientNote {
  id: string;
  client_id: string;
  text: string;
  created_by: string;
  created_at: string;
}

// Mock data para as notas
const mockClientNotes: ClientNote[] = [
  {
    id: "note-001",
    client_id: "cl-001",
    text: "Cliente solicitou orçamento para expansão do serviço atual.",
    created_by: "Ana Silva",
    created_at: "2023-04-15T14:30:00"
  },
  {
    id: "note-002",
    client_id: "cl-001",
    text: "Enviado proposta comercial, aguardando retorno.",
    created_by: "Carlos Mendes",
    created_at: "2023-04-16T09:45:00"
  },
  {
    id: "note-003",
    client_id: "cl-002",
    text: "Cliente reportou problema técnico, encaminhado para suporte.",
    created_by: "Renata Lima",
    created_at: "2023-04-10T11:20:00"
  }
];

// Interface para histórico de compras
interface PurchaseHistory {
  id: string;
  client_id: string;
  product_name: string;
  date: string;
  value: number;
  payment_status: string;
}

// Mock data para histórico de compras
const mockPurchaseHistory: PurchaseHistory[] = [
  {
    id: "pur-001",
    client_id: "cl-001",
    product_name: "Software de Gestão - Licença Anual",
    date: "2023-01-15T10:00:00",
    value: 4500,
    payment_status: "Pago"
  },
  {
    id: "pur-002",
    client_id: "cl-001",
    product_name: "Consultoria Implementação",
    date: "2023-02-10T14:30:00",
    value: 2800,
    payment_status: "Pago"
  },
  {
    id: "pur-003",
    client_id: "cl-002",
    product_name: "Plataforma E-commerce - Assinatura",
    date: "2023-03-05T09:15:00",
    value: 1200,
    payment_status: "Pendente"
  },
  {
    id: "pur-004",
    client_id: "cl-003",
    product_name: "Módulo Financeiro - Addon",
    date: "2022-11-20T16:45:00",
    value: 800,
    payment_status: "Pago"
  }
];

// Interface para pesquisa de satisfação
interface SatisfactionSurvey {
  id: string;
  client_id: string;
  overall_score: number;
  support_score: number;
  product_score: number;
  comments: string;
  date: string;
}

// Mock data para pesquisas de satisfação
const mockSurveys: SatisfactionSurvey[] = [
  {
    id: "sur-001",
    client_id: "cl-001",
    overall_score: 9,
    support_score: 10,
    product_score: 8,
    comments: "Excelente atendimento, produto muito bom mas poderia ter mais recursos.",
    date: "2023-03-10T00:00:00"
  },
  {
    id: "sur-002",
    client_id: "cl-002",
    overall_score: 7,
    support_score: 6,
    product_score: 8,
    comments: "O suporte poderia ser mais rápido nas respostas.",
    date: "2023-02-15T00:00:00"
  }
];

// Interface para etiquetas de cliente
interface ClientTag {
  id: string;
  name: string;
  color: string;
}

// Mock data para etiquetas
const mockTags: ClientTag[] = [
  { id: "tag-1", name: "VIP", color: "bg-purple-500" },
  { id: "tag-2", name: "Novo Cliente", color: "bg-green-500" },
  { id: "tag-3", name: "Em Negociação", color: "bg-yellow-500" },
  { id: "tag-4", name: "Alto Potencial", color: "bg-blue-500" },
  { id: "tag-5", name: "Atenção Especial", color: "bg-red-500" }
];

// Mapeamento de clientes para etiquetas
const mockClientTags: Record<string, string[]> = {
  "cl-001": ["tag-1", "tag-4"],
  "cl-002": ["tag-2", "tag-3"],
  "cl-003": ["tag-5"],
  "cl-004": ["tag-2"]
};

const ClientManagement = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [newClientDialogOpen, setNewClientDialogOpen] = useState(false);
  const [clientViewDialogOpen, setClientViewDialogOpen] = useState(false);
  const [clientNoteDialogOpen, setClientNoteDialogOpen] = useState(false);
  const [clientTagDialogOpen, setClientTagDialogOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [clientNotes, setClientNotes] = useState<ClientNote[]>(mockClientNotes);
  const [newClient, setNewClient] = useState<Omit<Client, 'id' | 'company_id' | 'created_at' | 'updated_at'>>(emptyClient);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [newNote, setNewNote] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [clientTags, setClientTags] = useState<Record<string, string[]>>(mockClientTags);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Filtrar clientes baseado na pesquisa
  const filteredClients = clients.filter(client => {
    const matchesSearch = searchQuery === "" || 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      client.contact?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      client.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedFilter === "all" || client.status.toLowerCase() === selectedFilter.toLowerCase();
    
    const matchesTag = !selectedTag || (clientTags[client.id] && clientTags[client.id].includes(selectedTag));
    
    return matchesSearch && matchesStatus && matchesTag;
  });

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newClient.name.trim()) {
      toast({
        title: "Erro ao adicionar cliente",
        description: "Nome do cliente é obrigatório.",
        variant: "destructive"
      });
      return;
    }
    
    const currentDate = new Date().toISOString();
    const newClientData: Client = {
      ...newClient,
      id: `cl-${Math.floor(Math.random() * 10000)}`,
      company_id: "comp-001",
      created_at: currentDate,
      updated_at: currentDate
    };
    
    setClients([...clients, newClientData]);
    setNewClient(emptyClient);
    setNewClientDialogOpen(false);
    
    toast({
      title: "Cliente adicionado",
      description: `${newClient.name} foi adicionado com sucesso.`,
    });
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setClientViewDialogOpen(true);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newNote.trim() || !selectedClient) {
      toast({
        title: "Erro ao adicionar nota",
        description: "O texto da nota é obrigatório.",
        variant: "destructive"
      });
      return;
    }
    
    const newNoteData: ClientNote = {
      id: `note-${Math.floor(Math.random() * 10000)}`,
      client_id: selectedClient.id,
      text: newNote,
      created_by: "Usuário Atual",
      created_at: new Date().toISOString()
    };
    
    setClientNotes([...clientNotes, newNoteData]);
    setNewNote("");
    setClientNoteDialogOpen(false);
    
    toast({
      title: "Nota adicionada",
      description: "A nota foi adicionada com sucesso.",
    });
  };

  const handleAddTagToClient = (clientId: string, tagId: string) => {
    const currentTags = clientTags[clientId] || [];
    if (!currentTags.includes(tagId)) {
      setClientTags({
        ...clientTags,
        [clientId]: [...currentTags, tagId]
      });
      
      toast({
        title: "Etiqueta adicionada",
        description: "A etiqueta foi adicionada ao cliente com sucesso.",
      });
    }
    setClientTagDialogOpen(false);
  };

  const handleRemoveTagFromClient = (clientId: string, tagId: string) => {
    const currentTags = clientTags[clientId] || [];
    setClientTags({
      ...clientTags,
      [clientId]: currentTags.filter(id => id !== tagId)
    });
    
    toast({
      title: "Etiqueta removida",
      description: "A etiqueta foi removida do cliente com sucesso.",
    });
  };

  const getClientNotesForClient = (clientId: string) => {
    return clientNotes.filter(note => note.client_id === clientId);
  };

  const getClientPurchasesForClient = (clientId: string) => {
    return mockPurchaseHistory.filter(purchase => purchase.client_id === clientId);
  };

  const getClientSurveysForClient = (clientId: string) => {
    return mockSurveys.filter(survey => survey.client_id === clientId);
  };

  const getTagsForClient = (clientId: string) => {
    const tagIds = clientTags[clientId] || [];
    return mockTags.filter(tag => tagIds.includes(tag.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Pesquisar clientes..."
              className="pl-9 min-w-[200px] sm:min-w-[240px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select
            value={selectedFilter}
            onValueChange={setSelectedFilter}
          >
            <SelectTrigger className="w-[120px] h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="ativo">Ativos</SelectItem>
              <SelectItem value="inativo">Inativos</SelectItem>
              <SelectItem value="prospect">Prospects</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={selectedTag || ""}
            onValueChange={(value) => setSelectedTag(value === "" ? null : value)}
          >
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue placeholder="Etiqueta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas</SelectItem>
              {mockTags.map(tag => (
                <SelectItem key={tag.id} value={tag.id}>
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${tag.color}`}></span>
                    <span>{tag.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9"
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button 
            size="sm" 
            onClick={() => setNewClientDialogOpen(true)}
            className="h-9"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatsCard
          title="Total de Clientes"
          value={clients.filter(c => c.status === "Ativo").length.toString()}
          icon={<Users className="h-5 w-5 text-muted-foreground" />}
          trend={{
            value: 12,
            label: "últimos 30 dias",
            positive: true
          }}
        />
        <StatsCard
          title="Faturamento Médio"
          value="R$ 3.450"
          icon={<BarChart className="h-5 w-5 text-muted-foreground" />}
          trend={{
            value: 8,
            label: "em relação ao mês anterior",
            positive: true
          }}
        />
        <StatsCard
          title="Satisfação do Cliente"
          value="8.7"
          icon={<FileText className="h-5 w-5 text-muted-foreground" />}
          trend={{
            value: 2,
            label: "em relação ao mês anterior",
            positive: true
          }}
        />
      </div>

      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 md:grid-cols-3 w-full md:w-fit mb-6 shadow-sm bg-muted/80">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="related">Relacionamento</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-0 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Lista de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Segmento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Etiquetas</TableHead>
                      <TableHead>Último Contato</TableHead>
                      <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/10 text-primary/80">
                                {client.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              {client.name}
                              {client.city && client.state && (
                                <div className="text-xs text-muted-foreground">
                                  {client.city}, {client.state}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{client.segment || "-"}</TableCell>
                        <TableCell>
                          <Badge
                            variant={client.status === "Ativo" ? "default" : "secondary"}
                            className={client.status === "Ativo" ? "bg-green-500" : ""}
                          >
                            {client.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{client.contact}</span>
                            <span className="text-xs text-muted-foreground">{client.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {getTagsForClient(client.id).map(tag => (
                              <Badge key={tag.id} className={`${tag.color} text-white`}>
                                {tag.name}
                              </Badge>
                            ))}
                            {getTagsForClient(client.id).length === 0 && "-"}
                          </div>
                        </TableCell>
                        <TableCell>
                          {client.last_contact ? new Date(client.last_contact).toLocaleDateString() : "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleViewClient(client)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" 
                              onClick={() => {
                                setSelectedClient(client);
                                setClientTagDialogOpen(true);
                              }}>
                              <Tag className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredClients.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          Nenhum cliente encontrado com os filtros atuais.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="related" className="mt-0 space-y-6">
          {selectedClient ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{selectedClient.name}</h3>
                  <p className="text-muted-foreground">{selectedClient.segment} - {selectedClient.status}</p>
                </div>
                <Button variant="outline" onClick={() => setSelectedClient(null)}>
                  Voltar para lista
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Histórico de Compras</CardTitle>
                    <Button variant="ghost" size="sm">
                      Ver tudo
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {getClientPurchasesForClient(selectedClient.id).length > 0 ? (
                        getClientPurchasesForClient(selectedClient.id).map(purchase => (
                          <div key={purchase.id} className="flex justify-between items-start border-b pb-3">
                            <div>
                              <p className="font-medium">{purchase.product_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(purchase.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">R$ {purchase.value.toFixed(2)}</p>
                              <Badge variant={purchase.payment_status === "Pago" ? "default" : "outline"}>
                                {purchase.payment_status}
                              </Badge>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-muted-foreground py-8">
                          Nenhuma compra registrada para este cliente.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Pesquisas de Satisfação</CardTitle>
                    <Button variant="ghost" size="sm">
                      Nova Pesquisa
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {getClientSurveysForClient(selectedClient.id).length > 0 ? (
                        getClientSurveysForClient(selectedClient.id).map(survey => (
                          <div key={survey.id} className="border-b pb-3">
                            <div className="flex justify-between items-center mb-2">
                              <p className="font-medium">Pesquisa de {new Date(survey.date).toLocaleDateString()}</p>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                Pontuação: {survey.overall_score}/10
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-2">
                              <div>
                                <p className="text-sm text-muted-foreground">Suporte</p>
                                <p className="font-medium">{survey.support_score}/10</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Produto</p>
                                <p className="font-medium">{survey.product_score}/10</p>
                              </div>
                            </div>
                            {survey.comments && (
                              <div>
                                <p className="text-sm text-muted-foreground">Comentários:</p>
                                <p className="text-sm">{survey.comments}</p>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-muted-foreground py-8">
                          Nenhuma pesquisa registrada para este cliente.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Notas e Anotações</CardTitle>
                  <Button 
                    onClick={() => setClientNoteDialogOpen(true)}
                    size="sm"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nova Nota
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getClientNotesForClient(selectedClient.id).length > 0 ? (
                      getClientNotesForClient(selectedClient.id).map(note => (
                        <div key={note.id} className="border-b pb-3">
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-semibold">{note.created_by}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(note.created_at).toLocaleDateString()} {new Date(note.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                          <p>{note.text}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        Nenhuma nota registrada para este cliente.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/60" />
                  <h3 className="text-xl font-semibold mb-2">Relacionamento com Clientes</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Selecione um cliente da lista para visualizar seu histórico de compras, pesquisas de satisfação e notas de relacionamento.
                  </p>
                  <Button onClick={() => setActiveTab("overview")}>
                    Ver Lista de Clientes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="reports" className="mt-0 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Relatórios de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Button variant="outline" className="h-24 flex flex-col p-4 justify-center items-center text-center">
                  <Users className="h-8 w-8 mb-2" />
                  <span>Segmentação de Clientes</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col p-4 justify-center items-center text-center">
                  <BarChart className="h-8 w-8 mb-2" />
                  <span>Desempenho de Vendas</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col p-4 justify-center items-center text-center">
                  <Calendar className="h-8 w-8 mb-2" />
                  <span>Histórico de Contatos</span>
                </Button>
              </div>
              
              <div className="border rounded-md p-6 text-center">
                <h3 className="text-lg font-medium mb-2">Exportar Relatório Completo</h3>
                <p className="text-muted-foreground mb-4">
                  Gere um relatório completo com todos os dados dos clientes, histórico de compras, interações e métricas.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    CSV
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    PDF
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Excel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Métricas de Relacionamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="font-medium mb-2">Tempo Médio de Resposta</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Suporte</span>
                    <span className="font-medium">4.2 horas</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Comercial</span>
                    <span className="font-medium">6.8 horas</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Financeiro</span>
                    <span className="font-medium">12.1 horas</span>
                  </div>
                </div>
                <div>
                  <p className="font-medium mb-2">Taxa de Satisfação</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Atendimento</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Produto</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Geral</span>
                    <span className="font-medium">89%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para novo cliente */}
      <Dialog open={newClientDialogOpen} onOpenChange={setNewClientDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Cliente</DialogTitle>
            <DialogDescription>
              Preencha as informações abaixo para adicionar um novo cliente ao sistema.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddClient}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome/Empresa</Label>
                  <Input 
                    id="name" 
                    value={newClient.name}
                    onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Nome do Contato</Label>
                  <Input 
                    id="contact"
                    value={newClient.contact || ""}
                    onChange={(e) => setNewClient({...newClient, contact: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={newClient.email || ""}
                    onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input 
                    id="phone"
                    value={newClient.phone || ""}
                    onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="segment">Segmento</Label>
                  <Select 
                    value={newClient.segment || ""}
                    onValueChange={(value) => setNewClient({...newClient, segment: value})}
                  >
                    <SelectTrigger id="segment">
                      <SelectValue placeholder="Selecione o segmento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                      <SelectItem value="Varejo">Varejo</SelectItem>
                      <SelectItem value="Manufatura">Manufatura</SelectItem>
                      <SelectItem value="Serviços">Serviços</SelectItem>
                      <SelectItem value="Educação">Educação</SelectItem>
                      <SelectItem value="Saúde">Saúde</SelectItem>
                      <SelectItem value="Finanças">Finanças</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={newClient.status}
                    onValueChange={(value) => setNewClient({...newClient, status: value})}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                      <SelectItem value="Prospect">Prospect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Endereço</Label>
                  <Input 
                    id="street"
                    value={newClient.street || ""}
                    onChange={(e) => setNewClient({...newClient, street: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input 
                    id="city"
                    value={newClient.city || ""}
                    onChange={(e) => setNewClient({...newClient, city: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input 
                      id="state"
                      value={newClient.state || ""}
                      onChange={(e) => setNewClient({...newClient, state: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">CEP</Label>
                    <Input 
                      id="zip"
                      value={newClient.zip || ""}
                      onChange={(e) => setNewClient({...newClient, zip: e.target.value})}
                    />
                  </div>
                </div>
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

      {/* Dialog para visualizar cliente */}
      <Dialog open={clientViewDialogOpen} onOpenChange={setClientViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Dados do Cliente</DialogTitle>
          </DialogHeader>
          
          {selectedClient && (
            <div className="py-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{selectedClient.name}</h3>
                <Badge
                  variant={selectedClient.status === "Ativo" ? "default" : "secondary"}
                  className={selectedClient.status === "Ativo" ? "bg-green-500" : ""}
                >
                  {selectedClient.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Contato</p>
                  <p>{selectedClient.contact || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Segmento</p>
                  <p>{selectedClient.segment || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{selectedClient.email || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p>{selectedClient.phone || "-"}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-sm text-muted-foreground">Endereço</p>
                <p>
                  {[
                    selectedClient.street,
                    selectedClient.city,
                    selectedClient.state,
                    selectedClient.zip
                  ].filter(Boolean).join(", ") || "-"}
                </p>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Etiquetas</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => setClientTagDialogOpen(true)}
                  >
                    <Tag className="h-3.5 w-3.5 mr-1" />
                    Adicionar
                  </Button>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {getTagsForClient(selectedClient.id).map(tag => (
                    <Badge key={tag.id} className={`${tag.color} text-white`}>
                      {tag.name}
                      <button 
                        className="ml-1 hover:bg-black/20 rounded"
                        onClick={() => handleRemoveTagFromClient(selectedClient.id, tag.id)}
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  ))}
                  {getTagsForClient(selectedClient.id).length === 0 && 
                    <p className="text-muted-foreground text-sm">Nenhuma etiqueta atribuída</p>
                  }
                </div>
              </div>
              
              <div className="border-t pt-4 mt-6 flex justify-between">
                <p className="text-xs text-muted-foreground">
                  Cliente desde: {new Date(selectedClient.created_at).toLocaleDateString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  Última atualização: {new Date(selectedClient.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setClientViewDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para adicionar nota */}
      <Dialog open={clientNoteDialogOpen} onOpenChange={setClientNoteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Nota</DialogTitle>
            <DialogDescription>
              Adicione uma nota ou anotação sobre o cliente.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddNote}>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="note" className="mb-2 block">
                  Nota
                </Label>
                <Textarea
                  id="note"
                  placeholder="Digite sua nota aqui..."
                  rows={5}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setClientNoteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Adicionar Nota
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para adicionar etiquetas */}
      <Dialog open={clientTagDialogOpen} onOpenChange={setClientTagDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Gerenciar Etiquetas</DialogTitle>
            <DialogDescription>
              Adicione etiquetas ao cliente para melhor organização.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              {mockTags.map(tag => {
                const isSelected = selectedClient && clientTags[selectedClient.id]?.includes(tag.id);
                
                return (
                  <div key={tag.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${tag.color}`}></span>
                      <span>{tag.name}</span>
                    </div>
                    
                    <Button
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className="h-8"
                      onClick={() => {
                        if (selectedClient) {
                          if (isSelected) {
                            handleRemoveTagFromClient(selectedClient.id, tag.id);
                          } else {
                            handleAddTagToClient(selectedClient.id, tag.id);
                          }
                        }
                      }}
                    >
                      {isSelected ? "Remover" : "Adicionar"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setClientTagDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientManagement;
