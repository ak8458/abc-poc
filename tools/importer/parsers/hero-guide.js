/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-guide variant.
 * Base block: hero. Side-by-side layout: text left, image right.
 * Source: https://www.ab.bluecross.ca/resources/health-wellness/womens-health/menopause-guide.php
 * Selector: .banner-container .hero-banner-grid
 */
export default function parse(element, { document }) {
  // Extract text content from .grid-banner-content
  const contentDiv = element.querySelector('.grid-banner-content');
  const contentCell = [];

  if (contentDiv) {
    // Category label (p.banner-heading)
    const categoryLabel = contentDiv.querySelector('.banner-heading, p:first-child');
    if (categoryLabel) contentCell.push(categoryLabel);

    // Main heading (h1)
    const heading = contentDiv.querySelector('h1, .banner-h1');
    if (heading) contentCell.push(heading);

    // Description paragraph(s) - remaining p elements after category and heading
    const paragraphs = contentDiv.querySelectorAll('p:not(.banner-heading)');
    paragraphs.forEach((p) => contentCell.push(p));
  }

  // Extract image from .grid-banner-img
  const imageDiv = element.querySelector('.grid-banner-img, [class*="banner-img"]');
  const imageCell = [];
  if (imageDiv) {
    const img = imageDiv.querySelector('img');
    if (img) imageCell.push(img);
  }

  const cells = [
    [contentCell, imageCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-guide', cells });
  element.replaceWith(block);
}
