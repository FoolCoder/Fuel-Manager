import React, { useMemo, useEffect, useState } from 'react'
import {
    View, Text, LayoutAnimation
} from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../authcontext/authcontext'
import signin from '../loginscreen/Sigin'
import signup from '../loginscreen/signup'
import fuelmanager from '../fuelscreen/fuelmanager1'
import Splashscreen from '../splashscreen/splashscreen'
import Mainscreen from '../Home/mainscreen'
import logs from '../logscreen/logscreen'
import donate from '../donatescreen/donatescreen'


const loginstack = createStackNavigator()
const homestack = createStackNavigator()
LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)

export default function Navigation() {
    const [IsSignedIn, setIsSignedIn] = useState(false)
    const [IsSplash, setIsSplash] = useState(true)

    useEffect(() => {

        check()

    }, [])

    const sessionOut = () => {
        check();
    }

    const Loginstack = () => {
        return (
            <loginstack.Navigator headerMode='none' >
                <loginstack.Screen name="signin" component={signin} />
                <loginstack.Screen name="signup" component={signup} />

            </loginstack.Navigator >
        )
    }
    const Homestack = () => {
        return (
            <homestack.Navigator headerMode='none'>
                <homestack.Screen name="mainscreen" children={(navigation) => <Mainscreen {...navigation} sessionOut={sessionOut} />} />
                <homestack.Screen name="fuelmanger" component={fuelmanager} />
                <homestack.Screen name="logs" component={logs} />
                <homestack.Screen name="donate" component={donate} />
            </homestack.Navigator>
        )
    }

    async function check() {

        const val = await AsyncStorage.getItem('IsSignedIn')

        setTimeout(() => {

            if (val === 'true') {
                setIsSignedIn(true)
            }
            else {
                setIsSignedIn(false)
            }
            setIsSplash(false)
        }, 3000);


    }

    const auth = useMemo(() => ({
        login: () => {
            setIsSignedIn(true)
        },
        logout: () => {
            setIsSignedIn(false)
        }
    }), []);

    if (IsSplash)
        return (
            <Splashscreen />
        )

    else {

        return (
            <AuthContext.Provider value={auth}>
                <NavigationContainer headermode='none'>

                    {
                        IsSignedIn === false ? (
                            <Loginstack />
                        )
                            :
                            (
                                <Homestack />
                            )
                    }

                </NavigationContainer>
            </AuthContext.Provider>
        )

    }

}
