# PostgresQL Node.js Express TypeScript application.

# Prerequisites

To build and run this app locally you will need a few things:

- Install [Node.js](https://nodejs.org/en/)
- Install [VS Code](https://code.visualstudio.com/)
- Install [Postgresql](https://www.postgresql.org/download/)
- Easiest way to get started with Postgresql on MAC [Postgresql](https://www.postgresql.org/download/)

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
npm run db:migrate
```

- Seed database with data

```
npx prisma db seed --preview-feature
or
npm run db:seed
```

- reset database

```
npx prisma db seed --preview-feature
or
npm run db:reset
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

### CI

- used github actions to run linters and automated tests

# Database Schema

- opted for self referential association where a link can belong to another link

```
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  firstName String
  lastName  String
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  links     Link[]
}

model Link {
  id          String    @id @default(uuid())
  title       String    @db.VarChar(144)
  type        LinkType
  active      Boolean
  thumbnail   String?
  url         String?
  embed       Boolean?
  user        User?     @relation(fields: [userId], references: [id])
  userId      String?
  sublinkId   String?
  subLink     Link?     @relation("SubLinks", fields: [sublinkId], references: [id])
  subLinks    Link[]    @relation("SubLinks")
  show        Show?
  music       Music?
  dateCreated DateTime  @default(now())
  updatedAt   DateTime? @updatedAt
}

model Show {
  id        String     @id @default(uuid())
  status    ShowStatus
  venue     String
  location  String
  date      DateTime
  link      Link       @relation(fields: [linkId], references: [id])
  linkId    String     @unique
  createdAt DateTime   @default(now())
  updatedAt DateTime?  @updatedAt
}

model Music {
  id        String    @id @default(uuid())
  platform  Platform
  link      Link      @relation(fields: [linkId], references: [id])
  linkId    String    @unique
  date      DateTime  @default(now())
  updatedAt DateTime? @updatedAt
}

enum ShowStatus {
  SoldOut
  Pending
  OnSale
}

enum LinkType {
  Classic
  Show
  MusicPlayer
}

enum Platform {
  Spotify
  YouTube
  AppleMusic
  SoundCloud
}
```

# REST API

### Authentication

Simple JWT authentication after setting up the project and running the seed command you can query

- POST `localhost:8000/api/v1/login`

  - REQUEST BODY With seeded user
    `{ "email": "test@example.com", "password": "password" }`

  - RESPONSE 200
    ```
    {
      "data": {
          "id": "05f144ca-6036-4a96-b4d6-d02bf4df7052",
          "email": "test@example.com",
          "firstName": "Bat",
          "lastName": "Man",
          "password": "$2a$10$i0FF8f3/Yje6BDpjdeESwu0SdLd7LPgjNU4Dua8aFmxZGfQ1sXI2G",
          "createdAt": "2021-11-27T03:06:03.561Z",
          "updatedAt": "2021-11-27T03:06:03.562Z"
      },
      "status": 200,
      "statusMessage": "success"
    }
    ```

### Links endpoints

- GET localhost:8000/api/v1/links
- QUERY PARAMETERS

  - userId
  - sort[dateCreated]=asc | desc
  - include=subLinks

- Example request `localhost:8000/api/v1/links?userId=e92a7dfd-0d8a-405e-9c79-ef8b10069298&sort[dateCreated]=asc&include=subLinks`

  - RESPONSE 200

  ```
  {
    "data": {
        "links": [
            {
                "id": "63935a61-9335-446d-bf1a-1fee8d840312",
                "title": "parent show link",
                "type": "Show",
                "active": true,
                "thumbnail": null,
                "url": null,
                "embed": null,
                "userId": "e92a7dfd-0d8a-405e-9c79-ef8b10069298",
                "sublinkId": null,
                "dateCreated": "2021-11-27T03:49:26.054Z",
                "updatedAt": "2021-11-27T03:49:26.112Z",
                "subLinks": [
                    {
                        "id": "7bc9ccf6-b10b-4390-bbfe-24ae0338dcfd",
                        "title": "my first show link",
                        "type": "Show",
                        "active": true,
                        "thumbnail": null,
                        "url": "https://hasura.io/",
                        "embed": false,
                        "userId": "e92a7dfd-0d8a-405e-9c79-ef8b10069298",
                        "sublinkId": "63935a61-9335-446d-bf1a-1fee8d840312",
                        "dateCreated": "2021-11-27T03:49:26.094Z",
                        "updatedAt": "2021-11-27T03:49:26.112Z",
                        "show": {
                            "id": "4efa4e4c-c3d9-4d78-868c-10e8af5a1bd9",
                            "status": "OnSale",
                            "venue": "modi",
                            "location": "84494 Elvis Mountains",
                            "date": "2021-11-27T03:49:26.069Z",
                            "linkId": "7bc9ccf6-b10b-4390-bbfe-24ae0338dcfd",
                            "createdAt": "2021-11-27T03:49:26.094Z",
                            "updatedAt": "2021-11-27T03:49:26.095Z"
                        },
                        "music": null
                    },
                    {
                        "id": "5bf84183-fa9b-450c-b66b-d6a0120d9365",
                        "title": "my second show link",
                        "type": "Show",
                        "active": true,
                        "thumbnail": null,
                        "url": "https://hasura.io/",
                        "embed": false,
                        "userId": "e92a7dfd-0d8a-405e-9c79-ef8b10069298",
                        "sublinkId": "63935a61-9335-446d-bf1a-1fee8d840312",
                        "dateCreated": "2021-11-27T03:49:26.099Z",
                        "updatedAt": "2021-11-27T03:49:26.112Z",
                        "show": {
                            "id": "994172ff-e78b-46fd-a3d7-c03fc803ee47",
                            "status": "OnSale",
                            "venue": "dolorem",
                            "location": "9514 Earlene Trace",
                            "date": "2021-11-27T03:49:26.069Z",
                            "linkId": "5bf84183-fa9b-450c-b66b-d6a0120d9365",
                            "createdAt": "2021-11-27T03:49:26.099Z",
                            "updatedAt": "2021-11-27T03:49:26.099Z"
                        },
                        "music": null
                    },
                    {
                        "id": "31a9231c-d598-4d0a-9556-94dfc6135b4c",
                        "title": "my third show link",
                        "type": "Show",
                        "active": true,
                        "thumbnail": null,
                        "url": "https://hasura.io/",
                        "embed": false,
                        "userId": "e92a7dfd-0d8a-405e-9c79-ef8b10069298",
                        "sublinkId": "63935a61-9335-446d-bf1a-1fee8d840312",
                        "dateCreated": "2021-11-27T03:49:26.104Z",
                        "updatedAt": "2021-11-27T03:49:26.112Z",
                        "show": {
                            "id": "48728087-4b5c-48d1-90c4-e39eb5e127c3",
                            "status": "OnSale",
                            "venue": "veritatis",
                            "location": "53320 McKenzie Loop",
                            "date": "2021-11-27T03:49:26.069Z",
                            "linkId": "31a9231c-d598-4d0a-9556-94dfc6135b4c",
                            "createdAt": "2021-11-27T03:49:26.104Z",
                            "updatedAt": "2021-11-27T03:49:26.104Z"
                        },
                        "music": null
                    }
                ]
            },
            {
                "id": "6e82e4ac-6147-4e64-8a8c-03b9e260f667",
                "title": "parent music link",
                "type": "MusicPlayer",
                "active": true,
                "thumbnail": null,
                "url": null,
                "embed": null,
                "userId": "e92a7dfd-0d8a-405e-9c79-ef8b10069298",
                "sublinkId": null,
                "dateCreated": "2021-11-27T03:49:26.054Z",
                "updatedAt": "2021-11-27T03:49:26.112Z",
                "subLinks": [
                    {
                        "id": "b5a2371b-ed27-47eb-8bc5-2e2d2d331631",
                        "title": "my first music player link",
                        "type": "MusicPlayer",
                        "active": true,
                        "thumbnail": null,
                        "url": "https://music.youtube.com/watch?v=342Msc1FQUU",
                        "embed": false,
                        "userId": "e92a7dfd-0d8a-405e-9c79-ef8b10069298",
                        "sublinkId": "6e82e4ac-6147-4e64-8a8c-03b9e260f667",
                        "dateCreated": "2021-11-27T03:49:26.081Z",
                        "updatedAt": "2021-11-27T03:49:26.112Z",
                        "show": null,
                        "music": {
                            "id": "ed00b1a2-0102-4c5a-bc67-4f394f731dbb",
                            "platform": "YouTube",
                            "linkId": "b5a2371b-ed27-47eb-8bc5-2e2d2d331631",
                            "date": "2021-11-27T03:49:26.081Z",
                            "updatedAt": "2021-11-27T03:49:26.082Z"
                        }
                    },
                    {
                        "id": "a5b2e875-0736-4b71-800d-5038bbb21d99",
                        "title": "my second music player link",
                        "type": "MusicPlayer",
                        "active": true,
                        "thumbnail": null,
                        "url": "https://music.youtube.com/watch?v=342Msc1FQUU",
                        "embed": false,
                        "userId": "e92a7dfd-0d8a-405e-9c79-ef8b10069298",
                        "sublinkId": "6e82e4ac-6147-4e64-8a8c-03b9e260f667",
                        "dateCreated": "2021-11-27T03:49:26.086Z",
                        "updatedAt": "2021-11-27T03:49:26.112Z",
                        "show": null,
                        "music": {
                            "id": "ffe0e840-9c4d-45f4-bda5-0f77c4b11b0f",
                            "platform": "YouTube",
                            "linkId": "a5b2e875-0736-4b71-800d-5038bbb21d99",
                            "date": "2021-11-27T03:49:26.086Z",
                            "updatedAt": "2021-11-27T03:49:26.087Z"
                        }
                    },
                    {
                        "id": "a064b3d9-fd53-43bd-95a3-10c310899b80",
                        "title": "my third music player link",
                        "type": "MusicPlayer",
                        "active": true,
                        "thumbnail": null,
                        "url": "https://music.youtube.com/watch?v=342Msc1FQUU",
                        "embed": true,
                        "userId": "e92a7dfd-0d8a-405e-9c79-ef8b10069298",
                        "sublinkId": "6e82e4ac-6147-4e64-8a8c-03b9e260f667",
                        "dateCreated": "2021-11-27T03:49:26.091Z",
                        "updatedAt": "2021-11-27T03:49:26.112Z",
                        "show": null,
                        "music": {
                            "id": "ecbb0d56-621d-4bff-8f67-d8943fd7842b",
                            "platform": "YouTube",
                            "linkId": "a064b3d9-fd53-43bd-95a3-10c310899b80",
                            "date": "2021-11-27T03:49:26.091Z",
                            "updatedAt": "2021-11-27T03:49:26.091Z"
                        }
                    }
                ]
            },
            {
                "id": "6d08d8ff-504c-42cf-8872-23cda5595d71",
                "title": "my first classic link",
                "type": "Classic",
                "active": true,
                "thumbnail": null,
                "url": "https://hasura.io/",
                "embed": false,
                "userId": "e92a7dfd-0d8a-405e-9c79-ef8b10069298",
                "sublinkId": null,
                "dateCreated": "2021-11-27T03:49:26.070Z",
                "updatedAt": "2021-11-27T03:49:26.112Z",
                "subLinks": []
            },
            {
                "id": "18d83573-e0c5-4498-8420-0a451eafd127",
                "title": "my second classic  link",
                "type": "Classic",
                "active": true,
                "thumbnail": null,
                "url": "https://hasura.io/",
                "embed": false,
                "userId": "e92a7dfd-0d8a-405e-9c79-ef8b10069298",
                "sublinkId": null,
                "dateCreated": "2021-11-27T03:49:26.073Z",
                "updatedAt": "2021-11-27T03:49:26.112Z",
                "subLinks": []
            },
            {
                "id": "f18c1fe9-d40b-445f-8fb2-84b43985089e",
                "title": "my third classic  link",
                "type": "Classic",
                "active": true,
                "thumbnail": null,
                "url": "https://hasura.io/",
                "embed": false,
                "userId": "e92a7dfd-0d8a-405e-9c79-ef8b10069298",
                "sublinkId": null,
                "dateCreated": "2021-11-27T03:49:26.079Z",
                "updatedAt": "2021-11-27T03:49:26.112Z",
                "subLinks": []
            },
            {
                "id": "b5a2371b-ed27-47eb-8bc5-2e2d2d331631",
                "title": "my first music player link",
                "type": "MusicPlayer",
                "active": true,
                "thumbnail": null,
                "url": "https://music.youtube.com/watch?v=342Msc1FQUU",
                "embed": false,
                "userId": "e92a7dfd-0d8a-405e-9c79-ef8b10069298",
                "sublinkId": "6e82e4ac-6147-4e64-8a8c-03b9e260f667",
                "dateCreated": "2021-11-27T03:49:26.081Z",
                "updatedAt": "2021-11-27T03:49:26.112Z",
                "subLinks": []
            },
            {
                "id": "a5b2e875-0736-4b71-800d-5038bbb21d99",
                "title": "my second music player link",
                "type": "MusicPlayer",
                "active": true,
                "thumbnail": null,
                "url": "https://music.youtube.com/watch?v=342Msc1FQUU",
                "embed": false,
                "userId": "e92a7dfd-0d8a-405e-9c79-ef8b10069298",
                "sublinkId": "6e82e4ac-6147-4e64-8a8c-03b9e260f667",
                "dateCreated": "2021-11-27T03:49:26.086Z",
                "updatedAt": "2021-11-27T03:49:26.112Z",
                "subLinks": []
            },
            {
                "id": "a064b3d9-fd53-43bd-95a3-10c310899b80",
                "title": "my third music player link",
                "type": "MusicPlayer",
                "active": true,
                "thumbnail": null,
                "url": "https://music.youtube.com/watch?v=342Msc1FQUU",
                "embed": true,
                "userId": "e92a7dfd-0d8a-405e-9c79-ef8b10069298",
                "sublinkId": "6e82e4ac-6147-4e64-8a8c-03b9e260f667",
                "dateCreated": "2021-11-27T03:49:26.091Z",
                "updatedAt": "2021-11-27T03:49:26.112Z",
                "subLinks": []
            },
            {
                "id": "7bc9ccf6-b10b-4390-bbfe-24ae0338dcfd",
                "title": "my first show link",
                "type": "Show",
                "active": true,
                "thumbnail": null,
                "url": "https://hasura.io/",
                "embed": false,
                "userId": "e92a7dfd-0d8a-405e-9c79-ef8b10069298",
                "sublinkId": "63935a61-9335-446d-bf1a-1fee8d840312",
                "dateCreated": "2021-11-27T03:49:26.094Z",
                "updatedAt": "2021-11-27T03:49:26.112Z",
                "subLinks": []
            },
            {
                "id": "5bf84183-fa9b-450c-b66b-d6a0120d9365",
                "title": "my second show link",
                "type": "Show",
                "active": true,
                "thumbnail": null,
                "url": "https://hasura.io/",
                "embed": false,
                "userId": "e92a7dfd-0d8a-405e-9c79-ef8b10069298",
                "sublinkId": "63935a61-9335-446d-bf1a-1fee8d840312",
                "dateCreated": "2021-11-27T03:49:26.099Z",
                "updatedAt": "2021-11-27T03:49:26.112Z",
                "subLinks": []
            },
            {
                "id": "31a9231c-d598-4d0a-9556-94dfc6135b4c",
                "title": "my third show link",
                "type": "Show",
                "active": true,
                "thumbnail": null,
                "url": "https://hasura.io/",
                "embed": false,
                "userId": "e92a7dfd-0d8a-405e-9c79-ef8b10069298",
                "sublinkId": "63935a61-9335-446d-bf1a-1fee8d840312",
                "dateCreated": "2021-11-27T03:49:26.104Z",
                "updatedAt": "2021-11-27T03:49:26.112Z",
                "subLinks": []
            }
        ]
    },
    "status": 200,
    "statusMessage": "success"
  }
  ```

  - POST localhost:8000/api/v1/links
  - BODY
    - ENUM type MusicPlayer | Classic | Show

  ```
  {
    "userId": "e92a7dfd-0d8a-405e-9c79-ef8b10069298",
    "type": "MusicPlayer",
    "title": "Awesome",
    "active": true,
    "url": null,
    "embed": false
  }
  ```

  - Example request `localhost:8000/api/v1/links`
    - RESPONSE 200

  ```
    {
        "data": {
            "link": {
                "id": "1baa8133-1684-4cbe-932e-1d0061a5c875",
                "title": "Awesome",
                "type": "MusicPlayer",
                "active": true,
                "thumbnail": null,
                "url": null,
                "embed": false,
                "userId": "e92a7dfd-0d8a-405e-9c79-ef8b10069298",
                "sublinkId": null,
                "dateCreated": "2021-11-27T04:16:43.275Z",
                "updatedAt": "2021-11-27T04:16:43.275Z"
            }
        },
        "status": 200,
        "statusMessage": "success"
    }
  ```

  - POST localhost:8000/api/v1/links/show
  - BODY
    - ENUM type MusicPlayer | Classic | Show

  ```
    {
        "sublinkId": "51883055-2886-43b8-bca4-0dd2e142e5d4",
        "userId": "05f144ca-6036-4a96-b4d6-d02bf4df7052",
        "type": "Show",
        "title": null,
        "active": true,
        "url": "https://www.eventcinemas.co.nz/",
        "embed": false,
        "show": {
            "status": "OnSale",
            "venue": "really awesome place",
            "location": "233 elm street",
            "date": "2021-12-25"
        }
    }
  ```

  - Example request `localhost:8000/api/v1/links/show`
    - RESPONSE 200

  ```
  {
    "data": {
          "link": {
                "id": "67b6aef9-aa62-4be4-b369-de11d8c1aa15",
                "title": null,
                "type": "Show",
                "active": true,
                "thumbnail": null,
                "url": "https://www.eventcinemas.co.nz/",
                "embed": false,
                "userId": "05f144ca-6036-4a96-b4d6-d02bf4df7052",
                "sublinkId": "51883055-2886-43b8-bca4-0dd2e142e5d4",
                "dateCreated": "2021-11-27T03:19:46.871Z",
                "updatedAt": "2021-11-27T03:19:46.872Z"
            },
            "show": {
                "status": "OnSale",
                "venue": "really awesome place",
                "location": "233 elm street",
                "date": "2021-12-25"
          }
    },
    "status": 200,
    "statusMessage": "success"
  }
  ```

  - POST localhost:8000/api/v1/links/music

  - BODY
    - ENUM type MusicPlayer | Classic | Show

  ```
  {
    "sublinkId": "b6b3b168-68c0-4014-a50e-30b58e2c91d2",
    "userId": "05f144ca-6036-4a96-b4d6-d02bf4df7052",
    "type": "MusicPlayer",
    "title": "child 3",
    "active": true,
    "url": "youtube.com",
    "embed": false,
    "music": {
        "platform": "YouTube"
    }
  }
  ```

  - Example request `localhost:8000/api/v1/links/music`
    - RESPONSE 200

  ```
  {
    "data": {
        "link": {
            "id": "9a8cf216-f4b2-42fd-b596-749bb1623d38",
            "title": "child 3",
            "type": "MusicPlayer",
            "active": true,
            "thumbnail": null,
            "url": "youtube.com",
            "embed": false,
            "userId": "05f144ca-6036-4a96-b4d6-d02bf4df7052",
            "sublinkId": "b6b3b168-68c0-4014-a50e-30b58e2c91d2",
            "dateCreated": "2021-11-27T03:37:05.016Z",
            "updatedAt": "2021-11-27T03:37:05.016Z"
        },
        "music": {
            "platform": "YouTube"
        }
    },
    "status": 200,
    "statusMessage": "success"
  }
  ```

  ### Routes and a few validations

  - `./src/api/v1/routes/`

  ### Improvements

  - Integration tests are vital (but have skipped for now) can have a test database setup and run supertest against it
  - end to end tests for the api once its deployed hit the routes.
  - Much more validation espessially around the POST request routes.
  - Serialization and Deserialization to be with JSON API SPEC
  - Creating the links and sublinks I beleive can be improved we can handle it with the same controller and abstract away the meta data use a service layer to do some business logic and data processing.
  - Timezones definately need to be considered
  - USE DOCKER for db setup as it is a bit admin but if you're on mac its super simple to use the mentioned Postgresql on MAC [Postgresql](https://www.postgresql.org/download/)
