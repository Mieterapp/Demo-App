import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import * as Localization from 'expo-localization';
import { Ionicons } from '@expo/vector-icons';

const trans = {
    en: { line1: 'Ops, there was a bug!', line2: 'We will get rid of it soon.', line3: 'Hier geht`s zurück zur App:', button: 'Restart' },
    de: { line1: 'Entschuldigung, hier ist ein Fehler aufgetreten.', line2: 'Wir arbeiten daran, diesen schnell zu beheben.', line3: 'Hier geht`s zurück zur App:', button: 'Neustart' },
};

//import Icon from "../components/Icon";

export default function ErrorScreen({error, resetError}) {

    const [tapError, setTapError] = useState(0);

    const locale = Localization.locale.substr(0,2);

    return (
        <View style={[styles.container, {backgroundColor: '#e9503a'}]}>
            <>
                <View style={[styles.closeWrapper, {top: 20, right: 0}]}>
                    <TouchableOpacity onPress={() => resetError()}>
                        <Ionicons name="ios-close-circle" size={30} color={'#fff'} style={{padding: 20}} />

                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => resetError()}>
                    <View style={[styles.iconWrapper, {borderColor: '#fff'}]}>
                        <Ionicons name="ios-bug" size={60} color={'#fff'} style={{padding: 0}} />

                    </View>
                </TouchableOpacity>
                <Text style={[styles.text, {color: '#fff'}]}>{trans[locale]['line1']}</Text>
                <Text style={[styles.text, {color: '#fff'}]}>{trans[locale]['line2']}</Text>
                <Text style={[styles.text, {color: '#fff', marginTop: 60}]}>{trans[locale]['line3']}</Text>

                <TouchableOpacity onPress={() => resetError()}>
                    <View style={[styles.button]}>
                        <Text style={[styles.text, {color: '#333'}]}>{trans[locale]['button']}</Text>
                    </View>
                </TouchableOpacity>

                <View style={{marginTop: 20, height: 80, justifyContent: 'flex-end'}}>
                    {tapError >= 3 &&
                    <Text style={[styles.text, {color: '#fff', paddingHorizontal: 30}]}>{error.toString()}</Text>
                    }
                </View>
            </>

            <TouchableWithoutFeedback onPress={() => setTapError(tapError+1)}>
                <View style={[styles.errorBox]}/>
            </TouchableWithoutFeedback>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeWrapper: {
        position: 'absolute',
    },
    iconWrapper : {
        marginBottom: 50,
        width: 86,
        height: 86,
        borderRadius: 43,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
    errorBox: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: 150,
        height: 150,
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 10
    },
    button: {
        marginTop: 10,
        backgroundColor: '#fff',
        paddingHorizontal: 60,
        paddingVertical: 20,
        borderColor: 'transparent',
        borderWidth: 1,
        borderRadius: 8
    }
});

