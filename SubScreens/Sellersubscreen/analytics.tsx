import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, Alert, ActivityIndicator,
} from "react-native";
import TopBar from '../../components/Dashboard/top';


export default function DashboardSeller() {
  return (
    <View>
      <TopBar />
    </View>
  );
}