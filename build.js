const fs = require('fs/promises');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');

const readAsset = async (assetPath) => {
	const data = await fs.readFile(assetPath, 'utf8');
	return data.trim();
};

const inlineAssets = async () => {
	const indexPath = path.join(SRC_DIR, 'index.html');
	const stylesPath = path.join(SRC_DIR, 'styles.css');
	const scriptPath = path.join(SRC_DIR, 'app.js');

	const [html, styles, script] = await Promise.all([
		readAsset(indexPath),
		readAsset(stylesPath),
		readAsset(scriptPath),
	]);

	const withStyles = html.replace(
		/<link\s+rel="stylesheet"\s+href="\.\/styles\.css">/,
		`<style>\n${styles}\n</style>`
	);

	return withStyles.replace(
		/<script\s+src="\.\/app\.js"><\/script>/,
		`<script>\n${script}\n</script>`
	);
};

const build = async () => {
	await fs.rm(DIST_DIR, { recursive: true, force: true });
	await fs.mkdir(DIST_DIR, { recursive: true });

	const bundledHtml = await inlineAssets();
	await fs.writeFile(path.join(DIST_DIR, 'index.html'), bundledHtml);
	console.log('Build complete.');
};

build().catch((error) => {
	console.error('Build failed:', error);
	process.exit(1);
});
