// Скрипт Браузера
// ✅ 1. Читаем выбранный пользователем edl файл
const fileInput = document.querySelector('input[type="file"]'); // привязываем input кнопку к переменной
const outputTextArea = document.querySelector("textarea"); // привязываем текстовое поле к переменной

// Вешаем обработчик событий input на кнопку
fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0]; // file = первому выбранному edl файлу

  if (file) {
    // Если edl файл существует / выбран
    const reader = new FileReader(); // чтение файла в браузере

    // Получаем текст сразу после загрузки через onload
    reader.onload = (e) => {
      const text = e.target.result; // текст из edl файла

      // ✅ 2. Запускаем логику парсинга. Поиск названий маркеров
      const lines = text.split("\n"); // превратим весь текст в массив строк

      var chapter = ""; // глава - название таймкода

      let youtubeChapters = []; // массив - накопитель для сбора финальных таймкодов и заголовков

      // Проходимся по всем строкам
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]; // линия с маркером-главой определена для каждой строки

        // Получаем названия заголовков
        if (line.includes("|M:")) {
          chapter = line.split("|M:"); // получаем массив двух частей, нам нужен chapter[1]
          chapter = chapter[1].split("|D:1"); // снова массив двух частей, нам нужен chapter[0]
          chapter = chapter[0].trim(); // названия заголовков без лишних пробелов и скрытых символов переноса строки по краям
          //   console.log(chapter);

          // ✅ 3. Обработка логики таймкода
          var timeline = lines[i - 1]; // линия с таймкодом определена для каждой строки
          timeline = timeline.split(/\s+/); // разбиваем строки на массивы
          var fullTime = timeline[4]; // берём нужный элемент с таймкодом, например fullTime = "00:03:33:02"

          const parts = fullTime.split(":"); // разобьём строку по двоеточиям, получим массив четырех элементов: [часы, минуты, секунды, кадры], ["00", "03", "33", "02"]

          let ytTime = ""; // финальный таймкод

          if (parts[0] === "00") {
            // Если часов нет, берём только минуты и секунды
            ytTime = [parts[1], parts[2]].join(":"); // 03:33
          } else {
            // Часы есть, собираем ЧЧ:ММ:СС
            ytTime = [parts[0], parts[1], parts[2]].join(":"); // 01:03:33
          }

          youtubeChapters.push(ytTime + " " + chapter); // добавляем готовые таймкоды и заголовоки в массив
        }
      }

      // ✅ 4. Собираем результат
      const finalResult = youtubeChapters.join("\n"); // собираем элементы массива в единый текст
      console.log(finalResult);

      outputTextArea.value = finalResult;

      // fs.writeFileSync("./youtube_chapters.txt", finalResult); // запись результата в .txt
      // console.log("💾 Файл youtube_chapters.txt успешно сохранён!");

      // Ручная проверка текстового поля
      // const youtubeResult = "00:00 Начало\n01:15 Вступление"; // Временно для примера
      // // Выводим результат на экран пользователя!
      // outputTextArea.value = youtubeResult;

      // console.log(text);
    };

    // 3. Запускаем само чтение
    reader.readAsText(file);
  }
});
