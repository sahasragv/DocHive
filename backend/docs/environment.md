# Environment Variables

The backend expects the following environment variables to be configured in a `.env` file in the backend root directory.

## .env.example

Use this as a template for your `.env` file:

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/dochive

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Chroma Vector Store
CHROMA_HOST=localhost
CHROMA_PORT=8000
CHROMA_COLLECTION=dochive

# Ollama Services
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_EMBED_MODEL=nomic-embed-text
OLLAMA_CHAT_MODEL=tinyllama
```

## Required Variables

### `MONGO_URI`
- **Description**: MongoDB connection URI
- **Example**: `mongodb://localhost:27017/dochive`
- **How to get**: 
  - Local: Use `mongodb://localhost:27017/dochive` if MongoDB is running locally
  - MongoDB Atlas: Get connection string from [MongoDB Atlas Console](https://cloud.mongodb.com)
  - Docker: `mongodb://mongodb:27017/dochive` (if using Docker Compose)

### `JWT_SECRET`
- **Description**: Secret key used to sign and verify JWT tokens
- **Example**: `your-super-secret-jwt-key-change-this-in-production`
- **How to generate**: 
  ```bash
  # Using OpenSSL
  openssl rand -base64 32
  
  # Using Node.js
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **⚠️ Important**: Use a strong, random value in production. Never commit this to version control.

### `CHROMA_HOST`
- **Description**: Chroma vector database host address
- **Example**: `localhost`
- **Default**: `localhost`
- **How to set up**: See [Prerequisites](README.md#prerequisites)

### `CHROMA_PORT`
- **Description**: Chroma vector database port
- **Example**: `8000`
- **Default**: `8000`

### `CHROMA_COLLECTION`
- **Description**: Name of the Chroma collection to store embeddings
- **Example**: `dochive`
- **Default**: `dochive`

### `OLLAMA_BASE_URL`
- **Description**: Base URL for Ollama service
- **Example**: `http://localhost:11434`
- **How to set up**: See [Prerequisites](README.md#prerequisites)

### `OLLAMA_EMBED_MODEL`
- **Description**: Ollama model name for generating embeddings
- **Example**: `nomic-embed-text`
- **Note**: Must be pulled into Ollama first: `ollama pull nomic-embed-text`

### `OLLAMA_CHAT_MODEL`
- **Description**: Ollama model name for generating chat responses
- **Example**: `tinyllama`
- **Note**: Must be pulled into Ollama first: `ollama pull tinyllama`

## Optional Variables

### `PORT`
- **Description**: Application port
- **Default**: `3000`
- **Example**: `3000`

### `NODE_ENV`
- **Description**: Environment mode
- **Allowed values**: `development`, `production`
- **Default**: `development`

## Service Verification

Before starting the backend, verify that all required services are accessible:

```bash
# Check MongoDB
mongo --eval "db.adminCommand('ping')"

# Check Chroma
curl http://localhost:8000/api/v1/heartbeat

# Check Ollama
curl http://localhost:11434/api/tags
```

## Common Issues

| Issue | Solution |
|-------|----------|
| Connection refused to MongoDB | Ensure MongoDB is running: `docker run --name mongodb -d -p 27017:27017 mongo:latest` |
| Connection refused to Chroma | Ensure Chroma is running: `docker run --name chroma -d -p 8000:8000 ghcr.io/chroma-core/chroma:latest` |
| Model not found in Ollama | Pull the model: `ollama pull tinyllama` and `ollama pull nomic-embed-text` |
| JWT token validation fails | Verify `JWT_SECRET` matches between token generation and verification (restart backend after changes) |
