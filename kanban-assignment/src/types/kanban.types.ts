export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  status: string; // column id
  priority?: Priority;
  assignee?: string;
  tags?: string[];
  createdAt?: string;
  dueDate?: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  color?: string;
  taskIds: string[];
  maxTasks?: number;
}

export interface KanbanViewProps {
  initialColumns?: KanbanColumn[];
  initialTasks?: Record<string, KanbanTask>;
}
