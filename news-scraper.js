const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// Apply stealth plugin to puppeteer (makes it harder to detect as automated)
puppeteer.use(StealthPlugin());

// Load configuration from file
let CONFIG = {
    updateInterval: 15 * 60 * 1000, // 15 minutes in milliseconds
    outputFile: 'news-data.json',
    outputDir: 'data',
    maxArticlesPerSource: 10,
    sources: [],
    templateFile: 'template.html',
    htmlOutputFile: 'naut-news-generated.html'
};

// Load configuration from file
function loadConfig() {
    try {
        const configPath = path.join(__dirname, 'scraper-config.json');
        if (fs.existsSync(configPath)) {
            const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            CONFIG = {
                ...CONFIG,
                ...configData,
                outputFile: path.join(configData.outputDir || 'data', 'news-data.json')
            };
            console.log('Loaded configuration from file');
        } else {
            console.log('No configuration file found, using defaults');
        }
    } catch (error) {
        console.error('Error loading configuration:', error);
    }
}

// News data storage
let newsData = [];

// Load existing data
function loadExistingData() {
    try {
        if (fs.existsSync(CONFIG.outputFile)) {
            const data = fs.readFileSync(CONFIG.outputFile, 'utf8');
            const parsedData = JSON.parse(data);
            console.log('Loaded existing news data');
            return Array.isArray(parsedData) ? parsedData : [];
        }
    } catch (error) {
        console.error('Error loading existing data:', error);
    }
    
    return []; // Return empty array if no data or error
}

// Merge new articles with existing ones, removing duplicates and keeping newer versions
function mergeArticles(existingArticles, newArticles) {
    // Create a map of existing articles by URL for quick lookup
    const articleMap = new Map();
    
    // Add existing articles to the map if they exist
    if (Array.isArray(existingArticles)) {
        existingArticles.forEach(article => {
            articleMap.set(article.url, article);
        });
    }
    
    // Add or update with new articles
    newArticles.forEach(article => {
        // If the article already exists, keep the newer version
        if (articleMap.has(article.url)) {
            const existingArticle = articleMap.get(article.url);
            const existingDate = new Date(existingArticle.date);
            const newDate = new Date(article.date);
            
            // Replace if the new article is newer
            if (newDate > existingDate) {
                articleMap.set(article.url, article);
            }
        } else {
            // Add new article
            articleMap.set(article.url, article);
        }
    });
    
    // Convert map back to array and sort by date (newest first)
    const mergedArticles = Array.from(articleMap.values());
    mergedArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return mergedArticles;
}

// Save news data to file
function saveData(articles) {
    try {
        // Create directory if it doesn't exist
        const dir = path.dirname(CONFIG.outputFile);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(CONFIG.outputFile, JSON.stringify(articles, null, 2));
        console.log(`Data saved to ${CONFIG.outputFile}`);
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// Check if an article is outdated based on its content
function isOutdatedContent(title, summary) {
    const currentYear = new Date().getFullYear();
    
    // Check for years in the past that are mentioned as future predictions
    for (let year = 2010; year < currentYear; year++) {
        // Look for patterns like "by 2020" or "in 2020" that refer to years in the past
        const patterns = [
            `by ${year}`, 
            `in ${year}`, 
            `by the year ${year}`,
            `by end of ${year}`,
            `by ${year}s`,
            `${year} prediction`
        ];
        
        for (const pattern of patterns) {
            if (title.toLowerCase().includes(pattern.toLowerCase()) || 
                summary.toLowerCase().includes(pattern.toLowerCase())) {
                console.log(`Filtering out outdated article with past prediction: ${title}`);
                return true;
            }
        }
    }
    
    // Check for very old technology news that's no longer relevant
    const outdatedTechTerms = [
        "windows xp", "windows 7", "windows 8", 
        "iphone 6", "iphone 7", "iphone 8", "iphone x",
        "android 9", "android 10", "android 11",
        "4g rollout", "3g network"
    ];
    
    for (const term of outdatedTechTerms) {
        if (title.toLowerCase().includes(term) || summary.toLowerCase().includes(term)) {
            console.log(`Filtering out article with outdated tech: ${title}`);
            return true;
        }
    }
    
    return false;
}

// Check if an article is too old based on its publication date
function isArticleTooOld(article) {
    // Skip articles without dates
    if (!article.date) return false;
    
    try {
        const articleDate = new Date(article.date);
        const now = new Date();
        
        // Calculate the difference in days
        const diffTime = Math.abs(now - articleDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Filter out articles older than 4 weeks (28 days)
        if (diffDays > 28) {
            console.log(`Filtering out article that is ${diffDays} days old: ${article.title}`);
            return true;
        }
        
        return false;
    } catch (error) {
        console.error(`Error parsing date for article: ${article.title}`, error);
        return false; // Keep the article if we can't parse the date
    }
}

// List of realistic user agents to rotate through
const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0'
];

// Get a random user agent
function getRandomUserAgent() {
    return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

// Sleep function to add delays between requests
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Get random delay between min and max milliseconds
function getRandomDelay(min = 1000, max = 5000) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Make a request with anti-bot evasion techniques
async function makeRequest(url, options = {}) {
    // Add random delay before request
    const delay = getRandomDelay();
    console.log(`Waiting ${delay}ms before requesting ${url}...`);
    await sleep(delay);
    
    // Set up default headers to appear more like a real browser
    const defaultHeaders = {
        'User-Agent': getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0',
        'TE': 'trailers'
    };
    
    // Merge default headers with any provided headers
    const headers = { ...defaultHeaders, ...(options.headers || {}) };
    
    // Make the request with axios
    try {
        return await axios({
            url,
            method: options.method || 'get',
            headers,
            timeout: options.timeout || 15000,
            validateStatus: status => status < 500 // Don't throw on 4xx errors
        });
    } catch (error) {
        console.error(`Error making request to ${url}: ${error.message}`);
        throw error;
    }
}

// Scrape a source using Puppeteer for sites that need JavaScript or have anti-bot measures
async function scrapePuppeteer(source) {
    console.log(`Using Puppeteer to scrape ${source.url} for ${source.name}...`);
    
    let browser = null;
    try {
        // Launch browser with stealth mode
        browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
                '--window-size=1920x1080',
            ]
        });
        
        const page = await browser.newPage();
        
        // Set a realistic viewport
        await page.setViewport({ width: 1920, height: 1080 });
        
        // Set a random user agent
        await page.setUserAgent(getRandomUserAgent());
        
        // Add additional headers
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        });
        
        // Navigate to the page with a timeout
        await page.goto(source.url, { 
            waitUntil: 'networkidle2',
            timeout: 30000
        });
        
        // Wait for a random amount of time to simulate human behavior
        await sleep(getRandomDelay(2000, 5000));
        
        // Scroll down a bit to trigger lazy loading
        await autoScroll(page);
        
        // Get the page content
        const content = await page.content();
        
        // Parse with cheerio
        const $ = cheerio.load(content);
        const articles = [];
        
        // Extract articles using the same selector logic
        $(source.selector).each((i, el) => {
            if (i >= source.limit || i >= CONFIG.maxArticlesPerSource) return false;
            
            const title = $(el).text().trim();
            let link = $(el).attr('href');
            
            // Skip if title is too short or looks like a navigation element
            if (!title || title.length < 10 || title.includes('Home') || title.includes('About') || 
                title.includes('Contact') || title.includes('Login') || title.includes('Sign')) {
                return;
            }
            
            // Handle relative URLs
            if (link && link.startsWith('/')) {
                const urlObj = new URL(source.url);
                link = `${urlObj.protocol}//${urlObj.host}${link}`;
            } else if (link && !link.startsWith('http')) {
                // Handle other relative URLs
                if (source.url.endsWith('/')) {
                    link = `${source.url}${link}`;
                } else {
                    link = `${source.url}/${link}`;
                }
            }
            
            if (title && link) {
                // Try to find a better summary
                let summary = '';
                
                // Look for summary in parent elements
                const parentElement = $(el).parent();
                const paragraphs = parentElement.find('p');
                
                if (paragraphs.length > 0) {
                    // Use the first paragraph as summary
                    summary = $(paragraphs[0]).text().trim();
                }
                
                // If no summary found, look in siblings
                if (!summary || summary.length < 20) {
                    const siblings = $(el).siblings('p');
                    if (siblings.length > 0) {
                        summary = $(siblings[0]).text().trim();
                    }
                }
                
                // If still no good summary, create a generic one
                if (!summary || summary.length < 20) {
                    summary = `Article from ${source.name} about ${title.split(' ').slice(0, 5).join(' ')}...`;
                }
                
                // Check if the article content is outdated
                if (isOutdatedContent(title, summary)) {
                    return; // Skip this article
                }
                
                // Try to find an image
                let imageUrl = '';
                
                // Look for images in parent elements
                const parentImages = parentElement.find('img');
                if (parentImages.length > 0) {
                    imageUrl = $(parentImages[0]).attr('src');
                    
                    // Handle relative image URLs
                    if (imageUrl && imageUrl.startsWith('/')) {
                        const urlObj = new URL(source.url);
                        imageUrl = `${urlObj.protocol}//${urlObj.host}${imageUrl}`;
                    }
                }
                
                articles.push({
                    title,
                    url: link,
                    sourceName: source.name,
                    sourceUrl: source.url,
                    category: source.category || 'general',
                    date: new Date().toISOString(),
                    summary: summary,
                    imageUrl: imageUrl
                });
            }
        });
        
        console.log(`Found ${articles.length} articles from ${source.url} using Puppeteer`);
        
        // No more fallback articles
        if (articles.length === 0) {
            console.log(`No articles found with Puppeteer for ${source.name}`);
            return [];
        }
        
        return articles;
    } catch (error) {
        console.error(`Error scraping ${source.url} with Puppeteer: ${error.message}`);
        return [];
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Helper function to scroll down the page to trigger lazy loading
async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                
                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

// Update the scrapeSource function to use Puppeteer for certain sites
async function scrapeSource(source) {
    try {
        if (!source.enabled) {
            console.log(`Skipping disabled source: ${source.name}`);
            return [];
        }

        console.log(`Scraping ${source.url} for ${source.name}...`);
        
        // List of sources that need Puppeteer due to anti-bot measures or JavaScript requirements
        const puppeteerSources = [
            'OpenAI Blog',
            'AI News',
            'Anthropic Blog',
            'MIT Technology Review - AI'
        ];
        
        // Use Puppeteer for sites that need it
        if (puppeteerSources.includes(source.name)) {
            try {
                const articles = await scrapePuppeteer(source);
                
                // No more fallback articles
                if (articles.length === 0) {
                    console.log(`No articles found with Puppeteer for ${source.name}`);
                    return [];
                }
                
                return articles;
            } catch (error) {
                console.error(`Error with Puppeteer for ${source.name}: ${error.message}`);
                return [];
            }
        }
        
        // For other sites, use the regular scraping method
        try {
            // Use our improved request function instead of axios directly
            const response = await makeRequest(source.url);
            
            // Handle different response status codes
            if (response.status === 403) {
                console.error(`Access forbidden (403) for ${source.url}. Site may be blocking scrapers.`);
                return [];
            }
            
            if (response.status !== 200) {
                console.error(`Unexpected status code ${response.status} for ${source.url}`);
                return [];
            }
            
            const $ = cheerio.load(response.data);
            const articles = [];
            
            $(source.selector).each((i, el) => {
                if (i >= source.limit || i >= CONFIG.maxArticlesPerSource) return false;
                
                const title = $(el).text().trim();
                let link = $(el).attr('href');
                
                // Skip if title is too short or looks like a navigation element
                if (!title || title.length < 10 || title.includes('Home') || title.includes('About') || 
                    title.includes('Contact') || title.includes('Login') || title.includes('Sign')) {
                    return;
                }
                
                // Handle relative URLs
                if (link && link.startsWith('/')) {
                    const urlObj = new URL(source.url);
                    link = `${urlObj.protocol}//${urlObj.host}${link}`;
                } else if (link && !link.startsWith('http')) {
                    // Handle other relative URLs
                    if (source.url.endsWith('/')) {
                        link = `${source.url}${link}`;
                    } else {
                        link = `${source.url}/${link}`;
                    }
                }
                
                if (title && link) {
                    // Try to find a better summary
                    let summary = '';
                    
                    // Look for summary in parent elements
                    const parentElement = $(el).parent();
                    const paragraphs = parentElement.find('p');
                    
                    if (paragraphs.length > 0) {
                        // Use the first paragraph as summary
                        summary = $(paragraphs[0]).text().trim();
                    }
                    
                    // If no summary found, look in siblings
                    if (!summary || summary.length < 20) {
                        const siblings = $(el).siblings('p');
                        if (siblings.length > 0) {
                            summary = $(siblings[0]).text().trim();
                        }
                    }
                    
                    // If still no good summary, create a generic one
                    if (!summary || summary.length < 20) {
                        summary = `Article from ${source.name} about ${title.split(' ').slice(0, 5).join(' ')}...`;
                    }
                    
                    // Check if the article content is outdated
                    if (isOutdatedContent(title, summary)) {
                        return; // Skip this article
                    }
                    
                    // Try to find an image
                    let imageUrl = '';
                    
                    // Look for images in parent elements
                    const parentImages = parentElement.find('img');
                    if (parentImages.length > 0) {
                        imageUrl = $(parentImages[0]).attr('src');
                        
                        // Handle relative image URLs
                        if (imageUrl && imageUrl.startsWith('/')) {
                            const urlObj = new URL(source.url);
                            imageUrl = `${urlObj.protocol}//${urlObj.host}${imageUrl}`;
                        }
                    }
                    
                    articles.push({
                        title,
                        url: link,
                        sourceName: source.name,
                        sourceUrl: source.url,
                        category: source.category || 'general',
                        date: new Date().toISOString(),
                        summary: summary,
                        imageUrl: imageUrl
                    });
                }
            });
            
            console.log(`Found ${articles.length} articles from ${source.url}`);
            
            // If no articles found, just return empty array
            if (articles.length === 0) {
                console.log(`No articles found from ${source.url}`);
                return [];
            }
            
            return articles;
        } catch (error) {
            console.error(`Error scraping ${source.url}: ${error.message}`);
            
            return [];
        }
    } catch (error) {
        console.error(`Unexpected error with source ${source.name}: ${error.message}`);
        return [];
    }
}

// Get a default image URL based on category
function getDefaultImageForCategory(category) {
    const categoryImages = {
        'ai': 'https://images.unsplash.com/photo-1677442135136-760c813dce26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80',
        'brain-health': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1738&q=80',
        'technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
        'finance': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
        'healthcare': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'
    };
    
    return categoryImages[category?.toLowerCase()] || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80';
}

// Update all news
async function updateAllNews() {
    try {
        console.log('Starting news update...');
        
        // Load existing data
        const existingData = loadExistingData();
        
        // Get enabled sources
        const enabledSources = CONFIG.sources.filter(source => source.enabled);
        
        // Scrape all enabled sources
        let allArticles = [];
        
        for (const source of enabledSources) {
            const articles = await scrapeSource(source);
            allArticles = allArticles.concat(articles);
        }
        
        // Filter out articles with outdated content
        allArticles = allArticles.filter(article => !isOutdatedContent(article.title, article.summary));
        
        // Filter out articles that are too old
        allArticles = allArticles.filter(article => !isArticleTooOld(article));
        
        // Merge with existing data, keeping newer articles
        const mergedArticles = mergeArticles(existingData, allArticles);
        
        // Save the updated data
        saveData(mergedArticles);
        
        // Generate HTML
        generateHTML(mergedArticles);
        
        console.log(`News update completed. Found ${allArticles.length} articles.`);
        return {
            success: true,
            articlesCount: allArticles.length
        };
    } catch (error) {
        console.error('Error updating news:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Generate HTML from news data
function generateHTML(articles) {
    try {
        // Check if template exists
        if (!fs.existsSync(CONFIG.templateFile)) {
            console.log('Template does not exist, creating...');
            createTemplate();
        } else {
            console.log('Template already exists');
        }
        
        // Read template
        const template = fs.readFileSync(CONFIG.templateFile, 'utf8');
        
        // Group articles by source
        const sourceGroups = {};
        
        articles.forEach(article => {
            const sourceName = article.sourceName || 'Unknown';
            if (!sourceGroups[sourceName]) {
                sourceGroups[sourceName] = [];
            }
            sourceGroups[sourceName].push(article);
        });
        
        // Generate HTML for each source
        let sourcesHTML = '';
        
        Object.keys(sourceGroups).sort().forEach(sourceName => {
            const sourceArticles = sourceGroups[sourceName];
            
            sourcesHTML += `
                <div class="source-group">
                    <div class="source-header">
                        <h2>${sourceName}</h2>
                        <span class="article-count">${sourceArticles.length} articles</span>
                    </div>
                    <div class="articles">
            `;
            
            sourceArticles.forEach(article => {
                const date = article.date ? new Date(article.date).toLocaleDateString() : 'Unknown date';
                
                sourcesHTML += `
                    <div class="article">
                        <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
                        <p class="article-summary">${article.summary}</p>
                        <div class="article-meta">
                            <span class="date">${date}</span>
                            ${article.category ? `<span class="category">${article.category}</span>` : ''}
                        </div>
                    </div>
                `;
            });
            
            sourcesHTML += `
                    </div>
                </div>
            `;
        });
        
        // Replace placeholder in template
        const html = template.replace('{{SOURCES}}', sourcesHTML);
        
        // Write HTML file
        fs.writeFileSync(CONFIG.htmlOutputFile, html);
        console.log('HTML generated successfully');
    } catch (error) {
        console.error('Error generating HTML:', error);
    }
}

// Create HTML template
function createTemplate() {
    const template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NautNews</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            color: #2c3e50;
            text-align: center;
            margin-bottom: 30px;
        }
        .source-group {
            margin-bottom: 40px;
            border: 1px solid #eee;
            border-radius: 5px;
            overflow: hidden;
        }
        .source-header {
            background-color: #f8f9fa;
            padding: 10px 20px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .source-header h2 {
            margin: 0;
            font-size: 1.4rem;
            color: #2c3e50;
        }
        .article-count {
            background-color: #e9ecef;
            padding: 3px 8px;
            border-radius: 10px;
            font-size: 0.8rem;
            color: #495057;
        }
        .articles {
            padding: 0 20px;
        }
        .article {
            padding: 15px 0;
            border-bottom: 1px solid #eee;
        }
        .article:last-child {
            border-bottom: none;
        }
        .article h3 {
            margin-top: 0;
            margin-bottom: 10px;
        }
        .article h3 a {
            color: #3498db;
            text-decoration: none;
        }
        .article h3 a:hover {
            text-decoration: underline;
        }
        .article-summary {
            margin-bottom: 10px;
            color: #555;
        }
        .article-meta {
            font-size: 0.8rem;
            color: #6c757d;
            display: flex;
            gap: 15px;
        }
        .category {
            background-color: #e9ecef;
            padding: 2px 6px;
            border-radius: 4px;
        }
        .last-updated {
            text-align: center;
            margin-top: 30px;
            font-size: 0.9rem;
            color: #6c757d;
        }
    </style>
</head>
<body>
    <h1>NautNews</h1>
    
    {{SOURCES}}
    
    <div class="last-updated">
        Last updated: ${new Date().toLocaleString()}
    </div>
</body>
</html>`;

    fs.writeFileSync(CONFIG.templateFile, template);
    console.log(`Template created at ${CONFIG.templateFile}`);
}

// Main function
async function main() {
    // Load configuration
    loadConfig();
    
    // Load existing data
    loadExistingData();
    
    // Create template from existing HTML
    createTemplate();
    
    // Initial update
    await updateAllNews();
    
    // If this is a one-time run (e.g., triggered by API), exit here
    if (process.argv.includes('--once')) {
        console.log('One-time run completed');
        return;
    }
    
    // Set up regular updates
    setInterval(updateAllNews, CONFIG.updateInterval);
    console.log(`News scraper started. Will update every ${CONFIG.updateInterval / 60000} minutes.`);
}

// Start the scraper
main().catch(error => {
    console.error('Error in main function:', error);
}); 