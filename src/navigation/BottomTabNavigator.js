import * as React from 'react';
import { Text, View, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBarIcon from '../components/TabBarIcon';
const Tab = createBottomTabNavigator();


import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from "../screens/ProfileScreen";
import DefectScreen from "../screens/DefectScreen";
import IssueScreen from "../screens/IssueScreen";
import ServiceScreen from "../screens/ServiceScreen";


const INITIAL_ROUTE_NAME = 'Home';


export default function BottomTabNavigator() {
    return (
        <Tab.Navigator initialRouteName={INITIAL_ROUTE_NAME} name={"BottomTabNavigator"}>
            <Tab.Screen name="Home" component={HomeScreen}
                        options={{
                            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-home" />,
                        }}
            />
            <Tab.Screen name="Konto" component={ProfileScreen}
                        options={{
                            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-person" />,
                        }}
            />
            <Tab.Screen name="Anliegen" component={IssueScreen}
                        options={{
                            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-paper" />,
                        }}
            />
            <Tab.Screen name="Schäden" component={DefectScreen}
                        options={{
                            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-construct" />,
                        }}
            />

            <Tab.Screen name="Service" component={ServiceScreen}
                        options={{
                            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-list" />,
                        }}
            />
        </Tab.Navigator>
    );
}