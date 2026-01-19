import UserModel from '../models/userModel.js';
import VehicleModel from '../models/vehicleModel.js';
import { v4 as uuidv4 } from 'uuid';
import { createJWT, getPrivateKey } from '../utils/auth.js';
import { GraphQLError } from 'graphql';

export const resolvers = {
  Query: {
    // Get all vehicles
    vehicles: async (_, __, { user }) => {
      // Check if user is authenticated
      if (!user) {
        throw new GraphQLError('You must be logged in to view vehicles', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      const vehicles = await VehicleModel.find().select('-_id').limit(10);
      return vehicles;
    },

    // Get a single vehicle by ID
    vehicle: async (_, { id }, { user }) => {
      // Check if user is authenticated
      if (!user) {
        throw new GraphQLError('You must be logged in to view a vehicle', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      const vehicle = await VehicleModel.findOne({ id });
      if (!vehicle) {
        throw new GraphQLError('Vehicle not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }
      return vehicle;
    }
  },

  Mutation: {
    // User login
    login: async (_, { email, pass }) => {
      if (!email || !pass) {
        throw new GraphQLError('Missing email and/or password parameters', {
          extensions: { code: 'BAD_USER_INPUT' }
        });
      }

      const user = await UserModel.findOne({ email, pass });

      if (!user) {
        throw new GraphQLError('Invalid email or password', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      // Create JWT token
      const token = createJWT(
        'RS384',
        'vehicleLocatorUsers',
        'https://issuer.42crunch.demo',
        user.email,
        { id: user.id },
        getPrivateKey()
      );

      return {
        message: 'success',
        token,
        _id: user.id
      };
    },

    // User registration
    register: async (_, { email, pass, name, is_admin = false }) => {
      if (!email || !pass || !name) {
        throw new GraphQLError('Missing required fields: email, password, name', {
          extensions: { code: 'BAD_USER_INPUT' }
        });
      }

      if (pass.length <= 4) {
        throw new GraphQLError('Password length too short, minimum of 5 characters', {
          extensions: { code: 'BAD_USER_INPUT' }
        });
      }

      // Check if user already exists
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        throw new GraphQLError('User already exists', {
          extensions: { code: 'BAD_USER_INPUT' }
        });
      }

      // Create new user
      const user = new UserModel({
        email,
        pass,
        name,
        is_admin,
        id: uuidv4()
      });

      await user.save();

      return {
        message: 'success',
        _id: user.id
      };
    },

    // Add a new vehicle
    addVehicle: async (_, { vin, lat, lng, make, model, year, color }, { user }) => {
      // Check if user is authenticated
      if (!user) {
        throw new GraphQLError('You must be logged in to add a vehicle', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      // Check if a vehicle with the same VIN already exists
      const existingVehicle = await VehicleModel.findOne({ vin });
      if (existingVehicle) {
        throw new GraphQLError('A vehicle with this VIN already exists', {
          extensions: { code: 'BAD_USER_INPUT' }
        });
      }

      // Create and save the new vehicle
      const vehicle = new VehicleModel({
        vin,
        lat,
        lng,
        make,
        model,
        year,
        color,
        id: uuidv4(),
        lastUpdated: new Date(),
        status: 'active'
      });

      await vehicle.save();
      return vehicle;
    },

    // Update vehicle location
    updateVehicleLocation: async (_, { id, lat, lng }, { user }) => {
      // Check if user is authenticated
      if (!user) {
        throw new GraphQLError('You must be logged in to update a vehicle', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      const vehicle = await VehicleModel.findOneAndUpdate(
        { id },
        { lat, lng, lastUpdated: new Date() },
        { new: true }
      );

      if (!vehicle) {
        throw new GraphQLError('Vehicle not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      return vehicle;
    },

    // Delete a vehicle
    deleteVehicle: async (_, { id }, { user }) => {
      // Check if user is authenticated
      if (!user) {
        throw new GraphQLError('You must be logged in to delete a vehicle', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      const vehicle = await VehicleModel.findOneAndDelete({ id });

      if (!vehicle) {
        throw new GraphQLError('Vehicle not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      return vehicle;
    }
  }
};
