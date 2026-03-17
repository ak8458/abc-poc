/* eslint-disable */
/* global WebImporter */

/**
 * Parser for quote block.
 * Handles both .stat-callout (big number + text) and .info-box (highlighted text).
 * Source: https://www.ab.bluecross.ca/resources/health-wellness/womens-health/cost-of-overlooking-menopause.php
 * Selectors: .stat-callout, .info-box
 */
export default function parse(element, { document }) {
  const cell = [];

  // Handle stat-callout: extract the big number as a heading and the description
  const statNumber = element.querySelector('.stat-number');
  if (statNumber) {
    const h2 = document.createElement('h2');
    h2.textContent = statNumber.textContent.trim();
    cell.push(h2);
  }

  const statText = element.querySelector('.stat-text');
  if (statText) {
    cell.push(statText);
  }

  // Handle info-box: extract all paragraph content
  if (!statNumber && !statText) {
    const paragraphs = element.querySelectorAll('p');
    paragraphs.forEach((p) => cell.push(p));
  }

  if (cell.length === 0) return;

  const cells = [[cell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'quote', cells });
  element.replaceWith(block);
}
