const canvas = document.getElementById("mycanvas");
const ctx = canvas.getContext("2d");

//圓球的初始位置
//X & Y 代表圓心的位置；radius代表半徑
let circleX = 160;
let circleY = 60;
let radius = 20;

//圓球的移動量
let xSpeed = 20;
let ySpeed = 20;

//地板的初始位置
let groundX = 100;
let groundY = 300;
let groundLength = 100;
let groundHeight = 5;

//記錄球打中磚塊的次數
let count = 0;

//這個 array 用來儲存新生成的 instance of Class Brick
let brickArray = [];

//Class磚塊
class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    //先設定磚塊為可見的
    this.visible = true;
    //當新生成一個 Brick 的 instnace 時，加到 array 裡
    brickArray.push(this);
  }

  //畫出磚塊的函式
  drawBrick() {
    //填滿顏色
    ctx.fillStyle = "plum";
    //填滿實心的矩形
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  //查看磚塊有無碰到球的函式
  totchBall(ballX, ballY) {
    if (
      ballX >= this.x - radius &&
      ballX <= this.x + this.width + radius &&
      ballY >= this.y - radius &&
      ballY <= this.y + this.height + radius
    ) {
      return true;
    } else {
      return false;
    }
  }
}

// 儲存已經產生且未重複的磚塊位置(供檢查用)
let brickPositions = [];
for (let i = 0; i < 10; i++) {
  let x;
  let y;

  //會先執行一次裡面的程式
  do {
    x = Math.floor(Math.random() * (800 - 50));
    y = Math.floor(Math.random() * (400 - 50));
  } while (
    //some()，用來檢查磚塊的位置是否和已儲存的磚塊位置有重疊
    //有重疊(true)就再執行 do 裡面的程式，直到沒有重疊(false)
    brickArray.some(
      (e) => x > e.x - 50 && x < e.x + 50 && y > e.y - 50 && y < e.y + 50
    )
  );

  //新生成一個 Brick 的 instnace (會執行 10 次)
  //而前面有寫過，每新生成一個 instance 時，要加進 brickArray 裡面
  new Brick(x, y);
}

// 用來查看 brickArray 的 10個 object (brick)
// console.log(brickArray);

//監聽器，用來監聽滑鼠移動的事件
//範圍只有在 canvas 的區域內
canvas.addEventListener("mousemove", (e) => {
  groundX = e.clientX;
  if (groundX >= canvas.width - groundLength) {
    groundX = canvas.width - groundLength;
  }
});

function draw() {
  //確認球有沒有打到磚塊
  brickArray.forEach((brick) => {
    //有碰到磚塊且磚塊為可見的情況下
    if (brick.visible && brick.totchBall(circleX, circleY)) {
      //打中磚塊的次數加一
      count++;
      //該磚塊改為不可見
      brick.visible = false;
      //改變圓球的移動方向
      //從下方撞擊時
      if (circleY >= brick.y) {
        ySpeed *= -1;
      } //從上方撞擊時
      else if (circleY <= brick.y) {
        ySpeed *= -1;
      } //從左方撞擊時
      else if (circleX <= brick.x) {
        xSpeed *= -1;
      } //從右方撞擊時
      else if (circleX >= brick.x) {
        xSpeed *= -1;
      }

      //打中磚塊的次數為 10 次時，結束遊戲
      if (count == 10) {
        clearInterval(myGame);
        alert("遊戲結束");
        return;
      }
    }
  });

  //處理圓球碰到地板的情況
  if (
    circleX >= groundX - radius &&
    circleX <= groundX + groundLength + radius &&
    circleY >= groundY - radius &&
    circleY <= groundY + radius
  ) {
    //修正圓球會在板子旁邊一直震動的 bug
    //讓它碰觸板子的區間後的第一下彈得遠一點
    //避免 circleY 的座標還在 groundY +- radius 的區間裡
    if (ySpeed > 0) {
      //值不能設定太小(至少要比 radius 多一點)
      circleY -= 30;
    } else {
      circleY += 30;
    }
    ySpeed *= -1;
  }

  //處理圓球碰到牆壁的情況
  //右、左邊
  if (circleX >= canvas.width - radius) {
    xSpeed *= -1;
  } else if (circleX <= radius) {
    xSpeed *= -1;
  }
  //下、上邊
  if (circleY >= canvas.height - radius) {
    ySpeed *= -1;
  } else if (circleY <= radius) {
    ySpeed *= -1;
  }

  //更動圓球的位置;
  circleX += xSpeed;
  circleY += ySpeed;

  //畫出其他東西前，先讓背景(重新)變成全白色
  //這兩行如果不寫，每次更新時，圓球上一回所繪製的位置仍會存在
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //畫出磚塊
  brickArray.forEach((brick) => {
    //當磚塊為 visible 的時候，才畫出
    if (brick.visible) {
      brick.drawBrick();
    }
  });

  //畫出圓球
  //產生路徑，開始繪製路徑 (這邊不用關閉路徑，因為圓畫一圈剛好就會關閉了)
  ctx.beginPath();
  //arc() 用來畫弧度；圓的弧度為 2π
  ctx.arc(circleX, circleY, radius, 0, 2 * Math.PI);
  //要填滿之顏色
  ctx.fillStyle = "orange";
  //填滿路徑區域
  ctx.fill();

  //畫出地板
  ctx.fillStyle = "black";
  ctx.fillRect(groundX, groundY, groundLength, groundHeight);
}

let myGame = setInterval(draw, 30);
