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

  // tools/importer/import-individual-plan-page.js
  var import_individual_plan_page_exports = {};
  __export(import_individual_plan_page_exports, {
    default: () => import_individual_plan_page_default
  });

  // tools/importer/parsers/hero-plan.js
  function parse(element, { document }) {
    const heroImg = element.querySelector(".grid-banner-img img, .blue-choice-result img, .grid-banner-img picture img") || element.querySelector(":scope > div:not(.grid-banner-content) img");
    const heading = element.querySelector("h1, .banner-h1, h2");
    const contentArea = element.querySelector(".grid-banner-content") || element;
    const descriptionP = contentArea.querySelector("p.margin-t-16, p:not(.banner-heading):not(.margin-b-0)");
    const ctaLink = contentArea.querySelector('a.primary-btn, a.bc-quote-button, a[href*="quote"]');
    const contactCard = contentArea.querySelector(".abc-card");
    const cells = [];
    if (heroImg) {
      cells.push([heroImg]);
    }
    const contentCell = document.createElement("div");
    if (heading) contentCell.append(heading);
    if (descriptionP) contentCell.append(descriptionP);
    if (ctaLink) contentCell.append(ctaLink);
    if (contactCard) contentCell.append(contactCard);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-plan", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-coverage.js
  function parse2(element, { document }) {
    const tabButtons = Array.from(element.querySelectorAll(".seg-btn, button"));
    const tabWrapper = element.closest(".tab-wrapper") || element.parentElement;
    const contentPanels = tabWrapper ? Array.from(tabWrapper.querySelectorAll(".content-panel")) : [];
    const cells = [];
    tabButtons.forEach((btn, index) => {
      const tabLabel = btn.textContent.trim();
      const panel = contentPanels[index];
      if (panel) {
        cells.push([tabLabel, panel]);
      } else {
        const labelEl = document.createElement("p");
        labelEl.textContent = tabLabel;
        cells.push([labelEl]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-coverage", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-features.js
  function parse3(element, { document }) {
    const contentCol = element.querySelector(".col-lg-8, .col-md-8");
    const imageCol = element.querySelector(".col-lg-4, .col-md-4");
    const circleImg = imageCol ? imageCol.querySelector("img") : element.querySelector("img.circle-img");
    const cells = [];
    const contentCell = document.createElement("div");
    const heading = contentCol ? contentCol.querySelector("h2") : element.querySelector("h2");
    if (heading) contentCell.append(heading);
    const checkList = contentCol ? contentCol.querySelector("ul.check-list, ul") : element.querySelector("ul.check-list");
    if (checkList) contentCell.append(checkList);
    const pdfLink = contentCol ? contentCol.querySelector('a[href*=".pdf"]') : element.querySelector('a[href*=".pdf"]');
    if (pdfLink) {
      const p = document.createElement("p");
      p.append(pdfLink);
      contentCell.append(p);
    }
    const imageCell = document.createElement("div");
    if (circleImg) imageCell.append(circleImg);
    cells.push([contentCell, imageCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-features", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/table-coverage.js
  function parse4(element, { document }) {
    const cells = [];
    const desktopTable = element.querySelector(".desktop-table");
    if (desktopTable) {
      const panels = Array.from(desktopTable.querySelectorAll(".tab-panel"));
      panels.forEach((panel) => {
        const heading = panel.querySelector("h3, .panel-heading");
        const table = panel.querySelector("table");
        if (table) {
          const cell = document.createElement("div");
          if (heading) {
            const h3 = document.createElement("h3");
            h3.textContent = heading.textContent.trim();
            cell.append(h3);
          }
          cell.append(table);
          cells.push([cell]);
        }
      });
    }
    if (cells.length === 0) {
      const tables = Array.from(element.querySelectorAll("table"));
      tables.forEach((table) => {
        cells.push([table]);
      });
    }
    if (cells.length === 0) {
      cells.push([element]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "table-coverage", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-plan.js
  function parse5(element, { document }) {
    const cards = Array.from(element.querySelectorAll(".abc-card"));
    const cells = [];
    cards.forEach((card) => {
      const cardCell = document.createElement("div");
      const heading = card.querySelector("h3");
      if (heading) cardCell.append(heading);
      const description = card.querySelector("p");
      if (description) cardCell.append(description);
      const ctaLink = card.querySelector("a.primary-btn, a.btn");
      if (ctaLink) {
        const p = document.createElement("p");
        p.append(ctaLink);
        cardCell.append(p);
      }
      cells.push([cardCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-plan", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/bluecross-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".modal",
        "#surveyModal",
        "#exampleModal",
        "#formSubmitted"
      ]);
      WebImporter.DOMUtils.remove(element, [".informational-banner"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        ".ds-styles",
        ".breadcrumbs",
        ".stoplight-white",
        ".stoplight",
        "#thankYouBox",
        "iframe",
        "link",
        "noscript"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("onclick");
        el.removeAttribute("data-track");
        el.removeAttribute("data-analytics");
      });
    }
  }

  // tools/importer/transformers/bluecross-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      const template = payload && payload.template;
      if (!template || !template.sections || template.sections.length < 2) return;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selectorList = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectorList) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.parentNode.insertBefore(metaBlock, sectionEl.nextSibling);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.parentNode.insertBefore(hr, sectionEl);
        }
      }
    }
  }

  // tools/importer/import-individual-plan-page.js
  var parsers = {
    "hero-plan": parse,
    "tabs-coverage": parse2,
    "columns-features": parse3,
    "table-coverage": parse4,
    "cards-plan": parse5
  };
  var PAGE_TEMPLATE = {
    name: "individual-plan-page",
    description: "Individual insurance plan detail page with plan features, coverage details, and pricing information",
    urls: [
      "https://www.ab.bluecross.ca/plans/personal/individual/blue-choice-plan.php"
    ],
    blocks: [
      {
        name: "hero-plan",
        instances: [".hero-banner-grid"]
      },
      {
        name: "tabs-coverage",
        instances: [".seg-control"]
      },
      {
        name: "columns-features",
        instances: [".row.grey-callout"]
      },
      {
        name: "table-coverage",
        instances: ["#extended-health", "#optional-dental", "#prescription-drug"]
      },
      {
        name: "cards-plan",
        instances: [".card-group-3"]
      }
    ],
    sections: [
      {
        id: "section-1-hero",
        name: "Hero Banner",
        selector: ".hero-banner-grid",
        style: null,
        blocks: ["hero-plan"],
        defaultContent: []
      },
      {
        id: "section-2-plan-overview",
        name: "Plan Overview Content",
        selector: ".seg-control",
        style: null,
        blocks: ["tabs-coverage", "columns-features", "table-coverage"],
        defaultContent: ["#overview h2", "#overview p"]
      },
      {
        id: "section-3-other-plans",
        name: "Explore Other Plans",
        selector: ".container-fluid.bkg-grey",
        style: "grey",
        blocks: ["cards-plan"],
        defaultContent: [".bkg-grey .col-12 h2", ".bkg-grey .col-12 p"]
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
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_individual_plan_page_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
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
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "").replace(/\.php$/, "")
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
  return __toCommonJS(import_individual_plan_page_exports);
})();
