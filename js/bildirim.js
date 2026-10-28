/* ---- Bildirim altyapısı ---- */
const doy=()=>Math.floor((Date.now()-new Date(new Date().getFullYear(),0,0))/864e5);
function dailyContent(k){const d=doy();if(k==='ayet'){const a=AYET[d%AYET.length];return ['Günün Ayeti',a[1]+' ('+a[2]+')']}if(k==='hadis'){const h=HADIS[d%HADIS.length];return ['Günün Hadisi',h[0]+' ('+h[1]+')']}if(k==='esma'){const e=ESMA[d%ESMA.length];return ['Esmaül Hüsna',e[1]+' — '+e[2]]}const u=D.duas[d%D.duas.length];return ['Günün Duası',u.name+': '+u.meaning]}
let AC;function tone(f,t0,d,g){const c=AC,o=c.createOscillator(),v=c.createGain(),s=c.currentTime+t0;o.type='sine';o.frequency.value=f;v.gain.setValueAtTime(0.0001,s);v.gain.linearRampToValueAtTime(g||0.2,s+0.02);v.gain.exponentialRampToValueAtTime(0.001,s+d);o.connect(v);v.connect(c.destination);o.start(s);o.stop(s+d+0.05)}
function playSound(k){if(k==='sessiz')return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();if(k==='klasik'){tone(880,0,.35);tone(660,.3,.55)}else{[523,659,784,1047].forEach((f,i)=>tone(f,i*.16,.32))}}catch(e){}}
const VIB={kisa:[200],cift:[150,100,150],uzun:[700]};
const buzz=k=>{if(k&&VIB[k]&&navigator.vibrate)navigator.vibrate(VIB[k])};
// Android Chrome sayfadan new Notification() açmaya izin vermez; varsa service worker üzerinden göster
async function showNote(title,body){if(!('Notification' in window)||Notification.permission!=='granted')return false;
try{const r=navigator.serviceWorker&&await navigator.serviceWorker.getRegistration();if(r){await r.showNotification(title,{body,icon:'icons/icon-192.png',lang:'tr',tag:title});return true}}catch(e){}
try{new Notification(title,{body});return true}catch(e){return false}}
function fire(title,body){toast(title+' — '+body);playSound(S.np.sound);buzz(S.np.vib);showNote(title,body)}
const FIRED={};
function tick2(){const d=new Date(),sec=d.getHours()*3600+d.getMinutes()*60+d.getSeconds(),day=d.toDateString();
if(T.day&&T.day!==dkey(d)&&T.status!=='loading'&&!pickDay())loadTimes();
if(S.setup&&S.np.on&&T.t&&!T.demo)PR5.forEach(([a,b])=>{if(!S.np.list[a])return;const m=/(\d+):(\d+)/.exec(T.t[b]||'');if(!m)return;const tg=(+m[1])*3600+(+m[2])*60-S.np.before*60,k=day+a+S.np.before,hm=m[1].padStart(2,'0')+':'+m[2];if(sec>=tg&&sec<tg+60&&!FIRED[k]){FIRED[k]=1;fire('MİHRA · '+a,S.np.before?`${a} namazına ${S.np.before} dakika kaldı (${hm})`:`${a} vakti girdi (${hm})`)}});
const p=S.dn.time.split(':'),tg=(+p[0])*3600+(+p[1])*60;if(S.setup&&sec>=tg&&sec<tg+60)['ayet','hadis','esma','dua'].forEach(k=>{const key=day+k;if(S.dn[k]&&!FIRED[key]){FIRED[key]=1;const c=dailyContent(k);fire(c[0],c[1])}})}
const chk=(l,on,a,v)=>`<button class="opt" data-a="${a}" data-v="${esc(v==null?'':v)}"><span class="ck${on?' on':''}">${on?'✓':''}</span><span>${esc(l)}</span></button>`;
const rad=(l,on,a,v)=>`<button class="opt" data-a="${a}" data-v="${v}"><span class="rd${on?' on':''}"></span><span>${l}</span></button>`;
const DN=[['ayet','Günün Ayeti'],['hadis','Günün Hadisi'],['esma','Esmaül Hüsna'],['dua','Günün Duası']];
