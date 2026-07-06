import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChromaClient, Collection } from 'chromadb';
import { Metadata } from 'chromadb';

import {
  VectorDocument,
  VectorProvider,
  VectorSearchResult,
} from '../interfaces/vector.provider';


@Injectable()
export class ChromaProvider implements VectorProvider {
  private readonly logger = new Logger(ChromaProvider.name);

  private readonly client: ChromaClient;
  private collection?: Collection;

  constructor(
    private readonly configService: ConfigService,
  ) {
    const host = this.configService.get<string>('CHROMA_HOST');
    const port = this.configService.get<string>('CHROMA_PORT');

    this.client = new ChromaClient({
      path: `${host}:${port}`,
    });
  }

  private async getCollection(): Promise<Collection> {
    if (this.collection) {
      return this.collection;
    }

    const collectionName =
      this.configService.get<string>('CHROMA_COLLECTION')!;

    this.collection = await this.client.getOrCreateCollection({
      name: collectionName,
    });

    this.logger.log(
      `Connected to Chroma collection: ${collectionName}`,
    );

    return this.collection;
  }

  async upsert(documents: VectorDocument[]): Promise<void> {
    if (!documents.length) {
      return;
    }

    const collection = await this.getCollection();

    await collection.upsert({
      ids: documents.map((d) => d.id),
      embeddings: documents.map((d) => d.embedding),
      documents: documents.map((d) => d.document),
      metadatas: documents.map((d) => d.metadata),
    });
  }

  async delete(ids: string[]): Promise<void> {
    if (!ids.length) {
      return;
    }

    const collection = await this.getCollection();

    await collection.delete({
      ids,
    });
  }

  async similaritySearch(
    embedding: number[],
    topK: number,
  ): Promise<VectorSearchResult[]> {
    const collection = await this.getCollection();

    const result = await collection.query({
      queryEmbeddings: [embedding],
      nResults: topK,
    });

    return (result.ids?.[0] ?? []).map((id, index) => ({
      id,
      score: result.distances?.[0]?.[index] ?? 0,
      metadata: result.metadatas?.[0]?.[index] ?? {},
      document: result.documents?.[0]?.[index] ?? '',
    }));
  }
}