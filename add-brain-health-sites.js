const fs = require('fs');
const path = require('path');

// Path to the scraper config file
const configFilePath = path.join(__dirname, 'scraper-config.json');

// List of brain health websites to add
const brainHealthSites = [
  {
    "name": "Brain & Life",
    "url": "https://www.brainandlife.org",
    "enabled": true,
    "selector": "h2.article-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Offers articles and resources on brain health from the American Academy of Neurology.",
    "rating": 9
  },
  {
    "name": "Healthy Brains by Cleveland Clinic",
    "url": "https://healthybrains.org",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Focuses on six pillars of brain health (diet, exercise, sleep, etc.) with practical advice.",
    "rating": 8
  },
  {
    "name": "Alzheimer's Association",
    "url": "https://www.alz.org",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Comprehensive resource on brain aging, dementia, and prevention strategies.",
    "rating": 10
  },
  {
    "name": "Center for BrainHealth",
    "url": "https://centerforbrainhealth.org",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Research-based tips to enhance cognitive function and brain resilience.",
    "rating": 9
  },
  {
    "name": "BrainHQ",
    "url": "https://www.brainhq.com",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Brain training tools and articles on cognitive health.",
    "rating": 8
  },
  {
    "name": "National Institute on Aging",
    "url": "https://www.nia.nih.gov/health/brain-health",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Brain health resources focused on aging and cognitive decline.",
    "rating": 9
  },
  {
    "name": "Harvard Health Publishing",
    "url": "https://www.health.harvard.edu",
    "enabled": true,
    "selector": "h3.article-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Evidence-based articles on brain health and wellness.",
    "rating": 8
  },
  {
    "name": "Mayo Clinic Brain Health",
    "url": "https://www.mayoclinic.org/healthy-lifestyle/healthy-aging/in-depth/memory-loss",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Practical advice on maintaining brain function from a top medical institution.",
    "rating": 9
  },
  {
    "name": "WebMD Brain & Nervous System",
    "url": "https://www.webmd.com/brain",
    "enabled": true,
    "selector": "h3.article-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Consumer-friendly brain health info and tips.",
    "rating": 7
  },
  {
    "name": "AARP Staying Sharp",
    "url": "https://stayingsharp.aarp.org",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Brain health resources for older adults, including games and advice.",
    "rating": 7
  },
  {
    "name": "American Brain Foundation",
    "url": "https://www.americanbrainfoundation.org",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Promotes brain health awareness and research funding.",
    "rating": 8
  },
  {
    "name": "Verywell Mind",
    "url": "https://www.verywellmind.com",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Covers brain health within mental wellness topics.",
    "rating": 8
  },
  {
    "name": "Mindful",
    "url": "https://www.mindful.org",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Focuses on mindfulness and its impact on brain health.",
    "rating": 7
  },
  {
    "name": "Brain Injury Association of America",
    "url": "https://www.biausa.org",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Resources on brain injury prevention and recovery.",
    "rating": 7
  },
  {
    "name": "SharpBrains",
    "url": "https://sharpbrains.com",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "News and tools for brain fitness and cognitive health.",
    "rating": 7
  },
  {
    "name": "Psychology Today Brain Health",
    "url": "https://www.psychologytoday.com/us/basics/brain",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Articles on brain health tied to psychology and behavior.",
    "rating": 8
  },
  {
    "name": "Healthline Brain Health",
    "url": "https://www.healthline.com/health/brain-health",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Accessible brain health tips and medical insights.",
    "rating": 7
  },
  {
    "name": "Johns Hopkins Brain Health",
    "url": "https://www.hopkinsmedicine.org/health/conditions-and-diseases/brain-health",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Research-backed brain health advice from a top institution.",
    "rating": 8
  },
  {
    "name": "Be Brain Fit",
    "url": "https://bebrainfit.com",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Practical strategies for improving brain function.",
    "rating": 7
  },
  {
    "name": "Mental Health America",
    "url": "https://www.mhanational.org",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Brain health resources tied to mental well-being.",
    "rating": 7
  },
  {
    "name": "Dana Foundation",
    "url": "https://www.dana.org",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Public education on brain health and neuroscience.",
    "rating": 8
  },
  {
    "name": "Neurology Advisor",
    "url": "https://www.neurologyadvisor.com",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Brain health news for professionals and the public.",
    "rating": 7
  },
  {
    "name": "Prevention Brain Health",
    "url": "https://www.prevention.com/health/brain-health",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Lifestyle tips for brain health and longevity.",
    "rating": 7
  },
  {
    "name": "BrainLine",
    "url": "https://www.brainline.org",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Focuses on traumatic brain injury and recovery.",
    "rating": 7
  },
  {
    "name": "National Multiple Sclerosis Society",
    "url": "https://www.nationalmssociety.org",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Brain health info related to MS and neurological conditions.",
    "rating": 8
  },
  {
    "name": "Parkinson's Foundation",
    "url": "https://www.parkinson.org",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Brain health resources for Parkinson's prevention and care.",
    "rating": 8
  },
  {
    "name": "Stroke Association",
    "url": "https://www.stroke.org",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Brain health tied to stroke prevention and recovery.",
    "rating": 7
  },
  {
    "name": "Epilepsy Foundation",
    "url": "https://www.epilepsy.com",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Brain health resources for epilepsy management.",
    "rating": 7
  },
  {
    "name": "Migraine Research Foundation",
    "url": "https://migraineresearchfoundation.org",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Brain health insights related to migraines.",
    "rating": 7
  },
  {
    "name": "Sleep Foundation",
    "url": "https://www.sleepfoundation.org",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Explores sleep's role in brain health.",
    "rating": 8
  }
];

// List of neuroscience websites to add
const neuroscienceSites = [
  {
    "name": "Neuroscience News",
    "url": "https://neurosciencenews.com",
    "enabled": true,
    "selector": "h3.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Open-access magazine covering neuroscience research and breakthroughs.",
    "rating": 10
  },
  {
    "name": "Society for Neuroscience",
    "url": "https://www.sfn.org",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Professional hub for neuroscience research and news.",
    "rating": 9
  },
  {
    "name": "Nature Neuroscience",
    "url": "https://www.nature.com/neuro",
    "enabled": true,
    "selector": "h3.article-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Peer-reviewed neuroscience research and commentary.",
    "rating": 10
  },
  {
    "name": "ScienceDaily Neuroscience",
    "url": "https://www.sciencedaily.com/news/mind_brain/neuroscience",
    "enabled": true,
    "selector": "h3.article-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Aggregates neuroscience research news from global sources.",
    "rating": 9
  },
  {
    "name": "MIT News Neuroscience",
    "url": "https://news.mit.edu/topic/neuroscience",
    "enabled": true,
    "selector": "h3.article-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Neuroscience advancements from MIT researchers.",
    "rating": 8
  },
  {
    "name": "BrainFacts.org",
    "url": "https://www.brainfacts.org",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Public-friendly neuroscience education from top organizations.",
    "rating": 9
  },
  {
    "name": "National Institute of Neurological Disorders and Stroke",
    "url": "https://www.ninds.nih.gov",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Neuroscience research and disorder info from NIH.",
    "rating": 9
  },
  {
    "name": "The Scientist Neuroscience",
    "url": "https://www.the-scientist.com/topic/neuroscience",
    "enabled": true,
    "selector": "h3.article-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Neuroscience research news for scientists and enthusiasts.",
    "rating": 8
  },
  {
    "name": "Neuron",
    "url": "https://www.cell.com/neuron/home",
    "enabled": true,
    "selector": "h3.article-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Leading journal for neuroscience research papers.",
    "rating": 9
  },
  {
    "name": "Journal of Neuroscience",
    "url": "https://www.jneurosci.org",
    "enabled": true,
    "selector": "h3.article-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Peer-reviewed neuroscience research from SfN.",
    "rating": 9
  },
  {
    "name": "Live Science Brain",
    "url": "https://www.livescience.com/topics/brain",
    "enabled": true,
    "selector": "h3.article-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Neuroscience discoveries for a general audience.",
    "rating": 7
  },
  {
    "name": "Scientific American Mind & Brain",
    "url": "https://www.scientificamerican.com/mind-and-brain",
    "enabled": true,
    "selector": "h3.article-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Neuroscience articles with a popular science twist.",
    "rating": 8
  },
  {
    "name": "New Scientist Neuroscience",
    "url": "https://www.newscientist.com/subject/brain",
    "enabled": true,
    "selector": "h3.article-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Neuroscience news with a futuristic lens.",
    "rating": 8
  },
  {
    "name": "IEEE Spectrum Neuroscience",
    "url": "https://spectrum.ieee.org/topic/neuroscience",
    "enabled": true,
    "selector": "h3.article-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Neuroscience tech and engineering advancements.",
    "rating": 8
  },
  {
    "name": "Quanta Magazine Neuroscience",
    "url": "https://www.quantamagazine.org/neuroscience",
    "enabled": true,
    "selector": "h3.article-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Deep dives into neuroscience and math connections.",
    "rating": 8
  },
  {
    "name": "Cognitive Neuroscience Society",
    "url": "https://www.cogneurosociety.org",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Research updates and events in cognitive neuroscience.",
    "rating": 7
  },
  {
    "name": "Neuroscientist News",
    "url": "https://www.neuroscientistnews.com",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Aggregates neuroscience research and press releases.",
    "rating": 7
  },
  {
    "name": "Allen Institute for Brain Science",
    "url": "https://alleninstitute.org/what-we-do/brain-science",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Neuroscience research and open data resources.",
    "rating": 8
  },
  {
    "name": "Neurosurgery Blog",
    "url": "https://www.neurosurgeryblog.org",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Neuroscience and neurosurgery research updates.",
    "rating": 7
  },
  {
    "name": "Brain Blogger",
    "url": "http://brainblogger.com",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Neuroscience and psychology insights for a broad audience.",
    "rating": 7
  },
  {
    "name": "British Neuroscience Association",
    "url": "https://www.bna.org.uk",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Neuroscience research and resources from the UK.",
    "rating": 7
  },
  {
    "name": "Neuro Central",
    "url": "https://www.neuro-central.com",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Hub for neuroscience and neurology news.",
    "rating": 7
  },
  {
    "name": "Molecular Neurodegeneration",
    "url": "https://molecularneurodegeneration.biomedcentral.com",
    "enabled": true,
    "selector": "h3.article-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Open-access journal on neuroscience of degeneration.",
    "rating": 8
  },
  {
    "name": "Frontiers in Neuroscience",
    "url": "https://www.frontiersin.org/journals/neuroscience",
    "enabled": true,
    "selector": "h3.article-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Open-access neuroscience research papers.",
    "rating": 8
  },
  {
    "name": "Rutgers Brain Health Institute",
    "url": "https://brainhealthinstitute.rutgers.edu",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Neuroscience research from a top academic center.",
    "rating": 7
  },
  {
    "name": "Knowing Neurons",
    "url": "https://knowingneurons.com",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Educational neuroscience content by young scientists.",
    "rating": 7
  },
  {
    "name": "McGovern Institute for Brain Research",
    "url": "https://mcgovern.mit.edu",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Neuroscience research from MIT's institute.",
    "rating": 8
  },
  {
    "name": "Neuroscience Information Framework",
    "url": "https://www.neuinfo.org",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Database of neuroscience tools and research.",
    "rating": 7
  },
  {
    "name": "Brain Canada",
    "url": "https://braincanada.ca",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Neuroscience research funding and news from Canada.",
    "rating": 7
  },
  {
    "name": "Advances in Clinical Neuroscience & Rehabilitation",
    "url": "https://acnr.co.uk",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "brain-health",
    "description": "Peer-reviewed neuroscience and neurology journal.",
    "rating": 7
  }
];

// Function to add the brain health and neuroscience sites to the config
function addBrainHealthSites() {
  try {
    // Read the current config
    const configData = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
    
    // Get existing source URLs to avoid duplicates
    const existingUrls = new Set(configData.sources.map(source => source.url));
    
    // Filter out any sites that already exist in the config
    const newBrainHealthSites = brainHealthSites.filter(site => !existingUrls.has(site.url));
    const newNeuroscienceSites = neuroscienceSites.filter(site => !existingUrls.has(site.url));
    
    // Add the new sites to the config
    configData.sources = [...configData.sources, ...newBrainHealthSites, ...newNeuroscienceSites];
    
    // Write the updated config back to the file
    fs.writeFileSync(configFilePath, JSON.stringify(configData, null, 2), 'utf8');
    
    console.log(`Added ${newBrainHealthSites.length} new brain health sites to the scraper config.`);
    console.log(`Added ${newNeuroscienceSites.length} new neuroscience sites to the scraper config.`);
    console.log(`Total sources in config: ${configData.sources.length}`);
  } catch (error) {
    console.error('Error updating scraper config:', error);
  }
}

// Run the function
addBrainHealthSites(); 