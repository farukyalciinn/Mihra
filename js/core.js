/* Ortak yardımcılar, kalıcı durum (S), arayüz durumu (U) ve küçük HTML üreticileri */
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ascii=s=>s.replace(/İ/g,'I').replace(/ı/g,'i').replace(/ç/g,'c').replace(/Ç/g,'C').replace(/ş/g,'s').replace(/Ş/g,'S').replace(/ğ/g,'g').replace(/Ğ/g,'G').replace(/ü/g,'u').replace(/Ü/g,'U').replace(/ö/g,'o').replace(/Ö/g,'O');
const pad=n=>String(n).padStart(2,'0');
const PR=[['İmsak','Fajr'],['Güneş','Sunrise'],['Öğle','Dhuhr'],['İkindi','Asr'],['Akşam','Maghrib'],['Yatsı','Isha']];
const prayerData=[['Sabah','2 sünnet · 2 farz'],['Öğle','4 ilk sünnet · 4 farz · 2 son sünnet'],['İkindi','4 sünnet · 4 farz'],['Akşam','3 farz · 2 sünnet'],['Yatsı','4 ilk sünnet · 4 farz · 2 son sünnet · 3 vitir']];
const starts=[1,22,42,62,82,102,121,142,162,182,201,222,242,262,282,302,322,342,362,382,402,422,442,462,482,502,522,542,562,582];
const DEMO={Fajr:'05:12',Sunrise:'06:41',Dhuhr:'12:30',Asr:'15:28',Maghrib:'18:05',Isha:'19:28'};
const NAMES={ayet:'Günün Ayeti',esma:'Esmaül Hüsna',dua:'Günün Duası'};
const init={setup:false,country:'Türkiye',city:'İstanbul',notifications:true,daily:{ayet:true,esma:true,dua:false},counts:{},favZ:[],favD:[],custom:[],page:1,bookmarks:[],savedLessons:[],completed:[],lastSurah:0,goal:33,zikir:'Sübhanallah',esma:0,meal:true,wp:{hours:2,color:'#FFFFFF'},lat:null,lon:null,cc:'',auto:false,np:{on:true,list:{Sabah:true,Öğle:true,İkindi:true,Akşam:true,Yatsı:true},sound:'melodi',vib:'uzun',before:0},dn:{ayet:true,hadis:true,esma:true,dua:false,time:'09:00'}};
let S=Object.assign({},init);try{S=Object.assign(S,JSON.parse(localStorage.getItem('mihra-v1')||'{}'))}catch(e){}
const save=()=>{try{localStorage.setItem('mihra-v1',JSON.stringify(S))}catch(e){}};
const blank=()=>({name:'',cat:'Kişisel',ar:'',pron:'',meaning:''});
const U={stage:S.setup?3:0,tab:'Vakitler',settings:false,zs:'Zikirmatik',duaCat:'Günlük',duaOpen:'',edit:-1,draft:blank(),lcat:'İbadet',lesson:'',step:0,prayer:'Öğle',guide:false,qv:'Sureler',query:'',openS:0,gpart:0,gstep:0,gmode:'alone',gopen:false,gfor:'',vopen:'',ayi:-1,esi:-1,stab:'Konum',abt:'',reader:0,lq:'',eopen:false,ww:0,wst:'zumrut',fs:22,loc:'idle',locErr:'',manual:false,pc:null,cityRes:[],cityMsg:''};
const T={status:'idle',t:null,lat:null,lon:null,demo:false,gps:null};
const K={aligned:false,heading:null,st:'idle',on:false,msg:''};
const iosPerm=typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function';
const Q={surahs:[],status:'idle',cache:{},loading:false};
let toastT;const toast=m=>{const e=$('#toast');e.textContent=m;e.style.display='block';clearTimeout(toastT);toastT=setTimeout(()=>e.style.display='none',3800)};
const P=(l,on,a,v)=>`<button class="pill${on?' on':''}" data-a="${a}" data-v="${esc(v==null?l:v)}">${esc(l)}</button>`;
const B=(l,a,v,o)=>`<button class="btn${o?' out':''}" data-a="${a}" data-v="${esc(v==null?'':v)}">${esc(l)}</button>`;
const Pn=(h,d)=>`<section class="panel${d?' dark':''}">${h}</section>`;
const L=(l,u)=>`<a href="${u}" target="_blank" rel="noopener">${l} ↗</a>`;
const has=(f,x)=>S[f].includes(x);
function tog(f,x){S[f]=has(f,x)?S[f].filter(y=>y!==x):S[f].concat([x]);save()}
const juzOf=n=>starts.filter(x=>x<=n).length;
