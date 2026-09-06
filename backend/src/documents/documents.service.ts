import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs/promises';

import { DocumentListDto } from './dto/document-list.dto';
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
  private readonly logger = new Logger(
    DocumentsService.name,
  );

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

    const document =
      await this.documentModel.create({
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
        uploadedBy: userId,
        status: 'uploaded',
      });

    try {
      await this.documentModel.findByIdAndUpdate(
        document._id,
        {
          status: 'processing',
        },
      );

      this.logger.log(
        'Extracting document text...',
      );

      const extractedText =
        await this.parserService.extractText(
          file.path,
        );

      this.logger.log(
        `Extracted ${extractedText.length} characters`,
      );

      const chunks =
        this.textChunkerService.splitText(
          extractedText,
        );

      this.logger.log(
        `Generated ${chunks.length} chunk(s)`,
      );

      const chunkDocuments = chunks.map(
        (text, index) => ({
          documentId: document._id,
          chunkIndex: index,
          text,
        }),
      );

      await this.chunkModel.insertMany(
        chunkDocuments,
      );

      this.logger.log(
        `Stored ${chunkDocuments.length} chunks in MongoDB`,
      );

      await this.embeddingService.processDocument(
        document._id.toString(),
      );

      await this.documentModel.findByIdAndUpdate(
        document._id,
        {
          status: 'indexed',
        },
      );

      this.logger.log(
        'Document indexing completed successfully',
      );

      return {
        message: 'File uploaded successfully',
        document: {
          ...document.toObject(),
          status: 'indexed',
        },
        extractedCharacters:
          extractedText.length,
        totalChunks: chunks.length,
      };
    } catch (error) {
      await this.documentModel.findByIdAndUpdate(
        document._id,
        {
          status: 'failed',
        },
      );

      this.logger.error(
        'Document processing failed',
        error,
      );

      throw error;
    }
  }

  async findAll(
    userId: string,
  ): Promise<DocumentListDto[]> {
    const documents = await this.documentModel
      .find({
        uploadedBy: userId,
      })
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
          originalName:
            document.originalName,
          uploadedAt,
          status: document.status,
          chunkCount,
          size: document.size,
          mimetype: document.mimetype,
        };
      }),
    );
  }

  async deleteDocument(
    id: string,
    userId: string,
  ) {
    this.logger.log(
      `Deleting document: ${id}`,
    );

    const document =
      await this.documentModel.findOne({
        _id: id,
        uploadedBy: userId,
      });

    if (!document) {
      throw new NotFoundException(
        'Document not found',
      );
    }

    try {
      await fs.unlink(document.path);
    } catch {
      this.logger.warn(
        `File not found: ${document.path}`,
      );
    }

    await this.chunkModel.deleteMany({
      documentId: document._id,
    });

    await this.documentModel.findByIdAndDelete(
      id,
    );

    this.logger.log(
      `Document ${id} deleted successfully`,
    );

    return {
      message:
        'Document deleted successfully',
    };
  }
}