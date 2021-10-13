import React from 'react';
import {View, Text} from 'react-native';

import {GWGColors} from "../config/Colors";

function Headline(props) {
    return (
        <View style={{fontSize: 35, marginBottom: 40, minHeight: 80, paddingLeft: 20, paddingTop: 0, paddingBottom:0, borderLeftWidth: 7, borderLeftColor: ( props.headlineColor ?? GWGColors.HeadlineBorderColor ),
            display: "flex",
            flex:1,
            justifyContent: "flex-end"}}>
            <Text style={{fontSize: props.fontSize ?? 32, marginBottom:-4 , paddingBottom:0, bottom: 0, color:  GWGColors.HeadlineTextColor, textTransform: 'uppercase'}}>{props.text}</Text>
        </View>
    );
}

export default Headline;