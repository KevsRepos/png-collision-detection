let canvas, ctx, element, images, boundBorder;

const globalAlpha = 0.6;
const collisionAlpha = 154;
// 255 = 100%; 0.6 = 60%; 154 > 60%

export const collisionDetection = (node, {borders}) => {
    element = node;
    boundBorder = borders;

    const {width, height} = node.getBoundingClientRect();

    canvas = Object.assign(document.createElement('canvas'), {
        width: width,
        height: height
    });

    ctx = canvas.getContext('2d');
    ctx.globalAlpha = globalAlpha;

    images = [...node.querySelectorAll('img')];

    const watchImages = new MutationObserver((mut) => {
        if(mut[0]?.addedNodes[0].constructor.name !== 'HTMLImageElement') return;

        images.push(mut[0].addedNodes[0]);
    })

    watchImages.observe(node, {
        childList: true
    })

    // document.querySelector('main').appendChild(canvas)
}

const searchAlphaValues = () => {
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    for (let i = 3; i < pixels.length; i += 4) {
        if(pixels[i] >= collisionAlpha) {
            return true;
        }
    }

    return false;
}

export const isColliding = () => {
    if(!ctx || !images.length) return false;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (const img of images) {
        const {x, y, width, height} = img.getBoundingClientRect();

        const angle = Number(window.getComputedStyle(img).rotate.slice(0, -3));
        
        ctx.save();

        ctx.translate(x - element.offsetLeft + (width / 2), y - element.offsetTop + (height / 2));

        if(angle > 0) {
            ctx.rotate(angle * Math.PI / 180);
        }
        
        ctx.drawImage(img, 0 - (img.offsetWidth / 2), 0 - (img.offsetHeight / 2), img.offsetWidth, img.offsetHeight)

        ctx.restore()
    }

    if(boundBorder) {
        ctx.strokeStyle = '#000000';
        ctx.strokeRect(0, 0, canvas.width - 1, canvas.height - 1);
    }

    return searchAlphaValues();
}

