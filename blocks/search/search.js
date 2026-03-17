import { decorateIcons } from '../../scripts/aem.js';

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
  form.addEventListener('submit', (e) => e.preventDefault());

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
  block.append(form);

  decorateIcons(block);
}
