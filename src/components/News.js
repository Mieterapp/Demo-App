import React from 'react';
import {View, Text, StyleSheet, Linking, Image, Dimensions} from "react-native";
import Headline from "./Headline";
import {GWGColors} from "../config/Colors";

const screenWidth = Math.round(Dimensions.get('window').width);

export default function News(props) {

    return (
        <View style={[styles.container, props.style]}>

            <Headline text={props.data.title}/>
            {props.data.documents !== "" ?
                <>
                    <Image source={{
                        uri: props.data.documents
                    }} style={styles.image} />
                </>
                :
                <></>

            }


            <Text style={[styles.text, props.textStyle]}>
                {props.data.text}
            </Text>
            { props.data.href ? (
            <><Text
                style={styles.hyperlinkStyle}
                onPress={() => {
                    Linking.openURL(props.data.href);
                }}>
                mehr erfahren
            </Text></>): <></>}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        padding: 10,
        marginTop: 10,
    },
    headline: {
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 10

    },
    image: {
        width: screenWidth-20,
        height: 300,
        //borderWidth: 1,
        marginBottom: 10
    },
    text: {
        fontSize: 18,
        color: GWGColors.TEXT
    },
    hyperlinkStyle: {
        color: GWGColors.GWGBLUE,
        fontSize: 18,
        paddingTop: 10,
        paddingBottom: 20
    },
});