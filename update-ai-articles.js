const fs = require('fs');
const path = require('path');

// Path to the news data file
const dataFilePath = path.join(__dirname, 'data', 'news-data.json');

// New realistic AI articles
const newAiArticles = [
  {
    "title": "Meta Releases Llama 3 as Open Source with 70B Parameters",
    "url": "https://ai.meta.com/blog/meta-llama-3/",
    "summary": "Meta has released Llama 3, its latest large language model, as open source. The new model comes in 8B and 70B parameter versions and shows significant improvements in reasoning, coding, and multilingual capabilities compared to previous versions.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80",
    "sourceName": "Meta AI",
    "sourceUrl": "https://ai.meta.com/blog/",
    "category": "ai"
  },
  {
    "title": "OpenAI Introduces GPT-4o with Multimodal Capabilities",
    "url": "https://openai.com/blog/gpt-4o",
    "summary": "OpenAI has unveiled GPT-4o ('o' for omni), a multimodal model that processes text, images, and audio in real-time. The model demonstrates significant improvements in reasoning across modalities and is being rolled out to ChatGPT Plus subscribers.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1677442135136-760c813dce26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80",
    "sourceName": "OpenAI Blog",
    "sourceUrl": "https://openai.com/blog",
    "category": "ai"
  },
  {
    "title": "Google Introduces Gemini 1.5 Pro with 1M Token Context Window",
    "url": "https://blog.google/technology/ai/google-gemini-1-5-pro/",
    "summary": "Google has released Gemini 1.5 Pro, featuring a groundbreaking 1 million token context window that allows the model to process and reason over extremely long inputs, including entire codebases, books, or hours of video in a single prompt.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1738&q=80",
    "sourceName": "Google AI Blog",
    "sourceUrl": "https://blog.google/technology/ai/",
    "category": "ai"
  },
  {
    "title": "EU AI Act Officially Enters Into Force",
    "url": "https://digital-strategy.ec.europa.eu/en/policies/european-approach-artificial-intelligence",
    "summary": "The European Union's AI Act has officially entered into force, establishing the world's first comprehensive regulatory framework for artificial intelligence. The legislation introduces a risk-based approach with stricter requirements for high-risk AI systems and bans on certain AI practices.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    "sourceName": "European Commission",
    "sourceUrl": "https://digital-strategy.ec.europa.eu/",
    "category": "ai"
  },
  {
    "title": "MIT Researchers Develop Energy-Efficient Neural Network Architecture",
    "url": "https://news.mit.edu/2023/energy-efficient-neural-networks",
    "summary": "MIT researchers have developed a new neural network architecture that requires significantly less energy to run while maintaining comparable performance to traditional models. This breakthrough could enable AI deployment on resource-constrained devices and reduce the environmental impact of large-scale AI systems.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1589254065878-42c9da997008?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    "sourceName": "MIT News",
    "sourceUrl": "https://news.mit.edu/",
    "category": "ai"
  },
  {
    "title": "Anthropic Releases Claude 3 Family of AI Assistants",
    "url": "https://www.anthropic.com/news/claude-3-family",
    "summary": "Anthropic has released the Claude 3 family of AI assistants, including Opus, Sonnet, and Haiku models. Claude 3 Opus, the most capable model, outperforms previous versions on benchmarks for reasoning, math, coding, and knowledge, while maintaining Anthropic's focus on safety and helpfulness.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80",
    "sourceName": "Anthropic",
    "sourceUrl": "https://www.anthropic.com/news",
    "category": "ai"
  },
  {
    "title": "DeepMind's AlphaFold 3 Predicts Protein-Ligand Interactions",
    "url": "https://deepmind.google/discover/blog/alphafold-3-advances-the-era-of-ai-enabled-molecular-biology/",
    "summary": "DeepMind has announced AlphaFold 3, a major advancement in their protein structure prediction system that can now model interactions between proteins and small molecules (ligands). This breakthrough has significant implications for drug discovery and understanding biological mechanisms.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    "sourceName": "DeepMind",
    "sourceUrl": "https://deepmind.google/discover/blog/",
    "category": "ai"
  }
];

// Function to update AI articles in the news data file
function updateAiArticles() {
  try {
    // Read the current news data
    const rawData = fs.readFileSync(dataFilePath, 'utf8');
    const newsData = JSON.parse(rawData);
    
    // Filter out existing AI articles
    const nonAiArticles = newsData.filter(article => article.category !== 'ai');
    
    // Add the new AI articles
    const updatedData = [...nonAiArticles, ...newAiArticles];
    
    // Write the updated data back to the file
    fs.writeFileSync(dataFilePath, JSON.stringify(updatedData, null, 2), 'utf8');
    
    console.log(`Updated news data with ${newAiArticles.length} realistic AI articles.`);
    console.log(`Total articles in news data: ${updatedData.length}`);
    
    // Count articles by category
    const categoryCount = {};
    updatedData.forEach(article => {
      if (categoryCount[article.category]) {
        categoryCount[article.category]++;
      } else {
        categoryCount[article.category] = 1;
      }
    });
    
    // Display article count by category
    console.log('\nArticles by category:');
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`- ${category}: ${count} articles`);
    });
  } catch (error) {
    console.error('Error updating AI articles:', error);
  }
}

// Run the function
updateAiArticles(); 