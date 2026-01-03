const { api, init } = require('../src/app');

describe('api', () => {
	beforeEach(() => {
		global.fetch = jest.fn();
		jest.spyOn(console, 'log').mockImplementation(() => {});
		jest.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('logs success and returns data when the response is ok', async () => {
		fetch.mockResolvedValue({
			ok: true,
			text: jest.fn().mockResolvedValue('ok'),
		});

		await expect(api('command', 'device-id', 'turnOn')).resolves.toBe('ok');
		expect(fetch).toHaveBeenCalledWith(
			'http://a.ze.gs/switchbot-command/-d/device-id/-c/turnOn'
		);
		expect(console.log).toHaveBeenCalledWith('Success:', 'ok');
	});

	it('throws an error when the response is not ok', async () => {
		fetch.mockResolvedValue({
			ok: false,
			text: jest.fn(),
		});

		await expect(api('tv', 'device-id', '1')).rejects.toThrow(
			'Network response was not ok'
		);
		expect(console.error).toHaveBeenCalledWith(
			'There has been a problem with your fetch operation:',
			expect.any(Error)
		);
	});

	it('throws an error when fetch rejects', async () => {
		const error = new Error('network down');
		fetch.mockRejectedValue(error);

		await expect(api('custom', 'device-id', 'menu')).rejects.toThrow(
			'network down'
		);
		expect(console.error).toHaveBeenCalledWith(
			'There has been a problem with your fetch operation:',
			error
		);
	});
});

describe('init', () => {
	beforeEach(() => {
		global.fetch = jest.fn().mockResolvedValue({
			ok: true,
			text: jest.fn().mockResolvedValue('ok'),
		});
		jest.spyOn(console, 'log').mockImplementation(() => {});
		jest.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		jest.restoreAllMocks();
		jest.useRealTimers();
	});

	it('wires up click handlers to links with dataset attributes', async () => {
		document.body.innerHTML = `
			<a class="control" href="http://a.ze.gs/switchbot-custom/-d/device/-c/menu?url=http://tv.ze.gs" data-type="custom" data-device-id="device" data-command="menu">M</a>
			<a class="control" href="http://a.ze.gs/switchbot-tv/-d/device/-c/1?url=http://tv.ze.gs" data-type="tv" data-device-id="device" data-command="1">1</a>
		`;

		init(document);

		const link = document.querySelector('.control[data-command="menu"]');
		expect(link.getAttribute('href')).toBe('#');
		const event = new MouseEvent('click', { bubbles: true, cancelable: true });
		const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
		link.dispatchEvent(event);
		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(preventDefaultSpy).toHaveBeenCalled();
		expect(fetch).toHaveBeenCalledWith(
			'http://a.ze.gs/switchbot-custom/-d/device/-c/menu'
		);
		expect(console.log).toHaveBeenCalledWith('Success:', 'ok');
	});

	it('updates hrefs for all matching controls', () => {
		document.body.innerHTML = `
			<a class="control" href="http://a.ze.gs/switchbot-custom/-d/device/-c/left?url=http://tv.ze.gs" data-type="custom" data-device-id="device" data-command="left">←</a>
			<a class="control" href="http://a.ze.gs/switchbot-custom/-d/device/-c/right?url=http://tv.ze.gs" data-type="custom" data-device-id="device" data-command="right">→</a>
		`;

		init(document);

		const links = [...document.querySelectorAll('.control')];
		expect(links.map((el) => el.getAttribute('href'))).toEqual(['#', '#']);
	});

	it('returns early when root is missing querySelectorAll', () => {
		const root = {};
		init(root);
		expect(fetch).not.toHaveBeenCalled();
	});

	it('uses document by default when no root is provided', async () => {
		document.body.innerHTML = `
			<a class="control" href="http://a.ze.gs/switchbot-custom/-d/device/-c/menu?url=http://tv.ze.gs" data-type="custom" data-device-id="device" data-command="menu">M</a>
		`;

		init();

		const link = document.querySelector('.control[data-command="menu"]');
		const event = new MouseEvent('click', { bubbles: true, cancelable: true });
		link.dispatchEvent(event);
		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(fetch).toHaveBeenCalledWith(
			'http://a.ze.gs/switchbot-custom/-d/device/-c/menu'
		);
	});

	it('registers and runs the DOMContentLoaded handler when window is available', () => {
		const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

		jest.resetModules();
		jest.isolateModules(() => {
			require('../src/app');
		});

		const domReadyCall = addEventListenerSpy.mock.calls.find(
			([eventName]) => eventName === 'DOMContentLoaded'
		);

		expect(domReadyCall).toBeDefined();
		const [, handler] = domReadyCall;
		handler();

		addEventListenerSpy.mockRestore();
	});

	it('skips window registration when window is undefined', () => {
		const originalWindow = global.window;
		delete global.window;

		jest.resetModules();
		jest.isolateModules(() => {
			require('../src/app');
		});

		global.window = originalWindow;
	});
});
