import {View, TouchableOpacity} from "react-native";
export default function ChooseRoke({navigation}){
    return(
        <View>
            <TouchableOpacity
              onPress={() => navigation.navigate("QRScanner")}
              style={{ padding: 15, backgroundColor: "#ddd", margin: 10 }}
            >
              <Text>QRScanner</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => navigation.navigate("SellerSignup")}
              style={{ padding: 15, backgroundColor: "#ddd", margin: 10 }}
            >
              <Text>Seller Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Seller Login")}
              style={{ padding: 15, backgroundColor: "#ddd", margin: 10 }}
            >
              <Text>Seller Login</Text>
            </TouchableOpacity>



      </View>
        



    )
}