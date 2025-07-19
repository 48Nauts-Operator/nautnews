const fs = require('fs');
const path = require('path');

// Path to the scraper config file
const configFilePath = path.join(__dirname, 'scraper-config.json');

// List of 50 cybersecurity websites to add
const securitySites = [
  {
    "name": "Hacker News (Y Combinator)",
    "url": "https://news.ycombinator.com",
    "enabled": true,
    "selector": ".titleline > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "A community-driven platform for tech and cybersecurity discussions, featuring links to vulnerabilities, research, and news.",
    "rating": 10
  },
  {
    "name": "The Hacker News",
    "url": "https://thehackernews.com",
    "enabled": true,
    "selector": "h2.home-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "A leading source for cybersecurity news, vulnerabilities, and research updates.",
    "rating": 10
  },
  {
    "name": "Dark Reading",
    "url": "https://www.darkreading.com",
    "enabled": true,
    "selector": "h3.article-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Covers cybersecurity news, vulnerabilities, and industry trends with expert insights.",
    "rating": 9
  },
  {
    "name": "Threatpost",
    "url": "https://threatpost.com",
    "enabled": true,
    "selector": "h2.c-article__title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Focuses on cybersecurity threats, vulnerabilities, and hacker activities.",
    "rating": 8
  },
  {
    "name": "Bleeping Computer",
    "url": "https://www.bleepingcomputer.com",
    "enabled": true,
    "selector": "h4 > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "News on cybersecurity, vulnerabilities, malware, and tech support.",
    "rating": 9
  },
  {
    "name": "Krebs on Security",
    "url": "https://krebsonsecurity.com",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "In-depth investigative cybersecurity journalism by Brian Krebs.",
    "rating": 9
  },
  {
    "name": "SC Media",
    "url": "https://www.scworld.com",
    "enabled": true,
    "selector": "h3.article-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Cybersecurity news, analysis, and research for professionals.",
    "rating": 8
  },
  {
    "name": "CyberScoop",
    "url": "https://www.cyberscoop.com",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Covers cybersecurity policy, vulnerabilities, and government-related news.",
    "rating": 8
  },
  {
    "name": "SecurityWeek",
    "url": "https://www.securityweek.com",
    "enabled": true,
    "selector": "h2.title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "News on vulnerabilities, breaches, and cybersecurity research.",
    "rating": 8
  },
  {
    "name": "Infosecurity Magazine",
    "url": "https://www.infosecurity-magazine.com",
    "enabled": true,
    "selector": "h3.article-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Cybersecurity news, research, and events coverage.",
    "rating": 7
  },
  {
    "name": "National Vulnerability Database",
    "url": "https://nvd.nist.gov",
    "enabled": true,
    "selector": "h3.vulnerability-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "U.S. government repository of vulnerability data and CVEs.",
    "rating": 10
  },
  {
    "name": "CVE Details",
    "url": "https://www.cvedetails.com",
    "enabled": true,
    "selector": "h3.vulnerability-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Detailed vulnerability database with CVE listings and trends.",
    "rating": 9
  },
  {
    "name": "VulnDB",
    "url": "https://vulndb.cyberriskanalytics.com",
    "enabled": true,
    "selector": "h3.vuln-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Commercial vulnerability database with detailed reports.",
    "rating": 8
  },
  {
    "name": "Exploit-DB",
    "url": "https://www.exploit-db.com",
    "enabled": true,
    "selector": "a.text-dark",
    "limit": 10,
    "category": "hacker-news",
    "description": "Archive of exploits and vulnerable software by Offensive Security.",
    "rating": 9
  },
  {
    "name": "MITRE CVE",
    "url": "https://cve.mitre.org",
    "enabled": true,
    "selector": "a.cve-link",
    "limit": 10,
    "category": "hacker-news",
    "description": "Official CVE list for tracking vulnerabilities globally.",
    "rating": 9
  },
  {
    "name": "Open Bug Bounty",
    "url": "https://www.openbugbounty.org",
    "enabled": true,
    "selector": "h3.vuln-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Community-driven platform for reporting website vulnerabilities.",
    "rating": 7
  },
  {
    "name": "Packet Storm Security",
    "url": "https://packetstormsecurity.com",
    "enabled": true,
    "selector": "dt > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Repository of exploits, tools, and vulnerability news.",
    "rating": 8
  },
  {
    "name": "SecurityFocus",
    "url": "https://www.securityfocus.com",
    "enabled": true,
    "selector": "h3.vuln-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Vulnerability database and mailing list for security issues.",
    "rating": 7
  },
  {
    "name": "CISA Known Exploited Vulnerabilities",
    "url": "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
    "enabled": true,
    "selector": "h3.vuln-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "U.S. government list of actively exploited vulnerabilities.",
    "rating": 9
  },
  {
    "name": "Rapid7 Vulnerability Database",
    "url": "https://www.rapid7.com/db",
    "enabled": true,
    "selector": "h3.vuln-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Vulnerability insights and research from Rapid7.",
    "rating": 8
  },
  {
    "name": "Schneier on Security",
    "url": "https://www.schneier.com",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Bruce Schneier's blog on cybersecurity research and policy.",
    "rating": 8
  },
  {
    "name": "Troy Hunt's Blog",
    "url": "https://www.troyhunt.com",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Cybersecurity research and vuln insights by Troy Hunt.",
    "rating": 8
  },
  {
    "name": "Google Project Zero",
    "url": "https://googleprojectzero.blogspot.com",
    "enabled": true,
    "selector": "h3.post-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Google's security team research on zero-day vulnerabilities.",
    "rating": 9
  },
  {
    "name": "Microsoft Security Blog",
    "url": "https://msrc-blog.microsoft.com",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Updates on vulnerabilities, threats, and research from Microsoft.",
    "rating": 8
  },
  {
    "name": "Qualys Blog",
    "url": "https://blog.qualys.com",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Technical research on vulnerabilities and security trends.",
    "rating": 7
  },
  {
    "name": "Tenable Blog",
    "url": "https://www.tenable.com/blog",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Research and insights on vulnerabilities and cybersecurity.",
    "rating": 7
  },
  {
    "name": "Mandiant Blog",
    "url": "https://www.mandiant.com/resources/blog",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Threat intelligence and vulnerability research from Mandiant.",
    "rating": 8
  },
  {
    "name": "Kaspersky Blog",
    "url": "https://www.kaspersky.com/blog",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Cybersecurity research and threat analysis from Kaspersky.",
    "rating": 8
  },
  {
    "name": "Symantec Blog",
    "url": "https://symantec-enterprise-blogs.security.com",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Threat and vulnerability research from Symantec.",
    "rating": 7
  },
  {
    "name": "Check Point Research",
    "url": "https://research.checkpoint.com",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "In-depth cybersecurity and vulnerability research.",
    "rating": 8
  },
  {
    "name": "OWASP",
    "url": "https://owasp.org",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Open-source security resources and vulnerability research.",
    "rating": 9
  },
  {
    "name": "Metasploit",
    "url": "https://www.metasploit.com",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Penetration testing tool with vulnerability exploits.",
    "rating": 8
  },
  {
    "name": "Kali Linux",
    "url": "https://www.kali.org",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Security research distro with tools and vuln info.",
    "rating": 8
  },
  {
    "name": "Nmap Project",
    "url": "https://nmap.org",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Network scanning tool with vuln detection resources.",
    "rating": 7
  },
  {
    "name": "Wireshark",
    "url": "https://www.wireshark.org",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Network analysis tool with security research content.",
    "rating": 7
  },
  {
    "name": "CSO Online",
    "url": "https://www.csoonline.com",
    "enabled": true,
    "selector": "h3.article-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Cybersecurity news and research for security professionals.",
    "rating": 8
  },
  {
    "name": "Help Net Security",
    "url": "https://www.helpnetsecurity.com",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "News and insights on cybersecurity and vulnerabilities.",
    "rating": 7
  },
  {
    "name": "Bank Info Security",
    "url": "https://www.bankinfosecurity.com",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Cybersecurity news with a focus on finance and vulnerabilities.",
    "rating": 7
  },
  {
    "name": "CBR Online",
    "url": "https://www.cbronline.com",
    "enabled": true,
    "selector": "h3.article-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Tech and cybersecurity news, including vuln research.",
    "rating": 7
  },
  {
    "name": "Cybersecurity Dive",
    "url": "https://www.cybersecuritydive.com",
    "enabled": true,
    "selector": "h3.article-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Industry news on vulnerabilities and security trends.",
    "rating": 8
  },
  {
    "name": "SANS Institute",
    "url": "https://www.sans.org",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Cybersecurity training and research resources.",
    "rating": 9
  },
  {
    "name": "Black Hat",
    "url": "https://www.blackhat.com",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Conference site with cutting-edge security research.",
    "rating": 8
  },
  {
    "name": "DEF CON",
    "url": "https://www.defcon.org",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Hacker conference with vuln and research content.",
    "rating": 8
  },
  {
    "name": "ACM Digital Library",
    "url": "https://dl.acm.org",
    "enabled": true,
    "selector": "h3.title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Academic papers on cybersecurity and vulnerabilities.",
    "rating": 7
  },
  {
    "name": "IEEE Xplore",
    "url": "https://ieeexplore.ieee.org",
    "enabled": true,
    "selector": "h3.title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Peer-reviewed research on cybersecurity topics.",
    "rating": 8
  },
  {
    "name": "Recorded Future",
    "url": "https://www.recordedfuture.com",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Threat intelligence and vuln analysis platform.",
    "rating": 8
  },
  {
    "name": "CrowdStrike Blog",
    "url": "https://www.crowdstrike.com/blog",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Threat research and vulnerability updates.",
    "rating": 8
  },
  {
    "name": "Palo Alto Networks Unit 42",
    "url": "https://unit42.paloaltonetworks.com",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Threat intelligence and vuln research from Unit 42.",
    "rating": 8
  },
  {
    "name": "Trend Micro Research",
    "url": "https://www.trendmicro.com/en_us/research.html",
    "enabled": true,
    "selector": "h3.article-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Cybersecurity research and vuln insights.",
    "rating": 7
  },
  {
    "name": "SophosLabs",
    "url": "https://www.sophos.com/en-us/labs",
    "enabled": true,
    "selector": "h2.entry-title > a",
    "limit": 10,
    "category": "hacker-news",
    "description": "Research on threats, vulnerabilities, and malware.",
    "rating": 7
  }
];

// Function to add the security sites to the config
function addSecuritySites() {
  try {
    // Read the current config
    const configData = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
    
    // Get existing source URLs to avoid duplicates
    const existingUrls = new Set(configData.sources.map(source => source.url));
    
    // Filter out any sites that already exist in the config
    const newSites = securitySites.filter(site => !existingUrls.has(site.url));
    
    // Add the new sites to the config
    configData.sources = [...configData.sources, ...newSites];
    
    // Write the updated config back to the file
    fs.writeFileSync(configFilePath, JSON.stringify(configData, null, 2), 'utf8');
    
    console.log(`Added ${newSites.length} new security sites to the scraper config.`);
    console.log(`Total sources in config: ${configData.sources.length}`);
  } catch (error) {
    console.error('Error updating scraper config:', error);
  }
}

// Run the function
addSecuritySites(); 