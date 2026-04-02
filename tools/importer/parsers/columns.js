/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block.
 * Base: columns. Source: careers.ab.bluecross.ca
 * Source DOM: Various 2-column layouts using .row > .col-12 pattern,
 *   or section-level containers with text + image/video side by side.
 *   Handles: text+video (.abc-bgc-grey8), text+image (.abc-section-bottom-photo),
 *   testimonial (.abc-testimonial), CTA (.abc-cta .abc-join-team)
 */
export default function parse(element, { document }) {
  // Find column containers - try .row first, then direct children divs
  const row = element.querySelector('.row');
  const colContainer = row || element;
  const cols = Array.from(colContainer.querySelectorAll(':scope > div[class*="col-"]'));

  // If no Bootstrap columns found, try direct child divs
  const columnDivs = cols.length >= 2 ? cols : Array.from(colContainer.querySelectorAll(':scope > div'));

  if (columnDivs.length < 2) {
    // Fallback: treat entire element as single column
    const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells: [[element.innerHTML]] });
    element.replaceWith(block);
    return;
  }

  // Build cells - one row with N columns
  const cellRow = [];

  columnDivs.forEach((col) => {
    const cellContent = [];

    // Check for video iframe (Vimeo embed)
    const iframe = col.querySelector('iframe[src*="vimeo"], iframe[src*="youtube"]');
    if (iframe) {
      const videoSrc = iframe.getAttribute('src');
      // Extract Vimeo video URL from embed URL
      const vimeoMatch = videoSrc && videoSrc.match(/player\.vimeo\.com\/video\/(\d+)/);
      if (vimeoMatch) {
        const videoLink = document.createElement('a');
        videoLink.href = `https://vimeo.com/${vimeoMatch[1]}`;
        videoLink.textContent = videoLink.href;
        cellContent.push(videoLink);
      }
    }

    // Check for images
    const img = col.querySelector('img');
    if (img && !iframe) {
      cellContent.push(img);
    }

    // Check for blockquote (testimonial)
    const blockquote = col.querySelector('blockquote');
    if (blockquote) {
      cellContent.push(blockquote);
    }

    // Check for citation
    const cite = col.querySelector('cite');
    if (cite) {
      cellContent.push(cite);
    }

    // Check for headings
    const headings = Array.from(col.querySelectorAll('h2, h3'));
    headings.forEach((h) => {
      if (!cellContent.includes(h)) cellContent.push(h);
    });

    // Check for paragraphs (not inside blockquote or cite)
    const paragraphs = Array.from(col.querySelectorAll(':scope > p, :scope > div > p'));
    paragraphs.forEach((p) => {
      if (!cellContent.includes(p) && !p.closest('blockquote') && !p.closest('cite')) {
        cellContent.push(p);
      }
    });

    // Check for links/CTAs
    const ctas = Array.from(col.querySelectorAll(':scope > a.abc-button, :scope > div > a.abc-button'));
    ctas.forEach((a) => {
      if (!cellContent.includes(a)) cellContent.push(a);
    });

    // Check for standalone links (not buttons, not in paragraphs)
    const standaloneLinks = Array.from(col.querySelectorAll(':scope > a:not(.abc-button)'));
    standaloneLinks.forEach((a) => {
      if (!cellContent.includes(a)) cellContent.push(a);
    });

    if (cellContent.length > 0) {
      cellRow.push(cellContent);
    }
  });

  const cells = cellRow.length > 0 ? [cellRow] : [];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
