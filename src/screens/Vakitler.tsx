import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { C } from '../theme';
import { Panel, T, Btn, Row } from '../components/ui';
import { useStore } from '../lib/store';
import { fetchTimes, nextPrayer, Times } from '../lib/prayer';
import { PR5, RK, AYET, genSteps } from '../data/namazRehberi';
import { ESMA } from '../data/esma';

const doy = () => Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 864e5);

export default function Vakitler() {
  const { s } = useStore();
  const [times, setTimes] = useState<Times | null>(null);
  const [status, setStatus] = useState<'loading' | 'ok' | 'cache' | 'error'>('loading');
  const [now, setNow] = useState(new Date());
  const [guide, setGuide] = useState(false);
  const [part, setPart] = useState(0);
  const [mode, setMode] = useState<'alone' | 'imam'>('alone');
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);
  const [vopen, setVopen] = useState('');
  const [ai, setAi] = useState(doy() % AYET.length);
  const [ei, setEi] = useState(doy() % ESMA.length);

  const load = async () => {
    setStatus('loading');
    const r = await fetchTimes(s);
    if (r) { setTimes(r.t); setStatus(r.src); } else { setTimes(null); setStatus('error'); }
  };
  useEffect(() => { load(); }, [s.city, s.country, s.lat, s.lon]);
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  const n = useMemo(() => nextPrayer(times, now), [times, now]);
  useEffect(() => { if (n) { const p = RK[n.name]; setPart(Math.max(0, p.findIndex(x => x[2] === 'farz'))); setStep(0); setOpen(false); } }, [n?.name]);

  const parts = n ? RK[n.name] : [];
  const pt = parts[part] || parts[0];
  const kind = pt?.[2];
  const m = kind === 'sunnet' ? 'alone' : mode;
  const steps = pt ? genSteps(kind, pt[1], m) : [];
  const cur = steps[Math.min(step, steps.length - 1)];
  const A = AYET[ai], E = ESMA[ei];

  return (
    <View style={{ gap: 13 }}>
      <Panel dark>
        <View style={{ alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 30, color: C.gold }}>☀︎</Text>
          <T light style={{ color: C.mint }}>Sıradaki Namaz</T>
          {n ? (<>
            <Text style={{ color: C.gold, fontSize: 40, fontWeight: '800' }}>{n.name}</Text>
            <Text style={{ color: C.cream, fontSize: 44, fontWeight: '700', fontVariant: ['tabular-nums'] }}>{n.left}</Text>
            <T light style={{ color: C.mint }}>{n.time} · Namaza kalan süre</T>
          </>) : (<>
            <Text style={{ color: C.gold, fontSize: 24, fontWeight: '700' }}>{status === 'loading' ? 'Vakitler yükleniyor…' : 'Vakitler alınamadı'}</Text>
            <Text style={{ color: C.cream, fontSize: 44, fontWeight: '700' }}>--:--:--</Text>
            <Btn dark outline label="↻ Vakitleri yenile" onPress={load} />
          </>)}
        </View>
        {n && (<>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {parts.map(p => (
              <View key={p[0]} style={s2.rbox}><T light size={13}>{p[0]}</T><Text style={s2.rnum}>{p[1]}</Text><T light size={13}>rekât</T></View>
            ))}
          </View>
          <TouchableOpacity style={s2.wbtn} onPress={() => setGuide(g => !g)}><Text style={{ fontWeight: '700', fontSize: 16, color: C.ink }}>📖 Nasıl Kılınır? {guide ? '⌃' : '⌄'}</Text></TouchableOpacity>
          {guide && pt && cur && (
            <View style={s2.gcard}>
              <T bold size={21}>{n.name} Namazı Rehberi</T>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {parts.map((p, k) => (
                  <TouchableOpacity key={p[0]} style={[s2.chip, k === part && { backgroundColor: C.card }]} onPress={() => { setPart(k); setStep(0); setOpen(false); }}>
                    <Text style={{ textAlign: 'center', color: k === part ? C.cream : C.ink, fontSize: 14 }}>{p[0]}{'\n'}{p[1]} rekât</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Row>
                {(['alone', 'imam'] as const).map(x => (
                  <TouchableOpacity key={x} onPress={() => { setMode(x); setStep(0); setOpen(false); }} style={[s2.seg, m === x && { backgroundColor: C.soft }]}>
                    <Text style={{ fontWeight: '600', fontSize: 16, color: m === x ? C.ink : '#6f8379' }}>{x === 'alone' ? 'Tek Başına' : 'İmamla'}</Text>
                  </TouchableOpacity>
                ))}
              </Row>
              {kind === 'sunnet' && mode === 'imam' && <T size={12}>Sünnetler genellikle tek başına kılınır; tek başına akışı gösteriliyor.</T>}
              <View style={s2.gstep}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><T size={12}>Adım {Math.min(step, steps.length - 1) + 1} / {steps.length}</T><T size={12}>{pt[1]} rekât · {pt[0]}</T></View>
                <T bold size={24}>{cur.t}</T>
                <T>{cur.d}</T>
                {cur.x.length > 0 && (
                  <View style={s2.oku}>
                    <TouchableOpacity onPress={() => setOpen(o => !o)} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <T bold size={17} style={{ color: C.card }}>📖 Oku ve Öğren</T><T>{open ? '⌃' : '⌄'}</T>
                    </TouchableOpacity>
                    {open && cur.x.map((x: string[]) => (
                      <View key={x[0]} style={{ backgroundColor: C.soft, borderRadius: 12, padding: 12, gap: 6 }}>
                        <T bold>{x[0]}</T>
                        <Text style={{ fontSize: 24, color: '#14352c', textAlign: 'right', lineHeight: 48, writingDirection: 'rtl' }}>{x[1]}</Text>
                        <T><T bold>Okunuş: </T>{x[2]}</T>
                        <T><T bold>Anlamı: </T>{x[3]}</T>
                      </View>
                    ))}
                  </View>
                )}
              </View>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Btn outline label="← Önceki" style={{ flex: 1 }} onPress={() => { setStep(Math.max(0, step - 1)); setOpen(false); }} />
                <Btn label={step < steps.length - 1 ? 'Sonraki →' : 'Bitir ✓'} style={{ flex: 1 }} onPress={() => { if (step >= steps.length - 1) { setGuide(false); setStep(0); } else { setStep(step + 1); setOpen(false); } }} />
              </View>
              <T size={12}>Hanefî uygulamasına göre hazırlanmış öğretici içeriktir; yayın öncesi Diyanet kaynaklarıyla doğrulanmalıdır.</T>
            </View>
          )}
        </>)}
      </Panel>

      <Text style={{ textAlign: 'center', color: C.mint, fontSize: 14 }}>⌄ Aşağı kaydırarak devam et</Text>

      <Panel>
        <View style={s2.hd}><T bold size={19}>Günün Sözü</T><TouchableOpacity style={s2.rf} onPress={() => setAi((ai + 1) % AYET.length)}><Text style={{ color: C.card, fontSize: 18 }}>⟳</Text></TouchableOpacity></View>
        <Text style={{ fontSize: 26, color: C.card, textAlign: 'center', lineHeight: 50, writingDirection: 'rtl' }}>{A[0]}</Text>
        <T style={{ textAlign: 'center' }}>{A[1]}</T>
        <T size={12} style={{ textAlign: 'center' }}>{A[2]}</T>
      </Panel>

      <Panel dark>
        <View style={s2.hd}><Text style={{ color: C.gold, fontWeight: '700', fontSize: 18 }}>Esmaül Hüsna</Text><TouchableOpacity style={[s2.rf, { backgroundColor: C.card2 }]} onPress={() => setEi((ei + 1) % ESMA.length)}><Text style={{ color: C.gold, fontSize: 18 }}>⟳</Text></TouchableOpacity></View>
        <Text style={{ fontSize: 36, color: C.gold, textAlign: 'center', lineHeight: 64, writingDirection: 'rtl' }}>{E[0]}</Text>
        <T light bold style={{ textAlign: 'center' }}>{E[1]}</T>
        <T light style={{ textAlign: 'center', color: C.mint }}>{E[2]}.</T>
      </Panel>

      <Panel>
        <T bold size={19}>Namaz Vakitleri</T>
        {times ? (<>
          {PR5.map(([a, b]) => (
            <View key={a}>
              <TouchableOpacity onPress={() => setVopen(vopen === a ? '' : a)} style={[s2.vrow, n?.name === a && { backgroundColor: C.soft, paddingHorizontal: 8, borderRadius: 8 }]}>
                <T bold>{a}</T><T bold>{(times[b] || '--:--').slice(0, 5)}  {vopen === a ? '⌄' : '›'}</T>
              </TouchableOpacity>
              {vopen === a && (
                <View style={{ backgroundColor: C.soft, borderRadius: 12, padding: 12, marginTop: 6, gap: 4 }}>
                  {RK[a].map(p => (<View key={p[0]} style={s2.hd}><T>{p[0]}</T><T bold>{p[1]} rekât</T></View>))}
                </View>
              )}
            </View>
          ))}
          <T size={12}>Güneş doğuşu: {(times.Sunrise || '--:--').slice(0, 5)}</T>
          <T size={12}>{status === 'cache' ? 'Çevrimdışı: son kaydedilen vakitler. ' : ''}Aladhan verisi (Türkiye için Diyanet yöntemi); kesin vakit için Diyanet ile karşılaştır. Satıra dokununca rekât sayıları görünür.</T>
        </>) : <T>{status === 'loading' ? 'Vakitler yükleniyor…' : 'İnternet bağlantısı yok ya da vakitler alınamadı. Yanlış saat göstermemek için saat uydurulmuyor.'}</T>}
      </Panel>
    </View>
  );
}
const s2 = StyleSheet.create({
  rbox: { flex: 1, backgroundColor: C.card2, borderRadius: 18, paddingVertical: 12, alignItems: 'center' },
  rnum: { color: C.gold, fontSize: 30, fontWeight: '700' },
  wbtn: { backgroundColor: C.paper, borderRadius: 999, padding: 15, alignItems: 'center' },
  gcard: { backgroundColor: C.paper, borderRadius: 20, padding: 16, gap: 12 },
  chip: { flex: 1, backgroundColor: '#C6D6CA', borderRadius: 14, paddingVertical: 10, alignItems: 'center' },
  seg: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 999 },
  gstep: { backgroundColor: C.soft, borderRadius: 16, padding: 16, gap: 10 },
  oku: { backgroundColor: '#E9F1EB', borderRadius: 14, padding: 12, gap: 10 },
  hd: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rf: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#C6D6CA', alignItems: 'center', justifyContent: 'center' },
  vrow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 11, borderBottomWidth: 0.5, borderColor: '#94A89C' },
});
