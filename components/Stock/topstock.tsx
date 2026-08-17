import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal, Pressable } from "react-native";
import { NavOrdersIcon } from "../../Extras/icons";
import { useNavigation } from "@react-navigation/native";
import { s, sf } from "../../Extras/responsive";

export default function TopAndStock(){
      const navigation = useNavigation<any>();
      const [modalVisible, setModalVisible] = useState(false);
    return(
        <View>
            <View style={styles.container}>
                <Text style={styles.text}>
                    Stocks
                </Text>
                <TouchableOpacity 
                activeOpacity={0.7}
                onPress={()=> navigation.navigate("AddStock")}>
                    <View style={styles.addTableButton}>
                        <NavOrdersIcon size={18} color="#000000" />
                        <Text style={styles.addTableText}>Add Stock</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    container:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        marginTop: s(20),
        marginLeft: s(12),
        marginRight: s(12),
    },
    text:{
        fontSize: sf(22),
        fontWeight:"600",
        color:"#1E3A8A",
    },
    addTableButton: {
        flexDirection:"row",
        alignItems:"center",
        backgroundColor:"#F7D060",
        gap: s(6),
        paddingVertical: s(8),
        paddingHorizontal: s(14),
        borderRadius: s(8),
    },
    addTableText: {
        fontSize: sf(14),
        color: "#000000",
        fontWeight: "500",
    },

})