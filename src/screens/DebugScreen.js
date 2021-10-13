import React, {useEffect, useRef, useState} from 'react';
import {fetchPosts, postsSelector, logout,userSelector} from '@lovecoding-it/dit-core';
import {StyleSheet, View} from "react-native";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import WebView from "react-native-webview";
import Guest from "../widgets/Guest";


export default function DebugScreen({navigation}) {

    const dispatch = useDispatch()
    const {user} = useSelector(userSelector);
    const doLogout = () => {
        dispatch(logout());
    }

    return (
        <>

                <View style={[styles.container, {padding: 10}]}>

                </View>

        </>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }
});