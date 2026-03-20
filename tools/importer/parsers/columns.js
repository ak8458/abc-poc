/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns block.
 * Base: columns. Source: https://www.ab.bluecross.ca/plans/personal/individual/blue-assured-plan.php
 * Selector: .plan-blue-callout
 *
 * Source structure:
 *   .plan-blue-callout
 *     div: img (webpage icon)
 *     div: h2 (heading), p (description), a (CTA link), p (phone text with tel link)
 *
 * Target structure (Block Collection columns):
 *   2 columns per row. Col 1 = image/icon, Col 2 = text content
 */
export default function parse(element, { document }) {
  // Extract icon image from first child div
  const iconDiv = element.querySelector(':scope > div:first-child');
  const icon = iconDiv ? iconDiv.querySelector('img') : null;

  // Extract text content from second child div
  const textDiv = element.querySelector(':scope > div:last-child');

  // Build cells array: 1 row with 2 columns (icon | content)
  const cells = [];

  const col1 = document.createElement('div');
  if (icon) col1.appendChild(icon);

  const col2 = document.createElement('div');
  if (textDiv) {
    // Move all children from the text div into col2
    while (textDiv.firstChild) {
      col2.appendChild(textDiv.firstChild);
    }
  }

  cells.push([col1, col2]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
