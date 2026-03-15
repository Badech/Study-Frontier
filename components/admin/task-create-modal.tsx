'use client';

/**
 * Task Creation Modal
 * Modal for creating new tasks
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type TaskCreateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  preSelectedStudentId?: string;
};

export function TaskCreateModal({ isOpen, onClose, preSelectedStudentId }: TaskCreateModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [taskData, setTaskData] = useState({
    student_id: preSelectedStudentId || '',
    title: '',
    description: '',
    category: 'general',
    priority: 'medium',
    due_date: '',
  });

  const handleSubmit = async () => {
    if (!taskData.student_id || !taskData.title) {
      alert('Please fill in student ID and task title');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...taskData,
          due_date: taskData.due_date || undefined,
          description: taskData.description || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Task creation failed:', result);
        throw new Error(result.error || 'Failed to create task');
      }
      
      alert('Task created successfully!');
      onClose();
      router.refresh();
    } catch (error: any) {
      console.error('Error:', error);
      alert(`Error creating task: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-card border border-border rounded-lg p-6 max-w-lg w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-4">Create New Task</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Student ID <span className="text-destructive">*</span></label>
            <input
              type="text"
              value={taskData.student_id}
              onChange={(e) => setTaskData({ ...taskData, student_id: e.target.value })}
              className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm font-mono text-xs"
              placeholder="e.g., 472bb12d-919e-4694-9bc8-6c09ac1ccb41"
              disabled={!!preSelectedStudentId}
            />
            <p className="text-xs text-muted-foreground mt-1">
              <strong>Tip:</strong> Go to Students page → Click a student → Copy their ID from the URL
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Task Title <span className="text-destructive">*</span></label>
            <input
              type="text"
              value={taskData.title}
              onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
              className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
              placeholder="e.g., Submit passport copy"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={taskData.description}
              onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
              className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
              rows={3}
              placeholder="Additional details about this task..."
            />
          </div>

          <div className="grid gap-4 grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={taskData.category}
                onChange={(e) => setTaskData({ ...taskData, category: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
              >
                <option value="general">General</option>
                <option value="document">Document</option>
                <option value="application">Application</option>
                <option value="visa">Visa</option>
                <option value="payment">Payment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                value={taskData.priority}
                onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Due Date (Optional)</label>
            <input
              type="date"
              value={taskData.due_date}
              onChange={(e) => setTaskData({ ...taskData, due_date: e.target.value })}
              className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Task'}
          </Button>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
