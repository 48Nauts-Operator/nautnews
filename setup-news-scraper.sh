#!/bin/bash

# Setup script for NautNews Scraper

echo "Setting up NautNews Scraper..."

# Rename package.json file
if [ -f "news-scraper-package.json" ]; then
    mv news-scraper-package.json package.json
    echo "Renamed package.json file"
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Make sure the script is executable
chmod +x news-scraper.js

# Start the scraper
echo "Starting the news scraper..."
npm start

# Note: This script will keep running as long as the scraper is running
# To run it in the background, use:
# nohup ./setup-news-scraper.sh > scraper.log 2>&1 & 