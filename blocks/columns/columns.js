export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });

  // Detect card pattern: every column starts with an image paragraph and has additional content
  const rows = [...block.children];
  const isCardPattern =
    cols.length >= 2 &&
    rows.every((row) =>
      [...row.children].every((col) => {
        const firstEl = col.firstElementChild;
        return (
          firstEl &&
          firstEl.tagName === 'P' &&
          firstEl.querySelector('picture') &&
          col.children.length > 1
        );
      }),
    );

  if (isCardPattern) {
    block.classList.add('columns-cards');
    rows.forEach((row) => {
      [...row.children].forEach((col) => {
        // Mark the leading image paragraph
        col.firstElementChild.classList.add('columns-card-image');

        // Collect remaining elements
        const contentEls = [...col.children].slice(1);
        if (!contentEls.length) return;

        // Last element becomes the card action if it contains a link
        const lastEl = contentEls[contentEls.length - 1];
        const bodyEls = lastEl.querySelector('a') ? contentEls.slice(0, -1) : contentEls;

        const bodyDiv = document.createElement('div');
        bodyDiv.classList.add('columns-card-body');
        bodyEls.forEach((el) => bodyDiv.append(el));
        col.append(bodyDiv);

        if (lastEl.querySelector('a')) {
          const actionDiv = document.createElement('div');
          actionDiv.classList.add('columns-card-action');
          actionDiv.append(lastEl);
          col.append(actionDiv);
        }
      });
    });
  }
}
