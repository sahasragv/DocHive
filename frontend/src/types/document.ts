export interface Document {
  id: string;
  originalName: string;
  uploadedAt: string;
  status: string;
  chunkCount: number;
  size: number;
  mimetype: string;
}