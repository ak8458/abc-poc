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
  // Extract hero image - try multiple selectors for live page variations
  const heroImg = element.querySelector('.grid-banner-img img, .blue-choice-result img, .grid-banner-img picture img')
    || element.querySelector(':scope > div:not(.grid-banner-content) img');

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
