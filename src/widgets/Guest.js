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

export default function Guest() {

    const dispatch = useDispatch();

    const goToLogin = () => {
        dispatch(guest(false))
    }

    return (
        <View style={styles.container}>
            <Headline text={"kein Zugriff"} />

            <View style={{alignItems: "center", justifyContent: "center", marginBottom: 40, marginTop: 20}}>
                <Ionicons
                    name={"md-close-circle-outline"}
                    size={120}
                    style={{ marginBottom: 0}}
                    color={GWGColors.GWGBLUE}
                    a
                />
            </View>
            <Text style={styles.text}>Diese Funktion kann nur als Nutzer der GWG verwendet werden.</Text>
            <View style={{marginTop: 20}}>
                <Button text={"Anmelden oder Registrieren"} onPress={()=>goToLogin()}/>
            </View>
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
