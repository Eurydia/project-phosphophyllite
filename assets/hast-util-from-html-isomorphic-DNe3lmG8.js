import{f as n}from"./hast-util-from-dom-CFM1EDMd.js";const m=new DOMParser;function o(r,e){const t=e!=null&&e.fragment?a(r):m.parseFromString(r,"text/html");return n(t)}function a(r){const e=document.createElement("template");return e.innerHTML=r,e.content}export{o as f};
