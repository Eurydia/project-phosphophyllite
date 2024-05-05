import{h as e}from"./hastscript-C3d41mAm.js";const k={};function A(l){const n=l||k,c=p(n.css),m=n.dir,o=p(n.js),f=n.language||"en",r=p(n.link);let a=p(n.meta);const y=p(n.script),x=p(n.style),w=n.title;return n.responsive!==!1&&(a=[{content:"width=device-width, initial-scale=1",name:"viewport"},...a]),function(h,u){var v,g;const d=((v=u.data.meta)==null?void 0:v.title)||((g=u.data.matter)==null?void 0:g.title)||w||u.stem,i=h.type==="root"?[...h.children]:[h],s=[{type:"text",value:`
`},e("meta",{charSet:"utf-8"})];let t=-1;for(i.length>0&&i.unshift({type:"text",value:`
`}),d&&s.push({type:"text",value:`
`},e("title",d));++t<a.length;)s.push({type:"text",value:`
`},e("meta",a[t]));for(t=-1;++t<r.length;)s.push({type:"text",value:`
`},e("link",r[t]));for(t=-1;++t<x.length;)s.push({type:"text",value:`
`},e("style",x[t]));for(t=-1;++t<c.length;)s.push({type:"text",value:`
`},e("link",{href:c[t],rel:"stylesheet"}));for(s.push({type:"text",value:`
`}),t=-1;++t<y.length;)i.push({type:"text",value:`
`},e("script",y[t]));for(t=-1;++t<o.length;)i.push({type:"text",value:`
`},e("script",{src:o[t]}));return i.push({type:"text",value:`
`}),{type:"root",children:[{type:"doctype"},{type:"text",value:`
`},e("html",{dir:m,lang:f},[{type:"text",value:`
`},e("head",s),{type:"text",value:`
`},e("body",i),{type:"text",value:`
`}]),{type:"text",value:`
`}]}}}function p(l){return l==null?[]:Array.isArray(l)?l:[l]}export{A as r};
