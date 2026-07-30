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
    identifier:"" , password:""
  });

  async function handleSubmit(){
    setError("");
    const { identifier, password } = form;
    if (!identifier || !password){
      return setError("Please fill in all the required fields");
    }

    setLoading(true);

    // Determine if admin (email) or sub-account (phone or email)
    const isEmail = identifier.includes("@");
    const body: any = { password };
    if (isEmail) {
      // could be admin or sub-account with email — backend checks admin first
      body.email = identifier;
    } else {
      // phone number — must be sub-account
      body.phone = identifier;
    }

    try{
      const res = await fetch(API.sellerLogin, {
        method:"POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (__DEV__) console.log("Login response:", res.status, data);
      if (res.ok) {
        const seller = data.seller;
        await AsyncStorage.setItem('session', JSON.stringify({
          sellerId: seller.sellerId,
          shopName: seller.shopName,
          sellerName: seller.name,
          token: data.token,
          type: seller.type,                          // "admin" | "sub"
          ...(seller.cid  && { cid:  seller.cid }),   // sub-account id
          ...(seller.role && { role: seller.role }),  // waiter / chef / etc.
          savedAt: Date.now(),
        }));
        navigation.navigate("DashboardSeller");
      } else {
        setError(data.message || "Invalid credentials.");
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

          <Field label="Email or phone number" required>
            <TextInput style={inp("identifier")} placeholder="Email or phone number"
              autoCapitalize="none"
              placeholderTextColor={C.placeholder}
              value={form.identifier} onChangeText={set("identifier")}
              onFocus={() => setFocused("identifier")} onBlur={() => setFocused(null)} />
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


