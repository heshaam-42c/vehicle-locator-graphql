# Vehicle Locator GraphQL API

A GraphQL API for managing vehicle locations and user authentication, built with Apollo Server, Express, and MongoDB.

## Features

- 🚗 Vehicle management (CRUD operations)
- 👤 User authentication with JWT
- 📍 Location tracking for vehicles
- 🔒 Protected GraphQL queries and mutations
- 🗄️ MongoDB database with Mongoose ODM

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally or remote)
- npm or yarn

## MongoDB Setup

Before running the API, you need MongoDB installed and running on your system.

### Option 1: Install MongoDB with Homebrew (macOS)

```bash
# Tap the MongoDB Homebrew repository
brew tap mongodb/brew

# Install MongoDB Community Edition
brew install mongodb-community

# Start MongoDB as a service
brew services start mongodb-community

# Verify MongoDB is running
brew services list | grep mongodb
```

### Option 2: Install MongoDB with Docker

```bash
# Pull and run MongoDB in a Docker container
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Verify it's running
docker ps | grep mongodb
```

### Option 3: Use MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and get your connection string
3. Update the `MONGO_URI` in your `.env` file with the Atlas connection string

### Verify MongoDB Connection

```bash
# Using mongosh (MongoDB Shell)
mongosh

# Or check if the port is listening
lsof -i :27017
```

### Troubleshooting MongoDB Connection

If you see the error: `MongoDB connection Error: connect ECONNREFUSED ::1:27017`

**This means MongoDB is not running.** To fix:

**For Homebrew installation:**
```bash
brew services start mongodb-community
```

**For Docker:**
```bash
docker start mongodb
# Or if the container doesn't exist:
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**To stop MongoDB later:**
```bash
# Homebrew:
brew services stop mongodb-community

# Docker:
docker stop mongodb
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Edit the `.env` file with your settings:
```
PORT=4000
MONGO_URI=mongodb://localhost:27017/vehicleLocator
```

3. Ensure MongoDB is running on your system.

## Running the Server

### Quick start:
```bash
./start.sh
```

### Or manually:
```bash
npm start
```

### Development mode with auto-reload:
```bash
npm run dev
```

The GraphQL playground will be available at: `http://localhost:4000/graphql`

## API Structure

### Authentication

#### Register a new user:
```graphql
mutation {
  register(
    email: "user@example.com"
    pass: "password123"
    name: "John Doe"
    is_admin: false
  ) {
    message
    _id
  }
}
```

#### Login:
```graphql
mutation {
  login(email: "scanuser@test.com", pass: "scanpassword") {
    message
    token
    _id
  }
}
```

### Queries (require authentication)

Add the JWT token to your HTTP headers:
```
Authorization: Bearer <your_token_here>
```

#### Get all vehicles:
```graphql
query {
  vehicles {
    id
    vin
    lat
    lng
    make
    model
    year
    color
    status
    lastUpdated
  }
}
```

#### Get a specific vehicle:
```graphql
query {
  vehicle(id: "vehicle-id-here") {
    id
    vin
    lat
    lng
    make
    model
    year
    color
    status
    lastUpdated
  }
}
```

### Mutations (require authentication)

#### Add a new vehicle:
```graphql
mutation {
  addVehicle(
    vin: "1HGBH41JXMN109186"
    lat: 37.7749
    lng: -122.4194
    make: "Honda"
    model: "Accord"
    year: 2023
    color: "Silver"
  ) {
    id
    vin
    make
    model
  }
}
```

#### Update vehicle location:
```graphql
mutation {
  updateVehicleLocation(
    id: "vehicle-id-here"
    lat: 37.8049
    lng: -122.4294
  ) {
    id
    lat
    lng
    lastUpdated
  }
}
```

#### Delete a vehicle:
```graphql
mutation {
  deleteVehicle(id: "vehicle-id-here") {
    id
    vin
    make
    model
  }
}
```

## Default Test Users

The API comes with two pre-seeded users:

1. **Admin User**
   - Email: `scanadmin@test.com`
   - Password: `scanpassword`
   - Role: Admin

2. **Regular User**
   - Email: `scanuser@test.com`
   - Password: `scanpassword`
   - Role: Regular user

## Project Structure

```
vehicle-locator-graphql/
├── server.js                 # Main server file
├── package.json             # Dependencies and scripts
├── .env                     # Environment variables
├── data/
│   └── db.js               # Database connection and seeding
├── models/
│   ├── userModel.js        # User schema
│   └── vehicleModel.js     # Vehicle schema
├── schema/
│   ├── typeDefs.js         # GraphQL type definitions
│   └── resolvers.js        # GraphQL resolvers
├── utils/
│   └── auth.js             # JWT utilities
└── keys/
    ├── private.key         # JWT private key
    └── public.key          # JWT public key
```

## Technology Stack

- **Apollo Server**: GraphQL server implementation
- **Express**: Web framework
- **Mongoose**: MongoDB ODM
- **JWT**: Authentication token management
- **dotenv**: Environment configuration

## Differences from REST API

This GraphQL API provides the same functionality as the REST API version but with:
- Single endpoint (`/graphql`) instead of multiple REST endpoints
- Flexible queries - clients can request exactly the data they need
- Built-in GraphQL Playground for testing
- Strongly typed schema
- Better handling of complex data relationships

## License

ISC

## Author

Heshaam Attar
