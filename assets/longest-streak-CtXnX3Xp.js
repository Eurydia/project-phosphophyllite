function f(i,t){const r=String(i);let e=r.indexOf(t),n=e,l=0,o=0;if(typeof t!="string")throw new TypeError("Expected substring");for(;e!==-1;)e===n?++l>o&&(o=l):l=1,n=e+t.length,e=r.indexOf(t,n);return o}export{f as l};
//# sourceMappingURL=longest-streak-CtXnX3Xp.js.map
