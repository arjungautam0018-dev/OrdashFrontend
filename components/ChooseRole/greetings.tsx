import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { s, sf } from '../../Extras/responsive';


export default function GreetingsFirst() {
    return (
    <View>
        <View style={styles.top}>
            {/* The Row Container */}
            <View style={styles.firstline}>
                <Text style={styles.text}>Hey there!</Text>
                <Image source={require('../../assets/wavehand.png')} style={styles.emoji} />
            </View>
                  
            <Text style={styles.text2}>How would you</Text>
            <Text style={styles.text}>like to join us?</Text>
            <Text style={styles.text3}>Shop now in your locality and Nepal wide without any worries!</Text>
        
        </View>
    
    </View>
    )
}
const styles = StyleSheet.create({

    top: {
        marginTop: s(80),
        paddingHorizontal: s(30),
        gap: 0
    },
    firstline: {
        flexDirection: "row",
        alignItems: "center",
        gap: s(12),
        marginBottom: s(4),
    },
    text: {
        fontSize: sf(36),
        fontWeight: "700",
        color: "#111",
    },
    text2: {
        fontSize: sf(36),
        fontWeight: "700",
        color: "#008743",
    },
    emoji: {
        height: s(40),
        width: s(40),
        resizeMode: 'contain',
    },
    text3: {
        fontSize: sf(17),
        marginTop: s(5),
    }
});