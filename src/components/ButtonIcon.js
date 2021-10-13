import React from 'react';
import {Image, StyleSheet, View} from "react-native";

import {useTheme} from "../themes/ThemeProvider";

import Text from './Text';
import Touchable from "./Touchable";
import {GWGColors} from "../config/Colors";
import {Ionicons} from "@expo/vector-icons";

export default function ButtonIcon(props) {
    const {theme} = useTheme();

    var type = "";

    if(typeof props.type != "undefined") {
        type = props.type;
    }

    return (
        <View style={[props.containerStyles,{borderColor: type == "inverted" ? "#ffffff": GWGColors.BUTTONCOLOR, borderWidth:2, borderStyle: 'solid', borderRadius:30,  width: 45, height: 45, alignItems: 'center', justifyContent: 'center', backgroundColor: type == "inverted" ? "#ffffff": GWGColors.BUTTONCOLOR}]}>
            <Ionicons
                name={props.icon}
                size={props.iconSize ?? 25}
                onPress={() => props.onPress()}
                color={type == "inverted" ? GWGColors.BUTTONCOLOR : "#ffffff"}
            />
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
        borderColor: 'transparent'

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
    buttonText: {
        fontSize: 18,
        fontWeight: '500'
    },
    primaryText: {
        paddingHorizontal: 35
    }
});
