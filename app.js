let canvas, ctx, imgs;

export const collision = node => {
    const {width, height} = node.getBoundingClientRect();

    canvas = Object.assign(document.createElement('canvas'), {
        width: width,
        height: height
    });

    ctx = canvas.getContext('2d');
    ctx.globalAlpha = 0.6;

    imgs = node.querySelectorAll('img');

    Promise.all(Array.from(imgs).filter(img => !img.complete).map(img => new Promise(resolve => { img.onload = img.onerror = resolve; }))).then(() => {
        imgs.forEach(img => {
            ctx.drawImage(img, img.offsetLeft, img.offsetTop, img.offsetWidth, img.offsetHeight);
        })
    });
}

const getTransform = img => {
    const {m41, m42} = new DOMMatrix(window.getComputedStyle(img).transform)
    return {x: m41, y: m42}
}

const searchAlphaValues = () => {
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    for (let i = 3; i < pixels.length; i += 4) {
        if(pixels[i] >= 214) {
            return true;
        }
    }

    return false;
}

export const isColliding = () => {
    if(!ctx || !imgs.length) return;

    ctx.fillStyle = '#ffffff';
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    imgs?.forEach(img => {
        const {x, y} = getTransform(img);
        ctx.drawImage(img, (x || img.offsetLeft), (y || img.offsetTop), img.offsetWidth, img.offsetHeight);
    })

    return searchAlphaValues();
}