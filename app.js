'use strict';
/* Marginalia for iPad and phone. Reads and writes the desktop app's study files in OneDrive. */
const VERSION='1.2.0';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const cap=s=>s?s[0].toUpperCase()+s.slice(1):s;
const pad=n=>String(n).padStart(2,'0');

/* ---------- icons ---------- */
const I={chevL:'<path d="M10 3L5 8l5 5"/>',chevR:'<path d="M6 3l5 5-5 5"/>',search:'<circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L14 14"/>',book:'<path d="M3 3.5h4a1 1 0 011 1V13a1 1 0 00-1-1H3zM13 3.5H9a1 1 0 00-1 1V13a1 1 0 011-1h4z"/>',cal:'<rect x="2.5" y="3.5" width="11" height="10" rx="1.5"/><path d="M2.5 7h11M5.5 2v3M10.5 2v3"/>',check:'<path d="M3 8.5l3.5 3.5L13 4.5"/>',pencil:'<path d="M3 13l.7-3L10.5 3.2a1.4 1.4 0 012 2L5.7 12z"/>',underline:'<path d="M4 3v5a4 4 0 008 0V3M3 14h10"/>',circle:'<ellipse cx="8" cy="8" rx="6" ry="4.2"/>',note:'<path d="M3 3h10v8H8l-3 2.5V11H3z"/>',trash:'<path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.5h5.8l.6-8.5"/>',x:'<path d="M4 4l8 8M12 4l-8 8"/>',gear:'<circle cx="8" cy="8" r="2.2"/><path d="M8 1.8v1.6M8 12.6v1.6M1.8 8h1.6M12.6 8h1.6M3.6 3.6l1.1 1.1M11.3 11.3l1.1 1.1M3.6 12.4l1.1-1.1M11.3 4.7l1.1-1.1"/>',sidebar:'<rect x="2" y="3" width="12" height="10" rx="2"/><path d="M6 3v10"/>',bold:'<path d="M5 3h4a2.5 2.5 0 010 5H5zM5 8h4.5a2.5 2.5 0 010 5H5z"/>',italic:'<path d="M7 3h5M4 13h5M10 3L6 13"/>',hlt:'<path d="M3 13.5h10M5 10l5.5-6.5 2 2L7 12H5z"/>',ulist:'<path d="M6 4h8M6 8h8M6 12h8M2.5 4h.1M2.5 8h.1M2.5 12h.1"/>',olist:'<path d="M7 4h7M7 8h7M7 12h7M2.5 3.2l.9-.6V6M2.3 9.2a1 1 0 011.7.6c0 .8-1.7 1.4-1.7 2.2h1.8"/>',sliders:'<path d="M2 4h6M11 4h3M2 8h2M7 8h7M2 12h8M13 12h1"/><circle cx="9.5" cy="4" r="1.5"/><circle cx="5.5" cy="8" r="1.5"/><circle cx="11.5" cy="12" r="1.5"/>',filter:'<path d="M2.5 3.5h11L9.3 8.6v3.9l-2.6 1.3V8.6z"/>',collapse:'<path d="M4.5 2.5L8 6l3.5-3.5M4.5 13.5L8 10l3.5 3.5"/>',expand:'<path d="M4.5 5.5L8 2l3.5 3.5M4.5 10.5L8 14l3.5-3.5"/>',caretL:'<path d="M9.5 4L5.5 8l4 4"/>',caretR:'<path d="M6.5 4l4 4-4 4"/>',pin:'<path d="M6 2.5h4M7 2.5v4L4.5 9h7L9 6.5v-4M8 9v4.5"/>',cloud:'<path d="M4.5 12.5a3 3 0 01-.3-6 4 4 0 017.7.8 2.6 2.6 0 01-.4 5.2z"/>',sync:'<path d="M13 5.5A5.5 5.5 0 003 6.5M3 10.5a5.5 5.5 0 0010 1M13 2.5v3h-3M3 13.5v-3h3"/>',off:'<path d="M2 2l12 12M4.5 12.5a3 3 0 01-.3-6c.2-.6.5-1.1.9-1.6M7 4.2a4 4 0 014.9 3.1 2.6 2.6 0 011.3 4.6"/>'};
const ic=(n,s=18)=>`<svg width="${s}" height="${s}" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;
const ib=(n,act,label,extra='')=>`<button class="ib" data-act="${act}" aria-label="${label}" title="${label}" ${extra}>${ic(n)}</button>`;

/* ---------- Bible books ---------- */
const BOOKS=['Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi','Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation'];
const USFM='GEN EXO LEV NUM DEU JOS JDG RUT 1SA 2SA 1KI 2KI 1CH 2CH EZR NEH EST JOB PSA PRO ECC SNG ISA JER LAM EZK DAN HOS JOL AMO OBA JON MIC NAM HAB ZEP HAG ZEC MAL MAT MRK LUK JHN ACT ROM 1CO 2CO GAL EPH PHP COL 1TH 2TH 1TI 2TI TIT PHM HEB JAS 1PE 2PE 1JN 2JN 3JN JUD REV'.split(' ');
const CHAPS=[50,40,27,36,34,24,21,4,31,24,22,25,29,36,10,13,10,42,150,31,12,8,66,52,5,48,12,14,3,9,1,4,7,3,3,3,2,14,4,28,16,24,21,28,16,16,13,6,6,4,4,5,3,6,4,3,1,13,5,5,3,5,1,1,1,22];
const bname=(b,withCh)=>b===18&&withCh?'Psalm':BOOKS[b]||'?';
function refStr(r){if(!r)return '';const n=bname(r.b,true);if(r.c1===r.c2){if(r.v1===1&&r.v2>=999)return `${n} ${r.c1}`;return r.v1===r.v2?`${n} ${r.c1}:${r.v1}`:`${n} ${r.c1}:${r.v1}–${r.v2}`}return `${n} ${r.c1}:${r.v1}–${r.c2}:${r.v2}`}

/* ---------- settings ---------- */
const LS={get:(k,d)=>{try{const v=localStorage.getItem('mg-'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set:(k,v)=>{try{localStorage.setItem('mg-'+k,JSON.stringify(v))}catch(e){}}};
const CFG=Object.assign({clientId:'',account:'personal',tenant:'',folder:'Documents/Marginalia',keysPath:'Apps/Marginalia/keys.json'},window.MARGINALIA_CONFIG||{},LS.get('cfg',{}));
CFG.personal=CFG.account!=='work';
CFG.authority='https://login.microsoftonline.com/'+(CFG.personal?'consumers':(CFG.tenant&&CFG.tenant!=='organizations'?CFG.tenant:'organizations'));
const SET=Object.assign({theme:'auto',side:true,devoTr:'web',esvKey:'',abKey:'',tr:{},fold:true,nlay:'margin'},LS.get('set',{}));
const saveSet=()=>LS.set('set',SET);

/* ---------- local database ---------- */
const DB=(()=>{let p;const open=()=>p||(p=new Promise((ok,no)=>{const r=indexedDB.open('marginalia',1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)}));
 const tx=(m,f)=>open().then(db=>new Promise((ok,no)=>{const t=db.transaction('kv',m);const rq=f(t.objectStore('kv'));t.oncomplete=()=>ok(rq&&rq.result);t.onerror=()=>no(t.error)}));
 return {get:k=>tx('readonly',s=>s.get(k)),set:(k,v)=>tx('readwrite',s=>s.put(v,k)),del:k=>tx('readwrite',s=>s.delete(k))};})();

const S={studies:{},pending:[],devo:{log:{}},status:'',statusKind:'',me:null};

/* ---------- translations & text ---------- */
const TRS={kjv:{n:'KJV',src:'book'},web:{n:'WEB',src:'book'},esv:{n:'ESV',src:'esv',copy:'Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway. Used by permission.'},net:{n:'NET',src:'net',copy:'Scripture quoted by permission. Quotations designated (NET) are from the NET Bible® copyright ©1996, 2019 by Biblical Studies Press, L.L.C. All rights reserved.'},nkjv:{n:'NKJV',src:'ab'},csb:{n:'CSB',src:'ab'},nlt:{n:'NLT',src:'ab'},bsb:{n:'BSB',src:'none'},asv:{n:'ASV',src:'none'}};
const trName=t=>(TRS[t]&&TRS[t].n)||String(t||'').toUpperCase();
function trAvailable(t){const x=TRS[t];if(!x)return false;if(x.src==='book'||x.src==='net')return true;if(x.src==='esv')return !!SET.esvKey;if(x.src==='ab')return !!SET.abKey;return false}
const BOOKCACHE={},CH={},LOADING={},CHERR={};
const chKey=(tr,b,c)=>`${tr}|${b}|${c}`;
function normWs(s){return String(s).replace(/\s+/g,' ').trim()}
function decodeHtml(s){const d=document.createElement('textarea');d.innerHTML=s;return d.value}
/* Parses "[1] text [2] text" (ESV, API.Bible) into verses, keeping paragraph starts and poetry lines. */
function parseBracketed(raw){
 const out={v:[],p:[],s:[],q:{}};const re=/\[(\d+)\]/g;let m,marks=[];
 while((m=re.exec(raw)))marks.push({v:+m[1],i:m.index,end:re.lastIndex});
 marks.forEach((mk,k)=>{
  const chunk=raw.slice(mk.end,k+1<marks.length?marks[k+1].i:raw.length);
  const before=raw.slice(k?marks[k-1].end:0,mk.i);
  if(k===0||/\n[ \t]*$/.test(before))out.p.push(mk.v);
  if(/\n[ \t]*\n[ \t]*$/.test(before))out.s.push(mk.v);
  const lines=chunk.split('\n');let text='',offs=[],poem=false;
  lines.forEach((ln,i)=>{const t=normWs(ln);if(!t)return;const lead=(ln.match(/^ */)||[''])[0].length;if(i>0&&lead>=4)poem=true;if(text)text+=' ';offs.push([text.length,offs.length?1:0]);text+=t});
  if(poem&&offs.length>1)out.q[mk.v]=offs;
  out.v[mk.v-1]=text;
 });
 for(let i=0;i<out.v.length;i++)if(out.v[i]==null)out.v[i]='';
 return out;
}
function jsonp(url){return new Promise((ok,no)=>{const cb='__mg'+Math.random().toString(36).slice(2);const s=document.createElement('script');const t=setTimeout(()=>{cleanup();no(new Error('timeout'))},15000);function cleanup(){clearTimeout(t);delete window[cb];s.remove()}window[cb]=d=>{cleanup();ok(d)};s.onerror=()=>{cleanup();no(new Error('load'))};s.src=url+(url.includes('?')?'&':'?')+'callback='+cb;document.head.appendChild(s)})}
async function fetchChapter(tr,b,c){
 const x=TRS[tr];if(!x||x.src==='none')throw new Error(`${trName(tr)} isn’t available on this device`);
 if(x.src==='book'){
  if(!BOOKCACHE[tr+b]){const r=await fetch(`data/${tr}/${b}.json`);if(!r.ok)throw new Error('Text not found');BOOKCACHE[tr+b]=await r.json()}
  const bk=BOOKCACHE[tr+b],pre=c+':';const sel=a=>(a||[]).filter(k=>k.startsWith(pre)).map(k=>+k.slice(pre.length));
  const q={};Object.entries(bk.q||{}).forEach(([k,v])=>{if(k.startsWith(pre))q[+k.slice(pre.length)]=v});
  return {v:bk.v[c-1]||[],p:bk.p?sel(bk.p):null,s:sel(bk.s),q};
 }
 const key='text:'+chKey(tr,b,c);const cached=await DB.get(key).catch(()=>null);if(cached)return cached;
 let out;
 if(x.src==='esv'){
  if(!SET.esvKey)throw new Error('Add your ESV key in Settings');
  const q=encodeURIComponent(`${BOOKS[b]} ${c}`);
  const r=await fetch(`https://api.esv.org/v3/passage/text/?q=${q}&include-passage-references=false&include-verse-numbers=true&include-first-verse-numbers=true&include-footnotes=false&include-footnote-body=false&include-headings=false&include-short-copyright=false&include-copyright=false&include-passage-horizontal-lines=false&include-heading-horizontal-lines=false&include-selahs=true&indent-using=space&indent-paragraphs=2&indent-poetry=true&indent-poetry-lines=4&indent-declares=0&indent-psalm-doxology=0&line-length=0`,{headers:{Authorization:'Token '+SET.esvKey}});
  if(!r.ok)throw new Error(r.status===401||r.status===403?'The ESV key was refused':'ESV text unavailable ('+r.status+')');
  const d=await r.json();out=parseBracketed((d.passages||[''])[0]);
 }else if(x.src==='net'){
  const url=`https://labs.bible.org/api/?passage=${encodeURIComponent(BOOKS[b]+' '+c)}&type=json&formatting=para`;
  let d;try{const r=await fetch(url);if(!r.ok)throw 0;d=await r.json()}catch(e){d=await jsonp(url)}
  out={v:[],p:[],s:[],q:{}};
  (d||[]).forEach(it=>{if(+it.chapter!==c)return;const v=+it.verse;let h=String(it.text||'');
   if(/^\s*<p class="(bodytext|paragraphtitle)"/i.test(h))out.p.push(v);
   const poem=/class="poetry"/i.test(h);
   const parts=h.split(/<p[^>]*>|<br\s*\/?>/i).map(z=>normWs(decodeHtml(z.replace(/<[^>]+>/g,' ')))).filter(Boolean);
   let text='',offs=[];parts.forEach(z=>{if(text)text+=' ';offs.push([text.length,offs.length?1:0]);text+=z});
   if(poem&&offs.length>1)out.q[v]=offs;
   out.v[v-1]=text});
  for(let i=0;i<out.v.length;i++)if(out.v[i]==null)out.v[i]='';
  if(!out.p.length)out.p=null;
 }else if(x.src==='ab'){
  if(!SET.abKey)throw new Error('Add your API.Bible key in Settings');
  const id=await abBible(tr);
  const r=await fetch(`https://api.scripture.api.bible/v1/bibles/${id}/chapters/${USFM[b]}.${c}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false`,{headers:{'api-key':SET.abKey}});
  if(!r.ok)throw new Error(trName(tr)+' text unavailable ('+r.status+')');
  const d=await r.json();out=parseBracketed(d.data.content||'');out.copy=d.data.copyright||'';
 }
 DB.set(key,out).catch(()=>{});return out;
}
async function abBible(tr){
 const ids=LS.get('abids',{});if(ids[tr])return ids[tr];
 const r=await fetch(`https://api.scripture.api.bible/v1/bibles?abbreviation=${encodeURIComponent(tr.toUpperCase())}`,{headers:{'api-key':SET.abKey}});
 if(!r.ok)throw new Error('The API.Bible key was refused');
 const d=await r.json();const hit=(d.data||[]).find(x=>String(x.abbreviation||x.abbreviationLocal).toLowerCase()===tr)||(d.data||[])[0];
 if(!hit)throw new Error(`Your API.Bible key doesn’t include ${trName(tr)}`);
 ids[tr]=hit.id;LS.set('abids',ids);return hit.id;
}
function chapter(tr,b,c){
 const k=chKey(tr,b,c);if(CH[k])return CH[k];
 if(!LOADING[k]&&!CHERR[k]){LOADING[k]=fetchChapter(tr,b,c).then(d=>{CH[k]=d;delete LOADING[k];render()}).catch(e=>{CHERR[k]=e.message||String(e);delete LOADING[k];render()})}
 return null;
}

/* ---------- Microsoft sign-in & OneDrive ---------- */
const SCOPES=['Files.ReadWrite','User.Read'];
let pca=null,account=null,needSignIn=false;
const redirectUri=()=>location.origin+location.pathname.replace(/index\.html$/,'');
async function initAuth(){
 if(!CFG.clientId||!window.msal)return;
 try{
  pca=new msal.PublicClientApplication({auth:{clientId:CFG.clientId,authority:CFG.authority,redirectUri:redirectUri()},cache:{cacheLocation:'localStorage'}});
  await pca.initialize();
  const r=await pca.handleRedirectPromise();
  account=(r&&r.account)||pca.getAllAccounts()[0]||null;
  if(account){pca.setActiveAccount(account);S.me=account.username||account.name}
 }catch(e){setStatus('Sign-in problem: '+(e.errorMessage||e.message||e),'err')}
}
function signIn(){if(!pca){toast('Add the app’s client ID first');return}pca.loginRedirect({scopes:SCOPES,prompt:'select_account'})}
async function signOut(){if(pca&&account){await pca.logoutRedirect({account,postLogoutRedirectUri:redirectUri()})}}
async function token(){
 try{return (await pca.acquireTokenSilent({scopes:SCOPES,account})).accessToken}
 catch(e){needSignIn=true;render();throw new Error('signin')}
}
const G='https://graph.microsoft.com/v1.0';
const encPath=p=>p.split('/').filter(Boolean).map(encodeURIComponent).join('/');
async function gfetch(path,opt={}){const t=await token();return fetch(path.startsWith('http')?path:G+path,{...opt,headers:{Authorization:'Bearer '+t,...(opt.headers||{})}})}

/* ---------- study changes (kept until they reach OneDrive) ---------- */
function applyOps(d,ops,touch=true){
 const x=JSON.parse(JSON.stringify(d));x.annotations=x.annotations||[];
 for(const o of ops){
  if(o.op==='add'){if(!x.annotations.some(a=>a.id===o.a.id))x.annotations.push(o.a)}
  else if(o.op==='upd'){const a=x.annotations.find(a=>a.id===o.id);if(a)Object.assign(a,o.patch)}
  else if(o.op==='del'){x.annotations=x.annotations.filter(a=>a.id!==o.id)}
 }
 if(touch&&ops.length)x.updatedAt=new Date().toISOString();
 return x;
}
async function savePending(){await DB.set('pending',S.pending)}
async function saveStudies(){await DB.set('studies',S.studies)}
let syncT=0;
function commit(op){
 const last=S.pending[S.pending.length-1];
 if(op.op==='upd'&&last&&last.op==='upd'&&last.id===op.id&&last.sid===op.sid)Object.assign(last.patch,op.patch);
 else if(op.op==='upd'&&last&&last.op==='add'&&last.a.id===op.id&&last.sid===op.sid)Object.assign(last.a,op.patch);
 else S.pending.push(op);
 const st=S.studies[op.sid];if(st)st.d=applyOps(st.d,[op]);
 savePending();saveStudies();
 clearTimeout(syncT);syncT=setTimeout(()=>sync(),2500);
}
let syncing=false;
async function sync(manual){
 if(syncing)return;
 if(!account){if(manual)toast('Sign in first');return}
 if(!navigator.onLine){setStatus(S.pending.length?`Offline · ${S.pending.length} change${S.pending.length>1?'s':''} waiting`:'Offline · showing saved copies','warn');return}
 syncing=true;setStatus('Syncing…');
 try{
  await pushPending();
  const base=`/me/drive/root:/${encPath(CFG.folder)}/studies:/children?$select=id,name,eTag,lastModifiedDateTime&$top=999`;
  const r=await gfetch(base);
  if(r.status===404)throw new Error(`No studies folder at “${CFG.folder}/studies” in OneDrive`);
  if(!r.ok)throw new Error('OneDrive said '+r.status);
  const items=(await r.json()).value.filter(x=>/\.json$/i.test(x.name));
  const seen=new Set();
  for(const it of items){
   const id=it.name.replace(/\.json$/i,'');seen.add(id);const loc=S.studies[id];
   if(!loc||loc.eTag!==it.eTag){
    const cr=await gfetch(`/me/drive/items/${it.id}/content`);if(!cr.ok)continue;
    let d;try{d=await cr.json()}catch(e){continue}
    const mine=S.pending.filter(o=>o.sid===id);
    S.studies[id]={d:mine.length?applyOps(d,mine,false):d,itemId:it.id,eTag:it.eTag};
   }
  }
  for(const id of Object.keys(S.studies))if(!seen.has(id)&&!S.pending.some(o=>o.sid===id))delete S.studies[id];
  await saveStudies();
  await syncDevo();
  await loadKeys();
  LS.set('lastSync',Date.now());needSignIn=false;
  setStatus('');render();
 }catch(e){
  if(e.message!=='signin')setStatus(e.message||String(e),'err');else setStatus('Sign in again to sync','warn');
 }finally{syncing=false}
}
async function pushPending(){
 const by={};S.pending.forEach(o=>(by[o.sid]=by[o.sid]||[]).push(o));
 for(const [sid,ops] of Object.entries(by)){
  const loc=S.studies[sid];if(!loc||!loc.itemId)continue;
  let done=false;
  for(let attempt=0;attempt<3&&!done;attempt++){
   const mr=await gfetch(`/me/drive/items/${loc.itemId}?$select=id,eTag`);
   if(mr.status===404){S.pending=S.pending.filter(o=>o.sid!==sid);await savePending();delete S.studies[sid];done=true;break}
   if(!mr.ok)throw new Error('OneDrive said '+mr.status);
   const meta=await mr.json();
   const cr=await gfetch(`/me/drive/items/${loc.itemId}/content`);if(!cr.ok)throw new Error('Reading the study failed ('+cr.status+')');
   const next=applyOps(await cr.json(),ops);
   const put=await gfetch(`/me/drive/items/${loc.itemId}/content`,{method:'PUT',headers:{'Content-Type':'application/json','If-Match':meta.eTag},body:JSON.stringify(next,null,1)});
   if(put.status===412)continue;
   if(!put.ok)throw new Error('Saving to OneDrive failed ('+put.status+')');
   const it=await put.json();
   S.studies[sid]={d:next,itemId:loc.itemId,eTag:it.eTag};
   S.pending=S.pending.filter(o=>!ops.includes(o));await savePending();await saveStudies();done=true;
  }
  if(!done)throw new Error('The study kept changing while saving; will try again');
 }
}
async function loadKeys(){
 if(SET.esvKey&&SET.abKey)return;
 try{
  const r=await gfetch(`/me/drive/root:/${encPath(CFG.keysPath||'Apps/Marginalia/keys.json')}:/content`);if(!r.ok)return;
  const k=await r.json();let ch=false;
  const flat=(o,pre='')=>Object.entries(o||{}).flatMap(([a,v])=>v&&typeof v==='object'?flat(v,pre+a+'.'):[[ (pre+a).toLowerCase(),v]]);
  for(const [name,v] of flat(k)){if(typeof v!=='string'||!v.trim())continue;
   if(!SET.esvKey&&name.includes('esv')){SET.esvKey=v.trim();ch=true}
   else if(!SET.abKey&&/apibible|api\.bible|scripture|(^|\.)ab(key)?$|abkey/.test(name)){SET.abKey=v.trim();ch=true}}
  if(ch){saveSet();Object.keys(CHERR).forEach(x=>delete CHERR[x])}
 }catch(e){}
}
async function syncDevo(){
 const p=`/me/drive/root:/${encPath(CFG.folder)}/mobile-devotional.json:/content`;
 let remote={log:{}};const r=await gfetch(p);
 if(r.ok){try{remote=await r.json()}catch(e){}}else if(r.status!==404)throw new Error('Devotional sync failed ('+r.status+')');
 remote.log=remote.log||{};
 const merged={log:{...remote.log}};let changed=false;
 for(const [k,e] of Object.entries(S.devo.log||{})){const o=merged.log[k];if(!o||(e.t||0)>(o.t||0)){merged.log[k]=e;if(!o||JSON.stringify(o)!==JSON.stringify(e))changed=true}}
 if(changed){const w=await gfetch(p,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(merged,null,1)});if(!w.ok)throw new Error('Devotional save failed ('+w.status+')')}
 S.devo=merged;await DB.set('devo',S.devo);
}

/* ---------- marks from the study file ---------- */
const PALETTE=['#5b8afe','#e96f73','#5bba88','#f7c948','#f59e5b','#a78bfa'];
const KIND={highlight:'hl',underline:'ul',circle:'circ',note:'cm',above:'above',connect:'conn'};
const KLABEL={highlight:'Highlight',underline:'Underline',circle:'Circle',note:'Comment',above:'Words above',connect:'Connection',arrow:'Arrow'};
const okHex=c=>/^#[0-9a-f]{3,8}$/i.test(c||'')?c:'#5b8afe';
const USTYLE={solid:'solid',double:'double',dashed:'dashed',dotted:'dotted',squiggly:'wavy',hand:'solid'};
function anchor(sp,t){
 if(t==null)return null;const x=sp.text||'';
 if(sp.s>=0&&sp.e<=t.length&&sp.e>sp.s&&(!x||t.slice(sp.s,sp.e)===x))return [sp.s,sp.e];
 if(!x)return null;
 const near=(hay,nd)=>{let best=-1,bd=1e9,i=hay.indexOf(nd);while(i>=0){const d=Math.abs(i-(sp.s||0));if(d<bd){bd=d;best=i}i=hay.indexOf(nd,i+1)}return best};
 let i=near(t,x);if(i>=0)return [i,i+x.length];
 const n=s=>s.replace(/[’‘]/g,"'").replace(/[“”]/g,'"').replace(/[–—]/g,'-').toLowerCase();
 i=near(n(t),n(x));if(i>=0)return [i,i+x.length];
 return null;
}
let FILTER='all';
function annVisible(a){if(FILTER==='all')return true;if(FILTER.startsWith('k:'))return a.kind===FILTER.slice(2);if(FILTER.startsWith('t:'))return (a.tags||[]).includes(FILTER.slice(2));return true}
function marksFor(st,tr,b,c,v,text){
 const out=[];
 (st.annotations||[]).forEach(a=>{if(!annVisible(a))return;(a.spans||[]).forEach(sp=>{
  if(sp.tr!==tr||sp.b!==b||sp.c!==c||sp.v!==v)return;
  const r=anchor(sp,text);if(!r)return;
  out.push({id:a.id,kind:KIND[a.kind]||'cm',c:okHex(a.color),us:USTYLE[a.ustyle]||'solid',ab:a.kind==='above'?(a.above||''):null,s:r[0],e:r[1]});
 })});
 return out;
}
function markup(t,ms,lines){
 if(!ms.length&&!lines)return esc(t);
 const b=new Set([0,t.length]),ls=new Map();
 ms.forEach(m=>{b.add(Math.max(0,Math.min(t.length,m.s)));b.add(Math.max(0,Math.min(t.length,m.e)))});
 (lines||[]).forEach(([o,l])=>{if(o>=0&&o<=t.length){b.add(o);ls.set(o,l)}});
 const pts=[...b].sort((x,y)=>x-y);const ord={circ:0,above:1,ul:2,conn:3,hl:4,cm:5};let h='';
 for(let i=0;i<pts.length-1;i++){const a=pts[i],z=pts[i+1];let seg=esc(t.slice(a,z)),pre='';
  if(ls.has(a)){if(a>0)pre='<br>';if(ls.get(a))pre+=`<span class="ind" style="width:${ls.get(a)*1.6}em"></span>`}
  ms.filter(m=>m.s<=a&&m.e>=z).sort((x,y)=>ord[y.kind]-ord[x.kind]).forEach(m=>{
   let st=`--mc:${m.c}`;if(m.kind==='ul')st+=`;text-decoration-style:${m.us}`;if(m.kind==='circ'&&m.us==='dotted')st+=';border-style:dotted';
   seg=`<span class="m k-${m.kind}" style="${st}" data-m="${esc(m.id)}"${m.ab!=null?` data-above="${esc(m.ab)}"`:''}>${seg}</span>`});
  h+=pre+seg}
 return h;
}

/* ---------- markdown for notes and Study notes ---------- */
function inl(s){s=esc(s);return s.replace(/==\{(#[0-9a-fA-F]{6})\}(.+?)==/g,'<mark style="background:color-mix(in srgb,$1 30%,transparent)">$2</mark>').replace(/==(.+?)==/g,'<mark>$1</mark>').replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/(^|[^*])\*([^*]+)\*/g,'$1<i>$2</i>').replace(/(^|\W)_([^_]+)_(?=\W|$)/g,'$1<i>$2</i>')}
function md(src){
 let h='',list=null;const close=()=>{if(list){h+=`</${list}>`;list=null}};
 for(const raw of String(src||'').split('\n')){const l=raw.replace(/\s+$/,'');let m;
  if(!l.trim()){close();continue}
  if((m=l.match(/^(#{1,3})\s+(.*)/))){close();const n=m[1].length+1;h+=`<h${n}>${inl(m[2])}</h${n}>`;continue}
  if((m=l.match(/^\s*[-*]\s+(.*)/))){if(list!=='ul'){close();h+='<ul>';list='ul'}h+=`<li>${inl(m[1])}</li>`;continue}
  if((m=l.match(/^\s*\d+\.\s+(.*)/))){if(list!=='ol'){close();h+='<ol>';list='ol'}h+=`<li>${inl(m[1])}</li>`;continue}
  if((m=l.match(/^>\s?(.*)/))){close();h+=`<blockquote>${inl(m[1])}</blockquote>`;continue}
  close();h+=`<p>${inl(l)}</p>`}
 close();return h;
}
const plainMd=s=>String(s||'').replace(/==\{#[0-9a-fA-F]{6}\}/g,'').replace(/\*\*|==|\*/g,'').replace(/^\s*(?:-|\d+\.)\s+/gm,'');

/* ---------- scripture text settings ---------- */
const FONTS=[['source','Source Serif','"Source Serif 4",Georgia,serif'],['literata','Literata','Literata,Georgia,serif'],['georgia','Georgia','Georgia,"Times New Roman",serif'],['charter','Charter','Charter,"Bitstream Charter","Iowan Old Style",Georgia,serif'],['palatino','Palatino','Palatino,"Palatino Linotype","Book Antiqua",Georgia,serif'],['sans','Sans serif','Figtree,Inter,system-ui,-apple-system,sans-serif']];
const LH=[['1.5','Tight'],['1.75','Normal'],['2','Relaxed'],['2.3','Airy']];
const TDEF={font:'source',size:1,lh:'1.75',vn:true,layout:'verse'};
const tset=()=>Object.assign({},TDEF,LS.get('text',{}));
function applyText(){const t=tset(),r=document.documentElement.style,f=FONTS.find(x=>x[0]===t.font)||FONTS[0];r.setProperty('--sfont',f[2]);r.setProperty('--tsz',t.size);r.setProperty('--tlh',t.lh);$('#app').classList.toggle('novn',!t.vn);$('#tx').classList.toggle('novn',!t.vn)}
function txtHtml(){const t=tset();return `<div class="grab"></div><div style="display:flex;align-items:center;margin-bottom:8px"><b style="font-size:16px;flex:1">Scripture text</b>${ib('x','txtx','Close')}</div><p class="vt tpv"><span class="vn">1</span>In the beginning was the Word, and the Word was with God…</p><div class="lbl">Font</div><div class="tfs">${FONTS.map(([k,l,f])=>`<button class="${t.font===k?'on':''}" style="font-family:${f.replace(/"/g,'&quot;')}" data-act="tfont" data-k="${k}">${l}</button>`).join('')}</div><div class="lbl">Size</div><div class="trw"><button class="btn2" style="padding:6px 12px" data-act="tsize" data-d="-1" aria-label="Smaller">A−</button><input type="range" id="tsz" min="0.8" max="1.6" step="0.05" value="${t.size}" aria-label="Text size"><button class="btn2" style="padding:6px 12px;font-size:17px" data-act="tsize" data-d="1" aria-label="Larger">A+</button><b id="tszv">${Math.round(t.size*100)}%</b></div><div class="lbl">Line spacing</div><div class="seg" style="margin-bottom:12px">${LH.map(([v,l])=>`<button class="${t.lh===v?'on':''}" data-act="tlh" data-v="${v}">${l}</button>`).join('')}</div><div class="lbl">Verse numbers</div><div class="seg" style="margin-bottom:14px"><button class="${t.vn?'on':''}" data-act="tvn" data-v="1">Show</button><button class="${t.vn?'':'on'}" data-act="tvn" data-v="0">Hide</button></div><div style="display:flex;justify-content:flex-start"><button class="quiet" data-act="treset">Reset to the defaults</button></div>`}
function setText(p){LS.set('text',Object.assign(tset(),p));applyText();if('layout' in p)render();const x=$('#tx');if(x.classList.contains('open'))x.innerHTML=txtHtml()}

/* ---------- UI state ---------- */
const WIDE=matchMedia('(min-width:980px)');
const MID=matchMedia('(min-width:680px)');
const ui={view:'studies',back:'studies',sid:null,tab:'passage',sel:null,bar:null,barMore:false,edit:null,color:3,flash:null,flashV:null,sumOpen:false,q:'',cal:null,dr:null,another:0,unfold:new Set()};
const studyList=()=>Object.values(S.studies).map(x=>x.d).filter(Boolean).sort((a,b)=>String(b.updatedAt||'').localeCompare(String(a.updatedAt||'')));
const cur=()=>{const x=S.studies[ui.sid];return x&&x.d};
const studyTr=st=>{const list=(st.translations||[]).filter(Boolean);const pick=SET.tr[st.id];return pick||list.find(trAvailable)||list[0]||'kjv'};
const sideOpen=()=>SET.side!==false;
const allTags=()=>{const t=new Set();studyList().forEach(s=>(s.annotations||[]).forEach(a=>(a.tags||[]).forEach(x=>t.add(x))));['Question','Observation','Interpretation','Application','Cross-reference'].forEach(x=>t.add(x));return [...t]};
const marginOn=()=>MID.matches&&SET.nlay!=='under';

/* ---------- sync dot ---------- */
function syncInfo(){
 const p=S.pending.length,last=LS.get('lastSync',0);let msg=S.status,kind=S.statusKind;
 if(!msg){if(!account)msg=CFG.clientId?'Not signed in':'Not set up yet';else if(p)msg=`${p} change${p>1?'s':''} waiting to sync`;else msg=last?'Synced '+new Date(last).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}):'Not synced yet'}
 if(!kind){if(syncing)kind='busy';else if(p||!account)kind='warn';else kind='ok'}
 return {msg,kind};
}
function syncDot(){const s=syncInfo();return `<button class="sdot ${s.kind}" id="sdot" data-act="syncinfo" aria-label="${esc(s.msg)}" title="${esc(s.msg)}"></button>`}
function syncLine(){const s=syncInfo();return `<div class="sync ${s.kind==='err'?'err':s.kind==='warn'?'warn':''}" id="syncline">${ic(s.kind==='err'?'off':'cloud',14)}<span>${esc(s.msg)}</span></div>`}
function setStatus(msg,kind=''){S.status=msg;S.statusKind=kind;const d=document.getElementById('sdot');if(d)d.outerHTML=syncDot();const l=document.getElementById('syncline');if(l)l.outerHTML=syncLine()}

/* ---------- top bar ---------- */
function topbar(left,{aa=false}={}){
 return `${left}${account||CFG.clientId?syncDot():''}<span class="sp"></span>${ib('search','nav','Search','data-v="search"')}${ib('sliders','nav','Settings','data-v="settings"')}${aa?`<button class="ib aa" data-act="txt" aria-label="Scripture text" title="Scripture text">Aa</button>`:''}`;
}
const backIcon=(v,label)=>`<button class="ib backi" data-act="nav" data-v="${v}" aria-label="${label}" title="${label}">${ic('chevL',20)}</button>`;

/* ---------- views ---------- */
function vSetup(){
 return {bar:`<div class="bt">Marginalia</div>`,body:`<div class="setup"><h2>This site isn’t set up yet</h2><p>Marginalia needs the Application (client) ID from your Microsoft app registration. Put it in <b>config.js</b> on the site (the README explains where to find it), and this screen won’t appear again.</p><p><button class="quiet" data-act="nav" data-v="settings">Set it up on this device instead</button></p></div>`};
}
function vSignin(){
 return {bar:topbar(`<div class="bt">Marginalia</div>`),body:`<div class="setup"><h2>Sign in to see your studies</h2><p>Use the ${CFG.personal?'personal Microsoft account':'work account'} whose OneDrive has your Marginalia folder.</p><button class="btn" data-act="signin">Sign in with Microsoft</button></div>`};
}
function banners(){
 return account&&needSignIn?`<div class="banner">${ic('cloud',16)}<span style="flex:1">Sign in again to keep syncing.</span><button class="btn" style="padding:6px 12px" data-act="signin">Sign in</button></div>`:'';
}
function vStudies(){
 const list=studyList();
 if(!CFG.clientId&&!list.length)return vSetup();
 if(!list.length&&!account)return vSignin();
 const g={};list.forEach(s=>(g[s.series||'Studies']=g[s.series||'Studies']||[]).push(s));
 return {bar:topbar(`<div class="bt">Studies</div>`),
  body:`${banners()}<div class="pg">${list.length?Object.entries(g).map(([k,ss])=>`<div class="ghead">${esc(k)}</div>${ss.map(s=>`<button class="sl" data-act="open" data-s="${esc(s.id)}"><b>${esc(s.title||'Untitled')}</b><span>${esc((s.passages||[]).map(p=>refStr(p.ref)).join(', '))} · ${(s.annotations||[]).filter(a=>a.note).length} notes</span></button>`).join('')}`).join(''):`<p class="muted">${syncing?'Loading your studies…':'No studies found yet. Check the folder in Settings.'}</p>`}</div>`};
}
function headerRow(st,tr){
 const t=tset(),fold=SET.fold!==false,fon=FILTER!=='all';
 return `<div class="hrow"><div class="hl"><button class="hm strong" data-act="menu" data-m="tr">${esc(trName(tr))} ▾</button><span class="hsep">·</span><button class="hm" data-act="menu" data-m="layout">${t.layout==='para'?'Paragraphs':'Verses'} ▾</button></div><div class="hr"><button class="hm midonly" data-act="menu" data-m="nlay">${SET.nlay==='under'?'Under':'Margin'} ▾</button><span class="sp"></span><button class="hq" data-act="fold">${ic(fold?'expand':'collapse',14)}${fold?'Expand':'Collapse'}</button><button class="hq${fon?' on':''}" data-act="menu" data-m="filter">${ic('filter',14)}${fon?esc(filterLabel()):'Filter'}</button></div></div>`;
}
function filterLabel(){if(FILTER.startsWith('k:'))return KLABEL[FILTER.slice(2)]||'Filter';if(FILTER.startsWith('t:'))return '#'+FILTER.slice(2);return 'Filter'}
function passageRows(st,p,tr){
 const r=p.ref;if(!r)return '';
 const para=tset().layout==='para';const rows=[];let err=null,loading=false,copy='';
 for(let c=r.c1;c<=r.c2;c++){
  const ch=chapter(tr,r.b,c);
  if(!ch){const e=CHERR[chKey(tr,r.b,c)];if(e)err=e;else loading=true;continue}
  if(ch.copy)copy=ch.copy;
  const from=c===r.c1?r.v1:1,to=c===r.c2?Math.min(r.v2,ch.v.length):ch.v.length;
  for(let v=from;v<=to;v++)rows.push({c,v,t:ch.v[v-1]||'',ch});
 }
 if(err)return `<p class="ph" style="padding:12px 20px">${esc(err)}. <button class="quiet" data-act="retry" data-tr="${esc(tr)}">Try again</button></p>`;
 if(loading)return `<p class="ph" style="padding:12px 20px">Loading ${esc(trName(tr))} text…</p>`;
 const multi=r.c1!==r.c2;
 const vlabel=(c,v,first)=>`<span class="vn">${multi&&(v===1||first)?`<span class="cvn">${c}:</span>`:''}${v}</span>`;
 const groups=[];
 rows.forEach(x=>{
  const fmtP=x.ch.p,isPoem=para&&x.ch.q&&x.ch.q[x.v];
  const starts=!groups.length||!para||isPoem||(fmtP?fmtP.includes(x.v):true)||groups[groups.length-1].poem||x.v===1;
  if(starts)groups.push({items:[x],poem:!!isPoem,stz:para&&x.ch.s&&x.ch.s.includes(x.v)});else groups[groups.length-1].items.push(x);
 });
 const html=groups.map((g,gi)=>{
  const ids=g.items.map(x=>`${p.id}-${x.c}-${x.v}`);const cards=[];
  const parts=g.items.map((x,i)=>{
   const ms=marksFor(st,tr,r.b,x.c,x.v,x.t);
   (st.annotations||[]).forEach(a=>{if(!annVisible(a))return;const sp=(a.spans||[]).find(s=>s.tr===tr&&s.b===r.b&&s.c===x.c&&s.v===x.v);if(!sp)return;if((a.spans||[]).find(s=>s.tr===tr)!==sp)return;if(a.note||(a.tags&&a.tags.length)||a.kind==='connect'||a.kind==='above'||ui.edit===a.id)cards.push({a,anch:!!anchor(sp,x.t)})});
   return (i?`<span class="va" id="v-${ids[i]}"></span>`:'')+vlabel(x.c,x.v,gi===0&&i===0)+`<span class="vtx" data-p="${esc(p.id)}" data-c="${x.c}" data-v="${x.v}">${markup(x.t,ms,para&&x.ch.q?x.ch.q[x.v]:null)}</span>`;
  }).join(' ');
  return `<div class="vrow${ids.includes(ui.flashV)?' flash':''}${g.stz?' stz':''}" id="v-${ids[0]}"><p class="vt${g.poem?' poem':''}">${parts}</p><div class="cards">${cards.map(cardHtml).join('')}</div></div>`;
 }).join('');
 const cp=copy||(TRS[tr]&&TRS[tr].copy)||'';
 return html+(cp?`<p class="copy">${esc(cp)}</p>`:'');
}
function cardHtml({a,anch}){
 const st=cur()||{};const tag=a.titleTag||(a.tags||[])[0];const t=tag||KLABEL[a.kind]||cap(a.kind);
 const col=(tag&&st.tagColors&&st.tagColors[tag])||okHex(a.color);
 const words=(a.spans||[]).map(s=>s.text).filter(Boolean);
 const folded=SET.fold!==false&&!ui.unfold.has(a.id)&&ui.edit!==a.id&&ui.flash!==a.id;
 const edit=ui.edit===a.id;
 if(folded)return `<div class="nc fold" role="button" tabindex="0" data-act="card" data-m="${esc(a.id)}" id="c-${esc(a.id)}"><span class="nt" style="color:${col}">${esc(t)}</span><span class="fx">${esc(plainMd(a.note).replace(/\n+/g,' ')||words[0]||'')}</span></div>`;
 let extra='';
 if(a.kind==='above'&&a.above)extra=`<span class="ntags">Above: ${esc(a.above)}</span>`;
 if(a.kind==='connect'&&words.length>1)extra=`<span class="ntags">Connects “${esc(words[0])}” with “${esc(words[1])}”</span>`;
 const more=(a.tags||[]).filter(x=>x!==tag);
 return `<div class="nc${ui.flash===a.id?' flash':''}${edit?' editing':''}" role="button" tabindex="0" data-act="card" data-m="${esc(a.id)}" id="c-${esc(a.id)}"><span class="nt" style="color:${col}">${esc(t)}<em>${esc(words[0]||'')}</em></span>${a.note?`<div class="nb">${md(a.note)}</div>`:''}${extra}${more.length?`<span class="ntags">${more.map(x=>'#'+esc(x)).join(' ')}</span>`:''}${anch?'':'<span class="unanch">These words weren’t found in this text.</span>'}</div>`;
}
function vStudy(){
 const st=cur();if(!st){ui.view='studies';return vStudies()}
 const tr=studyTr(st);
 const left=`${WIDE.matches&&sideOpen()?'':backIcon('studies','Studies')}<div class="bt">${esc(st.title||'Untitled')}<small>${esc((st.passages||[]).map(p=>refStr(p.ref)).join(', '))}</small></div>`;
 let body=`${banners()}<div class="shd"><div class="ser">${esc(st.series||'')}</div><div class="ttl">${esc(st.title||'Untitled')}</div><div class="ref">${esc((st.passages||[]).map(p=>refStr(p.ref)).join(', '))}</div>${st.summary?`<button class="qsum${ui.sumOpen?' open':''}" data-act="sum">${esc(plainMd(st.summary))}</button>`:''}</div><div class="utabs" role="tablist"><button class="${ui.tab==='passage'?'on':''}" data-act="tab" data-t="passage" role="tab">Passage</button><button class="${ui.tab==='notes'?'on':''}" data-act="tab" data-t="notes" role="tab">Study notes</button></div>`;
 if(ui.tab==='notes')body+=`<div class="outline">${st.outline&&st.outline.trim()?md(st.outline):'<p class="muted">No Study notes yet.</p>'}</div>`;
 else{
  body+=headerRow(st,tr);
  (st.passages||[]).forEach((p,i)=>{if((st.passages||[]).length>1)body+=`<div class="pref">${esc(refStr(p.ref))}</div>`;body+=passageRows(st,p,tr)});
  body+='<div style="height:140px"></div>';
 }
 return {bar:topbar(left,{aa:ui.tab==='passage'}),body};
}
function vSearch(){return {bar:`${backIcon(ui.back||'studies','Back')}<div class="bt">Search</div>`,body:`<div class="pg"><input class="qin" id="q" type="search" placeholder="Search your studies, notes and devotional" value="${esc(ui.q)}" autocomplete="off"><div id="res">${results()}</div></div>`}}
function results(){
 const q=ui.q.trim().toLowerCase();if(q.length<2)return '<p class="muted" style="font-size:14px">Type at least two letters.</p>';
 const hi=t=>{t=String(t);const i=t.toLowerCase().indexOf(q);if(i<0)return esc(t.slice(0,140));const a=Math.max(0,i-50);return (a?'…':'')+esc(t.slice(a,i))+'<mark>'+esc(t.slice(i,i+q.length))+'</mark>'+esc(t.slice(i+q.length,i+q.length+80))+(i+q.length+80<t.length?'…':'')};
 const out=[];
 studyList().forEach(s=>{
  if(String(s.title||'').toLowerCase().includes(q))out.push(`<button class="res" data-act="open" data-s="${esc(s.id)}"><b>Study</b><span>${hi(s.title)}</span></button>`);
  (s.annotations||[]).forEach(a=>{const t=plainMd(a.note)+' '+(a.tags||[]).join(' ')+' '+(a.spans||[]).map(x=>x.text).join(' ');if(t.toLowerCase().includes(q)){const sp=(a.spans||[])[0]||{};const p=(s.passages||[]).find(p=>p.ref&&p.ref.b===sp.b)||(s.passages||[])[0]||{};out.push(`<button class="res" data-act="goto" data-s="${esc(s.id)}" data-p="${esc(p.id||'')}" data-c="${sp.c}" data-v="${sp.v}" data-tr="${esc(sp.tr||'')}" data-m="${esc(a.id)}"><b>${esc(s.title)} · ${esc(bname(sp.b,true))} ${sp.c}:${sp.v}</b><span>${hi(plainMd(a.note)||(a.spans||[]).map(x=>x.text).join(' '))}</span></button>`)}});
  String(s.outline||'').split('\n').forEach(l=>{if(l.toLowerCase().includes(q))out.push(`<button class="res" data-act="gonotes" data-s="${esc(s.id)}"><b>Study notes, ${esc(s.title)}</b><span>${hi(plainMd(l.replace(/^[#>\s]+/,'')))}</span></button>`)});
 });
 Object.entries(S.devo.log||{}).forEach(([k,e])=>{const t=Object.values(e.f||{}).map(plainMd).join(' ');if((e.ref+' '+t).toLowerCase().includes(q))out.push(`<button class="res" data-act="day" data-d="${k}"><b>Devotional, ${kdate(k).toLocaleDateString('en-US',{month:'short',day:'numeric'})} · ${esc(e.ref)}</b><span>${hi(t||e.ref)}</span></button>`)});
 return out.length?`<p class="muted" style="font-size:13px;margin:4px 2px 8px">${out.length} found</p>`+out.slice(0,200).join(''):'<p class="muted" style="font-size:14px">Nothing found.</p>';
}

/* ---------- devotional ---------- */
const dkey=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const kdate=k=>{const [y,m,d]=k.split('-').map(Number);return new Date(y,m-1,d)};
const dayIdx=d=>Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/864e5);
const POOLS={Psalms:[[18,1,150]],Gospels:[[39,1,28],[40,1,16],[41,1,24],[42,1,21]],Epistles:[[44,1,16],[45,1,16],[46,1,13],[47,1,6],[48,1,6],[49,1,4],[50,1,4],[51,1,5],[52,1,3],[53,1,6],[54,1,4],[55,1,3],[56,1,1],[57,1,13],[58,1,5],[59,1,5],[60,1,3],[61,1,5],[62,1,1],[63,1,1],[64,1,1]]};
const POOLLIST=Object.entries(POOLS).flatMap(([n,rs])=>rs.flatMap(([b,a,z])=>Array.from({length:z-a+1},(_,i)=>({pool:n,b,c:a+i}))));
function todayRead(){const t=new Date();const h=((dayIdx(t)*2654435761)+(ui.another*40503))>>>0;const r=POOLLIST[h%POOLLIST.length];return {...r,ref:`${bname(r.b,true)} ${r.c}`}}
const TPL={inductive:{n:'Inductive',f:[['observe','Observe','What does the passage say?'],['interpret','Interpret','What does it show about God?'],['apply','Apply','What will I do, or believe differently?']]},soap:{n:'SOAP',f:[['scripture','Scripture','The verse that stood out'],['observation','Observation','What do I notice?'],['application','Application','How does it apply today?'],['prayer','Prayer','A short prayer']]},blank:{n:'Blank',f:[['notes','Notes','Write freely']]}};
const devoTr=()=>trAvailable(SET.devoTr)?SET.devoTr:'web';
function vDevo(){
 const t=new Date(),tk=dkey(t),log=S.devo.log||{},done=log[tk];
 if(!ui.cal)ui.cal=[t.getFullYear(),t.getMonth()];
 const [cy,cm]=ui.cal;const r=done?{ref:done.ref}:todayRead();
 const today=`<div class="card"><div class="lbl">Today</div><div class="rr">${esc(r.ref)}</div><div class="muted" style="font-size:13px;margin:2px 0 12px">${esc(done?trName(done.tr||devoTr()):trName(devoTr()))}${done?' · read today':' · '+esc(r.pool)}</div><div style="display:flex;gap:8px;flex-wrap:wrap">${done?`<button class="btn" data-act="day" data-d="${tk}">${ic('check',15)}Open today’s notes</button>`:`<button class="btn" data-act="start">Start reading</button><button class="btn2" data-act="another">Another</button>`}</div></div>`;
 const n=Object.keys(log).length;
 const plan=`<div class="card"><div class="lbl">Plan</div><div style="font-weight:600;font-size:16px">Surprise me</div><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">${Object.keys(POOLS).map(p=>`<span class="chip on">${p}</span>`).join('')}</div><div style="display:flex;justify-content:space-between;font-size:13px;margin-top:10px" class="muted"><span>${n} reading${n===1?'':'s'} so far</span><span>${esc(trName(devoTr()))}</span></div></div>`;
 const first=new Date(cy,cm,1),days=new Date(cy,cm+1,0).getDate();
 let cal=`<div class="cal">${['S','M','T','W','T','F','S'].map(d=>`<div class="w">${d}</div>`).join('')}${'<div></div>'.repeat(first.getDay())}`;
 for(let d=1;d<=days;d++){const k=`${cy}-${pad(cm+1)}-${pad(d)}`;const dd=new Date(cy,cm,d);cal+=`<button class="dc${k===tk?' t':''}${dd>t?' f':''}${log[k]?' r':''}" data-act="day" data-d="${k}" aria-label="${dd.toDateString()}${log[k]?', read':''}"><span class="dn">${d}</span><i class="dot"></i></button>`}
 cal+='</div>';
 const calc=`<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><b style="font-weight:600">${first.toLocaleString('en-US',{month:'long',year:'numeric'})}</b><span style="display:flex;gap:2px"><button class="ib" data-act="cal" data-d="-1" aria-label="Previous month">${ic('chevL',16)}</button><button class="ib" data-act="cal" data-d="1" aria-label="Next month">${ic('chevR',16)}</button></span></div>${cal}</div>`;
 const rec=Object.entries(log).sort((a,b)=>a[0]<b[0]?1:-1).slice(0,5);
 const recent=`<div class="card"><div class="lbl">Recent</div>${rec.length?rec.map(([k,e])=>`<button class="rec" data-act="day" data-d="${k}"><span>${kdate(k).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}</span><span>${esc(e.ref)}</span></button>`).join(''):'<p class="muted">No readings yet.</p>'}</div>`;
 return {bar:topbar(`<div class="bt">Devotional</div>`),body:`${banners()}<div class="pg"><div class="two">${today}${plan}</div><div class="two">${calc}${recent}</div><p class="muted" style="font-size:12.5px;margin:0 2px">Devotional entries made here sync between your phone and iPad through OneDrive (mobile-devotional.json). The desktop app keeps its own devotional for now.</p></div>`};
}
function vDevoRead(){
 const dr=ui.dr,tp=TPL[dr.tpl]||TPL.inductive;
 const dl=kdate(dr.date).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});
 const ch=chapter(dr.tr,dr.b,dr.c),para=tset().layout==='para';
 let text;
 if(!ch){const e=CHERR[chKey(dr.tr,dr.b,dr.c)];text=`<p class="ph">${e?esc(e):'Loading the reading…'}</p>`}
 else{
  const groups=[];ch.v.forEach((t,i)=>{const v=i+1;const poem=para&&ch.q&&ch.q[v];const starts=!groups.length||!para||poem||(ch.p?ch.p.includes(v):true)||groups[groups.length-1].poem;if(starts)groups.push({poem:!!poem,stz:para&&ch.s&&ch.s.includes(v),items:[[v,t]]});else groups[groups.length-1].items.push([v,t])});
  text=groups.map(g=>`<p class="vt vv${g.stz?' stz':''}">${g.items.map(([v,t])=>`<span class="vn">${v}</span>${para&&ch.q&&ch.q[v]?markup(t,[],ch.q[v]):esc(t)}`).join(' ')}</p>`).join('');
  const cp=ch.copy||(TRS[dr.tr]&&TRS[dr.tr].copy);if(cp)text+=`<p class="copy" style="padding-left:0">${esc(cp)}</p>`;
 }
 const fields=tp.f.map(([k,l,h])=>`<h4>${l}</h4><p class="h">${h}</p><textarea class="ta" id="df-${k}" data-f="${k}" aria-label="${l}">${esc(dr.f[k]||'')}</textarea>`).join('');
 return {bar:topbar(`${backIcon('devo','Devotional')}<div class="bt">${esc(dr.ref)}<small>${dl}</small></div>`,{aa:true}),
  body:`<div class="rd"><div class="rdt"><div class="ser">Surprise me${dr.pool?' · '+esc(dr.pool):''}</div><div class="rr" style="font-size:30px">${esc(dr.ref)}</div><div class="muted" style="font-size:13px;margin-bottom:14px">${esc(trName(dr.tr))}</div>${text}</div><div class="rdw"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><span class="lbl" style="margin:0">Your notes</span><div class="seg">${Object.entries(TPL).map(([k,t])=>`<button class="${dr.tpl===k?'on':''}" data-act="tpl" data-t="${k}">${t.n}</button>`).join('')}</div></div>${fields}<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px"><button class="btn" data-act="ddone">${ic('check',15)}Done</button></div></div></div>`};
}
function startRead(date,r){const e=(S.devo.log||{})[date];ui.dr=e?{date,ref:e.ref,b:e.b,c:e.c,tr:e.tr||devoTr(),tpl:e.tpl||'inductive',f:{...(e.f||{})},pool:e.pool}:{date,ref:r.ref,b:r.b,c:r.c,tr:devoTr(),tpl:'inductive',f:{},pool:r.pool};ui.view='devoRead';render()}

/* ---------- settings ---------- */


/* ---------- settings ---------- */
function vSettings(){
 const th=SET.theme;
 return {bar:`${backIcon(ui.back||'studies','Back')}<div class="bt">Settings</div>`,body:`<div class="setup" style="padding-top:16px">
 <div class="lbl">Account</div><div class="card" style="margin-bottom:16px">${account?`<div style="font-weight:600">${esc(S.me||'Signed in')}</div><div style="margin:6px 0 10px">${syncLine()}</div><div style="display:flex;gap:14px;flex-wrap:wrap;align-items:center"><button class="btn" data-act="syncnow">${ic('sync',15)}Sync now</button><button class="quiet" data-act="signout">Sign out</button></div>`:CFG.clientId?`<p style="margin:0 0 10px">Not signed in.</p><button class="btn" data-act="signin">Sign in with Microsoft</button>`:`<p style="margin:0">This site isn’t set up yet. Add the client ID in config.js, or under Advanced below.</p>`}</div>
 <div class="lbl">Devotional translation</div><div class="seg" style="margin-bottom:16px;flex-wrap:wrap">${['web','kjv','esv','net','nkjv'].filter(trAvailable).map(t=>`<button class="${devoTr()===t?'on':''}" data-act="devotr" data-tr="${t}">${trName(t)}</button>`).join('')}</div>
 <div class="lbl">Appearance</div><div class="seg" style="margin-bottom:16px">${[['auto','Automatic'],['light','Light'],['dark','Dark']].map(([k,l])=>`<button class="${th===k?'on':''}" data-act="theme" data-t="${k}">${l}</button>`).join('')}</div>
 <div class="lbl">Bible text keys</div><div class="card" style="margin-bottom:16px"><p style="font-size:13.5px;margin:0 0 6px" class="muted">KJV, WEB and NET need no key. ESV and API.Bible keys load by themselves from the desktop app’s keys.json when it’s in OneDrive; otherwise paste them here. They stay on this device.</p><label class="fld"><span>ESV API key</span><input id="k-esv" value="${esc(SET.esvKey)}" autocapitalize="off" spellcheck="false" autocomplete="off"></label><label class="fld"><span>API.Bible key (NKJV, CSB, NLT)</span><input id="k-ab" value="${esc(SET.abKey)}" autocapitalize="off" spellcheck="false" autocomplete="off"></label><button class="quiet" data-act="savekeys">Save keys</button></div>
 <details class="adv"${CFG.clientId?'':' open'}><summary>Advanced</summary><div class="card" style="margin-top:8px">${acctSeg()}<label class="fld"><span>Application (client) ID</span><input id="cfg-client" value="${esc(CFG.clientId)}" autocapitalize="off" spellcheck="false"><small>${window.MARGINALIA_CONFIG&&window.MARGINALIA_CONFIG.clientId?'Set in config.js on the site.':'Not in config.js; saved on this device only.'}</small></label><label class="fld" id="tenant-fld"${CFG.personal?' hidden':''}><span>Directory (tenant) ID</span><input id="cfg-tenant" value="${esc(CFG.tenant==='organizations'?'':CFG.tenant)}" autocapitalize="off" spellcheck="false"></label><label class="fld"><span>Studies folder</span><input id="cfg-folder" value="${esc(CFG.folder)}" autocapitalize="off" spellcheck="false"><small>The folder that holds “studies”, counted from the top of your OneDrive.</small></label><button class="quiet" data-act="savecfg">Save</button></div></details>
 <p class="muted" style="font-size:12.5px;margin-top:18px">Marginalia for iPad and phone, version ${VERSION}. Changes you make here are saved into the same study files the desktop app uses. Close a study on the computer before marking it here, or the computer may save over your changes.</p></div>`};
}
const acctSeg=()=>`<div class="lbl" style="margin-top:4px">Account type</div><div class="seg" id="acct" data-v="${CFG.personal?'personal':'work'}"><button class="${CFG.personal?'on':''}" data-act="acct" data-v="personal">Personal (OneDrive)</button><button class="${CFG.personal?'':'on'}" data-act="acct" data-v="work">Work or school</button></div>`;

/* ---------- shell ---------- */
function tabOf(v){return {studies:'Studies',study:'Studies',devo:'Devotional',devoRead:'Devotional'}[v]||''}
function tabsHtml(){const t=tabOf(ui.view);return [['Studies','book','studies'],['Devotional','cal','devo']].map(([l,i,v])=>`<button class="tab${t===l?' on':''}" data-act="nav" data-v="${v}">${ic(i,22)}${l}</button>`).join('')}
function sideHtml(){
 const t=tabOf(ui.view)||'Studies',open=sideOpen();
 if(!open)return `<button class="ib" data-act="side" aria-label="Show the sidebar" title="Show the sidebar">${ic('caretR',17)}</button><button class="ib${t==='Studies'?' on':''}" data-act="nav" data-v="studies" aria-label="Studies" title="Studies">${ic('book',19)}</button><button class="ib${t==='Devotional'?' on':''}" data-act="nav" data-v="devo" aria-label="Devotional" title="Devotional">${ic('cal',19)}</button>`;
 const g={};studyList().forEach(s=>(g[s.series||'Studies']=g[s.series||'Studies']||[]).push(s));
 const list=Object.entries(g).map(([k,ss])=>`<div class="sgrp">${esc(k)}</div>${ss.map(s=>`<button class="sli${ui.view==='study'&&s.id===ui.sid?' on':''}" data-act="open" data-s="${esc(s.id)}">${esc(s.title||'Untitled')}<small>${esc((s.passages||[]).map(p=>refStr(p.ref)).join(', '))}</small></button>`).join('')}`).join('');
 return `<div class="stabs"><button class="${t==='Studies'?'on':''}" data-act="nav" data-v="study">Studies</button><button class="${t==='Devotional'?'on':''}" data-act="nav" data-v="devo">Devotional</button><button class="caret" data-act="side" aria-label="Hide the sidebar" title="Hide the sidebar">${ic('caretL',16)}</button></div>${list||'<p class="muted" style="padding:0 9px;font-size:13px">No studies yet.</p>'}`;
}
let lastKey='';
function render(){
 if(WIDE.matches&&sideOpen()&&ui.view==='studies'&&cur())ui.view='study';
 if(ui.view==='study'&&!cur())ui.view='studies';
 const fn={studies:vStudies,study:vStudy,search:vSearch,devo:vDevo,devoRead:vDevoRead,settings:vSettings}[ui.view]||vStudies;
 const ae=document.activeElement,keepFocus=ae&&ae.id&&(ae.tagName==='INPUT'||ae.tagName==='TEXTAREA')&&!ae.closest('#ed')?{id:ae.id,s:ae.selectionStart,e:ae.selectionEnd}:null;
 const V=fn(),body=$('#body'),key=ui.view+'|'+ui.sid+'|'+ui.tab,top=key===lastKey?body.scrollTop:0;
 $('#bar').innerHTML=V.bar;body.innerHTML=V.body;
 const app=$('#app');app.classList.toggle('noside',!sideOpen());app.classList.toggle('under',SET.nlay==='under');app.classList.toggle('notabs',!!['search','settings'].includes(ui.view)&&!WIDE.matches);
 $('#tabs').innerHTML=tabsHtml();$('#side').innerHTML=sideHtml();
 body.scrollTop=top;lastKey=key;
 if(keepFocus){const el=document.getElementById(keepFocus.id);if(el&&el!==ae){el.focus();try{el.setSelectionRange(keepFocus.s,keepFocus.e)}catch(e){}}}
 if(!['study','devoRead'].includes(ui.view))$('#tx').classList.remove('open');
 if(ui.view!=='study'){hideBar();closeEd(true)}
 else if(ui.bar)placeBar();
 if(ui.flashV){const el=document.getElementById('v-'+ui.flashV);ui.flashV=null;if(el){el.scrollIntoView({block:'start'});setTimeout(()=>document.querySelectorAll('.vrow.flash').forEach(x=>x.classList.remove('flash')),1600)}}
}

/* ---------- menus ---------- */
function openMenu(btn,kind){
 const st=cur();const m=$('#menu');let items=[];
 if(kind==='tr'&&st){const tr=studyTr(st),anns=st.annotations||[];
  const list=[...new Set([...(st.translations||[]),'kjv','web','esv','net','nkjv'])].filter(t=>TRS[t]&&TRS[t].src!=='none');
  items=list.map(t=>{const n=anns.filter(a=>(a.spans||[]).some(s=>s.tr===t)).length;return {act:'settr',d:{tr:t},label:trName(t)+(n?` <small>${n} mark${n>1?'s':''}</small>`:''),on:t===tr,off:!trAvailable(t)}})}
 else if(kind==='layout')items=[['verse','Verse by verse'],['para','Paragraphs and poetry']].map(([v,l])=>({act:'tlay',d:{v},label:l,on:tset().layout===v}));
 else if(kind==='nlay')items=[['margin','Margin','Notes beside the text'],['under','Under','Notes under each verse']].map(([v,l,h])=>({act:'nlay',d:{v},label:`${l} <small>${h}</small>`,on:(SET.nlay||'margin')===v}));
 else if(kind==='filter'&&st){const anns=st.annotations||[];const kinds=[...new Set(anns.map(a=>a.kind))].filter(k=>KLABEL[k]);const tags=[...new Set(anns.flatMap(a=>a.tags||[]))];
  items=[{act:'filter',d:{f:'all'},label:'Everything',on:FILTER==='all'},...kinds.map(k=>({act:'filter',d:{f:'k:'+k},label:KLABEL[k],on:FILTER==='k:'+k})),...tags.map(t=>({act:'filter',d:{f:'t:'+t},label:'#'+esc(t),on:FILTER==='t:'+t}))]}
 m.innerHTML=items.map(it=>`<button class="mi${it.on?' on':''}${it.off?' off':''}" data-act="${it.act}" ${Object.entries(it.d).map(([k,v])=>`data-${k}="${esc(v)}"`).join(' ')}><span class="ck">${it.on?ic('check',15):''}</span><span>${it.label}</span></button>`).join('');
 m.classList.add('open');
 const r=btn.getBoundingClientRect(),w=m.offsetWidth||220;
 m.style.top=Math.min(r.bottom+6,innerHeight-(m.offsetHeight||200)-12)+'px';
 m.style.left=Math.max(8,Math.min(r.left,innerWidth-w-8))+'px';
}
const closeMenu=()=>$('#menu').classList.remove('open');

/* ---------- the colors by the selection ---------- */
const bar=$('#mbar');
['pointerdown','mousedown'].forEach(ev=>bar.addEventListener(ev,e=>e.preventDefault()));
let selT=0,warned=false;
document.addEventListener('selectionchange',()=>{clearTimeout(selT);selT=setTimeout(readSel,140)});
const vtxOf=n=>{const el=n&&(n.nodeType===3?n.parentElement:n);return el&&el.closest?el.closest('.vtx'):null};
function offIn(root,node,off){const r=document.createRange();r.setStart(root,0);r.setEnd(node,off);return r.toString().length}
function readSel(){
 if(ui.view!=='study'||ui.tab!=='passage')return;
 const s=getSelection();
 if(!s||!s.rangeCount||s.isCollapsed){ui.sel=null;if(ui.bar&&ui.bar.mode==='new')hideBar();return}
 if(s.anchorNode&&s.anchorNode.parentElement&&s.anchorNode.parentElement.closest('#ed'))return;
 const r=s.getRangeAt(0),a=vtxOf(r.startContainer),b=vtxOf(r.endContainer);
 if(!a||a!==b){ui.sel=null;if(ui.bar&&ui.bar.mode==='new')hideBar();if((a||b)&&!warned){warned=true;toast('Select words within one verse')}return}
 const txt=a.textContent;let st=offIn(a,r.startContainer,r.startOffset),en=offIn(a,r.endContainer,r.endOffset);
 while(st<en&&/\s/.test(txt[st]))st++;while(en>st&&/\s/.test(txt[en-1]))en--;
 if(en<=st){ui.sel=null;return}
 ui.sel={p:a.dataset.p,c:+a.dataset.c,v:+a.dataset.v,s:st,e:en,w:txt.slice(st,en)};
 if(ui.edit)closeEd();
 ui.barMore=false;ui.bar={mode:'new'};showBar(r.getBoundingClientRect?r.getBoundingClientRect():a.getBoundingClientRect());
}
function barHtml(){
 const a=ui.bar&&ui.bar.mode==='edit'?findAnn(ui.bar.id):null;
 const curCol=a&&a.kind==='highlight'?String(a.color).toLowerCase():null;
 const kinds=[['underline','underline','Underline'],['circle','circle','Circle'],['note','note','Comment']];
 return `${PALETTE.map((c,i)=>`<button class="sw${curCol===c?' on':''}" style="background:${c}" data-act="bcolor" data-c="${i}" aria-label="${curCol===c?'Remove highlight':'Highlight, color '+(i+1)}"></button>`).join('')}<span class="dv"></span>${ui.barMore?kinds.map(([k,i,l])=>`<button class="tb2${a&&a.kind===k?' on':''}" data-act="bkind" data-k="${k}" aria-label="${a&&a.kind===k?'Remove '+l.toLowerCase():l}" title="${l}">${ic(i,18)}</button>`).join(''):`<button class="more" data-act="bmore" aria-label="Underline, circle or comment" title="Underline, circle, comment">•••</button>`}${a?`<span class="dv"></span><button class="tb2" data-act="bnote" aria-label="Write a note" title="Note">${ic('pencil',17)}</button>`:''}`;
}
function showBar(rect){ui.bar.rect={top:rect.top,bottom:rect.bottom,left:rect.left,width:rect.width};bar.innerHTML=barHtml();bar.classList.add('show');placeBar()}
function placeBar(){
 if(!ui.bar||!ui.bar.rect)return;
 if(ui.bar.mode==='edit'){const el=document.querySelector(`.vtx [data-m="${String(ui.bar.id).replace(/["\\]/g,'\\$&')}"]`);if(!el){hideBar();return}const r=el.getBoundingClientRect();ui.bar.rect={top:r.top,bottom:r.bottom,left:r.left,width:r.width}}
 const r=ui.bar.rect,w=bar.offsetWidth||300,h=bar.offsetHeight||46,gap=12;
 const foot=MID.matches?16:84;
 let top=r.bottom+gap,up=false;
 if(top+h>innerHeight-foot){top=r.top-h-gap;up=true}
 const cx=r.left+r.width/2,left=Math.max(8,Math.min(cx-w/2,innerWidth-w-8));
 bar.style.top=top+'px';bar.style.left=left+'px';bar.classList.toggle('up',up);
 bar.style.setProperty('--px',Math.max(14,Math.min(w-14,cx-left))+'px');
}
function hideBar(){ui.bar=null;ui.barMore=false;bar.classList.remove('show','up')}
const newId=()=>'a_'+Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const findAnn=id=>{const st=cur();return st&&(st.annotations||[]).find(a=>a.id===id)};
function applyMark(kind,ci){
 const sl=ui.sel,st=cur();if(!sl||!st)return;
 if(ci!=null)ui.color=ci;
 const p=(st.passages||[]).find(x=>x.id===sl.p);if(!p)return;
 const a={id:newId(),kind,color:kind==='note'?'#5b8afe':PALETTE[ui.color],spans:[{tr:studyTr(st),b:p.ref.b,c:sl.c,v:sl.v,s:sl.s,e:sl.e,text:sl.w}],note:'',tags:[],created:new Date().toISOString()};
 commit({op:'add',sid:st.id,a});
 try{getSelection().removeAllRanges()}catch(e){}
 ui.sel=null;hideBar();openEd(a.id);
}
function removeAnn(a){
 const st=cur();const copy=JSON.parse(JSON.stringify(a));
 commit({op:'del',sid:st.id,id:a.id});hideBar();closeEd(true);render();
 toast(`${KLABEL[a.kind]||'Mark'} removed`,()=>{commit({op:'add',sid:st.id,a:copy});render()});
}
function markTap(id,el){
 const a=findAnn(id);if(!a)return;
 ui.barMore=!['highlight'].includes(a.kind);ui.bar={mode:'edit',id};showBar(el.getBoundingClientRect());
 if(document.getElementById('c-'+id)){ui.flash=id;const c=document.getElementById('c-'+id);if(c){c.classList.add('flash');c.scrollIntoView({block:'nearest',behavior:'smooth'})}setTimeout(()=>{if(ui.flash===id){ui.flash=null;const e=document.getElementById('c-'+id);if(e)e.classList.remove('flash')}},1600)}
}

/* ---------- note editor (formatted as you type) ---------- */
function htmlToMd(root){
 let out='';
 const walk=n=>{
  if(n.nodeType===3){out+=n.nodeValue.replace(/\u00a0/g,' ');return}
  if(n.nodeType!==1)return;const t=n.tagName;
  if(t==='BR'){out+='\n';return}
  const block=/^(DIV|P|LI|BLOCKQUOTE|UL|OL|H[1-6])$/.test(t);
  if(block&&out&&!out.endsWith('\n'))out+='\n';
  if(t==='LI'){const ol=n.parentElement&&n.parentElement.tagName==='OL';out+=ol?([...n.parentElement.children].indexOf(n)+1)+'. ':'- '}
  if(t==='BLOCKQUOTE')out+='> ';
  if(/^H[1-6]$/.test(t))out+='#'.repeat(Math.max(1,Math.min(3,+t[1]-1)))+' ';
  const w=(t==='B'||t==='STRONG')?'**':(t==='I'||t==='EM')?'*':t==='MARK'?'==':'';
  if(w){const inner=document.createElement('div');let save=out;out='';n.childNodes.forEach(walk);const s=out;out=save;const m=s.match(/^(\s*)([\s\S]*?)(\s*)$/);out+=m[2]?m[1]+w+m[2]+w+m[3]:s;return}
  n.childNodes.forEach(walk);
  if(block&&!out.endsWith('\n'))out+='\n';
 };
 root.childNodes.forEach(walk);
 return out.replace(/\n{3,}/g,'\n\n').replace(/\s+$/,'');
}
function openEd(id){hideBar();ui.edit=id;ui.unfold.add(id);render();renderEd();const n=$('#enote');if(n){n.focus();try{const r=document.createRange();r.selectNodeContents(n);r.collapse(false);const s=getSelection();s.removeAllRanges();s.addRange(r)}catch(e){}}}
function renderEd(){
 const ed=$('#ed');const a=ui.edit&&findAnn(ui.edit);
 if(!a){ed.classList.remove('open');ed.innerHTML='';return}
 const st=cur(),tag=a.titleTag||(a.tags||[])[0],col=(tag&&st.tagColors&&st.tagColors[tag])||okHex(a.color);
 const words=(a.spans||[]).map(s=>s.text).filter(Boolean).join(' … ');
 const mine=a.tags||[],others=allTags().filter(t=>!mine.includes(t));
 ed.innerHTML=`<div class="grab"></div><div class="ehead"><span class="nt" style="color:${col}">${esc(tag||KLABEL[a.kind]||'Note')}</span><em>${esc(words)}</em></div><div class="enote" id="enote" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Note" data-ph="Write a note">${a.note?md(a.note):''}</div><div class="etags">${mine.map(t=>`<button class="etag on${t===tag?' pin':''}" data-act="etag" data-t="${esc(t)}" title="${t===tag?'Title of this note':'Tap to remove'}">${t===tag?ic('pin',12):''}#${esc(t)}</button>`).join('')}${others.slice(0,8).map(t=>`<button class="etag" data-act="etag" data-t="${esc(t)}">#${esc(t)}</button>`).join('')}<input class="tagin" id="etagin" placeholder="+ tag" enterkeyhint="done" autocomplete="off" aria-label="New tag"></div><div class="etip">Tap outside to finish. Select words for Bold and Italic.</div>`;
 ed.classList.add('open');$('#tx').classList.remove('open');
 if(!MID.matches)fitEd();
}
function closeEd(quiet){if(!ui.edit)return;const id=ui.edit;ui.edit=null;$('#ed').classList.remove('open');$('#ed').innerHTML='';if(!quiet)render();return id}
function fmtText(ta,k){
 const s=ta.selectionStart,e=ta.selectionEnd,v=ta.value,t={b:'**',i:'*'}[k],sel=v.slice(s,e),L=t.length;
 if(v.slice(s-L,s)===t&&v.slice(e,e+L)===t){ta.value=v.slice(0,s-L)+sel+v.slice(e+L);ta.setSelectionRange(s-L,e-L)}
 else{ta.value=v.slice(0,s)+t+sel+t+v.slice(e);ta.setSelectionRange(s+L,e+L)}
 ta.dispatchEvent(new Event('input',{bubbles:true}));
}

/* ---------- toast & theme ---------- */
let tT=0;
function toast(msg,fn,lbl){const t=$('#toast');t.innerHTML=`<span>${esc(msg)}</span>${fn?`<button id="tundo">${lbl||'Undo'}</button>`:''}`;t.classList.add('show');clearTimeout(tT);tT=setTimeout(()=>t.classList.remove('show'),lbl?15000:fn?5000:2600);if(fn)$('#tundo').onclick=()=>{fn();t.classList.remove('show')}}
function applyTheme(){const r=document.documentElement;if(SET.theme==='auto')delete r.dataset.theme;else r.dataset.theme=SET.theme}

/* ---------- actions ---------- */
const A={
 side:()=>{SET.side=!sideOpen();saveSet();render()},
 nav:el=>{const v=el.dataset.v;if(['search','settings'].includes(v)&&!['search','settings'].includes(ui.view))ui.back=ui.view;closeEd(true);hideBar();closeMenu();ui.view=v;render();if(v==='search'&&MID.matches){const q=$('#q');if(q)q.focus()}},
 open:el=>{ui.sid=el.dataset.s;ui.view='study';ui.tab='passage';FILTER='all';closeEd(true);hideBar();ui.sumOpen=false;ui.unfold.clear();lastKey='';render()},
 tab:el=>{ui.tab=el.dataset.t;closeEd(true);hideBar();render()},
 menu:el=>{const m=$('#menu');if(m.classList.contains('open')&&m.dataset.k===el.dataset.m){closeMenu();return}m.dataset.k=el.dataset.m;openMenu(el,el.dataset.m)},
 filter:el=>{FILTER=el.dataset.f;closeMenu();render()},
 settr:el=>{const t=el.dataset.tr;closeMenu();if(!trAvailable(t)){toast(`Add the ${TRS[t]&&TRS[t].src==='esv'?'ESV':'API.Bible'} key in Settings to read ${trName(t)}`);return}SET.tr[cur().id]=t;saveSet();hideBar();render()},
 tlay:el=>{closeMenu();setText({layout:el.dataset.v})},
 nlay:el=>{closeMenu();SET.nlay=el.dataset.v;saveSet();render()},
 fold:()=>{SET.fold=!(SET.fold!==false);ui.unfold.clear();saveSet();render()},
 retry:el=>{Object.keys(CHERR).forEach(k=>{if(k.startsWith(el.dataset.tr+'|'))delete CHERR[k]});render()},
 sum:()=>{ui.sumOpen=!ui.sumOpen;render()},
 card:el=>{const id=el.dataset.m;if(el.classList.contains('fold')){ui.unfold.add(id);render();return}if(ui.edit===id)return;openEd(id)},
 bcolor:el=>{const i=+el.dataset.c,c=PALETTE[i];if(ui.bar.mode==='new'){applyMark('highlight',i);return}const a=findAnn(ui.bar.id);if(!a)return;if(a.kind==='highlight'&&String(a.color).toLowerCase()===c){removeAnn(a);return}ui.color=i;commit({op:'upd',sid:cur().id,id:a.id,patch:{kind:'highlight',color:c}});render();bar.innerHTML=barHtml()},
 bkind:el=>{const k=el.dataset.k;if(ui.bar.mode==='new'){applyMark(k,null);return}const a=findAnn(ui.bar.id);if(!a)return;if(a.kind===k){removeAnn(a);return}commit({op:'upd',sid:cur().id,id:a.id,patch:{kind:k}});render();bar.innerHTML=barHtml()},
 bmore:()=>{ui.barMore=true;bar.innerHTML=barHtml();placeBar()},
 bnote:()=>{const id=ui.bar&&ui.bar.id;if(id)openEd(id)},
 etag:el=>{const st=cur(),a=findAnn(ui.edit);if(!a)return;const t=el.dataset.t,has=(a.tags||[]).includes(t);const tags=has?a.tags.filter(x=>x!==t):[...(a.tags||[]),t];const patch={tags};if(has&&a.titleTag===t)patch.titleTag=tags[0]||'';commit({op:'upd',sid:st.id,id:a.id,patch});render();renderEd()},
 txt:()=>{closeEd(true);hideBar();const x=$('#tx');if(x.classList.contains('open')){x.classList.remove('open');return}x.innerHTML=txtHtml();x.classList.add('open')},
 txtx:()=>$('#tx').classList.remove('open'),
 tfont:el=>setText({font:el.dataset.k}),
 tsize:el=>setText({size:Math.max(.8,Math.min(1.6,Math.round((tset().size+(+el.dataset.d)*.05)*100)/100))}),
 tlh:el=>setText({lh:el.dataset.v}),
 tvn:el=>setText({vn:el.dataset.v==='1'}),
 treset:()=>{LS.set('text',{...TDEF});applyText();render();$('#tx').innerHTML=txtHtml()},
 theme:el=>{SET.theme=el.dataset.t;saveSet();applyTheme();render()},
 syncinfo:()=>{const s=syncInfo();toast(s.msg,account?()=>sync(true):null,account?'Sync now':null)},
 signin:()=>signIn(),
 signout:()=>signOut(),
 syncnow:()=>sync(true),
 acct:el=>{const g=$('#acct');g.dataset.v=el.dataset.v;g.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b===el));const t=$('#tenant-fld');if(t)t.hidden=el.dataset.v!=='work'},
 savecfg:()=>{const c=$('#cfg-client'),f=$('#cfg-folder'),tn=$('#cfg-tenant'),ac=$('#acct');const n={...LS.get('cfg',{})};if(ac)n.account=ac.dataset.v;if(c)n.clientId=c.value.trim();if(tn)n.tenant=tn.value.trim()||'organizations';if(f)n.folder=f.value.trim().replace(/^\/+|\/+$/g,'')||'Documents/Marginalia';LS.set('cfg',n);toast('Saved');setTimeout(()=>location.reload(),400)},
 savekeys:()=>{SET.esvKey=$('#k-esv').value.trim();SET.abKey=$('#k-ab').value.trim();saveSet();Object.keys(CHERR).forEach(k=>delete CHERR[k]);toast('Keys saved');render()},
 devotr:el=>{SET.devoTr=el.dataset.tr;saveSet();render()},
 start:()=>startRead(dkey(new Date()),todayRead()),
 another:()=>{ui.another++;render()},
 cal:el=>{let [y,m]=ui.cal;m+=+el.dataset.d;if(m<0){m=11;y--}if(m>11){m=0;y++}ui.cal=[y,m];render()},
 day:el=>{const k=el.dataset.d,tk=dkey(new Date());if((S.devo.log||{})[k])startRead(k);else if(k===tk)startRead(tk,todayRead());else toast(kdate(k)>new Date()?'That day hasn’t come yet':'No reading that day')},
 tpl:el=>{ui.dr.tpl=el.dataset.t;render()},
 ddone:()=>{const dr=ui.dr;const f={};Object.entries(dr.f).forEach(([k,v])=>{if(String(v).trim())f[k]=v});S.devo.log=S.devo.log||{};S.devo.log[dr.date]={ref:dr.ref,b:dr.b,c:dr.c,tr:dr.tr,pool:dr.pool,tpl:dr.tpl,f,t:Date.now()};DB.set('devo',S.devo);ui.view='devo';render();toast('Saved');clearTimeout(syncT);syncT=setTimeout(()=>sync(),1500)},
 goto:el=>{ui.sid=el.dataset.s;const st=cur();if(st&&el.dataset.tr&&TRS[el.dataset.tr]){SET.tr[st.id]=el.dataset.tr;saveSet()}ui.view='study';ui.tab='passage';FILTER='all';if(el.dataset.m)ui.unfold.add(el.dataset.m);ui.flashV=`${el.dataset.p}-${el.dataset.c}-${el.dataset.v}`;lastKey='';render()},
 gonotes:el=>{ui.sid=el.dataset.s;ui.view='study';ui.tab='notes';lastKey='';render()}
};
document.addEventListener('click',e=>{
 const inMenu=e.target.closest('#menu'),inEd=e.target.closest('#ed'),inBar=e.target.closest('#mbar');
 if(!inMenu&&!e.target.closest('[data-act=menu]'))closeMenu();
 const a=e.target.closest('[data-act]');
 if(ui.edit&&!inEd&&!inBar&&!(a&&a.dataset.act==='card'&&a.dataset.m===ui.edit)){closeEd()}
 if(a){if(a.disabled)return;const f=A[a.dataset.act];if(f){f(a,e);return}}
 const m=e.target.closest('.vtx [data-m]');
 if(m){const s=getSelection();if(s&&!s.isCollapsed)return;markTap(m.dataset.m,m);return}
 if(ui.bar&&ui.bar.mode==='edit'&&!inBar)hideBar();
 if($('#tx').classList.contains('open')&&!e.target.closest('#tx'))$('#tx').classList.remove('open');
});
document.addEventListener('input',e=>{
 const t=e.target;
 if(t.id==='enote'){const st=cur();if(st&&ui.edit)commit({op:'upd',sid:st.id,id:ui.edit,patch:{note:htmlToMd(t)}})}
 else if(t.id==='q'){ui.q=t.value;$('#res').innerHTML=results()}
 else if(t.id==='tsz'){LS.set('text',Object.assign(tset(),{size:+t.value}));applyText();$('#tszv').textContent=Math.round(t.value*100)+'%'}
 else if(t.dataset&&t.dataset.f&&ui.dr){ui.dr.f[t.dataset.f]=t.value}
});
document.addEventListener('keydown',e=>{
 if(e.target.id==='etagin'&&e.key==='Enter'){e.preventDefault();const v=e.target.value.trim().replace(/^#/,'');if(!v)return;const st=cur(),a=findAnn(ui.edit);if(a&&!(a.tags||[]).includes(v))commit({op:'upd',sid:st.id,id:a.id,patch:{tags:[...(a.tags||[]),v]}});render();renderEd();const n=$('#etagin');if(n)n.focus();return}
 if((e.ctrlKey||e.metaKey)&&['b','i'].includes(e.key.toLowerCase())){
  if(e.target.id==='enote'){e.preventDefault();document.execCommand(e.key.toLowerCase()==='b'?'bold':'italic');e.target.dispatchEvent(new Event('input',{bubbles:true}));return}
  if(e.target.tagName==='TEXTAREA'){e.preventDefault();fmtText(e.target,e.key.toLowerCase());return}
 }
 if((e.ctrlKey||e.metaKey)&&e.key==='Enter'&&e.target.id==='enote'){e.preventDefault();closeEd();return}
 if(e.key==='Enter'&&e.target.classList&&e.target.classList.contains('nc')){A.card(e.target);return}
 if(e.key==='Escape'){if($('#menu').classList.contains('open'))closeMenu();else if($('#tx').classList.contains('open'))$('#tx').classList.remove('open');else if(ui.edit)closeEd();else if(ui.bar)hideBar()}
});
$('#body').addEventListener('scroll',()=>{if(ui.bar)placeBar();closeMenu()},{passive:true});
function fitEd(){const ed=$('#ed');if(!window.visualViewport||MID.matches){ed.style.bottom='';return}const vv=visualViewport;ed.style.bottom=Math.max(0,innerHeight-vv.height-vv.offsetTop)+'px'}
if(window.visualViewport){visualViewport.addEventListener('resize',fitEd);visualViewport.addEventListener('scroll',fitEd)}
WIDE.addEventListener&&WIDE.addEventListener('change',()=>render());
MID.addEventListener&&MID.addEventListener('change',()=>render());
addEventListener('resize',()=>{if(ui.bar)placeBar()});
addEventListener('online',()=>sync());
addEventListener('offline',()=>setStatus(''));
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&Date.now()-LS.get('lastSync',0)>60000)sync()});

window.MarginaliaState=S;
/* ---------- start ---------- */
(async function start(){
 applyTheme();applyText();
 try{S.studies=(await DB.get('studies'))||{};S.pending=(await DB.get('pending'))||[];S.devo=(await DB.get('devo'))||{log:{}}}catch(e){}
 const first=studyList()[0];if(first)ui.sid=first.id;
 ui.view=WIDE.matches&&first?'study':'studies';
 render();
 await initAuth();
 render();
 if(account)sync();
 if('serviceWorker' in navigator&&location.protocol==='https:'){
  navigator.serviceWorker.register('sw.js').then(r=>{r.addEventListener('updatefound',()=>{const n=r.installing;if(n)n.addEventListener('statechange',()=>{if(n.state==='activated'&&navigator.serviceWorker.controller)toast('A new version is ready',()=>location.reload(),'Reload')})})}).catch(()=>{});
 }
})();
