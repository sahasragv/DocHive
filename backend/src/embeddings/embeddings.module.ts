import { Module } from '@nestjs/common';
import { TextChunkerService } from './text-chunker/text-chunker.service';

@Module({
  providers: [TextChunkerService],
  exports: [TextChunkerService],
})
export class EmbeddingsModule {}