import React, {useEffect, useRef, useState, useCallback} from 'react';
import { View, StyleSheet, Dimensions, KeyboardAvoidingView} from "react-native";

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { GiftedChat} from 'react-native-gifted-chat'

import {GWGColors} from "../config/Colors";

import {fetchCustomerchat, sendMessage, customerchatSelector, userSelector} from '@lovecoding-it/dit-core';
import Headline from "../components/Headline";
import Guest from "../widgets/Guest";


export default function CustomerChatScreen({navigation}) {

    const dispatch = useDispatch();
    const screenWidth = Math.round(Dimensions.get('window').width);
    const screenHeight = Math.round(Dimensions.get('window').height);

    const {customerchat, customerchatLoading, customerchatHasErrors} = useSelector(customerchatSelector);
    const {user} = useSelector(userSelector);
    const [messages, setMessages] = useState([]);

    const onSend = useCallback((messages = []) => {
        //setMessages(previousMessages => GiftedChat.append(previousMessages, customerchat))
        //console.log('send',messages)
        dispatch(sendMessage({"message":messages[0].text}))

    }, [])


    useEffect(() => {
        dispatch(fetchCustomerchat())
        console.log(customerchat)
    }, [dispatch])

    return (

        <View style={styles.container}>

            {user.guest ?

                <View style={[styles.container, {padding: 10}]}>
                    <Guest/>
                </View>
                :
                <>
                    <View style={{height: 100, padding: 10, marginBottom: 20}}>
                        <Headline style={{height: 70}} text={"Nachrichten"}/>
                    </View>
                    <View style={{height: screenHeight-190, flex: 1 }}>
                        <GiftedChat
                            messages={customerchat}
                            inverted={false}
                            placeholder={"Nachricht eingeben..."}
                            timeFormat={"D.M.YYYY - HH:mm"}
                            dateFormat={"D.M.YYYY"}
                            scrollToBottom={true}

                            onSend={messages => onSend(messages)}
                            user={{
                                _id: "0064api_app_pro",
                            }}
                            sty2le={{height: screenHeight-100}}
                        />
                        {
                            Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />
                        }
                    </View>
                </>


            }


        </View>




    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        flexDirection: 'column',
        //padding: 10
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
    }
});