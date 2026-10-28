/* ---- Android (Capacitor): bildirimleri telefona önceden zamanlar; uygulama kapalıyken de gelir ---- */
const NATIVE=!!(window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform());
const LN=NATIVE?Capacitor.Plugins.LocalNotifications:null;
const PLAN_DAYS=7; // her açılışta önümüzdeki 7 gün yeniden kurulur
if(LN){LN.createChannel({id:'vakit',name:'Namaz vakitleri',description:'Vakit girdiğinde veya yaklaştığında',importance:5,visibility:1,vibration:true}).catch(()=>{});
LN.createChannel({id:'gunluk',name:'Günlük içerik',description:'Günün ayeti, hadisi, esması ve duası',importance:3,visibility:1}).catch(()=>{})}
let planT;function planNotes(){if(!LN)return;clearTimeout(planT);planT=setTimeout(doPlan,600)}
async function doPlan(){try{const p=await LN.checkPermissions();if(p.display!=='granted')return;
const pend=await LN.getPending();if(pend.notifications.length)await LN.cancel({notifications:pend.notifications.map(n=>({id:n.id}))});
if(!S.setup)return;const now=new Date(),list=[];
for(let i=0;i<PLAN_DAYS;i++){const d=new Date(now.getFullYear(),now.getMonth(),now.getDate()+i),x=dayTimes(d);
if(x&&S.np.on)PR5.forEach(([a,b],j)=>{if(!S.np.list[a])return;const m=/(\d+):(\d+)/.exec(x.t[b]||'');if(!m)return;const at=new Date(d.getFullYear(),d.getMonth(),d.getDate(),+m[1],+m[2]-S.np.before);if(at<=now)return;const hm=m[1].padStart(2,'0')+':'+m[2];
list.push({id:i*10+j+1,title:'MİHRA · '+a,body:S.np.before?`${a} namazına ${S.np.before} dakika kaldı (${hm})`:`${a} vakti girdi (${hm})`,schedule:{at,allowWhileIdle:true},channelId:'vakit'})});
const t=S.dn.time.split(':'),at=new Date(d.getFullYear(),d.getMonth(),d.getDate(),+t[0],+t[1]);
if(at>now)DN.forEach(([k],j)=>{if(!S.dn[k])return;const c=dailyContent(k,d);list.push({id:1000+i*10+j,title:c[0],body:c[1],largeBody:c[1],schedule:{at,allowWhileIdle:true},channelId:'gunluk'})})}
if(list.length)await LN.schedule({notifications:list})}catch(e){}}
// Bildirim izni + Android 12+ "Alarmlar ve hatırlatıcılar" izni (tam vaktinde gelmesi için)
async function nativePerm(){try{let p=await LN.checkPermissions();if(p.display!=='granted')p=await LN.requestPermissions();
if(p.display!=='granted'){toast('Bildirim izni verilmedi. Telefon Ayarlar › Uygulamalar › MİHRA › Bildirimler’den açabilirsin.');return}
const ex=LN.checkExactNotificationSetting?await LN.checkExactNotificationSetting():{exact_alarm:'granted'};
if(ex.exact_alarm!=='granted'&&confirm('Bildirimlerin tam vaktinde gelmesi için “Alarmlar ve hatırlatıcılar” iznini açman gerekiyor. Ayarlara gidilsin mi?'))await LN.changeExactNotificationSetting();
planNotes();toast('Bildirimler açık. Vakitler uygulama kapalıyken de bildirilecek.')}catch(e){toast('Bildirim izni alınamadı.')}}
// Bildirim ayarı değişince ya da uygulama öne gelince planı yenile
if(LN){document.addEventListener('click',e=>{const t=e.target.closest('[data-a]');if(t&&['np_on','np_pr','dn_tog','finish'].includes(t.dataset.a))planNotes()});
document.addEventListener('input',e=>{if(e.target.id==='before'||e.target.id==='dtime')planNotes()});
document.addEventListener('change',e=>{if(e.target.id==='before'||e.target.id==='dtime')planNotes()});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)planNotes()})}

/* ---- Android: duvar kağıdını sözle birlikte kendiliğinden değiştir ----
   Her söz için seçilen zemin ve renkle bir resim hazırlanıp telefona kaydedilir;
   değişimi uygulama kapalıyken de telefon yapar (WallpaperScheduler.java). */
const WP=NATIVE?Capacitor.Plugins.MihraWallpaper:null;
if(NATIVE&&S.wp.style&&S.wp.style!=='foto')U.wst=S.wp.style;
const wallAutoHTML=()=>`<div class="sl">Otomatik duvar kağıdı</div>`+chk('Duvar kağıdımı otomatik değiştir',S.wp.auto,'wauto')+(S.wp.auto?`<div class="sl">Nereye</div>`+[['both','Kilit ve ana ekran'],['lock','Sadece kilit ekranı'],['home','Sadece ana ekran']].map(([k,l])=>rad(l,(S.wp.target||'both')===k,'wtarget',k)).join(''):'')+`<p class="sm mint">Seçtiğin zemin ve renkle hazırlanan duvar kağıdı, söz değiştikçe telefon tarafından yenilenir; MİHRA kapalıyken de çalışır.</p>`;
let wallT;function wallSync(){if(!WP)return;clearTimeout(wallT);wallT=setTimeout(wallApply,1200)}
async function wallApply(){try{if(!S.wp.auto){await WP.stop();return}
if(U.wst==='foto'&&!U.wimg){toast('Kendi duvar kağıdını yeniden seç.');return}
S.wp.style=U.wst;save();toast('Duvar kağıtları hazırlanıyor…');
const cv=document.createElement('canvas');await WP.clear();
for(let i=0;i<SOZ.length;i++){drawWall(cv,U.wst,SOZ[i]);await WP.saveImage({index:i,data:cv.toDataURL('image/jpeg',.9).split(',')[1]})}
await WP.start({count:SOZ.length,hours:S.wp.hours,target:S.wp.target||'both'});
toast(`Duvar kağıdı ayarlandı; her ${S.wp.hours} saatte bir kendiliğinden değişecek.`)}catch(e){toast('Duvar kağıdı ayarlanamadı.')}}
// Zemin, renk, sıklık veya fotoğraf değişince resimleri yeniden hazırla
if(WP){document.addEventListener('click',e=>{const t=e.target.closest('[data-a]');if(t&&S.wp.auto&&['wst','wcol','whours'].includes(t.dataset.a))wallSync()});
document.addEventListener('change',e=>{if(S.wp.auto&&(e.target.id==='wcol'||e.target.id==='wimg'))wallSync()})}
