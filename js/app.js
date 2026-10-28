/* ---- Ana çizim, olaylar ve başlangıç ---- */
const views={'Vakitler':vVak,'Kıble':vKib,'Zikir':vZik,'Kur’an':vKur,'Öğren':vOgr};
function R(){const y=scrollY;let h;
if(U.stage===0)h=`<div class="welcome"><div class="logo">☾</div><div class="brandbig">MİHRA</div><b style="font-size:18px">Huzura açılan bir kapı.</b><p class="mint" style="margin-top:10px">Namaz vakitleri, kıble, zikir, Kur’an ve dinî bilgiler bir arada.</p><div style="height:24px"></div>${B('Başlayalım →','stage',1)}<span class="mint sm">Ücretsiz · Üyelik gerektirmez</span></div>`;
else if(U.stage===1)h=Pn(`<div class="gold">İLK KURULUM · 1/2</div><h3 style="font-size:24px">Konumun</h3>`+(U.loc==='loading'?`<p>Konumun alınıyor… Tarayıcı izin isterse <b>İzin ver</b>'e dokun.</p>`:`<p class="mint sm">Namaz vakitleri ve kıble otomatik ayarlansın diye konum izni gerekir. İzin vermezsen şehrini aşağıdan arayarak seçebilirsin.</p>`+(U.loc==='fail'?`<p class="sm" style="color:var(--gold)">${locErr()}</p>`:'')+B('📍 Konumumu otomatik bul','autoloc')+pickHTML()),1);
else if(U.stage===2)h=Pn(`<div class="gold">İLK KURULUM · 2/2</div><h3 style="font-size:24px">Bildirim tercihleri</h3>${togHTML()}${B('Bildirim iznini dene','notif',0,1)}<p class="mint sm">Tercihler kaydedilir. ${NATIVE?'Bildirimler MİHRA kapalıyken de gelir.':'Bildirimler MİHRA açıkken gelir.'}</p>${B('MİHRA\'yı Aç →','finish')}`,1);
else h=`<div class="header"><div><div class="brand">MİHRA</div><span class="mint sm">⌖ ${esc(S.city)}${S.country?', '+esc(S.country):''}${T.demo?' · Örnek vakitler':''}</span></div><div class="row" style="flex-wrap:nowrap;gap:8px"><button class="icon" data-a="wallopen" style="font-size:13px;height:48px;border-radius:24px;padding:0 14px">🖼 Duvar Kağıdı</button><button class="icon" data-a="settings" aria-label="Ayarlar" style="font-size:20px;width:52px;height:52px;border-radius:50%">${U.settings?'✕':'⚙'}</button></div></div>`+views[U.tab]();
const el0=$('#el'),est=el0?el0.scrollTop:0;$('#app').innerHTML=h;const el1=$('#el');if(el1)el1.scrollTop=est;const sh=$('#sheet'),on=U.settings&&U.stage===3;if(on){const sst=sh.scrollTop;sh.innerHTML='<div class="shin"><div class="hd"><span class="brand" style="font-size:24px">Ayarlar</span><button class="icon" data-a="settings" aria-label="Kapat" style="font-size:20px;width:48px;height:48px;border-radius:50%">✕</button></div>'+vSet()+'</div>';sh.scrollTop=sst;if(U.stab==='Duvar Kağıdı'){WS=slot();drawWall($('#wall'),U.wst)}}sh.classList.toggle('open',on);const rd=$('#reader'),ron=U.reader>0&&U.stage===3;if(ron){const rs=rd.scrollTop,same=rd.dataset.n===String(U.reader);rd.innerHTML=readerHTML();rd.scrollTop=same?rs:0;rd.dataset.n=U.reader}rd.classList.toggle('open',ron);const t=$('#tabs');t.style.display=U.stage===3?'block':'none';
t.firstElementChild.innerHTML=[['Vakitler','🕒'],['Kıble','🧭'],['Zikir','📿'],['Kur’an','📖'],['Öğren','🎓']].map(([n,i])=>`<button class="${U.tab===n?'on':''}" data-a="tab" data-v="${n}"><i>${i}</i>${n}</button>`).join('');scrollTo(0,y)}

document.addEventListener('click',e=>{const t=e.target.closest('[data-a]');if(!t)return;const a=t.dataset.a,v=t.dataset.v;const go=top=>{R();if(top)scrollTo(0,0)};
const Z=()=>S.zikir==='Esmaül Hüsna'?'E:'+ESMA[S.esma||0][1]:S.zikir,cnt=()=>S.counts[Z()]||0;
switch(a){
case 'stage':U.stage=+v;if(U.stage===1){locate();return}return go(1);
case 'finish':S.setup=true;save();U.stage=3;ensurePages();loadTimes();if(!iosPerm)compass();return go(1);
case 'settings':U.settings=!U.settings;return go(1);
case 'tab':U.tab=v;U.settings=false;if(v==='Kıble'&&iosPerm&&!K.on&&K.st!=='denied')compass();if(v==='Kur’an')return go(1);
case 'stab':U.stab=v;return go();
case 'abt':U.abt=U.abt===v?'':v;return go();
case 'share':{const u=location.href.split('#')[0];if(navigator.share){navigator.share({title:'MİHRA',text:'Namaz vakitleri, kıble, zikir, Kur’an ve dinî bilgiler',url:u}).catch(()=>{})}else copyText(u).then(ok=>toast(ok?'Bağlantı kopyalandı.':'Paylaşım bu cihazda desteklenmiyor.'));return}
case 'wipe':if(confirm('Ayarların, zikir sayaçların, kayıtların ve konum bilgin bu cihazdan silinsin mi? Bu işlem geri alınamaz.')){try{Object.keys(localStorage).filter(k=>k.indexOf('mihra')===0).forEach(k=>localStorage.removeItem(k))}catch(e){}location.reload()}return;
case 'wst':U.wst=v;return go();
case 'wpick':{const f=$('#wimg');if(f)f.click();return}
case 'wcol':S.wp.color=v;save();return go();
case 'wauto':S.wp.auto=!S.wp.auto;save();wallSync();return go();
case 'wtarget':S.wp.target=v;save();wallSync();return go();
case 'whours':S.wp.hours=+v;save();WS=-1;return go();
case 'wallopen':U.settings=true;U.stab='Duvar Kağıdı';U.ww=0;return go();
case 'wstart':U.ww=1;return go();
case 'wprev':U.ww=Math.max(0,U.ww-1);return go();
case 'wnext':{if(U.ww>=wizSteps().length){U.ww=0;toast('Duvar kağıdı ayarların tamam. Allah kabul etsin.')}else U.ww++;return go()}
case 'wend':U.ww=0;return go();
case 'wcopy':copyText(scriptText()).then(ok=>toast(ok?'Script kopyalandı. Devam’a bas.':'Kopyalanamadı, tekrar dene.'));return;
case 'wscr':location.href='scriptable:///';setTimeout(()=>toast('Scriptable açılmadıysa kurulu olmayabilir; 1. adıma dön.'),1500);return;
case 'wsave':{const cv=$('#wall');if(!cv)return;cv.toBlob(async b=>{const f=new File([b],'mihra-duvar-kagidi.png',{type:'image/png'});try{if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:'MİHRA duvar kağıdı'});return}}catch(e){if(e&&e.name==='AbortError')return}const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=f.name;document.body.appendChild(a);a.click();a.remove();toast('Duvar kağıdı indirildi. Galeri/Fotoğraflar’dan duvar kağıdı yap.')})();return}
case 'np_on':S.np.on=!S.np.on;save();return go();
case 'np_pr':S.np.list[v]=!S.np.list[v];save();return go();
case 'np_snd':S.np.sound=v;save();playSound(v);return go();
case 'np_vib':S.np.vib=v;save();buzz(v);return go();
case 'dn_tog':S.dn[v]=!S.dn[v];save();return go();
case 'ntest':fire('MİHRA · Test','Bildirim ayarların çalışıyor.');return;
case 'dtest':{const k=DN.map(x=>x[0]).find(x=>S.dn[x])||'ayet',c=dailyContent(k);fire(c[0],c[1]);return}
case 'autoloc':locate();return;
case 'manual':U.manual=!U.manual;return go();
case 'pcountry':{const r=REG.find(x=>x[0]===v);U.pc={cc:v,name:r?r[1]:v};U.cityRes=[];U.cityMsg='';R();const c=$('#cts');if(c)c.focus();return}
case 'pcity':{const r=U.cityRes[+v];if(!r)return;Object.assign(S,{country:U.pc.name,cc:U.pc.cc,city:r.name,lat:r.latitude,lon:r.longitude,auto:false});save();U.manual=false;U.cityRes=[];U.pc=null;U.loc='idle';if(U.stage===1)U.stage=2;toast('Konum ayarlandı: '+S.city+', '+S.country);loadTimes();return go(1)}
case 'tog':if(v==='notifications')S.notifications=!S.notifications;else S.daily[v]=!S.daily[v];save();return go();
case 'notif':return notif();
case 'reload':loadTimes();return go();
case 'guide':U.guide=!U.guide;return go();
case 'gpart':U.gpart=+v;U.gstep=0;U.gopen=false;return go();
case 'gmode':U.gmode=v;U.gstep=0;U.gopen=false;return go();
case 'goku':U.gopen=!U.gopen;return go();
case 'gprev':U.gstep=Math.max(0,U.gstep-1);U.gopen=false;return go();
case 'gnext':{const n=nextP();const pt=n&&RK[n.name][U.gpart];if(!pt)return;const N=genSteps(pt[2],pt[1],U.gmode).length;if(U.gstep>=N-1){U.guide=false;U.gstep=0;toast('Bu namazın adımlarını tamamladın. Allah kabul etsin.');return go()}U.gstep++;U.gopen=false;return go()}
case 'vrow':U.vopen=U.vopen===v?'':v;return go();
case 'imsak':U.imsak=!U.imsak;U.imm=0;return go();
case 'imm':U.imm=+v;return go();
case 'rfa':U.ayi=((U.ayi<0?Math.floor((Date.now()-new Date(new Date().getFullYear(),0,0))/864e5)%AYET.length:U.ayi)+1)%AYET.length;return go();
case 'rfe':U.esi=((U.esi<0?Math.floor((Date.now()-new Date(new Date().getFullYear(),0,0))/864e5)%ESMA.length:U.esi)+1)%ESMA.length;return go();
case 'compass':K.on=false;K.st='idle';compass().then(()=>{if(U.tab==='Kıble')R()});return;
case 'simL':K.heading=((K.heading||0)+345)%360;checkAlign();return go();
case 'simR':K.heading=((K.heading||0)+15)%360;checkAlign();return go();
case 'zs':U.zs=v;return go();
case 'zk':{if(v==='Esmaül Hüsna')U.eopen=S.zikir==='Esmaül Hüsna'?!U.eopen:true;else U.eopen=false;S.zikir=v;save();return go()}
case 'goalset':{const x=Math.floor(+($('#cg').value));if(!(x>=1&&x<=1e7)){toast('Hedef 1 ile 10.000.000 arasında bir sayı olmalı.');return}S.goal=x;save();toast('Hedef ayarlandı: '+x.toLocaleString('tr-TR'));return go()}
case 'esma':S.esma=+v;U.eopen=false;save();go();setTimeout(()=>{const z=$('.zt');if(z)z.scrollIntoView({behavior:'smooth',block:'center'})},60);return;
case 'tap':{const n=cnt()+1,g=S.goal;S.counts[Z()]=n;save();if(navigator.vibrate&&n!==g)navigator.vibrate(15);$('#cnt').textContent=n;$('#bar').style.width=Math.min(100,n/g*100)+'%';$('#goalt').textContent=n>=g?`🎉 Hedefe ulaşıldı · ${n.toLocaleString('tr-TR')} / ${g.toLocaleString('tr-TR')}`:`Hedef: ${g.toLocaleString('tr-TR')} · %${Math.round(n/g*100)}`;if(n===g){const c=$('.counter');c.classList.remove('glow');void c.offsetWidth;c.classList.add('glow');setTimeout(()=>c.classList.remove('glow'),4600);if(navigator.vibrate)navigator.vibrate([200,100,200,100,400]);fire('MİHRA · Zikir hedefi','Hedefine ulaştın: '+g.toLocaleString('tr-TR')+' ✓')}return}
case 'undo':S.counts[Z()]=Math.max(0,cnt()-1);save();return go();
case 'reset':if(confirm('Bu zikrin sayacı sıfırlansın mı?')){S.counts[Z()]=0;save();go()}return;
case 'goal':S.goal=+v;save();return go();
case 'favz':tog('favZ',v);return go();
case 'favd':tog('favD',v);return go();
case 'imp':S.zikir=v;save();U.zs='Zikirmatik';return go(1);
case 'dc':U.duaCat=v;return go();
case 'duaopen':U.duaOpen=U.duaOpen===v?'':v;return go();
case 'gotodua':U.duaCat='Kaydedilenler';U.zs='Hazır Dualar';U.duaOpen=v;return go(1);
case 'savedua':{const d=U.draft;if(!d.name.trim()||!d.meaning.trim()){toast('Başlık ve dua metni gerekli.');return}if(U.edit<0)S.custom.push(Object.assign({},d));else S.custom[U.edit]=Object.assign({},d);save();U.draft=blank();U.edit=-1;toast('Dua kaydedildi.');return go()}
case 'editdua':U.draft=Object.assign({},S.custom[+v]);U.edit=+v;return go();
case 'deldua':if(confirm('Bu dua silinsin mi?')){S.custom.splice(+v,1);save();go()}return;
case 'qv':U.qv=v;return go();
case 'fsm':U.fs=Math.max(16,U.fs-2);return go();
case 'fsp':U.fs=Math.min(40,U.fs+2);return go();
case 'surah':return openSurah(+v);
case 'rclose':U.reader=0;return go();
case 'retry':delete Q.cache[+v];return openSurah(+v);
case 'meal':S.meal=!S.meal;save();return go();
case 'bm':tog('bookmarks',S.page);return go();
case 'juz':S.page=starts[+v-1];save();return go();
case 'pg':{const n=S.page+ +v;if(n>=1&&n<=604){S.page=n;save();go()}return}
case 'gopg':S.page=+v;save();return go();
case 'lc':U.lcat=v;U.lesson='';return go();
case 'lopen':U.lesson=U.lesson===v?'':v;U.step=0;return go();
case 'lstep':{const l=D.lessons.find(x=>x.name===U.lesson);U.step=Math.max(0,Math.min(l.steps.length-1,U.step+ +v));return go()}
case 'lsave':tog('savedLessons',v);return go();
case 'ldone':tog('completed',v);return go();
}});
document.addEventListener('change',e=>{if(e.target.id==='wimg'&&e.target.files&&e.target.files[0]){const im=new Image();im.onload=()=>{U.wimg=im;U.wst='foto';R()};im.src=URL.createObjectURL(e.target.files[0])}});
document.addEventListener('input',e=>{const t=e.target;if(t.id==='wcol'){S.wp.color=t.value;save();drawWall($('#wall'),U.wst);return}if(t.dataset&&t.dataset.f){U.draft[t.dataset.f]=t.value}else if(t.id==='before'){S.np.before=+t.value;save()}else if(t.id==='dtime'){S.dn.time=t.value;save()}else if(t.id==='cs'){U.pc=null;U.cityRes=[];U.cityMsg='';$('#cl').innerHTML=countryList(t.value);const c=$('#cts');if(c){c.disabled=true;c.value='';$('#ctl').innerHTML=''}}else if(t.id==='cts'){citySearch(t.value)}else if(t.id==='lq'){U.lq=t.value;U.lesson='';$('#ll').innerHTML=lessonList()}else if(t.id==='sq'){U.query=t.value;$('#sl').innerHTML=sureList()}});
setInterval(()=>{try{tick2();if(U.settings&&U.stab==='Duvar Kağıdı'&&WS!==slot()){WS=slot();drawWall($('#wall'),U.wst);const p=document.querySelector('#sheet .c.sm b');if(p)p.textContent=nextSoz()}}catch(e){}const n=nextP(),c=$('#cd');if(n&&c){c.textContent=n.left;$('#cdn').textContent=n.time+' · Namaza kalan süre'}},1000);
R();if(U.stage===3){ensurePages();loadTimes();silentLoc();if(!iosPerm)compass()}
