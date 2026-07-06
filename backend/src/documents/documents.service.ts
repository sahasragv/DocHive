import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TextChunkerService } from '../embeddings/text-chunker/text-chunker.service';
import { DocumentParserService } from './document-parser.service';
import { EmbeddingService } from '../embeddings/embedding.service';


import {
  CompanyDocument,
  DocumentDocument,
} from './schemas/document.schema';

import {
  DocumentChunk,
  DocumentChunkDocument,
} from './schemas/document-chunk.schema';

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(
    @InjectModel(CompanyDocument.name)
    private readonly documentModel: Model<DocumentDocument>,

    @InjectModel(DocumentChunk.name)
    private readonly chunkModel: Model<DocumentChunkDocument>,

    private readonly parserService: DocumentParserService,

    private readonly textChunkerService: TextChunkerService,

    private readonly embeddingService: EmbeddingService,
  ) {}

  async upload(
    file: Express.Multer.File,
    userId: string,
  ) {
    // Save document metadata
    const document = await this.documentModel.create({
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
      uploadedBy: userId,
      status: 'uploaded',
    });

    // Extract text from the uploaded document
    const extractedText =
      await this.parserService.extractText(file.path);
    const chunks =
      this.textChunkerService.splitText(extractedText);
    
    const chunkDocuments = chunks.map((text, index) => ({
      documentId: document._id,
      chunkIndex: index,
      text,
    }));

    await this.chunkModel.insertMany(chunkDocuments);

    this.logger.log(`Created ${chunks.length} chunks`);

    // Trigger embedding pipeline
    await this.embeddingService.processDocument(
      document._id.toString(),
    );

    return {
      message: 'File uploaded successfully',
      document,
      extractedCharacters: extractedText.length,
      totalChunks: chunks.length,
    };
  }

  async findAll() {
    return this.documentModel.find().sort({
      createdAt: -1,
    });
  }
}