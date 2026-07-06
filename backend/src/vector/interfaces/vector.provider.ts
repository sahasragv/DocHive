import { Metadata } from 'chromadb';

export interface VectorDocument {
  id: string;
  embedding: number[];
  document: string;
  metadata: Metadata;
}

export interface VectorSearchResult {
  id: string;
  score: number;
  metadata: Metadata;
  document?: string;
}

export interface VectorProvider {
  upsert(documents: VectorDocument[]): Promise<void>;

  delete(ids: string[]): Promise<void>;

  similaritySearch(
    embedding: number[],
    topK: number,
  ): Promise<VectorSearchResult[]>;
}