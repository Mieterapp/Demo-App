import React, {useEffect, useRef, useState} from 'react';
import {fetchPosts, postsSelector, logout, isAuthenticated, getAuthenticatedUser, setUserData, userSelector, guest, deleteUser, resetPassword} from '@lovecoding-it/dit-core';
import {fetchContracts, fetchContract, contractsSelector} from '@lovecoding-it/dit-core';
import {Ionicons} from "@expo/vector-icons";
import Button from "../components/Button";
import {
    StyleSheet,
    View,
    Text,
    Dimensions, ScrollView, RefreshControl, Alert, FlatList, Linking
} from "react-native";

import { useDispatch,useSelector } from 'react-redux';
import {useTranslation} from "../locales/localProvider";

import { useScrollToTop } from '@react-navigation/native';

import Headline from "../components/Headline";
import ProfiInfoItem from "../components/ProfiInfoItem";
import Input from "../components/Input";
import {GWGColors} from "../config/Colors";
import Touchable from "../components/Touchable";
import SelectInput from "react-native-select-input-ios";
import ButtonIcon from "../components/ButtonIcon";
import LoginForm from "../widgets/LoginForm";
import Guest from "../widgets/Guest";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {useDropDown} from "../widgets/DropdownProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SelectContracts from "../widgets/SelectContract";
import {Modalize} from "react-native-modalize";

import { Host, Portal } from 'react-native-portalize';
import Accordion from "../widgets/Accordion";
import LoadingScreen from "./LoadingScreen";
import Version from "../widgets/Version";

export default function ProfilScreen({navigation}) {

    //const editProfil = false;

    const { ref } = useDropDown();

    const refNav = React.useRef(null);
    useScrollToTop(refNav);

    const modalizeRef = useRef();

    const {i18n} = useTranslation();
    const screenWidth = Math.round(Dimensions.get('window').width);

    const dispatch = useDispatch()
    const {contracts, loading, hasErrors, loadingCurrent, hasErrorsCurrent} = useSelector(contractsSelector);
    const [currentid, setCurrentid] = useState( null);
    const [contractOptions, setContractOptions] = React.useState([]);

    const phoneRef = useRef();
    const mobileRef = useRef();
    const emailRef = useRef();
    const emailContractRef = useRef();

    //const { user } = useSelector(state => state.user)
    const {user} = useSelector(userSelector);

    const openModal = () => {
        modalizeRef.current?.open('top');
    };

    useEffect(() => {
        if(contracts.current){
            setCurrentid(contracts.current.id);
        }

    },[contracts]);


    useEffect(() => {

        //dispatch(getAuthenticatedUser());
        if(!user.guest){
            dispatch(getAuthenticatedUser());
        }

        dispatch(fetchContracts()).then(() => {
            //var options = contracts.list.map((c) => {return  {label:c.street + " "+c.street_number+ "("+c.number + ")", value: c.id}});
            var options = contracts.list.map((c) => {return  {label: c.description, value: c.id}});
            //options.unshift({label: "-", value: null})
            //console.log('contraaaaaaaaaaa',contracts.current)
            if(contracts.current){
                setCurrentid(contracts.current.id);
            }

            setContractOptions((options));
        });



        //var options = contracts.list.map((c) => {return  {label: c.street + " "+c.street_number+ "("+c.number + ")", value: c.id}});
        var options = contracts.list.map((c) => {return  {label: c.description, value: c.id}});
        //options.unshift({label: "-", value: null})
        setContractOptions((options));
        if(currentid!=null){
            dispatch(fetchContract(currentid))
        }
    }, [dispatch]);

    const wait = (timeout) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }

    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        dispatch(getAuthenticatedUser())
        dispatch(fetchContracts()).then(() => {
            //var options = contracts.list.map((c) => {return  {label: c.street + " "+c.street_number+ "("+c.number + ")", value: c.id}});
            var options = contracts.list.map((c) => {return  {label: c.description, value: c.id}});
            //options.unshift({label: "-", value: null})
            setContractOptions((options));
        })
        if(currentid!=null){
            dispatch(fetchContract(currentid))
        }

        setRefreshing(true);

        wait(2000).then(() => setRefreshing(false));
    }, []);

    const doLogout = () => {
        AsyncStorage.removeItem('pushtoken')
        dispatch(logout());
    }

    const doPasswordReset = () => {
        dispatch(resetPassword(user.data.email));
        ref.current.alertWithType("success", 'Passwort-Änderung','Eine E-Mail mit Ihrem Link zur Passwort-Änderung wurde versendet.', null, 1500);
    }

    const doAccountDeleteQuestion = () => {

        Alert.alert(
            "Account löschen",
            'Um Ihren Account endgültig zu löschen bestätigen Sie Ihre Eingabe.',
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "OK",
                    //onPress: () => console.log("ok Pressed"),
                    onPress: password => doDeleteAccount()
                }
            ],null
        );
    }

    const doDeleteAccount = () => {
        ref.current.alertWithType("success", 'Erfolgreich','Ihr Account wird gelöscht ...', null, 1500);
        dispatch(guest(true)).then(() => {
            dispatch(deleteUser());
        })



        wait(2000).then(() => {
            Alert.alert("Hinweis","Ihr Account wurde gelöscht.");
            doLogout()
        });
    }

    const [editProfil, setEditProfil] = useState(false);
    const [email, setEmail] = useState('');
    const [emailContract, setEmailContract] = useState('');
    const [phone, setPhone] = useState('');
    const [mobile, setMobile] = useState('');



    const openEdit = () => {
        setEmail(user.data.email);
        setEmailContract(user.data.email_contract);
        setPhone(user.data.phone);
        setMobile(user.data.mobile);
        setEditProfil(true);
        //wait(500).then(() =>  phoneRef.current.focus());
        ;
    }

    const closeEdit = () => {
        setEditProfil(false);
    }

    const saveProfil = () => {
        setEditProfil(false);

        let newUser =  {};
        if(email != user.data.email){
            newUser['email'] = email;
        }

        if(emailContract != user.data.email_contract){
            newUser['email_contract'] = emailContract;
        }

        if(phone != user.data.phone){
            newUser['phone'] = phone;
        }

        if(mobile != user.data.mobile){
            newUser['mobile'] = mobile;
        }

        newUser['code'] = contracts.current.code;

        dispatch(setUserData(newUser));

        ref.current.alertWithType("success", 'Erfolgreich','Daten erfolgreich gespeichert', null, 1500);
        //console.log("editProfil")
    }

    const setContractCurrent = (id) => {
        if(id != null) {
            setCurrentid(id);
            dispatch(fetchContract(id))
        }
    }

    if(user.data == null){
        //return (<></>)
    }

    const publishEmail = (email) => {
        setEmail(email)
    }

    const publishEmailContract = (email) => {
        setEmailContract(email)
    }

    const publishPhone = (phone) => {
        setPhone(phone)
    }

    const publishMobile = (mobile) => {
        setMobile(mobile)
    }

    const callNumber = (phoneNumber) => {
        Linking.openURL(`tel:${phoneNumber}`);
    }

    const openMail = (eMail) => {
        Linking.openURL(`mailto:${eMail}`);
    }

    const [contractSelectLoading, setContractSelectLoading] = useState( false);

    const setContract = (id) => {
        setCurrentid(id);
        dispatch(fetchContract(id))
        wait(600).then(() =>  {
            setContractSelectLoading(true);
            wait(800).then(() =>  {
                modalizeRef.current?.close();
            });
            //setContractCurrent(id);
        });
    }

    const renderContracts = () => {
        return contracts.list.map((contract, i) => {
            return (
                <Touchable onPress={() => setContract(contract.id)} key={contract.id}>
                    <View style={{marginBottom: 5, flex: 0, flexDirection: "row", textAlign: "center", alignItems: "center",borderBottomWidth: (i+1 < contracts.list.length ? 1: 0), borderBottomColor: GWGColors.LIGHTERGREY, borderBottomStyle: 'solid'}}>

                        <View style={{padding: 10}}>
                            {contracts.current ?
                                <Ionicons
                                    name={'md-checkmark-circle'}
                                    size={25}
                                    color={currentid == contract.id ? GWGColors.BUTTONCOLOR : GWGColors.TEXT}
                                />
                                :

                                <Ionicons
                                    name={'md-checkmark-circle'}
                                    size={25}
                                    color={GWGColors.TEXT}
                                />

                            }

                        </View>
                        <View style={{width: screenWidth-50, padding: 20}}>
                            <Text style={{fontWeight:"800", color: GWGColors.TEXT}}>{contract ? contract.type_name ?? "-": "-"}</Text>
                            <Text style={{ color: GWGColors.TEXT}}>{contract? contract.rental_contract ?? "-": "-"}</Text>
                            <Text style={{ color: GWGColors.TEXT}}>{contract? contract.description ?? "-": "-"}</Text>
                        </View>

                    </View>
                </Touchable>
            )
            //return (<View><News key={faqItem.id} data={faqItem}/></View>);
        })
    }


    const [value, onChangeText] = React.useState('Useless Placeholder');

    return (
        <>
            <ScrollView  ref={refNav} style={styles.scrollContainer} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>

                <KeyboardAwareScrollView>
                    {user.guest ?

                        <>
                            <Guest />
                        </>
                        :
                        <>

                            <Headline text={i18n.t('ProfilScreen-Headline')} />



                            {contracts.current == null ?
                                <View style={{margin:0}}>

                                    <View style={{}}>
                                        <Button text={"Vertrag auswählen"} icon={"md-create"} onPress={() => openModal()} />
                                    </View>
                                </View>
                                :
                                <>
                                    {contracts.list.length > 1 ?
                                        <View style={{}}>
                                            <Button text={"Vertrag auswählen"} icon={"md-create"} onPress={() => openModal()} />
                                        </View>
                                        :
                                        <></>
                                    }


                                    <View style={{margin: 30, marginTop: 10, marginBottom: 0, borderBottomWidth: 1, borderBottomColor: GWGColors.LIGHTERGREY, borderBottomStyle: 'solid'}}>
                                        <ProfiInfoItem headlineStyle={{color: GWGColors.GWGBLUE, fontSize: 24}} containerStyle={{marginBottom: 0}} headline={"Vertragsdaten"} />
                                        {contracts.current != null?
                                            <>
                                                <ProfiInfoItem  headline={"Vertrag"} text={contracts.current ? (contracts.current.type_name + '\n' + contracts.current.description)?? "-": "-"} />


                                                <ProfiInfoItem headline={i18n.t('ProfilScreen-AccountNumber')} text={contracts.current ? contracts.current.rental_contract ?? "-": "-"} />
                                                {contracts.current.customer_center ?
                                                    <>
                                                        <ProfiInfoItem  headline={"Mietobjektadresse"} text={(contracts.current.street ?? '--') + ' ' + (contracts.current.street_number ?? '--') + '\n' + (contracts.current.zip_code ?? '--') + ' '+ (contracts.current.city ?? '--')} />
                                                    </>
                                                    :
                                                    <><ProfiInfoItem headline={""} text={"--"} /></>}
                                            </>
                                            :<></>}

                                    </View>

                                    <View style={{margin: 30, marginBottom: 0, paddingBottom: 25,  borderBottomWidth: 1, borderBottomColor: GWGColors.LIGHTERGREY, borderBottomStyle: 'solid' }}>
                                        <ProfiInfoItem headlineStyle={{color: GWGColors.GWGBLUE, fontSize: 24}} containerStyle={{marginBottom: 0}} headline={i18n.t('ProfilScreen-ContactPersonHeadline')} />
                                        {contracts.current != null?
                                            <>
                                                {contracts.current.contact_person  ?
                                                    <>
                                                        <ProfiInfoItem headlineStyle={{color: GWGColors.TEXT}} headline={"Kunden- und Objektbetreuer"} containerStyle={{marginBottom: 0}} text={contracts.current.contact_person.display_name} />
                                                        <Text style={{fontSize: 20, marginBottom:8 , paddingBottom:0, bottom: 0, color: GWGColors.GWGBLUE}} onPress={()=>openMail('post@demo-app.de')}>post@demo.de</Text>
                                                        <Text style={{fontSize: 20, marginBottom:8 , paddingBottom:0, bottom: 0, color: GWGColors.GWGBLUE}} onPress={()=>callNumber(contracts.current.contact_person.phone)}>{contracts.current.contact_person.phone}</Text>

                                                    </>
                                                    :
                                                    <><ProfiInfoItem headline={""} text={"--"} /></>}
                                            </>
                                            :<></>}
                                    </View>

                                    {/*<View style={{margin: 30, marginBottom: 0, marginTop:10, borderBottomWidth: 1, borderBottomColor: GWGColors.LIGHTERGREY, borderBottomStyle: 'solid'}}>
                                {contracts.current != null?
                                    <>
                                        {typeof contracts.current.customer_center  != "undefined" ?
                                            <>
                                                <ProfiInfoItem  headline={"Geschäftspartneradresse"} text={contracts.current.customer_center.name + '\n' + contracts.current.customer_center.street + ' ' + contracts.current.customer_center.street_number + '\n' + contracts.current.customer_center.zip_code + ' '+ contracts.current.customer_center.city} />
                                            </>
                                            :
                                            <><ProfiInfoItem headline={""} text={"--"} /></>}
                                    </>
                                    :<></>}
                            </View>*/}

                                    <View style={{margin:30, marginBottom: 0}}>
                                        <ProfiInfoItem headlineStyle={{color: GWGColors.GWGBLUE, fontSize: 24}} containerStyle={{marginBottom: 0}} headline={"Ihre Kontaktdaten"} />
                                        <ProfiInfoItem headline={i18n.t('ProfilScreen-AccountName')} text={user.data ? user.data.first_name + ' ' + user.data.last_name:'-'} />
                                        <ProfiInfoItem headline={i18n.t('ProfilScreen-AccountStreet')} text={(user.data ? user.data.street ?? "-": "-") +' '+(user.data ? user.data.street_number ?? "-": "-")} />
                                        <ProfiInfoItem headline={i18n.t('ProfilScreen-AccountCity')} text={(user.data ? user.data.zip_code ?? "-": "-") +' '+(user.data ? user.data.city ?? "-": "-")} />
                                        {editProfil ?
                                            <>
                                                <Input headline={i18n.t('ProfilScreen-AccountPhone')} value={phone} refData={phoneRef} onChangeText={publishPhone} />
                                                <Input headline={i18n.t('ProfilScreen-AccountMobile')} value={mobile} refData={mobileRef} onChangeText={publishMobile} />
                                                <Input headline={'Account E-Mail'} value={email} refData={emailRef} onChangeText={publishEmail} keyboardType={"email-address"} textContentType={'emailAddress'}/>
                                                <Input headline={'Kontakt E-Mail'} value={emailContract} refData={emailContractRef} onChangeText={publishEmailContract} keyboardType={"email-address"} textContentType={'emailAddress'}/>
                                            </>
                                            :
                                            <>
                                                <ProfiInfoItem headline={i18n.t('ProfilScreen-AccountPhone')} text={user.data ? user.data.phone ?? "-": "-"} />
                                                <ProfiInfoItem headline={i18n.t('ProfilScreen-AccountMobile')} text={user.data ? user.data.mobile ?? "-": "-"} />
                                                <ProfiInfoItem headline={"Account E-Mail"} text={user.data ? user.data.email ?? "-": "-"} />
                                                <ProfiInfoItem headline={"Kontakt E-Mail"} text={user.data ? user.data.email_contract ?? "-": "-"} />
                                            </>
                                        }

                                    </View>


                                    {editProfil ?
                                        <>
                                            <Button type={'primary'}
                                                    onPress={() => saveProfil()}
                                                    text={"Profil speichern"} />

                                            <Button type={'secondary'}
                                                    onPress={() => closeEdit()}
                                                    text={"abbrechen"} /></>

                                        :
                                        <>
                                        </>
                                    }





                                    {editProfil ?
                                        <>
                                        </>
                                        :
                                        <>
                                            <Button type={'primary'}
                                                    onPress={() => openEdit()}
                                                    text={"Profil bearbeiten"} />
                                        </>
                                    }

                                    {editProfil ?
                                        <View style={{marginBottom: 200}}></View>
                                        : <></>
                                    }
                                </>
                            }

                            <View>
                                <Button type={'primary'}
                                        onPress={() => doPasswordReset()}
                                        text={"Passwort ändern"}></Button>
                            </View>

                            <View>
                                <Button type={'primary'}
                                        onPress={() => doLogout()}
                                        text={"Logout"}></Button>
                            </View>
                            <View style={{marginTop: 50}}>
                                <Button type={'warning'}
                                        onPress={() => doAccountDeleteQuestion()}
                                        text={"Account löschen"}></Button>
                            </View>


                            <View style={{margin: 30}}>

                                <Touchable onPress={() => navigation.navigate("LegalScreen",{ type: 'imprint' })} activeOpacity={0.6}>
                                    <View>
                                        <Text style={{fontSize: 18, marginBottom:8 , paddingBottom:0, bottom: 0, color: GWGColors.HeadlineTextColor}}>Impressum</Text>
                                    </View>
                                </Touchable>
                                <Touchable onPress={() => navigation.navigate("LegalScreen",{ type: 'dataprotect' })} activeOpacity={0.6}>
                                    <View>
                                        <Text style={{fontSize: 18, marginBottom:8 , paddingBottom:0, bottom: 0, color: GWGColors.HeadlineTextColor}}>Datenschutz</Text>
                                    </View>
                                </Touchable>
                            </View>



                        </>
                    }
                </KeyboardAwareScrollView>

                <Version />

            </ScrollView>
            <Portal>
                <Modalize ref={modalizeRef}
                          adjustToContentHeight={true}
                          closeOnOverlayTap={true}
                          tapGestureEnabled={false}
                          withHandle={true}
                          withOverlay={true}
                          scrollViewProps={{bounces: false, showsVerticalScrollIndicator: false, }}
                          onClosed={()=> setContractSelectLoading(false)}
                >
                    <>
                        {contractSelectLoading ?
                            <View style={{minHeight: 400, padding: 20}}>
                                <LoadingScreen />
                            </View>

                            :
                            <View style={{minHeight: 400, padding: 20}}>
                                <Text style={{ color: GWGColors.TEXT, fontSize: 28, marginLeft: 5, marginTop: 10}}>Verträge</Text>
                                <>{renderContracts()}</>
                            </View>
                        }
                    </>
                </Modalize>
            </Portal>
        </>
    );
}


const styles = StyleSheet.create({
    scrollContainer: {
        backgroundColor: '#fff',
        padding: 10
    },
    container: {

        backgroundColor: '#fff',
        //alignItems: 'center',

        //justifyContent: 'center'

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
    selectInput: {
        flexDirection: 'row',
        height: 46,
        borderWidth: 1,
        borderRadius: 0,
        padding: 10,
        marginTop: 10,
        borderColor: GWGColors.InputBorderColor,
        backgroundColor: '#FFFFFF',
    },
    selectInputLabel:{
        color: GWGColors.TEXT,
        fontSize: 18
    },

    input: {
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 6,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginBottom: 22,
        marginTop: 6,
        fontSize: 20
    }


})
