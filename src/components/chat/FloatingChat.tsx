
import { useState, useEffect } from "react";
import { MessageCircle, X, Users, Maximize2, Minimize2, Video, Plus, Edit, Send, Image, Smile, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  message: string;
  sender: string;
  timestamp: Date;
  isMe: boolean;
}

interface ChatGroup {
  id: string;
  name: string;
  members: {
    name: string;
    avatar?: string;
  }[];
  lastMessage?: string;
  unread?: number;
}

interface ChatContact {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status?: "online" | "offline" | "away";
  lastMessage?: string;
  unread?: number;
}

const mockMessages: ChatMessage[] = [
  {
    id: "1",
    message: "Olá, como está o andamento do projeto?",
    sender: "Ana Oliveira",
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    isMe: false,
  },
  {
    id: "2",
    message: "Estamos dentro do prazo. Acabei de finalizar a apresentação.",
    sender: "Você",
    timestamp: new Date(Date.now() - 1000 * 60 * 9),
    isMe: true,
  },
  {
    id: "3",
    message: "Ótimo! Podemos agendar uma reunião para amanhã?",
    sender: "Ana Oliveira",
    timestamp: new Date(Date.now() - 1000 * 60 * 8),
    isMe: false,
  },
];

const initialGroups: ChatGroup[] = [
  {
    id: "g1",
    name: "Equipe de Vendas",
    members: [
      { name: "Carlos Silva", avatar: "/avatar-placeholder.jpg" },
      { name: "Ana Oliveira" },
      { name: "João Pereira" }
    ],
    lastMessage: "Reunião às 15h",
    unread: 2,
  },
  {
    id: "g2",
    name: "Marketing",
    members: [
      { name: "Ricardo Gomes", avatar: "/avatar-placeholder.jpg" },
      { name: "Fernanda Lima" },
      { name: "Lúcia Santos" }
    ],
    lastMessage: "Campanha nova aprovada",
    unread: 0,
  },
];

const initialContacts: ChatContact[] = [
  {
    id: "c1",
    name: "Ana Oliveira",
    role: "Gerente de Vendas",
    avatar: "/avatar-placeholder.jpg",
    status: "online",
    lastMessage: "Ótimo! Podemos agendar uma reunião para amanhã?",
    unread: 1,
  },
  {
    id: "c2",
    name: "João Pereira",
    role: "Desenvolvedor",
    avatar: "/avatar-placeholder.jpg",
    status: "away",
    lastMessage: "Estou finalizando a implementação",
    unread: 0,
  },
  {
    id: "c3",
    name: "Fernanda Lima",
    role: "Designer",
    status: "offline",
    lastMessage: "Enviando os mockups em breve",
    unread: 0,
  },
];

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState("contacts");
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [groups, setGroups] = useState<ChatGroup[]>(initialGroups);
  const [contacts, setContacts] = useState<ChatContact[]>(initialContacts);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [editingGroup, setEditingGroup] = useState<ChatGroup | null>(null);
  const [activeContact, setActiveContact] = useState<ChatContact | null>(null);
  const [activeGroup, setActiveGroup] = useState<ChatGroup | null>(null);
  const [chatView, setChatView] = useState<"list" | "chat">("list");
  const { toast } = useToast();

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const backToList = () => {
    setChatView("list");
    setActiveContact(null);
    setActiveGroup(null);
  };

  const openContactChat = (contact: ChatContact) => {
    setActiveContact(contact);
    setActiveGroup(null);
    setChatView("chat");
    // Reset unread messages
    setContacts(contacts.map(c => c.id === contact.id ? {...c, unread: 0} : c));
  };

  const openGroupChat = (group: ChatGroup) => {
    setActiveGroup(group);
    setActiveContact(null);
    setChatView("chat");
    // Reset unread messages
    setGroups(groups.map(g => g.id === group.id ? {...g, unread: 0} : g));
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const newMsg: ChatMessage = {
        id: Date.now().toString(),
        message: newMessage,
        sender: "Você",
        timestamp: new Date(),
        isMe: true,
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
      
      // Update last message for active contact or group
      if (activeContact) {
        setContacts(contacts.map(c => 
          c.id === activeContact.id ? {...c, lastMessage: newMessage} : c
        ));
      } else if (activeGroup) {
        setGroups(groups.map(g => 
          g.id === activeGroup.id ? {...g, lastMessage: newMessage} : g
        ));
      }
      
      // Simulate response after delay
      setTimeout(() => {
        const response: ChatMessage = {
          id: (Date.now() + 1).toString(),
          message: "Obrigado pela mensagem! Confirmaremos isso com a equipe.",
          sender: activeContact ? activeContact.name : (activeGroup ? "Membro do grupo" : "Desconhecido"),
          timestamp: new Date(),
          isMe: false,
        };
        setMessages(prev => [...prev, response]);
      }, 1500);
    }
  };

  const addNewGroup = () => {
    if (newGroupName.trim()) {
      const newGroup: ChatGroup = {
        id: `g${Date.now()}`,
        name: newGroupName,
        members: [{ name: "Carlos Silva (Você)", avatar: "/avatar-placeholder.jpg" }],
        lastMessage: "Grupo criado",
        unread: 0,
      };
      setGroups([...groups, newGroup]);
      setNewGroupName("");
      setIsAddingGroup(false);
      toast({
        title: "Grupo criado",
        description: `O grupo "${newGroupName}" foi criado com sucesso.`,
      });
    }
  };

  const saveEditingGroup = () => {
    if (editingGroup && editingGroup.name.trim()) {
      setGroups(groups.map(g => g.id === editingGroup.id ? editingGroup : g));
      setEditingGroup(null);
      toast({
        title: "Grupo atualizado",
        description: "As informações do grupo foram atualizadas.",
      });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Chatbox header based on active contact or group
  const renderChatHeader = () => {
    if (chatView === "list") {
      return (
        <div className="flex items-center gap-2">
          {activeTab === "contacts" ? (
            <MessageCircle size={18} />
          ) : (
            <Users size={18} />
          )}
          <span className="font-medium">
            {activeTab === "contacts" ? "Conversas" : "Grupos"}
          </span>
        </div>
      );
    } else if (activeContact) {
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={activeContact.avatar} alt={activeContact.name} />
            <AvatarFallback>{activeContact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <span className="font-medium text-sm">{activeContact.name}</span>
            <div className="text-xs opacity-80 flex items-center gap-1">
              <span className={cn(
                "w-2 h-2 rounded-full inline-block",
                activeContact.status === "online" ? "bg-green-500" :
                  activeContact.status === "away" ? "bg-yellow-500" : "bg-gray-400"
              )}></span>
              {activeContact.status === "online" ? "Online" : 
                activeContact.status === "away" ? "Ausente" : "Offline"}
            </div>
          </div>
        </div>
      );
    } else if (activeGroup) {
      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>{activeGroup.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <span className="font-medium text-sm">{activeGroup.name}</span>
            <div className="text-xs opacity-80">
              {activeGroup.members.length} membros
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      {/* Chat button */}
      <Button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50 bg-primary hover:bg-primary/90"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat window */}
      {isOpen && (
        <div 
          className={cn(
            "fixed right-6 rounded-xl shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 z-50 transition-all duration-300 overflow-hidden",
            isMaximized 
              ? "inset-4 w-auto h-auto" 
              : "bottom-24 w-64 h-80"
          )}
        >
          {/* Header */}
          <div className="bg-primary text-white p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {chatView === "chat" && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-white hover:bg-primary/80 mr-1"
                  onClick={backToList}
                  aria-label="Back"
                >
                  <X size={16} />
                </Button>
              )}
              {renderChatHeader()}
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-white hover:bg-primary/80"
                onClick={toggleMaximize}
                aria-label={isMaximized ? "Minimize" : "Maximize"}
              >
                {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-white hover:bg-primary/80"
                onClick={toggleChat}
                aria-label="Close chat"
              >
                <X size={16} />
              </Button>
            </div>
          </div>

          {chatView === "list" ? (
            /* Contact/Group List View */
            <Tabs 
              defaultValue="contacts" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="flex flex-col h-[calc(100%-48px)]"
            >
              <TabsList className="w-full rounded-none bg-gray-100 dark:bg-gray-800">
                <TabsTrigger value="contacts" className="flex-1">Contatos</TabsTrigger>
                <TabsTrigger value="groups" className="flex-1">Grupos</TabsTrigger>
              </TabsList>

              {/* Contacts Tab */}
              <TabsContent value="contacts" className="flex-1 flex flex-col p-0 m-0 h-full">
                <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {contacts.map((contact) => (
                      <div 
                        key={contact.id} 
                        className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                        onClick={() => openContactChat(contact)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <Avatar>
                                <AvatarImage src={contact.avatar} alt={contact.name} />
                                <AvatarFallback>{contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span className={cn(
                                "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900",
                                contact.status === "online" ? "bg-green-500" :
                                contact.status === "away" ? "bg-yellow-500" : "bg-gray-400"
                              )}></span>
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-800 dark:text-gray-200">
                                {contact.name}
                              </h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {contact.role}
                              </p>
                              {contact.lastMessage && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-[180px]">
                                  {contact.lastMessage}
                                </p>
                              )}
                            </div>
                          </div>
                          {contact.unread ? (
                            <span className="w-5 h-5 flex items-center justify-center bg-primary text-white text-xs rounded-full">
                              {contact.unread}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Groups Tab */}
              <TabsContent value="groups" className="flex-1 flex flex-col p-0 m-0 h-full">
                <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                  {/* Add group form */}
                  {isAddingGroup && (
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={newGroupName}
                          onChange={(e) => setNewGroupName(e.target.value)}
                          placeholder="Nome do grupo..."
                          className="flex-1"
                        />
                        <Button onClick={addNewGroup} size="sm">
                          Salvar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setIsAddingGroup(false)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Edit group form */}
                  {editingGroup && (
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={editingGroup.name}
                          onChange={(e) => setEditingGroup({...editingGroup, name: e.target.value})}
                          placeholder="Nome do grupo..."
                          className="flex-1"
                        />
                        <Button onClick={saveEditingGroup} size="sm">
                          Salvar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setEditingGroup(null)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Groups list */}
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {groups.map((group) => (
                      <div 
                        key={group.id} 
                        className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex justify-between items-center"
                        onClick={() => openGroupChat(group)}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>
                              {group.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-gray-800 dark:text-gray-200">
                              {group.name}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {group.members.map(m => m.name.split(' ')[0]).join(', ')}
                            </p>
                            {group.lastMessage && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-[180px]">
                                {group.lastMessage}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {group.unread ? (
                            <span className="w-5 h-5 flex items-center justify-center bg-primary text-white text-xs rounded-full">
                              {group.unread}
                            </span>
                          ) : null}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-gray-400"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingGroup(group);
                            }}
                          >
                            <Edit size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add group button */}
                  {!isAddingGroup && !editingGroup && (
                    <div className="p-3">
                      <Button 
                        onClick={() => setIsAddingGroup(true)} 
                        variant="outline" 
                        className="w-full gap-1"
                        size="sm"
                      >
                        <Plus size={16} />
                        Novo Grupo
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            /* Chat View */
            <div className="flex flex-col h-[calc(100%-48px)]">
              {/* Messages */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-50 dark:bg-gray-900">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex",
                      msg.isMe ? "justify-end" : "justify-start"
                    )}
                  >
                    {!msg.isMe && (
                      <Avatar className="h-8 w-8 mr-2 self-end mb-1">
                        <AvatarFallback>{msg.sender.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "max-w-[75%] rounded-lg p-2 break-words",
                        msg.isMe
                          ? "bg-primary text-white"
                          : "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                      )}
                    >
                      {!msg.isMe && (
                        <div className="text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">{msg.sender}</div>
                      )}
                      <div className="text-sm">{msg.message}</div>
                      <div className="text-xs opacity-70 text-right mt-1">
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={sendMessage} className="p-2 border-t border-gray-200 dark:border-gray-700 flex gap-2 bg-white dark:bg-gray-900">
                <div className="flex gap-1">
                  <Button type="button" variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                    <Paperclip size={18} />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                    <Image size={18} />
                  </Button>
                </div>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1"
                />
                <Button type="submit" size="icon" className="h-9 w-9" aria-label="Send message">
                  <Send size={18} />
                </Button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default FloatingChat;
