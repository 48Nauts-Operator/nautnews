document.addEventListener('DOMContentLoaded', () => {
    // Category navigation
    const categoryLinks = document.querySelectorAll('.category-nav a');
    const sections = document.querySelectorAll('.category-section');
    
    // Set active category based on scroll position
    const setActiveCategory = () => {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 200)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        categoryLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    };
    
    // Smooth scrolling for category links
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 100,
                behavior: 'smooth'
            });
            
            // Update active class
            categoryLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // View All functionality
    const viewAllLinks = document.querySelectorAll('.view-all');
    viewAllLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the parent section
            const section = this.closest('.category-section');
            const sectionId = section.getAttribute('id');
            
            // Toggle expanded class on the section
            section.classList.toggle('expanded');
            
            // Change the text based on the state
            if (section.classList.contains('expanded')) {
                this.innerHTML = 'Show Less <i class="fas fa-chevron-up"></i>';
                
                // Load more news items for this category
                loadMoreNews(sectionId);
            } else {
                this.innerHTML = 'View All <i class="fas fa-chevron-right"></i>';
                
                // Collapse the section to show only the first row
                const newsGrid = section.querySelector('.news-grid');
                const newsItems = newsGrid.querySelectorAll('.news-card');
                
                // Hide items beyond the first row (4 items)
                for (let i = 4; i < newsItems.length; i++) {
                    newsItems[i].style.display = 'none';
                }
            }
        });
    });
    
    // Function to load more news items
    const loadMoreNews = (category) => {
        // In a real application, this would fetch more news from an API
        // For this demo, we'll just show all existing items
        const section = document.getElementById(category);
        const newsGrid = section.querySelector('.news-grid');
        const newsItems = newsGrid.querySelectorAll('.news-card');
        
        // Show all items
        newsItems.forEach(item => {
            item.style.display = 'flex';
        });
    };
    
    // Breaking news ticker animation
    const breakingContent = document.querySelector('.breaking-content p');
    if (breakingContent) {
        const contentWidth = breakingContent.offsetWidth;
        const containerWidth = document.querySelector('.breaking-content').offsetWidth;
        
        // Adjust animation duration based on content length
        const duration = contentWidth / 50; // pixels per second
        breakingContent.style.animationDuration = `${duration}s`;
    }
    
    // Add hover effect for news cards
    const newsCards = document.querySelectorAll('.news-card');
    newsCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = 'var(--card-hover-shadow)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'var(--card-shadow)';
        });
    });

    // Add lazy loading for images
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }

    // Add a simple animation when scrolling
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.news-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    };

    // Check active category on scroll
    window.addEventListener('scroll', () => {
        setActiveCategory();
        animateOnScroll();
    });
    
    // Initial check on page load
    setActiveCategory();
    animateOnScroll();
    
    // Add current date to the footer
    const footerDate = document.querySelector('footer .date');
    if (footerDate) {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        footerDate.textContent = now.toLocaleDateString('en-US', options);
    }
}); 