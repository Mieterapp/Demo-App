import React, {useEffect, useRef, useState, useCallback} from 'react';

//import Button from "../components/Button";
import { View, ScrollView, KeyboardAvoidingView, TextInput, StyleSheet, Text, Platform, TouchableWithoutFeedback, Button, Keyboard , FlatList, Dimensions} from "react-native";
import HTMLView from 'react-native-htmlview';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import WebView from "react-native-webview";
import { GiftedChat} from 'react-native-gifted-chat'

import {GWGColors} from "../config/Colors";
import LoadingScreen from "./LoadingScreen";
import Headline from "../components/Headline";
import {fetchPages, pagesSelector} from '@lovecoding-it/dit-core';

export default function LegalScreen({route, navigation}) {

    const dispatch = useDispatch();

    const { type } = route.params;


    const [htmlContent, setHtmlContent] = useState('');

    const screenWidth = Math.round(Dimensions.get('window').width);
    const screenHeight = Math.round(Dimensions.get('window').height);
    const {pages, loadingPages, hasErrorsPages} = useSelector(pagesSelector)


    useEffect(() => {
        dispatch(fetchPages())
    }, [])


    useEffect(() => {
        console.log(pages)
        if(pages != null){
            if(type=="dataprotect") {
                setHtmlContent(pages['2'].html_content ?? '--');
            }
            if(type=="imprint") {
                setHtmlContent(pages['1'].html_content ?? '--');
            }
        }

    }, [pages])



    return (
        <>
        {loadingPages ?
            <LoadingScreen />
        :
            <ScrollView style={styles.container}>

                <View style={{height: 60, padding: 10, marginBottom: 20}}>
                    <Headline style={{height: 70}} text={type == "imprint" ? "Impressum": "Datenschutz"}/>
                </View>
                <View style={{margin: 30}}>
                    <HTMLView
                        value={htmlContent}
                        stylesheet={htmlSyles}
                    />
                </View>
            </ScrollView>
        }

        </>

    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        flexDirection: 'column',
        //padding: 10
    },
    inner: {
        padding: 24,
        flex: 1,
        justifyContent: "space-around"
    },
    header: {
        fontSize: 36,
        marginBottom: 48
    },
    textInput: {
        height: 40,
        borderColor: "#000000",
        borderBottomWidth: 1,
        marginBottom: 36
    },
    btnContainer: {
        backgroundColor: "white",
        marginTop: 12
    }

});

const htmlSyles = StyleSheet.create({
    a: {
        fontWeight: '300',
        color: GWGColors.GWGBLUE, // make links coloured pink
    },
    b: {
        fontWeight: '800',
        color: '#dd0303',
        display: 'flex',
        flexDirection: 'row'
    },
    p:{
        fontSize: 18,
        color: GWGColors.HeadlineTextColor,
        textAlign: "left"
    }
});