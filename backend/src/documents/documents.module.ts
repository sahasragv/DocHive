import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EmbeddingsModule } from '../embeddings/embeddings.module';
import { VectorModule } from '../vector/vector.module';

import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { DocumentParserService } from './document-parser.service';
import { DocumentChunkService } from './document-chunk.service';

import {
  CompanyDocument,
  DocumentSchema,
} from './schemas/document.schema';

import {
  DocumentChunk,
  DocumentChunkSchema,
} from './schemas/document-chunk.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CompanyDocument.name,
        schema: DocumentSchema,
      },
      {
        name: DocumentChunk.name,
        schema: DocumentChunkSchema,
      },
    ]),
    EmbeddingsModule,
    VectorModule,
  ],
  controllers: [DocumentsController],
  providers: [
    DocumentsService,
    DocumentParserService,
    DocumentChunkService,
  ],
  exports: [
    DocumentsService,
    DocumentChunkService,
  ],
})
export class DocumentsModule {}