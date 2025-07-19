#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting NautNews...${NC}"

# Create data directory if it doesn't exist
if [ ! -d "data" ]; then
    echo -e "${YELLOW}Creating data directory...${NC}"
    mkdir -p data
fi

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
fi

# Kill any existing server processes
echo -e "${YELLOW}Stopping any running servers...${NC}"
pkill -f "node simple-server.js" || true
pkill -f "node news-scraper-api.js" || true

# Start the simple server
echo -e "${YELLOW}Starting simple server...${NC}"
node simple-server.js &
SERVER_PID=$!

# Wait for server to start
sleep 2

# Check if server is running
if ps -p $SERVER_PID > /dev/null; then
    echo -e "${GREEN}Server started successfully!${NC}"
    
    # Open the settings page in the default browser
    echo -e "${YELLOW}Opening settings page...${NC}"
    
    # Detect OS and open browser accordingly
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        open http://localhost:3002/naut-settings.html
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        xdg-open http://localhost:3002/naut-settings.html
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        # Windows
        start http://localhost:3002/naut-settings.html
    else
        echo -e "${YELLOW}Please open http://localhost:3002/naut-settings.html in your browser${NC}"
    fi
    
    echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
    
    # Wait for user to press Ctrl+C
    wait $SERVER_PID
else
    echo -e "${RED}Failed to start server${NC}"
    exit 1
fi 