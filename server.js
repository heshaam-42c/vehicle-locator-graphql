import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import connectDB from './data/db.js';
import { typeDefs } from './schema/typeDefs.js';
import { resolvers } from './schema/resolvers.js';
import { verifyJWT } from './utils/auth.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Create Express app
const app = express();
const httpServer = http.createServer(app);

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Start Apollo Server
await server.start();

// Apply middleware
app.use(
  '/graphql',
  cors(),
  bodyParser.json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      // Get the authorization header
      const authHeader = req.headers.authorization || '';
      
      // Extract token from Bearer token
      let token = null;
      if (authHeader) {
        const parts = authHeader.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
          token = parts[1];
        }
      }

      // Verify token and get user
      let user = null;
      if (token) {
        user = verifyJWT(token);
        if (user) {
          console.log('>>> Authenticated User:', JSON.stringify(user));
        }
      }

      // Return context with user
      return { user };
    },
  }),
);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🚗 Vehicle Locator GraphQL API',
    graphql: '/graphql',
    version: '1.0.0'
  });
});

// Start server
const PORT = process.env.PORT || 4000;
await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));

console.log(`🚀 GraphQL Server running at http://localhost:${PORT}/graphql`);
console.log(`🚗 API server running at http://localhost:${PORT}`);
