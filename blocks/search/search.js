import { decorateIcons, createOptimizedPicture } from '../../scripts/aem.js';

const SEARCH_INDEX_PATH = '/query-index.json';

/**
 * Fetches the query index from the server.
 * @returns {Promise<Array>} Array of indexed pages
 */
async function fetchIndex() {
  try {
    const resp = await fetch(SEARCH_INDEX_PATH);
    if (!resp.ok) return [];
    const json = await resp.json();
    return json.data || [];
  } catch {
    return [];
  }
}

/**
 * Filters index entries by matching query terms against title, description, and path.
 * @param {Array} index The full query index
 * @param {string} query The search query
 * @returns {Array} Filtered results
 */
function filterResults(index, query) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  return index.filter((entry) => {
    const text = `${entry.title || ''} ${entry.description || ''} ${entry.path || ''}`.toLowerCase();
    return terms.every((term) => text.includes(term));
  });
}

/**
 * Renders search results into the results container.
 * @param {Array} results Filtered search results
 * @param {Element} container The results container element
 */
function renderResults(results, container) {
  container.textContent = '';

  if (results.length === 0) {
    const noResults = document.createElement('p');
    noResults.className = 'search-no-results';
    noResults.textContent = 'No results found.';
    container.append(noResults);
    return;
  }

  const list = document.createElement('ul');
  list.className = 'search-results-list';

  results.forEach((result) => {
    const item = document.createElement('li');
    item.className = 'search-result';

    if (result.image) {
      const imageWrapper = document.createElement('div');
      imageWrapper.className = 'search-result-image';
      const pic = createOptimizedPicture(result.image, result.title || '', false, [{ width: '300' }]);
      imageWrapper.append(pic);
      item.append(imageWrapper);
    }

    const body = document.createElement('div');
    body.className = 'search-result-body';

    const title = document.createElement('h3');
    title.className = 'search-result-title';
    const link = document.createElement('a');
    link.href = result.path;
    link.textContent = result.title || result.path;
    title.append(link);
    body.append(title);

    if (result.description) {
      const desc = document.createElement('p');
      desc.className = 'search-result-description';
      desc.textContent = result.description;
      body.append(desc);
    }

    const path = document.createElement('p');
    path.className = 'search-result-path';
    path.textContent = result.path;
    body.append(path);

    item.append(body);
    list.append(item);
  });

  container.append(list);
}

/**
 * Performs search: fetches index, filters, and renders results.
 * @param {string} query The search query
 * @param {Element} container The results container
 */
async function performSearch(query, container) {
  container.textContent = '';

  const loading = document.createElement('p');
  loading.className = 'search-loading';
  loading.textContent = 'Searching...';
  container.append(loading);

  const index = await fetchIndex();
  const results = filterResults(index, query);
  renderResults(results, container);
}

/**
 * loads and decorates the search block
 * @param {Element} block The search block element
 */
export default async function decorate(block) {
  const placeholder = block.textContent.trim() || 'Search...';

  block.textContent = '';

  const form = document.createElement('form');
  form.className = 'search-form';
  form.role = 'search';

  const inputWrapper = document.createElement('div');
  inputWrapper.className = 'search-input-wrapper';

  const input = document.createElement('input');
  input.type = 'search';
  input.className = 'search-input';
  input.placeholder = placeholder;
  input.setAttribute('aria-label', placeholder);

  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'search-button';
  button.setAttribute('aria-label', 'Search');

  const icon = document.createElement('span');
  icon.classList.add('icon', 'icon-search');
  button.append(icon);

  inputWrapper.append(input, button);
  form.append(inputWrapper);

  const resultsContainer = document.createElement('div');
  resultsContainer.className = 'search-results';
  resultsContainer.setAttribute('aria-live', 'polite');

  block.append(form, resultsContainer);

  decorateIcons(block);

  // Handle form submission: search on current page
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (query) {
      window.location.href = `${window.location.pathname}?q=${encodeURIComponent(query)}`;
    }
  });

  // If ?q= is in the URL, pre-fill input and run search
  const params = new URLSearchParams(window.location.search);
  const urlQuery = params.get('q');
  if (urlQuery) {
    input.value = urlQuery;
    await performSearch(urlQuery, resultsContainer);
  }
}
