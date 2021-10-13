import React from 'react';
import {Image, StyleSheet, View, ActivityIndicator} from "react-native";

import {useTheme} from "../themes/ThemeProvider";

import Text from './Text';
import Touchable from "./Touchable";
import {GWGColors} from "../config/Colors";

import {Ionicons} from "@expo/vector-icons";

export default function Checkbox(props) {
    const {theme} = useTheme();
    return (
        <View>
            <Touchable disabled={props.disabled ?? false} onPress={() => props.onPress()} activeOpacity={0.6}>
                <View style={[styles.button, props.buttonStyle, (props.error ? styles.error : ''), { zIndex: 10}]}>

                    {props.checked ?
                        <Ionicons
                            name={'ios-checkmark'}
                            size={35}
                            color={GWGColors.BUTTONCOLOR}
                            style={{marginTop: -5}}
                        />
                        :
                        <></>
                    }

                </View>
            </Touchable>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',

        borderRadius: 0,
        height: 25,
        width: 25,
        marginBottom: 0,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: GWGColors.InputBorderColor,
        backgroundColor: GWGColors.WHITE

    },
    buttonDisabled : {
        backgroundColor: GWGColors.LIGHTERGREY
    },

    warning: {
        backgroundColor: 'red'
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '500',
        color: GWGColors.BUTTONTEXTCOLOR
    },
    error: {
        borderColor: 'red'
    }
});
