import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { height, width, totalSize } from 'react-native-dimension'
navigator.geolocation = require('react-native-geolocation-service');
import fg from '../../traffic/assets/Group1.png'
import g2 from '../../traffic/assets/Group2.png'

export default function Mainscreen(props) {

    console.log("props", props)
    // const home = { geometry: { location: { lat: '30.7654', lon: '77.9876' } } }


    const logout = () => {
        AsyncStorage.setItem('IsSignedIn', 'false');
        props.sessionOut();
    }

    return (
        <ImageBackground style={{
            height: height(100), width: width(100),
            alignSelf: 'center',
            // position: 'absolute', zIndex: 1


            justifyContent: 'center', alignItems: 'center',
        }}

            source={fg}>
            {/* {GooglePlacesInput()} */}
            <Image style={{
                width: 50,
                height: 50
            }}
                source={g2} />
            <Text style={{
                color: '#FFFFFF',
                fontSize: totalSize(3),
                marginVertical: height(3)
            }}>
                Welcome
            </Text>
            <TouchableOpacity
                onPress={() => props.navigation.navigate('fuelmanger')}
                style={styles.button}>
                <Text style={styles.txt}>
                    Show Maps
                </Text >
            </TouchableOpacity >
            <TouchableOpacity
                onPress={() => props.navigation.navigate('logs')}
                style={styles.button}>
                <Text style={styles.txt}>
                    Show logs
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => props.navigation.navigate('donate')}
                style={styles.button}>
                <Text style={styles.txt}>
                    Donnation
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => logout()}
                style={styles.button}>
                <Text style={styles.txt}>
                    Logout
                </Text>
            </TouchableOpacity>

            <View style={{
                marginBottom: height(8)
            }} />
        </ImageBackground>
    )
}
const styles = StyleSheet.create({
    button: {
        width: width(25),
        height: height(5),
        borderWidth: 1,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: height(2),

    },
    txt: {
        fontSize: totalSize(1.4),
        color: '#000'
    }
})