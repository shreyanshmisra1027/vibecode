#!/bin/bash

# Finance Tracker Setup Script

echo "🚀 Setting up Finance Tracker..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install server dependencies"
    exit 1
fi
echo "✅ Server dependencies installed"
echo ""

# Install client dependencies
echo "📦 Installing client dependencies..."
cd ../client
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install client dependencies"
    exit 1
fi
echo "✅ Client dependencies installed"
echo ""

# Create start script
cd ..
cat > start.sh << 'EOF'
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
EOF

chmod +x start.sh

echo "✅ Setup complete!"
echo ""
echo "📖 To start the application:"
echo "   Option 1: Run './start.sh' to start both servers"
echo "   Option 2: Start servers separately:"
echo "      Terminal 1: cd server && npm start"
echo "      Terminal 2: cd client && npm start"
echo ""
echo "🌐 The app will be available at http://localhost:3000"
echo ""
