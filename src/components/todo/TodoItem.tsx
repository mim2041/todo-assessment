'use client';

import React, { useState } from 'react';
import { Todo } from '@/types/todo';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FaTrash, FaEdit, FaGripVertical } from 'react-icons/fa';
import { cn } from '@/utils/helpers/cn';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number, completed: boolean) => void;
  isDragging?: boolean;
}

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'extreme':
      return (
        <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-red-100 text-red-700">
          Extreme
        </span>
      );
    case 'moderate':
      return (
        <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-green-100 text-green-700">
          Moderate
        </span>
      );
    case 'low':
      return (
        <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-yellow-100 text-yellow-700">
          Low
        </span>
      );
    default:
      return null;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onEdit,
  onDelete,
  onToggle,
  isDragging = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className={cn(
        'transition-all duration-200 cursor-move hover:shadow-md',
        isDragging && 'opacity-50 scale-95',
        todo.is_completed && 'bg-gray-50'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-4">
        {/* Drag Handle */}
        <div className="flex-shrink-0 pt-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
          <FaGripVertical className="w-4 h-4" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3
              className={cn(
                'text-lg font-medium flex-1',
                todo.is_completed ? 'line-through text-gray-500' : 'text-gray-900'
              )}
            >
              {todo.title}
            </h3>
            {getPriorityBadge(todo.priority)}
          </div>

          {todo.description && (
            <p
              className={cn(
                'mt-1 text-sm mb-3',
                todo.is_completed ? 'line-through text-gray-400' : 'text-gray-600'
              )}
            >
              {todo.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Due {formatDate(todo.todo_date)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onToggle(todo.id, !todo.is_completed)}
            className={cn(
              'text-sm font-medium',
              todo.is_completed ? 'text-gray-500' : 'text-blue-600 hover:bg-blue-50'
            )}
          >
            {todo.is_completed ? 'Undo' : 'Complete'}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(todo)}
            className="text-blue-600 hover:bg-blue-50"
          >
            <FaEdit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(todo.id)}
            className="text-red-600 hover:bg-red-50"
          >
            <FaTrash className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
