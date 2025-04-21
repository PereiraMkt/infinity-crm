
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { KanbanCardItem } from "../kanban/types";

// Define the schema for the task form
const taskFormSchema = z.object({
  title: z.string().min(2, {
    message: "Título deve ter pelo menos 2 caracteres.",
  }),
  description: z.string().optional(),
  client: z.string().optional(),
  priority: z.string().default("medium"),
  status: z.string().default("backlog"),
  assignedTo: z.string().optional(),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: KanbanCardItem) => void;
  initialData?: TaskFormValues;
}

// Default subtask items
const defaultSubTasks = [
  { id: "1", description: "Preparar materiais", estimated: 60, completed: false },
  { id: "2", description: "Revisar com o cliente", estimated: 30, completed: false },
];

const TaskForm = ({ isOpen, onClose, onAddTask, initialData }: TaskFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [subTasks, setSubTasks] = useState(defaultSubTasks);
  const [newSubTask, setNewSubTask] = useState("");
  const [newEstimated, setNewEstimated] = useState(30);

  // Fetch team members for assigned to selection
  const { data: teamMembers = [] } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, role, avatar')
        .order('name');
        
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch clients for client selection
  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name')
        .order('name');
        
      if (error) throw error;
      return data || [];
    },
  });

  // Initialize the form with default values or provided data
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      client: "",
      priority: "medium",
      status: "backlog",
      assignedTo: "",
      startDate: null,
      endDate: null,
    },
  });

  const onSubmit = async (data: TaskFormValues) => {
    setLoading(true);
    try {
      // Find assigned team member
      const assignedTeamMember = teamMembers.find((m: any) => m.id === data.assignedTo);
      
      // Create task data structure
      const taskData: KanbanCardItem = {
        id: `task-${Date.now()}`,
        title: data.title,
        description: data.description || "",
        client: data.client || "",
        priority: data.priority as "high" | "medium" | "low",
        completion: 0,
        assignedTo: assignedTeamMember ? {
          id: assignedTeamMember.id,
          name: assignedTeamMember.name,
          avatar: assignedTeamMember.avatar || "/placeholder.svg"
        } : undefined,
        subTasks: subTasks,
        startDate: data.startDate,
        endDate: data.endDate
      };
      
      onAddTask(taskData);
      
      toast({
        title: "Tarefa adicionada",
        description: "A tarefa foi adicionada com sucesso.",
      });
      
      form.reset();
      setSubTasks(defaultSubTasks);
      onClose();
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar a tarefa.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add a new subtask
  const addSubTask = () => {
    if (newSubTask.trim()) {
      setSubTasks([
        ...subTasks,
        { 
          id: `subtask-${Date.now()}`, 
          description: newSubTask, 
          estimated: newEstimated,
          completed: false 
        }
      ]);
      setNewSubTask("");
      setNewEstimated(30);
    }
  };

  // Remove a subtask
  const removeSubTask = (id: string) => {
    setSubTasks(subTasks.filter(task => task.id !== id));
  };

  // Toggle subtask completion
  const toggleSubTaskCompletion = (id: string) => {
    setSubTasks(
      subTasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Tarefa</DialogTitle>
          <DialogDescription>
            Adicione uma nova tarefa ao quadro de produção.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Título da tarefa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva a tarefa" 
                      {...field} 
                      value={field.value || ""} 
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="client"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client: any) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Atribuir a" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teamMembers.map((member: any) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name} - {member.role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridade</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a prioridade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="backlog">Backlog</SelectItem>
                        <SelectItem value="in-progress">Em Progresso</SelectItem>
                        <SelectItem value="review">Revisão</SelectItem>
                        <SelectItem value="done">Concluído</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Início</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Entrega</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) => 
                            (form.getValues().startDate && date < form.getValues().startDate!) ||
                            date < new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* SubTasks Section */}
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-3">Subtarefas</h3>
              <div className="flex gap-2 mb-4">
                <Input 
                  placeholder="Descrição da subtarefa" 
                  value={newSubTask}
                  onChange={(e) => setNewSubTask(e.target.value)}
                  className="flex-1"
                />
                <Input 
                  type="number"
                  placeholder="Min" 
                  value={newEstimated}
                  onChange={(e) => setNewEstimated(parseInt(e.target.value, 10) || 0)}
                  className="w-20"
                />
                <Button 
                  type="button"
                  onClick={addSubTask}
                  disabled={!newSubTask.trim()}
                >
                  <Plus size={16} />
                </Button>
              </div>
              <div className="space-y-2">
                {subTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleSubTaskCompletion(task.id)}
                        className="rounded-sm"
                      />
                      <div className="flex flex-col">
                        <span className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {task.description}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Estimado: {task.estimated} min
                        </span>
                      </div>
                    </div>
                    <Button 
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSubTask(task.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Adicionar Tarefa"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
