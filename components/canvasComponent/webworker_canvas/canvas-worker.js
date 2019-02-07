self.onmessage = (event) => {
    const offscreen = event.data.canvas;
    const context = offscreen.getContext('2d');



    function render(time) {
        drawSomething(context);
        // requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
};

const drawSomething = (ctx) =>{
    ctx.clearRect(0,0,1000,700);
    for(i=0; i<500000; i++) {

        var x = Math.floor(Math.random()*1000);
        var y = Math.floor(Math.random()*700);
        var radius = Math.floor(Math.random()*20);

        var r = Math.floor(Math.random()*255);
        var g = Math.floor(Math.random()*255);
        var b = Math.floor(Math.random()*255);

        ctx.beginPath();
        ctx.arc(x,y,radius,Math.PI*2,0,false);
        ctx.fillStyle = "rgba(" + r + "," + g + "," + b + ",1)";
        ctx.fill();
        ctx.closePath();

    }
}