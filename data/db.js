import mongoose from 'mongoose';
import UserModel from '../models/userModel.js';
import VehicleModel from '../models/vehicleModel.js';
import { v4 as uuidv4 } from 'uuid';

function generateRandomVIN() {
    const chars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789'; // Excludes I, O, Q
    let vin = '';
    for (let i = 0; i < 17; i++) {
        vin += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return vin;
}

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vehicleLocator'); 

        console.log(`✅ MongoDB Database successfully connected: ${connection.connection.host}`);
        // Seed default users
        await seedDefaultUsers();
        await seedDefaultVehicles();
    } catch (error) {
        console.log(`❌ MongoDB connection Error: ${error.message}`);
        process.exit(1);
    }
}

// Function to seed default users
const seedDefaultUsers = async () => {
  try {
    // Check if admin user already exists
    const adminExists = await UserModel.findOne({ email: "scanadmin@test.com" });
    if (!adminExists) {
      const adminUser = new UserModel({
        email: "scanadmin@test.com",
        pass: "scanpassword",
        name: "Scan Admin User",
        is_admin: true,
        id: uuidv4(),
      });
      await adminUser.save();
      console.log("Default admin user created");
    }

    // Check if regular user already exists
    const regularUserExists = await UserModel.findOne({ email: "scanuser@test.com" });
    if (!regularUserExists) {
      const regularUser = new UserModel({
        email: "scanuser@test.com",
        pass: "scanpassword",
        name: "Scan Regular User",
        is_admin: false,
        id: uuidv4(),
      });
      await regularUser.save();
      console.log("Default regular user created");
    }
  } catch (err) {
    console.error('Error seeding default users:', err);
  }
};

// Function to seed default vehicles
const seedDefaultVehicles = async () => {
  try {
    // Check if any vehicles exist
    const vehicleCount = await VehicleModel.countDocuments();
    if (vehicleCount === 0) {
      const defaultVehicles = [
        {
          id: uuidv4(),
          vin: generateRandomVIN(),
          lat: 37.7749,
          lng: -122.4194,
          make: "Tesla",
          model: "Model 3",
          year: 2023,
          color: "Red",
          status: "active",
          lastUpdated: new Date()
        },
        {
          id: uuidv4(),
          vin: generateRandomVIN(),
          lat: 34.0522,
          lng: -118.2437,
          make: "Ford",
          model: "F-150",
          year: 2022,
          color: "Blue",
          status: "active",
          lastUpdated: new Date()
        },
        {
          id: uuidv4(),
          vin: generateRandomVIN(),
          lat: 40.7128,
          lng: -74.0060,
          make: "Chevrolet",
          model: "Silverado",
          year: 2021,
          color: "Black",
          status: "inactive",
          lastUpdated: new Date()
        }
      ];

      await VehicleModel.insertMany(defaultVehicles);
      console.log("Default vehicles created");
    }
  } catch (err) {
    console.error('Error seeding default vehicles:', err);
  }
};

export default connectDB;
