import{f as q}from"./micromark-factory-space-6dA1Il-k.js";import{m as h}from"./micromark-util-character-DjYUzTuj.js";import"./katex-RUdq65sM.js";const P={tokenize:L,concrete:!0},k={tokenize:O,partial:!0};function L(n,u,a){const i=this,e=i.events[i.events.length-1],p=e&&e[1].type==="linePrefix"?e[2].sliceSerialize(e[1],!0).length:0;let l=0;return w;function w(t){return n.enter("mathFlow"),n.enter("mathFlowFence"),n.enter("mathFlowFenceSequence"),x(t)}function x(t){return t===36?(n.consume(t),l++,x):l<2?a(t):(n.exit("mathFlowFenceSequence"),q(n,z,"whitespace")(t))}function z(t){return t===null||h(t)?g(t):(n.enter("mathFlowFenceMeta"),n.enter("chunkString",{contentType:"string"}),T(t))}function T(t){return t===null||h(t)?(n.exit("chunkString"),n.exit("mathFlowFenceMeta"),g(t)):t===36?a(t):(n.consume(t),T)}function g(t){return n.exit("mathFlowFence"),i.interrupt?u(t):n.attempt(k,m,S)(t)}function m(t){return n.attempt({tokenize:b,partial:!0},S,y)(t)}function y(t){return(p?q(n,F,"linePrefix",p+1):F)(t)}function F(t){return t===null?S(t):h(t)?n.attempt(k,m,S)(t):(n.enter("mathFlowValue"),r(t))}function r(t){return t===null||h(t)?(n.exit("mathFlowValue"),F(t)):(n.consume(t),r)}function S(t){return n.exit("mathFlow"),u(t)}function b(t,D,s){let E=0;return q(t,M,"linePrefix",i.parser.constructs.disable.null.includes("codeIndented")?void 0:4);function M(o){return t.enter("mathFlowFence"),t.enter("mathFlowFenceSequence"),C(o)}function C(o){return o===36?(E++,t.consume(o),C):E<l?s(o):(t.exit("mathFlowFenceSequence"),q(t,c,"whitespace")(o))}function c(o){return o===null||h(o)?(t.exit("mathFlowFence"),D(o)):s(o)}}}function O(n,u,a){const i=this;return e;function e(l){return l===null?u(l):(n.enter("lineEnding"),n.consume(l),n.exit("lineEnding"),p)}function p(l){return i.parser.lazy[i.now().line]?a(l):u(l)}}function I(n){let a=(n||{}).singleDollarTextMath;return a==null&&(a=!0),{tokenize:i,resolve:N,previous:V};function i(e,p,l){let w=0,x,z;return T;function T(r){return e.enter("mathText"),e.enter("mathTextSequence"),g(r)}function g(r){return r===36?(e.consume(r),w++,g):w<2&&!a?l(r):(e.exit("mathTextSequence"),m(r))}function m(r){return r===null?l(r):r===36?(z=e.enter("mathTextSequence"),x=0,F(r)):r===32?(e.enter("space"),e.consume(r),e.exit("space"),m):h(r)?(e.enter("lineEnding"),e.consume(r),e.exit("lineEnding"),m):(e.enter("mathTextData"),y(r))}function y(r){return r===null||r===32||r===36||h(r)?(e.exit("mathTextData"),m(r)):(e.consume(r),y)}function F(r){return r===36?(e.consume(r),x++,F):x===w?(e.exit("mathTextSequence"),e.exit("mathText"),p(r)):(z.type="mathTextData",y(r))}}}function N(n){let u=n.length-4,a=3,i,e;if((n[a][1].type==="lineEnding"||n[a][1].type==="space")&&(n[u][1].type==="lineEnding"||n[u][1].type==="space")){for(i=a;++i<u;)if(n[i][1].type==="mathTextData"){n[u][1].type="mathTextPadding",n[a][1].type="mathTextPadding",a+=2,u-=2;break}}for(i=a-1,u++;++i<=u;)e===void 0?i!==u&&n[i][1].type!=="lineEnding"&&(e=i):(i===u||n[i][1].type==="lineEnding")&&(n[e][1].type="mathTextData",i!==e+2&&(n[e][1].end=n[i-1][1].end,n.splice(e+2,i-e-2),u-=i-e-2,i=e+2),e=void 0);return n}function V(n){return n!==36||this.events[this.events.length-1][1].type==="characterEscape"}function j(n){return{flow:{36:P},text:{36:I(n)}}}export{j as m};
//# sourceMappingURL=micromark-extension-math-CUC_GoCG.js.map
