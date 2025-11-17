"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TodoModal } from "@/components/todo/TodoModal";
import { TodoProvider, useTodos } from "@/utils/context/TodoContext";
import { Todo, CreateTodoInput } from "@/types/todo";
import { FaPlus, FaSearch, FaChevronDown } from "react-icons/fa";
import { BsGrid3X2GapFill } from "react-icons/bs";
import { FiEdit3 } from "react-icons/fi";
import { MdOutlineDelete } from "react-icons/md";

function TodosPageContent() {
  const { todos, addTodo, updateTodo, deleteTodo, loading } = useTodos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);

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
          <div className="flex flex-col items-start">
            <h1 className="text-[24px] font-semibold text-gray-900 ">Todos</h1>
            <div className="h-0.5 w-14 bg-[#5272FF] rounded-full"></div>
          </div>

          <Button
            onClick={handleAddTodo}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <FaPlus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>

        {/* Search and Sort Bar */}
        <div className=" rounded-lg mb-6">
          <div className="flex gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5272FF] w-4 h-4" />
              <input
                type="text"
                placeholder="Search your task here..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[#4B5563] text-[14px]"
              />
            </div>

            {/* Sort */}
            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFilter((prev) => !prev)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-700">Filter By</span>
                <FaChevronDown className="w-3 h-3 text-gray-500" />
              </button>

              {showFilter && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
                  <p className="text-gray-700 font-semibold mb-2">Date</p>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" className="w-4 h-4" />
                      Deadline Today
                    </label>

                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" className="w-4 h-4" />
                      Expires in 5 days
                    </label>

                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" className="w-4 h-4" />
                      Expires in 10 days
                    </label>

                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" className="w-4 h-4" />
                      Expires in 30 days
                    </label>
                  </div>
                </div>
              )}
            </div>
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
      <div className="flex justify-between items-start mb-8">
        <h3 className="font-semibold text-gray-900 text-lg flex-1">
          {todo.title}
        </h3>
        <div className="flex items-center">
          <span
            className={`px-3 py-1.5 rounded-md text-xs font-medium border ${getPriorityColor(
              todo.priority
            )}`}
          >
            {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
          </span>
          <BsGrid3X2GapFill className="w-5 h-5 text-gray-400 mt-1 rotate-90" />
        </div>
      </div>

      {/* Description */}
      {todo.description && (
        <p className="text-sm text-[#4B5563] mb-8 line-clamp-2">
          {todo.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center">
        <div className="text-xs text-[#4B5563]">
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
            className=" hover:bg-gray-100 rounded transition-colors bg-[#EEF7FF] p-2"
            title="Edit"
          >
            <FiEdit3 className="w-4 h-4 text-gray-600" />
          </button>

          <button
            onClick={handleDelete}
            className=" hover:bg-gray-100 rounded transition-colors bg-[#EEF7FF] p-2"
            title="Delete"
          >
            <MdOutlineDelete className="w-4 h-4 text-[#DC2626]" />
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
