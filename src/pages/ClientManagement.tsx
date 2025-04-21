
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Search, Plus, Download, FileEdit, Trash2, Star, StarHalf, Phone, Mail, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChartContainer, ChartStyle } from "@/components/ui/chart";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Bar, BarChart, Cell, Pie, PieChart } from "recharts";

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

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* NPS Overview Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">NPS - Net Promoter Score</CardTitle>
            <CardDescription>Sentimento geral dos clientes</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[160px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={npsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {npsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Detratores</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span>Neutros</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Promotores</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* LTV Growth Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">LTV - Lifetime Value</CardTitle>
            <CardDescription>Crescimento do valor do cliente</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={ltvData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <div>Crescimento Médio: <span className="font-medium text-green-500">+12%</span></div>
              <div>Total LTV: <span className="font-medium">R$180K</span></div>
            </div>
          </CardContent>
        </Card>
        
        {/* Customer Satisfaction */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Satisfação do Cliente</CardTitle>
            <CardDescription>Índice de satisfação por setor</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Suporte', value: 85 },
                    { name: 'Produto', value: 90 },
                    { name: 'Entrega', value: 78 },
                    { name: 'Preço', value: 82 }
                  ]}
                  margin={{
                    top: 5,
                    right: 5,
                    left: 5,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <TabsContent value="list" className="p-0 m-0">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>NPS</TableHead>
                  <TableHead>LTV</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map(client => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="font-medium">{client.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{client.contact}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {client.email}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {client.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        client.status === 'active' ? 'outline' :
                        client.status === 'inactive' ? 'secondary' : 'destructive'
                      }>
                        {client.status === 'active' ? 'Ativo' :
                         client.status === 'inactive' ? 'Inativo' : 'Em Risco'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {client.nps >= 9 ? (
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        ) : client.nps >= 7 ? (
                          <StarHalf className="h-4 w-4 text-yellow-500 mr-1" />
                        ) : (
                          <Star className="h-4 w-4 text-gray-300 mr-1" />
                        )}
                        <span>{client.nps}/10</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>R$ {client.ltv.toLocaleString()}</div>
                      <Progress value={client.ltv > 50000 ? 100 : (client.ltv / 500)} className="h-1" />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <FileEdit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="h-4 w-4 mr-2" />
                            Agendar Reunião
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteClient(client)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="cards" className="p-0 m-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredClients.map(client => (
          <Card key={client.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-lg">{client.name}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <FileEdit className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Calendar className="h-4 w-4 mr-2" />
                      Agendar Reunião
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDeleteClient(client)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Badge variant={
                client.status === 'active' ? 'outline' :
                client.status === 'inactive' ? 'secondary' : 'destructive'
              } className="w-fit">
                {client.status === 'active' ? 'Ativo' :
                 client.status === 'inactive' ? 'Inativo' : 'Em Risco'}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <div className="font-medium">{client.contact}</div>
                <div className="text-muted-foreground">{client.email}</div>
                <div className="text-muted-foreground">{client.phone}</div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1 flex justify-between">
                  <span>Satisfação (NPS)</span>
                  <span>{client.nps}/10</span>
                </div>
                <Progress value={client.nps * 10} className="h-1.5" />
              </div>
              <div>
                <div className="text-sm font-medium mb-1">Valor do Cliente (LTV)</div>
                <div className="font-semibold">R$ {client.ltv.toLocaleString()}</div>
              </div>
              {client.nextMeeting && (
                <div className="text-xs flex items-center text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  Próxima reunião: {new Date(client.nextMeeting).toLocaleDateString()}
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t px-6 py-3">
              <div className="flex justify-between w-full">
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                  <Phone className="h-3 w-3 mr-2" />
                  Ligar
                </Button>
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                  <Mail className="h-3 w-3 mr-2" />
                  Email
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </TabsContent>
      
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
