import React, { createContext, useContext, useMemo, useState } from 'react';

const STRINGS = {
    en: {
        reportSymptoms: 'Report Symptoms',
        viewDashboard: 'View Dashboard',
        alerts: 'Alerts',
        awareness: 'Awareness'
    },
    hi: {
        reportSymptoms: 'लक्षण दर्ज करें',
        viewDashboard: 'डैशबोर्ड देखें',
        alerts: 'सतर्कताएँ',
        awareness: 'जागरूकता'
    }
};

const I18nContext = createContext({ lang: 'en', t: (k) => k, setLang: () => {} });

export const I18nProvider = ({ children }) => {
    const [lang, setLang] = useState(navigator.language?.startsWith('hi') ? 'hi' : 'en');
    const t = useMemo(() => (key) => STRINGS[lang]?.[key] || STRINGS.en[key] || key, [lang]);
    const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);
    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => useContext(I18nContext);


