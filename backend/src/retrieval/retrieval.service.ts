import { Injectable, Logger, BadRequestException } from '@nestjs/common';

import { OllamaProvider } from '../embeddings/providers/ollama/ollama.provider';
import { VectorService } from '../vector/vector.service';

@Injectable()
export class RetrievalService {
  private readonly logger = new Logger(RetrievalService.name);

  constructor(
    private readonly ollamaProvider: OllamaProvider,
    private readonly vectorService: VectorService,
  ) {}

  async search(query: string) {
    if (!query.trim()) {
      throw new BadRequestException(
        'Search query cannot be empty',
      );
    }

    this.logger.log(`Searching: ${query}`);

    const embedding =
      await this.ollamaProvider.generateEmbedding(query);

    const topK = 2;

    const results =
      await this.vectorService.similaritySearch(
        embedding,
        topK,
      );

    return {
      query,
      total: results.length,
      results: results.map((result) => ({
        id: result.id,
        score: result.score,
        document: result.document,
        documentId: result.metadata.documentId,
        chunkIndex: result.metadata.chunkIndex,
      })),
    };
  }
}