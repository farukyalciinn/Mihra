import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type State = {
  setup: boolean; country: string; city: string; cc: string; lat: number | null; lon: number | null; auto: boolean;
  counts: Record<string, number>; goal: number; zikir: string; esma: number;
  savedLessons: string[]; completed: string[]; lastSurah: number; meal: boolean;
  np: { on: boolean; list: Record<string, boolean>; sound: string; vib: string; before: number };
  dn: { ayet: boolean; hadis: boolean; esma: boolean; dua: boolean; time: string };
  wp: { hours: number; color: string };
};
export const INIT: State = {
  setup: false, country: 'Türkiye', city: 'İstanbul', cc: 'TR', lat: null, lon: null, auto: false,
  counts: {}, goal: 33, zikir: 'Esmaül Hüsna', esma: 0, savedLessons: [], completed: [], lastSurah: 0, meal: true,
  np: { on: true, list: { Sabah: true, Öğle: true, İkindi: true, Akşam: true, Yatsı: true }, sound: 'melodi', vib: 'uzun', before: 0 },
  dn: { ayet: true, hadis: true, esma: true, dua: false, time: '09:00' },
  wp: { hours: 2, color: '#FFFFFF' },
};
const KEY = 'mihra-rn-v1';
type Ctx = { s: State; set: (p: Partial<State>) => void; ready: boolean; wipe: () => Promise<void> };
const StoreCtx = createContext<Ctx>(null as any);
export const useStore = () => useContext(StoreCtx);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [s, setS] = useState<State>(INIT);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);
  useEffect(() => {
    AsyncStorage.getItem(KEY).then(v => { if (v) { try { setS({ ...INIT, ...JSON.parse(v) }); } catch {} } })
      .finally(() => { loaded.current = true; setReady(true); });
  }, []);
  useEffect(() => { if (loaded.current) AsyncStorage.setItem(KEY, JSON.stringify(s)).catch(() => {}); }, [s]);
  const set = (p: Partial<State>) => setS(o => ({ ...o, ...p }));
  const wipe = async () => { await AsyncStorage.clear(); setS(INIT); };
  return <StoreCtx.Provider value={{ s, set, ready, wipe }}>{children}</StoreCtx.Provider>;
}
