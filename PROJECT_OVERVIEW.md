# Vehicle Locator GraphQL API - Project Overview

## 📁 Project Structure

```
vehicle-locator-graphql/
│
├── 📄 server.js                    # Main Apollo Server setup with Express
├── 📄 package.json                 # Dependencies and scripts
├── 📄 .env                         # Environment configuration
├── 📄 .gitignore                   # Git ignore rules
├── 📄 README.md                    # Main documentation
├── 📄 SAMPLE_QUERIES.md            # GraphQL query examples
├── 📄 REST_vs_GRAPHQL.md           # Comparison with REST API
├── 📄 start.sh                     # Quick start script
│
├── 📁 schema/
│   ├── typeDefs.js                 # GraphQL type definitions
│   └── resolvers.js                # Query and Mutation resolvers
│
├── 📁 models/
│   ├── userModel.js                # User Mongoose schema
│   └── vehicleModel.js             # Vehicle Mongoose schema
│
├── 📁 data/
│   └── db.js                       # MongoDB connection & seeding
│
├── 📁 utils/
│   └── auth.js                     # JWT utilities
│
└── 📁 keys/
    ├── private.key                 # JWT signing key
    └── public.key                  # JWT verification key
```

## 🔄 API Flow

```
Client Request
    │
    ▼
┌─────────────────────────┐
│  Apollo Server          │
│  (Port 4000)            │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│  Express Middleware     │
│  - CORS                 │
│  - Body Parser          │
│  - Context (JWT Auth)   │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│  GraphQL Schema         │
│  - Type Definitions     │
│  - Resolvers            │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│  Mongoose Models        │
│  - User Model           │
│  - Vehicle Model        │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│  MongoDB Database       │
│  vehicleLocator         │
└─────────────────────────┘
```

## 🔐 Authentication Flow

```
1. Client Login Request
   ↓
2. Resolver validates credentials
   ↓
3. JWT token generated with private key
   ↓
4. Token returned to client
   ↓
5. Client includes token in Authorization header
   ↓
6. Context function verifies token with public key
   ↓
7. User object added to context
   ↓
8. Resolvers check context.user for authentication
```

## 📊 Data Models

### User Model
```
User {
  id: String (UUID)
  email: String (unique)
  pass: String
  name: String
  is_admin: Boolean
}
```

### Vehicle Model
```
Vehicle {
  id: String (UUID)
  vin: String (unique, 17 chars)
  lat: Number (latitude)
  lng: Number (longitude)
  make: String
  model: String
  year: Number
  color: String
  status: String ('active' | 'inactive')
  lastUpdated: Date
}
```

## 🎯 GraphQL Schema Overview

### Types
- **User**: User account information
- **Vehicle**: Vehicle data with location
- **AuthPayload**: Authentication response

### Queries (Require Authentication)
- `vehicles: [Vehicle!]!` - List all vehicles (max 10)
- `vehicle(id: ID!): Vehicle` - Get single vehicle by ID

### Mutations
**Public:**
- `login(email, pass): AuthPayload!` - User login
- `register(email, pass, name, is_admin): AuthPayload!` - User registration

**Protected (Require Authentication):**
- `addVehicle(...): Vehicle!` - Create new vehicle
- `updateVehicleLocation(id, lat, lng): Vehicle!` - Update location
- `deleteVehicle(id): Vehicle!` - Remove vehicle

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Start server
npm start

# Development mode with auto-reload
npm run dev

# Using start script
./start.sh
```

## 🧪 Testing Workflow

1. **Start the server**
   ```bash
   npm start
   ```

2. **Open GraphQL Playground**
   - Navigate to: `http://localhost:4000/graphql`

3. **Login to get token**
   ```graphql
   mutation {
     login(email: "scanuser@test.com", pass: "scanpassword") {
       token
     }
   }
   ```

4. **Add token to HTTP Headers**
   ```json
   {
     "Authorization": "Bearer YOUR_TOKEN"
   }
   ```

5. **Execute queries**
   ```graphql
   query {
     vehicles {
       id
       make
       model
       lat
       lng
     }
   }
   ```

## 🔧 Configuration

### Environment Variables (.env)
```
PORT=4000                                          # Server port
MONGO_URI=mongodb://localhost:27017/vehicleLocator # Database connection
```

### Default Test Users
```
Admin:
  Email: scanadmin@test.com
  Password: scanpassword

Regular User:
  Email: scanuser@test.com
  Password: scanpassword
```

## 📦 Dependencies

### Core
- `@apollo/server@^4.10.0` - GraphQL server
- `express@^4.18.2` - Web framework
- `graphql@^16.8.1` - GraphQL implementation

### Database
- `mongoose@^8.13.1` - MongoDB ODM

### Authentication
- `jsonwebtoken@^9.0.2` - JWT tokens
- `uuid@^11.1.0` - UUID generation

### Utilities
- `dotenv@^16.1.4` - Environment config
- `cors@^2.8.5` - CORS middleware
- `body-parser@^1.20.2` - Request parsing

### Development
- `nodemon@^3.1.0` - Auto-reload server

## 🎨 Features

✅ Full CRUD operations for vehicles
✅ User authentication with JWT
✅ Token-based authorization
✅ GraphQL Playground for testing
✅ MongoDB with Mongoose ODM
✅ Automatic database seeding
✅ Error handling with GraphQL errors
✅ Strongly typed schema
✅ Context-based authentication
✅ Clean project structure

## 🔗 Related Files

- **REST API Version**: `../vehicle-locator-api/`
- **OpenAPI Spec**: `../vehicle-locator-api/openapi-spec/`
- **Postman Collection**: `../vehicle-locator-api/postman-collection/`

## 📝 Notes

- Both REST and GraphQL APIs share the same MongoDB database
- JWT keys are copied from the REST API for compatibility
- Default vehicles and users are seeded on first run
- GraphQL Playground is available for interactive testing
- All protected operations require valid JWT token

## 🐛 Troubleshooting

**Server won't start:**
- Check if MongoDB is running
- Verify port 4000 is not in use
- Check .env configuration

**Authentication fails:**
- Verify token format: `Bearer <token>`
- Check token hasn't expired (4 weeks)
- Ensure keys exist in `/keys` folder

**Database connection issues:**
- Confirm MongoDB is running: `mongosh`
- Check MONGO_URI in .env
- Verify network connectivity

## 📚 Additional Resources

- [Apollo Server Documentation](https://www.apollographql.com/docs/apollo-server/)
- [GraphQL Specification](https://graphql.org/learn/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [JWT.io](https://jwt.io/) - Token debugging

---

**Created by**: Heshaam Attar  
**Based on**: vehicle-locator-api (REST version)  
**Date**: January 2026
