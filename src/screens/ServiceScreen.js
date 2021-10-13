import React, {useEffect, useRef, useState} from 'react';
import {
    View,
    StyleSheet,
    Text,FlatList,
    Dimensions, TouchableOpacity, RefreshControl, ScrollView
} from "react-native";


import { useScrollToTop } from '@react-navigation/native';

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {useTranslation} from "../locales/localProvider";
import {fetchDocuments, documentsSelector} from '@lovecoding-it/dit-core';
import {fetchContracts, fetchContract, contractsSelector, userSelector} from '@lovecoding-it/dit-core';

import Headline from "../components/Headline";
import NavigationListItem from "../components/NavigationListItem";
import {GWGColors} from "../config/Colors";
import {Feather, Ionicons} from "@expo/vector-icons";
import AccordionEasy from "../widgets/AccordionEasy";
import RentalCondition from "../components/RentalCondition";
import ProfiInfoItem from "../components/ProfiInfoItem";
import Guest from "../widgets/Guest";
import Error from "../widgets/Error";
import LoadingScreen from "./LoadingScreen";
import {Modalize} from "react-native-modalize";
import {Portal} from "react-native-portalize";
import Touchable from "../components/Touchable";
import Button from "../components/Button";

import 'intl';
import 'intl/locale-data/jsonp/de';


const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default function ServiceScreen({route, navigation}) {

    const modalizeRef = useRef();
    const ref = React.useRef(null);
    useScrollToTop(ref);

    const { docId } = route.params ?? {};

    const [openSection, setOpenSection] = useState(null);

    //console.log('openSection',openSection);

    const dispatch = useDispatch()
    const {documents, documentsLoading, documentsHasErrors} = useSelector(documentsSelector)
    const {contracts, loading, hasErrors, loadingCurrent, hasErrorsCurrent} = useSelector(contractsSelector);
    const {user} = useSelector(userSelector);

    const {i18n} = useTranslation();

    const [serviceScreenListData, setServiceScreenListData] = useState([]);

    const [additionalCosts, setAdditionalCosts] = useState(0);
    const [totalCosts, setTotalCosts] = useState(0);

    const [loadingScreen, setLoadingScreen] = useState(true);

    const wait = (timeout) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }

    const [refreshing, setRefreshing] = React.useState(false);

    const [count, setCount] = React.useState(0);

    const onRefresh = React.useCallback(() => {
        //dispatch(fetchDocuments())
        setRefreshing(true);
        wait(500).then(() => setRefreshing(false));
    }, []);

    const goToIssues=()=>{
        navigation.navigate('Anliegen')
    }


    const createDocumentList = (documents) => {
        let list = [];

        documents.forEach(d => {
            list.push(
                {
                    "key": d.id,
                    "name": d.name,
                    "icon": "shield",
                    "date": d.date,
                    "year": new Date(d.date).getFullYear(),
                    "type": d.type,
                    "screen": "PDFViewScreen",
                    "navProps": {
                        "source": d.href,
                        "doc": d
                    }
                }
            )
        });
        return list;
    }

    const costScreenList = [
        {
            "type": "accordion",
            "key": "Mietzusammensetzung",
        },
    ]

    useEffect(() => {
        setCount(count+1);
        console.log('dCound', documents.length, count);


        var a = [];

        if(documents.length > 0) {
            var documentsTemp = {
                operating_costs: [],
                contract: [],
                issues: [],
                costs: costScreenList
            };

            documents.forEach(item => {

                if(docId) {
                    if(docId == item.id) {
                        setOpenSection(item.type);
                    }
                }

                if(item.type == 'contract') {
                    documentsTemp.contract.push(item);
                }

                if(item.type == 'operating_costs') {
                    documentsTemp.operating_costs.push(item);
                }

                if(item.type == 'issues') {
                    documentsTemp.issues.push(item);
                }
            });

            a.push({
                type: 'contract',
                name: "Mein Mietvertrag",
                data: createDocumentList(documentsTemp.contract)
            });
            a.push({
                type: 'operating_costs',
                name: "Meine Betriebskostenabrechungen",
                data: createDocumentList(documentsTemp.operating_costs)
            })
            a.push({
                type: 'issues',
                name: "Angeforderte Dokumente",
                data: createDocumentList(documentsTemp.issues)
            })

            ///console.log("AAAAA",a);


            /*const profilScreenList = {
                contract: [],
                operating_costs: [],
                issues: [],
                costs: costScreenList
            }*/



            /*const serviceScreenListData = [
                {
                    title: "Dokumente",
                    data: profilScreenList
                },
                {
                    title: "Mietinformationen",
                    data: costScreenList
                }
            ]*&


             */

            //profilScreenList.contract = contractList;
            //profilScreenList.operating_costs = operatingCostsList;
            //profilScreenList.issues = issuesList;
            //profilScreenList.costs = costScreenList;

            const profilScreenList = createDocumentList(documents);
            const serviceScreenListData = profilScreenList.concat(costScreenList);
            //setServiceScreenListData(serviceScreenListData)

            //setServiceScreenListData(profilScreenList)
        }
        else {
            if(!documentsLoading){
                console.log('reload', documentsLoading);
                if(contracts.current){
                    //dispatch(fetchDocuments(contracts.current.code));
                }
                dispatch(fetchContracts());
            }

        }

        a.push(
            {
                "type": "rental_infos",
                "name": "Mietzusammensetzung",
            }
        )
        setServiceScreenListData(a)
    }, [documents])

    useEffect(() => {
        if(contracts.current == null){
            dispatch(fetchContracts())
        }
        else {
            setTotalCosts(0);
            if(contracts.current){
                if(contracts.current.condition_lines) {
                    contracts.current.condition.condition_lines.map((item)=>{
                        setTotalCosts(totalCosts+parseFloat(item.value))

                        if(item.code == "2100"){
                            setAdditionalCosts(additionalCosts+parseFloat(item.value))
                        }
                        if(item.code == "2200"){
                            setAdditionalCosts(additionalCosts+parseFloat(item.value))
                        }

                    });
                }
            }

        }

    },[]);


    useEffect(() => {
        console.log('CURRENT')
        if(contracts.list.length>0) {
            if (contracts.current) {
                dispatch(fetchDocuments(contracts.current.code));
            }
        }
    },[contracts.current]);

    useEffect(() => {
        if(contracts.current){
            setCurrentid(contracts.current.id);
        }

    },[]);


    useEffect(() => {
        if(documentsLoading == false && loadingCurrent == false){
            setLoadingScreen(false);
        }
        else {
            setLoadingScreen(true)
        }

    },[documentsLoading,loadingCurrent]);

    const renderRentalInfos = () => {
        if(contracts.current && contracts.current.condition.condition_lines) {
            return contracts.current.condition.condition_lines.map((item)=>{

                let icon = "md-home";

                if(item.code == "1100"){
                    icon = "md-home"
                }
                else if(item.code == "2100"){
                    icon = "md-construct"

                }
                else if(item.code == "2200"){
                    icon = "md-flame"

                }
                else {
                    icon = "md-home"
                }

                return (
                    <View key={'rental_infos_' + item.code} style={{flexDirection: 'row', margin: 20, marginTop:10, width: screenWidth-50, marginLeft: 30}}>
                        <View style={{backgroundColor: GWGColors.TEXT, width: 35, height: 35, alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons
                                name={icon}
                                size={18}

                                color={"#ffffff"}
                            />
                        </View>

                        <View style={{flexDirection: 'row' ,alignContent:'stretch', justifyItems: "flex-end", marginLeft: 10}}>
                            <View style={{width: 160}}>
                                <Text style={styles.listTitle}>{item.name}</Text>
                            </View>
                            <View style={{width: 100, alignItems: "flex-end", textAlign: "right"}}>
                                <Text style={[styles.listTitle,{fontSize: 20, width: 100, textAlign: "right"}]}>{new Intl.NumberFormat('de-DE', { style: 'currency', currency: item.currency }).format(item.value)}</Text>
                            </View>
                        </View>
                    </View>

                )
            })
        }

        return (<View key={'rental_infos_'} ></View>)



    }

    const _renderListItem = ({item, index}) => {

        if(user.guest) {
            return (<View key={'g_infos_' + item.id}></View>);
        }

        if(contracts.current == null) {
            return (<View key={'c_infos_' + item.id}></View>);
        }


        if(item.type != "rental_infos") {
            return(
                <View key={'accordion_infos_' + item.id} >
                    <AccordionEasy expanded={openSection == item.type ? true:false} data={""} title={item.name} textStyle={{fontWeight: 'normal', paddingLeft: 0, marginLeft: 5, }} containerStyle={{marginLeft: 0, marginRight: 0, paddingTop: 6, borderBottomWidth: 0}}>
                        {item.data.length > 0 ?
                            <View >
                                {
                                    item.data.map((doc) => {
                                        return (
                                            _renderDocumentEntry(doc)
                                        )
                                    })
                                }
                            </View>

                            :
                            <View style={{paddingLeft: 40}}>
                                {item.type != "contract" ?
                                    <><Text style={styles.listTitle}>keine Dokumene vorhanden</Text></>
                                    :
                                    <><Button text={"Mietvertrag anfordern "} onPress={()=>goToIssues()}/></>
                                }
                            </View>

                        }

                    </AccordionEasy>
                </View>
            )
        } else {
            return (
                <View key={'d_infos_' + item.id}>
                    <View  style={{borderTopWidth: 1, borderTopColor: "#bebebe", borderTopStyle: 'solid', margin: 28, marginTop: 0, marginLeft:30, marginBottom:0, paddingTop: 20}}>
                        {/*<Headline fontSize={20} text={"Meine \nMietzusammensetzung"} headlineColor={GWGColors.HEADLINEBORDERCOLORSECONDARY}/>*/}
                        <ProfiInfoItem headlineStyle={{color: GWGColors.GWGBLUE, fontSize: 24}} containerStyle={{marginBottom: 0}} headline={"Meine Mietzusammensetzung"} />
                    </View>
                    <View key={'accordion_2_' + item.id} data={""} title={item.name} textStyle={{fontWeight: 'normal', paddingLeft: 0, marginLeft: 5 }} containerStyle={{marginLeft: 0, marginRight: 0, marginTop: 0, paddingTop: 0, paddingLeft:0,  borderBottomWidth: 0}} style={{marginLeft: 0, marginRight: 0, marginTop: 0, paddingTop: 0, paddingLeft:0,  borderBottomWidth: 0}}>
                        {contracts.current.condition != null ?
                            <View>
                                {renderRentalInfos()}

                                <View style={{ margin: 20, width: screenWidth-70, marginLeft: 30, marginBottom:0, borderBottomWidth: 1, paddingBottom: 50, borderBottomColor: "#d9d9d9"}}>
                                    <RentalCondition conditionName={"Gesamtmiete"} containerStyle={{borderTopColor: GWGColors.GWGBLUE, borderTopWidth: 1, borderBottomColor: GWGColors.GWGBLUE, borderBottomWidth: 1, paddingTop: 10, paddingBottom: 10}} nameStyle={{fontSize:22}} valueStyle={{color: GWGColors.GWGBLUE}} conditionValue={(contracts.current.condition.total ?? '--') + " €"}/>
                                    <RentalCondition conditionName={"Wohnungsgröße"} conditionValue={contracts.current.condition.flat_size ? contracts.current.condition.flat_size.substr(0,contracts.current.condition.flat_size.search(','))+ " m\xB2" :'--'}/>
                                    <RentalCondition conditionName={"Vertrags-/Geschäftspartnersaldo"} conditionValue={(contracts.current.condition.prepayment_difference !="" ? (contracts.current.condition.prepayment_difference ?? '--') :  "0") + " €"}/>
                                    {contracts.current.condition.deposit !="" ?
                                        <RentalCondition conditionName={"Kaution"} conditionValue={(contracts.current.condition.deposit !="" ? (contracts.current.condition.deposit ?? '--') :  "0") + " €"}/>
                                        :
                                        <></>
                                    }

                                </View>
                            </View>
                            :
                            <View style={{ margin: 28, marginTop: 0, marginLeft:30, marginBottom:30, paddingTop: 20}}>
                                <Text style={styles.text}>Leider sind zur Zeit keine Daten verfügbar. Bitten wenden Sie Sich an Ihren Kontakt bei der GWG.</Text>
                            </View>


                        }

                    </View>
                    <View style={{margin: 30, marginTop:20, marginBottom: 0}}>
                        {contracts.current != null?
                            <>
                                {contracts.current.customer_center  ?
                                    <>
                                        <ProfiInfoItem headlineStyle={{color: GWGColors.GWGBLUE, fontSize: 24, marginBottom: 0}} containerStyle={{marginBottom: 0}} headline={"Ihre Geschäftsstelle"} />
                                        <ProfiInfoItem  headline={""} headlineStyle={{color: GWGColors.GWGBLUE, fontSize: 1, marginBottom: 0}} containerStyle={{marginTop: 0}} text={contracts.current.customer_center.name + '\n' + contracts.current.customer_center.street + ' ' + contracts.current.customer_center.street_number + '\n' + contracts.current.customer_center.zip_code + ' '+ contracts.current.customer_center.city} />
                                    </>
                                    :
                                    <><ProfiInfoItem headline={""} text={"--"} /></>}
                            </>
                            :<></>}
                    </View>
                </View>
            );
        }

    }

    //

    const _renderDocumentEntry = (item) => {
        //console.log('dddddd',item);
        return (

            <TouchableOpacity
                key={'touchable_' + item.key}
                activeOpacity = {1}
                onPress={(event) => {
                    navigation.navigate(item.screen, item.navProps ?? {source:null})
                }}>
                <View style={[styles.row, {paddingLeft: 20}]} >
                    <View style={[styles.listTitleContainer,{width: screenWidth-120}]}><Text style={[styles.listTitle,{marginRight: 10},docId == item.key ? {color:GWGColors.GWGBLUE}:{}]}>{item.name} ({item.year})</Text></View>
                    <Feather name="chevron-right" size={24} style={[styles.listIcon]} />
                </View>
            </TouchableOpacity>
        )
    }

    const _renderListItem__ = ({item, index}) => {

        if(user.guest) {
            return (<></>);
        }

        console.log(index, item)


        if(!item.type) {
            return (

                <TouchableOpacity
                    key={'touchable_2_' + index}
                    activeOpacity = {1}
                    onPress={(event) => {
                        navigation.navigate(item['screen'], item['navProps'] ?? {source:null})
                    }}>

                    <View style={styles.row} >
                        <View style={[styles.listTitleContainer]}><Text style={[styles.listTitle]}>{item.key}</Text></View>
                        <Feather name="chevron-down" size={24} style={styles.listIcon} />
                    </View>
                </TouchableOpacity>

            )
        }
        else {
            return(
                <>
                    <AccordionEasy key={'accordion_3_ '+ item.id} data={""} title={item.key} textStyle={{fontWeight: 'normal', paddingLeft: 0, marginLeft: 5, }} containerStyle={{marginLeft: 0, marginRight: 0, paddingTop: 26, borderBottomWidth: 0}}>
                        <View>
                            {renderRentalInfos()}

                            <View style={{ margin: 20, width: screenWidth-70, marginLeft: 30, marginBottom:0, borderBottomWidth: 1, paddingBottom: 50, borderBottomColor: "#d9d9d9"}}>
                                <RentalCondition conditionName={"Gesamtmiete"} containerStyle={{borderTopColor: GWGColors.GWGBLUE, borderTopWidth: 1, borderBottomColor: GWGColors.GWGBLUE, borderBottomWidth: 1, paddingTop: 10, paddingBottom: 10}} nameStyle={{fontSize:22}} valueStyle={{color: GWGColors.GWGBLUE}} conditionValue={contracts.current.condition.total + " €"}/>
                                <RentalCondition conditionName={"Wohnungsgröße"} conditionValue={contracts.current.condition.flat_size ? contracts.current.condition.flat_size.substr(0,contracts.current.condition.flat_size.search(','))+ " m2" :' -'}/>
                                <RentalCondition conditionName={"Vertrags-/Geschäftspartnersaldo"} conditionValue={"17 €"}/>
                                {contracts.current.condition.deposit !="" ?
                                    <RentalCondition conditionName={"Kaution"} conditionValue={(contracts.current.condition.deposit !="" ? contracts.current.condition.deposit :  "0") + " €"}/>
                                    :
                                    <></>
                                }

                            </View>
                        </View>
                    </AccordionEasy>
                    <View style={{margin: 30, marginTop:0, marginBottom: 0}}>
                        {contracts.current != null?
                            <>
                                {typeof contracts.current.customer_center  != "undefined" ?
                                    <>
                                        <ProfiInfoItem  headline={""} text={"Ihr Kunden-Service-Center"} containerStyle={{marginBottom:10, marginTop:0}} />
                                        <ProfiInfoItem  headline={""} text={contracts.current.customer_center.name + '\n' + contracts.current.customer_center.street + ' ' + contracts.current.customer_center.street_number + '\n' + contracts.current.customer_center.zip_code + ' '+ contracts.current.customer_center.city} />
                                    </>
                                    :
                                    <><ProfiInfoItem headline={""} text={"--"} /></>}
                            </>
                            :<></>}
                    </View>
                </>
            )
        }

    };

    const [contractSelectLoading, setContractSelectLoading] = useState( false);
    const [currentid, setCurrentid] = useState( null);

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

    const openModal = () => {
        modalizeRef.current?.open('top');
    };

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
            {loadingScreen ?
                <>
                    <LoadingScreen />
                </>
                :
                <>
                    <View style={{backgroundColor: '#ffffff', padding:10, paddingTop: 10, flex: 1}}>
                        {user.guest ?

                            <>
                                <Guest/>
                            </>
                            :
                            <>
                                {documentsHasErrors ?
                                    <Error/> :

                                    <FlatList ref={ref}
                                              keyExtractor={(item) => Math.floor(Math.random() * 600) + 1 +'_'+item.id}
                                              ListHeaderComponent={
                                                  <>
                                                      <Headline text={"Service"}/>
                                                      {contracts.list.length > 1 ?
                                                          <View style={{}}>
                                                              <Button text={"Vertrag auswählen"} icon={"md-create"}
                                                                      onPress={() => openModal()}/>
                                                          </View>:
                                                          <></>
                                                      }
                                                      <View style={{margin: 30, marginTop: 20, marginBottom: 20, borderBottomWidth: 1, borderBottomColor: GWGColors.LIGHTERGREY, borderBottomStyle: 'solid'}}>
                                                          {contracts.current != null?
                                                              <>
                                                                  <ProfiInfoItem  headline={"Vertrag"} text={contracts.current ? (contracts.current.rental_contract)?? "-": "-"} />


                                                              </>
                                                              :<></>}

                                                      </View>
                                                      <View style={{margin: 30,marginLeft: 30, marginTop: 0, marginBottom: 0}}>
                                                          {/*<Headline fontSize={22} text={"Meine \nDokumente"} headlineColor={GWGColors.HEADLINEBORDERCOLORSECONDARY}/>*/}
                                                          <ProfiInfoItem headlineStyle={{color: GWGColors.GWGBLUE, fontSize: 24}} containerStyle={{marginBottom: 0}} headline={"Meine Dokumente"} />
                                                      </View>
                                                  </>}

                                              renderItem={_renderListItem}
                                              data={serviceScreenListData}
                                    />
                                }
                            </>
                        }

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
                                        {renderContracts()}
                                    </View>
                                }
                            </>
                        </Modalize>
                    </Portal>
                </>
            }
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
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
    },
    navigationListContainer: {
        marginBottom: 10
    },

    navigationListHeadlineContainer: {
        borderColor: "#1E3259",
        borderBottomWidth:1,
    },

    navigationListHeadline: {
        fontSize: 24,
        fontWeight: "200",
        color: GWGColors.GWGBLUE,
        paddingLeft: 30,
        marginTop: 20,
        paddingBottom: 10,

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
        padding: 10,

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
        color: "#b6b6b6"
    },
    text: {
        fontSize: 18,
        color: GWGColors.TEXT
    }
});