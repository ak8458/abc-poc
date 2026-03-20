/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards block (no images variant).
 * Base: cards. Source: https://www.ab.bluecross.ca/plans/personal/individual/blue-assured-plan.php
 * Selector: .card-group-3
 *
 * Source structure:
 *   .card-group-3 > .abc-card (x3)
 *     div: h3 (heading), p (description)
 *     a.primary-btn (CTA link)
 *
 * Target structure (Block Collection cards - no images):
 *   1 column, multiple rows. Each row = single cell with heading + description + CTA
 */
export default function parse(element, { document }) {
  const cards = element.querySelectorAll('.abc-card');

  const cells = [];

  cards.forEach((card) => {
    // Wrap all card content in a single cell container
    const cardWrapper = document.createElement('div');

    // Extract heading (h3 or any heading)
    const heading = card.querySelector('h3, h2, h4');
    if (heading) cardWrapper.appendChild(heading);

    // Extract description paragraph
    const desc = card.querySelector('p');
    if (desc) cardWrapper.appendChild(desc);

    // Extract CTA link
    const cta = card.querySelector('a.primary-btn, a.btn, a');
    if (cta) cardWrapper.appendChild(cta);

    // Each card = 1 row with 1 column
    cells.push([cardWrapper]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });
  element.replaceWith(block);
}
