# Ubatuba Events Tracker

A full-stack web application that allows users to browse, search, and manage local events in Ubatuba, São Paulo.

## 📋 Project Overview

This project provides a **responsive frontend** and a **robust backend** to interact with events, including authentication and event categorization.

## 🚀 Tech Stack

|   Area   |                                                                                                                                 Technology                                                                                                                                 |
| :------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| Monorepo |                                                                                                                   [Turborepo](https://turbo.build/repo)                                                                                                                    |
| Frontend | [Next.js 15](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), [Zustand](https://zustand-demo.pmnd.rs/), [React Query](https://tanstack.com/query/latest), [Zod](https://zod.dev/), [Lucide Icons](https://lucide.dev/), [shadcn/ui](https://ui.shadcn.com/) |
| Backend  |                                                   [FastAPI](https://fastapi.tiangolo.com/), [SQLAlchemy](https://www.sqlalchemy.org/), [JWT Authentication](https://jwt.io/), [Alembic](https://alembic.sqlalchemy.org/)                                                   |
| Database |                                                                                                                 [PostgreSQL](https://www.postgresql.org/)                                                                                                                  |

## ⚙️ Prerequisites

Make sure you have installed for **Option 1**:

- [Node.js (>= 21)](https://nodejs.org/)
- [pnpm](https://pnpm.io/)

  Install pnpm globally if you don't have it:

  ```bash
  npm install -g pnpm
  ```

- [Python (>= 3.11)](https://www.python.org/)

  Verify installation:

  ```bash
  python --version
  ```

- [Poetry (2.1)](https://python-poetry.org/)

  Verify installation:

  ```bash
  poetry --version
  ```

  **Or for option 2:**

- [Docker](https://www.docker.com/) 

## ⚙️ Setup Instructions

### 🔹Option 1: Local Environment Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/ubatuba-events-tracker.git
   cd ubatuba-events-tracker
   ```

2. **Install dependencies**

   ```bash
   pnpm full:install
   ```

3. **Setup Environment Variables**

- Copy `.env.example` files inside `apps/api` and `apps/web` to `.env`

   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   ```

4. **Run the Development Environment**

```bash
pnpm dev
```


### 🔹Option 2: Docker Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/ubatuba-events-tracker.git
   cd ubatuba-events-tracker
   ```
   
2. **Setup Environment Variables**

- Copy `.env.example-docker` files inside `apps/api` and `apps/web` to `.env`.

   ```bash
   cp apps/api/.env.example-docker apps/api/.env
   cp apps/web/.env.example-docker apps/web/.env
   ```

3. **Build And Run Docker Images**
   
- To build the images:
  
   ```bash
   pnpm docker:build
   ```
   
- If the images are already built, start the containers:

   ```bash
   pnpm docker:up
   ```

- To stop and remove the containers:

  ```bash
   pnpm docker:down
   ```
  

> Frontend runs on: http://localhost:3000 <br>
> Backend runs on: http://localhost:8000

## 👉 Application Structure

```bash
/apps
  /api   # FastAPI backend (Python)
  /web   # Next.js 15 frontend (React + Tailwind)

/packages
  /eslint-config
  /prettier
  /tailwind-config
  /typescript-config
```

## 🔥 Features

### Frontend

- 🗓 Event Listing with infinite scrolling method
- 🔍 Search & Filter Events (by title, location, and category)
- ✍️ Create, Edit, and Delete Events
- ~~🖼 Upload Event Images (S3 integration)~~ - TO DO
- 📱 Fully Responsive Design
- 🔐 User Authentication (Login & Register)

### Backend

- 📁 RESTful API endpoints
- ✅ Data validation with Pydantic
- 📚 ORM with SQLAlchemy
- 🛡 Secure Authentication using JWT
- 🛆 Alembic Migrations
- 🐿 PostgreSQL with Docker

### Bonus

- 🎨 Beautiful UI using Tailwind CSS and shadcn components
- ⚡ Fast Monorepo development with Turborepo
- 📦 State management using Zustand
- 🚀 Optimized API communication with React Query
- 🛠️ Form validation powered by Zod
- 🧪 Frontend Testing with Jest (requires Node.js >= 21)

## 📚 API Documentation

|  Method  |     Endpoint     |                            Description                            |
| :------: | :--------------: | :---------------------------------------------------------------: |
|  `GET`   |    `/events`     | List all events (supports search, category filtering, pagination) |
|  `GET`   |  `/events/{id}`  |                      Get event details by ID                      |
|  `POST`  |    `/events`     |                        Create a new event                         |
|  `PUT`   |  `/events/{id}`  |                     Update an existing event                      |
| `DELETE` |  `/events/{id}`  |                          Delete an event                          |
|  `POST`  | `/auth/register` |                        Register a new user                        |
|  `POST`  |  `/auth/login`   |          Login and receive JWT access and refresh tokens          |
|  `POST`  | `/auth/refresh`  |                     Refresh the access token                      |

## 🎯 Evaluation Criteria

- ✅ Code Quality (Clean, documented, readable)
- ✅ Logical Project Structure
- ✅ Full Functional Requirements Met
- ✅ Responsive and Attractive UI
- ✅ RESTful API Design
- ✅ Unit and Integration Testing Ready
- ✅ Complete Documentation

## 📦 Sample Event Data

Inside the repo will have a file called sample_events.json with the examples

```json
[
  {
    "title": "Ubatuba Music Festival",
    "description": "A celebration of local music talent.",
    "date": "2025-05-10T18:00:00",
    "location": "Itaguá beach",
    "category": "Music",
    "image_url": "https://placebear.com/200/300"
  },
  {
    "title": "Surf Championship",
    "description": "Annual surfing competition.",
    "date": "2025-06-15T08:00:00",
    "location": "Praia Grande Beach",
    "category": "Sports",
    "image_url": "https://placebear.com/300/300"
  }
]
```

## 🧪 Frontend Testing

- This project uses **Jest** for unit and integration tests on the frontend (requires Node.js >= 21).
- To run the frontend tests execute:

```bash
pnpm run web:test
```

## 💬 Additional Notes

- PostgreSQL database is containerized via Docker.
- .env examples are provided to ease setup.
- Optimized builds via Turborepo for scalable mono-repo management.
