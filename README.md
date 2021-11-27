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
npx prisma db seed
or
npm run db:seed
```

- reset database

```
npx prisma migrate reset
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

Finally, navigate to `http://localhost:8000/` and you should see the API running!

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

  - userId (required)
  - sort[dateCreated]=asc | desc (optional)
  - include=subLinks (optional)

- Example request `localhost:8000/api/v1/links?userId=e92a7dfd-0d8a-405e-9c79-ef8b10069298&sort[dateCreated]=asc&include=subLinks`

  - RESPONSE 200

  ```
  {
    "data": {
        "links": [
            {
                "id": "38cf7902-18fc-48fd-a803-a3594f19e931",
                "title": "parent music link",
                "type": "MusicPlayer",
                "active": true,
                "thumbnail": null,
                "url": null,
                "embed": null,
                "userId": "e92a7dfd-0d8a-405e-9c79-ef8b10069298",
                "sublinkId": null,
                "dateCreated": "2021-11-27T12:03:08.362Z",
                "updatedAt": "2021-11-27T12:03:08.413Z",
                "subLinks": [
                    {
                        "id": "08a78496-3d89-4206-9034-c1e18fbf1739",
                        "title": "my first music player link",
                        "type": "MusicPlayer",
                        "active": true,
                        "thumbnail": null,
                        "url": "https://music.youtube.com/watch?v=342Msc1FQUU",
                        "embed": false,
                        "userId": "e92a7dfd-0d8a-405e-9c79-ef8b10069298",
                        "sublinkId": "38cf7902-18fc-48fd-a803-a3594f19e931",
                        "dateCreated": "2021-11-27T12:03:08.388Z",
                        "updatedAt": "2021-11-27T12:03:08.413Z",
                        "show": null,
                        "music": {
                            "id": "3aeaf58c-9407-4130-8bd0-90cdff535553",
                            "platform": "YouTube",
                            "linkId": "08a78496-3d89-4206-9034-c1e18fbf1739",
                            "date": "2021-11-27T12:03:08.388Z",
                            "updatedAt": "2021-11-27T12:03:08.388Z"
                        }
                    },
                    {
                        "id": "063a048a-6ec7-425b-b4b7-2393a86264ff",
                        "title": "my second music player link",
                        "type": "MusicPlayer",
                        "active": true,
                        "thumbnail": null,
                        "url": "https://music.youtube.com/watch?v=342Msc1FQUU",
                        "embed": false,
                        "userId": "e92a7dfd-0d8a-405e-9c79-ef8b10069298",
                        "sublinkId": "38cf7902-18fc-48fd-a803-a3594f19e931",
                        "dateCreated": "2021-11-27T12:03:08.392Z",
                        "updatedAt": "2021-11-27T12:03:08.413Z",
                        "show": null,
                        "music": {
                            "id": "735d34dc-1bc2-4336-9c85-4dd912460cd4",
                            "platform": "YouTube",
                            "linkId": "063a048a-6ec7-425b-b4b7-2393a86264ff",
                            "date": "2021-11-27T12:03:08.392Z",
                            "updatedAt": "2021-11-27T12:03:08.393Z"
                        }
                    },
                    {
                        "id": "ee032004-7583-4b80-9977-c4cf23cd5a0b",
                        "title": "my third music player link",
                        "type": "MusicPlayer",
                        "active": true,
                        "thumbnail": null,
                        "url": "https://music.youtube.com/watch?v=342Msc1FQUU",
                        "embed": true,
                        "userId": "e92a7dfd-0d8a-405e-9c79-ef8b10069298",
                        "sublinkId": "38cf7902-18fc-48fd-a803-a3594f19e931",
                        "dateCreated": "2021-11-27T12:03:08.396Z",
                        "updatedAt": "2021-11-27T12:03:08.413Z",
                        "show": null,
                        "music": {
                            "id": "663d34b2-dc03-4e8a-89a3-4a13e911ae36",
                            "platform": "YouTube",
                            "linkId": "ee032004-7583-4b80-9977-c4cf23cd5a0b",
                            "date": "2021-11-27T12:03:08.396Z",
                            "updatedAt": "2021-11-27T12:03:08.397Z"
                        }
                    }
                ]
            },
            {
                "id": "b367d8d4-8b4b-4be6-9ba0-0246c84dd99b",
                "title": "parent show link",
                "type": "Show",
                "active": true,
                "thumbnail": null,
                "url": null,
                "embed": null,
                "userId": "e92a7dfd-0d8a-405e-9c79-ef8b10069298",
                "sublinkId": null,
                "dateCreated": "2021-11-27T12:03:08.362Z",
                "updatedAt": "2021-11-27T12:03:08.413Z",
                "subLinks": [
                    {
                        "id": "b6c1e086-eb4c-4212-9ca3-7d0d2fd803b4",
                        "title": "my first show link",
                        "type": "Show",
                        "active": true,
                        "thumbnail": null,
                        "url": "https://hasura.io/",
                        "embed": false,
                        "userId": "e92a7dfd-0d8a-405e-9c79-ef8b10069298",
                        "sublinkId": "b367d8d4-8b4b-4be6-9ba0-0246c84dd99b",
                        "dateCreated": "2021-11-27T12:03:08.399Z",
                        "updatedAt": "2021-11-27T12:03:08.413Z",
                        "show": {
                            "id": "98edeb67-fd62-44c3-87a3-ffbae44aa1b8",
                            "status": "OnSale",
                            "venue": "quod",
                            "location": "266 Kevon Extensions",
                            "date": "2021-11-27T12:03:08.378Z",
                            "linkId": "b6c1e086-eb4c-4212-9ca3-7d0d2fd803b4",
                            "createdAt": "2021-11-27T12:03:08.399Z",
                            "updatedAt": "2021-11-27T12:03:08.399Z"
                        },
                        "music": null
                    },
                    {
                        "id": "e913983f-8d27-4465-84ed-8a727dac6ec3",
                        "title": "my second show link",
                        "type": "Show",
                        "active": true,
                        "thumbnail": null,
                        "url": "https://hasura.io/",
                        "embed": false,
                        "userId": "e92a7dfd-0d8a-405e-9c79-ef8b10069298",
                        "sublinkId": "b367d8d4-8b4b-4be6-9ba0-0246c84dd99b",
                        "dateCreated": "2021-11-27T12:03:08.402Z",
                        "updatedAt": "2021-11-27T12:03:08.413Z",
                        "show": {
                            "id": "5dce8bb3-5677-4f7b-a559-e240d5258ea2",
                            "status": "OnSale",
                            "venue": "est",
                            "location": "41703 Will Extension",
                            "date": "2021-11-27T12:03:08.378Z",
                            "linkId": "e913983f-8d27-4465-84ed-8a727dac6ec3",
                            "createdAt": "2021-11-27T12:03:08.402Z",
                            "updatedAt": "2021-11-27T12:03:08.403Z"
                        },
                        "music": null
                    },
                    {
                        "id": "dc608936-0810-429d-84cc-d49b98047929",
                        "title": "my third show link",
                        "type": "Show",
                        "active": true,
                        "thumbnail": null,
                        "url": "https://hasura.io/",
                        "embed": false,
                        "userId": "e92a7dfd-0d8a-405e-9c79-ef8b10069298",
                        "sublinkId": "b367d8d4-8b4b-4be6-9ba0-0246c84dd99b",
                        "dateCreated": "2021-11-27T12:03:08.407Z",
                        "updatedAt": "2021-11-27T12:03:08.413Z",
                        "show": {
                            "id": "f630ad62-5b12-485d-b20d-efb3fc26cf3c",
                            "status": "OnSale",
                            "venue": "distinctio",
                            "location": "951 Dibbert Roads",
                            "date": "2021-11-27T12:03:08.378Z",
                            "linkId": "dc608936-0810-429d-84cc-d49b98047929",
                            "createdAt": "2021-11-27T12:03:08.407Z",
                            "updatedAt": "2021-11-27T12:03:08.407Z"
                        },
                        "music": null
                    }
                ]
            },
            {
                "id": "3849a29c-eeaa-48dc-884c-c685dfe32144",
                "title": "my first classic link",
                "type": "Classic",
                "active": true,
                "thumbnail": null,
                "url": "https://hasura.io/",
                "embed": false,
                "userId": "e92a7dfd-0d8a-405e-9c79-ef8b10069298",
                "sublinkId": null,
                "dateCreated": "2021-11-27T12:03:08.379Z",
                "updatedAt": "2021-11-27T12:03:08.413Z",
                "subLinks": []
            },
            {
                "id": "f11191a0-aa19-412f-ba0d-f0b16fa6620d",
                "title": "my second classic  link",
                "type": "Classic",
                "active": true,
                "thumbnail": null,
                "url": "https://hasura.io/",
                "embed": false,
                "userId": "e92a7dfd-0d8a-405e-9c79-ef8b10069298",
                "sublinkId": null,
                "dateCreated": "2021-11-27T12:03:08.381Z",
                "updatedAt": "2021-11-27T12:03:08.413Z",
                "subLinks": []
            },
            {
                "id": "09fdf638-e2c1-4c18-8b52-81b4ece2183d",
                "title": "my third classic  link",
                "type": "Classic",
                "active": true,
                "thumbnail": null,
                "url": "https://hasura.io/",
                "embed": false,
                "userId": "e92a7dfd-0d8a-405e-9c79-ef8b10069298",
                "sublinkId": null,
                "dateCreated": "2021-11-27T12:03:08.386Z",
                "updatedAt": "2021-11-27T12:03:08.413Z",
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
  - Creating the links and sublinks I believe can be improved we can handle it with the same controller and abstract away the meta data use a service layer to do some business logic and data processing.
  - Timezones definately need to be considered
  - USE DOCKER for db setup as it is a bit admin but if you're on mac its super simple to use the mentioned Postgresql on MAC [Postgresql](https://www.postgresql.org/download/)
