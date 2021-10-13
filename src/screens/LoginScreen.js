import React, {useEffect} from 'react'
//import {useDispatch, useSelector} from 'react-redux'
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    ImageBackground,
    Dimensions,
    useWindowDimensions,
    KeyboardAvoidingView
} from 'react-native'
import {useDispatch, useSelector, fetchPosts, postsSelector, logout} from '@lovecoding-it/dit-core';

import {useTranslation} from "../locales/localProvider";

import Logo from '../components/Logo';
import Headline from "../components/Headline";
import LoginForm from "../widgets/LoginForm";

import Button from "../components/Button";
import {isAuthenticated} from '@lovecoding-it/dit-core';
import * as SecureStore from "expo-secure-store";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";


function LoginScreen() {
    const { user } = useSelector(state => state.user)
    const dispatch = useDispatch();

    const window = useWindowDimensions();
    const screenWidth = Math.round(Dimensions.get('window').width);
    const screenHeight = Math.round(Dimensions.get('window').height);

    const {i18n} = useTranslation();

    useEffect(() => {
        (async () => {
            await SecureStore.deleteItemAsync('secure_token');

        })();
    },[]);

    dispatch(isAuthenticated());

    const doLogout = () => {
        dispatch(logout());
    }

    useEffect(() => {
    }, [user]);

    if (user.data) {
        return (
            <></>
        )
    }

    return (

            <KeyboardAwareScrollView extraScrollHeight={150} style={{backgroundColor: '#ffffff'}} behavior={"position"}>
                <View style={[styles.container, {width: screenWidth}]}>
                <Headline text={i18n.t('LoginScreen-LoginHeadline')}/>
                <View>
                    <LoginForm />
                </View>
                </View>
            </KeyboardAwareScrollView>


    )
}

const styles = StyleSheet.create({


    container: {
        flex: 1,

        backgroundColor: '#ffffff',

        padding: 20

    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center"
    },
    horizontal: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
    }


})

export default LoginScreen
