import * as React from 'react'
import { Text, View, StyleSheet, Button, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import BottomTabNavigator from './BottomTabNavigator';

import HomeScreen   from "../screens/HomeScreen";
import LoginScreen  from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ResetPasswortScreem from "../screens/ResetPasswordScreen";
import VerifyAccountScreen from "../screens/VerifyAccountScreen";
import CustomerChatScreen from "../screens/CustomerChatScreen";
import LegalScreen from "../screens/LegalScreen";
import PDFViewScreen from "../screens/PDFViewScreen";
import IssueDetailScreen from  "../screens/IssueDetailScreen";
import IssueHistoryScreen from "../screens/IssueHistoryScreen";
import SearchScreen from "../screens/SearchScreen";
import ServiceScreen from "../screens/ServiceScreen";
import RealsEstateOffersScreen from "../screens/RealEstateOffersScreen";
import DebugScreen from "../screens/DebugScreen";

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { connect } from 'react-redux';

import {userSelector} from '@lovecoding-it/dit-core';
import {isAuthenticated} from '@lovecoding-it/dit-core';
import {useEffect, useState} from "react";
import LoadingScreen from "../screens/LoadingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {GWGColors} from "../config/Colors";
import DeepLinking from "react-native-deep-linking";
import * as Linking from "expo-linking";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBarIcon from "../components/TabBarIcon";
/*
const AuthStack = createStackNavigator({
    Login: LoginScreen
    }, {
    initialRouteName: 'Login',
    defaultNavigationOptions: {
        title: null,
        headerBackTitle: '',
        headerTruncatedBackTitle: '',
        header: (props) => {
            return null
        }
    }
});*/



const isLoggedIn = false;
const Stack = createStackNavigator()

function MainStackNavigator() {


    //const user = null;

    const dispatch = useDispatch()
    const { user } = useSelector(state => state.user)

    const [isLoadingComplete, setLoadingComplete] = useState(false);
    const [isAuth, setIsAuth ] = useState(false);
    //dispatch(isAuthenticated());

    useEffect(() => {
        const bootstrapAsync = async () => {
            try {

                const userStorage = await AsyncStorage.getItem('user')

                /*setTimeout(()=>{
                    if(user.data !== null) {
                        setIsAuth(true)
                    }

                    setLoadingComplete(true);
                },1000)*/

                if (userStorage) {
                    setIsAuth(true);
                }
                else {
                    setIsAuth(false);
                }



                setLoadingComplete(true)

            } catch (e) {
                // Restoring token failed
            }

        };
        bootstrapAsync().then(() => {});
    }, [user]);


    //const { user } = useSelector(userSelector)
    const Tab = createBottomTabNavigator();

    const return2 =  (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name={"Home"} component={HomeScreen} options={{
                    tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-home" />,
                }} />
                <Tab.Screen name="Service" component={ServiceScreen}
                            options={{
                                tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-list" />,
                            }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    )

    return  (
        <>

            {!isLoadingComplete ?
                <LoadingScreen />

                :

                <Stack.Navigator  >
                    {isAuth || (user.guest ?? false) ? (
                        <>
                            <Stack.Screen name='Home' component={BottomTabNavigator}

                                          options={({ navigation, route }) =>({
                                              headerHeight: 100,
                                              headerTitle: '',
                                              headerLeft: () => (
                                                  <View>
                                                      <Image source={require('../../assets/white.png')} style={{width: 90,marginLeft: 20,  resizeMode: 'contain', }} />
                                                  </View>

                                              ),
                                              headerRight: () => (
                                                  <View style={{ flex: 1, flexDirection: "row", width: 95, justifyContent: "space-between", alignItems: "center", marginRight: 10, marginTop: 10}}>
                                                      <View style={{borderColor: GWGColors.BUTTONCOLOR, borderWidth:2, borderStyle: 'solid', borderRadius:30,  width: 45, height: 45, alignItems: 'center', justifyContent: 'center', backgroundColor: GWGColors.WHITE}}>
                                                          <Ionicons
                                                              name={"md-search"}
                                                              size={25}
                                                              onPress={() =>
                                                                  navigation.navigate('SearchScreen')
                                                              }
                                                              color={GWGColors.BUTTONCOLOR}

                                                          />
                                                      </View>

                                                      <View style={{borderColor: GWGColors.BUTTONCOLOR, borderWidth:2, borderStyle: 'solid', borderRadius:30,  width: 45, height: 45, alignItems: 'center', justifyContent: 'center', backgroundColor: GWGColors.WHITE}}>
                                                          <Ionicons
                                                              name={"md-chatbubbles"}
                                                              size={25}
                                                              onPress={() =>
                                                                  navigation.navigate('CustomerChatScreen', { name: 'Jane' })
                                                              }
                                                              color={GWGColors.BUTTONCOLOR}
                                                          />
                                                      </View>
                                                  </View>
                                              ),
                                              headerStyle: {height: 130}
                                          })}

                            />
                            <Stack.Screen name={"SearchScreen"} options={({ navigation, route }) =>({
                                headerTitle: '',headerTruncatedBackTitle: 'zurück',
                            })} component={SearchScreen}/>
                            <Stack.Screen name={"CustomerChatScreen"} options={({ navigation, route }) =>({
                                headerTitle: '',headerTruncatedBackTitle: 'zurück',
                            })} component={CustomerChatScreen}/>
                            <Stack.Screen name={"LegalScreen"} options={({ navigation, route }) =>({
                                headerTitle: '',headerTruncatedBackTitle: 'zurück',
                            })} component={LegalScreen}/>
                            <Stack.Screen name={"PDFViewScreen"} options={({ navigation, route }) =>({
                                headerTitle: '',headerTruncatedBackTitle: 'zurück',
                            })} component={PDFViewScreen}/>
                            <Stack.Screen name={"IssueDetailScreen"} options={({ navigation, route }) =>({
                                headerTitle: '',headerTruncatedBackTitle: 'zurück',
                            })} component={IssueDetailScreen}/>
                            <Stack.Screen name={"IssueHistoryScreen"} options={({ navigation, route }) =>({
                                headerTitle: '',headerTruncatedBackTitle: 'zurück',
                            })} component={IssueHistoryScreen}/>
                            <Stack.Screen name={"RealsEstateOffersScreen"} options={({ navigation, route }) =>({
                                headerTitle: '',headerTruncatedBackTitle: 'zurück',
                            })} component={RealsEstateOffersScreen}/>
                            <Stack.Screen name="Register" component={RegisterScreen} />
                            <Stack.Screen name="Debug" component={DebugScreen} />
                            <Stack.Screen name="PasswordReset"  options={({ navigation, route }) =>({
                                headerTitle: '',headerTruncatedBackTitle: 'zurück',
                            })} component={ResetPasswortScreem} />

                        </>
                    ) : (
                        <>
                        <Stack.Screen name="Login" component={LoginScreen} options={({ navigation, route }) =>({
                            headerHeight: 100,
                            headerTitle: () => (
                                <View>
                                    <Image source={require('../../assets/white.png')} style={{width: 90,marginLeft: 10,  resizeMode: 'contain',}} />
                                </View>

                            ),
                            headerRight: () => (
                                <></>
                            ),
                            headerStyle: {height: 130}
                        })}/>
                        <Stack.Screen name="Register"  options={({ navigation, route }) =>({
                            headerTitle: '',headerTruncatedBackTitle: 'zurück',
                        })} component={RegisterScreen} />
                        <Stack.Screen name="PasswordReset"  options={({ navigation, route }) =>({
                                headerTitle: '',headerTruncatedBackTitle: 'zurück',
                            })} component={ResetPasswortScreem} />
                        <Stack.Screen name="VerifyAccount"  options={({ navigation, route }) =>({
                                headerTitle: '',headerTruncatedBackTitle: 'zurück',
                            })} component={VerifyAccountScreen} />
                            <Stack.Screen name={"LegalScreen"} options={({ navigation, route }) =>({
                                headerTitle: '',headerTruncatedBackTitle: 'zurück',
                            })} component={LegalScreen}/>
                        </>

                        )}
                </Stack.Navigator>
            }
        </>

    )
}

//export default MainStackNavigator;
/*const mapStateToProps = (state) => {
    return {
        // will be available as props.trips
        user: state.user
    }
}*/

export default MainStackNavigator;

//export default connect(mapStateToProps)(MainStackNavigator);

/*export default createAppContainer(
    createSwitchNavigator({
            Auth: AuthStack,
            MainStackNavigator: MainStackNavigator
        },
        {
            initialRouteName: 'Auth',
        })
);*/