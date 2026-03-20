/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero block.
 * Base: hero. Source: https://www.ab.bluecross.ca/plans/personal/individual/blue-assured-plan.php
 * Selector: .banner-container
 *
 * Source structure:
 *   .banner-container > .hero-banner-grid
 *     .grid-banner-content: h1.banner-h1, p (description), a.primary-btn (CTA), .abc-card (phone contact)
 *     .grid-banner-img: img (hero image - may be CSS bg converted to img by scraper)
 *
 * Target structure (Block Collection hero - 1 column):
 *   Row 1: Background image (optional - single cell)
 *   Row 2: Heading + subheading + CTA (single cell with all content)
 */
export default function parse(element, { document }) {
  // Extract hero image from right column
  const heroImage = element.querySelector('.grid-banner-img img, .blue-assured-result img');

  // Extract heading
  const heading = element.querySelector('h1.banner-h1, h1, h2');

  // Extract description paragraph (first p in content area, not inside .abc-card)
  const contentArea = element.querySelector('.grid-banner-content');
  const description = contentArea
    ? contentArea.querySelector(':scope > p:not(.banner-heading)')
    : element.querySelector('p');

  // Extract primary CTA link
  const ctaLink = element.querySelector('a.primary-btn, a.ba-quote-button');

  // Extract phone contact card content
  const phoneCard = element.querySelector('.abc-card');

  // Build cells array matching hero block library structure (1 column)
  const cells = [];

  // Row 1: Background/hero image (optional)
  if (heroImage) {
    cells.push([heroImage]);
  }

  // Row 2: All content in a single cell (1 column)
  const contentWrapper = document.createElement('div');
  if (heading) contentWrapper.appendChild(heading);
  if (description) contentWrapper.appendChild(description);
  if (ctaLink) contentWrapper.appendChild(ctaLink);
  if (phoneCard) contentWrapper.appendChild(phoneCard);
  cells.push([contentWrapper]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
