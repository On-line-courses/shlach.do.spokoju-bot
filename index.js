const TelegramBot = require("node-telegram-bot-api");
const schedule = require("node-schedule");
require("dotenv").config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

let usersState = {}; // Формат: { chatId: { day, step, startDate, lastActive, paymentStatus } }

const paymentLink = "https://www.liqpay.ua/..."; // Сюди вставимо посилання на оплату

// Перевірка оплати (поки що просто імітація, потім замінимо на реальний запит до LiqPay API)
const checkPayment = async (chatId) => {
  // Тут має бути логіка перевірки платежу через API LiqPay
  return true; // Поки що припускаємо, що оплата завжди проходить успішно
};

// Привітальне повідомлення з кнопкою оплати
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  if (usersState[chatId] && usersState[chatId].paymentStatus) {
    bot.sendMessage(chatId, "Ви вже маєте доступ до курсу!");
    sendStep(chatId);
    return;
  }

  usersState[chatId] = { paymentStatus: false };

  bot.sendMessage(
    chatId,
    "Привіт! Вітаю вас на курсі 'Шлях до спокою: як швидко позбутися панічних атак'! 😊\n\n" +
      "Для того, щоб отримати всі матеріали курсу, натисніть кнопку 'ДОСТУП' та перейдіть до безпечної форми оплати.",
    {
      reply_markup: {
        inline_keyboard: [[{ text: "ДОСТУП", url: paymentLink }]],
      },
    }
  );

  setTimeout(() => checkPaymentStatus(chatId), 30000); // Перевіряємо оплату через 30 секунд
});

// Перевірка статусу оплати
const checkPaymentStatus = async (chatId) => {
  const isPaid = await checkPayment(chatId);
  if (isPaid) {
    usersState[chatId].paymentStatus = true;
    usersState[chatId].day = 1;
    usersState[chatId].step = 0;
    usersState[chatId].startDate = new Date();
    usersState[chatId].lastActive = new Date();

    bot.sendMessage(
      chatId,
      "✅ Вітаю, ваша оплата пройшла успішно! Доступ відкрито. Починаємо навчання! 🚀"
    );
    sendStep(chatId);
  } else {
    bot.sendMessage(
      chatId,
      "❌ Щось пішло не так. Спробуйте ще раз або зверніться до свого банку."
    );
  }
};

// Посилання на відео та файли
const courseContent = [
  {
    day: 1,
    steps: [
      {
        image:
          "https://drive.google.com/uc?export=download&id=1sTwVJw94iZS8mvoRLlA3hqAcm3m-hdTQ",
        text: "Сьогодні ми з вами знайомимося. 😇 Мене звуть Кіра Івлєва. Перейдіть за посиланням, щоб переглянути відео, у якому я розповім про себе та про курс.",
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
        image:
          "https://drive.google.com/uc?export=download&id=12MT2L75unoay45CUwBKrQBF8pZEGu9xB",
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
        image:
          "https://drive.google.com/uc?export=download&id=1V5pz4A5-3tDtZHN0PAiF_vEZT3YybGPB",
        text: "Вітаю! Сьогодні ми розпочинаємо активну роботу. 🚀 Спочатку перегляньте відео, щоб краще зрозуміти, як ваше тіло, емоції та думки реагують на стрес. 🧠",
        image:
          "https://drive.google.com/uc?export=download&id=15VVe8-itCltcYtNA29_3d7bJJIkDVbgB",
        video: "https://youtu.be/ibpoVB_YsB4",
        button: "Перейти до перегляду 🎥",
      },
      {
        text: "Тепер пропоную перейти до практики! 🧘‍♀️ У цьому відео ми розглянемо важливість вправ на дихання та попрактикуємо техніку 'діафрагмального дихання'.",
        image:
          "https://drive.google.com/uc?export=download&id=1bRWjuXtSzx3SpfJ8M9464CGtjhnnsjH5",
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
        image:
          "https://drive.google.com/uc?export=download&id=1PRCk4eyUd-UlTOCqg209pjPBILMwZai_",
        text: "Привіт! 🌊 Сьогодні ми розглянемо поняття 'Хвиля стресу'. Це допоможе краще зрозуміти, як стрес впливає на тіло і психіку. 🧠💡",
        image:
          "https://drive.google.com/uc?export=download&id=1EqClmgrewDoJLvZJzX_-vlPCOF2VAgzE",
        video: "https://youtu.be/2IXCtmOFxI0",
        button: "Перейти до перегляду 🎥",
      },
      {
        text: "Переходимо до практики! 🧘‍♂️ Сьогодні ми навчимося вправам заземлення, які допомагають знизити симптоми панічних атак. Переходьте за посиланням!",
        image:
          "https://drive.google.com/uc?export=download&id=109ZYdKvAzn6cwL9SSPavWFE5-1egKdTE",
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
        image:
          "https://drive.google.com/uc?export=download&id=1g9fHmFdDDn5j5p-xnj6X1wFtvaky6Lt6",
      },
      {
        text: "Вітаю! 🧠 Сьогодні ми поговоримо про те, як тригери запускають панічну атаку та чому виникає панічний розлад.",
        image:
          "https://drive.google.com/uc?export=download&id=1B9WGz97GhW1lcUH1E1Fm7ClU75ATZn-P",
        video: "https://youtu.be/_lSblgI7PTI",
        button: "Перейти до перегляду 🎥",
      },
      {
        text: "Тепер переходимо до практики! 📝 Виконайте вправу, яка допоможе вам знайти власні тригери та навчитися розпізнавати їх на ранніх етапах.",
        image:
          "https://drive.google.com/uc?export=download&id=1Hk_mFmTLEIMVHKBu3f81b-y5Rdqb2r1X",
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
        image:
          "https://drive.google.com/uc?export=download&id=1iFP08yiKCoT1sPfMDyESnBiFzTMqjsTv",
        text: "Привіт! 🧘‍♀️ Сьогодні ми поговоримо про інші фактори, які впливають на виникнення панічних атак: стосунки та спосіб життя. 🤝",
        image:
          "https://drive.google.com/uc?export=download&id=1yN1yaqjwBGFA1lUcQWHfC-qZYNKh3RPU",
        video: "https://youtu.be/MI_tZpO9ijw",
        button: "Перейти до перегляду 🎥",
      },
      {
        text: "Продовжуємо! 🌟 Виконайте вправу 'Три кола взаємодії', яка допоможе краще зрозуміти ваші стосунки та їхній вплив на вас.",
        image:
          "https://drive.google.com/uc?export=download&id=1FyZvUDMRbyorn5HRnbdyNwIu5tguOvYw",
        video: "https://youtu.be/8cnw4hhrJcM",
        button: "Перейти до перегляду 🎥",
      },
      {
        text: "Для завершення дня — техніка заземлення, яка допоможе стабілізувати нервову систему. 🧘‍♀️",
        image:
          "https://drive.google.com/uc?export=download&id=1hd__0_VS1khiY1j1-9o63414Yd6DWkwX",
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
        image:
          "https://drive.google.com/uc?export=download&id=1JQ9dahfa9HpvsEEeQezRMrxZvyuzaJ56",
        text: "Привіт! Сьогодні я хочу поділитися своєю історією — власним досвідом подолання панічних атак. 🌟",
        image:
          "https://drive.google.com/uc?export=download&id=1O_z9DBMdAGTIzUFZTovaJ6IsTDw_iUR7",
        video: "https://youtu.be/hMeFFsQQ4Lg",
        button: "Перейти до перегляду 🎥",
      },
      {
        text: "Переходимо до практики медитації. 🧘‍♀️ При регулярному виконанні вона допоможе знизити тривожність. Почнемо зараз!",
        image:
          "https://drive.google.com/uc?export=download&id=10TnK7L-I5OBsVUFWWevV3eCxQV8LzPO1",
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
        image:
          "https://drive.google.com/uc?export=download&id=1gp7gGCIVx47RcuxrikQooguuCBd24o3p",
        text: "Вітаю! 🎉 Ви дійшли до фіналу курсу 'Шлях до спокою: як швидко позбутися панічних атак'. Сьогодні ми підсумуємо всі знання та техніки, які ви опанували.",
        image:
          "https://drive.google.com/uc?export=download&id=1ZKxmpWEJ1bpsbLVI2vwpRGzo_ZLiXB0t",
        video: "https://youtu.be/sPv3oX8aQBU",
        button: "Перейти до перегляду 🎥",
      },
      {
        text: "Завантажте собі Чек-лист! Він допоможе структурувати та застосувати на практиці знання, які ви отримали під час курсу. 📚",
        pdf: "https://drive.google.com/uc?export=download&id=1FO9Bq9s-RdR0oXyCQRc0Ndtli022t5l_",
      },

      {
        text: "Для релаксу проведемо авторську медитацію 'Зірка'. 🧘‍♀️ Вона допоможе вам розслабитися та відчути внутрішній спокій.",
        image:
          "https://drive.google.com/uc?export=download&id=17ulC4z3LbFZgfYmEmrkEh4OiNCZQ2CPC",
        video: "https://youtu.be/pk8_7tBcRuU",
        button: "Перейти до перегляду 🎥",
      },
      {
        text: "На завершення — техніка 'Подяка'. 💕 Вона допоможе краще справлятися зі стресом і тривогою.",
        image:
          "https://drive.google.com/uc?export=download&id=1lD9BGL9NrdckmBFewH2xNGdh4JNbxWfJ",
        video: "https://youtu.be/dsTbpMFcXko",
        button: "Перейти до перегляду 🎥",
      },

      {
        text: "Бонус! 🎶 Три медитативні треки для завантаження:",
        audio: [
          "https://drive.google.com/uc?export=download&id=1H6mYLTeM5CqxYysp5XCvgSjQGBNF1WUh",
          "https://drive.google.com/uc?export=download&id=1CnyeqPngvYpOTFq1R48papoq31yVIdEt",
          "https://drive.google.com/uc?export=download&id=1kXv3xkNwoxZTg9oGSPdrvzWv0sJnGknf",
        ],
      },
      {
        text: "Це ще не все! Я підготувала пам'ятку, яку Ви зможете роздрукувати. Виконуйте ці рекомендації і панічна атака ніколи не захопить зненацька! 📚",
        pdf: "https://drive.google.com/uc?export=download&id=1Mzt49TW9AoOxzwNiyWCAwecPLvHOBrdv",
      },
      {
        text: "І це ще не все! Це пам'ятка, як поводитися під час панічної атаки! Запамятайте, тільки регулярні тренування допоможуть швидко подолати панічну атаку та позбутися їх назавжди! 📚",
        pdf: "https://drive.google.com/uc?export=download&id=1d-kZ3tWUF8exHB9e77ExVu4-PTJ0dptl",
      },
      {
        text: "Дякую, що були зі мною на цьому шляху! ❤ Бажаю вам гармонії та спокою.",
      },
    ],
  },
];

// Відправлення матеріалів
const sendStep = async (chatId) => {
    const userState = usersState[chatId];
    if (!userState || !userState.paymentStatus) return;

    const { day, step } = userState;
    const todayContent = courseContent.find((content) => content.day === day);

    if (!todayContent || !todayContent.steps[step]) {
        bot.sendMessage(chatId, "Це всі матеріали на сьогодні! Продовжимо завтра о 18:00. 😊");
        return;
    }

    const currentStep = todayContent.steps[step];
    if (currentStep.image) await bot.sendPhoto(chatId, currentStep.image);
    if (currentStep.text) await bot.sendMessage(chatId, currentStep.text);
    if (currentStep.video) {
        await bot.sendMessage(chatId, `Дивись відео тут: ${currentStep.video}`, {
            reply_markup: { inline_keyboard: [[{ text: currentStep.button, url: currentStep.video }]] },
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
    if (currentStep.pdf) await bot.sendDocument(chatId, currentStep.pdf);
    if (currentStep.form) await bot.sendMessage(chatId, `Заповніть форму тут: ${currentStep.form}`);

    if (todayContent.steps[step + 1]) {
        bot.sendMessage(chatId, "Коли будеш готовий, натисни 'Продовжити'!", {
            reply_markup: { inline_keyboard: [[{ text: "Продовжити", callback_data: "continue" }]] },
        });
    }
};

// Обробка кнопки "Продовжити"
bot.on("callback_query", (query) => {
    const chatId = query.message.chat.id;
    if (query.data === "continue") {
        usersState[chatId].step += 1;
        sendStep(chatId);
    }
});

// Автоматична розсилка матеріалів о 18:00, тільки якщо користувач завершив усі попередні матеріали
schedule.scheduleJob("0 18 * * *", () => {
    for (const chatId in usersState) {
        const userState = usersState[chatId];
        if (userState.paymentStatus && userState.step === courseContent.find((c) => c.day === userState.day).steps.length) {
            userState.day += 1;
            userState.step = 0;
            sendStep(chatId);
        }
    }
});
