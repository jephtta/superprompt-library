import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  increment,
  type Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Prompt } from '@/types';

const COLLECTION = 'prompts';

function toDate(val: Timestamp | Date | string): Date {
  if (val && typeof val === 'object' && 'toDate' in val) return val.toDate();
  return new Date(val as string);
}

function docToPrompt(id: string, data: Record<string, unknown>): Prompt {
  return {
    ...data,
    id,
    createdAt: toDate(data.createdAt as Timestamp),
    updatedAt: toDate(data.updatedAt as Timestamp),
  } as Prompt;
}

export async function getPrompts(filters?: { category?: string; status?: string }): Promise<Prompt[]> {
  let q = query(collection(db, COLLECTION), orderBy('updatedAt', 'desc'));
  if (filters?.category) {
    q = query(collection(db, COLLECTION), where('category', '==', filters.category), orderBy('updatedAt', 'desc'));
  }
  if (filters?.status) {
    q = query(collection(db, COLLECTION), where('status', '==', filters.status), orderBy('updatedAt', 'desc'));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => docToPrompt(d.id, d.data()));
}

export async function getPromptById(id: string): Promise<Prompt | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return docToPrompt(snap.id, snap.data());
}

export async function createPrompt(data: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'copyCount'>): Promise<string> {
  const now = new Date();
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    copyCount: 0,
    createdAt: now,
    updatedAt: now,
  });
  return ref.id;
}

export async function updatePrompt(id: string, data: Partial<Prompt>): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { ...data, updatedAt: new Date() });
}

export async function deletePrompt(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

export async function incrementCopyCount(id: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { copyCount: increment(1) });
}

export async function syncPromptsToAlgolia(): Promise<number> {
  // Stub: In production, Google Docs API would fetch docs, extract prompts,
  // and sync to both Firestore and Algolia. Since Google Docs API is unsupported,
  // this returns 0 and prompts are managed via manual CRUD.
  return 0;
}
