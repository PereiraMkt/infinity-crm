
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Calendar,
  Trash,
  Plus,
  Clock,
  CheckCircle2,
  X
} from "lucide-react";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { KanbanCardItem } from "../kanban/types";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar as CalendarComponent } from "../ui/calendar";
import { Checkbox } from "../ui/checkbox";
import { Slider } from "../ui/slider";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: KanbanCardItem) => void;
  editTask?: KanbanCardItem;
}

// Sample Team members
const teamMembers = [
  { id: "user-1", name: "Carlos Silva", avatar: "/placeholder.svg" },
  { id: "user-2", name: "Ana Oliveira", avatar: "/placeholder.svg" },
  { id: "user-3", name: "Miguel Santos", avatar: "/placeholder.svg" },
  { id: "user-4", name: "Julia Costa", avatar: "/placeholder.svg" },
  { id: "user-5", name: "Roberto Alves", avatar: "/placeholder.svg" },
  { id: "user-6", name: "Fernanda Lima", avatar: "/placeholder.svg" },
];

// Template subtasks
const templateSubTasks = [
  { template: "Design", tasks: ["Criação de wireframes", "Design de UI", "Revisão de design"] },
  { template: "Desenvolvimento", tasks: ["Setup do projeto", "Implementação do backend", "Implementação do frontend", "Testes unitários"] },
  { template: "Reunião", tasks: ["Preparação de material", "Apresentação", "Documentação de decisões"] },
  { template: "Documentação", tasks: ["Escrever especificações", "Criar documentação técnica", "Atualizar README"] }
];

const TaskForm = ({ isOpen, onClose, onAddTask, editTask }: TaskFormProps) => {
  const [title, setTitle] = useState(editTask?.title || "");
  const [description, setDescription] = useState(editTask?.description || "");
  const [client, setClient] = useState(editTask?.client || "");
  const [priority, setPriority] = useState<"high" | "medium" | "low">(editTask?.priority || "medium");
  const [assignedUserId, setAssignedUserId] = useState(editTask?.assignedTo?.id || "");
  const [startDate, setStartDate] = useState<Date>(editTask?.startDate || new Date());
  const [endDate, setEndDate] = useState<Date>(editTask?.endDate || addDays(new Date(), 7));
  const [completion, setCompletion] = useState(editTask?.completion || 0);
  const [subTasks, setSubTasks] = useState(
    editTask?.subTasks || []
  );
  const [newSubTaskDesc, setNewSubTaskDesc] = useState("");
  const [newSubTaskEstimated, setNewSubTaskEstimated] = useState("1");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Erro",
        description: "O título da tarefa é obrigatório.",
        variant: "destructive"
      });
      return;
    }
    
    // Find the assigned user object
    const assignedUser = teamMembers.find(member => member.id === assignedUserId);
    
    const newTask: KanbanCardItem = {
      id: editTask?.id || `task-${Date.now()}`,
      title,
      description,
      client,
      priority,
      completion,
      startDate,
      endDate,
      assignedTo: assignedUser ? {
        id: assignedUser.id,
        name: assignedUser.name,
        avatar: assignedUser.avatar
      } : undefined,
      subTasks: subTasks.length > 0 ? subTasks : undefined
    };
    
    onAddTask(newTask);
    resetForm();
    onClose();
    
    toast({
      title: editTask ? "Tarefa atualizada" : "Tarefa criada",
      description: `${title} foi ${editTask ? "atualizada" : "adicionada"} com sucesso.`
    });
  };

  const resetForm = () => {
    if (!editTask) {
      setTitle("");
      setDescription("");
      setClient("");
      setPriority("medium");
      setAssignedUserId("");
      setStartDate(new Date());
      setEndDate(addDays(new Date(), 7));
      setCompletion(0);
      setSubTasks([]);
    }
  };

  const handleAddSubTask = () => {
    if (!newSubTaskDesc.trim()) return;
    
    const estimated = parseInt(newSubTaskEstimated);
    if (isNaN(estimated) || estimated <= 0) return;
    
    const newSubTask = {
      id: `subtask-${Date.now()}`,
      description: newSubTaskDesc,
      estimated,
      completed: false
    };
    
    setSubTasks([...subTasks, newSubTask]);
    setNewSubTaskDesc("");
    setNewSubTaskEstimated("1");
  };

  const handleRemoveSubTask = (id: string) => {
    setSubTasks(subTasks.filter(task => task.id !== id));
  };

  const handleToggleSubTask = (id: string, completed: boolean) => {
    setSubTasks(subTasks.map(task => 
      task.id === id ? { ...task, completed } : task
    ));
  };

  const handleApplyTemplate = () => {
    if (!selectedTemplate) return;
    
    const template = templateSubTasks.find(t => t.template === selectedTemplate);
    if (!template) return;
    
    const newSubTasks = template.tasks.map((task, index) => ({
      id: `subtask-${Date.now()}-${index}`,
      description: task,
      estimated: 2,
      completed: false
    }));
    
    setSubTasks([...subTasks, ...newSubTasks]);
    setSelectedTemplate("");
  };

  // Calculate completion percentage based on subtasks
  const calculateCompletionFromSubtasks = () => {
    if (subTasks.length === 0) return completion;
    
    const completedCount = subTasks.filter(task => task.completed).length;
    return Math.round((completedCount / subTasks.length) * 100);
  };

  // Update completion when subtasks change
  const updateCompletionFromSubtasks = () => {
    const newCompletion = calculateCompletionFromSubtasks();
    setCompletion(newCompletion);
  };

  // Call this function whenever subtasks change
  useState(() => {
    updateCompletionFromSubtasks();
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{editTask ? "Editar Tarefa" : "Nova Tarefa"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Título
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                placeholder="Digite o título da tarefa"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descrição
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                placeholder="Descreva a tarefa em detalhes"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client" className="text-right">
                Cliente
              </Label>
              <Input
                id="client"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="col-span-3"
                placeholder="Nome do cliente relacionado (opcional)"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assigned" className="text-right">
                Responsável
              </Label>
              <Select value={assignedUserId} onValueChange={setAssignedUserId}>
                <SelectTrigger id="assigned" className="col-span-3">
                  <SelectValue placeholder="Selecione o responsável" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Prioridade
              </Label>
              <Select value={priority} onValueChange={(val: "high" | "medium" | "low") => setPriority(val)}>
                <SelectTrigger id="priority" className="col-span-3">
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Data Inicial
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Data Final
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => date && setEndDate(date)}
                      initialFocus
                      disabled={(date) => date < startDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="completion" className="text-right">
                Progresso ({completion}%)
              </Label>
              <div className="col-span-3">
                <Slider
                  defaultValue={[completion]}
                  max={100}
                  step={5}
                  value={[completion]}
                  onValueChange={(values) => setCompletion(values[0])}
                />
              </div>
            </div>
            
            {/* Sub-tasks section */}
            <div className="border-t pt-4 mt-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Subtarefas</h3>
                
                <div className="flex gap-2 items-center">
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Usar modelo" />
                    </SelectTrigger>
                    <SelectContent>
                      {templateSubTasks.map((template) => (
                        <SelectItem key={template.template} value={template.template}>
                          {template.template}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleApplyTemplate}
                    disabled={!selectedTemplate}
                  >
                    Aplicar
                  </Button>
                </div>
              </div>
              
              {/* Add subtask form */}
              <div className="flex gap-2 mb-4">
                <Input
                  value={newSubTaskDesc}
                  onChange={(e) => setNewSubTaskDesc(e.target.value)}
                  placeholder="Descrição da subtarefa"
                  className="flex-grow"
                />
                <div className="flex items-center px-3 bg-muted rounded">
                  <Clock size={16} className="text-muted-foreground mr-2" />
                  <Input
                    type="number"
                    value={newSubTaskEstimated}
                    onChange={(e) => setNewSubTaskEstimated(e.target.value)}
                    className="w-16 border-0 p-0 bg-transparent"
                    min="1"
                  />
                  <span className="text-sm text-muted-foreground">h</span>
                </div>
                <Button 
                  type="button"
                  size="icon"
                  onClick={handleAddSubTask}
                >
                  <Plus size={16} />
                </Button>
              </div>
              
              {/* Subtasks list */}
              <div className="space-y-2 max-h-[200px] overflow-auto">
                {subTasks.map((task) => (
                  <div 
                    key={task.id}
                    className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
                  >
                    <div className="flex items-center">
                      <Checkbox 
                        checked={task.completed}
                        onCheckedChange={(checked) => 
                          handleToggleSubTask(task.id, checked === true)
                        }
                        className="mr-2"
                      />
                      <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                        {task.description}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Clock size={14} className="mr-1" />
                        <span>{task.estimated}h</span>
                      </div>
                      <Button 
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => handleRemoveSubTask(task.id)}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
                {subTasks.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground p-2">
                    Nenhuma subtarefa adicionada
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {editTask ? "Atualizar" : "Criar"} Tarefa
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
