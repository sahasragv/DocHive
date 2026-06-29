import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EmbeddingsModule } from '../embeddings/embeddings.module';

import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { DocumentParserService } from './document-parser.service';

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
  ],
  controllers: [DocumentsController],
  providers: [
    DocumentsService,
    DocumentParserService,
  ],
  exports: [DocumentsService],
})
export class DocumentsModule {}