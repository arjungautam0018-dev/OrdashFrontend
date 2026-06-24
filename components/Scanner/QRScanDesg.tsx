import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function QrScanScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.camera} />
      <Text style={styles.title}>Scan QR Code</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  title: {
    position: 'absolute',
    top: 56,
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.4,
  },
});
