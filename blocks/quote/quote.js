export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const content = row.querySelector(':scope > div');
  if (content) {
    content.classList.add('quote-content');
  }
}
