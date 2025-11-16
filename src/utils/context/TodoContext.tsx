"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  Todo,
  CreateTodoInput,
  UpdateTodoInput,
  TodosResponse,
} from "@/types/todo";
import { apiClient } from "@/utils/api/client";
import { todoEndpoints } from "@/config/endpoints";
import toast from "react-hot-toast";

interface TodoContextType {
  todos: Todo[];
  loading: boolean;
  addTodo: (input: CreateTodoInput) => Promise<void>;
  updateTodo: (input: UpdateTodoInput) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  reorderTodos: (todos: Todo[]) => Promise<void>;
  fetchTodos: (filters?: TodoFilters) => Promise<void>;
}

export interface TodoFilters {
  is_completed?: boolean;
  priority?: string;
  todo_date?: string;
  search?: string;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodos must be used within a TodoProvider");
  }
  return context;
};

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTodos = useCallback(async (filters?: TodoFilters) => {
    try {
      setLoading(true);

      // Build query params
      const params = new URLSearchParams();
      if (filters?.is_completed !== undefined) {
        params.append("is_completed", filters.is_completed.toString());
      }
      if (filters?.priority) {
        params.append("priority", filters.priority);
      }
      if (filters?.todo_date) {
        params.append("todo_date", filters.todo_date);
      }
      if (filters?.search) {
        params.append("search", filters.search);
      }

      const queryString = params.toString();
      const endpoint = `${todoEndpoints.todos}${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await apiClient.get<TodosResponse>(endpoint, true);
      setTodos(response.results);
    } catch (error) {
      console.error("Error fetching todos:", error);
      toast.error("Failed to fetch todos");
    } finally {
      setLoading(false);
    }
  }, []);

  const addTodo = useCallback(async (input: CreateTodoInput) => {
    try {
      const formData = new FormData();
      formData.append("title", input.title);
      if (input.description) {
        formData.append("description", input.description);
      }
      formData.append("priority", input.priority);
      formData.append("todo_date", input.todo_date);

      const newTodo = await apiClient.post<Todo>(
        todoEndpoints.createTodo,
        formData,
        true
      );

      setTodos((prev) => [...prev, newTodo]);
      toast.success("Todo added successfully");
    } catch (error) {
      console.error("Error adding todo:", error);
      toast.error("Failed to add todo");
      throw error;
    }
  }, []);

  const updateTodo = useCallback(async (input: UpdateTodoInput) => {
    try {
      const formData = new FormData();
      if (input.title !== undefined) {
        formData.append("title", input.title);
      }
      if (input.description !== undefined) {
        formData.append("description", input.description);
      }
      if (input.priority !== undefined) {
        formData.append("priority", input.priority);
      }
      if (input.is_completed !== undefined) {
        formData.append("is_completed", input.is_completed.toString());
      }
      if (input.position !== undefined) {
        formData.append("position", input.position.toString());
      }
      if (input.todo_date !== undefined) {
        formData.append("todo_date", input.todo_date);
      }

      const updatedTodo = await apiClient.patch<Todo>(
        todoEndpoints.updateTodo(input.id),
        formData,
        true
      );

      setTodos((prev) =>
        prev.map((todo) => (todo.id === input.id ? updatedTodo : todo))
      );
      toast.success("Todo updated successfully");
    } catch (error) {
      console.error("Error updating todo:", error);
      toast.error("Failed to update todo");
      throw error;
    }
  }, []);

  const deleteTodo = useCallback(async (id: number) => {
    try {
      await apiClient.delete(todoEndpoints.deleteTodo(id), true);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      toast.success("Todo deleted successfully");
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("Failed to delete todo");
      throw error;
    }
  }, []);

  const reorderTodos = useCallback(
    async (reorderedTodos: Todo[]) => {
      try {
        // Update local state immediately for better UX
        setTodos(reorderedTodos);

        // Update positions on the backend
        const updates = reorderedTodos.map((todo, index) =>
          updateTodo({ id: todo.id, position: index + 1 })
        );

        await Promise.all(updates);
      } catch (error) {
        console.error("Error reordering todos:", error);
        toast.error("Failed to reorder todos");
        // Refetch to get correct order
        fetchTodos();
        throw error;
      }
    },
    [updateTodo, fetchTodos]
  );

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const value = {
    todos,
    loading,
    addTodo,
    updateTodo,
    deleteTodo,
    reorderTodos,
    fetchTodos,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
