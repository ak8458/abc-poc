var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-health-wellness-article.js
  var import_health_wellness_article_exports = {};
  __export(import_health_wellness_article_exports, {
    default: () => import_health_wellness_article_default
  });

  // tools/importer/parsers/hero-guide.js
  function parse(element, { document }) {
    const contentDiv = element.querySelector(".grid-banner-content");
    const contentCell = [];
    if (contentDiv) {
      const categoryLabel = contentDiv.querySelector(".banner-heading, p:first-child");
      if (categoryLabel) contentCell.push(categoryLabel);
      const heading = contentDiv.querySelector("h1, .banner-h1");
      if (heading) contentCell.push(heading);
      const paragraphs = contentDiv.querySelectorAll("p:not(.banner-heading)");
      paragraphs.forEach((p) => contentCell.push(p));
    }
    const imageDiv = element.querySelector('.grid-banner-img, [class*="banner-img"]');
    const imageCell = [];
    if (imageDiv) {
      const img = imageDiv.querySelector("img");
      if (img) imageCell.push(img);
    }
    const cells = [
      [contentCell, imageCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-guide", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns.js
  function parse2(element, { document }) {
    const leftCol = element.querySelector(".col-lg-7, .col-12:first-child");
    const leftCell = [];
    if (leftCol) {
      const paragraphs = leftCol.querySelectorAll(":scope > .text-columns p, :scope > p");
      paragraphs.forEach((p) => leftCell.push(p));
    }
    const rightCol = element.querySelector(".col-lg-5, .col-12:last-child");
    const rightCell = [];
    if (rightCol) {
      const card = rightCol.querySelector(".pdf-download-card");
      if (card) {
        const heading = card.querySelector("h3");
        if (heading) rightCell.push(heading);
        const desc = card.querySelector("p");
        if (desc) rightCell.push(desc);
        const cta = card.querySelector('a.primary-btn, a[class*="btn"]');
        if (cta) rightCell.push(cta);
      }
    }
    const cells = [
      [leftCell, rightCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-stats.js
  function parse3(element, { document }) {
    const cols = element.querySelectorAll('.col-12.col-md-4, [class*="col-md-4"]');
    if (cols.length === 0) return;
    const row = [];
    cols.forEach((col) => {
      const cellContent = [];
      const paragraphs = col.querySelectorAll("p");
      paragraphs.forEach((p) => cellContent.push(p));
      row.push(cellContent);
    });
    if (row.length === 0) return;
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-guide.js
  function parse4(element, { document }) {
    const cards = element.querySelectorAll(".menopause-card");
    const cells = [];
    cards.forEach((card) => {
      const cardCell = [];
      const heading = card.querySelector(".menopause-card--header h3, h3");
      if (heading) cardCell.push(heading);
      const desc = card.querySelector(".menopause-card--body p, .menopause-card--body");
      if (desc) cardCell.push(desc);
      if (cardCell.length > 0) {
        cells.push([cardCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-guide", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/quote.js
  function parse5(element, { document }) {
    const cell = [];
    const statNumber = element.querySelector(".stat-number");
    if (statNumber) {
      const h2 = document.createElement("h2");
      h2.textContent = statNumber.textContent.trim();
      cell.push(h2);
    }
    const statText = element.querySelector(".stat-text");
    if (statText) {
      cell.push(statText);
    }
    if (!statNumber && !statText) {
      const paragraphs = element.querySelectorAll("p");
      paragraphs.forEach((p) => cell.push(p));
    }
    if (cell.length === 0) return;
    const cells = [[cell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "quote", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/bluecross-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        ".info-banner-covid"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        ".retiree-faq-breadcrumbs",
        ".stoplight-white",
        "#back2Top",
        "iframe",
        "link",
        "noscript"
      ]);
    }
  }

  // tools/importer/transformers/bluecross-sections.js
  var H2 = { after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      const sectionsReversed = [...template.sections].reverse();
      for (const section of sectionsReversed) {
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (section.id !== template.sections[0].id) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-health-wellness-article.js
  var parsers = {
    "hero-guide": parse,
    "columns": parse2,
    "columns-stats": parse3,
    "cards-guide": parse4,
    "quote": parse5
  };
  var PAGE_TEMPLATE = {
    name: "health-wellness-article",
    description: "Health and wellness article page with informational content about health topics",
    urls: [
      "https://www.ab.bluecross.ca/resources/health-wellness/womens-health/menopause-guide.php",
      "https://www.ab.bluecross.ca/resources/health-wellness/womens-health/cost-of-overlooking-menopause.php"
    ],
    blocks: [
      {
        name: "hero-guide",
        instances: [".banner-container .hero-banner-grid"]
      },
      {
        name: "columns",
        instances: ["main > .container-fluid > .container > .row:has(.col-lg-7)"]
      },
      {
        name: "columns-stats",
        instances: ["section#impact-economy > .row"]
      },
      {
        name: "cards-guide",
        instances: [".menopause-grid", "section#understanding-barriers > .row"]
      },
      {
        name: "quote",
        instances: [".stat-callout", ".info-box"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Banner",
        selector: "main > section:first-of-type",
        style: null,
        blocks: ["hero-guide"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Introduction Content",
        selector: "main > .container-fluid",
        style: null,
        blocks: ["columns"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Guide Sections Cards",
        selector: ".guide-section-gray",
        style: "grey",
        blocks: ["cards-guide"],
        defaultContent: [".guide-section-gray > .container > h2", ".guide-section-gray > .container > p.margin-t-32"]
      },
      {
        id: "section-4",
        name: "Research Sources",
        selector: ".research-sources",
        style: null,
        blocks: [],
        defaultContent: [".research-sources > .container > h3", ".research-sources > .container > ol"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element
          });
        });
      });
    });
    return pageBlocks;
  }
  var import_health_wellness_article_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.php$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_health_wellness_article_exports);
})();
