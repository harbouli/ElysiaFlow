# Elysia CRUD API with MVC Architecture & Sequelize

<div align="center">

![Elysia](https://img.shields.io/badge/Elysia-latest-blue)
![Bun](https://img.shields.io/badge/Bun-1.0+-orange)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![License](https://img.shields.io/badge/license-MIT-green)

A high-performance REST API built with Elysia.js, Bun runtime, PostgreSQL, and Sequelize ORM following MVC architecture pattern.

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

🏗️ **Clean Architecture**

- MVC pattern for separation of concerns
- Modular and scalable structure
- Easy to maintain and extend

🗄️ **Database**

- PostgreSQL integration
- Sequelize ORM with TypeScript support
- Automatic migrations and schema sync

🔒 **Robust**

- Input validation with Elysia's type system
- Comprehensive error handling
- Database connection pooling

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
│   │   └── database.ts              # Sequelize database configuration
│   │
│   ├── controllers/
│   │   └── item.controller.ts       # Business logic and request handlers
│   │
│   ├── models/
│   │   └── item.model.ts            # Sequelize models and data operations
│   │
│   ├── routes/
│   │   └── item.routes.ts           # API route definitions
│   │
│   ├── scripts/
│   │   └── sync-db.ts               # Database synchronization utility
│   │
│   └── index.ts                     # Application entry point
│
├── .env                              # Environment variables (gitignored)
├── .env.example                      # Environment template
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
├── bun.lockb                         # Bun lock file
└── README.md                         # This file
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
  "message": "Welcome to Elysia CRUD API with MVC Architecture + Sequelize",
  "endpoints": {
    "GET /items": "Get all items",
    "GET /items/:id": "Get item by ID",
    "POST /items": "Create new item",
    "PUT /items/:id": "Update item",
    "DELETE /items/:id": "Delete item"
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
```

### Environment Descriptions

| Variable      | Description            | Default       | Required |
| ------------- | ---------------------- | ------------- | -------- |
| `DB_HOST`     | PostgreSQL server host | `localhost`   | Yes      |
| `DB_PORT`     | PostgreSQL server port | `5432`        | Yes      |
| `DB_NAME`     | Database name          | `elysia_db`   | Yes      |
| `DB_USER`     | Database username      | `postgres`    | Yes      |
| `DB_PASSWORD` | Database password      | `postgres`    | Yes      |
| `NODE_ENV`    | Environment mode       | `development` | No       |
| `PORT`        | Server port            | `3000`        | No       |

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

### Endpoints

#### 1. Get All Items

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

### Manual Testing

Test all endpoints using the provided curl commands:

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
