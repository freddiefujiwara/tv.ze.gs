const fs = require('fs/promises');
const path = require('path');
const { build, buildHtml, injectFallbackLinks, inlineAssets } = require('../build');

describe('build', () => {
	const distDir = path.join(__dirname, '..', 'dist');

	afterEach(async () => {
		await fs.rm(distDir, { recursive: true, force: true });
	});

	it('inlines styles/scripts and injects fallback hrefs', () => {
		const html = `
			<!doctype html>
			<html>
				<head>
					<link rel="stylesheet" href="./styles.css">
				</head>
				<body>
					<a class="control" href="#" data-type="tv" data-device-id="device" data-command="7">7</a>
					<script src="./app.js"></script>
				</body>
			</html>
		`.trim();
		const styles = 'body { color: red; }';
		const script = 'console.log("hi")';

		const result = buildHtml(html, styles, script);

		expect(result).toContain(`<style>\n${styles}\n</style>`);
		expect(result).toContain(`<script>\n${script}\n</script>`);
		expect(result).toContain(
			'http://a.ze.gs/switchbot-tv/-d/device/-c/7?url=http://tv.ze.gs'
		);
	});

	it('reads assets from src and returns bundled html', async () => {
		const bundledHtml = await inlineAssets();

		expect(bundledHtml).toContain('<style>');
		expect(bundledHtml).toContain('<script>');
	});

	it('writes bundled html into dist/index.html', async () => {
		const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
		await build();

		const output = await fs.readFile(path.join(distDir, 'index.html'), 'utf8');
		expect(output).toContain('<style>');
		expect(output).toContain('<script>');
		logSpy.mockRestore();
	});

	it('leaves anchors alone when data attributes are missing', () => {
		const html = `
			<a class="control" href="#" data-type="tv" data-device-id="device">7</a>
		`.trim();

		const result = injectFallbackLinks(html);

		expect(result).toBe(html);
	});
});
