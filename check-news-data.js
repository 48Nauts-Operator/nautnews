const fs = require('fs');
const path = require('path');

// Path to the news data file
const dataFilePath = path.join(__dirname, 'data', 'news-data.json');

// Function to check the news data file
function checkNewsData() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf8');
      const newsData = JSON.parse(data);
      
      console.log(`News data file exists with ${newsData.length} articles.`);
      
      if (newsData.length > 0) {
        // Group articles by source
        const sourceCount = {};
        const categoryCount = {};
        
        newsData.forEach(article => {
          // Count by source
          if (sourceCount[article.sourceName]) {
            sourceCount[article.sourceName]++;
          } else {
            sourceCount[article.sourceName] = 1;
          }
          
          // Count by category
          if (categoryCount[article.category]) {
            categoryCount[article.category]++;
          } else {
            categoryCount[article.category] = 1;
          }
        });
        
        console.log('\nArticles by source:');
        Object.entries(sourceCount)
          .sort((a, b) => b[1] - a[1])
          .forEach(([source, count]) => {
            console.log(`- ${source}: ${count} articles`);
          });
        
        console.log('\nArticles by category:');
        Object.entries(categoryCount)
          .sort((a, b) => b[1] - a[1])
          .forEach(([category, count]) => {
            console.log(`- ${category}: ${count} articles`);
          });
        
        // Show the first 5 article titles
        console.log('\nSample articles:');
        newsData.slice(0, 5).forEach((article, index) => {
          console.log(`${index + 1}. ${article.title} (${article.sourceName})`);
        });
      }
    } else {
      console.log('News data file does not exist yet.');
    }
  } catch (error) {
    console.error('Error checking news data:', error);
  }
}

// Run the check immediately
checkNewsData();

// Schedule to run every 10 seconds
const intervalId = setInterval(checkNewsData, 10000);

// Stop after 5 minutes (300 seconds)
setTimeout(() => {
  clearInterval(intervalId);
  console.log('Check completed after 5 minutes.');
  process.exit(0);
}, 300000);

console.log('Checking news data every 10 seconds for up to 5 minutes...');
console.log('Press Ctrl+C to stop.'); 