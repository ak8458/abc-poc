/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-news. Base: cards.
 * Source: https://www.ab.bluecross.ca/index.php
 * Selectors from .row.same-height containing .card-grey items
 * Cards block library: 2 columns per row (image | text content)
 */
export default function parse(element, { document }) {
  // Each card is in a .col containing a .card-grey
  const cardItems = element.querySelectorAll('.card-grey');
  const cells = [];

  cardItems.forEach((card) => {
    // Extract image (optional - some cards have no image)
    const img = card.querySelector('.latest-news-img img, img');

    // Extract text content: h3, paragraphs, links
    const heading = card.querySelector('h3');
    const paragraphs = card.querySelectorAll('p');
    const link = card.querySelector('a:not(p a)');

    // Build image cell (empty div if no image)
    const imgCell = document.createElement('div');
    if (img) imgCell.appendChild(img);

    // Build text cell with heading + description + CTA
    const textCell = document.createElement('div');
    if (heading) textCell.appendChild(heading);
    paragraphs.forEach((p) => textCell.appendChild(p));
    if (link) textCell.appendChild(link);

    cells.push([imgCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-news', cells });
  element.replaceWith(block);
}
