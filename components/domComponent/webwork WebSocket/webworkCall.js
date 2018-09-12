var worker = new Worker("hellowWorld.js");

// Receive messages from postMessage() calls in the Worker
worker.addEventListener("message", function(evt) {
    console.log("Message posted from webworker: " + evt.data);
});

// Pass data to the WebWorker
worker.postMessage({data: "123456789"});
