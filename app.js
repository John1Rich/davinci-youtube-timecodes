// Выбранный пользователем edl файл
const fileInput = document.querySelector('input[type="file"]');

// Вешаем обработчик событий на кнопку
fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader(); // чтение файла в браузере

    // 1. получаем текст сразу после загрузки через onload
    reader.onload((e) => {
      const text = e.target.result; // текст из edl файла
      console.log(text);
    });
    // 2. Запускаем само чтение
    reader.readAsText(file);
  }
});
