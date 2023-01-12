let 
canvas: HTMLCanvasElement, 
ctx: CanvasRenderingContext2D, 
element: HTMLElement, 
images: Array<HTMLImageElement>, 
boundBorder: boolean,
nodeRect: DOMRect;

const globalAlpha = 0.6;
const collisionAlpha = 154;
// 255 = 100%; 0.6 = 60%; 154 > 60%

const drawBorder = () => {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, window.innerWidth, nodeRect.top);
    ctx.fillRect(nodeRect.left + nodeRect.width, nodeRect.top, window.innerWidth - nodeRect.left + nodeRect.width, window.innerHeight);
    ctx.fillRect(0, nodeRect.top + nodeRect.height, nodeRect.left + nodeRect.width, window.innerHeight - nodeRect.top + nodeRect.height);
    ctx.fillRect(0, nodeRect.top, nodeRect.left, nodeRect.height);
}

export const collisionDetection = (node: HTMLElement, {borders = false, control = false}: any) => {
    element = node;
    boundBorder = borders;

    nodeRect = node.getBoundingClientRect();

    canvas = Object.assign(document.createElement('canvas'), {
        width: window.innerWidth,
        height: window.innerHeight,
        style: `position: fixed; top: 0px; left: 0px; z-index: -1;`
    });

    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.globalAlpha = globalAlpha;

    images = [...node.querySelectorAll(`img`)];

    const watchSize = new MutationObserver(() => {
        nodeRect = node.getBoundingClientRect();
    });

    watchSize.observe(node, {
        attributeFilter: ['style']
    });

    const watchImages = new MutationObserver(() => {
        images = [...node.querySelectorAll('img')];
    })

    watchImages.observe(node, {
        childList: true
    })
 
    control && document.querySelector('main')?.appendChild(canvas);
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

export const draw = () => {
    if(!ctx || !images.length) return false;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (const img of images) {
        if(img.classList.contains('no-render')) continue;
        const {x, y, width, height} = img.getBoundingClientRect();

        const angle = Number(window.getComputedStyle(img).rotate.slice(0, -3));
        
        ctx.save();
        
        ctx.translate(x - img.offsetLeft + document.documentElement.scrollLeft + (width / 2), y - img.offsetTop + document.documentElement.scrollTop + (height / 2));

        if(angle > 0) {
            ctx.rotate(angle * Math.PI / 180);
        }
        
        ctx.drawImage(img, 0 - (img.offsetWidth / 2), 0 - (img.offsetHeight / 2), img.offsetWidth, img.offsetHeight)

        ctx.restore()
    }
}

export const isColliding = () => {
    draw();

    if(boundBorder) {
        drawBorder();
    }

    return searchAlphaValues();
}
