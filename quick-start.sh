#!/bin/bash

# Quick Start Guide for Vehicle Locator APIs

echo "🚗 Vehicle Locator API - Quick Start Guide"
echo "=========================================="
echo ""

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

echo ""
echo "📦 Choose which API to start:"
echo ""
echo "1. REST API (vehicle-locator-api)"
echo "   - Traditional REST endpoints"
echo "   - Port: 3000"
echo "   - Endpoints: /vehicles, /user"
echo ""
echo "2. GraphQL API (vehicle-locator-graphql)"
echo "   - Modern GraphQL single endpoint"
echo "   - Port: 4000"
echo "   - Endpoint: /graphql"
echo ""
echo "3. Both APIs (side by side)"
echo "   - Compare both implementations"
echo "   - Share the same database"
echo ""

read -p "Enter your choice (1, 2, or 3): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Starting REST API..."
        cd vehicle-locator-api/app
        npm install
        npm start
        ;;
    2)
        echo ""
        echo "🚀 Starting GraphQL API..."
        cd vehicle-locator-graphql
        npm install
        npm start
        ;;
    3)
        echo ""
        echo "🚀 Starting both APIs..."
        echo ""
        echo "Terminal 1: REST API"
        cd vehicle-locator-api/app
        npm install
        npm start &
        REST_PID=$!
        
        echo ""
        echo "Terminal 2: GraphQL API"
        cd ../../vehicle-locator-graphql
        npm install
        npm start &
        GRAPHQL_PID=$!
        
        echo ""
        echo "✅ Both APIs started!"
        echo "   - REST API: http://localhost:3000"
        echo "   - GraphQL API: http://localhost:4000/graphql"
        echo ""
        echo "Press Ctrl+C to stop both servers"
        
        # Wait for interrupt
        trap "kill $REST_PID $GRAPHQL_PID 2>/dev/null" EXIT
        wait
        ;;
    *)
        echo ""
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac
