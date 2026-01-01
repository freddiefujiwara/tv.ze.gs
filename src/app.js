const buildUrl = (type, deviceId, command) =>
	`http://a.ze.gs/switchbot-${type}/-d/${deviceId}/-c/${command}`;

const api = (type, deviceId, command) =>
	fetch(buildUrl(type, deviceId, command))
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

const repeatableCommands = new Set(['up', 'down', 'left', 'right']);
const isRepeatable = (command) => repeatableCommands.has(command);

const init = (root = document) => {
	if (!root?.querySelectorAll) {
		return;
	}

	const links = root.querySelectorAll('.control[data-type][data-device-id][data-command]');
	const activeIntervals = new Map();
	const suppressClick = new WeakSet();
	const withTarget = (handler) => (event) => {
		event.preventDefault();
		handler(event.currentTarget);
	};

	const startRepeat = (link) => {
		if (activeIntervals.has(link)) return;
		const { type, deviceId, command } = link.dataset;
		if (!isRepeatable(command)) return;
		const send = () => api(type, deviceId, command);
		send();
		suppressClick.add(link);
		activeIntervals.set(link, setInterval(send, 200));
	};

	const stopRepeat = (link) => {
		const intervalId = activeIntervals.get(link);
		if (!intervalId) return;
		clearInterval(intervalId);
		activeIntervals.delete(link);
	};

	links.forEach((link) => {
		const stopHandler = withTarget(stopRepeat);
		link.addEventListener('pointerdown', withTarget(startRepeat));
		for (const name of ['pointerup', 'pointerleave', 'pointercancel']) {
			link.addEventListener(name, stopHandler);
		}
		link.addEventListener('click', (event) => {
			event.preventDefault();
			const currentTarget = event.currentTarget;
			if (suppressClick.has(currentTarget)) {
				suppressClick.delete(currentTarget);
				return;
			}
			const { type, deviceId, command } = currentTarget.dataset;
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
