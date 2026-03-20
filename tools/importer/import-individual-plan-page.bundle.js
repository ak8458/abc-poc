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

  // tools/importer/parsers/hero.js
  function parse(element, { document }) {
    const heroImage = element.querySelector(".grid-banner-img img, .blue-assured-result img");
    const heading = element.querySelector("h1.banner-h1, h1, h2");
    const contentArea = element.querySelector(".grid-banner-content");
    const description = contentArea ? contentArea.querySelector(":scope > p:not(.banner-heading)") : element.querySelector("p");
    const ctaLink = element.querySelector("a.primary-btn, a.ba-quote-button");
    const phoneCard = element.querySelector(".abc-card");
    const cells = [];
    if (heroImage) {
      cells.push([heroImage]);
    }
    const contentWrapper = document.createElement("div");
    if (heading) contentWrapper.appendChild(heading);
    if (description) contentWrapper.appendChild(description);
    if (ctaLink) contentWrapper.appendChild(ctaLink);
    if (phoneCard) contentWrapper.appendChild(phoneCard);
    cells.push([contentWrapper]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs.js
  function parse2(element, { document }) {
    const tabButtons = element.querySelectorAll(".seg-control .seg-btn, .seg-control button");
    const contentPanels = element.querySelectorAll(".content-panel");
    const cells = [];
    tabButtons.forEach((btn, i) => {
      const label = btn.textContent.trim();
      const labelCell = document.createElement("div");
      labelCell.textContent = label;
      const contentCell = document.createElement("div");
      if (contentPanels[i]) {
        while (contentPanels[i].firstChild) {
          contentCell.appendChild(contentPanels[i].firstChild);
        }
      }
      cells.push([labelCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns.js
  function parse3(element, { document }) {
    const iconDiv = element.querySelector(":scope > div:first-child");
    const icon = iconDiv ? iconDiv.querySelector("img") : null;
    const textDiv = element.querySelector(":scope > div:last-child");
    const cells = [];
    const col1 = document.createElement("div");
    if (icon) col1.appendChild(icon);
    const col2 = document.createElement("div");
    if (textDiv) {
      while (textDiv.firstChild) {
        col2.appendChild(textDiv.firstChild);
      }
    }
    cells.push([col1, col2]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards.js
  function parse4(element, { document }) {
    const cards = element.querySelectorAll(".abc-card");
    const cells = [];
    cards.forEach((card) => {
      const cardWrapper = document.createElement("div");
      const heading = card.querySelector("h3, h2, h4");
      if (heading) cardWrapper.appendChild(heading);
      const desc = card.querySelector("p");
      if (desc) cardWrapper.appendChild(desc);
      const cta = card.querySelector("a.primary-btn, a.btn, a");
      if (cta) cardWrapper.appendChild(cta);
      cells.push([cardWrapper]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/bluecross-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".info-banner-covid",
        ".modal",
        ".stoplight-white",
        ".g-recaptcha",
        "noscript"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        ".ds-styles",
        ".breadcrumbs",
        ".new-menu",
        "iframe",
        "link",
        "noscript"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("onclick");
        el.removeAttribute("data-track");
        el.removeAttribute("data-dismiss");
      });
    }
  }

  // tools/importer/transformers/bluecross-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      const doc = element.ownerDocument || document;
      const sections = [...template.sections].reverse();
      sections.forEach((section) => {
        const selectorList = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectorList) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) return;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          if (sectionEl.nextSibling) {
            sectionEl.parentNode.insertBefore(sectionMetadata, sectionEl.nextSibling);
          } else {
            sectionEl.parentNode.appendChild(sectionMetadata);
          }
        }
        if (section.id !== template.sections[0].id) {
          const hr = doc.createElement("hr");
          sectionEl.parentNode.insertBefore(hr, sectionEl);
        }
      });
    }
  }

  // tools/importer/import-individual-plan-page.js
  var parsers = {
    "hero": parse,
    "tabs": parse2,
    "columns": parse3,
    "cards": parse4
  };
  var PAGE_TEMPLATE = {
    name: "individual-plan-page",
    description: "Individual health plan detail page with hero, plan features, coverage details, and call-to-action sections",
    urls: [
      "https://www.ab.bluecross.ca/plans/personal/individual/blue-assured-plan.php"
    ],
    sections: [
      {
        id: "section-hero",
        name: "Hero Banner",
        selector: "main > section:nth-child(2)",
        style: null,
        blocks: ["hero"],
        defaultContent: []
      },
      {
        id: "section-plan-details",
        name: "Plan Details Tabs",
        selector: "main > section:nth-child(3)",
        style: null,
        blocks: ["tabs", "columns"],
        defaultContent: ["main > section:nth-child(3) .content-panel h2", "main > section:nth-child(3) .content-panel p", "main > section:nth-child(3) .content-panel ul", "main > section:nth-child(3) .plan-btns a"]
      },
      {
        id: "section-other-plans",
        name: "Explore Other Plan Options",
        selector: "main > section:nth-child(4)",
        style: "grey",
        blocks: ["cards"],
        defaultContent: [".container-fluid.bkg-grey h2", ".container-fluid.bkg-grey > .container > .row:first-child p"]
      }
    ],
    blocks: [
      {
        name: "hero",
        instances: [".banner-container"]
      },
      {
        name: "tabs",
        instances: [".tab-wrapper"]
      },
      {
        name: "columns",
        instances: [".plan-blue-callout"],
        section: "plan-details"
      },
      {
        name: "cards",
        instances: [".card-group-3"],
        section: "other-plans"
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
  return __toCommonJS(import_individual_plan_page_exports);
})();
