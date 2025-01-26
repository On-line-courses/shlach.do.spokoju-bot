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
        text: "Сьогодні ми з вами знайомимося, тому переходь за посиланням, в цьому відео я розповім тобі про себе та про курс.",
        video: "https://youtu.be/JVX3zmS5tmk",
        button: "Перейти до перегляду",
      },
      {
        text: "Тепер після нашого знайомства я хочу більш детально розказати тобі про панічні атаки. Переходь за посиланням.",
        video: "https://youtu.be/6g5zq2mW4Ks",
        button: "Перейти до перегляду",
      },
      {
        text: "А тепер я прошу тебе заповнити конфіденційну форму, щоб я змогла оцінити твій стан і потреби.",
        image: "./covers/google_form.jpg",
        form: "https://docs.google.com/forms/d/e/1FAIpQLSci3Qdk-sIb6Gbgthd4KpeEhxnRtb3oG7yslV5XTHgW41UcVw/viewform?usp=sf_link",
      },

      {
        text: "Це всі матеріали на сьогодні! Продовжимо завтра о 18:00 за Київським часом. 😊",
      },
    ],
  },
  {
    day: 2,
    steps: [
      {
        text: "Вітаю! Сьогодні ми розпочинаємо с тобою активну працю! Спочатку подивись відео за посиланням для кращого розуміння як твоє тіло, емоції та думкт можуть реагувати на стрес.",
        video: "https://youtu.be/ibpoVB_YsB4",
        button: "Перейти до перегляду",
      },
      {
        text: "Тепер пропоную перейти до практики. В цьому практичному уроці ми поговоримо про важливість вправ на дихання, їхню роль в подоланні панічних атак та попрактикуємо  техніку “діафрагмального дихання”. Переходь за посиланням.",
        video: "https://youtu.be/2yatrw0CzgE",
        button: "Перейти до перегляду",
      },
      {
        text: "Це всі матеріали на сьогодні! Продовжимо завтра о 18:00 за Київським часом. 😊",
      },
    ],
    files: [],
  },
  {
    day: 3,
    steps: [
      {
        text: "Вітаю! Сьогодні ми розберемо таке поняття, як 'Хвиля стресу' — це корисна концепція для розуміння того, як стрес впливає на тіло і психіку. Вона описує природний процес виникнення, розвитку і спадання реакції на загрозу та небезпеку.",
        video: "https://youtu.be/2IXCtmOFxI0",
        button: "Перейти до перегляду",
      },
      {
        text: "Тепер пропоную перейти до практики. Сьогодні ми поговоримо про вправи  заземлення, які ми використовуємо для зниження симптомів панічних атак та будемо практикувати техніку візуального зосередження на предметах.",
        video: "https://youtu.be/Qrm21OWm1Gk",
        button: "Перейти до перегляду",
      },
      {
        text: "Це всі матеріали на сьогодні! Продовжимо завтра о 18:00 за Київським часом. 😊",
      },
    ],
  },
  {
    day: 4,
    steps: [
      {
        text: "Вітаю! Сьогодні ми поговоримо про те, як тригери запускають панічну атаку і чому виникає панічний розлад.",
        video: "https://youtu.be/_lSblgI7PTI",
        button: "Перейти до перегляду",
      },
      {
        text: "Тепер пропоную перейти до практики. Зараз ми зробимо вправу , яка допоможе вам знайти власні тригери та навчитися розпізнавати їх на ранніх етапах.",
        video: "https://youtu.be/cac0iNstWs4",
        button: "Перейти до перегляду",
      },
      {
        text: "Це всі матеріали на сьогодні! Продовжимо завтра о 18:00 за Київським часом. 😊",
      },
    ],
  },
  {
    day: 5,
    steps: [
      {
        text: "Вітаю! Сьогодні ми поговоримо про фактори, крім тригерів і психотравми, які впливають на виникнення панічних атак. А саме про важливу роль стосунків з іншими людьми та способу життя.",
        video: "https://youtu.be/MI_tZpO9ijw",
        button: "Перейти до перегляду",
      },
      {
        text: "Тепер пропоную перейти до практики. Вправа 'Три кола взаємодії' допоможе вам проаналізувати стосунки з людьми, і зрозуміти, які з цих стосунків приносять позитивні емоції, а які — викликають напругу або стрес.",
        video: "https://youtu.be/8cnw4hhrJcM",
        button: "Перейти до перегляду",
      },
      {
        text: "Зараз ти можеш відчувати невелике нервове збудження або виснаження. Пропоную заспокоїтися. Допоможе тобі в цому ще одна вправа заземлення, яка сприяє відновленню зв'язка із тілом і стабілізує нервову систему.",
        video: "https://youtu.be/yl9-wwrwHGU",
        button: "Перейти до перегляду",
      },
      {
        text: "Це всі матеріали на сьогодні! Продовжимо завтра о 18:00 за Київським часом. 😊",
      },
    ],
  },
  {
    day: 6,
    steps: [
      {
        text: "Вітаю! Сьогодні я хочу поділитися своєю історією, а саме  власним досвідом подолання панічних атак та  шляхом, який я пройшла до спокійного життя. ",
        video: "https://youtu.be/hMeFFsQQ4Lg",
        button: "Перейти до перегляду",
      },
      {
        text: "Тепер пропоную перейти до практики. Сьогодні я навчу тебе робити медитацію. При регулярній практиці у тебе знизится рівень тривожності та з'явиться відчуття безпеки.",
        video: "https://youtu.be/3Qar8yR5jt0",
        button: "Перейти до перегляду",
      },
      {
        text: "Це всі матеріали на сьогодні! Продовжимо завтра о 18:00 за Київським часом. 😊",
      },
    ],
  },
  {
    day: 7,
    steps: [
      {
        text: "Вітаю тебе із завершенням курсу 'Шлях до спокою: як швидко позбутися панічних атак'. Сьогодні ми підсумуємо знання та техніки, які ви опанували під час навчання, і створимо план для інтеграції цих навичок у твоє повсякденне життя.",
        video: "https://youtu.be/sPv3oX8aQBU",
        button: "Перейти до перегляду",
      },
      {
        text: "Це ще не все. Ми обов'язково сьогодні порелаксуємо!🧘‍♀️ Я навчу тебе авторській медитації, яку я назвала 'Зірка'.",
        video: "https://youtu.be/pk8_7tBcRuU",
        button: "Перейти до перегляду",
      },
      {
        text: "І це ще не все!❤ Я навчу тебе техніці, яка називається 'Подяка'. Ця техніка допомагає не тільки заспокоїти нервову систему, але й розвиває здатність краще справлятися з тривогою та стресовими ситуаціями, створюючи більш гармонійне сприйняття світу.",
        video: "https://youtu.be/dsTbpMFcXko",
        button: "Перейти до перегляду",
      },
      {
        text: "Корисний матеріал у PDF:",
        pdf: "./files/grounding_guide.pdf",
      },
      {
        text: "Переходь до бонусних матеріалів! Я підготувала для тебе три музичні композиції для медитації. Можеш завантажити їх собі на пристрій та медитувати в будь-який зручний час для себе!",
        audio: [
          "./audio/meditation1.mp3",
          "./audio/meditation2.mp3",
          "./audio/meditation3.mp3",
        ],
      },
      {
        text: "Вітаю тебе із завершенням курсу!",
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
