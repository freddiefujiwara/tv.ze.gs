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

const init = (root = document) => {
	if (!root?.querySelectorAll) {
		return;
	}

	const links = root.querySelectorAll('a[data-type][data-device-id][data-command]');
	links.forEach((link) => {
		link.addEventListener('click', (event) => {
			event.preventDefault();
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
