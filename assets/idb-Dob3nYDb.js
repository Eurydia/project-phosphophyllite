const y=(e,n)=>n.some(t=>e instanceof t);let B,b;function C(){return B||(B=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function x(){return b||(b=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const D=new WeakMap,h=new WeakMap,f=new WeakMap;function S(e){const n=new Promise((t,r)=>{const i=()=>{e.removeEventListener("success",c),e.removeEventListener("error",o)},c=()=>{t(u(e.result)),i()},o=()=>{r(e.error),i()};e.addEventListener("success",c),e.addEventListener("error",o)});return f.set(n,e),n}function T(e){if(D.has(e))return;const n=new Promise((t,r)=>{const i=()=>{e.removeEventListener("complete",c),e.removeEventListener("error",o),e.removeEventListener("abort",o)},c=()=>{t(),i()},o=()=>{r(e.error||new DOMException("AbortError","AbortError")),i()};e.addEventListener("complete",c),e.addEventListener("error",o),e.addEventListener("abort",o)});D.set(e,n)}let l={get(e,n,t){if(e instanceof IDBTransaction){if(n==="done")return D.get(e);if(n==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return u(e[n])},set(e,n,t){return e[n]=t,!0},has(e,n){return e instanceof IDBTransaction&&(n==="done"||n==="store")?!0:n in e}};function g(e){l=e(l)}function V(e){return x().includes(e)?function(...n){return e.apply(m(this),n),u(this.request)}:function(...n){return u(e.apply(m(this),n))}}function j(e){return typeof e=="function"?V(e):(e instanceof IDBTransaction&&T(e),y(e,C())?new Proxy(e,l):e)}function u(e){if(e instanceof IDBRequest)return S(e);if(h.has(e))return h.get(e);const n=j(e);return n!==e&&(h.set(e,n),f.set(n,e)),n}const m=e=>f.get(e);function F(e,n,{blocked:t,upgrade:r,blocking:i,terminated:c}={}){const o=indexedDB.open(e,n),d=u(o);return r&&o.addEventListener("upgradeneeded",s=>{r(u(o.result),s.oldVersion,s.newVersion,u(o.transaction),s)}),t&&o.addEventListener("blocked",s=>t(s.oldVersion,s.newVersion,s)),d.then(s=>{c&&s.addEventListener("close",()=>c()),i&&s.addEventListener("versionchange",a=>i(a.oldVersion,a.newVersion,a))}).catch(()=>{}),d}const A=["get","getKey","getAll","getAllKeys","count"],O=["put","add","delete","clear"],I=new Map;function E(e,n){if(!(e instanceof IDBDatabase&&!(n in e)&&typeof n=="string"))return;if(I.get(n))return I.get(n);const t=n.replace(/FromIndex$/,""),r=n!==t,i=O.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(i||A.includes(t)))return;const c=async function(o,...d){const s=this.transaction(o,i?"readwrite":"readonly");let a=s.store;return r&&(a=a.index(d.shift())),(await Promise.all([a[t](...d),i&&s.done]))[0]};return I.set(n,c),c}g(e=>({...e,get:(n,t,r)=>E(n,t)||e.get(n,t,r),has:(n,t)=>!!E(n,t)||e.has(n,t)}));const v=["continue","continuePrimaryKey","advance"],M={},w=new WeakMap,L=new WeakMap,W={get(e,n){if(!v.includes(n))return e[n];let t=M[n];return t||(t=M[n]=function(...r){w.set(this,L.get(this)[n](...r))}),t}};async function*p(...e){let n=this;if(n instanceof IDBCursor||(n=await n.openCursor(...e)),!n)return;n=n;const t=new Proxy(n,W);for(L.set(t,n),f.set(t,m(n));n;)yield t,n=await(w.get(t)||n.continue()),w.delete(t)}function P(e,n){return n===Symbol.asyncIterator&&y(e,[IDBIndex,IDBObjectStore,IDBCursor])||n==="iterate"&&y(e,[IDBIndex,IDBObjectStore])}g(e=>({...e,get(n,t,r){return P(n,t)?p:e.get(n,t,r)},has(n,t){return P(n,t)||e.has(n,t)}}));export{F as o};
