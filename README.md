# NautNews - News Scraper & Aggregator

A modern web-based news aggregation system that scrapes articles from 100+ sources and displays them in a clean, user-friendly interface.

## 🚀 Quick Start

```bash
./start-nautnews.sh
```

This will:
- Install dependencies if needed
- Create the data directory
- Start the server on port 3001
- Open the settings page in your browser

## ✨ Features

- **Multi-Source Scraping:** 100+ news sources across categories
- **Categories:** AI, Brain Health, Technology, Hacker News, Finance, Switzerland
- **Web Interface:** Clean settings and news viewing pages
- **API Endpoints:** RESTful API for configuration and data access
- **Docker Support:** Container-ready deployment
- **Auto-Updates:** Configurable scraping intervals

## 🖥️ Usage

### Settings Page
Access at: `http://localhost:3001/naut-settings.html`
- Add, edit, or remove news sources
- Configure scraping settings
- Run the scraper manually

### News Page  
Access at: `http://localhost:3001/naut-news.html`
- View latest scraped articles
- Filter by category
- Clean, responsive design

## 🔧 API Endpoints

- `GET /api/settings` - Get current scraper settings
- `POST /api/settings` - Update scraper settings  
- `GET /api/run-scraper` - Trigger the scraper to run
- `GET /api/news` - Get the latest scraped news articles

## 📁 Key Files

- `simple-server.js` - Express server for web interface and API
- `news-scraper.js` - The main news scraper script
- `scraper-config.json` - Configuration with 100+ news sources
- `naut-settings.html` - Settings page HTML
- `naut-news.html` - News viewing page HTML
- `start-nautnews.sh` - Quick start script

## 🛠️ Technical Stack

- **Backend:** Node.js with Express
- **Frontend:** Vanilla HTML/CSS/JavaScript
- **Data Storage:** JSON files (no database required)
- **Scraping:** Axios + Cheerio for HTML parsing
- **Styling:** Custom CSS with responsive design

## 📋 Project Status

🔶 **Alpha Version** - Experimental news aggregator built with AI assistance

This project was created using **Cursor AI** and **Claude Anthropic 4.0** as a proof-of-concept for AI-assisted development. The entire codebase was generated through AI pair programming sessions.

### 📚 **Educational Use**
- ✅ **Free for educational purposes** - Learn, experiment, and build upon this foundation
- ✅ **Open source learning** - Explore AI-generated code patterns and architectures
- ✅ **Experimentation friendly** - Perfect for testing news aggregation concepts
- ⚠️ **Alpha software** - Use at your own discretion, may contain bugs or incomplete features

### 🤖 **AI Development Credits**
- **Primary AI**: Claude Anthropic 4.0 (Sonnet)
- **Development Environment**: Cursor AI IDE
- **Methodology**: AI pair programming and iterative development

## 🐳 Docker Support

```bash
docker-compose up
```

Serves the application on port 8080 with automated scraping. 