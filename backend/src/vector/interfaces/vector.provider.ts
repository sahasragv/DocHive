export interface VectorDocument {
  id: string;
  embedding: number[];
  document: string;
  metadata: Record<string, unknown>;
}

export interface VectorSearchResult {
  id: string;
  score: number;
  metadata: Record<string, unknown>;
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