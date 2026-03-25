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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-homepage.js
  function parse(element, { document }) {
    const heroImg = element.querySelector(".homepage-banner img, .grid-banner-img img, img");
    const heading = element.querySelector(".banner-h1, h1, h2");
    const description = element.querySelector(".grid-banner-content p:not(.banner-heading), .grid-banner-content p.margin-t-16");
    const cells = [];
    if (heroImg) {
      cells.push([heroImg]);
    }
    const contentDiv = document.createElement("div");
    if (heading) contentDiv.appendChild(heading);
    if (description) contentDiv.appendChild(description);
    cells.push([contentDiv]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-homepage", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-news.js
  function parse2(element, { document }) {
    const cardItems = element.querySelectorAll(".card-grey");
    const cells = [];
    cardItems.forEach((card) => {
      const img = card.querySelector(".latest-news-img img, img");
      const heading = card.querySelector("h3");
      const paragraphs = card.querySelectorAll("p");
      const link = card.querySelector("a:not(p a)");
      const imgCell = document.createElement("div");
      if (img) imgCell.appendChild(img);
      const textCell = document.createElement("div");
      if (heading) textCell.appendChild(heading);
      paragraphs.forEach((p) => textCell.appendChild(p));
      if (link) textCell.appendChild(link);
      cells.push([imgCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-news", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-plans.js
  function parse3(element, { document }) {
    const tabLinks = element.querySelectorAll(".tabLinks a");
    const tabSections = element.querySelectorAll(":scope > section");
    const cells = [];
    tabLinks.forEach((tabLink, index) => {
      const label = tabLink.textContent.trim();
      const section = tabSections[index];
      if (!section) return;
      const contentDiv = document.createElement("div");
      const children = Array.from(section.children);
      children.forEach((child) => contentDiv.appendChild(child.cloneNode(true)));
      cells.push([label, contentDiv]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-plans", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-resource.js
  function parse4(element, { document }) {
    const resourceItems = element.querySelectorAll(".grid-resource");
    const cells = [];
    resourceItems.forEach((item) => {
      const row = item.querySelector(".row");
      if (!row) return;
      const cols = row.querySelectorAll('[class*="col-"]');
      const textCol = cols[0];
      const imgCol = cols[1];
      const textCell = document.createElement("div");
      if (textCol) {
        const heading = textCol.querySelector("h3");
        const para = textCol.querySelector("p");
        const cta = textCol.querySelector("a.primary-btn, a");
        if (heading) textCell.appendChild(heading);
        if (para) textCell.appendChild(para);
        if (cta) textCell.appendChild(cta);
      }
      const imgCell = document.createElement("div");
      if (imgCol) {
        const img = imgCol.querySelector("img");
        if (img) imgCell.appendChild(img);
      }
      cells.push([textCell, imgCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-resource", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/bluecross-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        ".info-banner-covid",
        ".home-search"
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
        "noscript",
        ".ds-styles"
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

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-homepage": parse,
    "cards-news": parse2,
    "tabs-plans": parse3,
    "columns-resource": parse4
  };
  var transformers = [transform];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Alberta Blue Cross homepage with hero, feature cards, and promotional content",
    urls: ["https://www.ab.bluecross.ca/index.php"],
    blocks: [
      { name: "hero-homepage", instances: [".banner-container .hero-banner-grid"] },
      { name: "cards-news", instances: [".row.same-height"] },
      { name: "tabs-plans", instances: [".tabbed#homeTabs"] },
      { name: "columns-resource", instances: [".resource-grid"] },
      { name: "section-metadata", instances: ["section.bkg-grey"] }
    ],
    sections: [
      { id: "section-1", name: "Hero Banner", selector: ".banner-container", style: null, blocks: ["hero-homepage"], defaultContent: [] },
      { id: "section-2", name: "Search Bar", selector: ".home-search.abc-card", style: null, blocks: [], defaultContent: [] },
      { id: "section-3", name: "Latest News and Featured Topics", selector: "section.margin-t-56", style: null, blocks: ["cards-news"], defaultContent: [".col-lg-8 > h2", ".col-lg-4"] },
      { id: "section-4", name: "How Alberta Blue Cross Can Help", selector: "section:has(.tabbed)", style: null, blocks: ["tabs-plans"], defaultContent: [".container > .row > .col-12 > h2"] },
      { id: "section-5", name: "Wellbeing Resources", selector: "section.bkg-grey", style: "grey", blocks: ["columns-resource", "section-metadata"], defaultContent: ["section.bkg-grey .container > h2"] }
    ]
  };
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      if (blockDef.name === "section-metadata") return;
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
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  var import_homepage_default = {
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
      if (PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1) {
        try {
          transform2.call(null, "afterTransform", main, __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE }));
        } catch (e) {
          console.error("Sections transformer failed:", e);
        }
      }
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
  return __toCommonJS(import_homepage_exports);
})();
