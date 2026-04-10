# SDIT TECHNICAL TEST

## Requirements

Make sure you have installed:

- Node.js
- pnpm
- Database based on your configuration

## Clone Project

```bash
git clone <repository-url>
cd <project-folder-name>
```

## Install Dependencies

```bash
pnpm install
```

## Setup Environment

Create a `.env` file and add:

```env
DATABASE_URL="your database prisma url"
```

If you use PostgreSQL:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
```

## Generate Prisma Client

```bash
pnpm prisma generate
```

## Run Migration

```bash
pnpm prisma migrate dev
```

## Run Project

```bash
pnpm dev
```

The project will run at:

```bash
http://localhost:3000
```
