/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroGuideParser from './parsers/hero-guide.js';
import columnsParser from './parsers/columns.js';
import columnsStatsParser from './parsers/columns-stats.js';
import cardsGuideParser from './parsers/cards-guide.js';
import quoteParser from './parsers/quote.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/bluecross-cleanup.js';
import sectionsTransformer from './transformers/bluecross-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-guide': heroGuideParser,
  'columns': columnsParser,
  'columns-stats': columnsStatsParser,
  'cards-guide': cardsGuideParser,
  'quote': quoteParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'health-wellness-article',
  description: 'Health and wellness article page with informational content about health topics',
  urls: [
    'https://www.ab.bluecross.ca/resources/health-wellness/womens-health/menopause-guide.php',
    'https://www.ab.bluecross.ca/resources/health-wellness/womens-health/cost-of-overlooking-menopause.php',
  ],
  blocks: [
    {
      name: 'hero-guide',
      instances: ['.banner-container .hero-banner-grid'],
    },
    {
      name: 'columns',
      instances: ['main > .container-fluid > .container > .row:has(.col-lg-7)'],
    },
    {
      name: 'columns-stats',
      instances: ['section#impact-economy > .row'],
    },
    {
      name: 'cards-guide',
      instances: ['.menopause-grid', 'section#understanding-barriers > .row'],
    },
    {
      name: 'quote',
      instances: ['.stat-callout', '.info-box'],
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
    {
      id: 'section-4',
      name: 'Research Sources',
      selector: '.research-sources',
      style: null,
      blocks: [],
      defaultContent: ['.research-sources > .container > h3', '.research-sources > .container > ol'],
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

    // 4.5 Flatten DOM: move block tables to top level with <hr> separators.
    // The DA content pipeline strips blocks when they are nested deep in
    // container elements mixed with lots of default content. Blocks must
    // be direct children of <main> to be preserved during html2md/md2da.
    // Collect all leaf content elements in document order.
    const flatElements = [];
    function collectElements(node) {
      for (const child of Array.from(node.childNodes)) {
        if (child.nodeType === 3) {
          // Text node - skip if whitespace only
          if (child.textContent.trim()) flatElements.push(child);
        } else if (child.nodeType === 1) {
          const tag = child.tagName;
          // Block tables created by parsers
          if (tag === 'TABLE') {
            flatElements.push(child);
          // Section break markers
          } else if (tag === 'HR') {
            flatElements.push(child);
          // Standard content elements - keep as-is
          } else if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'UL', 'OL', 'BLOCKQUOTE', 'PRE', 'IMG', 'PICTURE', 'A'].includes(tag)) {
            flatElements.push(child);
          // Div with block class (already processed blocks in .plain.html format)
          } else if (tag === 'DIV' && child.className) {
            flatElements.push(child);
          // Container divs - recurse into them
          } else {
            collectElements(child);
          }
        }
      }
    }
    collectElements(main);

    // Clear main and rebuild with flat structure
    while (main.firstChild) main.removeChild(main.firstChild);
    flatElements.forEach((el) => main.appendChild(el));

    // Now add <hr> section breaks around block tables
    const tables = main.querySelectorAll(':scope > table');
    tables.forEach((table) => {
      const headerCell = table.querySelector('tr:first-child td[colspan]');
      if (!headerCell) return;
      const name = headerCell.textContent.trim().toLowerCase();
      if (name === 'section metadata' || name === 'metadata') return;

      const prev = table.previousElementSibling;
      if (prev && prev.tagName !== 'HR') {
        table.before(document.createElement('hr'));
      }
      const next = table.nextElementSibling;
      if (next && next.tagName !== 'HR') {
        const nextHeader = next.tagName === 'TABLE'
          ? next.querySelector('tr:first-child td[colspan]')
          : null;
        const nextName = nextHeader ? nextHeader.textContent.trim().toLowerCase() : '';
        if (nextName !== 'section metadata') {
          table.after(document.createElement('hr'));
        }
      }
    });

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
