"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TodoModal } from "@/components/todo/TodoModal";
import { TodoProvider, useTodos } from "@/utils/context/TodoContext";
import { Todo, CreateTodoInput } from "@/types/todo";
import { FaPlus, FaSearch, FaChevronDown } from "react-icons/fa";

function TodosPageContent() {
  const { todos, addTodo, updateTodo, deleteTodo, loading } = useTodos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddTodo = () => {
    setEditingTodo(null);
    setIsModalOpen(true);
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleSubmitTodo = async (input: CreateTodoInput) => {
    if (editingTodo) {
      await updateTodo({ id: editingTodo.id, ...input });
    } else {
      await addTodo(input);
    }
    setIsModalOpen(false);
    setEditingTodo(null);
  };

  const filteredTodos = todos.filter(
    (todo) =>
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="w-full mx-auto">
        {/* Page Title and Actions */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Todos</h1>
          <Button
            onClick={handleAddTodo}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <FaPlus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>

        {/* Search and Sort Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search your task here..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sort */}
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-gray-700">Sort by</span>
              <FaChevronDown className="w-3 h-3 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Your Tasks Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Your Tasks
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading todos...</p>
            </div>
          ) : filteredTodos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTodos.map((todo) => (
                <TodoCard key={todo.id} todo={todo} onEdit={handleEditTodo} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <div className="text-gray-400 mb-2">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {searchQuery ? "No todos found" : "No todos yet"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Get started by creating your first todo"}
              </p>
              {!searchQuery && (
                <Button onClick={handleAddTodo}>
                  <FaPlus className="w-4 h-4 mr-2" />
                  Create Todo
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Todo Modal */}
      <TodoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTodo(null);
        }}
        onSubmit={handleSubmitTodo}
        todo={editingTodo}
      />
    </div>
  );
}

// TodoCard Component matching the design
interface TodoCardProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
}

const TodoCard: React.FC<TodoCardProps> = ({ todo, onEdit }) => {
  const { deleteTodo } = useTodos();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "extreme":
        return "bg-red-100 text-red-700 border-red-200";
      case "moderate":
        return "bg-green-100 text-green-700 border-green-200";
      case "low":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      await deleteTodo(todo.id);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 text-lg flex-1">
          {todo.title}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
            todo.priority
          )}`}
        >
          {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
        </span>
      </div>

      {/* Description */}
      {todo.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {todo.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          Due{" "}
          {new Date(todo.todo_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(todo)}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="Edit"
          >
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          <button
            onClick={handleDelete}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="Delete"
          >
            <svg
              className="w-4 h-4 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function TodosPage() {
  return (
    <TodoProvider>
      <TodosPageContent />
    </TodoProvider>
  );
}
