import React from 'react';
import {StyleSheet, Text as RNText} from "react-native";

//import {useTheme} from "../themes/themeProvider";

import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import icoMoonConfig from '../fonts/selection';
const expoAssetId = require("../fonts/icomoon.ttf");
const IcoMoon = createIconSetFromIcoMoon(icoMoonConfig, 'DemoApp', expoAssetId);

export default function Icon(props) {

    return (
        <IcoMoon {...props} />
    );
}

const styles = StyleSheet.create({
});
