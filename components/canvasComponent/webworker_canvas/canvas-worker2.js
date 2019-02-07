self.onmessage = (event) => {
    const offscreen = event.data.canvas;
    const context = offscreen.getContext('2d');
    const backgroundCanvas = new OffscreenCanvas(1000, 700);
    const backgroundContext = backgroundCanvas.getContext('2d');


    function render(time) {
        drawSomething(backgroundContext);
        const image = backgroundCanvas.transferToImageBitmap();
        context.drawImage(image,0,0,1000,700);
        // requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
};

const drawSomething = (ctx) =>{
    ctx.beginPath();
    ctx.rect(300, 50, 200, 100);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.lineWidth = 7;
    ctx.strokeStyle = 'black';
    ctx.stroke();
}