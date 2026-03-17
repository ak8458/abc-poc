/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroGuideParser from './parsers/hero-guide.js';
import columnsParser from './parsers/columns.js';
import cardsGuideParser from './parsers/cards-guide.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/bluecross-cleanup.js';
import sectionsTransformer from './transformers/bluecross-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-guide': heroGuideParser,
  'columns': columnsParser,
  'cards-guide': cardsGuideParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'health-wellness-article',
  description: 'Health and wellness article page with informational content about health topics',
  urls: [
    'https://www.ab.bluecross.ca/resources/health-wellness/womens-health/menopause-guide.php',
  ],
  blocks: [
    {
      name: 'hero-guide',
      instances: ['.banner-container .hero-banner-grid'],
    },
    {
      name: 'columns',
      instances: ['main > .container-fluid > .container > .row'],
    },
    {
      name: 'cards-guide',
      instances: ['.menopause-grid'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Banner',
      selector: 'main > section:first-of-type',
      style: null,
      blocks: ['hero-guide'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Introduction Content',
      selector: 'main > .container-fluid',
      style: null,
      blocks: ['columns'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Guide Sections Cards',
      selector: '.guide-section-gray',
      style: 'grey',
      blocks: ['cards-guide'],
      defaultContent: ['.guide-section-gray > .container > h2', '.guide-section-gray > .container > p.margin-t-32'],
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

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname
        .replace(/\/$/, '')
        .replace(/\.php$/, '')
        .replace(/\.html$/, ''),
    );

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
