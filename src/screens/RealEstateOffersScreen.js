import React, {useEffect, useRef, useState} from 'react';
import {fetchPosts, postsSelector, logout} from '@lovecoding-it/dit-core';
import Button from "../components/Button";
import {ActivityIndicator, Dimensions, View} from "react-native";

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import WebView from "react-native-webview";
import {GWGColors} from "../config/Colors";
import Headline from "../components/Headline";


export default function RealsEstateOffersScreen({navigation}) {
    const screenWidth = Math.round(Dimensions.get('window').width);
    const dispatch = useDispatch()

    const doLogout = () => {
        dispatch(logout());
    }

    return (
        <WebView  renderLoading={() => {return (<View style={{backgroundColor:'transparent', position: 'absolute', top: 10, width: screenWidth}}><ActivityIndicator color={GWGColors.GWGBLUE} size='large' /></View>)}}
                  startInLoadingState={true}   source={{uri: "https://datasec.de"}}/>


    );
}