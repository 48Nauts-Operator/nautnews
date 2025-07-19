document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const sourcesContainer = document.getElementById('sources-container');
    const addSourceBtn = document.getElementById('add-source');
    const importAiSourcesBtn = document.getElementById('import-ai-sources');
    const saveSettingsBtn = document.getElementById('save-settings');
    const runNowBtn = document.getElementById('run-now');
    const statusMessage = document.getElementById('status-message');
    const updateIntervalInput = document.getElementById('update-interval');
    const articlesPerSourceInput = document.getElementById('articles-per-source');
    const outputDirInput = document.getElementById('output-dir');
    const gridViewBtn = document.getElementById('grid-view-btn');
    const listViewBtn = document.getElementById('list-view-btn');
    
    // Modal Elements
    const addSourceModal = document.getElementById('add-source-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelAddSourceBtn = document.getElementById('cancel-add-source');
    const confirmAddSourceBtn = document.getElementById('confirm-add-source');
    const sourceNameInput = document.getElementById('source-name');
    const sourceCategoryInput = document.getElementById('source-category');
    const sourceUrlInput = document.getElementById('source-url');
    const sourceSelectorInput = document.getElementById('source-selector');
    const sourceDescriptionInput = document.getElementById('source-description');
    const sourceRatingInput = document.getElementById('source-rating');
    const categoryTabs = document.getElementById('category-tabs');
    const sourcesCountEl = document.getElementById('sources-count');
    const activeSourcesCountEl = document.getElementById('active-sources-count');
    
    // Templates
    const sourceTemplate = document.getElementById('source-template');
    const sourceListItemTemplate = document.getElementById('source-list-item-template');
    
    // State
    let settings = {
        updateInterval: 60,
        articlesPerSource: 10,
        outputDir: 'data',
        sources: []
    };
    
    // Current edit index
    let currentEditIndex = -1;
    let currentCategory = 'all';
    let currentView = 'grid'; // 'grid' or 'list'
    
    // API Endpoints
    const API_SETTINGS = '/api/settings';
    const API_RUN_SCRAPER = '/api/run-scraper';
    
    // Initialize
    init();
    
    // Functions
    async function init() {
        try {
            await loadSettings();
            renderSources();
            setupEventListeners();
            updateSourcesCount();
        } catch (error) {
            showStatus('Error loading settings: ' + error.message, 'error');
        }
    }
    
    function setupEventListeners() {
        // Save settings
        saveSettingsBtn.addEventListener('click', saveSettings);
        
        // Run scraper
        runNowBtn.addEventListener('click', runScraper);
        
        // Add source
        addSourceBtn.addEventListener('click', openModal);
        
        // Import AI sources
        importAiSourcesBtn.addEventListener('click', importAiSources);
        
        // Modal events
        closeModalBtn.addEventListener('click', closeModal);
        cancelAddSourceBtn.addEventListener('click', closeModal);
        confirmAddSourceBtn.addEventListener('click', addNewSource);
        
        // Category tabs
        categoryTabs.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                const category = e.target.dataset.category;
                setActiveCategory(category);
                filterSourcesByCategory(category);
            }
        });
        
        // View toggle
        gridViewBtn.addEventListener('click', () => {
            setActiveView('grid');
        });
        
        listViewBtn.addEventListener('click', () => {
            setActiveView('list');
        });
        
        // Close modal on outside click
        window.addEventListener('click', (event) => {
            if (event.target === addSourceModal) {
                closeModal();
            }
        });
        
        // Press Enter to add source in modal
        addSourceModal.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                addNewSource();
            }
        });
    }
    
    function setActiveView(view) {
        currentView = view;
        
        // Update button states
        if (view === 'grid') {
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
            sourcesContainer.classList.add('grid-view');
            sourcesContainer.classList.remove('list-view');
        } else {
            gridViewBtn.classList.remove('active');
            listViewBtn.classList.add('active');
            sourcesContainer.classList.add('list-view');
            sourcesContainer.classList.remove('grid-view');
        }
        
        // Re-render sources with the new view
        renderSources();
    }
    
    async function loadSettings() {
        try {
            showStatus('Loading settings...', 'info');
            const response = await fetch(API_SETTINGS);
            
            if (!response.ok) {
                throw new Error(`Failed to load settings: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Update settings object
            settings = {
                updateInterval: data.updateInterval || 60,
                articlesPerSource: data.articlesPerSource || 10,
                outputDir: data.outputDir || 'data',
                sources: data.sources || []
            };
            
            // Debug: Check source categories
            console.log('Source categories:');
            if (settings.sources && settings.sources.length > 0) {
                const categories = {};
                settings.sources.forEach(source => {
                    const category = source.category || 'uncategorized';
                    if (!categories[category]) {
                        categories[category] = 0;
                    }
                    categories[category]++;
                });
                console.table(categories);
            } else {
                console.log('No sources loaded.');
            }
            
            // Update form inputs
            updateIntervalInput.value = settings.updateInterval;
            articlesPerSourceInput.value = settings.articlesPerSource;
            outputDirInput.value = settings.outputDir;
            
            showStatus('Settings loaded successfully', 'success');
        } catch (error) {
            console.error('Error loading settings:', error);
            showStatus(`Error loading settings: ${error.message}`, 'error');
        }
    }
    
    async function saveSettings() {
        try {
            showStatus('Saving settings...', 'info');
            
            // Update settings from UI
            settings.updateInterval = parseInt(updateIntervalInput.value) || 60;
            settings.articlesPerSource = parseInt(articlesPerSourceInput.value) || 10;
            settings.outputDir = outputDirInput.value || 'data';
            
            // Update sources from UI
            updateSourcesFromUI();
            
            // Send to API
            const response = await fetch(API_SETTINGS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(settings)
            });
            
            if (!response.ok) {
                throw new Error(`Failed to save settings: ${response.status} ${response.statusText}`);
            }
            
            showStatus('Settings saved successfully', 'success');
        } catch (error) {
            console.error('Error saving settings:', error);
            showStatus(`Error saving settings: ${error.message}`, 'error');
        }
    }
    
    function updateSourcesFromUI() {
        // This function is called when saving settings
        // We don't need to update sources from UI elements since we're
        // already updating the settings.sources array when toggling, editing, or deleting sources
    }
    
    async function runScraper() {
        try {
            showStatus('Running scraper...', 'info');
            
            const response = await fetch(API_RUN_SCRAPER, {
                method: 'POST'
            });
            
            if (!response.ok) {
                throw new Error(`Failed to run scraper: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                showStatus(`Scraper completed successfully. Fetched ${data.articlesCount || 0} articles.`, 'success');
                
                // Update article counts in the UI
                if (data.sourceStats) {
                    updateArticleCounts(data.sourceStats);
                }
            } else {
                showStatus(`Scraper failed: ${data.error || 'Unknown error'}`, 'error');
            }
        } catch (error) {
            console.error('Error running scraper:', error);
            showStatus(`Error running scraper: ${error.message}`, 'error');
        }
    }
    
    function updateArticleCounts(sourceStats) {
        // Update article counts for each source
        document.querySelectorAll('.source-card').forEach(card => {
            const sourceUrl = card.dataset.url;
            if (sourceStats[sourceUrl]) {
                const countEl = card.querySelector('.articles-count');
                if (countEl) {
                    countEl.textContent = sourceStats[sourceUrl];
                }
            }
        });
    }
    
    function showStatus(message, type = 'info') {
        statusMessage.textContent = message;
        statusMessage.className = 'status-message';
        statusMessage.classList.add(type);
        statusMessage.style.display = 'block';
        
        // Hide after 5 seconds
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 5000);
    }
    
    function renderSources() {
        sourcesContainer.innerHTML = '';
        
        // Set the view class
        sourcesContainer.classList.add(currentView === 'grid' ? 'grid-view' : 'list-view');
        
        if (settings.sources.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <i class="fas fa-newspaper"></i>
                <h3>No sources added yet</h3>
                <p>Add your first news source to start scraping articles.</p>
                <button class="action-button primary" onclick="document.getElementById('add-source').click()">
                    <i class="fas fa-plus"></i> Add Source
                </button>
            `;
            sourcesContainer.appendChild(emptyState);
            return;
        }
        
        // Filter sources by category if needed
        let filteredSources = settings.sources;
        
        if (currentCategory !== 'all') {
            console.log(`Filtering by category: ${currentCategory}`);
            console.log(`Before filtering: ${settings.sources.length} sources`);
            
            filteredSources = settings.sources.filter(source => {
                // Log each source to debug
                console.log(`Source: ${source.name}, Category: ${source.category}`);
                return source.category === currentCategory;
            });
            
            console.log(`After filtering: ${filteredSources.length} sources`);
        }
        
        // If no sources in this category, show empty state
        if (filteredSources.length === 0 && currentCategory !== 'all') {
            const emptyCategory = document.createElement('div');
            emptyCategory.className = 'empty-state';
            emptyCategory.innerHTML = `
                <i class="fas fa-filter"></i>
                <h3>No ${formatCategoryName(currentCategory)} Sources</h3>
                <p>You don't have any sources in this category yet.</p>
                <button class="action-button primary" onclick="document.getElementById('add-source').click()">
                    <i class="fas fa-plus"></i> Add ${formatCategoryName(currentCategory)} Source
                </button>
            `;
            sourcesContainer.appendChild(emptyCategory);
            return;
        }
        
        filteredSources.forEach((source, index) => {
            if (currentView === 'grid') {
                const sourceCard = renderSourceCard(source, settings.sources.indexOf(source));
                sourcesContainer.appendChild(sourceCard);
            } else {
                const sourceListItem = renderSourceListItem(source, settings.sources.indexOf(source));
                sourcesContainer.appendChild(sourceListItem);
            }
        });
    }
    
    function renderSourceCard(source, index) {
        const template = document.getElementById('source-template');
        const sourceCard = document.importNode(template.content, true).querySelector('.source-card');
        
        // Set data attributes
        sourceCard.dataset.index = index;
        sourceCard.dataset.url = source.url;
        sourceCard.dataset.category = source.category || 'other';
        
        // Add category as a class for easier styling/filtering
        sourceCard.classList.add(`category-${source.category || 'other'}`);
        
        // Set source name
        sourceCard.querySelector('.source-name').textContent = source.name;
        
        // Set source category with a clearer indicator
        const categoryEl = sourceCard.querySelector('.category-name');
        const categoryName = formatCategoryName(source.category || 'other');
        categoryEl.textContent = categoryName;
        categoryEl.classList.add(`category-tag-${source.category || 'other'}`);
        
        // Set source description
        sourceCard.querySelector('.source-description').textContent = source.description || 'No description provided';
        
        // Set source URL
        const urlElement = sourceCard.querySelector('.source-url');
        urlElement.href = source.url;
        urlElement.querySelector('.url-text').textContent = source.url;
        
        // Set source status indicator
        const statusIndicator = sourceCard.querySelector('.status-indicator');
        if (source.enabled !== false) {
            statusIndicator.classList.add('active');
            statusIndicator.title = 'Source is active';
        } else {
            statusIndicator.classList.add('inactive');
            statusIndicator.title = 'Source is inactive';
        }
        
        // Set toggle switch
        const toggleSwitch = sourceCard.querySelector('.source-toggle input');
        toggleSwitch.checked = source.enabled !== false;
        
        // Set article count
        sourceCard.querySelector('.articles-count').textContent = source.articleCount || 0;
        
        // Setup event listeners
        setupSourceEventListeners(sourceCard, index);
        
        return sourceCard;
    }
    
    function renderSourceListItem(source, index) {
        const template = document.getElementById('source-list-item-template');
        const sourceListItem = document.importNode(template.content, true).querySelector('.source-list-item');
        
        // Set data attributes
        sourceListItem.dataset.index = index;
        sourceListItem.dataset.url = source.url;
        sourceListItem.dataset.category = source.category || 'other';
        
        // Add category as a class for easier styling/filtering
        sourceListItem.classList.add(`category-${source.category || 'other'}`);
        
        // Set source name
        sourceListItem.querySelector('.source-name').textContent = source.name;
        
        // Set source category with a clearer indicator
        const categoryEl = sourceListItem.querySelector('.category-name');
        const categoryName = formatCategoryName(source.category || 'other');
        categoryEl.textContent = categoryName;
        categoryEl.classList.add(`category-tag-${source.category || 'other'}`);
        
        // Set source URL
        const urlElement = sourceListItem.querySelector('.source-url');
        urlElement.href = source.url;
        urlElement.querySelector('.url-text').textContent = source.url;
        
        // Set source status indicator
        const statusIndicator = sourceListItem.querySelector('.status-indicator');
        if (source.enabled !== false) {
            statusIndicator.classList.add('active');
            statusIndicator.title = 'Source is active';
        } else {
            statusIndicator.classList.add('inactive');
            statusIndicator.title = 'Source is inactive';
        }
        
        // Set toggle switch
        const toggleSwitch = sourceListItem.querySelector('.source-toggle input');
        toggleSwitch.checked = source.enabled !== false;
        
        // Set article count
        sourceListItem.querySelector('.articles-count').textContent = source.articleCount || 0;
        
        // Setup event listeners
        setupSourceEventListeners(sourceListItem, index);
        
        return sourceListItem;
    }
    
    function formatCategoryName(category) {
        return category
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    
    function setupSourceEventListeners(sourceCard, sourceIndex) {
        // Edit button
        sourceCard.querySelector('.edit-source').addEventListener('click', () => {
            openEditModal(sourceIndex);
        });
        
        // Delete button
        sourceCard.querySelector('.delete-source').addEventListener('click', () => {
            if (confirm(`Are you sure you want to delete "${settings.sources[sourceIndex].name}"?`)) {
                settings.sources.splice(sourceIndex, 1);
                renderSources();
                updateSourcesCount();
            }
        });
        
        // Toggle switch
        sourceCard.querySelector('.source-toggle input').addEventListener('change', (e) => {
            settings.sources[sourceIndex].enabled = e.target.checked;
            
            // Update status indicator
            const statusIndicator = sourceCard.querySelector('.status-indicator');
            if (e.target.checked) {
                statusIndicator.classList.remove('inactive');
                statusIndicator.classList.add('active');
                statusIndicator.title = 'Source is active';
            } else {
                statusIndicator.classList.remove('active');
                statusIndicator.classList.add('inactive');
                statusIndicator.title = 'Source is inactive';
            }
            
            updateSourcesCount();
        });
    }
    
    function openEditModal(sourceIndex) {
        currentEditIndex = sourceIndex;
        const source = settings.sources[sourceIndex];
        
        sourceNameInput.value = source.name || '';
        sourceCategoryInput.value = source.category || 'other';
        sourceUrlInput.value = source.url || '';
        sourceSelectorInput.value = source.selector || '';
        sourceDescriptionInput.value = source.description || '';
        sourceRatingInput.value = source.rating || 5;
        
        // Update modal title
        document.querySelector('.modal-header h2').textContent = 'Edit News Source';
        confirmAddSourceBtn.textContent = 'Save Changes';
        
        openModal();
    }
    
    function openModal() {
        addSourceModal.classList.add('active');
        sourceNameInput.focus();
    }
    
    function closeModal() {
        addSourceModal.classList.remove('active');
        
        // Reset form
        sourceNameInput.value = '';
        sourceCategoryInput.value = 'ai';
        sourceUrlInput.value = '';
        sourceSelectorInput.value = '';
        sourceDescriptionInput.value = '';
        sourceRatingInput.value = 5;
        
        // Reset edit index
        currentEditIndex = -1;
        
        // Reset modal title
        document.querySelector('.modal-header h2').textContent = 'Add News Source';
        confirmAddSourceBtn.textContent = 'Add Source';
    }
    
    function addNewSource() {
        // Validate required fields
        if (!sourceNameInput.value.trim()) {
            showStatus('Source name is required', 'error');
            sourceNameInput.focus();
            return;
        }
        
        if (!sourceUrlInput.value.trim()) {
            showStatus('Source URL is required', 'error');
            sourceUrlInput.focus();
            return;
        }
        
        if (!sourceSelectorInput.value.trim()) {
            showStatus('CSS selector is required', 'error');
            sourceSelectorInput.focus();
            return;
        }
        
        // Create source object
        const source = {
            name: sourceNameInput.value.trim(),
            category: sourceCategoryInput.value,
            url: sourceUrlInput.value.trim(),
            selector: sourceSelectorInput.value.trim(),
            description: sourceDescriptionInput.value.trim(),
            rating: parseInt(sourceRatingInput.value) || 5,
            enabled: true
        };
        
        if (currentEditIndex >= 0) {
            // Update existing source
            settings.sources[currentEditIndex] = source;
            showStatus(`Source "${source.name}" updated successfully`, 'success');
        } else {
            // Add new source
            settings.sources.push(source);
            showStatus(`Source "${source.name}" added successfully`, 'success');
        }
        
        // Close modal and render sources
        closeModal();
        renderSources();
        updateSourcesCount();
    }
    
    function setActiveCategory(category) {
        // Update current category
        currentCategory = category;
        
        // Update active class on tabs
        document.querySelectorAll('#category-tabs a').forEach(tab => {
            if (tab.dataset.category === category) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }
    
    function filterSourcesByCategory(category) {
        // Update currentCategory
        currentCategory = category;
        
        // Ensure all sources have a category
        if (category !== 'all') {
            // Check if any sources are missing a category
            const sourcesWithoutCategory = settings.sources.filter(source => !source.category || source.category === '');
            if (sourcesWithoutCategory.length > 0) {
                console.warn(`${sourcesWithoutCategory.length} sources have no category assigned`);
            }
        }
        
        // Re-render the sources with the current category filter
        renderSources();
    }
    
    function updateSourcesCount() {
        const totalSources = settings.sources.length;
        const activeSources = settings.sources.filter(source => source.enabled !== false).length;
        
        sourcesCountEl.textContent = `${totalSources} source${totalSources !== 1 ? 's' : ''}`;
        activeSourcesCountEl.textContent = `${activeSources} active`;
    }
    
    async function importAiSources() {
        try {
            showStatus('Importing AI sources...', 'info');
            
            // Use the direct API endpoint to import AI sources
            const response = await fetch('/api/import-ai-sources-direct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to import AI sources: ${response.status} ${response.statusText}`);
            }
            
            const result = await response.json();
            console.log('Import result:', result);
            
            if (result.success) {
                if (result.importedCount > 0) {
                    showStatus(`Successfully imported ${result.importedCount} AI sources.`, 'success');
                    
                    // Reload settings to get the updated sources
                    await loadSettings();
                    
                    // Re-render the sources
                    renderSources();
                    updateSourcesCount();
                    
                    // Set category to AI to show the imported sources
                    setActiveCategory('ai');
                    filterSourcesByCategory('ai');
                } else {
                    showStatus('All AI sources are already imported.', 'info');
                }
            } else {
                throw new Error(result.error || 'Unknown error during import');
            }
        } catch (error) {
            console.error('Error importing AI sources:', error);
            showStatus(`Error importing AI sources: ${error.message}`, 'error');
        }
    }
}); 