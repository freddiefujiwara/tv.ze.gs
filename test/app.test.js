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
	});

	it('wires up click handlers to links with dataset attributes', async () => {
		document.body.innerHTML = `
			<a href="#" data-type="custom" data-device-id="device" data-command="menu">M</a>
			<a href="#" data-type="tv" data-device-id="device" data-command="1">1</a>
		`;

		init(document);

		const link = document.querySelector('a[data-command="menu"]');
		const event = new MouseEvent('click', { bubbles: true, cancelable: true });
		const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
		link.dispatchEvent(event);
		await new Promise((resolve) => setImmediate(resolve));

		expect(preventDefaultSpy).toHaveBeenCalled();
		expect(fetch).toHaveBeenCalledWith(
			'http://a.ze.gs/switchbot-custom/-d/device/-c/menu'
		);
		expect(console.log).toHaveBeenCalledWith('Success:', 'ok');
	});

	it('returns early when root is missing querySelectorAll', () => {
		const root = {};
		init(root);
		expect(fetch).not.toHaveBeenCalled();
	});
});
