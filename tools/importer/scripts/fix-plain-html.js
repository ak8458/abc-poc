#!/usr/bin/env node
/**
 * Post-processes .plain.html files to ensure each section is on a single line.
 *
 * The DA content pipeline strips block divs from multi-line sections
 * (caused by <li> elements serialized on separate lines). Collapsing
 * each top-level <div> section to a single line fixes this.
 *
 * Usage: node fix-plain-html.js <path-to-plain-html>
 */
const fs = require('fs');

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node fix-plain-html.js <path-to-plain-html>');
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');

// Parse top-level <div> sections by tracking depth
const sections = [];
let current = '';
let depth = 0;
let i = 0;

while (i < content.length) {
  // Check for opening <div
  if (content.startsWith('<div', i) && (content[i + 4] === '>' || content[i + 4] === ' ')) {
    if (depth === 0 && current.trim()) {
      // Whitespace between sections
      sections.push({ type: 'gap', text: current });
      current = '';
    }
    depth += 1;
    current += content[i];
    i += 1;
  // Check for closing </div>
  } else if (content.startsWith('</div>', i)) {
    current += '</div>';
    i += 6;
    depth -= 1;
    if (depth === 0) {
      // End of a top-level section — collapse to single line
      const collapsed = current.replace(/\n\s*/g, '');
      sections.push({ type: 'section', text: collapsed });
      current = '';
    }
  } else {
    current += content[i];
    i += 1;
  }
}

// Any remaining content
if (current.trim()) {
  sections.push({ type: 'gap', text: current });
}

const output = sections.map((s) => s.text).join('\n');
fs.writeFileSync(filePath, output);

// Verify
const lineCount = output.split('\n').length;
const sectionCount = sections.filter((s) => s.type === 'section').length;
console.log(`Fixed ${filePath}: ${sectionCount} sections, ${lineCount} lines`);
