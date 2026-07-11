export class ChatResponseDto {
  question!: string;

  answer!: string;

  sources!: {
    documentId: string;
    chunkIndex: number;
  }[];
}