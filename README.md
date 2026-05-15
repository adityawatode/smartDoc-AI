# SmartDoc-AI

A professional backend for document query system with AI-powered question answering.

---

## Features

- **Document Upload** — Upload PDF documents for processing
- **AI Query** — Ask questions about uploaded documents
- **User Authentication** — Secure JWT-based auth system
- **MongoDB Storage** — Persistent document metadata storage

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT + bcrypt |
| File Upload | Multer |
| AI Service | External Python micro-service |

---

## Project Structure

```
SmartDoc-AI/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js  # Register & Login
│   ├── documentController.js  # Document upload
│   └── queryController.js # AI query handling
├── middlewares/
│   └── authMiddleware.js  # JWT verification
├── models/
│   ├── Document.js        # Document schema
│   └── User.js            # User schema
├── routes/
│   ├── authRoutes.js      # /api/auth
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

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get token |

### Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/documents/upload` | Upload PDF (protected) |

### Query

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/query` | Ask AI question (protected) |

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
JWT_SECRET=your_secure_random_key
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
  -d '{"username": "john", "email": "john@example.com", "password": "123456"}'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "123456"}'
```

### Upload Document (Protected)

```bash
curl -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@document.pdf" \
  -F "title=My Document" \
  -F "uploadedBy=john"
```

### Ask Query (Protected)

```bash
curl -X POST http://localhost:5000/api/query \
  -H "Authorization: Bearer <token>" \
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
