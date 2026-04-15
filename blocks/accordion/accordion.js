export default function decorate(block) {
  [...block.children].forEach((row, i) => {
    const [triggerCell, panelCell] = row.children;

    // Unwrap <p> content into the button to avoid block-in-inline nesting
    const triggerSource = triggerCell.querySelector('p') ?? triggerCell;

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'accordion-trigger';
    trigger.setAttribute('aria-expanded', i === 0 ? 'true' : 'false');
    trigger.append(...triggerSource.childNodes);

    const panel = document.createElement('div');
    panel.className = 'accordion-panel';
    if (i !== 0) panel.hidden = true;
    panel.append(...panelCell.childNodes);

    row.className = 'accordion-item';
    row.innerHTML = '';
    row.append(trigger, panel);

    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
    });
  });
}
