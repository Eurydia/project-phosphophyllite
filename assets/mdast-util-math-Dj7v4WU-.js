import{o as c}from"./devlop-0Dp3JUBc.js";import{l as w}from"./longest-streak-CtXnX3Xp.js";function $(){return{enter:{mathFlow:d,mathFlowFenceMeta:h,mathText:o},exit:{mathFlow:p,mathFlowFence:l,mathFlowFenceMeta:f,mathFlowValue:n,mathText:x,mathTextData:n}};function d(t){const e={type:"element",tagName:"code",properties:{className:["language-math","math-display"]},children:[]};this.enter({type:"math",meta:null,value:"",data:{hName:"pre",hChildren:[e]}},t)}function h(){this.buffer()}function f(){const t=this.resume(),e=this.stack[this.stack.length-1];c(e.type==="math"),e.meta=t}function l(){this.data.mathFlowInside||(this.buffer(),this.data.mathFlowInside=!0)}function p(t){const e=this.resume().replace(/^(\r?\n|\r)|(\r?\n|\r)$/g,""),a=this.stack[this.stack.length-1];c(a.type==="math"),this.exit(t),a.value=e;const i=a.data.hChildren[0];c(i.type==="element"),c(i.tagName==="code"),i.children.push({type:"text",value:e}),this.data.mathFlowInside=void 0}function o(t){this.enter({type:"inlineMath",value:"",data:{hName:"code",hProperties:{className:["language-math","math-inline"]},hChildren:[]}},t),this.buffer()}function x(t){const e=this.resume(),a=this.stack[this.stack.length-1];c(a.type==="inlineMath"),this.exit(t),a.value=e,a.data.hChildren.push({type:"text",value:e})}function n(t){this.config.enter.data.call(this,t),this.config.exit.data.call(this,t)}}function g(d){let h=(d||{}).singleDollarTextMath;return h==null&&(h=!0),l.peek=p,{unsafe:[{character:"\r",inConstruct:"mathFlowMeta"},{character:`
`,inConstruct:"mathFlowMeta"},{character:"$",after:h?void 0:"\\$",inConstruct:"phrasing"},{character:"$",inConstruct:"mathFlowMeta"},{atBreak:!0,character:"$",after:"\\$"}],handlers:{math:f,inlineMath:l}};function f(o,x,n,t){const e=o.value||"",a=n.createTracker(t),i="$".repeat(Math.max(w(e,"$")+1,2)),u=n.enter("mathFlow");let r=a.move(i);if(o.meta){const s=n.enter("mathFlowMeta");r+=a.move(n.safe(o.meta,{after:`
`,before:r,encode:["$"],...a.current()})),s()}return r+=a.move(`
`),e&&(r+=a.move(e+`
`)),r+=a.move(i),u(),r}function l(o,x,n){let t=o.value||"",e=1;for(h||e++;new RegExp("(^|[^$])"+"\\$".repeat(e)+"([^$]|$)").test(t);)e++;const a="$".repeat(e);/[^ \r\n]/.test(t)&&(/^[ \r\n]/.test(t)&&/[ \r\n]$/.test(t)||/^\$|\$$/.test(t))&&(t=" "+t+" ");let i=-1;for(;++i<n.unsafe.length;){const u=n.unsafe[i];if(!u.atBreak)continue;const r=n.compilePattern(u);let s;for(;s=r.exec(t);){let m=s.index;t.codePointAt(m)===10&&t.codePointAt(m-1)===13&&m--,t=t.slice(0,m)+" "+t.slice(s.index+1)}}return a+t+a}function p(){return"$"}}export{g as a,$ as m};
//# sourceMappingURL=mdast-util-math-Dj7v4WU-.js.map