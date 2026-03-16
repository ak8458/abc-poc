/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-features variant.
 * Base block: columns
 * Source: https://www.ab.bluecross.ca/plans/personal/individual/blue-choice-plan.php
 * Selector: .row.grey-callout
 *
 * Source structure:
 *   .row.grey-callout
 *     .col-lg-8 (content column)
 *       h2 (heading)
 *       ul.check-list (6 benefit items with checkmark icons)
 *       a (PDF download link)
 *     .col-lg-4 (image column)
 *       img.circle-img (circular image)
 *
 * Target: columns block with one row of [content | image]
 */
export default function parse(element, { document }) {
  // Extract the content column (left side)
  const contentCol = element.querySelector('.col-lg-8, .col-md-8');

  // Extract the image column (right side)
  const imageCol = element.querySelector('.col-lg-4, .col-md-4');
  const circleImg = imageCol ? imageCol.querySelector('img') : element.querySelector('img.circle-img');

  const cells = [];

  // Build content cell: heading + checklist + PDF link
  const contentCell = document.createElement('div');

  const heading = contentCol ? contentCol.querySelector('h2') : element.querySelector('h2');
  if (heading) contentCell.append(heading);

  const checkList = contentCol ? contentCol.querySelector('ul.check-list, ul') : element.querySelector('ul.check-list');
  if (checkList) contentCell.append(checkList);

  const pdfLink = contentCol ? contentCol.querySelector('a[href*=".pdf"]') : element.querySelector('a[href*=".pdf"]');
  if (pdfLink) {
    const p = document.createElement('p');
    p.append(pdfLink);
    contentCell.append(p);
  }

  // Build image cell
  const imageCell = document.createElement('div');
  if (circleImg) imageCell.append(circleImg);

  // Single row: [content | image]
  cells.push([contentCell, imageCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-features', cells });
  element.replaceWith(block);
}
