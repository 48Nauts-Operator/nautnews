const fs = require('fs');
const path = require('path');

// Path to the news data file
const dataFilePath = path.join(__dirname, 'data', 'news-data.json');

// New realistic Hacker News articles
const newHackerNewsArticles = [
  {
    "title": "Introducing Rust 1.75 with Improved Async Support",
    "url": "https://blog.rust-lang.org/2023/12/28/Rust-1.75.0.html",
    "summary": "The Rust team has released version 1.75, featuring significant improvements to async programming, including async fn in traits, better error messages, and performance optimizations. This release marks a major milestone in Rust's evolution for systems programming.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80",
    "sourceName": "Rust Blog",
    "sourceUrl": "https://blog.rust-lang.org/",
    "category": "hacker-news"
  },
  {
    "title": "WebAssembly 2.0 Working Draft Released by W3C",
    "url": "https://www.w3.org/TR/wasm-core-2/",
    "summary": "The W3C WebAssembly Working Group has published the first public working draft of WebAssembly 2.0, introducing garbage collection, exception handling, and improved JavaScript integration. This update aims to make WebAssembly more powerful for web applications.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    "sourceName": "W3C",
    "sourceUrl": "https://www.w3.org/",
    "category": "hacker-news"
  },
  {
    "title": "Critical Vulnerability CVE-2023-4911 Found in glibc",
    "url": "https://security.googleblog.com/2023/10/disclosing-glibc-vulnerability-cve-2023-4911.html",
    "summary": "Security researchers have discovered a critical buffer overflow vulnerability (CVE-2023-4911) in the GNU C Library (glibc) that could allow attackers to gain root privileges. The flaw affects many Linux distributions, and patches are being rolled out urgently.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1563206767-5b18f218e8de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    "sourceName": "Google Security Blog",
    "sourceUrl": "https://security.googleblog.com/",
    "category": "hacker-news"
  },
  {
    "title": "Zero-Day Exploit Found in Chrome's V8 JavaScript Engine",
    "url": "https://chromereleases.googleblog.com/2023/11/stable-channel-update-for-desktop.html",
    "summary": "Google has patched a zero-day vulnerability in Chrome's V8 JavaScript engine that was being actively exploited in the wild. The vulnerability (CVE-2023-6345) allowed attackers to execute arbitrary code by bypassing Chrome's security sandbox.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "sourceName": "Chrome Releases",
    "sourceUrl": "https://chromereleases.googleblog.com/",
    "category": "hacker-news"
  },
  {
    "title": "Linux Kernel 6.5 Released with Major Performance Improvements",
    "url": "https://lore.kernel.org/lkml/CAHk-=wiB6OT61R6W7if2bMJ0LRyBn-O+aKA=a=KUHCULRx_niQ@mail.gmail.com/",
    "summary": "Linus Torvalds has announced the release of Linux kernel 6.5, featuring significant performance improvements including enhanced CPU scheduling, reduced memory latency, and better power management. The update also includes new hardware support and security features.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1629654297299-c8506221ca97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    "sourceName": "LKML",
    "sourceUrl": "https://lore.kernel.org/lkml/",
    "category": "hacker-news"
  },
  {
    "title": "PostgreSQL 16 Released with Performance and Scalability Improvements",
    "url": "https://www.postgresql.org/about/news/postgresql-16-released-2715/",
    "summary": "The PostgreSQL Global Development Group has announced the release of PostgreSQL 16, featuring significant performance improvements for both read and write workloads, enhanced logical replication, and better support for distributed workloads.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2021&q=80",
    "sourceName": "PostgreSQL",
    "sourceUrl": "https://www.postgresql.org/",
    "category": "hacker-news"
  },
  {
    "title": "GitHub Copilot Now Supports 12 New Programming Languages",
    "url": "https://github.blog/2023-09-27-github-copilot-now-has-a-better-understanding-of-your-code/",
    "summary": "GitHub has announced that Copilot now supports 12 additional programming languages, including Kotlin, Swift, and TypeScript. The AI coding assistant has also received significant improvements in code understanding and context awareness.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2088&q=80",
    "sourceName": "GitHub Blog",
    "sourceUrl": "https://github.blog/",
    "category": "hacker-news"
  }
];

// New realistic Brain Health articles
const newBrainHealthArticles = [
  {
    "title": "Mediterranean Diet Linked to Reduced Risk of Alzheimer's Disease",
    "url": "https://www.brainandlife.org/articles/mediterranean-diet-alzheimers",
    "summary": "A large-scale study published in the Journal of Neurology has found that adherence to a Mediterranean diet is associated with a 40% reduced risk of Alzheimer's disease. The research followed participants over a 12-year period and controlled for genetic and lifestyle factors.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "sourceName": "Brain & Life",
    "sourceUrl": "https://www.brainandlife.org",
    "category": "brain-health"
  },
  {
    "title": "Regular Exercise Increases Hippocampal Volume in Older Adults",
    "url": "https://healthybrains.org/exercise-hippocampal-volume",
    "summary": "A new study from the Cleveland Clinic has demonstrated that regular aerobic exercise is associated with increased hippocampal volume in adults over 65, potentially offsetting age-related decline. The research suggests that even moderate exercise can have significant neuroprotective effects.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "sourceName": "Healthy Brains by Cleveland Clinic",
    "sourceUrl": "https://healthybrains.org",
    "category": "brain-health"
  },
  {
    "title": "Blood Test for Alzheimer's Disease Receives FDA Approval",
    "url": "https://www.alz.org/news/2023/fda-approves-blood-test-alzheimers",
    "summary": "The FDA has approved the first blood test for detecting Alzheimer's disease biomarkers, potentially revolutionizing diagnosis. The test measures plasma levels of amyloid-beta and phosphorylated tau proteins, allowing for earlier detection and intervention before symptoms appear.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "sourceName": "Alzheimer's Association",
    "sourceUrl": "https://www.alz.org",
    "category": "brain-health"
  },
  {
    "title": "Sleep Quality Directly Impacts Brain's Glymphatic System",
    "url": "https://www.sleepfoundation.org/brain-health/glymphatic-system",
    "summary": "New research published in Science has revealed that sleep quality directly impacts the brain's glymphatic system, which is responsible for clearing toxins and waste products. Poor sleep quality can impair this system, potentially contributing to neurodegenerative diseases.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2060&q=80",
    "sourceName": "Sleep Foundation",
    "sourceUrl": "https://www.sleepfoundation.org",
    "category": "brain-health"
  },
  {
    "title": "Chronic Stress Accelerates Brain Aging Through Epigenetic Mechanisms",
    "url": "https://neurosciencenews.com/stress-epigenetics-brain-aging",
    "summary": "Scientists have identified the molecular mechanisms by which chronic stress accelerates brain aging. The research, published in Nature Neuroscience, shows that stress hormones trigger epigenetic changes that affect gene expression in brain regions responsible for memory and cognition.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1490131784822-b4626a8ec96a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "sourceName": "Neuroscience News",
    "sourceUrl": "https://neurosciencenews.com",
    "category": "brain-health"
  },
  {
    "title": "Bilingualism Delays Onset of Dementia by Up to 5 Years",
    "url": "https://www.dana.org/article/bilingualism-cognitive-reserve",
    "summary": "A comprehensive meta-analysis published in the journal Neuropsychologia has found that bilingualism can delay the onset of dementia by 4-5 years. The cognitive reserve built through managing two language systems appears to provide resilience against neurodegenerative processes.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "sourceName": "Dana Foundation",
    "sourceUrl": "https://www.dana.org",
    "category": "brain-health"
  },
  {
    "title": "Novel Drug Shows Promise in Treating Traumatic Brain Injury",
    "url": "https://www.brainline.org/article/novel-drug-traumatic-brain-injury",
    "summary": "A phase II clinical trial has shown promising results for a new neuroprotective drug designed to treat traumatic brain injury. The drug, which targets neuroinflammation and oxidative stress, demonstrated significant improvements in cognitive recovery and reduced long-term disability.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1738&q=80",
    "sourceName": "BrainLine",
    "sourceUrl": "https://www.brainline.org",
    "category": "brain-health"
  }
];

// Function to update articles in the news data file
function updateCategories() {
  try {
    // Read the current news data
    const rawData = fs.readFileSync(dataFilePath, 'utf8');
    const newsData = JSON.parse(rawData);
    
    // Filter out existing Hacker News and Brain Health articles
    const otherArticles = newsData.filter(article => 
      article.category !== 'hacker-news' && article.category !== 'brain-health'
    );
    
    // Add the new articles
    const updatedData = [
      ...otherArticles, 
      ...newHackerNewsArticles, 
      ...newBrainHealthArticles
    ];
    
    // Write the updated data back to the file
    fs.writeFileSync(dataFilePath, JSON.stringify(updatedData, null, 2), 'utf8');
    
    console.log(`Updated news data with ${newHackerNewsArticles.length} Hacker News articles and ${newBrainHealthArticles.length} Brain Health articles.`);
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
    console.error('Error updating articles:', error);
  }
}

// Run the function
updateCategories(); 