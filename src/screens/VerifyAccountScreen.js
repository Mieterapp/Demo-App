import React, {useEffect, useRef, useState} from 'react';
import {verifyUser, userSelector} from '@lovecoding-it/dit-core';
import Button from "../components/Button";
import {View, Text, TextInput, Dimensions, StyleSheet} from "react-native";

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import Headline from "../components/Headline";
import {GWGColors} from "../config/Colors";
import LoadingScreen from "./LoadingScreen";
import {useNavigation} from "@react-navigation/native";


export default function VerifyAccountScreen({route}) {

    const navigation = useNavigation();

    const screenWidth = Math.round(Dimensions.get('window').width);
    const screenHeight = Math.round(Dimensions.get('window').height);

    const {user} = useSelector(userSelector);
    //  userVerifiedLoading: true,
    //             userVerified:null

    const dispatch = useDispatch()
    const { token } = route.params;
    //const token = "06eac29b51bc1fb7649af2650d64dd3f873949d2";


    useEffect(() => {
        if(token){
            dispatch(verifyUser(token));
        }
    }, [dispatch])

    const goToLogin = () => {
        navigation.navigate("Login");
    }

    return (
        <View style={[{width: screenWidth, height: screenHeight, backgroundColor: '#ffffff', padding: 30}]}>

            {token == null ?
                <View >
                    <View>
                        <Headline text={"Account nicht verifiziert"} />
                        <View style={{flex: 0}}>
                            <Text style={styles.text}>Leider konnte Ihr Account nicht verifiziert werden! (kein Token)</Text>
                        </View>


                    </View>
                    <View style={{marginTop: 150}}>
                        <Button onPress={() => goToLogin()} text={"zum Start"}/>
                    </View>
                </View>

                :
                <>
                    {user.userVerifiedLoading ?
                        <LoadingScreen />
                        :
                        <>
                            {user.userVerified == false ?
                                <View>
                                    <View>
                                        <Headline text={"Account nicht verifiziert"} />
                                        <View><Text style={styles.text}>Leider konnte Ihr Account nicht verifiziert werden! {token}</Text></View>

                                    </View>
                                    <View style={{marginTop: 150}}>
                                        <Button onPress={() => goToLogin()} text={"zum Start"}/>
                                    </View>
                                </View>
                                :
                                <View>
                                    <View>
                                        <Headline text={"Account verifiziert"} />
                                        <View><Text style={styles.text}>Ihr Account wurde erfolgreich verifiziert. Bitte melden Sie sich mit Ihren Daten in der Demo-App an.</Text></View>

                                    </View>
                                    <View style={{marginTop: 150}}>
                                        <Button onPress={() => goToLogin()} text={"zum Login"}/>
                                    </View>
                                </View>
                            }
                        </>
                    }
                </>
            }
        </View>
    );
}

const styles = StyleSheet.create({


    container: {
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20

    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center"
    },
    text: {
        fontSize: 18,
        color: GWGColors.TEXT
    }
})