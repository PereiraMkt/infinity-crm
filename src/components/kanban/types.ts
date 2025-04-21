
export interface KanbanCardItem {
  id: string;
  title: string;
  description?: string;
  client?: string;
  assignedTo?: {
    id: string;
    name: string;
    avatar?: string;
  };
  priority: "high" | "medium" | "low";
  completion: number;
  startDate?: Date;
  endDate?: Date;
  subTasks?: Array<{
    id: string;
    description: string;
    estimated: number;
    completed: boolean;
  }>;
  tags?: Array<{
    label: string;
    color: string;
  }>;
  value?: number;
  checklist?: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
  links?: Array<{
    url: string;
    label?: string;
  }>;
  metadata?: {
    [key: string]: string;
  };
  dueDate?: string;
  socialMedia?: Array<{
    type: string;
    url: string;
  }>;
  responsible?: string;
  tasks?: Array<{
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    dueDate?: string;
    estimatedTime?: number;
    timeSpent?: number;
  }>;
}

export interface KanbanColumnItem {
  id: string;
  title: string;
  cards: KanbanCardItem[];
  color: string;
}
