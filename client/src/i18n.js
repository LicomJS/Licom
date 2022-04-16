import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import english from "./locales/en/translation.json";
import polish from "./locales/pl/translation.json";
import germany from "./locales/de/translation.json";
import dutch from "./locales/nl/translation.json";
import moment from "moment";
import "moment/min/locales";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: english,
      },
      pl: {
        translation: polish,
      },
      de: {
        translation: germany,
      },
      nl: {
        translation: dutch,
      },
    },
    fallbackLng: "en",
    debug: false,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

moment.locale(i18n.language);

export default i18n;
