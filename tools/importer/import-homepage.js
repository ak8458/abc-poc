/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroHomepageParser from './parsers/hero-homepage.js';
import cardsNewsParser from './parsers/cards-news.js';
import tabsPlansParser from './parsers/tabs-plans.js';
import columnsResourceParser from './parsers/columns-resource.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/bluecross-cleanup.js';
import sectionsTransformer from './transformers/bluecross-sections.js';

// PARSER REGISTRY - section-metadata handled by sections transformer
const parsers = {
  'hero-homepage': heroHomepageParser,
  'cards-news': cardsNewsParser,
  'tabs-plans': tabsPlansParser,
  'columns-resource': columnsResourceParser,
};

// TRANSFORMER REGISTRY
const transformers = [cleanupTransformer];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Alberta Blue Cross homepage with hero, feature cards, and promotional content',
  urls: ['https://www.ab.bluecross.ca/index.php'],
  blocks: [
    { name: 'hero-homepage', instances: ['.banner-container .hero-banner-grid'] },
    { name: 'cards-news', instances: ['.row.same-height'] },
    { name: 'tabs-plans', instances: ['.tabbed#homeTabs'] },
    { name: 'columns-resource', instances: ['.resource-grid'] },
    { name: 'section-metadata', instances: ['section.bkg-grey'] },
  ],
  sections: [
    { id: 'section-1', name: 'Hero Banner', selector: '.banner-container', style: null, blocks: ['hero-homepage'], defaultContent: [] },
    { id: 'section-2', name: 'Search Bar', selector: '.home-search.abc-card', style: null, blocks: [], defaultContent: [] },
    { id: 'section-3', name: 'Latest News and Featured Topics', selector: 'section.margin-t-56', style: null, blocks: ['cards-news'], defaultContent: ['.col-lg-8 > h2', '.col-lg-4'] },
    { id: 'section-4', name: 'How Alberta Blue Cross Can Help', selector: 'section:has(.tabbed)', style: null, blocks: ['tabs-plans'], defaultContent: ['.container > .row > .col-12 > h2'] },
    { id: 'section-5', name: 'Wellbeing Resources', selector: 'section.bkg-grey', style: 'grey', blocks: ['columns-resource', 'section-metadata'], defaultContent: ['section.bkg-grey .container > h2'] },
  ],
};

/**
 * Find all blocks on the page based on the template configuration.
 * Skips section-metadata (handled by sections transformer).
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    // section-metadata is handled by the sections transformer
    if (blockDef.name === 'section-metadata') return;
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

/**
 * Execute all page transformers for a given hook.
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. beforeTransform: cleanup (remove header, footer, search widget, etc.)
    executeTransformers('beforeTransform', main, payload);

    // 2. Discover and parse blocks
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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

    // 3. afterTransform: remove remaining non-authorable content + insert section breaks/metadata
    executeTransformers('afterTransform', main, payload);

    // 4. Section transformer (runs in afterTransform, adds <hr> and Section Metadata blocks)
    if (PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1) {
      try {
        sectionsTransformer.call(null, 'afterTransform', main, { ...payload, template: PAGE_TEMPLATE });
      } catch (e) {
        console.error('Sections transformer failed:', e);
      }
    }

    // 5. WebImporter built-in rules
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
        .replace(/\.html$/, '')
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
