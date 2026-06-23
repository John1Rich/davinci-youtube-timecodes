import console, { error } from "console";
import fs from "fs"; // импорт модуля File System для работы с файлами

try {
  // ✅ 1. Читаем текущую папку
  const files = fs.readdirSync("."); // возвращает массив с именами всех её файлов

  console.log(files);

  // Ищем первый попавшийся файл, который заканчивается на .edl
  const edlFile = files.find((file) => file.endsWith(".edl"));
  console.log(edlFile);

  // Проверяем, нашли ли мы вообще такой файл
  if (!edlFile) {
    // если edl файлов нет, выбрасываем ошибку
    throw new error(
      "EDL-файл в папке не найден! Сначала экспортируйте его из Davinci.",
    );
  }

  // Подставляем найденный файл в путь
  const filePath = `./${edlFile}`;
  const edlData = fs.readFileSync(filePath, "utf-8"); // читаем данные из файла
  console.log("✅ Файл успешно прочитан!");

  // ✅ 2. Поиск названий маркеров
  const lines = edlData.split("\n"); // превратим весь текст в массив строк
  var chapter = ""; // глава - название таймкода

  let youtubeChapters = []; // массив - накопитель для сбора финальных таймкодов и заголовков

  // Проходимся по всем строкам
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]; // линия с маркером-главой определена для каждой строки

    // Получаем названия загаловков
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
  const finalResult = youtubeChapters.join("\n"); // собираем элементы массива в единый текст
  console.log(finalResult);
  fs.writeFileSync("./youtube_chapters.txt", finalResult); // запись результата в .txt
  console.log("💾 Файл youtube_chapters.txt успешно сохранён!");
} catch (error) {
  console.error(
    "❌ Ошибка при чтении файла. Проверьте, лежит ли Timeline 1.edl в папке проекта:",
    error.message,
  );
}
