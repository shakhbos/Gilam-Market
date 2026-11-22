/*
 * Gilam Market yuridik ma'lumotlari — footer rekvizitlari, /privacy va
 * /data-deletion sahifalari. Faqat gilam-market.uz'da (tenant do'konsiz)
 * ko'rsatiladi. Meta Business Verification hujjatdagi nom va manzil bilan
 * solishtiradi — rekvizitlarni guvohnomadan boshqacha yozmang.
 */

export type LegalLocale = "uz" | "ru" | "en";

export const COMPANY = {
  stir: "301758598",
  phone: "+998977663399",
  phoneDisplay: "+998 97 766 33 99",
  /** Egasi tasdiqlagach to'ldiriladi; bo'sh bo'lsa ko'rsatilmaydi. */
  email: "",
  name: {
    uz: '"FIRDAVS-ZOHID SAVDO" MChJ',
    ru: 'ООО "FIRDAVS-ZOHID SAVDO"',
    en: '"FIRDAVS-ZOHID SAVDO" LLC',
  },
  address: {
    uz: "O'zbekiston, Toshkent shahri, Shayxontohur tumani, Kox Ota MFY, Labzak ko'chasi, 103-uy",
    ru: "Узбекистан, г. Ташкент, Шайхантахурский район, МСГ Кох Ота, ул. Лабзак, дом 103",
    en: "103 Labzak street, Kox Ota MFY, Shaykhantakhur district, Tashkent, Uzbekistan",
  },
} as const;

export const POLICY_UPDATED = "2026-11-22";

export function legalLocale(locale: string): LegalLocale {
  return locale === "ru" || locale === "en" ? locale : "uz";
}

type Section = { heading: string; paragraphs: string[] };

type LegalTexts = {
  requisites: {
    heading: string;
    stir: string;
    phone: string;
    email: string;
    privacy: string;
    dataDeletion: string;
  };
  privacy: { title: string; description: string; updated: string; intro: string; sections: Section[] };
  dataDeletion: { title: string; description: string; intro: string; sections: Section[] };
};

export const LEGAL_TEXTS: Record<LegalLocale, LegalTexts> = {
  uz: {
    requisites: {
      heading: "Rekvizitlar",
      stir: "STIR",
      phone: "Telefon",
      email: "Email",
      privacy: "Maxfiylik siyosati",
      dataDeletion: "Ma'lumotlarni o'chirish",
    },
    privacy: {
      title: "Maxfiylik siyosati - Gilam Market",
      description: "Gilam Market shaxsiy ma'lumotlarni qanday yig'ishi, ishlatishi va himoya qilishi.",
      updated: "Oxirgi yangilanish",
      intro:
        'Ushbu siyosat Gilam Market (operator — "FIRDAVS-ZOHID SAVDO" MChJ) gilam-market.uz sayti, GRM tizimi hamda Instagram, Facebook va Telegram sahifalarimiz orqali olinadigan shaxsiy ma\'lumotlarga taalluqli.',
      sections: [
        {
          heading: "1. Qanday ma'lumotlar yig'iladi",
          paragraphs: [
            "Buyurtma va so'rovlarda: ism, telefon raqami, yetkazib berish manzili, buyurtma tarkibi.",
            "Instagram va Facebook sahifalarimizda: bizga yozilgan izohlar va xabarlar, foydalanuvchi nomi (username) va ochiq profil ismi, xabarda o'zingiz qoldirgan telefon raqami.",
            "Saytdan foydalanishda: anonim statistika (Yandex Metrika, Google Analytics) — sahifalar, qurilma turi, taxminiy hudud.",
          ],
        },
        {
          heading: "2. Ma'lumotlardan foydalanish maqsadi",
          paragraphs: [
            "Savollaringizga javob berish, buyurtmani rasmiylashtirish va yetkazib berish.",
            "Izoh yoki xabarda xarid niyatini bildirgan mijozni sotuv operatoriga yo'naltirish (lid sifatida).",
            "O'z sahifalarimiz statistikasini tahlil qilib, xizmat va kontent sifatini yaxshilash.",
            "Ma'lumotlar reklama maqsadida sotilmaydi va uchinchi shaxslarga berilmaydi.",
          ],
        },
        {
          heading: "3. Sun'iy intellekt va xizmat ko'rsatuvchilar",
          paragraphs: [
            "Xabarlarni tasniflash va javob loyihasini tayyorlash uchun sun'iy intellekt xizmatlaridan foydalanamiz. Ularga faqat shu vazifa uchun zarur matn uzatiladi; xizmat ko'rsatuvchilar bu ma'lumotni o'z maqsadlarida ishlatmaydi.",
            "Meta Platforms (Instagram, Facebook) ma'lumotlari faqat Meta Platform qoidalariga muvofiq ishlatiladi.",
          ],
        },
        {
          heading: "4. Saqlash va himoya",
          paragraphs: [
            "Ma'lumotlar O'zbekistondagi serverlarda saqlanadi, kirish faqat vakolatli xodimlarga ruxsat etilgan.",
            "Xabar va izohlar lid bilan ishlash tugaganidan keyin ko'pi bilan 12 oy saqlanadi, buyurtma ma'lumotlari esa qonunchilik talab qilgan muddat davomida.",
          ],
        },
        {
          heading: "5. Sizning huquqlaringiz",
          paragraphs: [
            "Siz o'zingiz haqingizdagi ma'lumotni ko'rish, tuzatish yoki o'chirishni so'rashingiz mumkin. Tartib \"Ma'lumotlarni o'chirish\" sahifasida yozilgan.",
          ],
        },
      ],
    },
    dataDeletion: {
      title: "Ma'lumotlarni o'chirish - Gilam Market",
      description: "Gilam Market'dagi shaxsiy ma'lumotlaringizni o'chirishni qanday so'rash mumkin.",
      intro:
        "Instagram, Facebook yoki sayt orqali bizga berilgan shaxsiy ma'lumotlaringizni istalgan vaqtda o'chirishni so'rashingiz mumkin.",
      sections: [
        {
          heading: "So'rov yuborish",
          paragraphs: [
            "Quyidagi kontaktlarga yozing yoki qo'ng'iroq qiling. Instagram/Facebook username yoki buyurtmadagi telefon raqamingizni ko'rsating.",
            "So'rov 30 kun ichida bajariladi: xabarlar, izohlar, lid va kontakt ma'lumotlari o'chiriladi. Qonun bo'yicha saqlanishi shart bo'lgan buyurtma hujjatlari bundan mustasno. Bajarilgach sizga xabar beramiz.",
          ],
        },
        {
          heading: "Facebook orqali",
          paragraphs: [
            'Facebook\'da Sozlamalar → "Ilovalar va saytlar" bo\'limida "GRM Marketing" ilovasini o\'chirishingiz mumkin. Shundan so\'ng ham yuqoridagi tartibda so\'rov yuborib, saqlangan ma\'lumotni o\'chirtirishingiz mumkin.',
          ],
        },
      ],
    },
  },
  ru: {
    requisites: {
      heading: "Реквизиты",
      stir: "ИНН",
      phone: "Телефон",
      email: "Email",
      privacy: "Политика конфиденциальности",
      dataDeletion: "Удаление данных",
    },
    privacy: {
      title: "Политика конфиденциальности - Gilam Market",
      description: "Как Gilam Market собирает, использует и защищает персональные данные.",
      updated: "Последнее обновление",
      intro:
        'Настоящая политика относится к персональным данным, которые Gilam Market (оператор — ООО "FIRDAVS-ZOHID SAVDO") получает через сайт gilam-market.uz, систему GRM, а также наши страницы в Instagram, Facebook и Telegram.',
      sections: [
        {
          heading: "1. Какие данные мы собираем",
          paragraphs: [
            "При заказах и заявках: имя, номер телефона, адрес доставки, состав заказа.",
            "На наших страницах Instagram и Facebook: комментарии и сообщения, адресованные нам, имя пользователя (username) и публичное имя профиля, номер телефона, который вы сами оставили в сообщении.",
            "При использовании сайта: обезличенная статистика (Яндекс Метрика, Google Analytics) — страницы, тип устройства, примерный регион.",
          ],
        },
        {
          heading: "2. Цели использования",
          paragraphs: [
            "Ответы на ваши вопросы, оформление и доставка заказов.",
            "Передача клиента, выразившего намерение купить в комментарии или сообщении, менеджеру по продажам (как заявку).",
            "Анализ статистики собственных страниц для улучшения сервиса и контента.",
            "Данные не продаются и не передаются третьим лицам в рекламных целях.",
          ],
        },
        {
          heading: "3. Искусственный интеллект и подрядчики",
          paragraphs: [
            "Для классификации сообщений и подготовки черновиков ответов мы используем сервисы искусственного интеллекта. Им передаётся только текст, необходимый для этой задачи; подрядчики не используют эти данные в собственных целях.",
            "Данные Meta Platforms (Instagram, Facebook) используются только в соответствии с правилами Meta Platform.",
          ],
        },
        {
          heading: "4. Хранение и защита",
          paragraphs: [
            "Данные хранятся на серверах в Узбекистане, доступ имеют только уполномоченные сотрудники.",
            "Сообщения и комментарии хранятся не более 12 месяцев после завершения работы с заявкой, данные заказов — в течение срока, установленного законодательством.",
          ],
        },
        {
          heading: "5. Ваши права",
          paragraphs: [
            "Вы можете запросить просмотр, исправление или удаление данных о себе. Порядок описан на странице «Удаление данных».",
          ],
        },
      ],
    },
    dataDeletion: {
      title: "Удаление данных - Gilam Market",
      description: "Как запросить удаление ваших персональных данных в Gilam Market.",
      intro:
        "Вы можете в любой момент запросить удаление персональных данных, переданных нам через Instagram, Facebook или сайт.",
      sections: [
        {
          heading: "Как отправить запрос",
          paragraphs: [
            "Напишите или позвоните по контактам ниже. Укажите ваш username в Instagram/Facebook или номер телефона из заказа.",
            "Запрос выполняется в течение 30 дней: удаляются сообщения, комментарии, заявки и контактные данные, кроме документов по заказам, которые мы обязаны хранить по закону. После выполнения мы сообщим вам.",
          ],
        },
        {
          heading: "Через Facebook",
          paragraphs: [
            "В Facebook: Настройки → «Приложения и сайты» — удалите приложение «GRM Marketing». После этого вы также можете отправить запрос по порядку выше, чтобы удалить сохранённые данные.",
          ],
        },
      ],
    },
  },
  en: {
    requisites: {
      heading: "Company details",
      stir: "TIN",
      phone: "Phone",
      email: "Email",
      privacy: "Privacy Policy",
      dataDeletion: "Data Deletion",
    },
    privacy: {
      title: "Privacy Policy - Gilam Market",
      description: "How Gilam Market collects, uses and protects personal data.",
      updated: "Last updated",
      intro:
        'This policy covers personal data that Gilam Market (operated by "FIRDAVS-ZOHID SAVDO" LLC) receives through the gilam-market.uz website, the GRM system, and our Instagram, Facebook and Telegram pages.',
      sections: [
        {
          heading: "1. Data we collect",
          paragraphs: [
            "Orders and requests: name, phone number, delivery address, order contents.",
            "On our Instagram and Facebook pages: comments and messages sent to us, your username and public profile name, and any phone number you choose to share in a message.",
            "Website usage: anonymous analytics (Yandex Metrica, Google Analytics) — pages visited, device type, approximate region.",
          ],
        },
        {
          heading: "2. How we use it",
          paragraphs: [
            "To answer your questions and to process and deliver orders.",
            "To pass customers who show purchase intent in a comment or message to a sales operator (as a lead).",
            "To analyse statistics of our own pages and improve our service and content.",
            "We do not sell personal data or share it with third parties for advertising.",
          ],
        },
        {
          heading: "3. AI and service providers",
          paragraphs: [
            "We use AI services to classify messages and draft replies. They receive only the text needed for that task, and providers do not use it for their own purposes.",
            "Data from Meta Platforms (Instagram, Facebook) is used only in accordance with the Meta Platform Terms.",
          ],
        },
        {
          heading: "4. Storage and security",
          paragraphs: [
            "Data is stored on servers in Uzbekistan; access is limited to authorised staff.",
            "Messages and comments are kept for no longer than 12 months after the lead is closed; order records are kept for the period required by law.",
          ],
        },
        {
          heading: "5. Your rights",
          paragraphs: [
            "You may request access to, correction of, or deletion of your data. See the Data Deletion page for how.",
          ],
        },
      ],
    },
    dataDeletion: {
      title: "Data Deletion - Gilam Market",
      description: "How to request deletion of your personal data held by Gilam Market.",
      intro:
        "You can request deletion of personal data you shared with us via Instagram, Facebook or our website at any time.",
      sections: [
        {
          heading: "How to request deletion",
          paragraphs: [
            "Contact us using the details below and include your Instagram/Facebook username or the phone number used for your order.",
            "We complete requests within 30 days: messages, comments, leads and contact details are deleted, except order records we are legally required to keep. We will confirm once it is done.",
          ],
        },
        {
          heading: "Via Facebook",
          paragraphs: [
            'In Facebook go to Settings → "Apps and Websites" and remove the "GRM Marketing" app. You can then also send a request as described above to delete any stored data.',
          ],
        },
      ],
    },
  },
};
