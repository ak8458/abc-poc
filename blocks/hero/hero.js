export default function decorate(block) {
  const content = document.createElement('div');
  content.className = 'hero-content';

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        // Move picture to be a direct child of the block (background)
        // Remove the wrapping <p> if picture is inside one
        const picParent = pic.parentElement;
        block.append(pic);
        if (picParent && picParent.tagName === 'P' && !picParent.textContent.trim()) {
          picParent.remove();
        }
      }
      // Move remaining children into hero-content wrapper
      [...col.children].forEach((child) => {
        if (child.tagName !== 'PICTURE') {
          content.append(child);
        }
      });
    });
    row.remove();
  });

  // Remove empty paragraphs left behind
  content.querySelectorAll('p:empty').forEach((p) => p.remove());

  block.prepend(content);
}
