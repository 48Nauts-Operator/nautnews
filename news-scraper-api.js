const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Explicitly serve HTML files
app.get('/naut-settings.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'naut-settings.html'));
});

app.get('/naut-news.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'naut-news.html'));
});

app.get('/', (req, res) => {
    res.redirect('/naut-news.html');
});

// Routes
app.get('/api/settings', (req, res) => {
    try {
        // Read settings from file
        const configPath = path.join(__dirname, 'scraper-config.json');
        
        if (fs.existsSync(configPath)) {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            res.json(config);
        } else {
            // If config doesn't exist, create default config from scraper
            const scraperPath = path.join(__dirname, 'news-scraper.js');
            const scraperContent = fs.readFileSync(scraperPath, 'utf8');
            
            // Extract CONFIG object from scraper
            const configMatch = scraperContent.match(/const CONFIG = ({[\s\S]*?});/);
            
            if (configMatch && configMatch[1]) {
                // Convert to proper JSON (this is a simplification, in reality you'd need a more robust approach)
                let configStr = configMatch[1]
                    .replace(/\/\/.*$/gm, '') // Remove comments
                    .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
                    .replace(/(\w+):/g, '"$1":') // Wrap keys in quotes
                    .replace(/'/g, '"'); // Replace single quotes with double quotes
                
                try {
                    const config = JSON.parse(configStr);
                    
                    // Format for settings page
                    const settings = {
                        updateInterval: Math.floor(config.updateInterval / 60000), // Convert to minutes
                        articlesPerCategory: 20, // Default
                        outputFile: config.outputFile,
                        categories: config.categories.map(cat => ({
                            name: cat.name,
                            sources: cat.sources
                        }))
                    };
                    
                    // Save to file
                    fs.writeFileSync(configPath, JSON.stringify(settings, null, 2));
                    
                    res.json(settings);
                } catch (parseError) {
                    console.error('Error parsing config:', parseError);
                    res.status(500).json({ error: 'Error parsing scraper config' });
                }
            } else {
                res.status(404).json({ error: 'Config not found in scraper' });
            }
        }
    } catch (error) {
        console.error('Error getting settings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/settings', (req, res) => {
    try {
        const settings = req.body;
        
        // Validate settings
        if (!settings || !settings.categories) {
            return res.status(400).json({ error: 'Invalid settings format' });
        }
        
        // Save settings to file
        const configPath = path.join(__dirname, 'scraper-config.json');
        fs.writeFileSync(configPath, JSON.stringify(settings, null, 2));
        
        // Update scraper config
        updateScraperConfig(settings);
        
        res.json({ success: true, message: 'Settings updated successfully' });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/run', (req, res) => {
    try {
        // Run scraper as a child process
        const scraperProcess = spawn('node', ['news-scraper.js'], {
            detached: true,
            stdio: 'ignore'
        });
        
        // Don't wait for the process to finish
        scraperProcess.unref();
        
        res.json({ success: true, message: 'Scraper started successfully' });
    } catch (error) {
        console.error('Error running scraper:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Helper function to update scraper config
function updateScraperConfig(settings) {
    try {
        const scraperPath = path.join(__dirname, 'news-scraper.js');
        let scraperContent = fs.readFileSync(scraperPath, 'utf8');
        
        // Convert settings to CONFIG format
        const config = {
            updateInterval: settings.updateInterval * 60000, // Convert to milliseconds
            outputFile: settings.outputFile,
            categories: settings.categories
        };
        
        // Replace CONFIG object in scraper
        const configStr = JSON.stringify(config, null, 2)
            .replace(/"(\w+)":/g, '$1:') // Remove quotes from keys
            .replace(/"/g, "'"); // Replace double quotes with single quotes
        
        scraperContent = scraperContent.replace(
            /const CONFIG = {[\s\S]*?};/,
            `const CONFIG = ${configStr};`
        );
        
        // Write updated scraper
        fs.writeFileSync(scraperPath, scraperContent);
        
        console.log('Scraper config updated successfully');
    } catch (error) {
        console.error('Error updating scraper config:', error);
        throw error;
    }
}

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT}/naut-settings.html to manage settings`);
}); 