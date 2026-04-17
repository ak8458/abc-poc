import {
  buildBlock,
  loadHeader,
  loadFooter,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
  getMetadata,
} from './aem.js';

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  if (
    h1 &&
    picture &&
    // eslint-disable-next-line no-bitwise
    h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING
  ) {
    // Check if h1 or picture is already inside a hero block
    if (h1.closest('.hero') || picture.closest('.hero')) {
      return; // Don't create a duplicate hero block
    }
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

function isIconLeadParagraph(element) {
  const icon = element?.querySelector(':scope > span.icon');

  return (
    element?.tagName === 'P' &&
    element.children.length === 1 &&
    !!icon &&
    element.textContent.trim() === ''
  );
}

function isIconColumnsGroup(elements, startIndex) {
  const [icon, heading, copy] = elements.slice(startIndex, startIndex + 3);

  return isIconLeadParagraph(icon) && heading?.tagName === 'H3' && copy?.tagName === 'P';
}

function buildIconColumnsBlocks(main) {
  main.querySelectorAll(':scope > div').forEach((section) => {
    const offsets = [0, 3, 6];
    const elements = [...section.children]; // snapshot once; avoids live-collection index drift
    let i = 0;

    while (i + 8 < elements.length) {
      const start = i; // snapshot to avoid no-loop-func with callback captures
      const isMatch = offsets.every((offset) => isIconColumnsGroup(elements, start + offset));

      if (isMatch) {
        const block = document.createElement('div');
        const row = document.createElement('div');

        block.classList.add('columns');
        block.append(row);
        section.insertBefore(block, elements[start]);

        offsets.forEach((offset) => {
          const column = document.createElement('div');
          elements.slice(start + offset, start + offset + 3).forEach((el) => column.append(el));
          row.append(column);
        });

        i += 9; // skip past all 9 consumed elements
      } else {
        i += 1;
      }
    }
  });
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost'))
      sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Auto-blocks an accordion from sections with an h2 followed by even p pairs (question + answer).
 * @param {Element} main The container element
 */
function buildAccordionBlock(main) {
  main.querySelectorAll(':scope > div').forEach((section) => {
    const children = [...section.children];
    const [first, ...rest] = children;

    if (first?.tagName !== 'H2') return;
    if (!rest.every((el) => el.tagName === 'P')) return;
    if (rest.length < 4 || rest.length % 2 !== 0) return;

    const pairs = [];
    for (let i = 0; i < rest.length; i += 2) {
      pairs.push([rest[i], rest[i + 1]]);
    }

    const block = buildBlock('accordion', pairs);
    section.append(block);
    rest.forEach((p) => p.remove());
  });
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    // auto load `*/fragments/*` references
    const fragments = [...main.querySelectorAll('a[href*="/fragments/"]')].filter(
      (f) => !f.closest('.fragment'),
    );
    if (fragments.length > 0) {
      // eslint-disable-next-line import/no-cycle
      import('../blocks/fragment/fragment.js').then(({ loadFragment }) => {
        fragments.forEach(async (fragment) => {
          try {
            const { pathname } = new URL(fragment.href);
            const frag = await loadFragment(pathname);
            fragment.parentElement.replaceWith(...frag.children);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Fragment loading failed', error);
          }
        });
      });
    }

    buildAccordionBlock(main);
    buildIconColumnsBlocks(main);
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates formatted links to style them as buttons.
 * @param {HTMLElement} main The main container element
 */
function decorateButtons(main) {
  main.querySelectorAll('p a[href]').forEach((a) => {
    a.title = a.title || a.textContent;
    const p = a.closest('p');
    const text = a.textContent.trim();

    // quick structural checks
    if (a.querySelector('img') || p.textContent.trim() !== text) return;

    // skip URL display links
    try {
      if (new URL(a.href).href === new URL(text, window.location).href) return;
    } catch {
      /* continue */
    }

    // require authored formatting for buttonization
    const strong = a.closest('strong');
    const em = a.closest('em');
    if (!strong && !em) return;

    p.className = 'button-wrapper';
    a.className = 'button';
    if (strong && em) {
      // high-impact call-to-action
      a.classList.add('accent');
      const outer = strong.contains(em) ? strong : em;
      outer.replaceWith(a);
    } else if (strong) {
      a.classList.add('primary');
      strong.replaceWith(a);
    } else {
      a.classList.add('secondary');
      em.replaceWith(a);
    }
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateButtons(main);
}

async function loadTheme() {
  const theme = getMetadata('theme');
  if (!theme) {
    return;
  }

  const themes = theme
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean);
  await Promise.all(
    themes.map(async (currentTheme) => {
      try {
        await loadCSS(`${window.hlx.codeBasePath}/styles/themes/${currentTheme}.css`);
      } catch (e) {
        // ignore theme loading failures so page rendering is not blocked
      }
    }),
  );
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  await loadTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  loadHeader(doc.querySelector('header'));

  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

// UE Editor support before page load
if (/\.(stage-ue|ue)\.da\.live$/.test(window.location.hostname)) {
  // eslint-disable-next-line import/no-unresolved
  await import(`${window.hlx.codeBasePath}/ue/scripts/ue.js`).then(({ default: ue }) => ue());
}

loadPage();
