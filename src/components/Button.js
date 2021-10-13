import React from 'react';
import {Image, StyleSheet, View, ActivityIndicator} from "react-native";

import {useTheme} from "../themes/ThemeProvider";

import Text from './Text';
import Touchable from "./Touchable";
import {GWGColors} from "../config/Colors";

export default function Button(props) {
    const {theme} = useTheme();

    var shadow = true;

    if(typeof props.shadow != "undefined" && props.shadow === false) {
        shadow = false;
    }

    shadow = false;

    return (
        <View>
            {shadow &&
            <View style={[styles.absolute, (props.type == "warning" ? styles.warning: ''), {alignItems: 'center', justifyContent: 'flex-start'}]}>
                <Image source={require('../../assets/light-shadow.png')}/>
            </View>
            }
            <Touchable disabled={props.disabled ?? false} onPress={() => props.onPress()} activeOpacity={0.6}>
                <View style={[styles.button, props.buttonStyle, (props.type == "warning" ? styles.warning: ''), (props.disabled ? styles.buttonDisabled:''), { zIndex: 10 }]}>
                    {props.activity ?
                        <ActivityIndicator />
                        :
                        <Text style={[styles.buttonText, props.textStyle, {}]}>{props.text}</Text>
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
        paddingVertical: 16,
        borderRadius: 25,
        marginBottom: 20,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'transparent',
        backgroundColor: GWGColors.BUTTONCOLOR

    },
    buttonDisabled : {
        backgroundColor: GWGColors.LIGHTERGREY
    },
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 9,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'transparent'
    },
    primary: {
        /*
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,

        elevation: 0,
        */
    },
    warning: {
        backgroundColor: 'red'
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '500',
        color: GWGColors.BUTTONTEXTCOLOR
    },
    primaryText: {
        paddingHorizontal: 35
    }
});
