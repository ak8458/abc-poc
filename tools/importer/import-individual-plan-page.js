/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroPlanParser from './parsers/hero-plan.js';
import tabsCoverageParser from './parsers/tabs-coverage.js';
import columnsFeaturesParser from './parsers/columns-features.js';
import tableCoverageParser from './parsers/table-coverage.js';
import cardsPlanParser from './parsers/cards-plan.js';

// TRANSFORMER IMPORTS
import bluecrossCleanupTransformer from './transformers/bluecross-cleanup.js';
import bluecrossSectionsTransformer from './transformers/bluecross-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-plan': heroPlanParser,
  'tabs-coverage': tabsCoverageParser,
  'columns-features': columnsFeaturesParser,
  'table-coverage': tableCoverageParser,
  'cards-plan': cardsPlanParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'individual-plan-page',
  description: 'Individual insurance plan detail page with plan features, coverage details, and pricing information',
  urls: [
    'https://www.ab.bluecross.ca/plans/personal/individual/blue-choice-plan.php'
  ],
  blocks: [
    {
      name: 'hero-plan',
      instances: ['.hero-banner-grid']
    },
    {
      name: 'tabs-coverage',
      instances: ['.seg-control']
    },
    {
      name: 'columns-features',
      instances: ['.row.grey-callout']
    },
    {
      name: 'table-coverage',
      instances: ['#extended-health', '#optional-dental', '#prescription-drug']
    },
    {
      name: 'cards-plan',
      instances: ['.card-group-3']
    }
  ],
  sections: [
    {
      id: 'section-1-hero',
      name: 'Hero Banner',
      selector: '.hero-banner-grid',
      style: null,
      blocks: ['hero-plan'],
      defaultContent: []
    },
    {
      id: 'section-2-plan-overview',
      name: 'Plan Overview Content',
      selector: '.seg-control',
      style: null,
      blocks: ['tabs-coverage', 'columns-features', 'table-coverage'],
      defaultContent: ['#overview h2', '#overview p']
    },
    {
      id: 'section-3-other-plans',
      name: 'Explore Other Plans',
      selector: '.container-fluid.bkg-grey',
      style: 'grey',
      blocks: ['cards-plan'],
      defaultContent: ['.bkg-grey .col-12 h2', '.bkg-grey .col-12 p']
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
 * @param {Object} payload - The payload containing { document, url, html, params }
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
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
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

// EXPORT DEFAULT CONFIGURATION
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

    // 4. Execute afterTransform transformers (section breaks + metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '').replace(/\.php$/, '')
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
