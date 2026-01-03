const fs = require('fs/promises');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');

const readAsset = async (assetPath) => {
	const data = await fs.readFile(assetPath, 'utf8');
	return data.trim();
};

const injectFallbackLinks = (html) =>
	html.replace(/<a([^>]*?)\s+href="#"([^>]*?)>/g, (match, before, after) => {
		const attrs = `${before} ${after}`;
		const type = attrs.match(/data-type="([^"]+)"/)?.[1];
		const deviceId = attrs.match(/data-device-id="([^"]+)"/)?.[1];
		const command = attrs.match(/data-command="([^"]+)"/)?.[1];
		if (!type || !deviceId || !command) return match;
		const href = `http://a.ze.gs/switchbot-${type}/-d/${deviceId}/-c/${command}?url=http://tv.ze.gs`;
		return `<a${before} href="${href}"${after}>`;
	});

const buildHtml = (html, styles, script) => {
	const withStyles = html.replace(
		/<link\s+rel="stylesheet"\s+href="\.\/styles\.css">/,
		`<style>\n${styles}\n</style>`
	);

	const withScript = withStyles.replace(
		/<script\s+src="\.\/app\.js"><\/script>/,
		`<script>\n${script}\n</script>`
	);

	return injectFallbackLinks(withScript);
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

	return buildHtml(html, styles, script);
};

const build = async () => {
	await fs.rm(DIST_DIR, { recursive: true, force: true });
	await fs.mkdir(DIST_DIR, { recursive: true });

	const bundledHtml = await inlineAssets();
	await fs.writeFile(path.join(DIST_DIR, 'index.html'), bundledHtml);
	console.log('Build complete.');
};

/* istanbul ignore next */
if (require.main === module) {
	build().catch((error) => {
		console.error('Build failed:', error);
		process.exit(1);
	});
}

/* istanbul ignore next */
if (typeof module !== 'undefined') {
	module.exports = {
		build,
		buildHtml,
		injectFallbackLinks,
		inlineAssets,
	};
}
