# PostgresQL Node.js Express TypeScript application.

# Prerequisites

To build and run this app locally you will need a few things:

- Install [Node.js](https://nodejs.org/en/)
- Install [VS Code](https://code.visualstudio.com/)
- Install [Postgresql](https://www.postgresql.org/download/)

# Getting started

- Clone the repository

- Install dependencies

```
cd <project_name>
npm install
```

- Sync database migrations

```
npx prisma migrate dev
or
npm run migrate:db
```

- Seed database with data

```
npx prisma db seed --preview-feature
or
npm run db:seed
```

- Build and run the project with auto reload (nodemon)

```
npm run dev
```

- Build and run the project

```
npm run start
```

Finally, navigate to `http://localhost:5000/` and you should see the API running!
