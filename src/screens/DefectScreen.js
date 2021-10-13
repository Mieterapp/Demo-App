import React, {useEffect, useRef, useState} from 'react';
import {fetchPosts, postsSelector, logout,userSelector} from '@lovecoding-it/dit-core';
import {StyleSheet, View, Linking} from "react-native";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import WebView from "react-native-webview";
import Guest from "../widgets/Guest";
import Button from "../components/Button";


export default function DefectScreen({navigation}) {

    const dispatch = useDispatch()
    const {user} = useSelector(userSelector);
    const doLogout = () => {
        dispatch(logout());
    }

    const damagePortalUrl = "https://www.google.de/";

    return (
        <View style={{margin: 0, flex: 1, backgroundColor: '#FFF', justifyContent: 'center'}}>
            {user.guest ?

                <View style={[styles.container, {padding: 10}]}>
                    <Guest/>
                </View>
                :
                <View style={{margin: 30}}>
                    <Button onPress={ ()=>{ Linking.openURL(damagePortalUrl)}} text={"Schadensmeldung erfassen"}/>
                </View>
            }
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }
});