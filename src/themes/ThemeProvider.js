import React, { useContext, useEffect, useState } from 'react';
import * as SecureStore from "expo-secure-store";
import { Appearance, useColorScheme } from 'react-native-appearance';

import config from "../config/config";

const ThemeContext = React.createContext();

import {getColor} from "./colors";

import lightTheme from "./light";
import darkTheme from "./dark";

function checkNumber(number) {
    if(number > 700) {
        return 700;
    } else if(number < 100) {
        return 100;
    } else {
        return number;
    }
}

export const defaultTheme = config.defaultTheme;

export const ThemeContextProvider = ({ children }) => {

    const [themeID, setThemeID] = useState(defaultTheme);
    const [contrast, setContrast] = useState('normal');

    useEffect(() => {
        (async () => {
            const storedThemeID = await SecureStore.getItemAsync('themeID');
            if (storedThemeID) {
                setThemeID(storedThemeID);
            } else {
                if (Appearance.getColorScheme() == 'light' || Appearance.getColorScheme() == 'dark') {
                    setThemeID(Appearance.getColorScheme());
                } else {
                    setThemeID(defaultTheme);
                }
            }

            const storedContrast = await SecureStore.getItemAsync('contrast');
            if (storedContrast) {
                setContrast(storedContrast);
            } else {
                setContrast('normal');
            }
        })();
    }, []);

    return (
        <ThemeContext.Provider value={{ themeID, setThemeID, contrast, setContrast }}>
            {children}
        </ThemeContext.Provider>
    );
};


export function useTheme() {
    const { themeID, setThemeID, contrast, setContrast } = useContext(ThemeContext);

    let THEMES = {
        light: lightTheme((contrast == 'high' ? config.highContrast : 0), checkNumber),
        dark: darkTheme((contrast == 'high' ? config.highContrast : 0), checkNumber),
    }

    const theme = THEMES[themeID];
    const setTheme = async themeID => {
        await SecureStore.setItemAsync('themeID', themeID);
        setThemeID(themeID);
    };
    const setContrastLevel = async contrast => {
        await SecureStore.setItemAsync('contrast', contrast);
        setContrast(contrast);
    };

    return {
        theme,
        themeID,
        THEMES,
        setTheme,
        contrast,
        setContrastLevel,
        getColor
    };
}