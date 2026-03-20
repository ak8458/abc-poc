/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroParser from './parsers/hero.js';
import tabsParser from './parsers/tabs.js';
import columnsParser from './parsers/columns.js';
import cardsParser from './parsers/cards.js';

// TRANSFORMER IMPORTS
import bluecrossCleanupTransformer from './transformers/bluecross-cleanup.js';
import bluecrossSectionsTransformer from './transformers/bluecross-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero': heroParser,
  'tabs': tabsParser,
  'columns': columnsParser,
  'cards': cardsParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'individual-plan-page',
  description: 'Individual health plan detail page with hero, plan features, coverage details, and call-to-action sections',
  urls: [
    'https://www.ab.bluecross.ca/plans/personal/individual/blue-assured-plan.php'
  ],
  sections: [
    {
      id: 'section-hero',
      name: 'Hero Banner',
      selector: 'main > section:nth-child(2)',
      style: null,
      blocks: ['hero'],
      defaultContent: []
    },
    {
      id: 'section-plan-details',
      name: 'Plan Details Tabs',
      selector: 'main > section:nth-child(3)',
      style: null,
      blocks: ['tabs', 'columns'],
      defaultContent: ['main > section:nth-child(3) .content-panel h2', 'main > section:nth-child(3) .content-panel p', 'main > section:nth-child(3) .content-panel ul', 'main > section:nth-child(3) .plan-btns a']
    },
    {
      id: 'section-other-plans',
      name: 'Explore Other Plan Options',
      selector: 'main > section:nth-child(4)',
      style: 'grey',
      blocks: ['cards'],
      defaultContent: ['.container-fluid.bkg-grey h2', '.container-fluid.bkg-grey > .container > .row:first-child p']
    }
  ],
  blocks: [
    {
      name: 'hero',
      instances: ['.banner-container']
    },
    {
      name: 'tabs',
      instances: ['.tab-wrapper']
    },
    {
      name: 'columns',
      instances: ['.plan-blue-callout'],
      section: 'plan-details'
    },
    {
      name: 'cards',
      instances: ['.card-group-3'],
      section: 'other-plans'
    }
  ]
};

// TRANSFORMER REGISTRY
const transformers = [
  bluecrossCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [bluecrossSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - { document, url, html, params }
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
 * Find all blocks on the page based on template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

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
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.php$/, '').replace(/\.html$/, '')
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
