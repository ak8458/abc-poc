/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-coverage variant.
 * Base block: tabs
 * Source: https://www.ab.bluecross.ca/plans/personal/individual/blue-choice-plan.php
 * Selector: .seg-control
 *
 * Source structure:
 *   .seg-control
 *     button.seg-btn (Overview)
 *     button.seg-btn (Extended health)
 *     button.seg-btn (Optional dental)
 *     button.seg-btn (Prescription drug)
 *   Followed by sibling .content-panel divs
 *
 * Target: tabs block with rows of [tab-label | tab-content]
 */
export default function parse(element, { document }) {
  // Extract tab buttons from the seg-control
  const tabButtons = Array.from(element.querySelectorAll('.seg-btn, button'));

  // Find the parent container that holds both seg-control and content panels
  const tabWrapper = element.closest('.tab-wrapper') || element.parentElement;

  // Extract content panels (siblings after the seg-control)
  const contentPanels = tabWrapper
    ? Array.from(tabWrapper.querySelectorAll('.content-panel'))
    : [];

  const cells = [];

  // Create a row for each tab: [tab label | tab content]
  tabButtons.forEach((btn, index) => {
    const tabLabel = btn.textContent.trim();
    const panel = contentPanels[index];

    if (panel) {
      cells.push([tabLabel, panel]);
    } else {
      // If no matching panel, just include the label
      const labelEl = document.createElement('p');
      labelEl.textContent = tabLabel;
      cells.push([labelEl]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-coverage', cells });
  element.replaceWith(block);
}
