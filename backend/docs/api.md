# API Reference

## Authentication Headers

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Authentication

### POST /auth/register
Creates a new user account.

**Request body:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123"
}
```

**Success response (201 Created):**

```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Error responses:**
- `400 Bad Request`: Invalid email format or password too weak
- `409 Conflict`: Email already registered

### POST /auth/login
Authenticates a user and returns a JWT token.

**Request body:**

```json
{
  "email": "jane@example.com",
  "password": "secret123"
}
```

**Success response (200 OK):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

**Error responses:**
- `401 Unauthorized`: Invalid email or password
- `400 Bad Request`: Missing required fields

## Documents

### POST /documents/upload
Uploads a PDF or DOCX document.

**Requirements:**
- JWT authentication required
- Content-Type: multipart/form-data
- File field name: `file`
- Supported formats: PDF (.pdf), Word (.docx)
- Max file size: 10 MB

**Example request:**
```bash
curl -X POST http://localhost:3000/documents/upload \
  -H "Authorization: Bearer <jwt_token>" \
  -F "file=@policy.pdf"
```

**Success response (201 Created):**

```json
{
  "id": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "filename": "policy.pdf",
  "mimeType": "application/pdf",
  "size": 245678,
  "uploadedAt": "2024-01-15T10:30:00Z",
  "extractedText": {
    "characterCount": 15234,
    "chunkCount": 12
  }
}
```

**Error responses:**
- `400 Bad Request`: Invalid file format or file too large
- `401 Unauthorized`: Missing or invalid JWT token
- `500 Internal Server Error`: Text extraction or embedding generation failed

### GET /documents
Returns all stored documents for the authenticated user.

**Requirements:**
- JWT authentication required

**Example request:**
```bash
curl -X GET http://localhost:3000/documents \
  -H "Authorization: Bearer <jwt_token>"
```

**Success response (200 OK):**

```json
[
  {
    "id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "filename": "policy.pdf",
    "mimeType": "application/pdf",
    "size": 245678,
    "uploadedAt": "2024-01-15T10:30:00Z",
    "extractedText": {
      "characterCount": 15234,
      "chunkCount": 12
    }
  }
]
```

**Error responses:**
- `401 Unauthorized`: Missing or invalid JWT token

## Retrieval

### POST /retrieval/search
Performs semantic search over indexed document chunks.

**Request body:**

```json
{
  "query": "What does the policy say about refunds?"
}
```

**Success response (200 OK):**

```json
{
  "results": [
    {
      "documentId": "507f1f77bcf86cd799439012",
      "chunkIndex": 2,
      "document": "Refund Policy: Customers may request a refund within 30 days of purchase...",
      "relevanceScore": 0.92
    },
    {
      "documentId": "507f1f77bcf86cd799439012",
      "chunkIndex": 3,
      "document": "To request a refund, contact support@example.com with your order number...",
      "relevanceScore": 0.87
    }
  ]
}
```

**Error responses:**
- `400 Bad Request`: Missing query parameter
- `500 Internal Server Error`: Vector database unavailable

## Chat

### POST /chat
Asks the assistant a question using retrieval-augmented generation (RAG). The system retrieves relevant document chunks and uses an LLM to generate an answer.

**Request body:**

```json
{
  "question": "Summarize the uploaded policy document"
}
```

**Success response (200 OK):**

```json
{
  "question": "Summarize the uploaded policy document",
  "answer": "The policy document outlines customer rights, refund procedures, and service terms. Key points include: 1) Refunds are available within 30 days, 2) Contact support for assistance, 3) Proof of purchase is required.",
  "sources": [
    {
      "documentId": "507f1f77bcf86cd799439012",
      "chunkIndex": 0
    },
    {
      "documentId": "507f1f77bcf86cd799439012",
      "chunkIndex": 2
    }
  ]
}
```

**Error responses:**
- `400 Bad Request`: Missing question parameter
- `500 Internal Server Error`: LLM service unavailable or embedding generation failed

## Status Codes

| Code | Meaning |
|------|----------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request parameters |
| 401 | Unauthorized - Missing or invalid JWT token |
| 409 | Conflict - Resource already exists (e.g., email already registered) |
| 500 | Internal Server Error - Server error occurred |
