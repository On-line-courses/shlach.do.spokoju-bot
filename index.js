const TelegramBot = require("node-telegram-bot-api");
const schedule = require("node-schedule");

// Токен Telegram-бота
require("dotenv").config();
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// База даних користувачів (можна перенести в справжню БД)
let users = {}; // Формат: { chatId: { startDate: 'YYYY-MM-DD' } }

// Посилання на відео та файли
const courseContent = [
  {
    day: 1,
    steps: [
      {
        text: "Сьогодні ми з вами знайомимося, тому переходь за посиланням, в цьому відео я розповім тобі про себе та про курс.",
        // image: "./covers/day1_video1.jpg",
        video: "https://www.youtube.com/watch?v=Fxuib3RsNDU",
        button: "Продовжити",
      },
      {
        text: "Тепер після нашого знайомства я хочу більш детально розказати тобі про панічні атаки. Переходь за посиланням.",
        // image: "./covers/day1_video2.jpg",
        video: "https://www.youtube.com/watch?v=6g5zq2mW4Ks",
        button: "Продовжити",
      },
      {
        text: "А тепер я прошу тебе заповнити конфіденційну форму, щоб я змогла оцінити твій стан і потреби.",
        form: "https://docs.google.com/forms/d/e/1FAIpQLSci3Qdk-sIb6Gbgthd4KpeEhxnRtb3oG7yslV5XTHgW41UcVw/viewform?usp=sf_link",
      },
    //   {
    //     text: "Ти молодець, продовжимо завтра!",
    //   },
    ],
  },
  {
    day: 2,
    videos: [
      "https://www.youtube.com/watch?v=ibpoVB_YsB4", // Урок 3
      "https://www.youtube.com/watch?v=2yatrw0CzgE", // Урок 4
    ],
    files: [],
  },
  {
    day: 3,
    videos: [
      "https://www.youtube.com/watch?v=2IXCtmOFxI0",
      "https://www.youtube.com/watch?v=Qrm21OWm1Gk",
    ],
    files: [],
  },
  {
    day: 4,
    videos: [
      "https://www.youtube.com/watch?v=_lSblgI7PTI",
      "https://www.youtube.com/watch?v=cac0iNstWs4",
    ],
    files: [],
  },
  {
    day: 5,
    videos: [
      "https://www.youtube.com/watch?v=MI_tZpO9ijw",
      "https://youtu.be/8cnw4hhrJcM",
      "https://www.youtube.com/watch?v=yl9-wwrwHGU",
    ],
    files: [],
  },
  {
    day: 6,
    videos: [
      "https://www.youtube.com/watch?v=hMeFFsQQ4Lg",
      "https://youtu.be/3Qar8yR5jt0",
    ],
    files: [],
  },
  {
    day: 7,
    videos: [
      "https://youtu.be/sPv3oX8aQBU",
      "https://youtu.be/pk8_7tBcRuU",
      "https://youtu.be/dsTbpMFcXko",
    ],
    files: [],
  },
];

// Функція для надсилання матеріалів
const sendDailyContent = (chatId, day) => {
  const todayContent = courseContent.find((content) => content.day === day);

  if (!todayContent) {
    bot.sendMessage(
      chatId,
      "Сьогодні немає матеріалів. Чекайте наступного дня!"
    );
    return;
  }

  if (todayContent.steps) {
    todayContent.steps.forEach((step) => {
      bot.sendMessage(chatId, step.text);
      if (step.video) bot.sendMessage(chatId, `Ваше відео: ${step.video}`);
      if (step.form) bot.sendMessage(chatId, `Заповніть форму: ${step.form}`);
    });
  } else {
    todayContent.videos.forEach((video) => {
      bot.sendMessage(chatId, `Ваше відео: ${video}`);
    });
  }
};

// Команда /start
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  // Перевірка, чи користувач вже отримав матеріали
  if (users[chatId]) {
    await bot.sendMessage(chatId, "Ви вже почали курс!");
    return;
  }

  users[chatId] = { startDate: new Date().toISOString().split("T")[0] };

  await bot.sendMessage(
    chatId,
    "Привіт! Це Кіра Івлєва. Вітаю вас на курсі 'Шлях до спокою або як швидко позбутися панічних атак'! 😊"
  );

  await sleep(2000);

  const firstDay = courseContent.find((content) => content.day === 1);
  for (const step of firstDay.steps) {
    await bot.sendMessage(chatId, step.text);
    await sleep(2000);

    if (step.image) await bot.sendPhoto(chatId, step.image);
    if (step.video) {
      await bot.sendMessage(chatId, `Дивись відео тут: ${step.video}`, {
        reply_markup: {
          inline_keyboard: [[{ text: step.button, url: step.video }]],
        },
      });
    }
    if (step.form)
      await bot.sendMessage(chatId, `Заповніть форму: ${step.form}`);
  }

  await bot.sendMessage(chatId, "Ти молодець, продовжимо завтра!");
  await sleep(2000);

  await bot.sendMessage(
    chatId,
    "Наступні навчальні матеріали ти будеш отримувати кожен день о 18:00 за Київським часом. Не хвилюйся, якщо не встигатимеш займатись кожен день, ти матимеш доступ до курсу протягом 6 місяців. До зустрічі!"
  );
});
