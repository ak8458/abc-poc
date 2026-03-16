/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Alberta Blue Cross sections.
 * Adds section breaks and section-metadata blocks from template sections.
 * Runs in afterTransform only.
 * Selectors from captured DOM of https://www.ab.bluecross.ca/plans/personal/individual/blue-choice-plan.php
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
    const template = payload && payload.template;
    if (!template || !template.sections || template.sections.length < 2) return;

    const sections = template.sections;

    // Process sections in reverse order to avoid shifting DOM positions
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];

      // Find the first element matching the section selector
      const selectorList = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionEl = null;
      for (const sel of selectorList) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }

      if (!sectionEl) continue;

      // Add section-metadata block if section has a style
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.parentNode.insertBefore(metaBlock, sectionEl.nextSibling);
      }

      // Add section break (<hr>) before each section except the first
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.parentNode.insertBefore(hr, sectionEl);
      }
    }
  }
}
