var S={exports:{}},r={};/**
 * @license React
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var $;function I(){if($)return r;$=1;var m=Symbol.for("react.element"),a=Symbol.for("react.portal"),o=Symbol.for("react.fragment"),n=Symbol.for("react.strict_mode"),c=Symbol.for("react.profiler"),s=Symbol.for("react.provider"),f=Symbol.for("react.context"),x=Symbol.for("react.server_context"),u=Symbol.for("react.forward_ref"),i=Symbol.for("react.suspense"),l=Symbol.for("react.suspense_list"),p=Symbol.for("react.memo"),y=Symbol.for("react.lazy"),_=Symbol.for("react.offscreen"),b;b=Symbol.for("react.module.reference");function t(e){if(typeof e=="object"&&e!==null){var d=e.$$typeof;switch(d){case m:switch(e=e.type,e){case o:case c:case n:case i:case l:return e;default:switch(e=e&&e.$$typeof,e){case x:case f:case u:case y:case p:case s:return e;default:return d}}case a:return d}}}return r.ContextConsumer=f,r.ContextProvider=s,r.Element=m,r.ForwardRef=u,r.Fragment=o,r.Lazy=y,r.Memo=p,r.Portal=a,r.Profiler=c,r.StrictMode=n,r.Suspense=i,r.SuspenseList=l,r.isAsyncMode=function(){return!1},r.isConcurrentMode=function(){return!1},r.isContextConsumer=function(e){return t(e)===f},r.isContextProvider=function(e){return t(e)===s},r.isElement=function(e){return typeof e=="object"&&e!==null&&e.$$typeof===m},r.isForwardRef=function(e){return t(e)===u},r.isFragment=function(e){return t(e)===o},r.isLazy=function(e){return t(e)===y},r.isMemo=function(e){return t(e)===p},r.isPortal=function(e){return t(e)===a},r.isProfiler=function(e){return t(e)===c},r.isStrictMode=function(e){return t(e)===n},r.isSuspense=function(e){return t(e)===i},r.isSuspenseList=function(e){return t(e)===l},r.isValidElementType=function(e){return typeof e=="string"||typeof e=="function"||e===o||e===c||e===n||e===i||e===l||e===_||typeof e=="object"&&e!==null&&(e.$$typeof===y||e.$$typeof===p||e.$$typeof===s||e.$$typeof===f||e.$$typeof===u||e.$$typeof===b||e.getModuleId!==void 0)},r.typeOf=t,r}var v;function R(){return v||(v=1,S.exports=I()),S.exports}var C=R();export{C as r};
//# sourceMappingURL=react-is-CX4zgkE_.js.map
