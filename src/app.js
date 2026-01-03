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

const init = (root = document) => {
	if (!root?.querySelectorAll) return;
	const els = root.querySelectorAll('.control[data-type][data-device-id][data-command]');
	els.forEach((el) => {
		el.setAttribute('href', '#');
		el.addEventListener('click', (e) => {
			e.preventDefault();
			const { type, deviceId, command } = e.currentTarget.dataset;
			api(type, deviceId, command);
		});
	});
};

if (typeof window !== 'undefined') {
	window.api = api;
	window.addEventListener('DOMContentLoaded', () => init(window.document));
}

/* istanbul ignore next */
if (typeof module !== 'undefined') {
	module.exports = { api, init };
}
