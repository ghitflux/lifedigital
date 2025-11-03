import { create } from "zustand";
import type { Document } from "../services/api";

type StoredDocument = Document;

interface DocumentsState {
  documents: StoredDocument[];
  isLoading: boolean;
  error: string | null;
  uploadProgress: number;
  setDocuments: (documents: StoredDocument[]) => void;
  addDocument: (document: StoredDocument) => void;
  updateDocument: (id: string, updates: Partial<StoredDocument>) => void;
  removeDocument: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  clearError: () => void;
  setUploadProgress: (progress: number) => void;
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
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, ...updates } : doc,
      ),
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
}));
