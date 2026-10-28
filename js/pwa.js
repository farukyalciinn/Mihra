/* ---- PWA: service worker kaydı ve "uygulamayı yükle" ---- */
if('serviceWorker' in navigator&&location.protocol!=='file:'&&!(window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform()))addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
let installEv=null;
const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEv=e;if(U.settings)R()});
addEventListener('appinstalled',()=>{installEv=null;toast('MİHRA ana ekrana eklendi.');if(U.settings)R()});
const installHTML=()=>standalone()?'':installEv?B('📲 Uygulamayı yükle','install'):isIOS?`<p class="c sm mint">iPhone’a yüklemek için Safari’de <b>Paylaş</b> → <b>Ana Ekrana Ekle</b>’ye dokun.</p>`:'';
document.addEventListener('click',e=>{const t=e.target.closest('[data-a="install"]');if(!t||!installEv)return;installEv.prompt();installEv.userChoice.finally(()=>{installEv=null;R()})});
