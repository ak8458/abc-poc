#!/usr/bin/env node
/* eslint-disable */
// Aggregates ue/models/blocks/*.json into the three root-level component JSON files.
// Run via: npm run build:json

const fs = require('fs');
const path = require('path');

const BLOCKS_DIR = path.join(__dirname, 'models', 'blocks');
const ROOT_DIR = path.join(__dirname, '..');

const GROUP_META = {
  default: { title: 'Default Content', id: 'default' },
  sections: { title: 'Sections', id: 'sections' },
  blocks: { title: 'Blocks', id: 'blocks' },
};

function buildJson() {
  const files = fs
    .readdirSync(BLOCKS_DIR)
    .filter((f) => f.endsWith('.json'))
    .sort();

  const groups = { default: [], sections: [], blocks: [] };
  const models = [];
  const filters = [];

  for (const file of files) {
    const src = JSON.parse(fs.readFileSync(path.join(BLOCKS_DIR, file), 'utf8'));
    const group = src.group || 'blocks';

    if (src.definitions) groups[group].push(...src.definitions);
    if (src.models) models.push(...src.models);
    if (src.filters) filters.push(...src.filters);
  }

  const definitions = {
    groups: Object.entries(groups)
      .filter(([, components]) => components.length > 0)
      .map(([key, components]) => ({ ...GROUP_META[key], components })),
  };

  const write = (name, data) => {
    const dest = path.join(ROOT_DIR, name);
    fs.writeFileSync(dest, `${JSON.stringify(data, null, 2)}\n`);
    console.log(`  wrote ${name}`);
  };

  write('component-definition.json', definitions); // currently singular for some reason
  write('component-definitions.json', definitions); // should be plural per documentation
  write('component-models.json', models);
  write('component-filters.json', filters);

  console.log('build:json done');
}

buildJson();
