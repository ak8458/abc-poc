import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Splits the product section (first footer div) into 4 columns:
 * address | support links | other links | social
 */
function buildProductSection(section) {
  section.classList.add('footer-product');
  const els = [...section.children];

  const colAddress = document.createElement('div');
  colAddress.classList.add('footer-col', 'footer-col-address');
  const colLinks1 = document.createElement('div');
  colLinks1.classList.add('footer-col', 'footer-col-links');
  const colLinks2 = document.createElement('div');
  colLinks2.classList.add('footer-col', 'footer-col-links');
  const colSocial = document.createElement('div');
  colSocial.classList.add('footer-col', 'footer-col-social');

  let phase = 'address';
  let ulsSeen = 0;

  els.forEach((el) => {
    // Detect "Connect with us" → social column
    if (el.tagName === 'P' && el.textContent.trim() === 'Connect with us') {
      el.classList.add('footer-social-title');
      phase = 'social';
    // Detect ULs → link columns
    } else if (el.tagName === 'UL') {
      ulsSeen += 1;
      phase = ulsSeen === 1 ? 'links1' : 'links2';
    // Detect "Support" heading → start of first link column
    } else if (phase === 'address' && el.querySelector?.('strong')?.textContent.trim() === 'Support') {
      phase = 'links1';
    }

    if (phase === 'social') {
      if (!el.classList.contains('footer-social-title')) el.classList.add('footer-social-icons');
      colSocial.append(el);
    } else if (phase === 'links2') colLinks2.append(el);
    else if (phase === 'links1') colLinks1.append(el);
    else colAddress.append(el);
  });

  section.append(colAddress, colLinks1, colLinks2, colSocial);
}

/**
 * Wraps the privacy section's text paragraphs into a single div
 * so they can be laid out as a flex row alongside the logo.
 */
function buildPrivacySection(section) {
  section.classList.add('footer-privacy');
  const els = [...section.children];
  if (els.length <= 1) return;

  const textDiv = document.createElement('div');
  textDiv.classList.add('footer-col-copyright');
  els.slice(1).forEach((el) => textDiv.append(el));
  section.append(textDiv);
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  const sections = [...footer.children];
  if (sections[0]) buildProductSection(sections[0]);
  if (sections[1]) sections[1].classList.add('footer-land-ack');
  if (sections[2]) buildPrivacySection(sections[2]);

  block.append(footer);
}
