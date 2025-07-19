document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const newsContainer = document.getElementById('dynamic-news-container');
    const lastUpdatedTime = document.getElementById('last-updated-time');
    const statusMessage = document.createElement('div');
    statusMessage.className = 'status-message';
    const categoryLinks = document.querySelectorAll('.category-nav a');
    const modalContainer = document.createElement('div');
    modalContainer.className = 'article-modal-container';
    document.body.appendChild(modalContainer);
    
    // State
    let allArticles = [];
    let activeCategory = 'all';
    let viewMode = localStorage.getItem('viewMode') || 'grid'; // 'grid' or 'list'
    
    // Add status message to the page
    const mainElement = document.querySelector('main');
    if (mainElement) {
        mainElement.prepend(statusMessage);
    } else if (newsContainer) {
        // If main doesn't exist, add status before the news container
        newsContainer.parentNode.insertBefore(statusMessage, newsContainer);
    }
    
    // API Endpoints
    const API_BASE_URL = '/api';
    const API_ENDPOINTS = {
        getNews: `${API_BASE_URL}/news`,
        getSettings: `${API_BASE_URL}/settings`
    };
    
    // Initialize
    loadNews();
    
    // Event listeners for category navigation
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            categoryLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Get category from href
            const href = link.getAttribute('href');
            activeCategory = href === '#all' ? 'all' : href.substring(1);
            
            // Filter and render news
            filterAndRenderNews();
        });
    });
    
    // Functions
    async function loadNews() {
        try {
            showStatus('Loading news...', 'info');
            const response = await fetch(API_ENDPOINTS.getNews);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const news = await response.json();
            if (news && news.length > 0) {
                allArticles = news;
                filterAndRenderNews();
                updateLastUpdatedTime();
                showStatus(`Loaded ${news.length} articles from ${countSources(news)} sources`, 'success');
            } else {
                showStatus('No news articles found. Try running the scraper from the settings page.', 'warning');
            }
        } catch (error) {
            console.error('Error loading news:', error);
            showStatus('Error loading news: ' + error.message, 'error');
        }
    }
    
    function filterAndRenderNews() {
        let filteredArticles = allArticles;
        
        // Filter by category if not 'all'
        if (activeCategory !== 'all') {
            filteredArticles = allArticles.filter(article => article.category === activeCategory);
            
            // Update the category navigation to highlight the active category
            categoryLinks.forEach(link => {
                const href = link.getAttribute('href');
                const linkCategory = href === '#all' ? 'all' : href.substring(1);
                
                if (linkCategory === activeCategory) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
        
        renderNews(filteredArticles);
        
        // If a specific category is selected, scroll to that section
        if (activeCategory !== 'all') {
            const categorySection = document.getElementById(activeCategory);
            if (categorySection) {
                categorySection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
    
    function updateLastUpdatedTime() {
        if (lastUpdatedTime) {
            const now = new Date();
            lastUpdatedTime.textContent = now.toLocaleString();
        }
    }
    
    function countSources(news) {
        const sources = new Set();
        news.forEach(article => {
            if (article.source) {
                sources.add(article.source);
            }
        });
        return sources.size;
    }
    
    function renderNews(news) {
        // Clear the container
        newsContainer.innerHTML = '';
        
        // Create view toggle controls
        const viewControls = document.createElement('div');
        viewControls.className = 'view-controls';
        
        const gridViewBtn = document.createElement('button');
        gridViewBtn.className = `view-btn ${viewMode === 'grid' ? 'active' : ''}`;
        gridViewBtn.innerHTML = '<i class="fas fa-th-large"></i>';
        gridViewBtn.title = 'Grid View';
        gridViewBtn.addEventListener('click', () => {
            setViewMode('grid');
        });
        
        const listViewBtn = document.createElement('button');
        listViewBtn.className = `view-btn ${viewMode === 'list' ? 'active' : ''}`;
        listViewBtn.innerHTML = '<i class="fas fa-list"></i>';
        listViewBtn.title = 'List View';
        listViewBtn.addEventListener('click', () => {
            setViewMode('list');
        });
        
        viewControls.appendChild(gridViewBtn);
        viewControls.appendChild(listViewBtn);
        
        // Create news container with current view mode
        const newsContainerElement = document.createElement('div');
        newsContainerElement.className = `news-container ${viewMode}-view`;
        
        // If we're showing all categories
        if (activeCategory === 'all') {
            // Add view controls to the page
            newsContainer.appendChild(viewControls);
            
            // Group articles by category
            const categoryGroups = groupByCategory(news);
            
            // Define the order of categories
            const categoryOrder = ['ai', 'brain-health', 'technology', 'hacker-news', 'finance', 'switzerland'];
            
            // Render each category section
            categoryOrder.forEach(category => {
                if (categoryGroups[category] && categoryGroups[category].length > 0) {
                    const articles = categoryGroups[category];
                    
                    // Create category section
                    const categorySection = document.createElement('section');
                    categorySection.id = category;
                    categorySection.className = 'category-section';
                    
                    // Create section header
                    const sectionHeader = document.createElement('div');
                    sectionHeader.className = 'section-header';
                    
                    const sectionTitle = document.createElement('h2');
                    sectionTitle.className = 'section-title';
                    sectionTitle.textContent = getCategoryDisplayName(category);
                    
                    const viewAll = document.createElement('a');
                    viewAll.href = '#';
                    viewAll.className = 'view-all';
                    viewAll.innerHTML = 'View All <i class="fas fa-chevron-right"></i>';
                    viewAll.dataset.category = category;
                    viewAll.addEventListener('click', (e) => {
                        e.preventDefault();
                        
                        // Set active category to this category
                        activeCategory = category;
                        
                        // Update active class in nav
                        categoryLinks.forEach(link => {
                            if (link.getAttribute('href') === `#${category}`) {
                                link.classList.add('active');
                            } else {
                                link.classList.remove('active');
                            }
                        });
                        
                        // Filter and render news
                        filterAndRenderNews();
                    });
                    
                    sectionHeader.appendChild(sectionTitle);
                    sectionHeader.appendChild(viewAll);
                    categorySection.appendChild(sectionHeader);
                    
                    // Create news grid
                    const newsGrid = document.createElement('div');
                    newsGrid.className = 'news-grid';
                    
                    // Add each article (limit to 6 for category view)
                    articles.slice(0, 6).forEach(article => {
                        const articleCard = createArticleCard(article);
                        newsGrid.appendChild(articleCard);
                    });
                    
                    categorySection.appendChild(newsGrid);
                    newsContainerElement.appendChild(categorySection);
                }
            });
            
            newsContainer.appendChild(newsContainerElement);
        } else {
            // We're showing a specific category
            // Add view controls to the page
            newsContainer.appendChild(viewControls);
            
            // Create category section
            const categorySection = document.createElement('section');
            categorySection.id = activeCategory;
            categorySection.className = 'category-section';
            
            // Create section header
            const sectionHeader = document.createElement('div');
            sectionHeader.className = 'section-header';
            
            const sectionTitle = document.createElement('h2');
            sectionTitle.className = 'section-title';
            sectionTitle.textContent = getCategoryDisplayName(activeCategory);
            
            sectionHeader.appendChild(sectionTitle);
            categorySection.appendChild(sectionHeader);
            
            // Create news grid
            const newsGrid = document.createElement('div');
            newsGrid.className = 'news-grid';
            
            // Add each article
            news.forEach(article => {
                const articleCard = createArticleCard(article);
                newsGrid.appendChild(articleCard);
            });
            
            categorySection.appendChild(newsGrid);
            newsContainerElement.appendChild(categorySection);
            
            newsContainer.appendChild(newsContainerElement);
        }
    }
    
    function setViewMode(mode) {
        viewMode = mode;
        localStorage.setItem('viewMode', mode);
        
        // Update view buttons
        const gridViewBtn = document.querySelector('.view-btn:first-child');
        const listViewBtn = document.querySelector('.view-btn:last-child');
        
        if (gridViewBtn && listViewBtn) {
            if (mode === 'grid') {
                gridViewBtn.classList.add('active');
                listViewBtn.classList.remove('active');
            } else {
                gridViewBtn.classList.remove('active');
                listViewBtn.classList.add('active');
            }
        }
        
        // Update news container class
        const newsContainerElement = document.querySelector('.news-container');
        if (newsContainerElement) {
            newsContainerElement.className = `news-container ${mode}-view`;
        }
        
        // Re-render the news with the new view mode
        filterAndRenderNews();
    }
    
    function getCategoryDisplayName(category) {
        const displayNames = {
            'ai': 'Artificial Intelligence',
            'brain-health': 'Brain Health',
            'technology': 'Technology',
            'hacker-news': 'Hacker News',
            'finance': 'Finance',
            'switzerland': 'Switzerland',
            'uncategorized': 'Uncategorized'
        };
        
        return displayNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
    }
    
    function groupByCategory(news) {
        const groups = {};
        
        news.forEach(article => {
            const category = article.category || 'uncategorized';
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(article);
        });
        
        return groups;
    }
    
    function createArticleCard(article) {
        const articleElement = document.createElement('article');
        articleElement.className = 'news-card small';
        
        // Create image container if we have an image URL
        // First try to use the scraped image, fall back to category image
        const imageUrl = article.imageUrl || getImageForCategory(article.category);
        if (imageUrl) {
            const imageContainer = document.createElement('div');
            imageContainer.className = 'card-image';
            
            const image = document.createElement('img');
            image.src = imageUrl;
            image.alt = article.title;
            
            // Add error handler to use fallback image if the scraped image fails to load
            image.onerror = function() {
                this.src = getImageForCategory(article.category);
            };
            
            imageContainer.appendChild(image);
            articleElement.appendChild(imageContainer);
        }
        
        // Create content container
        const contentContainer = document.createElement('div');
        contentContainer.className = 'card-content';
        
        // Add category tag
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = article.category || 'News';
        contentContainer.appendChild(tag);
        
        // Add title
        const title = document.createElement('h2');
        title.textContent = article.title;
        contentContainer.appendChild(title);
        
        // Add truncated summary
        if (article.summary) {
            const summary = document.createElement('p');
            summary.className = 'summary';
            
            // Check if it's a generic summary
            if (article.summary.startsWith('Article from') && article.summary.includes('about')) {
                // For generic summaries, make them shorter and add a note
                summary.innerHTML = `<em>${article.summary}</em>`;
                summary.classList.add('generic-summary');
            } else {
                // Truncate summary to 100 characters
                const truncatedSummary = article.summary.length > 100 
                    ? article.summary.substring(0, 100) + '...' 
                    : article.summary;
                summary.textContent = truncatedSummary;
            }
            
            contentContainer.appendChild(summary);
        }
        
        // Add footer
        const footer = document.createElement('div');
        footer.className = 'card-footer';
        
        const readMore = document.createElement('a');
        readMore.href = '#';
        readMore.className = 'read-more';
        readMore.innerHTML = 'Read More <i class="fas fa-arrow-right"></i>';
        readMore.addEventListener('click', (e) => {
            e.preventDefault();
            showArticleModal(article);
        });
        footer.appendChild(readMore);
        
        if (article.date) {
            const date = document.createElement('span');
            date.className = 'date';
            date.textContent = formatDate(article.date);
            footer.appendChild(date);
        }
        
        contentContainer.appendChild(footer);
        articleElement.appendChild(contentContainer);
        
        return articleElement;
    }
    
    function showArticleModal(article) {
        // Create modal content
        modalContainer.innerHTML = '';
        
        const modal = document.createElement('div');
        modal.className = 'article-modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        // Close button
        const closeButton = document.createElement('button');
        closeButton.className = 'close-modal';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        closeButton.addEventListener('click', () => {
            modalContainer.classList.remove('active');
        });
        
        // Article header
        const header = document.createElement('div');
        header.className = 'modal-header';
        
        const category = document.createElement('span');
        category.className = 'tag';
        category.textContent = article.category || 'News';
        
        const title = document.createElement('h2');
        title.textContent = article.title;
        
        const source = document.createElement('div');
        source.className = 'source-info';
        source.innerHTML = `
            <span class="source-name">${article.sourceName || 'Unknown Source'}</span>
            <span class="date">${formatDate(article.date)}</span>
        `;
        
        header.appendChild(category);
        header.appendChild(title);
        header.appendChild(source);
        
        // Article image
        const imageUrl = article.imageUrl || getImageForCategory(article.category);
        if (imageUrl) {
            const image = document.createElement('img');
            image.className = 'modal-image';
            image.src = imageUrl;
            image.alt = article.title;
            modalContent.appendChild(image);
        }
        
        // Article content
        const content = document.createElement('div');
        content.className = 'modal-body';
        
        const summary = document.createElement('p');
        summary.className = 'full-summary';
        summary.textContent = article.summary;
        
        const readOriginal = document.createElement('a');
        readOriginal.href = article.url;
        readOriginal.className = 'read-original';
        readOriginal.target = '_blank';
        readOriginal.innerHTML = 'Read Original Article <i class="fas fa-external-link-alt"></i>';
        
        content.appendChild(summary);
        content.appendChild(readOriginal);
        
        // Assemble modal
        modalContent.appendChild(closeButton);
        modalContent.appendChild(header);
        modalContent.appendChild(content);
        modal.appendChild(modalContent);
        modalContainer.appendChild(modal);
        
        // Show modal
        modalContainer.classList.add('active');
        
        // Close modal when clicking outside
        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                modalContainer.classList.remove('active');
            }
        });
    }
    
    function getImageForCategory(category) {
        const images = {
            'ai': 'https://images.unsplash.com/photo-1677442135136-760c813dce26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80',
            'brain-health': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1738&q=80',
            'technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
            'hacker-news': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
            'finance': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
            'switzerland': 'https://images.unsplash.com/photo-1573599852326-2d4da0bbe613?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'
        };
        
        return images[category] || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80';
    }
    
    function formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        } catch (e) {
            return dateString;
        }
    }
    
    function showStatus(message, type = 'info') {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
        statusMessage.style.display = 'block';
        
        // Hide after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                statusMessage.style.display = 'none';
            }, 5000);
        }
    }
}); 