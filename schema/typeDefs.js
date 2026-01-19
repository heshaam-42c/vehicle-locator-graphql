export const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    name: String!
    is_admin: Boolean!
  }

  type Vehicle {
    id: ID!
    vin: String!
    lat: Float!
    lng: Float!
    make: String!
    model: String!
    year: Int!
    color: String!
    status: String!
    lastUpdated: String!
  }

  type AuthPayload {
    message: String!
    token: String
    _id: ID
  }

  type Query {
    # Get all vehicles (limited to 10)
    vehicles: [Vehicle!]!
    
    # Get a single vehicle by ID
    vehicle(id: ID!): Vehicle
  }

  type Mutation {
    # User authentication
    login(email: String!, pass: String!): AuthPayload!
    
    # User registration
    register(email: String!, pass: String!, name: String!, is_admin: Boolean): AuthPayload!
    
    # Add a new vehicle
    addVehicle(
      vin: String!
      lat: Float!
      lng: Float!
      make: String!
      model: String!
      year: Int!
      color: String!
    ): Vehicle!
    
    # Update vehicle location
    updateVehicleLocation(id: ID!, lat: Float!, lng: Float!): Vehicle!
    
    # Delete a vehicle
    deleteVehicle(id: ID!): Vehicle!
  }
`;
