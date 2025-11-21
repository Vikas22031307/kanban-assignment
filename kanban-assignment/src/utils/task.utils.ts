import type { Priority } from '../types/kanban.types';

export const isOverdue = (iso?: string): boolean => {
  if (!iso) return false;
  const due = new Date(iso);
  return new Date() > due;
};

export const getInitials = (name?: string): string => {
  if (!name) return '';
  return name.split(' ').map(p => p[0] ?? '').join('').slice(0,2).toUpperCase();
};

export const formatDate = (iso?: string): string => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString();
};

export const getPriorityBorderClass = (p?: Priority): string => {
  switch(p){
    case 'low': return 'border-l-4 border-blue-400';
    case 'medium': return 'border-l-4 border-yellow-400';
    case 'high': return 'border-l-4 border-orange-400';
    case 'urgent': return 'border-l-4 border-red-500';
    default: return '';
  }
};
