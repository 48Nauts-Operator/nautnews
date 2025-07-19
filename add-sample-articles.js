const fs = require('fs');
const path = require('path');

// Path to the news data file
const dataFilePath = path.join(__dirname, 'data', 'news-data.json');

// Sample articles for different categories
const sampleArticles = [
  // Hacker News articles
  {
    "title": "Introducing the New Rust Memory Model",
    "url": "https://github.com/rust-lang/rfcs/pull/3346",
    "summary": "The Rust team has proposed a new memory model that aims to provide stronger guarantees for concurrent code while maintaining performance. This RFC details the formal specification and implications for systems programming.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80",
    "sourceName": "Hacker News",
    "sourceUrl": "https://news.ycombinator.com",
    "category": "hacker-news"
  },
  {
    "title": "WebAssembly 2.0 Specification Released",
    "url": "https://webassembly.github.io/spec/core/",
    "summary": "The W3C WebAssembly Working Group has finalized the WebAssembly 2.0 specification, introducing garbage collection, exception handling, and improved JavaScript integration. This marks a significant milestone for web performance.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    "sourceName": "The Hacker News",
    "sourceUrl": "https://thehackernews.com",
    "category": "hacker-news"
  },
  {
    "title": "Critical Vulnerability Found in Popular DNS Server Software",
    "url": "https://www.darkreading.com/vulnerabilities-threats/critical-dns-vulnerability",
    "summary": "Security researchers have discovered a critical remote code execution vulnerability in widely-used DNS server software that could allow attackers to take control of affected systems. Patches are available and immediate updates are recommended.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1563206767-5b18f218e8de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    "sourceName": "Dark Reading",
    "sourceUrl": "https://www.darkreading.com",
    "category": "hacker-news"
  },
  {
    "title": "New Zero-Day Exploit Targets Major Browser Engines",
    "url": "https://threatpost.com/zero-day-browser-exploit",
    "summary": "A sophisticated zero-day exploit has been discovered in the wild targeting major browser engines. The vulnerability allows attackers to bypass security sandboxes and execute arbitrary code. Browser vendors are rushing to release patches.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "sourceName": "Threatpost",
    "sourceUrl": "https://threatpost.com",
    "category": "hacker-news"
  },
  {
    "title": "Linux Kernel 6.5 Released with Major Performance Improvements",
    "url": "https://www.bleepingcomputer.com/linux-kernel-6-5",
    "summary": "The Linux kernel 6.5 has been released with significant performance improvements, including enhanced CPU scheduling, reduced memory latency, and better power management. The update also includes new hardware support and security features.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1629654297299-c8506221ca97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    "sourceName": "Bleeping Computer",
    "sourceUrl": "https://www.bleepingcomputer.com",
    "category": "hacker-news"
  },
  
  // AI articles
  {
    "title": "DeepMind's AlphaCode 2 Outperforms 85% of Professional Programmers",
    "url": "https://deepmind.com/blog/alphacode-2",
    "summary": "DeepMind has announced AlphaCode 2, an AI system that can solve complex programming challenges at a level that outperforms 85% of professional programmers in competitive programming contests. The system demonstrates significant advances in reasoning and problem-solving capabilities.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80",
    "sourceName": "DeepMind Blog",
    "sourceUrl": "https://deepmind.com/blog",
    "category": "ai"
  },
  {
    "title": "OpenAI Releases GPT-5 with Enhanced Reasoning Capabilities",
    "url": "https://openai.com/blog/gpt-5",
    "summary": "OpenAI has released GPT-5, featuring significant improvements in reasoning, factual accuracy, and multimodal understanding. The new model demonstrates enhanced capabilities in complex problem-solving, code generation, and creative tasks while reducing hallucinations.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1677442135136-760c813dce26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80",
    "sourceName": "OpenAI Blog",
    "sourceUrl": "https://openai.com/blog",
    "category": "ai"
  },
  {
    "title": "Google Introduces Gemini Pro 2 with 1 Million Token Context Window",
    "url": "https://ai.googleblog.com/gemini-pro-2",
    "summary": "Google has unveiled Gemini Pro 2, featuring a groundbreaking 1 million token context window that allows the model to process and reason over extremely long inputs, including entire codebases, books, or hours of transcribed audio in a single prompt.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1738&q=80",
    "sourceName": "Google AI Blog",
    "sourceUrl": "https://ai.googleblog.com",
    "category": "ai"
  },
  {
    "title": "AI Regulation: EU AI Act Enforcement Begins",
    "url": "https://artificialintelligence-news.com/eu-ai-act-enforcement",
    "summary": "The European Union's AI Act has officially entered its enforcement phase, with companies now required to comply with its comprehensive regulatory framework. Organizations developing or deploying high-risk AI systems face strict requirements for risk assessment, documentation, and human oversight.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    "sourceName": "AI News",
    "sourceUrl": "https://artificialintelligence-news.com",
    "category": "ai"
  },
  {
    "title": "MIT Researchers Develop Neural Network That Requires 90% Less Energy",
    "url": "https://www.technologyreview.com/energy-efficient-neural-networks",
    "summary": "MIT researchers have developed a new neural network architecture that requires 90% less energy to run while maintaining comparable performance to traditional models. This breakthrough could enable AI deployment on resource-constrained devices and reduce the environmental impact of large-scale AI systems.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1589254065878-42c9da997008?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    "sourceName": "MIT Technology Review - AI",
    "sourceUrl": "https://www.technologyreview.com/topic/artificial-intelligence",
    "category": "ai"
  },
  
  // Brain Health articles
  {
    "title": "New Study Links Mediterranean Diet to Improved Cognitive Function",
    "url": "https://www.brainandlife.org/mediterranean-diet-cognitive-function",
    "summary": "A large-scale study published in the Journal of Neuroscience has found that adherence to a Mediterranean diet is associated with improved cognitive function and reduced risk of cognitive decline in older adults. The research followed participants over a 10-year period.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "sourceName": "Brain & Life",
    "sourceUrl": "https://www.brainandlife.org",
    "category": "brain-health"
  },
  {
    "title": "Regular Exercise Shown to Increase Brain Volume in Aging Adults",
    "url": "https://healthybrains.org/exercise-brain-volume",
    "summary": "A new study from the Cleveland Clinic has demonstrated that regular aerobic exercise is associated with increased brain volume in aging adults, particularly in regions associated with memory and learning. The research suggests that exercise may be a key intervention for preventing age-related cognitive decline.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "sourceName": "Healthy Brains by Cleveland Clinic",
    "sourceUrl": "https://healthybrains.org",
    "category": "brain-health"
  },
  {
    "title": "Blood Test Can Detect Alzheimer's Disease Years Before Symptoms Appear",
    "url": "https://www.alz.org/blood-test-early-detection",
    "summary": "Researchers have developed a blood test that can detect biomarkers for Alzheimer's disease up to 15 years before symptoms appear. The test measures levels of specific proteins in the blood that are associated with the development of amyloid plaques and tau tangles in the brain.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "sourceName": "Alzheimer's Association",
    "sourceUrl": "https://www.alz.org",
    "category": "brain-health"
  },
  {
    "title": "Sleep Quality Directly Impacts Brain's Ability to Clear Toxins",
    "url": "https://www.sleepfoundation.org/brain-toxin-clearance",
    "summary": "New research has revealed that sleep quality directly impacts the brain's glymphatic system, which is responsible for clearing toxins and waste products. Poor sleep quality can impair this system, potentially contributing to neurodegenerative diseases like Alzheimer's and Parkinson's.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2060&q=80",
    "sourceName": "Sleep Foundation",
    "sourceUrl": "https://www.sleepfoundation.org",
    "category": "brain-health"
  },
  {
    "title": "Breakthrough in Understanding How Stress Affects Brain Health",
    "url": "https://neurosciencenews.com/stress-brain-health",
    "summary": "Scientists have made a breakthrough in understanding the molecular mechanisms by which chronic stress damages brain cells and accelerates cognitive aging. The research identifies specific pathways that could be targeted with new treatments to protect the brain from stress-related damage.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1490131784822-b4626a8ec96a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "sourceName": "Neuroscience News",
    "sourceUrl": "https://neurosciencenews.com",
    "category": "brain-health"
  },
  
  // Switzerland articles
  {
    "title": "Switzerland Tops Global Innovation Index for 12th Consecutive Year",
    "url": "https://www.swissinfo.ch/eng/switzerland-innovation-index",
    "summary": "Switzerland has maintained its position at the top of the Global Innovation Index for the 12th consecutive year, with particularly strong performance in R&D investment, patent applications, and knowledge-intensive employment. The country's robust innovation ecosystem continues to attract global talent and investment.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "sourceName": "SWI swissinfo.ch",
    "sourceUrl": "https://www.swissinfo.ch/eng",
    "category": "switzerland"
  },
  {
    "title": "Swiss Parliament Approves Major Climate Protection Package",
    "url": "https://www.thelocal.ch/swiss-climate-protection-package",
    "summary": "The Swiss Parliament has approved a comprehensive climate protection package that aims to achieve carbon neutrality by 2040. The legislation includes significant investments in renewable energy, building renovations, and public transportation, along with new carbon pricing mechanisms.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "sourceName": "The Local Switzerland",
    "sourceUrl": "https://www.thelocal.ch",
    "category": "switzerland"
  },
  {
    "title": "Swiss National Bank Introduces Digital Franc Pilot Program",
    "url": "https://www.bloomberg.com/swiss-digital-franc",
    "summary": "The Swiss National Bank has launched a pilot program for a digital version of the Swiss franc, becoming one of the first major central banks to test a central bank digital currency (CBDC) in real-world conditions. The pilot will involve selected financial institutions and is expected to run for 12 months.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1621155346337-1d19476ba7d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "sourceName": "Bloomberg",
    "sourceUrl": "https://www.bloomberg.com",
    "category": "switzerland"
  },
  {
    "title": "Switzerland Revises Immigration Policies to Attract More Skilled Workers",
    "url": "https://www.thelocal.ch/immigration-skilled-workers",
    "summary": "Switzerland has announced revisions to its immigration policies aimed at attracting more skilled workers from outside the EU/EFTA area. The changes include streamlined visa processes for graduates of top global universities, expanded quota allocations for specialized sectors, and new pathways for entrepreneurs and startup founders.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80",
    "sourceName": "The Local Switzerland",
    "sourceUrl": "https://www.thelocal.ch",
    "category": "switzerland"
  },
  {
    "title": "CERN Announces Major Breakthrough in Particle Physics Research",
    "url": "https://www.swissinfo.ch/eng/cern-breakthrough",
    "summary": "CERN, the European Organization for Nuclear Research based in Geneva, has announced a major breakthrough in particle physics research. Scientists working with the Large Hadron Collider have observed a previously theoretical particle interaction that could help explain fundamental questions about the universe's formation.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1628595351029-c2bf17511435?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
    "sourceName": "SWI swissinfo.ch",
    "sourceUrl": "https://www.swissinfo.ch/eng",
    "category": "switzerland"
  },
  
  // Finance articles
  {
    "title": "Federal Reserve Signals Shift in Monetary Policy Approach",
    "url": "https://www.bloomberg.com/fed-monetary-policy",
    "summary": "The Federal Reserve has signaled a significant shift in its monetary policy approach, indicating a move toward a more flexible inflation targeting framework. This change could allow inflation to run moderately above the 2% target for periods of time to compensate for previous shortfalls.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "sourceName": "Bloomberg",
    "sourceUrl": "https://www.bloomberg.com",
    "category": "finance"
  },
  {
    "title": "Global Banking Regulators Propose New Crypto Asset Rules",
    "url": "https://www.ft.com/crypto-asset-rules",
    "summary": "The Basel Committee on Banking Supervision has proposed new rules for banks' exposure to crypto assets, dividing them into two groups with different capital requirements. The proposal aims to balance innovation with financial stability concerns as traditional banks increasingly engage with digital assets.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    "sourceName": "Financial Times",
    "sourceUrl": "https://www.ft.com",
    "category": "finance"
  },
  {
    "title": "ESG Investing Reaches Record $35 Trillion in Assets Under Management",
    "url": "https://www.bloomberg.com/esg-investing-record",
    "summary": "Environmental, Social, and Governance (ESG) investing has reached a record $35 trillion in assets under management globally, according to a new report. The growth represents a 55% increase over the past five years, with climate change and social justice concerns driving investor demand.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    "sourceName": "Bloomberg",
    "sourceUrl": "https://www.bloomberg.com",
    "category": "finance"
  },
  {
    "title": "Central Banks Accelerate Development of Digital Currencies",
    "url": "https://www.ft.com/central-bank-digital-currencies",
    "summary": "Central banks around the world are accelerating the development of digital currencies, with over 80% now actively researching or piloting central bank digital currencies (CBDCs). China's digital yuan leads the major economies, while the ECB has announced a two-year investigation phase for a digital euro.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    "sourceName": "Financial Times",
    "sourceUrl": "https://www.ft.com",
    "category": "finance"
  },
  {
    "title": "Global Financial Regulators Propose New Climate Risk Disclosure Standards",
    "url": "https://www.bloomberg.com/climate-risk-disclosure",
    "summary": "Global financial regulators have proposed new standards for climate risk disclosure, aiming to create a consistent framework for companies to report their exposure to climate-related financial risks. The standards would require detailed reporting on transition plans, emissions targets, and physical risk assessments.",
    "date": new Date().toISOString(),
    "imageUrl": "https://images.unsplash.com/photo-1604594849809-dfedbc827105?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "sourceName": "Bloomberg",
    "sourceUrl": "https://www.bloomberg.com",
    "category": "finance"
  }
];

// Function to add sample articles to the news data file
function addSampleArticles() {
  try {
    // Create the data directory if it doesn't exist
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Write the sample articles to the news data file
    fs.writeFileSync(dataFilePath, JSON.stringify(sampleArticles, null, 2), 'utf8');
    
    console.log(`Added ${sampleArticles.length} sample articles to the news data file.`);
    console.log(`Articles by category:`);
    
    // Count articles by category
    const categoryCount = {};
    sampleArticles.forEach(article => {
      if (categoryCount[article.category]) {
        categoryCount[article.category]++;
      } else {
        categoryCount[article.category] = 1;
      }
    });
    
    // Display article count by category
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`- ${category}: ${count} articles`);
    });
  } catch (error) {
    console.error('Error adding sample articles:', error);
  }
}

// Run the function
addSampleArticles(); 