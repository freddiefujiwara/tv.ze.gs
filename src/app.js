const api = (type, deviceId, command) =>
	fetch(`http://a.ze.gs/switchbot-${type}/-d/${deviceId}/-c/${command}`)
		.then((response) => {
			if (!response.ok) throw new Error('Network response was not ok');
			return response.text();
		})
		.then((data) => (console.log('Success:', data), data))
		.catch((error) => {
			console.error('There has been a problem with your fetch operation:', error);
			throw error;
		});

const repeatableCommands = { up: 1, down: 1, left: 1, right: 1 };

const init = (root = document) => {
	if (!root?.querySelectorAll) return;
	const els = root.querySelectorAll('.control[data-type][data-device-id][data-command]');
	const timers = new Map();
	const suppress = new WeakSet();
	const on = (fn) => (e) => (e.preventDefault(), fn(e.currentTarget));
	const start = (el) => {
		if (timers.has(el)) return;
		const { type, deviceId, command } = el.dataset;
		if (!repeatableCommands[command]) return;
		const send = () => api(type, deviceId, command);
		send();
		suppress.add(el);
		timers.set(el, setInterval(send, 200));
	};
	const stop = (el) => {
		const id = timers.get(el);
		if (!id) return;
		clearInterval(id);
		timers.delete(el);
	};
	els.forEach((el) => {
		const { command } = el.dataset;
		const stopHandler = on(stop);
		if (repeatableCommands[command]) {
			el.addEventListener('pointerdown', on(start));
			for (const name of ['pointerup', 'pointerleave', 'pointercancel']) {
				el.addEventListener(name, stopHandler);
			}
		}
		el.addEventListener('click', (e) => {
			e.preventDefault();
			const t = e.currentTarget;
			if (suppress.has(t)) return void suppress.delete(t);
			const { type, deviceId, command } = t.dataset;
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
