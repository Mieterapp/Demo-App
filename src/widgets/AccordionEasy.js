import React,{ useState } from 'react';
import {Image, StyleSheet, View, Text, TouchableOpacity, LayoutAnimation, FlatList, Dimensions} from "react-native";
import {Feather, Ionicons} from '@expo/vector-icons';

import NavigationListItem from "../components/NavigationListItem";
import {useNavigation} from "@react-navigation/native";
import {GWGColors} from "../config/Colors";
const screenWidth = Math.round(Dimensions.get('window').width);

export default function AccordionEasy(props) {


    const navigation = useNavigation();

    const [data, setData] = useState(props.data);
    const[expanded, setExpanded] = useState(props.expanded ?? false);



//    setData(props.data);
 //   setExpanded(false);

    /*const state = {
        data: props.data,
        expanded : false,
    }*/

    const _toggleExpand=()=>{
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(expanded ? false : true)
    }

    return (
        <View style={[ {backgroundColor: '#ffffff',
            borderBottomColor: "#bebebe", borderBottomStyle: 'solid', paddingBottom: 10, borderBottomWidth: 1, width: screenWidth-40, marginLeft: 20, marginBottom: 20}, props.containerStyle]}>
            <TouchableOpacity style={styles.row} onPress={()=>_toggleExpand()}>
                <Text style={[styles.title, props.textStyle]}>{props.data.title ?? props.title ?? ''}</Text>
                {expanded == false &&
                <Feather name="chevron-down" size={24} style={styles.icon} color="black"/>
                }
                {expanded &&
                <Feather name="chevron-up" size={24} style={styles.icon} color="black"/>
                }
            </TouchableOpacity>
            <View style={styles.parentHr}/>
            {
                expanded &&
                <View style={{}}>
                    {props.children ?
                        <>{props.children}</>
                        :
                        <><Text style={styles.text}>{props.data.text}</Text></>
                    }
                </View>
            }

        </View>

    );
}

const styles = StyleSheet.create({
    title:{
        fontSize: 18,
        fontWeight:'bold',
        color: GWGColors.TEXT,
        width: screenWidth-100,
        marginBottom: 20
    },
    row:{
        flexDirection: 'row',
        justifyContent:'space-between',


        paddingLeft:25,
        paddingRight:18,
        alignItems:'flex-start',
        backgroundColor: 'transparent',

    },
    text: {
        fontSize: 18,
        paddingLeft: 35,
        paddingRight: 35,
        marginBottom: 30,
        color: GWGColors.TEXT
    },
    icon: {
        borderWidth: 1.4,
        borderColor: "#b6b6b6",
        color: "#b6b6b6"

    },
    parentHr:{
        height:1,
        color: GWGColors.GWGBLUE,
        width:'100%'
    },
    child:{
        backgroundColor: GWGColors.GWGBLUE,
        padding:16,
    }

});