# SmartDoc-AI

A professional backend for document query system with AI-powered question answering.

---

## Features

- **Document Upload** — Upload PDF documents for processing
- **AI Query** — Ask questions about uploaded documents
- **MongoDB Storage** — Persistent document metadata storage

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB (Mongoose) |
| File Upload | Multer |
| AI Service | External Python micro-service |

---

## Project Structure

```
SmartDoc-AI/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── documentController.js  # Document upload
│   └── queryController.js # AI query handling
├── models/
│   └── Document.js        # Document schema
├── routes/
│   ├── documentRoutes.js  # /api/documents
│   └── queryRoutes.js    # /api/query
├── services/
│   ├── aiService.js       # AI micro-service call
│   └── pythonService.js   # PDF processing call
├── uploads/               # Uploaded files
├── .env                   # Environment variables
├── package.json
└── server.js              # Entry point
```

---

## API Endpoints

### Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/documents/upload` | Upload PDF |

### Query

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/query` | Ask AI question |

---

## Usage

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
```

### 3. Start Server

```bash
npm start
```

Server runs on `http://localhost:5000`

---

## API Examples

### Upload Document

```bash
curl -X POST http://localhost:5000/api/documents/upload \
  -F "file=@document.pdf" \
  -F "title=My Document" \
  -F "uploadedBy=john"
```

### Ask Query

```bash
curl -X POST http://localhost:5000/api/query \
  -H "Content-Type: application/json" \
  -d '{"question": "What is this document about?"}'
```

---

## Micro-services

This backend expects two external micro-services:

| Service | URL | Purpose |
|---------|-----|---------|
| Python Service | `localhost:8000/process` | PDF text extraction & embedding |
| AI Service | `localhost:8000/ask` | Generate answers from embeddings |

---

## License

ISC — Created by Aditya
