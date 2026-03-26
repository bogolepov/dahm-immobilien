// netlify/functions/lib/emails/postprocess-html.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import dahm from '../../../../src/data/dahm.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlDir = path.join(__dirname, 'html');

const isProduction = process.env.NODE_ENV === 'production' || process.argv.includes('--prod');

const replacements = {
	website_url: dahm.website_link,
	website_url_text: dahm.domain,
	company_name: dahm.company_fullname,
};

console.log('Replacements that will be applied:');
console.log(replacements);

const processFile = filePath => {
	let content = fs.readFileSync(filePath, 'utf-8');
	let replaced = content;

	// Optimization only in production mode
	if (isProduction) {
		replaced = replaced
			// Remove HTML comments
			// .replace(/<!--[\s\S]*?-->/g, '')
			// (optional) remove spaces around = in attributes
			// .replace(/\s*=\s*/g, '=')
			// Remove empty style and class attributes
			.replace(/\s+(style|class)=""/g, '')
			// Remove multiple spaces and tabs
			.replace(/\s{2,}/g, ' ')
			// Remove spaces between tags (safe for inline elements)
			.replace(/>\s+</g, '><')
			// Remove unnecessary line breaks
			.replace(/\n\s*\n/g, '\n');
	}

	// First pass — replace known values
	for (const [key, value] of Object.entries(replacements)) {
		const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const pattern = new RegExp(`{{{\\s*${escapedKey}\\s*}}}`, 'g');
		replaced = replaced.replace(pattern, value);
	}

	// Second pass — search for remaining {{{ ... }}}
	const leftoverPattern = /{{{[^}]*}}}/g;
	const leftovers = replaced.match(leftoverPattern) || [];

	if (leftovers.length > 0) {
		console.warn(`\n⚠️  In file ${path.basename(filePath)} there are unreplaced placeholders:`);
		leftovers.forEach((match, i) => {
			console.warn(`  ${i + 1}. ${match}`);
		});
		console.warn('Check if these keys have been added to the replacements object.\n');
	}

	// Write the result (even if there were warnings)
	if (replaced !== content) {
		fs.writeFileSync(filePath, replaced, 'utf-8');
		console.log(`Updated: ${path.basename(filePath)}`);
	} else {
		console.log(`No changes: ${path.basename(filePath)}`);
	}

	// Return the number of found "leftovers" — can be used for exit code, if needed
	return leftovers.length;
};

const buildAll = () => {
	const files = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));

	if (files.length === 0) {
		console.warn('No html files found in the folder');
		return;
	}

	let totalLeftovers = 0;

	console.log(`Processing ${files.length} files...`);
	for (const file of files) {
		const fullPath = path.join(htmlDir, file);
		totalLeftovers += processFile(fullPath);
	}

	console.log('Post-processing completed.');

	if (!totalLeftovers) console.log('All known placeholders have been replaced.');
};

buildAll();
