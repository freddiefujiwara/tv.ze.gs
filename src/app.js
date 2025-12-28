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

if (typeof window !== 'undefined') {
	window.api = api;
}

if (typeof module !== 'undefined') {
	module.exports = { api };
}
