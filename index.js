const TelegramBot = require("node-telegram-bot-api");
const schedule = require("node-schedule");

// Токен Telegram-бота
require("dotenv").config();
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Підключено до MongoDB"))
  .catch((err) => console.error("❌ Помилка підключення:", err));

// База даних користувачів: зберігає стан кожного користувача
let usersState = {}; // Формат: { chatId: { day: number, step: number, startDate: Date, lastActive: Date } }

// Посилання на відео та файли
const courseContent = [
  {
    day: 1,
    steps: [
      {
        image: "./covers/day_1.jpg",
        text: "Сьогодні ми з вами знайомимося. 😇 Перейдіть за посиланням, щоб переглянути відео, у якому я розповім про себе та про курс.",
        video: "https://youtu.be/JVX3zmS5tmk",
        button: "Перейти до перегляду 🎥",
      },
      {
        text: "Тепер, після нашого знайомства, я хочу більш детально розповісти вам про панічні атаки. Переходьте за посиланням. 🧠✨",
        video: "https://youtu.be/6g5zq2mW4Ks",
        button: "Перейти до перегляду 🎥",
      },
      {
        text: "А тепер прошу заповнити конфіденційну форму. 📝 Це допоможе мені оцінити ваш стан і потреби. Дякую! 💕",
        image: "./covers/google_form.jpg",
        form: "https://docs.google.com/forms/d/e/1FAIpQLSci3Qdk-sIb6Gbgthd4KpeEhxnRtb3oG7yslV5XTHgW41UcVw/viewform?usp=sf_link",
      },
      {
        text: "Це всі матеріали на сьогодні! Продовжимо завтра о 18:00 за Київським часом. 😊 До зустрічі!",
      },
    ],
  },
  {
    day: 2,
    steps: [
      {
        image: "./covers/day_2.jpg",
        text: "Вітаю! Сьогодні ми розпочинаємо активну роботу. 🚀 Спочатку перегляньте відео, щоб краще зрозуміти, як ваше тіло, емоції та думки реагують на стрес. 🧠",
        video: "https://youtu.be/ibpoVB_YsB4",
        button: "Перейти до перегляду 🎥",
      },
      {
        text: "Тепер пропоную перейти до практики! 🧘‍♀️ У цьому відео ми розглянемо важливість вправ на дихання та попрактикуємо техніку 'діафрагмального дихання'.",
        video: "https://youtu.be/2yatrw0CzgE",
        button: "Перейти до перегляду 🎥",
      },
      {
        text: "Це всі матеріали на сьогодні! Продовжимо завтра о 18:00 за Київським часом. 😊 До зустрічі!",
      },
    ],
  },
  {
    day: 3,
    steps: [
      {
        image: "./covers/day_3.jpg",
        text: "Привіт! 🌊 Сьогодні ми розглянемо поняття 'Хвиля стресу'. Це допоможе краще зрозуміти, як стрес впливає на тіло і психіку. 🧠💡",
        video: "https://youtu.be/2IXCtmOFxI0",
        button: "Перейти до перегляду 🎥",
      },
      {
        text: "Переходимо до практики! 🧘‍♂️ Сьогодні ми навчимося вправам заземлення, які допомагають знизити симптоми панічних атак. Переходьте за посиланням!",
        video: "https://youtu.be/Qrm21OWm1Gk",
        button: "Перейти до перегляду 🎥",
      },
      {
        text: "Це всі матеріали на сьогодні! Продовжимо завтра о 18:00 за Київським часом. 😊 До зустрічі!",
      },
    ],
  },
  {
    day: 4,
    steps: [
      {
        image: "./covers/day_4.jpg",
      },
      {
        text: "Вітаю! 🧠 Сьогодні ми поговоримо про те, як тригери запускають панічну атаку та чому виникає панічний розлад.",
        video: "https://youtu.be/_lSblgI7PTI",
        button: "Перейти до перегляду 🎥",
      },
      {
        text: "Тепер переходимо до практики! 📝 Виконайте вправу, яка допоможе вам знайти власні тригери та навчитися розпізнавати їх на ранніх етапах.",
        video: "https://youtu.be/cac0iNstWs4",
        button: "Перейти до перегляду 🎥",
      },
      {
        text: "Це всі матеріали на сьогодні! Продовжимо завтра о 18:00 за Київським часом. 😊 До зустрічі!",
      },
    ],
  },
  {
    day: 5,
    steps: [
      {
        image: "./covers/day_5.jpg",
        text: "Привіт! 🧘‍♀️ Сьогодні ми поговоримо про інші фактори, які впливають на виникнення панічних атак: стосунки та спосіб життя. 🤝",
        video: "https://youtu.be/MI_tZpO9ijw",
        button: "Перейти до перегляду 🎥",
      },
      {
        text: "Продовжуємо! 🌟 Виконайте вправу 'Три кола взаємодії', яка допоможе краще зрозуміти ваші стосунки та їхній вплив на вас.",
        video: "https://youtu.be/8cnw4hhrJcM",
        button: "Перейти до перегляду 🎥",
      },
      {
        text: "Для завершення дня — техніка заземлення, яка допоможе стабілізувати нервову систему. 🧘‍♀️",
        video: "https://youtu.be/yl9-wwrwHGU",
        button: "Перейти до перегляду 🎥",
      },
      {
        text: "Це всі матеріали на сьогодні! Продовжимо завтра о 18:00 за Київським часом. 😊 До зустрічі!",
      },
    ],
  },
  {
    day: 6,
    steps: [
      {
        image: "./covers/day_6.jpg",
        text: "Привіт! Сьогодні я хочу поділитися своєю історією — власним досвідом подолання панічних атак. 🌟",
        video: "https://youtu.be/hMeFFsQQ4Lg",
        button: "Перейти до перегляду 🎥",
      },
      {
        text: "Переходимо до практики медитації. 🧘‍♀️ При регулярному виконанні вона допоможе знизити тривожність. Почнемо зараз!",
        video: "https://youtu.be/3Qar8yR5jt0",
        button: "Перейти до перегляду 🎥",
      },
      {
        text: "Це всі матеріали на сьогодні! Продовжимо завтра о 18:00 за Київським часом. 😊 До зустрічі!",
      },
    ],
  },
  {
    day: 7,
    steps: [
      {
        image: "./covers/day_7.jpg",
        text: "Вітаю! 🎉 Ви дійшли до фіналу курсу 'Шлях до спокою: як швидко позбутися панічних атак'. Сьогодні ми підсумуємо всі знання та техніки, які ви опанували.",
        video: "https://youtu.be/sPv3oX8aQBU",
        button: "Перейти до перегляду 🎥",
      },
      {
        text: "Завантажте собі Чек-лист! Він допоможе структурувати та застосувати на практиці знання, які ви отримали під час курсу. 📚",
        pdf: "./files/CheckList.pdf",
      },

      {
        text: "Для релаксу проведемо авторську медитацію 'Зірка'. 🧘‍♀️ Вона допоможе вам розслабитися та відчути внутрішній спокій.",
        video: "https://youtu.be/pk8_7tBcRuU",
        button: "Перейти до перегляду 🎥",
      },
      {
        text: "На завершення — техніка 'Подяка'. 💕 Вона допоможе краще справлятися зі стресом і тривогою.",
        video: "https://youtu.be/dsTbpMFcXko",
        button: "Перейти до перегляду 🎥",
      },

      {
        text: "Бонус! 🎶 Три медитативні треки для завантаження:",
        audio: [
          "./audio/meditation1.mp3",
          "./audio/meditation2.mp3",
          "./audio/meditation3.mp3",
        ],
      },
      {
        text: "Це ще не все! Я підготувала пам'ятку, яку Ви зможете роздрукувати. Виконуйте ці рекомендації і панічна атака ніколи не захопить зненацька! 📚",
        pdf: "./files/practice_every_day.pdf",
      },
      {
        text: "І це ще не все! Це пам'ятка, як поводитися під час панічної атаки! Запамятайте, тільки регулярні тренування допоможуть швидко подолати панічну атаку та позбутися їх назавжди! 📚",
        pdf: "./files/stop_panic_attack.pdf",
      },
      {
        text: "Дякую, що були зі мною на цьому шляху! ❤ Бажаю вам гармонії та спокою.",
      },
    ],
  },
];

// Функція для перевірки, чи доступ користувача не закінчився
const isAccessValid = (startDate) => {
  const currentDate = new Date();
  const expiryDate = new Date(startDate);
  expiryDate.setMonth(expiryDate.getMonth() + 6); // Додаємо 6 місяців до дати початку

  return currentDate <= expiryDate;
};

// Функція для надсилання поточного кроку користувачу
const sendStep = async (chatId) => {
  const userState = usersState[chatId];

  if (!userState) return;

  const { day, step, startDate } = userState;

  // Перевіряємо, чи доступ активний
  if (!isAccessValid(startDate)) {
    bot.sendMessage(
      chatId,
      "Ваш доступ до курсу закінчився. Хочете продовжити? 😊",
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Продовжити доступ", callback_data: "renew_access" }],
          ],
        },
      }
    );
    return;
  }

  const todayContent = courseContent.find((content) => content.day === day);

  if (!todayContent || !todayContent.steps[step]) {
    bot.sendMessage(
      chatId,
      "Це всі матеріали на сьогодні! Продовжимо завтра. 😊"
    );
    return;
  }

  const currentStep = todayContent.steps[step];

  await bot.sendMessage(chatId, currentStep.text);

  if (currentStep.image) {
    await bot.sendPhoto(chatId, currentStep.image);
  }

  if (currentStep.video) {
    await bot.sendMessage(chatId, `Дивись відео тут: ${currentStep.video}`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: currentStep.button, url: currentStep.video }],
        ],
      },
    });
  }

  if (currentStep.audio) {
    if (Array.isArray(currentStep.audio)) {
      for (const audio of currentStep.audio) {
        await bot.sendAudio(chatId, audio);
      }
    } else {
      await bot.sendAudio(chatId, currentStep.audio);
    }
  }

  if (currentStep.pdf) {
    await bot.sendDocument(chatId, currentStep.pdf);
  }

  if (currentStep.form) {
    await bot.sendMessage(chatId, `Заповніть форму тут: ${currentStep.form}`);
  }

  if (todayContent.steps[step + 1]) {
    await bot.sendMessage(chatId, "Коли будеш готовий, натисни 'Продовжити'!", {
      reply_markup: {
        inline_keyboard: [[{ text: "Продовжити", callback_data: "continue" }]],
      },
    });
  }
};

// Функція для перевірки активності користувачів
const checkUserActivity = () => {
  const currentDate = new Date();

  for (const chatId in usersState) {
    const userState = usersState[chatId];
    const { lastActive } = userState;

    if (
      lastActive &&
      (currentDate - new Date(lastActive)) / (1000 * 60 * 60 * 24) > 3
    ) {
      bot.sendMessage(
        chatId,
        "Ми помітили, що ви не продовжуєте курс. 😊 Поверніться до матеріалів, щоб завершити навчання!"
      );
    }
  }
};

// Розклад для перевірки активності
schedule.scheduleJob("0 18 * * *", checkUserActivity); // Щодня о 18:00

// Команда /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  if (usersState[chatId]) {
    bot.sendMessage(chatId, "Ви вже почали курс!");
    return;
  }

  // Ініціалізуємо стан користувача
  usersState[chatId] = {
    day: 1,
    step: 0,
    startDate: new Date(), // Зберігаємо дату початку
    lastActive: new Date(),
  };

  bot.sendMessage(
    chatId,
    "Привіт! Вітаю вас на курсі 'Шлях до спокою: як швидко позбутися панічних атак'! 😊"
  );

  // Відправляємо перший крок
  sendStep(chatId);
});

// Обробка кнопки "Продовжити"
bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;

  if (query.data === "continue") {
    const userState = usersState[chatId];

    // Якщо день не завершений, продовжуємо поточний день
    const todayContent = courseContent.find(
      (content) => content.day === userState.day
    );
    if (todayContent && userState.step < todayContent.steps.length - 1) {
      usersState[chatId].step += 1;
    } else {
      // Якщо день завершено, переходимо до наступного
      usersState[chatId].day += 1;
      usersState[chatId].step = 0;
    }

    usersState[chatId].lastActive = new Date();
    sendStep(chatId);
  }

  if (query.data === "renew_access") {
    // Оновлюємо дату початку доступу
    usersState[chatId].startDate = new Date();
    bot.sendMessage(
      chatId,
      "Ваш доступ успішно продовжено ще на 6 місяців! 🚀"
    );
    sendStep(chatId);
  }
});
