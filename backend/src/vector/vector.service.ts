import { Injectable } from '@nestjs/common';

import {
  VectorDocument,
  VectorSearchResult,
} from './interfaces/vector.provider';
import { ChromaProvider } from './providers/chroma.provider';

@Injectable()
export class VectorService {
  constructor(
    private readonly chromaProvider: ChromaProvider,
  ) {}

  async upsert(documents: VectorDocument[]): Promise<void> {
    await this.chromaProvider.upsert(documents);
  }

  async delete(ids: string[]): Promise<void> {
    await this.chromaProvider.delete(ids);
  }

  async similaritySearch(
    embedding: number[],
    topK = 5,
  ): Promise<VectorSearchResult[]> {
    return this.chromaProvider.similaritySearch(
      embedding,
      topK,
    );
  }
}