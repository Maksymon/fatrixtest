const { Telegraf, Markup, session } = require('telegraf');

const bot = new Telegraf('6296398723:AAE2YR8lVlb9AabP_7VGM3gkGr8xTdFGpuk');


bot.start(async (ctx) => {
    ctx.reply('Прив', {
        parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard:[
          [{ text: 'Открыть', web_app: {url: "https://htmlpreview.github.io/?https://github.com/Maksymon/python_js/blob/master/index.html?tg_id=1234"} },],
        ]
      }});
    })

    bot.launch();