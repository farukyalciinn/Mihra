import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { PR5 } from '../data/namazRehberi';
import { State } from './store';

export type Times = Record<string, string>;
const COUNTRY_EN: Record<string, string> = { Türkiye: 'Turkey', Almanya: 'Germany', Fransa: 'France', Hollanda: 'Netherlands', Belçika: 'Belgium', 'Birleşik Krallık': 'United Kingdom', ABD: 'United States', 'Suudi Arabistan': 'Saudi Arabia' };
const ascii = (s: string) => s.replace(/İ/g, 'I').replace(/ı/g, 'i').replace(/ç/g, 'c').replace(/Ç/g, 'C').replace(/ş/g, 's').replace(/Ş/g, 'S').replace(/ğ/g, 'g').replace(/Ğ/g, 'G').replace(/ü/g, 'u').replace(/Ü/g, 'U').replace(/ö/g, 'o').replace(/Ö/g, 'O');
export const pad = (n: number) => String(n).padStart(2, '0');

export async function fetchTimes(s: State): Promise<{ t: Times; src: 'ok' | 'cache'; lat?: number; lon?: number } | null> {
  const has = s.lat != null && s.lon != null;
  const method = s.cc === 'TR' || (!s.cc && s.country === 'Türkiye') ? 13 : 3;
  const key = 'mihra-t-' + (has ? `${s.lat!.toFixed(2)},${s.lon!.toFixed(2)}` : s.country + s.city) + new Date().toDateString();
  try {
    const u = has
      ? `https://api.aladhan.com/v1/timings?latitude=${s.lat}&longitude=${s.lon}&method=${method}`
      : `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(ascii(s.city))}&country=${encodeURIComponent(COUNTRY_EN[s.country] || s.country)}&method=${method}`;
    const j = await (await fetch(u)).json();
    if (!j.data?.timings) throw new Error('x');
    const out = { t: j.data.timings as Times, lat: Number(j.data.meta?.latitude), lon: Number(j.data.meta?.longitude) };
    AsyncStorage.setItem(key, JSON.stringify(out)).catch(() => {});
    return { ...out, src: 'ok' };
  } catch {
    const c = await AsyncStorage.getItem(key).catch(() => null);
    return c ? { ...JSON.parse(c), src: 'cache' } : null;
  }
}

export function nextPrayer(t: Times | null, now: Date) {
  if (!t) return null;
  const sec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const list = PR5.map(([a, b]) => { const m = /(\d+):(\d+)/.exec(t[b] || ''); return m ? { name: a, time: pad(+m[1]) + ':' + m[2], sec: +m[1] * 3600 + +m[2] * 60 } : null; }).filter(Boolean) as { name: string; time: string; sec: number }[];
  if (!list.length) return null;
  let x = list.find(i => i.sec > sec), d: number;
  if (x) d = x.sec - sec; else { x = list[0]; d = 86400 - sec + x.sec; }
  return { name: x.name, time: x.time, left: `${pad(Math.floor(d / 3600))}:${pad(Math.floor((d % 3600) / 60))}:${pad(d % 60)}` };
}

export async function locate(): Promise<Partial<State> | 'denied' | 'error'> {
  try {
    const p = await Location.requestForegroundPermissionsAsync();
    if (p.status !== 'granted') return 'denied';
    const l = await Location.getCurrentPositionAsync({});
    let country = '', cc = '', city = 'Konumum';
    try {
      const g = (await Location.reverseGeocodeAsync(l.coords))[0];
      if (g) { country = g.country || ''; cc = g.isoCountryCode || ''; city = (cc === 'TR' ? g.region || g.city : g.city || g.region) || 'Konumum'; }
    } catch {}
    city = city.replace(/ (İli|Province)$/, '');
    return { lat: l.coords.latitude, lon: l.coords.longitude, auto: true, country, cc, city };
  } catch { return 'error'; }
}
