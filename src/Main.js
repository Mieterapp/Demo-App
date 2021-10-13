import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoadingScreen from './screens/LoadingScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import { StatusBar } from 'expo-status-bar';
export default function DIT() {
    const Stack = createStackNavigator();
    const [isLoadingComplete, setLoadingComplete] = useState(false);

    const [isAuth, setIsAuth ] = useState(false);;


    useEffect(() => {
        const bootstrapAsync = async () => {
            try {
                setTimeout(()=>{
                    setIsAuth(true)
                },1000)
            } catch (e) {
                // Restoring token failed
            }
            setLoadingComplete(true);
        };
        bootstrapAsync().then(() => {});
    }, []);
    return (
        <>
            <StatusBar style="light" />
            {!isLoadingComplete ?
                <LoadingScreen />
                :
                <Stack.Navigator>
                    {isAuth ?
                        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                        :
                        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                    }
                </Stack.Navigator>
            }
        </>
    );
}