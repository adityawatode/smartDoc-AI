# SmartDoc-AI

A professional backend for document query system with AI-powered question answering.

---

## Features

- **Document Upload** — Upload PDF documents for processing
- **AI Query** — Ask questions about uploaded documents
- **Secure Auth** — Register/login with hashed passwords and JWT-protected actions
- **MongoDB Storage** — Persistent document metadata storage

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB (Mongoose) |
| File Upload | Multer |
| Auth | bcrypt + JSON Web Tokens |
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
| GET | `/api/documents` | List uploaded documents |
| POST | `/api/documents/upload` | Upload PDF |

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/me` | Get current authenticated user |

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
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your-long-random-secret
JWT_EXPIRES_IN=7d
```

### 3. Start Server

```bash
npm start
```

Server runs on `http://localhost:5000`

---

## API Examples

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"strongpass123"}'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"strongpass123"}'
```

### Upload Document

```bash
curl -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@document.pdf" \
  -F "title=My Document" \
  -F "uploadedBy=john"
```

### Ask Query

```bash
curl -X POST http://localhost:5000/api/query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
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
