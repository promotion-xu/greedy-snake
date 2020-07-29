window.onload = () => {
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

  Square.prototype.create = () => {
    this.viewContent.style.position = "absolute";
    this.viewContent.style.width = sw + "px";
    this.viewContent.style.height = sh + "px";
    this.viewContent.style.left = this.x + "px";
    this.viewContent.style.top = this.y + "px";
    this.parent.appendChild(this.viewContent);
  };

  Square.prototype.remove = () => {
    this.parent.removeChild(this.viewContent);
  };

  // snake

  function Snake() {
    this.head = null;
    this.tail = null;
    this.pos = [];
    this.directionNum = {}; // 蛇方向
  }

  Snake.prototype.init = () => {
    var snakeHead = new Square(2, 0, "snakeHead");
    snakeHead.create();
    this.head = snakeHead;
    this.pos.push([2, 0]);

    var snakeBody1 = new Square(1, 0, "snakeBody");
    snakeBody1.create();
    this.pos.push([1, 0]);

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
  };

  // 获取下一个位置的元素
  Snake.prototype.getNextPos = () => {
    var nextPos = [this.head];
  };

  snake = new Snake();
  snake.init();
};
