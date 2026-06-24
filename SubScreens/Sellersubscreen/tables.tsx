import React from 'react';
import { View } from "react-native";
import TopBar from '../../components/Dashboard/top';
import TopAndTable from '../../components/Tables/Topandtable';
import TablesSection from '../../components/Tables/TablesSection';

export default function Tables() {
  return (
    <View style={{ flex: 1 }}>
      <TopBar />
      <TopAndTable />
      <TablesSection />
    </View>
  );
}