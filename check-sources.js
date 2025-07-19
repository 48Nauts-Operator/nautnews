const fs = require('fs');
const path = require('path');

// Paths to config files
const configPath = path.join(__dirname, 'config.json');
const scraperConfigPath = path.join(__dirname, 'scraper-config.json');

// Function to count sources by category
function countSourcesByCategory(sources) {
  const counts = {};
  sources.forEach(source => {
    const category = source.category || 'uncategorized';
    counts[category] = (counts[category] || 0) + 1;
  });
  return counts;
}

// Function to check if sources are in both configs
function checkSources() {
  console.log('Checking sources in config files...');
  
  // Read config.json
  let config = {};
  if (fs.existsSync(configPath)) {
    try {
      config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      console.log(`\nConfig file (${configPath}) exists.`);
      console.log(`Total sources in config.json: ${config.sources ? config.sources.length : 0}`);
      
      if (config.sources && config.sources.length > 0) {
        const categoryCounts = countSourcesByCategory(config.sources);
        console.log('Sources by category in config.json:');
        console.log(categoryCounts);
        
        // List Hacker News sources
        const hackerNewsSources = config.sources.filter(s => s.category === 'hacker-news');
        console.log(`\nHacker News sources in config.json (${hackerNewsSources.length}):`);
        hackerNewsSources.forEach(s => console.log(`- ${s.name}`));
      }
    } catch (error) {
      console.error('Error reading config.json:', error);
    }
  } else {
    console.log(`Config file (${configPath}) does not exist.`);
  }
  
  // Read scraper-config.json
  let scraperConfig = {};
  if (fs.existsSync(scraperConfigPath)) {
    try {
      scraperConfig = JSON.parse(fs.readFileSync(scraperConfigPath, 'utf8'));
      console.log(`\nScraper config file (${scraperConfigPath}) exists.`);
      console.log(`Total sources in scraper-config.json: ${scraperConfig.sources ? scraperConfig.sources.length : 0}`);
      
      if (scraperConfig.sources && scraperConfig.sources.length > 0) {
        const categoryCounts = countSourcesByCategory(scraperConfig.sources);
        console.log('Sources by category in scraper-config.json:');
        console.log(categoryCounts);
        
        // List Hacker News sources
        const hackerNewsSources = scraperConfig.sources.filter(s => s.category === 'hacker-news');
        console.log(`\nHacker News sources in scraper-config.json (${hackerNewsSources.length}):`);
        hackerNewsSources.forEach(s => console.log(`- ${s.name}`));
      }
    } catch (error) {
      console.error('Error reading scraper-config.json:', error);
    }
  } else {
    console.log(`Scraper config file (${scraperConfigPath}) does not exist.`);
  }
}

// Run the check
checkSources(); 