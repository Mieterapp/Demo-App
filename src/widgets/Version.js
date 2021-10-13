import React, {useState} from "react";
import {
    StyleSheet,
    View,
    Text,
} from "react-native";
import Constants from "expo-constants";
import Touchable from "../components/Touchable";
import {GWGColors} from "../config/Colors";
import {useNavigation} from "@react-navigation/native";
import Button from "../components/Button";

const Version = () => {


    const navigation = useNavigation();

    const [tapped, setTabbed] = useState(0);

    const version = Constants.nativeAppVersion;
    const build = Constants.nativeBuildVersion;
    const deviceID = Constants.deviceId;
    const platfrom = Constants.platform;


    //4console.log(Constants.manifest);

    return (
        <View style={styles.container}>
            <Touchable onPress={() => setTabbed(tapped+1)}>
            <View>
                <Text style={{color: GWGColors.TEXT}}>v{Constants.manifest.version}({platfrom.ios ? Constants.manifest.ios.buildNumber : Constants.manifest.android.versionCode})</Text>
            </View>

            {tapped >= 3 &&
            <View style={{marginTop: 10}}>
                <Text style={{color: GWGColors.TEXT}}>DEVICE_ID: {deviceID}</Text>
                {platfrom.ios &&
                    <View style={{marginTop: 10}}>
                        <Text style={{color: GWGColors.TEXT}}>OS: IOS</Text>
                        <Text style={{color: GWGColors.TEXT}}>MODEL: {platfrom.ios.model}</Text>
                        <Text style={{color: GWGColors.TEXT}}>VERSION: {platfrom.ios.systemVersion}</Text>

                    </View>
                }

                {platfrom.android &&
                <View style={{marginTop: 10}}>
                    <Text style={{color: GWGColors.TEXT}}>OS: ANDROID</Text>
                    <Text style={{color: GWGColors.TEXT}}>MODEL: {platfrom.android.model}</Text>
                    <Text style={{color: GWGColors.TEXT}}>VERSION: {platfrom.android.systemVersion}</Text>
                </View>
                }
                <Button text={"Debug"} onPress={()=>navigation.navigate('Debug')}/>
            </View>
            }


            </Touchable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 30,
        justifyContent: "center",
        alignContent: "center"
    }
})

export default Version;
