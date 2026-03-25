/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-resource. Base: columns.
 * Source: https://www.ab.bluecross.ca/index.php
 * Selectors from .resource-grid containing .grid-resource.resource-wide items
 * Columns block library: 2 columns per row (text | image)
 */
export default function parse(element, { document }) {
  const resourceItems = element.querySelectorAll('.grid-resource');
  const cells = [];

  resourceItems.forEach((item) => {
    const row = item.querySelector('.row');
    if (!row) return;

    const cols = row.querySelectorAll('[class*="col-"]');

    // First col has text content, second col has image
    const textCol = cols[0];
    const imgCol = cols[1];

    // Build text cell
    const textCell = document.createElement('div');
    if (textCol) {
      const heading = textCol.querySelector('h3');
      const para = textCol.querySelector('p');
      const cta = textCol.querySelector('a.primary-btn, a');
      if (heading) textCell.appendChild(heading);
      if (para) textCell.appendChild(para);
      if (cta) textCell.appendChild(cta);
    }

    // Build image cell
    const imgCell = document.createElement('div');
    if (imgCol) {
      const img = imgCol.querySelector('img');
      if (img) imgCell.appendChild(img);
    }

    cells.push([textCell, imgCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-resource', cells });
  element.replaceWith(block);
}
