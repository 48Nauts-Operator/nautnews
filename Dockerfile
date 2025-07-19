FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY news-scraper-package.json ./package.json
RUN npm install

# Copy application files
COPY news-scraper.js ./
COPY naut-news.html ./
COPY naut-styles.css ./

# Create volume for persistent data
VOLUME ["/usr/src/app/data"]

# Set environment variables
ENV OUTPUT_FILE="data/news-data.json"
ENV UPDATE_INTERVAL=900000

# Run the application
CMD ["node", "news-scraper.js"] 