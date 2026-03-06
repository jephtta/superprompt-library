export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  status: 'active' | 'pending_review' | 'suppressed';
  suppressedManually: boolean;
  copyCount: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  sourceDocId?: string;
  sourceDocUrl?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  { id: 'general', name: 'General', description: 'General purpose prompts', color: '#6366f1' },
  { id: 'coding', name: 'Coding', description: 'Software development prompts', color: '#22c55e' },
  { id: 'writing', name: 'Writing', description: 'Content writing prompts', color: '#f59e0b' },
  { id: 'analysis', name: 'Analysis', description: 'Data analysis prompts', color: '#ef4444' },
  { id: 'creative', name: 'Creative', description: 'Creative and brainstorming prompts', color: '#8b5cf6' },
  { id: 'marketing', name: 'Marketing', description: 'Marketing and copywriting prompts', color: '#ec4899' },
];
