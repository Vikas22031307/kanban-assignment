\
    import React, { useEffect, useState } from 'react';
    import type { KanbanColumn, KanbanTask } from '../../types/kanban.types';
    import { getInitials, getPriorityBorderClass, formatDate, isOverdue } from '../../utils/task.utils';

    export default function KanbanBoard({ initialColumns = undefined, initialTasks = undefined }: { initialColumns?: KanbanColumn[], initialTasks?: Record<string, KanbanTask> }) {
      const defaultCols: KanbanColumn[] = [
        { id: 'todo', title: 'To Do', taskIds: ['t1','t2'] },
        { id: 'inprogress', title: 'In Progress', taskIds: ['t3'] },
        { id: 'done', title: 'Done', taskIds: ['t4'] },
      ];
      const defaultTasks: Record<string, KanbanTask> = {
        t1: { id: 't1', title: 'Write README', status: 'todo', assignee: 'Vikas', tags: ['docs'] },
        t2: { id: 't2', title: 'Create wireframe', status: 'todo', assignee: 'Alice', tags: ['design'] },
        t3: { id: 't3', title: 'Implement header', status: 'inprogress', assignee: 'Bob', tags: ['frontend'] },
        t4: { id: 't4', title: 'Project kickoff', status: 'done', assignee: 'Vikas', tags: [] },
      };

      const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns && initialColumns.length ? initialColumns : defaultCols);
      const [tasks, setTasks] = useState<Record<string, KanbanTask>>(initialTasks && Object.keys(initialTasks || {}).length ? initialTasks! : defaultTasks);
      const [newTaskTitle, setNewTaskTitle] = useState('');
      const [addingTo, setAddingTo] = useState<string | null>(null);

      const makeId = (prefix = 'task') => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

      const tasksForColumn = (colId: string) => columns.find(c => c.id === colId)?.taskIds.map(id => tasks[id]).filter(Boolean) ?? [];

      const addTask = (columnId: string) => {
        const title = newTaskTitle.trim();
        if (!title) return;
        const id = makeId();
        const task: KanbanTask = { id, title, status: columnId, createdAt: new Date().toISOString() };
        setTasks(prev => ({ ...prev, [id]: task }));
        setColumns(prev => prev.map(c => c.id === columnId ? { ...c, taskIds: [id, ...c.taskIds] } : c));
        setNewTaskTitle('');
        setAddingTo(null);
      };

      const deleteTask = (taskId: string) => {
        setTasks(prev => { const copy = { ...prev }; delete copy[taskId]; return copy; });
        setColumns(prev => prev.map(c => ({ ...c, taskIds: c.taskIds.filter(id => id !== taskId) })));
      };

      const moveTask = (taskId: string, fromColId: string, toColId: string, toIndex: number | null = null) => {
        setColumns(prev => {
          const source = prev.find(p => p.id === fromColId);
          const dest = prev.find(p => p.id === toColId);
          if (!source || !dest) return prev;
          const srcIds = source.taskIds.filter(id => id !== taskId);
          const dstIds = [...dest.taskIds];
          if (toIndex === null || toIndex < 0 || toIndex > dstIds.length) dstIds.push(taskId);
          else dstIds.splice(toIndex, 0, taskId);
          return prev.map(c => c.id === source.id ? { ...c, taskIds: srcIds } : (c.id === dest.id ? { ...c, taskIds: dstIds } : c));
        });
        setTasks(prev => ({ ...prev, [taskId]: { ...prev[taskId], status: toColId } }));
      };

      function handleDragStart(e: React.DragEvent, taskId: string, fromColumnId: string) {
        e.dataTransfer.setData('application/kanban-task', JSON.stringify({ taskId, fromColumnId }));
        e.dataTransfer.effectAllowed = 'move';
      }

      function handleDragOver(e: React.DragEvent) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      }

      function handleDropOnColumn(e: React.DragEvent, columnId: string) {
        e.preventDefault();
        const raw = e.dataTransfer.getData('application/kanban-task');
        if (!raw) return;
        try {
          const { taskId, fromColumnId } = JSON.parse(raw);
          moveTask(taskId, fromColumnId, columnId, null);
        } catch {}
      }

      function handleDropOnCard(e: React.DragEvent, columnId: string, index: number) {
        e.preventDefault();
        const raw = e.dataTransfer.getData('application/kanban-task');
        if (!raw) return;
        try {
          const { taskId, fromColumnId } = JSON.parse(raw);
          moveTask(taskId, fromColumnId, columnId, index);
        } catch {}
      }

      useEffect(() => {
        function onKey(e: KeyboardEvent) {
          if (e.key === 'Escape') {
            setAddingTo(null);
            setNewTaskTitle('');
          }
        }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
      }, []);

      return (
        <div className=\"w-full\">
          <div className=\"flex items-center justify-between mb-4\">
            <h1 className=\"text-2xl font-semibold\">Kanban — Humanized</h1>
            <div className=\"text-sm text-gray-600\">Simple, internship-friendly starting point</div>
          </div>

          <div className=\"flex gap-4 overflow-x-auto pb-6\" role=\"list\" aria-label=\"Kanban columns\">
            {columns.map(col => {
              const colTasks = tasksForColumn(col.id);
              return (
                <section
                  key={col.id}
                  className=\"w-80 flex-shrink-0 bg-white rounded-lg p-4 border\"
                  onDragOver={handleDragOver}
                  onDrop={e => handleDropOnColumn(e, col.id)}
                  role=\"region\"
                  aria-label={`${col.title} column. ${col.taskIds.length} tasks.`}
                >
                  <header className=\"flex items-center justify-between mb-3 sticky top-0 bg-inherit\">
                    <h3 className=\"font-medium\">{col.title}</h3>
                    <span className=\"text-sm text-gray-500\">{colTasks.length}</span>
                  </header>

                  <div className=\"space-y-3\">
                    {colTasks.map((task, index) => (
                      <article
                        key={task.id}
                        className={`bg-neutral-50 p-3 rounded shadow-sm ${getPriorityBorderClass(task.priority)}`}
                        draggable
                        onDragStart={e => handleDragStart(e, task.id, col.id)}
                        onDragOver={e => e.preventDefault()}
                        onDrop={e => handleDropOnCard(e, col.id, index)}
                        role=\"button\"
                        tabIndex={0}
                        aria-label={`${task.title}. Press space to grab.`}
                      >
                        <div className=\"flex justify-between items-start\">
                          <div style={{ minWidth: 0 }}>
                            <h4 className=\"font-medium text-sm truncate\">{task.title}</h4>
                            {task.description && <p className=\"text-xs text-gray-600 line-clamp-2\">{task.description}</p>}
                          </div>

                          <div className=\"flex flex-col items-end gap-2\">
                            <button onClick={() => deleteTask(task.id)} className=\"text-xs text-red-600 hover:underline\">Delete</button>
                            <span className=\"text-xs text-gray-400\">#{index + 1}</span>
                          </div>
                        </div>

                        <div className=\"flex items-center justify-between mt-2\">
                          <div className=\"flex gap-1\">
                            {task.tags?.slice(0,3).map(t => <span key={t} className=\"text-xs bg-neutral-100 px-2 py-0.5 rounded\">{t}</span>)}
                          </div>

                          <div className=\"flex items-center gap-2\">
                            {task.assignee && <div className=\"w-6 h-6 bg-primary-500 rounded-full text-white text-xs flex items-center justify-center\">{getInitials(task.assignee)}</div>}
                            {task.dueDate && <div className={`text-xs ${isOverdue(task.dueDate) ? 'text-red-600' : 'text-neutral-500'}`}>Due: {formatDate(task.dueDate)}</div>}
                          </div>
                        </div>
                      </article>
                    ))}

                    {colTasks.length === 0 && <div className=\"text-sm text-gray-400 py-6\">No tasks</div>}
                  </div>

                  <div className=\"mt-4\">
                    {addingTo === col.id ? (
                      <div className=\"space-y-2\">
                        <input
                          className=\"w-full border px-2 py-1 rounded\"
                          placeholder=\"Task title\"
                          value={newTaskTitle}
                          onChange={e => setNewTaskTitle(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') addTask(col.id); }}
                        />
                        <div className=\"flex gap-2\">
                          <button className=\"px-3 py-1 bg-primary-500 text-white rounded\" onClick={() => addTask(col.id)}>Add</button>
                          <button className=\"px-3 py-1 border rounded\" onClick={() => { setAddingTo(null); setNewTaskTitle(''); }}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button className=\"w-full text-sm py-2 border rounded\" onClick={() => { setAddingTo(col.id); setNewTaskTitle(''); }}>
                        + Add Task
                      </button>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      );
    }
