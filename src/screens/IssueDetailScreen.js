import React, {useEffect, useRef, useState, Fragment} from 'react';

import {fetchIssues, issuesSelector, createIssueRequest, resetAddIssueStatus, issueRequestedSelector} from '@lovecoding-it/dit-core';
import {fetchContracts, fetchContract, contractsSelector, userSelector} from '@lovecoding-it/dit-core';

import Button from "../components/Button";
import {
    ScrollView,
    View,
    Text,Switch,
    StyleSheet,
    RefreshControl,
    Dimensions, TextInput
} from "react-native";
import Constants from "expo-constants";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import Headline from "../components/Headline";
import {useTranslation} from "../locales/localProvider";
import { Ionicons } from '@expo/vector-icons';
import {useDropDown} from '../widgets/DropdownProvider';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import HTMLView from 'react-native-htmlview';
import {GWGColors} from "../config/Colors";

import { Formik, Field } from 'formik';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import DateTimePicker from '@react-native-community/datetimepicker';
import SelectInput from 'react-native-select-input-ios'

import {Picker} from '@react-native-picker/picker';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default function IssueDetailScreen({route,navigation}) {
    const platfrom = Constants.platform;
    const insets = useSafeAreaInsets();
    const { ref } = useDropDown();

    const { issueId } = route.params;
    const [value2, setValue2] = React.useState('key1');
    const [requiredErrors, setRequiredErrors] = React.useState([]);

    const {i18n} = useTranslation();

    const formikRef = useRef();

    const dispatch = useDispatch();
    const {issues, loading, hasErrors} = useSelector(issuesSelector);
    const {issuesRequested, addIssuesRequestSuccess, addIssuesRequestedHasErrors, resetAddIssueRequestStatus} = useSelector(issueRequestedSelector);
    const {contracts, loading: contractLoading, hasErrors: contractHasErrors, loadingCurrent, hasErrorsCurrent} = useSelector(contractsSelector);
    const [currentIssue, setCurrentIssue] = React.useState({})

    const [buttonStatus, setButtonStatus] = React.useState(false);

    const [refreshing, setRefreshing] = React.useState(false);

    useEffect(() => {
        if(issues.length == 0){
            dispatch(fetchIssues());
        }
        setCurrentIssue(issues[issueId] ?? null);

    }, [dispatch]);

    useEffect(()=>{

        if(addIssuesRequestSuccess && !addIssuesRequestedHasErrors){
            ref.current.alertWithType("success", currentIssue.description_postman ?? 'Erfolgreich','Anliegen "'+ currentIssue.category+'" erfolgreich hinzugefügt', null, 0);
            //dispatch(resetAddIssueStatus())
        }


    },[addIssuesRequestSuccess]);

    useEffect(()=>{
        if(!addIssuesRequestSuccess && addIssuesRequestedHasErrors){
            ref.current.alertWithType("error", "Fehler", 'Anliegen "'+ currentIssue.category+'" konnte nicht angelegt werden!', null, 0);
            dispatch(resetAddIssueStatus())
        }


    },[addIssuesRequestedHasErrors])


    const wait = (timeout) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    };

    const onRefresh = React.useCallback(() => {
        // dispatch(fetchIssues());
        setRefreshing(true);

        wait(2000).then(() => setRefreshing(false));
    }, []);


    const validateRequired = (value) => {
        console.log('validateRequired')
        let error;
        if (!value) {
            error = 'Required';
        }
        return error;
    }

    const requestIssue = (values) => {

        setButtonStatus(false);
        let e = [];

        for (const [key, answer] of Object.entries(currentIssue.answers)) {
            console.log(`${key}: ${answer}`);
            if(answer.required){
                if(!values[answer.id]) {
                    e.push(answer)
                }
            }
        }

        if(e.length > 0){
            console.log('STOP FEHLER')
            setRequiredErrors(e);
            return false;
        }
        setRequiredErrors(e);

        var answers = [];
        for (const [key, value] of Object.entries(values)) {
            answers.push({id: key, answer: value});
        }

        console.log('values',answers);
        console.log(answers);

        const issue = {
            issue: issueId,
            //answers: JSON.stringify(values),
            answers: JSON.stringify(values),
            code: contracts.current.code,
            //answers: values.length > 0 ? values:""
        }


        console.log('ISSUE', JSON.stringify(issue), answers);
        //console.log('valid', isValid);
        /*const v = values.map((item)=>{
            console.log(item);
        });*/


        //return true;
        dispatch(createIssueRequest(issue));
    }

    const backToOverview = () => {
        navigation.goBack();
        wait(1000).then(() => dispatch(resetAddIssueStatus()));
    }

    const renderError = () => {
        console.log('errors', requiredErrors);
        if(requiredErrors.length > 0){
            return(
                requiredErrors.map((e) => {
                    return (

                        <View style={styles.scrollContainer} key={"error"+e.id}>
                            <Text style={[styles.text, {color: 'red'}]}>Bitte füllen Sie das Feld: "{e.question}"</Text>
                        </View>

                    );
                })
            )
        }

        return (<></>)

    }

    const renderAnswerInput = (answers=[]) => {

        return (

            <Formik innerRef={formikRef}  validateOnBlur={true} initialValues={{

            }}
                    onSubmit={values => {
                        //validateField();
                        requestIssue((values))
                    }}>
                {({
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      values,
                      errors,
                      touched,
                      isValid,
                      setFieldValue,
                      setFieldTouched,
                      isValidating,
                      validateField, validateForm}) => (
                    <Fragment>
                        <View>
                            {/*  {(errors && touched) &&
                                    <Text style={{ fontSize: 10, color: 'red' }}>{JSON.stringify(errors)}FEHLER </Text>
                            }
                            */}
                        </View>
                        {
                            answers.map((a) => {

                                /*
                                * <select name="type" id="id_type">
                                <option value="1" selected="">Text</option> x
                                * <option value="2">Datum</option> x
                                * <option value="3">Zeit</option> x
                                * <option value="4">Ja/Nein</option> x
                                * <option value="5">Multiple Choice</option> x
                                * <option value="6">Multiple Choice Mehrfachauswahl</option> x
                                * <option value="7">Telefonnummer</option> x
                                * <option value="8">Zahl</option> x
                                * <option value="9">Welcher Vertragspartner</option>
                                * </select>
                                * */
                                const checkInput = () => {

                                };

                                switch (a.type) {
                                    case "1":
                                        return (
                                            <View key={a.id} style={styles.scrollContainer}>

                                                <Text style={styles.text}>{a.question}{a.required ? '*':''}</Text>

                                                <TextInput
                                                    placeholder={``}
                                                    name={a.id.toString()}
                                                    value={values[a.id]}
                                                    onBlur={() => {
                                                        handleBlur(a.id.toString())
                                                        setFieldTouched(a.id.toString())
                                                    }}

                                                    onChangeText2={(value) => {
                                                        handleChange(a.id.toString())
                                                        setFieldTouched(a.id.toString(), value)
                                                    }}

                                                    validate={validateRequired}
                                                    onChangeText={(value) => setFieldValue(a.id.toString(), value)}
                                                    style={[styles.input, {borderColor: (a.required ? (requiredErrors &&  (requiredErrors.some(e => e.id == a.id.toString()))  ? 'red':GWGColors.InputBorderColor) :GWGColors.InputBorderColor)}]}
                                                />
                                            </View>

                                        )
                                        break;
                                    case "2":
                                    case "3":

                                        const setDate = (event, date) => {
                                            if (date !== undefined) {
                                                // timeSetAction
                                                setFieldValue(a.id.toString(), date);
                                            }
                                            return true;
                                        };
                                        return (
                                            <View key={a.id} style={styles.scrollContainer}>
                                                <Text style={styles.text}>{a.question}{a.required ? '*':''}</Text>

                                                <DateTimePicker
                                                    testID="dateTimePicker"
                                                    value={values[a.id.toString()] ?? new Date(1598051730000)}
                                                    mode={a.type == '2' ? 'date': 'time'}
                                                    is24Hour={true}
                                                    display="default"
                                                    onCh3ange={(newvalue) => {setFieldValue(a.id.toString(), newvalue)}}
                                                    onChange={setDate}
                                                />
                                            </View>

                                        )
                                        break;
                                    case "4":
                                        var radio_props = [
                                            {label: 'ja', value: 1 },
                                            {label: 'nein', value: 0 }
                                        ];
                                        return (
                                            <View key={a.id} style={styles.scrollContainer}>
                                                <Text style={styles.text}>{a.question}{a.required ? '*':''}</Text>

                                                <RadioForm
                                                    radio_props={radio_props}
                                                    initial={-1}
                                                    animation={true}
                                                    buttonColor={GWGColors.GWGBLUE}
                                                    selectedButtonColor ={GWGColors.GWGBLUE}
                                                    labelColor={GWGColors.TEXT}
                                                    selectedLabelColor={GWGColors.GWGBLUE}
                                                    style = {{marginTop: 10}}
                                                    labelStyle = {{paddingLeft: 10, paddingRight: 10}}
                                                    formHorizontal={true}
                                                    handleBlur={() => handleBlur(a.id.toString())}
                                                    onChangeText={handleChange(a.id.toString())}
                                                    onPress={(value) => {setFieldValue(a.id.toString(), value)}}

                                                />
                                            </View>
                                        )
                                        break;
                                    case "5" :

                                        let options = a.answers.map((answer) => {return { value: answer, label: answer } })
                                        options.unshift({value: null, label:''});
                                        return (
                                            <View key={a.id} style={styles.scrollContainer}>
                                                <Text style={styles.text}>{a.question}{a.required ? '*':''}</Text>
                                                {platfrom.ios &&
                                                <SelectInput value={values[a.id.toString()]} options={options}
                                                             onCancelEditing={() => console.log('onCancel')}
                                                             onSubmitEditing={(value) => setFieldValue(a.id.toString(), value)}
                                                             style={[styles.selectInput, {borderColor: (a.required ? (requiredErrors && (requiredErrors.some(e => e.id == a.id.toString())) ? 'red' : GWGColors.InputBorderColor) : GWGColors.InputBorderColor)}]}
                                                             labelStyle={styles.selectInputLabel}
                                                />
                                                }

                                                {platfrom.android &&
                                                <View
                                                    style={[styles.selectInputA, {borderColor: (a.required ? (requiredErrors && (requiredErrors.some(e => e.id == a.id.toString())) ? 'red' : GWGColors.InputBorderColor) : GWGColors.InputBorderColor)}]}>


                                                    <Picker
                                                        useNativeAndroidPickerStyle={true}
                                                        selectedValue={values[a.id.toString()]}
                                                        onValueChange={(itemValue, itemIndex) =>
                                                            setFieldValue(a.id.toString(), itemValue)

                                                        }
                                                        mode={"dialog"}
                                                        style={{
                                                            borderWidth: 1,
                                                            borderColor: 'red',
                                                            borderStyle: 'solid'
                                                        }}


                                                    >
                                                        <Picker.Item label={null} value={null}/>
                                                        {a.answers.map((answer) => {
                                                            return (<Picker.Item label={answer} value={answer}/>)
                                                        })}

                                                    </Picker>
                                                </View>
                                                }

                                            </View>
                                        );

                                        break;
                                    case "51":

                                        const selectHandler = (id, idAnswer, value) => {
                                            console.log(values);let keyFound = false;
                                            for (const [key, value] of Object.entries(values)) {

                                                if(key.substr(0, key.indexOf('_')) == id){
                                                    if(key != idAnswer){
                                                        delete values[key];
                                                    }
                                                    else {
                                                        keyFound = true;
                                                        setFieldValue(idAnswer, value)
                                                    }
                                                }
                                            }
                                            if(!keyFound){
                                                setFieldValue(idAnswer, value)
                                            }
                                        }

                                        return (
                                            <View key={a.id} style={styles.scrollContainer}>
                                                <Text>{a.question}</Text>
                                                {
                                                    a.answers.map((answer) => {
                                                        return(
                                                            <View>
                                                                <Text style={styles.text}>{answer}</Text>
                                                                <Switch
                                                                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                                                                    thumbColor={values[a.id.toString()+"_"+answer] ? "#f5dd4b" : "#f4f3f4"}
                                                                    ios_backgroundColor="#3e3e3e"
                                                                    o2nValueChange={(value) => setFieldValue(a.id.toString()+"_"+answer, value)}
                                                                    onValueChange={(value) => selectHandler(a.id,a.id.toString()+"_"+answer, value)}
                                                                    value={values[a.id.toString()+"_"+answer]}
                                                                />
                                                            </View>
                                                        )
                                                    })
                                                }

                                                <TextInput
                                                    placeholder={`${a.question}`}

                                                    value={values[a.id]}
                                                    handleBlur={() => handleBlur(a.id.toString())}
                                                    onChangeText={handleChange(a.id.toString())}
                                                    style={styles.input}
                                                />
                                            </View>

                                        )
                                        break;
                                    case "6":
                                        return (
                                            <View key={a.id} style={styles.scrollContainer}>
                                                <Text>{a.question}</Text>
                                                {
                                                    a.answers.map((answer) => {
                                                        return(
                                                            <View>
                                                                <Text style={styles.text}>{answer}</Text>
                                                                <Switch
                                                                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                                                                    thumbColor={values[a.id.toString()+"_"+answer] ? "#f5dd4b" : "#f4f3f4"}
                                                                    ios_backgroundColor="#3e3e3e"
                                                                    onValueChange={(value) => setFieldValue(a.id.toString()+"_"+answer, value)}

                                                                    value={values[a.id.toString()+"_"+answer]}
                                                                />
                                                            </View>
                                                        )
                                                    })
                                                }

                                                <TextInput
                                                    placeholder={`${a.question}`}

                                                    value={values[a.id]}
                                                    handleBlur={() => handleBlur(a.id.toString())}
                                                    onChangeText={handleChange(a.id.toString())}
                                                    style={styles.input}
                                                />
                                            </View>

                                        )
                                        break;
                                    case "7":
                                        return (
                                            <View key={a.id} style={styles.scrollContainer}>
                                                <Text style={styles.text}>{a.question}{a.required ? '*':''}</Text>
                                                <TextInput
                                                    placeholder={`${a.question}`}
                                                    value={values[a.id]}
                                                    handleBlur={() => handleBlur(a.id.toString())}
                                                    onChangeText={handleChange(a.id.toString())}
                                                    style={styles.input}
                                                />
                                            </View>

                                        )
                                        break;
                                    case "8":
                                        return (
                                            <View key={a.id} style={styles.scrollContainer}>
                                                <Text style={styles.text}>{a.question}{a.required ? '*':''}</Text>
                                                <TextInput
                                                    placeholder={`${a.question}`}
                                                    keyboardType={'numeric'}
                                                    value={values[a.id]}
                                                    handleBlur={() => handleBlur(a.id.toString())}
                                                    onChangeText={handleChange(a.id.toString())}
                                                    style={styles.input}
                                                />
                                            </View>

                                        )
                                        break;
                                    case "9":
                                        return (
                                            <View key={a.id} style={styles.scrollContainer}>
                                                <Text style={styles.text}>{a.question}{a.required ? '*':''}</Text>
                                                <TextInput
                                                    placeholder={`${a.question}`}

                                                    value={values[a.id]}
                                                    handleBlur={() => handleBlur(a.id.toString())}
                                                    onChangeText={handleChange(a.id.toString())}
                                                    style={styles.input}
                                                />
                                            </View>

                                        )
                                        break;
                                    default:
                                        break;
                                }

                                return (<></>);
                                //return (<View><News key={faqItem.id} data={faqItem}/></View>);
                            })
                        }
                        <Button title="submit" onPress={handleSubmit} disabled={buttonStatus} activity={buttonStatus} text={"Anliegen senden"} />
                    </Fragment>
                )}
            </Formik>
        );

    };


    if (currentIssue == null) {
        return (
            <></>
        );
    }
    else {


        return (
            <View style={{paddingBottom: insets.bottom, backgroundColor: "#ffffff", flex: 1}}>

                {addIssuesRequestSuccess === true && addIssuesRequestedHasErrors === false ?
                    <View style={{backgroundColor: '#fff', padding: 10, height: screenHeight}}>
                        <View style={{padding: 10, marginTop: 30, marginBottom: 160}}>
                            <Headline text={"Anfrage abgesendet"} />
                            <View style={{alignItems: "center", justifyContent: "center", marginBottom: 40, marginTop: 20}}>
                                <Ionicons
                                    name={"md-checkmark-circle"}
                                    size={120}
                                    style={{ marginBottom: -13}}
                                    color={GWGColors.GWGBLUE}
                                    a
                                />
                            </View>
                            {currentIssue.description_postman ?
                                <>
                                    <Text style={[styles.text,{textAlign: "center"}]}>{currentIssue.description_postman}</Text>
                                </>
                                :
                                <>
                                    <Text style={[styles.text,{textAlign: "center"}]}>Vielen Dank für Ihre Anfrage! \n Wir werden Ihr Anliegen umgehend bearbeitenund Informieren Sie, sobald Ihr Dokument verfügbar ist. </Text>
                                </>
                            }

                        </View>
                        <View>
                            <Button type={'primary'}
                                    onPress={() => backToOverview()} text={"zurück"} />
                        </View>

                    </View>:<ScrollView  style={[styles.scrollContainer]} refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }>
                        <KeyboardAwareScrollView>

                            <View>
                                <Headline text={"Anliegen erstellen"} />
                            </View>

                            <View>
                                <Headline text={currentIssue.category} headlineColor={GWGColors.HEADLINEBORDERCOLORSECONDARY}/>
                            </View>

                            <View style={{padding: 10}}>
                                <HTMLView
                                    value={currentIssue.description}
                                    stylesheet={htmlStyles}
                                />
                            </View>
                            {requiredErrors.length > 0 ?
                                <View>
                                    {renderError()}
                                </View>
                                :<></>
                            }

                            <View>
                                {renderAnswerInput(currentIssue.answers)}
                            </View>

                        </KeyboardAwareScrollView>
                    </ScrollView>
                }
            </View>
        );
    }
}


const styles = StyleSheet.create({
    scrollContainer: {
        backgroundColor: '#fff',
        padding: 10
    },
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center"
    },
    input1: {
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 6,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginBottom: 22,
        marginTop: 6,
        fontSize: 20
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
        elevation: 30, // works on android
        color: GWGColors.TEXT

    },
    text: {
        fontSize: 18,
        color: GWGColors.TEXT
    },
    selectInput: {
        flexDirection: 'row',
        height: 46,
        borderWidth: 1,
        borderRadius: 0,
        padding: 10,
        marginTop: 10,
        borderColor: GWGColors.InputBorderColor,

        //backgroundColor: '#FFFFFF',
    },
    selectInputA: {
        height: 46,
        borderWidth: 1,
        borderRadius: 0,
        padding: 0,
        marginTop: 10,
        borderColor: GWGColors.InputBorderColor,

        //backgroundColor: '#FFFFFF',
    },
    selectInputLabel:{
        color: GWGColors.TEXT,
        fontSize: 18
    },
    selectInputLarge: {
        width: '100%',
        paddingHorizontal: 10,
    },
});

const htmlStyles = StyleSheet.create({
    a: {
        fontWeight: '300',
        color: '#FF3366', // make links coloured pink
    },
    b: {
        fontWeight: '800',
        color: '#dd0303',
        display: 'flex',
        flexDirection: 'row',
        fontSize: 18
    },
    p: {
        color: GWGColors.TEXT,
        fontSize: 18
    }
});