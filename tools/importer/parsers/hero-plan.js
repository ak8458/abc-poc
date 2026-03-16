/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-plan variant.
 * Base block: hero
 * Source: https://www.ab.bluecross.ca/plans/personal/individual/blue-choice-plan.php
 * Selector: .hero-banner-grid
 *
 * Source structure:
 *   .hero-banner-grid
 *     .grid-banner-content
 *       h1.banner-h1 (heading)
 *       p (description)
 *       a.primary-btn (CTA)
 *       .abc-card (phone contact card)
 *     .grid-banner-img
 *       img (hero image)
 *
 * Target: hero block with image row + content row
 */
export default function parse(element, { document }) {
  // Extract hero image - try img element first, then CSS background-image
  let heroImg = element.querySelector('.grid-banner-img img, .blue-choice-result img, .grid-banner-img picture img')
    || element.querySelector(':scope > div:not(.grid-banner-content) img');

  // If no img element found, check for CSS background-image on the banner div
  if (!heroImg) {
    const bgDiv = element.querySelector('.grid-banner-img, [class*="grid-banner-img"]');
    if (bgDiv) {
      const style = bgDiv.getAttribute('style') || '';
      const bgMatch = style.match(/url\(["']?([^"')]+)["']?\)/);
      if (bgMatch) {
        heroImg = document.createElement('img');
        heroImg.src = bgMatch[1];
        heroImg.alt = '';
      }
    }
    // Fallback: check class-based known hero images
    if (!heroImg) {
      const bgDiv2 = element.querySelector('[class*="result"][class*="grid-banner"]');
      if (bgDiv2) {
        const cls = bgDiv2.className || '';
        if (cls.includes('blue-choice')) {
          heroImg = document.createElement('img');
          heroImg.src = 'https://www.ab.bluecross.ca/images/hero-banners/blue-choice_md.webp';
          heroImg.alt = 'Couple laughing outdoors';
        }
      }
    }
  }

  // Extract heading
  const heading = element.querySelector('h1, .banner-h1, h2');

  // Extract description paragraph (first non-empty p in content area)
  const contentArea = element.querySelector('.grid-banner-content') || element;
  const descriptionP = contentArea.querySelector('p.margin-t-16, p:not(.banner-heading):not(.margin-b-0)');

  // Extract CTA button
  const ctaLink = contentArea.querySelector('a.primary-btn, a.bc-quote-button, a[href*="quote"]');

  // Extract contact card content
  const contactCard = contentArea.querySelector('.abc-card');

  const cells = [];

  // Row 1: Hero image (if present)
  if (heroImg) {
    cells.push([heroImg]);
  }

  // Row 2: Content - heading, description, CTA, contact card stacked in one cell
  const contentCell = document.createElement('div');
  if (heading) contentCell.append(heading);
  if (descriptionP) contentCell.append(descriptionP);
  if (ctaLink) contentCell.append(ctaLink);
  if (contactCard) contentCell.append(contactCard);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-plan', cells });
  element.replaceWith(block);
}
