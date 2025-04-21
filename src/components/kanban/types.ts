
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
}

export interface KanbanColumnItem {
  id: string;
  title: string;
  cards: KanbanCardItem[];
  color: string;
}
