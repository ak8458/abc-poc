/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs block.
 * Base: tabs. Source: https://www.ab.bluecross.ca/plans/personal/individual/blue-assured-plan.php
 * Selector: .tab-wrapper
 *
 * Source structure:
 *   .tab-wrapper
 *     .seg-control: button.seg-btn (x4) - tab labels
 *     .content-panel (x4) - tab content panels
 *       #overview, #extended-health, #optional-dental, #prescription-drug
 *
 * Target structure (Block Collection tabs):
 *   2 columns per row. Col 1 = tab label text, Col 2 = tab content
 */
export default function parse(element, { document }) {
  // Extract tab buttons (labels)
  const tabButtons = element.querySelectorAll('.seg-control .seg-btn, .seg-control button');

  // Extract content panels
  const contentPanels = element.querySelectorAll('.content-panel');

  const cells = [];

  // Match each tab label with its corresponding content panel
  tabButtons.forEach((btn, i) => {
    const label = btn.textContent.trim();

    // Create label cell
    const labelCell = document.createElement('div');
    labelCell.textContent = label;

    // Create content cell with the panel content
    const contentCell = document.createElement('div');
    if (contentPanels[i]) {
      // Clone all children from the content panel into the content cell
      while (contentPanels[i].firstChild) {
        contentCell.appendChild(contentPanels[i].firstChild);
      }
    }

    // Each row: [tab label, tab content]
    cells.push([labelCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs', cells });
  element.replaceWith(block);
}
