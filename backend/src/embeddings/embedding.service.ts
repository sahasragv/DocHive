import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);

  async processDocument(documentId: string): Promise<void> {
    this.logger.log(
      `Processing embeddings for document: ${documentId}`,
    );
  }
}