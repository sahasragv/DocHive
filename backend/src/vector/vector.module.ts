import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import {
  DocumentChunk,
  DocumentChunkSchema,
} from '../documents/schemas/document-chunk.schema';
import { VectorService } from './vector.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: DocumentChunk.name,
        schema: DocumentChunkSchema,
      },
    ]),
  ],
  providers: [VectorService],
  exports: [VectorService],
})
export class VectorModule {}