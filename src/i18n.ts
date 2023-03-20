import i18n from 'i18next';

import { initReactI18next } from 'react-i18next';

import en from './locale/en.json';
import es from './locale/es.json';

export const resources = {
    en: {
        translation: en
    },
    es: {
        translation: es
    }
} as const;

(i18n as any).use(initReactI18next).init({
    resources,
    lng: 'es',
    fallbackLng: 'es',
    debug: false,
    interpolation: {
        escapeValue: false // not needed for react as it escapes by default
    }
});
