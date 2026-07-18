import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { DocumentListDto } from './dto/document-list.dto';
import { VectorService } from '../vector/vector.service';
import { TextChunkerService } from '../embeddings/text-chunker/text-chunker.service';
import { EmbeddingService } from '../embeddings/embedding.service';
import { DocumentParserService } from './document-parser.service';
import * as fs from 'fs/promises';
import {
  NotFoundException,
} from '@nestjs/common';

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

    private readonly vectorService: VectorService,
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

    // Debug chunks
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

  async findAll(): Promise<DocumentListDto[]> {
    const documents = await this.documentModel
      .find()
      .sort({ createdAt: -1 });

    return Promise.all(
      documents.map(async (document) => {
        const chunkCount =
          await this.chunkModel.countDocuments({
            documentId: document._id,
          });

        const uploadedAt = (
          document as DocumentDocument & {
            createdAt: Date;
          }
        ).createdAt;

        return {
          id: String(document._id),
          originalName: document.originalName,
          uploadedAt,
          status: document.status,
          chunkCount,
          size: document.size,
          mimetype: document.mimetype,
        };
      }),
    );
  }


  async deleteDocument(id: string) {
    this.logger.log(`Deleting document: ${id}`);

    const document = await this.documentModel.findById(id);

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // Load chunks
    const chunks = await this.chunkModel.find({
      documentId: document._id,
    });

    // Delete vectors from ChromaDB
    const vectorIds = chunks.map((chunk) => chunk._id.toString());

    await this.vectorService.delete(vectorIds);

    this.logger.log(
      `Deleted ${vectorIds.length} vectors from ChromaDB`,
    );

    // Delete uploaded file
    try {
      await fs.unlink(document.path);
    } catch {
      this.logger.warn(
        `File not found: ${document.path}`,
      );
    }

    // Delete chunks
    await this.chunkModel.deleteMany({
      documentId: document._id,
    });

    // Delete document
    await this.documentModel.findByIdAndDelete(id);

    this.logger.log(
      `Document ${id} deleted successfully`,
    );

    return {
      message: 'Document deleted successfully',
    };
  }}