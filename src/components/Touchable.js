import React, {useState} from 'react';
import {Platform, StyleSheet, TouchableOpacity, TouchableNativeFeedback, TouchableHighlight, View} from "react-native";
import { TouchableOpacity as TouchableOpacityAndroid } from 'react-native-gesture-handler'

import {useTheme} from "../themes/ThemeProvider";

export default function Touchable(props) {
    const {theme} = useTheme();

    if(Platform.OS === 'androidbak') {
        /*return (
            <TouchableOpacity {...props} activeOpacity={1} />
        );*/
        return (
            <View style={{borderRadius: 9,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: 'transparent'}}>
                <TouchableNativeFeedback {...props}  background={TouchableNativeFeedback.Ripple('red', false)} />
            </View>
        );
    } else {
        return (
            <TouchableOpacityAndroid {...props} />
        );
    }
}

const styles = StyleSheet.create({
});
