import React, {useEffect, useRef, useState} from 'react';
import {fetchPosts, postsSelector, logout, resetPassword, changePassword, userSelector} from '@lovecoding-it/dit-core';
import Button from "../components/Button";
import {View, Text, TextInput, Dimensions, StyleSheet} from "react-native";

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import config from "../config/config";
import {GWGColors} from "../config/Colors";
import Headline from "../components/Headline";
import {useDropDown} from "../widgets/DropdownProvider";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";


export default function ResetPasswortScreem({route, navigation}) {

    const screenWidth = Math.round(Dimensions.get('window').width);
    const screenHeight = Math.round(Dimensions.get('window').height);

    const { ref } = useDropDown()

    const dispatch = useDispatch()

    const {user, registerFailed} = useSelector(userSelector)

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');


    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [password2Error, setPassword2Error] = useState(false);

    const emailRef = useRef();
    const passwordRef = useRef();
    const password2Ref = useRef();

    //const token = "df5043fc4a9de77801b7c0798a39ef2a4b84c3c9";
    const { token } = route.params;


    useEffect(() => {

        if(user.newPassword){
            ref.current.alertWithType("success", 'Passwort-Änderung','Ihr Passwort wurde erfolgreich geändert.', null, 1500);
            setPassword('');
            setPassword2('');
            navigation.goBack();
        }


    }, [user.newPassword]);



    const checkEmail = (setfocus) => {
        var re = config.emailRegex;
        if(!re.test(email)) {
            /*ref.current.alertWithType("error",
                i18n.t('LoginScreen-ErrorMailHeadline', {defaultValue:i18n.t('LoginScreen-ErrorHeadlineDefault')}),
                i18n.t('LoginScreen-ErrorMailMessage', {defaultValue:i18n.t('LoginScreen-ErrorHeadlineDefault')}),1500);*/
            //this.dropdown.alertWithType('error', 'Error', 'Alert shows inside ;(')
            setEmailError(true);
            emailRef.current.focus()
            return false;
        } else {
            if(setfocus) {
                passwordRef.current.focus()
            }
            setEmailError(false);
            return true;
        }
        setEmailError(true);
        return false;
    }

    const checkPassword = (setfocus) => {
        if(password == ""){
            /*ref.current.alertWithType("error",
                'Passwort',
                'Bitte überprüfen Sie Ihr Passwort',null,1500);*/
            setPasswordError(true);
            return false;
        }
        else {
            setPasswordError(false);
            return true;
        }
    }

    const checkPassword2 = (setfocus) => {

        if(password2 == ""){
            /*ref.current.alertWithType("error",
                'Passwort',
                'Bitte überprüfen Sie Ihr Passwort-Wiederholung',null,1500);*/
            setPassword2Error(true);
            return false;
        }
        else {
            setPassword2Error(false);
            return true;
        }

        if(password == password2) {
            setPasswordError(false);
            setPassword2Error(false);
            return true;
        }
        else {
            /* ref.current.alertWithType("error",
                 'Passwort',
                 'Bitte überprüfen Sie Ihre Passwörter',null,1500);*/
            //this.dropdown.alertWithType('error', 'Error', 'Alert shows inside ;(')

            password2Ref.current.focus()
            setPasswordError(true);
            setPassword2Error(true);
            return false;
        }
    }

    const doPasswordSet = () => {
        //dispatch(logout());
    }
    const doPasswordReset = () => {

        let status = true;
        if(!checkEmail()){
            status = false;
        }

        if(status){
            dispatch(resetPassword(email));
            ref.current.alertWithType("success", 'Passwort-Änderung','Eine E-Mail mit Ihrem Link zur Passwort-Änderung wurde versendet.', null, 1500);
            setEmail('');
        }
        else {
            ref.current.alertWithType("error", "Fehler", "Bitte überprüfen Sie Ihre Daten", null, 2500);
        }
    }

    const doReset = () => {
        let status = true;
        if(!checkPassword()){
            status =  false;
        }

        if(!checkPassword2()){
            status =  false;
        }

        if(!status){
            ref.current.alertWithType("error", "Fehler", "Bitte überprüfen Sie Ihre Daten", null, 2500);
        }
        else {
            dispatch(changePassword(password,token ));
        }
    }



    return (
        <KeyboardAwareScrollView extraScrollHeight={100} style={[{width: screenWidth, backgroundColor: '#ffffff', padding: 30}]}>

            {token == null ?
                <View>
                    <Headline text={"Passwort zurücksetzen"} />
                    <Text style={styles.text}>
                        Wenn Sie Ihr Passwort vergessen haben, können Sie es hier zurücksetzen. Geben Sie bitte Ihre registrierte E-Mail Adresse ein und drücken Sie "Passwort zurücksetzen". Danach wird Ihnen eine E-Mail mit einem Link zugesandt. Mit diesem Link können Sie ein neues Passwort für unsere App vergeben.
                    </Text>
                    <Text style={[styles.text,{marginTop: 20}]}>
                        Falls Sie keine E-Mail erhalten haben, schauen Sie bitte auch in Ihrem Spam-Ordner nach. </Text>
                    <View style={styles.emailWrapper}>
                        <Text>E-Mail</Text>
                        <TextInput
                            ref={emailRef}
                            value={email}
                            onChangeText={(value)=>setEmail(value)}
                            onSubmitEditing={() => checkEmail(true)}
                            autoCompleteType={"email"}
                            returnKeyType={'next'}
                            keyboardType={"email-address"}
                            autoCapitalize = 'none'
                            textContentType= 'emailAddress'
                            autoCorrect={false}
                            placeholder={'z.B. ihreMail@ihreDomain.de'}
                            style={[styles.input, {borderColor: emailError ? 'red': GWGColors.InputBorderColor,}]}
                        />
                    </View>
                    <Button onPress={() => doPasswordReset()} text={"Passwort zurücksetzen"}/>
                </View>
                :
                <>
                    <Text style={styles.text}>
                        Bitte vergeben Sie Ihr neues Passwort ein.
                    </Text>
                    <View style={styles.emailWrapper}>
                        <Text>Passwort</Text>
                        <TextInput

                            ref={passwordRef}
                            value={password}
                            onChangeText={(value)=>setPassword(value)}
                            osnSubmitEditing={() => checkEmail(true)}
                            onSubmitEditing={() => password2Ref.current.focus()}
                            returnKeyType={'next'}
                            autoCapitalize = 'none'
                            secureTextEntry={true}
                            textContentType= 'oneTimeCode'
                            autoCorrect={false}
                            placeholder={''}
                            style={[styles.input, {borderColor: passwordError ? 'red': GWGColors.InputBorderColor,}]}
                        />
                    </View>
                    <View style={styles.passwordWrapper}>
                        <Text>Passwort wiederholen</Text>
                        <TextInput

                            ref={password2Ref}
                            value={password2}
                            returnKeyType={'done'}
                            secureTextEntry={true}
                            autoCapitalize = 'none'
                            textContentType= 'oneTimeCode'
                            autoCorrect={false}
                            placeholder={''}
                            osnSubmitEditing={() => checkPassword2(true)}
                            onChangeText={(value)=>setPassword2(value)}
                            placeholderTextColor = 'grey'
                            style={[styles.input, {borderColor: password2Error ? 'red': GWGColors.InputBorderColor,}]}
                        />
                    </View>
                    <View>
                        <Text>{token}</Text>
                    </View>
                    <Button onPress={() => doReset()} text={"Passwort zurücksetzen"}/>
                </>
            }
        </KeyboardAwareScrollView>
    );
}


const styles = StyleSheet.create({


    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
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
    },
    emailWrapper: {marginTop: 20},
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
        textDecorationLine: 'underline'
    },
    input: {
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 0,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginBottom: 22,
        marginTop: 6,
        fontSize: 20
    },
    text: {
        fontSize: 18,
        color: GWGColors.TEXT
    }


})