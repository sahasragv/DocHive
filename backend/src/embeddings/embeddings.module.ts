import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { TextChunkerService } from './text-chunker/text-chunker.service';
import { EmbeddingService } from './embedding.service';
import { OllamaProvider } from './providers/ollama/ollama.provider';

@Module({
  imports: [HttpModule],
  providers: [
    TextChunkerService,
    EmbeddingService,
    OllamaProvider,
  ],
  exports: [
    TextChunkerService,
    EmbeddingService,
  ],
})
export class EmbeddingsModule {}