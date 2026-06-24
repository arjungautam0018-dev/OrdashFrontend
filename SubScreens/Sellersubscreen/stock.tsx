import React from 'react';
import { View, StyleSheet } from "react-native";
import TopBar from '../../components/Dashboard/top';
import TopAndStock from '../../components/Stock/topstock';
import StocksSection from '../../components/Stock/StocksSection';

export default function StockSeller() {
  return (
    <View style={styles.screen}>
      <TopBar />
      <TopAndStock />
      <StocksSection />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
});
