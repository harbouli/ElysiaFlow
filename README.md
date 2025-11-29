# Elysia CRUD API with MVC Architecture, Authentication & Sequelize

<div align="center">

![Elysia](https://img.shields.io/badge/Elysia-latest-blue)
![Bun](https://img.shields.io/badge/Bun-1.0+-orange)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![JWT](https://img.shields.io/badge/JWT-Authentication-green)
![License](https://img.shields.io/badge/license-MIT-green)

A high-performance REST API built with Elysia.js, Bun runtime, PostgreSQL, and Sequelize ORM featuring JWT authentication with refresh tokens and MVC architecture.

**Created by [Mohamed Harbouli](https://github.com/harbouli)**

[Features](#features) •
[Quick Start](#quick-start) •
[Documentation](#documentation) •
[API Reference](#api-reference) •
[Contributing](#contributing)

</div>

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Reference](#api-reference)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Database Management](#database-management)
- [Testing](#testing)
- [Extending the API](#extending-the-api)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Features

✨ **Modern Stack**

- Built with Elysia.js (21x faster than Express.js)
- Powered by Bun runtime for maximum performance
- TypeScript for type safety and better DX

🔐 **Advanced Authentication**

- JWT access tokens (short-lived, 15 minutes)
- JWT refresh tokens (long-lived, 7 days)
- Secure Cookie-based Authentication (httpOnly, secure, sameSite)
- Secure password hashing with bcrypt
- Token refresh mechanism
- Logout from single/all devices
- Role-based access control (RBAC)
- Protected routes with middleware

🏗️ **Clean Architecture**

- MVC pattern for separation of concerns
- Modular and scalable structure
- Easy to maintain and extend

🗄️ **Database**

- PostgreSQL integration
- Sequelize ORM with TypeScript support
- Automatic migrations and schema sync
- User and refresh token management

🔒 **Robust**

- Input validation with Valibot schema validation
- Comprehensive error handling
- Database connection pooling
- Secure authentication flow
- CORS protection for cross-origin requests
- CSRF protection for cookie-based authentication
- Origin/Referer header validation

📝 **Developer Friendly**

- Hot reload in development
- Detailed API documentation
- Environment-based configuration

---

## Tech Stack

| Technology                                    | Purpose              | Version |
| --------------------------------------------- | -------------------- | ------- |
| [Bun](https://bun.sh/)                        | JavaScript Runtime   | 1.0+    |
| [Elysia.js](https://elysiajs.com/)            | Web Framework        | Latest  |
| [TypeScript](https://www.typescriptlang.org/) | Programming Language | 5.0+    |
| [Sequelize](https://sequelize.org/)           | ORM                  | 6.37+   |
| [PostgreSQL](https://www.postgresql.org/)     | Database             | 14+     |
| [pg](https://www.npmjs.com/package/pg)        | PostgreSQL Driver    | 8.16+   |
| [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) | JWT Auth | 9.0+ |
| [bcrypt](https://www.npmjs.com/package/bcrypt) | Password Hashing | 6.0+ |
| [@elysiajs/cookie](https://elysiajs.com/plugins/cookie.html) | Cookie Management | Latest |
| [@elysiajs/cors](https://elysiajs.com/plugins/cors.html) | CORS Protection | Latest |
| [valibot](https://valibot.dev/) | Schema Validation | Latest |

---

## Architecture

This project follows the **MVC (Model-View-Controller)** architectural pattern:

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Routes    │  ◄── Endpoint definitions
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Controllers │  ◄── Business logic & validation
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Models    │  ◄── Database operations (Sequelize)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Database   │  ◄── PostgreSQL
└─────────────┘
```

**Benefits:**

- **Separation of Concerns**: Each layer has a single responsibility
- **Maintainability**: Easy to locate and modify specific functionality
- **Testability**: Components can be tested independently
- **Scalability**: Simple to add new features without affecting existing code

---

## Project Structure

```
elysia-crud-api/
├── src/
│   ├── config/
│   │   └── database.ts                 # Sequelize database configuration
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts          # Authentication logic
│   │   └── item.controller.ts          # Item CRUD handlers
│   │
│   ├── models/
│   │   ├── user.model.ts               # User model with password hashing
│   │   ├── refreshToken.model.ts       # Refresh token management
│   │   └── item.model.ts               # Item model
│   │
│   ├── routes/
│   │   ├── auth.routes.ts              # Authentication endpoints
│   │   └── item.routes.ts              # Item CRUD endpoints
│   │
│   ├── middleware/
│   │   └── auth.middleware.ts          # JWT authentication middleware
│   │
│   ├── utils/
│   │   └── jwt.util.ts                 # JWT token utilities
│   │
│   ├── scripts/
│   │   └── sync-db.ts                  # Database synchronization utility
│   │
│   └── index.ts                        # Application entry point
│
├── .env                                 # Environment variables (gitignored)
├── .env.example                         # Environment template
├── package.json                         # Dependencies and scripts
├── tsconfig.json                        # TypeScript configuration
├── bun.lockb                            # Bun lock file
├── LICENSE                              # MIT License
└── README.md                            # This file
```

### File Descriptions

**`src/config/database.ts`**

- Sequelize instance configuration
- Connection pooling settings
- Environment-based database credentials

**`src/models/item.model.ts`**

- Sequelize model definitions
- Database schema
- Data access methods (CRUD operations)
- Type definitions for TypeScript

**`src/controllers/item.controller.ts`**

- Request/response handlers
- Business logic
- Input validation
- Error handling
- HTTP status codes

**`src/routes/item.routes.ts`**

- API endpoint definitions
- Route-level middleware
- Request schema validation
- Maps routes to controller methods

**`src/index.ts`**

- Application initialization
- Database connection
- Route registration
- Server startup

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **[Bun](https://bun.sh/)** (v1.0 or higher)

  ```bash
  curl -fsSL https://bun.sh/install | bash
  ```

- **[PostgreSQL](https://www.postgresql.org/download/)** (v14 or higher)

  - macOS: `brew install postgresql@14`
  - Ubuntu: `sudo apt-get install postgresql-14`
  - Windows: Download from [postgresql.org](https://www.postgresql.org/download/windows/)

- **Git** (for cloning the repository)

---

## Quick Start

Get up and running in 5 minutes:

### 1. Clone or Download the Project

```bash
cd /path/to/your/project
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Configure Environment

Copy the example environment file and update with your database credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=elysia_db
DB_USER=postgres
DB_PASSWORD=your_password_here

NODE_ENV=development
PORT=3000
```

### 4. Create Database

**Option A: Using PostgreSQL CLI**

```bash
createdb elysia_db
```

**Option B: Using psql**

```bash
psql -U postgres
CREATE DATABASE elysia_db;
\q
```

**Option C: Using SQL**

```sql
CREATE DATABASE elysia_db;
```

### 5. Sync Database Schema

```bash
bun run db:sync
```

Expected output:

```
Connecting to database...
✓ Database connection established successfully
Syncing database models...
✓ Database models synced successfully
```

### 6. Start the Server

```bash
bun run dev
```

Expected output:

```
✓ Database connection established successfully
 Server is running at  localhost:3000
```

### 7. Test the API

```bash
curl http://localhost:3000
```

You should see:

```json
{
  "message": "Welcome to Elysia CRUD API with MVC Architecture + Authentication",
  "version": "1.0.0",
  "endpoints": {
    "auth": {
      "POST /auth/register": "Register new user",
      "POST /auth/login": "Login user",
      "POST /auth/refresh": "Refresh access token",
      "POST /auth/logout": "Logout (revoke refresh token)",
      "POST /auth/logout-all": "Logout from all devices",
      "GET /auth/profile": "Get current user profile (protected)",
      "PUT /auth/profile": "Update user profile (protected)",
      "POST /auth/change-password": "Change password (protected)"
    },
    "items": {
      "GET /items": "Get all items",
      "GET /items/:id": "Get item by ID",
      "POST /items": "Create new item",
      "PUT /items/:id": "Update item",
      "DELETE /items/:id": "Delete item"
    }
  }
}
```

---

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost              # Database host
DB_PORT=5432                   # Database port
DB_NAME=elysia_db             # Database name
DB_USER=postgres              # Database username
DB_PASSWORD=your_password     # Database password

# Application Configuration
NODE_ENV=development          # Environment (development/production)
PORT=3000                     # Server port
FRONTEND_URL=http://localhost:3001  # Frontend URL for CORS

# JWT Configuration
JWT_ACCESS_SECRET=your-super-secret-access-token-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-change-this-in-production
JWT_ACCESS_EXPIRY=15m         # Access token expiry (15 minutes)
JWT_REFRESH_EXPIRY=7d         # Refresh token expiry (7 days)
```

### Environment Descriptions

| Variable              | Description                  | Default       | Required |
| --------------------- | ---------------------------- | ------------- | -------- |
| `DB_HOST`             | PostgreSQL server host       | `localhost`   | Yes      |
| `DB_PORT`             | PostgreSQL server port       | `5432`        | Yes      |
| `DB_NAME`             | Database name                | `elysia_db`   | Yes      |
| `DB_USER`             | Database username            | `postgres`    | Yes      |
| `DB_PASSWORD`         | Database password            | `postgres`    | Yes      |
| `NODE_ENV`            | Environment mode             | `development` | No       |
| `PORT`                | Server port                  | `3000`        | No       |
| `JWT_ACCESS_SECRET`   | Secret key for access tokens | -             | Yes      |
| `JWT_REFRESH_SECRET`  | Secret key for refresh tokens| -             | Yes      |
| `JWT_ACCESS_EXPIRY`   | Access token expiration time | `15m`         | No       |
| `JWT_REFRESH_EXPIRY`  | Refresh token expiration time| `7d`          | No       |
| `FRONTEND_URL`        | Frontend URL for CORS        | `http://localhost:3001` | No |

---

## Database Setup

### Create Database

#### Method 1: Command Line (Recommended)

```bash
createdb elysia_db -U postgres
```

#### Method 2: PostgreSQL Console

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE elysia_db;

# Verify
\l

# Exit
\q
```

#### Method 3: GUI Tools

Use tools like:

- [pgAdmin](https://www.pgadmin.org/)
- [DBeaver](https://dbeaver.io/)
- [TablePlus](https://tableplus.com/)

### Sync Database Schema

After creating the database, sync the schema:

```bash
bun run db:sync
```

This command will:

1. Connect to the database
2. Create the `items` table if it doesn't exist
3. Update the table schema to match the model (if changed)
4. Add indexes and constraints

**Table Schema:**

```sql
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Running the Application

### Development Mode (with hot reload)

```bash
bun run dev
```

Features:

- Auto-restart on file changes
- Development logging enabled
- Source maps for debugging

### Production Mode

```bash
bun run src/index.ts
```

For production, consider:

- Setting `NODE_ENV=production`
- Using a process manager (PM2, systemd)
- Enabling connection pooling
- Implementing rate limiting

---

## API Reference

### Base URL

```
http://localhost:3000
```

---

## Authentication Endpoints

### 1. Register New User

**Endpoint:** `POST /auth/register`

**Description:** Create a new user account

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "isVerified": false,
      "createdAt": "2025-11-29T12:00:00.000Z",
      "updatedAt": "2025-11-29T12:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Note:** `accessToken` and `refreshToken` are also set as `httpOnly` cookies.

---

### 2. Login

**Endpoint:** `POST /auth/login`

**Description:** Authenticate user and get tokens

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "isVerified": false
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Note:** `accessToken` and `refreshToken` are also set as `httpOnly` cookies.

---

### 3. Refresh Access Token

**Endpoint:** `POST /auth/refresh`

**Description:** Get a new access token using refresh token

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Note:** If `refreshToken` is present in cookies, the body parameter is optional.

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 4. Logout

**Endpoint:** `POST /auth/logout`

**Description:** Revoke refresh token (logout from current device)

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Note:** If `refreshToken` is present in cookies, the body parameter is optional.

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 5. Get User Profile (Protected)

**Endpoint:** `GET /auth/profile`

**Description:** Get current user's profile

**Headers:**

```
Authorization: Bearer <access-token>
```

**Note:** Or via `accessToken` cookie.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "isVerified": false,
    "createdAt": "2025-11-29T12:00:00.000Z",
    "updatedAt": "2025-11-29T12:00:00.000Z"
  }
}
```

---

### 6. Update Profile (Protected)

**Endpoint:** `PUT /auth/profile`

**Description:** Update user profile

**Headers:**

```
Authorization: Bearer <access-token>
```

**Request Body:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "email": "jane@example.com",
    "name": "Jane Doe",
    "role": "user"
  }
}
```

---

### 7. Change Password (Protected)

**Endpoint:** `POST /auth/change-password`

**Description:** Change user password

**Headers:**

```
Authorization: Bearer <access-token>
```

**Request Body:**

```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Password changed successfully. Please login again with your new password."
}
```

---

### 8. Logout from All Devices (Protected)

**Endpoint:** `POST /auth/logout-all`

**Description:** Revoke all refresh tokens (logout from all devices)

**Headers:**

```
Authorization: Bearer <access-token>
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Logged out from 3 device(s) successfully"
}
```

---

## Items CRUD Endpoints

### 1. Get All Items

**Endpoint:** `GET /items`

**Description:** Retrieve all items from the database, ordered by creation date (newest first)

**Request:**

```bash
curl http://localhost:3000/items
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Sample Item",
      "description": "This is a sample item",
      "created_at": "2025-11-29T10:30:00.000Z",
      "updated_at": "2025-11-29T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

---

#### 2. Get Item by ID

**Endpoint:** `GET /items/:id`

**Description:** Retrieve a specific item by its ID

**Parameters:**

- `id` (path parameter, required): Item ID (integer)

**Request:**

```bash
curl http://localhost:3000/items/1
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Sample Item",
    "description": "This is a sample item",
    "created_at": "2025-11-29T10:30:00.000Z",
    "updated_at": "2025-11-29T10:30:00.000Z"
  }
}
```

**Error Response:** `404 Not Found`

```json
{
  "success": false,
  "message": "Item with id 999 not found"
}
```

---

#### 3. Create Item

**Endpoint:** `POST /items`

**Description:** Create a new item

**Request Body:**

```json
{
  "name": "string (required)",
  "description": "string (required)"
}
```

**Validation:**

- `name`: Required, non-empty string, max 255 characters
- `description`: Required, non-empty string

**Request:**

```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Item",
    "description": "This is a new item description"
  }'
```

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "Item created successfully",
  "data": {
    "id": 2,
    "name": "New Item",
    "description": "This is a new item description",
    "created_at": "2025-11-29T11:00:00.000Z",
    "updated_at": "2025-11-29T11:00:00.000Z"
  }
}
```

**Error Response:** `400 Bad Request`

```json
{
  "success": false,
  "message": "Name and description are required"
}
```

---

#### 4. Update Item

**Endpoint:** `PUT /items/:id`

**Description:** Update an existing item

**Parameters:**

- `id` (path parameter, required): Item ID (integer)

**Request Body:**

```json
{
  "name": "string (optional)",
  "description": "string (optional)"
}
```

**Note:** At least one field must be provided

**Request:**

```bash
curl -X PUT http://localhost:3000/items/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Item Name"
  }'
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Item updated successfully",
  "data": {
    "id": 1,
    "name": "Updated Item Name",
    "description": "Original description",
    "created_at": "2025-11-29T10:30:00.000Z",
    "updated_at": "2025-11-29T11:15:00.000Z"
  }
}
```

**Error Response:** `404 Not Found`

```json
{
  "success": false,
  "message": "Item with id 999 not found"
}
```

---

#### 5. Delete Item

**Endpoint:** `DELETE /items/:id`

**Description:** Delete an item permanently

**Parameters:**

- `id` (path parameter, required): Item ID (integer)

**Request:**

```bash
curl -X DELETE http://localhost:3000/items/1
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Item deleted successfully",
  "data": {
    "id": 1,
    "name": "Deleted Item",
    "description": "This item was deleted",
    "created_at": "2025-11-29T10:30:00.000Z",
    "updated_at": "2025-11-29T10:30:00.000Z"
  }
}
```

**Error Response:** `404 Not Found`

```json
{
  "success": false,
  "message": "Item with id 999 not found"
}
```

---

## Response Format

All API responses follow a consistent structure:

### Success Response

```json
{
  "success": true,
  "data": {
    /* response data */
  },
  "message": "Optional success message",
  "count": "Optional count (for list responses)"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description"
}
```

### HTTP Status Codes

| Code | Meaning               | Usage                                     |
| ---- | --------------------- | ----------------------------------------- |
| 200  | OK                    | Successful GET, PUT, DELETE               |
| 201  | Created               | Successful POST (creation)                |
| 400  | Bad Request           | Validation error, missing required fields |
| 404  | Not Found             | Resource doesn't exist                    |
| 500  | Internal Server Error | Server-side error                         |

---

## Error Handling

The API implements comprehensive error handling:

### Validation Errors (400)

Returned when:

- Required fields are missing
- Data types are incorrect
- Validation rules fail

Example:

```json
{
  "success": false,
  "message": "Name and description are required"
}
```

### Not Found Errors (404)

Returned when:

- Requested resource doesn't exist

Example:

```json
{
  "success": false,
  "message": "Item with id 5 not found"
}
```

### Database Errors (400)

Returned when:

- Database constraints violated
- Sequelize validation fails

Example:

```json
{
  "success": false,
  "message": "Validation error: name cannot be empty"
}
```

---

## Database Management

### Available Commands

```bash
# Sync database schema
bun run db:sync

# Start development server
bun run dev
```

### Database Sync Options

The `db:sync` script uses Sequelize's `sync()` method with `alter: true`:

```typescript
await sequelize.sync({ alter: true });
```

**What it does:**

- Creates tables if they don't exist
- Adds new columns
- Updates column types
- Preserves existing data

**⚠️ Production Note:** For production, use proper migrations instead of `sync()`.

### Creating Migrations (Advanced)

For production environments, use Sequelize migrations:

1. Install Sequelize CLI:

```bash
bun add -d sequelize-cli
```

2. Initialize migrations:

```bash
npx sequelize-cli init
```

3. Generate migration:

```bash
npx sequelize-cli migration:generate --name create-items-table
```

4. Run migrations:

```bash
npx sequelize-cli db:migrate
```

---

## Testing

### Automated Testing

Run the automated test suite:

```bash
bun test
```

### Authentication Flow Testing

Test the complete authentication flow:

```bash
# 1. Register a new user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'

# Response will include accessToken and refreshToken
# Save the accessToken for subsequent requests

# 2. Login (alternative to register)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# 3. Get user profile (protected route)
curl http://localhost:3000/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# 4. Update profile
curl -X PUT http://localhost:3000/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name"
  }'

# 5. Change password
curl -X POST http://localhost:3000/auth/change-password \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "newpassword456"
  }'

# 6. Refresh access token
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'

# 7. Logout from current device
curl -X POST http://localhost:3000/auth/logout \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'

# 8. Logout from all devices
curl -X POST http://localhost:3000/auth/logout-all \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Items CRUD Testing

Test all item endpoints:

```bash
# 1. Create an item
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Item","description":"Testing"}'

# 2. Get all items
curl http://localhost:3000/items

# 3. Get specific item
curl http://localhost:3000/items/1

# 4. Update item
curl -X PUT http://localhost:3000/items/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name"}'

# 5. Delete item
curl -X DELETE http://localhost:3000/items/1
```

### Using Postman or Insomnia

1. Import the following collection:

   - Base URL: `http://localhost:3000`
   - Create requests for each endpoint
   - Set `Content-Type: application/json` header

2. Test scenarios:
   - Happy path (valid data)
   - Invalid data (missing fields)
   - Non-existent resources (404)
   - Edge cases (empty strings, very long text)

---

## Extending the API

### Adding a New Resource (Example: Users)

Follow these steps to add a new resource:

#### 1. Create Model (`src/models/user.model.ts`)

```typescript
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface UserAttributes {
  id: number;
  email: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public email!: string;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
    underscored: true,
  }
);

class UserModel {
  async findAll(): Promise<User[]> {
    return await User.findAll();
  }

  async findById(id: number): Promise<User | null> {
    return await User.findByPk(id);
  }

  async create(email: string, name: string): Promise<User> {
    return await User.create({ email, name });
  }

  async update(
    id: number,
    data: Partial<UserAttributes>
  ): Promise<User | null> {
    const user = await User.findByPk(id);
    if (!user) return null;
    await user.update(data);
    return user;
  }

  async delete(id: number): Promise<User | null> {
    const user = await User.findByPk(id);
    if (!user) return null;
    await user.destroy();
    return user;
  }
}

export const userModel = new UserModel();
```

#### 2. Create Controller (`src/controllers/user.controller.ts`)

```typescript
import { Context } from "elysia";
import { userModel } from "../models/user.model";

export class UserController {
  static async getAll() {
    const users = await userModel.findAll();
    return {
      success: true,
      data: users,
      count: users.length,
    };
  }

  static async getById({ params, set }: Context) {
    const id = parseInt(params.id as string);
    const user = await userModel.findById(id);

    if (!user) {
      set.status = 404;
      return {
        success: false,
        message: `User with id ${id} not found`,
      };
    }

    return {
      success: true,
      data: user,
    };
  }

  static async create({ body, set }: Context) {
    const { email, name } = body as { email: string; name: string };

    try {
      const newUser = await userModel.create(email, name);
      set.status = 201;
      return {
        success: true,
        message: "User created successfully",
        data: newUser,
      };
    } catch (error: any) {
      set.status = 400;
      return {
        success: false,
        message: error.message || "Error creating user",
      };
    }
  }

  // Add update and delete methods similarly...
}
```

#### 3. Create Routes (`src/routes/user.routes.ts`)

```typescript
import { Elysia, t } from "elysia";
import { UserController } from "../controllers/user.controller";

export const userRoutes = new Elysia({ prefix: "/users" })
  .get("/", UserController.getAll)
  .get("/:id", UserController.getById)
  .post("/", UserController.create, {
    body: t.Object({
      email: t.String(),
      name: t.String(),
    }),
  });
// Add PUT and DELETE routes...
```

#### 4. Register Routes (`src/index.ts`)

```typescript
import { userRoutes } from "./routes/user.routes";

const app = new Elysia()
  // ... existing routes
  .use(itemRoutes)
  .use(userRoutes) // Add this line
  .listen(3000);
```

#### 5. Update sync script

Import the new model in `src/scripts/sync-db.ts`:

```typescript
import "../models/item.model";
import "../models/user.model"; // Add this line
```

#### 6. Sync database

```bash
bun run db:sync
```

---

## Best Practices

### Code Organization

✅ **Do:**

- Follow the MVC pattern strictly
- Keep controllers thin (business logic in models)
- Use TypeScript interfaces for type safety
- Implement proper error handling
- Validate input at the route level

❌ **Don't:**

- Mix database logic in controllers
- Hardcode configuration values
- Skip input validation
- Expose internal errors to clients

### Database

✅ **Do:**

- Use connection pooling
- Implement indexes on frequently queried columns
- Use transactions for multi-step operations
- Close connections properly

❌ **Don't:**

- Use `sync({ force: true })` in production
- Store sensitive data in plain text
- Skip database backups

### Security

✅ **Do:**

- Validate and sanitize all inputs
- Use environment variables for secrets
- Implement rate limiting (for production)
- Use HTTPS in production
- Keep dependencies updated

❌ **Don't:**

- Commit `.env` file
- Trust user input
- Expose stack traces in production
- Use default credentials

---

## CORS and CSRF Protection

The API includes comprehensive security measures for cookie-based authentication:

### CORS (Cross-Origin Resource Sharing)

Configured via `@elysiajs/cors` plugin to allow your frontend to access the API:

```typescript
cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3001",
  credentials: true, // Required for cookies
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
})
```

**Key Configuration:**

- **`credentials: true`** - Essential for sending cookies with cross-origin requests
- **`origin`** - Set to your frontend URL (configurable via `FRONTEND_URL` env variable)
- In production, set `FRONTEND_URL` to your actual frontend domain

### CSRF (Cross-Site Request Forgery) Protection

Implemented via custom middleware (`src/middleware/csrf.middleware.ts`) that validates Origin/Referer headers:

**How it works:**

1. Checks the `Origin` header matches the `Host` header for state-changing requests
2. Falls back to `Referer` header validation if no Origin is present
3. Blocks requests from different origins with 403 Forbidden
4. Allows API clients (Postman, curl) without Origin/Referer headers

**Protected Methods:**

- POST
- PUT
- DELETE
- PATCH

**Example Error Response:**

```json
{
  "success": false,
  "message": "CSRF validation failed: Origin does not match host"
}
```

### Frontend Integration

**Axios:**

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true, // Important: sends cookies
});

// Login
await api.post('/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

// Subsequent requests automatically include cookies
await api.get('/auth/profile');
```

**Fetch API:**

```javascript
// Login
await fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  credentials: 'include', // Important: sends cookies
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

// Subsequent requests
await fetch('http://localhost:3000/auth/profile', {
  credentials: 'include'
});
```

### Production Configuration

For production, update your `.env` file:

```env
FRONTEND_URL=https://yourdomain.com
NODE_ENV=production
```

For multiple frontend domains:

```typescript
cors({
  origin: [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
    'https://app.yourdomain.com'
  ],
  credentials: true,
  // ... other options
})
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Error

**Error:**

```
SequelizeConnectionError: database "elysia_db" does not exist
```

**Solution:**

```bash
createdb elysia_db -U postgres
```

---

#### 2. Port Already in Use

**Error:**

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port in .env
PORT=3001
```

---

#### 3. Authentication Failed

**Error:**

```
SequelizeConnectionError: password authentication failed
```

**Solution:**

- Verify credentials in `.env`
- Check PostgreSQL user exists
- Reset password if needed:

```bash
psql -U postgres
ALTER USER postgres PASSWORD 'newpassword';
```

---

#### 4. Bun Not Found

**Error:**

```
command not found: bun
```

**Solution:**

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Add to PATH (usually automatic)
source ~/.bashrc  # or ~/.zshrc
```

---

#### 5. Module Not Found

**Error:**

```
Cannot find module './routes/item.routes'
```

**Solution:**

```bash
# Ensure all files exist
ls -la src/routes/

# Reinstall dependencies
bun install
```

---

## Performance Tips

### 1. Database Optimization

```typescript
// Add indexes in your model
Item.init(
  {
    // ... fields
  },
  {
    indexes: [{ fields: ["created_at"] }, { fields: ["name"] }],
  }
);
```

### 2. Connection Pooling

Already configured in `src/config/database.ts`:

```typescript
pool: {
  max: 10,      // Maximum connections
  min: 0,       // Minimum connections
  acquire: 30000,
  idle: 10000,
}
```

### 3. Query Optimization

```typescript
// Instead of loading all fields
const items = await Item.findAll();

// Select specific fields
const items = await Item.findAll({
  attributes: ["id", "name"],
});
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Add comments for complex logic
- Update documentation
- Test your changes
- Keep commits atomic

---

## Roadmap

Future enhancements:

- [ ] Add authentication (JWT)
- [ ] Implement pagination
- [ ] Add filtering and sorting
- [ ] API rate limiting
- [ ] Request logging
- [ ] Unit tests
- [ ] Integration tests
- [ ] Docker support
- [ ] CI/CD pipeline
- [ ] API documentation (Swagger/OpenAPI)

---

## License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2025 Mohamed Harbouli

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Support

If you have questions or need help:

- Open an issue on [GitHub](https://github.com/harbouli)
- Check the [Elysia documentation](https://elysiajs.com/)
- Check the [Sequelize documentation](https://sequelize.org/)
- Visit [Bun documentation](https://bun.sh/docs)

---

## Author

**Mohamed Harbouli**

- GitHub: [@harbouli](https://github.com/harbouli)
- Portfolio: [github.com/harbouli](https://github.com/harbouli)

---

## Acknowledgments

Built with:

- [Elysia.js](https://elysiajs.com/) - Web framework
- [Bun](https://bun.sh/) - JavaScript runtime
- [Sequelize](https://sequelize.org/) - ORM
- [PostgreSQL](https://www.postgresql.org/) - Database

---

<div align="center">

**Made with ❤️ by Mohamed Harbouli**

[⬆ Back to Top](#elysia-crud-api-with-mvc-architecture--sequelize)

</div>
