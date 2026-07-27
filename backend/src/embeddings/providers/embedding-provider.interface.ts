export interface EmbeddingProvider {
  generateEmbeddings(texts: string[]): Promise<number[][]>;
  generateEmbedding(text: string): Promise<number[]>;
}