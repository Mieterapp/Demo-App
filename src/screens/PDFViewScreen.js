import React, {useEffect, useRef, useState} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    ActivityIndicator, TouchableOpacity, Image, Platform
} from "react-native";

import * as Sharing from 'expo-sharing';

import WebView from "react-native-webview";
import PDFReader from 'rn-pdf-reader-js'

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import * as SecureStore from "expo-secure-store";

import * as FileSystem from 'expo-file-system';
import _ from 'lodash'

import {fetchDocument, documentsSelector} from '@lovecoding-it/dit-core';
import {GWGColors} from "../config/Colors";
import {useDropDown} from "../widgets/DropdownProvider";
import {Ionicons} from "@expo/vector-icons";
import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay';

export default function PDFViewScreen({route, navigation}) {

    const dispatch = useDispatch()

    const { ref } = useDropDown();

    const screenWidth = Math.round(Dimensions.get('window').width);
    const screenHeight = Math.round(Dimensions.get('window').height);
    const { source, doc } = route.params;
    const {documents, documentsLoading, documentsHasErrors} = useSelector(documentsSelector)
    const [token, setToken] = useState(null);
    //const [url, setUrl] = useState("https://dwapp-0064-test.datasec.de" + source);
    const [url, setUrl] = useState("https://dwapp-demo.datasec.de" + source);
    const [loading, setLoading] = useState(true);

    const [content, setContent] = useState('');

    const getToken = async () => {
        return await SecureStore.getItemAsync('secure_token');
    };

    const wait = (timeout) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }

    const onShare = async () => {

        var fileName = _.deburr(doc.name.replace(/[\\.\\s\\-]/gm,'_'));
        fileName = fileName.replace(' ','_');
        //var fileName = doc.name;
        //setLoading(true);

        try {
            setLoading(true);
            FileSystem.downloadAsync(
                url,
                FileSystem.documentDirectory + fileName + '.pdf',
                {
                    headers: {
                        'Authorization': ('JWT '+token),
                    }
                }
            )
                .then(({ uri }) => {
                    console.log('Finished downloading to ', uri);

                    (async () => {

                        /*try {
                            const result = await Share.share({
                                //message:  uri,
                                title: "test",
                                url: cUri

                            });
                            if (result.action === Share.sharedAction) {

                                ref.current.alertWithType("success", 'Dokument','Das Dokument '+doc.name+' wurde geteilt.', null, 1500);

                                if (result.activityType) {
                                    // shared with activity type of result.activityType
                                } else {
                                    // shared
                                }

                                //await FileSystem.deleteAsync(uri);
                                wait(500).then(async() => {
                                    setLoading(false);
                                    await FileSystem.deleteAsync(uri)
                                });

                            } else if (result.action === Share.dismissedAction) {
                                // dismissed
                                wait(500).then(async() => {
                                    setLoading(false);
                                    await FileSystem.deleteAsync(uri)
                                });
                            }
                        } catch (error) {
                            alert(error.message);
                        }*/

                        try {

                            Sharing.shareAsync(uri).done(() => {
                                console.log('done')
                                wait(500).then(async() => {
                                    setLoading(false);
                                    await FileSystem.deleteAsync(uri)
                                });
                            })

                        }catch (e) {
                            alert(error.message);
                        }

                    })();

                })
                .catch(error => {
                    console.error(error);
                });
        }
        catch (e) {

        }

    };

    const getTokenForWeb =() =>{
        (async () => {
            const t = await getToken();
            setToken(t);
        })();
    }

    getTokenForWeb()

    const PdfReader = ({ url: uri }) => <WebView style={{ flex: 1, height: 200, width: 200 }}
                                                  source={{ uri, headers: {
                                                          'Authorization': ('JWT '+token),
                                                      } }} renderLoading={() => {<Text> Loading </Text>}} />

    const handlePageLoad = navState => {
        console.log(navState);
        //setUrl(navState.url+"1" );
        return true;
    }

    if(token !== null){
        return (
            <>
                {Platform.OS == 'ios' ?
                    <WebView
                        onLoadEnd={()=>setLoading(false)}
                        r2enderLoading={() => {return (<View style={{backgroundColor:'transparent', position: 'absolute', top: 10, width: screenWidth}}><ActivityIndicator color={GWGColors.GWGBLUE} size='large' /></View>)}}
                        start3InLoadingState={true}
                        style={{height: screenHeight, width: screenWidth}}
                        source={{uri: url, headers: {
                                'Authorization': ('JWT '+token),
                            }}}/>
                :
                    <PDFReader
                        onLoadEnd={()=>setLoading(false)}
                        source={{uri: url, headers: {
                                'Authorization': ('JWT '+token),
                            }}}
                    />
                }

                <TouchableOpacity onPress={onShare} style={{backgroundColor: '#ffffff', flexDirection: 'row', height: 60, justifyContent: 'center', alignItems: 'center', borderTopWidth: 1, borderTopColor: GWGColors.LIGHTERGREY}}>
                    <Ionicons name={"ios-share"} size={28} color={GWGColors.BUTTONCOLOR}/><Text style={{marginLeft: 5, color: GWGColors.BUTTONCOLOR}}>Dokument teilen</Text>
                </TouchableOpacity>
                <OrientationLoadingOverlay
                    visible={loading}
                    color="white"
                    indicatorSize="large"
                    messageFontSize={24}
                    message="Lade Dokument"
                />

            </>

        );
    }
    else {
        return (
            <></>
        )
    }
}

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
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
    }
});