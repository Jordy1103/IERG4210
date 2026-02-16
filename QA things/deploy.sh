#!/bin/bash

# Azure Deployment Script for Node.js E-commerce Site
# This script will run on the Azure VM after files are uploaded

set -e

echo "=========================================="
echo "Starting deployment..."
echo "=========================================="

# Navigate to website directory
cd ~/website

# Install dependencies
echo "Installing dependencies..."
npm install

# Create uploads directory if not exists
mkdir -p uploads
mkdir -p uploads/thumbnails

# Get the port from environment or use default
PORT=${PORT:-3000}

echo "=========================================="
echo "Deployment complete!"
echo "=========================================="
echo "Starting Node.js server on port $PORT..."
echo "Access the application at: http://20.199.85.138:$PORT/"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=========================================="

# Start the application
npm start
