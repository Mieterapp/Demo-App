import React, {useEffect, useRef, useState} from 'react'
//import {useDispatch, useSelector} from 'react-redux'
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    ImageBackground,
    Dimensions,
    useWindowDimensions,
    TextInput, TouchableOpacity, KeyboardAvoidingView
} from 'react-native';


import Headline from "../components/Headline";
import Button from "../components/Button";
import {useNavigation} from "@react-navigation/native";
import {DropdownProvider, useDropDown} from '../widgets/DropdownProvider';
import config from "../config/config";
import {useTranslation} from "../locales/localProvider";
import {registerUser, userSelector} from '@lovecoding-it/dit-core';
import {useDispatch, useSelector} from "react-redux";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {TextInputMask} from "react-native-masked-text";
import {GWGColors} from "../config/Colors";
import Checkbox from "../components/Checkbox";
import Touchable from "../components/Touchable";
import TextInputError from "../components/TextInputError";

function RegisterScreen() {

    const dispatch = useDispatch();

    const navigation = useNavigation();
    const window = useWindowDimensions();
    const screenWidth = Math.round(Dimensions.get('window').width);
    const screenHeight = Math.round(Dimensions.get('window').height);
    const {i18n} = useTranslation();

    const {user, registerFailed} = useSelector(userSelector)

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [contract, setContract] = useState('');
    const [birthdate, setBirthdate] = useState('');

    const [principalId, setPrincipalId]  = useState('');

    const [dataprotection, setDataprotection] = useState(false);


    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [password2Error, setPassword2Error] = useState(false);
    const [contractError, setContractError] = useState(false);
    const [birthdateError, setBirthdateError] = useState(false);
    const [dataprotectionError, setDataprotectionError] = useState(false);
    const [principalIdError, setPrincipalIdError]  = useState(false);




    const [regStatus, setRegStaus] = useState(false);

    const emailRef = useRef();
    const passwordRef = useRef();
    const password2Ref = useRef();
    const contractRef = useRef();
    const birthdateRef = useRef();
    const principalIdRef = useRef();


    const { ref } = useDropDown()

    const checkContract = (setfocus) => {
        if(contract == ""){
          /*  ref.current.alertWithType("error",
                'Vertragsnummer',
                'Bitte überprüfen Sie Ihre Eingaben',null,1500);*/
            setContractError(true);
            return false;
        }
        else {
            setContractError(false);
            return true;
        }
    }

    const checkPrincipalId= (setfocus) => {
        if(principalId == ""){
            setPrincipalIdError(true);
            return false;
        }
        else {
            setPrincipalIdError(false);
            return true;
        }
    }

    /*const checkBirthday = (setfocus) => {
        if(birthdate == ""){
            setBirthdateError(true);
            return false;
        }
        else {
            setBirthdateError(false);
            return true;
        }
    }*/

    const checkDatenprotection = () => {
        if(!dataprotection) {
            setDataprotectionError(true);
            return false;
        }
        setDataprotectionError(false);
        return true;
    }

    const checkEmail = (setfocus) => {
        var re = config.emailRegex;
        if(!re.test(email)) {
            /*ref.current.alertWithType("error",
                i18n.t('LoginScreen-ErrorMailHeadline', {defaultValue:i18n.t('LoginScreen-ErrorHeadlineDefault')}),
                i18n.t('LoginScreen-ErrorMailMessage', {defaultValue:i18n.t('LoginScreen-ErrorHeadlineDefault')}),1500);*/
            //this.dropdown.alertWithType('error', 'Error', 'Alert shows inside ;(')
            setEmailError(true);
            //emailRef.current.focus()
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
        console.log(password, password2)

        if(password2 == ""){
            /*ref.current.alertWithType("error",
                'Passwort',
                'Bitte überprüfen Sie Ihr Passwort-Wiederholung',null,1500);*/
            setPassword2Error(true);
            return false;
        }
        else {


            if(password == password2) {
                //setPasswordError(false);
                setPassword2Error(false);
                return true;
            }
            else {
                /* ref.current.alertWithType("error",
                     'Passwort',
                     'Bitte überprüfen Sie Ihre Passwörter',null,1500);*/
                //this.dropdown.alertWithType('error', 'Error', 'Alert shows inside ;(')

                //password2Ref.current.focus()
                //setPasswordError(true);
                setPassword2Error(true);
                return false;
            }

            setPassword2Error(false);
            return true;
        }


    }

    const checkPasswordOld = (login = false) => {
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
    const setDataprotectionCheck = () => {
        if(dataprotection){
            setDataprotection(false)
        }
        else {
            setDataprotection(true)
        }
    }

    const doRegister = () => {
        setRegStaus(true);
        var status = true;

        if(!checkContract()){
            status =  false;
        }

        if(!checkPrincipalId()){
            status =  false;
        }

        /*if(!checkBirthday()){
            status =  false;
        }*/

        if(!checkEmail()){
            status =  false;
        }

        if(!checkPassword()){
            status =  false;
        }

        if(!checkPassword2()){
            status =  false;
        }

        if(!checkDatenprotection()){
            status = false;
        }

        if(!status){

            ref.current.alertWithType("error", "Fehler Registrierung", "Bitte überprüfen Sie Ihre Daten", null, 2500);
            /*if(!email || !password) {
                console.log('llllllooog');

            } else {

                //convert birthdate

                var dateParts = birthdate.split(".");
                var date = new Date(Date.UTC(dateParts[2], (dateParts[1] - 1), dateParts[0]));

                if(date.toISOString().substring(0, 10)!= undefined){
                    dispatch(registerUser({email: email, password: password, contract: contract, birthdate: date.toISOString().substring(0, 10)}));
                }


                //ref.current.alertWithType("success", "Login erfolgreich.", "");
            }*/
        }
        else {

            dispatch(registerUser({ email: email, password: password, contract: contract, principal_id: principalId, is_data_accepted: dataprotection }));

            //var dateParts = birthdate.split(".");
            //var date = new Date(Date.UTC(dateParts[2], (dateParts[1] - 1), dateParts[0]));

            /*if(date.toISOString().substring(0, 10)!= undefined){
                setRegStaus(true);
                dispatch(registerUser({email: email, password: password, contract: contract, birthdate: date.toISOString().substring(0, 10)}));

            }*/

        }
    }

    useEffect(() => {
        setRegStaus(false);
    },[]);

    useEffect(() => {

        console.log(user);
        if(user.register){
            if(user.register.data == null){
                if(user.failed === true & user.failedType !== null){
                    setRegStaus(false);
                    ref.current.alertWithType("error",
                        i18n.t('LoginScreen-ErrorHeadline'+user.failedType, {defaultValue:i18n.t('LoginScreen-ErrorHeadlineDefault')}),
                        i18n.t('LoginScreen-ErrorMessage'+user.failedType,  {defaultValue:i18n.t('LoginScreen-ErrorMessageDefault')}),1000);
                }
            }
            else {

                if(user.register.failed === false ) {
                    setRegStaus(false);
                    ref.current.alertWithType("success", "Die Registrierung war erfolgreich.", "Bitte prüfen Sie Ihr E-Mail-Postfach ("+email+") um die Registrierung abschliessen zu können.")
                    /*setEmail(null);
                    setPassword(null);
                    setPassword2(null)
                    setContract(null);
                    setPrincipalId(null);
                    setDataprotection(false);*/
                    //setBirthdate(null);
                }

            }
        }


    }, [user.register]);



    return (
        <ScrollView style={[{width: screenWidth, backgroundColor: '#ffffff', paddingBottom: 200}]}>
            <KeyboardAwareScrollView behavior={"position"} >
            <View >

                <Headline text={"Registrierung"} />
                <View style={[styles.container]}>
                    <View style={[styles.container2, {width: screenWidth-40}]}>
                        <View style={styles.emailWrapper}>
                            <Text>Vertragsnummer</Text>
                            <TextInputError show={contractError} text={"Bitte geben Sie eine gültige Vertragsnummer ein."}/>
                            <TextInputMask
                                type={'custom'}
                                options={{
                                    /**
                                     * mask: (String | required | default '')
                                     * the mask pattern
                                     * 9 - accept digit.
                                     * A - accept alpha.
                                     * S - accept alphanumeric.
                                     * * - accept all, EXCEPT white space.
                                     */
                                    mask: '9999.99999.99'
                                }}
                                ref={contractRef}
                                autoCapitalize = 'none'
                                textContentType= 'none'
                                returnKeyType={'next'}
                                keyboardType={"numeric"}
                                autoCorrect={false}

                                placeholder={'z.B. 9999.00001.01'}
                                value={contract}
                                onChangeText={(value)=> {
                                    if(contract != ''){
                                        //checkContract()
                                        setContractError(false)
                                    }
                                    setContract(value);

                                }}
                                onSubmitEditing={() => principalIdRef.current.focus()}
                                style={[styles.input, {borderColor: contractError ? 'red': GWGColors.InputBorderColor, }]}
                            />

                        </View>

                        <View style={styles.emailWrapper}>
                            <Text>Registrierungscode</Text>
                            <TextInputError show={principalIdError} text={"Bitte geben Sie einen gültigen Registrierungscode ein."}/>
                            <TextInputMask
                                type={'custom'}
                                options={{
                                    /**
                                     * mask: (String | required | default '')
                                     * the mask pattern
                                     * 9 - accept digit.
                                     * A - accept alpha.
                                     * S - accept alphanumeric.
                                     * * - accept all, EXCEPT white space.
                                     */
                                    mask: '9999999999'
                                }}
                                ref={principalIdRef}
                                autoCapitalize = 'none'
                                textContentType= 'none'
                                returnKeyType={'next'}
                                keyboardType={"numeric"}
                                autoCorrect={false}

                                placeholder={'z.B. 0001001245'}
                                value={principalId}
                                onChangeText={(value)=>{
                                    if(principalId != ''){
                                        //checkPrincipalId()
                                        setPrincipalIdError(false);
                                    }
                                    setPrincipalId(value)
                                }}
                                onSubmitEditing={() => emailRef.current.focus()}
                                style={[styles.input, {borderColor: principalIdError ? 'red': GWGColors.InputBorderColor, }]}
                            />
                        </View>
                        {/*<View style={styles.emailWrapper}>
                            <Text>Geburtsdatum</Text>

                            <TextInputMask
                                type={'datetime'}
                                options={{
                                    format: 'DD.MM.YYYY'
                                }}
                                ref={birthdateRef}
                                autoCapitalize = 'none'
                                textContentType= 'none'
                                returnKeyType={'next'}
                                autoCorrect={false}
                                placeholder={'z.B. 01.01.1974'}
                                value={birthdate}
                                onChangeText={(value)=>setBirthdate(value)}
                                onSubmitEditing={() => emailRef.current.focus()}
                                style={[styles.input, {borderColor: birthdateError ? 'red': GWGColors.InputBorderColor,}]}
                            />
                        </View>*/}
                        <View style={styles.emailWrapper}>
                            <Text>E-Mail</Text>
                            <TextInputError show={emailError} text={"Bitte geben Sie eine gültige E-Mail ein."}/>
                            <TextInput
                                ref={emailRef}
                                value={email}
                                onChangeText={(value)=>{

                                    if(email != ''){
                                       // checkEmail()
                                        setEmailError(false)
                                    }
                                    setEmail(value)
                                }}
                                onSubmitEd2iting={() => checkEmail(true)}
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
                        <View style={styles.emailWrapper}>
                            <Text>Passwort</Text>
                            <TextInputError show={passwordError} text={"Bitte geben Sie ein gültiges Passwort ein."}/>
                            <TextInput

                                ref={passwordRef}
                                value={password}
                                onChangeText={(value)=>{
                                    if(password != ''){
                                        //checkPassword()
                                        setPasswordError(false)
                                    }

                                    setPassword(value)
                                }}
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
                            <TextInputError show={password2Error} text={"Bitte wiederholen Sie Ihr Passwort."}/>
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
                                onChangeText={(value)=>{

                                    setPassword2(value)
                                    if(password2 != ''){
                                        //checkPassword2()
                                        setPassword2Error(false)
                                    }
                                }}
                                placeholderTextColor = 'grey'
                                style={[styles.input, {borderColor: password2Error ? 'red': GWGColors.InputBorderColor,}]}
                            />
                        </View>

                        <View style={{flexDirection: 'row', paddingRight:20}}>
                            <View><Checkbox checked={dataprotection} onPress={()=> {
                                if(dataprotection != ''){
                                    //c
                                    //heckDatenprotection()
                                    setDataprotectionError(false)
                                }

                                setDataprotectionCheck()
                            }} disabled={false} error={dataprotectionError}/></View>
                            <View style={{padding: 10, paddingRight:0, flexWrap:'wrap', flexDirection: 'row', paddingTop:0}}>
                                <Text>Ich habe die </Text>
                                <Touchable onPress={() => navigation.navigate("LegalScreen",{ type: 'dataprotect' })} activeOpacity={0.6}>
                                        <Text style={{color: GWGColors.HeadlineTextColor}}>Datenschutzbestimmungen</Text>
                                </Touchable>
                                <Text>gelesen und stimme diesen zu.</Text>
                                <TextInputError show={dataprotectionError} text={"Bitte akzeptieren Sie den Datenschutz."}/>
                            </View>
                        </View>

                        <View style={styles.buttonWrapper}>
                            <Button
                                type={'primary'}
                                onPress={() => doRegister()}
                                text={"weiter"}
                                disabled={regStatus}
                                activity={regStatus}
                            />
                        </View>

                    </View>
                </View>

            </View>
            </KeyboardAwareScrollView>
        </ScrollView>

    )
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
        textDecorationLine: 'underline'
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
        color: GWGColors.TEXT

    }


})

export default RegisterScreen