const fs = require('fs');
const path = require('path');

// Paths to config files
const configPath = path.join(__dirname, 'config.json');
const scraperConfigPath = path.join(__dirname, 'scraper-config.json');

// Function to sync configs
function syncConfigs() {
  console.log('Syncing configuration files...');
  
  // Read scraper-config.json
  let scraperConfig = {};
  if (fs.existsSync(scraperConfigPath)) {
    try {
      scraperConfig = JSON.parse(fs.readFileSync(scraperConfigPath, 'utf8'));
      console.log(`Scraper config file (${scraperConfigPath}) loaded.`);
      console.log(`Total sources in scraper-config.json: ${scraperConfig.sources ? scraperConfig.sources.length : 0}`);
    } catch (error) {
      console.error('Error reading scraper-config.json:', error);
      return;
    }
  } else {
    console.log(`Scraper config file (${scraperConfigPath}) does not exist.`);
    return;
  }
  
  // Read config.json
  let config = {};
  if (fs.existsSync(configPath)) {
    try {
      config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      console.log(`Config file (${configPath}) loaded.`);
      console.log(`Total sources in config.json: ${config.sources ? config.sources.length : 0}`);
    } catch (error) {
      console.error('Error reading config.json:', error);
      return;
    }
  } else {
    console.log(`Config file (${configPath}) does not exist. Creating new config.`);
    config = {
      updateInterval: 60,
      articlesPerSource: 10,
      outputDir: 'data',
      sources: []
    };
  }
  
  // Create a map of existing sources in config.json by URL
  const existingSourcesMap = {};
  if (config.sources && config.sources.length > 0) {
    config.sources.forEach(source => {
      existingSourcesMap[source.url] = source;
    });
  }
  
  // Create new sources array with all sources from scraper-config.json
  const newSources = [];
  
  if (scraperConfig.sources && scraperConfig.sources.length > 0) {
    scraperConfig.sources.forEach(scraperSource => {
      // If source already exists in config.json, use that (preserving enabled state, etc.)
      if (existingSourcesMap[scraperSource.url]) {
        const existingSource = existingSourcesMap[scraperSource.url];
        // Update with any new properties from scraper-config
        newSources.push({
          ...scraperSource,
          enabled: existingSource.enabled !== undefined ? existingSource.enabled : true,
          articleCount: existingSource.articleCount || 0
        });
      } else {
        // Add new source from scraper-config
        newSources.push({
          ...scraperSource,
          enabled: true,
          articleCount: 0
        });
      }
    });
  }
  
  // Update config.json with new sources
  config.sources = newSources;
  
  // Write updated config.json
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`\nConfig file (${configPath}) updated successfully.`);
    console.log(`Total sources in updated config.json: ${config.sources.length}`);
    
    // Count sources by category
    const categoryCounts = {};
    config.sources.forEach(source => {
      const category = source.category || 'uncategorized';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    console.log('Sources by category in updated config.json:');
    console.log(categoryCounts);
  } catch (error) {
    console.error('Error writing config.json:', error);
  }
}

// Run the sync
syncConfigs(); 