import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json'; 
import bg from './locales/bg.json';
import HttpBackend from 'i18next-http-backend';

i18n
    .use(HttpBackend)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            bg: { translation: bg }
          },
        lng: 'bg',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        debug: false
    });

export default i18n;