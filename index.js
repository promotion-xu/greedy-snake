var sw = 20, //方块长
  sh = 20, // 方块宽
  tr = 30, // 行
  td = 30; // 列

var snake = null;

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
      y: 0
    },
    right: {
      x: 1,
      y: 0
    },
    up: {
      x: 0,
      y: -1
    },
    down: {
      x: 0,
      y: 1
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

  // 4. 下个点什么也不是， 走
  this.strategies.move.call(this);
};

Snake.prototype.strategies = {
  move: function() {
    console.log("move", this);
  },
  eat: function() {
    console.log("eat");
  },
  die: function() {
    console.log("die");
  }
};

snake = new Snake();
snake.init();
snake.getNextPos();
