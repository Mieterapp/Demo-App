import React, {useEffect, useRef, useState} from 'react';
import {
    Linking,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    Text,
    useWindowDimensions,
    Dimensions
} from "react-native";
import {useDispatch, useSelector} from 'react-redux';


import {guest} from '@lovecoding-it/dit-core';

import Headline from "../components/Headline";
import Button from "../components/Button";
import {GWGColors} from "../config/Colors";
import {Ionicons} from "@expo/vector-icons";

export default function Error() {

    const dispatch = useDispatch();
    const screenHeight = Math.round(Dimensions.get('window').height);
    const goToLogin = () => {
        dispatch(guest(false))
    }

    return (
        <View style={[styles.container,{height: screenHeight}]}>
            <View style={{marginBottom: 60}}>
            <Headline text={"Ups, es gab einen kleinen Fehler!"} />
            </View>
            <View style={{alignItems: "center", justifyContent: "center", marginBottom: 40, marginTop: 20}}>
                <Ionicons
                    name={"ios-bug"}
                    size={120}
                    style={{ marginBottom: 0}}
                    color={'red'}
                    a
                />
            </View>
            <Text style={styles.text}>Leider gab es einen Fehler beim Abruf der Daten, bitte versuche es später noch einmal.</Text>
            {/*<View style={{marginTop: 20}}>
                <Button text={"Anmelden oder Registrieren"} onPress={()=>goToLogin()}/>
            </View>*/}
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
    },
    emailWrapper: {},
    passwordWrapper: {},
    buttonWrapper: {
        marginTop:20,
        paddingHorizontal: 10,
    },
    text: {
        color: GWGColors.TEXT,
        fontSize: 18,
        padding: 10
    }
});
