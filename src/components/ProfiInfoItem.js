import React from 'react';
import {View, Text} from 'react-native';

import {GWGColors} from "../config/Colors";

function ProfilInfoItem(props) {
    return (
        <View style={[{fontSize: 12, paddingLeft: 0, paddingTop: 0, paddingBottom:0, marginBottom: 20},props.containerStyle]}>
            <Text style={[{fontSize: 18, marginBottom:8 , paddingBottom:0, bottom: 0, color: GWGColors.HeadlineTextColor}, props.headlineStyle]}>{props.headline}</Text>
            <Text style={{fontSize: 20, marginBottom:8 , paddingBottom:0, bottom: 0, color: GWGColors.HeadlineTextColor}}>{props.text}</Text>
        </View>
    );
}

export default ProfilInfoItem;