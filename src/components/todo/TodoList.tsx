'use client';

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Todo } from '@/types/todo';
import { TodoItem } from './TodoItem';
import { useTodos } from '@/utils/context/TodoContext';

interface SortableTodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number, completed: boolean) => void;
}

const SortableTodoItem: React.FC<SortableTodoItemProps> = ({
  todo,
  onEdit,
  onDelete,
  onToggle,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TodoItem
        todo={todo}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggle={onToggle}
        isDragging={isDragging}
      />
    </div>
  );
};

interface TodoListProps {
  onEdit: (todo: Todo) => void;
}

export const TodoList: React.FC<TodoListProps> = ({ onEdit }) => {
  const { todos, deleteTodo, updateTodo, reorderTodos } = useTodos();
  const [localTodos, setLocalTodos] = useState<Todo[]>(todos);

  React.useEffect(() => {
    setLocalTodos(todos);
  }, [todos]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = localTodos.findIndex((todo) => todo.id.toString() === active.id);
      const newIndex = localTodos.findIndex((todo) => todo.id.toString() === over.id);

      const newTodos = arrayMove(localTodos, oldIndex, newIndex);
      setLocalTodos(newTodos);
      reorderTodos(newTodos);
    }
  };

  const handleToggle = async (id: number, completed: boolean) => {
    await updateTodo({ id, is_completed: completed });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      await deleteTodo(id);
    }
  };

  if (localTodos.length === 0) {
    return (
      <div className="text-center py-12">
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
        <h3 className="text-lg font-medium text-gray-900 mb-1">No todos yet</h3>
        <p className="text-gray-500">Get started by creating your first todo</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={localTodos.map((todo) => todo.id.toString())}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {localTodos.map((todo) => (
            <SortableTodoItem
              key={todo.id}
              todo={todo}
              onEdit={onEdit}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
