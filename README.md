# Scalable Task Management API & Frontend

This project implements a secure, scalable backend for user authentication and task management, along with a modern React frontend.

## Features
- **Backend (Node.js/Express/TypeScript)**
  - JWT Authentication with password hashing (bcrypt)
  - Role-Based Access Control (RBAC): User vs Admin
  - CRUD operations for a secondary entity (Tasks)
  - API Versioning (`/api/v1`)
  - Centralized error handling & input validation
  - API Documentation with Swagger
  - MongoDB integration (Mongoose)

- **Frontend (React/Vite/TailwindCSS)**
  - User Registration & Login
  - Protected Dashboard
  - Task Management (Add, Edit, Delete, View)
  - Responsive & Premium Design

## Prerequisites
- Node.js (v16+)
- MongoDB (running locally or a cloud instance)

## Installation & Setup

### Backend
1. `cd backend`
2. `npm install`
3. Create a `.env` file (see `.env.example` or use the provided defaults)
4. `npm run dev` (starts on http://localhost:5000)

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev` (starts on http://localhost:5173)

## API Documentation
Once the backend is running, visit:
`http://localhost:5000/api-docs`

## Security Practices
- Environment variables for sensitive data
- Helmet middleware for security headers
- CORS configuration
- Input sanitization & validation with `express-validator`
- JWT stored securely and verified on each protected request
