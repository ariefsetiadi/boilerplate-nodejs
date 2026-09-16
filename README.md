# Boilerplate Node.js

A RESTful API boilerplate built with Node.js and Express.js. Comes with JWT authentication with refresh token rotation, user management, request validation, and interactive API documentation via Swagger — designed as a starting point that can be extended and adapted to fit your project needs.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| Sequelize | ORM |
| MySQL | Database |
| Joi | Request validation |
| jsonwebtoken | JWT access & refresh tokens |
| bcryptjs | Password hashing |
| Swagger UI Express | API documentation |
| Helmet | Security headers |
| cookie-parser | Cookie handling |
| cors | Cross-origin resource sharing |
| dotenv | Environment variable management |
| nodemon | Development auto-reload |

---

## Requirements

- Node.js >= 20.11.0 (see `.nvmrc`)
- npm >= 10.0.0
- MySQL database
- Sequelize CLI (`npx sequelize-cli`)

---

## Features

- **Authentication**
  - Login with email & password
  - JWT access token + refresh token
  - Refresh token rotation with reuse detection
  - Logout with token revocation
  - Get current user profile (`/me`)
  - Update profile
  - Change password (revokes all active sessions)
- **User Management**
  - List users with pagination, search, sort, and filter
  - Get user by ID
  - Create user
  - Update user
- **Request Validation** — Joi-based schema validation on all inputs
- **Centralized Error Handling** — Consistent error response format
- **Security** — Helmet headers, hashed refresh tokens stored in DB
- **API Documentation** — Swagger/OpenAPI interactive docs

---

## How to Use

### Clone Repository

```bash
git clone https://github.com/ariefsetiadi/boilerplate-nodejs.git
cd boilerplate-nodejs
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Copy the example file and fill in the values:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
# App
PORT=5000
NODE_MODE=development

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Database
DB_DIALECT=mysql
DB_HOST=localhost
DB_NAME=YourDatabaseName
DB_USER=YourDatabaseUser
DB_PASSWORD=YourDatabasePassword

# JWT
JWT_SECRET_KEY=YourJWTSecretKey
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET_KEY=YourJWTRefreshSecretKey
JWT_REFRESH_EXPIRES_IN=7d

# Cookie
AUTH_COOKIE_SECURE=false
AUTH_COOKIE_SAME_SITE=lax
AUTH_COOKIE_HTTP_ONLY=true
AUTH_COOKIE_MAX_AGE=604800000
```

### Database Migration

```bash
npx sequelize-cli db:migrate
```

### Database Seeder

```bash
npx sequelize-cli db:seed:all
```

To undo seeders:

```bash
npx sequelize-cli db:seed:undo:all
```

### Run the Application

**Development:**

```bash
npm run dev
```

**Production:**

```bash
npm start
```

---

## API Documentation

Interactive API documentation is available via Swagger UI at:

```
http://localhost:5000/api-docs
```

The documentation covers all available endpoints, request/response schemas, authentication requirements, and HTTP status codes based on the OpenAPI specification.
