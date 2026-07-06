import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';

import { TextChunkerService } from './text-chunker/text-chunker.service';
import { EmbeddingService } from './embedding.service';
import { OllamaProvider } from './providers/ollama/ollama.provider';

import { VectorModule } from '../vector/vector.module';

import {
  DocumentChunk,
  DocumentChunkSchema,
} from '../documents/schemas/document-chunk.schema';

@Module({
  imports: [
    HttpModule,

    MongooseModule.forFeature([
      {
        name: DocumentChunk.name,
        schema: DocumentChunkSchema,
      },
    ]),

    VectorModule,
  ],
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