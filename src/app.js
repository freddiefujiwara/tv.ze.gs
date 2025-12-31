const api = (type, deviceId, command) => {
	return fetch(`http://a.ze.gs/switchbot-${type}/-d/${deviceId}/-c/${command}`)
		.then((response) => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.text();
		})
		.then((data) => {
			console.log('Success:', data);
			return data;
		})
		.catch((error) => {
			console.error('There has been a problem with your fetch operation:', error);
			throw error;
		});
};

const repeatIntervalMs = 200;

const init = (root = document) => {
	if (!root?.querySelectorAll) {
		return;
	}

	const links = root.querySelectorAll('a[data-type][data-device-id][data-command]');
	const activeIntervals = new Map();
	const suppressClick = new WeakSet();

	const startRepeat = (link) => {
		if (activeIntervals.has(link)) {
			return;
		}
		const { type, deviceId, command } = link.dataset;
		api(type, deviceId, command);
		suppressClick.add(link);
		const intervalId = setInterval(() => {
			api(type, deviceId, command);
		}, repeatIntervalMs);
		activeIntervals.set(link, intervalId);
	};

	const stopRepeat = (link) => {
		const intervalId = activeIntervals.get(link);
		if (!intervalId) {
			return;
		}
		clearInterval(intervalId);
		activeIntervals.delete(link);
	};

	links.forEach((link) => {
		link.addEventListener('pointerdown', (event) => {
			event.preventDefault();
			startRepeat(event.currentTarget);
		});
		link.addEventListener('pointerup', (event) => {
			event.preventDefault();
			stopRepeat(event.currentTarget);
		});
		link.addEventListener('pointerleave', (event) => {
			event.preventDefault();
			stopRepeat(event.currentTarget);
		});
		link.addEventListener('pointercancel', (event) => {
			event.preventDefault();
			stopRepeat(event.currentTarget);
		});
		link.addEventListener('click', (event) => {
			event.preventDefault();
			if (suppressClick.has(event.currentTarget)) {
				suppressClick.delete(event.currentTarget);
				return;
			}
			const { type, deviceId, command } = event.currentTarget.dataset;
			api(type, deviceId, command);
		});
	});
};

if (typeof window !== 'undefined') {
	window.api = api;
	window.addEventListener('DOMContentLoaded', () => init(window.document));
}

if (typeof module !== 'undefined') {
	module.exports = { api, init };
}
