var CustomImportScript = (function (exports) {
  'use strict';

  /* eslint-disable */
  /* global WebImporter */

  /**
   * Parser for hero-guide variant.
   * Base block: hero. Side-by-side layout: text left, image right.
   * Source: https://www.ab.bluecross.ca/resources/health-wellness/womens-health/menopause-guide.php
   * Selector: .banner-container .hero-banner-grid
   */
  function parse$4(element, { document }) {
    // Extract text content from .grid-banner-content
    const contentDiv = element.querySelector('.grid-banner-content');
    const contentCell = [];

    if (contentDiv) {
      // Category label (p.banner-heading)
      const categoryLabel = contentDiv.querySelector('.banner-heading, p:first-child');
      if (categoryLabel) contentCell.push(categoryLabel);

      // Main heading (h1)
      const heading = contentDiv.querySelector('h1, .banner-h1');
      if (heading) contentCell.push(heading);

      // Description paragraph(s) - remaining p elements after category and heading
      const paragraphs = contentDiv.querySelectorAll('p:not(.banner-heading)');
      paragraphs.forEach((p) => contentCell.push(p));
    }

    // Extract image from .grid-banner-img
    const imageDiv = element.querySelector('.grid-banner-img, [class*="banner-img"]');
    const imageCell = [];
    if (imageDiv) {
      const img = imageDiv.querySelector('img');
      if (img) imageCell.push(img);
    }

    const cells = [
      [contentCell, imageCell],
    ];

    const block = WebImporter.Blocks.createBlock(document, { name: 'hero-guide', cells });
    element.replaceWith(block);
  }

  /* eslint-disable */
  /* global WebImporter */

  /**
   * Parser for columns block.
   * Base block: columns. Two-column layout (60/40).
   * Source: https://www.ab.bluecross.ca/resources/health-wellness/womens-health/menopause-guide.php
   * Selector: main > .container-fluid > .container > .row
   */
  function parse$3(element, { document }) {
    // Left column: intro text paragraphs + next link
    const leftCol = element.querySelector('.col-lg-7, .col-12:first-child');
    const leftCell = [];

    if (leftCol) {
      // Gather all paragraphs from the text content area
      const paragraphs = leftCol.querySelectorAll(':scope > .text-columns p, :scope > p');
      paragraphs.forEach((p) => leftCell.push(p));
    }

    // Right column: PDF download card
    const rightCol = element.querySelector('.col-lg-5, .col-12:last-child');
    const rightCell = [];

    if (rightCol) {
      const card = rightCol.querySelector('.pdf-download-card');
      if (card) {
        const heading = card.querySelector('h3');
        if (heading) rightCell.push(heading);

        const desc = card.querySelector('p');
        if (desc) rightCell.push(desc);

        const cta = card.querySelector('a.primary-btn, a[class*="btn"]');
        if (cta) rightCell.push(cta);
      }
    }

    const cells = [
      [leftCell, rightCell],
    ];

    const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
    element.replaceWith(block);
  }

  /* eslint-disable */
  /* global WebImporter */

  /**
   * Parser for columns block (stats variant).
   * Extracts 3-column statistics grid, drops SVG icons (decorative), keeps text.
   * Source: https://www.ab.bluecross.ca/resources/health-wellness/womens-health/cost-of-overlooking-menopause.php
   * Selector: section#impact-economy > .row
   */
  function parse$2(element, { document }) {
    const cols = element.querySelectorAll('.col-12.col-md-4, [class*="col-md-4"]');
    if (cols.length === 0) return;

    const row = [];
    cols.forEach((col) => {
      const cellContent = [];

      // Get the text paragraph (skip SVG icon images)
      const paragraphs = col.querySelectorAll('p');
      paragraphs.forEach((p) => cellContent.push(p));

      row.push(cellContent);
    });

    if (row.length === 0) return;

    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
    element.replaceWith(block);
  }

  /* eslint-disable */
  /* global WebImporter */

  /**
   * Parser for cards-guide variant.
   * Base block: cards (no images). Text-only cards in a grid.
   * Source: https://www.ab.bluecross.ca/resources/health-wellness/womens-health/menopause-guide.php
   * Selector: .menopause-grid
   */
  function parse$1(element, { document }) {
    const cards = element.querySelectorAll('.menopause-card');
    const cells = [];

    cards.forEach((card) => {
      const cardCell = [];

      // Card heading (h3, may contain a link or strong text)
      const heading = card.querySelector('.menopause-card--header h3, h3');
      if (heading) cardCell.push(heading);

      // Card description
      const desc = card.querySelector('.menopause-card--body p, .menopause-card--body');
      if (desc) cardCell.push(desc);

      if (cardCell.length > 0) {
        // Single column per row: wrap all card content in one cell
        cells.push([cardCell]);
      }
    });

    const block = WebImporter.Blocks.createBlock(document, { name: 'cards-guide', cells });
    element.replaceWith(block);
  }

  /* eslint-disable */
  /* global WebImporter */

  /**
   * Parser for quote block.
   * Handles both .stat-callout (big number + text) and .info-box (highlighted text).
   * Source: https://www.ab.bluecross.ca/resources/health-wellness/womens-health/cost-of-overlooking-menopause.php
   * Selectors: .stat-callout, .info-box
   */
  function parse(element, { document }) {
    const cell = [];

    // Handle stat-callout: extract the big number as a heading and the description
    const statNumber = element.querySelector('.stat-number');
    if (statNumber) {
      const h2 = document.createElement('h2');
      h2.textContent = statNumber.textContent.trim();
      cell.push(h2);
    }

    const statText = element.querySelector('.stat-text');
    if (statText) {
      cell.push(statText);
    }

    // Handle info-box: extract all paragraph content
    if (!statNumber && !statText) {
      const paragraphs = element.querySelectorAll('p');
      paragraphs.forEach((p) => cell.push(p));
    }

    if (cell.length === 0) return;

    const cells = [[cell]];
    const block = WebImporter.Blocks.createBlock(document, { name: 'quote', cells });
    element.replaceWith(block);
  }

  /* eslint-disable */
  /* global WebImporter */

  /**
   * Transformer: Alberta Blue Cross cleanup.
   * Selectors from captured DOM of menopause-guide.php.
   */
  const H$1 = { before: 'beforeTransform', after: 'afterTransform' };

  function transform$1(hookName, element, payload) {
    if (hookName === H$1.before) {
      // Remove info banner and cookie/tracking elements (from captured DOM)
      WebImporter.DOMUtils.remove(element, [
        '.info-banner-covid',
      ]);
    }
    if (hookName === H$1.after) {
      // Remove non-authorable content (from captured DOM)
      WebImporter.DOMUtils.remove(element, [
        'header',
        'footer',
        '.retiree-faq-breadcrumbs',
        '.stoplight-white',
        '#back2Top',
        'iframe',
        'link',
        'noscript',
      ]);
    }
  }

  /* eslint-disable */
  /* global WebImporter */

  /**
   * Transformer: Alberta Blue Cross section breaks and section-metadata.
   * Runs afterTransform only. Uses payload.template.sections from page-templates.json.
   */
  const H = { after: 'afterTransform' };

  function transform(hookName, element, payload) {
    if (hookName === H.after) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;

      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };

      // Process sections in reverse order to avoid shifting DOM positions
      const sectionsReversed = [...template.sections].reverse();

      for (const section of sectionsReversed) {
        // Find the first element matching the section selector
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;

        // Add section-metadata block if section has a style
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: 'Section Metadata',
            cells: { style: section.style },
          });
          sectionEl.after(sectionMetadata);
        }

        // Add section break (hr) before non-first sections if there is content before
        if (section.id !== template.sections[0].id) {
          const hr = document.createElement('hr');
          sectionEl.before(hr);
        }
      }
    }
  }

  /* eslint-disable */
  /* global WebImporter */


  // PARSER REGISTRY
  const parsers = {
    'hero-guide': parse$4,
    'columns': parse$3,
    'columns-stats': parse$2,
    'cards-guide': parse$1,
    'quote': parse,
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
    transform$1,
    ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform] : []),
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
  var importHealthWellnessArticle = {
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

  exports.default = importHealthWellnessArticle;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({});
