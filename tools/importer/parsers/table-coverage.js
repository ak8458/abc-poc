/* eslint-disable */
/* global WebImporter */

/**
 * Parser for table-coverage variant.
 * Base block: table
 * Source: https://www.ab.bluecross.ca/plans/personal/individual/blue-choice-plan.php
 * Selector: #extended-health
 *
 * Source structure:
 *   .content-panel (e.g., #extended-health, #optional-dental, #prescription-drug)
 *     .desktop-table (extended health only)
 *       .tab-panel (one per category)
 *         h3.panel-heading (category name)
 *         table (Coverage | Basic | Enhanced | Enhanced+ | Premium)
 *     OR direct table (optional-dental, prescription-drug)
 *
 * Target: table block preserving all coverage data tables
 */
export default function parse(element, { document }) {
  const cells = [];

  // Try to find desktop-table with inner tab panels first (extended health structure)
  const desktopTable = element.querySelector('.desktop-table');

  if (desktopTable) {
    const panels = Array.from(desktopTable.querySelectorAll('.tab-panel'));

    panels.forEach((panel) => {
      const heading = panel.querySelector('h3, .panel-heading');
      const table = panel.querySelector('table');

      if (table) {
        const cell = document.createElement('div');
        if (heading) {
          const h3 = document.createElement('h3');
          h3.textContent = heading.textContent.trim();
          cell.append(h3);
        }
        cell.append(table);
        cells.push([cell]);
      }
    });
  }

  // Fallback: find tables directly in the content panel (dental, prescription drug)
  if (cells.length === 0) {
    const tables = Array.from(element.querySelectorAll('table'));
    tables.forEach((table) => {
      cells.push([table]);
    });
  }

  // Final fallback: pass through element content
  if (cells.length === 0) {
    cells.push([element]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'table-coverage', cells });
  element.replaceWith(block);
}
