import React, {useEffect, useRef, useState} from 'react';
import { Modalize } from 'react-native-modalize';
import ButtonIcon from "../components/ButtonIcon";
import {View, Text, Dimensions} from "react-native";
import Touchable from "../components/Touchable";
import {GWGColors} from "../config/Colors";
import {Ionicons} from "@expo/vector-icons";
import LoadingScreen from "../screens/LoadingScreen";
import {Portal} from "react-native-portalize";
import {useDispatch, useSelector} from "react-redux";
import {fetchContracts, fetchContract, contractsSelector} from '@lovecoding-it/dit-core';
const screenWidth = Math.round(Dimensions.get('window').width);
export default function SelectContracts(props) {

    const modalizeRef = useRef();
    const dispatch = useDispatch()

    const openModal = () => {
        modalizeRef.current?.open('top');
    };

    const {contracts, loading, hasErrors, loadingCurrent, hasErrorsCurrent} = useSelector(contractsSelector);
    const [currentid, setCurrentid] = useState( null);
    const [contractSelectLoading, setContractSelectLoading] = useState( false);

    const wait = (timeout) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }

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
                <Touchable onPress={setContract(contract.id)} key={contract.id}>
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
                            <Text style={{ color: GWGColors.TEXT}}>{contract? contract.code ?? "-": "-"}</Text>
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


