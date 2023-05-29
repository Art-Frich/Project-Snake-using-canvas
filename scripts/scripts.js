var canvas = document.getElementById("game");
var context = canvas.getContext("2d");
var grid = 16; //ячейка поля в px
var speed = 0; //служебная переменная
var speed_lim = 5; //параметр отвечающий за скорость

var snake = {
  x: 160,
  y: 160,
  dx: grid, //скорость по горизонтали
  dy: 0, //скорость по вертикали
  cells: [], //образовавшийся хвост
  maxCells: 4, //начальная длина
};

// Генератор случайных чисел в заданном диапазоне
// + min гарантирует, что будет получено значение не ниже min
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// получить размеры игрового поля для рандомизации появления еды
let canv_object = document.querySelector(".canvas"),
  style = window.getComputedStyle(canv_object), //стили объекта canvas
  size_x = Number(style.getPropertyValue("width").slice(0, -2)), //css width за вычетом 'px'
  size_y = Number(style.getPropertyValue("height").slice(0, -2)); //аналогично
canvas.width = size_x;
canvas.height = size_y;

var food = {
  x: getRandomInt(0, Math.floor(size_x/grid))*grid,
  y: getRandomInt(0, Math.floor(size_y/grid))*grid
};

function loop() {
// Дальше будет хитрая функция, которая замедляет скорость игры с 60 кадров в секунду до 15.
  requestAnimationFrame(loop);
  if (++speed < speed_lim) {
    return;
  }
  // обнулим счетчик
  speed = 0;

  // Очистка игрового поля
  context.clearRect(0, 0, canvas.width, canvas.height);
  snake.x += snake.dx; //прописываем изменение координат змейки
  snake.y += snake.dy; 
  
  // Обработка случая попадания на край поля
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  } else if (snake.x > canvas.width - grid) {
    snake.x = 0; 
    //здесь не нужен "+- grid", т.к. отрисовка начинается с левого верхнего угла
  }

  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  } else if (snake.y > canvas.height-grid) {
    snake.y = 0 + grid;
  }

  // описываем перемещение змейки: т.к. перемещается именно голова, то отрисовываем ее координаты в новой ячейке
  snake.cells.unshift({ x: snake.x, y: snake.y });
  // хвост при этом нужно тоже переместить, т.е. удалить текущее значение из массива
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  context.fillStyle = "red";
  context.fillRect(food.x, food.y, grid - 1, grid - 1);

  context.fillStyle = "green";
  snake.cells.forEach(function (item, index) {
    context.fillRect(item.x, item.y, grid - 1, grid - 1);
    // grid -1 создаст эффект клетки между частями змейки

    if (snake.x === food.x && snake.y === food.y) {
      snake.maxCells++;
      food.x = getRandomInt(0, Math.floor(size_x/grid))*grid;
      food.y = getRandomInt(0, Math.floor(size_y/grid))*grid;
    }

    for (let i = index+1; i < snake.cells.length; i++) {
      if (item.x === snake.cells[i].x && item.y === snake.cells[i].y) {
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;
      }
    }
  });
};

//пропишем реакцию на стрелочки
document.addEventListener('keydown', function(key) {
  //если нажата клавиша влево и при этом скорость змейки по x=0...
  console.log(key.code)
  if (key.code === "ArrowLeft" && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  //вверх
 if (key.code === "ArrowUp" && snake.dy === 0) {
    snake.dx = 0;
    snake.dy = -grid;
  }
  //вправо
  if (key.code === "ArrowRight" && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  //вниз
  if (key.code === "ArrowDown" && snake.dy === 0) {
    snake.dx = 0;
    snake.dy = grid;
  }
});

//запуск игры
requestAnimationFrame(loop);
