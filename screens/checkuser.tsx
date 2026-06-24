import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ChooseRole from '../components/ChooseRole/chooserole';
import GreetingsFirst from '../components/ChooseRole/greetings';
import Loggedin from '../components/ChooseRole/alreadylogged';
export default function CheckUser() {
  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      colors={['#D2F4D5', '#96EAA1', '#EAF4DC', '#FCEFCA']}
      locations={[0, 0.35, 0.70, 1]}
      style={styles.background}
    >
      <View style={styles.container}>
        <GreetingsFirst />
        <ChooseRole />
        <Loggedin />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 20,
  },
});