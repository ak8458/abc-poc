export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const cols = [...row.children];
  if (cols.length >= 2) {
    cols[0].classList.add('hero-guide-content');
    cols[1].classList.add('hero-guide-image');
  }
}
