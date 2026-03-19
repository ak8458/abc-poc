/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-plan variant.
 * Base block: cards
 * Source: https://www.ab.bluecross.ca/plans/personal/individual/blue-choice-plan.php
 * Selector: .card-group-3
 *
 * Source structure:
 *   .card-group-3
 *     .abc-card (×3)
 *       div
 *         h3 (card title)
 *         p (card description)
 *       a.primary-btn (CTA link)
 *
 * Target: cards block with one row per card [card content]
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll('.abc-card'));

  const cells = [];

  cards.forEach((card) => {
    const cardCell = document.createElement('div');

    // Extract heading
    const heading = card.querySelector('h3');
    if (heading) cardCell.append(heading);

    // Extract description
    const description = card.querySelector('p');
    if (description) cardCell.append(description);

    // Extract CTA link
    const ctaLink = card.querySelector('a.primary-btn, a.btn');
    if (ctaLink) {
      const p = document.createElement('p');
      p.append(ctaLink);
      cardCell.append(p);
    }

    cells.push([cardCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-plan', cells });
  element.replaceWith(block);
}
