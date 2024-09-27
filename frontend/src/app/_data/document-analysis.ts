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
  analysisId: string;
}

export async function getDocumentAnalyses(userId?: string | null): Promise<DocumentAnalysis[]> {
  if (!userId) {
    return [];
  }
  try {
    const db = createClient(cookies());
    const { data } = await db
      .from('chats')
      .select('payload')
      .order('payload->createdAt', { ascending: false })
      .eq('user_id', userId)
      .eq('is_newsletter', false)
      .throwOnError();

    const analyses = (data ?? [])
      .map((entry) => entry.payload as unknown)
      .filter((payload): payload is DocumentAnalysis => isDocumentAnalysis(payload));

    const groupedAnalyses = analyses.reduce((acc, analysis) => {
      if (!acc[analysis.analysisId]) {
        acc[analysis.analysisId] = [];
      }
      acc[analysis.analysisId].push(analysis);
      return acc;
    }, {} as Record<string, DocumentAnalysis[]>);

    return Object.values(groupedAnalyses).map(group => group[0]);
  } catch (error) {
    console.error('Error fetching document analyses:', error);
    return [];
  }
}

function isDocumentAnalysis(value: unknown): value is DocumentAnalysis {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'path' in value &&
    'title' in value &&
    'messages' in value &&
    'createdAt' in value &&
    'filePaths' in value &&
    'analysisId' in value &&
    typeof (value as DocumentAnalysis).id === 'string' &&
    typeof (value as DocumentAnalysis).path === 'string' &&
    typeof (value as DocumentAnalysis).title === 'string' &&
    Array.isArray((value as DocumentAnalysis).messages) &&
    typeof (value as DocumentAnalysis).createdAt === 'string' &&
    Array.isArray((value as DocumentAnalysis).filePaths) &&
    (value as DocumentAnalysis).filePaths.every((path) => typeof path === 'string') &&
    typeof (value as DocumentAnalysis).analysisId === 'string'
  );
}

  export async function removeAnalysis({ id, path }: { id: string; path: string }): ServerActionResult<void> {
    try {
      const db = createClient(cookies())
      const { error } = await db
        .from('chats')
        .delete()
        .eq('id', id)
        .filter('payload->title', 'eq', 'DocumentAnalysis');
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
        .filter('payload->title', 'eq', 'DocumentAnalysis');
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
        .filter('payload->title', 'eq', 'Document Analysis');
      if (error) throw error;
      revalidatePath('/')
      return;
    } catch (error) {
      console.error('Error clearing analyses:', error)
      return { error: 'Failed to clear analyses' }
    }
  }