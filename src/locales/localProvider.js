import React, { useContext, useEffect, useState } from 'react';
import * as SecureStore from "expo-secure-store";
import * as Localization from 'expo-localization';

import i18n from 'i18n-js';

import en from "../locales/en";
import de from "../locales/de";

import config from "../config/config";

const LocaleContext = React.createContext();

export const LocaleContextProvider = ({ children }) => {
    const [locale, setLocale] = useState(Localization.locale.substring(0, 2));

    useEffect(() => {
        (async () => {
            var storedLocale = await SecureStore.getItemAsync('locale');
            if (storedLocale) {
                storedLocale = storedLocale.substring(0, 2);
                setLocale(storedLocale);
            } else {
                setLocale(Localization.locale.substring(0, 2));
            }
        })();
    }, []);

    return (
        <LocaleContext.Provider value={{ locale, setLocale }}>
            {children}
        </LocaleContext.Provider>
    );
};

export function useTranslation() {
    const { locale, setLocale } = useContext(LocaleContext);

    const setLanguage = async locale => {
        locale = locale.substring(0, 2);
        await SecureStore.setItemAsync('locale', locale);
        setLocale(locale);
    };

    i18n.translations = {
        en: en,
        de: de,
    };

    i18n.locale = locale.substring(0, 2);
    i18n.fallbacks = true;

    return {
        i18n,
        locale,
        setLanguage,
    };
}
