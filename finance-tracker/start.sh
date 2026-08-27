#!/bin/bash

echo "Starting Finance Tracker..."
echo ""

# Start backend server
echo "🔧 Starting backend server on port 5000..."
cd server
npm start &
SERVER_PID=$!

# Wait for server to start
sleep 3

# Start frontend
echo "🎨 Starting frontend on port 3000..."
cd ../client
npm start &
CLIENT_PID=$!

# Wait for both processes
wait $SERVER_PID $CLIENT_PID
