# Sample GraphQL Queries and Mutations

## 1. User Registration

```graphql
mutation RegisterUser {
  register(
    email: "testuser@example.com"
    pass: "password123"
    name: "Test User"
    is_admin: false
  ) {
    message
    _id
  }
}
```

## 2. User Login

```graphql
mutation Login {
  login(email: "scanuser@test.com", pass: "scanpassword") {
    message
    token
    _id
  }
}
```

**Note:** Copy the token from the response and add it to HTTP headers:
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

## 3. Get All Vehicles (Authentication Required)

```graphql
query GetAllVehicles {
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

## 4. Get Single Vehicle (Authentication Required)

```graphql
query GetVehicle {
  vehicle(id: "VEHICLE_ID_HERE") {
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

## 5. Add New Vehicle (Authentication Required)

```graphql
mutation AddVehicle {
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

## 6. Update Vehicle Location (Authentication Required)

```graphql
mutation UpdateVehicleLocation {
  updateVehicleLocation(
    id: "VEHICLE_ID_HERE"
    lat: 37.8049
    lng: -122.4294
  ) {
    id
    vin
    lat
    lng
    lastUpdated
  }
}
```

## 7. Delete Vehicle (Authentication Required)

```graphql
mutation DeleteVehicle {
  deleteVehicle(id: "VEHICLE_ID_HERE") {
    id
    vin
    make
    model
  }
}
```

## Testing Flow

1. Start the server: `npm start` or `./start.sh`
2. Open GraphQL Playground: `http://localhost:4000/graphql`
3. Run the Login mutation to get a token
4. Add the token to HTTP Headers in the playground:
   ```json
   {
     "Authorization": "Bearer YOUR_TOKEN_HERE"
   }
   ```
5. Execute queries and mutations that require authentication

## Default Test Credentials

- **Admin User:**
  - Email: `scanadmin@test.com`
  - Password: `scanpassword`

- **Regular User:**
  - Email: `scanuser@test.com`
  - Password: `scanpassword`
