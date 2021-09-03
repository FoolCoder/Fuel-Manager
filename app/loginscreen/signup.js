import React, { useState } from 'react'
import {
    ImageBackground, TextInput, TouchableOpacity, View,
    StyleSheet, Text, Image, ScrollView, Button, Pressable, LayoutAnimation
} from 'react-native'
import { height, totalSize, width } from 'react-native-dimension'
import fg from '../../traffic/assets/Group1.png'
import g2 from '../../traffic/assets/Group2.png'
import { link } from '../links/links'
import SpinnerButton from 'react-native-spinner-button';
import Feather from 'react-native-vector-icons/Feather'

export default function Signup({ navigation }) {

    // States start


    const [name, setname] = useState('')
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [cpassword, setcpassword] = useState('')
    const [homeadd, sethomeadd] = useState('')
    const [brandname, setbrandname] = useState('')
    const [tradename, settradename] = useState('')
    const [plateNum, setPlatenum] = useState('')
    const [plateflag, setplateflag] = useState(false)
    const [loader, setloader] = useState(false)
    const [psecureTextEntry, setpSecureTextEntry] = useState(true)
    const [csecureTextEntry, setcSecureTextEntry] = useState(true)
    const [signuploader, setsignuploader] = useState(false)



    //state End



    //Function Componrnt start in

    const signup = () => {
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (email !== '' && password != '' && name != '' && cpassword != '' && homeadd != '' && plateNum != '' && brandname != '' && tradename != '') {
            if (reg.test(email) === true) {

                if (password == cpassword) {
                    let data = {
                        name: name,
                        email: email.toLowerCase(),
                        password: password,
                        address: homeadd,
                        licensePlate: plateNum,
                        brandName: brandname,
                        tradeName: tradename,
                        phone: '12234455'
                    }
                    setsignuploader(true)
                    console.log(data);
                    try {
                        fetch(link + '/user/signup', {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
                        })
                            .then((response) => response.json())
                            .then((Data) => {
                                if (Data.type == 'failure') {
                                    alert(Data.result)
                                }
                                else {
                                    setsignuploader(false)
                                    setname('')
                                    setPlatenum('')
                                    setbrandname('')
                                    setcpassword('')
                                    setpassword('')
                                    setemail('')
                                    sethomeadd('')
                                    alert(Data.result)

                                    navigation.goBack()
                                }

                            })
                            .catch((err) => {
                                console.log("Error" + err);
                            })
                    } catch (error) {
                        alert('two' + error)
                    }

                }
                else {
                    alert('Password not match')
                }
            }
            else {
                alert('Invalid Email')
            }
        }
        else {
            alert('Please fill all fields')
        }
    }
    const Verifyplatenum = () => {
        if (plateNum != '') {

            let data = { plateNum }
            console.log(data);
            setloader(true)
            try {


                fetch(link + '/user/licenseplatecheck', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                    .then((response) => response.json())
                    .then((Data) => {
                        if (Data.type == 'failure') {
                            alert(Data.result)
                            console.log('ifffffff');

                        }
                        else {
                            // alert(Data.result)
                            console.log(Data.data[0].merk);
                            setbrandname(Data.data[0].merk)
                            settradename(Data.data[0].handelsbenaming)
                            setplateflag(true)
                            setloader(false)
                            //   navigation.goBack()
                        }

                    })
            } catch (error) {
                throw error
            }
        }
        else {
            alert('Plate number empty')
        }
    }



    // Functional component End in here
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    return (
        <ImageBackground style={mystyle.imgbg}
            source={fg}
        >

            <Image
                style={{
                    width: 50,
                    height: 50,
                    marginTop: height(5),
                    alignSelf: 'center',

                }}
                source={g2}
            />

            <View style={mystyle.textfieldview}>
                <Text style={{
                    fontSize: totalSize(4),
                    // fontweight: 'bold',\col
                    color: '#FFFFFF',
                    alignSelf: 'center'
                }}>
                    Signup
                </Text>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={mystyle.scroll}>
                    <TextInput
                        placeholder='Name'
                        placeholderTextColor='#8E8E8E'
                        onChangeText={(text) => setname(text)}

                        style={mystyle.textinput}
                    />
                    <TextInput
                        placeholder='Email'
                        placeholderTextColor='#8E8E8E'
                        style={mystyle.textinput}
                        onChangeText={(text) => setemail(text)}
                    />
                    <View style={mystyle.platenumberfieldview}>
                        <TextInput
                            placeholder='Passward'
                            placeholderTextColor='#8E8E8E'
                            onChangeText={(text) => setpassword(text)}
                            secureTextEntry={psecureTextEntry}
                            style={{
                                // borderWidth: 1,
                                // borderColor: '#fff',
                                width: width(63)

                            }}
                        />
                        <TouchableOpacity
                            disabled={password === '' ? true : false}
                            onPress={() => setpSecureTextEntry(!psecureTextEntry)}
                            style={mystyle.passwardicon}>
                            <Feather name={psecureTextEntry ? 'eye' : 'eye-off'} color='#fff' size={20} />
                        </TouchableOpacity>
                    </View>
                    <View style={mystyle.platenumberfieldview}>
                        <TextInput
                            placeholder='Confrim Passward'
                            placeholderTextColor='#8E8E8E'
                            onChangeText={(text) => setcpassword(text)}
                            secureTextEntry={csecureTextEntry}
                            style={{
                                width: width(63)
                            }}
                        />
                        <TouchableOpacity
                            disabled={cpassword === '' ? true : false}
                            onPress={() => setcSecureTextEntry(!csecureTextEntry)}
                            style={mystyle.passwardicon}>
                            <Feather name={csecureTextEntry ? 'eye' : 'eye-off'} color='#fff' size={20} />
                        </TouchableOpacity>

                    </View>
                    <TextInput
                        placeholder='Home Address'
                        placeholderTextColor='#8E8E8E'
                        onChangeText={(text) => sethomeadd(text)}
                        style={mystyle.textinput}
                    />
                    <View style={mystyle.platenumberfieldview}>
                        <TextInput
                            placeholder='Plate Number'
                            placeholderTextColor='#8E8E8E'
                            onChangeText={(text) => setPlatenum(text)}
                            style={{
                                // borderWidth: 1,
                                // borderColor: 'white',
                                width: width(55)
                            }}
                        />
                        <SpinnerButton
                            disabled={plateNum === '' ? true : false}
                            disableStyle={mystyle.verifybtnD}
                            spinnerType='SkypeIndicator'
                            onPress={() => {
                                Verifyplatenum()

                            }}
                            buttonStyle={mystyle.verifybtn}
                            indicatorCount={10}
                            isLoading={loader}
                            spinnerColor='#000'

                        >

                            <Text style={mystyle.verifybtntext}>
                                Verify
                            </Text>
                        </SpinnerButton>
                        {console.log(plateflag)
                        }

                    </View>

                    {plateflag ?
                        <View>
                            <TextInput
                                placeholder='Brand Name'
                                placeholderTextColor='#8E8E8E'
                                onChangeText={(text) => setbrandname(text)}
                                value={brandname}
                                style={mystyle.textinput}
                            />
                            <TextInput
                                placeholder='Trade Name'
                                placeholderTextColor='#8E8E8E'
                                onChangeText={(text) => settradename(text)}
                                value={tradename}
                                style={mystyle.textinput}
                            />
                        </View>
                        :
                        null
                    }

                    <SpinnerButton
                        onPress={() => signup()}
                        buttonStyle={mystyle.btn}
                        spinnerType='SkypeIndicator'
                        indicatorCount={10}
                        isLoading={signuploader}

                    >


                        <Text>
                            Sign up
                        </Text>

                    </SpinnerButton>

                    <TouchableOpacity onPress={() => navigation.navigate('signin')}>
                        <Text style={{
                            color: '#FFFFFF',
                            alignSelf: 'center'
                        }}>
                            Already have account? <Text style={{
                                // fontweight: 'bold'
                            }} >Sigin in </Text>
                        </Text>
                    </TouchableOpacity>
                </ScrollView>

            </View>
        </ImageBackground >
    )
}
const mystyle = StyleSheet.create({
    imgbg: {
        flex: 1,
        // ...StyleSheet.absoluteFillObject
    },
    textfieldview: {
        width: width(80),
        height: height(80),
        marginTop: height(3),
        // alignItems: 'center',
        alignSelf: 'center',
        // borderWidth: 1,
        borderColor: 'white',
    },
    scroll: {
        flex: 1,
        marginVertical: height(3),
        bottom: 8,

    },
    textinput: {
        fontSize: totalSize(1.8),
        borderWidth: 1,
        borderColor: '#FFFFFF',
        borderRadius: 8,
        color: '#FFFFFF',
        marginVertical: height(1),
        paddingLeft: 8
    },
    platenumberfieldview: {
        borderWidth: 1,
        borderColor: '#FFFFFF',
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 4,
        marginVertical: height(1),


    },
    verifybtn: {
        borderRadius: 8,
        height: 32,
        width: 73,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0E80EA'
    },
    verifybtnD: {
        borderRadius: 8,
        height: 32,
        width: 73,

        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#8E8E8E'
    },
    verifybtntext: {
        color: '#fff',
        fontSize: 14
    },

    btn: {

        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 9,
        width: width(20),
        height: height(5),
        alignSelf: 'center',
        marginVertical: height(2)

    },
    passwardicon: {
        right: 8
    }


})