/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroParser from './parsers/hero.js';
import cardsParser from './parsers/cards.js';
import columnsParser from './parsers/columns.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/abc-careers-cleanup.js';
import sectionsTransformer from './transformers/abc-careers-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero': heroParser,
  'cards': cardsParser,
  'columns': columnsParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'careers-content-page',
  description: 'Careers content page with hero, content sections, testimonial quote, and CTA.',
  urls: [
    'https://www.careers.ab.bluecross.ca/benefits.php',
    'https://www.careers.ab.bluecross.ca/values.php',
    'https://www.careers.ab.bluecross.ca/culture.php',
    'https://www.careers.ab.bluecross.ca/hiring.php',
    'https://www.careers.ab.bluecross.ca/teams.php',
  ],
  blocks: [
    {
      name: 'hero',
      instances: ['.abc-hero-banner'],
    },
    {
      name: 'cards',
      instances: ['.abc-grid-list'],
    },
    {
      name: 'columns',
      instances: [
        'section.abc-bgc-grey8',
        'section.abc-section-bottom-photo',
        'section.abc-testimonial',
        'section.abc-cta .abc-join-team',
      ],
    },
  ],
  sections: [
    {
      id: 'section-1-hero',
      name: 'Hero Banner',
      selector: 'section:has(.abc-hero-banner)',
      style: null,
      blocks: ['hero'],
      defaultContent: [],
    },
    {
      id: 'section-2-benefits-grid',
      name: 'Benefits Categories',
      selector: '#main-content > section:first-of-type',
      style: null,
      blocks: ['cards'],
      defaultContent: ['.benefit-category > h2'],
    },
    {
      id: 'section-3-wellbeing-video',
      name: 'Wellbeing Priority with Video',
      selector: 'section.abc-bgc-grey8',
      style: 'grey',
      blocks: ['columns'],
      defaultContent: [],
    },
    {
      id: 'section-4-flexible-working',
      name: 'Flexible Working Arrangements',
      selector: 'section.abc-section-bottom-photo',
      style: null,
      blocks: ['columns'],
      defaultContent: [],
    },
    {
      id: 'section-5-testimonial',
      name: 'Employee Testimonial',
      selector: 'section.abc-testimonial',
      style: 'dark-blue',
      blocks: ['columns'],
      defaultContent: [],
    },
    {
      id: 'section-6-cta',
      name: 'Join Team CTA',
      selector: 'section.abc-cta',
      style: 'blue',
      blocks: ['columns'],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
        });
      });
    });
  });

  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path under /careers folder
    let pagePath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.php$/, '')
      .replace(/\.html$/, '');
    // Map to /careers/ folder
    const pageName = pagePath.split('/').pop();
    const path = WebImporter.FileUtils.sanitizePath(`/careers/${pageName}`);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
