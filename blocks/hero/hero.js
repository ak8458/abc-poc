export default function decorate(block) {
  const content = document.createElement('div');
  content.className = 'hero-content';

  [...block.children].forEach((row) => {
    const pic = row.querySelector('picture');
    if (pic) {
      // Move picture to be a direct child of the block (background)
      block.append(pic);
    }
    // Move all non-picture content into hero-content wrapper
    [...row.children].forEach((col) => {
      if (!col.querySelector('picture') && col.children.length > 0) {
        [...col.children].forEach((child) => content.append(child));
      } else if (!col.querySelector('picture') && col.textContent.trim()) {
        content.append(col);
      }
    });
    row.remove();
  });

  block.prepend(content);
}
