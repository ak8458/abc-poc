import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Splits the product section (first footer div) into 4 columns:
 * address | support links | other links | social
 *
 * Supports two content structures:
 *  - Columns block (3-col table): [address col] [links col with 2 ULs] [social col]
 *  - Flat content: P / UL / STRONG elements as direct children
 */
function buildProductSection(section) {
  section.classList.add('footer-product');

  const colAddress = document.createElement('div');
  colAddress.classList.add('footer-col', 'footer-col-address');
  const colLinks1 = document.createElement('div');
  colLinks1.classList.add('footer-col', 'footer-col-links');
  const colLinks2 = document.createElement('div');
  colLinks2.classList.add('footer-col', 'footer-col-links');
  const colSocial = document.createElement('div');
  colSocial.classList.add('footer-col', 'footer-col-social');

  const columnsBlock = section.querySelector('.columns');
  if (columnsBlock && columnsBlock.firstElementChild) {
    // Content authored as a 3-column table: address | support+links | social
    const [addrCol, linksCol, socialCol] = [...columnsBlock.firstElementChild.children];
    if (addrCol) colAddress.append(...addrCol.children);
    if (linksCol) {
      let ulsSeen = 0;
      [...linksCol.children].forEach((el) => {
        if (el.tagName === 'UL') {
          ulsSeen += 1;
          if (ulsSeen === 2) { colLinks2.append(el); return; }
        }
        colLinks1.append(el);
      });
    }
    if (socialCol) {
      [...socialCol.children].forEach((el) => {
        if (el.tagName === 'P' && el.textContent.trim() === 'Connect with us') {
          el.classList.add('footer-social-title');
        } else {
          el.classList.add('footer-social-icons');
        }
        colSocial.append(el);
      });
    }
    columnsBlock.parentElement.remove();
  } else {
    // Flat content structure
    const els = [...section.children];
    let phase = 'address';
    let ulsSeen = 0;

    els.forEach((el) => {
      if (el.tagName === 'P' && el.textContent.trim() === 'Connect with us') {
        el.classList.add('footer-social-title');
        phase = 'social';
      } else if (el.tagName === 'UL') {
        ulsSeen += 1;
        phase = ulsSeen === 1 ? 'links1' : 'links2';
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
  }

  section.append(colAddress, colLinks1, colLinks2, colSocial);
}

/**
 * Restructures the land acknowledgement section so that at wide viewports
 * the h2 and the body text can sit in two separate flex columns.
 */
function buildLandAckSection(section) {
  section.classList.add('footer-land-ack');
  // Unwrap default-content-wrapper inserted by decorateSections
  const wrapper = section.querySelector('.default-content-wrapper');
  if (!wrapper) return;
  [...wrapper.children].forEach((el) => section.insertBefore(el, wrapper));
  wrapper.remove();
  // Wrap paragraphs after the h2 into a single div for the two-column layout
  const h2 = section.querySelector('h2');
  if (!h2) return;
  const textDiv = document.createElement('div');
  while (h2.nextElementSibling) textDiv.append(h2.nextElementSibling);
  section.append(textDiv);
}

/**
 * Wraps the privacy section's text paragraphs into a single div
 * so they can be laid out as a flex row alongside the logo.
 */
function buildPrivacySection(section) {
  section.classList.add('footer-privacy');
  // Unwrap default-content-wrapper inserted by decorateSections
  const wrapper = section.querySelector('.default-content-wrapper');
  if (wrapper) {
    [...wrapper.children].forEach((el) => section.insertBefore(el, wrapper));
    wrapper.remove();
  }
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
  if (sections[1]) buildLandAckSection(sections[1]);
  if (sections[2]) buildPrivacySection(sections[2]);

  block.append(footer);
}
