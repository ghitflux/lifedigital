import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { queryKeys } from "../queryClient";
import { useAuthStore } from "../../stores/authStore";
import { useDocumentsStore } from "../../stores/documentsStore";
import {
  deleteDocument as deleteDocumentRequest,
  finalizeUpload as finalizeUploadRequest,
  getDocument as getDocumentRequest,
  getDocuments as getDocumentsRequest,
  getPresignedUrl as getPresignedUrlRequest,
  DocumentStatus,
  DocumentType,
} from "../../services/api";
import type {
  Document,
  FinalizeUploadRequest,
  GetPresignedUrlRequest,
  GetPresignedUrlResponse,
} from "../../services/api";

interface UploadDocumentRequest {
  file: {
    uri: string;
    name: string;
    type: string;
    size: number;
  };
  type: DocumentType;
  onProgress?: (progress: number) => void;
}

export { DocumentStatus, DocumentType };

export function useDocuments() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setDocuments = useDocumentsStore((state) => state.setDocuments);

  return useQuery({
    queryKey: queryKeys.documents,
    queryFn: (): Promise<Document[]> => getDocumentsRequest(),
    enabled: Boolean(accessToken),
    onSuccess: (data) => setDocuments(data),
  });
}

export function useDocument(id: string) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: queryKeys.document(id),
    queryFn: (): Promise<Document> => getDocumentRequest(id),
    enabled: Boolean(accessToken) && Boolean(id),
  });
}

export function useGetPresignedUrl() {
  return useMutation({
    mutationFn: (
      request: GetPresignedUrlRequest,
    ): Promise<GetPresignedUrlResponse> => getPresignedUrlRequest(request),
    retry: 1,
    onError: (error) => {
      console.error("Failed to get presigned URL:", error);
    },
  });
}

export function useFinalizeUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: FinalizeUploadRequest): Promise<Document> =>
      finalizeUploadRequest(request),
    onSuccess: (document) => {
      queryClient.setQueryData(queryKeys.document(document.id), document);
      queryClient.invalidateQueries({ queryKey: queryKeys.documents });
    },
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const addDocument = useDocumentsStore((state) => state.addDocument);

  return useMutation({
    mutationFn: async (request: UploadDocumentRequest): Promise<Document> => {
      if (!accessToken) {
        throw new Error("Missing access token");
      }

      const { file, type, onProgress } = request;

      const presigned = await getPresignedUrlRequest({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });

      const fileBlob = await fetch(file.uri).then((response) =>
        response.blob(),
      );

      await axios.put(presigned.uploadUrl, fileBlob, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (event) => {
          if (event.total && onProgress) {
            const progress = Math.round((event.loaded * 100) / event.total);
            onProgress(progress);
          }
        },
      });

      const document = await finalizeUploadRequest({
        objectKey: presigned.objectKey,
        type,
      });

      return document;
    },
    onSuccess: (document) => {
      addDocument(document);
      queryClient.setQueryData(queryKeys.document(document.id), document);
      queryClient.invalidateQueries({ queryKey: queryKeys.documents });
    },
    onError: (error) => {
      console.error("Failed to upload document:", error);
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  const removeDocument = useDocumentsStore((state) => state.removeDocument);

  return useMutation({
    mutationFn: (documentId: string): Promise<void> =>
      deleteDocumentRequest(documentId),
    onSuccess: (_data, documentId) => {
      removeDocument(documentId);
      queryClient.invalidateQueries({ queryKey: queryKeys.documents });
    },
    onError: (error) => {
      console.error("Failed to delete document:", error);
    },
  });
}
