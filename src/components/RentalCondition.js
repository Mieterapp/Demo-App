import * as React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {Dimensions, Image, StyleSheet, Text, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback} from "react-native";
import {View, Keyboard} from "react-native";


import { Feather } from '@expo/vector-icons';
import {GWGColors}  from "../config/Colors";

const screenWidth  = Math.round(Dimensions.get('window').width);

export default function RentalCondition(props) {

    return (
        <>
            <View style={[props.containerStyle,{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20}]}>
                <View style={{width: 200}}><Text style={[styles.text, props.nameStyle]}>{props.conditionName}</Text></View>
                <View><Text style={[styles.text, props.valueStyle]}>{props.conditionValue}</Text></View>
            </View>
        </>

    );
}

const styles = StyleSheet.create({
    text:{
        fontSize: 18,
        color: GWGColors.TEXT
    }
});