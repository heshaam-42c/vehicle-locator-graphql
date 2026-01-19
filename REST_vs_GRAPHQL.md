# REST vs GraphQL API Comparison

## Vehicle Locator API: REST vs GraphQL

### Architecture Overview

| Aspect | REST API | GraphQL API |
|--------|----------|-------------|
| **Server Framework** | Express.js | Apollo Server + Express.js |
| **Port** | 3000 | 4000 |
| **Endpoints** | Multiple (`/vehicles`, `/user`, etc.) | Single (`/graphql`) |
| **Authentication** | JWT Bearer Token | JWT Bearer Token (in context) |
| **Database** | MongoDB (Mongoose) | MongoDB (Mongoose) |

### API Endpoints Comparison

#### User Authentication

**REST API:**
- `POST /user/login` - User login
- `POST /user/register` - User registration

**GraphQL API:**
- `mutation login(email, pass)` - User login
- `mutation register(email, pass, name, is_admin)` - User registration

#### Vehicle Operations

**REST API:**
- `GET /vehicles` - Get all vehicles (requires auth)
- `GET /vehicles/:id` - Get single vehicle (requires auth)
- `POST /vehicles` - Add new vehicle (requires auth)
- `PUT /vehicles/:id/location` - Update vehicle location (requires auth)
- `DELETE /vehicles/:id` - Delete vehicle (requires auth)

**GraphQL API:**
- `query vehicles` - Get all vehicles (requires auth)
- `query vehicle(id)` - Get single vehicle (requires auth)
- `mutation addVehicle(...)` - Add new vehicle (requires auth)
- `mutation updateVehicleLocation(id, lat, lng)` - Update location (requires auth)
- `mutation deleteVehicle(id)` - Delete vehicle (requires auth)

### Request/Response Examples

#### Login Comparison

**REST API Request:**
```bash
curl -X POST http://localhost:3000/user/login \
  -H "Content-Type: application/json" \
  -d '{"email": "scanuser@test.com", "pass": "scanpassword"}'
```

**REST API Response:**
```json
{
  "message": "success",
  "token": "eyJhbGciOiJSUzM4NCIsInR5cCI6IkpXVCJ9...",
  "_id": "user-id-here"
}
```

**GraphQL API Request:**
```graphql
mutation {
  login(email: "scanuser@test.com", pass: "scanpassword") {
    message
    token
    _id
  }
}
```

**GraphQL API Response:**
```json
{
  "data": {
    "login": {
      "message": "success",
      "token": "eyJhbGciOiJSUzM4NCIsInR5cCI6IkpXVCJ9...",
      "_id": "user-id-here"
    }
  }
}
```

#### Get Vehicles Comparison

**REST API Request:**
```bash
curl http://localhost:3000/vehicles \
  -H "Authorization: Bearer <token>"
```

**REST API Response:**
```json
[
  {
    "id": "uuid",
    "vin": "1HGBH41JXMN109186",
    "lat": 37.7749,
    "lng": -122.4194,
    "make": "Tesla",
    "model": "Model 3",
    "year": 2023,
    "color": "Red",
    "status": "active",
    "lastUpdated": "2026-01-19T..."
  }
]
```

**GraphQL API Request:**
```graphql
query {
  vehicles {
    id
    make
    model
    year
  }
}
```

**GraphQL API Response (partial data):**
```json
{
  "data": {
    "vehicles": [
      {
        "id": "uuid",
        "make": "Tesla",
        "model": "Model 3",
        "year": 2023
      }
    ]
  }
}
```

### Key Differences

#### 1. Data Fetching
- **REST**: Fixed response structure, always returns all fields
- **GraphQL**: Client specifies exactly which fields to return (no over-fetching or under-fetching)

#### 2. Multiple Resources
- **REST**: Multiple requests needed for related resources
- **GraphQL**: Can fetch multiple resources in a single request

#### 3. API Documentation
- **REST**: Requires separate documentation (OpenAPI/Swagger)
- **GraphQL**: Self-documenting through introspection

#### 4. Versioning
- **REST**: Often requires API versioning (v1, v2, etc.)
- **GraphQL**: Schema evolution without versioning

#### 5. Error Handling
- **REST**: HTTP status codes (400, 401, 404, 500)
- **GraphQL**: Always returns 200, errors in response body with detailed extensions

#### 6. Development Experience
- **REST**: Tools like Postman for testing
- **GraphQL**: Built-in GraphQL Playground for interactive testing

### Advantages of GraphQL Version

1. **Flexible Queries**: Clients request only the data they need
2. **Single Endpoint**: Simplified API structure
3. **Strongly Typed Schema**: Better validation and autocomplete
4. **Real-time Updates**: Easy to add subscriptions later
5. **Better Developer Experience**: Interactive playground and introspection
6. **Reduced Network Overhead**: Fewer requests for complex data

### When to Use Each

**Use REST API when:**
- Simple CRUD operations
- Caching is critical (HTTP caching)
- File uploads/downloads
- Legacy system integration

**Use GraphQL API when:**
- Complex, nested data structures
- Mobile apps with bandwidth constraints
- Rapid frontend iteration
- Multiple clients with different data needs
- Real-time features needed

### Testing Both APIs

Both APIs share the same MongoDB database, so you can:
1. Create data using REST API
2. Query it using GraphQL API (and vice versa)
3. Compare response times and data efficiency
4. Test different authentication flows

### Running Both Simultaneously

```bash
# Terminal 1: Start REST API
cd vehicle-locator-api/app
npm start
# Runs on http://localhost:3000

# Terminal 2: Start GraphQL API
cd vehicle-locator-graphql
npm start
# Runs on http://localhost:4000
```

Both APIs can run at the same time and share the same database!
