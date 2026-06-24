import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal, Pressable } from "react-native";
import { NavOrdersIcon } from "../../Extras/icons";
import { useNavigation } from "@react-navigation/native";

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
        marginTop:20,
        marginLeft:12,
        marginRight:12,
    },
    text:{
        fontSize:22,
        fontWeight:"600",
        color:"#1E3A8A",
    },
    addTableButton: {
        flexDirection:"row",
        alignItems:"center",
        backgroundColor:"#F7D060",
        gap:6,
        paddingVertical:8,
        paddingHorizontal:14,
        borderRadius:8,
    },
    addTableText: {
        fontSize: 14,
        color: "#000000",
        fontWeight: "500",
    },

})