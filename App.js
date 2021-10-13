import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useRef, useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ErrorBoundary from 'react-native-error-boundary'

import * as Permissions from "expo-permissions";
import {usePermissions} from "expo-permissions";
import Constants from 'expo-constants';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
//import ditStore from '@lovecoding-it/dit-core';
import store from './dit/core/src/store';
import {ThemeContextProvider} from "./src/themes/ThemeProvider";
import {DitProvider} from "@lovecoding-it/dit-core";

import {DropdownProvider, useDropDown} from './src/widgets/DropdownProvider';

import * as Font from 'expo-font';

import MainStackNavigator from './src/navigation/AppNavigator'
import ErrorScreen from "./src/screens/ErrorScreen";
import {LocaleContextProvider} from "./src/locales/localProvider";
import DeepLinking from 'react-native-deep-linking'
//console.log(store);
import config from "./src/config/config";

import * as Linking from 'expo-linking';
import {NavigationContainer} from "@react-navigation/native";
import { Host, Portal } from 'react-native-portalize';

import * as Sentry from 'sentry-expo';
if(Constants.appOwnership == 'standalone' || (Constants.appOwnership == 'expo' && config.sentry.enableInExpoClient)) {
   /* Sentry.init({
        dsn: config.sentry.dsn,
        enableInExpoDevelopment: config.sentry.enableInExpoDevelopment,
        debug: config.sentry.debug,
        ignoreErrors: []
    });*/
}


//const prefix = Linking.makeUrl('/');

export default function App() {

    const [permission, askForPermission] = usePermissions(Permissions.NOTIFICATIONS, {ask:true})

    //const navRef = useRef();
    const navigationRef = React.createRef();

    const [turl, setTurl] = useState("");

    //const navigation = useNavigation();

    const URL_SCHEMES = [
        'exp://',
        'demoapp://',
    ];

    const [initRoute, setInitRoute] = useState();

    for (let scheme of URL_SCHEMES) {
        DeepLinking.addScheme(scheme);
    }

    // configure a route, in this case, a simple Settings route
    DeepLinking.addRoute('127.0.0.1:19000/--/profile', (response) => {
        navigationRef.current.navigate("SearchScreen");
        //setInitRoute("SearchScreen")
    });

    const handleOpenURL3 = (event) => {
        DeepLinking.evaluateUrl(event.url);
    }

    const handleOpenURL = ({ url }) => {
        setTurl(url);
        Linking.canOpenURL(url).then((supported) => {
            if (supported) {
                console.log(DeepLinking.evaluateUrl(url));
            }
        });
    }

    //console.log(Linking.makeUrl('profile'))
    useEffect(() => {

        Linking.addEventListener('url', handleOpenURL);
        return (() => {
            Linking.removeEventListener('url', handleOpenURL);
        })
    }, []);


  const errorHandler = (error, stackTrace) => {}
  //const loadResourcesAsync = async () => {}
// evaluate every incoming URL

    const linking = {
        prefixes: ['https://dwapp-demo.datasec.de', 'demoapp://'],
        config: {
            screens: {
                VerifyAccount: 'verify/:token',
                PasswordReset: 'reset/:token',
            },
        },
    };


  return (
      <ErrorBoundary onError={errorHandler} FallbackComponent={ErrorScreen}>
          <Provider store={store}>
              <DropdownProvider>
                <DitProvider>
                    <LocaleContextProvider>
                      <ThemeContextProvider>
                          <Host>
                              <StatusBar style={"dark"}/>
                        <SafeAreaProvider >
                            <NavigationContainer linking={linking}  ref={navigationRef} style={{backgroundColor: "#ffffff"}}>
                                <MainStackNavigator  fallback={<Text>Loading...</Text>}  />
                            </NavigationContainer>
                        </SafeAreaProvider>
                          </Host>
                      </ThemeContextProvider>
                    </LocaleContextProvider>
                </DitProvider>
              </DropdownProvider>
          </Provider>
      </ErrorBoundary>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
