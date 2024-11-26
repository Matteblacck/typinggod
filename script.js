let colors = [
    'is-link', 
    'is-info', 
    'is-success', 
    'is-warning', 
    'is-danger', 
    'is-dark', 
    'is-black', 
];

let str_arr = ['а', 'д', 'л', 'р', 'а', 'ш', 'й', 'ч', 'ы', 'в', 'з', 'ъ', 'и', 'я', 'т', 'у', ' '];

let begin = document.querySelector(".begin");
let progress = document.querySelector("#prog");
let buttons = document.querySelector(".buttons");
const symbolCountInput = document.querySelector("#symbolCount");

let count_right = 0;
let count_false = 0;
let gameActive = false; // Флаг для отслеживания состояния игры
let totalSymbols = 0; // Добавляем переменную для общего числа символов

// Функция получения случайного числа
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// Очистка кнопок
function clearBoard() {
    buttons.innerHTML = '';
}

// Отрисовка последовательности клавиш
function drawBoard(count) {
    clearBoard();
    for (let index = 0; index < count; index++) {
        let randColorIndex = getRandomInt(colors.length);
        let randCharIndex = getRandomInt(str_arr.length);

        // Убираем белые кнопки
        buttons.insertAdjacentHTML("afterbegin",
        `<button class='game-buttons button is-large ${colors[randColorIndex]}' id='${str_arr[randCharIndex]}'>
        ${str_arr[randCharIndex]}			
        </button>`);
    }
}

// Сброс состояния игры
function resetGame() {
    count_right = 0;
    count_false = 0;
    progress.value = 0;
    gameActive = false; // Игра неактивна до начала новой
    clearBoard(); // Удаляем все кнопки
    begin.style.display = 'block'; // Показываем кнопку для начала
    document.removeEventListener('keyup', press); // Удаляем старый слушатель
    document.removeEventListener('keydown', StartGame);
    symbolCountInput.value = '';
    document.addEventListener('keydown', StartGame);
}

// Вызов игры после нажатия клавиши Enter
document.addEventListener('keydown', StartGame);

function StartGame(e) {
    if (e.key === "Enter" && !gameActive) {
        const symbolCount = parseInt(symbolCountInput.value);

        if (isNaN(symbolCount) || symbolCount < 1 || symbolCount > 50) {
            alert("Пожалуйста, введите число от 1 до 50");
            return;
        }

        totalSymbols = symbolCount; 
        progress.max = symbolCount; 
        drawBoard(symbolCount); 
        begin.style.display = "none"; 
        gameActive = true; 
        mainGame(); 
    }
}

// Основная игра
function mainGame() {
    document.addEventListener('keyup', press);
}

// Логика игры: счетчик правильных и ошибочных нажатий
function press(e) {
    let elements_arr = document.querySelectorAll(".game-buttons");

    if (e.key === "Enter") {
        return; // Игнорируем нажатие клавиши Enter
    }

    // Проверяем, нажата ли клавиша, соответствующая первой кнопке
    if (elements_arr.length > 0 && e.key === elements_arr[0].id) {
        // Удаляем кнопку сразу
        elements_arr[0].remove();
        count_right++;
    } else if (elements_arr.length > 0) { // Если клавиша не совпадает
        count_false++;
        progress.value = count_false;

        if (count_false >= progress.max) {
            let fail = confirm("Ты проиграл. Хочешь сыграть еще?");
            if (fail) {
                resetGame(); 
                StartGame({ key: "Enter" }); 
            } else {
                document.removeEventListener('keyup', press); 
            }
        }
    }

    if (count_right === totalSymbols) {
        alert("Ты выиграл!");
        let win = confirm("Хочешь сыграть еще?");
        if (win) {
            resetGame(); 
            StartGame({ key: "Enter" }); 
        }
    }
}
