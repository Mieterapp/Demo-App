import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image} from "react-native";
//import {useTheme} from "../themes/ThemeProvider";
import GWGColors from "../config/Colors";

export default function Logo(props) {
    //const {theme} = useTheme();
    const width = props.width ?? 200;
    const height = width;
    const radius = width/2;

    return (
        <>
            <View style={[styles.logoWrapper, {width: width, height: height, borderRadius: radius}]}>
                <Image source={require('../../assets/white.png')} style={{width: 120,marginLeft: 10,  resizeMode: 'contain', }} />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    logoWrapper: {
        borderColor: 'transparent',
        borderWidth: StyleSheet.hairlineWidth,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        marginTop: 11,
        color: '#B8B8B8',
        fontSize: 20
    }
});