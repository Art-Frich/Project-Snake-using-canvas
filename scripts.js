// Поле, на котором всё будет происходить
var canvas = document.getElementById('game')
// Обозначаем двумерность
var context = canvas.getContext('2d');
// Устанавливаем размер ячейки на поле;
var grid = 16;
// Скорость змейки
var speed = 0;
// Непосредственно змейка
var snake = {
  x: 160,
  y: 160,
  dx: grid, //скорость змейки => движемся на 1 клетку по горизонтали
  dy: 0, //по вертикали не движемся
  cells: [], //хвост, который наели
  maxCells: 4 //начальная длина змейки 
};
// еда для змейки
var food = {
  x: 320, //начальные координаты еды
  y: 320
};

// Генератор случайных чисел в заданном диапазоне
// max-min обеспечивает диапазон от 0 до min-max
// Но этот прием нужен, чтобы установить нижний порог в min
// +min гарантирует, что будет получено значение не ниже min
function getRandomInt(min,max) {
  return Math.floor(Math.random()*(max-min))+min;
}

//Игровой цикл
function loop() {
  // Дальше будет хитрая функция, которая замедляет скорость игры с 60 кадров в секунду до 15. Для этого она пропускает три кадра из четырёх, то есть срабатывает каждый четвёртый кадр игры. Было 60 кадров в секунду, станет 15.
  requestAnimationFrame(loop);
  if (++count < 4) {
    return;
  }
  speed = 0;

  // Очистка игрового поля
  context.clearRect (0,0, canvas.clientWidth, canvas.height);
  snake.x += snake.dx; //прописываем изменение координты змейки
  snake.y += snake.dy; //величина изменений = grid = скорость

  // Обработка случая попадания на край поля
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  } else if (snake.x > canvas.width) {
    snake.x = 0 + grid;
  }

  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  } else if (snake.y > canvas.height) {
    snake.y = 0 + grid;
  }
}

