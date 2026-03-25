/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-homepage. Base: hero.
 * Source: https://www.ab.bluecross.ca/index.php
 * Selectors from .banner-container .hero-banner-grid
 */
export default function parse(element, { document }) {
  // Extract hero image from .homepage-banner, .grid-banner-img, or any img in the element
  const heroImg = element.querySelector('.homepage-banner img, .grid-banner-img img, img');

  // Extract heading from .grid-banner-content
  const heading = element.querySelector('.banner-h1, h1, h2');
  const description = element.querySelector('.grid-banner-content p:not(.banner-heading), .grid-banner-content p.margin-t-16');

  const cells = [];

  // Row 1: Background image (per hero block library: row 2 = image)
  if (heroImg) {
    cells.push([heroImg]);
  }

  // Row 2: Heading + description in single cell (per hero block library: row 3 = text content)
  const contentDiv = document.createElement('div');
  if (heading) contentDiv.appendChild(heading);
  if (description) contentDiv.appendChild(description);
  cells.push([contentDiv]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-homepage', cells });
  element.replaceWith(block);
}
