import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { StoreIcon, BagIcon, ArrowRightIcon, WArrowRightIcon } from "../../Extras/icons";
import { useNavigation } from "@react-navigation/native";

export default function ChooseRole() {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.main}>

      {/* CUSTOMER BUTTON */}
      <TouchableOpacity
       style={[styles.card, shadowStyle]}
        activeOpacity={0.8}
        onPress={()=> navigation.navigate("QRScanner")}>
        <BagIcon width={40} height={40} color="#7DD3A0" />

        <View style={styles.textContainer}>
          <Text style={styles.title}>I'm shopping</Text>
          <Text style={styles.subtitle}>
            Discover and buy from local shops
          </Text>
        </View>

        <ArrowRightIcon width={40} height={40} color="#7DD3A0" />
      </TouchableOpacity>

      {/* SELLER BUTTON */}
      <TouchableOpacity
       style={[styles.cardSeller, shadowStyle]}
        activeOpacity={0.8}
        onPress={()=> navigation.navigate("SellerSignup")}>
        <StoreIcon width={30} height={30} color="white" />

        <View style={styles.textContainer}>
          <Text style={styles.titleSeller}>I'm selling</Text>
          <Text style={styles.subtitleSeller}>
            Open your shop in minutes
          </Text>
        </View>

        <WArrowRightIcon width={40} height={40} color="white" />
      </TouchableOpacity>

    </View>
  );
}
const styles = StyleSheet.create({
    main:{
        flex:1,
        gap:20,
        marginTop:50,
    },
  card: {
    backgroundColor: "white",
    marginHorizontal: 25,
    marginTop: 20,
    borderRadius: 12,
    paddingVertical: 17,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  cardSeller: {
    backgroundColor: "#7DD3A0",
    marginHorizontal: 25,
    marginTop: 15,
    borderRadius: 12,
    paddingVertical: 17,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  textContainer: {
    flex: 1,
    marginHorizontal: 10, // 🔥 reduced gap
  },

  title: {
    fontSize: 25,
    fontWeight: "500",
    color: "#000",
  },

  subtitle: {
    fontSize: 15,
    color: "gray",
    marginTop: 2,
  },

  titleSeller: {
    fontSize: 25,
    fontWeight: "500",
    color: "white",
  },

  subtitleSeller: {
    fontSize: 15,
    color: "rgba(255,255,255,0.85)",
    marginTop: 2,
  },
});

const shadowStyle = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 8,
  elevation: 5, // Android
};