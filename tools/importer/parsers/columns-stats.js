/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block (stats variant).
 * Extracts 3-column statistics grid, drops SVG icons (decorative), keeps text.
 * Source: https://www.ab.bluecross.ca/resources/health-wellness/womens-health/cost-of-overlooking-menopause.php
 * Selector: section#impact-economy > .row
 */
export default function parse(element, { document }) {
  const cols = element.querySelectorAll('.col-12.col-md-4, [class*="col-md-4"]');
  if (cols.length === 0) return;

  const row = [];
  cols.forEach((col) => {
    const cellContent = [];

    // Get the text paragraph (skip SVG icon images)
    const paragraphs = col.querySelectorAll('p');
    paragraphs.forEach((p) => cellContent.push(p));

    row.push(cellContent);
  });

  if (row.length === 0) return;

  const cells = [row];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
