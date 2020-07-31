## Greedy-Snake

### 1. 思绪：

面向对象

```js
function Square(x, y, classname) {
  this.x = sw * x;
  this.y = sh * y;
  this.class = classname;
  this.viewContent = document.createElement("div");
  this.viewContent.className = this.class;
  this.parent = document.getElementById("snakeWrap");
}

Square.prototype.create = () => {};
```
