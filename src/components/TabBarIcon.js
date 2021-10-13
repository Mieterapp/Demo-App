import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';

//import Colors from '../constants/Colors';

const Colors = {
    tabIconSelected: '#005ca9',
    tabIconDefault: '#9f9f9f'
}

export default function TabBarIcon(props) {
    return (
        <Ionicons
            name={props.name}
            size={30}
            style={{ marginBottom: -13}}
            color={props.focused ? Colors.tabIconSelected: Colors.tabIconDefault}
        />
    );
}
