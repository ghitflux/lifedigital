/**
 * Documents Store - Zustand
 *
 * Manages documents upload and list
 */

import { create } from 'zustand'

export interface Document {
  id: string
  type: 'contracheque' | 'rg' | 'cpf' | 'comprovante' | 'outros'
  name: string
  status: 'pending' | 'scanning' | 'approved' | 'rejected'
  url?: string
  uploadedAt: string
  rejectionReason?: string
}

interface DocumentsState {
  documents: Document[]
  isLoading: boolean
  error: string | null
  uploadProgress: number

  // Actions
  setDocuments: (documents: Document[]) => void
  addDocument: (document: Document) => void
  updateDocument: (id: string, updates: Partial<Document>) => void
  removeDocument: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string) => void
  clearError: () => void
  setUploadProgress: (progress: number) => void
}

export const useDocumentsStore = create<DocumentsState>((set) => ({
  documents: [],
  isLoading: false,
  error: null,
  uploadProgress: 0,

  setDocuments: (documents) => set({ documents, error: null }),

  addDocument: (document) =>
    set((state) => ({
      documents: [document, ...state.documents],
      error: null,
    })),

  updateDocument: (id, updates) =>
    set((state) => ({
      documents: state.documents.map((doc) => (doc.id === id ? { ...doc, ...updates } : doc)),
      error: null,
    })),

  removeDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((doc) => doc.id !== id),
      error: null,
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  setUploadProgress: (progress) => set({ uploadProgress: progress }),
}))
