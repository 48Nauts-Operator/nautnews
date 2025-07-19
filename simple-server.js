const express = require('express');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const app = express();
const PORT = 3002;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// Config file paths
const CONFIG_FILE = path.join(__dirname, 'config.json');
const NEWS_DATA_FILE = path.join(__dirname, 'data', 'news-data.json');

// Default config
const DEFAULT_CONFIG = {
    updateInterval: 60,
    articlesPerSource: 10,
    outputDir: 'data',
    sources: []
};

// Helper function to read config
function readConfig() {
    try {
        if (fs.existsSync(CONFIG_FILE)) {
            const configData = fs.readFileSync(CONFIG_FILE, 'utf8');
            return JSON.parse(configData);
        }
        return DEFAULT_CONFIG;
    } catch (error) {
        console.error('Error reading config:', error);
        return DEFAULT_CONFIG;
    }
}

// Helper function to write config
function writeConfig(config) {
    try {
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing config:', error);
        return false;
    }
}

// Routes
app.get('/', (req, res) => {
    res.redirect('/naut-news.html');
});

app.get('/naut-news.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'naut-news.html'));
});

app.get('/naut-settings.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'naut-settings.html'));
});

// API Routes
app.get('/api/settings', (req, res) => {
    try {
        const config = readConfig();
        res.json(config);
    } catch (error) {
        console.error('Error evaluating config:', error);
        res.status(500).json({ error: 'Failed to read settings' });
    }
});

app.get('/api/ai-sources', (req, res) => {
    try {
        const aiSourcesFile = path.join(__dirname, 'ai-sources.json');
        if (fs.existsSync(aiSourcesFile)) {
            const aiSourcesData = fs.readFileSync(aiSourcesFile, 'utf8');
            res.json(JSON.parse(aiSourcesData));
        } else {
            res.status(404).json({ error: 'AI sources file not found' });
        }
    } catch (error) {
        console.error('Error reading AI sources:', error);
        res.status(500).json({ error: 'Failed to read AI sources' });
    }
});

app.post('/api/import-ai-sources', (req, res) => {
    try {
        const aiSourcesFile = path.join(__dirname, 'ai-sources.json');
        if (!fs.existsSync(aiSourcesFile)) {
            return res.status(404).json({ success: false, error: 'AI sources file not found' });
        }
        
        const aiSourcesData = fs.readFileSync(aiSourcesFile, 'utf8');
        const aiSources = JSON.parse(aiSourcesData);
        
        // Read current config
        const config = readConfig();
        
        // Check for duplicates
        const existingUrls = config.sources.map(source => source.url);
        const newSources = aiSources.filter(source => !existingUrls.includes(source.url));
        
        if (newSources.length === 0) {
            return res.json({ success: true, message: 'All AI sources are already imported', importedCount: 0 });
        }
        
        // Add new sources
        config.sources = [...config.sources, ...newSources];
        
        // Save updated config
        const success = writeConfig(config);
        
        if (success) {
            res.json({ 
                success: true, 
                message: `Successfully imported ${newSources.length} AI sources`,
                importedCount: newSources.length
            });
        } else {
            res.status(500).json({ success: false, error: 'Failed to save updated config' });
        }
    } catch (error) {
        console.error('Error importing AI sources:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/import-ai-sources-direct', (req, res) => {
    try {
        // Hardcoded AI sources data
        const aiSources = [
            {
                "name": "OpenAI Blog",
                "category": "ai",
                "url": "https://openai.com/blog",
                "selector": "a.chakra-card",
                "description": "Official blog of OpenAI, an AI research and deployment company.",
                "rating": 10,
                "enabled": true
            },
            {
                "name": "Google AI Blog",
                "category": "ai",
                "url": "https://ai.googleblog.com",
                "selector": ".post-title a",
                "description": "The latest news from Google AI.",
                "rating": 9,
                "enabled": true
            },
            {
                "name": "DeepMind Blog",
                "category": "ai",
                "url": "https://deepmind.com/blog",
                "selector": ".dm-card__link",
                "description": "Research updates from DeepMind, a leading AI research lab.",
                "rating": 9,
                "enabled": true
            },
            {
                "name": "MIT Technology Review - AI",
                "category": "ai",
                "url": "https://www.technologyreview.com/topic/artificial-intelligence",
                "selector": "h3 a",
                "description": "AI coverage from MIT Technology Review.",
                "rating": 8,
                "enabled": true
            },
            {
                "name": "AI News",
                "category": "ai",
                "url": "https://artificialintelligence-news.com",
                "selector": "h3.entry-title a",
                "description": "AI News brings you the latest artificial intelligence news from around the world.",
                "rating": 8,
                "enabled": true
            },
            {
                "name": "Towards Data Science",
                "category": "ai",
                "url": "https://towardsdatascience.com",
                "selector": "h3 a",
                "description": "Medium publication sharing concepts, ideas, and codes related to data science and AI.",
                "rating": 7,
                "enabled": true
            },
            {
                "name": "Hugging Face Blog",
                "category": "ai",
                "url": "https://huggingface.co/blog",
                "selector": "a.group",
                "description": "Blog from Hugging Face, a leading AI company focused on NLP and open-source tools.",
                "rating": 8,
                "enabled": true
            },
            {
                "name": "Anthropic Blog",
                "category": "ai",
                "url": "https://www.anthropic.com/blog",
                "selector": "a.group",
                "description": "Blog from Anthropic, an AI safety company working on reliable, interpretable AI systems.",
                "rating": 9,
                "enabled": true
            },
            {
                "name": "NVIDIA AI Blog",
                "category": "ai",
                "url": "https://blogs.nvidia.com/blog/category/deep-learning",
                "selector": "h2.entry-title a",
                "description": "AI and deep learning updates from NVIDIA.",
                "rating": 8,
                "enabled": true
            },
            {
                "name": "Microsoft AI Blog",
                "category": "ai",
                "url": "https://blogs.microsoft.com/ai",
                "selector": "h3.c-heading a",
                "description": "Microsoft's official AI blog covering research and applications.",
                "rating": 8,
                "enabled": true
            },
            {
                "name": "Meta AI Blog",
                "category": "ai",
                "url": "https://ai.facebook.com/blog",
                "selector": ".research-card__title a",
                "description": "AI research and development updates from Meta (Facebook).",
                "rating": 8,
                "enabled": true
            },
            {
                "name": "IBM Research AI",
                "category": "ai",
                "url": "https://research.ibm.com/artificial-intelligence",
                "selector": ".ibm--card__title a",
                "description": "AI research updates from IBM Research.",
                "rating": 7,
                "enabled": true
            },
            {
                "name": "AI Alignment Forum",
                "category": "ai",
                "url": "https://www.alignmentforum.org",
                "selector": ".PostsTitle-root a",
                "description": "Forum focused on AI alignment and safety research.",
                "rating": 8,
                "enabled": true
            },
            {
                "name": "Distill",
                "category": "ai",
                "url": "https://distill.pub",
                "selector": ".post a",
                "description": "Journal dedicated to clear explanations of machine learning concepts.",
                "rating": 9,
                "enabled": true
            },
            {
                "name": "Berkeley Artificial Intelligence Research",
                "category": "ai",
                "url": "https://bair.berkeley.edu/blog",
                "selector": "h3 a",
                "description": "Blog from the Berkeley AI Research Lab.",
                "rating": 8,
                "enabled": true
            },
            {
                "name": "Stanford HAI",
                "category": "ai",
                "url": "https://hai.stanford.edu/news",
                "selector": ".field-content a",
                "description": "News from Stanford's Human-Centered AI Institute.",
                "rating": 8,
                "enabled": true
            },
            {
                "name": "AI Impacts",
                "category": "ai",
                "url": "https://aiimpacts.org",
                "selector": "h2.entry-title a",
                "description": "Research on forecasting AI development and impacts.",
                "rating": 7,
                "enabled": true
            },
            {
                "name": "Arxiv AI Papers",
                "category": "ai",
                "url": "https://arxiv.org/list/cs.AI/recent",
                "selector": "a.list-title",
                "description": "Recent AI research papers from the Arxiv repository.",
                "rating": 9,
                "enabled": true
            },
            {
                "name": "AI Trends",
                "category": "ai",
                "url": "https://www.aitrends.com",
                "selector": "h3.entry-title a",
                "description": "Business-focused AI news and trends.",
                "rating": 7,
                "enabled": true
            },
            {
                "name": "Venture Beat AI",
                "category": "ai",
                "url": "https://venturebeat.com/category/ai",
                "selector": "h2 a",
                "description": "AI news with a focus on business and applications.",
                "rating": 7,
                "enabled": true
            },
            {
                "name": "Wired AI",
                "category": "ai",
                "url": "https://www.wired.com/tag/artificial-intelligence",
                "selector": ".SummaryItemHedLink-ciaMYI",
                "description": "AI coverage from Wired magazine.",
                "rating": 8,
                "enabled": true
            },
            {
                "name": "The Gradient",
                "category": "ai",
                "url": "https://thegradient.pub",
                "selector": "h3 a",
                "description": "Digital publication focused on AI and machine learning.",
                "rating": 8,
                "enabled": true
            },
            {
                "name": "AI Alignment Newsletter",
                "category": "ai",
                "url": "https://rohinshah.com/alignment-newsletter",
                "selector": "h2 a",
                "description": "Newsletter covering AI alignment research.",
                "rating": 8,
                "enabled": true
            },
            {
                "name": "Import AI Newsletter",
                "category": "ai",
                "url": "https://jack-clark.net",
                "selector": ".post-title a",
                "description": "Weekly newsletter about AI developments by Jack Clark.",
                "rating": 8,
                "enabled": true
            },
            {
                "name": "AI Ethics Blog",
                "category": "ai",
                "url": "https://aiethics.princeton.edu/blog",
                "selector": "h2.entry-title a",
                "description": "Blog from Princeton's University Center for Human Values.",
                "rating": 7,
                "enabled": true
            },
            {
                "name": "AI Weirdness",
                "category": "ai",
                "url": "https://aiweirdness.com",
                "selector": "h1.entry-title a",
                "description": "Blog exploring the strange and unexpected behaviors of AI systems.",
                "rating": 7,
                "enabled": true
            },
            {
                "name": "Skynet Today",
                "category": "ai",
                "url": "https://www.skynettoday.com",
                "selector": ".post-card-title a",
                "description": "Accessible perspective on AI news and trends.",
                "rating": 7,
                "enabled": true
            },
            {
                "name": "Lil'Log",
                "category": "ai",
                "url": "https://lilianweng.github.io",
                "selector": ".post-link",
                "description": "Blog on deep learning, reinforcement learning, and NLP by Lilian Weng.",
                "rating": 8,
                "enabled": true
            },
            {
                "name": "AI XPRIZE",
                "category": "ai",
                "url": "https://www.xprize.org/prizes/artificial-intelligence",
                "selector": ".news-item a",
                "description": "Updates on the AI XPRIZE competition.",
                "rating": 7,
                "enabled": true
            },
            {
                "name": "Partnership on AI",
                "category": "ai",
                "url": "https://partnershiponai.org/resources",
                "selector": ".resource-card a",
                "description": "Resources from the Partnership on AI consortium.",
                "rating": 7,
                "enabled": true
            },
            {
                "name": "AI Now Institute",
                "category": "ai",
                "url": "https://ainowinstitute.org/publications",
                "selector": ".publication-title a",
                "description": "Research on the social implications of AI from NYU's AI Now Institute.",
                "rating": 8,
                "enabled": true
            },
            {
                "name": "Element AI Blog",
                "category": "ai",
                "url": "https://www.elementai.com/blog",
                "selector": ".blog-title a",
                "description": "Blog from Element AI, focusing on enterprise AI applications.",
                "rating": 7,
                "enabled": true
            },
            {
                "name": "AI Podcast",
                "category": "ai",
                "url": "https://lexfridman.com/ai",
                "selector": ".entry-title a",
                "description": "Lex Fridman's AI podcast featuring conversations with researchers and practitioners.",
                "rating": 9,
                "enabled": true
            },
            {
                "name": "Machine Learning Mastery",
                "category": "ai",
                "url": "https://machinelearningmastery.com/blog",
                "selector": "h2.entry-title a",
                "description": "Practical tutorials and guides for machine learning.",
                "rating": 7,
                "enabled": true
            },
            {
                "name": "Sebastian Ruder's Blog",
                "category": "ai",
                "url": "https://ruder.io",
                "selector": "h3 a",
                "description": "Blog on NLP and deep learning by Sebastian Ruder.",
                "rating": 8,
                "enabled": true
            },
            {
                "name": "Andrej Karpathy's Blog",
                "category": "ai",
                "url": "https://karpathy.github.io",
                "selector": ".post-link",
                "description": "Blog by Andrej Karpathy, focusing on deep learning and computer vision.",
                "rating": 9,
                "enabled": true
            },
            {
                "name": "Colah's Blog",
                "category": "ai",
                "url": "https://colah.github.io",
                "selector": ".post-title a",
                "description": "Blog by Christopher Olah, explaining neural networks and machine learning concepts.",
                "rating": 9,
                "enabled": true
            },
            {
                "name": "Deeplearning.ai",
                "category": "ai",
                "url": "https://www.deeplearning.ai/blog",
                "selector": ".blog-card a",
                "description": "Blog from Andrew Ng's deeplearning.ai platform.",
                "rating": 8,
                "enabled": true
            },
            {
                "name": "Fast.ai Blog",
                "category": "ai",
                "url": "https://www.fast.ai/blog",
                "selector": "h3 a",
                "description": "Blog from fast.ai, focusing on making deep learning accessible.",
                "rating": 8,
                "enabled": true
            },
            {
                "name": "AI Breakthrough",
                "category": "ai",
                "url": "https://aibreakthrough.org/news",
                "selector": ".news-title a",
                "description": "News on AI breakthroughs and innovations.",
                "rating": 7,
                "enabled": true
            },
            {
                "name": "AI Business",
                "category": "ai",
                "url": "https://aibusiness.com",
                "selector": ".entry-title a",
                "description": "News on AI in business and enterprise applications.",
                "rating": 7,
                "enabled": true
            },
            {
                "name": "AI Time Journal",
                "category": "ai",
                "url": "https://www.aitimejournal.com",
                "selector": "h3.entry-title a",
                "description": "News and resources on AI and machine learning.",
                "rating": 7,
                "enabled": true
            },
            {
                "name": "AI Supremacy",
                "category": "ai",
                "url": "https://aisupremacy.substack.com",
                "selector": ".post-title a",
                "description": "Newsletter covering AI trends and developments.",
                "rating": 7,
                "enabled": true
            },
            {
                "name": "AI Weekly",
                "category": "ai",
                "url": "https://aiweekly.co",
                "selector": ".post-title a",
                "description": "Weekly newsletter on AI developments.",
                "rating": 7,
                "enabled": true
            },
            {
                "name": "The AI Journal",
                "category": "ai",
                "url": "https://aijourn.com",
                "selector": "h2.entry-title a",
                "description": "News and analysis on AI technology and applications.",
                "rating": 7,
                "enabled": true
            },
            {
                "name": "The Algorithm (MIT)",
                "category": "ai",
                "url": "https://www.technologyreview.com/collection/the-algorithm",
                "selector": "h3 a",
                "description": "AI newsletter from MIT Technology Review.",
                "rating": 8,
                "enabled": true
            },
            {
                "name": "AI Researcher",
                "category": "ai",
                "url": "https://www.airesearcher.com",
                "selector": ".post-title a",
                "description": "Updates on AI research papers and developments.",
                "rating": 7,
                "enabled": true
            },
            {
                "name": "AI Ethics Lab",
                "category": "ai",
                "url": "https://aiethicslab.com/blog",
                "selector": "h2.entry-title a",
                "description": "Blog focusing on ethical considerations in AI development.",
                "rating": 7,
                "enabled": true
            },
            {
                "name": "AI Policy Exchange",
                "category": "ai",
                "url": "https://aipolicyexchange.org",
                "selector": ".entry-title a",
                "description": "Platform for AI policy analysis and discussion.",
                "rating": 7,
                "enabled": true
            },
            {
                "name": "AI Governance",
                "category": "ai",
                "url": "https://www.aigovernance.org/blog",
                "selector": ".post-title a",
                "description": "Blog on AI governance and regulation.",
                "rating": 7,
                "enabled": true
            }
        ];
        
        // Read current config
        const config = readConfig();
        
        // Check for duplicates
        const existingUrls = config.sources.map(source => source.url);
        const newSources = aiSources.filter(source => !existingUrls.includes(source.url));
        
        if (newSources.length === 0) {
            return res.json({ success: true, message: 'All AI sources are already imported', importedCount: 0 });
        }
        
        // Add new sources
        config.sources = [...config.sources, ...newSources];
        
        // Save updated config
        const success = writeConfig(config);
        
        if (success) {
            res.json({ 
                success: true, 
                message: `Successfully imported ${newSources.length} AI sources`,
                importedCount: newSources.length
            });
        } else {
            res.status(500).json({ success: false, error: 'Failed to save updated config' });
        }
    } catch (error) {
        console.error('Error importing AI sources:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/settings', (req, res) => {
    try {
        const newConfig = req.body;
        const success = writeConfig(newConfig);
        
        if (success) {
            res.json({ success: true });
        } else {
            res.status(500).json({ success: false, error: 'Failed to write settings' });
        }
    } catch (error) {
        console.error('Error saving settings:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/run-scraper', (req, res) => {
    try {
        console.log('Running news scraper...');
        
        // Create a child process to run the scraper
        const scraperProcess = spawn('node', ['news-scraper.js', '--once'], {
            detached: false
        });
        
        let scraperOutput = '';
        
        // Collect output from the scraper
        scraperProcess.stdout.on('data', (data) => {
            const output = data.toString();
            console.log(`Scraper output: ${output}`);
            scraperOutput += output;
        });
        
        scraperProcess.stderr.on('data', (data) => {
            const error = data.toString();
            console.error(`Scraper error: ${error}`);
            scraperOutput += error;
        });
        
        // Handle scraper completion
        scraperProcess.on('close', (code) => {
            console.log(`Scraper process exited with code ${code}`);
            
            // Read the current news data if it exists
            let newsData = [];
            if (fs.existsSync(NEWS_DATA_FILE)) {
                try {
                    const newsDataStr = fs.readFileSync(NEWS_DATA_FILE, 'utf8');
                    newsData = JSON.parse(newsDataStr);
                } catch (error) {
                    console.error('Error reading news data:', error);
                }
            }
            
            // Generate source stats
            const sourceStats = {};
            const config = readConfig();
            
            config.sources.forEach(source => {
                if (source.enabled !== false) {
                    // Count articles for this source in the news data
                    const count = newsData.filter(article => article.sourceUrl === source.url).length;
                    sourceStats[source.url] = count;
                }
            });
            
            res.json({
                success: code === 0,
                message: code === 0 ? 'Scraper completed successfully' : 'Scraper failed',
                articlesCount: newsData.length,
                sourceStats,
                output: scraperOutput
            });
        });
    } catch (error) {
        console.error('Error running scraper:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/news', (req, res) => {
    try {
        if (fs.existsSync(NEWS_DATA_FILE)) {
            const newsData = fs.readFileSync(NEWS_DATA_FILE, 'utf8');
            res.json(JSON.parse(newsData));
        } else {
            // If no news data exists, return an empty array
            res.json([]);
        }
    } catch (error) {
        console.error('Error reading news data:', error);
        res.status(500).json({ error: 'Failed to read news data' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`Test page: http://localhost:${PORT}/test.html`);
    console.log(`Settings page: http://localhost:${PORT}/naut-settings.html`);
}); 