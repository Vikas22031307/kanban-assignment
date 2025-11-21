import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import KanbanBoard from './KanbanBoard';

const sampleColumns = [
  { id: 'todo', title: 'To Do', taskIds: ['task-1','task-2'] },
  { id: 'inprogress', title: 'In Progress', taskIds: ['task-3'] },
  { id: 'done', title: 'Done', taskIds: ['task-4'] }
];

const sampleTasks = {
  'task-1': { id: 'task-1', title: 'Write README', status: 'todo', priority: 'medium', assignee: 'Vikas', tags: ['docs'] },
  'task-2': { id: 'task-2', title: 'Create wireframe', status: 'todo', priority: 'high', assignee: 'Alice', tags: ['design'] },
  'task-3': { id: 'task-3', title: 'Implement header', status: 'inprogress', priority: 'urgent', assignee: 'Bob', tags: ['frontend'] },
  'task-4': { id: 'task-4', title: 'Project kickoff', status: 'done', priority: 'low', assignee: 'Vikas', tags: [] }
};

const meta: Meta<typeof KanbanBoard> = {
  title: 'Components/KanbanBoard',
  component: KanbanBoard,
};

export default meta;

type Story = StoryObj<typeof KanbanBoard>;

export const Default: Story = {
  args: {
    initialColumns: sampleColumns,
    initialTasks: sampleTasks
  }
};

export const Empty: Story = {
  args: {
    initialColumns: sampleColumns.map(c => ({ ...c, taskIds: [] })),
    initialTasks: {}
  }
};

export const ManyTasks: Story = {
  args: {
    initialColumns: sampleColumns,
    initialTasks: (() => {
      const tasks: any = {};
      for (let i = 1; i <= 40; i++) tasks[`t-${i}`] = { id: `t-${i}`, title: `Task ${i}`, status: i % 3 === 0 ? 'done' : (i % 3 === 1 ? 'todo' : 'inprogress') };
      return tasks;
    })()
  }
};
