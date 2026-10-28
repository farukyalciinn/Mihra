import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { C, R } from '../theme';

export const Panel = ({ dark, children, style }: { dark?: boolean; children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[st.panel, dark ? { backgroundColor: C.card } : { backgroundColor: C.paper }, style]}>{children}</View>
);
export const T = ({ children, style, light, bold, size }: { children: React.ReactNode; style?: TextStyle; light?: boolean; bold?: boolean; size?: number }) => (
  <Text style={[{ color: light ? C.cream : C.ink, fontSize: size || 15, fontWeight: bold ? '700' : '400', lineHeight: (size || 15) * 1.45 }, style]}>{children}</Text>
);
export const Btn = ({ label, onPress, outline, dark, style }: { label: string; onPress: () => void; outline?: boolean; dark?: boolean; style?: ViewStyle }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8}
    style={[st.btn, outline ? { borderWidth: 1, borderColor: dark ? C.gold : C.card } : { backgroundColor: C.gold }, style]}>
    <Text style={{ fontWeight: '700', fontSize: 16, color: outline ? (dark ? C.gold : C.card) : C.bg }}>{label}</Text>
  </TouchableOpacity>
);
export const Pill = ({ label, on, onPress }: { label: string; on?: boolean; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={[st.pill, on && { backgroundColor: C.gold, borderColor: C.gold }]}>
    <Text style={{ color: on ? C.bg : C.mint, fontWeight: '600', fontSize: 12 }}>{label}</Text>
  </TouchableOpacity>
);
export const Row = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[{ flexDirection: 'row', flexWrap: 'wrap', gap: 7, alignItems: 'center' }, style]}>{children}</View>
);
const st = StyleSheet.create({
  panel: { borderRadius: R.card, padding: 17, gap: 11 },
  btn: { borderRadius: 11, paddingVertical: 12, paddingHorizontal: 17, alignItems: 'center', justifyContent: 'center' },
  pill: { borderRadius: 9, paddingVertical: 8, paddingHorizontal: 11, borderWidth: 1, borderColor: '#5E806E', backgroundColor: C.card2 },
});
