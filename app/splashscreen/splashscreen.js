import React, { useState, useContext, useEffect } from 'react'
import {
    ImageBackground, TextInput, TouchableOpacity, View,
    StyleSheet, Text, Image, ScrollView, Alert
} from 'react-native'
import { height, totalSize, width } from 'react-native-dimension'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../authcontext/authcontext'
import fg from '../../traffic/assets/Group1.png'
import g2 from '../../traffic/assets/Group2.png'
import Group1 from '../../traffic/assets/Group1.png'
import Group2 from '../../traffic/assets/Group2.png'


export default function Splash() {
    return (
        <ImageBackground
            style={{
                height: height(100),
                width: width(100),
                justifyContent: 'center',
                alignItems: 'center',

            }}
            source={Group1}
        >
            <View
                style={{
                    flexDirection: 'row',
                    width: width(50),
                    justifyContent: 'space-between',

                    alignItems: 'center'
                }}>
                <Image
                    style={{
                        width: 45,
                        height: 45
                    }}
                    source={Group2} />
                <Text style={{
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    fontSize: totalSize(4),
                    marginLeft: width(3)
                }}>
                    Fuel Manager
                </Text>
            </View>
        </ImageBackground>


    )
}