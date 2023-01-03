// Поле, на котором всё будет происходить
var canvas = document.getElementById("game");
// Обозначаем двумерность
var context = canvas.getContext("2d");
// Устанавливаем размер ячейки на поле;
var grid = 16;
// Скорость игры
var speed = 0; //служебная переменная
var speed_lim = 5; //параметр отвечающий за скорость

// Непосредственно змейка
var snake = {
  x: 160,
  y: 160,
  dx: grid, //скорость змейки => движемся на 1 клетку по горизонтали
  dy: 0, //по вертикали не движемся
  cells: [], //хвост, который наели
  maxCells: 4, //начальная длина змейки
};

// Генератор случайных чисел в заданном диапазоне
// max-min обеспечивает диапазон от 0 до min-max
// Но этот прием нужен, чтобы установить нижний порог в min
// +min гарантирует, что будет получено значение не ниже min
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// получить размеры игрового поля в типе int, для рандомизации появления еды в начале
let canv_object = document.querySelector(".canvas"),
  style = window.getComputedStyle(canv_object),
  size_x = Number(style.getPropertyValue("width").slice(0, -2)),
  size_y = Number(style.getPropertyValue("height").slice(0, -2));
canvas.width = size_x; //явно задаю размеры холсту
canvas.height = size_y; //подробности https://overcoder.net/q/9360/canvas-%D1%80%D0%B0%D1%81%D1%82%D1%8F%D0%B3%D0%B8%D0%B2%D0%B0%D0%B5%D1%82%D1%81%D1%8F-%D0%BF%D1%80%D0%B8-%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B8-css-%D0%BD%D0%BE-%D0%BE%D0%B1%D1%8B%D1%87%D0%BD%D0%BE-%D1%81%D0%BE-%D1%81%D0%B2%D0%BE%D0%B9%D1%81%D1%82%D0%B2%D0%B0%D0%BC%D0%B8-width-height
// получить объект canvas -> извлечь все назначаемые css стили -> получить значение стиля (тип int) -> срезать последние 2 символа (px) -> преобразовать к типу int
// console.log(canvas.width,canvas.height) - решение могло быть короче, но почему-то canvas параметры работают некорректно: 300 и 150, вместо заданных в css

// еда для змейки
var food = {
  x: getRandomInt(0, Math.floor(size_x/grid))*grid, //начальные координаты еды
  y: getRandomInt(0, Math.floor(size_y/grid))*grid
};

//Игровой цикл
function loop() {
  // Дальше будет хитрая функция, которая замедляет скорость игры с 60 кадров в секунду до 15. Для этого она пропускает три кадра из четырёх, то есть срабатывает каждый четвёртый кадр игры. Было 60 кадров в секунду, станет 15.
  requestAnimationFrame(loop);
  if (++speed < speed_lim) {
    return;
  }

  // обнулим счетчик скорости игры
  speed = 0;

  // Очистка игрового поля
  context.clearRect(0, 0, canvas.width, canvas.height);
  snake.x += snake.dx; //прописываем изменение координты змейки
  snake.y += snake.dy; //величина изменений = grid = скорость

  // Обработка случая попадания на край поля
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  } else if (snake.x > canvas.width-grid) {
    snake.x = 0; 
    //здесь не нужен "+- grid", т.к. отрисовка начинается с левого верхнего угла, поэтому в данном случае отрисовка будет корректной, в отличие от от случая выше
    // но в данном случае важно проверить, что змейкане отрисовалась от границы за кадром...
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
    // займемся отрисовкой еды. Еда будет по размеру совпадать с змейкой

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
