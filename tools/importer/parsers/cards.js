/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards block (no images variant).
 * Base: cards. Source: careers.ab.bluecross.ca
 * Source DOM: .abc-grid-list elements each with h3, .row containing
 *   paragraph description and ul.abc-columns bullet list
 */
export default function parse(element, { document }) {
  // Each .abc-grid-list is a card. Element may be the container with multiple .abc-grid-list children
  const gridItems = element.querySelectorAll('.abc-grid-list');
  const items = gridItems.length > 0 ? Array.from(gridItems) : [element];

  const cells = [];

  items.forEach((item) => {
    const heading = item.querySelector('h3, h4');
    const description = item.querySelector('.col-12.col-lg-4 p, .row p:first-of-type');
    const list = item.querySelector('ul.abc-columns, ul');

    const cardCell = [];
    if (heading) cardCell.push(heading);
    if (description) cardCell.push(description);
    if (list) cardCell.push(list);

    if (cardCell.length > 0) {
      cells.push(cardCell);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });
  element.replaceWith(block);
}
