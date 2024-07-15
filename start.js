const { Telegraf, Markup, session } = require('telegraf');
const mysql = require('mysql2');

const bot = new Telegraf('6844029702:AAGLDpIy661KKVchLTOogEhFaEZoy2Tu33w');


// Функция для обработки сообщений
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '2dfcaA88191',
  database: 'fatrix'
});

// Проверка соединения с базой данных
db.connect((err) => {
  if (err) {
      console.error('Ошибка подключения к базе данных:', err);
  } else {
      console.log('Подключение к базе данных успешно');
  }
});

// Функция для обработки сообщений
function addUser(tgId, callback) {
  db.query('SELECT * FROM users WHERE tg_id = ?', [tgId], (err, results) => {
      if (err) {
          console.error('Ошибка при поиске пользователя:', err);
          callback(err);
      } else if (results.length === 0) {
          db.query('INSERT INTO users (tg_id) VALUES (?)', [tgId], (err) => {
              if (err) {
                  console.error('Ошибка при добавлении пользователя:', err);
                  callback(err);
              } else {
                  callback(null);
              }
          });
      } else {
          callback(null);
      }
  });
}

// Функция для обработки сообщений
bot.on('text', (ctx) => {
  const messageText = ctx.message.text;
  const tgId = ctx.message.from.id.toString();

  if (messageText.startsWith('/start')) {
      const refCode = messageText.split(' ')[1];

      addUser(tgId, (err) => {
          if (err) {
              ctx.reply('Произошла ошибка при обработке вашего запроса.');
              return;
          }

          if (refCode) {
              // Обработка реферального кода
              db.query('SELECT friends FROM users WHERE tg_id = ?', [refCode], (err, results) => {
                  if (err) {
                      console.error('Ошибка при получении реферального кода:', err);
                      ctx.reply('Произошла ошибка при обработке вашего запроса.');
                  } else {
                      if (results.length > 0) {
                          let friends = results[0].friends ? results[0].friends.split(',') : [];
                          if (friends.length < 5 && !friends.includes(tgId)) {
                              friends.push(tgId);
                              db.query('UPDATE users SET friends = ? WHERE tg_id = ?', [friends.join(','), refCode], (err) => {
                                  if (err) {
                                      console.error('Ошибка при обновлении друзей:', err);
                                      ctx.reply('Произошла ошибка при обработке вашего запроса.');
                                  } else {
                                      ctx.reply(`Спасибо за использование реферального кода: ${refCode}`);
                                  }
                              });
                          } else {
                              ctx.reply('Добро пожаловать!', {
                                  reply_markup: {
                                      inline_keyboard: [
                                          [
                                              {
                                                  text: "Открыть веб-приложение", // Добавьте текст кнопки
                                                  web_app: {
                                                      url: "https://htmlpreview.github.io/?https://github.com/Maksymon/fatrixtest/blob/master/index.html"
                                                  }
                                              }
                                          ]
                                      ]
                                  }
                              });
                          }
                      } else {
                          ctx.reply('Неверный реферальный код.');
                      }
                  }
              });
          } else {
              // Ответ пользователю без реферального кода
              ctx.reply('Добро пожаловать!', {
                  reply_markup: {
                      inline_keyboard: [
                          [
                              {
                                  text: "Открыть веб-приложение", // Добавьте текст кнопки
                                  web_app: {
                                      url: "https://example.com"
                                  }
                              }
                          ]
                      ]
                  }
              });
          }
      });
  } else {
      ctx.reply('Привет! Используй /start чтобы начать.');
  }
});

bot.launch();