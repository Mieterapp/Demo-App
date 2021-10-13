import React, {useEffect, useRef, useState} from 'react';
import {fetchIssues, issuesSelector, userSelector} from '@lovecoding-it/dit-core';
import {fetchContracts, fetchContract, contractsSelector} from '@lovecoding-it/dit-core';
import ButtonIcon from "../components/ButtonIcon";
import {
    ScrollView,
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    RefreshControl,
    SectionList,
    Dimensions, TouchableOpacity, FlatList
} from "react-native";

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import AccordionEasy from "../widgets/AccordionEasy";
import Headline from "../components/Headline";
import {useTranslation} from "../locales/localProvider";
import Accordion from "../widgets/Accordion";
import NavigationListItem from "../components/NavigationListItem";
import {Feather, Ionicons} from "@expo/vector-icons";
import {GWGColors} from "../config/Colors";
import LoadingScreen from "./LoadingScreen";
import Guest from "../widgets/Guest";
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

import { useScrollToTop } from '@react-navigation/native';
import Button from "../components/Button";
import ProfiInfoItem from "../components/ProfiInfoItem";
import {Modalize} from "react-native-modalize";
import {Portal} from "react-native-portalize";
import Touchable from "../components/Touchable";

export default function IssueScreen({navigation}) {

    const {i18n} = useTranslation();
    const modalizeRef = useRef();
    const ref = React.useRef(null);
    useScrollToTop(ref);

    const dispatch = useDispatch();
    const {issues, loading, hasErrors} = useSelector(issuesSelector);
    const {contracts, loading: contractsLoading, hasError: hasErrorsContracts, loadingCurrent, hasErrorsCurrent} = useSelector(contractsSelector);
    const {user} = useSelector(userSelector);

    const [refreshing, setRefreshing] = React.useState(false);

    const [contractSelectLoading, setContractSelectLoading] = useState( false);
    const [currentid, setCurrentid] = useState( null);

    useEffect(() => {
        dispatch(fetchIssues());
    }, [dispatch]);

    const wait = (timeout) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    };

    const onRefresh = React.useCallback(() => {
        dispatch(fetchIssues());
        setRefreshing(true);

        wait(2000).then(() => setRefreshing(false));
    }, []);

    const renderIssue = (issues) => {
        if (loading) return <View style={[styles.loadingContainer, styles.horizontal]}><ActivityIndicator size="large" color="#00ff00" /><Text>{loading}</Text></View>
        if (hasErrors) return <Text>Unable to display issues.</Text>

        return issues.map((issue) => {
            return (<Accordion data={issue}/>)
            //return (<View><News key={faqItem.id} data={faqItem}/></View>);
        })

    }

    const openModal = () => {
        modalizeRef.current?.open('top');
    };

    const _renderListItem = ({item, index}) => {

        if(item == undefined)
            return (<></>);
        //var item =JSON.parse(JSON.stringify(item));
        return (
            <TouchableOpacity
                key={index}
                activeOpacity = {1}
                onPress={(event) => {
                    navigation.navigate('IssueDetailScreen', {"issueId": item.id ?? null })
                }}>

                <View style={styles.row} >
                    <View style={[styles.listTitleContainer]}><Text style={[styles.listTitle]}>{item.category}</Text></View>
                    <Feather name="chevron-down" size={24} style={styles.listIcon} color="black"/>
                </View>
            </TouchableOpacity>
        );
    };

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
                <Touchable onPress={() => setContract(contract.id)} key={'contract_' + contract.id}>
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

    return (

            <>
                {user.guest ?

                    <View style={[styles.container,{padding: 10}]}>
                        <Guest />
                    </View>
                    :
                    <>
                        {loading ?
                            <View  style={styles.scrollContainer} >
                                <LoadingScreen />
                            </View>
                            :
                            <View style={styles.scrollContainer}>
                                <FlatList
                                    ref={ref}
                                    style={{backgroundColor: '#ffffff'}}
                                    ListHeaderComponent={
                                        <>



                                            <View style={{padding: 10, paddingBottom: 0}}>
                                                <Headline text={i18n.t('IssuesScreen-Headline')} />
                                            </View>


                                            {contracts.list.length > 1 ?
                                                <View style={{padding: 10, paddingBottom: 0, paddingTop: 0}}>
                                                    <Button text={"Vertrag auswählen"} icon={"md-create"} onPress={() => openModal()} />
                                                </View>
                                                :
                                                <></>
                                            }
                                            <View style={{margin: 30, marginTop: 20, marginBottom: 10, borderBottomWidth: 0, borderBottomColor: GWGColors.LIGHTERGREY, borderBottomStyle: 'solid'}}>
                                                {contracts.current != null?
                                                    <>
                                                        <ProfiInfoItem  headline={"Vertrag"} text={contracts.current ? (contracts.current.rental_contract)?? "-": "-"} />


                                                    </>
                                                    :<></>}

                                            </View>
                                            <View style={{padding: 10 ,paddingTop: 0}}  style2={{alignItems: 'flex-end', padding: 10, paddingRight: 10,
                                                paddingTop: 30}}>
                                                <Button icon={'md-clock'}
                                                            onPress={() => navigation.navigate('IssueHistoryScreen')}  text={"Meine Anliegen"} />
                                            </View>

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

                                    }
                                    data={issues}
                                    keyExtractor={(item, index) => 'key'+index}
                                    renderItem={_renderListItem}

                                    refreshControl={
                                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                    }
                                />
                            </View>
                        }
                    </>
                }
            </>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        backgroundColor: '#fff',
        height: screenHeight,
        flex: 1
    },
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center"
    },
    row:{
        flexDirection: 'row',
        justifyContent:'flex-start',
        paddingLeft:0,
        paddingRight:0,
        alignItems:'flex-start',
        backgroundColor: 'transparent',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f1f1',
        padding: 20,

        margin: 10,
        marginLeft: 30,
        marginRight: 30,
        marginBottom:10,
        borderWidth: 0

    },
    listTitleContainer: {
        borderWidth: 0,
        width: screenWidth-100
    },
    listTitle: {
        fontSize: 18,
        //fontWeight: "bold",
        alignSelf: "flex-start",
        color: GWGColors.TEXT

    },
    listIcon: {
        borderWidth: 1.4,
        borderColor: "#b6b6b6",
        color: "#b6b6b6",
    }
})