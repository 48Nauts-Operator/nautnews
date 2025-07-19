const fs = require('fs');
const path = require('path');

// Path to the news data file
const dataFilePath = path.join(__dirname, 'data', 'news-data.json');

// Function to check if an article is a dummy/fallback
function isDummyArticle(article) {
  // Check for future dates (2025)
  if (article.date && article.date.includes('2025')) {
    return true;
  }
  
  // Check for generic summaries that indicate dummy articles
  if (article.summary && (
    article.summary.startsWith("We're") ||
    article.summary.startsWith("Today we're") ||
    article.summary.startsWith("Introducing") ||
    article.summary.startsWith("Our") ||
    article.summary.startsWith("Article from")
  )) {
    return true;
  }
  
  // Check for specific dummy article URLs
  const dummyUrlPatterns = [
    'alphafold-3',
    'gemini-1-5-pro',
    'introducing-gpt4o',
    'ai-funding-q1-2025',
    'ai-governance-landscape',
    'ai-environmental-impact',
    'genie',
    'medgemini',
    'red-teaming',
    'eu-ai-act-enforcement'
  ];
  
  if (article.url && dummyUrlPatterns.some(pattern => article.url.includes(pattern))) {
    return true;
  }
  
  return false;
}

// Main function to remove dummy articles
function removeDummyArticles() {
  try {
    // Read the current news data
    const rawData = fs.readFileSync(dataFilePath, 'utf8');
    const newsData = JSON.parse(rawData);
    
    console.log(`Total articles before filtering: ${newsData.length}`);
    
    // Filter out dummy articles
    const filteredData = newsData.filter(article => !isDummyArticle(article));
    
    console.log(`Total articles after filtering: ${filteredData.length}`);
    console.log(`Removed ${newsData.length - filteredData.length} dummy articles`);
    
    // Write the filtered data back to the file
    fs.writeFileSync(dataFilePath, JSON.stringify(filteredData, null, 2), 'utf8');
    console.log(`Updated news data saved to ${dataFilePath}`);
  } catch (error) {
    console.error('Error processing news data:', error);
  }
}

// Run the function
removeDummyArticles(); 