self.postMessage('Worker running');
self.onmessage = (evt) => {
    postMessage("Worker received data: " + JSON.stringify(evt.data));
};
