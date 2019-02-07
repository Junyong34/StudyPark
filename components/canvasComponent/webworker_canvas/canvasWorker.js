self.onmessage = (event) => {
    const offscreen = event.data.canvas;
    const ctx = offscreen.getContext('2d');



    const animate = () => {
        ctx.clearRect(0,0,offscreen.width,offscreen.height);
        if(radius  === maxR || radius === 0) isCheck = !isCheck;
        radius = isCheck ? radius + 1 : radius - 1;
        drawCircle(ctx,radius);
        requestAnimationFrame(animate);
    };
    animate();
};

let isCheck = false;
let maxR = 70;
let radius = 0;

const drawCircle = (ctx,r) => {
    ctx.beginPath();
    ctx.arc(100,100,r,0,Math.PI * 2);
    ctx.fill();
};
