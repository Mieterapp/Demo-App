import React, {useEffect, useRef, useState} from 'react';

import {fetchIssues, issuesSelector, fetchIssuesRequsted, createIssueRequest, resetAddIssueStatus, issueRequestedSelector} from '@lovecoding-it/dit-core';
import {fetchContracts, fetchContract, contractsSelector} from '@lovecoding-it/dit-core';

import {
    ScrollView,
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    RefreshControl,
    SectionList,
    Dimensions, TouchableOpacity, FlatList, Linking
} from "react-native";

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import Headline from "../components/Headline";
import {useTranslation} from "../locales/localProvider";
import {GWGColors} from "../config/Colors";
import ButtonIcon from "../components/ButtonIcon";
import LoadingScreen from "./LoadingScreen";

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default function IssueHistoryScreen({navigation}) {



    const {i18n} = useTranslation();



    const dispatch = useDispatch();
    const {issues, loading, hasErrors} = useSelector(issuesSelector);
    const {contracts} = useSelector(contractsSelector);
    const {issuesRequested, issuesRequestedloading, addIssuesRequestSuccess, addIssuesRequestedHasErrors} = useSelector(issueRequestedSelector);
    const [refreshing, setRefreshing] = React.useState(false);

    useEffect(() => {
        //dispatch(fetchIssues());
        if(contracts.current){
            dispatch(fetchIssuesRequsted(contracts.current.code));
        }

    }, [dispatch]);

    const wait = (timeout) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    };

    const onRefresh = React.useCallback(() => {
        dispatch(fetchIssuesRequsted());
        setRefreshing(true);

        wait(2000).then(() => setRefreshing(false));
    }, []);


    const formatDate = (date) => {
        if(date == undefined)
            return '-'
        const options = {  year: 'numeric', month: 'long', day: 'numeric' };
        const date2 = new Date(date.replace(' ','T'));
        return date2.toLocaleDateString('de-DE', options);
    }

    const callNumber = (phoneNumber) => {
        Linking.openURL(`tel:${phoneNumber}`);
    }

    const openMail = (eMail) => {
        Linking.openURL(`mailto:${eMail}`);
    }



    const _renderListItem = ({item, index}) => {

        if(item == undefined)
            return (<><Text>das Anliegen konnte nicht geladen werden</Text></>);
        //var item =JSON.parse(JSON.stringify(item));
        return (
            <TouchableOpacity
                activeOpacity = {1}
                key={index}
                >

                <View style={{padding: 25, paddingTop: 10, paddingBottom: 20,       borderBottomWidth: 1, borderBottomColor: '#f1f1f1',}}>
                    <View >
                        <Text style={[styles.text,{fontWeight: 'bold'}]}>{item.category}</Text>
                        <Text style={styles.text}>(Ticket: {item.ticketnr})</Text>
                        <Text style={styles.text}>angefordert am {formatDate(item.create_on)}</Text>
                        <Text style={styles.text}>bearbeitet am {formatDate(item.updated_at)}</Text>
                        <Text style={[styles.text,{marginTop: 0, marginBottom: 10}]}>Status: {item.state}</Text>
                        {contracts.current.contact_person ?
                            <>
                                <Text style={styles.text}>Ansprechpartner: {contracts.current.contact_person.display_name ?? '-'}</Text>
                            </>
                            :
                            <>
                                <Text
                                    style={styles.text}>Ansprechpartner: Kein Ansprechpartner</Text>
                            </>
                        }
                    </View>
                    {contracts.current.contact_person ?
                        <View style={{flexDirection: "row", marginTop: 20}}>
                            <ButtonIcon icon={"md-mail"} type={"inverted"} onPress={()=>openMail("post@demo-app.de")}  containerStyles={{marginRight: 30}} iconSize={40}/>
                            <ButtonIcon icon={"md-call"} type={"inverted"} onPress={()=>callNumber(contracts.current.contact_person.phone ?? '0711 22777-0')} iconSize={40}/>
                        </View>
                        :
                        <></>
                    }

                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View  style={styles.scrollContainer} >
            {!issuesRequestedloading ?
                <>
                {issuesRequested.length > 0 ?
                        <FlatList
                            ListHeaderComponent={
                                <>
                                    <Headline text={i18n.t('IssueHistoryScreen-Headline')} />
                                </>
                            }
                            data={issuesRequested}
                            keyExtractor={(item, index) => index}
                            renderItem={_renderListItem}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                            }
                        />
                        :
                        <View>
                            <Headline text={i18n.t('IssueHistoryScreen-Headline')} />
                            <Text style={styles.text}>Bisher haben Sie noch keine Anliegen verfasst.</Text>
                        </View>

                }
                </>
                :
                <LoadingScreen />
            }
        </View>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        backgroundColor: '#fff',
        padding: 10,
        flex:1

    },
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center"
    },
    text: {
        fontSize: 18,
        color: GWGColors.TEXT
    }
})