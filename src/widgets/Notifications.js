import React, {useEffect, useState} from "react";

import Constants from "expo-constants";
import * as Permissions from "expo-permissions";

import AsyncStorage from '@react-native-async-storage/async-storage';

import {Notifications} from 'expo';
import {postDevice, deviceSelector, userSelector, getDevice} from '@lovecoding-it/dit-core';
import {useSelector} from "react-redux";
import { useDispatch } from 'react-redux';
import {useNavigation} from "@react-navigation/native";


export default function Notification(props) {
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const {user} = useSelector(userSelector);
    const {device} = useSelector(deviceSelector);


    const [createnew, setCreatenew] = useState(true);


    function toHex(str) {
        var result = '';
        for (var i=0; i<str.length; i++) {
            result += str.charCodeAt(i).toString(16);
        }
        return result;
    }


    const _handleNotification = notification => {

        if(notification && notification.data && notification.data.type) {

            if(notification && notification.data.type == 'Chat') {
                navigation.navigate('CustomerChatScreen');
            }

            if(notification && notification.data.type == 'Doc') {
                if(notification.data.doc_id){
                    navigation.navigate('Service',{docId: notification.data.doc_id});
                }
                else {
                    navigation.navigate('Service');
                }

                //navigation.navigate('ChatScreen', { chatId: notification.data.ticket_id });
            }
            //requested-issue-chat
            if(notification && notification.data.type == 'News') {
                navigation.navigate('Home');
            }
        }

        Notifications.setBadgeNumberAsync(0);
    }


    const checkDevice = async (device) => {
        const {status} = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        console.log("SCHECK DEVICE TATUS NOTIFI: ", status);
        //alert('test status'+  JSON.stringify(status));
        let create = true;

        if(status == "granted") {

            if (Constants.appOwnership == "expo") {
                //var pushToken = await Notifications.getExpoPushTokenAsync()
                //var pushToken = await Notifications.getDevicePushTokenAsync();
                //console.log(pushToken);
                //pushToken = null;


            }

            var pushToken = await Notifications.getDevicePushTokenAsync();
            let c =0;

            /*if(Platform.OS === 'ios') {
                pushToken = pushToken.data;
            } else {
                if(pushToken.config && pushToken.config.gcmSenderId) {
                    pushToken = pushToken.config.gcmSenderId;
                }
            }*/


            //alert("newToken: " +  JSON.stringify(pushToken))

            //alert("newToken: " +  JSON.stringify(pushToken) + ' ' + JSON.stringify(create) + '  ' +JSON.stringify(createnew) )


            device.forEach((d) => {
                //alert(c+' test P'+  JSON.stringify(pushToken.data)+' == '+d.registration_id);
                const testToken = pushToken.data ?? pushToken;
                if(pushToken.data == d.registration_id) {
                    create = false;
                    //return true;
                }
                c++;
            });

            if(create && createnew){
                //alert('create device');
                setCreatenew(false);
                deviceUpdate();
            }

            //deviceUpdate();
            //return false;
        }
        else {
            //alert(1)
        }


        return create;
    };

    const deviceUpdate = async () => {
        //console.log('deviceUpdate')
        if(Constants.isDevice || Constants.appOwnership == "standalone") {

            const {status} = await Permissions.getAsync(Permissions.NOTIFICATIONS);
            console.log("STATUS NOTIFI: ", status);
            if(status != 'granted') {

            } else {
                //Notifications.addListener(_handleNotification);
                if (Constants.appOwnership == "expo") {
                    var pushToken = await Notifications.getExpoPushTokenAsync()
                    //var pushToken = await Notifications.getDevicePushTokenAsync();
                    alert(pushToken);

                } else {
                    try {
                        var pushToken = await Notifications.getDevicePushTokenAsync();
                        //var pushToken = Notifications.getDevicePushTokenAsync();
                    } catch (e) {
                        //alert(e)
                    }
                }
            }

            //alert("Token: " +  JSON.stringify(pushToken))

            if (props.showAlert) {
                //alert(JSON.stringify(pushToken));
            }

            //
            var deviceInfo = {
                registration_id: pushToken.data,
                name: Constants.deviceName,
                device_id: Constants.deviceId,
                application_id: "",
                device_year_class: Constants.deviceYearClass,
                native_app_version: Constants.nativeAppVersion,
                native_build_version: Constants.nativeBuildVersion,
                installation_id: Constants.installationId
            };

            var type = "apns";
            var deviceId = Constants.deviceId;

            var pushObj = {
                registration_id: pushToken.data ?? pushToken,
                name: Constants.deviceName,
                device_id: deviceId,
                application_id: "",
                device_year_class: Constants.deviceYearClass,
                native_app_version: Constants.nativeAppVersion,
                native_build_version: Constants.nativeBuildVersion,
                installation_id: Constants.installationId
            }

            if (Constants.platform.android) {
                type = "gcm"
                deviceId = '0x1031af3b';
                pushObj = {
                    registration_id: pushToken.data ?? pushToken,
                    name: Constants.deviceName,
                    device_id: deviceId,
                    application_id: "",
                    device_year_class: Constants.deviceYearClass,
                    native_app_version: Constants.nativeAppVersion,
                    native_build_version: Constants.nativeBuildVersion,
                    installation_id: Constants.installationId,
                    cloud_message_type: "FCM"
                }
            }

            await dispatch(postDevice(pushObj, type))
                .then(response => {

                    AsyncStorage.setItem('pushtoken', JSON.stringify(pushToken))
                    //alert("Token: " +  JSON.stringify(pushToken))

                    if(props.showAlert) {
                        //alert("Token: " + pushToken)

                    }
                })
                .catch(error => {
                    if(props.showAlert) {
                        //alert("Token: " + error)
                    }
                });
            //update the device info state

        }
    }
    /*useEffect(() => {
        if(createnew){
            (async () => {
                //await deviceUpdate();
                var type = "apns";
                if (Constants.platform.android) {
                    type = "gcm"
                }
                await AsyncStorage.getItem('pushtoken').then(response => {
                    console.log('DEVICE push',response)
                    alert('create new')
                    //if(response == null) {
                    //deviceUpdate();
                    //}
                }).catch(error => {
                    console.log(error)
                })
            })();
        }
    },[createnew]);*/



    useEffect(() => {
        //console.log('add')
        //alert('add')
        Notifications.addListener(_handleNotification);
    },[dispatch]);

    useEffect(() => {
        //console.log('notifi',user.data);
        if(user.data != null){
            var type = "apns";
            if (Constants.platform.android) {
                type = "gcm"
            }
            dispatch(getDevice(type));
        }
    },[user.data]);

    useEffect(()=>{
        //alert('d' + JSON.stringify(device))
        if(device != null){
            //if(device.length < 1){
                (async () => {
                    await checkDevice(device).then(response => {
                        //alert('DEVICE push response '+JSON.stringify(response))

                    }).catch(error => {
                        console.log(error)
                    })

                })();
            //}

        }


    },[device])

    return (
        <></>
    );

}