/**
 * Normalize a coverage table so the first row becomes a semantic table header.
 * @param {HTMLTableElement} table
 */
function normalizeTable(table) {
  if (table.querySelector('thead')) return;

  const rows = [...table.rows];
  if (rows.length === 0) return;

  const [headerRow, ...bodyRows] = rows;
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  const headTr = document.createElement('tr');

  [...headerRow.cells].forEach((cell) => {
    const th = document.createElement('th');
    th.setAttribute('scope', 'col');
    th.innerHTML = cell.innerHTML;
    headTr.append(th);
  });
  thead.append(headTr);

  bodyRows.forEach((row) => {
    const tr = document.createElement('tr');
    [...row.cells].forEach((cell) => {
      const td = document.createElement('td');
      td.innerHTML = cell.innerHTML;
      tr.append(td);
    });
    tbody.append(tr);
  });

  table.replaceChildren(thead, tbody);
}

/**
 *
 * @param {Element} block
 */
export default function decorate(block) {
  block.querySelectorAll('table').forEach((table) => {
    normalizeTable(table);
  });
}
