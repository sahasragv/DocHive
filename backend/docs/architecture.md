# Backend Architecture

## Overview

DocHive backend is built with NestJS and TypeScript. It combines MongoDB for document metadata and chunk storage, Chroma for vector search, Ollama for embeddings and LLM generation, and JWT-based authentication for protected routes.

## Service Dependencies

```
┌─────────────────────────────────────────────┐
│  NestJS Application (Port 3000)             │
│  ┌─────────────────────────────────────────┐│
│  │ Auth Module                             ││
│  │ ├─ Register (JWT generation)            ││
│  │ └─ Login (JWT validation)               ││
│  └─────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────┐│
│  │ Documents Module                        ││
│  │ ├─ Upload (file handling)               ││
│  │ ├─ Parse (PDF/DOCX extraction)          ││
│  │ ├─ Chunk (text splitting)               ││
│  │ └─ Store (MongoDB persistence)          ││
│  └─────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────┐│
│  │ Embeddings Module                       ││
│  │ ├─ Generate (Ollama embeddings)         ││
│  │ └─ Store (Chroma vector store)          ││
│  └─────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────┐│
│  │ Retrieval Module                        ││
│  │ ├─ Search (semantic search)             ││
│  │ └─ Rank (relevance scoring)             ││
│  └─────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────┐│
│  │ Chat Module                             ││
│  │ ├─ Query (combine retrieval + prompt)   ││
│  │ └─ Generate (LLM response)              ││
│  └─────────────────────────────────────────┘│
└────────┬─────────┬──────────┬────────────────┘
         │         │          │
         ▼         ▼          ▼
    MongoDB    Chroma      Ollama
  (Document   (Vector    (Embeddings
   Metadata)  Search)     & LLM)
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed with bcrypt),
  createdAt: Date,
  updatedAt: Date
}
```

### Documents Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  filename: String,
  mimeType: String (application/pdf or application/vnd.openxmlformats...),
  size: Number (bytes),
  filePath: String (local storage path),
  extractedText: {
    characterCount: Number,
    chunkCount: Number
  },
  uploadedAt: Date,
  updatedAt: Date
}
```

### Document Chunks Collection
```javascript
{
  _id: ObjectId,
  documentId: ObjectId (ref: Documents),
  chunkIndex: Number,
  content: String,
  characterCount: Number,
  createdAt: Date
}
```

### Chroma Vector Store
```javascript
// Stored separately in Chroma (not MongoDB)
{
  ids: ["chunk_uuid_1", "chunk_uuid_2", ...],
  embeddings: [[0.1, 0.2, ...], [0.3, 0.4, ...], ...],
  documents: ["chunk text 1", "chunk text 2", ...],
  metadatas: [
    {documentId: "...", chunkIndex: 0},
    {documentId: "...", chunkIndex: 1},
    ...
  ]
}
```

## Core modules

### App module

The application root module wires all feature modules together and configures global environment loading and MongoDB connection setup.

### Authentication

The authentication layer handles:

- user registration
- login
- password hashing with bcrypt
- JWT token generation and validation

### Documents

The documents module is responsible for:

- receiving uploaded files
- saving file metadata
- extracting text from PDF and DOCX files
- splitting content into manageable text chunks
- persisting chunk records in MongoDB
- triggering embedding generation

### Embeddings

The embeddings module prepares document chunks for semantic retrieval by:

- generating embeddings from chunk text
- sending the embeddings to the vector store

### Vector

The vector module abstracts the storage layer for semantic search. In the current implementation, Chroma is used as the vector store backend.

### Retrieval

The retrieval service turns a question into an embedding, queries the vector database, and returns ranked document chunks.

### Chat

The chat service combines retrieval results and the LLM response prompt to produce a grounded answer.

## Data flow

```text
User uploads file
  -> save metadata in MongoDB
  -> extract text
  -> split into chunks
  -> store chunks in MongoDB
  -> generate embeddings
  -> save embeddings in Chroma

User asks question
  -> generate embedding for the query
  -> search similar chunks in Chroma
  -> build contextual prompt
  -> ask LLM for answer
```

## Error Handling Strategy

### HTTP Status Codes

| Status | Use Case | Example |
|--------|----------|----------|
| 200 | Success | Successful data retrieval or operation |
| 201 | Resource created | Document uploaded successfully |
| 400 | Bad request | Invalid input, missing fields |
| 401 | Unauthorized | Missing or invalid JWT token |
| 409 | Conflict | Duplicate email registration |
| 500 | Server error | Service unavailable, database error |

### Error Handling Flow

1. **Input Validation**: DTOs validate incoming request data
2. **Authentication**: JWT guard validates tokens before protected routes
3. **Business Logic**: Services throw specific exceptions
4. **Global Exception Filter**: Catches exceptions and formats error responses
5. **Client Response**: Standardized error response with status code and message

### Common Error Scenarios

| Scenario | Handling |
|----------|----------|
| File too large (>10MB) | 400 Bad Request with message |
| Invalid file format | 400 Bad Request with message |
| MongoDB unavailable | 500 Internal Server Error |
| Chroma unavailable | 500 Internal Server Error (search/chat fails) |
| Ollama unavailable | 500 Internal Server Error (embedding/generation fails) |
| Missing JWT token | 401 Unauthorized |
| Expired JWT token | 401 Unauthorized |
