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
}

export interface KanbanColumnItem {
  id: string;
  title: string;
  cards: KanbanCardItem[];
  color: string;
}
