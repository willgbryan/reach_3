'use server'
import 'server-only'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { createClient } from '@/db/server'
import { getCurrentUserId } from './user'
import { ServerActionResult } from '@/types'

export interface DocumentAnalysis {
    id: string;
    path: string;
    title: string;
    messages: any[];
    createdAt: string;
    filePaths: string[];
  }
  
  function isDocumentAnalysis(value: any): value is DocumentAnalysis {
    return (
      typeof value === 'object' &&
      value !== null &&
      typeof value.id === 'string' &&
      typeof value.path === 'string' &&
      typeof value.title === 'string' &&
      Array.isArray(value.messages) &&
      typeof value.createdAt === 'string' &&
      Array.isArray(value.filePaths) &&
      value.filePaths.every((path: any) => typeof path === 'string')
    );
  }
  
  export async function getDocumentAnalyses(userId?: string | null): Promise<DocumentAnalysis[]> {
    if (!userId) {
      return [];
    }
    try {
      const db = createClient(cookies());
      const { data, error } = await db
        .from('chats')
        .select('payload')
        .order('payload->createdAt', { ascending: false })
        .eq('user_id', userId)
        .eq('payload->title', 'Document Analysis');
  
      if (error) throw error;
  
      return (data ?? [])
        .map(entry => entry.payload as unknown as DocumentAnalysis)
        .filter((item): item is DocumentAnalysis => isDocumentAnalysis(item));
    } catch (error) {
      console.error('Error fetching document analyses:', error);
      return [];
    }
  }

  export async function removeAnalysis({ id, path }: { id: string; path: string }): ServerActionResult<void> {
    try {
      const db = createClient(cookies())
      const { error } = await db
        .from('chats')
        .delete()
        .eq('id', id)
        .eq('payload->title', 'Document Analysis');
      if (error) throw error;
      revalidatePath('/')
      revalidatePath(path)
      return;
    } catch (error) {
      console.error('Error removing analysis:', error)
      return { error: 'Failed to remove analysis' }
    }
  }
  
  export async function shareAnalysis(analysis: DocumentAnalysis): ServerActionResult<DocumentAnalysis> {
    try {
      const payload = {
        ...analysis,
        sharePath: `/share-analysis/${analysis.id}`,
      }
      const db = createClient(cookies())
      const { error } = await db
        .from('chats')
        .update({ payload })
        .eq('id', analysis.id)
        .eq('payload->title', 'Document Analysis');
      if (error) throw error;
      return payload;
    } catch (error) {
      console.error('Error sharing analysis:', error)
      return { error: 'Failed to share analysis' }
    }
  }
  
  export async function clearAnalyses(): ServerActionResult<void> {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { error: 'Unauthorized' }
    }
    try {
      const db = createClient(cookies())
      const { error } = await db
        .from('chats')
        .delete()
        .eq('user_id', userId)
        .eq('payload->title', 'Document Analysis');
      if (error) throw error;
      revalidatePath('/')
      return;
    } catch (error) {
      console.error('Error clearing analyses:', error)
      return { error: 'Failed to clear analyses' }
    }
  }