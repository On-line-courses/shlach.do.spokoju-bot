const TelegramBot = require("node-telegram-bot-api");
const schedule = require("node-schedule");

// Токен Telegram-бота
require("dotenv").config();
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// База даних користувачів: зберігає, на якому кроці знаходиться кожен користувач
let usersState = {}; // Формат: { chatId: { day: number, step: number } }

// Посилання на відео та файли
const courseContent = [
  {
    day: 1,
    steps: [
      {
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
        text: "Вітаю! 🎉 Ви завершили курс 'Шлях до спокою'. Сьогодні ми підсумуємо всі знання та техніки, які ви опанували.",
        video: "https://youtu.be/sPv3oX8aQBU",
        button: "Перейти до перегляду 🎥",
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
        text: "Корисний матеріал у PDF: 📚",
        pdf: "./files/grounding_guide.pdf",
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
        text: "Дякую, що були зі мною на цьому шляху! ❤ Бажаю вам гармонії та спокою.",
      },
    ],
  },
];


// Функція для надсилання поточного кроку користувачу
const sendStep = async (chatId) => {
  const userState = usersState[chatId];

  if (!userState) return;

  const { day, step } = userState;
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
// Команда /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  if (usersState[chatId]) {
    bot.sendMessage(chatId, "Ви вже почали курс!");
    return;
  }

  // Ініціалізуємо стан користувача
  usersState[chatId] = { day: 1, step: 0 };

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
    // Збільшуємо крок користувача
    usersState[chatId].step += 1;

    // Відправляємо наступний крок
    sendStep(chatId);
  }
});
