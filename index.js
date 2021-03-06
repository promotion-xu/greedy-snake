var sw = 20, //方块长
  sh = 20, // 方块宽
  tr = 30, // 行
  td = 30; // 列

var snake = null,
  food = null,
  game = null;

function Square(x, y, classname) {
  this.x = sw * x;
  this.y = sh * y;
  this.class = classname;
  this.viewContent = document.createElement("div");
  this.viewContent.className = this.class;
  this.parent = document.getElementById("snakeWrap");
}

Square.prototype.create = function() {
  this.viewContent.style.position = "absolute";
  this.viewContent.style.width = sw + "px";
  this.viewContent.style.height = sh + "px";
  this.viewContent.style.left = this.x + "px";
  this.viewContent.style.top = this.y + "px";
  this.parent.appendChild(this.viewContent);
};

Square.prototype.remove = function() {
  this.parent.removeChild(this.viewContent);
};

// snake

function Snake() {
  this.head = null;
  this.tail = null;
  this.pos = [];
  this.directionNum = {
    // 蛇方向
    left: {
      x: -1,
      y: 0,
      rotate: 180
    },
    right: {
      x: 1,
      y: 0,
      rotate: 0
    },
    up: {
      x: 0,
      y: -1,
      rotate: -90
    },
    down: {
      x: 0,
      y: 1,
      rotate: 90
    }
  };
}

Snake.prototype.init = function() {
  var snakeHead = new Square(2, 0, "snakeHead");
  snakeHead.create();
  this.head = snakeHead;
  this.pos.push([2, 0]);

  // 蛇身体1
  var snakeBody1 = new Square(1, 0, "snakeBody");
  snakeBody1.create();
  this.pos.push([1, 0]);

  // 蛇身体2
  var snakeBody2 = new Square(0, 0, "snakeBody");
  snakeBody2.create();
  this.tail = snakeBody2;
  this.pos.push([0, 0]);

  snakeHead.last = null;
  snakeHead.next = snakeBody1;

  snakeBody1.last = snakeHead;
  snakeBody1.next = snakeBody2;

  snakeBody2.last = snakeBody1;
  snakeBody2.next = null;

  // 蛇走的方向
  this.direction = this.directionNum.right; // 默认往右走
};

// 获取下一个位置的元素
Snake.prototype.getNextPos = function() {
  var nextPos = [
    this.head.x / sw + this.direction.x,
    this.head.y / sh + this.direction.y
  ];
  // 判断下个点的位置
  // 1. 下个点是自己， 游戏结束
  // 2。 下个点是围墙，游戏结束
  // 3. 下个点是苹果， 吃
  // 4. 下个点什么也不是， 走

  var selfCollied = false; // 是否撞到了自己

  // 1. 下个点是自己， 游戏结束
  this.pos.forEach(item => {
    if (item[0] === nextPos[0] && item[1] === nextPos[1]) {
      selfCollied = true;
    }
  });

  if (selfCollied) {
    console.log("撞到自己了");
    this.strategies.die.call(this);
    return;
  }

  // 2。 下个点是围墙，游戏结束
  if (
    nextPos[0] < 0 ||
    nextPos[1] < 0 ||
    nextPos[0] > td - 1 ||
    nextPos[1] > tr - 1
  ) {
    this.strategies.die.call(this);
    return;
  }
  // 3. 下个点是苹果， 吃
  if (food && food.pos[0] === nextPos[0] && food.pos[1] === nextPos[1]) {
    this.strategies.eat.call(this);
    return;
  }

  // 4. 下个点什么也不是， 走
  this.strategies.move.call(this);
};

Snake.prototype.strategies = {
  move: function(format) {
    // format: 需要不需要删除蛇尾, true为吃
    // 1. 创建一个新身体，放在旧蛇头位置
    var newBody = new Square(this.head.x / sw, this.head.y / sh, "snakeBody");
    // 更新链表关系
    newBody.next = this.head.next;
    newBody.next.last = newBody;
    newBody.last = null;

    this.head.remove();
    newBody.create();

    // 创建新蛇头
    var newHead = new Square(
      this.head.x / sw + this.direction.x,
      this.head.y / sh + this.direction.y,
      "snakeHead"
    );
    // 更新链表关系
    newHead.next = newBody;
    newHead.last = null;
    newBody.last = newHead;

    newHead.viewContent.style.transform = `rotate(${this.direction.rotate}deg)`;

    newHead.create();

    // 更新蛇身体坐标
    this.pos.unshift([
      this.head.x / sw + this.direction.x,
      this.head.y / sh + this.direction.y
    ]);
    this.head = newHead;

    if (!format) {
      // format为false, 表示需要删除
      this.tail.remove();
      this.tail = this.tail.last;
      this.pos.pop();
    }
  },
  eat: function() {
    this.strategies.move.call(this, true);
    createFood();
    game.score++;
  },
  die: function() {
    console.log("die");
    game.over();
  }
};

snake = new Snake();

// 创建食物

function createFood() {
  var x = null,
    y = null,
    include = true; // 食物坐标在蛇身上

  while (include) {
    x = Math.round(Math.random() * (td - 1));
    y = Math.round(Math.random() * (tr - 1));

    snake.pos.forEach(v => {
      if (v[0] !== x && y !== v[1]) {
        include = false;
      }
    });

    food = new Square(x, y, "food");
    food.pos = [x, y];

    var foodDom = document.querySelector(".food");
    if (foodDom) {
      foodDom.style.left = x * sw + "px";
      foodDom.style.top = y * sh + "px";
    } else {
      food.create();
    }
  }
}

function Game() {
  this.timer = null;
  this.score = 0;
}

Game.prototype.init = function() {
  snake.init();
  createFood();

  // snake.getNextPos();

  document.onkeydown = function(ev) {
    if (ev.which === 37 && snake.direction !== snake.directionNum.right) {
      // 按下左键，并且不能往右走
      snake.direction = snake.directionNum.left;
    } else if (ev.which === 38 && snake.direction !== snake.directionNum.down) {
      snake.direction = snake.directionNum.up;
    } else if (ev.which === 39 && snake.direction !== snake.directionNum.left) {
      snake.direction = snake.directionNum.right;
    } else if (ev.which === 40 && snake.direction !== snake.directionNum.up) {
      snake.direction = snake.directionNum.down;
    }
  };
  this.start();
};

Game.prototype.start = function() {
  this.timer = setInterval(function() {
    snake.getNextPos();
  }, 200);
};

Game.prototype.pause = function() {
  clearInterval(this.timer);
};

Game.prototype.over = function() {
  clearInterval(this.timer);
  alert("你的得分为" + this.score);
  var snakeWrap = document.querySelector("#snakeWrap");
  snakeWrap.innerHTML = "";
  snake = new Snake();
  game = new Game();
  var startBtnWrap = document.querySelector(".startBtn");
  startBtnWrap.style.display = "block";
};

game = new Game();
var startBtn = document.querySelector(".startBtn button");
startBtn.addEventListener(
  "click",
  function() {
    startBtn.parentNode.style.display = "none";
    game.init();
  },
  false
);

var snakeWrap = document.querySelector("#snakeWrap");
var pauseBtn = document.querySelector(".pauseBtn button");
snakeWrap.onClick = function() {
  game.pause();
  pauseBtn.parentNode.style.display = "block";
};

pauseBtn.onClick = function() {
  game.start();
  pauseBtn.parentNode.style.display = "none";
};
