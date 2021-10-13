import React, {useEffect, useRef, useState} from 'react';
import {
    Linking,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    Text,
    useWindowDimensions,
    Dimensions, KeyboardAvoidingView
} from "react-native";

import {useTheme} from "../themes/ThemeProvider";
import {useNavigation } from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';

import {DropdownProvider, useDropDown} from './DropdownProvider';

import {login,logout,loginFailed, guest} from '@lovecoding-it/dit-core';

import config from '../config/config';

import Button from "../components/Button";
import {useTranslation} from "../locales/localProvider";
import {GWGColors} from "../config/Colors";
//import Button from 'apsl-react-native-button'

export default function LoginForm() {

    const {i18n} = useTranslation();

    const navigation = useNavigation();
    const {theme} = useTheme();
    const dispatch = useDispatch();

    const window = useWindowDimensions();
    const screenWidth = Math.round(Dimensions.get('window').width);
    const screenHeight = Math.round(Dimensions.get('window').height);

    const { user } = useSelector(state => state.user)

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const emailRef = useRef();
    const passwordRef = useRef();

    const publishEmail = (email) => {
        setEmail(email);
    }

    const { ref } = useDropDown()

// eg in use effect

    useEffect(() => {
        //setEmail('florian.stopienski@dit-digital.de')
        //setEmail('fst@lovecoding.it')
        //setEmail('mail@stopienski.de')
        //setEmail('f_stop@gmx.de')
        //setPassword('123')
        //setPassword('334s')
    },[]);

    useEffect(() => {

        //console.log(user,)
        if(user.data === null){
            if(user.failed === true & user.failedType !== null){
                ref.current.alertWithType("error",
                    i18n.t('LoginScreen-ErrorHeadline'+user.failedType, {defaultValue:i18n.t('LoginScreen-ErrorHeadlineDefault')}),
                    i18n.t('LoginScreen-ErrorMessage'+user.failedType,  {defaultValue:i18n.t('LoginScreen-ErrorMessageDefault')}) + " (Fehler: " + user.failedType+")",null,1200);
            }
        }

    }, [user]);

    const checkEmail = (setfocus) => {
        var re = config.emailRegex;
        if(!re.test(email)) {
            console.log('fehler email');
            ref.current.alertWithType("error",
                i18n.t('LoginScreen-ErrorMailHeadline', {defaultValue:i18n.t('LoginScreen-ErrorHeadlineDefault')}),
                i18n.t('LoginScreen-ErrorMailMessage', {defaultValue:i18n.t('LoginScreen-ErrorHeadlineDefault')}),null,1200);

            emailRef.current.focus()
            return false;
        } else {
            if(setfocus) {
                passwordRef.current.focus()
            }
            return true;
        }
        return false;
    }

    const checkPassword = (login = false) => {
        //doLogin();
        /*
        var re = config.passwordRegex;
        if(!re.test(password)) {
            setModalMessageMutation({ variables: {
                    show: true,
                    title: i18n.t('LoginScreen-PasswordErrorTitle'),
                    message: i18n.t('LoginScreen-PasswordErrorMessage'),
                    button: i18n.t('Button-ok'),
                    data: {},
                    target: '',
                    function: '',
                }})
                .then(result => {})
                .catch(error => {})

            passwordRef.current.focus()
        } else {
            if(login) {
                doLogin();
            }
        }
        */
    }

    const forgotPassword = () => {
    }

    const doLogin = () => {
        if(checkEmail()){
            if(!email || !password) {
                console.log('llllllooog');
                ref.current.alertWithType("error", "Fehler Login .", "Bitte überprüfen Sie Ihre Zugangsdaten",null,1200);
            } else {
                dispatch(login({username: email, password: password}));
                //ref.current.alertWithType("success", "Login erfolgreich.", "");
            }
        }
    }


    const doGuest = () => {
        dispatch(guest());
    }

    const openRegister = () => {
        navigation.navigate('Register');
    }

    const openPasswordReset = () => {
        navigation.navigate('PasswordReset', {token: null});
        //navigation.navigate('PasswordReset');
    }

    const mapDispatchToProps = {
        loginFailed
    };

    const mapStateToProps = (state) => {
        return {
            user: state.user,
            failed: state.failed,
            failedType: state.failedType
        };
    };

    return (

        <View style={[styles.container, {width: screenWidth-40}]}>

            <View style={styles.emailWrapper}>

                <Text style={styles.text}>{i18n.t('LoginScreen-EmailLabel')}</Text>
                <TextInput
                    ref={emailRef}
                    value={email}
                    autoCompleteType={"email"}
                    returnKeyType={'next'}
                    onChangeText={publishEmail}
                    onSubmitEditing={() => checkEmail(true)}
                    keyboardType={"email-address"}
                    autoCapitalize = 'none'
                    textContentType= 'emailAddress'
                    autoCorrect={false}
                    placeholder={i18n.t('LoginScreen-EmailPlaceholder')}
                    placeholderTextColor = 'grey'
                    style={[styles.input, {}]}
                />
            </View>
            <View style={styles.passwordWrapper}>
                <Text style={styles.text}>{i18n.t('LoginScreen-PasswordLabel')}</Text>
                <TextInput
                    ref={passwordRef}
                    value={password}
                    autoCompleteType={"email"}
                    onChangeText={setPassword}
                    returnKeyType={'done'}
                    secureTextEntry={true}
                    autoCapitalize = 'none'
                    textContentType= 'oneTimeCode'
                    autoCorrect={false}
                    placeholder={i18n.t('LoginScreen-PasswordPlaceholder')}
                    onSubmitEditing={() => {checkPassword(true)}}
                    placeholderTextColor = 'grey'
                    style={[styles.input, {}]}
                />
            </View>

            <View style={styles.buttonWrapper}>
                <Button
                    type={'primary'}
                    onPress={() => doLogin()}
                    text={i18n.t('LoginScreen-ButtonLogin')}
                />
            </View>
            <View style={styles.buttonWrapper}>
                <Button
                    type={'primary'}
                    onPress={() => openRegister()}
                    text={i18n.t('LoginScreen-ButtonRegister')}
                />
            </View>

            <View style={styles.forgotPasswordWrapper}>
                <TouchableOpacity onPress={() => openPasswordReset()}>
                    <Text styles={styles.text}>{i18n.t('LoginScreen-ForgotPasswordText')}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.forgotPasswordWrapper}>
                <TouchableOpacity onPress={() => doGuest()}>
                    <Text styles={styles.text}>{i18n.t('LoginScreen-WithoutUserText')}</Text>
                </TouchableOpacity>
            </View>

        </View>

    );
};

const styles = StyleSheet.create({
    container: {
    },
    emailWrapper: {},
    passwordWrapper: {},
    buttonWrapper: {
        marginTop:20,
        paddingHorizontal: 10,
    },
    forgotPasswordWrapper: {
        marginTop: 35,
        alignItems: 'center',
    },
    forgotPasswordText: {
        textDecorationLine: 'underline',

    },
    text: {
        color: GWGColors.TEXT,
        fontSize: 18
    },
    input: {
        borderWidth: 1,
        borderRadius: 0,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginBottom: 22,
        marginTop: 6,
        fontSize: 20,
        borderColor: GWGColors.InputBorderColor,
        zIndex: 30, // works on ios
        //elevation: 30, // works on android
        color: GWGColors.TEXT,
        backgroundColor: '#ffffff'

    },
    input1: {
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 6,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginBottom: 22,
        marginTop: 6,
        fontSize: 20,

    }
});