# Rivest Demo - NestJS Production-Grade Microservice System

A production-ready microservice-based application built with **NestJS**, featuring an API Gateway (BFF), Product microservice, and Order microservice. Services communicate via **gRPC** for high-performance inter-service communication.

## System Architecture

```mermaid
flowchart TB
    subgraph client [Client Layer]
        Browser[Browser]
    end

    subgraph gateway [API Gateway / BFF]
        Auth[Auth Module]
        MVC[MVC Views]
        Forms[Dynamic Forms]
        Validation[Validation]
        GatewayCore[Gateway Core]
    end

    subgraph ms [Microservice Layer]
        ProductMS[Product Service]
        OrderMS[Order Service]
    end

    subgraph data [Data Layer]
        Postgres[(PostgreSQL)]
    end

    Browser -->|HTTP| GatewayCore
    GatewayCore --> Auth
    GatewayCore --> MVC
    GatewayCore --> Forms
    Auth -->|JWT| GatewayCore
    GatewayCore -->|gRPC| ProductMS
    GatewayCore -->|gRPC| OrderMS
    OrderMS -->|gRPC| ProductMS
    ProductMS --> Postgres
    OrderMS --> Postgres
```

## Microservices Overview

| Service             | Port(s)                   | Responsibilities                                                                                                                                 |
| ------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Gateway**         | 3000                      | User authentication, MVC UI rendering, dynamic form rendering, proxying requests to microservices, validation, rate limiting, session management |
| **Product Service** | 3001 (HTTP), 50051 (gRPC) | Product CRUD, inventory validation, stock management                                                                                             |
| **Order Service**   | 3002 (HTTP), 50052 (gRPC) | Order creation, order management, product validation via Product Service                                                                         |

## Why Inter-Service Communication?

The system uses **gRPC** for communication between the Gateway and microservices, and between the Order and Product services:

- **Binary serialization** – Faster than JSON over the wire
- **Strong typing** – Proto definitions ensure contract consistency
- **HTTP/2 multiplexing** – Efficient connection reuse
- **Streaming support** – Future-proof for real-time features
- **Native NestJS support** – First-class `@nestjs/microservices` integration

When an order is created:

1. Order Service receives the request
2. Order Service calls Product Service via gRPC to validate product and check stock
3. Product Service returns availability and price
4. Order Service creates the order and calls Product Service to decrement stock

## Technology Stack

- **Framework:** NestJS 11, TypeScript
- **Database:** PostgreSQL, Prisma ORM
- **Auth:** Passport JWT, bcrypt
- **Transport:** gRPC (inter-service), HTTP (gateway)
- **Templates:** Handlebars (hbs)
- **Styling:** Bootstrap 5
- **Security:** Helmet, Throttler (rate limiting)
- **Validation:** class-validator, class-transformer

## Prerequisites

- Node.js 20+
- PostgreSQL 16+ (or Docker)
- Docker & Docker Compose (for containerized run)

## Quick Start

### Run with Docker (Recommended)

```bash
# Start all services (PostgreSQL, Gateway, Product Service, Order Service)
docker compose up --build

```

- **Gateway UI:** http://localhost:3000
- **Product Service:** http://localhost:3001
- **Order Service:** http://localhost:3002

### Run Locally

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment setup**
   Create `.env` in the project root:

   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/microservice_db"
   JWT_SECRET="your-secret-key-change-in-production"
   PRODUCT_GRPC_URL="localhost:50051"
   ORDER_GRPC_URL="localhost:50052"
   ```

3. **Database**

   ```bash
   # Ensure PostgreSQL is running, then:
   npm run prisma:migrate
   ```

4. **Start services** (use 3 terminals)

   ```bash
   # Terminal 1 - Product Service
   npm run start:product:dev

   # Terminal 2 - Order Service
   npm run start:order:dev

   # Terminal 3 - Gateway
   npm run start:gateway:dev
   ```

   Or run all together:

   ```bash
   npm run start:dev
   ```

## Project Structure

```
rivest-demo/
├── apps/
│   ├── gateway/           # API Gateway + MVC UI
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   ├── ui/
│   │   │   │   └── services/
│   │   │   └── common/
│   │   └── views/
│   ├── product-service/   # Product microservice
│   └── order-service/    # Order microservice
├── libs/
│   ├── shared/
│   │   ├── grpc/proto/   # gRPC proto definitions
│   │   └── constants/    # Form config JSON
│   └── prisma/          # Prisma schema & client
├── docker/
│   ├── gateway.Dockerfile
│   ├── product-service.Dockerfile
│   └── order-service.Dockerfile
└── docker-compose.yml
```

## API Endpoints

### Auth (Gateway)

- `POST /auth/signup` – Register (JSON)
- `POST /auth/login` – Login (JSON)
- `POST /auth/signup-form` – Signup form submit (redirect)
- `POST /auth/login-form` – Login form submit (redirect, sets cookie)
- `GET /auth/profile` – Get profile (JWT required)

### Products (Gateway, JWT required)

- `POST /products` – Create product
- `GET /products` – List products (query: `?page=1&limit=10`)
- `GET /products/:id` – Get product
- `PUT /products/:id` – Update product
- `DELETE /products/:id` – Delete product

### Orders (Gateway, JWT required)

- `POST /orders` – Create order (`productId`, `quantity`)
- `GET /orders` – List orders (query: `?page=1&limit=10`)
- `GET /orders/:id` – Get order

### MVC Pages

- `GET /` – Home
- `GET /signup` – Signup form (dynamic from JSON config)
- `GET /login` – Login form

## Environment Variables

| Variable           | Description                       |
| ------------------ | --------------------------------- |
| `DATABASE_URL`     | PostgreSQL connection string      |
| `JWT_SECRET`       | Secret for JWT signing            |
| `PRODUCT_GRPC_URL` | Product service gRPC address      |
| `ORDER_GRPC_URL`   | Order service gRPC address        |
| `PORT`             | Gateway HTTP port (default: 3000) |

## Scripts

| Command                     | Description                         |
| --------------------------- | ----------------------------------- |
| `npm run start:gateway:dev` | Start gateway in watch mode         |
| `npm run start:product:dev` | Start product service in watch mode |
| `npm run start:order:dev`   | Start order service in watch mode   |
| `npm run start:dev`         | Start all services concurrently     |
| `npm run build`             | Build all apps                      |
| `npm run prisma:generate`   | Generate Prisma client              |
| `npm run prisma:migrate`    | Run migrations                      |
| `npm run lint`              | Run ESLint                          |

## License

UNLICENSED
