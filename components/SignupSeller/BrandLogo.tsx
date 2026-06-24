import React from "react";
import { View, Text } from "react-native";
import Svg, { Rect, Path, Circle } from "react-native-svg";
import { shared } from "./styles";

export default function BrandLogo({ subtitle = '', topOffset = 0 }: { subtitle?: string; topOffset?: number }) {
  return (
    <View style={[shared.brand, { marginTop: topOffset + 62 }]}>
      <View style={shared.brandRow}>
        <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
          <Rect width={32} height={32} rx={8} fill="#c84b2f" />
          <Path d="M8 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
          <Circle cx={16} cy={21} r={3} fill="#fff" />
          <Path d="M13 12c0-1.1.4-2.5 3-3 2.6-.5 3 1 3 2" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" />
        </Svg>
        <Text style={shared.brandName}>FoodApp</Text>
      </View>
      <Text style={shared.brandSub}>{subtitle}</Text>
    </View>
  );
}
