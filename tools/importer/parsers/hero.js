/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block.
 * Base: hero. Source: careers.ab.bluecross.ca
 * Source DOM: .abc-hero-banner with .abc-hero-banner__bkg img,
 *   .abc-hero-banner__header h1, .abc-hero-banner__paragraph p,
 *   .abc-hero-banner__buttons a
 */
export default function parse(element, { document }) {
  // Extract background image (row 1)
  const bgImg = element.querySelector('.abc-hero-banner__bkg img, .abc-hero-banner img:first-of-type');

  // Extract content (row 2): heading, paragraph, CTA
  const heading = element.querySelector('.abc-hero-banner__header h1, h1');
  const description = element.querySelector('.abc-hero-banner__paragraph, .abc-hero-banner__content p');
  const ctaLinks = Array.from(element.querySelectorAll('.abc-hero-banner__buttons a, .abc-button'));

  const cells = [];

  // Row 1: background image (optional per block library)
  if (bgImg) {
    cells.push([bgImg]);
  }

  // Row 2: heading + text + CTA (content cell)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  contentCell.push(...ctaLinks);
  cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
