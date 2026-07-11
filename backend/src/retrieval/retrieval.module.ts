import { Module } from '@nestjs/common';

import { RetrievalController } from './retrieval.controller';
import { RetrievalService } from './retrieval.service';

import { EmbeddingsModule } from '../embeddings/embeddings.module';
import { VectorModule } from '../vector/vector.module';

@Module({
  imports: [
    EmbeddingsModule,
    VectorModule,
  ],
  controllers: [RetrievalController],
  providers: [RetrievalService],
  exports: [RetrievalService],
})
export class RetrievalModule {}