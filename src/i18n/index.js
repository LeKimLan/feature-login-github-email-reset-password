import i18n from "i18next";
import en from './locales/en.json'
import vi from './locales/vi.json'
import { initReactI18next } from "react-i18next";
i18n
    .use(initReactI18next) 
    .init({
        resources: {
            en,
            vi
        },
        lng: localStorage.getItem("locales"),
        fallbackLng: "en"
    });