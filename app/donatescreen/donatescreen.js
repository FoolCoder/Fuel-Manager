import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Button, ImageBackground, Image } from 'react-native';
import { height, width, totalSize } from 'react-native-dimension'

export default function Logscreen({ navigation }) {
  return (
    <View>
      <Text>
        This is log screen
        </Text>
      <Button onPress={() => navigation.goBack()}
        title="Back"
        color="#000" />
    </View>
  )
}