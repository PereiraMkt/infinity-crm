
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

// Define the schema for the client form
const clientFormSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }).optional().nullable(),
  phone: z.string().optional().nullable(),
  contact: z.string().optional().nullable(),
  street: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  zip: z.string().optional().nullable(),
  segment: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  socialMedia: z.string().optional().nullable(),
  responsible: z.string().optional().nullable(),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

interface ClientFormProps {
  initialData?: ClientFormValues;
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

// Checklist items for clients
const defaultChecklistItems = [
  { id: "contract", label: "Contrato assinado", checked: false },
  { id: "onboarding", label: "Onboarding realizado", checked: false },
  { id: "payment", label: "Pagamento inicial recebido", checked: false },
  { id: "documents", label: "Documentos recebidos", checked: false },
  { id: "briefing", label: "Briefing completo", checked: false },
];

// Default task items
const defaultTaskItems = [
  { id: "welcome", label: "Enviar email de boas-vindas", completed: false },
  { id: "schedule", label: "Agendar reunião inicial", completed: false },
  { id: "setup", label: "Configurar ambiente do cliente", completed: false },
];

const ClientForm = ({ initialData, onSubmitSuccess, onCancel }: ClientFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [checklistItems, setChecklistItems] = useState(defaultChecklistItems);
  const [taskItems, setTaskItems] = useState(defaultTaskItems);
  const [newTask, setNewTask] = useState("");

  // Fetch team members for responsible selection
  const { data: teamMembers = [] } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, role')
        .order('name');
        
      if (error) throw error;
      return data || [];
    },
  });

  // Initialize the form with default values or provided data
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: initialData || {
      name: "",
      email: "",
      phone: "",
      contact: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      segment: "",
      description: "",
      socialMedia: "",
      responsible: "",
    },
  });

  const onSubmit = async (data: ClientFormValues) => {
    setLoading(true);
    try {
      const clientData = {
        ...data,
        checklist: checklistItems,
        tasks: taskItems,
      };
      
      // Here you would save to your database
      // This is a placeholder for demonstration
      console.log('Client data to submit:', clientData);
      
      toast({
        title: "Cliente salvo",
        description: "Os dados do cliente foram salvos com sucesso.",
      });
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar os dados do cliente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Toggle checklist item
  const toggleChecklistItem = (id: string) => {
    setChecklistItems(
      checklistItems.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  // Toggle task completion
  const toggleTaskCompletion = (id: string) => {
    setTaskItems(
      taskItems.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Add a new task
  const addTask = () => {
    if (newTask.trim()) {
      setTaskItems([
        ...taskItems,
        { 
          id: `task-${Date.now()}`, 
          label: newTask, 
          completed: false 
        }
      ]);
      setNewTask("");
    }
  };

  // Remove a task
  const removeTask = (id: string) => {
    setTaskItems(taskItems.filter(task => task.id !== id));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do cliente" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email de contato" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="(00) 00000-0000" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contato</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do contato" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input placeholder="Rua, número" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input placeholder="Cidade" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Input placeholder="Estado" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="zip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP</FormLabel>
                <FormControl>
                  <Input placeholder="00000-000" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="segment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Segmento</FormLabel>
                <FormControl>
                  <Input placeholder="Segmento de atuação" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descrição detalhada sobre o cliente" 
                    {...field} 
                    value={field.value || ""} 
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="socialMedia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Redes Sociais</FormLabel>
                <FormControl>
                  <Input placeholder="Links para redes sociais" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="responsible"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Responsável</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um responsável" />
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
        </div>

        {/* Checklist Section */}
        <div className="border rounded-md p-4">
          <h3 className="text-lg font-medium mb-3">Checklist</h3>
          <div className="space-y-2">
            {checklistItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={item.id} 
                  checked={item.checked}
                  onCheckedChange={() => toggleChecklistItem(item.id)}
                />
                <label
                  htmlFor={item.id}
                  className={`text-sm ${item.checked ? 'line-through text-muted-foreground' : ''}`}
                >
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks Section */}
        <div className="border rounded-md p-4">
          <h3 className="text-lg font-medium mb-3">Tarefas</h3>
          <div className="flex gap-2 mb-4">
            <Input 
              placeholder="Adicionar nova tarefa" 
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
            <Button 
              type="button"
              onClick={addTask}
              disabled={!newTask.trim()}
            >
              Adicionar
            </Button>
          </div>
          <div className="space-y-2">
            {taskItems.map((task) => (
              <div key={task.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id={task.id}
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskCompletion(task.id)}
                  />
                  <label
                    htmlFor={task.id}
                    className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                  >
                    {task.label}
                  </label>
                </div>
                <Button 
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTask(task.id)}
                >
                  Remover
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ClientForm;
