import React, { useState, useContext, useEffect } from 'react'
import {
    ImageBackground, TextInput, TouchableOpacity, View,
    StyleSheet, Text, Image, ScrollView, Alert
} from 'react-native'
import { height, totalSize, width } from 'react-native-dimension'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../authcontext/authcontext'
import SpinnerButton from 'react-native-spinner-button';
import Feather from 'react-native-vector-icons/Feather'

// './traffic/assets/Group1.png'
import fg from '../../traffic/assets/Group1.png'
import g2 from '../../traffic/assets/Group2.png'
import Users from "../../user";
import { link } from '../links/links'
export default function Sigin({ navigation }) {
    const [loader, setloader] = useState(false)
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const { login } = useContext(AuthContext)
    const [psecureTextEntry, setpSecureTextEntry] = useState(true)






    const handleSignIn = async () => {


        if (email !== '' && password != '') {

            // let fcm = await message().getToken()
            let data = {
                email: email,
                password: password
            }
            console.log(data);
            setloader(true)
            try {
                fetch(link + '/user/signin',
                    {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                    .then((response) => response.json())
                    .then(async (responseJson) => {

                        setloader(false)
                        // console.log(responseJson);
                        if (responseJson.type === 'success') {
                            // console.log(responseJson)
                            alert(responseJson.type)
                            const val = responseJson
                            console.log(val);
                            // await AsyncStorage.setItem('token', JSON.stringify(val))
                            await AsyncStorage.setItem('IsSignedIn', 'true').then(() => {
                                login()
                            })

                        }
                        else {
                            alert('Email or Password not exist')
                        }
                    })
                    .catch((e) => {
                        console.log(e)
                        setloader(false)
                    })
            } catch (e) {
                console.log(e)
                setloader(false)
            }
        }
        else {
            alert('Please fill all fields')
        }
        // login()

    }

    return (
        <ImageBackground style={mystyle.imgbg} source={fg} >
            <Image
                style={{
                    width: 80,
                    height: 80,
                    marginTop: height(10),
                    alignSelf: 'center'
                }}
                source={g2} />

            <View style={{
                width: width(70),
                height: height(70),
                marginTop: height(5),
                // marginVertical: height(2),
                alignSelf: 'center'
            }}>


                <Text style={{
                    fontSize: totalSize(4),
                    // fontweight: 'bold',
                    color: '#FFFFFF',
                    alignSelf: 'center',
                    marginVertical: height(2)
                }}>
                    Signin
                </Text>

                <TextInput
                    placeholder='Email'
                    placeholderTextColor='#FFFFFF'
                    style={mystyle.textinput}
                    onChangeText={(val) => setemail(val)}
                />
                <View style={mystyle.platenumberfieldview}>

                    <TextInput
                        placeholder='Passward'
                        placeholderTextColor='#FFFFFF'

                        secureTextEntry={psecureTextEntry}
                        style={{
                            width: width(62)
                        }}
                        onChangeText={(val) => setpassword(val)}
                    />
                    <TouchableOpacity
                        disabled={password === '' ? true : false}
                        onPress={() => setpSecureTextEntry(!psecureTextEntry)}
                        style={mystyle.passwardicon}>
                        <Feather name={psecureTextEntry ? 'eye' : 'eye-off'} color='#fff' size={20} />
                    </TouchableOpacity>
                </View>
                <Text style={{
                    // alignself: 'flex-end',
                    color: 'white'
                }}
                >
                    Forget Passward
                </Text>

                <SpinnerButton
                    onPress={() => handleSignIn()}
                    buttonStyle={mystyle.btn}
                    spinnerType='SkypeIndicator'
                    indicatorCount={10}
                    isLoading={loader}
                    spinnerColor='#000'
                >
                    <Text>
                        Sign in
                    </Text>
                </SpinnerButton>

                <TouchableOpacity

                    onPress={() =>
                        navigation.navigate('signup')
                    }
                >
                    <Text style={{
                        color: '#FFFFFF',
                        alignSelf: 'center'
                    }}>
                        Don't have account? <Text style={{
                            // fontweight: 'bold'
                        }} >Sigin up </Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    )


}

const mystyle = StyleSheet.create({
    imgbg: {
        // flex: 1,
        ...StyleSheet.absoluteFillObject
    },
    textinput: {
        fontSize: totalSize(1.8),
        borderWidth: 1,
        borderColor: '#FFFFFF',
        borderRadius: 8,
        color: '#FFFFFF',
        paddingLeft: 8,
        marginVertical: height(2)
    },
    platenumberfieldview: {
        borderWidth: 1,
        borderColor: '#FFFFFF',
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 14,
        marginVertical: height(1),


    },
    btn: {

        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 9,
        width: width(20),
        height: height(5),
        alignSelf: 'center',
        // marginVertical: height(2)
        // borderWidth: 1,
        // borderColor: 'white'
    }

})