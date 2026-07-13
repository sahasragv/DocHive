# DocHive Backend Documentation

This folder contains documentation for the backend of the DocHive application.

## What the backend does

The backend is a NestJS service that supports:

- user authentication and registration
- document upload and storage
- text extraction from PDF and DOCX files
- chunking of extracted text
- embedding generation and vector search
- retrieval-augmented chat answers using an LLM

## Backend structure

The main application entrypoint is the NestJS module in [src/app.module.ts](src/app.module.ts).

Key folders:

- [src/auth](src/auth) - authentication, JWT, and user registration/login
- [src/users](src/users) - user persistence
- [src/documents](src/documents) - document upload, parsing, chunking, and storage
- [src/embeddings](src/embeddings) - text chunk embedding generation
- [src/vector](src/vector) - vector store integration with Chroma
- [src/retrieval](src/retrieval) - semantic search over stored document chunks
- [src/chat](src/chat) - chat workflow using retrieval plus LLM generation
- [src/llm](src/llm) - LLM provider integration

## Main runtime flow

1. A user uploads a PDF or DOCX file.
2. The backend saves the file and metadata.
3. The text is extracted and split into chunks.
4. Each chunk is embedded and stored in a vector database.
5. A user question is turned into an embedding and compared against stored chunks.
6. The most relevant chunks are passed to an LLM to generate an answer.

## Documentation index

- [Architecture](architecture.md)
- [API endpoints](api.md)
- [Environment variables](environment.md)

## Prerequisites

Before running the backend, ensure the following services are running:

### 1. MongoDB
Start MongoDB locally:
```bash
# Using Docker (recommended)
docker run --name mongodb -d -p 27017:27017 mongo:latest

# Or install MongoDB locally and run:
mongod
```

### 2. Chroma
Start Chroma vector database:
```bash
# Using Docker (recommended)
docker run --name chroma -d -p 8000:8000 ghcr.io/chroma-core/chroma:latest

# Or install Chroma locally:
pip install chromadb
chroma run --host 0.0.0.0 --port 8000
```

### 3. Ollama
Download and start Ollama:
```bash
# Visit https://ollama.ai and download Ollama
# Start Ollama (runs on http://localhost:11434 by default)
ollama serve

# In another terminal, pull the models:
ollama pull tinyllama  # For chat
ollama pull nomic-embed-text  # For embeddings
```

## Local development

### 1. Install dependencies

From the backend folder, run:
```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the backend folder. See [environment variables documentation](environment.md) for details and `.env.example` for a template.

### 3. Start the development server

```bash
npm run start:dev
```

The API will start on port 3000 by default unless a different PORT is configured in your `.env` file.
