#!/bin/bash

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if MongoDB is running
echo "📋 Checking prerequisites..."
if command -v mongosh &> /dev/null; then
    echo "✅ MongoDB CLI found"
    if mongosh --eval "db.version()" --quiet &> /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "❌ MongoDB is not running. Please start MongoDB first:"
        echo "   - macOS: brew services start mongodb-community"
        echo "   - Linux: sudo systemctl start mongod"
        echo ""
    fi
else
    echo "⚠️  MongoDB CLI (mongosh) not found. Make sure MongoDB is installed."
    echo ""
fi

# Start the GraphQL server
echo "🚀 Starting Vehicle Locator GraphQL API..."
npm start
