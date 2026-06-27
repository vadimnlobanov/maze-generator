const windowInnerWidth = document.getElementById("content").clientWidth;
const windowInnerHeight = document.getElementById("content").clientHeight;
document.body.style.width = windowInnerWidth;
document.body.style.height = windowInnerHeight;
const canvas = document.querySelector("canvas");
const contentSize = document.body.getBoundingClientRect();
const sizeBlock = contentSize.height / 100;
canvas.setAttribute("width", contentSize.width - 10);
canvas.setAttribute("height", contentSize.height - 10);
const ctx = canvas.getContext("2d");
ctx.transform(1, 0, 0, -1, 0, canvas.height)
const xMaxBlock = Math.floor(contentSize.width / sizeBlock);
const yMaxBlock = Math.floor(contentSize.height / sizeBlock);
const sizeLab = (Math.floor(contentSize.height / sizeBlock) % 2) ?
  Math.floor(contentSize.height / sizeBlock) :
  (Math.floor(contentSize.height / sizeBlock) - 1) ;
const states = {
  startPos: {
    x: 1,
    y: 1
  },
  posNow: {
    x: 1,
    y: 1
  },
  path: [
    {
      x: 1,
      y: 1
    },
  ]
}





let arrEmpty = [];

const labirint = [...new Array(sizeLab)].map((el, y) => {
  return [...new Array(sizeLab)].map((el, x) => {
    if (!(x % 2) || !(y % 2)) return 0
    else {
      if (x === 1 && y === 1) return 3
      else arrEmpty.push({ x: x, y: y });
      return 1
    }
  });
});

const drawOldLab = () => {
  labirint.forEach((row, y) => {
    return row.forEach((state, x) => {
      if (state) {
        if (state === 3) ctx.fillStyle = '#44aa77';
        else ctx.fillStyle = 'red';
        ctx.fillRect(x * sizeBlock, y * sizeBlock, sizeBlock, sizeBlock);
      }
      else {
        ctx.fillStyle = '#000000';
        ctx.fillRect(x * sizeBlock, y * sizeBlock, sizeBlock, sizeBlock);
      }
    })
  })
}
drawOldLab();

const emptySquareColor = () => '#fff'

const drawNewLab = (oldPos, newPos) => {
  if (oldPos.x - newPos.x < 0) {
    ctx.fillStyle = emptySquareColor();
    ctx.fillRect((newPos.x - 1) * sizeBlock, newPos.y * sizeBlock, sizeBlock, sizeBlock);
  }
  else if (oldPos.x - newPos.x > 0) {
    ctx.fillStyle = emptySquareColor();
    ctx.fillRect((newPos.x + 1) * sizeBlock, newPos.y * sizeBlock, sizeBlock, sizeBlock);
  }
  else if (oldPos.y - newPos.y < 0) {
    ctx.fillStyle = emptySquareColor();
    ctx.fillRect(newPos.x * sizeBlock, (newPos.y - 1) * sizeBlock, sizeBlock, sizeBlock);
  }
  else if (oldPos.y - newPos.y > 0) {
    ctx.fillStyle = emptySquareColor();
    ctx.fillRect(newPos.x * sizeBlock, (newPos.y + 1) * sizeBlock, sizeBlock, sizeBlock);
  }
  ctx.fillStyle = emptySquareColor();
  ctx.fillRect(newPos.x * sizeBlock, newPos.y * sizeBlock, sizeBlock, sizeBlock);
}

const randomVector = (countVector, vectors) => {
  const rnd = Math.floor(Math.random() * (countVector - 0.001));
  return vectors[rnd]
}

const deleteEmpty = (pos) => {
  arrEmpty.forEach((empty, i, arr) => {
    if (empty.x === pos.x && empty.y === pos.y) arr.splice(i, 1)
  })
}

const detectEmpty = (pos) => {
  return arrEmpty.filter((empty) => {
    if (pos.x + 2 === empty.x && pos.y === empty.y) {
      return true
    }
    if (pos.x === empty.x && pos.y + 2 === empty.y) {
      return true
    }
    if (pos.x - 2 === empty.x && pos.y === empty.y) {
      return true
    }
    if (pos.x === empty.x && pos.y - 2 === empty.y) {
      return true
    }
  })
}

let frameCound = 0
const timeFrame = 1 // ms
const generatePerFrame = 1
const createLabirint = () => {
  const newArreyEmpty = detectEmpty(states.posNow);
  if (!newArreyEmpty.length) {
    if (states.path.length > 0) {
      states.path.splice((states.path.length - 1), 1)
      states.posNow = states.path[states.path.length - 1];
      frameCound++;
      if (frameCound > generatePerFrame) {
        frameCound = 0
        setTimeout(createLabirint, timeFrame);
      } else {
        createLabirint();
      }
    }
  }
  else {
    const newPosition = randomVector(newArreyEmpty.length, newArreyEmpty);
    states.path.push(newPosition);
    drawNewLab(states.posNow, newPosition);
    states.posNow = newPosition;
    deleteEmpty(states.posNow);
    frameCound++;
    if (frameCound > generatePerFrame) {
      frameCound = 0
      setTimeout(createLabirint, timeFrame);
    } else {
      createLabirint();
    }
  }
}
createLabirint();




window.saveImage = () => {
  const dataURL = canvas.toDataURL("image/jpeg");
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "my-image-name.jpg";
  link.innerHTML = 'Download';
  link.click();

  const contentLink = document.getElementById('link');

  contentLink.appendChild(link);
}
