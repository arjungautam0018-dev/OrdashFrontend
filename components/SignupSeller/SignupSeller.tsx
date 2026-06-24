import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, Alert, ActivityIndicator,
} from "react-native";
import { shared, C } from "./styles";
import BrandLogo from "./BrandLogo";
import { useNavigation } from "@react-navigation/native";
import { API } from "../../Extras/api";

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

export default function SignupSeller() {
  const navigation = useNavigation<any>();

  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "", email: "",
    shopName: "", city: "", address: "", password: "", confirmPassword: "",
  });
  const [showPw, setShowPw]   = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const inp = (id: string) => [
    shared.input,
    focused === id && shared.inputFocused,
  ];

  async function handleSubmit() {
    setError("");
    const { firstName, lastName, phone, email, shopName, city, password, confirmPassword } = form;

    if (!firstName || !lastName || !phone || !email || !shopName || !city || !password)
      return setError("Please fill in all required fields.");
    if (password.length < 8)
      return setError("Password must be at least 8 characters.");
    if (password !== confirmPassword)
      return setError("Passwords do not match.");

    setLoading(true);
    try {
      const res = await fetch(API.sellerSignup, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          phone, email, shopName, city,
          address: form.address,
          password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert("Success", "Account created! Please log in.");
        navigation.navigate("SellerLogin");
      } else {
        setError(data.message || "Signup failed. Try again.");
      }
    } catch {
      setError("Could not reach server. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={shared.screen}>
      <ScrollView contentContainerStyle={shared.scroll} keyboardShouldPersistTaps="handled">
        <BrandLogo subtitle="Seller portal — list your restaurant & start earning" topOffset={48} />

        <View style={shared.card}>
          <Text style={shared.cardTitle}>Create seller account</Text>
          <Text style={shared.cardSub}>Fill in your details to register your restaurant</Text>

          <Text style={[shared.sectionLabel, { borderTopWidth: 0, paddingTop: 0, marginTop: 0 }]}>
            Owner details
          </Text>

          <View style={shared.row}>
            <Field label="First name" required>
              <TextInput style={inp("firstName")} placeholder="Arun" placeholderTextColor={C.placeholder}
                value={form.firstName} onChangeText={set("firstName")}
                onFocus={() => setFocused("firstName")} onBlur={() => setFocused(null)} />
            </Field>
            <Field label="Last name" required>
              <TextInput style={inp("lastName")} placeholder="Sharma" placeholderTextColor={C.placeholder}
                value={form.lastName} onChangeText={set("lastName")}
                onFocus={() => setFocused("lastName")} onBlur={() => setFocused(null)} />
            </Field>
          </View>

          <Field label="Phone number" required>
            <TextInput style={inp("phone")} placeholder="98XXXXXXXX" keyboardType="phone-pad"
              maxLength={10} placeholderTextColor={C.placeholder}
              value={form.phone} onChangeText={set("phone")}
              onFocus={() => setFocused("phone")} onBlur={() => setFocused(null)} />
          </Field>

          <Field label="Email address" required>
            <TextInput style={inp("email")} placeholder="you@example.com" keyboardType="email-address"
              autoCapitalize="none" placeholderTextColor={C.placeholder}
              value={form.email} onChangeText={set("email")}
              onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} />
          </Field>

          <Text style={shared.sectionLabel}>Restaurant info</Text>

          <Field label="Restaurant / shop name" required>
            <TextInput style={inp("shopName")} placeholder="Momo House" placeholderTextColor={C.placeholder}
              value={form.shopName} onChangeText={set("shopName")}
              onFocus={() => setFocused("shopName")} onBlur={() => setFocused(null)} />
          </Field>

          <Field label="City / location" required>
            <TextInput style={inp("city")} placeholder="Butwal" placeholderTextColor={C.placeholder}
              value={form.city} onChangeText={set("city")}
              onFocus={() => setFocused("city")} onBlur={() => setFocused(null)} />
          </Field>

          <Field label="Full address">
            <TextInput style={[inp("address"), shared.textarea]} placeholder="Street, area, landmark..."
              multiline placeholderTextColor={C.placeholder}
              value={form.address} onChangeText={set("address")}
              onFocus={() => setFocused("address")} onBlur={() => setFocused(null)} />
          </Field>

          <Text style={shared.sectionLabel}>Security</Text>

          <Field label="Password" required>
            <View style={shared.pwWrap}>
              <TextInput style={[inp("password"), shared.pwInput]}
                placeholder="Min. 8 characters" secureTextEntry={!showPw}
                placeholderTextColor={C.placeholder}
                value={form.password} onChangeText={set("password")}
                onFocus={() => setFocused("password")} onBlur={() => setFocused(null)} />
              <TouchableOpacity style={shared.eyeBtn} onPress={() => setShowPw(v => !v)}>
                <Text style={{ fontSize: 16 }}>{showPw ? "🙈" : "👁️"}</Text>
              </TouchableOpacity>
            </View>
            <Text style={shared.hint}>Use letters, numbers & symbols</Text>
          </Field>

          <Field label="Confirm password" required>
            <View style={shared.pwWrap}>
              <TextInput style={[inp("cpw"), shared.pwInput]}
                placeholder="Re-enter password" secureTextEntry={!showCpw}
                placeholderTextColor={C.placeholder}
                value={form.confirmPassword} onChangeText={set("confirmPassword")}
                onFocus={() => setFocused("cpw")} onBlur={() => setFocused(null)} />
              <TouchableOpacity style={shared.eyeBtn} onPress={() => setShowCpw(v => !v)}>
                <Text style={{ fontSize: 16 }}>{showCpw ? "🙈" : "👁️"}</Text>
              </TouchableOpacity>
            </View>
            <Text style={shared.hint}>Must match password above</Text>
          </Field>

          {error ? <Text style={{ color: C.error, fontSize: 13, marginTop: 8 }}>{error}</Text> : null}

          <TouchableOpacity style={[shared.submitBtn, loading && { opacity: 0.7 }]}
            activeOpacity={0.85} onPress={handleSubmit} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={shared.submitBtnText}>Create seller account</Text>}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("SellerLogin")}>
          <Text style={shared.bottomLink}>
            Already have an account?{" "}
            <Text style={shared.bottomLinkAccent}>Log in</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
