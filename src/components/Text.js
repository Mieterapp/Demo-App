import React from 'react';
import {StyleSheet, Text as RNText} from "react-native";

import {useTheme} from "../themes/ThemeProvider";

export default function Text(props) {
    const {theme} = useTheme();

    var font = 'Roboto-Regular';
    var fontStyle = 'normal';

    if(typeof props.style != 'undefined' && typeof props.style.fontWeight != "undefined") {
        if(props.style.fontWeight == "500") {
            var font = 'Roboto-Medium';
        }
    }

    if(typeof props.style != 'undefined' && typeof props.style.fontStyle != "undefined") {
        if(props.style.fontStyle == 'italic') {
            var font = 'Roboto-Italic';
        }
    }
    return (
        <RNText {...props} textBreakStrategy={'simple'} style={[styles.text, {color: theme.defaultTextColor}, props.style]}>
            {props.children}
        </RNText>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 15
    }
});
