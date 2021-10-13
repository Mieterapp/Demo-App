import * as React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {Dimensions, Image, StyleSheet, Text, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback} from "react-native";
import {View, Keyboard} from "react-native";


import { Feather } from '@expo/vector-icons';
import {GWGColors}  from "../config/Colors";

const screenWidth  = Math.round(Dimensions.get('window').width);

export default function Input(props) {

        return (
            <>
                <Text>{props.headline}</Text>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <TextInput
                    ref={props.refData}
                    value={props.value}
                    autoCompleteType={props.autoCompleteType}
                    returnKeyType={'next'}
                    onChangeText={props.onChangeText}

                    keyboardType={props.keyboardType}
                    autoCapitalize = 'none'
                    textContentType= {props.textContentType}
                    autoCorrect={false}
                    placeholder={props.placeholder}
                    placeholderTextColor = 'grey'
                    style={[styles.input, {}]}
                />
                </TouchableWithoutFeedback>
            </>

        );
}


const styles = StyleSheet.create({
    container: {
    },
    inputWrapper: {},
    input: {
        borderWidth: 1,
        borderRadius: 0,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginBottom: 22,
        marginTop: 6,
        fontSize: 20,
        borderColor: GWGColors.InputBorderColor,
        zIndex: 30, // works on ios
        elevation: 30, // works on android

    },

});