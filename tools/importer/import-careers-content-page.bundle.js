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

  // tools/importer/import-careers-content-page.js
  var import_careers_content_page_exports = {};
  __export(import_careers_content_page_exports, {
    default: () => import_careers_content_page_default
  });

  // tools/importer/parsers/hero.js
  function parse(element, { document }) {
    const bgImg = element.querySelector(".abc-hero-banner__bkg img, .abc-hero-banner img:first-of-type");
    const heading = element.querySelector(".abc-hero-banner__header h1, h1");
    const description = element.querySelector(".abc-hero-banner__paragraph, .abc-hero-banner__content p");
    const ctaLinks = Array.from(element.querySelectorAll(".abc-hero-banner__buttons a, .abc-button"));
    const cells = [];
    if (bgImg) {
      cells.push([bgImg]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    contentCell.push(...ctaLinks);
    cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards.js
  function parse2(element, { document }) {
    const gridItems = element.querySelectorAll(".abc-grid-list");
    const items = gridItems.length > 0 ? Array.from(gridItems) : [element];
    const cells = [];
    items.forEach((item) => {
      const heading = item.querySelector("h3, h4");
      const description = item.querySelector(".col-12.col-lg-4 p, .row p:first-of-type");
      const list = item.querySelector("ul.abc-columns, ul");
      const cardCell = [];
      if (heading) cardCell.push(heading);
      if (description) cardCell.push(description);
      if (list) cardCell.push(list);
      if (cardCell.length > 0) {
        cells.push(cardCell);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns.js
  function parse3(element, { document }) {
    const row = element.querySelector(".row");
    const colContainer = row || element;
    const cols = Array.from(colContainer.querySelectorAll(':scope > div[class*="col-"]'));
    const columnDivs = cols.length >= 2 ? cols : Array.from(colContainer.querySelectorAll(":scope > div"));
    if (columnDivs.length < 2) {
      const block2 = WebImporter.Blocks.createBlock(document, { name: "columns", cells: [[element.innerHTML]] });
      element.replaceWith(block2);
      return;
    }
    const cellRow = [];
    columnDivs.forEach((col) => {
      const cellContent = [];
      const iframe = col.querySelector('iframe[src*="vimeo"], iframe[src*="youtube"]');
      if (iframe) {
        const videoSrc = iframe.getAttribute("src");
        const vimeoMatch = videoSrc && videoSrc.match(/player\.vimeo\.com\/video\/(\d+)/);
        if (vimeoMatch) {
          const videoLink = document.createElement("a");
          videoLink.href = `https://vimeo.com/${vimeoMatch[1]}`;
          videoLink.textContent = videoLink.href;
          cellContent.push(videoLink);
        }
      }
      const img = col.querySelector("img");
      if (img && !iframe) {
        cellContent.push(img);
      }
      const blockquote = col.querySelector("blockquote");
      if (blockquote) {
        cellContent.push(blockquote);
      }
      const cite = col.querySelector("cite");
      if (cite) {
        cellContent.push(cite);
      }
      const headings = Array.from(col.querySelectorAll("h2, h3"));
      headings.forEach((h) => {
        if (!cellContent.includes(h)) cellContent.push(h);
      });
      const paragraphs = Array.from(col.querySelectorAll(":scope > p, :scope > div > p"));
      paragraphs.forEach((p) => {
        if (!cellContent.includes(p) && !p.closest("blockquote") && !p.closest("cite")) {
          cellContent.push(p);
        }
      });
      const ctas = Array.from(col.querySelectorAll(":scope > a.abc-button, :scope > div > a.abc-button"));
      ctas.forEach((a) => {
        if (!cellContent.includes(a)) cellContent.push(a);
      });
      const standaloneLinks = Array.from(col.querySelectorAll(":scope > a:not(.abc-button)"));
      standaloneLinks.forEach((a) => {
        if (!cellContent.includes(a)) cellContent.push(a);
      });
      if (cellContent.length > 0) {
        cellRow.push(cellContent);
      }
    });
    const cells = cellRow.length > 0 ? [cellRow] : [];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/abc-careers-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [".abc-mobile-nav"]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        "iframe",
        "noscript",
        "link"
      ]);
    }
  }

  // tools/importer/transformers/abc-careers-sections.js
  var H2 = { after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { template } = payload || {};
      const sections = template && template.sections;
      if (!sections || sections.length < 2) return;
      const document = element.ownerDocument;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selector = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selector) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.append(metaBlock);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-careers-content-page.js
  var parsers = {
    "hero": parse,
    "cards": parse2,
    "columns": parse3
  };
  var PAGE_TEMPLATE = {
    name: "careers-content-page",
    description: "Careers content page with hero, content sections, testimonial quote, and CTA.",
    urls: [
      "https://www.careers.ab.bluecross.ca/benefits.php",
      "https://www.careers.ab.bluecross.ca/values.php",
      "https://www.careers.ab.bluecross.ca/culture.php",
      "https://www.careers.ab.bluecross.ca/hiring.php",
      "https://www.careers.ab.bluecross.ca/teams.php"
    ],
    blocks: [
      {
        name: "hero",
        instances: [".abc-hero-banner"]
      },
      {
        name: "cards",
        instances: [".abc-grid-list"]
      },
      {
        name: "columns",
        instances: [
          "section.abc-bgc-grey8",
          "section.abc-section-bottom-photo",
          "section.abc-testimonial",
          "section.abc-cta .abc-join-team"
        ]
      }
    ],
    sections: [
      {
        id: "section-1-hero",
        name: "Hero Banner",
        selector: "section:has(.abc-hero-banner)",
        style: null,
        blocks: ["hero"],
        defaultContent: []
      },
      {
        id: "section-2-benefits-grid",
        name: "Benefits Categories",
        selector: "#main-content > section:first-of-type",
        style: null,
        blocks: ["cards"],
        defaultContent: [".benefit-category > h2"]
      },
      {
        id: "section-3-wellbeing-video",
        name: "Wellbeing Priority with Video",
        selector: "section.abc-bgc-grey8",
        style: "grey",
        blocks: ["columns"],
        defaultContent: []
      },
      {
        id: "section-4-flexible-working",
        name: "Flexible Working Arrangements",
        selector: "section.abc-section-bottom-photo",
        style: null,
        blocks: ["columns"],
        defaultContent: []
      },
      {
        id: "section-5-testimonial",
        name: "Employee Testimonial",
        selector: "section.abc-testimonial",
        style: "dark-blue",
        blocks: ["columns"],
        defaultContent: []
      },
      {
        id: "section-6-cta",
        name: "Join Team CTA",
        selector: "section.abc-cta",
        style: "blue",
        blocks: ["columns"],
        defaultContent: []
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
  var import_careers_content_page_default = {
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
      let pagePath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.php$/, "").replace(/\.html$/, "");
      const pageName = pagePath.split("/").pop();
      const path = WebImporter.FileUtils.sanitizePath(`/careers/${pageName}`);
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
  return __toCommonJS(import_careers_content_page_exports);
})();
