/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-guide variant.
 * Base block: cards (no images). Text-only cards in a grid.
 * Source: https://www.ab.bluecross.ca/resources/health-wellness/womens-health/menopause-guide.php
 * Selector: .menopause-grid
 */
export default function parse(element, { document }) {
  const cards = element.querySelectorAll('.menopause-card');
  const cells = [];

  cards.forEach((card) => {
    const cardCell = [];

    // Card heading (h3, may contain a link or strong text)
    const heading = card.querySelector('.menopause-card--header h3, h3');
    if (heading) cardCell.push(heading);

    // Card description
    const desc = card.querySelector('.menopause-card--body p, .menopause-card--body');
    if (desc) cardCell.push(desc);

    if (cardCell.length > 0) {
      // Single column per row: wrap all card content in one cell
      cells.push([cardCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-guide', cells });
  element.replaceWith(block);
}
