/**
 * Travel Recommendation Web Application
 * Handles API fetching, dynamic keyword search, destination rendering, time zones, and UI interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('btn-search');
  const clearBtn = document.getElementById('btn-clear');
  const resultsPanel = document.getElementById('recommendations-panel');
  const cardsContainer = document.getElementById('cards-container');
  const resultsCount = document.getElementById('results-count');
  const bookNowBtn = document.getElementById('btn-book-now');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  // Load API Data Cache
  let travelData = null;

  async function fetchTravelData() {
    if (travelData) return travelData;
    try {
      const response = await fetch('travel_recommendation_api.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      travelData = await response.json();
      return travelData;
    } catch (error) {
      console.error('Error fetching travel recommendation data:', error);
      return null;
    }
  }

  // Initial fetch to prime cache
  fetchTravelData();

  // Search Action
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        performSearch();
      }
    });
  }

  // Clear Action
  if (clearBtn) {
    clearBtn.addEventListener('click', clearSearch);
  }

  // Book Now Button
  if (bookNowBtn) {
    bookNowBtn.addEventListener('click', () => {
      openModal(
        'Start Your Journey!',
        'Thank you for your interest! Our travel experts are ready to curate your dream itinerary. Contact us or explore recommendations to book today.'
      );
    });
  }

  // Modal Close
  if (modalCloseBtn && modalOverlay) {
    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // Contact Form Submission
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name')?.value || 'Guest';
      if (formStatus) {
        formStatus.textContent = `Thank you, ${name}! Your message has been received. Our team will contact you shortly.`;
        formStatus.className = 'form-status success';
        contactForm.reset();
        setTimeout(() => {
          formStatus.style.display = 'none';
        }, 6000);
      }
    });
  }

  // Perform Search Logic
  async function performSearch() {
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
      if (cardsContainer && resultsPanel) {
        resultsPanel.classList.add('active');
        resultsCount.textContent = '0 found';
        cardsContainer.innerHTML = `
          <div class="no-results">
            <h4>Please enter a search keyword</h4>
            <p>Try searching for <strong>"beach"</strong>, <strong>"temple"</strong>, or a country like <strong>"Japan"</strong>, <strong>"Australia"</strong>, or <strong>"Brazil"</strong>.</p>
          </div>
        `;
      }
      return;
    }

    const data = await fetchTravelData();
    if (!data) {
      if (cardsContainer && resultsPanel) {
        resultsPanel.classList.add('active');
        cardsContainer.innerHTML = `
          <div class="no-results">
            <h4>Error Loading Recommendations</h4>
            <p>Unable to load destination data. Please make sure the JSON API is accessible.</p>
          </div>
        `;
      }
      return;
    }

    const results = [];

    // 1. Keyword check for Beach / Beaches
    if (query === 'beach' || query === 'beaches') {
      if (data.beaches && Array.isArray(data.beaches)) {
        data.beaches.forEach(item => results.push({ ...item, category: 'Beach' }));
      }
    }
    // 2. Keyword check for Temple / Temples
    else if (query === 'temple' || query === 'temples') {
      if (data.temples && Array.isArray(data.temples)) {
        data.temples.forEach(item => results.push({ ...item, category: 'Temple' }));
      }
    }
    // 3. Keyword check for Country / Countries
    else if (query === 'country' || query === 'countries') {
      if (data.countries && Array.isArray(data.countries)) {
        data.countries.forEach(c => {
          if (c.cities && Array.isArray(c.cities)) {
            c.cities.forEach(city => results.push({ ...city, category: c.name, timeZone: city.timeZone || c.timeZone }));
          }
        });
      }
    }
    // 4. Specific Country Check (e.g. "australia", "japan", "brazil")
    else {
      let matchedCountry = null;
      if (data.countries && Array.isArray(data.countries)) {
        matchedCountry = data.countries.find(c => c.name.toLowerCase() === query || c.name.toLowerCase().includes(query));
      }

      if (matchedCountry && matchedCountry.cities) {
        matchedCountry.cities.forEach(city => {
          results.push({ ...city, category: matchedCountry.name, timeZone: city.timeZone || matchedCountry.timeZone });
        });
      } else {
        // 5. Generic Keyword Search across all categories
        // Search in countries & cities
        if (data.countries) {
          data.countries.forEach(c => {
            if (c.cities) {
              c.cities.forEach(city => {
                if (
                  city.name.toLowerCase().includes(query) ||
                  city.description.toLowerCase().includes(query)
                ) {
                  results.push({ ...city, category: c.name, timeZone: city.timeZone || c.timeZone });
                }
              });
            }
          });
        }
        // Search in temples
        if (data.temples) {
          data.temples.forEach(temple => {
            if (
              temple.name.toLowerCase().includes(query) ||
              temple.description.toLowerCase().includes(query)
            ) {
              results.push({ ...temple, category: 'Temple' });
            }
          });
        }
        // Search in beaches
        if (data.beaches) {
          data.beaches.forEach(beach => {
            if (
              beach.name.toLowerCase().includes(query) ||
              beach.description.toLowerCase().includes(query)
            ) {
              results.push({ ...beach, category: 'Beach' });
            }
          });
        }
      }
    }

    renderResults(results, query);
  }

  // Render Results Cards
  function renderResults(results, query) {
    if (!resultsPanel || !cardsContainer) return;

    resultsPanel.classList.add('active');
    cardsContainer.innerHTML = '';

    if (results.length === 0) {
      if (resultsCount) resultsCount.textContent = '0 found';
      cardsContainer.innerHTML = `
        <div class="no-results">
          <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <h4>No destinations found for "${escapeHtml(query)}"</h4>
          <p>Try searching for keywords like <strong>"beach"</strong>, <strong>"temple"</strong>, <strong>"australia"</strong>, <strong>"japan"</strong>, or <strong>"brazil"</strong>.</p>
        </div>
      `;
      return;
    }

    if (resultsCount) {
      resultsCount.textContent = `${results.length} destination${results.length > 1 ? 's' : ''}`;
    }

    results.forEach(item => {
      const card = document.createElement('div');
      card.className = 'destination-card';

      // Local time formatting if timeZone is available
      let localTimeString = '';
      if (item.timeZone) {
        try {
          const options = {
            timeZone: item.timeZone,
            hour12: true,
            hour: 'numeric',
            minute: 'numeric',
            timeZoneName: 'short'
          };
          localTimeString = new Date().toLocaleTimeString('en-US', options);
        } catch (e) {
          localTimeString = '';
        }
      }

      card.innerHTML = `
        <div class="card-img-wrapper">
          <img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.name)}" class="card-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'" />
          ${localTimeString ? `
            <div class="card-time-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
              <span>${escapeHtml(localTimeString)}</span>
            </div>
          ` : ''}
        </div>
        <div class="card-body">
          <h3 class="card-title">${escapeHtml(item.name)}</h3>
          <p class="card-desc">${escapeHtml(item.description)}</p>
          <button class="btn-visit" data-name="${escapeHtml(item.name)}" data-desc="${escapeHtml(item.description)}">
            Visit Destination
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42L16.86 11H5v2z"/></svg>
          </button>
        </div>
      `;

      // Attach listener for Visit button
      const visitBtn = card.querySelector('.btn-visit');
      if (visitBtn) {
        visitBtn.addEventListener('click', () => {
          openModal(
            `Discover ${item.name}`,
            `${item.description}\n\nReady to embark on an unforgettable adventure? Our booking specialists can arrange flights, guided tours, and premium accommodations for ${item.name}.`
          );
        });
      }

      cardsContainer.appendChild(card);
    });
  }

  // Clear Search
  function clearSearch() {
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
    }
    if (resultsPanel) {
      resultsPanel.classList.remove('active');
    }
    if (cardsContainer) {
      cardsContainer.innerHTML = '';
    }
    if (resultsCount) {
      resultsCount.textContent = '0 found';
    }
  }

  // Modal Helpers
  function openModal(title, description) {
    if (modalTitle) modalTitle.textContent = title;
    if (modalDesc) modalDesc.textContent = description;
    if (modalOverlay) modalOverlay.classList.add('active');
  }

  function closeModal() {
    if (modalOverlay) modalOverlay.classList.remove('active');
  }

  // Helper to escape HTML characters safely
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});

