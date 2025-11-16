export type Priority = 'extreme' | 'moderate' | 'low';

export interface Todo {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  is_completed: boolean;
  position: number;
  todo_date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  priority: Priority;
  todo_date: string;
}

export interface UpdateTodoInput {
  id: number;
  title?: string;
  description?: string;
  priority?: Priority;
  is_completed?: boolean;
  position?: number;
  todo_date?: string;
}

export interface TodosResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Todo[];
}

export interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}
