// eslint-disable-next-line import/no-unresolved
import { toClassName, loadBlock, decorateBlock } from '../../scripts/aem.js';

/**
 * Convert block tables nested inside tab panels into proper block elements.
 * Block tables have a thead with a single th containing the block name.
 */
function decorateNestedBlocks(panel) {
  panel.querySelectorAll(':scope table').forEach((table) => {
    const th = table.querySelector('thead th');
    if (!th) return;

    const blockName = toClassName(th.textContent.trim());
    if (!blockName) return;

    // Create block div structure from table body rows
    const blockDiv = document.createElement('div');
    blockDiv.className = `${blockName} block`;
    blockDiv.dataset.blockName = blockName;
    blockDiv.dataset.blockStatus = 'initialized';

    table.querySelectorAll('tbody tr').forEach((tr) => {
      const row = document.createElement('div');
      [...tr.children].forEach((td) => {
        const cell = document.createElement('div');
        cell.append(...td.childNodes);
        row.append(cell);
      });
      blockDiv.append(row);
    });

    // Wrap in standard block wrapper/container structure
    const wrapper = document.createElement('div');
    wrapper.className = `${blockName}-wrapper`;
    wrapper.append(blockDiv);

    const container = document.createElement('div');
    container.className = `${blockName}-container`;
    container.append(wrapper);

    table.replaceWith(container);

    // Decorate and load the nested block
    decorateBlock(blockDiv);
    loadBlock(blockDiv);
  });
}

export default async function decorate(block) {
  // build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-coverage-list';
  tablist.setAttribute('role', 'tablist');

  // decorate tabs and tabpanels
  const tabs = [...block.children].map((child) => child.firstElementChild);
  tabs.forEach((tab, i) => {
    const id = toClassName(tab.textContent);

    // decorate tabpanel
    const tabpanel = block.children[i];
    tabpanel.className = 'tabs-coverage-panel';
    tabpanel.id = `tabpanel-${id}`;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

    // build tab button
    const button = document.createElement('button');
    button.className = 'tabs-coverage-tab';
    button.id = `tab-${id}`;

    button.innerHTML = tab.innerHTML;

    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });
    tablist.append(button);
    tab.remove();
  });

  block.prepend(tablist);

  // Decorate nested block tables inside tab panels
  block.querySelectorAll('.tabs-coverage-panel').forEach((panel) => {
    decorateNestedBlocks(panel);
  });
}
