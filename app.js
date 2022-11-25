let canvas, ctx, element, images;

const globalAlpha = 0.6;
const collisionAlpha = 154;
// 255 = 100%; 0.6 = 60%; 154 > 60%

export const collisionDetection = (node) => {
    element = node;
    const {width, height} = node.getBoundingClientRect();

    canvas = Object.assign(document.createElement('canvas'), {
        width: width,
        height: height
    });

    ctx = canvas.getContext('2d');
    ctx.globalAlpha = globalAlpha;

    images = [...node.querySelectorAll('img')];

    const watchImages = new MutationObserver((mut) => {
        if(mut[0].addedNodes[0].constructor.name !== 'HTMLImageElement') return;

        images.push(mut[0].addedNodes[0]);
    })

    watchImages.observe(node, {
        childList: true
    })

    document.querySelector('main').appendChild(canvas)
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

const getTransformMatrix = img => {
    return new DOMMatrix(window.getComputedStyle(img).transform);
}

export const isColliding = () => {
    if(!ctx || !images.length) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (const img of images) {
        const matrix = getTransformMatrix(img)

        ctx.save()

        if(matrix.a && matrix.b && matrix.c && matrix.d) {
            console.log(x, y);
            ctx.setTransform(
                matrix.m11, matrix.m12, matrix.m13,
                matrix.m21, matrix.m22, matrix.m23
            );
        }

        ctx.drawImage(img, x - img.offsetParent.offsetLeft, y - img.offsetParent.offsetTop, img.offsetWidth, img.offsetHeight)

        ctx.restore()
    }

    return searchAlphaValues();
}

