export class ChatResponseDto {
  answer!: string;

  sources!: {
    documentId: string;
    chunkIndex: number;
    score: number;
  }[];
}