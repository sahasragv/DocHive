export class DocumentListDto {
  id!: string;

  originalName!: string;

  uploadedAt!: Date;

  status!: string;

  chunkCount!: number;

  size!: number;

  mimetype!: string;
}