import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput, Alert, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { C } from './src/theme';
import { StoreProvider, useStore } from './src/lib/store';
import { Panel, T, Btn, Row, Pill } from './src/components/ui';
import { locate } from './src/lib/prayer';
import { countries } from './src/data/content';
import Vakitler from './src/screens/Vakitler';
import Soon from './src/screens/Soon';

const TABS: [string, string][] = [['Vakitler', '🕒'], ['Kıble', '🧭'], ['Zikir', '📿'], ['Kur’an', '📖'], ['Öğren', '🎓']];

function Onboarding() {
  const { s, set } = useStore();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [manual, setManual] = useState(false);
  const [q, setQ] = useState('');
  const [country, setCountry] = useState('');

  if (step === 0) return (
    <View style={{ minHeight: 560, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
      <View style={st.logo}><Text style={{ fontSize: 56, color: C.gold }}>☾</Text></View>
      <Text style={{ color: C.gold, fontSize: 38, fontWeight: '800', letterSpacing: 5 }}>MİHRA</Text>
      <T light bold size={18}>Huzura açılan bir kapı.</T>
      <T light style={{ color: C.mint, textAlign: 'center' }}>Namaz vakitleri, kıble, zikir, Kur’an ve dinî bilgiler bir arada.</T>
      <View style={{ height: 20 }} />
      <Btn label="Başlayalım →" onPress={() => setStep(1)} style={{ alignSelf: 'stretch' }} />
      <T light size={12} style={{ color: C.mint }}>Ücretsiz · Üyelik gerektirmez</T>
    </View>
  );
  const auto = async () => {
    setBusy(true);
    const r = await locate();
    setBusy(false);
    if (typeof r === 'string') { Alert.alert(r === 'denied' ? 'Konum izni verilmedi' : 'Konum alınamadı', 'Şehrini aşağıdan seçerek devam edebilirsin.'); setManual(true); return; }
    set(r); setStep(2);
  };
  const cl = Object.keys(countries).filter(c => !q || c.toLowerCase().includes(q.toLowerCase()));
  return (
    <Panel dark>
      <Text style={{ color: C.gold, fontWeight: '700' }}>İLK KURULUM</Text>
      <T light bold size={24}>Konumun</T>
      <T light size={13} style={{ color: C.mint }}>Namaz vakitleri ve kıble otomatik ayarlansın diye konum izni gerekir. İzin vermezsen şehrini seçebilirsin.</T>
      {step === 1 && <>
        <Btn label={busy ? 'Konum alınıyor…' : '📍 Konumumu otomatik bul'} onPress={auto} />
        <Btn dark outline label="Şehri elle seç" onPress={() => setManual(true)} />
        {manual && <>
          {!country ? <>
            <TextInput placeholder="Ülke ara..." placeholderTextColor="#809389" style={st.input} value={q} onChangeText={setQ} />
            <Row>{cl.map(c => <Pill key={c} label={c} onPress={() => setCountry(c)} />)}</Row>
          </> : <>
            <T light bold>{country}</T>
            <Row>{countries[country].map(c => <Pill key={c} label={c} onPress={() => { set({ country, city: c, cc: country === 'Türkiye' ? 'TR' : '', lat: null, lon: null, auto: false }); setStep(2); }} />)}</Row>
            <Btn dark outline label="← Ülkeyi değiştir" onPress={() => setCountry('')} />
          </>}
          <T light size={12} style={{ color: C.mint }}>Tüm şehirler için arama, sonraki sürümde eklenecek.</T>
        </>}
      </>}
      {step === 2 && <>
        <T light bold>⌖ {s.city}{s.country ? ', ' + s.country : ''}</T>
        <Btn label="MİHRA’yı Aç →" onPress={() => set({ setup: true })} />
      </>}
    </Panel>
  );
}

function Shell() {
  const { s, ready } = useStore();
  const [tab, setTab] = useState('Vakitler');
  if (!ready) return <View style={{ flex: 1, backgroundColor: C.bg }} />;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <ScrollView contentContainerStyle={st.scroll} keyboardShouldPersistTaps="handled">
        {!s.setup ? <Onboarding /> : <>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View><Text style={{ color: C.gold, fontSize: 27, fontWeight: '800', letterSpacing: 3 }}>MİHRA</Text><T light size={12} style={{ color: C.mint }}>⌖ {s.city}{s.country ? ', ' + s.country : ''}</T></View>
          </View>
          {tab === 'Vakitler' ? <Vakitler /> : <Soon name={tab} />}
        </>}
      </ScrollView>
      {s.setup && (
        <SafeAreaView edges={['bottom']} style={{ backgroundColor: C.bg, borderTopWidth: 1, borderColor: C.line }}>
          <View style={st.tabs}>
            {TABS.map(([n, i]) => (
              <TouchableOpacity key={n} onPress={() => setTab(n)} style={{ alignItems: 'center', gap: 2, padding: 6 }}>
                <Text style={{ fontSize: 21 }}>{i}</Text>
                <Text style={{ fontSize: 11, color: tab === n ? C.gold : C.mint }}>{n}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </SafeAreaView>
      )}
    </SafeAreaView>
  );
}
export default function App() { return <SafeAreaProvider><StoreProvider><Shell /></StoreProvider></SafeAreaProvider>; }
const st = StyleSheet.create({
  scroll: { padding: 16, gap: 13, paddingBottom: 30, maxWidth: 560, width: '100%', alignSelf: 'center' },
  tabs: { flexDirection: 'row', justifyContent: 'space-around', maxWidth: 560, width: '100%', alignSelf: 'center', paddingTop: 4 },
  logo: { width: 112, height: 112, borderRadius: 30, backgroundColor: C.card, borderWidth: 1, borderColor: C.gold, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  input: { backgroundColor: '#E9F1EB', borderRadius: 9, padding: 11, color: C.ink, fontSize: 16 },
});
