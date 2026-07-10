import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { shared, C } from "./styles";
import BrandLogo from "./BrandLogo";
import { useNavigation } from "@react-navigation/native";
import { API } from "../../Extras/api";
import AsyncStorage from '@react-native-async-storage/async-storage';


function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <View style={shared.fieldWrap}>
      <Text style={shared.label}>
        {label}{required && <Text style={shared.req}> *</Text>}
      </Text>
      {children}
    </View>
  );
}

export default function LoginSeller() {
  const navigation = useNavigation<any>();
  const [showPw, setShowPw] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));


  const inp = (id: string) => [
    shared.input,
    focused === id && shared.inputFocused,
  ];

  const [form , setForm ] = useState({
    email:"" , password:""
  });

  async function handleSubmit(){
    setError("");
    const{email,password} = form;
    if(!email || !password){
      return setError("Please fill in all the required fields");
    }
    if (password.length < 8)
      return setError("Password must be at least 8 characters.");

    setLoading(true);

    try{
      const res = await fetch(API.sellerLogin, {
        method:"POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",                       // required — stores the session cookie
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (__DEV__) console.log("Login response:", res.status, data);
      if (res.ok) {
        // use seller data from login response directly — avoids a second cookie-dependent request
        const seller = data.seller;
        await AsyncStorage.setItem('session', JSON.stringify({
          sellerId: seller.sellerId,   // backend returns sellerId (seller._id aliased)
          shopName: seller.shopName,
          sellerName: seller.name,
          savedAt: Date.now(),
        }));
        navigation.navigate("DashboardSeller");
      } else {
        setError(data.message || "Invalid email or password.");
      }
    }
    catch(e: any){
      if (__DEV__) console.log("Login error:", e.message);
      setError("Could not reach server. Check your connection.");
    }
    finally{
      setLoading(false)
    }
  }
      return (
    <KeyboardAvoidingView
      style={shared.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={shared.scroll} keyboardShouldPersistTaps="handled">
        <BrandLogo subtitle="Seller portal — manage your restaurant" />

        <View style={shared.card}>
          <Text style={shared.cardTitle}>Welcome back</Text>
          <Text style={shared.cardSub}>Log in to your seller account</Text>

          <Field label="Email address" required>
            <TextInput style={inp("email")} placeholder="you@example.com"
              keyboardType="email-address" autoCapitalize="none"
              placeholderTextColor={C.placeholder}
              value={form.email} onChangeText={set("email")}
              onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} />
          </Field>

          <Field label="Password" required>
            <View style={shared.pwWrap}>
              <TextInput style={[inp("password"), shared.pwInput]}
                placeholder="Enter your password" secureTextEntry={!showPw}
                placeholderTextColor={C.placeholder}
                value={form.password} onChangeText={set("password")}
                onFocus={() => setFocused("password")} onBlur={() => setFocused(null)} />
              <TouchableOpacity style={shared.eyeBtn} onPress={() => setShowPw(v => !v)}>
                <Text style={{ fontSize: 16 }}>{showPw ? "🙈" : "👁️"}</Text>
              </TouchableOpacity>
            </View>
          </Field>

          <View style={shared.forgotWrap}>
            <Text style={shared.forgotText}>Forgot password?</Text>
          </View>

          {error ? <Text style={{ color: C.error, fontSize: 13, marginBottom: 8 }}>{error}</Text> : null}

          <TouchableOpacity style={shared.submitBtn} activeOpacity={0.85} onPress={handleSubmit}>
            <Text style={shared.submitBtnText}>Log in</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
        onPress={()=> navigation.navigate("SellerSignup")}>

        <Text style={shared.bottomLink}>
          Don't have an account?{" "}
          <Text style={shared.bottomLinkAccent}>Sign up</Text>
        </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


