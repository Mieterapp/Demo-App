import React,{ useState } from 'react';
import {Image, StyleSheet, View, Text, TouchableOpacity, LayoutAnimation, FlatList} from "react-native";
import {Feather, Ionicons} from '@expo/vector-icons';

import NavigationListItem from "../components/NavigationListItem";
import {useNavigation} from "@react-navigation/native";
import {GWGColors} from "../config/Colors";

export default function Accordion(props) {


    const navigation = useNavigation();

    const [data, setData] = useState(props.data);
    const[expanded, setExpanded] = useState(false);


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
        <View style={{backgroundColor: '#ffffff'}}>
            <TouchableOpacity style={styles.row} onPress={()=>_toggleExpand()}>
                <Text style={[styles.title]}>{props.title}</Text>
                {expanded == false &&
                <Feather name="chevron-right" size={24} color="black"/>
                }
                {expanded &&
                <Feather name="chevron-down" size={24} color="black"/>
                }
            </TouchableOpacity>
            <View style={styles.parentHr}/>
            {
                expanded &&
                <View style={{}}>
                    <FlatList
                        data={data}
                        numColumns={1}
                        scrollEnabled={false}
                        renderItem={({item, index}) =>
                            <TouchableOpacity
                                activeOpacity = {1}
                                onPress={(event) => {
                                    navigation.navigate(item.screen)
                                }}>
                                <View>
                                    <NavigationListItem iconName={item.icon} valueHeadline={""} value={item.title}/>
                                    <View style={styles.childHr}/>
                                </View>
                            </TouchableOpacity>
                        }/>
                </View>
            }

        </View>

    );
}
const styles = StyleSheet.create({
    title:{
        fontSize: 20,
        //fontWeight:'bold',
        color: GWGColors.GWGBLUE
    },
    row:{
        flexDirection: 'row',
        justifyContent:'space-between',
        height:56,
        paddingLeft:25,
        paddingRight:18,
        alignItems:'center',
        backgroundColor: GWGColors.GWGBLUE,
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