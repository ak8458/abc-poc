/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block.
 * Base block: columns. Two-column layout (60/40).
 * Source: https://www.ab.bluecross.ca/resources/health-wellness/womens-health/menopause-guide.php
 * Selector: main > .container-fluid > .container > .row
 */
export default function parse(element, { document }) {
  // Left column: intro text paragraphs + next link
  const leftCol = element.querySelector('.col-lg-7, .col-12:first-child');
  const leftCell = [];

  if (leftCol) {
    // Gather all paragraphs from the text content area
    const paragraphs = leftCol.querySelectorAll(':scope > .text-columns p, :scope > p');
    paragraphs.forEach((p) => leftCell.push(p));
  }

  // Right column: PDF download card
  const rightCol = element.querySelector('.col-lg-5, .col-12:last-child');
  const rightCell = [];

  if (rightCol) {
    const card = rightCol.querySelector('.pdf-download-card');
    if (card) {
      const heading = card.querySelector('h3');
      if (heading) rightCell.push(heading);

      const desc = card.querySelector('p');
      if (desc) rightCell.push(desc);

      const cta = card.querySelector('a.primary-btn, a[class*="btn"]');
      if (cta) rightCell.push(cta);
    }
  }

  const cells = [
    [leftCell, rightCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
