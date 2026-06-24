import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import QrScanScreen from '../components/Scanner/QRScanDesg';
import ScanQRe from '../features/camera';
export default function ScanQr({ navigation }: { navigation: any }){
    return(
        <View style={styles.container}>
            <ScanQRe navigation={navigation} />
        </View>
    )
}

const styles= StyleSheet.create({
    container:{
        flex: 1,
    },
    text:{
        fontSize:20,
        color: "#008743",
    },


})