import * as React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {Dimensions, Image, StyleSheet, Text} from "react-native";
import {View} from "react-native";


import { Feather } from '@expo/vector-icons';
import {BVEColors, GWGColors} from "../config/Colors";

const Colors = {
    tabIconSelected: '#1E3259',
    tabIconDefault1: '#1E3259',
    tabIconDefault: GWGColors.GWGBLUE
}

const screenWidth  = Math.round(Dimensions.get('window').width);

export default function NavigationListItem(props) {

    if(props.iconName){
        return (
            <View style={[props.containerStyles,styles.container]}>

                <View style={styles.iconContainer}>
                    <Feather  name={props.iconName} size={30}  style={styles.icon}
                              color={Colors.tabIconDefault} />
                </View>
                <View style={styles.textContainer}>
                    <View>
                        <Text style={styles.text}>{props.value}</Text>
                    </View>
                </View>
                <View style={styles.arrowContainer}>
                    <Feather name="chevron-right" size={24} color2="black" color={Colors.tabIconDefault} />
                </View>



            </View>
        );
    } else {
        return (
            <View style={[props.containerStyles,styles.container]}>
                <View style={styles.iconContainer}>
                    <></>
                </View>


                <View style={styles.textContainer}>
                    <View>
                        <Text style={styles.text}>{props.value}</Text>
                    </View>
                </View>

            </View>
        );
    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: '#fff',

        //justifyContent: 'flex-start',
        alignItems: 'center',
        width: screenWidth,
        padding: 10,
        paddingLeft: 30,
        paddingRight: 20,
        borderColor: "#1E3259",
        borderBottomWidth:1

    },

    iconContainer: {
        width: 40
    },

    icon: {
        width: 50
    },
    textContainer: {
        flex: 1,
    },
    headline: {
        fontSize: 12,
        //color: "#5b5b5b",
        fontWeight: "800",
        color: "#1E3259",
        paddingTop: 5

    },
    text: {
        fontSize: 18
    },
    arrowContainer: {
        alignSelf:"flex-end"
    }


})