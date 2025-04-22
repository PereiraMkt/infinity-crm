import React, { useState } from "react";
import { ChevronDown, MessageCircle, Users, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Define types for our contacts
interface BaseContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  unread: number;
}
interface PersonContact extends BaseContact {
  status: 'online' | 'away' | 'offline';
}
interface GroupContact extends BaseContact {
  // Groups don't have a status property
}
type Contact = PersonContact | GroupContact;
const UnifiedChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("interno");
  const [activeChannelTab, setActiveChannelTab] = useState("chat");
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (selectedChat) {
      setSelectedChat(null);
    }
  };
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Logic to send message
      setMessage("");
    }
  };

  // Mock contacts
  const internalContacts: PersonContact[] = [{
    id: "1",
    name: "Ana Silva",
    status: "online",
    avatar: "",
    lastMessage: "Podemos revisar o documento?",
    unread: 2
  }, {
    id: "2",
    name: "João Santos",
    status: "away",
    avatar: "",
    lastMessage: "Projeto concluído!",
    unread: 0
  }, {
    id: "3",
    name: "Maria Oliveira",
    status: "offline",
    avatar: "",
    lastMessage: "Vou enviar os relatórios amanhã",
    unread: 0
  }];
  const groupContacts: GroupContact[] = [{
    id: "g1",
    name: "Equipe de Marketing",
    avatar: "",
    lastMessage: "Carlos: Campanha finalizada",
    unread: 3
  }, {
    id: "g2",
    name: "Projeto X",
    avatar: "",
    lastMessage: "Ana: Reunião às 14h",
    unread: 0
  }];
  const externalContacts: PersonContact[] = [{
    id: "e1",
    name: "Cliente ABC",
    status: "online",
    avatar: "",
    lastMessage: "Quando podemos agendar uma reunião?",
    unread: 1
  }, {
    id: "e2",
    name: "Fornecedor XYZ",
    status: "offline",
    avatar: "",
    lastMessage: "Orçamento enviado",
    unread: 0
  }];

  // Mock messages for selected chat
  const mockMessages = [{
    id: "m1",
    sender: "other",
    text: "Olá, como está o projeto?",
    time: "10:30"
  }, {
    id: "m2",
    sender: "me",
    text: "Está andando bem! Já concluímos a fase inicial.",
    time: "10:32"
  }, {
    id: "m3",
    sender: "other",
    text: "Ótimo! Quando teremos a primeira entrega?",
    time: "10:35"
  }, {
    id: "m4",
    sender: "me",
    text: "Estamos planejando para a próxima semana, provavelmente na quarta-feira.",
    time: "10:37"
  }];
  const getContacts = () => {
    switch (activeTab) {
      case "interno":
        return internalContacts;
      case "grupos":
        return groupContacts;
      case "externo":
        return externalContacts;
      default:
        return [];
    }
  };
  const renderChatList = () => {
    const contacts = getContacts();
    return contacts.map(contact => <div key={contact.id} className="flex items-center gap-2 p-2 hover:bg-muted cursor-pointer rounded-md" onClick={() => setSelectedChat(contact.id)}>
        <Avatar className="h-10 w-10">
          {contact.avatar ? <AvatarImage src={contact.avatar} /> : <AvatarFallback>
              {contact.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>}
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between">
            <span className="font-medium text-sm">{contact.name}</span>
            {contact.unread > 0 && <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {contact.unread}
              </span>}
          </div>
          <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
        </div>
      </div>);
  };
  const renderChatMessages = () => {
    if (!selectedChat) return null;
    const contact = [...internalContacts, ...groupContacts, ...externalContacts].find(c => c.id === selectedChat);
    return <div className="flex flex-col h-full">
        <div className="border-b p-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              {contact?.avatar ? <AvatarImage src={contact.avatar} /> : <AvatarFallback>
                  {contact?.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>}
            </Avatar>
            <div>
              <div className="font-medium text-sm">{contact?.name}</div>
              {'status' in (contact || {}) && <div className="text-xs flex items-center gap-1">
                  <span className={`h-1.5 w-1.5 rounded-full ${'status' in contact && contact.status === 'online' ? 'bg-green-500' : 'status' in contact && contact.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'}`}></span>
                  {'status' in contact ? contact.status === 'online' ? 'Online' : contact.status === 'away' ? 'Ausente' : 'Offline' : 'Grupo'}
                </div>}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setSelectedChat(null)}>
            <ChevronDown size={16} />
          </Button>
        </div>
        
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-3">
            {mockMessages.map(msg => <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-2 rounded-lg ${msg.sender === 'me' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs opacity-70 text-right mt-1">{msg.time}</p>
                </div>
              </div>)}
          </div>
        </ScrollArea>
        
        <form onSubmit={handleSendMessage} className="border-t p-2 flex gap-2">
          <Input value={message} onChange={e => setMessage(e.target.value)} placeholder="Digite sua mensagem..." className="flex-1" />
          <Button type="submit" size="sm">Enviar</Button>
        </form>
      </div>;
  };
  return <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2">
      {isOpen && <Card className="w-80 h-96 flex flex-col overflow-hidden shadow-lg">
          <div className="p-2 border-b">
            <Tabs value={activeChannelTab} onValueChange={setActiveChannelTab}>
              <TabsList className="w-full">
                <TabsTrigger value="chat" className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="whatsapp" className="flex-1">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  WhatsApp
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <TabsContent value="chat" className="flex-1 flex flex-col m-0">
            {selectedChat ? renderChatMessages() : <div className="flex-1 flex flex-col">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                  <TabsList className="justify-start p-2">
                    <TabsTrigger value="interno" className="flex-1">Interno</TabsTrigger>
                    <TabsTrigger value="grupos" className="flex-1">Grupos</TabsTrigger>
                    <TabsTrigger value="externo" className="flex-1">Externo</TabsTrigger>
                  </TabsList>
                  <ScrollArea className="flex-1 p-2">
                    {renderChatList()}
                  </ScrollArea>
                </Tabs>
              </div>}
          </TabsContent>
          
          <TabsContent value="whatsapp" className="flex-1 flex items-center justify-center m-0">
            <div className="text-center p-4">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 text-green-500 opacity-60" />
              <h3 className="font-medium">WhatsApp</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Acesse suas conversas do WhatsApp integradas ao sistema
              </p>
              <Button size="sm" className="mt-4">Configurar WhatsApp</Button>
            </div>
          </TabsContent>
        </Card>}
      
      
    </div>;
};
export default UnifiedChatButton;