import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";


export default function Loggedin() {
  const navigation = useNavigation<any>();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.main}>
      <View style={styles.row}>
        <Text style={styles.text}>Already with us?</Text>

        <TouchableOpacity activeOpacity={0.7} onPress={()=> navigation.navigate("SellerLogin")}>
          <Text style={styles.nav}> Log in here</Text>
        </TouchableOpacity>
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop:160,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  text: {
    color: "gray",
    fontSize: 14,
  },

  nav: {
    color: "green",
    fontSize: 14,
    fontWeight: "600",
  },
});