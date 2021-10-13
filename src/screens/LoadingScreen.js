import React, {useEffect} from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import {GWGColors} from "../config/Colors";
export default function LoadingScreen() {
    return (
        <View style={styles.container}>
            <ActivityIndicator color={GWGColors.GWGBLUE} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
    },
});