/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-plans. Base: tabs.
 * Source: https://www.ab.bluecross.ca/index.php
 * Selectors from .tabbed#homeTabs
 * Tabs block library: 2 columns per row (tab label | tab content)
 */
export default function parse(element, { document }) {
  // Extract tab labels from .tabLinks
  const tabLinks = element.querySelectorAll('.tabLinks a');
  // Extract tab content sections
  const tabSections = element.querySelectorAll(':scope > section');

  const cells = [];

  tabLinks.forEach((tabLink, index) => {
    const label = tabLink.textContent.trim();

    // Get corresponding content section
    const section = tabSections[index];
    if (!section) return;

    // Clone the section content to avoid DOM mutation issues
    const contentDiv = document.createElement('div');
    // Copy all child nodes from the section
    const children = Array.from(section.children);
    children.forEach((child) => contentDiv.appendChild(child.cloneNode(true)));

    cells.push([label, contentDiv]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-plans', cells });
  element.replaceWith(block);
}
