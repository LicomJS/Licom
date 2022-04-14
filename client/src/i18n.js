import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import english from "./locales/en/translation.json";
import polish from "./locales/pl/translation.json";
import germany from "./locales/de/translation.json";

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
    },
    fallbackLng: "en",
    debug: false,
    // interpolation: {
    //   escapeValue: false, // not needed for react as it escapes by default
    // },
  });

export default i18n;
