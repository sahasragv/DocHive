import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { TextChunkerService } from '../embeddings/text-chunker/text-chunker.service';
import { EmbeddingService } from '../embeddings/embedding.service';
import { DocumentParserService } from './document-parser.service';

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
    this.logger.log(
      `Uploading document: ${file.originalname}`,
    );

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

    this.logger.log('Extracting document text...');

    // Extract text
    const extractedText =
      await this.parserService.extractText(file.path);

    this.logger.log(
      `Extracted ${extractedText.length} characters`,
    );

    // Chunk document
    const chunks =
      this.textChunkerService.splitText(extractedText);

    this.logger.log(
      `Generated ${chunks.length} chunk(s)`,
    );

    // DEBUG: Print every chunk
    console.log('\n========================================');
    console.log('GENERATED CHUNKS');
    console.log('========================================');

    chunks.forEach((chunk, index) => {
      console.log(`\n----- Chunk ${index} -----\n`);
      console.log(chunk);
    });

    console.log('\n========================================\n');

    // Prepare chunk documents
    const chunkDocuments = chunks.map((text, index) => ({
      documentId: document._id,
      chunkIndex: index,
      text,
    }));

    // Store chunks
    await this.chunkModel.insertMany(chunkDocuments);

    this.logger.log(
      `Stored ${chunkDocuments.length} chunks in MongoDB`,
    );

    // Generate embeddings + store vectors
    await this.embeddingService.processDocument(
      document._id.toString(),
    );

    this.logger.log(
      'Document indexing completed successfully',
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