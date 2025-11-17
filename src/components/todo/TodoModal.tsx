"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Todo, CreateTodoInput, Priority } from "@/types/todo";

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateTodoInput) => Promise<void>;
  todo?: Todo | null;
}

export const TodoModal: React.FC<TodoModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  todo,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("moderate");
  const [todoDate, setTodoDate] = useState("");
  const [errors, setErrors] = useState<{ title?: string; date?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description || "");
      setPriority(todo.priority);
      setTodoDate(todo.todo_date);
    } else {
      setTitle("");
      setDescription("");
      setPriority("moderate");
      // Set default date to today
      const today = new Date().toISOString().split("T")[0];
      setTodoDate(today);
    }
    setErrors({});
  }, [todo, isOpen]);

  const validate = () => {
    const newErrors: { title?: string; date?: string } = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!todoDate) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
        todo_date: todoDate,
      });
      onClose();
    } catch (error) {
      console.error("Error submitting todo:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={todo ? "Edit Todo" : "Add New Task"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-[14px]">
        <Input
          label="Title"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          autoFocus
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={todoDate}
            onChange={(e) => setTodoDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <div className="flex gap-10">
            <label className="flex items-center space-x-2 cursor-pointer">
              <span className="text-sm text-red-600 font-medium">●</span>
              <span>Extreme</span>
              <input
                type="radio"
                name="plan"
                value="extreme"
                checked={priority === "extreme"}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="hidden peer"
              />
              <span
                className="
      w-4 h-4 rounded-md border border-gray-400 
      peer-checked:bg-blue-600 peer-checked:border-blue-600
      transition-all
    "
              ></span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <span className="text-sm text-green-600 font-medium">●</span>
              <span>Moderate</span>
              <input
                type="radio"
                name="plan"
                value="moderate"
                checked={priority === "moderate"}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="hidden peer"
              />

              <span
                className="
      w-4 h-4 rounded-md border border-gray-400 
      peer-checked:bg-blue-600 peer-checked:border-blue-600
      transition-all
    "
              ></span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <span className="text-sm text-yellow-600 font-medium">● </span>
              <span>Low</span>
              <input
                type="radio"
                name="plan"
                value="low"
                checked={priority === "low"}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="hidden peer"
              />

              <span
                className="
      w-4 h-4 rounded-md border border-gray-400 
      peer-checked:bg-blue-600 peer-checked:border-blue-600
      transition-all
    "
              ></span>
            </label>
          </div>
        </div>

        <Textarea
          label="Task Description"
          placeholder="Enter task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={8}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {todo ? "Update" : "Done"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
