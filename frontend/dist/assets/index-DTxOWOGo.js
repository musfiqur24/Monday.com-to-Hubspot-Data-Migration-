var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t,t.exports),e=null),t.exports),s=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},c=(n,r,o)=>(o=n==null?{}:e(i(n)),s(r||!n||!n.__esModule||!a.call(n,`default`)?t(o,`default`,{value:n,enumerable:!0}):o,n));(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var l=o((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.portal`),r=Symbol.for(`react.fragment`),i=Symbol.for(`react.strict_mode`),a=Symbol.for(`react.profiler`),o=Symbol.for(`react.consumer`),s=Symbol.for(`react.context`),c=Symbol.for(`react.forward_ref`),l=Symbol.for(`react.suspense`),u=Symbol.for(`react.memo`),d=Symbol.for(`react.lazy`),f=Symbol.for(`react.activity`),p=Symbol.for(`react.view_transition`),m=Symbol.iterator;function h(e){return typeof e!=`object`||!e?null:(e=m&&e[m]||e[`@@iterator`],typeof e==`function`?e:null)}var g={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},_=Object.assign,v={};function y(e,t,n){this.props=e,this.context=t,this.refs=v,this.updater=n||g}y.prototype.isReactComponent={},y.prototype.setState=function(e,t){if(typeof e!=`object`&&typeof e!=`function`&&e!=null)throw Error(`takes an object of state variables to update or a function which returns an object of state variables.`);this.updater.enqueueSetState(this,e,t,`setState`)},y.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,`forceUpdate`)};function b(){}b.prototype=y.prototype;function x(e,t,n){this.props=e,this.context=t,this.refs=v,this.updater=n||g}var S=x.prototype=new b;S.constructor=x,_(S,y.prototype),S.isPureReactComponent=!0;var C=Array.isArray;function ee(){}var w={H:null,A:null,T:null,S:null},te=Object.prototype.hasOwnProperty;function T(e,n,r){var i=r.ref;return{$$typeof:t,type:e,key:n,ref:i===void 0?null:i,props:r}}function ne(e,t){return T(e.type,t,e.props)}function re(e){return typeof e==`object`&&!!e&&e.$$typeof===t}function ie(e){var t={"=":`=0`,":":`=2`};return`$`+e.replace(/[=:]/g,function(e){return t[e]})}var E=/\/+/g;function ae(e,t){return typeof e==`object`&&e&&e.key!=null?ie(``+e.key):t.toString(36)}function oe(e){switch(e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason;default:switch(typeof e.status==`string`?e.then(ee,ee):(e.status=`pending`,e.then(function(t){e.status===`pending`&&(e.status=`fulfilled`,e.value=t)},function(t){e.status===`pending`&&(e.status=`rejected`,e.reason=t)})),e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason}}throw e}function se(e,r,i,a,o){var s=typeof e;(s===`undefined`||s===`boolean`)&&(e=null);var c=!1;if(e===null)c=!0;else switch(s){case`bigint`:case`string`:case`number`:c=!0;break;case`object`:switch(e.$$typeof){case t:case n:c=!0;break;case d:return c=e._init,se(c(e._payload),r,i,a,o)}}if(c)return o=o(e),c=a===``?`.`+ae(e,0):a,C(o)?(i=``,c!=null&&(i=c.replace(E,`$&/`)+`/`),se(o,r,i,``,function(e){return e})):o!=null&&(re(o)&&(o=ne(o,i+(o.key==null||e&&e.key===o.key?``:(``+o.key).replace(E,`$&/`)+`/`)+c)),r.push(o)),1;c=0;var l=a===``?`.`:a+`:`;if(C(e))for(var u=0;u<e.length;u++)a=e[u],s=l+ae(a,u),c+=se(a,r,i,s,o);else if(u=h(e),typeof u==`function`)for(e=u.call(e),u=0;!(a=e.next()).done;)a=a.value,s=l+ae(a,u++),c+=se(a,r,i,s,o);else if(s===`object`){if(typeof e.then==`function`)return se(oe(e),r,i,a,o);throw r=String(e),Error(`Objects are not valid as a React child (found: `+(r===`[object Object]`?`object with keys {`+Object.keys(e).join(`, `)+`}`:r)+`). If you meant to render a collection of children, use an array instead.`)}return c}function ce(e,t,n){if(e==null)return e;var r=[],i=0;return se(e,r,``,``,function(e){return t.call(n,e,i++)}),r}function D(e){if(e._status===-1){var t=e._result,n=t();n.then(function(t){(e._status===0||e._status===-1)&&(e._status=1,e._result=t,n.status===void 0&&(n.status=`fulfilled`,n.value=t))},function(t){(e._status===0||e._status===-1)&&(e._status=2,e._result=t,n.status===void 0&&(n.status=`rejected`,n.reason=t))}),e._status===-1&&(e._status=0,e._result=n)}if(e._status===1)return e._result.default;throw e._result}var le=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)};function ue(e){var t=w.T,n={};n.types=t===null?null:t.types,w.T=n;try{var r=e(),i=w.S;i!==null&&i(n,r),typeof r==`object`&&r&&typeof r.then==`function`&&r.then(ee,le)}catch(e){le(e)}finally{t!==null&&n.types!==null&&(t.types=n.types),w.T=t}}function de(e){var t=w.T;if(t!==null){var n=t.types;n===null?t.types=[e]:n.indexOf(e)===-1&&n.push(e)}else ue(de.bind(null,e))}var fe={map:ce,forEach:function(e,t,n){ce(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return ce(e,function(){t++}),t},toArray:function(e){return ce(e,function(e){return e})||[]},only:function(e){if(!re(e))throw Error(`React.Children.only expected to receive a single React element child.`);return e}};e.Activity=f,e.Children=fe,e.Component=y,e.Fragment=r,e.Profiler=a,e.PureComponent=x,e.StrictMode=i,e.Suspense=l,e.ViewTransition=p,e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=w,e.__COMPILER_RUNTIME={__proto__:null,c:function(e){return w.H.useMemoCache(e)}},e.addTransitionType=de,e.cache=function(e){return function(){return e.apply(null,arguments)}},e.cacheSignal=function(){return null},e.cloneElement=function(e,t,n){if(e==null)throw Error(`The argument must be a React element, but you passed `+e+`.`);var r=_({},e.props),i=e.key;if(t!=null)for(a in t.key!==void 0&&(i=``+t.key),t)!te.call(t,a)||a===`key`||a===`__self`||a===`__source`||a===`ref`&&t.ref===void 0||(r[a]=t[a]);var a=arguments.length-2;if(a===1)r.children=n;else if(1<a){for(var o=Array(a),s=0;s<a;s++)o[s]=arguments[s+2];r.children=o}return T(e.type,i,r)},e.createContext=function(e){return e={$$typeof:s,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:o,_context:e},e},e.createElement=function(e,t,n){var r,i={},a=null;if(t!=null)for(r in t.key!==void 0&&(a=``+t.key),t)te.call(t,r)&&r!==`key`&&r!==`__self`&&r!==`__source`&&(i[r]=t[r]);var o=arguments.length-2;if(o===1)i.children=n;else if(1<o){for(var s=Array(o),c=0;c<o;c++)s[c]=arguments[c+2];i.children=s}if(e&&e.defaultProps)for(r in o=e.defaultProps,o)i[r]===void 0&&(i[r]=o[r]);return T(e,a,i)},e.createRef=function(){return{current:null}},e.forwardRef=function(e){return{$$typeof:c,render:e}},e.isValidElement=re,e.lazy=function(e){return{$$typeof:d,_payload:{_status:-1,_result:e},_init:D}},e.memo=function(e,t){return{$$typeof:u,type:e,compare:t===void 0?null:t}},e.startTransition=ue,e.unstable_useCacheRefresh=function(){return w.H.useCacheRefresh()},e.use=function(e){return w.H.use(e)},e.useActionState=function(e,t,n){return w.H.useActionState(e,t,n)},e.useCallback=function(e,t){return w.H.useCallback(e,t)},e.useContext=function(e){return w.H.useContext(e)},e.useDebugValue=function(){},e.useDeferredValue=function(e,t){return w.H.useDeferredValue(e,t)},e.useEffect=function(e,t){return w.H.useEffect(e,t)},e.useEffectEvent=function(e){return w.H.useEffectEvent(e)},e.useId=function(){return w.H.useId()},e.useImperativeHandle=function(e,t,n){return w.H.useImperativeHandle(e,t,n)},e.useInsertionEffect=function(e,t){return w.H.useInsertionEffect(e,t)},e.useLayoutEffect=function(e,t){return w.H.useLayoutEffect(e,t)},e.useMemo=function(e,t){return w.H.useMemo(e,t)},e.useOptimistic=function(e,t){return w.H.useOptimistic(e,t)},e.useReducer=function(e,t,n){return w.H.useReducer(e,t,n)},e.useRef=function(e){return w.H.useRef(e)},e.useState=function(e){return w.H.useState(e)},e.useSyncExternalStore=function(e,t,n){return w.H.useSyncExternalStore(e,t,n)},e.useTransition=function(){return w.H.useTransition()},e.version=`19.3.1`})),u=o(((e,t)=>{t.exports=l()})),d=o((e=>{function t(e,t){var n=e.length;e.push(t);a:for(;0<n;){var r=n-1>>>1,a=e[r];if(0<i(a,t))e[r]=t,e[n]=a,n=r;else break a}}function n(e){return e.length===0?null:e[0]}function r(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;a:for(var r=0,a=e.length,o=a>>>1;r<o;){var s=2*(r+1)-1,c=e[s],l=s+1,u=e[l];if(0>i(c,n))l<a&&0>i(u,c)?(e[r]=u,e[l]=n,r=l):(e[r]=c,e[s]=n,r=s);else if(l<a&&0>i(u,n))e[r]=u,e[l]=n,r=l;else break a}}return t}function i(e,t){var n=e.sortIndex-t.sortIndex;return n===0?e.id-t.id:n}if(e.unstable_now=void 0,typeof performance==`object`&&typeof performance.now==`function`){var a=performance;e.unstable_now=function(){return a.now()}}else{var o=Date,s=o.now();e.unstable_now=function(){return o.now()-s}}var c=[],l=[],u=1,d=null,f=3,p=!1,m=!1,h=!1,g=!1,_=typeof setTimeout==`function`?setTimeout:null,v=typeof clearTimeout==`function`?clearTimeout:null,y=typeof setImmediate<`u`?setImmediate:null;function b(e){for(var i=n(l);i!==null;){if(i.callback===null)r(l);else if(i.startTime<=e)r(l),i.sortIndex=i.expirationTime,t(c,i);else break;i=n(l)}}function x(e){if(h=!1,b(e),!m){if(n(c)!==null)m=!0,S||(S=!0,ne());else{var t=n(l);t!==null&&E(x,t.startTime-e)}}}var S=!1,C=-1,ee=5,w=-1;function te(){return g?!0:!(e.unstable_now()-w<ee)}function T(){if(g=!1,S){var t=e.unstable_now();w=t;var i=!0;try{a:{m=!1,h&&(h=!1,v(C),C=-1),p=!0;var a=f;try{b:{for(b(t),d=n(c);d!==null&&!(d.expirationTime>t&&te());){var o=d.callback;if(typeof o==`function`){d.callback=null,f=d.priorityLevel;var s=o(d.expirationTime<=t);if(t=e.unstable_now(),typeof s==`function`){d.callback=s,b(t),i=!0;break b}d===n(c)&&r(c),b(t)}else r(c);d=n(c)}if(d!==null)i=!0;else{var u=n(l);u!==null&&E(x,u.startTime-t),i=!1}}break a}finally{d=null,f=a,p=!1}i=void 0}}finally{i?ne():S=!1}}}var ne;if(typeof y==`function`)ne=function(){y(T)};else if(typeof MessageChannel<`u`){var re=new MessageChannel,ie=re.port2;re.port1.onmessage=T,ne=function(){ie.postMessage(null)}}else ne=function(){_(T,0)};function E(t,n){C=_(function(){t(e.unstable_now())},n)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(e){e.callback=null},e.unstable_forceFrameRate=function(e){0>e||125<e?console.error(`forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported`):ee=0<e?Math.floor(1e3/e):5},e.unstable_getCurrentPriorityLevel=function(){return f},e.unstable_next=function(e){switch(f){case 1:case 2:case 3:var t=3;break;default:t=f}var n=f;f=t;try{return e()}finally{f=n}},e.unstable_requestPaint=function(){g=!0},e.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=f;f=e;try{return t()}finally{f=n}},e.unstable_scheduleCallback=function(r,i,a){var o=e.unstable_now();switch(typeof a==`object`&&a?(a=a.delay,a=typeof a==`number`&&0<a?o+a:o):a=o,r){case 1:var s=-1;break;case 2:s=250;break;case 5:s=1073741823;break;case 4:s=1e4;break;default:s=5e3}return s=a+s,r={id:u++,callback:i,priorityLevel:r,startTime:a,expirationTime:s,sortIndex:-1},a>o?(r.sortIndex=a,t(l,r),n(c)===null&&r===n(l)&&(h?(v(C),C=-1):h=!0,E(x,a-o))):(r.sortIndex=s,t(c,r),m||p||(m=!0,S||(S=!0,ne()))),r},e.unstable_shouldYield=te,e.unstable_wrapCallback=function(e){var t=f;return function(){var n=f;f=t;try{return e.apply(this,arguments)}finally{f=n}}}})),f=o(((e,t)=>{t.exports=d()})),p=o((e=>{var t=u();function n(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function r(){}var i={d:{f:r,r:function(){throw Error(n(522))},D:r,C:r,L:r,m:r,X:r,S:r,M:r},p:0,findDOMNode:null},a=Symbol.for(`react.portal`),o=Symbol.for(`react.recoverable`),s=Symbol.for(`react.optimistic_key`);function c(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:a,key:r==null?null:r===s?s:``+r,children:e,containerInfo:t,implementation:n}}var l=t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function d(e,t){if(e===`font`)return``;if(typeof t==`string`)return t===`use-credentials`?t:``}e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=i,e.browser=function(e){return{$$typeof:o,_reason:e}},e.createPortal=function(e,t){var r=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error(n(299));return c(e,t,null,r)},e.flushSync=function(e){var t=l.T,n=i.p;try{if(l.T=null,i.p=2,e)return e()}finally{l.T=t,i.p=n,i.d.f()}},e.preconnect=function(e,t){typeof e==`string`&&(t?(t=t.crossOrigin,t=typeof t==`string`?t===`use-credentials`?t:``:void 0):t=null,i.d.C(e,t))},e.prefetchDNS=function(e){typeof e==`string`&&i.d.D(e)},e.preinit=function(e,t){if(typeof e==`string`&&t&&typeof t.as==`string`){var n=t.as,r=d(n,t.crossOrigin),a=typeof t.integrity==`string`?t.integrity:void 0,o=typeof t.fetchPriority==`string`?t.fetchPriority:void 0;n===`style`?i.d.S(e,typeof t.precedence==`string`?t.precedence:void 0,{crossOrigin:r,integrity:a,fetchPriority:o}):n===`script`&&i.d.X(e,{crossOrigin:r,integrity:a,fetchPriority:o,nonce:typeof t.nonce==`string`?t.nonce:void 0})}},e.preinitModule=function(e,t){if(typeof e==`string`){if(typeof t==`object`&&t){if(t.as==null||t.as===`script`){var n=d(t.as,t.crossOrigin);i.d.M(e,{crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0,fetchPriority:typeof t.fetchPriority==`string`?t.fetchPriority:void 0})}}else t??i.d.M(e)}},e.preload=function(e,t){if(typeof e==`string`&&typeof t==`object`&&t&&typeof t.as==`string`){var n=t.as,r=d(n,t.crossOrigin);i.d.L(e,n,{crossOrigin:r,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0,type:typeof t.type==`string`?t.type:void 0,fetchPriority:typeof t.fetchPriority==`string`?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy==`string`?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet==`string`?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes==`string`?t.imageSizes:void 0,media:typeof t.media==`string`?t.media:void 0})}},e.preloadModule=function(e,t){if(typeof e==`string`){if(t){var n=d(t.as,t.crossOrigin);i.d.m(e,{as:typeof t.as==`string`&&t.as!==`script`?t.as:void 0,crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0,fetchPriority:typeof t.fetchPriority==`string`?t.fetchPriority:void 0})}else i.d.m(e)}},e.requestFormReset=function(e){i.d.r(e)},e.unstable_batchedUpdates=function(e,t){return e(t)},e.useFormState=function(e,t,n){return l.H.useFormState(e,t,n)},e.useFormStatus=function(){return l.H.useHostTransitionStatus()},e.version=`19.3.1`})),m=o(((e,t)=>{function n(){if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<`u`&&typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE==`function`)try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=p()})),h=o((e=>{var t=f(),n=u(),r=m();function i(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function a(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function o(e){for(var t=e,n=t;n&&!n.alternate;)t=n,t.flags&4098&&(e=t.return),n=t.return;for(;t.return;)t=t.return;return t.tag===3?e:null}function s(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function c(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function l(e){if(o(e)!==e)throw Error(i(188))}function d(e){var t=e.alternate;if(!t){if(t=o(e),t===null)throw Error(i(188));return t===e?e:null}for(var n=e,r=t;;){var a=n.return;if(a===null)break;var s=a.alternate;if(s===null){if(r=a.return,r!==null){n=r;continue}break}if(a.child===s.child){for(s=a.child;s;){if(s===n)return l(a),e;if(s===r)return l(a),t;s=s.sibling}throw Error(i(188))}if(n.return!==r.return)n=a,r=s;else{for(var c=!1,u=a.child;u;){if(u===n){c=!0,n=a,r=s;break}if(u===r){c=!0,r=a,n=s;break}u=u.sibling}if(!c){for(u=s.child;u;){if(u===n){c=!0,n=s,r=a;break}if(u===r){c=!0,r=s,n=a;break}u=u.sibling}if(!c)throw Error(i(189))}}if(n.alternate!==r)throw Error(i(190))}if(n.tag!==3)throw Error(i(188));return n.stateNode.current===n?e:t}function p(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=p(e),t!==null)return t;e=e.sibling}return null}function h(e,t,n,r,i,a){for(;e!==null;){if((e.tag===5||e.tag===27||e.tag===6)&&n(e,r,i,a)||(e.tag!==22||e.memoizedState===null)&&(t||e.tag!==5&&e.tag!==27)&&h(e.child,t,n,r,i,a))return!0;e=e.sibling}return!1}function g(e){for(e=e.return;e!==null;){if(e.tag===3||e.tag===5||e.tag===27)return e;e=e.return}return null}function _(e){var t=!1;for(e=e.return;e!==null&&(e.tag===4&&(t=!0),e.tag!==3&&e.tag!==5&&e.tag!==27);)e=e.return;return t}function v(e){var t=[null,null],n=g(e);return n===null||y(t,e,n.child,{foundSelf:!1}),t}function y(e,t,n,r){for(;n!==null;){if(n===t)r.foundSelf=!0;else if(n.tag===5||n.tag===27||n.tag===6){if(r.foundSelf)return e[1]=n,!0;e[0]=n}else if((n.tag!==22||n.memoizedState===null)&&y(e,t,n.child,r))return!0;n=n.sibling}return!1}function b(e){switch(e.tag){case 5:case 27:case 6:return e.stateNode;case 3:return e.stateNode.containerInfo;default:throw Error(i(559))}}var x=null,S=null;function C(e,t,n){return e===n||e===t&&(x=e,!0)}function ee(e,t,n){return e===n?(S=e,!1):e===t&&(S!==null&&(x=e),!0)}function w(e){if(e===null)return null;do e=e===null?null:e.return;while(e&&e.tag!==5&&e.tag!==27&&e.tag!==3);return e||null}function te(e,t,n){for(var r=0,i=e;i;i=n(i))r++;i=0;for(var a=t;a;a=n(a))i++;for(;0<r-i;)e=n(e),r--;for(;0<i-r;)t=n(t),i--;for(;r--;){if(e===t||t!==null&&e===t.alternate)return e;e=n(e),t=n(t)}return null}var T=Object.assign,ne=Symbol.for(`react.element`),re=Symbol.for(`react.transitional.element`),ie=Symbol.for(`react.portal`),E=Symbol.for(`react.fragment`),ae=Symbol.for(`react.strict_mode`),oe=Symbol.for(`react.profiler`),se=Symbol.for(`react.consumer`),ce=Symbol.for(`react.context`),D=Symbol.for(`react.forward_ref`),le=Symbol.for(`react.suspense`),ue=Symbol.for(`react.suspense_list`),de=Symbol.for(`react.memo`),fe=Symbol.for(`react.lazy`),pe=Symbol.for(`react.activity`),me=Symbol.for(`react.legacy_hidden`),he=Symbol.for(`react.memo_cache_sentinel`),ge=Symbol.for(`react.view_transition`),_e=Symbol.for(`react.recoverable`),O=Symbol.iterator;function ve(e){return typeof e!=`object`||!e?null:(e=O&&e[O]||e[`@@iterator`],typeof e==`function`?e:null)}var ye=Symbol.for(`react.client.reference`);function be(e){if(e==null)return null;if(typeof e==`function`)return e.$$typeof===ye?null:e.displayName||e.name||null;if(typeof e==`string`)return e;switch(e){case E:return`Fragment`;case oe:return`Profiler`;case ae:return`StrictMode`;case le:return`Suspense`;case ue:return`SuspenseList`;case pe:return`Activity`;case ge:return`ViewTransition`}if(typeof e==`object`)switch(e.$$typeof){case ie:return`Portal`;case ce:return e.displayName||`Context`;case se:return(e._context.displayName||`Context`)+`.Consumer`;case D:var t=e.render;return e=e.displayName,e||=(e=t.displayName||t.name||``,e===``?`ForwardRef`:`ForwardRef(`+e+`)`),e;case de:return t=e.displayName||null,t===null?be(e.type)||`Memo`:t;case fe:t=e._payload,e=e._init;try{return be(e(t))}catch{}}return null}var k=Array.isArray,A=n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,j=r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,xe={pending:!1,data:null,method:null,action:null},Se=[],Ce=-1;function M(e){return{current:e}}function N(e){0>Ce||(e.current=Se[Ce],Se[Ce]=null,Ce--)}function P(e,t){Ce++,Se[Ce]=e.current,e.current=t}var we=M(null),Te=M(null),Ee=M(null),F=M(null);function De(e,t){switch(P(Ee,t),P(Te,e),P(we,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?up(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=up(t),e=dp(t,e);else switch(e){case`svg`:e=1;break;case`math`:e=2;break;default:e=0}}N(we),P(we,e)}function Oe(){N(we),N(Te),N(Ee)}function ke(e){var t=e.memoizedState;t!==null&&(sh._currentValue=t.memoizedState,P(F,e)),t=we.current;var n=dp(t,e.type);t!==n&&(P(Te,e),P(we,n))}function Ae(e){Te.current===e&&(N(we),N(Te)),F.current===e&&(N(F),sh._currentValue=xe)}var je,Me;function Ne(e){if(je===void 0)try{throw Error()}catch(e){var t=e.stack.trim().match(/\n( *(at )?)/);je=t&&t[1]||``,Me=-1<e.stack.indexOf(`
    at`)?` (<anonymous>)`:-1<e.stack.indexOf(`@`)?`@unknown:0:0`:``}return`
`+je+e+Me}var Pe=!1;function Fe(e,t){if(!e||Pe)return``;Pe=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var r={DetermineComponentFrameRoot:function(){try{if(t){var n=function(){throw Error()};if(Object.defineProperty(n.prototype,"props",{set:function(){throw Error()}}),typeof Reflect==`object`&&Reflect.construct){try{Reflect.construct(n,[])}catch(e){var r=e}Reflect.construct(e,[],n)}else{try{n.call()}catch(e){r=e}n=!1;try{var i=Object.getOwnPropertyDescriptor(e.prototype,`props`);Object.defineProperty(e.prototype,"props",{configurable:!0,set:function(){throw Error()}}),n=!0,new e}finally{n&&(i===void 0?delete e.prototype.props:Object.defineProperty(e.prototype,"props",i))}}}else{try{throw Error()}catch(e){r=e}(n=e())&&typeof n.catch==`function`&&n.catch(function(){})}}catch(e){if(e&&r&&typeof e.stack==`string`)return[e.stack,r.stack]}return[null,null]}};r.DetermineComponentFrameRoot.displayName=`DetermineComponentFrameRoot`;var i=Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot,`name`);i&&i.configurable&&Object.defineProperty(r.DetermineComponentFrameRoot,"name",{value:`DetermineComponentFrameRoot`});var a=r.DetermineComponentFrameRoot(),o=a[0],s=a[1];if(o&&s){var c=o.split(`
`),l=s.split(`
`);for(i=r=0;r<c.length&&!c[r].includes(`DetermineComponentFrameRoot`);)r++;for(;i<l.length&&!l[i].includes(`DetermineComponentFrameRoot`);)i++;if(r===c.length||i===l.length)for(r=c.length-1,i=l.length-1;1<=r&&0<=i&&c[r]!==l[i];)i--;for(;1<=r&&0<=i;r--,i--)if(c[r]!==l[i]){if(r!==1||i!==1)do if(r--,i--,0>i||c[r]!==l[i]){var u=`
`+c[r].replace(` at new `,` at `);return e.displayName&&u.includes(`<anonymous>`)&&(u=u.replace(`<anonymous>`,e.displayName)),u}while(1<=r&&0<=i);break}}}finally{Pe=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:``)?Ne(n):``}function Ie(e,t){switch(e.tag){case 26:case 27:case 5:return Ne(e.type);case 16:return Ne(`Lazy`);case 13:return e.child!==t&&t!==null?Ne(`Suspense Fallback`):Ne(`Suspense`);case 19:return Ne(`SuspenseList`);case 0:case 15:return Fe(e.type,!1);case 11:return Fe(e.type.render,!1);case 1:return Fe(e.type,!0);case 31:return Ne(`Activity`);case 30:return Ne(`ViewTransition`);default:return``}}function Le(e){try{var t=``,n=null;do t+=Ie(e,n),n=e,e=e.return;while(e);return t}catch(e){return`
Error generating stack: `+e.message+`
`+e.stack}}var Re=Object.prototype.hasOwnProperty,ze=t.unstable_scheduleCallback,Be=t.unstable_cancelCallback,Ve=t.unstable_shouldYield,He=t.unstable_requestPaint,Ue=t.unstable_now,We=t.unstable_getCurrentPriorityLevel,Ge=t.unstable_ImmediatePriority,Ke=t.unstable_UserBlockingPriority,qe=t.unstable_NormalPriority,Je=t.unstable_LowPriority,Ye=t.unstable_IdlePriority,Xe=t.log,Ze=t.unstable_setDisableYieldValue,Qe=null,$e=null;function et(e){if(typeof Xe==`function`&&Ze(e),$e&&typeof $e.setStrictMode==`function`)try{$e.setStrictMode(Qe,e)}catch{}}var tt=Math.clz32?Math.clz32:it,nt=Math.log,rt=Math.LN2;function it(e){return e>>>=0,e===0?32:31-(nt(e)/rt|0)|0}var I=256,at=262144,ot=4194304;function st(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&-e;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function ct(e,t,n){var r=e.pendingLanes;if(r===0)return 0;var i=0,a=e.suspendedLanes,o=e.pingedLanes;e=e.warmLanes;var s=r&134217727;return s===0?(s=r&~a,s===0?o===0?n||(n=r&~e,n!==0&&(i=st(n))):i=st(o):i=st(s)):(r=s&~a,r===0?(o&=s,o===0?n||(n=s&~e,n!==0&&(i=st(n))):i=st(o)):i=st(r)),i===0?0:t!==0&&t!==i&&(t&a)===0&&(a=i&-i,n=t&-t,a>=n||a===32&&n&4194048)?t:i}function lt(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function L(e,t){t&8&&(t|=t&32);var n=e.entangledLanes;if(n!==0)for(e=e.entanglements,n&=t;0<n;){var r=31-tt(n),i=1<<r;t|=e[r],n&=~i}return t}function ut(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function dt(){var e=ot;return ot<<=1,!(ot&62914560)&&(ot=4194304),e}function ft(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function pt(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function mt(e,t,n,r,i,a){var o=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var s=e.entanglements,c=e.expirationTimes,l=e.hiddenUpdates;for(n=o&~n;0<n;){var u=31-tt(n),d=1<<u;s[u]=0,c[u]=-1;var f=l[u];if(f!==null)for(l[u]=null,u=0;u<f.length;u++){var p=f[u];p!==null&&(p.lane&=-536870913)}n&=~d}r!==0&&ht(e,r,0),a!==0&&i===0&&e.tag!==0&&(e.suspendedLanes|=a&~(o&~t))}function ht(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var r=31-tt(t);e.entangledLanes|=t,e.entanglements[r]=e.entanglements[r]|1073741824|n&261930}function R(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-tt(n),i=1<<r;i&t|e[r]&t&&(e[r]|=t),n&=~i}}function gt(e,t){var n=t&-t;return n=n&42?1:_t(n),(n&(e.suspendedLanes|t))===0?n:0}function _t(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function vt(e){return e&=-e,2<e?8<e?e&134217727?32:268435456:8:2}function yt(){var e=j.p;return e===0?(e=window.event,e===void 0?32:Ch(e.type)):e}function bt(e,t){var n=j.p;try{return j.p=e,t()}finally{j.p=n}}var xt=Math.random().toString(36).slice(2),St=`__reactFiber$`+xt,Ct=`__reactProps$`+xt,wt=`__reactContainer$`+xt,Tt=`__reactEvents$`+xt,Et=`__reactListeners$`+xt,Dt=`__reactHandles$`+xt,Ot=`__reactResources$`+xt,kt=`__reactMarker$`+xt,At=`__reactLoad$`+xt;function jt(e){delete e[St],delete e[Ct],delete e[Et],delete e[Dt]}function Mt(e){var t;if(t=e[St])return t;for(var n=e.parentNode;n;){if(t=n[wt]||n[St]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=fm(e);e!==null;){if(n=e[St])return n;e=fm(e)}return t}e=n,n=e.parentNode}return null}function Nt(e){if(e=e[St]||e[wt]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function Pt(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(i(33))}function z(e){var t=e[Ot];return t||=e[Ot]={hoistableStyles:new Map,hoistableScripts:new Map},t}function Ft(e){e[kt]=!0}function It(e){e[At]=void 0}var Lt=new Set,Rt={};function zt(e,t){Bt(e,t),Bt(e+`Capture`,t)}function Bt(e,t){for(Rt[e]=t,e=0;e<t.length;e++)Lt.add(t[e])}var Vt=RegExp(`^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$`),Ht={},Ut={};function Wt(e){return Re.call(Ut,e)?!0:Re.call(Ht,e)?!1:Vt.test(e)?Ut[e]=!0:(Ht[e]=!0,!1)}var B=!1;function Gt(){var e=B;return B=!1,e}function Kt(e,t,n){if(Wt(t)){if(n===null)e.removeAttribute(t);else{switch(typeof n){case`undefined`:case`function`:case`symbol`:e.removeAttribute(t);return;case`boolean`:var r=t.toLowerCase().slice(0,5);if(r!==`data-`&&r!==`aria-`){e.removeAttribute(t);return}}e.setAttribute(t,n)}}}function qt(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case`undefined`:case`function`:case`symbol`:case`boolean`:e.removeAttribute(t);return}e.setAttribute(t,n)}}function Jt(e,t,n,r){if(r===null)e.removeAttribute(n);else{switch(typeof r){case`undefined`:case`function`:case`symbol`:case`boolean`:e.removeAttribute(n);return}e.setAttributeNS(t,n,r)}}function Yt(e){switch(typeof e){case`bigint`:case`boolean`:case`number`:case`string`:case`undefined`:return e;case`object`:return e;default:return``}}function Xt(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()===`input`&&(t===`checkbox`||t===`radio`)}function Zt(e,t,n){var r=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&r!==void 0&&typeof r.get==`function`&&typeof r.set==`function`){var i=r.get,a=r.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return i.call(this)},set:function(e){n=``+e,a.call(this,e)}}),Object.defineProperty(e,t,{enumerable:r.enumerable}),{getValue:function(){return n},setValue:function(e){n=``+e},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Qt(e){if(!e._valueTracker){var t=Xt(e)?`checked`:`value`;e._valueTracker=Zt(e,t,``+e[t])}}function $t(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r=``;return e&&(r=Xt(e)?e.checked?`true`:`false`:e.value),e=r,e!==n&&(t.setValue(e),!0)}var en=/[\n"\\]/g;function tn(e){return e.replace(en,function(e){return`\\`+e.charCodeAt(0).toString(16)+` `})}function nn(e,t,n,r,i,a,o,s){e.name=``,o!=null&&typeof o!=`function`&&typeof o!=`symbol`&&typeof o!=`boolean`?e.type=o:e.removeAttribute(`type`),t==null?o!==`submit`&&o!==`reset`||e.removeAttribute(`value`):o===`number`?(t===0&&e.value===``||e.value!=t)&&(e.value=``+Yt(t)):e.value!==``+Yt(t)&&(e.value=``+Yt(t)),t==null?n==null?r!=null&&e.removeAttribute(`value`):an(e,Yt(n)):o===`number`&&e.value==t?an(e,Yt(e.value)):an(e,Yt(t)),i==null&&a!=null&&(e.defaultChecked=!!a),i!=null&&(e.checked=i&&typeof i!=`function`&&typeof i!=`symbol`),s!=null&&typeof s!=`function`&&typeof s!=`symbol`&&typeof s!=`boolean`?e.name=``+Yt(s):e.removeAttribute(`name`)}function rn(e,t,n,r,i,a,o,s){if(a!=null&&typeof a!=`function`&&typeof a!=`symbol`&&typeof a!=`boolean`&&(e.type=a),t!=null||n!=null){if(!(a!==`submit`&&a!==`reset`||t!=null)){Qt(e);return}n=n==null?``:``+Yt(n),t=t==null?n:``+Yt(t),s||t===e.value||(e.value=t),e.defaultValue=t}r??=i,r=typeof r!=`function`&&typeof r!=`symbol`&&!!r,e.checked=s?e.checked:!!r,e.defaultChecked=!!r,o!=null&&typeof o!=`function`&&typeof o!=`symbol`&&typeof o!=`boolean`&&(e.name=o),Qt(e)}function an(e,t){e.defaultValue!==``+t&&(e.defaultValue=``+t)}function on(e,t,n,r){if(e=e.options,t){t={};for(var i=0;i<n.length;i++)t[`$`+n[i]]=!0;for(n=0;n<e.length;n++)i=t.hasOwnProperty(`$`+e[n].value),e[n].selected!==i&&(e[n].selected=i),i&&r&&(e[n].defaultSelected=!0)}else{for(n=``+Yt(n),t=null,i=0;i<e.length;i++){if(e[i].value===n){e[i].selected=!0,r&&(e[i].defaultSelected=!0);return}t!==null||e[i].disabled||(t=e[i])}t!==null&&(t.selected=!0)}}function sn(e,t,n){t!=null&&(t=``+Yt(t),t!==e.value&&(e.value=t),n==null)?e.defaultValue!==t&&(e.defaultValue=t):e.defaultValue=n==null?``:``+Yt(n)}function cn(e,t,n,r){if(t==null){if(r!=null){if(n!=null)throw Error(i(92));if(k(r)){if(1<r.length)throw Error(i(93));r=r[0]}n=r}n??=``,t=n}n=Yt(t),e.defaultValue=n,r=e.textContent,r===n&&r!==``&&r!==null&&(e.value=r),Qt(e)}function ln(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var un=new Set(`animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp`.split(` `));function dn(e,t,n){var r=t.indexOf(`--`)===0;n==null||typeof n==`boolean`||n===``?r?e.setProperty(t,``):t===`float`?e.cssFloat=``:e[t]=``:r?e.setProperty(t,n):typeof n!=`number`||n===0||un.has(t)?t===`float`?e.cssFloat=n:e[t]=(``+n).trim():e[t]=n+`px`}function fn(e,t,n){if(t!=null&&typeof t!=`object`)throw Error(i(62));if(e=e.style,n!=null){for(var r in n)!n.hasOwnProperty(r)||t!=null&&t.hasOwnProperty(r)||(r.indexOf(`--`)===0?e.setProperty(r,``):r===`float`?e.cssFloat=``:e[r]=``,B=!0);for(var a in t)r=t[a],t.hasOwnProperty(a)&&n[a]!==r&&(dn(e,a,r),B=!0)}else for(var o in t)t.hasOwnProperty(o)&&dn(e,o,t[o])}function pn(e){if(e.indexOf(`-`)===-1)return!1;switch(e){case`annotation-xml`:case`color-profile`:case`font-face`:case`font-face-src`:case`font-face-uri`:case`font-face-format`:case`font-face-name`:case`missing-glyph`:return!1;default:return!0}}var mn=new Map([[`acceptCharset`,`accept-charset`],[`htmlFor`,`for`],[`httpEquiv`,`http-equiv`],[`crossOrigin`,`crossorigin`],[`accentHeight`,`accent-height`],[`alignmentBaseline`,`alignment-baseline`],[`arabicForm`,`arabic-form`],[`baselineShift`,`baseline-shift`],[`capHeight`,`cap-height`],[`clipPath`,`clip-path`],[`clipRule`,`clip-rule`],[`colorInterpolation`,`color-interpolation`],[`colorInterpolationFilters`,`color-interpolation-filters`],[`colorProfile`,`color-profile`],[`colorRendering`,`color-rendering`],[`dominantBaseline`,`dominant-baseline`],[`enableBackground`,`enable-background`],[`fillOpacity`,`fill-opacity`],[`fillRule`,`fill-rule`],[`floodColor`,`flood-color`],[`floodOpacity`,`flood-opacity`],[`fontFamily`,`font-family`],[`fontSize`,`font-size`],[`fontSizeAdjust`,`font-size-adjust`],[`fontStretch`,`font-stretch`],[`fontStyle`,`font-style`],[`fontVariant`,`font-variant`],[`fontWeight`,`font-weight`],[`glyphName`,`glyph-name`],[`glyphOrientationHorizontal`,`glyph-orientation-horizontal`],[`glyphOrientationVertical`,`glyph-orientation-vertical`],[`horizAdvX`,`horiz-adv-x`],[`horizOriginX`,`horiz-origin-x`],[`imageRendering`,`image-rendering`],[`letterSpacing`,`letter-spacing`],[`lightingColor`,`lighting-color`],[`markerEnd`,`marker-end`],[`markerMid`,`marker-mid`],[`markerStart`,`marker-start`],[`maskType`,`mask-type`],[`overlinePosition`,`overline-position`],[`overlineThickness`,`overline-thickness`],[`paintOrder`,`paint-order`],[`panose-1`,`panose-1`],[`pointerEvents`,`pointer-events`],[`renderingIntent`,`rendering-intent`],[`shapeRendering`,`shape-rendering`],[`stopColor`,`stop-color`],[`stopOpacity`,`stop-opacity`],[`strikethroughPosition`,`strikethrough-position`],[`strikethroughThickness`,`strikethrough-thickness`],[`strokeDasharray`,`stroke-dasharray`],[`strokeDashoffset`,`stroke-dashoffset`],[`strokeLinecap`,`stroke-linecap`],[`strokeLinejoin`,`stroke-linejoin`],[`strokeMiterlimit`,`stroke-miterlimit`],[`strokeOpacity`,`stroke-opacity`],[`strokeWidth`,`stroke-width`],[`textAnchor`,`text-anchor`],[`textDecoration`,`text-decoration`],[`textRendering`,`text-rendering`],[`transformOrigin`,`transform-origin`],[`underlinePosition`,`underline-position`],[`underlineThickness`,`underline-thickness`],[`unicodeBidi`,`unicode-bidi`],[`unicodeRange`,`unicode-range`],[`unitsPerEm`,`units-per-em`],[`vAlphabetic`,`v-alphabetic`],[`vHanging`,`v-hanging`],[`vIdeographic`,`v-ideographic`],[`vMathematical`,`v-mathematical`],[`vectorEffect`,`vector-effect`],[`vertAdvY`,`vert-adv-y`],[`vertOriginX`,`vert-origin-x`],[`vertOriginY`,`vert-origin-y`],[`wordSpacing`,`word-spacing`],[`writingMode`,`writing-mode`],[`xmlnsXlink`,`xmlns:xlink`],[`xHeight`,`x-height`]]),hn=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function gn(e){return hn.test(``+e)?`javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')`:e}function _n(){}var vn=null;function yn(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var bn=null,xn=null;function Sn(e){var t=Nt(e);if(t&&(e=t.stateNode)){var n=e[Ct]||null;a:switch(e=t.stateNode,t.type){case`input`:if(nn(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type===`radio`&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll(`input[name="`+tn(``+t)+`"][type="radio"]`),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var a=r[Ct]||null;if(!a)throw Error(i(90));nn(r,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name)}}for(t=0;t<n.length;t++)r=n[t],r.form===e.form&&$t(r)}break a;case`textarea`:sn(e,n.value,n.defaultValue);break a;case`select`:t=n.value,t!=null&&on(e,!!n.multiple,t,!1)}}}var Cn=!1;function wn(e,t,n){if(Cn)return e(t,n);Cn=!0;try{return e(t)}finally{if(Cn=!1,(bn!==null||xn!==null)&&(zd(),bn&&(t=bn,e=xn,xn=bn=null,Sn(t),e)))for(t=0;t<e.length;t++)Sn(e[t])}}function Tn(e,t){var n=e.stateNode;if(n===null)return null;var r=n[Ct]||null;if(r===null)return null;n=r[t];a:switch(t){case`onClick`:case`onClickCapture`:case`onDoubleClick`:case`onDoubleClickCapture`:case`onMouseDown`:case`onMouseDownCapture`:case`onMouseMove`:case`onMouseMoveCapture`:case`onMouseUp`:case`onMouseUpCapture`:case`onMouseEnter`:(r=!r.disabled)||(e=e.type,r=e!==`button`&&e!==`input`&&e!==`select`&&e!==`textarea`),e=!r;break a;default:e=!1}if(e)return null;if(n&&typeof n!=`function`)throw Error(i(231,t,typeof n));return n}var En=typeof window<`u`&&window.document!==void 0&&window.document.createElement!==void 0,Dn=!1;if(En)try{var On={};Object.defineProperty(On,"passive",{get:function(){Dn=!0}}),window.addEventListener(`test`,On,On),window.removeEventListener(`test`,On,On)}catch{Dn=!1}var kn=null,An=null,jn=null;function Mn(){if(jn)return jn;var e,t=An,n=t.length,r,i=`value`in kn?kn.value:kn.textContent,a=i.length;for(e=0;e<n&&t[e]===i[e];e++);var o=n-e;for(r=1;r<=o&&t[n-r]===i[a-r];r++);return jn=i.slice(e,1<r?1-r:void 0)}function Nn(e){var t=e.keyCode;return`charCode`in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Pn(){return!0}function Fn(){return!1}function In(e){function t(t,n,r,i,a){for(var o in this._reactName=t,this._targetInst=r,this.type=n,this.nativeEvent=i,this.target=a,this.currentTarget=null,e)e.hasOwnProperty(o)&&(t=e[o],this[o]=t?t(i):i[o]);return this.isDefaultPrevented=(i.defaultPrevented==null?!1===i.returnValue:i.defaultPrevented)?Pn:Fn,this.isPropagationStopped=Fn,this}return T(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e&&(e.preventDefault?e.preventDefault():typeof e.returnValue!=`unknown`&&(e.returnValue=!1),this.isDefaultPrevented=Pn)},stopPropagation:function(){var e=this.nativeEvent;e&&(e.stopPropagation?e.stopPropagation():typeof e.cancelBubble!=`unknown`&&(e.cancelBubble=!0),this.isPropagationStopped=Pn)},persist:function(){},isPersistent:Pn}),t}var Ln={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Rn=In(Ln),zn=T({},Ln,{view:0,detail:0}),Bn=In(zn),Vn,Hn,Un,Wn=T({},zn,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:tr,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return`movementX`in e?e.movementX:(e!==Un&&(Un&&e.type===`mousemove`?(Vn=e.screenX-Un.screenX,Hn=e.screenY-Un.screenY):Hn=Vn=0,Un=e),Vn)},movementY:function(e){return`movementY`in e?e.movementY:Hn}}),Gn=In(Wn),Kn=In(T({},Wn,{dataTransfer:0})),qn=In(T({},zn,{relatedTarget:0})),Jn=In(T({},Ln,{animationName:0,elapsedTime:0,pseudoElement:0})),Yn=In(T({},Ln,{clipboardData:function(e){return`clipboardData`in e?e.clipboardData:window.clipboardData}})),Xn=In(T({},Ln,{data:0})),Zn={Esc:`Escape`,Spacebar:` `,Left:`ArrowLeft`,Up:`ArrowUp`,Right:`ArrowRight`,Down:`ArrowDown`,Del:`Delete`,Win:`OS`,Menu:`ContextMenu`,Apps:`ContextMenu`,Scroll:`ScrollLock`,MozPrintableKey:`Unidentified`},Qn={8:`Backspace`,9:`Tab`,12:`Clear`,13:`Enter`,16:`Shift`,17:`Control`,18:`Alt`,19:`Pause`,20:`CapsLock`,27:`Escape`,32:` `,33:`PageUp`,34:`PageDown`,35:`End`,36:`Home`,37:`ArrowLeft`,38:`ArrowUp`,39:`ArrowRight`,40:`ArrowDown`,45:`Insert`,46:`Delete`,112:`F1`,113:`F2`,114:`F3`,115:`F4`,116:`F5`,117:`F6`,118:`F7`,119:`F8`,120:`F9`,121:`F10`,122:`F11`,123:`F12`,144:`NumLock`,145:`ScrollLock`,224:`Meta`},$n={Alt:`altKey`,Control:`ctrlKey`,Meta:`metaKey`,Shift:`shiftKey`};function er(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=$n[e])?!!t[e]:!1}function tr(){return er}var nr=In(T({},zn,{key:function(e){if(e.key){var t=Zn[e.key]||e.key;if(t!==`Unidentified`)return t}return e.type===`keypress`?(e=Nn(e),e===13?`Enter`:String.fromCharCode(e)):e.type===`keydown`||e.type===`keyup`?Qn[e.keyCode]||`Unidentified`:``},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:tr,charCode:function(e){return e.type===`keypress`?Nn(e):0},keyCode:function(e){return e.type===`keydown`||e.type===`keyup`?e.keyCode:0},which:function(e){return e.type===`keypress`?Nn(e):e.type===`keydown`||e.type===`keyup`?e.keyCode:0}})),rr=In(T({},Wn,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0})),ir=In(T({},Ln,{submitter:0})),ar=In(T({},zn,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:tr})),or=In(T({},Ln,{propertyName:0,elapsedTime:0,pseudoElement:0})),sr=In(T({},Wn,{deltaX:function(e){return`deltaX`in e?e.deltaX:`wheelDeltaX`in e?-e.wheelDeltaX:0},deltaY:function(e){return`deltaY`in e?e.deltaY:`wheelDeltaY`in e?-e.wheelDeltaY:`wheelDelta`in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0})),cr=In(T({},Ln,{newState:0,oldState:0,source:0})),lr=[9,13,27,32],ur=En&&`CompositionEvent`in window,dr=null;En&&`documentMode`in document&&(dr=document.documentMode);var fr=En&&`TextEvent`in window&&!dr,pr=En&&(!ur||dr&&8<dr&&11>=dr),mr=` `,hr=!1;function gr(e,t){switch(e){case`keyup`:return lr.indexOf(t.keyCode)!==-1;case`keydown`:return t.keyCode!==229;case`keypress`:case`mousedown`:case`focusout`:return!0;default:return!1}}function _r(e){return e=e.detail,typeof e==`object`&&`data`in e?e.data:null}var vr=!1;function yr(e,t){switch(e){case`compositionend`:return _r(t);case`keypress`:return t.which===32?(hr=!0,mr):null;case`textInput`:return e=t.data,e===mr&&hr?null:e;default:return null}}function br(e,t){if(vr)return e===`compositionend`||!ur&&gr(e,t)?(e=Mn(),jn=An=kn=null,vr=!1,e):null;switch(e){case`paste`:return null;case`keypress`:if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case`compositionend`:return pr&&t.locale!==`ko`?null:t.data;default:return null}}var xr={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Sr(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t===`input`?!!xr[e.type]:t===`textarea`}function Cr(e,t,n,r){bn?xn?xn.push(r):xn=[r]:bn=r,t=Jf(t,`onChange`),0<t.length&&(n=new Rn(`onChange`,`change`,null,n,r),e.push({event:n,listeners:t}))}var wr=null,Tr=null;function Er(e){Vf(e,0)}function Dr(e){if($t(Pt(e)))return e}function Or(e,t){if(e===`change`)return t}var kr=!1;if(En){var Ar;if(En){var jr=`oninput`in document;if(!jr){var Mr=document.createElement(`div`);Mr.setAttribute(`oninput`,`return;`),jr=typeof Mr.oninput==`function`}Ar=jr}else Ar=!1;kr=Ar&&(!document.documentMode||9<document.documentMode)}function Nr(){wr&&(wr.detachEvent(`onpropertychange`,Pr),Tr=wr=null)}function Pr(e){if(e.propertyName===`value`&&Dr(Tr)){var t=[];Cr(t,Tr,e,yn(e)),wn(Er,t)}}function Fr(e,t,n){e===`focusin`?(Nr(),wr=t,Tr=n,wr.attachEvent(`onpropertychange`,Pr)):e===`focusout`&&Nr()}function Ir(e){if(e===`selectionchange`||e===`keyup`||e===`keydown`)return Dr(Tr)}function Lr(e,t){if(e===`click`)return Dr(t)}function Rr(e,t){if(e===`input`||e===`change`)return Dr(t)}function zr(e,t){return e===t&&(e!==0||1/e==1/t)||e!==e&&t!==t}var Br=typeof Object.is==`function`?Object.is:zr;function Vr(e,t){if(Br(e,t))return!0;if(typeof e!=`object`||!e||typeof t!=`object`||!t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var i=n[r];if(!Re.call(t,i)||!Br(e[i],t[i]))return!1}return!0}function Hr(e){if(e||=typeof document<`u`?document:void 0,e===void 0)return null;try{return e.activeElement||e.body}catch{return e.body}}function Ur(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Wr(e,t){var n=Ur(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}a:{for(;n;){if(n.nextSibling){n=n.nextSibling;break a}n=n.parentNode}n=void 0}n=Ur(n)}}function Gr(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Gr(e,t.parentNode):`contains`in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Kr(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=Hr(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href==`string`}catch{n=!1}if(n)e=t.contentWindow;else break;t=Hr(e.document)}return t}function qr(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t===`input`&&(e.type===`text`||e.type===`search`||e.type===`tel`||e.type===`url`||e.type===`password`)||t===`textarea`||e.contentEditable===`true`)}var Jr=En&&`documentMode`in document&&11>=document.documentMode,Yr=null,Xr=null,Zr=null,Qr=!1;function $r(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Qr||Yr==null||Yr!==Hr(r)||(r=Yr,`selectionStart`in r&&qr(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Zr&&Vr(Zr,r)||(Zr=r,r=Jf(Xr,`onSelect`),0<r.length&&(t=new Rn(`onSelect`,`select`,null,t,n),e.push({event:t,listeners:r}),t.target=Yr)))}function ei(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n[`Webkit`+e]=`webkit`+t,n[`Moz`+e]=`moz`+t,n}var ti={animationend:ei(`Animation`,`AnimationEnd`),animationiteration:ei(`Animation`,`AnimationIteration`),animationstart:ei(`Animation`,`AnimationStart`),transitionrun:ei(`Transition`,`TransitionRun`),transitionstart:ei(`Transition`,`TransitionStart`),transitioncancel:ei(`Transition`,`TransitionCancel`),transitionend:ei(`Transition`,`TransitionEnd`)},ni={},ri={};En&&(ri=document.createElement(`div`).style,`AnimationEvent`in window||(delete ti.animationend.animation,delete ti.animationiteration.animation,delete ti.animationstart.animation),`TransitionEvent`in window||delete ti.transitionend.transition);function ii(e){if(ni[e])return ni[e];if(!ti[e])return e;var t=ti[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in ri)return ni[e]=t[n];return e}var ai=ii(`animationend`),oi=ii(`animationiteration`),si=ii(`animationstart`),ci=ii(`transitionrun`),li=ii(`transitionstart`),ui=ii(`transitioncancel`),di=ii(`transitionend`),fi=new Map,pi=`abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel`.split(` `);pi.push(`scrollEnd`);function mi(e,t){fi.set(e,t),zt(t,[e])}var hi=0;function gi(e,t){if(e.name!=null&&e.name!==`auto`)return e.name;if(t.autoName!==null)return t.autoName;e=bd.identifierPrefix;var n=hi++;return e=`_`+e+`t_`+n.toString(32)+`_`,t.autoName=e}function _i(e){if(e==null||typeof e==`string`)return e;var t=null,n=Od;if(n!==null)for(var r=0;r<n.length;r++){var i=e[n[r]];if(i!=null){if(i===`none`)return`none`;t=t==null?i:t+(` `+i)}}return t??e.default}function vi(e,t){return e=_i(e),t=_i(t),t==null?e===`auto`?null:e:t===`auto`?null:t}var yi=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)},bi=[],xi=0,Si=0;function Ci(){for(var e=xi,t=Si=xi=0;t<e;){var n=bi[t];bi[t++]=null;var r=bi[t];bi[t++]=null;var i=bi[t];bi[t++]=null;var a=bi[t];if(bi[t++]=null,r!==null&&i!==null){var o=r.pending;o===null?i.next=i:(i.next=o.next,o.next=i),r.pending=i}a!==0&&Di(n,i,a)}}function wi(e,t,n,r){bi[xi++]=e,bi[xi++]=t,bi[xi++]=n,bi[xi++]=r,Si|=r,e.lanes|=r,e=e.alternate,e!==null&&(e.lanes|=r)}function Ti(e,t,n,r){return wi(e,t,n,r),Oi(e)}function Ei(e,t){return wi(e,null,null,t),Oi(e)}function Di(e,t,n){e.lanes|=n;var r=e.alternate;r!==null&&(r.lanes|=n);for(var i=!1,a=e.return;a!==null;)a.childLanes|=n,r=a.alternate,r!==null&&(r.childLanes|=n),a.tag===22&&(e=a.stateNode,e===null||e._visibility&1||(i=!0)),e=a,a=a.return;return e.tag===3?(a=e.stateNode,i&&t!==null&&(i=31-tt(n),e=a.hiddenUpdates,r=e[i],r===null?e[i]=[t]:r.push(t),t.lane=n|536870912),a):null}function Oi(e){if(50<kd)throw kd=0,Ad=null,Error(i(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var ki={};function Ai(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function ji(e,t,n,r){return new Ai(e,t,n,r)}function Mi(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Ni(e,t){var n=e.alternate;return n===null?(n=ji(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&1206910976,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function Pi(e,t){e.flags&=1206910978;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function Fi(e,t,n,r,a,o){var s=0;if(r=e,typeof r==`function`)Mi(r)&&(s=1);else if(typeof r==`string`)s=qm(e,n,we.current)?26:e===`html`||e===`head`||e===`body`?27:5;else a:switch(r){case pe:return e=ji(31,n,t,a),e.elementType=pe,e.lanes=o,e;case E:return Ii(n.children,a,o,t);case ae:s=8,a|=24;break;case oe:return e=ji(12,n,t,a|2),e.elementType=oe,e.lanes=o,e;case le:return e=ji(13,n,t,a),e.elementType=le,e.lanes=o,e;case ue:return e=ji(19,n,t,a),e.elementType=ue,e.lanes=o,e;case me:case ge:return e=a|32,e=ji(30,n,t,e),e.elementType=ge,e.lanes=o,e.stateNode={autoName:null,paired:null,clones:null,ref:null},e;default:if(typeof r==`object`&&r)switch(r.$$typeof){case ce:s=10;break a;case se:s=9;break a;case D:s=11;break a;case de:s=14;break a;case fe:s=16,r=null;break a}s=29,n=Error(i(130,e===null?`null`:typeof e,``)),r=null}return t=ji(s,n,t,a),t.elementType=e,t.type=r,t.lanes=o,t}function Ii(e,t,n,r){return e=ji(7,e,r,t),e.lanes=n,e}function Li(e,t,n){return e=ji(6,e,null,t),e.lanes=n,e}function Ri(e){var t=ji(18,null,null,0);return t.stateNode=e,t}function zi(e,t,n){return t=ji(4,e.children===null?[]:e.children,e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var Bi=new WeakMap;function Vi(e,t){if(typeof e==`object`&&e){var n=Bi.get(e);return n===void 0?(t={value:e,source:t,stack:Le(t)},Bi.set(e,t),t):n}return{value:e,source:t,stack:Le(t)}}var Hi=[],Ui=0,Wi=null,Gi=0,Ki=[],qi=0,Ji=null,Yi=1,Xi=``;function Zi(e,t){Hi[Ui++]=Gi,Hi[Ui++]=Wi,Wi=e,Gi=t}function Qi(e,t,n){Ki[qi++]=Yi,Ki[qi++]=Xi,Ki[qi++]=Ji,Ji=e;var r=Yi;e=Xi;var i=32-tt(r)-1;r&=~(1<<i),n+=1;var a=32-tt(t)+i;if(30<a){var o=i-i%5;a=(r&(1<<o)-1).toString(32),r>>=o,i-=o,Yi=1<<32-tt(t)+i|n<<i|r,Xi=a+e}else Yi=1<<a|n<<i|r,Xi=e}function $i(e){e.return!==null&&(Zi(e,1),Qi(e,1,0))}function ea(e){for(;e===Wi;)Wi=Hi[--Ui],Hi[Ui]=null,Gi=Hi[--Ui],Hi[Ui]=null;for(;e===Ji;)Ji=Ki[--qi],Ki[qi]=null,Xi=Ki[--qi],Ki[qi]=null,Yi=Ki[--qi],Ki[qi]=null}function ta(e,t){Ki[qi++]=Yi,Ki[qi++]=Xi,Ki[qi++]=Ji,Yi=t.id,Xi=t.overflow,Ji=e}var na=null,V=null,H=!1,ra=null,ia=!1,aa=Error(i(519));function oa(e){throw fa(Vi(Error(i(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?`text`:`HTML`,``)),e)),aa}function sa(e){var t=e.stateNode,n=e.type,r=e.memoizedProps;switch(t[St]=e,t[Ct]=r,n){case`dialog`:Q(`cancel`,t),Q(`close`,t);break;case`iframe`:case`object`:case`embed`:Q(`load`,t);break;case`video`:case`audio`:for(n=0;n<zf.length;n++)Q(zf[n],t);break;case`source`:Q(`error`,t);break;case`img`:case`image`:case`link`:Q(`error`,t),Q(`load`,t);break;case`details`:Q(`toggle`,t);break;case`input`:Q(`invalid`,t),rn(t,r.value,r.defaultValue,r.checked,r.defaultChecked,r.type,r.name,!0);break;case`select`:Q(`invalid`,t);break;case`textarea`:Q(`invalid`,t),cn(t,r.value,r.defaultValue,r.children)}n=r.children,typeof n!=`string`&&typeof n!=`number`&&typeof n!=`bigint`||t.textContent===``+n||!0===r.suppressHydrationWarning||ep(t.textContent,n)?(r.popover!=null&&(Q(`beforetoggle`,t),Q(`toggle`,t)),r.onScroll!=null&&Q(`scroll`,t),r.onScrollEnd!=null&&Q(`scrollend`,t),r.onClick!=null&&(t.onclick=_n),t=!0):t=!1,t||oa(e,!0)}function ca(e){for(na=e.return;na;)switch(na.tag){case 5:case 31:case 13:ia=!1;return;case 27:case 3:ia=!0;return;default:na=na.return}}function la(e){if(e!==na)return!1;if(!H)return ca(e),H=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=n===`form`||n===`button`||pp(e.type,e.memoizedProps)),n=!n),n&&V&&oa(e),ca(e),t===13){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(317));V=dm(e)}else if(t===31){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(317));V=dm(e)}else t===27?(t=V,Sp(e.type)?(e=um,um=null,V=e):V=t):V=na?lm(e.stateNode.nextSibling):null;return!0}function ua(){V=na=null,H=!1}function da(){var e=ra;return e!==null&&(fd===null?fd=e:fd.push.apply(fd,e),ra=null),e}function fa(e){ra===null?ra=[e]:ra.push(e)}var pa=M(null),ma=null,ha=null;function ga(e,t,n){P(pa,t._currentValue),t._currentValue=n}function _a(e){e._currentValue=pa.current,N(pa)}function va(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)===t?r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t):(e.childLanes|=t,r!==null&&(r.childLanes|=t)),e===n)break;e=e.return}}function ya(e,t,n,r){var a=e.child;for(a!==null&&(a.return=e);a!==null;){var o=a.dependencies;if(o!==null){var s=a.child;o=o.firstContext;a:for(;o!==null;){var c=o;o=a;for(var l=0;l<t.length;l++)if(c.context===t[l]){o.lanes|=n,c=o.alternate,c!==null&&(c.lanes|=n),va(o.return,n,e),r||(s=null);break a}o=c.next}}else if(a.tag===18){if(s=a.return,s===null)throw Error(i(341));s.lanes|=n,o=s.alternate,o!==null&&(o.lanes|=n),va(s,n,e),s=null}else a.tag===13&&a.memoizedState!==null&&a.memoizedState.dehydrated===null?(a.lanes|=n,s=a.alternate,s!==null&&(s.lanes|=n),va(a.return,n,e),s=a.child,s=s===null?null:s.sibling):s=a.child;if(s!==null)s.return=a;else for(s=a;s!==null;){if(s===e){s=null;break}if(a=s.sibling,a!==null){a.return=s.return,s=a;break}s=s.return}a=s}}function ba(e,t,n,r){e=null;for(var a=t,o=!1;a!==null;){if(!o){if(a.flags&524288)o=!0;else if(a.flags&262144)break}if(a.tag===10){var s=a.alternate;if(s===null)throw Error(i(387));if(s=s.memoizedProps,s!==null){var c=a.type;Br(a.pendingProps.value,s.value)||(e===null?e=[c]:e.push(c))}}else if(a===F.current){if(s=a.alternate,s===null)throw Error(i(387));s.memoizedState.memoizedState!==a.memoizedState.memoizedState&&(e===null?e=[sh]:e.push(sh))}a=a.return}return e!==null&&ya(t,e,n,r),t.flags|=262144,e!==null}function xa(e){for(e=e.firstContext;e!==null;){if(!Br(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function Sa(e){ma=e,ha=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function Ca(e){return Ta(ma,e)}function wa(e,t){return ma===null&&Sa(e),Ta(e,t)}function Ta(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},ha===null){if(e===null)throw Error(i(308));ha=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else ha=ha.next=t;return n}var Ea=typeof AbortController<`u`?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(t,n){e.push(n)}};this.abort=function(){t.aborted=!0,e.forEach(function(e){return e()})}},Da=t.unstable_scheduleCallback,Oa=t.unstable_NormalPriority,ka={$$typeof:ce,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Aa(){return{controller:new Ea,data:new Map,refCount:0}}function ja(e){e.refCount--,e.refCount===0&&Da(Oa,function(){e.controller.abort()})}function Ma(e,t){if(e.pendingLanes&4194048){var n=e.transitionTypes;for(n===null&&(n=e.transitionTypes=[]),e=0;e<t.length;e++){var r=t[e];n.indexOf(r)===-1&&n.push(r)}}}var Na=null;function Pa(e){var t=e.transitionTypes;return e.transitionTypes=null,t}var Fa=null,Ia=0,La=0,Ra=null;function za(e,t){if(Fa===null){var n=Fa=[];Ia=0,La=Pf(),Ra={status:`pending`,value:void 0,then:function(e){n.push(e)}}}return Ia++,t.then(Ba,Ba),t}function Ba(){if(--Ia===0&&(Na=null,Fa!==null)){Ra!==null&&(Ra.status=`fulfilled`);var e=Fa;Fa=null,La=0,Ra=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function Va(e,t){var n=[],r={status:`pending`,value:null,reason:null,then:function(e){n.push(e)}};return e.then(function(){r.status=`fulfilled`,r.value=t;for(var e=0;e<n.length;e++)(0,n[e])(t)},function(e){for(r.status=`rejected`,r.reason=e,e=0;e<n.length;e++)(0,n[e])(void 0)}),r}var Ha=A.S;A.S=function(e,t){if(hd=Ue(),typeof t==`object`&&t&&typeof t.then==`function`&&za(e,t),Na!==null)for(var n=bf;n!==null;)Ma(n,Na),n=n.next;if(n=e.types,n!==null){for(var r=bf;r!==null;)Ma(r,n),r=r.next;if(La!==0){r=Na,r===null&&(r=Na=[]);for(var i=0;i<n.length;i++){var a=n[i];r.indexOf(a)===-1&&r.push(a)}}}Ha!==null&&Ha(e,t)};var Ua=M(null);function Wa(){var e=Ua.current;return e===null?q.pooledCache:e}function Ga(e,t){t===null?P(Ua,Ua.current):P(Ua,t.pool)}function Ka(){var e=Wa();return e===null?null:{parent:ka._currentValue,pool:e}}var qa=Error(i(460)),Ja=Error(i(474)),Ya=Error(i(542)),Xa={then:function(){}};function Za(e){return e=e.status,e===`fulfilled`||e===`rejected`}function Qa(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(_n,_n),t=n),t.status){case`fulfilled`:return t.value;case`rejected`:throw e=t.reason,no(e),e===void 0&&!(`reason`in t)?Error(i(600)):e;default:if(typeof t.status==`string`)t.then(_n,_n);else{if(e=q,e!==null&&100<e.shellSuspendCounter)throw Error(i(482));e=t,e.status=`pending`,e.then(function(e){if(t.status===`pending`){var n=t;n.status=`fulfilled`,n.value=e}},function(e){if(t.status===`pending`){var n=t;n.status=`rejected`,n.reason=e}})}switch(t.status){case`fulfilled`:return t.value;case`rejected`:throw e=t.reason,no(e),e}throw eo=t,qa}}function $a(e){try{var t=e._init;return t(e._payload)}catch(e){throw typeof e==`object`&&e&&typeof e.then==`function`?(eo=e,qa):e}}var eo=null;function to(){if(eo===null)throw Error(i(459));var e=eo;return eo=null,e}function no(e){if(e===qa||e===Ya)throw Error(i(483))}var ro=null,io=0;function ao(e){var t=io;return io+=1,ro===null&&(ro=[]),Qa(ro,e,t)}function oo(e,t){t=t.props.ref,e.ref=t===void 0?null:t}function so(e,t){throw t.$$typeof===ne?Error(i(525)):(e=Object.prototype.toString.call(t),Error(i(31,e===`[object Object]`?`object with keys {`+Object.keys(t).join(`, `)+`}`:e)))}function co(e){function t(t,n){if(e){var r=t.deletions;r===null?(t.deletions=[n],t.flags|=16):r.push(n)}}function n(n,r){if(!e)return null;for(;r!==null;)t(n,r),r=r.sibling;return null}function r(e){for(var t=new Map;e!==null;)e.key===null?t.set(e.index,e):t.set(e.key,e),e=e.sibling;return t}function a(e,t){return e=Ni(e,t),e.index=0,e.sibling=null,e}function o(t,n,r){return t.index=r,e?(r=t.alternate,r===null?(t.flags|=134217730,n):(r=r.index,r<n?(t.flags|=2,n):r)):(t.flags|=1048576,n)}function s(t){return e&&t.alternate===null&&(t.flags|=134217730),t}function c(e,t,n,r){return t===null||t.tag!==6?(t=Li(n,e.mode,r),t.return=e,t):(t=a(t,n),t.return=e,t)}function l(e,t,n,r){var i=n.type;return i===E?(e=d(e,t,n.props.children,r,n.key),oo(e,n),e):t!==null&&(t.elementType===i||typeof i==`object`&&i&&i.$$typeof===fe&&$a(i)===t.type)?(t=a(t,n.props),oo(t,n),t.return=e,t):(t=Fi(n.type,n.key,n.props,null,e.mode,r),oo(t,n),t.return=e,t)}function u(e,t,n,r){return t===null||t.tag!==4||t.stateNode.containerInfo!==n.containerInfo||t.stateNode.implementation!==n.implementation?(t=zi(n,e.mode,r),t.return=e,t):(t=a(t,n.children||[]),t.return=e,t)}function d(e,t,n,r,i){return t===null||t.tag!==7?(t=Ii(n,e.mode,r,i),t.return=e,t):(t=a(t,n),t.return=e,t)}function f(e,t,n){if(typeof t==`string`&&t!==``||typeof t==`number`||typeof t==`bigint`)return t=Li(``+t,e.mode,n),t.return=e,t;if(typeof t==`object`&&t){switch(t.$$typeof){case re:return n=Fi(t.type,t.key,t.props,null,e.mode,n),oo(n,t),n.return=e,n;case ie:return t=zi(t,e.mode,n),t.return=e,t;case fe:return t=$a(t),f(e,t,n)}if(k(t)||ve(t))return t=Ii(t,e.mode,n,null),t.return=e,t;if(typeof t.then==`function`)return f(e,ao(t),n);if(t.$$typeof===ce)return f(e,wa(e,t),n);so(e,t)}return null}function p(e,t,n,r){var i=t===null?null:t.key;if(typeof n==`string`&&n!==``||typeof n==`number`||typeof n==`bigint`)return i===null?c(e,t,``+n,r):null;if(typeof n==`object`&&n){switch(n.$$typeof){case re:return n.key===i?l(e,t,n,r):null;case ie:return n.key===i?u(e,t,n,r):null;case fe:return n=$a(n),p(e,t,n,r)}if(k(n)||ve(n))return i===null?d(e,t,n,r,null):null;if(typeof n.then==`function`)return p(e,t,ao(n),r);if(n.$$typeof===ce)return p(e,t,wa(e,n),r);so(e,n)}return null}function m(e,t,n,r,i){if(typeof r==`string`&&r!==``||typeof r==`number`||typeof r==`bigint`)return e=e.get(n)||null,c(t,e,``+r,i);if(typeof r==`object`&&r){switch(r.$$typeof){case re:return e=e.get(r.key===null?n:r.key)||null,l(t,e,r,i);case ie:return e=e.get(r.key===null?n:r.key)||null,u(t,e,r,i);case fe:return r=$a(r),m(e,t,n,r,i)}if(k(r)||ve(r))return e=e.get(n)||null,d(t,e,r,i,null);if(typeof r.then==`function`)return m(e,t,n,ao(r),i);if(r.$$typeof===ce)return m(e,t,n,wa(t,r),i);so(t,r)}return null}function h(i,a,s,c){for(var l=null,u=null,d=a,h=a=0,g=null;d!==null&&h<s.length;h++){d.index>h?(g=d,d=null):g=d.sibling;var _=p(i,d,s[h],c);if(_===null){d===null&&(d=g);break}e&&d&&_.alternate===null&&t(i,d),a=o(_,a,h),u===null?l=_:u.sibling=_,u=_,d=g}if(h===s.length)return n(i,d),H&&Zi(i,h),l;if(d===null){for(;h<s.length;h++)d=f(i,s[h],c),d!==null&&(a=o(d,a,h),u===null?l=d:u.sibling=d,u=d);return H&&Zi(i,h),l}for(d=r(d);h<s.length;h++)g=m(d,i,h,s[h],c),g!==null&&(e&&(_=g.alternate,_!==null&&d.delete(_.key===null?h:_.key)),a=o(g,a,h),u===null?l=g:u.sibling=g,u=g);return e&&d.forEach(function(e){return t(i,e)}),H&&Zi(i,h),l}function g(a,s,c,l){if(c==null)throw Error(i(151));for(var u=null,d=null,h=s,g=s=0,_=null,v=c.next();h!==null&&!v.done;g++,v=c.next()){h.index>g?(_=h,h=null):_=h.sibling;var y=p(a,h,v.value,l);if(y===null){h===null&&(h=_);break}e&&h&&y.alternate===null&&t(a,h),s=o(y,s,g),d===null?u=y:d.sibling=y,d=y,h=_}if(v.done)return n(a,h),H&&Zi(a,g),u;if(h===null){for(;!v.done;g++,v=c.next())v=f(a,v.value,l),v!==null&&(s=o(v,s,g),d===null?u=v:d.sibling=v,d=v);return H&&Zi(a,g),u}for(h=r(h);!v.done;g++,v=c.next())v=m(h,a,g,v.value,l),v!==null&&(e&&(_=v.alternate,_!==null&&h.delete(_.key===null?g:_.key)),s=o(v,s,g),d===null?u=v:d.sibling=v,d=v);return e&&h.forEach(function(e){return t(a,e)}),H&&Zi(a,g),u}function _(e,r,o,c){if(typeof o==`object`&&o&&o.type===E&&o.key===null&&o.props.ref===void 0&&(o=o.props.children),typeof o==`object`&&o){switch(o.$$typeof){case re:a:{for(var l=o.key;r!==null;){if(r.key===l){if(l=o.type,l===E){if(r.tag===7){n(e,r.sibling),c=a(r,o.props.children),oo(c,o),c.return=e,e=c;break a}}else if(r.elementType===l||typeof l==`object`&&l&&l.$$typeof===fe&&$a(l)===r.type){n(e,r.sibling),c=a(r,o.props),oo(c,o),c.return=e,e=c;break a}n(e,r);break}t(e,r),r=r.sibling}o.type===E?(c=Ii(o.props.children,e.mode,c,o.key),oo(c,o),c.return=e,e=c):(c=Fi(o.type,o.key,o.props,null,e.mode,c),oo(c,o),c.return=e,e=c)}return s(e);case ie:a:{for(l=o.key;r!==null;){if(r.key===l){if(r.tag===4&&r.stateNode.containerInfo===o.containerInfo&&r.stateNode.implementation===o.implementation){n(e,r.sibling),c=a(r,o.children||[]),c.return=e,e=c;break a}n(e,r);break}t(e,r),r=r.sibling}c=zi(o,e.mode,c),c.return=e,e=c}return s(e);case fe:return o=$a(o),_(e,r,o,c)}if(k(o))return h(e,r,o,c);if(ve(o)){if(l=ve(o),typeof l!=`function`)throw Error(i(150));return o=l.call(o),g(e,r,o,c)}if(typeof o.then==`function`)return _(e,r,ao(o),c);if(o.$$typeof===ce)return _(e,r,wa(e,o),c);so(e,o)}return typeof o==`string`&&o!==``||typeof o==`number`||typeof o==`bigint`?(o=``+o,r!==null&&r.tag===6?(n(e,r.sibling),c=a(r,o),c.return=e,e=c):(n(e,r),c=Li(o,e.mode,c),c.return=e,e=c),s(e)):n(e,r)}return function(e,t,n,r){try{io=0;var i=_(e,t,n,r);return ro=null,i}catch(t){if(t===qa||t===Ya)throw t;var a=ji(29,t,null,e.mode);return a.lanes=r,a.return=e,a}}}var lo=co(!0),uo=co(!1),fo=!1;function po(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function mo(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function ho(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function go(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,K&2){var i=r.pending;return i===null?t.next=t:(t.next=i.next,i.next=t),r.pending=t,t=Oi(e),Di(e,null,n),t}return wi(e,r,t,n),Oi(e)}function _o(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,n&4194048)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,R(e,n)}}function vo(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var i=null,a=null;if(n=n.firstBaseUpdate,n!==null){do{var o={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};a===null?i=a=o:a=a.next=o,n=n.next}while(n!==null);a===null?i=a=t:a=a.next=t}else i=a=t;n={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:a,shared:r.shared,callbacks:r.callbacks},e.updateQueue=n}else e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var yo=!1;function bo(){if(yo){var e=Ra;if(e!==null)throw e}}function xo(e,t,n,r){yo=!1;var i=e.updateQueue;fo=!1;var a=i.firstBaseUpdate,o=i.lastBaseUpdate,s=i.shared.pending;if(s!==null){i.shared.pending=null;var c=s,l=c.next;c.next=null,o===null?a=l:o.next=l,o=c;var u=e.alternate;u!==null&&(u=u.updateQueue,s=u.lastBaseUpdate,s!==o&&(s===null?u.firstBaseUpdate=l:s.next=l,u.lastBaseUpdate=c))}if(a!==null){var d=i.baseState;o=0,u=l=c=null,s=a;do{var f=s.lane&-536870913,p=f!==s.lane;if(p?(Y&f)===f:(r&f)===f){f!==0&&f===La&&(yo=!0),u!==null&&(u=u.next={lane:0,tag:s.tag,payload:s.payload,callback:null,next:null});a:{var m=e,h=s;f=t;var g=n;switch(h.tag){case 1:if(m=h.payload,typeof m==`function`){d=m.call(g,d,f);break a}d=m;break a;case 3:m.flags=m.flags&-65537|128;case 0:if(m=h.payload,f=typeof m==`function`?m.call(g,d,f):m,f==null)break a;d=T({},d,f);break a;case 2:fo=!0}}f=s.callback,f!==null&&(e.flags|=64,p&&(e.flags|=8192),p=i.callbacks,p===null?i.callbacks=[f]:p.push(f))}else p={lane:f,tag:s.tag,payload:s.payload,callback:s.callback,next:null},u===null?(l=u=p,c=d):u=u.next=p,o|=f;if(s=s.next,s===null){if(s=i.shared.pending,s===null)break;p=s,s=p.next,p.next=null,i.lastBaseUpdate=p,i.shared.pending=null}}while(1);u===null&&(c=d),i.baseState=c,i.firstBaseUpdate=l,i.lastBaseUpdate=u,a===null&&(i.shared.lanes=0),od|=o,e.lanes=o,e.memoizedState=d}}function So(e,t){if(typeof e!=`function`)throw Error(i(191,e));e.call(t)}function Co(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)So(n[e],t)}var wo=M(null),To=M(0);function Eo(e,t){e=id,P(To,e),P(wo,t),id=e|t.baseLanes}function Do(){P(To,id),P(wo,wo.current)}function Oo(){id=To.current,N(wo),N(To)}var ko=M(null),Ao=null;function jo(e){var t=e.alternate;P(Io,Io.current&1),P(ko,e),Ao===null&&(t===null||wo.current!==null||t.memoizedState!==null)&&(Ao=e)}function Mo(e){P(Io,Io.current),P(ko,e),Ao===null&&(Ao=e)}function No(e){e.tag===22?(P(Io,Io.current),P(ko,e),Ao===null&&(Ao=e)):Po()}function Po(){P(Io,Io.current),P(ko,ko.current)}function Fo(e){N(ko),Ao===e&&(Ao=null),N(Io)}var Io=M(0);function Lo(e,t){P(ko,ko.current),P(Io,t)}function Ro(e){N(Io),N(ko),Ao===e&&(Ao=null)}function zo(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||om(n)||sm(n)))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==`independent`){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Bo=0,U=null,W=null,Vo=null,Ho=!1,Uo=!1,Wo=!1,Go=0,Ko=0,qo=null,Jo=0;function Yo(){throw Error(i(321))}function Xo(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Br(e[n],t[n]))return!1;return!0}function Zo(e,t,n,r,i,a){return Bo=a,U=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,A.H=e===null||e.memoizedState===null?mc:hc,Wo=!1,a=n(r,i),Wo=!1,Uo&&(a=$o(t,n,r,i)),Qo(e),a}function Qo(e){A.H=pc;var t=W!==null&&W.next!==null;if(Bo=0,Vo=W=U=null,Ho=!1,Ko=0,qo=null,t)throw Error(i(300));e===null||Mc||(e=e.dependencies,e!==null&&xa(e)&&(Mc=!0))}function $o(e,t,n,r){U=e;var a=0;do{if(Uo&&(qo=null),Ko=0,Uo=!1,25<=a)throw Error(i(301));if(a+=1,Vo=W=null,e.updateQueue!=null){var o=e.updateQueue;o.lastEffect=null,o.events=null,o.stores=null,o.memoCache!=null&&(o.memoCache.index=0)}A.H=gc,o=t(n,r)}while(Uo);return o}function es(){var e=A.H,t=e.useState()[0];return t=typeof t.then==`function`?ss(t):t,e=e.useState()[0],(W===null?null:W.memoizedState)!==e&&(U.flags|=1024),t}function ts(){var e=Go!==0;return Go=0,e}function ns(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function rs(e){if(Ho){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}Ho=!1}Bo=0,Vo=W=U=null,Uo=!1,Ko=Go=0,qo=null}function is(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Vo===null?U.memoizedState=Vo=e:Vo=Vo.next=e,Vo}function as(){if(W===null){var e=U.alternate;e=e===null?null:e.memoizedState}else e=W.next;var t=Vo===null?U.memoizedState:Vo.next;if(t!==null)Vo=t,W=e;else{if(e===null)throw U.alternate===null?Error(i(467)):Error(i(310));W=e,e={memoizedState:W.memoizedState,baseState:W.baseState,baseQueue:W.baseQueue,queue:W.queue,next:null},Vo===null?U.memoizedState=Vo=e:Vo=Vo.next=e}return Vo}function os(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function ss(e){var t=Ko;return Ko+=1,qo===null&&(qo=[]),e=Qa(qo,e,t),t=U,(Vo===null?t.memoizedState:Vo.next)===null&&(t=t.alternate,A.H=t===null||t.memoizedState===null?mc:hc),e}function cs(e){if(typeof e==`object`&&e){if(typeof e.then==`function`)return ss(e);if(e.$$typeof===_e)return;if(e.$$typeof===ce)return Ca(e)}throw Error(i(438,String(e)))}function ls(e){var t=null,n=U.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var r=U.alternate;r!==null&&(r=r.updateQueue,r!==null&&(r=r.memoCache,r!=null&&(t={data:r.data.map(function(e){return e.slice()}),index:0})))}if(t??={data:[],index:0},n===null&&(n=os(),U.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),r=0;r<e;r++)n[r]=he;return t.index++,n}function us(e,t){return typeof t==`function`?t(e):t}function ds(e){return fs(as(),W,e)}function fs(e,t,n){var r=e.queue;if(r===null)throw Error(i(311));r.lastRenderedReducer=n;var a=e.baseQueue,o=r.pending;if(o!==null){if(a!==null){var s=a.next;a.next=o.next,o.next=s}t.baseQueue=a=o,r.pending=null}if(o=e.baseState,a===null)e.memoizedState=o;else{t=a.next;var c=s=null,l=null,u=t,d=!1;do{var f=u.lane&-536870913;if(f===u.lane?(Bo&f)===f:(Y&f)===f){var p=u.revertLane;if(p===0)l!==null&&(l=l.next={lane:0,revertLane:0,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),f===La&&(d=!0);else if((Bo&p)===p){u=u.next,p===La&&(d=!0);continue}else f={lane:0,revertLane:u.revertLane,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(c=l=f,s=o):l=l.next=f,U.lanes|=p,od|=p;f=u.action,Wo&&n(o,f),o=u.hasEagerState?u.eagerState:n(o,f)}else p={lane:f,revertLane:u.revertLane,gesture:u.gesture,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(c=l=p,s=o):l=l.next=p,U.lanes|=f,od|=f;u=u.next}while(u!==null&&u!==t);if(l===null?s=o:l.next=c,!Br(o,e.memoizedState)&&(Mc=!0,d&&(n=Ra,n!==null)))throw n;e.memoizedState=o,e.baseState=s,e.baseQueue=l,r.lastRenderedState=o}return a===null&&(r.lanes=0),[e.memoizedState,r.dispatch]}function ps(e){var t=as(),n=t.queue;if(n===null)throw Error(i(311));n.lastRenderedReducer=e;var r=n.dispatch,a=n.pending,o=t.memoizedState;if(a!==null){n.pending=null;var s=a=a.next;do o=e(o,s.action),s=s.next;while(s!==a);Br(o,t.memoizedState)||(Mc=!0),t.memoizedState=o,t.baseQueue===null&&(t.baseState=o),n.lastRenderedState=o}return[o,r]}function ms(e,t,n){var r=U,a=as(),o=H;if(o){if(n===void 0)throw Error(i(407));n=n()}else n=t();var s=!Br((W||a).memoizedState,n);if(s&&(a.memoizedState=n,Mc=!0),a=a.queue,zs(_s.bind(null,r,a,e),[e]),e=a.getSnapshot!==t||s||Vo!==null&&!!(Vo.memoizedState.tag&1),Ps(e?9:8,{destroy:void 0},gs.bind(null,r,a,n,t),null),e){if(r.flags|=2048,q===null)throw Error(i(349));o||Bo&127||hs(r,t,n)}return n}function hs(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=U.updateQueue,t===null?(t=os(),U.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function gs(e,t,n,r){t.value=n,t.getSnapshot=r,vs(t)&&ys(e)}function _s(e,t,n){return n(function(){vs(t)&&ys(e)})}function vs(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Br(e,n)}catch{return!0}}function ys(e){var t=Ei(e,2);t!==null&&Pd(t,e,2)}function bs(e){var t=is();if(typeof e==`function`){var n=e;if(e=n(),Wo){et(!0);try{n()}finally{et(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:us,lastRenderedState:e},t}function xs(e,t,n,r){return e.baseState=n,fs(e,W,typeof r==`function`?r:us)}function Ss(e,t,n,r,a){if(uc(e))throw Error(i(485));if(e=t.action,e!==null){var o={payload:a,action:e,next:null,isTransition:!0,status:`pending`,value:null,reason:null,listeners:[],then:function(e){o.listeners.push(e)}};A.T===null?o.isTransition=!1:n(!0),r(o),n=t.pending,n===null?(o.next=t.pending=o,Cs(t,o)):(o.next=n.next,t.pending=n.next=o)}}function Cs(e,t){var n=t.action,r=t.payload,i=e.state;if(t.isTransition){var a=A.T,o={};o.types=a===null?null:a.types,A.T=o;try{var s=n(i,r),c=A.S;c!==null&&c(o,s),ws(e,t,s)}catch(n){Es(e,t,n)}finally{a!==null&&o.types!==null&&(a.types=o.types),A.T=a}}else try{a=n(i,r),ws(e,t,a)}catch(n){Es(e,t,n)}}function ws(e,t,n){typeof n==`object`&&n&&typeof n.then==`function`?n.then(function(n){Ts(e,t,n)},function(n){return Es(e,t,n)}):Ts(e,t,n)}function Ts(e,t,n){t.status=`fulfilled`,t.value=n,Ds(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,Cs(e,n)))}function Es(e,t,n){var r=e.pending;if(e.pending=null,r!==null){r=r.next;do t.status=`rejected`,t.reason=n,Ds(t),t=t.next;while(t!==r)}e.action=null}function Ds(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function Os(e,t){return t}function ks(e,t){if(H){var n=q.formState;if(n!==null){a:{var r=U;if(H){if(V){b:{for(var i=V,a=ia;i.nodeType!==8;)if(!a||(i=lm(i.nextSibling),i===null)){i=null;break b}a=i.data,i=a===`F!`||a===`F`?i:null}if(i){V=lm(i.nextSibling),r=i.data===`F!`;break a}}oa(r)}r=!1}r&&(t=n[0])}}return n=is(),n.memoizedState=n.baseState=t,r={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Os,lastRenderedState:t},n.queue=r,n=sc.bind(null,U,r),r.dispatch=n,r=bs(!1),a=lc.bind(null,U,!1,r.queue),r=is(),i={state:t,dispatch:null,action:e,pending:null},r.queue=i,n=Ss.bind(null,U,i,a,n),i.dispatch=n,r.memoizedState=e,[t,n,!1]}function As(e){return js(as(),W,e)}function js(e,t,n){if(t=fs(e,t,Os)[0],e=ds(us)[0],typeof t==`object`&&t&&typeof t.then==`function`)try{var r=ss(t)}catch(e){throw e===qa?Ya:e}else r=t;t=as();var i=t.queue,a=i.dispatch;return n!==t.memoizedState&&(U.flags|=2048,Ps(9,{destroy:void 0},Ms.bind(null,i,n),null)),[r,a,e]}function Ms(e,t){e.action=t}function Ns(e){var t=as(),n=W;if(n!==null)return js(t,n,e);as(),t=t.memoizedState,n=as();var r=n.queue.dispatch;return n.memoizedState=e,[t,r,!1]}function Ps(e,t,n,r){return e={tag:e,create:n,deps:r,inst:t,next:null},t=U.updateQueue,t===null&&(t=os(),U.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e),e}function Fs(){return as().memoizedState}function Is(e,t,n,r){var i=is();U.flags|=e,i.memoizedState=Ps(1|t,{destroy:void 0},n,r===void 0?null:r)}function Ls(e,t,n,r){var i=as();r=r===void 0?null:r;var a=i.memoizedState.inst;W!==null&&r!==null&&Xo(r,W.memoizedState.deps)?i.memoizedState=Ps(t,a,n,r):(U.flags|=e,i.memoizedState=Ps(1|t,a,n,r))}function Rs(e,t){Is(8390656,8,e,t)}function zs(e,t){Ls(2048,8,e,t)}function Bs(e){U.flags|=4;var t=U.updateQueue;if(t===null)t=os(),U.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function Vs(e){var t=as().memoizedState;return Bs({ref:t,nextImpl:e}),function(){if(K&2)throw Error(i(440));return t.impl.apply(void 0,arguments)}}function Hs(e,t){return Ls(4,2,e,t)}function Us(e,t){return Ls(4,4,e,t)}function Ws(e,t){if(typeof t==`function`){e=e();var n=t(e);return function(){typeof n==`function`?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Gs(e,t,n){n=n==null?null:n.concat([e]),Ls(4,4,Ws.bind(null,t,e),n)}function Ks(){}function qs(e,t){var n=as();t=t===void 0?null:t;var r=n.memoizedState;return t!==null&&Xo(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function Js(e,t){var n=as();t=t===void 0?null:t;var r=n.memoizedState;if(t!==null&&Xo(t,r[1]))return r[0];if(r=e(),Wo){et(!0);try{e()}finally{et(!1)}}return n.memoizedState=[r,t],r}function Ys(e,t,n){return n===void 0||Bo&1073741824&&!(Y&261930)?e.memoizedState=t:(e.memoizedState=n,e=Md(),U.lanes|=e,od|=e,n)}function Xs(e,t,n,r){return Br(n,t)?n:wo.current===null?!(Bo&106)||Bo&1073741824&&!(Y&261930)?(Mc=!0,e.memoizedState=n):(e=Md(),U.lanes|=e,od|=e,t):(e=Ys(e,n,r),Br(e,t)||(Mc=!0),e)}function Zs(e,t,n,r,i){var a=j.p;j.p=a!==0&&8>a?a:8;var o=A.T,s={};s.types=o===null?null:o.types,A.T=s,lc(e,!1,t,n);try{var c=i(),l=A.S;l!==null&&l(s,c),typeof c==`object`&&c&&typeof c.then==`function`?cc(e,t,Va(c,r),jd(e)):cc(e,t,r,jd(e))}catch(n){cc(e,t,{then:function(){},status:`rejected`,reason:n},jd())}finally{j.p=a,o!==null&&s.types!==null&&(o.types=s.types),A.T=o}}function Qs(){}function $s(e,t,n,r){if(e.tag!==5)throw Error(i(476));var a=ec(e).queue;Zs(e,a,t,xe,n===null?Qs:function(){return tc(e),n(r)})}function ec(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:xe,baseState:xe,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:us,lastRenderedState:xe},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:us,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function tc(e){var t=ec(e);t.next===null&&(t=e.alternate.memoizedState),cc(e,t.next.queue,{},jd())}function nc(){return Ca(sh)}function rc(){return as().memoizedState}function ic(){return as().memoizedState}function ac(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=jd();e=ho(n);var r=go(t,e,n);r!==null&&(Pd(r,t,n),_o(r,t,n)),t={cache:Aa()},e.payload=t;return}t=t.return}}function oc(e,t,n){var r=jd();n={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},uc(e)?dc(t,n):(n=Ti(e,t,n,r),n!==null&&(Pd(n,e,r),fc(n,t,r)))}function sc(e,t,n){cc(e,t,n,jd())}function cc(e,t,n,r){var i={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(uc(e))dc(t,i);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var o=t.lastRenderedState,s=a(o,n);if(i.hasEagerState=!0,i.eagerState=s,Br(s,o))return wi(e,t,i,0),q===null&&Ci(),!1}catch{}if(n=Ti(e,t,i,r),n!==null)return Pd(n,e,r),fc(n,t,r),!0}return!1}function lc(e,t,n,r){if(r={lane:2,revertLane:Pf(),gesture:null,action:r,hasEagerState:!1,eagerState:null,next:null},uc(e)){if(t)throw Error(i(479))}else t=Ti(e,n,r,2),t!==null&&Pd(t,e,2)}function uc(e){var t=e.alternate;return e===U||t!==null&&t===U}function dc(e,t){Uo=Ho=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function fc(e,t,n){if(n&4194048){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,R(e,n)}}var pc={readContext:Ca,use:cs,useCallback:Yo,useContext:Yo,useEffect:Yo,useImperativeHandle:Yo,useLayoutEffect:Yo,useInsertionEffect:Yo,useMemo:Yo,useReducer:Yo,useRef:Yo,useState:Yo,useDebugValue:Yo,useDeferredValue:Yo,useTransition:Yo,useSyncExternalStore:Yo,useId:Yo,useHostTransitionStatus:Yo,useFormState:Yo,useActionState:Yo,useOptimistic:Yo,useMemoCache:Yo,useCacheRefresh:Yo,useEffectEvent:Yo},mc={readContext:Ca,use:cs,useCallback:function(e,t){return is().memoizedState=[e,t===void 0?null:t],e},useContext:Ca,useEffect:Rs,useImperativeHandle:function(e,t,n){n=n==null?null:n.concat([e]),Is(4194308,4,Ws.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Is(4194308,4,e,t)},useInsertionEffect:function(e,t){Is(4,2,e,t)},useMemo:function(e,t){var n=is();t=t===void 0?null:t;var r=e();if(Wo){et(!0);try{e()}finally{et(!1)}}return n.memoizedState=[r,t],r},useReducer:function(e,t,n){var r=is();if(n!==void 0){var i=n(t);if(Wo){et(!0);try{n(t)}finally{et(!1)}}}else i=t;return r.memoizedState=r.baseState=i,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:i},r.queue=e,e=e.dispatch=oc.bind(null,U,e),[r.memoizedState,e]},useRef:function(e){var t=is();return e={current:e},t.memoizedState=e},useState:function(e){e=bs(e);var t=e.queue,n=sc.bind(null,U,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:Ks,useDeferredValue:function(e,t){return Ys(is(),e,t)},useTransition:function(){var e=bs(!1);return e=Zs.bind(null,U,e.queue,!0,!1),is().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var r=U,a=is();if(H){if(n===void 0)throw Error(i(407));n=n()}else{if(n=t(),q===null)throw Error(i(349));Y&127||hs(r,t,n)}a.memoizedState=n;var o={value:n,getSnapshot:t};return a.queue=o,Rs(_s.bind(null,r,o,e),[e]),r.flags|=2048,Ps(9,{destroy:void 0},gs.bind(null,r,o,n,t),null),n},useId:function(){var e=is(),t=q.identifierPrefix;if(H){var n=Xi,r=Yi;n=(r&~(1<<32-tt(r)-1)).toString(32)+n,t=`_`+t+`R_`+n,n=Go++,0<n&&(t+=`H`+n.toString(32)),t+=`_`}else n=Jo++,t=`_`+t+`r_`+n.toString(32)+`_`;return e.memoizedState=t},useHostTransitionStatus:nc,useFormState:ks,useActionState:ks,useOptimistic:function(e){var t=is();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=lc.bind(null,U,!0,n),n.dispatch=t,[e,t]},useMemoCache:ls,useCacheRefresh:function(){return is().memoizedState=ac.bind(null,U)},useEffectEvent:function(e){var t=is(),n={impl:e};return t.memoizedState=n,function(){if(K&2)throw Error(i(440));return n.impl.apply(void 0,arguments)}}},hc={readContext:Ca,use:cs,useCallback:qs,useContext:Ca,useEffect:zs,useImperativeHandle:Gs,useInsertionEffect:Hs,useLayoutEffect:Us,useMemo:Js,useReducer:ds,useRef:Fs,useState:function(){return ds(us)},useDebugValue:Ks,useDeferredValue:function(e,t){return Xs(as(),W.memoizedState,e,t)},useTransition:function(){var e=ds(us)[0],t=as().memoizedState;return[typeof e==`boolean`?e:ss(e),t]},useSyncExternalStore:ms,useId:rc,useHostTransitionStatus:nc,useFormState:As,useActionState:As,useOptimistic:function(e,t){return xs(as(),W,e,t)},useMemoCache:ls,useCacheRefresh:ic,useEffectEvent:Vs},gc={readContext:Ca,use:cs,useCallback:qs,useContext:Ca,useEffect:zs,useImperativeHandle:Gs,useInsertionEffect:Hs,useLayoutEffect:Us,useMemo:Js,useReducer:ps,useRef:Fs,useState:function(){return ps(us)},useDebugValue:Ks,useDeferredValue:function(e,t){var n=as();return W===null?Ys(n,e,t):Xs(n,W.memoizedState,e,t)},useTransition:function(){var e=ps(us)[0],t=as().memoizedState;return[typeof e==`boolean`?e:ss(e),t]},useSyncExternalStore:ms,useId:rc,useHostTransitionStatus:nc,useFormState:Ns,useActionState:Ns,useOptimistic:function(e,t){var n=as();return W===null?(n.baseState=e,[e,n.queue.dispatch]):xs(n,W,e,t)},useMemoCache:ls,useCacheRefresh:ic,useEffectEvent:Vs};function _c(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:T({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var vc={enqueueSetState:function(e,t,n){e=e._reactInternals;var r=jd(),i=ho(r);i.payload=t,n!=null&&(i.callback=n),t=go(e,i,r),t!==null&&(Pd(t,e,r),_o(t,e,r))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=jd(),i=ho(r);i.tag=1,i.payload=t,n!=null&&(i.callback=n),t=go(e,i,r),t!==null&&(Pd(t,e,r),_o(t,e,r))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=jd(),r=ho(n);r.tag=2,t!=null&&(r.callback=t),t=go(e,r,n),t!==null&&(Pd(t,e,n),_o(t,e,n))}};function yc(e,t,n,r,i,a,o){return e=e.stateNode,typeof e.shouldComponentUpdate==`function`?e.shouldComponentUpdate(r,a,o):t.prototype&&t.prototype.isPureReactComponent?!Vr(n,r)||!Vr(i,a):!0}function bc(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps==`function`&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps==`function`&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&vc.enqueueReplaceState(t,t.state,null)}function xc(e,t){var n=t;if(`ref`in t)for(var r in n={},t)r!==`ref`&&(n[r]=t[r]);if(e=e.defaultProps)for(var i in n===t&&(n=T({},n)),e)n[i]===void 0&&(n[i]=e[i]);return n}function Sc(e){yi(e)}function Cc(e){console.error(e)}function wc(e){yi(e)}function Tc(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(e){setTimeout(function(){throw e})}}function Ec(e,t,n){try{var r=e.onCaughtError;r(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(e){setTimeout(function(){throw e})}}function Dc(e,t,n){return n=ho(n),n.tag=3,n.payload={element:null},n.callback=function(){Tc(e,t)},n}function Oc(e){return e=ho(e),e.tag=3,e}function kc(e,t,n,r){var i=n.type.getDerivedStateFromError;if(typeof i==`function`){var a=r.value;e.payload=function(){return i(a)},e.callback=function(){Ec(t,n,r)}}var o=n.stateNode;o!==null&&typeof o.componentDidCatch==`function`&&(e.callback=function(){Ec(t,n,r),typeof i!=`function`&&(vd===null?vd=new Set([this]):vd.add(this));var e=r.stack;this.componentDidCatch(r.value,{componentStack:e===null?``:e})})}function Ac(e,t,n,r,a){if(n.flags|=32768,typeof r==`object`&&r&&typeof r.then==`function`){if(t=n.alternate,t!==null&&ba(t,n,a,!0),n=ko.current,n!==null){switch(n.tag){case 31:case 13:case 19:return Ao===null?Kd():n.alternate===null&&ad===0&&(ad=3),n.flags&=-257,n.flags|=65536,n.lanes=a,r===Xa?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([r]):t.add(r),mf(e,r,a)),!1;case 22:return n.flags|=65536,r===Xa?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([r])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([r]):n.add(r)),mf(e,r,a)),!1}throw Error(i(435,n.tag))}return mf(e,r,a),Kd(),!1}if(H)return t=ko.current,t===null?(r!==aa&&(t=Error(i(423),{cause:r}),fa(Vi(t,n))),e=e.current.alternate,e.flags|=65536,a&=-a,e.lanes|=a,r=Vi(r,n),a=Dc(e.stateNode,r,a),vo(e,a),ad!==4&&(ad=2)):(!(t.flags&65536)&&(t.flags|=256),t.flags|=65536,t.lanes=a,r!==aa&&(e=Error(i(422),{cause:r}),fa(Vi(e,n)))),!1;var o=Error(i(520),{cause:r});if(o=Vi(o,n),dd===null?dd=[o]:dd.push(o),ad!==4&&(ad=2),t===null)return!0;r=Vi(r,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=a&-a,n.lanes|=e,e=Dc(n.stateNode,r,e),vo(n,e),!1;case 1:if(t=n.type,o=n.stateNode,!(n.flags&128)&&(typeof t.getDerivedStateFromError==`function`||o!==null&&typeof o.componentDidCatch==`function`&&(vd===null||!vd.has(o))))return n.flags|=65536,a&=-a,n.lanes|=a,a=Oc(a),kc(a,e,n,r),vo(n,a),!1;break;case 22:if(n.memoizedState!==null)return n.flags|=65536,!1}n=n.return}while(n!==null);return!1}var jc=Error(i(461)),Mc=!1;function Nc(e,t,n,r){t.child=e===null?uo(t,null,n,r):lo(t,e.child,n,r)}function Pc(e,t,n,r,i){n=n.render;var a=t.ref;if(`ref`in r){var o={};for(var s in r)s!==`ref`&&(o[s]=r[s])}else o=r;return Sa(t),r=Zo(e,t,n,o,a,i),s=ts(),e!==null&&!Mc?(ns(e,t,i),cl(e,t,i)):(H&&s&&$i(t),t.flags|=1,Nc(e,t,r,i),t.child)}function Fc(e,t,n,r,i){if(e===null){var a=n.type;return typeof a==`function`&&!Mi(a)&&a.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=a,Ic(e,t,a,r,i)):(e=Fi(n.type,null,r,t,t.mode,i),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,!ll(e,i)){var o=a.memoizedProps;if(n=n.compare,n=n===null?Vr:n,n(o,r)&&e.ref===t.ref)return cl(e,t,i)}return t.flags|=1,e=Ni(a,r),e.ref=t.ref,e.return=t,t.child=e}function Ic(e,t,n,r,i){if(e!==null){var a=e.memoizedProps;if(Vr(a,r)&&e.ref===t.ref){if(Mc=!1,t.pendingProps=r=a,ll(e,i))e.flags&131072&&(Mc=!0);else return t.lanes=e.lanes,cl(e,t,i)}}return Wc(e,t,n,r,i)}function Lc(e,t,n,r){var i=r.children,a=e===null?null:e.memoizedState;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),r.mode===`hidden`){if(t.flags&128){if(a=a===null?n:a.baseLanes|n,e!==null){for(r=t.child=e.child,i=0;r!==null;)i=i|r.lanes|r.childLanes,r=r.sibling;r=i&~a}else r=0,t.child=null;return zc(e,t,a,n,r)}if(n&536870912)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&Ga(t,a===null?null:a.cachePool),a===null?Do():Eo(t,a),No(t);else return r=t.lanes=536870912,zc(e,t,a===null?n:a.baseLanes|n,n,r)}else a===null?(e!==null&&Ga(t,null),Do(),Po()):(Ga(t,a.cachePool),Eo(t,a),Po(),t.memoizedState=null);return Nc(e,t,i,n),t.child}function Rc(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function zc(e,t,n,r,i){var a=Wa();return a=a===null?null:{parent:ka._currentValue,pool:a},t.memoizedState={baseLanes:n,cachePool:a},e!==null&&Ga(t,null),Do(),No(t),e!==null&&ba(e,t,r,!0),t.childLanes=i,null}function Bc(e,t){return t=$c({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function Vc(e,t,n){return lo(t,e.child,null,n),e=Bc(t,t.pendingProps),e.flags|=2,Fo(t),t.memoizedState=null,e}function Hc(e,t,n){var r=t.pendingProps,a=!!(t.flags&128);if(t.flags&=-129,e===null){if(H){if(r.mode===`hidden`)return e=Bc(t,r),t.lanes=536870912,e.memoizedState={baseLanes:0,cachePool:null},Rc(null,e);if(Mo(t),(e=V)?(e=am(e,ia),e=e!==null&&e.data===`&`?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Ji===null?null:{id:Yi,overflow:Xi},retryLane:536870912,hydrationErrors:null},n=Ri(e),n.return=t,t.child=n,na=t,V=null)):e=null,e===null)throw oa(t);return t.lanes=536870912,null}return Bc(t,r)}var o=e.memoizedState;if(o!==null){var s=o.dehydrated;if(Mo(t),a){if(t.flags&256)t.flags&=-257,t=Vc(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(i(558))}else if(Mc||ba(e,t,n,!1),a=(n&e.childLanes)!==0,Mc||a){if(wo.current===null){if(r=q,r!==null&&(s=gt(r,n),s!==0&&s!==o.retryLane))throw o.retryLane=s,Ei(e,s),Pd(r,e,s),jc;Kd()}t=Vc(e,t,n)}else e=o.treeContext,V=lm(s.nextSibling),na=t,H=!0,ra=null,ia=!1,e!==null&&ta(t,e),t=Bc(t,r),t.flags|=134221824;return t}return e=Ni(e.child,{mode:r.mode,children:r.children}),e.ref=t.ref,t.child=e,e.return=t,e}function Uc(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!=`function`&&typeof n!=`object`)throw Error(i(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function Wc(e,t,n,r,i){return Sa(t),n=Zo(e,t,n,r,void 0,i),r=ts(),e!==null&&!Mc?(ns(e,t,i),cl(e,t,i)):(H&&r&&$i(t),t.flags|=1,Nc(e,t,n,i),t.child)}function Gc(e,t,n,r,i,a){return Sa(t),t.updateQueue=null,n=$o(t,r,n,i),Qo(e),r=ts(),e!==null&&!Mc?(ns(e,t,a),cl(e,t,a)):(H&&r&&$i(t),t.flags|=1,Nc(e,t,n,a),t.child)}function Kc(e,t,n,r,i){if(Sa(t),t.stateNode===null){var a=ki,o=n.contextType;typeof o==`object`&&o&&(a=Ca(o)),a=new n(r,a),t.memoizedState=a.state!==null&&a.state!==void 0?a.state:null,a.updater=vc,t.stateNode=a,a._reactInternals=t,a=t.stateNode,a.props=r,a.state=t.memoizedState,a.refs={},po(t),o=n.contextType,a.context=typeof o==`object`&&o?Ca(o):ki,a.state=t.memoizedState,o=n.getDerivedStateFromProps,typeof o==`function`&&(_c(t,n,o,r),a.state=t.memoizedState),typeof n.getDerivedStateFromProps==`function`||typeof a.getSnapshotBeforeUpdate==`function`||typeof a.UNSAFE_componentWillMount!=`function`&&typeof a.componentWillMount!=`function`||(o=a.state,typeof a.componentWillMount==`function`&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount==`function`&&a.UNSAFE_componentWillMount(),o!==a.state&&vc.enqueueReplaceState(a,a.state,null),xo(t,r,a,i),bo(),a.state=t.memoizedState),typeof a.componentDidMount==`function`&&(t.flags|=4194308),r=!0}else if(e===null){a=t.stateNode;var s=t.memoizedProps,c=xc(n,s);a.props=c;var l=a.context,u=n.contextType;o=ki,typeof u==`object`&&u&&(o=Ca(u));var d=n.getDerivedStateFromProps;u=typeof d==`function`||typeof a.getSnapshotBeforeUpdate==`function`,s=t.pendingProps!==s,u||typeof a.UNSAFE_componentWillReceiveProps!=`function`&&typeof a.componentWillReceiveProps!=`function`||(s||l!==o)&&bc(t,a,r,o),fo=!1;var f=t.memoizedState;a.state=f,xo(t,r,a,i),bo(),l=t.memoizedState,s||f!==l||fo?(typeof d==`function`&&(_c(t,n,d,r),l=t.memoizedState),(c=fo||yc(t,n,c,r,f,l,o))?(u||typeof a.UNSAFE_componentWillMount!=`function`&&typeof a.componentWillMount!=`function`||(typeof a.componentWillMount==`function`&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount==`function`&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount==`function`&&(t.flags|=4194308)):(typeof a.componentDidMount==`function`&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=l),a.props=r,a.state=l,a.context=o,r=c):(typeof a.componentDidMount==`function`&&(t.flags|=4194308),r=!1)}else{a=t.stateNode,mo(e,t),o=t.memoizedProps,u=xc(n,o),a.props=u,d=t.pendingProps,f=a.context,l=n.contextType,c=ki,typeof l==`object`&&l&&(c=Ca(l)),s=n.getDerivedStateFromProps,(l=typeof s==`function`||typeof a.getSnapshotBeforeUpdate==`function`)||typeof a.UNSAFE_componentWillReceiveProps!=`function`&&typeof a.componentWillReceiveProps!=`function`||(o!==d||f!==c)&&bc(t,a,r,c),fo=!1,f=t.memoizedState,a.state=f,xo(t,r,a,i),bo();var p=t.memoizedState;o!==d||f!==p||fo||e!==null&&e.dependencies!==null&&xa(e.dependencies)?(typeof s==`function`&&(_c(t,n,s,r),p=t.memoizedState),(u=fo||yc(t,n,u,r,f,p,c)||e!==null&&e.dependencies!==null&&xa(e.dependencies))?(l||typeof a.UNSAFE_componentWillUpdate!=`function`&&typeof a.componentWillUpdate!=`function`||(typeof a.componentWillUpdate==`function`&&a.componentWillUpdate(r,p,c),typeof a.UNSAFE_componentWillUpdate==`function`&&a.UNSAFE_componentWillUpdate(r,p,c)),typeof a.componentDidUpdate==`function`&&(t.flags|=4),typeof a.getSnapshotBeforeUpdate==`function`&&(t.flags|=1024)):(typeof a.componentDidUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=p),a.props=r,a.state=p,a.context=c,r=u):(typeof a.componentDidUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),r=!1)}return a=r,Uc(e,t),r=!!(t.flags&128),a||r?(a=t.stateNode,n=r&&typeof n.getDerivedStateFromError!=`function`?null:a.render(),t.flags|=1,e!==null&&r?(t.child=lo(t,e.child,null,i),t.child=lo(t,null,n,i)):Nc(e,t,n,i),t.memoizedState=a.state,e=t.child):e=cl(e,t,i),e}function qc(e,t,n,r){return ua(),t.flags|=256,Nc(e,t,n,r),t.child}var Jc={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Yc(e){return{baseLanes:e,cachePool:Ka()}}function Xc(e,t,n){return e=e===null?0:e.childLanes&~n,t&&(e|=ld),e}function Zc(e,t,n){var r=t.pendingProps,i=!1,a=!!(t.flags&128),o;if((o=a)||(o=e!==null&&e.memoizedState===null?!1:!!(Io.current&2)),o&&(i=!0,t.flags&=-129),o=!!(t.flags&32),t.flags&=-33,e===null){if(H){if(i?jo(t):Po(),(e=V)?(e=am(e,ia),e=e!==null&&e.data!==`&`?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Ji===null?null:{id:Yi,overflow:Xi},retryLane:536870912,hydrationErrors:null},n=Ri(e),n.return=t,t.child=n,na=t,V=null)):e=null,e===null)throw oa(t);return t.lanes=sm(e)?32:536870912,null}return a=r.children,r=r.fallback,i?(Po(),i=t.mode,a=$c({mode:`hidden`,children:a},i),r=Ii(r,i,n,null),a.return=t,r.return=t,a.sibling=r,t.child=a,r=t.child,r.memoizedState=Yc(n),r.childLanes=Xc(e,o,n),t.memoizedState=Jc,Rc(null,r)):(jo(t),Qc(t,a))}var s=e.memoizedState;if(s!==null){var c=s.dehydrated;if(c!==null)return tl(e,t,a,o,r,c,s,n)}return i?(Po(),i=r.fallback,a=t.mode,s=e.child,c=s.sibling,r=Ni(s,{mode:`hidden`,children:r.children}),r.subtreeFlags=s.subtreeFlags&1206910976,c===null?(i=Ii(i,a,n,null),i.flags|=2):i=Ni(c,i),i.return=t,r.return=t,r.sibling=i,t.child=r,Rc(null,r),r=t.child,i=e.child.memoizedState,i===null?i=Yc(n):(a=i.cachePool,a===null?a=Ka():(s=ka._currentValue,a=a.parent===s?a:{parent:s,pool:s}),i={baseLanes:i.baseLanes|n,cachePool:a}),r.memoizedState=i,r.childLanes=Xc(e,o,n),t.memoizedState=Jc,Rc(e.child,r)):(jo(t),n=e.child,e=n.sibling,n=Ni(n,{mode:`visible`,children:r.children}),n.return=t,n.sibling=null,e!==null&&(o=t.deletions,o===null?(t.deletions=[e],t.flags|=16):o.push(e)),t.child=n,t.memoizedState=null,n)}function Qc(e,t){return t=$c({mode:`visible`,children:t},e.mode),t.return=e,e.child=t}function $c(e,t){return e=ji(22,e,null,t),e.lanes=0,e}function el(e,t,n){return lo(t,e.child,null,n),e=Qc(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function tl(e,t,n,r,a,o,s,c){if(n)return t.flags&256?(jo(t),t.flags&=-257,el(e,t,c)):t.memoizedState===null?(Po(),o=a.fallback,s=t.mode,a=$c({mode:`visible`,children:a.children},s),o=Ii(o,s,c,null),o.flags|=2,a.return=t,o.return=t,a.sibling=o,t.child=a,lo(t,e.child,null,c),a=t.child,a.memoizedState=Yc(c),a.childLanes=Xc(e,r,c),t.memoizedState=Jc,Rc(null,a)):(Po(),t.child=e.child,t.flags|=128,null);if(jo(t),sm(o)){if(r=o.nextSibling&&o.nextSibling.dataset,r)var l=r.dgst;return r=l,r!==``&&(a=Error(i(419)),a.stack=``,a.digest=r,fa({value:a,source:null,stack:null})),el(e,t,c)}if(Mc||ba(e,t,c,!1),r=(c&e.childLanes)!==0,Mc||r){if(wo.current!==null)return el(e,t,c);if(r=q,r!==null&&(a=gt(r,c),a!==0&&a!==s.retryLane))throw s.retryLane=a,Ei(e,a),Pd(r,e,a),jc;return om(o)||Kd(),el(e,t,c)}return om(o)?(t.flags|=192,t.child=e.child,null):(e=s.treeContext,V=lm(o.nextSibling),na=t,H=!0,ra=null,ia=!1,e!==null&&ta(t,e),t=Qc(t,a.children),t.flags|=134221824,t)}function nl(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),va(e.return,t,n)}function rl(e){for(var t=null;e!==null;){var n=e.alternate;n!==null&&zo(n)===null&&(t=e),e=e.sibling}return t}function il(e,t,n,r,i,a){var o=e.memoizedState;o===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:i,treeForkCount:a}:(o.isBackwards=t,o.rendering=null,o.renderingStartTime=0,o.last=r,o.tail=n,o.tailMode=i,o.treeForkCount=a)}function al(e){var t=e.child;for(e.child=null;t!==null;){var n=t.sibling;t.sibling=e.child,e.child=t,t=n}}function ol(e,t,n){var r=t.pendingProps,i=r.revealOrder,a=r.tail;r=r.children;var o=Io.current;if(t.flags&128)return Lo(t,o),null;var s=!!(o&2);if(s?(o=o&1|2,t.flags|=128):o&=1,Lo(t,o),i===`backwards`&&e!==null?(al(e),Nc(e,t,r,n),al(e)):Nc(e,t,r,n),r=H?Gi:0,!s&&e!==null&&e.flags&128)a:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&nl(e,n,t);else if(e.tag===19)nl(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break a;for(;e.sibling===null;){if(e.return===null||e.return===t)break a;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(i){case`backwards`:n=rl(t.child),n===null?(i=t.child,t.child=null):(i=n.sibling,n.sibling=null,al(t)),il(t,!0,i,null,a,r);break;case`unstable_legacy-backwards`:for(n=null,i=t.child,t.child=null;i!==null;){if(e=i.alternate,e!==null&&zo(e)===null){t.child=i;break}e=i.sibling,i.sibling=n,n=i,i=e}il(t,!0,n,null,a,r);break;case`together`:il(t,!1,null,null,void 0,r);break;case`independent`:t.memoizedState=null;break;default:n=rl(t.child),n===null?(i=t.child,t.child=null):(i=n.sibling,n.sibling=null),il(t,!1,i,n,a,r)}return t.child}function sl(e,t,n){var r=t.pendingProps;return ga(t,t.type,r.value),Nc(e,t,r.children,n),t.child}function cl(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),od|=t.lanes,(n&t.childLanes)===0){if(e!==null){if(ba(e,t,n,!1),(n&t.childLanes)===0)return null}else return null}if(e!==null&&t.child!==e.child)throw Error(i(153));if(t.child!==null){for(e=t.child,n=Ni(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=Ni(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function ll(e,t){return(e.lanes&t)!==0||(e=e.dependencies,!!(e!==null&&xa(e)))}function ul(e,t,n){switch(t.tag){case 3:De(t,t.stateNode.containerInfo),ga(t,ka,e.memoizedState.cache),ua();break;case 27:case 5:ke(t);break;case 4:De(t,t.stateNode.containerInfo);break;case 10:ga(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,Mo(t),null;break;case 13:var r=t.memoizedState;if(r!==null){if(r.dehydrated!==null)return jo(t),t.flags|=128,null;r=ba(e,t,n,!1);var i=t.child.childLanes;return r||(n&i)!==0?Zc(e,t,n):(jo(t),e=cl(e,t,n),e===null?null:e.sibling)}jo(t);break;case 19:if(t.flags&128)return ol(e,t,n);if(i=!!(e.flags&128),r=(n&t.childLanes)!==0,r||=(ba(e,t,n,!1),(n&t.childLanes)!==0),i){if(r)return ol(e,t,n);t.flags|=128}if(i=t.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),Lo(t,Io.current),r)break;return null;case 22:return t.lanes=0,Lc(e,t,n,t.pendingProps);case 24:ga(t,ka,e.memoizedState.cache)}return cl(e,t,n)}function dl(e,t,n){if(e!==null){if(e.memoizedProps!==t.pendingProps)Mc=!0;else{if(!ll(e,n)&&!(t.flags&128))return Mc=!1,ul(e,t,n);Mc=!!(e.flags&131072)}}else Mc=!1,H&&t.flags&1048576&&Qi(t,Gi,t.index);switch(t.lanes=0,t.tag){case 16:a:{var r=t.pendingProps;if(e=$a(t.elementType),t.type=e,typeof e==`function`)Mi(e)?(r=xc(e,r),t.tag=1,t=Kc(null,t,e,r,n)):(t.tag=0,t=Wc(null,t,e,r,n));else{if(e!=null){var a=e.$$typeof;if(a===D){t.tag=11,t=Pc(null,t,e,r,n);break a}if(a===de){t.tag=14,t=Fc(null,t,e,r,n);break a}if(a===ce){t.tag=10,t.type=e,t=sl(null,t,n);break a}}throw t=be(e)||e,Error(i(306,t,``))}}return t;case 0:return Wc(e,t,t.type,t.pendingProps,n);case 1:return r=t.type,a=xc(r,t.pendingProps),Kc(e,t,r,a,n);case 3:a:{if(De(t,t.stateNode.containerInfo),e===null)throw Error(i(387));r=t.pendingProps;var o=t.memoizedState;a=o.element,mo(e,t),xo(t,r,null,n);var s=t.memoizedState;if(r=s.cache,ga(t,ka,r),r!==o.cache&&ya(t,[ka],n,!0),bo(),r=s.element,o.isDehydrated){if(o={element:r,isDehydrated:!1,cache:s.cache},t.updateQueue.baseState=o,t.memoizedState=o,t.flags&256){t=qc(e,t,r,n);break a}if(r!==a){a=Vi(Error(i(424)),t),fa(a),t=qc(e,t,r,n);break a}switch(e=t.stateNode.containerInfo,e.nodeType){case 9:e=e.body;break;default:e=e.nodeName===`HTML`?e.ownerDocument.body:e}for(V=lm(e.firstChild),na=t,H=!0,ra=null,ia=!0,n=uo(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|134221824,n=n.sibling}else{if(ua(),r===a){t=cl(e,t,n);break a}Nc(e,t,r,n)}t=t.child}return t;case 26:return Uc(e,t),e===null?(n=Nm(t.type,null,t.pendingProps,null))?t.memoizedState=n:H||(t.stateNode=fp(t.type,t.pendingProps,Ee.current,t)):t.memoizedState=Nm(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return ke(t),e===null&&H&&(r=t.stateNode=hm(t.type,t.pendingProps,Ee.current),na=t,ia=!0,a=V,Sp(t.type)?(um=a,V=lm(r.firstChild)):V=a),Nc(e,t,t.pendingProps.children,n),Uc(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&H&&((a=r=V)&&(r=rm(r,t.type,t.pendingProps,ia),r===null?a=!1:(t.stateNode=r,na=t,V=lm(r.firstChild),ia=!1,a=!0)),a||oa(t)),ke(t),a=t.type,o=t.pendingProps,s=e===null?null:e.memoizedProps,r=o.children,pp(a,o)?r=null:s!==null&&pp(a,s)&&(t.flags|=32),t.memoizedState!==null&&(a=Zo(e,t,es,null,null,n),sh._currentValue=a),Uc(e,t),Nc(e,t,r,n),t.child;case 6:return e===null&&H&&((e=n=V)&&(n=im(n,t.pendingProps,ia),n===null?e=!1:(t.stateNode=n,na=t,V=null,e=!0)),e||oa(t)),null;case 13:return Zc(e,t,n);case 4:return De(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=lo(t,null,r,n):Nc(e,t,r,n),t.child;case 11:return Pc(e,t,t.type,t.pendingProps,n);case 7:return r=t.pendingProps,Uc(e,t),Nc(e,t,r,n),t.child;case 8:return Nc(e,t,t.pendingProps.children,n),t.child;case 12:return Nc(e,t,t.pendingProps.children,n),t.child;case 10:return sl(e,t,n);case 9:return a=t.type._context,r=t.pendingProps.children,Sa(t),a=Ca(a),r=r(a),t.flags|=1,Nc(e,t,r,n),t.child;case 14:return Fc(e,t,t.type,t.pendingProps,n);case 15:return Ic(e,t,t.type,t.pendingProps,n);case 19:return ol(e,t,n);case 31:return Hc(e,t,n);case 22:return Lc(e,t,n,t.pendingProps);case 24:return Sa(t),r=Ca(ka),e===null?(a=Wa(),a===null&&(a=q,o=Aa(),a.pooledCache=o,o.refCount++,o!==null&&(a.pooledCacheLanes|=n),a=o),t.memoizedState={parent:r,cache:a},po(t),ga(t,ka,a)):((e.lanes&n)!==0&&(mo(e,t),xo(t,null,null,n),bo()),a=e.memoizedState,o=t.memoizedState,a.parent===r?(r=o.cache,ga(t,ka,r),r!==a.cache&&ya(t,[ka],n,!0)):(a={parent:r,cache:r},t.memoizedState=a,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=a),ga(t,ka,r))),Nc(e,t,t.pendingProps.children,n),t.child;case 30:return t.stateNode===null&&(t.stateNode={autoName:null,paired:null,clones:null,ref:null}),r=t.pendingProps,r.name!=null&&r.name!==`auto`?t.flags|=e===null?18882560:18874368:H&&$i(t),e!==null&&e.memoizedProps.name!==r.name?t.flags|=4194816:Uc(e,t),Nc(e,t,r.children,n),t.child;case 29:throw t.pendingProps}throw Error(i(156,t.tag))}function fl(e){e.flags|=4}function pl(e,t,n,r,i){var a;if((a=!!(e.mode&32))&&(a=n===null?Jm(t,r):Jm(t,r)&&(r.src!==n.src||r.srcSet!==n.srcSet)),a){if(e.flags|=16777216,(i&335544128)===i){if(e.stateNode.complete)e.flags|=8192;else if(Ud())e.flags|=8192;else throw eo=Xa,Ja}}else e.flags&=-16777217}function ml(e,t){if(t.type!==`stylesheet`||t.state.loading&4)e.flags&=-16777217;else if(e.flags|=16777216,!Ym(t)){if(Ud())e.flags|=8192;else throw eo=Xa,Ja}}function hl(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag===22?536870912:dt(),e.lanes|=t,ud|=t)}function gl(e,t){if(!H)switch(e.tailMode){case`visible`:break;case`collapsed`:for(var n=e.tail,r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null;break;default:for(t=e.tail,n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null}}function _l(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags&1206910976,r|=i.flags&1206910976,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function vl(e,t,n){var r=t.pendingProps;switch(ea(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return _l(t),null;case 1:return _l(t),null;case 3:return n=t.stateNode,r=null,e!==null&&(r=e.memoizedState.cache),t.memoizedState.cache!==r&&(t.flags|=2048),_a(ka),Oe(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(la(t)?fl(t):e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,da())),_l(t),null;case 26:var a=t.type,o=t.memoizedState;return e===null?(fl(t),o===null?(_l(t),pl(t,a,null,r,n)):(_l(t),ml(t,o))):o?o===e.memoizedState?(_l(t),t.flags&=-16777217):(fl(t),_l(t),ml(t,o)):(e=e.memoizedProps,e!==r&&fl(t),_l(t),pl(t,a,e,r,n)),null;case 27:if(Ae(t),n=Ee.current,a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&fl(t);else{if(!r){if(t.stateNode===null)throw Error(i(166));return _l(t),t.subtreeFlags&=-33554433,null}e=we.current,la(t)?sa(t,e):(e=hm(a,r,n),t.stateNode=e,fl(t))}return _l(t),t.subtreeFlags&=-33554433,null;case 5:if(Ae(t),a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&fl(t);else{if(!r){if(t.stateNode===null)throw Error(i(166));return _l(t),t.subtreeFlags&=-33554433,null}if(o=we.current,la(t))sa(t,o);else{var s=lp(Ee.current);switch(o){case 1:o=s.createElementNS(`http://www.w3.org/2000/svg`,a);break;case 2:o=s.createElementNS(`http://www.w3.org/1998/Math/MathML`,a);break;default:switch(a){case`svg`:o=s.createElementNS(`http://www.w3.org/2000/svg`,a);break;case`math`:o=s.createElementNS(`http://www.w3.org/1998/Math/MathML`,a);break;case`script`:o=s.createElement(`div`),o.innerHTML=`<script><\/script>`,o=o.removeChild(o.firstChild);break;case`select`:o=typeof r.is==`string`?s.createElement(`select`,{is:r.is}):s.createElement(`select`),r.multiple?o.multiple=!0:r.size&&(o.size=r.size);break;default:o=typeof r.is==`string`?s.createElement(a,{is:r.is}):s.createElement(a)}}o[St]=t,o[Ct]=r;a:for(s=t.child;s!==null;){if(s.tag===5||s.tag===6)o.appendChild(s.stateNode);else if(s.tag!==4&&s.tag!==27&&s.child!==null){s.child.return=s,s=s.child;continue}if(s===t)break a;for(;s.sibling===null;){if(s.return===null||s.return===t)break a;s=s.return}s.sibling.return=s.return,s=s.sibling}t.stateNode=o;a:switch(np(o,a,r),a){case`button`:case`input`:case`select`:case`textarea`:r=!!r.autoFocus;break a;case`img`:r=!0;break a;default:r=!1}r&&fl(t)}}return _l(t),t.subtreeFlags&=-33554433,pl(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==r&&fl(t);else{if(typeof r!=`string`&&t.stateNode===null)throw Error(i(166));if(e=Ee.current,la(t)){if(e=t.stateNode,n=t.memoizedProps,r=null,a=na,a!==null)switch(a.tag){case 27:case 5:r=a.memoizedProps}e[St]=t,e=!!(e.nodeValue===n||r!==null&&!0===r.suppressHydrationWarning||ep(e.nodeValue,n)),e||oa(t,!0)}else e=lp(e).createTextNode(r),e[St]=t,t.stateNode=e}return _l(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(r=la(t),n!==null){if(e===null){if(!r)throw Error(i(318));if(e=t.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(557));e[St]=t}else ua(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;_l(t),e=!1}else n=da(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(Fo(t),t):(Fo(t),null);if(t.flags&128)throw Error(i(558))}return _l(t),null;case 13:if(r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(a=la(t),r!==null&&r.dehydrated!==null){if(e===null){if(!a)throw Error(i(318));if(a=t.memoizedState,a=a===null?null:a.dehydrated,!a)throw Error(i(317));a[St]=t}else ua(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;_l(t),a=!1}else a=da(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),a=!0;if(!a)return t.flags&256?(Fo(t),t):(Fo(t),null)}return Fo(t),t.flags&128?(t.lanes=n,t):(n=r!==null,e=e!==null&&e.memoizedState!==null,n&&(r=t.child,a=null,r.alternate!==null&&r.alternate.memoizedState!==null&&r.alternate.memoizedState.cachePool!==null&&(a=r.alternate.memoizedState.cachePool.pool),o=null,r.memoizedState!==null&&r.memoizedState.cachePool!==null&&(o=r.memoizedState.cachePool.pool),o!==a&&(r.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),hl(t,t.updateQueue),_l(t),null);case 4:return Oe(),e===null&&Wf(t.stateNode.containerInfo),t.flags|=67108864,_l(t),null;case 10:return _a(t.type),_l(t),null;case 19:if(Ro(t),r=t.memoizedState,r===null)return _l(t),null;if(a=!!(t.flags&128),o=r.rendering,o===null){if(a)gl(r,!1);else{if(ad!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(o=zo(e),o!==null){for(t.flags|=128,gl(r,!1),e=o.updateQueue,t.updateQueue=e,hl(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)Pi(n,e),n=n.sibling;return Lo(t,Io.current&1|2),H&&Zi(t,r.treeForkCount),t.child}e=e.sibling}r.tail!==null&&Ue()>gd&&(t.flags|=128,a=!0,gl(r,!1),t.lanes=4194304)}}else{if(!a){if(e=zo(o),e!==null){if(t.flags|=128,a=!0,e=e.updateQueue,t.updateQueue=e,hl(t,e),gl(r,!0),r.tail===null&&r.tailMode!==`collapsed`&&r.tailMode!==`visible`&&!o.alternate&&!H)return _l(t),null}else 2*Ue()-r.renderingStartTime>gd&&n!==536870912&&(t.flags|=128,a=!0,gl(r,!1),t.lanes=4194304)}r.isBackwards?(o.sibling=t.child,t.child=o):(e=r.last,e===null?t.child=o:e.sibling=o,r.last=o)}if(r.tail!==null){e=r.tail;a:{for(n=e;n!==null;){if(n.alternate!==null){n=!1;break a}n=n.sibling}n=!0}return r.rendering=e,r.tail=e.sibling,r.renderingStartTime=Ue(),e.sibling=null,o=Io.current,o=a?o&1|2:o&1,r.tailMode===`visible`||r.tailMode===`collapsed`||!n||H?Lo(t,o):(n=o,P(ko,t),P(Io,n),Ao===null&&(Ao=t)),H&&Zi(t,r.treeForkCount),e}return _l(t),null;case 22:case 23:return Fo(t),Oo(),r=t.memoizedState!==null,e===null?r&&(t.flags|=8192):e.memoizedState!==null!==r&&(t.flags|=8192),r?n&536870912&&!(t.flags&128)&&(_l(t),t.subtreeFlags&6&&(t.flags|=8192)):_l(t),n=t.updateQueue,n!==null&&hl(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),r=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(r=t.memoizedState.cachePool.pool),r!==n&&(t.flags|=2048),e!==null&&N(Ua),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),_a(ka),_l(t),null;case 25:return null;case 30:return t.flags|=33554432,_l(t),null}throw Error(i(156,t.tag))}function yl(e,t){switch(ea(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return _a(ka),Oe(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return Ae(t),null;case 31:if(t.memoizedState!==null){if(Fo(t),t.alternate===null)throw Error(i(340));ua()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(Fo(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(i(340));ua()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return Ro(t),e=t.flags,e&65536?(t.flags=e&-65537|128,e=t.memoizedState,e!==null&&(e.rendering=null,e.tail=null),t.flags|=4,t):null;case 4:return Oe(),null;case 10:return _a(t.type),null;case 22:case 23:return Fo(t),Oo(),e!==null&&N(Ua),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return _a(ka),null;case 25:return null;default:return null}}function bl(e,t){switch(ea(t),t.tag){case 3:_a(ka),Oe();break;case 26:case 27:case 5:Ae(t);break;case 4:Oe();break;case 31:t.memoizedState!==null&&Fo(t);break;case 13:Fo(t);break;case 19:Ro(t);break;case 10:_a(t.type);break;case 22:case 23:Fo(t),Oo(),e!==null&&N(Ua);break;case 24:_a(ka)}}function xl(e,t){try{var n=t.updateQueue,r=n===null?null:n.lastEffect;if(r!==null){var i=r.next;n=i;do{if((n.tag&e)===e){r=void 0;var a=n.create,o=n.inst;r=a(),o.destroy=r}n=n.next}while(n!==i)}}catch(e){Z(t,t.return,e)}}function Sl(e,t,n){try{var r=t.updateQueue,i=r===null?null:r.lastEffect;if(i!==null){var a=i.next;r=a;do{if((r.tag&e)===e){var o=r.inst,s=o.destroy;if(s!==void 0){o.destroy=void 0,i=t;var c=n,l=s;try{l()}catch(e){Z(i,c,e)}}}r=r.next}while(r!==a)}}catch(e){Z(t,t.return,e)}}function Cl(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{Co(t,n)}catch(t){Z(e,e.return,t)}}}function wl(e,t,n){n.props=xc(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(n){Z(e,t,n)}}function Tl(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var r=e.stateNode;break;case 30:var i=e.stateNode,a=gi(e.memoizedProps,i);(i.ref===null||i.ref.name!==a)&&(i.ref=Pp(a)),r=i.ref;break;case 7:if(e.stateNode===null){var o=new Fp(e);h(e.child,!1,Qp,o,void 0,void 0),e.stateNode=o}r=e.stateNode;break;default:r=e.stateNode}typeof n==`function`?e.refCleanup=n(r):n.current=r}}catch(n){Z(e,t,n)}}function El(e,t){var n=e.ref,r=e.refCleanup;if(n!==null){if(typeof r==`function`)try{r()}catch(n){Z(e,t,n)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n==`function`)try{n(null)}catch(n){Z(e,t,n)}else n.current=null}}function Dl(e,t){if((e.tag===5||e.tag===27||e.tag===6)&&e.alternate===null&&t!==null)for(var n=0;n<t.length;n++)em(e.stateNode,t[n])}function Ol(e){for(var t=e.return;t!==null&&(jl(t)&&em(e.stateNode,t.stateNode),!Al(t));)t=t.return}function kl(e){for(var t=e.return;t!==null&&(jl(t)&&tm(e.stateNode,t.stateNode),!Al(t));)t=t.return}function Al(e){return e.tag===5||e.tag===3||e.tag===27}function jl(e){return e&&e.tag===7&&e.stateNode!==null}function Ml(e){var t=e.type,n=e.memoizedProps,r=e.stateNode;try{a:switch(t){case`button`:case`input`:case`select`:case`textarea`:n.autoFocus&&r.focus();break a;case`img`:n.src?r.src=n.src:n.srcSet&&(r.srcset=n.srcSet)}}catch(t){Z(e,e.return,t)}}function Nl(e,t,n){try{var r=e.stateNode;ip(r,e.type,n,t),r[Ct]=t}catch(t){Z(e,e.return,t)}}function Pl(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Sp(e.type)||e.tag===4}function Fl(e){a:for(;;){for(;e.sibling===null;){if(e.return===null||Pl(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Sp(e.type)||e.flags&2||e.child===null||e.tag===4)continue a;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Il(e,t,n,r){var i=e.tag;if(i===5||i===6)i=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName===`HTML`?n.ownerDocument.body:n).insertBefore(i,t):(t=n.nodeType===9?n.body:n.nodeName===`HTML`?n.ownerDocument.body:n,t.appendChild(i),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=_n)),Dl(e,r),B=!0;else if(i!==4&&(i===27&&(Dl(e,r),r=null,Sp(e.type)&&(n=e.stateNode,t=null)),e=e.child,e!==null))for(Il(e,t,n,r),e=e.sibling;e!==null;)Il(e,t,n,r),e=e.sibling}function Ll(e,t,n,r){var i=e.tag;if(i===5||i===6)i=e.stateNode,t?n.insertBefore(i,t):n.appendChild(i),Dl(e,r),B=!0;else if(i!==4&&(i===27&&(Dl(e,r),r=null,Sp(e.type)&&(n=e.stateNode)),e=e.child,e!==null))for(Ll(e,t,n,r),e=e.sibling;e!==null;)Ll(e,t,n,r),e=e.sibling}function Rl(e){var t=e.stateNode,n=e.memoizedProps;try{for(var r=e.type,i=t.attributes;i.length;)t.removeAttributeNode(i[0]);np(t,r,n),t[St]=e,t[Ct]=n}catch(t){Z(e,e.return,t)}}var zl=!1,Bl=null;function Vl(e){(e.tag===30||e.subtreeFlags&33554432)&&(zl=!0)}var Hl=null;function Ul(){var e=Hl;return Hl=null,e}var Wl=0;function Gl(e,t,n,r,i){return Wl=0,Kl(e.child,t,n,r,i)}function Kl(e,t,n,r,i){for(var a=!1;e!==null;){if(e.tag===5){var o=e.stateNode;if(r!==null){var s=Op(o);r.push(s),s.view&&(a=!0)}else a||Op(o).view&&(a=!0);zl=!0,Tp(o,Wl===0?t:t+`_`+Wl,n),Wl++}else e.tag===22&&e.memoizedState!==null||e.tag===30&&i||Kl(e.child,t,n,r,i)&&(a=!0);e=e.sibling}return a}function ql(e,t){for(;e!==null;)e.tag===5?Ep(e.stateNode,e.memoizedProps):e.tag===22&&e.memoizedState!==null||e.tag===30&&t||ql(e.child,t),e=e.sibling}function Jl(e){if(e.subtreeFlags&18874368)for(e=e.child;e!==null;){if((e.tag!==22||e.memoizedState===null)&&(Jl(e),e.tag===30&&e.flags&18874368&&e.stateNode.paired)){var t=e.memoizedProps;if(t.name==null||t.name===`auto`)throw Error(i(544));var n=t.name;t=vi(t.default,t.share),t!==`none`&&(Gl(e,n,t,null,!1)||ql(e.child,!1))}e=e.sibling}}function Yl(e,t){if(e.tag===30){var n=e.stateNode,r=e.memoizedProps,i=gi(r,n),a=vi(r.default,n.paired?r.share:r.enter);a===`none`?Jl(e):Gl(e,i,a,null,!1)?(Jl(e),n.paired||t||Nd(e,r.onEnter)):ql(e.child,!1)}else if(e.subtreeFlags&33554432)for(e=e.child;e!==null;)Yl(e,t),e=e.sibling;else Jl(e)}function Xl(e){if(Bl!==null&&Bl.size!==0){var t=Bl;if(e.subtreeFlags&18874368)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&e.flags&18874368){var n=e.memoizedProps,r=n.name;if(r!=null&&r!==`auto`){var i=t.get(r);if(i!==void 0){var a=vi(n.default,n.share);if(a!==`none`&&(Gl(e,r,a,null,!1)?(a=e.stateNode,i.paired=a,a.paired=i,Nd(e,n.onShare)):ql(e.child,!1)),t.delete(r),t.size===0)break}}}Xl(e)}e=e.sibling}}}function Zl(e){if(e.tag===30){var t=e.memoizedProps,n=gi(t,e.stateNode),r=Bl===null?void 0:Bl.get(n),i=vi(t.default,r===void 0?t.exit:t.share);i!==`none`&&(Gl(e,n,i,null,!1)?r===void 0?Nd(e,t.onExit):(i=e.stateNode,r.paired=i,i.paired=r,Bl.delete(n),Nd(e,t.onShare)):ql(e.child,!1)),Bl!==null&&Xl(e)}else if(e.subtreeFlags&33554432)for(e=e.child;e!==null;)Zl(e),e=e.sibling;else Bl!==null&&Xl(e)}function Ql(e){for(e=e.child;e!==null;){if(e.tag===30){var t=e.memoizedProps,n=gi(t,e.stateNode);t=vi(t.default,t.update),e.flags&=-5,t!==`none`&&Gl(e,n,t,e.memoizedState=[],!1)}else e.subtreeFlags&33554432&&Ql(e);e=e.sibling}}function $l(e){if(e.subtreeFlags&18874368)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&e.flags&18874368){var t=e.stateNode;t.paired!==null&&(t.paired=null,ql(e.child,!1))}$l(e)}e=e.sibling}}function eu(e){if(e.tag===30)e.stateNode.paired=null,ql(e.child,!1),$l(e);else if(e.subtreeFlags&33554432)for(e=e.child;e!==null;)eu(e),e=e.sibling;else $l(e)}function tu(e){for(e=e.child;e!==null;)e.tag===30?ql(e.child,!1):e.subtreeFlags&33554432&&tu(e),e=e.sibling}function nu(e,t,n,r,i,a,o){for(var s=!1;t!==null;){if(t.tag===5){var c=t.stateNode;if(a!==null&&Wl<a.length){var l=a[Wl],u=Op(c);(l.view||u.view)&&(s=!0);var d;if(d=!(e.flags&4)){if(u.clip)d=!0;else{d=l.rect;var f=u.rect;d=d.y!==f.y||d.x!==f.x||d.height!==f.height||d.width!==f.width}}d&&(e.flags|=4),u.abs?u=!l.abs:(l=l.rect,u=u.rect,u=l.height!==u.height||l.width!==u.width),u&&(e.flags|=32)}else e.flags|=32;e.flags&4&&Tp(c,Wl===0?n:n+`_`+Wl,i),s&&e.flags&4||(Hl===null&&(Hl=[]),Hl.push(c,Wl===0?r:r+`_`+Wl,t.memoizedProps)),Wl++}else(t.tag!==22||t.memoizedState===null)&&(t.tag===30&&o?e.flags|=t.flags&32:nu(e,t.child,n,r,i,a,o)&&(s=!0));t=t.sibling}return s}function ru(e,t){for(e=e.child;e!==null;){if(e.tag===30){var n=e.memoizedProps,r=e.stateNode,i=gi(n,r),a=vi(n.default,n.update);if(t){r=r.clones;var o=r===null?null:r.map(kp)}else o=e.memoizedState,e.memoizedState=null;r=e;var s=e.child;Wl=0,i=nu(r,s,i,i,a,o,!1),e.flags&4&&i&&(t||Nd(e,n.onUpdate))}else e.subtreeFlags&33554432&&ru(e,t);e=e.sibling}}var iu=!1,G=!1,au=!1,ou=!1,su=typeof WeakSet==`function`?WeakSet:Set,cu=null,lu=!1,uu=!1,du=!1,fu=!1;function pu(e,t,n){if(e=e.containerInfo,sp=gh,e=Kr(e),qr(e)){if(`selectionStart`in e)var r={start:e.selectionStart,end:e.selectionEnd};else a:{r=(r=e.ownerDocument)&&r.defaultView||window;var i=r.getSelection&&r.getSelection();if(i&&i.rangeCount!==0){r=i.anchorNode;var a=i.anchorOffset,o=i.focusNode;i=i.focusOffset;try{r.nodeType,o.nodeType}catch{r=null;break a}var s=0,c=-1,l=-1,u=0,d=0,f=e,p=null;b:for(;;){for(var m;f!==r||a!==0&&f.nodeType!==3||(c=s+a),f!==o||i!==0&&f.nodeType!==3||(l=s+i),f.nodeType===3&&(s+=f.nodeValue.length),(m=f.firstChild)!==null;)p=f,f=m;for(;;){if(f===e)break b;if(p===r&&++u===a&&(c=s),p===o&&++d===i&&(l=s),(m=f.nextSibling)!==null)break;f=p,p=f.parentNode}f=m}r=c===-1||l===-1?null:{start:c,end:l}}else r=null}r||={start:0,end:0}}else r=null;for(cp={focusedElem:e,selectionRange:r},gh=!1,n=(n&335544064)===n,cu=t,t=n?9270:1024;cu!==null;){if(e=cu,n&&(r=e.deletions,r!==null))for(a=0;a<r.length;a++)n&&Zl(r[a]);if(e.alternate===null&&e.flags&2)n&&Vl(e),mu(n);else{if(e.tag===22){if(r=e.alternate,e.memoizedState!==null){r!==null&&r.memoizedState===null&&n&&Zl(r),mu(n);continue}if(r!==null&&r.memoizedState!==null){n&&Vl(e),mu(n);continue}}r=e.child,(e.subtreeFlags&t)!==0&&r!==null?(r.return=e,cu=r):(n&&Ql(e),mu(n))}}Bl=null}function mu(e){for(;cu!==null;){var t=cu,n=e,r=t.alternate,a=t.flags;switch(t.tag){case 0:case 11:case 15:break;case 1:if(a&1024&&r!==null){n=void 0,a=r.memoizedProps,r=r.memoizedState;var o=t.stateNode;try{var s=xc(t.type,a);n=o.getSnapshotBeforeUpdate(s,r),o.__reactInternalSnapshotBeforeUpdate=n}catch(e){Z(t,t.return,e)}}break;case 3:if(a&1024){if(r=t.stateNode.containerInfo,n=r.nodeType,n===9)nm(r);else if(n===1)switch(r.nodeName){case`HEAD`:case`HTML`:case`BODY`:nm(r);break;default:r.textContent=``}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;case 30:n&&r!==null&&(n=gi(r.memoizedProps,r.stateNode),a=t.memoizedProps,a=vi(a.default,a.update),a!==`none`&&Gl(r,n,a,r.memoizedState=[],!0));break;default:if(a&1024)throw Error(i(163))}if(r=t.sibling,r!==null){r.return=t.return,cu=r;break}cu=t.return}}function hu(e,t,n){var r=n.flags;switch(n.tag){case 0:case 11:case 15:Fu(e,n),r&4&&xl(5,n);break;case 1:if(Fu(e,n),r&4){if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(e){Z(n,n.return,e)}else{var i=xc(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(i,t,e.__reactInternalSnapshotBeforeUpdate)}catch(e){Z(n,n.return,e)}}}r&64&&Cl(n),r&512&&Tl(n,n.return);break;case 3:if(Fu(e,n),r&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{Co(e,t)}catch(e){Z(n,n.return,e)}}break;case 27:t===null&&r&4&&Rl(n);case 26:case 5:Fu(e,n),t===null&&r&4&&Ml(n),r&512&&Tl(n,n.return);break;case 12:Fu(e,n);break;case 31:Fu(e,n),r&4&&wu(e,n);break;case 13:Fu(e,n),r&4&&Tu(e,n),r&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=_f.bind(null,n),cm(e,n))));break;case 22:if(r=n.memoizedState!==null||iu,!r){var a=t!==null&&t.memoizedState!==null||G;t=iu,i=G,iu=r,(G=a)&&!i?(r=2,n.subtreeFlags&8772&&(r|=1),Lu(e,n,r)):Fu(e,n),iu=t,G=i}break;case 30:Fu(e,n),r&512&&Tl(n,n.return);break;case 7:r&512&&Tl(n,n.return);default:Fu(e,n)}}function gu(e,t){for(e=e.child;e!==null;)_u(e,t),e=e.sibling}function _u(e,t){switch(e.tag){case 5:case 26:try{var n=e.stateNode;if(t){var r=n.style;typeof r.setProperty==`function`?r.setProperty(`display`,`none`,`important`):r.display=`none`}else{var i=e.stateNode,a=e.memoizedProps.style,o=a!=null&&a.hasOwnProperty(`display`)?a.display:null;i.style.display=o==null||typeof o==`boolean`?``:(``+o).trim()}}catch(t){Z(e,e.return,t)}vu(e,t);break;case 6:try{e.stateNode.nodeValue=t?``:e.memoizedProps,B=!0}catch(t){Z(e,e.return,t)}break;case 18:try{var s=e.stateNode;t?wp(s,!0):wp(e.stateNode,!1)}catch(t){Z(e,e.return,t)}break;case 22:case 23:e.memoizedState===null&&gu(e,t);break;default:gu(e,t)}}function vu(e,t){if(e.subtreeFlags&67108864)for(e=e.child;e!==null;){a:{var n=e,r=t;switch(n.tag){case 4:_u(n,r);break a;case 22:n.memoizedState===null&&vu(n,r);break a;default:vu(n,r)}}e=e.sibling}}function yu(e){var t=e.alternate;t!==null&&(e.alternate=null,yu(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&jt(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var bu=null,xu=!1;function Su(e,t,n){for(n=n.child;n!==null;)Cu(e,t,n),n=n.sibling}function Cu(e,t,n){if($e&&typeof $e.onCommitFiberUnmount==`function`)try{$e.onCommitFiberUnmount(Qe,n)}catch{}switch(n.tag){case 26:G||El(n,t),Su(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&!G&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:G||El(n,t),kl(n);var r=bu,i=xu;Sp(n.type)&&(bu=n.stateNode,xu=!1),Su(e,t,n),gm(n.stateNode,n.type,n.memoizedProps),bu=r,xu=i;break;case 5:G||El(n,t),kl(n);case 6:if(n.tag===6&&kl(n),r=bu,i=xu,bu=null,Su(e,t,n),bu=r,xu=i,bu!==null){if(xu)try{(bu.nodeType===9?bu.body:bu.nodeName===`HTML`?bu.ownerDocument.body:bu).removeChild(n.stateNode),B=!0}catch(e){Z(n,t,e)}else try{bu.removeChild(n.stateNode),B=!0}catch(e){Z(n,t,e)}}break;case 18:bu!==null&&(xu?(e=bu,Cp(e.nodeType===9?e.body:e.nodeName===`HTML`?e.ownerDocument.body:e,n.stateNode),Hh(e)):Cp(bu,n.stateNode));break;case 4:r=bu,i=xu,bu=n.stateNode.containerInfo,xu=!0,Su(e,t,n),bu=r,xu=i;break;case 0:case 11:case 14:case 15:Sl(2,n,t),G||Sl(4,n,t),Su(e,t,n);break;case 1:G||(El(n,t),r=n.stateNode,typeof r.componentWillUnmount==`function`&&wl(n,t,r)),Su(e,t,n);break;case 21:Su(e,t,n);break;case 22:G=(r=G)||n.memoizedState!==null,Su(e,t,n),G=r;break;case 30:El(n,t),Su(e,t,n);break;case 7:G||El(n,t),Su(e,t,n);break;default:Su(e,t,n)}}function wu(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Hh(e)}catch(e){Z(t,t.return,e)}}}function Tu(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Hh(e)}catch(e){Z(t,t.return,e)}}function Eu(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new su),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new su),t;default:throw Error(i(435,e.tag))}}function Du(e,t){var n=Eu(e);t.forEach(function(t){if(!n.has(t)){n.add(t);var r=vf.bind(null,e,t);t.then(r,r)}})}function Ou(e,t,n){var r=t.deletions;if(r!==null)for(var a=0;a<r.length;a++){var o=r[a],s=e,c=t,l=c;a:for(;l!==null;){switch(l.tag){case 27:if(Sp(l.type)){bu=l.stateNode,xu=!1;break a}break;case 5:bu=l.stateNode,xu=!1;break a;case 3:case 4:bu=l.stateNode.containerInfo,xu=!0;break a}l=l.return}if(bu===null)throw Error(i(160));Cu(s,c,o),bu=null,xu=!1,s=o.alternate,s!==null&&(s.return=null),o.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)Au(t,e,n),t=t.sibling}var ku=null;function Au(e,t,n){var r=e.alternate,a=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(a&4&&(r=e.updateQueue,r=r===null?null:r.events,r!==null))for(var o=0;o<r.length;o++){var s=r[o];s.ref.impl=s.nextImpl}Ou(t,e,n),ju(e),a&4&&(Sl(3,e,e.return),xl(3,e),Sl(5,e,e.return));break;case 1:Ou(t,e,n),ju(e),a&512&&(G||r===null||El(r,r.return)),a&64&&iu&&(e=e.updateQueue,e!==null&&(t=e.callbacks,t!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?t:n.concat(t))));break;case 26:if(o=ku,Ou(t,e,n),ju(e),a&512&&(G||r===null||El(r,r.return)),a&4){if(a=r===null?null:r.memoizedState,n=e.memoizedState,r===null){if(n===null){if(e.stateNode===null){if(iu)e.stateNode=fp(e.type,e.memoizedProps,t.containerInfo,e);else{a:{t=e.type,n=e.memoizedProps,a=o.ownerDocument||o;b:switch(t){case`title`:r=a.getElementsByTagName(`title`)[0],(!r||r[kt]||r[St]||r.namespaceURI===`http://www.w3.org/2000/svg`||r.hasAttribute(`itemprop`))&&(r=a.createElement(t),a.head.insertBefore(r,a.querySelector(`head > title`))),np(r,t,n),r[St]=e,Ft(r),t=r;break a;case`link`:if(o=Gm(`link`,`href`,a).get(t+(n.href||``))){for(s=0;s<o.length;s++)if(r=o[s],r.getAttribute(`href`)===(n.href==null||n.href===``?null:n.href)&&r.getAttribute(`rel`)===(n.rel==null?null:n.rel)&&r.getAttribute(`title`)===(n.title==null?null:n.title)&&r.getAttribute(`crossorigin`)===(n.crossOrigin==null?null:n.crossOrigin)){o.splice(s,1);break b}}r=a.createElement(t),np(r,t,n),a.head.appendChild(r);break;case`meta`:if(o=Gm(`meta`,`content`,a).get(t+(n.content||``))){for(s=0;s<o.length;s++)if(r=o[s],r.getAttribute(`content`)===(n.content==null?null:``+n.content)&&r.getAttribute(`name`)===(n.name==null?null:n.name)&&r.getAttribute(`property`)===(n.property==null?null:n.property)&&r.getAttribute(`http-equiv`)===(n.httpEquiv==null?null:n.httpEquiv)&&r.getAttribute(`charset`)===(n.charSet==null?null:n.charSet)){o.splice(s,1);break b}}r=a.createElement(t),np(r,t,n),a.head.appendChild(r);break;default:throw Error(i(468,t))}r[St]=e,Ft(r),t=r}e.stateNode=t}}else iu||Km(o,e.type,e.stateNode)}else e.stateNode=Bm(o,n,e.memoizedProps)}else a===n?n===null&&e.stateNode!==null&&Nl(e,e.memoizedProps,r.memoizedProps):(a===null?(t=r.stateNode,t===null||G||t.parentNode.removeChild(t)):a.count--,n===null?iu||Km(o,e.type,e.stateNode):Bm(o,n,e.memoizedProps))}break;case 27:Ou(t,e,n),ju(e),a&512&&(G||r===null||El(r,r.return)),r!==null&&a&4&&Nl(e,e.memoizedProps,r.memoizedProps);break;case 5:if(o=au,au=!1,Ou(t,e,n),au=o,ju(e),a&512&&(G||r===null||El(r,r.return)),e.flags&32){t=e.stateNode;try{ln(t,``),B=!0}catch(t){Z(e,e.return,t)}}a&4&&e.stateNode!=null&&(t=e.memoizedProps,Nl(e,t,r===null?t:r.memoizedProps)),a&1024&&(ou=!0);break;case 6:if(Ou(t,e,n),ju(e),a&4){if(e.stateNode===null)throw Error(i(162));t=e.memoizedProps,n=e.stateNode;try{n.nodeValue=t,B=!0}catch(t){Z(e,e.return,t)}}break;case 3:if(B=!1,Wm=null,o=ku,ku=bm(t.containerInfo),Ou(t,e,n),ku=o,ju(e),a&4&&r!==null&&r.memoizedState.isDehydrated)try{Hh(t.containerInfo)}catch(t){Z(e,e.return,t)}ou&&(ou=!1,Mu(e)),B=!1;break;case 4:a=au,au=iu,r=Gt(),o=ku,ku=bm(e.stateNode.containerInfo),Ou(t,e,n),ju(e),ku=o,B&&uu&&(du=!0),B=r,au=a;break;case 12:Ou(t,e,n),ju(e);break;case 31:Ou(t,e,n),ju(e),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,Du(e,t)));break;case 13:Ou(t,e,n),ju(e),e.child.flags&8192&&e.memoizedState!==null!=(r!==null&&r.memoizedState!==null)&&(md=Ue()),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,Du(e,t)));break;case 22:o=e.memoizedState!==null,s=r!==null&&r.memoizedState!==null;var c=iu,l=G,u=au;iu=c||o,au=u||o,G=l||s,Ou(t,e,n),G=l,au=u,iu=c,ju(e),a&8192&&(t=e.stateNode,t._visibility=o?t._visibility&-2:t._visibility|1,!o||r===null||s||iu||G||(t=s||G,n=iu,r=G,iu=o||iu,G=t,Iu(e,2),iu=n,G=r),!o&&au||gu(e,o)),a&4&&(t=e.updateQueue,t!==null&&(n=t.retryQueue,n!==null&&(t.retryQueue=null,Du(e,n))));break;case 19:Ou(t,e,n),ju(e),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,Du(e,t)));break;case 30:a&512&&(G||r===null||El(r,r.return)),a=Gt(),o=uu,s=(n&335544064)===n,c=e.memoizedProps,uu=s&&vi(c.default,c.update)!==`none`,Ou(t,e,n),ju(e),s&&r!==null&&B&&(e.flags|=4),uu=o,B=a;break;case 21:break;case 7:a&512&&(G||r===null||El(r,r.return)),r&&r.stateNode!==null&&(r.stateNode._fragmentFiber=e);default:Ou(t,e,n),ju(e)}}function ju(e){var t=e.flags;if(t&2){try{for(var n,r=e.return;r!==null;){if(Pl(r)){n=r;break}r=r.return}r=null;for(var a=e.return;a!==null;){if(jl(a)){var o=a.stateNode;r===null?r=[o]:r.push(o)}if(Al(a))break;a=a.return}var s=r;if(n==null)throw Error(i(160));switch(n.tag){case 27:var c=n.stateNode;Ll(e,Fl(e),c,s);break;case 5:var l=n.stateNode;n.flags&32&&(ln(l,``),n.flags&=-33),Ll(e,Fl(e),l,s);break;case 3:case 4:var u=n.stateNode.containerInfo;Il(e,Fl(e),u,s);break;default:throw Error(i(161))}}catch(t){Z(e,e.return,t)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Mu(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;Mu(t),t.tag===5&&t.flags&1024&&(t=t.stateNode,gh=!0,t.reset(),gh=!1),e=e.sibling}}function Nu(e,t){if(t.subtreeFlags&9270)for(t=t.child;t!==null;)Pu(t,e),t=t.sibling;else ru(t,!1)}function Pu(e,t){var n=e.alternate;if(n===null)Yl(e,!1);else switch(e.tag){case 3:if(fu=lu=!1,Ul(),Nu(t,e),!lu&&!du){if(e=Hl,e!==null)for(var r=0;r<e.length;r+=3){n=e[r];var i=e[r+1];Ep(n,e[r+2]),n=n.ownerDocument.documentElement,n!==null&&n.animate({opacity:[0,0],pointerEvents:[`none`,`none`]},{duration:0,fill:`forwards`,pseudoElement:`::view-transition-group(`+i+`)`})}e=t.containerInfo,e=e.nodeType===9?e.documentElement:e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName===``&&(e.style.viewTransitionName=`none`,e.animate({opacity:[0,0],pointerEvents:[`none`,`none`]},{duration:0,fill:`forwards`,pseudoElement:`::view-transition-group(root)`}),e.animate({width:[0,0],height:[0,0]},{duration:0,fill:`forwards`,pseudoElement:`::view-transition`})),fu=!0}Hl=null;break;case 5:Nu(t,e);break;case 4:r=lu,lu=!1,Nu(t,e),lu&&(du=!0),lu=r;break;case 22:e.memoizedState===null&&(n.memoizedState===null?Nu(t,e):Yl(e,!1));break;case 30:r=lu,i=Ul(),lu=!1,Nu(t,e),lu&&(e.flags|=4);var a=e.memoizedProps,o=e.stateNode;t=gi(a,o),o=gi(n.memoizedProps,o);var s=vi(a.default,a.update);s===`none`?t=!1:(a=n.memoizedState,n.memoizedState=null,n=e.child,Wl=0,t=nu(e,n,t,o,s,a,!0),Wl!==(a===null?0:a.length)&&(e.flags|=32)),e.flags&4&&t?(Nd(e,e.memoizedProps.onUpdate),Hl=i):i!==null&&(i.push.apply(i,Hl),Hl=i),lu=e.flags&32?!0:r;break;default:Nu(t,e)}}function Fu(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)hu(e,t.alternate,t),t=t.sibling}function Iu(e,t){for(e=e.child;e!==null;){var n=e,r=t;switch(n.tag){case 0:case 11:case 14:case 15:Sl(4,n,n.return),Iu(n,r);break;case 1:El(n,n.return);var i=n.stateNode;typeof i.componentWillUnmount==`function`&&wl(n,n.return,i),Iu(n,r);break;case 27:r&2&&gm(n.stateNode,n.type,n.memoizedProps);case 5:El(n,n.return),n.tag!==5&&n.tag!==27||kl(n),Iu(n,r);break;case 6:kl(n);break;case 26:El(n,n.return),i=n.stateNode,n.memoizedState!==null||i===null||G||i.parentNode.removeChild(i),Iu(n,r);break;case 22:n.memoizedState===null&&Iu(n,r);break;case 30:El(n,n.return),Iu(n,r);break;case 7:El(n,n.return);default:Iu(n,r)}e=e.sibling}}function Lu(e,t,n){for(n=t.subtreeFlags&8772?n:n&-2,t=t.child;t!==null;){var r=t.alternate,i=e,a=t,o=a.flags,s=!!(n&1);switch(a.tag){case 0:case 11:case 15:Lu(i,a,n),xl(4,a);break;case 1:if(Lu(i,a,n),r=a,i=r.stateNode,typeof i.componentDidMount==`function`)try{i.componentDidMount()}catch(e){Z(r,r.return,e)}if(r=a,i=r.updateQueue,i!==null){var c=r.stateNode;try{var l=i.shared.hiddenCallbacks;if(l!==null)for(i.shared.hiddenCallbacks=null,i=0;i<l.length;i++)So(l[i],c)}catch(e){Z(r,r.return,e)}}s&&o&64&&Cl(a),Tl(a,a.return);break;case 27:n&2&&Rl(a);case 5:a.tag!==5&&a.tag!==27||Ol(a),Lu(i,a,n),s&&r===null&&o&4&&Ml(a),Tl(a,a.return);break;case 6:Ol(a);break;case 26:c=a.stateNode,a.memoizedState!==null||c===null||iu||Km(bm(c.ownerDocument),a.type,c),Lu(i,a,n),s&&r===null&&o&4&&Ml(a),Tl(a,a.return);break;case 12:Lu(i,a,n);break;case 31:Lu(i,a,n),s&&o&4&&wu(i,a);break;case 13:Lu(i,a,n),s&&o&4&&Tu(i,a);break;case 22:a.memoizedState===null&&Lu(i,a,n),Tl(a,a.return);break;case 30:Lu(i,a,n),Tl(a,a.return);break;case 7:Tl(a,a.return);default:Lu(i,a,n)}t=t.sibling}}function Ru(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&ja(n))}function zu(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&ja(e))}function Bu(e,t,n,r){var i=(n&335544064)===n;if(t.subtreeFlags&(i?10262:10256))for(t=t.child;t!==null;)Vu(e,t,n,r),t=t.sibling;else i&&tu(t)}function Vu(e,t,n,r){var i=(n&335544064)===n;i&&t.alternate===null&&t.return!==null&&t.return.alternate!==null&&eu(t);var a=t.flags;switch(t.tag){case 0:case 11:case 15:Bu(e,t,n,r),a&2048&&xl(9,t);break;case 1:Bu(e,t,n,r);break;case 3:Bu(e,t,n,r),i&&fu&&(e=e.containerInfo,e=e.nodeType===9?e.body:e.nodeName===`HTML`?e.ownerDocument.body:e,e.style.viewTransitionName===`root`&&(e.style.viewTransitionName=``),e=e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName===`none`&&(e.style.viewTransitionName=``)),a&2048&&(a=null,t.alternate!==null&&(a=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==a&&(t.refCount++,a!=null&&ja(a)));break;case 12:if(a&2048){Bu(e,t,n,r),a=t.stateNode;try{var o=t.memoizedProps,s=o.id,c=o.onPostCommit;typeof c==`function`&&c(s,t.alternate===null?`mount`:`update`,a.passiveEffectDuration,-0)}catch(e){Z(t,t.return,e)}}else Bu(e,t,n,r);break;case 31:Bu(e,t,n,r);break;case 13:Bu(e,t,n,r);break;case 23:break;case 22:o=t.stateNode,s=t.alternate,t.memoizedState===null?(i&&s!==null&&s.memoizedState!==null&&eu(t),o._visibility&2?Bu(e,t,n,r):(o._visibility|=2,Hu(e,t,n,r,!!(t.subtreeFlags&10256)||!1))):(i&&s!==null&&s.memoizedState===null&&eu(s),o._visibility&2?Bu(e,t,n,r):Uu(e,t)),a&2048&&Ru(s,t);break;case 24:Bu(e,t,n,r),a&2048&&zu(t.alternate,t);break;case 30:i&&(a=t.alternate,a!==null&&(ql(a.child,!0),ql(t.child,!0))),Bu(e,t,n,r);break;default:Bu(e,t,n,r)}}function Hu(e,t,n,r,i){for(i&&=!!(t.subtreeFlags&10256)||!1,t=t.child;t!==null;){var a=e,o=t,s=n,c=r,l=o.flags;switch(o.tag){case 0:case 11:case 15:Hu(a,o,s,c,i),xl(8,o);break;case 23:break;case 22:var u=o.stateNode;o.memoizedState===null?(u._visibility|=2,Hu(a,o,s,c,i)):u._visibility&2?Hu(a,o,s,c,i):Uu(a,o),i&&l&2048&&Ru(o.alternate,o);break;case 24:Hu(a,o,s,c,i),i&&l&2048&&zu(o.alternate,o);break;default:Hu(a,o,s,c,i)}t=t.sibling}}function Uu(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,r=t,i=r.flags;switch(r.tag){case 22:Uu(n,r),i&2048&&Ru(r.alternate,r);break;case 24:Uu(n,r),i&2048&&zu(r.alternate,r);break;default:Uu(n,r)}t=t.sibling}}var Wu=8192;function Gu(e,t,n){if(e.subtreeFlags&Wu)for(e=e.child;e!==null;)Ku(e,t,n),e=e.sibling}function Ku(e,t,n){switch(e.tag){case 26:Gu(e,t,n),e.flags&Wu&&(e.memoizedState===null?(e=e.stateNode,(t&335544128)===t&&Zm(n,e)):Qm(n,ku,e.memoizedState,e.memoizedProps));break;case 5:Gu(e,t,n),e.flags&Wu&&(e=e.stateNode,(t&335544128)===t&&Zm(n,e));break;case 3:case 4:var r=ku;ku=bm(e.stateNode.containerInfo),Gu(e,t,n),ku=r;break;case 22:e.memoizedState===null&&(r=e.alternate,r!==null&&r.memoizedState!==null?(r=Wu,Wu=16777216,Gu(e,t,n),Wu=r):Gu(e,t,n));break;case 30:if((e.flags&Wu)!==0&&(r=e.memoizedProps.name,r!=null&&r!==`auto`)){var i=e.stateNode;i.paired=null,Bl===null&&(Bl=new Map),Bl.set(r,i)}Gu(e,t,n);break;default:Gu(e,t,n)}}function qu(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function Ju(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];cu=r,Zu(r,e)}qu(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Yu(e),e=e.sibling}function Yu(e){switch(e.tag){case 0:case 11:case 15:Ju(e),e.flags&2048&&Sl(9,e,e.return);break;case 3:Ju(e);break;case 12:Ju(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,Xu(e)):Ju(e);break;default:Ju(e)}}function Xu(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];cu=r,Zu(r,e)}qu(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:Sl(8,t,t.return),Xu(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,Xu(t));break;default:Xu(t)}e=e.sibling}}function Zu(e,t){for(;cu!==null;){var n=cu;switch(n.tag){case 0:case 11:case 15:Sl(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var r=n.memoizedState.cachePool.pool;r!=null&&r.refCount++}break;case 24:ja(n.memoizedState.cache)}if(r=n.child,r!==null)r.return=n,cu=r;else a:for(n=e;cu!==null;){r=cu;var i=r.sibling,a=r.return;if(yu(r),r===n){cu=null;break a}if(i!==null){i.return=a,cu=i;break a}cu=a}}}var Qu={getCacheForType:function(e){var t=Ca(ka),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return Ca(ka).controller.signal}},$u=typeof WeakMap==`function`?WeakMap:Map,K=0,q=null,J=null,Y=0,X=0,ed=null,td=!1,nd=!1,rd=!1,id=0,ad=0,od=0,sd=0,cd=0,ld=0,ud=0,dd=null,fd=null,pd=!1,md=0,hd=0,gd=1/0,_d=null,vd=null,yd=0,bd=null,xd=null,Sd=0,Cd=0,wd=null,Td=null,Ed=null,Dd=null,Od=null,kd=0,Ad=null;function jd(){return K&2&&Y!==0?Y&-Y:A.T===null?yt():Pf()}function Md(){if(ld===0){if(!(Y&536870912)||H){var e=at;at<<=1,!(at&3932160)&&(at=262144),ld=e}else ld=536870912}return e=ko.current,e!==null&&(e.flags|=32),ld}function Nd(e,t){if(t!=null){var n=e.stateNode,r=n.ref;r===null&&(r=n.ref=Pp(gi(e.memoizedProps,n))),Dd===null&&(Dd=[]),Dd.push(t.bind(null,r))}}function Pd(e,t,n){(e===q&&(X===2||X===9)||e.cancelPendingCommit!==null)&&(Vd(e,0),Rd(e,Y,ld,!1)),pt(e,n),K&2&&e===q||(e===q&&(!(K&2)&&(sd|=n),ad===4&&Rd(e,Y,ld,!1)),Ef(e))}function Fd(e,t,n){if(K&6)throw Error(i(327));var r=!n&&!(t&127)&&(t&e.expiredLanes)===0||lt(e,t),a=r?Yd(e,t):qd(e,t,!0),o=r;do{if(a===0){nd&&!r&&Rd(e,t,0,!1);break}if(n=e.current.alternate,o&&!Ld(n))a=qd(e,t,!1),o=!1;else{if(a===2){if(o=t,e.errorRecoveryDisabledLanes&o)var s=0;else s=e.pendingLanes&-536870913,s=s===0?s&536870912?536870912:0:s;if(s!==0){t=s;a:{var c=e;a=dd;var l=c.current.memoizedState.isDehydrated;if(l&&(Vd(c,s).flags|=256),s=qd(c,s,!1),s!==2&&s!==6){if(rd&&!l){c.errorRecoveryDisabledLanes|=o,sd|=o,a=4;break a}o=fd,fd=a,o!==null&&(fd===null?fd=o:fd.push.apply(fd,o))}a=s}if(o=!1,a!==2)continue}}if(a===1){Vd(e,0),Rd(e,t,0,!0);break}a:{switch(r=e,o=a,o){case 0:case 1:throw Error(i(345));case 4:if((t&4194048)!==t&&(t&62914560)!==t)break;case 6:Rd(r,t,ld,!td);break a;case 2:fd=null;break;case 3:case 5:break;default:throw Error(i(329))}if((t&62914560)===t&&(a=md+300-Ue(),10<a)){if(Rd(r,t,ld,!td),ct(r,0,!0)!==0)break a;Sd=t,r.timeoutHandle=gp(Id.bind(null,r,n,fd,_d,pd,t,ld,sd,ud,td,o,`Throttled`,-0,0),a);break a}Id(r,n,fd,_d,pd,t,ld,sd,ud,td,o,null,-0,0)}break}}while(1);Ef(e)}function Id(e,t,n,r,i,a,o,s,c,l,u,d,f,p){e.timeoutHandle=-1;var m=t.subtreeFlags,h=(a&335544064)===a;d=null,(h||m&8192||(m&16785408)==16785408)&&(d={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:_n},Bl=null,Ku(t,a,d),h&&(m=d,h=e.containerInfo,h=(h.nodeType===9?h:h.ownerDocument).__reactViewTransition,h!=null&&(m.count++,m.waitingForViewTransition=!0,m=nh.bind(m),h.finished.then(m,m))),m=(a&62914560)===a?md-Ue():(a&4194048)===a?hd-Ue():0,m=eh(d,m),m!==null)?(Sd=a,e.cancelPendingCommit=m(nf.bind(null,e,t,a,n,r,i,o,s,c,l,u,d,null,f,p)),Rd(e,a,o,!l)):nf(e,t,a,n,r,i,o,s,c,l,u,d)}function Ld(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var r=0;r<n.length;r++){var i=n[r],a=i.getSnapshot;i=i.value;try{if(!Br(a(),i))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Rd(e,t,n,r){t=L(e,t),t&=~cd,t&=~sd,e.suspendedLanes|=t,e.pingedLanes&=~t,r&&(e.warmLanes|=t),r=e.expirationTimes;for(var i=t;0<i;){var a=31-tt(i),o=1<<a;r[a]=-1,i&=~o}n!==0&&ht(e,n,t)}function zd(){return K&6?!0:(Df(0,!1),!1)}function Bd(){if(J!==null){if(X===0)var e=J.return;else e=J,ha=ma=null,rs(e),ro=null,io=0,e=J;for(;e!==null;)bl(e.alternate,e),e=e.return;J=null}}function Vd(e,t){var n=e.timeoutHandle;return n!==-1&&(e.timeoutHandle=-1,_p(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),Sd=0,Bd(),q=e,J=n=Ni(e.current,null),Y=t,X=0,ed=null,td=!1,nd=lt(e,t),rd=!1,ud=ld=cd=sd=od=ad=0,fd=dd=null,pd=!1,id=L(e,t),Ci(),n}function Hd(e,t){U=null,A.H=pc,t===qa||t===Ya?(t=to(),X=3):t===Ja?(t=to(),X=4):X=t===jc?8:typeof t==`object`&&t&&typeof t.then==`function`?6:1,ed=t,J===null&&(ad=1,Tc(e,Vi(t,e.current)))}function Ud(){var e=ko.current;return e===null?!0:(Y&4194048)===Y?Ao===null:(Y&62914560)===Y||Y&536870912?e===Ao:!1}function Wd(){var e=A.H;return A.H=pc,e===null?pc:e}function Gd(){var e=A.A;return A.A=Qu,e}function Kd(){ad=4,td||(Y&4194048)!==Y&&ko.current!==null||(nd=!0),!(od&134217727)&&!(sd&134217727)||q===null||Rd(q,Y,ld,!1)}function qd(e,t,n){var r=K;K|=2;var i=Wd(),a=Gd();(q!==e||Y!==t)&&(_d=null,Vd(e,t)),t=!1;var o=ad;a:do try{if(X!==0&&J!==null){var s=J,c=ed;switch(X){case 8:Bd(),o=6;break a;case 3:case 2:case 9:case 6:ko.current===null&&(t=!0);var l=X;if(X=0,ed=null,$d(e,s,c,l),n&&nd){o=0;break a}break;default:l=X,X=0,ed=null,$d(e,s,c,l)}}Jd(),o=ad;break}catch(t){Hd(e,t)}while(1);return t&&e.shellSuspendCounter++,ha=ma=null,K=r,A.H=i,A.A=a,J===null&&(q=null,Y=0,Ci()),o}function Jd(){for(;J!==null;)Zd(J)}function Yd(e,t){var n=K;K|=2;var r=Wd(),a=Gd();q!==e||Y!==t?(_d=null,gd=Ue()+500,Vd(e,t)):nd=lt(e,t);a:do try{if(X!==0&&J!==null){t=J;var o=ed;b:switch(X){case 1:X=0,ed=null,$d(e,t,o,1);break;case 2:case 9:if(Za(o)){X=0,ed=null,Qd(t);break}t=function(){X!==2&&X!==9||q!==e||(X=7),Ef(e)},o.then(t,t);break a;case 3:X=7;break a;case 4:X=5;break a;case 7:Za(o)?(X=0,ed=null,Qd(t)):(X=0,ed=null,$d(e,t,o,7));break;case 5:var s=null;switch(J.tag){case 26:s=J.memoizedState;case 5:case 27:var c=J;if(s?Ym(s):c.stateNode.complete){X=0,ed=null;var l=c.sibling;if(l!==null)J=l;else{var u=c.return;u===null?J=null:(J=u,ef(u))}break b}}X=0,ed=null,$d(e,t,o,5);break;case 6:X=0,ed=null,$d(e,t,o,6);break;case 8:Bd(),ad=6;break a;default:throw Error(i(462))}}Xd();break}catch(t){Hd(e,t)}while(1);return ha=ma=null,A.H=r,A.A=a,K=n,J===null?(q=null,Y=0,Ci(),ad):0}function Xd(){for(;J!==null&&!Ve();)Zd(J)}function Zd(e){var t=dl(e.alternate,e,id);e.memoizedProps=e.pendingProps,t===null?ef(e):J=t}function Qd(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=Gc(n,t,t.pendingProps,t.type,void 0,Y);break;case 11:t=Gc(n,t,t.pendingProps,t.type.render,t.ref,Y);break;case 5:rs(t);var r=t;r===na&&(H?(ca(r),r.tag===5&&r.stateNode!=null&&(V=r.stateNode)):(ca(r),H=!0));default:bl(n,t),t=J=Pi(t,id),t=dl(n,t,id)}e.memoizedProps=e.pendingProps,t===null?ef(e):J=t}function $d(e,t,n,r){ha=ma=null,rs(t),ro=null,io=0;var i=t.return;try{if(Ac(e,i,t,n,Y)){ad=1,Tc(e,Vi(n,e.current)),J=null;return}}catch(t){if(i!==null)throw J=i,t;ad=1,Tc(e,Vi(n,e.current)),J=null;return}t.flags&32768?(H||r===1?e=!0:nd||Y&536870912?e=!1:(td=e=!0,(r===2||r===9||r===3||r===6)&&(r=ko.current,r!==null&&r.tag===13&&(r.flags|=16384))),tf(t,e)):ef(t)}function ef(e){var t=e;do{if(t.flags&32768){tf(t,td);return}e=t.return;var n=vl(t.alternate,t,id);if(n!==null){J=n;return}if(t=t.sibling,t!==null){J=t;return}J=t=e}while(t!==null);ad===0&&(ad=5)}function tf(e,t){do{var n=yl(e.alternate,e);if(n!==null){n.flags&=32767,J=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){J=e;return}J=e=n}while(e!==null);ad=6,J=null}function nf(e,t,n,r,a,o,s,c,l,u,d,f){e.cancelPendingCommit=null;do df();while(yd!==0);if(K&6)throw Error(i(327));if(t!==null){if(t===e.current)throw Error(i(177));e===q&&(J=q=null,Y=0),xd=t,bd=e,Sd=n,wd=a,Td=r,rf(e,t,n,s,c,l,f)}}function rf(e,t,n,r,i,a,o){var s=t.lanes|t.childLanes;if(Cd=s,s|=Si,mt(e,n,s,r,i,a),Dd=null,(n&335544064)===n?(Od=Pa(e),r=10262):(Od=null,r=10256),(t.subtreeFlags&r)!==0||(t.flags&r)!==0?(e.callbackNode=null,e.callbackPriority=0,yf(qe,function(){return ff(),null})):(e.callbackNode=null,e.callbackPriority=0),zl=!1,r=!!(t.flags&13878),t.subtreeFlags&13878||r){r=A.T,A.T=null,i=j.p,j.p=2,a=K,K|=4;try{pu(e,t,n)}finally{K=a,j.p=i,A.T=r}}yd=1,zl?Ed=Mp(o,e.containerInfo,Od,sf,cf,of,lf,ff,af,null,null):(sf(),cf(),lf())}function af(e){if(yd!==0){var t=bd.onRecoverableError;t(e,{componentStack:null})}}function of(){yd===3&&(yd=0,Pu(xd,bd),yd=4)}function sf(){if(yd===1){yd=0;var e=bd,t=xd,n=Sd,r=!!(t.flags&13878);if(t.subtreeFlags&13878||r){r=A.T,A.T=null;var i=j.p;j.p=2;var a=K;K|=4;try{uu=du=!1,Au(t,e,n),n=cp;var o=Kr(e.containerInfo),s=n.focusedElem,c=n.selectionRange;if(o!==s&&s&&s.ownerDocument&&Gr(s.ownerDocument.documentElement,s)){if(c!==null&&qr(s)){var l=c.start,u=c.end;if(u===void 0&&(u=l),`selectionStart`in s)s.selectionStart=l,s.selectionEnd=Math.min(u,s.value.length);else{var d=s.ownerDocument||document,f=d&&d.defaultView||window;if(f.getSelection){var p=f.getSelection(),m=s.textContent.length,h=Math.min(c.start,m),g=c.end===void 0?h:Math.min(c.end,m);!p.extend&&h>g&&(o=g,g=h,h=o);var _=Wr(s,h),v=Wr(s,g);if(_&&v&&(p.rangeCount!==1||p.anchorNode!==_.node||p.anchorOffset!==_.offset||p.focusNode!==v.node||p.focusOffset!==v.offset)){var y=d.createRange();y.setStart(_.node,_.offset),p.removeAllRanges(),h>g?(p.addRange(y),p.extend(v.node,v.offset)):(y.setEnd(v.node,v.offset),p.addRange(y))}}}}for(d=[],p=s;p=p.parentNode;)p.nodeType===1&&d.push({element:p,left:p.scrollLeft,top:p.scrollTop});for(typeof s.focus==`function`&&s.focus(),s=0;s<d.length;s++){var b=d[s];b.element.scrollLeft=b.left,b.element.scrollTop=b.top}}gh=!!sp,cp=sp=null}finally{K=a,j.p=i,A.T=r}}e.current=t,yd=2}}function cf(){if(yd===2){yd=0;var e=bd,t=xd,n=!!(t.flags&8772);if(t.subtreeFlags&8772||n){n=A.T,A.T=null;var r=j.p;j.p=2;var i=K;K|=4;try{hu(e,t.alternate,t)}finally{K=i,j.p=r,A.T=n}}yd=3}}function lf(){if(yd===4||yd===3){yd=0;var e=Ed;Ed=null,He();var t=bd,n=xd,r=Sd,i=Td,a=(r&335544064)===r?10262:10256;if((n.subtreeFlags&a)!==0||(n.flags&a)!==0?yd=5:(yd=0,xd=bd=null,uf(t,t.pendingLanes)),a=t.pendingLanes,a===0&&(vd=null),vt(r),n=n.stateNode,$e&&typeof $e.onCommitFiberRoot==`function`)try{$e.onCommitFiberRoot(Qe,n,void 0,(n.current.flags&128)==128)}catch{}if(i!==null){n=A.T,a=j.p,j.p=2,A.T=null;try{for(var o=t.onRecoverableError,s=0;s<i.length;s++){var c=i[s];o(c.value,{componentStack:c.stack})}}finally{A.T=n,j.p=a}}if(i=Dd,o=Od,Od=null,i!==null&&(Dd=null,o===null&&(o=[]),e!==null))for(c=0;c<i.length;c++)n=(0,i[c])(o),n!==void 0&&e.finished.finally(n);Sd&3&&df(),Ef(t),a=t.pendingLanes,r&261930&&a&42?t===Ad?kd++:(kd=0,Ad=t):(kd=0,Ad=null),Df(0,!1)}}function uf(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,ja(t)))}function df(){return Ed!==null&&(Ed.skipTransition(),Ed=null),sf(),cf(),lf(),ff()}function ff(){if(yd!==5)return!1;var e=bd,t=Cd;Cd=0;var n=vt(Sd),r=A.T,a=j.p;try{j.p=32>n?32:n,A.T=null,n=wd,wd=null;var o=bd,s=Sd;if(yd=0,xd=bd=null,Sd=0,K&6)throw Error(i(331));var c=K;if(K|=4,Yu(o.current),Vu(o,o.current,s,n),K=c,Df(0,!1),$e&&typeof $e.onPostCommitFiberRoot==`function`)try{$e.onPostCommitFiberRoot(Qe,o)}catch{}return!0}finally{j.p=a,A.T=r,uf(e,t)}}function pf(e,t,n){t=Vi(n,t),t=Dc(e.stateNode,t,2),e=go(e,t,2),e!==null&&(pt(e,2),Ef(e))}function Z(e,t,n){if(e.tag===3)pf(e,e,n);else for(;t!==null;){if(t.tag===3){pf(t,e,n);break}if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError==`function`||typeof r.componentDidCatch==`function`&&(vd===null||!vd.has(r))){e=Vi(n,e),n=Oc(2),r=go(t,n,2),r!==null&&(kc(n,r,t,e),pt(r,2),Ef(r));break}}t=t.return}}function mf(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new $u;var i=new Set;r.set(t,i)}else i=r.get(t),i===void 0&&(i=new Set,r.set(t,i));i.has(n)||(rd=!0,i.add(n),e=hf.bind(null,e,t,n),t.then(e,e))}function hf(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,q===e&&(Y&n)===n&&(ad===4||ad===3&&(Y&62914560)===Y&&300>Ue()-md?K&2?cd|=n:Vd(e,0):cd|=n,ud===Y&&(ud=0)),Ef(e)}function gf(e,t){t===0&&(t=dt()),e=Ei(e,t),e!==null&&(pt(e,t),Ef(e))}function _f(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),gf(e,n)}function vf(e,t){var n=0;switch(e.tag){case 31:case 13:var r=e.stateNode,a=e.memoizedState;a!==null&&(n=a.retryLane);break;case 19:r=e.stateNode;break;case 22:r=e.stateNode._retryCache;break;default:throw Error(i(314))}r!==null&&r.delete(t),gf(e,n)}function yf(e,t){return ze(e,t)}var bf=null,xf=null,Sf=!1,Cf=!1,wf=!1,Tf=0;function Ef(e){e!==xf&&e.next===null&&(xf===null?bf=xf=e:xf=xf.next=e),Cf=!0,Sf||(Sf=!0,Nf())}function Df(e,t){if(!wf&&Cf){wf=!0;do for(var n=!1,r=bf;r!==null;){if(!t){if(e!==0){var i=r.pendingLanes;if(i===0)var a=0;else{var o=r.suspendedLanes,s=r.pingedLanes;a=(1<<31-tt(42|e)+1)-1,a&=i&~(o&~s),a=a&201326741?a&201326741|1:a?a|2:0}a!==0&&(n=!0,Mf(r,a))}else a=Y,a=ct(r,r===q?a:0,r.cancelPendingCommit!==null||r.timeoutHandle!==-1),!(a&3)||lt(r,a)||(n=!0,Mf(r,a))}r=r.next}while(n);wf=!1}}function Of(){kf()}function kf(){Cf=Sf=!1;var e=0;Tf!==0&&hp()&&(e=Tf);for(var t=Ue(),n=null,r=bf;r!==null;){var i=r.next,a=Af(r,t);a===0?(r.next=null,n===null?bf=i:n.next=i,i===null&&(xf=n)):(n=r,(e!==0||a&3)&&(Cf=!0)),r=i}yd!==0&&yd!==5||Df(e,!1),Tf!==0&&(Tf=0)}function Af(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,i=e.expirationTimes,a=e.pendingLanes&-62914561;0<a;){var o=31-tt(a),s=1<<o,c=i[o];c===-1?((s&n)===0||(s&r)!==0)&&(i[o]=ut(s,t)):c<=t&&(e.expiredLanes|=s),a&=~s}if(t=q,n=Y,n=ct(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r=e.callbackNode,n===0||e===t&&(X===2||X===9)||e.cancelPendingCommit!==null)return r!==null&&r!==null&&Be(r),e.callbackNode=null,e.callbackPriority=0;if(!(n&3)||lt(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(r!==null&&Be(r),vt(n)){case 2:case 8:n=Ke;break;case 32:n=qe;break;case 268435456:n=Ye;break;default:n=qe}return r=jf.bind(null,e),n=ze(n,r),e.callbackPriority=t,e.callbackNode=n,t}return r!==null&&r!==null&&Be(r),e.callbackPriority=2,e.callbackNode=null,2}function jf(e,t){if(yd!==0&&yd!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(df()&&e.callbackNode!==n)return null;var r=Y;return r=ct(e,e===q?r:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r===0?null:(Fd(e,r,t),Af(e,Ue()),e.callbackNode!=null&&e.callbackNode===n?jf.bind(null,e):null)}function Mf(e,t){if(df())return null;Fd(e,t,!0)}function Nf(){bp(function(){K&6?ze(Ge,Of):kf()})}function Pf(){if(Tf===0){var e=La;e===0&&(e=I,I<<=1,!(I&261888)&&(I=256)),Tf=e}return Tf}function Ff(e){return e==null||typeof e==`symbol`||typeof e==`boolean`?null:typeof e==`function`?e:gn(e)}function If(e,t,n,r,i){if(t===`submit`&&n&&n.stateNode===i){var a=Ff((i[Ct]||null).action),o=r.submitter;o&&(t=(t=o[Ct]||null)?Ff(t.formAction):o.getAttribute(`formAction`),t!==null&&(a=t,o=null));var s=new Rn(`action`,`action`,null,r,i);e.push({event:s,listeners:[{instance:null,listener:function(){if(r.defaultPrevented){if(Tf!==0){var e=new FormData(i,o);$s(n,{pending:!0,data:e,method:i.method,action:a},null,e)}}else typeof a==`function`&&(s.preventDefault(),e=new FormData(i,o),$s(n,{pending:!0,data:e,method:i.method,action:a},a,e))},currentTarget:i}]})}}for(var Lf=0;Lf<pi.length;Lf++){var Rf=pi[Lf];mi(Rf.toLowerCase(),`on`+(Rf[0].toUpperCase()+Rf.slice(1)))}mi(ai,`onAnimationEnd`),mi(oi,`onAnimationIteration`),mi(si,`onAnimationStart`),mi(`dblclick`,`onDoubleClick`),mi(`focusin`,`onFocus`),mi(`focusout`,`onBlur`),mi(ci,`onTransitionRun`),mi(li,`onTransitionStart`),mi(ui,`onTransitionCancel`),mi(di,`onTransitionEnd`),Bt(`onMouseEnter`,[`mouseout`,`mouseover`]),Bt(`onMouseLeave`,[`mouseout`,`mouseover`]),Bt(`onPointerEnter`,[`pointerout`,`pointerover`]),Bt(`onPointerLeave`,[`pointerout`,`pointerover`]),zt(`onChange`,`change click focusin focusout input keydown keyup selectionchange`.split(` `)),zt(`onSelect`,`focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange`.split(` `)),zt(`onBeforeInput`,[`compositionend`,`keypress`,`textInput`,`paste`]),zt(`onCompositionEnd`,`compositionend focusout keydown keypress keyup mousedown`.split(` `)),zt(`onCompositionStart`,`compositionstart focusout keydown keypress keyup mousedown`.split(` `)),zt(`onCompositionUpdate`,`compositionupdate focusout keydown keypress keyup mousedown`.split(` `));var zf=`abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting`.split(` `),Bf=new Set(`beforetoggle cancel close invalid load scroll scrollend toggle`.split(` `).concat(zf));function Vf(e,t){t=!!(t&4);for(var n=0;n<e.length;n++){var r=e[n],i=r.event;r=r.listeners;a:{var a=void 0;if(t)for(var o=r.length-1;0<=o;o--){var s=r[o],c=s.instance,l=s.currentTarget;if(s=s.listener,c!==a&&i.isPropagationStopped())break a;a=s,i.currentTarget=l;try{a(i)}catch(e){yi(e)}i.currentTarget=null,a=c}else for(o=0;o<r.length;o++){if(s=r[o],c=s.instance,l=s.currentTarget,s=s.listener,c!==a&&i.isPropagationStopped())break a;a=s,i.currentTarget=l;try{a(i)}catch(e){yi(e)}i.currentTarget=null,a=c}}}}function Q(e,t){var n=t[Tt];n===void 0&&(n=t[Tt]=new Set);var r=e+`__bubble`;n.has(r)||(Gf(t,e,2,!1),n.add(r))}function Hf(e,t,n){var r=0;t&&(r|=4),Gf(n,e,r,t)}var Uf=`_reactListening`+Math.random().toString(36).slice(2);function Wf(e){if(!e[Uf]){e[Uf]=!0,Lt.forEach(function(t){t!==`selectionchange`&&(Bf.has(t)||Hf(t,!1,e),Hf(t,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Uf]||(t[Uf]=!0,Hf(`selectionchange`,!1,t))}}function Gf(e,t,n,r){switch(Ch(t)){case 2:var i=_h;break;case 8:i=vh;break;default:i=yh}n=i.bind(null,t,n,e),i=void 0,!Dn||t!==`touchstart`&&t!==`touchmove`&&t!==`wheel`||(i=!0),r?i===void 0?e.addEventListener(t,n,!0):e.addEventListener(t,n,{capture:!0,passive:i}):i===void 0?e.addEventListener(t,n,!1):e.addEventListener(t,n,{passive:i})}function Kf(e,t,n,r,i){var a=r;if(!(t&1)&&!(t&2)&&r!==null)a:for(;;){if(r===null)return;var s=r.tag;if(s===3||s===4){var c=r.stateNode.containerInfo;if(c===i)break;if(s===4)for(s=r.return;s!==null;){var l=s.tag;if((l===3||l===4)&&s.stateNode.containerInfo===i)return;s=s.return}for(;c!==null;){if(s=Mt(c),s===null)return;if(l=s.tag,l===5||l===6||l===26||l===27){r=a=s;continue a}c=c.parentNode}}r=r.return}wn(function(){var r=a,i=yn(n),s=[];a:{var c=fi.get(e);if(c!==void 0){var l=Rn,u=e;switch(e){case`keypress`:if(Nn(n)===0)break a;case`keydown`:case`keyup`:l=nr;break;case`focusin`:u=`focus`,l=qn;break;case`focusout`:u=`blur`,l=qn;break;case`beforeblur`:case`afterblur`:l=qn;break;case`click`:if(n.button===2)break a;case`auxclick`:case`dblclick`:case`mousedown`:case`mousemove`:case`mouseup`:case`mouseout`:case`mouseover`:case`contextmenu`:l=Gn;break;case`drag`:case`dragend`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`dragstart`:case`drop`:l=Kn;break;case`touchcancel`:case`touchend`:case`touchmove`:case`touchstart`:l=ar;break;case ai:case oi:case si:l=Jn;break;case di:l=or;break;case`scroll`:case`scrollend`:l=Bn;break;case`wheel`:l=sr;break;case`copy`:case`cut`:case`paste`:l=Yn;break;case`gotpointercapture`:case`lostpointercapture`:case`pointercancel`:case`pointerdown`:case`pointermove`:case`pointerout`:case`pointerover`:case`pointerup`:l=rr;break;case`submit`:l=ir;break;case`toggle`:case`beforetoggle`:l=cr}var d=!!(t&4),f=!d&&(e===`scroll`||e===`scrollend`),p=d?c===null?null:c+`Capture`:c;d=[];for(var m=r,h;m!==null;){var g=m;if(h=g.stateNode,g=g.tag,g!==5&&g!==26&&g!==27||h===null||p===null||(g=Tn(m,p),g!=null&&d.push(qf(m,g,h))),f)break;m=m.return}0<d.length&&(c=new l(c,u,null,n,i),s.push({event:c,listeners:d}))}}if(!(t&7)){a:{if(l=e===`mouseover`||e===`pointerover`,c=e===`mouseout`||e===`pointerout`,l&&n!==vn&&(u=n.relatedTarget||n.fromElement)&&(Mt(u)||u[wt]))break a;(c||l)&&(u=i.window===i?i:(l=i.ownerDocument)?l.defaultView||l.parentWindow:window,c?(l=n.relatedTarget||n.toElement,c=r,l=l?Mt(l):null,l!==null&&(f=o(l),d=l.tag,l!==f||d!==5&&d!==27&&d!==6)&&(l=null)):(c=null,l=r),c!==l&&(d=Gn,g=`onMouseLeave`,p=`onMouseEnter`,m=`mouse`,(e===`pointerout`||e===`pointerover`)&&(d=rr,g=`onPointerLeave`,p=`onPointerEnter`,m=`pointer`),f=c==null?u:Pt(c),h=l==null?u:Pt(l),u=new d(g,m+`leave`,c,n,i),u.target=f,u.relatedTarget=h,g=null,Mt(i)===r&&(d=new d(p,m+`enter`,l,n,i),d.target=h,d.relatedTarget=f,g=d),f=g,d=c&&l?te(c,l,Yf):null,c!==null&&Xf(s,u,c,d,!1),l!==null&&f!==null&&Xf(s,f,l,d,!0)))}a:{if(c=r?Pt(r):window,l=c.nodeName&&c.nodeName.toLowerCase(),l===`select`||l===`input`&&c.type===`file`)var _=Or;else if(Sr(c)){if(kr)_=Rr;else{_=Ir;var v=Fr}}else l=c.nodeName,!l||l.toLowerCase()!==`input`||c.type!==`checkbox`&&c.type!==`radio`?r&&pn(r.elementType)&&(_=Or):_=Lr;if(_&&=_(e,r)){Cr(s,_,n,i);break a}v&&v(e,c,r)}switch(v=r?Pt(r):window,e){case`focusin`:(Sr(v)||v.contentEditable===`true`)&&(Yr=v,Xr=r,Zr=null);break;case`focusout`:Zr=Xr=Yr=null;break;case`mousedown`:Qr=!0;break;case`contextmenu`:case`mouseup`:case`dragend`:Qr=!1,$r(s,n,i);break;case`selectionchange`:if(Jr)break;case`keydown`:case`keyup`:$r(s,n,i)}var y;if(ur)b:{switch(e){case`compositionstart`:var b=`onCompositionStart`;break b;case`compositionend`:b=`onCompositionEnd`;break b;case`compositionupdate`:b=`onCompositionUpdate`;break b}b=void 0}else vr?gr(e,n)&&(b=`onCompositionEnd`):e===`keydown`&&n.keyCode===229&&(b=`onCompositionStart`);b&&(pr&&n.locale!==`ko`&&(vr||b!==`onCompositionStart`?b===`onCompositionEnd`&&vr&&(y=Mn()):(kn=i,An=`value`in kn?kn.value:kn.textContent,vr=!0)),v=Jf(r,b),0<v.length&&(b=new Xn(b,e,null,n,i),s.push({event:b,listeners:v}),y?b.data=y:(y=_r(n),y!==null&&(b.data=y)))),(y=fr?yr(e,n):br(e,n))&&(b=Jf(r,`onBeforeInput`),0<b.length&&(v=new Xn(`onBeforeInput`,`beforeinput`,null,n,i),s.push({event:v,listeners:b}),v.data=y)),If(s,e,r,n,i)}Vf(s,t)})}function qf(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Jf(e,t){for(var n=t+`Capture`,r=[];e!==null;){var i=e,a=i.stateNode;if(i=i.tag,i!==5&&i!==26&&i!==27||a===null||(i=Tn(e,n),i!=null&&r.unshift(qf(e,i,a)),i=Tn(e,t),i!=null&&r.push(qf(e,i,a))),e.tag===3)return r;e=e.return}return[]}function Yf(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function Xf(e,t,n,r,i){for(var a=t._reactName,o=[];n!==null&&n!==r;){var s=n,c=s.alternate,l=s.stateNode;if(s=s.tag,c!==null&&c===r)break;s!==5&&s!==26&&s!==27||l===null||(c=l,i?(l=Tn(n,a),l!=null&&o.unshift(qf(n,l,c))):i||(l=Tn(n,a),l!=null&&o.push(qf(n,l,c)))),n=n.return}o.length!==0&&e.push({event:t,listeners:o})}var Zf=/\r\n?/g,Qf=/\u0000|\uFFFD/g;function $f(e){return(typeof e==`string`?e:``+e).replace(Zf,`
`).replace(Qf,``)}function ep(e,t){return t=$f(t),$f(e)===t}function $(e,t,n,r,a,o){switch(n){case`children`:if(typeof r==`string`)t===`body`||t===`textarea`&&r===``||ln(e,r);else if(typeof r==`number`||typeof r==`bigint`)t!==`body`&&ln(e,``+r);else return;break;case`className`:qt(e,`class`,r);break;case`tabIndex`:qt(e,`tabindex`,r);break;case`dir`:case`role`:case`viewBox`:case`width`:case`height`:qt(e,n,r);break;case`style`:fn(e,r,o);return;case`data`:if(t!==`object`){qt(e,`data`,r);break}case`src`:case`href`:if(r===``&&(t!==`a`||n!==`href`)||r==null||typeof r==`function`||typeof r==`symbol`||typeof r==`boolean`){e.removeAttribute(n);break}r=gn(r),e.setAttribute(n,r);break;case`action`:case`formAction`:if(typeof r==`function`){e.setAttribute(n,`javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')`);break}if(typeof o==`function`&&(n===`formAction`?(t!==`input`&&$(e,t,`name`,a.name,a,null),$(e,t,`formEncType`,a.formEncType,a,null),$(e,t,`formMethod`,a.formMethod,a,null),$(e,t,`formTarget`,a.formTarget,a,null)):($(e,t,`encType`,a.encType,a,null),$(e,t,`method`,a.method,a,null),$(e,t,`target`,a.target,a,null))),r==null||typeof r==`symbol`||typeof r==`boolean`){e.removeAttribute(n);break}r=gn(r),e.setAttribute(n,r);break;case`onClick`:r!=null&&(e.onclick=_n);return;case`onScroll`:r!=null&&Q(`scroll`,e);return;case`onScrollEnd`:r!=null&&Q(`scrollend`,e);return;case`dangerouslySetInnerHTML`:if(r!=null){if(typeof r!=`object`||!(`__html`in r))throw Error(i(61));if(n=r.__html,n!=null){if(a.children!=null)throw Error(i(60));o?.__html!==n&&(e.innerHTML=n)}}break;case`multiple`:e.multiple=r&&typeof r!=`function`&&typeof r!=`symbol`;break;case`muted`:e.muted=r&&typeof r!=`function`&&typeof r!=`symbol`;break;case`suppressContentEditableWarning`:case`suppressHydrationWarning`:case`defaultValue`:case`defaultChecked`:case`innerHTML`:case`ref`:break;case`autoFocus`:break;case`xlinkHref`:if(r==null||typeof r==`function`||typeof r==`boolean`||typeof r==`symbol`){e.removeAttribute(`xlink:href`);break}n=gn(r),e.setAttributeNS(`http://www.w3.org/1999/xlink`,`xlink:href`,n);break;case`contentEditable`:case`spellCheck`:case`draggable`:case`value`:case`autoReverse`:case`externalResourcesRequired`:case`focusable`:case`preserveAlpha`:r!=null&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,r):e.removeAttribute(n);break;case`inert`:case`allowFullScreen`:case`async`:case`autoPlay`:case`controls`:case`credentialless`:case`default`:case`defer`:case`disabled`:case`disablePictureInPicture`:case`disableRemotePlayback`:case`formNoValidate`:case`hidden`:case`loop`:case`noModule`:case`noValidate`:case`open`:case`playsInline`:case`readOnly`:case`required`:case`reversed`:case`scoped`:case`seamless`:case`itemScope`:r&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,``):e.removeAttribute(n);break;case`capture`:case`download`:!0===r?e.setAttribute(n,``):!1!==r&&r!=null&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,r):e.removeAttribute(n);break;case`cols`:case`rows`:case`size`:case`span`:r!=null&&typeof r!=`function`&&typeof r!=`symbol`&&!isNaN(r)&&1<=r?e.setAttribute(n,r):e.removeAttribute(n);break;case`rowSpan`:case`start`:r==null||typeof r==`function`||typeof r==`symbol`||isNaN(r)?e.removeAttribute(n):e.setAttribute(n,r);break;case`popover`:Q(`beforetoggle`,e),Q(`toggle`,e),Kt(e,`popover`,r);break;case`xlinkActuate`:Jt(e,`http://www.w3.org/1999/xlink`,`xlink:actuate`,r);break;case`xlinkArcrole`:Jt(e,`http://www.w3.org/1999/xlink`,`xlink:arcrole`,r);break;case`xlinkRole`:Jt(e,`http://www.w3.org/1999/xlink`,`xlink:role`,r);break;case`xlinkShow`:Jt(e,`http://www.w3.org/1999/xlink`,`xlink:show`,r);break;case`xlinkTitle`:Jt(e,`http://www.w3.org/1999/xlink`,`xlink:title`,r);break;case`xlinkType`:Jt(e,`http://www.w3.org/1999/xlink`,`xlink:type`,r);break;case`xmlBase`:Jt(e,`http://www.w3.org/XML/1998/namespace`,`xml:base`,r);break;case`xmlLang`:Jt(e,`http://www.w3.org/XML/1998/namespace`,`xml:lang`,r);break;case`xmlSpace`:Jt(e,`http://www.w3.org/XML/1998/namespace`,`xml:space`,r);break;case`is`:Kt(e,`is`,r);break;case`innerText`:case`textContent`:return;default:if(!(2<n.length)||n[0]!==`o`&&n[0]!==`O`||n[1]!==`n`&&n[1]!==`N`)n=mn.get(n)||n,Kt(e,n,r);else return}B=!0}function tp(e,t,n,r,a,o){switch(n){case`style`:fn(e,r,o);return;case`dangerouslySetInnerHTML`:if(r!=null){if(typeof r!=`object`||!(`__html`in r))throw Error(i(61));if(n=r.__html,n!=null){if(a.children!=null)throw Error(i(60));o?.__html!==n&&(e.innerHTML=n)}}break;case`children`:if(typeof r==`string`)ln(e,r);else if(typeof r==`number`||typeof r==`bigint`)ln(e,``+r);else return;break;case`onScroll`:r!=null&&Q(`scroll`,e);return;case`onScrollEnd`:r!=null&&Q(`scrollend`,e);return;case`onClick`:r!=null&&(e.onclick=_n);return;case`suppressContentEditableWarning`:case`suppressHydrationWarning`:case`innerHTML`:case`ref`:return;case`innerText`:case`textContent`:return;default:if(!Rt.hasOwnProperty(n))a:{if(n[0]===`o`&&n[1]===`n`&&(a=n.endsWith(`Capture`),o=n.slice(2,a?n.length-7:void 0),t=e[Ct]||null,t=t==null?null:t[n],typeof t==`function`&&e.removeEventListener(o,t,a),typeof r==`function`)){typeof t!=`function`&&t!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(o,r,a);break a}B=!0,n in e?e[n]=r:!0===r?e.setAttribute(n,``):Kt(e,n,r)}return}B=!0}function np(e,t,n){switch(t){case`div`:case`span`:case`svg`:case`path`:case`a`:case`g`:case`p`:case`li`:break;case`img`:Q(`error`,e),Q(`load`,e);var r=!1,a=!1,o;for(o in n)if(n.hasOwnProperty(o)){var s=n[o];if(s!=null)switch(o){case`src`:r=!0;break;case`srcSet`:a=!0;break;case`children`:case`dangerouslySetInnerHTML`:throw Error(i(137,t));default:$(e,t,o,s,n,null)}}a&&$(e,t,`srcSet`,n.srcSet,n,null),r&&$(e,t,`src`,n.src,n,null);return;case`input`:Q(`invalid`,e);var c=o=s=a=null,l=null,u=null;for(r in n)if(n.hasOwnProperty(r)){var d=n[r];if(d!=null)switch(r){case`name`:a=d;break;case`type`:s=d;break;case`checked`:l=d;break;case`defaultChecked`:u=d;break;case`value`:o=d;break;case`defaultValue`:c=d;break;case`children`:case`dangerouslySetInnerHTML`:if(d!=null)throw Error(i(137,t));break;default:$(e,t,r,d,n,null)}}rn(e,o,c,l,u,s,a,!1);return;case`select`:for(a in Q(`invalid`,e),r=s=o=null,n)if(n.hasOwnProperty(a)&&(c=n[a],c!=null))switch(a){case`value`:o=c;break;case`defaultValue`:s=c;break;case`multiple`:r=c;default:$(e,t,a,c,n,null)}t=o,n=s,e.multiple=!!r,t==null?n!=null&&on(e,!!r,n,!0):on(e,!!r,t,!1);return;case`textarea`:for(s in Q(`invalid`,e),o=a=r=null,n)if(n.hasOwnProperty(s)&&(c=n[s],c!=null))switch(s){case`value`:r=c;break;case`defaultValue`:a=c;break;case`children`:o=c;break;case`dangerouslySetInnerHTML`:if(c!=null)throw Error(i(91));break;default:$(e,t,s,c,n,null)}cn(e,r,a,o);return;case`option`:for(l in n)if(n.hasOwnProperty(l)&&(r=n[l],r!=null))switch(l){case`selected`:e.selected=r&&typeof r!=`function`&&typeof r!=`symbol`;break;default:$(e,t,l,r,n,null)}return;case`dialog`:Q(`beforetoggle`,e),Q(`toggle`,e),Q(`cancel`,e),Q(`close`,e);break;case`iframe`:case`object`:Q(`load`,e);break;case`video`:case`audio`:for(r=0;r<zf.length;r++)Q(zf[r],e);break;case`image`:Q(`error`,e),Q(`load`,e);break;case`details`:Q(`toggle`,e);break;case`embed`:case`source`:case`link`:Q(`error`,e),Q(`load`,e);case`area`:case`base`:case`br`:case`col`:case`hr`:case`keygen`:case`meta`:case`param`:case`track`:case`wbr`:case`menuitem`:for(u in n)if(n.hasOwnProperty(u)&&(r=n[u],r!=null))switch(u){case`children`:case`dangerouslySetInnerHTML`:throw Error(i(137,t));default:$(e,t,u,r,n,null)}return;default:if(pn(t)){for(d in n)n.hasOwnProperty(d)&&(r=n[d],r!==void 0&&tp(e,t,d,r,n,void 0));return}}for(c in n)n.hasOwnProperty(c)&&(r=n[c],r!=null&&$(e,t,c,r,n,null))}var rp={};function ip(e,t,n,r){switch(t){case`div`:case`span`:case`svg`:case`path`:case`a`:case`g`:case`p`:case`li`:break;case`input`:var a=null,o=null,s=null,c=null,l=null,u=null,d=null;for(m in n){var f=n[m];if(n.hasOwnProperty(m)&&f!=null)switch(m){case`checked`:break;case`value`:break;case`defaultValue`:l=f;default:r.hasOwnProperty(m)||$(e,t,m,null,r,f)}}for(var p in r){var m=r[p];if(f=n[p],r.hasOwnProperty(p)&&(m!=null||f!=null))switch(p){case`type`:m!==f&&(B=!0),o=m;break;case`name`:m!==f&&(B=!0),a=m;break;case`checked`:m!==f&&(B=!0),u=m;break;case`defaultChecked`:m!==f&&(B=!0),d=m;break;case`value`:m!==f&&(B=!0),s=m;break;case`defaultValue`:m!==f&&(B=!0),c=m;break;case`children`:case`dangerouslySetInnerHTML`:if(m!=null)throw Error(i(137,t));break;default:m!==f&&$(e,t,p,m,r,f)}}nn(e,s,c,l,u,d,o,a);return;case`select`:for(o in m=s=c=p=null,n)if(l=n[o],n.hasOwnProperty(o)&&l!=null)switch(o){case`value`:break;case`multiple`:m=l;default:r.hasOwnProperty(o)||$(e,t,o,null,r,l)}for(a in r)if(o=r[a],l=n[a],r.hasOwnProperty(a)&&(o!=null||l!=null))switch(a){case`value`:o!==l&&(B=!0),p=o;break;case`defaultValue`:o!==l&&(B=!0),c=o;break;case`multiple`:o!==l&&(B=!0),s=o;default:o!==l&&$(e,t,a,o,r,l)}t=c,n=s,r=m,p==null?!!r!=!!n&&(t==null?on(e,!!n,n?[]:``,!1):on(e,!!n,t,!0)):on(e,!!n,p,!1);return;case`textarea`:for(c in m=p=null,n)if(a=n[c],n.hasOwnProperty(c)&&a!=null&&!r.hasOwnProperty(c))switch(c){case`value`:break;case`children`:break;default:$(e,t,c,null,r,a)}for(s in r)if(a=r[s],o=n[s],r.hasOwnProperty(s)&&(a!=null||o!=null))switch(s){case`value`:a!==o&&(B=!0),p=a;break;case`defaultValue`:a!==o&&(B=!0),m=a;break;case`children`:break;case`dangerouslySetInnerHTML`:if(a!=null)throw Error(i(91));break;default:a!==o&&$(e,t,s,a,r,o)}sn(e,p,m);return;case`option`:for(var h in n)if(p=n[h],n.hasOwnProperty(h)&&p!=null&&!r.hasOwnProperty(h))switch(h){case`selected`:e.selected=!1;break;default:$(e,t,h,null,r,p)}for(l in r)if(p=r[l],m=n[l],r.hasOwnProperty(l)&&p!==m&&(p!=null||m!=null))switch(l){case`selected`:p!==m&&(B=!0),e.selected=p&&typeof p!=`function`&&typeof p!=`symbol`;break;default:$(e,t,l,p,r,m)}return;case`img`:case`link`:case`area`:case`base`:case`br`:case`col`:case`embed`:case`hr`:case`keygen`:case`meta`:case`param`:case`source`:case`track`:case`wbr`:case`menuitem`:for(var g in n)p=n[g],n.hasOwnProperty(g)&&p!=null&&!r.hasOwnProperty(g)&&$(e,t,g,null,r,p);for(u in r)if(p=r[u],m=n[u],r.hasOwnProperty(u)&&p!==m&&(p!=null||m!=null))switch(u){case`children`:case`dangerouslySetInnerHTML`:if(p!=null)throw Error(i(137,t));break;default:$(e,t,u,p,r,m)}return;default:if(pn(t)){for(var _ in n)p=n[_],n.hasOwnProperty(_)&&p!==void 0&&!r.hasOwnProperty(_)&&tp(e,t,_,void 0,r,p);for(d in r)p=r[d],m=n[d],!r.hasOwnProperty(d)||p===m||p===void 0&&m===void 0||tp(e,t,d,p,r,m);return}}for(var v in n)p=n[v],n.hasOwnProperty(v)&&p!=null&&!r.hasOwnProperty(v)&&$(e,t,v,null,r,p);for(f in r)p=r[f],m=n[f],!r.hasOwnProperty(f)||p===m||p==null&&m==null||$(e,t,f,p,r,m)}function ap(e){switch(e){case`css`:case`script`:case`font`:case`img`:case`image`:case`input`:case`link`:return!0;default:return!1}}function op(){if(typeof performance.getEntriesByType==`function`){for(var e=0,t=0,n=performance.getEntriesByType(`resource`),r=0;r<n.length;r++){var i=n[r],a=i.transferSize,o=i.initiatorType,s=i.duration;if(a&&s&&ap(o)){for(o=0,s=i.responseEnd,r+=1;r<n.length;r++){var c=n[r],l=c.startTime;if(l>s)break;var u=c.transferSize,d=c.initiatorType;u&&ap(d)&&(c=c.responseEnd,o+=u*(c<s?1:(s-l)/(c-l)))}if(--r,t+=8*(a+o)/(i.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e==`number`)?e:5}var sp=null,cp=null;function lp(e){return e.nodeType===9?e:e.ownerDocument}function up(e){switch(e){case`http://www.w3.org/2000/svg`:return 1;case`http://www.w3.org/1998/Math/MathML`:return 2;default:return 0}}function dp(e,t){if(e===0)switch(t){case`svg`:return 1;case`math`:return 2;default:return 0}return e===1&&t===`foreignObject`?0:e}function fp(e,t,n,r){return n=lp(n).createElement(e),n[St]=r,n[Ct]=t,np(n,e,t),Ft(n),n}function pp(e,t){return e===`textarea`||e===`noscript`||typeof t.children==`string`||typeof t.children==`number`||typeof t.children==`bigint`||typeof t.dangerouslySetInnerHTML==`object`&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var mp=null;function hp(){var e=window.event;return e&&e.type===`popstate`?e!==mp&&(mp=e,!0):(mp=null,!1)}var gp=typeof setTimeout==`function`?setTimeout:void 0,_p=typeof clearTimeout==`function`?clearTimeout:void 0,vp=typeof Promise==`function`?Promise:void 0,yp=typeof requestAnimationFrame==`function`?requestAnimationFrame:gp,bp=typeof queueMicrotask==`function`?queueMicrotask:vp===void 0?gp:function(e){return vp.resolve(null).then(e).catch(xp)};function xp(e){setTimeout(function(){throw e})}function Sp(e){return e===`head`}function Cp(e,t){var n=t,r=0;do{var i=n.nextSibling;if(e.removeChild(n),i&&i.nodeType===8){if(n=i.data,n===`/$`||n===`/&`){if(r===0){e.removeChild(i),Hh(t);return}r--}else if(n===`$`||n===`$?`||n===`$~`||n===`$!`||n===`&`)r++;else if(n===`html`)_m(e.ownerDocument.documentElement);else if(n===`head`){n=e.ownerDocument.head,_m(n);for(var a=n.firstChild;a;){var o=a.nextSibling,s=a.nodeName;a[kt]||s===`SCRIPT`||s===`STYLE`||s===`LINK`&&a.rel.toLowerCase()===`stylesheet`||n.removeChild(a),a=o}}else n===`body`&&_m(e.ownerDocument.body)}n=i}while(n);Hh(t)}function wp(e,t){var n=e;e=0;do{var r=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display=`none`):(n.style.display=n._stashedDisplay||``,n.getAttribute(`style`)===``&&n.removeAttribute(`style`)):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=``):n.nodeValue=n._stashedText||``),r&&r.nodeType===8){if(n=r.data,n===`/$`){if(e===0)break;e--}else n!==`$`&&n!==`$?`&&n!==`$~`&&n!==`$!`||e++}n=r}while(n)}function Tp(e,t,n){if(t=CSS.escape(t)===t?t:`r-`+btoa(t).replace(/=/g,``),e.style.viewTransitionName=t,n!=null&&(e.style.viewTransitionClass=n),n=getComputedStyle(e),n.display===`inline`){if(t=e.getClientRects(),t.length===1)var r=1;else for(var i=r=0;i<t.length;i++){var a=t[i];0<a.width&&0<a.height&&r++}r===1&&(e=e.style,e.display=t.length===1?`inline-block`:`block`,e.marginTop=`-`+n.paddingTop,e.marginBottom=`-`+n.paddingBottom)}}function Ep(e,t){e=e.style,t=t.style;var n=t==null?null:t.hasOwnProperty(`viewTransitionName`)?t.viewTransitionName:t.hasOwnProperty(`view-transition-name`)?t[`view-transition-name`]:null;e.viewTransitionName=n==null||typeof n==`boolean`?``:(``+n).trim(),n=t==null?null:t.hasOwnProperty(`viewTransitionClass`)?t.viewTransitionClass:t.hasOwnProperty(`view-transition-class`)?t[`view-transition-class`]:null,e.viewTransitionClass=n==null||typeof n==`boolean`?``:(``+n).trim(),e.display===`inline-block`&&(t==null?e.display=e.margin=``:(n=t.display,e.display=n==null||typeof n==`boolean`?``:n,n=t.margin,n==null?(n=t.hasOwnProperty(`marginTop`)?t.marginTop:t[`margin-top`],e.marginTop=n==null||typeof n==`boolean`?``:n,t=t.hasOwnProperty(`marginBottom`)?t.marginBottom:t[`margin-bottom`],e.marginBottom=t==null||typeof t==`boolean`?``:t):e.margin=n))}function Dp(e,t,n){return n=n.ownerDocument.defaultView,{rect:e,abs:t.position===`absolute`||t.position===`fixed`,clip:t.clipPath!==`none`||t.overflow!==`visible`||t.filter!==`none`||t.mask!==`none`||t.mask!==`none`||t.borderRadius!==`0px`,view:0<=e.bottom&&0<=e.right&&e.top<=n.innerHeight&&e.left<=n.innerWidth}}function Op(e){return Dp(e.getBoundingClientRect(),getComputedStyle(e),e)}function kp(e){var t=e.getBoundingClientRect();t=new DOMRect(t.x+2e4,t.y+2e4,t.width,t.height);var n=getComputedStyle(e);return Dp(t,n,e)}function Ap(e){return e.documentElement.clientHeight}function jp(e){this.addEventListener(`load`,e),this.addEventListener(`error`,e)}function Mp(e,t,n,r,i,a,o,s,c){var l=t.nodeType===9?t:t.ownerDocument;try{var u=l.startViewTransition({update:function(){var t=l.defaultView,n=t.navigation&&t.navigation.transition,o=l.fonts.status;r();var s=[];if(o===`loaded`&&(Ap(l),l.fonts.status===`loading`&&s.push(l.fonts.ready)),o=s.length,e!==null)for(var c=e.suspenseyImages,u=0,d=0;d<c.length;d++){var f=c[d];if(!f.complete){var p=f.getBoundingClientRect();if(0<p.bottom&&0<p.right&&p.top<t.innerHeight&&p.left<t.innerWidth){if(u+=Xm(f),u>$m){s.length=o;break}f=new Promise(jp.bind(f)),s.push(f)}}}if(0<s.length)return t=Promise.race([Promise.all(s),new Promise(function(e){return setTimeout(e,500)})]).then(i,i),(n?Promise.allSettled([n.finished,t]):t).then(a,a);if(i(),n)return n.finished.then(a,a);a()},types:n});l.__reactViewTransition=u;var d=[];return u.ready.then(function(){for(var e=l.documentElement.getAnimations({subtree:!0}),t=0;t<e.length;t++){var n=e[t],r=n.effect,i=r.pseudoElement;if(i!=null&&i.startsWith(`::view-transition`)){d.push(n),n=r.getKeyframes();for(var a=i=void 0,s=!0,c=0;c<n.length;c++){var u=n[c],f=u.width;if(i===void 0)i=f;else if(i!==f){s=!1;break}if(f=u.height,a===void 0)a=f;else if(a!==f){s=!1;break}delete u.width,delete u.height,u.transform===`none`&&delete u.transform}s&&i!==void 0&&a!==void 0&&(r.setKeyframes(n),s=getComputedStyle(r.target,r.pseudoElement),s.width!==i||s.height!==a)&&(s=n[0],s.width=i,s.height=a,s=n[n.length-1],s.width=i,s.height=a,r.setKeyframes(n))}}o()},function(e){l.__reactViewTransition===u&&(l.__reactViewTransition=null);try{if(typeof e==`object`&&e)switch(e.name){case`InvalidStateError`:(e.message===`View transition was skipped because document visibility state is hidden.`||e.message===`Skipping view transition because document visibility state has become hidden.`||e.message===`Skipping view transition because viewport size changed.`||e.message===`Transition was aborted because of invalid state`)&&(e=null)}e!==null&&c(e)}finally{r(),i(),o()}}),u.finished.finally(function(){for(var e=0;e<d.length;e++)d[e].cancel();l.__reactViewTransition===u&&(l.__reactViewTransition=null),s()}),u}catch{return r(),i(),o(),null}}function Np(e,t){this._scope=document.documentElement,this._selector=`::view-transition-`+e+`(`+t+`)`}Np.prototype.animate=function(e,t){return t=typeof t==`number`?{duration:t}:T({},t),t.pseudoElement=this._selector,this._scope.animate(e,t)},Np.prototype.getAnimations=function(){for(var e=this._scope,t=this._selector,n=e.getAnimations({subtree:!0}),r=[],i=0;i<n.length;i++){var a=n[i].effect;a!==null&&a.target===e&&a.pseudoElement===t&&r.push(n[i])}return r},Np.prototype.getComputedStyle=function(){return getComputedStyle(this._scope,this._selector)};function Pp(e){return{name:e,group:new Np(`group`,e),imagePair:new Np(`image-pair`,e),old:new Np(`old`,e),new:new Np(`new`,e)}}function Fp(e){this._fragmentFiber=e,this._observers=this._eventListeners=null}Fp.prototype.addEventListener=function(e,t,n){var r=null,i=null;if(!(n!=null&&typeof n!=`boolean`&&(r=n.signal||null,r!==null&&r.aborted))){this._eventListeners===null&&(this._eventListeners=[]);var a=this._eventListeners;if(Bp(a,e,t,n)===-1){var o=this,s=t;n!=null&&typeof n!=`boolean`&&!0===n.once&&(s=function(r){o.removeEventListener(e,t,n),typeof t==`function`?t.call(this,r):t.handleEvent(r)}),r!==null&&(i=o.removeEventListener.bind(o,e,t,n),r.addEventListener(`abort`,i,{once:!0}),i=r.removeEventListener.bind(r,`abort`,i)),r=Rp(n),a.push({type:e,listener:t,optionsOrUseCapture:n,attachedListener:s,cleanup:i}),h(this._fragmentFiber.child,!1,Ip,e,s,r)}this._eventListeners=a}};function Ip(e,t,n,r){return b(e).addEventListener(t,n,r),!1}Fp.prototype.removeEventListener=function(e,t,n){var r=this._eventListeners;if(r!==null&&(t=Bp(r,e,t,n),t!==-1)){var i=r[t];n=i.attachedListener;var a=i.cleanup;i=Rp(i.optionsOrUseCapture),h(this._fragmentFiber.child,!1,Lp,e,n,i),r.splice(t,1),a!==null&&a()}};function Lp(e,t,n,r){return b(e).removeEventListener(t,n,r),!1}function Rp(e){return e!=null&&typeof e!=`boolean`&&(!0===e.once||e.signal instanceof AbortSignal)?{capture:e.capture,passive:e.passive}:e}function zp(e){return e==null?`c=0`:typeof e==`boolean`?`c=`+(e?`1`:`0`):`c=`+(e.capture?`1`:`0`)}function Bp(e,t,n,r){if(e.length===0)return-1;r=zp(r);for(var i=0;i<e.length;i++){var a=e[i];if(a.type===t&&a.listener===n&&zp(a.optionsOrUseCapture)===r)return i}return-1}Fp.prototype.dispatchEvent=function(e){var t=g(this._fragmentFiber);if(t===null)return!0;t=b(t);var n=this._eventListeners;if(n!==null&&0<n.length||!e.bubbles){var r=t.nodeType===9?t.createComment(``):document.createTextNode(``);if(n)for(var i=0;i<n.length;i++){var a=n[i];r.addEventListener(a.type,a.attachedListener,Rp(a.optionsOrUseCapture))}if(t.appendChild(r),e=r.dispatchEvent(e),n)for(i=0;i<n.length;i++)a=n[i],r.removeEventListener(a.type,a.attachedListener,Rp(a.optionsOrUseCapture));return t.removeChild(r),e}return t.dispatchEvent(e)},Fp.prototype.focus=function(e){h(this._fragmentFiber.child,!0,Vp,e,void 0,void 0)};function Vp(e,t){return e.tag!==6&&(e=b(e),pm(e,t))}Fp.prototype.focusLast=function(e){var t=[];h(this._fragmentFiber.child,!0,Hp,t,void 0,void 0);for(var n=t.length-1;0<=n&&!Vp(t[n],e);n--);};function Hp(e,t){return t.push(e),!1}Fp.prototype.blur=function(){var e=g(this._fragmentFiber);e!==null&&(e=b(e),e=lp(e).activeElement,e!==null&&h(this._fragmentFiber.child,!1,Up,e,void 0,void 0))};function Up(e,t){return e.tag!==6&&(e=b(e),e===t||e.contains(t)?(t.blur(),!0):!1)}Fp.prototype.observeUsing=function(e){this._observers===null&&(this._observers=new Set),this._observers.add(e),h(this._fragmentFiber.child,!1,Wp,e,void 0,void 0)};function Wp(e,t){return e.tag===6||(e=b(e),t.observe(e)),!1}Fp.prototype.unobserveUsing=function(e){var t=this._observers;if(t!==null&&t.has(e)){t.delete(e),h(this._fragmentFiber.child,!1,Gp,e,void 0,void 0);for(var n=t=0;n<Kp.length;n++){var r=Kp[n];r.fragmentInstance===this&&r.observer===e?e.unobserve(r.instance):Kp[t++]=r}Kp.length=t}};function Gp(e,t){return e.tag===6||(e=b(e),t.unobserve(e)),!1}var Kp=[],qp=!1;function Jp(e,t,n){Kp.push({fragmentInstance:e,observer:t,instance:n}),qp||(qp=!0,mm(function(){qp=!1;var e=Kp;Kp=[];for(var t=0;t<e.length;t++){var n=e[t];n.observer.unobserve(n.instance)}}))}Fp.prototype.getClientRects=function(){var e=[];return h(this._fragmentFiber.child,!1,Yp,e,void 0,void 0),e};function Yp(e,t){if(e.tag===6){e=e.stateNode;var n=e.ownerDocument.createRange();n.selectNodeContents(e),t.push.apply(t,n.getClientRects())}else e=b(e),t.push.apply(t,e.getClientRects());return!1}Fp.prototype.getRootNode=function(e){var t=g(this._fragmentFiber);return t===null?this:b(t).getRootNode(e)},Fp.prototype.compareDocumentPosition=function(e){var t=g(this._fragmentFiber);if(t===null)return Node.DOCUMENT_POSITION_DISCONNECTED;var n=[];h(this._fragmentFiber.child,!1,Hp,n,void 0,void 0);var r=b(t);if(n.length===0){if(n=r,_(this._fragmentFiber)){a:{for(t=this._fragmentFiber.return;t!==null;){if(t.tag===4){t=t.stateNode.containerInfo;break a}if(t.tag===3||t.tag===5||t.tag===27)break;t=t.return}t=null}t!=null&&(n=t)}t=this._fragmentFiber;var i=r=n.compareDocumentPosition(e);return n===e?i=Node.DOCUMENT_POSITION_CONTAINS:r&Node.DOCUMENT_POSITION_CONTAINED_BY&&(n=v(t)[1],n===null?i=Node.DOCUMENT_POSITION_PRECEDING:(e=b(n).compareDocumentPosition(e),i=e===0||e&Node.DOCUMENT_POSITION_FOLLOWING?Node.DOCUMENT_POSITION_FOLLOWING:Node.DOCUMENT_POSITION_PRECEDING)),i|=Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC}t=b(n[0]),i=b(n[n.length-1]);var a=_(this._fragmentFiber)?t.parentElement:r;if(a==null)return Node.DOCUMENT_POSITION_DISCONNECTED;r=a.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_CONTAINED_BY,a=a.compareDocumentPosition(i)&Node.DOCUMENT_POSITION_CONTAINED_BY;var o=t.compareDocumentPosition(e),s=i.compareDocumentPosition(e),c=o&Node.DOCUMENT_POSITION_CONTAINED_BY||s&Node.DOCUMENT_POSITION_CONTAINED_BY;return s=r&&a&&o&Node.DOCUMENT_POSITION_FOLLOWING&&s&Node.DOCUMENT_POSITION_PRECEDING,t=r&&t===e||a&&i===e||c||s?Node.DOCUMENT_POSITION_CONTAINED_BY:!r&&t===e||!a&&i===e?Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC:o,t&Node.DOCUMENT_POSITION_DISCONNECTED||t&Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC||Xp(t,this._fragmentFiber,n[0],n[n.length-1],e)?t:Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC};function Xp(e,t,n,r,i){var a=Mt(i);if(e&Node.DOCUMENT_POSITION_CONTAINED_BY){if(n=!!a)a:{for(;a!==null;){if(a.tag===7&&(a===t||a.alternate===t)){n=!0;break a}a=a.return}n=!1}return n}if(e&Node.DOCUMENT_POSITION_CONTAINS){if(a===null)return a=i.ownerDocument,i===a||i===a.documentElement||i===a.body;a:{for(a=t,t=g(t);a!==null;){if(!(a.tag!==5&&a.tag!==3&&a.tag!==27||a!==t&&a.alternate!==t)){a=!0;break a}a=a.return}a=!1}return a}return e&Node.DOCUMENT_POSITION_PRECEDING?((t=!!a)&&!(t=a===n)&&(t=te(n,a,w),t===null?t=!1:(h(t,!0,C,a,n),a=x,x=null,t=a!==null)),t):e&Node.DOCUMENT_POSITION_FOLLOWING?((t=!!a)&&!(t=a===r)&&(t=te(r,a,w),t===null?t=!1:(h(t,!0,ee,a,r),a=x,S=x=null,t=a!==null)),t):!1}function Zp(e,t){var n=e.ownerDocument.createRange();n.selectNodeContents(e),e=n.getBoundingClientRect(),window.scrollTo(window.scrollX+e.left,t?window.scrollY+e.top:window.scrollY+e.bottom-window.innerHeight)}Fp.prototype.scrollIntoView=function(e){if(typeof e==`object`)throw Error(i(566));var t=[];h(this._fragmentFiber.child,!1,Hp,t,void 0,void 0);var n=!1!==e;if(t.length===0){var r=v(this._fragmentFiber);if(r=n?r[1]||r[0]||g(this._fragmentFiber):r[0]||r[1],r===null)return;if(r.tag===6){e=b(r),Zp(e,n);return}if(r=b(r),r.nodeType!==9){if(r.nodeType===11){n=`host`in r?r.host:null,n!==null&&n.scrollIntoView(e);return}r.scrollIntoView(e)}}for(r=n?t.length-1:0;r!==(n?-1:t.length);){var a=t[r];a.tag===6?(a=b(a),Zp(a,n)):b(a).scrollIntoView(e),r+=n?-1:1}};function Qp(e,t){return e=b(e),$p(e,t),!1}function $p(e,t){e.reactFragments??=new Set,e.reactFragments.add(t)}function em(e,t){var n=t._eventListeners;if(n!==null)for(var r=0;r<n.length;r++){var i=n[r];e.addEventListener(i.type,i.attachedListener,Rp(i.optionsOrUseCapture))}e.nodeType!==3&&(n=t._observers,n!==null&&n.forEach(function(n){for(var r=0,i=0;i<Kp.length;i++){var a=Kp[i];(a.fragmentInstance!==t||a.observer!==n||a.instance!==e)&&(Kp[r++]=a)}Kp.length=r,n.observe(e)}),$p(e,t))}function tm(e,t){var n=t._eventListeners;if(n!==null)for(var r=0;r<n.length;r++){var i=n[r];e.removeEventListener(i.type,i.attachedListener,Rp(i.optionsOrUseCapture))}e.nodeType!==3&&(n=t._observers,n!==null&&n.forEach(function(n){typeof n.rootMargin==`string`?Jp(t,n,e):n.unobserve(e)}),e.reactFragments!=null&&e.reactFragments.delete(t))}function nm(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case`HTML`:case`HEAD`:case`BODY`:nm(n),jt(n);continue;case`SCRIPT`:case`STYLE`:continue;case`LINK`:if(n.rel.toLowerCase()===`stylesheet`)continue}e.removeChild(n)}}function rm(e,t,n,r){for(;e.nodeType===1;){var i=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!r&&(e.nodeName!==`INPUT`||e.type!==`hidden`))break}else if(!r){if(t===`input`&&e.type===`hidden`){var a=i.name==null?null:``+i.name;if(i.type===`hidden`&&e.getAttribute(`name`)===a)return e}else return e}else if(!e[kt])switch(t){case`meta`:if(!e.hasAttribute(`itemprop`))break;return e;case`link`:if(a=e.getAttribute(`rel`),a===`stylesheet`&&e.hasAttribute(`data-precedence`)||a!==i.rel||e.getAttribute(`href`)!==(i.href==null||i.href===``?null:i.href)||e.getAttribute(`crossorigin`)!==(i.crossOrigin==null?null:i.crossOrigin)||e.getAttribute(`title`)!==(i.title==null?null:i.title))break;return e;case`style`:if(e.hasAttribute(`data-precedence`))break;return e;case`script`:if(a=e.getAttribute(`src`),(a!==(i.src==null?null:i.src)||e.getAttribute(`type`)!==(i.type==null?null:i.type)||e.getAttribute(`crossorigin`)!==(i.crossOrigin==null?null:i.crossOrigin))&&a&&e.hasAttribute(`async`)&&!e.hasAttribute(`itemprop`))break;return e;default:return e}if(e=lm(e.nextSibling),e===null)break}return null}function im(e,t,n){if(t===``)return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!==`INPUT`||e.type!==`hidden`)&&!n||(e=lm(e.nextSibling),e===null))return null;return e}function am(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!==`INPUT`||e.type!==`hidden`)&&!t||(e=lm(e.nextSibling),e===null))return null;return e}function om(e){return e.data===`$?`||e.data===`$~`}function sm(e){return e.data===`$!`||e.data===`$?`&&e.ownerDocument.readyState!==`loading`}function cm(e,t){var n=e.ownerDocument;if(e.data===`$~`)e._reactRetry=t;else if(e.data!==`$?`||n.readyState!==`loading`)t();else{var r=function(){t(),n.removeEventListener(`DOMContentLoaded`,r)};n.addEventListener(`DOMContentLoaded`,r),e._reactRetry=r}}function lm(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t===`$`||t===`$!`||t===`$?`||t===`$~`||t===`&`||t===`F!`||t===`F`)break;if(t===`/$`||t===`/&`)return null}}return e}var um=null;function dm(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`/$`||n===`/&`){if(t===0)return lm(e.nextSibling);t--}else n!==`$`&&n!==`$!`&&n!==`$?`&&n!==`$~`&&n!==`&`||t++}e=e.nextSibling}return null}function fm(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`$`||n===`$!`||n===`$?`||n===`$~`||n===`&`){if(t===0)return e;t--}else n!==`/$`&&n!==`/&`||t++}e=e.previousSibling}return null}function pm(e,t){function n(){r=!0}if(e.ownerDocument.activeElement===e)return!0;var r=!1;try{e.ownerDocument.addEventListener(`focus`,n,!0),(e.focus||HTMLElement.prototype.focus).call(e,t)}finally{e.ownerDocument.removeEventListener(`focus`,n,!0)}return r}function mm(e){yp(function(){yp(function(t){return e(t)})})}function hm(e,t,n){switch(t=lp(n),e){case`html`:if(e=t.documentElement,!e)throw Error(i(452));return e;case`head`:if(e=t.head,!e)throw Error(i(453));return e;case`body`:if(e=t.body,!e)throw Error(i(454));return e;default:throw Error(i(451))}}function gm(e,t,n){for(var r in n){var i=n[r];n.hasOwnProperty(r)&&i!=null&&$(e,t,r,null,rp,i)}n.dangerouslySetInnerHTML!=null&&(e.textContent=``),e.onclick===_n&&(e.onclick=null),jt(e)}function _m(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);jt(e)}var vm=new Map,ym=new Set;function bm(e){if(typeof e.getRootNode==`function`){var t=e.getRootNode();if(t.nodeType===9||t.nodeType===11)return t}return e.nodeType===9?e:e.ownerDocument}var xm=j.d;j.d={f:Sm,r:Cm,D:Em,C:Dm,L:Om,m:km,X:jm,S:Am,M:Mm};function Sm(){var e=xm.f(),t=zd();return e||t}function Cm(e){var t=Nt(e);t!==null&&t.tag===5&&t.type===`form`?tc(t):xm.r(e)}var wm=typeof document>`u`?null:document;function Tm(e,t,n){var r=wm;if(r&&typeof t==`string`&&t){var i=tn(t);i=`link[rel="`+e+`"][href="`+i+`"]`,typeof n==`string`&&(i+=`[crossorigin="`+n+`"]`),ym.has(i)||(ym.add(i),e={rel:e,crossOrigin:n,href:t},r.querySelector(i)===null&&(t=r.createElement(`link`),np(t,`link`,e),Ft(t),r.head.appendChild(t)))}}function Em(e){xm.D(e),Tm(`dns-prefetch`,e,null)}function Dm(e,t){xm.C(e,t),Tm(`preconnect`,e,t)}function Om(e,t,n){xm.L(e,t,n);var r=wm;if(r&&e&&t){var i=`link[rel="preload"][as="`+tn(t)+`"]`;t===`image`&&n&&n.imageSrcSet?(i+=`[imagesrcset="`+tn(n.imageSrcSet)+`"]`,typeof n.imageSizes==`string`&&(i+=`[imagesizes="`+tn(n.imageSizes)+`"]`)):i+=`[href="`+tn(e)+`"]`;var a=i;switch(t){case`style`:a=Pm(e);break;case`script`:a=Rm(e)}if(!(vm.has(a)||(e=T({rel:`preload`,href:t===`image`&&n&&n.imageSrcSet?void 0:e,as:t},n),vm.set(a,e),r.querySelector(i)!==null||t===`style`&&r.querySelector(Fm(a))||t===`script`&&r.querySelector(zm(a))))){var o=r.createElement(`link`);np(o,`link`,e),t===`style`&&(o[At]=!0,o.onload=o.onerror=function(){It(o)}),Ft(o),r.head.appendChild(o)}}}function km(e,t){xm.m(e,t);var n=wm;if(n&&e){var r=t&&typeof t.as==`string`?t.as:`script`,i=`link[rel="modulepreload"][as="`+tn(r)+`"][href="`+tn(e)+`"]`,a=i;switch(r){case`audioworklet`:case`paintworklet`:case`serviceworker`:case`sharedworker`:case`worker`:case`script`:a=Rm(e)}if(!vm.has(a)&&(e=T({rel:`modulepreload`,href:e},t),vm.set(a,e),n.querySelector(i)===null)){switch(r){case`audioworklet`:case`paintworklet`:case`serviceworker`:case`sharedworker`:case`worker`:case`script`:if(n.querySelector(zm(a)))return}r=n.createElement(`link`),np(r,`link`,e),Ft(r),n.head.appendChild(r)}}}function Am(e,t,n){xm.S(e,t,n);var r=wm;if(r&&e){var i=z(r).hoistableStyles,a=Pm(e);t||=`default`;var o=i.get(a);if(!o){var s={loading:0,preload:null};if(o=r.querySelector(Fm(a)))s.loading=5;else{e=T({rel:`stylesheet`,href:e,"data-precedence":t},n),(n=vm.get(a))&&Hm(e,n);var c=o=r.createElement(`link`);Ft(c),np(c,`link`,e),c._p=new Promise(function(e,t){c.onload=e,c.onerror=t}),c.addEventListener(`load`,function(){s.loading|=1}),c.addEventListener(`error`,function(){s.loading|=2}),s.loading|=4,Vm(o,t,r)}o={type:`stylesheet`,instance:o,count:1,state:s},i.set(a,o)}}}function jm(e,t){xm.X(e,t);var n=wm;if(n&&e){var r=z(n).hoistableScripts,i=Rm(e),a=r.get(i);a||(a=n.querySelector(zm(i)),a||(e=T({src:e,async:!0},t),(t=vm.get(i))&&Um(e,t),a=n.createElement(`script`),Ft(a),np(a,`link`,e),n.head.appendChild(a)),a={type:`script`,instance:a,count:1,state:null},r.set(i,a))}}function Mm(e,t){xm.M(e,t);var n=wm;if(n&&e){var r=z(n).hoistableScripts,i=Rm(e),a=r.get(i);a||(a=n.querySelector(zm(i)),a||(e=T({src:e,async:!0,type:`module`},t),(t=vm.get(i))&&Um(e,t),a=n.createElement(`script`),Ft(a),np(a,`link`,e),n.head.appendChild(a)),a={type:`script`,instance:a,count:1,state:null},r.set(i,a))}}function Nm(e,t,n,r){var a=(a=Ee.current)?bm(a):null;if(!a)throw Error(i(446));switch(e){case`meta`:case`title`:return null;case`style`:return typeof n.precedence==`string`&&typeof n.href==`string`?(n=Pm(n.href),t=z(a).hoistableStyles,r=t.get(n),r||(r={type:`style`,instance:null,count:0,state:null},t.set(n,r)),r):{type:`void`,instance:null,count:0,state:null};case`link`:if(n.rel===`stylesheet`&&typeof n.href==`string`&&typeof n.precedence==`string`){e=Pm(n.href);var o=z(a).hoistableStyles,s=o.get(e);if(s||(a=a.ownerDocument||a,s={type:`stylesheet`,instance:null,count:0,state:{loading:0,preload:null}},o.set(e,s),(o=a.querySelector(Fm(e)))?o._p||(s.instance=o,s.state.loading=5):(o=vm.get(e),o||(o={rel:`preload`,as:`style`,href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},vm.set(e,o)),Lm(a,e,o,s.state))),t&&r===null)throw Error(i(528,``));return s}if(t&&r!==null)throw Error(i(529,``));return null;case`script`:return t=n.async,n=n.src,typeof n==`string`&&t&&typeof t!=`function`&&typeof t!=`symbol`?(n=Rm(n),t=z(a).hoistableScripts,r=t.get(n),r||(r={type:`script`,instance:null,count:0,state:null},t.set(n,r)),r):{type:`void`,instance:null,count:0,state:null};default:throw Error(i(444,e))}}function Pm(e){return`href="`+tn(e)+`"`}function Fm(e){return`link[rel="stylesheet"][`+e+`]`}function Im(e){return T({},e,{"data-precedence":e.precedence,precedence:null})}function Lm(e,t,n,r){if(t=e.querySelector(`link[rel="preload"][as="style"][`+t+`]`)){if(!0!==t[At]){r.loading=1;return}}else t=e.createElement(`link`),t[At]=!0,t.onload=t.onerror=It.bind(null,t),np(t,`link`,n),Ft(t),e.head.appendChild(t);r.preload=t,t.addEventListener(`load`,function(){return r.loading|=1}),t.addEventListener(`error`,function(){return r.loading|=2})}function Rm(e){return`[src="`+tn(e)+`"]`}function zm(e){return`script[async]`+e}function Bm(e,t,n){if(t.count++,t.instance===null)switch(t.type){case`style`:var r=e.querySelector(`style[data-href~="`+tn(n.href)+`"]`);if(r)return t.instance=r,Ft(r),r;var a=T({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return r=(e.ownerDocument||e).createElement(`style`),Ft(r),np(r,`style`,a),Vm(r,n.precedence,e),t.instance=r;case`stylesheet`:a=Pm(n.href);var o=e.querySelector(Fm(a));if(o)return t.state.loading|=4,t.instance=o,Ft(o),o;r=Im(n),(a=vm.get(a))&&Hm(r,a),o=(e.ownerDocument||e).createElement(`link`),Ft(o);var s=o;return s._p=new Promise(function(e,t){s.onload=e,s.onerror=t}),np(o,`link`,r),t.state.loading|=4,Vm(o,n.precedence,e),t.instance=o;case`script`:return o=Rm(n.src),(a=e.querySelector(zm(o)))?(t.instance=a,Ft(a),a):(r=n,(a=vm.get(o))&&(r=T({},n),Um(r,a)),e=e.ownerDocument||e,a=e.createElement(`script`),Ft(a),np(a,`link`,r),e.head.appendChild(a),t.instance=a);case`void`:return null;default:throw Error(i(443,t.type))}else t.type===`stylesheet`&&!(t.state.loading&4)&&(r=t.instance,t.state.loading|=4,Vm(r,n.precedence,e));return t.instance}function Vm(e,t,n){for(var r=n.querySelectorAll(`link[rel="stylesheet"][data-precedence],style[data-precedence]`),i=r.length?r[r.length-1]:null,a=i,o=0;o<r.length;o++){var s=r[o];if(s.dataset.precedence===t)a=s;else if(a!==i)break}a?a.parentNode.insertBefore(e,a.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function Hm(e,t){e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.title??=t.title}function Um(e,t){e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.integrity??=t.integrity}var Wm=null;function Gm(e,t,n){if(Wm===null){var r=new Map,i=Wm=new Map;i.set(n,r)}else i=Wm,r=i.get(n),r||(r=new Map,i.set(n,r));if(r.has(e))return r;for(r.set(e,null),n=n.getElementsByTagName(e),i=0;i<n.length;i++){var a=n[i];if(!(a[kt]||a[St]||e===`link`&&a.getAttribute(`rel`)===`stylesheet`)&&a.namespaceURI!==`http://www.w3.org/2000/svg`){var o=a.getAttribute(t)||``;o=e+o;var s=r.get(o);s?s.push(a):r.set(o,[a])}}return r}function Km(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t===`title`?e.querySelector(`head > title`):null)}function qm(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case`meta`:case`title`:return!0;case`style`:if(typeof t.precedence!=`string`||typeof t.href!=`string`||t.href===``)break;return!0;case`link`:if(typeof t.rel!=`string`||typeof t.href!=`string`||t.href===``||t.onLoad||t.onError)break;switch(t.rel){case`stylesheet`:return e=t.disabled,typeof t.precedence==`string`&&e==null;default:return!0}case`script`:if(t.async&&typeof t.async!=`function`&&typeof t.async!=`symbol`&&!t.onLoad&&!t.onError&&t.src&&typeof t.src==`string`)return!0}return!1}function Jm(e,t){return e===`img`&&t.src!=null&&t.src!==``&&t.onLoad==null&&t.loading!==`lazy`}function Ym(e){return!(e.type===`stylesheet`&&!(e.state.loading&3))}function Xm(e){return(e.width||100)*(e.height||100)*(typeof devicePixelRatio==`number`?devicePixelRatio:1)*.25}function Zm(e,t){typeof t.decode==`function`&&(e.imgCount++,t.complete||(e.imgBytes+=Xm(t),e.suspenseyImages.push(t)),e=rh.bind(e),t.decode().then(e,e))}function Qm(e,t,n,r){if(n.type===`stylesheet`&&(typeof r.media!=`string`||!1!==matchMedia(r.media).matches)&&!(n.state.loading&4)){if(n.instance===null){var i=Pm(r.href),a=t.querySelector(Fm(i));if(a){t=a._p,typeof t==`object`&&t&&typeof t.then==`function`&&(e.count++,e=nh.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=a,Ft(a);return}a=t.ownerDocument||t,r=Im(r),(i=vm.get(i))&&Hm(r,i),a=a.createElement(`link`),Ft(a);var o=a;o._p=new Promise(function(e,t){o.onload=e,o.onerror=t}),np(a,`link`,r),n.instance=a}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&!(n.state.loading&3)&&(e.count++,n=nh.bind(e),t.addEventListener(`load`,n),t.addEventListener(`error`,n))}}var $m=0;function eh(e,t){return e.stylesheets&&e.count===0&&ah(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var r=setTimeout(function(){if(e.stylesheets&&ah(e,e.stylesheets),e.unsuspend){var t=e.unsuspend;e.unsuspend=null,t()}},6e4+t);0<e.imgBytes&&$m===0&&($m=62500*op());var i=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&ah(e,e.stylesheets),e.unsuspend)){var t=e.unsuspend;e.unsuspend=null,t()}},(e.imgBytes>$m?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(r),clearTimeout(i)}}:null}function th(e){if(e.count===0&&(e.imgCount===0||!e.waitingForImages)){if(e.stylesheets)ah(e,e.stylesheets);else if(e.unsuspend){var t=e.unsuspend;e.unsuspend=null,t()}}}function nh(){this.count--,th(this)}function rh(){this.imgCount--,th(this)}var ih=null;function ah(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,ih=new Map,t.forEach(oh,e),ih=null,nh.call(e))}function oh(e,t){if(!(t.state.loading&4)){var n=ih.get(e);if(n)var r=n.get(null);else{n=new Map,ih.set(e,n);for(var i=e.querySelectorAll(`link[data-precedence],style[data-precedence]`),a=0;a<i.length;a++){var o=i[a];(o.nodeName===`LINK`||o.getAttribute(`media`)!==`not all`)&&(n.set(o.dataset.precedence,o),r=o)}r&&n.set(null,r)}i=t.instance,o=i.getAttribute(`data-precedence`),a=n.get(o)||r,a===r&&n.set(null,i),n.set(o,i),this.count++,r=nh.bind(this),i.addEventListener(`load`,r),i.addEventListener(`error`,r),a?a.parentNode.insertBefore(i,a.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(i,e.firstChild)),t.state.loading|=4}}var sh={$$typeof:ce,Provider:null,Consumer:null,_currentValue:xe,_currentValue2:xe,_threadCount:0};function ch(e,t,n,r,i,a,o,s,c){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=ft(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=ft(0),this.hiddenUpdates=ft(null),this.identifierPrefix=r,this.onUncaughtError=i,this.onCaughtError=a,this.onRecoverableError=o,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=c,this.transitionTypes=null,this.incompleteTransitions=new Map}function lh(e,t,n,r,i,a,o,s,c,l,u,d){return e=new ch(e,t,n,o,c,l,u,d,s),t=1,!0===a&&(t|=24),a=ji(3,null,null,t),e.current=a,a.stateNode=e,t=Aa(),t.refCount++,e.pooledCache=t,t.refCount++,a.memoizedState={element:r,isDehydrated:n,cache:t},po(a),e}function uh(e){return e?(e=ki,e):ki}function dh(e,t,n,r,i,a){i=uh(i),r.context===null?r.context=i:r.pendingContext=i,r=ho(t),r.payload={element:n},a=a===void 0?null:a,a!==null&&(r.callback=a),n=go(e,r,t),n!==null&&(Pd(n,e,t),_o(n,e,t))}function fh(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function ph(e,t){fh(e,t),(e=e.alternate)&&fh(e,t)}function mh(e){if(e.tag===13||e.tag===31){var t=Ei(e,67108864);t!==null&&Pd(t,e,67108864),ph(e,67108864)}}function hh(e){if(e.tag===13||e.tag===31){var t=jd();t=_t(t);var n=Ei(e,t);n!==null&&Pd(n,e,t),ph(e,t)}}var gh=!0;function _h(e,t,n,r){var i=A.T;A.T=null;var a=j.p;try{j.p=2,yh(e,t,n,r)}finally{j.p=a,A.T=i}}function vh(e,t,n,r){var i=A.T;A.T=null;var a=j.p;try{j.p=8,yh(e,t,n,r)}finally{j.p=a,A.T=i}}function yh(e,t,n,r){if(gh){var i=bh(r);if(i===null)Kf(e,t,r,xh,n),Mh(e,r);else if(Ph(i,e,t,n,r))r.stopPropagation();else if(Mh(e,r),t&4&&-1<jh.indexOf(e)){for(;i!==null;){var a=Nt(i);if(a!==null)switch(a.tag){case 3:if(a=a.stateNode,a.current.memoizedState.isDehydrated){var o=st(a.pendingLanes);if(o!==0){var s=a;for(s.pendingLanes|=2,s.entangledLanes|=2;o;){var c=1<<31-tt(o);s.entanglements[1]|=c,o&=~c}Ef(a),!(K&6)&&(gd=Ue()+500,Df(0,!1))}}break;case 31:case 13:s=Ei(a,2),s!==null&&Pd(s,a,2),zd(),ph(a,2)}if(a=bh(r),a===null&&Kf(e,t,r,xh,n),a===i)break;i=a}i!==null&&r.stopPropagation()}else Kf(e,t,r,null,n)}}function bh(e){return e=yn(e),Sh(e)}var xh=null;function Sh(e){if(xh=null,e=Mt(e),e!==null){var t=o(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=s(t),e!==null)return e;e=null}else if(n===31){if(e=c(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return xh=e,null}function Ch(e){switch(e){case`beforetoggle`:case`cancel`:case`click`:case`close`:case`contextmenu`:case`copy`:case`cut`:case`auxclick`:case`dblclick`:case`dragend`:case`dragstart`:case`drop`:case`focusin`:case`focusout`:case`input`:case`invalid`:case`keydown`:case`keypress`:case`keyup`:case`mousedown`:case`mouseup`:case`paste`:case`pause`:case`play`:case`pointercancel`:case`pointerdown`:case`pointerup`:case`ratechange`:case`reset`:case`seeked`:case`submit`:case`toggle`:case`touchcancel`:case`touchend`:case`touchstart`:case`volumechange`:case`change`:case`selectionchange`:case`textInput`:case`compositionstart`:case`compositionend`:case`compositionupdate`:case`beforeblur`:case`afterblur`:case`beforeinput`:case`blur`:case`fullscreenchange`:case`fullscreenerror`:case`focus`:case`hashchange`:case`popstate`:case`select`:case`selectstart`:return 2;case`drag`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`mousemove`:case`mouseout`:case`mouseover`:case`pointermove`:case`pointerout`:case`pointerover`:case`resize`:case`scroll`:case`touchmove`:case`wheel`:case`mouseenter`:case`mouseleave`:case`pointerenter`:case`pointerleave`:return 8;case`message`:switch(We()){case Ge:return 2;case Ke:return 8;case qe:case Je:return 32;case Ye:return 268435456;default:return 32}default:return 32}}var wh=!1,Th=null,Eh=null,Dh=null,Oh=new Map,kh=new Map,Ah=[],jh=`mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset`.split(` `);function Mh(e,t){switch(e){case`focusin`:case`focusout`:Th=null;break;case`dragenter`:case`dragleave`:Eh=null;break;case`mouseover`:case`mouseout`:Dh=null;break;case`pointerover`:case`pointerout`:Oh.delete(t.pointerId);break;case`gotpointercapture`:case`lostpointercapture`:kh.delete(t.pointerId)}}function Nh(e,t,n,r,i,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:a,targetContainers:[i]},t!==null&&(t=Nt(t),t!==null&&mh(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,i!==null&&t.indexOf(i)===-1&&t.push(i),e)}function Ph(e,t,n,r,i){switch(t){case`focusin`:return Th=Nh(Th,e,t,n,r,i),!0;case`dragenter`:return Eh=Nh(Eh,e,t,n,r,i),!0;case`mouseover`:return Dh=Nh(Dh,e,t,n,r,i),!0;case`pointerover`:var a=i.pointerId;return Oh.set(a,Nh(Oh.get(a)||null,e,t,n,r,i)),!0;case`gotpointercapture`:return a=i.pointerId,kh.set(a,Nh(kh.get(a)||null,e,t,n,r,i)),!0}return!1}function Fh(e){var t=Mt(e.target);if(t!==null){var n=o(t);if(n!==null){if(t=n.tag,t===13){if(t=s(n),t!==null){e.blockedOn=t,bt(e.priority,function(){hh(n)});return}}else if(t===31){if(t=c(n),t!==null){e.blockedOn=t,bt(e.priority,function(){hh(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Ih(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=bh(e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);vn=r,n.target.dispatchEvent(r),vn=null}else return t=Nt(n),t!==null&&mh(t),e.blockedOn=n,!1;t.shift()}return!0}function Lh(e,t,n){Ih(e)&&n.delete(t)}function Rh(){wh=!1,Th!==null&&Ih(Th)&&(Th=null),Eh!==null&&Ih(Eh)&&(Eh=null),Dh!==null&&Ih(Dh)&&(Dh=null),Oh.forEach(Lh),kh.forEach(Lh)}function zh(e,n){e.blockedOn===n&&(e.blockedOn=null,wh||(wh=!0,t.unstable_scheduleCallback(t.unstable_NormalPriority,Rh)))}var Bh=null;function Vh(e){Bh!==e&&(Bh=e,t.unstable_scheduleCallback(t.unstable_NormalPriority,function(){Bh===e&&(Bh=null);for(var t=0;t<e.length;t+=3){var n=e[t],r=e[t+1],i=e[t+2];if(typeof r!=`function`){if(Sh(r||n)===null)continue;break}var a=Nt(n);a!==null&&(e.splice(t,3),t-=3,$s(a,{pending:!0,data:i,method:n.method,action:r},r,i))}}))}function Hh(e){function t(t){return zh(t,e)}Th!==null&&zh(Th,e),Eh!==null&&zh(Eh,e),Dh!==null&&zh(Dh,e),Oh.forEach(t),kh.forEach(t);for(var n=0;n<Ah.length;n++){var r=Ah[n];r.blockedOn===e&&(r.blockedOn=null)}for(;0<Ah.length&&(n=Ah[0],n.blockedOn===null);)Fh(n),n.blockedOn===null&&Ah.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(r=0;r<n.length;r+=3){var i=n[r],a=n[r+1],o=i[Ct]||null;if(typeof a==`function`)o||Vh(n);else if(o){var s=null;if(a&&a.hasAttribute(`formAction`)){if(i=a,o=a[Ct]||null)s=o.formAction;else if(Sh(i)!==null)continue}else s=o.action;typeof s==`function`?n[r+1]=s:(n.splice(r,3),r-=3),Vh(n)}}}function Uh(){function e(e){e.canIntercept&&e.info===`react-transition`&&e.intercept({handler:function(){return new Promise(function(e){return i=e})},focusReset:`manual`,scroll:`manual`})}function t(){i!==null&&(i(),i=null),r||setTimeout(n,20)}function n(){if(!r&&!navigation.transition){var e=navigation.currentEntry;e&&e.url!=null&&navigation.navigate(e.url,{state:e.getState(),info:`react-transition`,history:`replace`})}}if(typeof navigation==`object`){var r=!1,i=null;return navigation.addEventListener(`navigate`,e),navigation.addEventListener(`navigatesuccess`,t),navigation.addEventListener(`navigateerror`,t),setTimeout(n,100),function(){r=!0,navigation.removeEventListener(`navigate`,e),navigation.removeEventListener(`navigatesuccess`,t),navigation.removeEventListener(`navigateerror`,t),i!==null&&(i(),i=null)}}}function Wh(e){this._internalRoot=e}Gh.prototype.render=Wh.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(i(409));var n=t.current;dh(n,jd(),e,t,null,null)},Gh.prototype.unmount=Wh.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;dh(e.current,2,null,e,null,null),zd(),t[wt]=null}};function Gh(e){this._internalRoot=e}Gh.prototype.unstable_scheduleHydration=function(e){if(e){var t=yt();e={blockedOn:null,target:e,priority:t};for(var n=0;n<Ah.length&&t!==0&&t<Ah[n].priority;n++);Ah.splice(n,0,e),n===0&&Fh(e)}};var Kh=n.version;if(Kh!==`19.3.1`)throw Error(i(527,Kh,`19.3.1`));j.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render==`function`?Error(i(188)):(e=Object.keys(e).join(`,`),Error(i(268,e)));return e=d(t),e=e===null?null:p(e),e=e===null?null:e.stateNode,e};var qh={bundleType:0,version:`19.3.1`,rendererPackageName:`react-dom`,currentDispatcherRef:A,reconcilerVersion:`19.3.1`};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<`u`){var Jh=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Jh.isDisabled&&Jh.supportsFiber)try{Qe=Jh.inject(qh),$e=Jh}catch{}}e.createRoot=function(e,t){if(!a(e))throw Error(i(299));var n=!1,r=``,o=Sc,s=Cc,c=wc;return t!=null&&(!0===t.unstable_strictMode&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onUncaughtError!==void 0&&(o=t.onUncaughtError),t.onCaughtError!==void 0&&(s=t.onCaughtError),t.onRecoverableError!==void 0&&(c=t.onRecoverableError)),t=lh(e,1,!1,null,null,n,r,null,o,s,c,Uh),e[wt]=t.current,Wf(e),new Wh(t)}})),g=o(((e,t)=>{function n(){if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<`u`&&typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE==`function`)try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=h()})),_=e=>e?.replace(/([a-z0-9])([A-Z])/g,`$1-$2`).toLowerCase();function v(e,t,n=[]){if(t==null)throw Error(`[lucide]: iconNode is required when icon name is used`);return{name:_(e),size:24,node:t,...n.length>0?{aliases:n}:{}}}var y=e=>{let t=``,n=!1;for(let r of e)r===`-`||r===`_`||r<=` `?n=t.length>0:(t.length===0?t+=r.toLowerCase():t+=n?r.toUpperCase():r,n=!1);return t},b=e=>{let t=y(e);return t.charAt(0).toUpperCase()+t.slice(1)},x=(...e)=>e.filter((e,t,n)=>!!e&&e.trim()!==``&&n.indexOf(e)===t).join(` `).trim(),S={xmlns:`http://www.w3.org/2000/svg`,width:24,height:24,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":2,"stroke-linecap":`round`,"stroke-linejoin":`round`};function C(e){return e!=null}function ee(e,t={}){let n=t.attributeNames??{},r=e=>n[e]??e,i=e.size??e.width??S.width,a=e.size??e.height??S.height,o=e.aliases?.filter(e=>typeof e==`string`&&e.trim()!==``).map(e=>`lucide-${e}`)??[],s=[...e.name?[`lucide-${e.name}`]:[],...o],c=t.className?.split(` `).filter(Boolean)??[],l=t.includeDefaultClasses===!1?x(...c):x(`lucide`,...s,...c),u=t.absoluteStrokeWidth?Number(t.strokeWidth??S[`stroke-width`])*Number(e.size??e.width??S.width)/Number(t.size??t.width??S.width):t.strokeWidth??S[`stroke-width`];return[`svg`,{...Object.entries(S).reduce((e,[t,n])=>(e[r(t)]=n,e),{}),...`color`in t&&t.color&&{[r(`stroke`)]:t.color},...`size`in t&&C(t.size)&&{[r(`width`)]:t.size,[r(`height`)]:t.size},...`width`in t&&C(t.width)&&{[r(`width`)]:t.width},...`height`in t&&C(t.height)&&{[r(`height`)]:t.height},[r(`stroke-width`)]:u,...l&&{[r(`class`)]:l},[r(`viewBox`)]:`0 0 ${i} ${a}`,...t.hasA11yProp===!1?{[r(`aria-hidden`)]:`true`}:{},...`attributes`in t&&t.attributes},e.node.map(e=>{let[n,i,a]=e,o=t.nonScalingStroke?{[r(`vector-effect`)]:`non-scaling-stroke`,...i}:i;return a?[n,o,a]:[n,o]})]}function w(e,t={}){return ee(e,{...t,attributeNames:{...t.attributeNames,class:`className`,"stroke-width":`strokeWidth`,"stroke-linecap":`strokeLinecap`,"stroke-linejoin":`strokeLinejoin`,"vector-effect":`vectorEffect`}})}var te=e=>{for(let t in e)if(t.startsWith(`aria-`)||t===`role`||t===`title`)return!0;return!1},T=c(u(),1),ne=(0,T.createContext)({}),re=()=>(0,T.useContext)(ne),ie=(0,T.forwardRef)(({color:e,size:t,width:n,height:r,strokeWidth:i,absoluteStrokeWidth:a,nonScalingStroke:o,className:s=``,children:c,iconNode:l=[],icon:u={node:l,aliases:[],size:24},...d},f)=>{let{size:p=24,strokeWidth:m=2,absoluteStrokeWidth:h=!1,nonScalingStroke:g=!1,color:_=`currentColor`,className:v=``}=re()??{},y=!!c||te(d),[b,S,C=[]]=w(u,{color:e??_,width:n??t??p,height:r??t??p,strokeWidth:i??m,absoluteStrokeWidth:a??h,nonScalingStroke:o??g,className:x(v,s),hasA11yProp:y,attributes:d});return(0,T.createElement)(b,{ref:f,...S},[...C.map(([e,t])=>(0,T.createElement)(e,t)),...Array.isArray(c)?c:[c]])});function E(e,t=[],n=[]){let r=typeof e==`string`?v(e,t,n):e,i=(0,T.forwardRef)(({className:e,...t},n)=>(0,T.createElement)(ie,{ref:n,icon:r,className:e,...t}));return r.name&&(i.displayName=b(r.name)),i}var ae={name:`chevron-down`,size:24,node:[[`path`,{d:`m6 9 6 6 6-6`,key:`qrunsl`}]]};ae.node;var oe=E(ae),se={name:`chevron-right`,size:24,node:[[`path`,{d:`m9 18 6-6-6-6`,key:`mthhwq`}]]};se.node;var ce=E(se),D={name:`chevron-up`,size:24,node:[[`path`,{d:`m18 15-6-6-6 6`,key:`153udz`}]]};D.node;var le=E(D),ue={name:`circle-check-big`,size:24,node:[[`path`,{d:`M21.801 10A10 10 0 1 1 17 3.335`,key:`yps3ct`}],[`path`,{d:`m9 11 3 3L22 4`,key:`1pflzl`}]],aliases:[`check-circle`]};ue.node;var de=E(ue),fe={name:`circle-check`,size:24,node:[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`path`,{d:`m16 9-5.5 5.5L8 12`,key:`xofnsj`}]],aliases:[`check-circle-2`]};fe.node;var pe=E(fe),me={name:`circle-exclamation-point`,size:24,node:[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`line`,{x1:`12`,x2:`12`,y1:`8`,y2:`12`,key:`1pkeuh`}],[`line`,{x1:`12`,x2:`12.01`,y1:`16`,y2:`16`,key:`4dfq90`}]],aliases:[`alert-circle`,`circle-alert`]};me.node;var he=E(me),ge={name:`circle-x`,size:24,node:[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`path`,{d:`m15 9-6 6`,key:`1uzhvr`}],[`path`,{d:`m9 9 6 6`,key:`z0biqf`}]],aliases:[`x-circle`]};ge.node;var _e=E(ge),O={name:`clock`,size:24,node:[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`path`,{d:`M12 6v6l4 2`,key:`mmk7yg`}]]};O.node;var ve=E(O),ye={name:`download`,size:24,node:[[`path`,{d:`M12 15V3`,key:`m9g1x1`}],[`path`,{d:`M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4`,key:`ih7n3h`}],[`path`,{d:`m7 10 5 5 5-5`,key:`brsn70`}]]};ye.node;var be=E(ye),k={name:`eye`,size:24,node:[[`path`,{d:`M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0`,key:`1nclc0`}],[`circle`,{cx:`12`,cy:`12`,r:`3`,key:`1v7zrd`}]]};k.node;var A=E(k),j={name:`file-spreadsheet`,size:24,node:[[`path`,{d:`M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,key:`1oefj6`}],[`path`,{d:`M14 2v5a1 1 0 0 0 1 1h5`,key:`wfsgrz`}],[`path`,{d:`M8 13h2`,key:`yr2amv`}],[`path`,{d:`M14 13h2`,key:`un5t4a`}],[`path`,{d:`M8 17h2`,key:`2yhykz`}],[`path`,{d:`M14 17h2`,key:`10kma7`}]]};j.node;var xe=E(j),Se={name:`file-text`,size:24,node:[[`path`,{d:`M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,key:`1oefj6`}],[`path`,{d:`M14 2v5a1 1 0 0 0 1 1h5`,key:`wfsgrz`}],[`path`,{d:`M10 9H8`,key:`b1mrlr`}],[`path`,{d:`M16 13H8`,key:`t4e002`}],[`path`,{d:`M16 17H8`,key:`z1uh3a`}]]};Se.node;var Ce=E(Se),M={name:`file`,size:24,node:[[`path`,{d:`M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,key:`1oefj6`}],[`path`,{d:`M14 2v5a1 1 0 0 0 1 1h5`,key:`wfsgrz`}]]};M.node;var N=E(M),P={name:`info`,size:24,node:[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`path`,{d:`M12 16v-4`,key:`1dtifu`}],[`path`,{d:`M12 8h.01`,key:`e9boi3`}]]};P.node;var we=E(P),Te={name:`link-2`,size:24,node:[[`path`,{d:`M9 17H7A5 5 0 0 1 7 7h2`,key:`8i5ue5`}],[`path`,{d:`M15 7h2a5 5 0 1 1 0 10h-2`,key:`1b9ql8`}],[`line`,{x1:`8`,x2:`16`,y1:`12`,y2:`12`,key:`1jonct`}]]};Te.node;var Ee=E(Te),F={name:`play`,size:24,node:[[`path`,{d:`M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z`,key:`10ikf1`}]]};F.node;var De=E(F),Oe={name:`refresh-cw`,size:24,node:[[`path`,{d:`M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8`,key:`v9h5vc`}],[`path`,{d:`M21 3v5h-5`,key:`1q7to0`}],[`path`,{d:`M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16`,key:`3uifl3`}],[`path`,{d:`M8 16H3v5`,key:`1cv678`}]]};Oe.node;var ke=E(Oe),Ae={name:`rotate-ccw`,size:24,node:[[`path`,{d:`M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8`,key:`1357e3`}],[`path`,{d:`M3 3v5h5`,key:`1xhq8a`}]]};Ae.node;var je=E(Ae),Me={name:`search`,size:24,node:[[`path`,{d:`m21 21-4.34-4.34`,key:`14j7rj`}],[`circle`,{cx:`11`,cy:`11`,r:`8`,key:`4ej97u`}]]};Me.node;var Ne=E(Me),Pe={name:`settings-2`,size:24,node:[[`path`,{d:`M14 17H5`,key:`gfn3mx`}],[`path`,{d:`M19 7h-9`,key:`6i9tg`}],[`circle`,{cx:`17`,cy:`17`,r:`3`,key:`18b49y`}],[`circle`,{cx:`7`,cy:`7`,r:`3`,key:`dfmy0x`}]]};Pe.node;var Fe=E(Pe),Ie={name:`settings`,size:24,node:[[`path`,{d:`M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915`,key:`1i5ecw`}],[`circle`,{cx:`12`,cy:`12`,r:`3`,key:`1v7zrd`}]]};Ie.node;var Le=E(Ie),Re={name:`square`,size:24,node:[[`rect`,{width:`18`,height:`18`,x:`3`,y:`3`,rx:`2`,key:`afitv7`}]]};Re.node;var ze=E(Re),Be={name:`tag`,size:24,node:[[`path`,{d:`M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z`,key:`vktsd0`}],[`circle`,{cx:`7.5`,cy:`7.5`,r:`.5`,fill:`currentColor`,key:`kqv944`}]]};Be.node;var Ve=E(Be),He={name:`trash`,size:24,node:[[`path`,{d:`M10 11v6`,key:`nco0om`}],[`path`,{d:`M14 11v6`,key:`outv1u`}],[`path`,{d:`M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6`,key:`miytrc`}],[`path`,{d:`M3 6h18`,key:`d0wm0j`}],[`path`,{d:`M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2`,key:`e791ji`}]],aliases:[`trash-2`]};He.node;var Ue=E(He),We={name:`triangle-exclamation-point`,size:24,node:[[`path`,{d:`m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3`,key:`wmoenq`}],[`path`,{d:`M12 9v4`,key:`juzpu7`}],[`path`,{d:`M12 17h.01`,key:`p32p05`}]],aliases:[`alert-triangle`,`triangle-alert`]};We.node;var Ge=E(We),Ke={name:`upload`,size:24,node:[[`path`,{d:`M12 3v12`,key:`1x0j5s`}],[`path`,{d:`m17 8-5-5-5 5`,key:`7q97r8`}],[`path`,{d:`M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4`,key:`ih7n3h`}]]};Ke.node;var qe=E(Ke),Je={name:`users`,size:24,node:[[`path`,{d:`M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2`,key:`1yyitq`}],[`path`,{d:`M16 3.128a4 4 0 0 1 0 7.744`,key:`16gr8j`}],[`path`,{d:`M22 21v-2a4 4 0 0 0-3-3.87`,key:`kshegd`}],[`circle`,{cx:`9`,cy:`7`,r:`4`,key:`nufk8`}]]};Je.node;var Ye=E(Je),Xe={name:`wifi-off`,size:24,node:[[`path`,{d:`M12 20h.01`,key:`zekei9`}],[`path`,{d:`M8.5 16.429a5 5 0 0 1 7 0`,key:`1bycff`}],[`path`,{d:`M5 12.859a10 10 0 0 1 5.17-2.69`,key:`1dl1wf`}],[`path`,{d:`M19 12.859a10 10 0 0 0-2.007-1.523`,key:`4k23kn`}],[`path`,{d:`M2 8.82a15 15 0 0 1 4.177-2.643`,key:`1grhjp`}],[`path`,{d:`M22 8.82a15 15 0 0 0-11.288-3.764`,key:`z3jwby`}],[`path`,{d:`m2 2 20 20`,key:`1ooewy`}]]};Xe.node;var Ze=E(Xe),Qe={name:`wifi`,size:24,node:[[`path`,{d:`M12 20h.01`,key:`zekei9`}],[`path`,{d:`M2 8.82a15 15 0 0 1 20 0`,key:`dnpr2z`}],[`path`,{d:`M5 12.859a10 10 0 0 1 14 0`,key:`1x1e6c`}],[`path`,{d:`M8.5 16.429a5 5 0 0 1 7 0`,key:`1bycff`}]]};Qe.node;var $e=E(Qe),et={name:`x`,size:24,node:[[`path`,{d:`M18 6 6 18`,key:`1bl5f8`}],[`path`,{d:`m6 6 12 12`,key:`d8bk6v`}]]};et.node;var tt=E(et),nt=o((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.fragment`);function r(e,n,r){var i=null;if(r!==void 0&&(i=``+r),n.key!==void 0&&(i=``+n.key),`key`in n)for(var a in r={},n)a!==`key`&&(r[a]=n[a]);else r=n;return n=r.ref,{$$typeof:t,type:e,key:i,ref:n===void 0?null:n,props:r}}e.Fragment=n,e.jsx=r,e.jsxs=r})),rt=o(((e,t)=>{t.exports=nt()})),it=c(g(),1),I=rt(),at=(0,T.createContext)(null);function ot({children:e}){let[t,n]=(0,T.useState)([]),r=(0,T.useCallback)(e=>{n(t=>t.filter(t=>t.id!==e))},[]),i=(0,T.useCallback)((e,t=`info`,i=5e3)=>{let a=Date.now()+Math.random().toString(36).substring(2,9);return n(n=>[...n,{id:a,message:e,type:t}]),i>0&&setTimeout(()=>{r(a)},i),a},[r]);return(0,T.useEffect)(()=>{window.UI=window.UI||{},window.UI.toast=(e,t=`info`)=>i(e,t)},[i]),(0,I.jsxs)(at.Provider,{value:{showToast:i,removeToast:r},children:[e,(0,I.jsx)(`div`,{className:`fixed top-20 right-6 z-[100000] flex flex-col gap-2.5 w-[min(400px,calc(100vw-32px))] pointer-events-none`,children:t.map(e=>{let t=e.type===`error`,n=e.type===`success`;return(0,I.jsxs)(`div`,{className:`flex items-start gap-3 p-4 border rounded-xl bg-white shadow-xl pointer-events-auto transition-all animate-in slide-in-from-top-2 duration-200 ${t?`border-rose-200 bg-rose-50/50`:n?`border-emerald-200 bg-emerald-50/50`:`border-slate-200`}`,children:[(0,I.jsx)(`div`,{className:`mt-0.5 shrink-0`,children:t?(0,I.jsx)(he,{className:`w-5 h-5 text-rose-500`}):n?(0,I.jsx)(pe,{className:`w-5 h-5 text-emerald-500`}):(0,I.jsx)(we,{className:`w-5 h-5 text-slate-500`})}),(0,I.jsxs)(`div`,{className:`flex-1 min-w-0`,children:[(0,I.jsx)(`strong`,{className:`text-xs font-semibold text-slate-800 block`,children:t?`Something needs attention`:n?`Success`:`Notification`}),(0,I.jsx)(`p`,{className:`text-xs text-slate-600 m-0 mt-0.5 leading-relaxed break-words whitespace-pre-line`,children:e.message})]}),(0,I.jsx)(`button`,{type:`button`,onClick:()=>r(e.id),className:`p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer shrink-0`,"aria-label":`Close notification`,children:(0,I.jsx)(tt,{className:`w-4 h-4`})})]},e.id)})})]})}function st(){let e=(0,T.useContext)(at);if(!e)throw Error(`useToast must be used within a ToastProvider`);return e}function ct({activeModule:e,isConnected:t}){return(0,I.jsxs)(`header`,{className:`h-16 shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-30`,children:[(0,I.jsxs)(`div`,{className:`flex items-center gap-3`,children:[(0,I.jsxs)(`a`,{href:`/`,className:`flex items-center gap-2.5 no-underline text-slate-800 text-[16px] font-bold tracking-tight`,children:[(0,I.jsx)(`span`,{className:`w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 shadow-xs`,children:(0,I.jsx)(`svg`,{viewBox:`0 0 24 24`,width:`20`,height:`20`,fill:`#ff7a59`,"aria-hidden":`true`,children:(0,I.jsx)(`path`,{d:`M18.894 8.016V5.17a2.25 2.25 0 0 0 1.341-2.057v-.063A2.25 2.25 0 0 0 17.985.8h-.063a2.25 2.25 0 0 0-2.25 2.25v.063c0 .878.508 1.637 1.24 2.003v2.9A6.29 6.29 0 0 0 13.9 9.38L6.02 3.29A2.5 2.5 0 1 0 4.4 4.747l7.76 6.022a6.262 6.262 0 0 0-1.077 3.53c0 1.38.442 2.656 1.19 3.693l-2.404 2.405a2.015 2.015 0 0 0-.61-.097 2.05 2.05 0 1 0 2.05 2.05 2.01 2.01 0 0 0-.097-.61l2.385-2.385a6.286 6.286 0 1 0 4.807-11.34zm-.99 9.544a3.255 3.255 0 1 1 3.255-3.255 3.259 3.259 0 0 1-3.254 3.255z`})})}),(0,I.jsx)(`strong`,{className:`text-[16px] font-bold tracking-tight text-slate-800`,children:`Hubspot Migration Tool`})]}),(0,I.jsx)(`span`,{className:`w-px h-4 bg-slate-200 inline-block mx-1`}),(0,I.jsx)(`span`,{className:`text-xs text-slate-400 font-medium`,children:(()=>{switch(e){case`data-migrate`:return`HubSpot / Data Migrate`;case`data-migrate-association`:return`HubSpot / Association Migration`;case`monday`:return`Monday to HubSpot`;default:return`Dashboard`}})()})]}),(0,I.jsxs)(`div`,{className:`flex items-center gap-3`,children:[(0,I.jsx)(`span`,{className:`px-2.5 py-1 bg-slate-100 rounded-md text-[11px] font-medium text-slate-500`,children:`Local workspace`}),(0,I.jsxs)(`span`,{className:`flex items-center text-xs font-semibold text-slate-600 gap-1.5`,children:[(0,I.jsx)(`span`,{className:`w-2 h-2 rounded-full ${t?`bg-emerald-500`:`bg-amber-400 animate-pulse`}`}),t?`Live`:`Connecting...`]})]})]})}function lt({activeModule:e,onSelectModule:t,mondayStep:n,onSelectMondayStep:r}){let[i,a]=(0,T.useState)(e===`data-migrate`||e===`data-migrate-association`),[o,s]=(0,T.useState)(e===`monday`),c=e=>{t(`monday`),r&&r(e)};return(0,I.jsxs)(`aside`,{className:`w-[240px] shrink-0 bg-white border-r border-slate-200 py-4 px-3 flex flex-col h-full overflow-y-auto`,children:[(0,I.jsx)(`div`,{className:`text-[10px] font-bold tracking-widest text-slate-400 px-3 mb-2 select-none`,children:`WORKSPACE`}),(0,I.jsxs)(`button`,{type:`button`,onClick:()=>t(`dashboard`),className:`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-semibold transition cursor-pointer border-0 text-left ${e===`dashboard`?`bg-[#fff0eb] text-[#df6d50]`:`text-slate-600 hover:bg-slate-50 hover:text-slate-900 bg-transparent`}`,children:[(0,I.jsx)(`span`,{className:`text-base leading-none text-slate-500 shrink-0`,children:`▦`}),(0,I.jsx)(`span`,{children:`Dashboard`})]}),(0,I.jsx)(`div`,{className:`text-[10px] font-bold tracking-widest text-slate-400 px-3 mt-6 mb-2 select-none`,children:`MIGRATION`}),(0,I.jsxs)(`div`,{className:`mt-1`,children:[(0,I.jsxs)(`button`,{type:`button`,onClick:()=>a(!i),className:`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-[13px] font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer select-none transition border-0 bg-transparent`,children:[(0,I.jsxs)(`span`,{className:`inline-flex items-center gap-2.5 font-semibold text-inherit`,children:[(0,I.jsx)(`svg`,{className:`w-[18px] h-[18px] shrink-0 inline-block align-middle`,viewBox:`0 0 24 24`,fill:`#ff7a59`,"aria-hidden":`true`,children:(0,I.jsx)(`path`,{d:`M18.894 8.016V5.17a2.25 2.25 0 0 0 1.341-2.057v-.063A2.25 2.25 0 0 0 17.985.8h-.063a2.25 2.25 0 0 0-2.25 2.25v.063c0 .878.508 1.637 1.24 2.003v2.9A6.29 6.29 0 0 0 13.9 9.38L6.02 3.29A2.5 2.5 0 1 0 4.4 4.747l7.76 6.022a6.262 6.262 0 0 0-1.077 3.53c0 1.38.442 2.656 1.19 3.693l-2.404 2.405a2.015 2.015 0 0 0-.61-.097 2.05 2.05 0 1 0 2.05 2.05 2.01 2.01 0 0 0-.097-.61l2.385-2.385a6.286 6.286 0 1 0 4.807-11.34zm-.99 9.544a3.255 3.255 0 1 1 3.255-3.255 3.259 3.259 0 0 1-3.254 3.255z`})}),(0,I.jsx)(`span`,{children:`HubSpot`})]}),(0,I.jsx)(ce,{className:`w-4 h-4 text-slate-400 transition-transform duration-200 ${i?`rotate-90`:``}`})]}),i&&(0,I.jsxs)(`nav`,{className:`flex flex-col gap-1 my-1.5 ml-3.5 pl-3 border-l border-slate-200`,"aria-label":`HubSpot`,children:[(0,I.jsx)(`button`,{type:`button`,onClick:()=>t(`data-migrate`),className:`px-3 py-2 rounded-md text-left text-xs transition border-0 cursor-pointer ${e===`data-migrate`?`bg-[#fff0eb] text-[#df6d50] font-semibold`:`text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium bg-transparent`}`,children:`Data Migrate`}),(0,I.jsx)(`button`,{type:`button`,onClick:()=>t(`data-migrate-association`),className:`px-3 py-2 rounded-md text-left text-xs transition border-0 cursor-pointer ${e===`data-migrate-association`?`bg-[#fff0eb] text-[#df6d50] font-semibold`:`text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium bg-transparent`}`,children:`Association Migration`})]})]}),(0,I.jsxs)(`div`,{className:`mt-1`,children:[(0,I.jsxs)(`button`,{type:`button`,onClick:()=>s(!o),className:`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-[13px] font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer select-none transition border-0 bg-transparent`,children:[(0,I.jsxs)(`span`,{className:`inline-flex items-center gap-2.5 font-semibold text-inherit`,children:[(0,I.jsx)(`svg`,{className:`w-[18px] h-[18px] shrink-0 inline-block align-middle`,viewBox:`0 0 24 24`,"aria-hidden":`true`,children:(0,I.jsxs)(`g`,{transform:`translate(1.5, 5.5)`,children:[(0,I.jsx)(`path`,{d:`M2.62 12.627a2.63 2.63 0 0 1-2.292-1.33A2.54 2.54 0 0 1 .4 8.679l4.72-7.412A2.63 2.63 0 0 1 7.45.001a2.63 2.63 0 0 1 2.255 1.39 2.54 2.54 0 0 1-.142 2.614l-4.717 7.412a2.63 2.63 0 0 1-2.226 1.21`,fill:`#FF3D57`}),(0,I.jsx)(`path`,{d:`M10.716 12.627A2.62 2.62 0 0 1 8.428 11.3 2.54 2.54 0 0 1 8.5 8.689l4.711-7.395A2.63 2.63 0 0 1 15.543.001c.96.021 1.83.558 2.27 1.398.437.84.373 1.847-.17 2.626l-4.71 7.395a2.63 2.63 0 0 1-2.217 1.207`,fill:`#FFCC00`}),(0,I.jsx)(`circle`,{cx:`18.631`,cy:`10.31`,r:`2.379`,fill:`#00CA72`})]})}),(0,I.jsx)(`span`,{children:`Monday to HubSpot`})]}),(0,I.jsx)(ce,{className:`w-4 h-4 text-slate-400 transition-transform duration-200 ${o?`rotate-90`:``}`})]}),o&&(0,I.jsx)(`nav`,{className:`flex flex-col gap-1 my-1.5 ml-3.5 pl-3 border-l border-slate-200`,"aria-label":`Migration steps`,children:[{idx:0,label:`Choose workbook`,sub:`Select your Monday export`},{idx:1,label:`Map columns`,sub:`Choose HubSpot destinations`},{idx:2,label:`Review & validate`,sub:`Check before you import`},{idx:3,label:`Run & monitor`,sub:`Follow the live results`}].map(t=>{let r=e===`monday`&&n===t.idx;return(0,I.jsxs)(`button`,{type:`button`,onClick:()=>c(t.idx),className:`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs transition border-0 cursor-pointer ${r?`bg-[#fff0eb] text-[#df6d50] font-semibold`:`text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium bg-transparent`}`,children:[(0,I.jsx)(`span`,{className:`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border ${r?`bg-[#ff7a59] border-[#ff7a59] text-white`:`border-slate-300 bg-white text-slate-500`}`,children:t.idx+1}),(0,I.jsx)(`span`,{children:(0,I.jsx)(`strong`,{children:t.label})})]},t.idx)})})]}),(0,I.jsxs)(`div`,{className:`mt-auto pt-6 text-[11px] text-slate-400 flex items-center gap-1.5 select-none`,children:[(0,I.jsx)(`i`,{className:`inline-block w-2 h-2 rounded-full mr-1.5 bg-emerald-500`}),` Private & local`]})]})}async function L(e,t=`GET`,n){let r={method:t,headers:{}};n instanceof FormData?r.body=n:n!==void 0&&(r.headers[`Content-Type`]=`application/json`,r.body=JSON.stringify(n));let i=await fetch(e,r);if(!i.ok){let e=`HTTP ${i.status}`;try{let t=await i.json();e=t.error||t.message||e}catch{}throw Error(e)}return(i.headers.get(`content-type`)||``).includes(`application/json`)?i.json():i}async function ut(e,t){let n=await fetch(e);if(!n.ok){let e=`Download failed (HTTP ${n.status})`;try{e=(await n.json()).error||e}catch{}throw Error(e)}let r=(n.headers.get(`Content-Disposition`)||``).match(/filename="([^"]+)"/),i=r?r[1]:t,a=await n.blob(),o=URL.createObjectURL(a),s=document.createElement(`a`);s.href=o,s.download=i,document.body.appendChild(s),s.click(),document.body.removeChild(s),setTimeout(()=>URL.revokeObjectURL(o),1e4)}function dt(e,t){t===void 0&&(t={});var n=t.insertAt;if(e&&typeof document<`u`){var r=document.head||document.getElementsByTagName(`head`)[0],i=document.createElement(`style`);i.type=`text/css`,n===`top`&&r.firstChild?r.insertBefore(i,r.firstChild):r.appendChild(i),i.styleSheet?i.styleSheet.cssText=e:i.appendChild(document.createTextNode(e))}}dt(`.react-loading-indicator-normalize,
[class$=rli-bounding-box] {
  font-size: 1rem;
  display: inline-block;
  box-sizing: border-box;
  text-align: unset;
  isolation: isolate;
}

.rli-d-i-b {
  display: inline-block;
}

.rli-text-format {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
  width: 90%;
  text-transform: uppercase;
  text-align: center;
  font-size: 0.7em;
  letter-spacing: 0.5px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Avenir Next", "Avenir", "Segoe UI", "Lucida Grande", "Helvetica Neue", "Helvetica", "Fira Sans", "Roboto", "Noto", "Droid Sans", "Cantarell", "Oxygen", "Ubuntu", "Franklin Gothic Medium", "Century Gothic", "Liberation Sans", sans-serif;
}`);var ft=function(){return ft=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var i in t=arguments[n])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e},ft.apply(this,arguments)};function pt(e){return pt=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},pt(e)}var mt=/^\s+/,ht=/\s+$/;function R(e,t){if(t||={},(e||=``)instanceof R)return e;if(!(this instanceof R))return new R(e,t);var n=function(e){var t={r:0,g:0,b:0},n=1,r=null,i=null,a=null,o=!1,s=!1;typeof e==`string`&&(e=function(e){e=e.replace(mt,``).replace(ht,``).toLowerCase();var t,n=!1;if(Mt[e])e=Mt[e],n=!0;else if(e==`transparent`)return{r:0,g:0,b:0,a:0,format:`name`};return(t=Wt.rgb.exec(e))?{r:t[1],g:t[2],b:t[3]}:(t=Wt.rgba.exec(e))?{r:t[1],g:t[2],b:t[3],a:t[4]}:(t=Wt.hsl.exec(e))?{h:t[1],s:t[2],l:t[3]}:(t=Wt.hsla.exec(e))?{h:t[1],s:t[2],l:t[3],a:t[4]}:(t=Wt.hsv.exec(e))?{h:t[1],s:t[2],v:t[3]}:(t=Wt.hsva.exec(e))?{h:t[1],s:t[2],v:t[3],a:t[4]}:(t=Wt.hex8.exec(e))?{r:It(t[1]),g:It(t[2]),b:It(t[3]),a:Bt(t[4]),format:n?`name`:`hex8`}:(t=Wt.hex6.exec(e))?{r:It(t[1]),g:It(t[2]),b:It(t[3]),format:n?`name`:`hex`}:(t=Wt.hex4.exec(e))?{r:It(t[1]+``+t[1]),g:It(t[2]+``+t[2]),b:It(t[3]+``+t[3]),a:Bt(t[4]+``+t[4]),format:n?`name`:`hex8`}:(t=Wt.hex3.exec(e))?{r:It(t[1]+``+t[1]),g:It(t[2]+``+t[2]),b:It(t[3]+``+t[3]),format:n?`name`:`hex`}:!1}(e)),pt(e)==`object`&&(B(e.r)&&B(e.g)&&B(e.b)?(c=e.r,l=e.g,u=e.b,t={r:255*z(c,255),g:255*z(l,255),b:255*z(u,255)},o=!0,s=String(e.r).substr(-1)===`%`?`prgb`:`rgb`):B(e.h)&&B(e.s)&&B(e.v)?(r=Rt(e.s),i=Rt(e.v),t=function(e,t,n){e=6*z(e,360),t=z(t,100),n=z(n,100);var r=Math.floor(e),i=e-r,a=n*(1-t),o=n*(1-i*t),s=n*(1-(1-i)*t),c=r%6,l=[n,o,a,a,s,n][c],u=[s,n,n,o,a,a][c],d=[a,a,s,n,n,o][c];return{r:255*l,g:255*u,b:255*d}}(e.h,r,i),o=!0,s=`hsv`):B(e.h)&&B(e.s)&&B(e.l)&&(r=Rt(e.s),a=Rt(e.l),t=function(e,t,n){var r,i,a;function o(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+6*(t-e)*n:n<.5?t:n<2/3?e+(t-e)*(2/3-n)*6:e}if(e=z(e,360),t=z(t,100),n=z(n,100),t===0)r=i=a=n;else{var s=n<.5?n*(1+t):n+t-n*t,c=2*n-s;r=o(c,s,e+1/3),i=o(c,s,e),a=o(c,s,e-1/3)}return{r:255*r,g:255*i,b:255*a}}(e.h,r,a),o=!0,s=`hsl`),e.hasOwnProperty(`a`)&&(n=e.a));var c,l,u;return n=Pt(n),{ok:o,format:e.format||s,r:Math.min(255,Math.max(t.r,0)),g:Math.min(255,Math.max(t.g,0)),b:Math.min(255,Math.max(t.b,0)),a:n}}(e);this._originalInput=e,this._r=n.r,this._g=n.g,this._b=n.b,this._a=n.a,this._roundA=Math.round(100*this._a)/100,this._format=t.format||n.format,this._gradientType=t.gradientType,this._r<1&&(this._r=Math.round(this._r)),this._g<1&&(this._g=Math.round(this._g)),this._b<1&&(this._b=Math.round(this._b)),this._ok=n.ok}function gt(e,t,n){e=z(e,255),t=z(t,255),n=z(n,255);var r,i,a=Math.max(e,t,n),o=Math.min(e,t,n),s=(a+o)/2;if(a==o)r=i=0;else{var c=a-o;switch(i=s>.5?c/(2-a-o):c/(a+o),a){case e:r=(t-n)/c+(t<n?6:0);break;case t:r=(n-e)/c+2;break;case n:r=(e-t)/c+4}r/=6}return{h:r,s:i,l:s}}function _t(e,t,n){e=z(e,255),t=z(t,255),n=z(n,255);var r,i,a=Math.max(e,t,n),o=Math.min(e,t,n),s=a,c=a-o;if(i=a===0?0:c/a,a==o)r=0;else{switch(a){case e:r=(t-n)/c+(t<n?6:0);break;case t:r=(n-e)/c+2;break;case n:r=(e-t)/c+4}r/=6}return{h:r,s:i,v:s}}function vt(e,t,n,r){var i=[Lt(Math.round(e).toString(16)),Lt(Math.round(t).toString(16)),Lt(Math.round(n).toString(16))];return r&&i[0].charAt(0)==i[0].charAt(1)&&i[1].charAt(0)==i[1].charAt(1)&&i[2].charAt(0)==i[2].charAt(1)?i[0].charAt(0)+i[1].charAt(0)+i[2].charAt(0):i.join(``)}function yt(e,t,n,r){return[Lt(zt(r)),Lt(Math.round(e).toString(16)),Lt(Math.round(t).toString(16)),Lt(Math.round(n).toString(16))].join(``)}function bt(e,t){t=t===0?0:t||10;var n=R(e).toHsl();return n.s-=t/100,n.s=Ft(n.s),R(n)}function xt(e,t){t=t===0?0:t||10;var n=R(e).toHsl();return n.s+=t/100,n.s=Ft(n.s),R(n)}function St(e){return R(e).desaturate(100)}function Ct(e,t){t=t===0?0:t||10;var n=R(e).toHsl();return n.l+=t/100,n.l=Ft(n.l),R(n)}function wt(e,t){t=t===0?0:t||10;var n=R(e).toRgb();return n.r=Math.max(0,Math.min(255,n.r-Math.round(-t/100*255))),n.g=Math.max(0,Math.min(255,n.g-Math.round(-t/100*255))),n.b=Math.max(0,Math.min(255,n.b-Math.round(-t/100*255))),R(n)}function Tt(e,t){t=t===0?0:t||10;var n=R(e).toHsl();return n.l-=t/100,n.l=Ft(n.l),R(n)}function Et(e,t){var n=R(e).toHsl(),r=(n.h+t)%360;return n.h=r<0?360+r:r,R(n)}function Dt(e){var t=R(e).toHsl();return t.h=(t.h+180)%360,R(t)}function Ot(e,t){if(isNaN(t)||t<=0)throw Error(`Argument to polyad must be a positive number`);for(var n=R(e).toHsl(),r=[R(e)],i=360/t,a=1;a<t;a++)r.push(R({h:(n.h+a*i)%360,s:n.s,l:n.l}));return r}function kt(e){var t=R(e).toHsl(),n=t.h;return[R(e),R({h:(n+72)%360,s:t.s,l:t.l}),R({h:(n+216)%360,s:t.s,l:t.l})]}function At(e,t,n){t||=6,n||=30;var r=R(e).toHsl(),i=360/n,a=[R(e)];for(r.h=(r.h-(i*t>>1)+720)%360;--t;)r.h=(r.h+i)%360,a.push(R(r));return a}function jt(e,t){t||=6;for(var n=R(e).toHsv(),r=n.h,i=n.s,a=n.v,o=[],s=1/t;t--;)o.push(R({h:r,s:i,v:a})),a=(a+s)%1;return o}R.prototype={isDark:function(){return this.getBrightness()<128},isLight:function(){return!this.isDark()},isValid:function(){return this._ok},getOriginalInput:function(){return this._originalInput},getFormat:function(){return this._format},getAlpha:function(){return this._a},getBrightness:function(){var e=this.toRgb();return(299*e.r+587*e.g+114*e.b)/1e3},getLuminance:function(){var e,t,n,r=this.toRgb();return e=r.r/255,t=r.g/255,n=r.b/255,.2126*(e<=.03928?e/12.92:((e+.055)/1.055)**2.4)+.7152*(t<=.03928?t/12.92:((t+.055)/1.055)**2.4)+.0722*(n<=.03928?n/12.92:((n+.055)/1.055)**2.4)},setAlpha:function(e){return this._a=Pt(e),this._roundA=Math.round(100*this._a)/100,this},toHsv:function(){var e=_t(this._r,this._g,this._b);return{h:360*e.h,s:e.s,v:e.v,a:this._a}},toHsvString:function(){var e=_t(this._r,this._g,this._b),t=Math.round(360*e.h),n=Math.round(100*e.s),r=Math.round(100*e.v);return this._a==1?`hsv(`+t+`, `+n+`%, `+r+`%)`:`hsva(`+t+`, `+n+`%, `+r+`%, `+this._roundA+`)`},toHsl:function(){var e=gt(this._r,this._g,this._b);return{h:360*e.h,s:e.s,l:e.l,a:this._a}},toHslString:function(){var e=gt(this._r,this._g,this._b),t=Math.round(360*e.h),n=Math.round(100*e.s),r=Math.round(100*e.l);return this._a==1?`hsl(`+t+`, `+n+`%, `+r+`%)`:`hsla(`+t+`, `+n+`%, `+r+`%, `+this._roundA+`)`},toHex:function(e){return vt(this._r,this._g,this._b,e)},toHexString:function(e){return`#`+this.toHex(e)},toHex8:function(e){return function(e,t,n,r,i){var a=[Lt(Math.round(e).toString(16)),Lt(Math.round(t).toString(16)),Lt(Math.round(n).toString(16)),Lt(zt(r))];return i&&a[0].charAt(0)==a[0].charAt(1)&&a[1].charAt(0)==a[1].charAt(1)&&a[2].charAt(0)==a[2].charAt(1)&&a[3].charAt(0)==a[3].charAt(1)?a[0].charAt(0)+a[1].charAt(0)+a[2].charAt(0)+a[3].charAt(0):a.join(``)}(this._r,this._g,this._b,this._a,e)},toHex8String:function(e){return`#`+this.toHex8(e)},toRgb:function(){return{r:Math.round(this._r),g:Math.round(this._g),b:Math.round(this._b),a:this._a}},toRgbString:function(){return this._a==1?`rgb(`+Math.round(this._r)+`, `+Math.round(this._g)+`, `+Math.round(this._b)+`)`:`rgba(`+Math.round(this._r)+`, `+Math.round(this._g)+`, `+Math.round(this._b)+`, `+this._roundA+`)`},toPercentageRgb:function(){return{r:Math.round(100*z(this._r,255))+`%`,g:Math.round(100*z(this._g,255))+`%`,b:Math.round(100*z(this._b,255))+`%`,a:this._a}},toPercentageRgbString:function(){return this._a==1?`rgb(`+Math.round(100*z(this._r,255))+`%, `+Math.round(100*z(this._g,255))+`%, `+Math.round(100*z(this._b,255))+`%)`:`rgba(`+Math.round(100*z(this._r,255))+`%, `+Math.round(100*z(this._g,255))+`%, `+Math.round(100*z(this._b,255))+`%, `+this._roundA+`)`},toName:function(){return this._a===0?`transparent`:!(this._a<1)&&(Nt[vt(this._r,this._g,this._b,!0)]||!1)},toFilter:function(e){var t=`#`+yt(this._r,this._g,this._b,this._a),n=t,r=this._gradientType?`GradientType = 1, `:``;if(e){var i=R(e);n=`#`+yt(i._r,i._g,i._b,i._a)}return`progid:DXImageTransform.Microsoft.gradient(`+r+`startColorstr=`+t+`,endColorstr=`+n+`)`},toString:function(e){var t=!!e;e||=this._format;var n=!1,r=this._a<1&&this._a>=0;return t||!r||e!==`hex`&&e!==`hex6`&&e!==`hex3`&&e!==`hex4`&&e!==`hex8`&&e!==`name`?(e===`rgb`&&(n=this.toRgbString()),e===`prgb`&&(n=this.toPercentageRgbString()),e!==`hex`&&e!==`hex6`||(n=this.toHexString()),e===`hex3`&&(n=this.toHexString(!0)),e===`hex4`&&(n=this.toHex8String(!0)),e===`hex8`&&(n=this.toHex8String()),e===`name`&&(n=this.toName()),e===`hsl`&&(n=this.toHslString()),e===`hsv`&&(n=this.toHsvString()),n||this.toHexString()):e===`name`&&this._a===0?this.toName():this.toRgbString()},clone:function(){return R(this.toString())},_applyModification:function(e,t){var n=e.apply(null,[this].concat([].slice.call(t)));return this._r=n._r,this._g=n._g,this._b=n._b,this.setAlpha(n._a),this},lighten:function(){return this._applyModification(Ct,arguments)},brighten:function(){return this._applyModification(wt,arguments)},darken:function(){return this._applyModification(Tt,arguments)},desaturate:function(){return this._applyModification(bt,arguments)},saturate:function(){return this._applyModification(xt,arguments)},greyscale:function(){return this._applyModification(St,arguments)},spin:function(){return this._applyModification(Et,arguments)},_applyCombination:function(e,t){return e.apply(null,[this].concat([].slice.call(t)))},analogous:function(){return this._applyCombination(At,arguments)},complement:function(){return this._applyCombination(Dt,arguments)},monochromatic:function(){return this._applyCombination(jt,arguments)},splitcomplement:function(){return this._applyCombination(kt,arguments)},triad:function(){return this._applyCombination(Ot,[3])},tetrad:function(){return this._applyCombination(Ot,[4])}},R.fromRatio=function(e,t){if(pt(e)==`object`){var n={};for(var r in e)e.hasOwnProperty(r)&&(n[r]=r===`a`?e[r]:Rt(e[r]));e=n}return R(e,t)},R.equals=function(e,t){return!(!e||!t)&&R(e).toRgbString()==R(t).toRgbString()},R.random=function(){return R.fromRatio({r:Math.random(),g:Math.random(),b:Math.random()})},R.mix=function(e,t,n){n=n===0?0:n||50;var r=R(e).toRgb(),i=R(t).toRgb(),a=n/100;return R({r:(i.r-r.r)*a+r.r,g:(i.g-r.g)*a+r.g,b:(i.b-r.b)*a+r.b,a:(i.a-r.a)*a+r.a})},R.readability=function(e,t){var n=R(e),r=R(t);return(Math.max(n.getLuminance(),r.getLuminance())+.05)/(Math.min(n.getLuminance(),r.getLuminance())+.05)},R.isReadable=function(e,t,n){var r,i,a=R.readability(e,t);switch(i=!1,(r=function(e){var t=((e||={level:`AA`,size:`small`}).level||`AA`).toUpperCase(),n=(e.size||`small`).toLowerCase();return t!==`AA`&&t!==`AAA`&&(t=`AA`),n!==`small`&&n!==`large`&&(n=`small`),{level:t,size:n}}(n)).level+r.size){case`AAsmall`:case`AAAlarge`:i=a>=4.5;break;case`AAlarge`:i=a>=3;break;case`AAAsmall`:i=a>=7}return i},R.mostReadable=function(e,t,n){var r,i,a,o,s=null,c=0;i=(n||={}).includeFallbackColors,a=n.level,o=n.size;for(var l=0;l<t.length;l++)(r=R.readability(e,t[l]))>c&&(c=r,s=R(t[l]));return R.isReadable(e,s,{level:a,size:o})||!i?s:(n.includeFallbackColors=!1,R.mostReadable(e,[`#fff`,`#000`],n))};var Mt=R.names={aliceblue:`f0f8ff`,antiquewhite:`faebd7`,aqua:`0ff`,aquamarine:`7fffd4`,azure:`f0ffff`,beige:`f5f5dc`,bisque:`ffe4c4`,black:`000`,blanchedalmond:`ffebcd`,blue:`00f`,blueviolet:`8a2be2`,brown:`a52a2a`,burlywood:`deb887`,burntsienna:`ea7e5d`,cadetblue:`5f9ea0`,chartreuse:`7fff00`,chocolate:`d2691e`,coral:`ff7f50`,cornflowerblue:`6495ed`,cornsilk:`fff8dc`,crimson:`dc143c`,cyan:`0ff`,darkblue:`00008b`,darkcyan:`008b8b`,darkgoldenrod:`b8860b`,darkgray:`a9a9a9`,darkgreen:`006400`,darkgrey:`a9a9a9`,darkkhaki:`bdb76b`,darkmagenta:`8b008b`,darkolivegreen:`556b2f`,darkorange:`ff8c00`,darkorchid:`9932cc`,darkred:`8b0000`,darksalmon:`e9967a`,darkseagreen:`8fbc8f`,darkslateblue:`483d8b`,darkslategray:`2f4f4f`,darkslategrey:`2f4f4f`,darkturquoise:`00ced1`,darkviolet:`9400d3`,deeppink:`ff1493`,deepskyblue:`00bfff`,dimgray:`696969`,dimgrey:`696969`,dodgerblue:`1e90ff`,firebrick:`b22222`,floralwhite:`fffaf0`,forestgreen:`228b22`,fuchsia:`f0f`,gainsboro:`dcdcdc`,ghostwhite:`f8f8ff`,gold:`ffd700`,goldenrod:`daa520`,gray:`808080`,green:`008000`,greenyellow:`adff2f`,grey:`808080`,honeydew:`f0fff0`,hotpink:`ff69b4`,indianred:`cd5c5c`,indigo:`4b0082`,ivory:`fffff0`,khaki:`f0e68c`,lavender:`e6e6fa`,lavenderblush:`fff0f5`,lawngreen:`7cfc00`,lemonchiffon:`fffacd`,lightblue:`add8e6`,lightcoral:`f08080`,lightcyan:`e0ffff`,lightgoldenrodyellow:`fafad2`,lightgray:`d3d3d3`,lightgreen:`90ee90`,lightgrey:`d3d3d3`,lightpink:`ffb6c1`,lightsalmon:`ffa07a`,lightseagreen:`20b2aa`,lightskyblue:`87cefa`,lightslategray:`789`,lightslategrey:`789`,lightsteelblue:`b0c4de`,lightyellow:`ffffe0`,lime:`0f0`,limegreen:`32cd32`,linen:`faf0e6`,magenta:`f0f`,maroon:`800000`,mediumaquamarine:`66cdaa`,mediumblue:`0000cd`,mediumorchid:`ba55d3`,mediumpurple:`9370db`,mediumseagreen:`3cb371`,mediumslateblue:`7b68ee`,mediumspringgreen:`00fa9a`,mediumturquoise:`48d1cc`,mediumvioletred:`c71585`,midnightblue:`191970`,mintcream:`f5fffa`,mistyrose:`ffe4e1`,moccasin:`ffe4b5`,navajowhite:`ffdead`,navy:`000080`,oldlace:`fdf5e6`,olive:`808000`,olivedrab:`6b8e23`,orange:`ffa500`,orangered:`ff4500`,orchid:`da70d6`,palegoldenrod:`eee8aa`,palegreen:`98fb98`,paleturquoise:`afeeee`,palevioletred:`db7093`,papayawhip:`ffefd5`,peachpuff:`ffdab9`,peru:`cd853f`,pink:`ffc0cb`,plum:`dda0dd`,powderblue:`b0e0e6`,purple:`800080`,rebeccapurple:`663399`,red:`f00`,rosybrown:`bc8f8f`,royalblue:`4169e1`,saddlebrown:`8b4513`,salmon:`fa8072`,sandybrown:`f4a460`,seagreen:`2e8b57`,seashell:`fff5ee`,sienna:`a0522d`,silver:`c0c0c0`,skyblue:`87ceeb`,slateblue:`6a5acd`,slategray:`708090`,slategrey:`708090`,snow:`fffafa`,springgreen:`00ff7f`,steelblue:`4682b4`,tan:`d2b48c`,teal:`008080`,thistle:`d8bfd8`,tomato:`ff6347`,turquoise:`40e0d0`,violet:`ee82ee`,wheat:`f5deb3`,white:`fff`,whitesmoke:`f5f5f5`,yellow:`ff0`,yellowgreen:`9acd32`},Nt=R.hexNames=function(e){var t={};for(var n in e)e.hasOwnProperty(n)&&(t[e[n]]=n);return t}(Mt);function Pt(e){return e=parseFloat(e),(isNaN(e)||e<0||e>1)&&(e=1),e}function z(e,t){(function(e){return typeof e==`string`&&e.indexOf(`.`)!=-1&&parseFloat(e)===1})(e)&&(e=`100%`);var n=function(e){return typeof e==`string`&&e.indexOf(`%`)!=-1}(e);return e=Math.min(t,Math.max(0,parseFloat(e))),n&&(e=parseInt(e*t,10)/100),Math.abs(e-t)<1e-6?1:e%t/parseFloat(t)}function Ft(e){return Math.min(1,Math.max(0,e))}function It(e){return parseInt(e,16)}function Lt(e){return e.length==1?`0`+e:``+e}function Rt(e){return e<=1&&(e=100*e+`%`),e}function zt(e){return Math.round(255*parseFloat(e)).toString(16)}function Bt(e){return It(e)/255}var Vt,Ht=`[\\s|\\(]+(`+(Vt=`(?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?)`)+`)[,|\\s]+(`+Vt+`)[,|\\s]+(`+Vt+`)\\s*\\)?`,Ut=`[\\s|\\(]+(`+Vt+`)[,|\\s]+(`+Vt+`)[,|\\s]+(`+Vt+`)[,|\\s]+(`+Vt+`)\\s*\\)?`,Wt={CSS_UNIT:new RegExp(Vt),rgb:RegExp(`rgb`+Ht),rgba:RegExp(`rgba`+Ut),hsl:RegExp(`hsl`+Ht),hsla:RegExp(`hsla`+Ut),hsv:RegExp(`hsv`+Ht),hsva:RegExp(`hsva`+Ut),hex3:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex6:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,hex4:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex8:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/};function B(e){return!!Wt.CSS_UNIT.exec(e)}var Gt=function(e,t){var n=(typeof e==`string`?parseInt(e):e)||0;if(n>=-5&&n<=5){var r=n,i=parseFloat(t),a=i+i/5*r*-1;return(a==0||a<=2**-52)&&(a=.1),{animationPeriod:a+`s`}}return{animationPeriod:t}},Kt=function(e,t){var n=e||{},r=``;switch(t){case`small`:r=`12px`;break;case`medium`:r=`16px`;break;case`large`:r=`20px`;break;default:r=void 0}var i={};if(n.fontSize){var a=n.fontSize;i=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols==`function`){var i=0;for(r=Object.getOwnPropertySymbols(e);i<r.length;i++)t.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(n[r[i]]=e[r[i]])}return n}(n,[`fontSize`]),r=a}return{fontSize:r,styles:i}},qt={color:`currentColor`,mixBlendMode:`difference`,width:`unset`,display:`block`,paddingTop:`2px`},Jt=function(e){var t=e.className,n=e.text,r=e.textColor,i=e.staticText,a=e.style;return n?T.createElement(`span`,{className:`rli-d-i-b rli-text-format ${t||``}`.trim(),style:ft(ft(ft({},i&&qt),r&&{color:r,mixBlendMode:`unset`}),a&&a)},typeof n==`string`&&n.length?n:`loading`):null},Yt=`rgb(50, 205, 50)`;function Xt(e,t){if(t===void 0&&(t=0),e.length===0)throw Error(`Input array cannot be empty!`);var n=[];return function e(t,r){return r===void 0&&(r=0),n.push.apply(n,t),n.length<r&&e(n,r),n.slice(0,r)}(e,t)}dt(`.atom-rli-bounding-box {
  --atom-phase1-rgb: 50, 205, 50;
  color: rgba(var(--atom-phase1-rgb), 1);
  font-size: 16px;
  position: relative;
  text-align: unset;
  isolation: isolate;
}
.atom-rli-bounding-box .atom-indicator {
  width: 6em;
  height: 6em;
  position: relative;
  perspective: 6em;
  overflow: hidden;
  color: rgba(var(--atom-phase1-rgb), 1);
  animation: calc(var(--rli-animation-duration, 1s) * 4) var(--rli-animation-function, linear) infinite uxlv7gg;
}
.atom-rli-bounding-box .atom-indicator::after, .atom-rli-bounding-box .atom-indicator::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 0.48em;
  height: 0.48em;
  margin: auto;
  border-radius: 50%;
  background-image: radial-gradient(circle at 35% 15%, rgba(var(--atom-phase1-rgb), 0.1), rgba(var(--atom-phase1-rgb), 0.3) 37%, rgba(var(--atom-phase1-rgb), 1) 100%);
  animation: calc(var(--rli-animation-duration, 1s) * 4) var(--rli-animation-function, linear) infinite uxlv7eg;
}
.atom-rli-bounding-box .atom-indicator::before {
  filter: drop-shadow(0px 0px 0.0625em currentColor);
}
.atom-rli-bounding-box .atom-indicator .electron-orbit {
  color: rgba(var(--atom-phase1-rgb), 0.85);
  border: 0;
  border-left: 0.4em solid currentColor;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  width: 4.8em;
  height: 4.8em;
  background-color: transparent;
  border-radius: 50%;
  transform-style: preserve-3d;
  animation: var(--rli-animation-duration, 1s) var(--rli-animation-function, linear) infinite uxlv7fj, calc(var(--rli-animation-duration, 1s) * 4) var(--rli-animation-function, linear) infinite uxlv7gy;
}
.atom-rli-bounding-box .atom-indicator .electron-orbit::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: 50%;
  color: rgba(var(--atom-phase1-rgb), 0.18);
  animation: calc(var(--rli-animation-duration, 1s) * 4) var(--rli-animation-function, linear) infinite uxlv7hv;
  border: 0.125em solid currentColor;
}
.atom-rli-bounding-box .atom-indicator .electron-orbit::before {
  content: "";
  width: 0.192em;
  height: 0.192em;
  position: absolute;
  border-radius: 50%;
  top: -0.096em;
  right: 0;
  bottom: 0;
  left: 0;
  margin: 0 auto;
  color: rgba(var(--atom-phase1-rgb), 1);
  box-shadow: 0px 0px 0.0625em 0.0625em currentColor, 0px 0px 0.0625em 0.125em currentColor;
  background-color: currentColor;
  transform: rotateY(-70deg);
  animation: var(--rli-animation-duration, 1s) var(--rli-animation-function, linear) infinite uxlv7ew, calc(var(--rli-animation-duration, 1s) * 4) var(--rli-animation-function, linear) infinite uxlv7gg;
}
.atom-rli-bounding-box .atom-indicator .electron-orbit:nth-of-type(1) {
  --orbit-vector-factor: -1;
  transform: rotateY(65deg) rotateX(calc(54deg * var(--orbit-vector-factor)));
}
.atom-rli-bounding-box .atom-indicator .electron-orbit:nth-of-type(2) {
  --orbit-vector-factor: 1;
  transform: rotateY(65deg) rotateX(calc(54deg * var(--orbit-vector-factor)));
}
.atom-rli-bounding-box .atom-indicator .electron-orbit:nth-of-type(3) {
  --orbit-vector-factor: 0;
  transform: rotateY(65deg) rotateX(calc(54deg * var(--orbit-vector-factor)));
  animation-delay: calc(var(--rli-animation-duration, 1s) * 0.5 * -1), calc(var(--rli-animation-duration, 1s) * 4 * -1);
}
.atom-rli-bounding-box .atom-indicator .electron-orbit:nth-of-type(3)::before {
  animation-delay: calc(var(--rli-animation-duration, 1s) * 0.5 * -1), calc(var(--rli-animation-duration, 1s) * 4 * -1);
}
.atom-rli-bounding-box .atom-text {
  color: currentColor;
  mix-blend-mode: difference;
  width: unset;
  display: block;
}

@property --atom-phase1-rgb {
  syntax: "<number>#";
  inherits: true;
  initial-value: 50, 205, 50;
}
@property --atom-phase2-rgb {
  syntax: "<number>#";
  inherits: true;
  initial-value: 50, 205, 50;
}
@property --atom-phase3-rgb {
  syntax: "<number>#";
  inherits: true;
  initial-value: 50, 205, 50;
}
@property --atom-phase4-rgb {
  syntax: "<number>#";
  inherits: true;
  initial-value: 50, 205, 50;
}
@property --rli-animation-duration {
  syntax: "<time>";
  inherits: true;
  initial-value: 1s;
}
@keyframes uxlv7fj {
  from {
    transform: rotateY(70deg) rotateX(calc(54deg * var(--orbit-vector-factor))) rotateZ(0deg);
  }
  to {
    transform: rotateY(70deg) rotateX(calc(54deg * var(--orbit-vector-factor))) rotateZ(360deg);
  }
}
@keyframes uxlv7ew {
  from {
    transform: rotateY(-70deg) rotateX(0deg);
  }
  to {
    transform: rotateY(-70deg) rotateX(-360deg);
  }
}
@keyframes uxlv7eg {
  100%, 0% {
    background-image: radial-gradient(circle at 35% 15%, rgba(var(--atom-phase1-rgb), 0.1), rgba(var(--atom-phase1-rgb), 0.3) 37%, rgba(var(--atom-phase1-rgb), 1) 100%);
  }
  20% {
    background-image: radial-gradient(circle at 35% 15%, rgba(var(--atom-phase1-rgb), 0.1), rgba(var(--atom-phase1-rgb), 0.3) 37%, rgba(var(--atom-phase1-rgb), 1) 100%);
  }
  25% {
    background-image: radial-gradient(circle at 35% 15%, rgba(var(--atom-phase2-rgb, var(--atom-phase1-rgb)), 0.1), rgba(var(--atom-phase2-rgb, var(--atom-phase1-rgb)), 0.3) 37%, rgba(var(--atom-phase2-rgb, var(--atom-phase1-rgb)), 1) 100%);
  }
  45% {
    background-image: radial-gradient(circle at 35% 15%, rgba(var(--atom-phase2-rgb, var(--atom-phase1-rgb)), 0.1), rgba(var(--atom-phase2-rgb, var(--atom-phase1-rgb)), 0.3) 37%, rgba(var(--atom-phase2-rgb, var(--atom-phase1-rgb)), 1) 100%);
  }
  50% {
    background-image: radial-gradient(circle at 35% 15%, rgba(var(--atom-phase3-rgb, var(--atom-phase1-rgb)), 0.1), rgba(var(--atom-phase3-rgb, var(--atom-phase1-rgb)), 0.3) 37%, rgba(var(--atom-phase3-rgb, var(--atom-phase1-rgb)), 1) 100%);
  }
  70% {
    background-image: radial-gradient(circle at 35% 15%, rgba(var(--atom-phase3-rgb, var(--atom-phase1-rgb)), 0.1), rgba(var(--atom-phase3-rgb, var(--atom-phase1-rgb)), 0.3) 37%, rgba(var(--atom-phase3-rgb, var(--atom-phase1-rgb)), 1) 100%);
  }
  75% {
    background-image: radial-gradient(circle at 35% 15%, rgba(var(--atom-phase4-rgb, var(--atom-phase1-rgb)), 0.1), rgba(var(--atom-phase4-rgb, var(--atom-phase1-rgb)), 0.3) 37%, rgba(var(--atom-phase4-rgb, var(--atom-phase1-rgb)), 1) 100%);
  }
  95% {
    background-image: radial-gradient(circle at 35% 15%, rgba(var(--atom-phase4-rgb, var(--atom-phase1-rgb)), 0.1), rgba(var(--atom-phase4-rgb, var(--atom-phase1-rgb)), 0.3) 37%, rgba(var(--atom-phase4-rgb, var(--atom-phase1-rgb)), 1) 100%);
  }
}
@keyframes uxlv7gg {
  100%, 0% {
    color: rgba(var(--atom-phase1-rgb), 1);
  }
  20% {
    color: rgba(var(--atom-phase1-rgb), 1);
  }
  25% {
    color: rgba(var(--atom-phase2-rgb, var(--atom-phase1-rgb)), 1);
  }
  45% {
    color: rgba(var(--atom-phase2-rgb, var(--atom-phase1-rgb)), 1);
  }
  50% {
    color: rgba(var(--atom-phase3-rgb, var(--atom-phase1-rgb)), 1);
  }
  70% {
    color: rgba(var(--atom-phase3-rgb, var(--atom-phase1-rgb)), 1);
  }
  75% {
    color: rgba(var(--atom-phase4-rgb, var(--atom-phase1-rgb)), 1);
  }
  95% {
    color: rgba(var(--atom-phase4-rgb, var(--atom-phase1-rgb)), 1);
  }
}
@keyframes uxlv7gy {
  100%, 0% {
    color: rgba(var(--atom-phase1-rgb), 0.85);
  }
  20% {
    color: rgba(var(--atom-phase1-rgb), 0.85);
  }
  25% {
    color: rgba(var(--atom-phase2-rgb, var(--atom-phase1-rgb)), 0.85);
  }
  45% {
    color: rgba(var(--atom-phase2-rgb, var(--atom-phase1-rgb)), 0.85);
  }
  50% {
    color: rgba(var(--atom-phase3-rgb, var(--atom-phase1-rgb)), 0.85);
  }
  70% {
    color: rgba(var(--atom-phase3-rgb, var(--atom-phase1-rgb)), 0.85);
  }
  75% {
    color: rgba(var(--atom-phase4-rgb, var(--atom-phase1-rgb)), 0.85);
  }
  95% {
    color: rgba(var(--atom-phase4-rgb, var(--atom-phase1-rgb)), 0.85);
  }
}
@keyframes uxlv7hv {
  100%, 0% {
    color: rgba(var(--atom-phase1-rgb), 0.18);
  }
  20% {
    color: rgba(var(--atom-phase1-rgb), 0.18);
  }
  25% {
    color: rgba(var(--atom-phase2-rgb, var(--atom-phase1-rgb)), 0.18);
  }
  45% {
    color: rgba(var(--atom-phase2-rgb, var(--atom-phase1-rgb)), 0.18);
  }
  50% {
    color: rgba(var(--atom-phase3-rgb, var(--atom-phase1-rgb)), 0.18);
  }
  70% {
    color: rgba(var(--atom-phase3-rgb, var(--atom-phase1-rgb)), 0.18);
  }
  75% {
    color: rgba(var(--atom-phase4-rgb, var(--atom-phase1-rgb)), 0.18);
  }
  95% {
    color: rgba(var(--atom-phase4-rgb, var(--atom-phase1-rgb)), 0.18);
  }
}`),R(Yt).toRgb(),Array.from({length:4},(function(e,t){return`--atom-phase${t+1}-rgb`})),dt(`.commet-rli-bounding-box {
  --commet-phase1-color: rgb(50, 205, 50);
  font-size: 16px;
  width: 6.85em;
  height: 6.85em;
  overflow: hidden;
  display: inline-block;
  box-sizing: border-box;
  position: relative;
  isolation: isolate;
}
.commet-rli-bounding-box .commet-indicator {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  box-sizing: border-box;
  width: 6em;
  height: 6em;
  color: var(--commet-phase1-color);
  display: inline-block;
  isolation: isolate;
  position: absolute;
  z-index: 0;
  animation: calc(var(--rli-animation-duration, 1.2s) * 4) var(--rli-animation-function, cubic-bezier(0.08, 0.03, 0.91, 0.93)) infinite uxlv7cp;
}
.commet-rli-bounding-box .commet-indicator .commet-box {
  position: absolute;
  display: inline-block;
  top: 0;
  right: 0;
  bottom: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  animation: uxlv7bx var(--rli-animation-duration, 1.2s) var(--rli-animation-function, cubic-bezier(0.08, 0.03, 0.91, 0.93)) infinite;
}
.commet-rli-bounding-box .commet-indicator .commet-box:nth-of-type(1) {
  width: 100%;
  height: 100%;
  animation-direction: normal;
}
.commet-rli-bounding-box .commet-indicator .commet-box:nth-of-type(2) {
  width: 70%;
  height: 70%;
  animation-direction: reverse;
}
.commet-rli-bounding-box .commet-indicator .commet-box .commetball-box {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  bottom: 0;
  left: 0;
  display: inline-block;
}
.commet-rli-bounding-box .commet-indicator .commet-box .commetball-box::before {
  content: "";
  width: 0.5em;
  height: 0.5em;
  border-radius: 50%;
  background-color: currentColor;
  position: absolute;
  top: -0.125em;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 0.2em 0em currentColor, 0 0 0.6em 0em currentColor;
}
.commet-rli-bounding-box .commet-indicator .commet-box .commet-trail {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  bottom: 0;
  left: 0;
  border-radius: 50%;
  box-sizing: border-box;
  border-style: solid;
}
.commet-rli-bounding-box .commet-indicator .commet-box .commet-trail.trail1 {
  border-color: currentColor transparent transparent currentColor;
  border-width: 0.25em 0.25em 0 0;
  transform: rotateZ(-45deg);
}
.commet-rli-bounding-box .commet-indicator .commet-box .commet-trail.trail2 {
  border-color: currentColor currentColor transparent transparent;
  border-width: 0.25em 0 0 0.25em;
  transform: rotateZ(45deg);
}
.commet-rli-bounding-box .commet-text {
  mix-blend-mode: difference;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--commet-phase1-color);
}

@property --commet-phase1-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --commet-phase2-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --commet-phase3-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --commet-phase4-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --rli-animation-duration {
  syntax: "<time>";
  inherits: true;
  initial-value: 1.2s;
}
@keyframes uxlv7bx {
  to {
    transform: rotate(1turn);
  }
}
@keyframes uxlv7cp {
  100%, 0% {
    color: var(--commet-phase1-color);
  }
  20% {
    color: var(--commet-phase1-color);
  }
  25% {
    color: var(--commet-phase2-color, var(--commet-phase1-color));
  }
  45% {
    color: var(--commet-phase2-color, var(--commet-phase1-color));
  }
  50% {
    color: var(--commet-phase3-color, var(--commet-phase1-color));
  }
  70% {
    color: var(--commet-phase3-color, var(--commet-phase1-color));
  }
  75% {
    color: var(--commet-phase4-color, var(--commet-phase1-color));
  }
  95% {
    color: var(--commet-phase4-color, var(--commet-phase1-color));
  }
}`);var Zt=Array.from({length:4},(function(e,t){return`--commet-phase${t+1}-color`})),Qt=function(e){var t=Kt(e?.style,e?.size),n=t.styles,r=t.fontSize,i=e?.easing,a=Gt(e?.speedPlus,`1.2s`).animationPeriod,o=function(e){var t={};if(e instanceof Array){for(var n=Xt(e,Zt.length),r=0;r<n.length&&!(r>=4);r++)t[Zt[r]]=n[r];return t}try{if(typeof e!=`string`)throw Error(`Color String expected`);for(var i=0;i<Zt.length;i++)t[Zt[i]]=e}catch(n){for(n instanceof Error?console.warn(`[${n.message}]: Received "${typeof e}" instead with value, ${JSON.stringify(e)}`):console.warn(`${JSON.stringify(e)} received in <Commet /> indicator cannot be processed. Using default instead!`),i=0;i<Zt.length;i++)t[Zt[i]]=Yt}return t}(e?.color??``);return T.createElement(`span`,{className:`rli-d-i-b commet-rli-bounding-box`,style:ft(ft(ft(ft(ft({},r&&{fontSize:r}),a&&{"--rli-animation-duration":a}),i&&{"--rli-animation-function":i}),o),n),role:`status`,"aria-live":`polite`,"aria-label":`Loading`},T.createElement(`span`,{className:`rli-d-i-b commet-indicator`},T.createElement(`span`,{className:`rli-d-i-b commet-box`},T.createElement(`span`,{className:`rli-d-i-b commet-trail trail1`}),T.createElement(`span`,{className:`rli-d-i-b  commetball-box`})),T.createElement(`span`,{className:`rli-d-i-b commet-box`},T.createElement(`span`,{className:`rli-d-i-b commet-trail trail2`}),T.createElement(`span`,{className:`rli-d-i-b commetball-box`})),T.createElement(Jt,{className:`commet-text`,text:e?.text,textColor:e?.textColor})))};dt(`.OP-annulus-rli-bounding-box {
  --OP-annulus-phase1-color: rgb(50, 205, 50);
  font-size: 16px;
  display: inline-block;
}
.OP-annulus-rli-bounding-box .OP-annulus-indicator {
  width: 5em;
  height: 5em;
  color: var(--OP-annulus-phase1-color);
  display: inline-block;
  position: relative;
  z-index: 0;
}
.OP-annulus-rli-bounding-box .OP-annulus-indicator .whirl {
  animation: uxlv7n7 calc(var(--rli-animation-duration, 1.5s) * 1.33) linear infinite;
  height: 100%;
  transform-origin: center center;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
.OP-annulus-rli-bounding-box .OP-annulus-indicator .path {
  stroke-dasharray: 1, 125;
  stroke-dashoffset: 0;
  animation: var(--rli-animation-duration, 1.5s) var(--rli-animation-function, ease-in-out) infinite uxlv7oa, calc(var(--rli-animation-duration, 1.5s) * 4) var(--rli-animation-function, ease-in-out) infinite uxlv7p5;
  stroke-linecap: round;
}
.OP-annulus-rli-bounding-box .OP-annulus-text {
  mix-blend-mode: difference;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -2;
}

@property --OP-annulus-phase1-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --OP-annulus-phase2-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --OP-annulus-phase3-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --OP-annulus-phase4-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --rli-animation-duration {
  syntax: "<time>";
  inherits: true;
  initial-value: 1.5s;
}
@keyframes uxlv7n7 {
  100% {
    transform: rotate(360deg);
  }
}
@keyframes uxlv7oa {
  0% {
    stroke-dasharray: 1, 125;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 98, 125;
    stroke-dashoffset: -35px;
  }
  100% {
    stroke-dasharray: 98, 125;
    stroke-dashoffset: -124px;
  }
}
@keyframes uxlv7p5 {
  100%, 0% {
    stroke: var(--OP-annulus-phase1-color);
  }
  22% {
    stroke: var(--OP-annulus-phase1-color);
  }
  25% {
    stroke: var(--OP-annulus-phase2-color, var(--OP-annulus-phase1-color));
  }
  42% {
    stroke: var(--OP-annulus-phase2-color, var(--OP-annulus-phase1-color));
  }
  50% {
    stroke: var(--OP-annulus-phase3-color, var(--OP-annulus-phase1-color));
  }
  72% {
    stroke: var(--OP-annulus-phase3-color, var(--OP-annulus-phase1-color));
  }
  75% {
    stroke: var(--OP-annulus-phase4-color, var(--OP-annulus-phase1-color));
  }
  97% {
    stroke: var(--OP-annulus-phase4-color, var(--OP-annulus-phase1-color));
  }
}`),Array.from({length:4},(function(e,t){return`--OP-annulus-phase${t+1}-color`}));function $t(e){return e&&e.Math===Math&&e}dt(`.OP-dotted-rli-bounding-box {
  --OP-dotted-phase1-color: rgb(50, 205, 50);
  font-size: 16px;
  box-sizing: border-box;
  display: inline-block;
}
.OP-dotted-rli-bounding-box .OP-dotted-indicator {
  width: 5em;
  height: 5em;
  color: var(--OP-dotted-phase1-color);
  display: inline-block;
  position: relative;
  z-index: 0;
}
.OP-dotted-rli-bounding-box .OP-dotted-indicator .OP-dotted-text {
  mix-blend-mode: difference;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -2;
}
.OP-dotted-rli-bounding-box .OP-dotted-indicator .dot-shape-holder {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}
.OP-dotted-rli-bounding-box .OP-dotted-indicator .dot-shape-holder .dot {
  display: block;
  margin: 0 auto;
  width: 15%;
  height: 15%;
  background-color: currentColor;
  border-radius: 50%;
  animation: var(--rli-animation-duration, 1.2s) var(--rli-animation-function, ease-in-out) infinite uxlv7nu, calc(var(--rli-animation-duration, 1.2s) * 4) var(--rli-animation-function, ease-in-out) infinite uxlv7ol;
}
.OP-dotted-rli-bounding-box .OP-dotted-indicator .dot-shape-holder:nth-of-type(1) {
  transform: rotate(0deg);
}
.OP-dotted-rli-bounding-box .OP-dotted-indicator .dot-shape-holder:nth-of-type(1) .dot {
  animation-delay: calc(var(--rli-animation-duration, 1.2s) / 12 * 12 * -1);
}
.OP-dotted-rli-bounding-box .OP-dotted-indicator .dot-shape-holder:nth-of-type(2) {
  transform: rotate(30deg);
}
.OP-dotted-rli-bounding-box .OP-dotted-indicator .dot-shape-holder:nth-of-type(2) .dot {
  animation-delay: calc(var(--rli-animation-duration, 1.2s) / 12 * 11 * -1);
}
.OP-dotted-rli-bounding-box .OP-dotted-indicator .dot-shape-holder:nth-of-type(3) {
  transform: rotate(60deg);
}
.OP-dotted-rli-bounding-box .OP-dotted-indicator .dot-shape-holder:nth-of-type(3) .dot {
  animation-delay: calc(var(--rli-animation-duration, 1.2s) / 12 * 10 * -1);
}
.OP-dotted-rli-bounding-box .OP-dotted-indicator .dot-shape-holder:nth-of-type(4) {
  transform: rotate(90deg);
}
.OP-dotted-rli-bounding-box .OP-dotted-indicator .dot-shape-holder:nth-of-type(4) .dot {
  animation-delay: calc(var(--rli-animation-duration, 1.2s) / 12 * 9 * -1);
}
.OP-dotted-rli-bounding-box .OP-dotted-indicator .dot-shape-holder:nth-of-type(5) {
  transform: rotate(120deg);
}
.OP-dotted-rli-bounding-box .OP-dotted-indicator .dot-shape-holder:nth-of-type(5) .dot {
  animation-delay: calc(var(--rli-animation-duration, 1.2s) / 12 * 8 * -1);
}
.OP-dotted-rli-bounding-box .OP-dotted-indicator .dot-shape-holder:nth-of-type(6) {
  transform: rotate(150deg);
}
.OP-dotted-rli-bounding-box .OP-dotted-indicator .dot-shape-holder:nth-of-type(6) .dot {
  animation-delay: calc(var(--rli-animation-duration, 1.2s) / 12 * 7 * -1);
}
.OP-dotted-rli-bounding-box .OP-dotted-indicator .dot-shape-holder:nth-of-type(7) {
  transform: rotate(180deg);
}
.OP-dotted-rli-bounding-box .OP-dotted-indicator .dot-shape-holder:nth-of-type(7) .dot {
  animation-delay: calc(var(--rli-animation-duration, 1.2s) / 12 * 6 * -1);
}
.OP-dotted-rli-bounding-box .OP-dotted-indicator .dot-shape-holder:nth-of-type(8) {
  transform: rotate(210deg);
}
.OP-dotted-rli-bounding-box .OP-dotted-indicator .dot-shape-holder:nth-of-type(8) .dot {
  animation-delay: calc(var(--rli-animation-duration, 1.2s) / 12 * 5 * -1);
}
.OP-dotted-rli-bounding-box .OP-dotted-indicator .dot-shape-holder:nth-of-type(9) {
  transform: rotate(240deg);
}
.OP-dotted-rli-bounding-box .OP-dotted-indicator .dot-shape-holder:nth-of-type(9) .dot {
  animation-delay: calc(var(--rli-animation-duration, 1.2s) / 12 * 4 * -1);
}
.OP-dotted-rli-bounding-box .OP-dotted-indicator .dot-shape-holder:nth-of-type(10) {
  transform: rotate(270deg);
}
.OP-dotted-rli-bounding-box .OP-dotted-indicator .dot-shape-holder:nth-of-type(10) .dot {
  animation-delay: calc(var(--rli-animation-duration, 1.2s) / 12 * 3 * -1);
}
.OP-dotted-rli-bounding-box .OP-dotted-indicator .dot-shape-holder:nth-of-type(11) {
  transform: rotate(300deg);
}
.OP-dotted-rli-bounding-box .OP-dotted-indicator .dot-shape-holder:nth-of-type(11) .dot {
  animation-delay: calc(var(--rli-animation-duration, 1.2s) / 12 * 2 * -1);
}
.OP-dotted-rli-bounding-box .OP-dotted-indicator .dot-shape-holder:nth-of-type(12) {
  transform: rotate(330deg);
}
.OP-dotted-rli-bounding-box .OP-dotted-indicator .dot-shape-holder:nth-of-type(12) .dot {
  animation-delay: calc(var(--rli-animation-duration, 1.2s) / 12 * 1 * -1);
}

@property --OP-dotted-phase1-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --OP-dotted-phase2-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --OP-dotted-phase3-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --OP-dotted-phase4-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --rli-animation-duration {
  syntax: "<time>";
  inherits: true;
  initial-value: 1.2s;
}
@keyframes uxlv7nu {
  0%, 39%, 100% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
}
@keyframes uxlv7ol {
  100%, 0% {
    background-color: var(--OP-dotted-phase1-color);
  }
  22% {
    background-color: var(--OP-dotted-phase1-color);
  }
  25% {
    background-color: var(--OP-dotted-phase2-color, var(--OP-dotted-phase1-color));
  }
  47% {
    background-color: var(--OP-dotted-phase2-color, var(--OP-dotted-phase1-color));
  }
  50% {
    background-color: var(--OP-dotted-phase3-color, var(--OP-dotted-phase1-color));
  }
  72% {
    background-color: var(--OP-dotted-phase3-color, var(--OP-dotted-phase1-color));
  }
  75% {
    background-color: var(--OP-dotted-phase4-color, var(--OP-dotted-phase1-color));
  }
  97% {
    background-color: var(--OP-dotted-phase4-color, var(--OP-dotted-phase1-color));
  }
}`),$t(typeof window==`object`&&window)||$t(typeof self==`object`&&self)||$t(typeof global==`object`&&global)||function(){return this}()||Function(`return this`)(),Array.from({length:4},(function(e,t){return`--OP-dotted-phase${t+1}-color`})),dt(`.OP-spokes-rli-bounding-box {
  --OP-spokes-phase1-color: rgb(50, 205, 50);
  font-size: 16px;
  position: relative;
  color: var(--OP-spokes-phase1-color);
}
.OP-spokes-rli-bounding-box .OP-spokes-indicator {
  width: 4.8em;
  height: 4.8em;
  display: block;
  position: relative;
}
.OP-spokes-rli-bounding-box .OP-spokes-indicator .spoke {
  position: absolute;
  height: 1.2em;
  width: 0.4em;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto auto auto 50%;
  background-color: var(--OP-spokes-phase1-color);
  border-radius: 0.24em;
  opacity: 0;
  animation: var(--rli-animation-duration, 1.2s) var(--rli-animation-function, ease-in-out) backwards infinite uxlv7pw, calc(var(--rli-animation-duration, 1.2s) * 4) var(--rli-animation-function, ease-in-out) infinite uxlv7qn;
  transform-origin: left center;
}
.OP-spokes-rli-bounding-box .OP-spokes-indicator .spoke:nth-of-type(1) {
  transform: rotate(calc(0 * 360deg / 12)) translate(-50%, -1.56em);
  animation-delay: calc(11 * var(--rli-animation-duration, 1.2s) / 12 * -1);
}
.OP-spokes-rli-bounding-box .OP-spokes-indicator .spoke:nth-of-type(2) {
  transform: rotate(calc(1 * 360deg / 12)) translate(-50%, -1.56em);
  animation-delay: calc(10 * var(--rli-animation-duration, 1.2s) / 12 * -1);
}
.OP-spokes-rli-bounding-box .OP-spokes-indicator .spoke:nth-of-type(3) {
  transform: rotate(calc(2 * 360deg / 12)) translate(-50%, -1.56em);
  animation-delay: calc(9 * var(--rli-animation-duration, 1.2s) / 12 * -1);
}
.OP-spokes-rli-bounding-box .OP-spokes-indicator .spoke:nth-of-type(4) {
  transform: rotate(calc(3 * 360deg / 12)) translate(-50%, -1.56em);
  animation-delay: calc(8 * var(--rli-animation-duration, 1.2s) / 12 * -1);
}
.OP-spokes-rli-bounding-box .OP-spokes-indicator .spoke:nth-of-type(5) {
  transform: rotate(calc(4 * 360deg / 12)) translate(-50%, -1.56em);
  animation-delay: calc(7 * var(--rli-animation-duration, 1.2s) / 12 * -1);
}
.OP-spokes-rli-bounding-box .OP-spokes-indicator .spoke:nth-of-type(6) {
  transform: rotate(calc(5 * 360deg / 12)) translate(-50%, -1.56em);
  animation-delay: calc(6 * var(--rli-animation-duration, 1.2s) / 12 * -1);
}
.OP-spokes-rli-bounding-box .OP-spokes-indicator .spoke:nth-of-type(7) {
  transform: rotate(calc(6 * 360deg / 12)) translate(-50%, -1.56em);
  animation-delay: calc(5 * var(--rli-animation-duration, 1.2s) / 12 * -1);
}
.OP-spokes-rli-bounding-box .OP-spokes-indicator .spoke:nth-of-type(8) {
  transform: rotate(calc(7 * 360deg / 12)) translate(-50%, -1.56em);
  animation-delay: calc(4 * var(--rli-animation-duration, 1.2s) / 12 * -1);
}
.OP-spokes-rli-bounding-box .OP-spokes-indicator .spoke:nth-of-type(9) {
  transform: rotate(calc(8 * 360deg / 12)) translate(-50%, -1.56em);
  animation-delay: calc(3 * var(--rli-animation-duration, 1.2s) / 12 * -1);
}
.OP-spokes-rli-bounding-box .OP-spokes-indicator .spoke:nth-of-type(10) {
  transform: rotate(calc(9 * 360deg / 12)) translate(-50%, -1.56em);
  animation-delay: calc(2 * var(--rli-animation-duration, 1.2s) / 12 * -1);
}
.OP-spokes-rli-bounding-box .OP-spokes-indicator .spoke:nth-of-type(11) {
  transform: rotate(calc(10 * 360deg / 12)) translate(-50%, -1.56em);
  animation-delay: calc(1 * var(--rli-animation-duration, 1.2s) / 12 * -1);
}
.OP-spokes-rli-bounding-box .OP-spokes-indicator .spoke:nth-of-type(12) {
  transform: rotate(calc(11 * 360deg / 12)) translate(-50%, -1.56em);
  animation-delay: calc(0 * var(--rli-animation-duration, 1.2s) / 12 * -1);
}
.OP-spokes-rli-bounding-box .OP-spokes-indicator-text {
  mix-blend-mode: difference;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--OP-spokes-phase1-color);
  z-index: -2;
}

@property --OP-spokes-phase1-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --OP-spokes-phase2-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --OP-spokes-phase3-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --OP-spokes-phase4-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --rli-animation-duration {
  syntax: "<time>";
  inherits: true;
  initial-value: 1.2s;
}
@keyframes uxlv7pw {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
@keyframes uxlv7qn {
  100%, 0% {
    background-color: var(--OP-spokes-phase1-color);
  }
  22% {
    background-color: var(--OP-spokes-phase1-color);
  }
  25% {
    background-color: var(--OP-spokes-phase2-color, var(--OP-spokes-phase1-color));
  }
  42% {
    background-color: var(--OP-spokes-phase2-color, var(--OP-spokes-phase1-color));
  }
  50% {
    background-color: var(--OP-spokes-phase3-color, var(--OP-spokes-phase1-color));
  }
  72% {
    background-color: var(--OP-spokes-phase3-color, var(--OP-spokes-phase1-color));
  }
  75% {
    background-color: var(--OP-spokes-phase4-color, var(--OP-spokes-phase1-color));
  }
  97% {
    background-color: var(--OP-spokes-phase4-color, var(--OP-spokes-phase1-color));
  }
}`),Array.from({length:4},(function(e,t){return`--OP-spokes-phase${t+1}-color`})),dt(`.OP-annulus-dual-sectors-rli-bounding-box {
  --OP-annulus-dual-sectors-phase1-color: rgb(50, 205, 50);
  font-size: 16px;
  box-sizing: border-box;
  display: inline-block;
}
.OP-annulus-dual-sectors-rli-bounding-box .OP-annulus-dual-sectors-indicator {
  width: 5em;
  height: 5em;
  display: inline-block;
  position: relative;
  z-index: 0;
  color: var(--OP-annulus-dual-sectors-phase1-color);
}
.OP-annulus-dual-sectors-rli-bounding-box .OP-annulus-dual-sectors-indicator .annulus-sectors {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border-width: 0.34em;
  border-style: solid;
  border-color: var(--OP-annulus-dual-sectors-phase1-color) transparent var(--OP-annulus-dual-sectors-phase1-color) transparent;
  background-color: transparent;
  animation: var(--rli-animation-duration, 1.2s) var(--rli-animation-function, linear) infinite uxlv7ra, calc(var(--rli-animation-duration, 1.2s) * 4) var(--rli-animation-function, linear) infinite uxlv7sv;
}
.OP-annulus-dual-sectors-rli-bounding-box .OP-annulus-dual-sectors-indicator .OP-annulus-dual-sectors-text {
  mix-blend-mode: difference;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -2;
}

@property --OP-annulus-dual-sectors-phase1-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --OP-annulus-dual-sectors-phase2-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --OP-annulus-dual-sectors-phase3-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --OP-annulus-dual-sectors-phase4-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --rli-animation-duration {
  syntax: "<time>";
  inherits: true;
  initial-value: 1.2s;
}
@keyframes uxlv7ra {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes uxlv7sv {
  100%, 0% {
    border-color: var(--OP-annulus-dual-sectors-phase1-color) transparent;
  }
  20% {
    border-color: var(--OP-annulus-dual-sectors-phase1-color) transparent;
  }
  25% {
    border-color: var(--OP-annulus-dual-sectors-phase2-color, var(--OP-annulus-dual-sectors-phase1-color)) transparent;
  }
  45% {
    border-color: var(--OP-annulus-dual-sectors-phase2-color, var(--OP-annulus-dual-sectors-phase1-color)) transparent;
  }
  50% {
    border-color: var(--OP-annulus-dual-sectors-phase3-color, var(--OP-annulus-dual-sectors-phase1-color)) transparent;
  }
  70% {
    border-color: var(--OP-annulus-dual-sectors-phase3-color, var(--OP-annulus-dual-sectors-phase1-color)) transparent;
  }
  75% {
    border-color: var(--OP-annulus-dual-sectors-phase4-color, var(--OP-annulus-dual-sectors-phase1-color)) transparent;
  }
  95% {
    border-color: var(--OP-annulus-dual-sectors-phase4-color, var(--OP-annulus-dual-sectors-phase1-color)) transparent;
  }
}`),Array.from({length:4},(function(e,t){return`--OP-annulus-dual-sectors-phase${t+1}-color`})),dt(`.OP-annulus-sector-track-rli-bounding-box {
  --OP-annulus-track-phase1-color: rgba(50, 205, 50, 0.22);
  --OP-annulus-sector-phase1-color: rgb(50, 205, 50);
  font-size: 16px;
  display: inline-block;
}
.OP-annulus-sector-track-rli-bounding-box .OP-annulus-sector-track-indicator {
  width: 5em;
  height: 5em;
  color: var(--OP-annulus-sector-phase1-color);
  display: inline-block;
  position: relative;
  z-index: 0;
}
.OP-annulus-sector-track-rli-bounding-box .OP-annulus-sector-track-indicator .annulus-track-ring {
  width: 100%;
  height: 100%;
  border-width: 0.34em;
  border-style: solid;
  border-radius: 50%;
  box-sizing: border-box;
  border-color: var(--OP-annulus-track-phase1-color);
  border-top-color: var(--OP-annulus-sector-phase1-color);
  animation: var(--rli-animation-duration, 1s) var(--rli-animation-function, linear) infinite uxlv7rl, calc(var(--rli-animation-duration, 1s) * 4) var(--rli-animation-function, linear) infinite uxlv7tf;
}
.OP-annulus-sector-track-rli-bounding-box .OP-annulus-sector-track-indicator .OP-annulus-sector-text {
  mix-blend-mode: difference;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -2;
}

@property --OP-annulus-track-phase1-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgba(50, 205, 50, 0.22);
}
@property --OP-annulus-track-phase2-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgba(50, 205, 50, 0.22);
}
@property --OP-annulus-track-phase3-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgba(50, 205, 50, 0.22);
}
@property --OP-annulus-track-phase4-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgba(50, 205, 50, 0.22);
}
@property --OP-annulus-sector-phase1-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --OP-annulus-sector-phase2-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --OP-annulus-sector-phase3-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --OP-annulus-sector-phase4-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --rli-animation-duration {
  syntax: "<time>";
  inherits: true;
  initial-value: 1s;
}
@keyframes uxlv7rl {
  to {
    transform: rotate(1turn);
  }
}
@keyframes uxlv7tf {
  100%, 0% {
    border-color: var(--OP-annulus-track-phase1-color);
    border-top-color: var(--OP-annulus-sector-phase1-color);
  }
  18% {
    border-color: var(--OP-annulus-track-phase1-color);
    border-top-color: var(--OP-annulus-sector-phase1-color);
  }
  25% {
    border-color: var(--OP-annulus-track-phase2-color, var(--OP-annulus-track-phase1-color));
    border-top-color: var(--OP-annulus-sector-phase2-color, var(--OP-annulus-sector-phase1-color));
  }
  43% {
    border-color: var(--OP-annulus-track-phase2-color, var(--OP-annulus-track-phase1-color));
    border-top-color: var(--OP-annulus-sector-phase2-color, var(--OP-annulus-sector-phase1-color));
  }
  50% {
    border-color: var(--OP-annulus-track-phase3-color, var(--OP-annulus-track-phase1-color));
    border-top-color: var(--OP-annulus-sector-phase3-color, var(--OP-annulus-sector-phase1-color));
  }
  68% {
    border-color: var(--OP-annulus-track-phase3-color, var(--OP-annulus-track-phase1-color));
    border-top-color: var(--OP-annulus-sector-phase3-color, var(--OP-annulus-sector-phase1-color));
  }
  75% {
    border-color: var(--OP-annulus-track-phase4-color, var(--OP-annulus-track-phase1-color));
    border-top-color: var(--OP-annulus-sector-phase4-color, var(--OP-annulus-sector-phase1-color));
  }
  93% {
    border-color: var(--OP-annulus-track-phase4-color, var(--OP-annulus-track-phase1-color));
    border-top-color: var(--OP-annulus-sector-phase4-color, var(--OP-annulus-sector-phase1-color));
  }
}`),Array.from({length:4},(function(e,t){return[`--OP-annulus-track-phase${t+1}-color`,`--OP-annulus-sector-phase${t+1}-color`]})),dt(`.foursquare-rli-bounding-box {
  --four-square-phase1-color: rgb(50, 205, 50);
  font-size: 16px;
  box-sizing: border-box;
  color: var(--four-square-phase1-color);
  display: inline-block;
  overflow: hidden;
}
.foursquare-rli-bounding-box .foursquare-indicator {
  height: 5.3033008589em;
  width: 5.3033008589em;
  position: relative;
  display: block;
}
.foursquare-rli-bounding-box .foursquare-indicator .squares-container {
  position: absolute;
  z-index: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  height: 2.5em;
  width: 2.5em;
  color: inherit;
  will-change: color, width, height;
  transform: rotate(45deg);
  animation: var(--rli-animation-duration, 1s) var(--rli-animation-function, cubic-bezier(0.05, 0.28, 0.79, 0.98)) infinite uxlv7dk, calc(var(--rli-animation-duration, 1s) * 4) var(--rli-animation-function, cubic-bezier(0.05, 0.28, 0.79, 0.98)) infinite uxlv7es;
}
.foursquare-rli-bounding-box .foursquare-indicator .squares-container .square {
  position: absolute;
  width: 1.25em;
  height: 1.25em;
  border-radius: 0.1875em;
  background-color: currentColor;
  animation: uxlv7dd var(--rli-animation-duration, 1s) var(--rli-animation-function, cubic-bezier(0.05, 0.28, 0.79, 0.98)) both infinite;
}
.foursquare-rli-bounding-box .foursquare-indicator .squares-container .square.square1 {
  top: 0;
  left: 0;
}
.foursquare-rli-bounding-box .foursquare-indicator .squares-container .square.square2 {
  top: 0;
  right: 0;
}
.foursquare-rli-bounding-box .foursquare-indicator .squares-container .square.square3 {
  bottom: 0;
  left: 0;
}
.foursquare-rli-bounding-box .foursquare-indicator .squares-container .square.square4 {
  bottom: 0;
  right: 0;
}

@property --four-square-phase1-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --four-square-phase2-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --four-square-phase3-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --four-square-phase4-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --rli-animation-duration {
  syntax: "<time>";
  inherits: true;
  initial-value: 1s;
}
@keyframes uxlv7dk {
  0% {
    width: 2.5em;
    height: 2.5em;
  }
  10% {
    width: 2.5em;
    height: 2.5em;
  }
  50% {
    width: 3.75em;
    height: 3.75em;
  }
  90% {
    width: 2.5em;
    height: 2.5em;
  }
  100% {
    width: 2.5em;
    height: 2.5em;
  }
}
@keyframes uxlv7dd {
  0% {
    transform: rotateZ(0deg);
  }
  10% {
    transform: rotateZ(0deg);
  }
  50% {
    transform: rotateZ(90deg);
  }
  90% {
    transform: rotateZ(90deg);
  }
  100% {
    transform: rotateZ(90deg);
  }
}
@keyframes uxlv7es {
  100%, 0% {
    color: var(--four-square-phase1-color);
  }
  20% {
    color: var(--four-square-phase1-color);
  }
  25% {
    color: var(--four-square-phase2-color, var(--four-square-phase1-color));
  }
  45% {
    color: var(--four-square-phase2-color, var(--four-square-phase1-color));
  }
  50% {
    color: var(--four-square-phase3-color, var(--four-square-phase1-color));
  }
  70% {
    color: var(--four-square-phase3-color, var(--four-square-phase1-color));
  }
  75% {
    color: var(--four-square-phase4-color, var(--four-square-phase1-color));
  }
  95% {
    color: var(--four-square-phase4-color, var(--four-square-phase1-color));
  }
}`),Array.from({length:4},(function(e,t){return`--four-square-phase${t+1}-color`})),dt(`.mosaic-rli-bounding-box {
  --mosaic-phase1-color: rgb(50, 205, 50);
  box-sizing: border-box;
  font-size: 16px;
  color: var(--mosaic-phase1-color);
}
.mosaic-rli-bounding-box .mosaic-indicator {
  width: 5em;
  height: 5em;
  color: currentColor;
  display: grid;
  gap: 0.125em;
  grid-template-columns: repeat(3, 1fr);
  grid-template-areas: "a b c" "d e f" "g h i";
  position: relative;
  z-index: 0;
}
.mosaic-rli-bounding-box .mosaic-indicator .mosaic-cube-text {
  mix-blend-mode: difference;
  position: absolute;
  top: 105%;
  left: 50%;
  transform: translateX(-50%);
  z-index: -2;
}
.mosaic-rli-bounding-box .mosaic-indicator .mosaic-cube {
  background-color: var(--mosaic-phase1-color);
  animation-name: uxlv7i4, uxlv7is;
  animation-duration: var(--rli-animation-duration, 1.5s), calc(var(--rli-animation-duration, 1.5s) * 4);
  animation-timing-function: var(--rli-animation-function, ease-in-out);
  animation-iteration-count: infinite;
}
.mosaic-rli-bounding-box .mosaic-indicator .mosaic-cube1 {
  animation-delay: calc(var(--mosaic-skip-interval, 0.1s) * 2);
  grid-area: a;
}
.mosaic-rli-bounding-box .mosaic-indicator .mosaic-cube2 {
  animation-delay: calc(var(--mosaic-skip-interval, 0.1s) * 3);
  grid-area: b;
}
.mosaic-rli-bounding-box .mosaic-indicator .mosaic-cube3 {
  grid-area: c;
  animation-delay: calc(var(--mosaic-skip-interval, 0.1s) * 4);
}
.mosaic-rli-bounding-box .mosaic-indicator .mosaic-cube4 {
  grid-area: d;
  animation-delay: calc(var(--mosaic-skip-interval, 0.1s) * 1);
}
.mosaic-rli-bounding-box .mosaic-indicator .mosaic-cube5 {
  grid-area: e;
  animation-delay: calc(var(--mosaic-skip-interval, 0.1s) * 2);
}
.mosaic-rli-bounding-box .mosaic-indicator .mosaic-cube6 {
  grid-area: f;
  animation-delay: calc(var(--mosaic-skip-interval, 0.1s) * 3);
}
.mosaic-rli-bounding-box .mosaic-indicator .mosaic-cube7 {
  grid-area: g;
  animation-delay: 0s;
}
.mosaic-rli-bounding-box .mosaic-indicator .mosaic-cube8 {
  grid-area: h;
  animation-delay: calc(var(--mosaic-skip-interval, 0.1s) * 1);
}
.mosaic-rli-bounding-box .mosaic-indicator .mosaic-cube9 {
  grid-area: i;
  animation-delay: calc(var(--mosaic-skip-interval, 0.1s) * 2);
}

@property --mosaic-phase1-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --mosaic-phase2-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --mosaic-phase3-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --mosaic-phase4-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --rli-animation-duration {
  syntax: "<time>";
  inherits: true;
  initial-value: 1.5s;
}
@keyframes uxlv7i4 {
  0%, 60%, 100% {
    transform: scale3D(1, 1, 1);
  }
  30% {
    transform: scale3D(0, 0, 1);
  }
}
@keyframes uxlv7is {
  100%, 0% {
    background-color: var(--mosaic-phase1-color);
  }
  25% {
    background-color: var(--mosaic-phase2-color, var(--mosaic-phase1-color));
  }
  50% {
    background-color: var(--mosaic-phase3-color, var(--mosaic-phase1-color));
  }
  75% {
    background-color: var(--mosaic-phase4-color, var(--mosaic-phase1-color));
  }
}`),Array.from({length:4},(function(e,t){return`--mosaic-phase${t+1}-color`})),dt(`.riple-rli-bounding-box {
  --riple-phase1-color: rgb(50, 205, 50);
  box-sizing: border-box;
  font-size: 16px;
  display: inline-block;
  color: var(--riple-phase1-color);
}
.riple-rli-bounding-box .riple-indicator {
  display: inline-block;
  width: 5em;
  height: 5em;
  position: relative;
  z-index: 0;
}
.riple-rli-bounding-box .riple-indicator .riple-text {
  mix-blend-mode: difference;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -2;
}
.riple-rli-bounding-box .riple-indicator .riple {
  --border-width: 0.25em;
  position: absolute;
  border: var(--border-width) solid var(--riple-phase1-color);
  opacity: 1;
  border-radius: 50%;
  will-change: top, right, left, bottom, border-color;
  animation: var(--rli-animation-duration, 1s) var(--rli-animation-function, cubic-bezier(0, 0.2, 0.8, 1)) infinite uxlv7i1, calc(var(--rli-animation-duration, 1s) * 4) var(--rli-animation-function, cubic-bezier(0, 0.2, 0.8, 1)) infinite uxlv7io;
}
.riple-rli-bounding-box .riple-indicator .riple:nth-of-type(2) {
  animation-delay: calc(var(--rli-animation-duration, 1s) / 2 * -1);
}

@property --riple-phase1-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --riple-phase2-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --riple-phase3-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --riple-phase4-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --rli-animation-duration {
  syntax: "<time>";
  inherits: true;
  initial-value: 1s;
}
@keyframes uxlv7i1 {
  0% {
    top: calc(50% - var(--border-width));
    left: calc(50% - var(--border-width));
    right: calc(50% - var(--border-width));
    bottom: calc(50% - var(--border-width));
    opacity: 0;
  }
  4.9% {
    top: calc(50% - var(--border-width));
    left: calc(50% - var(--border-width));
    right: calc(50% - var(--border-width));
    bottom: calc(50% - var(--border-width));
    opacity: 0;
  }
  5% {
    top: calc(50% - var(--border-width));
    left: calc(50% - var(--border-width));
    right: calc(50% - var(--border-width));
    bottom: calc(50% - var(--border-width));
    opacity: 1;
  }
  100% {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
  }
}
@keyframes uxlv7io {
  100%, 0% {
    border-color: var(--riple-phase1-color);
  }
  24.9% {
    border-color: var(--riple-phase1-color);
  }
  25% {
    border-color: var(--riple-phase2-color, var(--riple-phase1-color));
  }
  49.9% {
    border-color: var(--riple-phase2-color, var(--riple-phase1-color));
  }
  50% {
    border-color: var(--riple-phase3-color, var(--riple-phase1-color));
  }
  74.9% {
    border-color: var(--riple-phase3-color, var(--riple-phase1-color));
  }
  75% {
    border-color: var(--riple-phase4-color, var(--riple-phase1-color));
  }
  99.9% {
    border-color: var(--riple-phase4-color, var(--riple-phase1-color));
  }
}`),Array.from({length:4},(function(e,t){return`--riple-phase${t+1}-color`})),dt(`.pulsate-rli-bounding-box {
  --TD-pulsate-phase1-color: rgb(50, 205, 50);
  font-size: 16px;
  display: inline-block;
  box-sizing: border-box;
  color: var(--TD-pulsate-phase1-color);
}
.pulsate-rli-bounding-box .pulsate-indicator {
  width: 4.4em;
  height: 1.1em;
  text-align: center;
  position: relative;
  z-index: 0;
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  align-items: center;
}
.pulsate-rli-bounding-box .pulsate-indicator .pulsate-dot {
  width: 1.1em;
  height: 1.1em;
  border-radius: 50%;
  background-color: var(--TD-pulsate-phase1-color);
  transform: scale(0);
  animation: var(--rli-animation-duration, 1.2s) var(--rli-animation-function, ease-in-out) var(--delay) infinite uxlv7s0, calc(var(--rli-animation-duration, 1.2s) * 4) var(--rli-animation-function, ease-in-out) var(--delay) infinite uxlv7to;
}
.pulsate-rli-bounding-box .pulsate-indicator .pulsate-dot:nth-of-type(1) {
  --delay: calc(var(--rli-animation-duration, 1.2s) * 0.15 * -1);
}
.pulsate-rli-bounding-box .pulsate-indicator .pulsate-dot:nth-of-type(2) {
  --delay: calc(var(--rli-animation-duration, 1.2s) * 0);
}
.pulsate-rli-bounding-box .pulsate-indicator .pulsate-dot:nth-of-type(3) {
  --delay: calc(var(--rli-animation-duration, 1.2s) * 0.15);
}
.pulsate-rli-bounding-box .pulsate-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 80%;
  text-transform: uppercase;
  text-align: center;
  font-size: 0.6em;
  letter-spacing: 0.5px;
  font-family: sans-serif;
  mix-blend-mode: difference;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -2;
}

@property --TD-pulsate-phase1-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --TD-pulsate-phase2-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --TD-pulsate-phase3-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --TD-pulsate-phase4-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --rli-animation-duration {
  syntax: "<time>";
  inherits: true;
  initial-value: 1.2s;
}
@keyframes uxlv7s0 {
  0%, 90%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
@keyframes uxlv7to {
  0%, 100% {
    background-color: var(--TD-pulsate-phase1-color);
  }
  24.9% {
    background-color: var(--TD-pulsate-phase1-color);
  }
  25% {
    background-color: var(--TD-pulsate-phase2-color, var(--TD-pulsate-phase1-color));
  }
  49.9% {
    background-color: var(--TD-pulsate-phase2-color, var(--TD-pulsate-phase1-color));
  }
  50% {
    background-color: var(--TD-pulsate-phase3-color, var(--TD-pulsate-phase1-color));
  }
  74.9% {
    background-color: var(--TD-pulsate-phase3-color, var(--TD-pulsate-phase1-color));
  }
  75% {
    background-color: var(--TD-pulsate-phase4-color, var(--TD-pulsate-phase1-color));
  }
  99.9% {
    background-color: var(--TD-pulsate-phase4-color, var(--TD-pulsate-phase1-color));
  }
}`),Array.from({length:4},(function(e,t){return`--TD-pulsate-phase${t+1}-color`})),dt(`.brick-stack-rli-bounding-box {
  --TD-brick-stack-phase1-color: rgb(50, 205, 50);
  box-sizing: border-box;
  font-size: 16px;
  display: inline-block;
  color: var(--TD-brick-stack-phase1-color);
}
.brick-stack-rli-bounding-box .brick-stack-indicator {
  width: 2.8em;
  height: 2.8em;
  position: relative;
  display: block;
  margin: 0 auto;
}
.brick-stack-rli-bounding-box .brick-stack {
  width: 100%;
  height: 100%;
  background: radial-gradient(circle closest-side, currentColor 0% 95%, rgba(0, 0, 0, 0) calc(95% + 1px)) 0 0/40% 40% no-repeat, radial-gradient(circle closest-side, currentColor 0% 95%, rgba(0, 0, 0, 0) calc(95% + 1px)) 0 100%/40% 40% no-repeat, radial-gradient(circle closest-side, currentColor 0% 95%, rgba(0, 0, 0, 0) calc(95% + 1px)) 100% 100%/40% 40% no-repeat;
  animation: var(--rli-animation-duration, 1s) var(--rli-animation-function, ease-out) infinite uxlv7tu, calc(var(--rli-animation-duration, 1s) * 4) var(--rli-animation-function, ease-out) infinite uxlv7us;
}

@property --TD-brick-stack-phase1-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --TD-brick-stack-phase2-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --TD-brick-stack-phase3-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --TD-brick-stack-phase4-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --rli-animation-duration {
  syntax: "<time>";
  inherits: true;
  initial-value: 1s;
}
@keyframes uxlv7tu {
  0% {
    background-position: 0 0, 0 100%, 100% 100%;
  }
  25% {
    background-position: 100% 0, 0 100%, 100% 100%;
  }
  50% {
    background-position: 100% 0, 0 0, 100% 100%;
  }
  75% {
    background-position: 100% 0, 0 0, 0 100%;
  }
  100% {
    background-position: 100% 100%, 0 0, 0 100%;
  }
}
@keyframes uxlv7us {
  100%, 0% {
    color: var(--TD-brick-stack-phase1-color);
  }
  20% {
    color: var(--TD-brick-stack-phase1-color);
  }
  25% {
    color: var(--TD-brick-stack-phase2-color, var(--TD-brick-stack-phase1-color));
  }
  45% {
    color: var(--TD-brick-stack-phase2-color, var(--TD-brick-stack-phase1-color));
  }
  50% {
    color: var(--TD-brick-stack-phase3-color, var(--TD-brick-stack-phase1-color));
  }
  70% {
    color: var(--TD-brick-stack-phase3-color, var(--TD-brick-stack-phase1-color));
  }
  75% {
    color: var(--TD-brick-stack-phase4-color, var(--TD-brick-stack-phase1-color));
  }
  95% {
    color: var(--TD-brick-stack-phase4-color, var(--TD-brick-stack-phase1-color));
  }
}`),Array.from({length:4},(function(e,t){return`--TD-brick-stack-phase${t+1}-color`})),dt(`.bob-rli-bounding-box {
  --TD-bob-phase1-color: rgb(50, 205, 50);
  box-sizing: border-box;
  font-size: 16px;
  display: inline-block;
  color: var(--TD-bob-phase1-color);
}
.bob-rli-bounding-box .bob-indicator {
  width: 4.4em;
  height: 2.2em;
  position: relative;
  display: block;
  margin: 0 auto;
}
.bob-rli-bounding-box .bob-indicator .bobbing,
.bob-rli-bounding-box .bob-indicator .bobbing::before,
.bob-rli-bounding-box .bob-indicator .bobbing::after {
  width: 1.1em;
  height: 100%;
  display: grid;
  animation: var(--rli-animation-duration, 1.2s) var(--rli-animation-function, linear) var(--delay) infinite uxlv7u0, calc(var(--rli-animation-duration, 1.2s) * 4) var(--rli-animation-function, linear) var(--delay) infinite uxlv7vq;
}
.bob-rli-bounding-box .bob-indicator .bobbing::before,
.bob-rli-bounding-box .bob-indicator .bobbing::after {
  content: "";
  grid-area: 1/1;
}
.bob-rli-bounding-box .bob-indicator .bobbing {
  --delay: calc(var(--rli-animation-duration, 1.2s) * 0.12 * -1);
  background: radial-gradient(circle closest-side at center, currentColor 0% 92%, rgba(0, 0, 0, 0) calc(92% + 1px)) 50% 50%/100% 50% no-repeat;
}
.bob-rli-bounding-box .bob-indicator .bobbing::before {
  --delay: calc(var(--rli-animation-duration, 1.2s) * 0);
  transform: translateX(150%);
  background: radial-gradient(circle closest-side at center, currentColor 0% 92%, rgba(0, 0, 0, 0) calc(92% + 1px)) 50% 50%/100% 50% no-repeat;
}
.bob-rli-bounding-box .bob-indicator .bobbing::after {
  --delay: calc(var(--rli-animation-duration, 1.2s) * 0.12);
  transform: translateX(300%);
  background: radial-gradient(circle closest-side at center, currentColor 0% 92%, rgba(0, 0, 0, 0) calc(92% + 1px)) 50% 50%/100% 50% no-repeat;
}

@property --TD-bob-phase1-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --TD-bob-phase2-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --TD-bob-phase3-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --TD-bob-phase4-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --rli-animation-duration {
  syntax: "<time>";
  inherits: true;
  initial-value: 1.2s;
}
@keyframes uxlv7u0 {
  100%, 0% {
    background-position: 50% 50%;
  }
  15% {
    background-position: 50% 10%;
  }
  30% {
    background-position: 50% 100%;
  }
  40% {
    background-position: 50% 0%;
  }
  50% {
    background-position: 50% 90%;
  }
  70% {
    background-position: 50% 10%;
  }
  98% {
    background-position: 50% 50%;
  }
}
@keyframes uxlv7vq {
  100%, 0% {
    color: var(--TD-bob-phase1-color);
  }
  22% {
    color: var(--TD-bob-phase1-color);
  }
  25% {
    color: var(--TD-bob-phase2-color, var(--TD-bob-phase1-color));
  }
  47% {
    color: var(--TD-bob-phase2-color, var(--TD-bob-phase1-color));
  }
  50% {
    color: var(--TD-bob-phase3-color, var(--TD-bob-phase1-color));
  }
  72% {
    color: var(--TD-bob-phase3-color, var(--TD-bob-phase1-color));
  }
  75% {
    color: var(--TD-bob-phase4-color, var(--TD-bob-phase1-color));
  }
  97% {
    color: var(--TD-bob-phase4-color, var(--TD-bob-phase1-color));
  }
}`),Array.from({length:4},(function(e,t){return`--TD-bob-phase${t+1}-color`})),dt(`.bounce-rli-bounding-box {
  --TD-bounce-phase1-color: rgb(50, 205, 50);
  font-size: 16px;
  color: var(--TD-bounce-phase1-color);
  display: inline-block;
  padding-bottom: 0.25125em;
}
.bounce-rli-bounding-box .wrapper {
  --dot1-delay: 0s;
  --dot1-x-offset: 0.55em;
  --dot2-delay: calc((var(--rli-animation-duration, 0.5s) + var(--rli-animation-duration, 0.5s) * 0.75) * -1);
  --dot2-x-offset: 2.2em;
  --dot3-delay: calc((var(--rli-animation-duration, 0.5s) + var(--rli-animation-duration, 0.5s) * 0.5) * -1);
  --dot3-x-offset: 3.85em;
  width: 5.5em;
  height: 3.125em;
  position: relative;
  display: block;
  margin: 0 auto;
}
.bounce-rli-bounding-box .wrapper .group {
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.bounce-rli-bounding-box .wrapper .group .dot {
  width: 1.1em;
  height: 1.1em;
  position: absolute;
  border-radius: 50%;
  background-color: var(--TD-bounce-phase1-color);
  transform-origin: 50%;
  animation: var(--rli-animation-duration, 0.5s) var(--rli-animation-function, cubic-bezier(0.74, 0.1, 0.74, 1)) alternate infinite uxlv7wc, calc(var(--rli-animation-duration, 0.5s) * 4) var(--rli-animation-function, cubic-bezier(0.74, 0.1, 0.74, 1)) infinite uxlv7x6;
}
.bounce-rli-bounding-box .wrapper .group .dot:nth-of-type(1) {
  left: var(--dot1-x-offset);
  animation-delay: var(--dot1-delay), 0s;
}
.bounce-rli-bounding-box .wrapper .group .dot:nth-of-type(2) {
  left: var(--dot2-x-offset);
  animation-delay: var(--dot2-delay), 0s;
}
.bounce-rli-bounding-box .wrapper .group .dot:nth-of-type(3) {
  left: var(--dot3-x-offset);
  animation-delay: var(--dot3-delay), 0s;
}
.bounce-rli-bounding-box .wrapper .group .shadow {
  width: 1.1em;
  height: 0.22em;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 101%;
  transform-origin: 50%;
  z-index: -1;
  filter: blur(1px);
  animation: var(--rli-animation-duration, 0.5s) var(--rli-animation-function, cubic-bezier(0.74, 0.1, 0.74, 1)) alternate infinite uxlv7ww;
}
.bounce-rli-bounding-box .wrapper .group .shadow:nth-of-type(1) {
  left: var(--dot1-x-offset);
  animation-delay: var(--dot1-delay);
}
.bounce-rli-bounding-box .wrapper .group .shadow:nth-of-type(2) {
  left: var(--dot2-x-offset);
  animation-delay: var(--dot2-delay);
}
.bounce-rli-bounding-box .wrapper .group .shadow:nth-of-type(3) {
  left: var(--dot3-x-offset);
  animation-delay: var(--dot3-delay);
}

@property --TD-bounce-phase1-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --TD-bounce-phase2-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --TD-bounce-phase3-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --TD-bounce-phase4-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --rli-animation-duration {
  syntax: "<time>";
  inherits: true;
  initial-value: 0.5s;
}
@keyframes uxlv7wc {
  0% {
    top: 0%;
  }
  60% {
    height: 1.25em;
    border-radius: 50%;
    transform: scaleX(1);
  }
  100% {
    top: 100%;
    height: 0.22em;
    transform: scaleX(1.5);
    filter: blur(0.4px);
  }
}
@keyframes uxlv7ww {
  0% {
    transform: scaleX(0.2);
    opacity: 0.2;
  }
  60% {
    opacity: 0.4;
  }
  100% {
    transform: scaleX(1.5);
    opacity: 0.6;
  }
}
@keyframes uxlv7x6 {
  0%, 100% {
    background-color: var(--TD-bounce-phase1-color);
  }
  20% {
    background-color: var(--TD-bounce-phase1-color);
  }
  25% {
    background-color: var(--TD-bounce-phase2-color, var(--TD-bounce-phase1-color));
  }
  45% {
    background-color: var(--TD-bounce-phase2-color, var(--TD-bounce-phase1-color));
  }
  50% {
    background-color: var(--TD-bounce-phase3-color, var(--TD-bounce-phase1-color));
  }
  70% {
    background-color: var(--TD-bounce-phase3-color, var(--TD-bounce-phase1-color));
  }
  75% {
    background-color: var(--TD-bounce-phase4-color, var(--TD-bounce-phase1-color));
  }
  95% {
    background-color: var(--TD-bounce-phase4-color, var(--TD-bounce-phase1-color));
  }
}`),Array.from({length:4},(function(e,t){return`--TD-bounce-phase${t+1}-color`})),dt(`.blink-blur-rli-bounding-box {
  --shape-phase1-color: rgb(50, 205, 50);
  font-size: 16px;
  color: var(--shape-phase1-color);
}
.blink-blur-rli-bounding-box .blink-blur-indicator {
  isolation: isolate;
  display: flex;
  flex-direction: row;
  -moz-column-gap: 0.4em;
       column-gap: 0.4em;
}
.blink-blur-rli-bounding-box .blink-blur-indicator .blink-blur-shape {
  --x-deg: -20deg;
  width: 1.8em;
  height: 2.25em;
  border-radius: 0.25em;
  color: inherit;
  transform: skewX(var(--x-deg));
  background-color: var(--shape-phase1-color);
  animation-name: uxlv7id, uxlv7jl;
  animation-duration: var(--rli-animation-duration, 1.2s), calc(var(--rli-animation-duration, 1.2s) * 4);
  animation-timing-function: var(--rli-animation-function, ease-in);
  animation-iteration-count: infinite;
}
.blink-blur-rli-bounding-box .blink-blur-indicator .blink-blur-shape.blink-blur-shape1 {
  animation-delay: calc(var(--rli-animation-duration, 1.2s) * 0.5 * -1);
}
.blink-blur-rli-bounding-box .blink-blur-indicator .blink-blur-shape.blink-blur-shape2 {
  animation-delay: calc(var(--rli-animation-duration, 1.2s) * 0.4 * -1);
}
.blink-blur-rli-bounding-box .blink-blur-indicator .blink-blur-shape.blink-blur-shape3 {
  animation-delay: calc(var(--rli-animation-duration, 1.2s) * 0.3 * -1);
}
.blink-blur-rli-bounding-box .blink-blur-indicator .blink-blur-shape.blink-blur-shape4 {
  animation-delay: calc(var(--rli-animation-duration, 1.2s) * 0.2 * -1);
}
.blink-blur-rli-bounding-box .blink-blur-indicator .blink-blur-shape.blink-blur-shape5 {
  animation-delay: calc(var(--rli-animation-duration, 1.2s) * 0.1 * -1);
}

@property --shape-phase1-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --shape-phase2-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --shape-phase3-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --shape-phase4-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --rli-animation-duration {
  syntax: "<time>";
  inherits: true;
  initial-value: 1.2s;
}
@keyframes uxlv7id {
  100%, 0% {
    opacity: 0.3;
    filter: blur(0.0675em) drop-shadow(0 0 0.0625em);
    transform: skewX(var(--x-deg)) scale(1.2, 1.45);
  }
  39% {
    opacity: 0.8;
  }
  40%, 41%, 42% {
    opacity: 0;
  }
  43% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
    filter: blur(0em) drop-shadow(0 0 0em);
    transform: skewX(var(--x-deg)) scale(1, 1);
  }
}
@keyframes uxlv7jl {
  100%, 0% {
    color: var(--shape-phase1-color);
    background-color: var(--shape-phase1-color);
  }
  25% {
    color: var(--shape-phase2-color, var(--shape-phase1-color));
    background-color: var(--shape-phase2-color, var(--shape-phase1-color));
  }
  50% {
    color: var(--shape-phase3-color, var(--shape-phase1-color));
    background-color: var(--shape-phase3-color, var(--shape-phase1-color));
  }
  75% {
    color: var(--shape-phase4-color, var(--shape-phase1-color));
    background-color: var(--shape-phase4-color, var(--shape-phase1-color));
  }
}`),Array.from({length:4},(function(e,t){return`--shape-phase${t+1}-color`})),dt(`.trophy-spin-rli-bounding-box {
  --trophySpin-phase1-color: rgb(50, 205, 50);
  box-sizing: border-box;
  font-size: 16px;
  position: relative;
  isolation: isolate;
  color: var(--trophySpin-phase1-color);
}
.trophy-spin-rli-bounding-box .trophy-spin-indicator {
  width: 4em;
  perspective: 1000px;
  transform-style: preserve-3d;
  display: block;
  margin: 0 auto;
}
.trophy-spin-rli-bounding-box .trophy-spin-indicator .blade {
  display: block;
  width: 4em;
  height: 0.5em;
  background: var(--trophySpin-phase1-color);
  animation: uxlv7ki var(--rli-animation-duration, 2.5s) var(--rli-animation-function, linear) infinite, uxlv7l2 calc(var(--rli-animation-duration, 2.5s) * 0.5) var(--rli-animation-function, linear) infinite, uxlv7ly calc(var(--rli-animation-duration, 2.5s) * 4) var(--rli-animation-function, linear) infinite;
}
.trophy-spin-rli-bounding-box .trophy-spin-indicator .blade:nth-of-type(8) {
  animation-delay: calc(var(--rli-animation-duration, 2.5s) / 2 / 8 * 0 * -1);
}
.trophy-spin-rli-bounding-box .trophy-spin-indicator .blade:nth-of-type(7) {
  animation-delay: calc(var(--rli-animation-duration, 2.5s) / 2 / 8 * 1 * -1);
}
.trophy-spin-rli-bounding-box .trophy-spin-indicator .blade:nth-of-type(6) {
  animation-delay: calc(var(--rli-animation-duration, 2.5s) / 2 / 8 * 2 * -1);
}
.trophy-spin-rli-bounding-box .trophy-spin-indicator .blade:nth-of-type(5) {
  animation-delay: calc(var(--rli-animation-duration, 2.5s) / 2 / 8 * 3 * -1);
}
.trophy-spin-rli-bounding-box .trophy-spin-indicator .blade:nth-of-type(4) {
  animation-delay: calc(var(--rli-animation-duration, 2.5s) / 2 / 8 * 4 * -1);
}
.trophy-spin-rli-bounding-box .trophy-spin-indicator .blade:nth-of-type(3) {
  animation-delay: calc(var(--rli-animation-duration, 2.5s) / 2 / 8 * 5 * -1);
}
.trophy-spin-rli-bounding-box .trophy-spin-indicator .blade:nth-of-type(2) {
  animation-delay: calc(var(--rli-animation-duration, 2.5s) / 2 / 8 * 6 * -1);
}
.trophy-spin-rli-bounding-box .trophy-spin-indicator .blade:nth-of-type(1) {
  animation-delay: calc(var(--rli-animation-duration, 2.5s) / 2 / 8 * 7 * -1);
}

@property --trophySpin-phase1-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --trophySpin-phase2-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --trophySpin-phase3-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --trophySpin-phase4-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --rli-animation-duration {
  syntax: "<time>";
  inherits: true;
  initial-value: 2.5s;
}
@keyframes uxlv7ki {
  to {
    transform: rotateY(1turn) rotateX(-25deg);
  }
}
@keyframes uxlv7l2 {
  100%, 0% {
    filter: brightness(1);
    opacity: 1;
  }
  15% {
    filter: brightness(1);
  }
  25% {
    opacity: 0.96;
  }
  30% {
    filter: brightness(0.92);
  }
  50% {
    filter: brightness(0.7);
    opacity: 1;
  }
  75% {
    filter: brightness(0.92);
    opacity: 0.96;
  }
  90% {
    filter: brightness(1);
  }
}
@keyframes uxlv7ly {
  100%, 0% {
    background-color: var(--trophySpin-phase1-color);
  }
  18% {
    background-color: var(--trophySpin-phase1-color);
  }
  25% {
    background-color: var(--trophySpin-phase2-color, var(--trophySpin-phase1-color));
  }
  43% {
    background-color: var(--trophySpin-phase2-color, var(--trophySpin-phase1-color));
  }
  50% {
    background-color: var(--trophySpin-phase3-color, var(--trophySpin-phase1-color));
  }
  68% {
    background-color: var(--trophySpin-phase3-color, var(--trophySpin-phase1-color));
  }
  75% {
    background-color: var(--trophySpin-phase4-color, var(--trophySpin-phase1-color));
  }
  93% {
    background-color: var(--trophySpin-phase4-color, var(--trophySpin-phase1-color));
  }
}`),Array.from({length:4},(function(e,t){return`--trophySpin-phase${t+1}-color`})),dt(`.slab-rli-bounding-box {
  --slab-phase1-color: rgb(50, 205, 50);
  font-size: 16px;
  color: var(--slab-phase1-color);
  position: relative;
}
.slab-rli-bounding-box .slab-indicator {
  position: relative;
  display: block;
  width: 7em;
  height: 4em;
  margin: 0 auto;
  overflow: hidden;
}
.slab-rli-bounding-box .slab-indicator .slabs-wrapper {
  width: 4em;
  height: 4em;
  transform: perspective(15em) rotateX(66deg) rotateZ(-25deg);
  transform-style: preserve-3d;
  transform-origin: 50% 100%;
  display: block;
  position: absolute;
  bottom: 0;
  right: 0;
}
.slab-rli-bounding-box .slab-indicator .slabs-wrapper .slab {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--slab-phase1-color);
  opacity: 0;
  box-shadow: -0.08em 0.15em 0 rgba(0, 0, 0, 0.45);
  transform-origin: 0% 0%;
  animation: calc(var(--rli-animation-duration-unitless, 3) * 1s) var(--rli-animation-function, linear) infinite uxlv7md, calc(var(--rli-animation-duration-unitless, 3) * 4s) var(--rli-animation-function, linear) infinite uxlv7n0;
}
.slab-rli-bounding-box .slab-indicator .slabs-wrapper .slab:nth-child(1) {
  animation-delay: calc(4 / (16 / var(--rli-animation-duration-unitless, 3)) * 3 * -1 * 1s);
}
.slab-rli-bounding-box .slab-indicator .slabs-wrapper .slab:nth-child(2) {
  animation-delay: calc(4 / (16 / var(--rli-animation-duration-unitless, 3)) * 2 * -1 * 1s);
}
.slab-rli-bounding-box .slab-indicator .slabs-wrapper .slab:nth-child(3) {
  animation-delay: calc(4 / (16 / var(--rli-animation-duration-unitless, 3)) * -1 * 1s);
}
.slab-rli-bounding-box .slab-indicator .slabs-wrapper .slab:nth-child(4) {
  animation-delay: 0s;
}

@property --slab-phase1-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --slab-phase2-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --slab-phase3-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --slab-phase4-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --rli-animation-duration-unitless {
  syntax: "<number>";
  inherits: true;
  initial-value: 3;
}
@keyframes uxlv7md {
  0% {
    transform: translateY(0) rotateX(30deg);
    opacity: 0;
  }
  10% {
    transform: translateY(-40%) rotateX(0deg);
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  100% {
    transform: translateY(-400%) rotateX(0deg);
    opacity: 0;
  }
}
@keyframes uxlv7n0 {
  100%, 0% {
    background-color: var(--slab-phase1-color);
  }
  24.9% {
    background-color: var(--slab-phase1-color);
  }
  25% {
    background-color: var(--slab-phase2-color, var(--slab-phase1-color));
  }
  49.9% {
    background-color: var(--slab-phase2-color, var(--slab-phase1-color));
  }
  50% {
    background-color: var(--slab-phase3-color, var(--slab-phase1-color));
  }
  74.9% {
    background-color: var(--slab-phase3-color, var(--slab-phase1-color));
  }
  75% {
    background-color: var(--slab-phase4-color, var(--slab-phase1-color));
  }
  99.9% {
    background-color: var(--slab-phase4-color, var(--slab-phase1-color));
  }
}`),Array.from({length:4},(function(e,t){return`--slab-phase${t+1}-color`})),dt(`.lifeline-rli-bounding-box {
  --life-line-phase1-color: rgb(50, 205, 50);
  font-size: 16px;
  isolation: isolate;
  color: var(--life-line-phase1-color);
}
.lifeline-rli-bounding-box .lifeline-indicator {
  position: relative;
  text-align: center;
}
.lifeline-rli-bounding-box .lifeline-indicator path.rli-lifeline {
  stroke-dasharray: 474.7616760254 30.3039367676;
  animation: var(--rli-animation-duration, 2s) var(--rli-animation-function, linear) infinite uxlv7k3, calc(var(--rli-animation-duration, 2s) * 4) var(--rli-animation-function, linear) infinite uxlv7kg;
}
.lifeline-rli-bounding-box .lifeline-text {
  color: currentColor;
  mix-blend-mode: difference;
  width: unset;
  display: block;
}

@property --life-line-phase1-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --life-line-phase2-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --life-line-phase3-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --life-line-phase4-color {
  syntax: "<color>";
  inherits: true;
  initial-value: rgb(50, 205, 50);
}
@property --rli-animation-duration {
  syntax: "<time>";
  inherits: true;
  initial-value: 2s;
}
@keyframes uxlv7k3 {
  to {
    stroke-dashoffset: -1010.1312255859;
  }
}
@keyframes uxlv7kg {
  100%, 0% {
    color: var(--life-line-phase1-color);
  }
  20% {
    color: var(--life-line-phase1-color);
  }
  25% {
    color: var(--life-line-phase2-color, var(--life-line-phase1-color));
  }
  45% {
    color: var(--life-line-phase2-color, var(--life-line-phase1-color));
  }
  50% {
    color: var(--life-line-phase3-color, var(--life-line-phase1-color));
  }
  70% {
    color: var(--life-line-phase3-color, var(--life-line-phase1-color));
  }
  75% {
    color: var(--life-line-phase4-color, var(--life-line-phase1-color));
  }
  95% {
    color: var(--life-line-phase4-color, var(--life-line-phase1-color));
  }
}`),Array.from({length:4},(function(e,t){return`--life-line-phase${t+1}-color`}));function en({show:e,title:t=`Processing...`,sub:n=`Please wait, do not close or refresh this tab.`}){return e?(0,I.jsx)(`div`,{className:`fixed inset-0 z-[99999] flex items-center justify-center pointer-events-auto`,style:{background:`rgba(15, 23, 42, 0.12)`,backdropFilter:`blur(3px)`,WebkitBackdropFilter:`blur(3px)`},role:`status`,"aria-live":`polite`,children:(0,I.jsxs)(`div`,{className:`rounded-3xl shadow-2xl px-10 py-8 flex flex-col items-center gap-3 max-w-sm text-center border border-white/60`,style:{background:`rgba(255, 255, 255, 0.78)`,backdropFilter:`blur(16px)`,WebkitBackdropFilter:`blur(16px)`},children:[(0,I.jsx)(Qt,{color:`#fab202`,size:`medium`,text:``,textColor:``}),(0,I.jsxs)(`div`,{children:[(0,I.jsx)(`div`,{className:`font-semibold text-slate-800 text-[15px] mt-2`,children:t}),n&&(0,I.jsx)(`div`,{className:`text-slate-500 text-[12.5px] mt-1`,children:n})]})]})}):null}var tn=[`#ff785a`,`#6983ee`,`#24b8a6`,`#af7dea`,`#e3b34f`,`#6aadc4`],nn=e=>tn[e%tn.length],rn=e=>(e??0).toLocaleString();function an({label:e,value:t,sub:n,iconText:r,iconClass:i}){return(0,I.jsxs)(`article`,{className:`bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-2`,children:[(0,I.jsxs)(`div`,{className:`flex items-center justify-between`,children:[(0,I.jsx)(`span`,{className:`text-[12px] font-semibold text-slate-500`,children:e}),(0,I.jsx)(`span`,{className:`text-lg font-bold ${i}`,children:r})]}),(0,I.jsx)(`strong`,{className:`text-[2rem] font-bold text-slate-900 leading-none`,children:rn(t)}),(0,I.jsx)(`small`,{className:`text-[12px] text-slate-400`,children:n})]})}function on({weeks:e=[]}){if(!e.length)return(0,I.jsx)(`div`,{className:`text-slate-400 italic text-sm p-4`,children:`No data.`});let t=Math.max(1,...e.map(e=>Math.max(e.records||0,e.files||0))),n=t<=4?4:Math.ceil(t/4)*4,r=new Intl.DateTimeFormat(`en`,{month:`short`,day:`numeric`,timeZone:`UTC`}),i=Array.from({length:5},(e,t)=>{let r=215-t/4*195;return(0,I.jsxs)(`g`,{children:[(0,I.jsx)(`line`,{x1:56,y1:r,x2:785,y2:r,stroke:`#edf0f5`}),(0,I.jsx)(`text`,{x:44,y:r+4,textAnchor:`end`,fontSize:11,fill:`#94a3b8`,children:rn(n*t/4)})]},t)}),a=e.flatMap((t,i)=>{let a=56+729/e.length*(i+.5);return[[`records`,tn[0],-18],[`files`,tn[1],3]].map(([e,r,o])=>{let s=(t[e]||0)/n*195;return(0,I.jsx)(`rect`,{x:a+o,y:215-s,width:15,height:s,rx:4,fill:r,children:(0,I.jsxs)(`title`,{children:[`Week of `,t.start,`: `,t[e]||0,` `,e]})},`${i}-${e}`)}).concat((0,I.jsx)(`text`,{x:a,y:242,textAnchor:`middle`,fontSize:10,fill:`#94a3b8`,children:r.format(new Date(t.start+`T00:00:00Z`))},`${i}-lbl`))}),o=e.some(e=>e.records||e.files);return(0,I.jsxs)(`div`,{className:`w-full overflow-x-auto`,children:[(0,I.jsxs)(`svg`,{viewBox:`0 0 800 260`,role:`img`,className:`w-full`,"aria-label":`Weekly migration activity`,children:[(0,I.jsx)(`title`,{children:`Weekly completed CRM records and files`}),i,a]}),!o&&(0,I.jsx)(`p`,{className:`text-center text-slate-400 text-sm mt-2`,children:`No completed records in the last 8 weeks`})]})}function sn({objects:e=[],total:t=0}){if(!t)return(0,I.jsx)(`div`,{className:`flex items-center justify-center h-48`,children:(0,I.jsx)(`div`,{className:`w-40 h-40 rounded-full border-[12px] border-slate-100 flex items-center justify-center`,children:(0,I.jsxs)(`div`,{className:`text-center`,children:[(0,I.jsx)(`div`,{className:`text-xl font-bold text-slate-800`,children:`0`}),(0,I.jsx)(`div`,{className:`text-[11px] text-slate-400`,children:`No migrations yet`})]})})});let n=0,r=`conic-gradient(${e.map(([,e],r)=>{let i=n;return n+=t?e/t*100:0,`${nn(r)} ${i}% ${n}%`}).join(`,`)})`;return(0,I.jsxs)(`div`,{className:`flex items-center gap-6`,children:[(0,I.jsx)(`div`,{className:`w-40 h-40 shrink-0 rounded-full flex items-center justify-center relative`,style:{background:r},"aria-label":e.map(([e,t])=>`${e}: ${t}`).join(`, `),children:(0,I.jsxs)(`div`,{className:`w-28 h-28 rounded-full bg-white flex flex-col items-center justify-center shadow-sm`,children:[(0,I.jsx)(`strong`,{className:`text-[22px] font-bold text-slate-900 leading-none`,children:rn(t)}),(0,I.jsx)(`span`,{className:`text-[11px] text-slate-400 mt-0.5`,children:`records migrated`})]})}),(0,I.jsx)(`div`,{className:`flex flex-col gap-2`,children:e.map(([e,t],n)=>(0,I.jsxs)(`div`,{className:`flex items-center justify-between gap-6 text-[12px]`,children:[(0,I.jsxs)(`span`,{className:`flex items-center gap-2 text-slate-700`,children:[(0,I.jsx)(`i`,{className:`inline-block w-2.5 h-2.5 rounded-full shrink-0`,style:{background:nn(n)}}),e]}),(0,I.jsx)(`strong`,{className:`text-slate-900 tabular-nums`,children:rn(t)})]},e))})]})}function cn({onShowToast:e}){let[t,n]=(0,T.useState)(null),[r,i]=(0,T.useState)(!1),a=(0,T.useCallback)(async({notifySuccess:t=!1}={})=>{if(!r){i(!0);try{let r=await L(`/api/dashboard`);n(r),t&&e?.(`Dashboard refreshed.`,`success`)}catch(t){e?.(t.message,`error`)}finally{i(!1)}}},[r,e]);(0,T.useEffect)(()=>{a();let e=setInterval(()=>{document.hidden||a()},3e4);return()=>clearInterval(e)},[]);let o=t?t.objects.map(e=>[e.name,e.count,e.source]):[];return(0,I.jsxs)(`div`,{className:`py-6 px-8 max-w-6xl mx-auto`,children:[(0,I.jsx)(en,{show:r&&!t,title:`Loading dashboard…`,sub:`Fetching migration data`}),(0,I.jsxs)(`div`,{className:`flex items-start justify-between mb-6`,children:[(0,I.jsxs)(`div`,{children:[(0,I.jsx)(`div`,{className:`text-[11px] font-bold tracking-widest text-slate-400 mb-1 uppercase`,children:`Your Migration Workspace`}),(0,I.jsxs)(`h1`,{className:`text-[2.2rem] font-black text-slate-900 leading-tight`,children:[`Migration overview`,(0,I.jsx)(`span`,{className:`text-[#ff7a59]`,children:`.`})]}),(0,I.jsx)(`p`,{className:`text-slate-500 mt-1 text-[13px]`,children:`Every record. One clear view.`})]}),(0,I.jsxs)(`button`,{type:`button`,onClick:()=>a({notifySuccess:!0}),disabled:r,className:`flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50 cursor-pointer`,children:[(0,I.jsx)(ke,{className:`w-4 h-4 ${r?`animate-spin`:``}`}),`Refresh`]})]}),(0,I.jsxs)(`div`,{className:`grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6`,children:[(0,I.jsx)(an,{label:`Total migrated`,value:t?.total,sub:`Across all migration modules`,iconText:`↗`,iconClass:`text-orange-400`}),(0,I.jsx)(an,{label:`Contacts`,value:t?.contacts,sub:`Successfully migrated records`,iconText:`◎`,iconClass:`text-violet-400`}),(0,I.jsx)(an,{label:`Files`,value:t?.files,sub:`Completed file assignments`,iconText:`▪`,iconClass:`text-blue-400`}),(0,I.jsx)(an,{label:`Needs attention`,value:t?.failed,sub:`Failed or uncertain records`,iconText:`!`,iconClass:`text-amber-500`})]}),(0,I.jsxs)(`div`,{className:`grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 mb-4`,children:[(0,I.jsxs)(`article`,{className:`bg-white border border-slate-200 rounded-2xl p-6`,children:[(0,I.jsxs)(`div`,{className:`flex items-start justify-between mb-1`,children:[(0,I.jsxs)(`div`,{children:[(0,I.jsx)(`h2`,{className:`font-bold text-slate-800 text-[15px]`,children:`Weekly migration activity`}),(0,I.jsx)(`p`,{className:`text-[12px] text-slate-400`,children:`Completed records over the last 8 weeks`})]}),(0,I.jsx)(`span`,{className:`text-[11px] px-2.5 py-1 bg-slate-100 rounded-md text-slate-500 font-medium`,children:`Weekly · UTC`})]}),(0,I.jsxs)(`div`,{className:`flex items-center gap-4 mb-3 text-[11px] text-slate-500`,children:[(0,I.jsxs)(`span`,{className:`flex items-center gap-1.5`,children:[(0,I.jsx)(`i`,{className:`inline-block w-2.5 h-2.5 rounded-sm`,style:{background:tn[0]}}),`CRM records`]}),(0,I.jsxs)(`span`,{className:`flex items-center gap-1.5`,children:[(0,I.jsx)(`i`,{className:`inline-block w-2.5 h-2.5 rounded-sm`,style:{background:tn[1]}}),`Files`]})]}),(0,I.jsx)(on,{weeks:t?.weeks??[]}),(0,I.jsx)(`p`,{className:`text-[11px] text-slate-400 mt-2`,children:`Monday contacts use their latest completion; HubSpot records and files use their first completed migration.`})]}),(0,I.jsxs)(`article`,{className:`bg-white border border-slate-200 rounded-2xl p-6 w-full lg:w-[320px] shrink-0`,children:[(0,I.jsx)(`h2`,{className:`font-bold text-slate-800 text-[15px] mb-0.5`,children:`Migrated by object`}),(0,I.jsx)(`p`,{className:`text-[12px] text-slate-400 mb-5`,children:`Successfully completed records`}),(0,I.jsx)(sn,{objects:o,total:t?.total??0})]})]}),(0,I.jsxs)(`article`,{className:`bg-white border border-slate-200 rounded-2xl overflow-hidden`,children:[(0,I.jsxs)(`div`,{className:`flex items-center justify-between px-6 py-4 border-b border-slate-100`,children:[(0,I.jsxs)(`div`,{children:[(0,I.jsx)(`h2`,{className:`font-bold text-slate-800 text-[15px]`,children:`Object breakdown`}),(0,I.jsx)(`p`,{className:`text-[12px] text-slate-400`,children:`All migration modules`})]}),(0,I.jsx)(`span`,{className:`text-[11px] px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md font-medium border border-emerald-100`,children:`Saved migration data`})]}),(0,I.jsx)(`div`,{className:`overflow-x-auto`,children:(0,I.jsxs)(`table`,{className:`w-full text-[13px]`,children:[(0,I.jsx)(`thead`,{className:`bg-slate-50 border-b border-slate-200`,children:(0,I.jsx)(`tr`,{children:[`Object`,`Migrated records`,`Source`,`Status`].map(e=>(0,I.jsx)(`th`,{className:`px-6 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide`,children:e},e))})}),(0,I.jsxs)(`tbody`,{children:[o.length===0&&(0,I.jsx)(`tr`,{children:(0,I.jsx)(`td`,{colSpan:4,className:`px-6 py-8 text-center text-slate-400 italic text-[13px]`,children:t?`No migrations yet.`:`Loading…`})}),o.map(([e,t,n],r)=>(0,I.jsxs)(`tr`,{className:`border-b border-slate-100 last:border-0 hover:bg-slate-50 transition`,children:[(0,I.jsx)(`td`,{className:`px-6 py-3 font-medium text-slate-800`,children:(0,I.jsxs)(`span`,{className:`inline-flex items-center gap-2.5`,children:[(0,I.jsx)(`span`,{className:`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white text-[11px]`,style:{background:nn(r)},children:e[0]}),e]})}),(0,I.jsx)(`td`,{className:`px-6 py-3 font-bold text-slate-900 tabular-nums`,children:rn(t)}),(0,I.jsx)(`td`,{className:`px-6 py-3 text-slate-500`,children:n}),(0,I.jsx)(`td`,{className:`px-6 py-3`,children:(0,I.jsx)(`span`,{className:`text-[11px] px-2.5 py-1 rounded-md font-medium ${t?`bg-emerald-50 text-emerald-700`:`bg-slate-100 text-slate-500`}`,children:t?`Migrated`:`No records`})})]},e))]})]})}),(0,I.jsx)(`div`,{className:`px-6 py-3 border-t border-slate-100 text-[11px] text-slate-400`,children:t?`Updated ${new Date(t.updatedAt).toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`})} · Refreshes every 30 seconds`:`Loading dashboard…`})]})]})}function ln({steps:e,current:t,onSelect:n,canAdvance:r=!1}){let i=t/(e.length-1)*100;return(0,I.jsxs)(`div`,{className:`bg-white border border-slate-200 rounded-xl px-6 py-4 mb-6`,children:[(0,I.jsxs)(`div`,{className:`flex items-center justify-between mb-3`,children:[(0,I.jsxs)(`span`,{className:`text-[11px] text-slate-400 font-semibold tracking-wide`,children:[`Step `,t+1,` of `,e.length]}),(0,I.jsxs)(`span`,{className:`text-[11px] text-slate-400`,children:[Math.round(i),`%`]})]}),(0,I.jsx)(`div`,{className:`w-full h-1.5 bg-slate-100 rounded-full mb-4 overflow-hidden`,children:(0,I.jsx)(`div`,{className:`h-full bg-[#ff7a59] rounded-full transition-all duration-500`,style:{width:`${i}%`}})}),(0,I.jsx)(`div`,{className:`flex items-start`,children:e.map((i,a)=>{let o=a<t,s=a===t,c=o||r&&a<=t+1;return(0,I.jsxs)(T.Fragment,{children:[(0,I.jsxs)(`button`,{type:`button`,disabled:!c,onClick:()=>c&&n(a),className:`flex flex-col items-center gap-1.5 flex-1 min-w-0 border-0 bg-transparent p-0 transition
                  ${c?`cursor-pointer`:`cursor-default`}
                `,children:[(0,I.jsx)(`span`,{className:`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition
                  ${o?`bg-[#ff7a59] text-white`:s?`border-2 border-[#ff7a59] text-[#ff7a59] bg-white`:`border-2 border-slate-200 text-slate-400 bg-white`}
                `,children:o?(0,I.jsx)(`svg`,{width:`12`,height:`12`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2.5`,strokeLinecap:`round`,strokeLinejoin:`round`,children:(0,I.jsx)(`polyline`,{points:`20 6 9 17 4 12`})}):a+1}),(0,I.jsx)(`span`,{className:`text-[11px] font-medium text-center leading-tight truncate max-w-full px-1
                  ${s?`text-[#df6d50] font-semibold`:o?`text-slate-600`:`text-slate-400`}
                `,children:i})]}),a<e.length-1&&(0,I.jsx)(`div`,{className:`flex-1 h-px bg-slate-200 mt-3.5 max-w-[40px]`})]},a)})})]})}function un({value:e=``,properties:t=[],onChange:n,filterFile:r=!1,disabled:i=!1,placeholder:a=`Choose a HubSpot property…`,allowCreate:o=!1}){let[s,c]=(0,T.useState)(!1),[l,u]=(0,T.useState)(``),d=(0,T.useRef)(null),f=(0,T.useRef)(null),p=(0,T.useRef)(null),m=t.filter(e=>e.calculated||e.modificationMetadata?.readOnlyValue||e.externalOptions?!1:r?!0:e.fieldType!==`file`),h=l.trim().toLowerCase(),g=h?m.filter(e=>e.name&&e.name.toLowerCase().includes(h)||e.label&&e.label.toLowerCase().includes(h)):m,_=[...g].sort((t,n)=>t.name===e?-1:n.name===e?1:(t.label||t.name).localeCompare(n.label||n.name)),v=m.find(t=>t.name===e),y=(0,T.useCallback)(()=>{c(!1),u(``)},[]),b=(0,T.useCallback)(e=>{n(e),y()},[n,y]);(0,T.useEffect)(()=>{if(!s)return;let e=e=>{!f.current?.contains(e.target)&&!d.current?.contains(e.target)&&y()};return document.addEventListener(`mousedown`,e),()=>document.removeEventListener(`mousedown`,e)},[s,y]),(0,T.useEffect)(()=>{s&&setTimeout(()=>p.current?.focus(),20)},[s]),(0,T.useEffect)(()=>{let e=e=>{e.key===`Escape`&&s&&y()};return document.addEventListener(`keydown`,e),()=>document.removeEventListener(`keydown`,e)},[s,y]);let x=o&&h&&!m.some(e=>e.name===h)?h.replace(/[^a-z0-9_]/g,`_`):null;return(0,I.jsxs)(`div`,{className:`relative w-full`,children:[(0,I.jsxs)(`button`,{ref:d,type:`button`,disabled:i,onClick:()=>c(e=>!e),"aria-haspopup":`listbox`,"aria-expanded":s,className:`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-[13px] text-left transition
          ${i?`opacity-50 cursor-not-allowed bg-slate-50 border-slate-200`:`cursor-pointer bg-white border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30`}
          ${e?`text-slate-800`:`text-slate-400`}
        `,children:[(0,I.jsx)(`span`,{className:`flex-1 min-w-0`,children:e?(0,I.jsxs)(`span`,{className:`flex items-center gap-2 min-w-0`,children:[(0,I.jsx)(`span`,{className:`font-medium truncate`,children:v?v.label||v.name:e}),v?.type&&(0,I.jsx)(`span`,{className:`text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono shrink-0`,children:v.type})]}):(0,I.jsx)(`span`,{className:`truncate`,children:a})}),e&&!i&&(0,I.jsx)(`span`,{className:`shrink-0 text-slate-400 hover:text-slate-700 leading-none text-base`,onClick:e=>{e.stopPropagation(),b(``)},title:`Clear`,children:`×`}),(0,I.jsx)(`span`,{className:`text-slate-400 shrink-0`,children:`▾`})]}),s&&(0,I.jsxs)(`div`,{ref:f,className:`absolute left-0 top-full mt-1 z-[9999] w-full min-w-[320px] max-w-[480px] bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden`,role:`listbox`,children:[(0,I.jsx)(`div`,{className:`px-3 pt-2.5 pb-1.5 border-b border-slate-100`,children:(0,I.jsx)(`input`,{ref:p,type:`text`,value:l,onChange:e=>u(e.target.value),placeholder:`Search properties (name or label)…`,className:`w-full px-3 py-1.5 text-[12.5px] rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30`,autoComplete:`off`})}),(0,I.jsx)(`div`,{className:`px-3 py-1 text-[11px] text-slate-400`,children:h?`${g.length} matching`:`${m.length} properties available`}),(0,I.jsxs)(`div`,{className:`max-h-72 overflow-y-auto pb-1`,children:[(0,I.jsx)(`button`,{type:`button`,onClick:()=>b(``),className:`w-full flex items-center px-3 py-2 text-[12.5px] text-left hover:bg-slate-50 transition ${e?`text-slate-400`:`font-semibold text-slate-700`}`,children:`— Ignore column (leave unmapped) —`}),_.map(t=>{let n=t.name===e;return(0,I.jsxs)(`button`,{type:`button`,onClick:()=>b(t.name),"aria-selected":n,className:`w-full flex flex-col px-3 py-2 text-left hover:bg-slate-50 transition ${n?`bg-orange-50`:``}`,children:[(0,I.jsxs)(`span`,{className:`flex items-center gap-2`,children:[(0,I.jsx)(`span`,{className:`font-medium text-[12.5px] ${n?`text-[#df6d50]`:`text-slate-800`}`,children:t.label||t.name}),(0,I.jsx)(`span`,{className:`text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono`,children:t.fieldType===`file`?`FILE`:t.type})]}),(0,I.jsx)(`span`,{className:`text-[11px] text-slate-400 font-mono`,children:t.name})]},t.name)}),x&&(0,I.jsxs)(`button`,{type:`button`,onClick:()=>{n(x),y()},className:`w-full flex flex-col px-3 py-2 text-left hover:bg-slate-50 transition`,children:[(0,I.jsxs)(`span`,{className:`flex items-center gap-2`,children:[(0,I.jsxs)(`span`,{className:`font-medium text-[12.5px] text-emerald-700`,children:[`+ Use "`,x,`"`]}),(0,I.jsx)(`span`,{className:`text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-600 font-mono`,children:`NEW`})]}),(0,I.jsx)(`span`,{className:`text-[11px] text-slate-400`,children:`Create property on HubSpot`})]}),!_.length&&!x&&(0,I.jsx)(`div`,{className:`px-3 py-4 text-[12.5px] text-slate-400 italic text-center`,children:h?`No matching properties found.`:`No HubSpot properties loaded.`})]})]})]})}function dn({logs:e=[],emptyText:t=`No activity yet.`}){let n=(0,T.useRef)(null);return(0,T.useEffect)(()=>{if(!n.current)return;let e=n.current;e.scrollHeight-e.scrollTop-e.clientHeight<90&&(e.scrollTop=e.scrollHeight)},[e]),(0,I.jsx)(`div`,{ref:n,className:`h-72 overflow-y-auto font-mono text-[11.5px] flex flex-col gap-0.5 pr-1`,role:`log`,"aria-live":`polite`,children:e.length===0?(0,I.jsx)(`div`,{className:`text-slate-400 italic p-3`,children:t}):e.map((e,t)=>(0,I.jsxs)(`div`,{className:`flex gap-2 py-0.5 items-start border-b border-slate-50 last:border-0
              ${e.level===`error`?`text-red-600`:e.level===`warn`?`text-amber-600`:e.level===`success`?`text-emerald-700`:`text-slate-600`}
            `,children:[(0,I.jsx)(`time`,{className:`shrink-0 text-slate-400 tabular-nums`,children:new Date(e.timestamp||Date.now()).toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`,second:`2-digit`})}),(0,I.jsx)(`span`,{className:`shrink-0 w-1.5 h-1.5 rounded-full mt-1.5 bg-current opacity-60`}),(0,I.jsx)(`span`,{className:`break-words`,children:e.message})]},t))})}function fn({value:e=0,className:t=``}){let n=Math.min(100,Math.max(0,e));return(0,I.jsx)(`div`,{className:`w-full bg-slate-100 rounded-full h-2 overflow-hidden ${t}`,children:(0,I.jsx)(`div`,{className:`h-full bg-[#ff7a59] rounded-full transition-all duration-300`,style:{width:`${n}%`}})})}function pn({children:e,variant:t=`neutral`,className:n=``}){let r={neutral:`bg-slate-100 text-slate-600`,success:`bg-emerald-50 text-emerald-700 border border-emerald-200`,warning:`bg-amber-50 text-amber-700 border border-amber-200`,error:`bg-red-50 text-red-700 border border-red-200`,info:`bg-blue-50 text-blue-700 border border-blue-200`,brand:`bg-orange-50 text-orange-600`};return(0,I.jsx)(`span`,{className:`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${r[t]??r.neutral} ${n}`,children:e})}var mn=`data-migrate`,hn=e=>`/api/hubspot/${mn}/${e}`,gn=[`Choose workbook`,`Map columns`,`Review & validate`,`Run & monitor`],_n=e=>String(e).toLowerCase().replace(/[^a-z0-9]/g,``);function vn(e){return{neutral:`neutral`,success:`success`,warning:`warning`,error:`error`,blocked:`error`,completed:`success`,completed_with_errors:`warning`,cancelled:`warning`,idle:`neutral`,previewing:`info`,migrating:`info`,validating:`info`}[e]??`neutral`}var yn=[{id:`save`,label:`1. Save column mappings`,sub:`Persisting current mapping & match configuration`},{id:`parse`,label:`2. Parse workbook records`,sub:`Loading worksheet records and column headers`},{id:`validate`,label:`3. Validate data integrity`,sub:`Checking property formats, enums, dates & unique IDs`},{id:`remote`,label:`4. Check HubSpot schema`,sub:`Verifying CRM destination properties & schema rules`},{id:`summary`,label:`5. Compile validation report`,sub:`Aggregating record counts and validation issues`}];function bn({stages:e}){return(0,I.jsxs)(`div`,{className:`border border-slate-200 rounded-xl overflow-hidden mb-4`,children:[(0,I.jsxs)(`div`,{className:`bg-slate-50 px-5 py-3 flex items-center justify-between border-b border-slate-200`,children:[(0,I.jsxs)(`div`,{className:`flex items-center gap-2 text-[13px] font-semibold text-slate-700`,children:[(0,I.jsx)(`span`,{className:`w-2 h-2 rounded-full inline-block ${e.get(`summary`)?.status===`completed`?`bg-emerald-500`:e.get(`summary`)?.status===`error`?`bg-red-500`:`bg-[#ff7a59] animate-pulse`}`}),e.get(`summary`)?.status===`completed`?`Validation complete`:e.get(`summary`)?.status===`error`?`Validation error`:`Validation in progress`]}),(0,I.jsx)(`span`,{className:`text-[11px] text-slate-400 font-mono`,children:e.get(`_elapsed`)??``})]}),(0,I.jsx)(`div`,{className:`divide-y divide-slate-100`,children:yn.map((t,n)=>{let r=e.get(t.id)??{status:`pending`};return(0,I.jsxs)(`div`,{className:`flex items-start gap-4 px-5 py-3 transition
              ${r.status===`active`?`bg-orange-50`:r.status===`completed`?`bg-emerald-50/40`:r.status===`error`?`bg-red-50`:``}
            `,children:[(0,I.jsx)(`span`,{className:`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-[11px] font-bold mt-0.5 transition
                ${r.status===`completed`?`bg-emerald-500 text-white`:r.status===`error`?`bg-red-500 text-white`:r.status===`active`?`bg-[#ff7a59] text-white animate-pulse`:`bg-slate-200 text-slate-500`}
              `,children:r.status===`completed`?`✓`:r.status===`error`?`✕`:n+1}),(0,I.jsxs)(`div`,{children:[(0,I.jsx)(`div`,{className:`text-[12.5px] font-semibold ${r.status===`active`?`text-[#df6d50]`:r.status===`completed`?`text-emerald-800`:r.status===`error`?`text-red-800`:`text-slate-500`}`,children:t.label}),(0,I.jsx)(`div`,{className:`text-[11.5px] text-slate-400 mt-0.5`,children:r.detail??t.sub})]})]},t.id)})})]})}var xn=[{id:`validate`,label:`1. Validation`},{id:`process`,label:`2. Migration`},{id:`associations`,label:`3. Associations`},{id:`finish`,label:`4. Summary`}];function Sn({job:e}){if(!e||e.phase===`idle`)return null;let t=t=>{let n=e.phase;return n===`validating`?t===`validate`?`active`:`pending`:n===`previewing`||n===`migrating`?t===`validate`?`done`:t===`process`?`active`:`pending`:n===`blocked`?t===`validate`?`error`:`pending`:n===`completed`||n===`completed_with_errors`?t===`finish`&&e.failed>0?`error`:`done`:n===`cancelled`?t===`process`?`error`:t===`validate`?`done`:`pending`:(n===`failed`||n===`interrupted`)&&(t===`validate`||t===`process`)?`error`:`pending`};return(0,I.jsx)(`div`,{className:`flex items-center gap-2 mb-4 flex-wrap`,children:xn.map(e=>{let n=t(e.id);return(0,I.jsxs)(`span`,{className:`flex items-center gap-1.5 text-[11.5px] font-medium px-3 py-1.5 rounded-full
            ${n===`done`?`bg-emerald-50 text-emerald-700 border border-emerald-200`:n===`active`?`bg-orange-50 text-[#df6d50] border border-[#ff7a59]/30 animate-pulse`:n===`error`?`bg-red-50 text-red-700 border border-red-200`:`bg-slate-100 text-slate-400`}
          `,children:[n===`done`?`✓`:n===`error`?`✕`:n===`active`?`◉`:`○`,e.label]},e.id)})})}function Cn({onShowToast:e}){let[t,n]=(0,T.useState)(0),[r,i]=(0,T.useState)(!1),[a,o]=(0,T.useState)(``),[s,c]=(0,T.useState)(``),[l,u]=(0,T.useState)([]),[d,f]=(0,T.useState)(``),[p,m]=(0,T.useState)(``),[h,g]=(0,T.useState)(null),[_,v]=(0,T.useState)(null),[y,b]=(0,T.useState)(null),[x,S]=(0,T.useState)(``),[C,ee]=(0,T.useState)([]),[w,te]=(0,T.useState)({}),[ne,re]=(0,T.useState)(``),[ie,E]=(0,T.useState)(`hs_object_id`),[ae,oe]=(0,T.useState)([]),[se,ce]=(0,T.useState)(!1),[D,le]=(0,T.useState)(null),[ue,de]=(0,T.useState)(new Map),[fe,pe]=(0,T.useState)(!1),[me,he]=(0,T.useState)(`dry`),[ge,_e]=(0,T.useState)(``),[O,ve]=(0,T.useState)({phase:`idle`,running:!1}),[ye,k]=(0,T.useState)([]),[A,j]=(0,T.useState)(!1),xe=(0,T.useRef)(null),Se=(0,T.useRef)(O);Se.current=O;let Ce=()=>h?.objectTypeId??``,M=(0,T.useCallback)((t,n=`info`)=>e?.(t,n),[e]),N=(0,T.useCallback)(async(e,t=`Processing...`,n=``)=>{if(!(r||Se.current.running)){i(!0),o(t),c(n);try{await e()}catch(e){M(e.message,`error`)}finally{i(!1),o(``),c(``)}}},[r,M]),P=()=>{le(null),ce(!0),de(new Map)},we=(0,T.useCallback)(async(e=!1)=>{let t=await L(`/api/hubspot/objects${e?`?refresh=true`:``}`);return u(t.objects),f(`${t.portalName??`HubSpot`} · Portal ${t.portalId}`),t.warnings?.length&&M(t.warnings.join(` `),`info`),t},[M]),Te=(0,T.useCallback)(async(e=!1)=>{if(!h)throw Error(`Choose a destination object from the portal first.`);let t=await L(`/api/hubspot/properties/${encodeURIComponent(h.objectTypeId)}`);if(ee(t),e&&_){let e=Object.fromEntries(_.columns.map(e=>[e.name,t.find(t=>!t.modificationMetadata?.readOnlyValue&&!t.calculated&&(_n(t.name)===_n(e.name)||_n(t.label)===_n(e.name)))?.name??``]));te(e);let n=_.columns.find(e=>/^(recordid|hsobjectid)$/.test(_n(e.name)))??_.columns.find(e=>h.objectTypeId===`0-1`&&_n(e.name)===`email`);n&&(re(n.name),E(_n(n.name)===`email`?`email`:`hs_object_id`))}return t},[h,_]),Ee=(0,T.useCallback)(async()=>{await L(hn(`config`),`PUT`,{objectType:Ce(),identifierColumn:ne,idProperty:ie,mapping:w,associations:ae.map(({objectType:e,column:t,typeId:n})=>({objectType:e,column:t,typeId:n}))}),ce(!1)},[ne,ie,w,ae,h]);(0,T.useEffect)(()=>{A||N(async()=>{let e=await L(hn(`state`));if(j(!0),v(e.workbook),g(e.selectedObject),m(e.credentialsConfigured?`Portal credentials are configured.`:`Configure HUBSPOT_PORTAL_ID and HUBSPOT_PRIVATE_APP_TOKEN in .env, then restart.`),e.credentialsConfigured&&await we(),e.config){let t=e.config;te(t.mapping??{}),re(t.identifierColumn??``),E(t.idProperty??`hs_object_id`),oe(t.associations??[]),ce(!1)}if(e.status&&F(e.status),e.workbook&&e.selectedObject&&e.credentialsConfigured)try{await Te(!e.config),e.config&&ce(!1)}catch(e){M(e.message,`error`)}(e.status?.running||e.status?.phase&&e.status.phase!==`idle`)&&n(3)},`Loading workspace…`)},[]);function F(e){ve(e),e.review&&le(e.review),e.logs?.length&&k(e.logs.map(e=>({...e,level:e.level??`info`})))}(0,T.useEffect)(()=>{if(!A)return;let e=setInterval(async()=>{if(Se.current.running)try{F(await L(hn(`status`)))}catch{}},2e3);return()=>clearInterval(e)},[A]);let Oe=(0,T.useCallback)(async e=>{await N(async()=>{if(e>0&&(!_||!h))throw Error(`Select a portal object and upload a workbook first.`);t===1&&se&&await Ee(),e>0&&!C.length&&await Te(Object.keys(w).length===0),n(e)},e===1?`Loading HubSpot properties & preparing column mappings...`:e===2?`Saving mappings & preparing validation review...`:`Loading run monitor...`)},[t,_,h,se,C,w,Ee,Te,N]),Ae=(0,T.useCallback)(async e=>{await N(async()=>{if(!e){g(null),P();return}let t=await L(hn(`object`),`PUT`,{objectTypeId:e});g(t.selectedObject),ee([]),te({}),re(``),E(`hs_object_id`),oe(e=>e.map(e=>({...e,typeId:null,labels:null}))),P(),_&&await Te(!0)},`Updating destination object & loading portal schema...`)},[_,Te,N]),Me=(0,T.useCallback)(async()=>{await N(async()=>{let e=xe.current?.files[0];if(!e)return;if(!/\.(csv|xlsx)$/i.test(e.name)||e.size>50*1024**2)throw Error(`Choose a CSV or XLSX workbook up to 50 MB.`);let t=new FormData;t.append(`file`,e);let n=await L(hn(`workbook`),`POST`,t);v(n.workbook),te({}),re(``),E(`hs_object_id`),P(),M(`Workbook ready. Continue to map columns.`,`success`);try{await Te(!0)}catch(e){M(`Workbook uploaded. ${e.message}`,`error`)}},`Uploading workbook & analyzing columns...`)},[Te,M,N]),Ne=(0,T.useCallback)(async()=>{pe(!0),de(new Map([[`save`,{status:`active`,detail:`Saving mappings and match configuration...`}]]));let e=Date.now();try{await Ee();let t=new Map([[`save`,{status:`completed`,detail:`Mappings and match settings saved`}],[`parse`,{status:`active`,detail:`Loading worksheet records from ${_?.filename??`workbook`}...`}]]);de(t);let n=[{id:`validate`,delay:800,detail:`Checking cell data types, options, dates and emails...`},{id:`remote`,delay:1800,detail:`Querying HubSpot CRM schema and verifying record identifiers...`},{id:`summary`,delay:3500,detail:`Aggregating record results and building validation report...`}].map(({id:e,delay:t,detail:n})=>setTimeout(()=>de(t=>{let r=new Map(t);return r.set(e,{status:`active`,detail:n}),r}),t)),r=await L(hn(`preflight`),`POST`,{});n.forEach(clearTimeout);let i=((Date.now()-e)/1e3).toFixed(1);le(r),de(new Map([[`save`,{status:`completed`}],[`parse`,{status:`completed`,detail:`Parsed ${(r.rows??_?.rows??0).toLocaleString()} workbook records successfully`}],[`validate`,{status:`completed`,detail:r.issueCount?`Found ${r.issueCount.toLocaleString()} format or constraint items`:`All mapped columns and cell formats verified`}],[`remote`,{status:`completed`,detail:`${(r.existing??0).toLocaleString()} existing matched · ${(r.creating??0).toLocaleString()} to create`}],[`summary`,{status:`completed`,detail:`Completed in ${i}s`}],[`_elapsed`,`Completed in ${i}s`]])),M(r.issueCount?`Validation found issues. Review the results below.`:`Validation passed. Your import is ready.`,r.issueCount?`error`:`success`)}catch(e){de(t=>{let n=new Map(t);for(let[t,r]of n)r.status===`active`&&n.set(t,{status:`error`,detail:e.message});return n}),M(e.message,`error`)}finally{pe(!1)}},[Ee,_,M]),Pe=(0,T.useCallback)(async()=>{await N(async()=>{se&&await Ee();let e=await L(hn(`run`),`POST`,{dryRun:me!==`real`,confirmation:ge});_e(``),F(e)},me===`real`?`Starting migration...`:`Starting dry preview...`,`Initializing HubSpot 2026-09 batch engine`)},[se,Ee,me,ge,N]),Fe=(0,T.useCallback)(async()=>{try{F(await L(hn(`cancel`),`POST`,{}))}catch(e){M(e.message,`error`)}},[M]),Ie=(0,T.useCallback)(async()=>{await N(async()=>{F(await L(hn(`reset`),`POST`,{})),M(`Run state reset to ready.`,`success`)},`Resetting run state...`)},[N,M]),Le=C.filter(e=>!e.calculated&&!e.modificationMetadata?.readOnlyValue&&!e.externalOptions&&e.name!==`hs_object_id`),Re=Object.values(w).filter(Boolean).length,Be=(()=>{let e=new Map;for(let t of Object.values(w))t&&e.set(t,(e.get(t)??0)+1);return[...e.values()].filter(e=>e>1).length})(),Ve=O.total?Math.round(O.completed/O.total*100):0;return(0,I.jsxs)(`div`,{className:`py-6 px-8 max-w-5xl mx-auto`,children:[(0,I.jsx)(en,{show:r,title:a,sub:s}),(0,I.jsxs)(`div`,{className:`mb-1 text-[11px] text-slate-400 font-medium`,children:[`HubSpot / `,(0,I.jsx)(`span`,{className:`text-slate-600`,children:`Data Migrate`})]}),(0,I.jsx)(`h1`,{className:`text-[1.9rem] font-black text-slate-900 leading-tight mb-1`,children:`Data Migrate`}),(0,I.jsx)(`p`,{className:`text-slate-500 text-[13px] mb-6`,children:`Import workbook records into your destination HubSpot account.`}),(0,I.jsx)(ln,{steps:gn,current:t,onSelect:Oe,canAdvance:!!(_&&h)}),t===0&&(0,I.jsxs)(`div`,{className:`grid grid-cols-1 md:grid-cols-2 gap-5`,children:[(0,I.jsxs)(`article`,{className:`bg-white border border-slate-200 rounded-2xl overflow-hidden`,children:[(0,I.jsxs)(`div`,{className:`flex items-start justify-between px-6 py-4 border-b border-slate-100`,children:[(0,I.jsxs)(`div`,{children:[(0,I.jsx)(`h2`,{className:`font-bold text-slate-800 text-[15px]`,children:`Destination object`}),(0,I.jsx)(`p`,{className:`text-[12px] text-slate-400 mt-0.5`,children:d||`Objects are fetched from your connected HubSpot portal.`})]}),(0,I.jsxs)(`button`,{type:`button`,onClick:()=>N(()=>we(!0),`Refreshing objects...`),disabled:r,className:`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-[12.5px] text-slate-600 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50`,children:[(0,I.jsx)(ke,{className:`w-3.5 h-3.5`}),`Refresh`]})]}),(0,I.jsxs)(`div`,{className:`px-6 py-4 flex flex-col gap-4`,children:[(0,I.jsxs)(`label`,{className:`flex flex-col gap-1.5 text-[12.5px] font-medium text-slate-700`,children:[`Object`,(0,I.jsxs)(`select`,{value:h?.objectTypeId??``,onChange:e=>Ae(e.target.value),disabled:r||!l.length,className:`px-3 py-2 rounded-lg border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30 disabled:opacity-50`,children:[(0,I.jsx)(`option`,{value:``,children:`Select an object from your portal`}),l.map(e=>(0,I.jsx)(`option`,{value:e.objectTypeId,children:e.label},e.objectTypeId))]})]}),h&&(0,I.jsxs)(`p`,{className:`text-[12px] text-slate-500`,children:[h.label,` · Object ID `,h.objectTypeId]}),(0,I.jsx)(`p`,{className:`text-[11.5px] text-slate-400 p-3 bg-blue-50 border border-blue-100 rounded-lg`,children:`Record IDs must belong to the destination account. Source-account IDs cannot be used to match destination records.`}),p&&(0,I.jsx)(`p`,{className:`text-[11.5px] text-slate-400`,children:p})]})]}),(0,I.jsxs)(`article`,{className:`bg-white border border-slate-200 rounded-2xl overflow-hidden`,children:[(0,I.jsxs)(`div`,{className:`flex items-start justify-between px-6 py-4 border-b border-slate-100`,children:[(0,I.jsxs)(`div`,{children:[(0,I.jsx)(`h2`,{className:`font-bold text-slate-800 text-[15px]`,children:`Choose workbook`}),(0,I.jsx)(`p`,{className:`text-[12px] text-slate-400 mt-0.5`,children:`Upload a HubSpot export or another CSV / Excel workbook.`})]}),(0,I.jsx)(pn,{variant:`neutral`,children:`CSV / XLSX`})]}),(0,I.jsxs)(`div`,{className:`px-6 py-4 flex flex-col gap-3`,children:[(0,I.jsxs)(`label`,{className:`flex flex-col items-center gap-3 p-6 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-[#ff7a59]/40 hover:bg-orange-50/30 transition`,children:[(0,I.jsx)(qe,{className:`w-8 h-8 text-slate-300`}),(0,I.jsx)(`span`,{className:`font-semibold text-slate-700 text-[13px]`,children:`Select your workbook`}),(0,I.jsx)(`span`,{className:`text-[11.5px] text-slate-400`,children:`CSV or XLSX · up to 50 MB`}),(0,I.jsx)(`input`,{ref:xe,type:`file`,accept:`.csv,.xlsx`,className:`sr-only`,onChange:e=>S(e.target.files[0]?.name??``)})]}),x&&(0,I.jsx)(`p`,{className:`text-[12px] text-slate-600 font-medium`,children:x}),(0,I.jsx)(`button`,{type:`button`,onClick:Me,disabled:r||!h||!x,className:`px-4 py-2 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-50 cursor-pointer`,children:`Use selected file`}),_&&(0,I.jsxs)(`div`,{className:`p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-[12px] text-emerald-800 font-medium`,children:[_.filename,` · `,_.rows.toLocaleString(),` rows · `,_.columns.length,` columns`]})]})]})]}),t===1&&(0,I.jsxs)(`div`,{className:`flex flex-col gap-5`,children:[(0,I.jsxs)(`article`,{className:`bg-white border border-slate-200 rounded-2xl overflow-hidden`,children:[(0,I.jsxs)(`div`,{className:`flex items-start justify-between px-6 py-4 border-b border-slate-100`,children:[(0,I.jsxs)(`div`,{children:[(0,I.jsx)(`h2`,{className:`font-bold text-slate-800 text-[15px]`,children:`Match records`}),(0,I.jsx)(`p`,{className:`text-[12px] text-slate-400 mt-0.5`,children:`Choose how to find an existing record or create a missing one.`})]}),(0,I.jsx)(`button`,{type:`button`,onClick:()=>N(()=>Te(Object.keys(w).length===0),`Fetching properties from HubSpot portal...`),disabled:r||!h,className:`px-3 py-1.5 rounded-lg border border-slate-200 text-[12.5px] text-slate-600 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50`,children:`Load HubSpot properties`})]}),(0,I.jsxs)(`div`,{className:`px-6 py-4 grid grid-cols-2 gap-4`,children:[(0,I.jsxs)(`label`,{className:`flex flex-col gap-1.5 text-[12.5px] font-medium text-slate-700`,children:[`Identifier column`,(0,I.jsxs)(`select`,{value:ne,onChange:e=>{re(e.target.value),P()},disabled:r,className:`px-3 py-2 rounded-lg border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30 disabled:opacity-50`,children:[(0,I.jsx)(`option`,{value:``,children:`Choose identifier column`}),_?.columns.map(e=>(0,I.jsx)(`option`,{value:e.name,children:e.name},e.name))]})]}),(0,I.jsxs)(`label`,{className:`flex flex-col gap-1.5 text-[12.5px] font-medium text-slate-700`,children:[`Match using`,(0,I.jsxs)(`select`,{value:ie,onChange:e=>{E(e.target.value),P()},disabled:r,className:`px-3 py-2 rounded-lg border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30 disabled:opacity-50`,children:[(0,I.jsx)(`option`,{value:`hs_object_id`,children:`Record ID · update existing only`}),C.filter(e=>e.hasUniqueValue||Ce()===`0-1`&&e.name===`email`).map(e=>(0,I.jsxs)(`option`,{value:e.name,children:[e.label,` · create/update`]},e.name))]})]})]}),(0,I.jsx)(`p`,{className:`px-6 pb-4 text-[12px] text-slate-400`,children:`Contact email or a property with unique values supports create/update. Blank cells do not erase existing values.`})]}),(0,I.jsxs)(`article`,{className:`bg-white border border-slate-200 rounded-2xl overflow-hidden`,children:[(0,I.jsxs)(`div`,{className:`flex items-start justify-between px-6 py-4 border-b border-slate-100`,children:[(0,I.jsxs)(`div`,{children:[(0,I.jsx)(`h2`,{className:`font-bold text-slate-800 text-[15px]`,children:`Column mapping`}),(0,I.jsx)(`p`,{className:`text-[12px] text-slate-400 mt-0.5`,children:`Map each source column to a writable HubSpot property.`})]}),(0,I.jsxs)(pn,{variant:Be?`error`:`neutral`,children:[Re,` mapped`,Be?` · ${Be} duplicate${Be>1?`s`:``}`:``]})]}),(0,I.jsx)(`div`,{className:`overflow-x-auto`,children:(0,I.jsxs)(`table`,{className:`w-full text-[12.5px]`,children:[(0,I.jsx)(`thead`,{className:`bg-slate-50 border-b border-slate-200`,children:(0,I.jsx)(`tr`,{children:[`Workbook column`,`Sample values`,`HubSpot property`].map(e=>(0,I.jsx)(`th`,{className:`px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap`,children:e},e))})}),(0,I.jsx)(`tbody`,{className:`divide-y divide-slate-100`,children:(_?.columns??[]).map(e=>{let t=w[e.name]??``,n=t&&Object.values(w).filter(e=>e===t).length>1;return(0,I.jsxs)(`tr`,{className:`hover:bg-slate-50`,children:[(0,I.jsx)(`td`,{className:`px-5 py-3 font-medium text-slate-800 whitespace-nowrap`,children:e.name}),(0,I.jsx)(`td`,{className:`px-5 py-3 text-slate-400 max-w-[200px] truncate`,children:e.samples?.filter(Boolean).join(` · `)||`—`}),(0,I.jsxs)(`td`,{className:`px-5 py-3 min-w-[260px]`,children:[(0,I.jsx)(un,{value:t,properties:Le,onChange:t=>{te(n=>({...n,[e.name]:t})),P()},disabled:r,allowCreate:!0}),n&&(0,I.jsxs)(`p`,{className:`text-[11px] text-amber-600 mt-1`,children:[`⚠ "`,t,`" mapped to multiple columns.`]})]})]},e.name)})})]})}),(0,I.jsx)(`div`,{className:`px-6 py-4 border-t border-slate-100`,children:(0,I.jsx)(`button`,{type:`button`,onClick:()=>N(async()=>{await Ee(),M(`Mappings saved.`,`success`)},`Saving column mappings...`),disabled:r,className:`px-4 py-2 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50`,children:`Save mappings`})})]})]}),t===2&&(0,I.jsxs)(`article`,{className:`bg-white border border-slate-200 rounded-2xl overflow-hidden`,children:[(0,I.jsxs)(`div`,{className:`flex items-start justify-between px-6 py-4 border-b border-slate-100`,children:[(0,I.jsxs)(`div`,{children:[(0,I.jsx)(`h2`,{className:`font-bold text-slate-800 text-[15px]`,children:`Review & validate`}),(0,I.jsx)(`p`,{className:`text-[12px] text-slate-400 mt-0.5`,children:`Check mappings, property values, record matches and associations.`})]}),(0,I.jsx)(`button`,{type:`button`,onClick:Ne,disabled:r||fe,className:`flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ff7a59] text-white text-[13px] font-semibold hover:bg-[#e26746] transition disabled:opacity-50 cursor-pointer`,children:fe?`⟳ Validating...`:`Run validation`})]}),(0,I.jsxs)(`div`,{className:`px-6 py-5`,children:[(0,I.jsx)(`div`,{className:`grid grid-cols-2 md:grid-cols-4 gap-4 mb-5 text-[12.5px]`,children:[[`Workbook`,_?.filename??`—`],[`Object`,h?`${h.label} (${Ce()})`:`Not selected`],[`Match`,`${ne||`Not selected`} → ${ie}`],[`Mapped columns`,Re]].map(([e,t])=>(0,I.jsxs)(`div`,{className:`p-3 bg-slate-50 rounded-xl border border-slate-100`,children:[(0,I.jsx)(`div`,{className:`text-[11px] text-slate-400 font-medium mb-1`,children:e}),(0,I.jsx)(`div`,{className:`font-semibold text-slate-800 truncate`,children:String(t)})]},e))}),ue.size>0&&(0,I.jsx)(bn,{stages:ue}),D?(0,I.jsxs)(`div`,{className:`p-4 rounded-xl border ${D.issueCount?`bg-red-50 border-red-200`:`bg-emerald-50 border-emerald-200`} mb-4`,children:[(0,I.jsx)(`p`,{className:`font-semibold text-[13px] ${D.issueCount?`text-red-800`:`text-emerald-800`}`,children:D.issueCount?`${D.issueCount} validation issue(s). Fix them before running.`:`Validation passed. Ready for a dry preview or real migration.`}),(0,I.jsxs)(`p`,{className:`text-[12px] text-slate-600 mt-1`,children:[D.records,` records · `,D.existing,` existing · `,D.creating,` to create · `,D.associations??0,` associations`]}),D.issueCount>0&&(0,I.jsxs)(`button`,{type:`button`,onClick:()=>N(()=>ut(hn(`issues-report`),`validation-issues.csv`),`Preparing CSV…`),className:`mt-3 flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-[12.5px] text-slate-700 hover:bg-slate-50 transition cursor-pointer`,children:[(0,I.jsx)(be,{className:`w-4 h-4`}),`Download all `,D.issueCount.toLocaleString(),` validation issues (CSV)`]}),D.issues?.length>0&&(0,I.jsxs)(`ul`,{className:`mt-3 text-[12px] text-red-700 list-disc ml-4 space-y-0.5`,children:[D.issues.slice(0,20).map((e,t)=>(0,I.jsxs)(`li`,{children:[e.row?`Row ${e.row}: `:``,e.message]},t)),D.issues.length>20&&(0,I.jsxs)(`li`,{children:[`…and `,(D.issueCount-20).toLocaleString(),` more. Download CSV.`]})]})]}):!fe&&(0,I.jsx)(`p`,{className:`text-slate-400 italic text-[13px]`,children:`Run validation to check your current settings. Nothing is written to HubSpot.`})]})]}),t===3&&(0,I.jsxs)(`div`,{className:`grid grid-cols-1 lg:grid-cols-2 gap-5`,children:[(0,I.jsxs)(`article`,{className:`bg-white border border-slate-200 rounded-2xl overflow-hidden`,children:[(0,I.jsxs)(`div`,{className:`flex items-start justify-between px-6 py-4 border-b border-slate-100`,children:[(0,I.jsxs)(`div`,{children:[(0,I.jsx)(`h2`,{className:`font-bold text-slate-800 text-[15px]`,children:`Run & monitor`}),(0,I.jsx)(`p`,{className:`text-[12px] text-slate-400 mt-0.5`,children:`Preview first, then run the real migration.`})]}),(0,I.jsx)(pn,{variant:vn(O.phase),children:O.phase?.replaceAll(`_`,` `)??`Ready`})]}),(0,I.jsxs)(`div`,{className:`px-6 py-5 flex flex-col gap-4`,children:[(0,I.jsx)(Sn,{job:O}),(0,I.jsxs)(`label`,{className:`flex flex-col gap-1.5 text-[12.5px] font-medium text-slate-700`,children:[`Run mode`,(0,I.jsxs)(`select`,{value:me,onChange:e=>he(e.target.value),disabled:r||O.running,className:`px-3 py-2 rounded-lg border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30 disabled:opacity-50`,children:[(0,I.jsx)(`option`,{value:`dry`,children:`Dry preview · no HubSpot changes`}),(0,I.jsx)(`option`,{value:`real`,children:`Real migration`})]})]}),me===`real`&&(0,I.jsxs)(`div`,{className:`p-4 bg-orange-50 border border-orange-200 rounded-xl text-[12.5px] text-orange-900`,children:[(0,I.jsx)(`p`,{className:`font-semibold mb-2`,children:`Mapped values may be replaced. This writes to the destination HubSpot account.`}),(0,I.jsxs)(`label`,{className:`flex flex-col gap-1.5 font-medium`,children:[`Type RUN FOR REAL`,(0,I.jsx)(`input`,{value:ge,onChange:e=>_e(e.target.value),placeholder:`RUN FOR REAL`,autoComplete:`off`,className:`px-3 py-2 rounded-lg border border-orange-200 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-orange-300`})]})]}),(0,I.jsxs)(`div`,{className:`flex items-center gap-3 flex-wrap`,children:[(0,I.jsxs)(`button`,{type:`button`,onClick:Pe,disabled:r||O.running||!_||!h||me===`real`&&(!D||D.issueCount>0||se||ge!==`RUN FOR REAL`),className:`flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff7a59] text-white text-[13px] font-semibold hover:bg-[#e26746] transition disabled:opacity-50 cursor-pointer`,children:[(0,I.jsx)(De,{className:`w-4 h-4`}),me===`real`?`Run migration`:`Run dry preview`]}),O.running&&(0,I.jsxs)(`button`,{type:`button`,onClick:Fe,disabled:O.cancelRequested,className:`flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 text-white text-[13px] font-semibold hover:bg-red-600 transition disabled:opacity-50 cursor-pointer`,children:[(0,I.jsx)(ze,{className:`w-4 h-4`}),`Stop run`]}),!O.running&&O.phase!==`idle`&&(0,I.jsxs)(`button`,{type:`button`,onClick:Ie,className:`flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition cursor-pointer`,children:[(0,I.jsx)(je,{className:`w-4 h-4`}),`Reset run state`]})]}),(0,I.jsx)(`p`,{className:`text-[11.5px] text-slate-400`,children:me===`real`?`Requires a successful validation of the current mappings.`:`Dry previews validate records without writing to HubSpot.`}),(0,I.jsx)(fn,{value:Ve}),(0,I.jsxs)(`p`,{className:`text-[12px] text-slate-500 tabular-nums`,children:[O.completed??0,` / `,O.total??0,` processed · `,O.succeeded??0,` `,O.dryRun?`previewed`:`succeeded`,` · `,O.skipped??0,` reused · `,O.failed??0,` failed`]}),(0,I.jsxs)(`div`,{className:`flex gap-3 flex-wrap`,children:[O.report&&(0,I.jsxs)(`button`,{type:`button`,onClick:()=>N(()=>ut(hn(`report`),`hubspot-results-${mn}.csv`),`Preparing CSV…`),className:`flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-[12.5px] text-slate-700 hover:bg-slate-50 transition cursor-pointer`,children:[(0,I.jsx)(be,{className:`w-4 h-4`}),`Download results (CSV)`]}),(O.phase===`blocked`||O.review&&O.review.issueCount>0)&&(0,I.jsxs)(`button`,{type:`button`,onClick:()=>N(()=>ut(hn(`issues-report`),`validation-issues.csv`),`Preparing CSV…`),className:`flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-[12.5px] text-slate-700 hover:bg-slate-50 transition cursor-pointer`,children:[(0,I.jsx)(be,{className:`w-4 h-4`}),`Download validation issues (CSV)`]})]})]})]}),(0,I.jsxs)(`article`,{className:`bg-white border border-slate-200 rounded-2xl overflow-hidden`,children:[(0,I.jsxs)(`div`,{className:`px-6 py-4 border-b border-slate-100`,children:[(0,I.jsx)(`h2`,{className:`font-bold text-slate-800 text-[15px]`,children:`Live activity`}),(0,I.jsx)(`p`,{className:`text-[12px] text-slate-400 mt-0.5`,children:`Row results and migration progress`})]}),(0,I.jsx)(`div`,{className:`px-6 py-4`,children:(0,I.jsx)(dn,{logs:ye,emptyText:`Start a preview or migration to see activity.`})})]})]}),(0,I.jsxs)(`div`,{className:`flex items-center justify-between mt-6 pt-4 border-t border-slate-200`,children:[(0,I.jsx)(`button`,{type:`button`,onClick:()=>Oe(Math.max(0,t-1)),disabled:t===0||r,className:`px-4 py-2 rounded-lg border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition disabled:opacity-50 cursor-pointer`,children:`← Back`}),(0,I.jsx)(`span`,{className:`text-[12px] text-slate-400`,children:se?`Mappings have unsaved changes.`:_?`${_.rows.toLocaleString()} workbook rows`:`Choose a workbook to get started.`}),t<3&&(0,I.jsx)(`button`,{type:`button`,onClick:()=>Oe(Math.min(3,t+1)),disabled:r||!_||!h,className:`px-4 py-2 rounded-xl bg-[#ff7a59] text-white text-[13px] font-semibold hover:bg-[#e26746] transition disabled:opacity-50 cursor-pointer`,children:t===0?`Map columns →`:t===1?`Review & validate →`:`Run & monitor →`})]})]})}var wn=`/api/hubspot/associations`,Tn=e=>`${wn}/${e}`,En=[`Objects & files`,`Match columns`,`Review & validate`,`Run & monitor`];function Dn(e){return{idle:`neutral`,running:`info`,complete:`success`,failed:`error`,cancelled:`warning`,dry_run:`info`}[e]??`neutral`}function On(e){return{idle:`Idle`,running:`Running`,complete:`Complete`,failed:`Failed`,cancelled:`Cancelled`,dry_run:`Dry run`}[e]??e}function kn({title:e,icon:t,children:n,className:r=``}){return(0,I.jsxs)(`div`,{className:`bg-white border border-slate-200 rounded-2xl overflow-hidden ${r}`,children:[e&&(0,I.jsxs)(`div`,{className:`flex items-center gap-2 px-5 py-3.5 border-b border-slate-100 bg-slate-50`,children:[t&&(0,I.jsx)(`span`,{className:`text-[#ff7a59]`,children:t}),(0,I.jsx)(`span`,{className:`text-[13px] font-semibold text-slate-700`,children:e})]}),(0,I.jsx)(`div`,{className:`p-5`,children:n})]})}function An({children:e,required:t}){return(0,I.jsxs)(`label`,{className:`block text-[12px] font-semibold text-slate-600 mb-1.5`,children:[e,t&&(0,I.jsx)(`span`,{className:`text-[#ff7a59] ml-0.5`,children:`*`})]})}function jn({value:e,onChange:t,disabled:n,children:r,placeholder:i}){return(0,I.jsxs)(`div`,{className:`relative`,children:[(0,I.jsxs)(`select`,{value:e??``,onChange:e=>t(e.target.value),disabled:n,className:`w-full appearance-none border border-slate-200 rounded-xl px-3.5 py-2.5 text-[13px] text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30 focus:border-[#ff7a59] disabled:bg-slate-50 disabled:text-slate-400 pr-8`,children:[i&&(0,I.jsx)(`option`,{value:``,children:i}),r]}),(0,I.jsx)(oe,{size:14,className:`absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none`})]})}function Mn({children:e,onClick:t,disabled:n,variant:r=`primary`,size:i=`md`,icon:a,loading:o}){return(0,I.jsxs)(`button`,{onClick:t,disabled:n||o,className:`inline-flex items-center gap-1.5 font-semibold rounded-xl transition focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${{sm:`text-[11.5px] px-3 py-1.5`,md:`text-[12.5px] px-4 py-2`,lg:`text-[13px] px-5 py-2.5`}[i]} ${{primary:`bg-[#ff7a59] hover:bg-[#e56b4c] text-white focus:ring-[#ff7a59]`,secondary:`bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 focus:ring-slate-300`,danger:`bg-red-500 hover:bg-red-600 text-white focus:ring-red-400`,ghost:`bg-transparent hover:bg-slate-100 text-slate-600 focus:ring-slate-300`,success:`bg-emerald-500 hover:bg-emerald-600 text-white focus:ring-emerald-400`}[r]}`,children:[o?(0,I.jsx)(ke,{size:13,className:`animate-spin`}):a,e]})}function Nn({side:e,workbook:t,onUpload:n,busy:r}){let i=(0,T.useRef)(),[a,o]=(0,T.useState)(!1),s=async t=>{if(!t)return;let r=new FormData;r.append(`file`,t),await n(e,r)};return(0,I.jsxs)(`div`,{className:`border-2 border-dashed rounded-xl p-5 text-center transition cursor-pointer
        ${a?`border-[#ff7a59] bg-orange-50`:`border-slate-200 hover:border-[#ff7a59]/50 hover:bg-slate-50`}
        ${r?`opacity-60 pointer-events-none`:``}`,onDragOver:e=>{e.preventDefault(),o(!0)},onDragLeave:()=>o(!1),onDrop:e=>{e.preventDefault(),o(!1),s(e.dataTransfer.files[0])},onClick:()=>i.current?.click(),children:[(0,I.jsx)(`input`,{ref:i,type:`file`,accept:`.xlsx,.xls,.csv`,className:`hidden`,onChange:e=>s(e.target.files[0])}),t?(0,I.jsxs)(`div`,{className:`flex flex-col items-center gap-1`,children:[(0,I.jsx)(xe,{size:22,className:`text-[#ff7a59]`}),(0,I.jsx)(`p`,{className:`text-[12.5px] font-semibold text-slate-700 mt-1 truncate max-w-full`,children:t.filename}),(0,I.jsxs)(`p`,{className:`text-[11.5px] text-slate-400`,children:[t.rows?.toLocaleString(),` rows · `,t.columns?.length,` columns`]}),(0,I.jsx)(`span`,{className:`text-[11px] text-[#ff7a59] mt-1`,children:`Click to replace`})]}):(0,I.jsxs)(`div`,{className:`flex flex-col items-center gap-1`,children:[(0,I.jsx)(qe,{size:22,className:`text-slate-300`}),(0,I.jsx)(`p`,{className:`text-[12.5px] text-slate-500 mt-1`,children:`Drag & drop or click to upload`}),(0,I.jsx)(`p`,{className:`text-[11px] text-slate-400`,children:`.xlsx, .xls, .csv`})]})]})}function Pn({side:e,workbook:t,onSheetChange:n,busy:r}){return t?.sheets?.length?(0,I.jsxs)(`div`,{className:`mt-3`,children:[(0,I.jsx)(An,{children:`Sheet`}),(0,I.jsx)(jn,{value:t.sheet??``,onChange:t=>n(e,t),disabled:r,placeholder:`Select sheet…`,children:t.sheets.map(e=>(0,I.jsx)(`option`,{value:e,children:e},e))})]}):null}function Fn({data:e,caption:t}){return!e?.columns?.length&&!e?.rows?.length?null:(0,I.jsxs)(`div`,{className:`rounded-xl border border-slate-200 overflow-hidden text-[12px]`,children:[t&&(0,I.jsx)(`div`,{className:`px-4 py-2 bg-slate-50 border-b border-slate-100 text-[11.5px] font-semibold text-slate-600`,children:t}),(0,I.jsx)(`div`,{className:`overflow-x-auto`,children:(0,I.jsxs)(`table`,{className:`w-full`,children:[(0,I.jsx)(`thead`,{children:(0,I.jsx)(`tr`,{className:`bg-slate-50 border-b border-slate-100`,children:(e.columns??[]).map((e,t)=>(0,I.jsx)(`th`,{className:`px-3 py-2 text-left text-[11px] font-semibold text-slate-500 whitespace-nowrap`,children:e},t))})}),(0,I.jsx)(`tbody`,{children:(e.rows??[]).map((e,t)=>(0,I.jsx)(`tr`,{className:`border-b border-slate-50 last:border-0 hover:bg-slate-50/50`,children:(Array.isArray(e)?e:Object.values(e)).map((e,t)=>(0,I.jsx)(`td`,{className:`px-3 py-1.5 text-slate-700 whitespace-nowrap`,children:String(e??``)},t))},t))})]})})]})}function In({state:e,objects:t,onPickObject:n,onUpload:r,onSheetChange:i,onFetchLabels:a,onToggleLabel:o,busy:s}){let{sides:c,labels:l,selectedLabels:u}=e,d=e=>{let a=c[e];return(0,I.jsx)(`div`,{className:`flex flex-col gap-4`,children:(0,I.jsxs)(kn,{title:e===`left`?`Source Object (Left)`:`Target Object (Right)`,icon:(0,I.jsx)(Ee,{size:15}),children:[(0,I.jsx)(An,{required:!0,children:`Object type`}),(0,I.jsx)(jn,{value:a?.object?.objectTypeId??``,onChange:t=>n(e,t),disabled:s,placeholder:`Select object type…`,children:t.map(e=>(0,I.jsx)(`option`,{value:e.objectTypeId,children:e.label},e.objectTypeId))}),(0,I.jsxs)(`div`,{className:`mt-4`,children:[(0,I.jsx)(An,{required:!0,children:`Workbook file`}),(0,I.jsx)(Nn,{side:e,workbook:a?.workbook,onUpload:r,busy:s}),(0,I.jsx)(Pn,{side:e,workbook:a?.workbook,onSheetChange:i,busy:s})]})]})})};return(0,I.jsxs)(`div`,{className:`flex flex-col gap-5`,children:[(0,I.jsxs)(`div`,{className:`grid grid-cols-1 md:grid-cols-2 gap-4`,children:[d(`left`),d(`right`)]}),(0,I.jsxs)(kn,{title:`Association Labels`,icon:(0,I.jsx)(Ve,{size:15}),children:[(0,I.jsxs)(`div`,{className:`flex items-center justify-between mb-3`,children:[(0,I.jsx)(`p`,{className:`text-[12.5px] text-slate-500`,children:`Select which association label types to migrate.`}),(0,I.jsx)(Mn,{onClick:a,disabled:s||!c.left?.object||!c.right?.object,variant:`secondary`,size:`sm`,icon:(0,I.jsx)(ke,{size:12}),loading:s,children:`Get association labels`})]}),l.length===0?(0,I.jsx)(`div`,{className:`text-[12px] text-slate-400 italic py-2`,children:`Select both objects above, then click "Get association labels".`}):(0,I.jsx)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2`,children:l.map(e=>{let t=u.includes(e.key??e.name??e),n=e.key??e.name??e,r=e.label??e.name??e;return(0,I.jsxs)(`label`,{className:`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition text-[12.5px]
                    ${t?`border-[#ff7a59]/40 bg-orange-50 text-slate-700`:`border-slate-200 hover:border-slate-300 text-slate-600`}`,children:[(0,I.jsx)(`input`,{type:`checkbox`,checked:t,onChange:()=>o(n),className:`accent-[#ff7a59] w-3.5 h-3.5 shrink-0`}),(0,I.jsx)(`span`,{className:`truncate`,children:r}),e.category&&(0,I.jsx)(`span`,{className:`ml-auto text-[10.5px] text-slate-400 shrink-0`,children:e.category})]},n)})})]})]})}function Ln({state:e,onPickColumn:t,busy:n}){let{sides:r,columns:i}=e,a=r.left?.workbook?.columns??[],o=r.right?.workbook?.columns??[];return(0,I.jsx)(`div`,{className:`flex flex-col gap-5`,children:(0,I.jsxs)(kn,{title:`Match ID Columns`,icon:(0,I.jsx)(Fe,{size:15}),children:[(0,I.jsx)(`p`,{className:`text-[12.5px] text-slate-500 mb-5`,children:`Select the column in each workbook that contains the HubSpot record ID. These columns will be used to identify and link records during migration.`}),(0,I.jsxs)(`div`,{className:`grid grid-cols-1 md:grid-cols-2 gap-6`,children:[(0,I.jsxs)(`div`,{children:[(0,I.jsxs)(An,{required:!0,children:[`Left workbook ID column`,r.left?.workbook?.filename&&(0,I.jsxs)(`span`,{className:`font-normal text-slate-400 ml-1`,children:[`(`,r.left.workbook.filename,`)`]})]}),a.length===0?(0,I.jsx)(`p`,{className:`text-[12px] text-slate-400 italic`,children:`No workbook uploaded for left side.`}):(0,I.jsx)(jn,{value:i.left??``,onChange:e=>t(`left`,e),disabled:n,placeholder:`Select column…`,children:a.map(e=>(0,I.jsx)(`option`,{value:e.name,children:e.name},e.name))})]}),(0,I.jsxs)(`div`,{children:[(0,I.jsxs)(An,{required:!0,children:[`Right workbook ID column`,r.right?.workbook?.filename&&(0,I.jsxs)(`span`,{className:`font-normal text-slate-400 ml-1`,children:[`(`,r.right.workbook.filename,`)`]})]}),o.length===0?(0,I.jsx)(`p`,{className:`text-[12px] text-slate-400 italic`,children:`No workbook uploaded for right side.`}):(0,I.jsx)(jn,{value:i.right??``,onChange:e=>t(`right`,e),disabled:n,placeholder:`Select column…`,children:o.map(e=>(0,I.jsx)(`option`,{value:e.name,children:e.name},e.name))})]})]}),i.left&&a.length>0&&(0,I.jsxs)(`div`,{className:`mt-5 flex flex-col gap-3`,children:[(0,I.jsx)(`p`,{className:`text-[12px] font-semibold text-slate-500`,children:`Column preview`}),(0,I.jsxs)(`div`,{className:`grid grid-cols-1 md:grid-cols-2 gap-3`,children:[(0,I.jsxs)(`div`,{className:`rounded-xl bg-slate-50 border border-slate-100 p-3`,children:[(0,I.jsxs)(`div`,{className:`text-[11px] font-semibold text-slate-500 mb-1`,children:[`Left · `,i.left]}),(0,I.jsx)(`div`,{className:`flex flex-col gap-0.5`,children:(r.left?.workbook?.columns?.find(e=>e.name===i.left)?.sample??[]).slice(0,5).map((e,t)=>(0,I.jsx)(`span`,{className:`text-[11.5px] text-slate-600 font-mono`,children:String(e)},t))})]}),i.right&&(0,I.jsxs)(`div`,{className:`rounded-xl bg-slate-50 border border-slate-100 p-3`,children:[(0,I.jsxs)(`div`,{className:`text-[11px] font-semibold text-slate-500 mb-1`,children:[`Right · `,i.right]}),(0,I.jsx)(`div`,{className:`flex flex-col gap-0.5`,children:(r.right?.workbook?.columns?.find(e=>e.name===i.right)?.sample??[]).slice(0,5).map((e,t)=>(0,I.jsx)(`span`,{className:`text-[11.5px] text-slate-600 font-mono`,children:String(e)},t))})]})]})]})]})})}function Rn({state:e,onRunPreflight:t,busy:n}){let{validation:r}=e,i=({label:e,value:t,color:n})=>(0,I.jsxs)(`div`,{className:`rounded-xl border p-4 text-center ${n}`,children:[(0,I.jsx)(`div`,{className:`text-2xl font-bold`,children:t?.toLocaleString()??`—`}),(0,I.jsx)(`div`,{className:`text-[11.5px] mt-1 opacity-70`,children:e})]});return(0,I.jsxs)(`div`,{className:`flex flex-col gap-5`,children:[(0,I.jsxs)(`div`,{className:`flex items-center justify-between`,children:[(0,I.jsxs)(`div`,{children:[(0,I.jsx)(`h3`,{className:`text-[14px] font-semibold text-slate-700`,children:`Preflight Validation`}),(0,I.jsx)(`p`,{className:`text-[12px] text-slate-500 mt-0.5`,children:`Validate the data before running the migration.`})]}),(0,I.jsx)(Mn,{onClick:t,disabled:n,variant:`primary`,icon:(0,I.jsx)(De,{size:13}),loading:n,children:`Run preflight`})]}),!r&&!n&&(0,I.jsxs)(`div`,{className:`bg-slate-50 border border-slate-200 rounded-2xl p-10 text-center`,children:[(0,I.jsx)(A,{size:32,className:`mx-auto text-slate-300 mb-3`}),(0,I.jsx)(`p`,{className:`text-[13px] text-slate-500`,children:`Click "Run preflight" to validate your data.`})]}),n&&(0,I.jsxs)(`div`,{className:`bg-orange-50 border border-orange-100 rounded-2xl p-8 text-center`,children:[(0,I.jsx)(ke,{size:28,className:`mx-auto text-[#ff7a59] animate-spin mb-3`}),(0,I.jsx)(`p`,{className:`text-[13px] text-slate-600`,children:`Running preflight validation…`})]}),r&&!n&&(0,I.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,I.jsxs)(`div`,{className:`grid grid-cols-2 md:grid-cols-4 gap-3`,children:[(0,I.jsx)(i,{label:`Source records`,value:r.sourceRecords,color:`border-slate-200 text-slate-700`}),(0,I.jsx)(i,{label:`Target records`,value:r.targetRecords,color:`border-slate-200 text-slate-700`}),(0,I.jsx)(i,{label:`Pairs to create`,value:r.pairs,color:`border-emerald-100 text-emerald-700`}),(0,I.jsx)(i,{label:`Pairs to remove`,value:r.remove,color:`border-red-100 text-red-700`})]}),r.issues?.length>0&&(0,I.jsx)(kn,{title:`Issues`,icon:(0,I.jsx)(Ge,{size:15}),children:(0,I.jsx)(`div`,{className:`flex flex-col gap-2`,children:r.issues.map((e,t)=>(0,I.jsxs)(`div`,{className:`flex items-start gap-2.5 p-3 rounded-xl text-[12px]
                    ${e.level===`error`?`bg-red-50 border border-red-100 text-red-800`:`bg-amber-50 border border-amber-100 text-amber-800`}`,children:[e.level===`error`?(0,I.jsx)(_e,{size:14,className:`mt-0.5 shrink-0`}):(0,I.jsx)(Ge,{size:14,className:`mt-0.5 shrink-0`}),(0,I.jsx)(`span`,{children:e.message??String(e)})]},t))})}),r.issues?.length===0&&(0,I.jsxs)(`div`,{className:`flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-[12.5px]`,children:[(0,I.jsx)(pe,{size:16,className:`shrink-0`}),`No issues found — data looks clean.`]}),r.pairPreview&&(0,I.jsx)(kn,{title:`Pair preview (sample)`,icon:(0,I.jsx)(A,{size:15}),children:(0,I.jsx)(Fn,{data:r.pairPreview})}),r.removePreview&&(0,I.jsx)(kn,{title:`Pairs to remove (sample)`,icon:(0,I.jsx)(A,{size:15}),children:(0,I.jsx)(Fn,{data:r.removePreview})})]})]})}function zn({state:e,onRun:t,onCancel:n,onDownloadReport:r,onDownloadBackup:i,onRestore:a,busy:o}){let{status:s,validation:c,backup:l}=e,[u,d]=(0,T.useState)(!0),[f,p]=(0,T.useState)(``),[m,h]=(0,T.useState)(``),[g,_]=(0,T.useState)(!1),v=f.trim().toUpperCase()===`RUN FOR REAL`,y=s?.running;return(0,I.jsxs)(`div`,{className:`flex flex-col gap-5`,children:[!y&&(0,I.jsxs)(kn,{title:`Run mode`,icon:(0,I.jsx)(Fe,{size:15}),children:[(0,I.jsxs)(`div`,{className:`grid grid-cols-1 md:grid-cols-2 gap-3`,children:[(0,I.jsxs)(`label`,{className:`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition
              ${u?`border-[#ff7a59]/40 bg-orange-50`:`border-slate-200 hover:border-slate-300`}`,children:[(0,I.jsx)(`input`,{type:`radio`,name:`runMode`,checked:u,onChange:()=>d(!0),className:`mt-0.5 accent-[#ff7a59]`}),(0,I.jsxs)(`div`,{children:[(0,I.jsx)(`div`,{className:`text-[13px] font-semibold text-slate-700`,children:`Dry run`}),(0,I.jsx)(`div`,{className:`text-[12px] text-slate-500 mt-0.5`,children:`Simulate the migration without making any changes in HubSpot.`})]})]}),(0,I.jsxs)(`label`,{className:`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition
              ${u?`border-slate-200 hover:border-slate-300`:`border-red-300 bg-red-50`}`,children:[(0,I.jsx)(`input`,{type:`radio`,name:`runMode`,checked:!u,onChange:()=>d(!1),className:`mt-0.5 accent-red-500`}),(0,I.jsxs)(`div`,{children:[(0,I.jsx)(`div`,{className:`text-[13px] font-semibold text-slate-700`,children:`Run for real`}),(0,I.jsx)(`div`,{className:`text-[12px] text-slate-500 mt-0.5`,children:`Apply association changes to HubSpot. This cannot be undone without a restore.`})]})]})]}),!u&&(0,I.jsxs)(`div`,{className:`mt-4 p-4 rounded-xl bg-red-50 border border-red-200`,children:[(0,I.jsxs)(`p`,{className:`text-[12.5px] text-red-700 font-semibold mb-2 flex items-center gap-1.5`,children:[(0,I.jsx)(Ge,{size:14}),` Type `,(0,I.jsx)(`span`,{className:`font-mono bg-red-100 px-1.5 py-0.5 rounded`,children:`RUN FOR REAL`}),` to confirm`]}),(0,I.jsx)(`input`,{type:`text`,value:f,onChange:e=>p(e.target.value),placeholder:`RUN FOR REAL`,className:`w-full border border-red-200 rounded-xl px-3.5 py-2 text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 bg-white`})]}),(0,I.jsx)(`div`,{className:`flex items-center gap-3 mt-4`,children:(0,I.jsx)(Mn,{onClick:()=>{t({dryRun:u,confirmation:u?void 0:f,validationId:c?.validationId}),p(``)},disabled:o||!u&&!v,variant:u?`secondary`:`danger`,icon:(0,I.jsx)(De,{size:13}),loading:o&&!y,children:u?`Start dry run`:`Run for real`})})]}),s&&s.phase!==`idle`&&(0,I.jsxs)(kn,{title:`Job status`,icon:(0,I.jsx)(ke,{size:15,className:y?`animate-spin`:``}),children:[(0,I.jsxs)(`div`,{className:`flex items-center justify-between mb-3`,children:[(0,I.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,I.jsx)(pn,{variant:Dn(s.phase),children:On(s.phase)}),s.dryRun&&(0,I.jsx)(pn,{variant:`neutral`,children:`Dry run`})]}),(0,I.jsxs)(`div`,{className:`flex items-center gap-2`,children:[y&&(0,I.jsx)(Mn,{onClick:n,variant:`secondary`,size:`sm`,icon:(0,I.jsx)(ze,{size:12}),children:`Cancel`}),(s.phase===`complete`||s.phase===`failed`)&&(0,I.jsx)(Mn,{onClick:r,variant:`secondary`,size:`sm`,icon:(0,I.jsx)(be,{size:12}),children:`Download report`})]})]}),typeof s.progress==`number`&&(0,I.jsxs)(`div`,{className:`mb-3`,children:[(0,I.jsxs)(`div`,{className:`flex justify-between text-[11.5px] text-slate-500 mb-1`,children:[(0,I.jsx)(`span`,{children:s.message??`Processing…`}),(0,I.jsxs)(`span`,{children:[s.progress,`%`]})]}),(0,I.jsx)(fn,{value:s.progress})]}),s.stats&&(0,I.jsx)(`div`,{className:`grid grid-cols-3 gap-2 mb-3`,children:Object.entries(s.stats).map(([e,t])=>(0,I.jsxs)(`div`,{className:`rounded-xl bg-slate-50 border border-slate-100 p-2.5 text-center`,children:[(0,I.jsx)(`div`,{className:`text-[15px] font-bold text-slate-700`,children:typeof t==`number`?t.toLocaleString():t}),(0,I.jsx)(`div`,{className:`text-[10.5px] text-slate-400 mt-0.5 capitalize`,children:e.replace(/_/g,` `)})]},e))})]}),(0,I.jsx)(kn,{title:`Activity log`,icon:(0,I.jsx)(we,{size:15}),children:(0,I.jsx)(dn,{logs:s?.logs??[],emptyText:`No activity yet. Start a run to see live progress.`})}),l&&(0,I.jsx)(kn,{title:`Backup`,icon:(0,I.jsx)(je,{size:15}),children:(0,I.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,I.jsxs)(`div`,{className:`flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200`,children:[(0,I.jsxs)(`div`,{children:[(0,I.jsx)(`div`,{className:`text-[12.5px] font-semibold text-slate-700`,children:`Association backup`}),(0,I.jsxs)(`div`,{className:`text-[11.5px] text-slate-400 mt-0.5`,children:[l.recordCount?.toLocaleString()??`—`,` records · `,l.createdAt?new Date(l.createdAt).toLocaleString():`unknown date`]})]}),(0,I.jsx)(Mn,{onClick:i,variant:`secondary`,size:`sm`,icon:(0,I.jsx)(be,{size:12}),children:`Download JSON`})]}),(0,I.jsxs)(`div`,{className:`p-4 rounded-xl border border-amber-200 bg-amber-50`,children:[(0,I.jsxs)(`p`,{className:`text-[12.5px] text-amber-800 font-semibold mb-1 flex items-center gap-1.5`,children:[(0,I.jsx)(je,{size:13}),` Restore backup`]}),(0,I.jsxs)(`p`,{className:`text-[11.5px] text-amber-700 mb-2`,children:[`This will restore associations from the backup file. Type `,(0,I.jsx)(`span`,{className:`font-mono bg-amber-100 px-1 rounded`,children:`RESTORE BACKUP`}),` to confirm.`]}),(0,I.jsxs)(`div`,{className:`flex gap-2`,children:[(0,I.jsx)(`input`,{type:`text`,value:m,onChange:e=>h(e.target.value),placeholder:`RESTORE BACKUP`,className:`flex-1 border border-amber-200 rounded-xl px-3 py-2 text-[12.5px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white`}),(0,I.jsx)(Mn,{onClick:async()=>{if(m.trim().toUpperCase()===`RESTORE BACKUP`){_(!0);try{await a(m)}finally{_(!1),h(``)}}},disabled:m.trim().toUpperCase()!==`RESTORE BACKUP`||g,variant:`secondary`,size:`sm`,loading:g,icon:(0,I.jsx)(je,{size:12}),children:`Restore`})]})]})]})})]})}function Bn({onShowToast:e}){let t=(0,T.useRef)(null),[n,r]=(0,T.useState)({step:0,busy:!1,loaded:!1,objects:[],sides:{left:null,right:null},labels:[],selectedLabels:[],columns:{left:``,right:``},validation:null,backup:null,dirty:!1,status:{running:!1,phase:`idle`,logs:[]}}),i=(0,T.useCallback)((e,t={})=>{e&&r(n=>({...n,sides:e.sides??n.sides,labels:e.labels??n.labels,selectedLabels:e.selectedLabels??n.selectedLabels,columns:e.columns??n.columns,validation:e.validation??n.validation,backup:e.backup??n.backup,status:e.status??n.status,...t}))},[]);(0,T.useEffect)(()=>{let t=!1;return(async()=>{try{let[e,n]=await Promise.all([L(Tn(`state`),`GET`),L(`/api/hubspot/objects`,`GET`)]);if(t)return;r(t=>({...t,loaded:!0,objects:n?.objects??[],sides:e?.sides??t.sides,labels:e?.labels??[],selectedLabels:e?.selectedLabels??[],columns:e?.columns??t.columns,validation:e?.validation??null,backup:e?.backup??null,status:e?.status??t.status}))}catch(n){t||(e?.(`Failed to load state: `+(n?.message??`Unknown error`),`error`),r(e=>({...e,loaded:!0})))}})(),()=>{t=!0}},[i,e]),(0,T.useEffect)(()=>(n.status?.running?t.current=setInterval(async()=>{try{let e=await L(Tn(`status`),`GET`);r(t=>({...t,status:e??t.status})),e?.running||clearInterval(t.current)}catch{}},2e3):clearInterval(t.current),()=>clearInterval(t.current)),[n.status?.running]);let a=(0,T.useCallback)(async(t,n)=>{r(e=>({...e,busy:!0}));try{await t()}catch(t){e?.(n+`: `+(t?.message??`Unknown error`),`error`)}finally{r(e=>({...e,busy:!1}))}},[e]),o=(0,T.useCallback)((e,t)=>{a(async()=>{let n=await L(Tn(`object/${e}`),`PUT`,{objectTypeId:t});i(n)},`Failed to set ${e} object`)},[a,i]),s=(0,T.useCallback)((e,t)=>{a(async()=>{let n=await L(Tn(`workbook/${e}`),`POST`,t);i(n)},`Failed to upload ${e} workbook`)},[a,i]),c=(0,T.useCallback)((e,t)=>{a(async()=>{let n=await L(Tn(`sheet/${e}`),`POST`,{sheet:t});i(n)},`Failed to set ${e} sheet`)},[a,i]),l=(0,T.useCallback)(()=>{a(async()=>{let e=await L(Tn(`labels`),`POST`);i(e)},`Failed to fetch association labels`)},[a,i]),u=(0,T.useCallback)(e=>{r(t=>{let n=t.selectedLabels.includes(e)?t.selectedLabels.filter(t=>t!==e):[...t.selectedLabels,e];return L(Tn(`labels`),`PUT`,{keys:n}).catch(()=>{}),{...t,selectedLabels:n}})},[]),d=(0,T.useCallback)((e,t)=>{r(n=>{let r={...n.columns,[e]:t};return L(Tn(`columns`),`PUT`,{left:r.left,right:r.right}).catch(()=>{}),{...n,columns:r}})},[]),f=(0,T.useCallback)(()=>{a(async()=>{let t=await L(Tn(`preflight`),`POST`);i(t),t?.validation?.issues?.length===0&&e?.(`Preflight passed — no issues found.`,`success`)},`Preflight failed`)},[a,i,e]),p=(0,T.useCallback)(({dryRun:e,confirmation:t,validationId:n})=>{a(async()=>{let i=await L(Tn(`run`),`POST`,{dryRun:e,confirmation:t,validationId:n});r(e=>({...e,status:i??e.status}))},`Failed to start run`)},[a]),m=(0,T.useCallback)(()=>{a(async()=>{let t=await L(Tn(`cancel`),`POST`);r(e=>({...e,status:t??e.status})),e?.(`Job cancelled.`,`warning`)},`Failed to cancel job`)},[a,e]),h=(0,T.useCallback)(()=>{ut(Tn(`report`),`association-migration-report.json`)},[]),g=(0,T.useCallback)(()=>{ut(Tn(`backup`),`association-backup.json`)},[]),_=(0,T.useCallback)(async t=>{let n=await L(Tn(`restore`),`POST`,{confirmation:t});r(e=>({...e,status:n??e.status})),e?.(`Restore initiated.`,`success`)},[e]),v=(0,T.useCallback)(e=>{let{sides:t,columns:r,validation:i}=n;return e===0?!!(t.left?.object&&t.right?.object&&t.left?.workbook&&t.right?.workbook):e===1?!!(r.left&&r.right):e!==2||!!i},[n]),y=(0,T.useCallback)(e=>{(e<=n.step||v(e-1))&&r(t=>({...t,step:e}))},[n.step,v]),b=()=>r(e=>({...e,step:Math.min(e.step+1,En.length-1)})),x=()=>r(e=>({...e,step:Math.max(e.step-1,0)})),{step:S,busy:C,loaded:ee,objects:w,status:te}=n;return ee?(0,I.jsxs)(`div`,{className:`min-h-screen bg-slate-50`,children:[(0,I.jsx)(en,{show:C&&!n.status?.running,title:`Working…`,sub:`Please wait`}),(0,I.jsx)(`div`,{className:`bg-white border-b border-slate-200 px-6 py-5`,children:(0,I.jsxs)(`div`,{className:`max-w-5xl mx-auto flex items-center justify-between gap-4`,children:[(0,I.jsxs)(`div`,{className:`flex items-center gap-3`,children:[(0,I.jsx)(`div`,{className:`w-9 h-9 rounded-xl bg-[#ff7a59]/10 flex items-center justify-center`,children:(0,I.jsx)(Ee,{size:18,className:`text-[#ff7a59]`})}),(0,I.jsxs)(`div`,{children:[(0,I.jsx)(`h1`,{className:`text-[15px] font-bold text-slate-800`,children:`Association Migration`}),(0,I.jsx)(`p`,{className:`text-[12px] text-slate-500`,children:`Migrate HubSpot object associations in bulk`})]})]}),te&&te.phase!==`idle`&&(0,I.jsx)(pn,{variant:Dn(te.phase),children:On(te.phase)})]})}),(0,I.jsxs)(`div`,{className:`max-w-5xl mx-auto px-6 py-6 flex flex-col gap-6`,children:[(0,I.jsx)(ln,{steps:En,current:S,onSelect:y,canAdvance:v}),(()=>{switch(S){case 0:return(0,I.jsx)(In,{state:n,objects:w,onPickObject:o,onUpload:s,onSheetChange:c,onFetchLabels:l,onToggleLabel:u,busy:C});case 1:return(0,I.jsx)(Ln,{state:n,onPickColumn:d,busy:C});case 2:return(0,I.jsx)(Rn,{state:n,onRunPreflight:f,busy:C});case 3:return(0,I.jsx)(zn,{state:n,onRun:p,onCancel:m,onDownloadReport:h,onDownloadBackup:g,onRestore:_,busy:C});default:return null}})(),(0,I.jsxs)(`div`,{className:`flex items-center justify-between pt-2`,children:[(0,I.jsx)(Mn,{onClick:x,disabled:S===0||C,variant:`secondary`,children:`← Back`}),S<En.length-1&&(0,I.jsx)(Mn,{onClick:b,disabled:!v(S)||C,variant:`primary`,children:`Next →`})]})]})]}):(0,I.jsx)(en,{show:!0,title:`Loading…`,sub:`Fetching association migration state`})}function Vn(e,t){let[n,r]=(0,T.useState)(!1),i=(0,T.useRef)(null),a=(0,T.useRef)(t);return(0,T.useEffect)(()=>{a.current=t},[t]),(0,T.useEffect)(()=>{if(!e)return;function t(){let t=new EventSource(e);i.current=t,t.onopen=()=>r(!0),t.onerror=()=>r(!1),t.onmessage=e=>{try{a.current(JSON.parse(e.data))}catch{}}}return t(),()=>{i.current?.close()}},[e]),{isConnected:n}}var Hn=[`Choose workbook`,`Map columns`,`Review & validate`,`Run & monitor`],Un=[{value:`upsert`,label:`Upsert — create or update contacts`},{value:`attach_only`,label:`Attach only — skip contact upsert`}],Wn=[{value:`same_property`,label:`Same property — overwrite each upload`},{value:`numbered`,label:`Numbered — append index suffix`},{value:`note`,label:`Note — attach extra files as notes`},{value:`first_only`,label:`First only — ignore additional files`}];function Gn(e){if(!e||e<=0)return null;if(e<60)return`~${Math.round(e)}s remaining`;let t=Math.floor(e/60),n=Math.round(e%60);return e<3600?`~${t}m ${n}s remaining`:`~${Math.floor(e/3600)}h ${Math.floor(e%3600/60)}m remaining`}function Kn(e){if(!e)return null;let t=Math.round((Date.now()-new Date(e).getTime())/1e3);return t<60?`${t}s elapsed`:`${Math.floor(t/60)}m ${t%60}s elapsed`}function qn(e){return!e||e===`idle`?`neutral`:e===`complete`?`success`:e===`failed`?`error`:e===`dry_run`?`info`:`warning`}function Jn(e){return e===`email`?`info`:e===`file`?`warning`:`neutral`}function Yn(e){return e.hubspotProperty?`success`:`neutral`}function Xn({phase:e}){let t=[{id:`preflight`,label:`Preflight`},{id:`files`,label:`Files`},{id:`contacts`,label:`Contacts`},{id:`done`,label:`Done`}],n=n=>{if(e===`idle`)return`pending`;if(e===`failed`)return t.findIndex(e=>e.id===n)<t.findIndex(t=>t.id===e)?`done`:`pending`;if(e===`complete`)return`done`;let r={preflight:0,preflight_complete:1,dry_run:1,migration:2,complete:3}[e]??0,i={preflight:0,files:1,contacts:2,done:3}[n]??0;return i<r?`done`:i===r?`active`:`pending`};return(0,I.jsx)(`div`,{className:`flex items-center gap-2 mb-4 flex-wrap`,children:t.map((e,r)=>{let i=n(e.id);return(0,I.jsxs)(T.Fragment,{children:[(0,I.jsxs)(`span`,{className:`flex items-center gap-1.5 text-[11.5px] font-medium px-3 py-1.5 rounded-full
              ${i===`done`?`bg-emerald-50 text-emerald-700 border border-emerald-200`:i===`active`?`bg-orange-50 text-[#df6d50] border border-[#ff7a59]/30 animate-pulse`:`bg-slate-100 text-slate-400`}`,children:[i===`done`?`✓`:i===`active`?`◉`:`○`,e.label]}),r<t.length-1&&(0,I.jsx)(`span`,{className:`text-slate-200 text-[11px] select-none`,children:`→`})]},e.id)})})}function Zn({label:e,value:t,sub:n,icon:r,color:i=`slate`}){let a={slate:`bg-slate-50 border-slate-100 text-slate-700`,orange:`bg-orange-50 border-orange-100 text-[#df6d50]`,emerald:`bg-emerald-50 border-emerald-100 text-emerald-700`,blue:`bg-blue-50 border-blue-100 text-blue-700`,red:`bg-red-50 border-red-100 text-red-700`};return(0,I.jsxs)(`div`,{className:`p-4 rounded-xl border ${a[i]??a.slate}`,children:[(0,I.jsxs)(`div`,{className:`flex items-center gap-2 mb-1`,children:[r&&(0,I.jsx)(r,{className:`w-4 h-4 opacity-70`}),(0,I.jsx)(`span`,{className:`text-[11px] font-medium uppercase tracking-wide opacity-70`,children:e})]}),(0,I.jsx)(`div`,{className:`text-2xl font-black`,children:t??`—`}),n&&(0,I.jsx)(`div`,{className:`text-[11.5px] opacity-60 mt-0.5`,children:n})]})}function Qn({item:e,properties:t,onChange:n,disabled:r}){let[i,a]=(0,T.useState)(!1),o=(t,r)=>{n({...e,[t]:r})},s=e.samples?.filter(Boolean)??[];return(0,I.jsxs)(T.Fragment,{children:[(0,I.jsxs)(`tr`,{className:`hover:bg-slate-50 transition`,children:[(0,I.jsx)(`td`,{className:`px-5 py-3`,children:(0,I.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,I.jsx)(`span`,{className:`font-medium text-slate-800 text-[12.5px]`,children:e.excel}),(0,I.jsx)(pn,{variant:Jn(e.kind),children:e.kind})]})}),(0,I.jsx)(`td`,{className:`px-5 py-3 text-slate-400 text-[12px] max-w-[180px]`,children:s.length>0?(0,I.jsx)(`span`,{className:`truncate block`,children:s.slice(0,3).join(` · `)}):(0,I.jsx)(`span`,{className:`italic`,children:`—`})}),(0,I.jsx)(`td`,{className:`px-5 py-3`,children:(0,I.jsx)(pn,{variant:Yn(e),children:e.hubspotProperty?`mapped`:`ignored`})}),(0,I.jsxs)(`td`,{className:`px-5 py-3 min-w-[260px]`,children:[e.kind!==`email`&&(0,I.jsx)(un,{value:e.hubspotProperty??``,properties:t,filterFile:e.kind===`file`,onChange:e=>o(`hubspotProperty`,e),disabled:r,placeholder:`Ignore this column`,allowCreate:!0}),e.kind===`email`&&(0,I.jsx)(`span`,{className:`text-[12px] text-slate-400 italic`,children:`Email column (auto-matched)`})]}),(0,I.jsx)(`td`,{className:`px-5 py-3`,children:(0,I.jsxs)(`button`,{type:`button`,onClick:()=>a(e=>!e),disabled:e.kind===`email`,className:`flex items-center gap-1 text-[12px] text-slate-500 hover:text-slate-700 transition disabled:opacity-30 cursor-pointer`,children:[(0,I.jsx)(Le,{className:`w-3.5 h-3.5`}),`Configure`,i?(0,I.jsx)(le,{className:`w-3 h-3`}):(0,I.jsx)(oe,{className:`w-3 h-3`})]})})]}),i&&(0,I.jsx)(`tr`,{className:`bg-slate-50 border-b border-slate-100`,children:(0,I.jsxs)(`td`,{colSpan:5,className:`px-6 py-4`,children:[(0,I.jsxs)(`div`,{className:`grid grid-cols-2 md:grid-cols-4 gap-4 text-[12.5px]`,children:[(0,I.jsxs)(`label`,{className:`flex flex-col gap-1 font-medium text-slate-700`,children:[`Column kind`,(0,I.jsxs)(`select`,{value:e.kind??`contact`,onChange:e=>o(`kind`,e.target.value),disabled:r,className:`px-2.5 py-1.5 rounded-lg border border-slate-200 text-[12.5px] focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30 disabled:opacity-50`,children:[(0,I.jsx)(`option`,{value:`contact`,children:`Contact`}),(0,I.jsx)(`option`,{value:`file`,children:`File`})]})]}),(0,I.jsxs)(`label`,{className:`flex flex-col gap-1 font-medium text-slate-700`,children:[`Field type`,(0,I.jsxs)(`select`,{value:e.type??``,onChange:e=>o(`type`,e.target.value),disabled:r,className:`px-2.5 py-1.5 rounded-lg border border-slate-200 text-[12.5px] focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30 disabled:opacity-50`,children:[(0,I.jsx)(`option`,{value:``,children:`Auto detect`}),(0,I.jsx)(`option`,{value:`string`,children:`String`}),(0,I.jsx)(`option`,{value:`number`,children:`Number`}),(0,I.jsx)(`option`,{value:`bool`,children:`Boolean`}),(0,I.jsx)(`option`,{value:`date`,children:`Date`}),(0,I.jsx)(`option`,{value:`datetime`,children:`DateTime`}),(0,I.jsx)(`option`,{value:`enumeration`,children:`Enumeration`})]})]}),e.kind===`file`&&(0,I.jsxs)(`label`,{className:`flex flex-col gap-1 font-medium text-slate-700`,children:[`Multi-file strategy`,(0,I.jsx)(`select`,{value:e.multiFileStrategy??`same_property`,onChange:e=>o(`multiFileStrategy`,e.target.value),disabled:r,className:`px-2.5 py-1.5 rounded-lg border border-slate-200 text-[12.5px] focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30 disabled:opacity-50`,children:Wn.map(e=>(0,I.jsx)(`option`,{value:e.value,children:e.label},e.value))})]}),(0,I.jsxs)(`label`,{className:`flex items-center gap-2 font-medium text-slate-700 mt-5`,children:[(0,I.jsx)(`input`,{type:`checkbox`,checked:!!e.createIfMissing,onChange:e=>o(`createIfMissing`,e.target.checked),disabled:r,className:`w-4 h-4 accent-[#ff7a59]`}),`Create if missing`]})]}),e.type===`enumeration`&&(0,I.jsxs)(`div`,{className:`mt-4`,children:[(0,I.jsx)(`div`,{className:`text-[12px] font-medium text-slate-600 mb-2`,children:`Value translations`}),(0,I.jsxs)(`div`,{className:`text-[11.5px] text-slate-400 italic`,children:[`Enter JSON map, e.g. `,(0,I.jsx)(`code`,{className:`bg-slate-100 px-1 rounded`,children:`{ "Yes": "true", "No": "false" }`})]}),(0,I.jsx)(`textarea`,{value:e.valueMap?JSON.stringify(e.valueMap):``,onChange:e=>{try{o(`valueMap`,JSON.parse(e.target.value))}catch{}},disabled:r,rows:2,placeholder:`{}`,className:`mt-1.5 w-full px-3 py-2 rounded-lg border border-slate-200 text-[12px] font-mono focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30 disabled:opacity-50 resize-none`})]})]})})]})}function $n({onShowToast:e,initialStep:t=0,onStepChange:n}){let[r,i]=(0,T.useState)(t),[a,o]=(0,T.useState)(!1),[s,c]=(0,T.useState)(``),[l,u]=(0,T.useState)(``),[d,f]=(0,T.useState)(!1),[p,m]=(0,T.useState)(null),[h,g]=(0,T.useState)(null),[_,v]=(0,T.useState)(!1),[y,b]=(0,T.useState)(``),[x,S]=(0,T.useState)(!1),[C,ee]=(0,T.useState)(``),[w,te]=(0,T.useState)(``),[ne,re]=(0,T.useState)(``),[ie,E]=(0,T.useState)(`upsert`),[ae,oe]=(0,T.useState)(`same_property`),[se,ce]=(0,T.useState)(!1),[D,le]=(0,T.useState)([]),[ue,fe]=(0,T.useState)([]),[pe,me]=(0,T.useState)(`all`),[he,ge]=(0,T.useState)(``),[O,ye]=(0,T.useState)(!1),[k,A]=(0,T.useState)(null),[j,xe]=(0,T.useState)(!1),[Se,M]=(0,T.useState)(`dry`),[P,we]=(0,T.useState)(``),[Te,Ee]=(0,T.useState)(!1),[F,Oe]=(0,T.useState)({phase:`idle`,running:!1,dryRun:!1,total:0,completed:0,filesTotal:0,contactsTotal:0,contactsDone:0,batchesTotal:0,batchesSent:0,eta:null,startedAt:null,logs:[],summary:null,error:null,preflight:null}),[Ae,Me]=(0,T.useState)([]),Pe=(0,T.useRef)(F);Pe.current=F;let[Fe,Ie]=(0,T.useState)(``),Le=(0,T.useRef)(null),Re=(0,T.useCallback)((t,n=`info`)=>e?.(t,n),[e]),Be=(0,T.useCallback)(async(e,t=`Processing...`,n=``)=>{o(!0),c(t),u(n);try{await e()}catch(e){Re(e.message,`error`)}finally{o(!1),c(``),u(``)}},[Re]),Ve=(0,T.useCallback)(e=>{i(e),n?.(e)},[n]),He=(0,T.useCallback)(async()=>{let e=await L(`/api/config`);m(e),v(!!e.credentialsConfigured),g(e.workbookSummary??null),b(e.workbookError??``);let t=e.mapping??{};ee(t.emailColumn??``),te(t.nameColumn??``),re(t.sheet??``),E(t.contactMode??`upsert`),oe(t.numberedFallback??`same_property`),ce(!!t.noteSetFirst);let n=e.columns??t.columns??[],r=t.propertyMappings??[],i=n.map(t=>({excel:t.excel??t.name??t,kind:`file`,hubspotProperty:t.hubspotProperty??``,multiFileStrategy:t.multiFileStrategy??`same_property`,type:t.type??``,valueMap:t.valueMap??{},createIfMissing:!!t.createIfMissing,label:t.label??t.excel??``,samples:(e.previews??{})[t.excel??t]??[]})),a=[...r.map(n=>({excel:n.excel,kind:n.excel===t.emailColumn?`email`:`contact`,hubspotProperty:n.hubspotProperty??``,multiFileStrategy:``,type:n.type??``,fieldType:n.fieldType??``,valueMap:n.valueMap??{},createIfMissing:!!n.createIfMissing,label:n.label??n.excel,samples:(e.previews??{})[n.excel]??[]})),...i];return!a.some(e=>e.kind===`email`)&&t.emailColumn&&a.unshift({excel:t.emailColumn,kind:`email`,hubspotProperty:`email`,multiFileStrategy:``,type:`string`,valueMap:{},createIfMissing:!1,label:t.emailColumn,samples:(e.previews??{})[t.emailColumn]??[]}),le(a),e},[]),We=(0,T.useCallback)(async()=>{let e=await L(`/api/contact-mapping`);return fe(e.properties??[]),e.properties??[]},[]);(0,T.useEffect)(()=>{d||Be(async()=>{let e=await He();if(await We(),f(!0),e.savedProgress?.step!=null){let t=e.savedProgress.step;Ve(t)}try{let e=await L(`/api/status`);e&&e.phase&&e.phase!==`idle`&&(Je(e),(e.running||e.phase===`complete`||e.phase===`failed`)&&Ve(3))}catch{}},`Loading workspace…`,`Fetching config & HubSpot properties`)},[]),(0,T.useEffect)(()=>{if(!F.running||!F.startedAt){Ie(``);return}let e=setInterval(()=>{Ie(Kn(F.startedAt)??``)},1e3);return()=>clearInterval(e)},[F.running,F.startedAt]);let{isConnected:Ke}=Vn(`/api/progress`,(0,T.useCallback)(e=>{Je(e)},[]));function Je(e){Oe(t=>({...t,...e})),e.logs?.length&&Me(e.logs.map(e=>({...e,level:e.level??`info`})))}let Xe=(0,T.useCallback)(()=>{let e=D.filter(e=>e.kind===`file`),t=D.filter(e=>e.kind!==`file`&&e.kind!==`email`);return{...p??{},emailColumn:C,nameColumn:w,sheet:ne,contactMode:ie,noteSetFirst:se,numberedFallback:ae,columns:e.map(e=>({excel:e.excel,hubspotProperty:e.hubspotProperty,multiFileStrategy:e.multiFileStrategy})),propertyMappings:t.map(e=>({excel:e.excel,hubspotProperty:e.hubspotProperty,createIfMissing:e.createIfMissing,type:e.type,fieldType:e.fieldType,label:e.label,valueMap:e.valueMap}))}},[p,C,w,ne,ie,se,ae,D]),Qe=(0,T.useCallback)(async()=>{await L(`/api/config`,`PUT`,Xe()),ye(!1),Re(`Mappings saved.`,`success`)},[Xe,Re]),et=(0,T.useCallback)(async e=>{e&&(!/\.(csv|xlsx)$/i.test(e.name)||e.size>100*1024**2?Re(`Choose a CSV or XLSX file up to 100 MB.`,`error`):await Be(async()=>{let t=new FormData;t.append(`file`,e),await L(`/api/upload`,`POST`,t),await He(),Re(`Workbook uploaded successfully.`,`success`)},`Uploading workbook…`,`Parsing columns and building mapping`))},[Be,He,Re]),tt=(0,T.useCallback)(e=>{e.preventDefault(),S(!1);let t=e.dataTransfer.files[0];t&&et(t)},[et]),nt=(0,T.useCallback)(async()=>{xe(!0),A(null);try{let e=await L(`/api/preflight`,`POST`,{});A(e);let t=e.issues?.length??0;Re(t>0?`Preflight found ${t} issue(s).`:`Preflight passed. Ready to migrate.`,t>0?`error`:`success`)}catch(e){Re(e.message,`error`)}finally{xe(!1)}},[Re]),rt=(0,T.useCallback)(async()=>{await Be(async()=>{let e=await L(`/api/run`,`POST`,{dryRun:Se===`dry`,retryFailed:Te,confirmation:Se===`real`?P:void 0});we(``),Je(e)},Se===`real`?`Starting migration…`:`Starting dry run…`,`Initializing Monday → HubSpot pipeline`)},[Be,Se,Te,P]),it=(0,T.useCallback)(async()=>{try{await L(`/api/cancel`,`POST`,{}),Re(`Cancellation requested.`,`info`)}catch(e){Re(e.message,`error`)}},[Re]),at=(0,T.useCallback)((e,t)=>{le(n=>n.map((n,r)=>r===e?t:n)),ye(!0),A(null)},[]),ot={all:D.length,mapped:D.filter(e=>e.hubspotProperty).length,ignored:D.filter(e=>!e.hubspotProperty&&e.kind!==`email`).length,files:D.filter(e=>e.kind===`file`).length,issues:0},st=D.filter(e=>{let t=he.toLowerCase();return t&&!e.excel.toLowerCase().includes(t)?!1:pe===`mapped`?!!e.hubspotProperty:pe===`ignored`?!e.hubspotProperty&&e.kind!==`email`:pe===`files`?e.kind===`file`:pe!==`issues`}),ct={};(k?.issues??[]).forEach(e=>{e.column&&(ct[e.column]||(ct[e.column]=[]),ct[e.column].push(e))});let lt=F.total?Math.round((F.completed??0)/F.total*100):0,dt=!a&&!F.running&&!!h&&_&&(Se!==`real`||P===`RUN FOR REAL`),ft=D.filter(e=>!e.hubspotProperty&&e.kind!==`email`);D.filter(e=>!!e.hubspotProperty);let pt=D.filter(e=>e.createIfMissing&&e.hubspotProperty);return(0,I.jsxs)(`div`,{className:`py-6 px-8 max-w-5xl mx-auto`,children:[(0,I.jsx)(en,{show:a,title:s,sub:l}),(0,I.jsxs)(`div`,{className:`mb-1 text-[11px] text-slate-400 font-medium`,children:[`Monday.com / `,(0,I.jsx)(`span`,{className:`text-slate-600`,children:`Migration`})]}),(0,I.jsx)(`h1`,{className:`text-[1.9rem] font-black text-slate-900 leading-tight mb-1`,children:`Monday → HubSpot Migration`}),(0,I.jsx)(`p`,{className:`text-slate-500 text-[13px] mb-6`,children:`Map Monday.com workbook columns to HubSpot contact properties and run your migration.`}),(0,I.jsx)(ln,{steps:Hn,current:r,onSelect:e=>Ve(e),canAdvance:!!h&&_}),r===0&&(0,I.jsxs)(`div`,{className:`flex flex-col gap-5`,children:[!_&&(0,I.jsxs)(`div`,{className:`p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3`,children:[(0,I.jsx)(Ge,{className:`w-5 h-5 text-amber-500 mt-0.5 shrink-0`}),(0,I.jsxs)(`div`,{children:[(0,I.jsx)(`p`,{className:`font-semibold text-[13px] text-amber-900`,children:`Monday.com credentials not configured`}),(0,I.jsxs)(`p`,{className:`text-[12px] text-amber-700 mt-0.5`,children:[`Set `,(0,I.jsx)(`code`,{className:`bg-amber-100 px-1 rounded`,children:`MONDAY_API_KEY`}),` and`,` `,(0,I.jsx)(`code`,{className:`bg-amber-100 px-1 rounded`,children:`HUBSPOT_PRIVATE_APP_TOKEN`}),` in your`,` `,(0,I.jsx)(`code`,{className:`bg-amber-100 px-1 rounded`,children:`.env`}),` file, then restart the server.`]}),(0,I.jsx)(`div`,{className:`flex gap-2 mt-3 flex-wrap`,children:(0,I.jsxs)(`button`,{type:`button`,onClick:()=>Be(()=>L(`/api/reset-credentials`,`POST`,{}),`Rebinding credentials…`),disabled:a,className:`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-300 text-[12.5px] text-amber-800 hover:bg-amber-100 transition cursor-pointer disabled:opacity-50`,children:[(0,I.jsx)(ke,{className:`w-3.5 h-3.5`}),`Rebind credentials`]})})]})]}),(0,I.jsxs)(`div`,{className:`grid grid-cols-1 md:grid-cols-2 gap-5`,children:[(0,I.jsxs)(`article`,{className:`bg-white border border-slate-200 rounded-2xl overflow-hidden`,children:[(0,I.jsxs)(`div`,{className:`flex items-start justify-between px-6 py-4 border-b border-slate-100`,children:[(0,I.jsxs)(`div`,{children:[(0,I.jsx)(`h2`,{className:`font-bold text-slate-800 text-[15px]`,children:`Workbook`}),(0,I.jsx)(`p`,{className:`text-[12px] text-slate-400 mt-0.5`,children:`Upload your Monday.com export workbook.`})]}),(0,I.jsx)(pn,{variant:`neutral`,children:`CSV / XLSX`})]}),(0,I.jsxs)(`div`,{className:`px-6 py-4 flex flex-col gap-3`,children:[(0,I.jsxs)(`div`,{onDragOver:e=>{e.preventDefault(),S(!0)},onDragLeave:()=>S(!1),onDrop:tt,onClick:()=>Le.current?.click(),className:`flex flex-col items-center gap-3 p-6 border-2 border-dashed rounded-xl cursor-pointer transition
                    ${x?`border-[#ff7a59] bg-orange-50`:`border-slate-200 hover:border-[#ff7a59]/40 hover:bg-orange-50/30`}`,children:[(0,I.jsx)(qe,{className:`w-8 h-8 ${x?`text-[#ff7a59]`:`text-slate-300`}`}),(0,I.jsx)(`span`,{className:`font-semibold text-slate-700 text-[13px]`,children:x?`Drop to upload`:`Drag & drop or click to select`}),(0,I.jsx)(`span`,{className:`text-[11.5px] text-slate-400`,children:`CSV or XLSX · up to 100 MB`}),(0,I.jsx)(`input`,{ref:Le,type:`file`,accept:`.csv,.xlsx`,className:`sr-only`,onChange:e=>{let t=e.target.files?.[0];t&&et(t)}})]}),h&&(0,I.jsxs)(`div`,{className:`p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-[12px] text-emerald-800`,children:[(0,I.jsxs)(`div`,{className:`font-semibold mb-1 flex items-center gap-2`,children:[(0,I.jsx)(de,{className:`w-4 h-4`}),h.filename]}),(0,I.jsxs)(`div`,{className:`flex gap-3 flex-wrap text-emerald-700`,children:[(0,I.jsxs)(`span`,{children:[(h.contacts??0).toLocaleString(),` contacts`]}),(0,I.jsx)(`span`,{children:`·`}),(0,I.jsxs)(`span`,{children:[(h.files??0).toLocaleString(),` file refs`]}),(0,I.jsx)(`span`,{children:`·`}),(0,I.jsxs)(`span`,{children:[(h.columns??0).toLocaleString(),` columns`]})]}),h.alreadyUploaded&&(0,I.jsx)(`p`,{className:`text-[11.5px] text-emerald-600 mt-1`,children:`Previously uploaded — ready to map.`})]}),y&&(0,I.jsxs)(`div`,{className:`p-3 bg-red-50 border border-red-200 rounded-lg text-[12px] text-red-800`,children:[(0,I.jsxs)(`div`,{className:`font-semibold flex items-center gap-2 mb-1`,children:[(0,I.jsx)(_e,{className:`w-4 h-4`}),`Workbook error`]}),y]})]})]}),(0,I.jsxs)(`article`,{className:`bg-white border border-slate-200 rounded-2xl overflow-hidden`,children:[(0,I.jsxs)(`div`,{className:`px-6 py-4 border-b border-slate-100`,children:[(0,I.jsx)(`h2`,{className:`font-bold text-slate-800 text-[15px]`,children:`Migration settings`}),(0,I.jsx)(`p`,{className:`text-[12px] text-slate-400 mt-0.5`,children:`Configure how records are matched and created.`})]}),(0,I.jsxs)(`div`,{className:`px-6 py-4 flex flex-col gap-4`,children:[(0,I.jsxs)(`label`,{className:`flex flex-col gap-1.5 text-[12.5px] font-medium text-slate-700`,children:[`Contact mode`,(0,I.jsx)(`select`,{value:ie,onChange:e=>E(e.target.value),disabled:a,className:`px-3 py-2 rounded-lg border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30 disabled:opacity-50`,children:Un.map(e=>(0,I.jsx)(`option`,{value:e.value,children:e.label},e.value))})]}),(0,I.jsxs)(`label`,{className:`flex flex-col gap-1.5 text-[12.5px] font-medium text-slate-700`,children:[`Sheet name`,(0,I.jsx)(`input`,{type:`text`,value:ne,onChange:e=>re(e.target.value),placeholder:`Leave blank for first sheet`,disabled:a,className:`px-3 py-2 rounded-lg border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30 disabled:opacity-50`})]}),(0,I.jsxs)(`div`,{className:`grid grid-cols-2 gap-3`,children:[(0,I.jsxs)(`label`,{className:`flex flex-col gap-1.5 text-[12.5px] font-medium text-slate-700`,children:[`Email column`,(0,I.jsx)(`input`,{type:`text`,value:C,onChange:e=>ee(e.target.value),placeholder:`e.g. Email`,disabled:a,className:`px-3 py-2 rounded-lg border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30 disabled:opacity-50`})]}),(0,I.jsxs)(`label`,{className:`flex flex-col gap-1.5 text-[12.5px] font-medium text-slate-700`,children:[`Name column`,(0,I.jsx)(`input`,{type:`text`,value:w,onChange:e=>te(e.target.value),placeholder:`e.g. Full Name`,disabled:a,className:`px-3 py-2 rounded-lg border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30 disabled:opacity-50`})]})]}),(0,I.jsxs)(`label`,{className:`flex flex-col gap-1.5 text-[12.5px] font-medium text-slate-700`,children:[`Multi-file fallback`,(0,I.jsx)(`select`,{value:ae,onChange:e=>oe(e.target.value),disabled:a,className:`px-3 py-2 rounded-lg border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30 disabled:opacity-50`,children:Wn.map(e=>(0,I.jsx)(`option`,{value:e.value,children:e.label},e.value))})]}),(0,I.jsxs)(`label`,{className:`flex items-center gap-2 text-[12.5px] font-medium text-slate-700 cursor-pointer`,children:[(0,I.jsx)(`input`,{type:`checkbox`,checked:se,onChange:e=>ce(e.target.checked),disabled:a,className:`w-4 h-4 accent-[#ff7a59]`}),`Upload notes before files`]}),(0,I.jsxs)(`div`,{className:`flex gap-2 flex-wrap pt-2 border-t border-slate-100`,children:[(0,I.jsxs)(`button`,{type:`button`,onClick:()=>Be(()=>L(`/api/restart`,`POST`,{}),`Restarting…`),disabled:a,className:`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-[12px] text-slate-600 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50`,children:[(0,I.jsx)(je,{className:`w-3.5 h-3.5`}),`Restart app`]}),(0,I.jsxs)(`button`,{type:`button`,onClick:()=>Be(()=>L(`/api/reset-credentials`,`POST`,{}),`Rebinding credentials…`),disabled:a,className:`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-[12px] text-slate-600 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50`,children:[(0,I.jsx)(ke,{className:`w-3.5 h-3.5`}),`Rebind credentials`]})]})]})]})]})]}),r===1&&(0,I.jsxs)(`div`,{className:`flex flex-col gap-5`,children:[(0,I.jsxs)(`div`,{className:`bg-white border border-slate-200 rounded-2xl px-6 py-4 flex items-center justify-between flex-wrap gap-3`,children:[(0,I.jsxs)(`div`,{className:`flex items-center gap-4 text-[12.5px]`,children:[(0,I.jsxs)(`span`,{className:`text-slate-500`,children:[(0,I.jsx)(`strong`,{className:`text-slate-800`,children:ot.mapped}),` mapped`]}),(0,I.jsx)(`span`,{className:`text-slate-300`,children:`·`}),(0,I.jsxs)(`span`,{className:`text-slate-500`,children:[(0,I.jsx)(`strong`,{className:`text-slate-800`,children:ot.ignored}),` ignored`]}),(0,I.jsx)(`span`,{className:`text-slate-300`,children:`·`}),(0,I.jsxs)(`span`,{className:`text-slate-500`,children:[(0,I.jsx)(`strong`,{className:`text-slate-800`,children:ot.files}),` file columns`]}),O&&(0,I.jsx)(pn,{variant:`warning`,children:`Unsaved changes`})]}),(0,I.jsx)(`button`,{type:`button`,onClick:()=>Be(Qe,`Saving mappings…`),disabled:a||!O,className:`flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ff7a59] text-white text-[13px] font-semibold hover:bg-[#e26746] transition disabled:opacity-50 cursor-pointer`,children:`Save mappings`})]}),(0,I.jsxs)(`article`,{className:`bg-white border border-slate-200 rounded-2xl overflow-hidden`,children:[(0,I.jsxs)(`div`,{className:`flex items-center justify-between px-6 py-3 border-b border-slate-100 flex-wrap gap-3`,children:[(0,I.jsx)(`div`,{className:`flex items-center gap-1`,children:[`all`,`mapped`,`ignored`,`files`,`issues`].map(e=>(0,I.jsxs)(`button`,{type:`button`,onClick:()=>me(e),className:`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition cursor-pointer
                      ${pe===e?`bg-[#ff7a59]/10 text-[#df6d50]`:`text-slate-500 hover:bg-slate-100`}`,children:[e.charAt(0).toUpperCase()+e.slice(1),(0,I.jsx)(`span`,{className:`text-[11px] px-1.5 py-0.5 rounded-full font-semibold
                      ${pe===e?`bg-[#ff7a59]/20`:`bg-slate-100 text-slate-400`}`,children:ot[e]})]},e))}),(0,I.jsxs)(`div`,{className:`relative`,children:[(0,I.jsx)(Ne,{className:`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400`}),(0,I.jsx)(`input`,{type:`text`,value:he,onChange:e=>ge(e.target.value),placeholder:`Search columns…`,className:`pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-[12.5px] focus:outline-none focus:ring-2 focus:ring-[#ff7a59]/30 w-48`})]})]}),(0,I.jsx)(`div`,{className:`overflow-x-auto`,children:(0,I.jsxs)(`table`,{className:`w-full text-[12.5px]`,children:[(0,I.jsx)(`thead`,{className:`bg-slate-50 border-b border-slate-200`,children:(0,I.jsx)(`tr`,{children:[`Source column`,`Sample values`,`Status`,`HubSpot property`,``].map(e=>(0,I.jsx)(`th`,{className:`px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap`,children:e},e))})}),(0,I.jsxs)(`tbody`,{className:`divide-y divide-slate-100`,children:[st.length===0&&(0,I.jsx)(`tr`,{children:(0,I.jsx)(`td`,{colSpan:5,className:`px-5 py-10 text-center text-slate-400 italic text-[13px]`,children:`No columns match your filter.`})}),st.map(e=>{let t=D.findIndex(t=>t.excel===e.excel);return(0,I.jsx)(Qn,{item:e,properties:ue,onChange:e=>at(t,e),disabled:a},e.excel)})]})]})}),(0,I.jsxs)(`div`,{className:`px-6 py-4 border-t border-slate-100 flex items-center justify-between`,children:[(0,I.jsxs)(`p`,{className:`text-[12px] text-slate-400`,children:[st.length,` of `,D.length,` columns shown`]}),(0,I.jsx)(`button`,{type:`button`,onClick:()=>Be(Qe,`Saving mappings…`),disabled:a||!O,className:`px-4 py-2 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-50 cursor-pointer`,children:`Save mappings`})]})]})]}),r===2&&(0,I.jsxs)(`div`,{className:`flex flex-col gap-5`,children:[k&&(0,I.jsxs)(`div`,{className:`grid grid-cols-2 md:grid-cols-4 gap-4`,children:[(0,I.jsx)(Zn,{label:`Contacts`,value:(k.contacts??0).toLocaleString(),icon:Ye,color:`blue`}),(0,I.jsx)(Zn,{label:`Files`,value:(k.files??0).toLocaleString(),icon:N,color:`orange`}),(0,I.jsx)(Zn,{label:`Will be created`,value:(k.contactsToCreate??0).toLocaleString(),icon:de,color:`emerald`}),(0,I.jsx)(Zn,{label:`Will be updated`,value:(k.contactsToUpdate??0).toLocaleString(),icon:ke,color:`slate`})]}),(0,I.jsxs)(`article`,{className:`bg-white border border-slate-200 rounded-2xl overflow-hidden`,children:[(0,I.jsxs)(`div`,{className:`flex items-start justify-between px-6 py-4 border-b border-slate-100`,children:[(0,I.jsxs)(`div`,{children:[(0,I.jsx)(`h2`,{className:`font-bold text-slate-800 text-[15px]`,children:`Preflight check`}),(0,I.jsx)(`p`,{className:`text-[12px] text-slate-400 mt-0.5`,children:`Validate your mapping before running the migration.`})]}),(0,I.jsx)(`button`,{type:`button`,onClick:nt,disabled:a||j,className:`flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ff7a59] text-white text-[13px] font-semibold hover:bg-[#e26746] transition disabled:opacity-50 cursor-pointer`,children:j?(0,I.jsxs)(I.Fragment,{children:[(0,I.jsx)(ke,{className:`w-4 h-4 animate-spin`}),` Running preflight…`]}):(0,I.jsxs)(I.Fragment,{children:[(0,I.jsx)(De,{className:`w-4 h-4`}),` Run preflight`]})})]}),(0,I.jsxs)(`div`,{className:`px-6 py-5 flex flex-col gap-5`,children:[k?(0,I.jsxs)(`div`,{className:`p-4 rounded-xl border ${(k.issues?.length??0)>0?`bg-red-50 border-red-200`:`bg-emerald-50 border-emerald-200`}`,children:[(0,I.jsxs)(`div`,{className:`flex items-center gap-2 mb-2`,children:[(k.issues?.length??0)>0?(0,I.jsx)(_e,{className:`w-5 h-5 text-red-500`}):(0,I.jsx)(de,{className:`w-5 h-5 text-emerald-500`}),(0,I.jsx)(`p`,{className:`font-semibold text-[13px] ${(k.issues?.length??0)>0?`text-red-800`:`text-emerald-800`}`,children:(k.issues?.length??0)>0?`${k.issues.length} issue(s) found — review before migrating`:`All checks passed — ready to migrate`})]}),(k.issues?.length??0)>0&&(0,I.jsxs)(`ul`,{className:`text-[12px] text-red-700 list-disc ml-5 space-y-0.5 mt-2`,children:[k.issues.slice(0,20).map((e,t)=>(0,I.jsxs)(`li`,{children:[e.column&&(0,I.jsxs)(`strong`,{children:[`[`,e.column,`]`]}),e.row?` row ${e.row}: `:` `,e.error]},t)),k.issues.length>20&&(0,I.jsxs)(`li`,{children:[`…and `,(k.issues.length-20).toLocaleString(),` more.`]})]})]}):!j&&(0,I.jsx)(`p`,{className:`text-slate-400 italic text-[13px]`,children:`Click "Run preflight" to validate your mapping. Nothing is written to HubSpot.`}),k&&(0,I.jsxs)(`div`,{children:[(0,I.jsx)(`h3`,{className:`font-semibold text-slate-700 text-[13px] mb-3`,children:`Import plan`}),(0,I.jsx)(`div`,{className:`grid grid-cols-2 md:grid-cols-3 gap-3 text-[12.5px]`,children:[[`Contact mode`,Un.find(e=>e.value===ie)?.label??ie],[`Matching key`,C||`Email column`],[`File handling`,Wn.find(e=>e.value===ae)?.label??ae],[`New properties`,pt.length>0?`${pt.length} to create`:`None`],[`Total rows`,(k.rows??0).toLocaleString()]].map(([e,t])=>(0,I.jsxs)(`div`,{className:`p-3 bg-slate-50 rounded-xl border border-slate-100`,children:[(0,I.jsx)(`div`,{className:`text-[11px] text-slate-400 font-medium mb-0.5`,children:e}),(0,I.jsx)(`div`,{className:`font-semibold text-slate-800`,children:t})]},e))})]}),k&&(k.propertiesToCreate?.length??0)>0&&(0,I.jsxs)(`div`,{children:[(0,I.jsx)(`h3`,{className:`font-semibold text-slate-700 text-[13px] mb-2`,children:`Properties to create`}),(0,I.jsx)(`div`,{className:`flex flex-wrap gap-2`,children:k.propertiesToCreate.map(e=>(0,I.jsx)(`span`,{className:`px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[12px] font-medium`,children:e},e))})]}),ft.length>0&&(0,I.jsxs)(`div`,{children:[(0,I.jsxs)(`h3`,{className:`font-semibold text-slate-700 text-[13px] mb-2`,children:[`Ignored columns (`,ft.length,`)`]}),(0,I.jsx)(`div`,{className:`flex flex-wrap gap-2`,children:ft.map(e=>(0,I.jsx)(`span`,{className:`px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full text-[12px]`,children:e.excel},e.excel))})]}),k&&(k.issues?.length??0)===0&&(0,I.jsx)(`div`,{className:`flex justify-end`,children:(0,I.jsx)(`button`,{type:`button`,onClick:()=>Ve(3),className:`flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff7a59] text-white text-[13px] font-semibold hover:bg-[#e26746] transition cursor-pointer`,children:`Continue to migration →`})})]})]})]}),r===3&&(0,I.jsxs)(`div`,{className:`grid grid-cols-1 lg:grid-cols-2 gap-5`,children:[(0,I.jsxs)(`article`,{className:`bg-white border border-slate-200 rounded-2xl overflow-hidden`,children:[(0,I.jsxs)(`div`,{className:`flex items-start justify-between px-6 py-4 border-b border-slate-100`,children:[(0,I.jsxs)(`div`,{children:[(0,I.jsx)(`h2`,{className:`font-bold text-slate-800 text-[15px]`,children:`Run & monitor`}),(0,I.jsx)(`p`,{className:`text-[12px] text-slate-400 mt-0.5`,children:`Preview or run the migration into HubSpot.`})]}),(0,I.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,I.jsx)(`span`,{className:`w-2 h-2 rounded-full ${Ke?`bg-emerald-500`:`bg-slate-300`}`}),(0,I.jsx)(pn,{variant:qn(F.phase),children:F.phase?.replaceAll(`_`,` `)??`idle`})]})]}),(0,I.jsxs)(`div`,{className:`px-6 py-5 flex flex-col gap-4`,children:[(0,I.jsx)(Xn,{phase:F.phase}),(0,I.jsxs)(`div`,{children:[(0,I.jsx)(`p`,{className:`text-[12.5px] font-medium text-slate-700 mb-2`,children:`Run mode`}),(0,I.jsx)(`div`,{className:`flex gap-3`,children:[{value:`dry`,label:`Dry run`,sub:`No HubSpot changes`},{value:`real`,label:`Real migration`,sub:`Writes to HubSpot`}].map(e=>(0,I.jsxs)(`label`,{className:`flex-1 flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition
                        ${Se===e.value?`border-[#ff7a59] bg-orange-50/60`:`border-slate-200 hover:border-slate-300`}`,children:[(0,I.jsx)(`input`,{type:`radio`,name:`runMode`,value:e.value,checked:Se===e.value,onChange:()=>M(e.value),disabled:a||F.running,className:`mt-0.5 accent-[#ff7a59]`}),(0,I.jsxs)(`div`,{children:[(0,I.jsx)(`div`,{className:`font-semibold text-[12.5px] text-slate-800`,children:e.label}),(0,I.jsx)(`div`,{className:`text-[11.5px] text-slate-400`,children:e.sub})]})]},e.value))})]}),Se===`real`&&(0,I.jsxs)(`div`,{className:`p-4 bg-orange-50 border border-orange-200 rounded-xl text-[12.5px] text-orange-900`,children:[(0,I.jsxs)(`div`,{className:`flex items-center gap-2 font-semibold mb-2`,children:[(0,I.jsx)(Ge,{className:`w-4 h-4`}),`This will write to your HubSpot portal.`]}),(0,I.jsxs)(`label`,{className:`flex flex-col gap-1.5 font-medium`,children:[`Type `,(0,I.jsx)(`code`,{className:`font-mono bg-orange-100 px-1 rounded`,children:`RUN FOR REAL`}),` to confirm`,(0,I.jsx)(`input`,{value:P,onChange:e=>we(e.target.value),placeholder:`RUN FOR REAL`,autoComplete:`off`,disabled:a||F.running,className:`px-3 py-2 rounded-lg border border-orange-200 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50`})]})]}),(0,I.jsxs)(`label`,{className:`flex items-center gap-2 text-[12.5px] font-medium text-slate-700 cursor-pointer`,children:[(0,I.jsx)(`input`,{type:`checkbox`,checked:Te,onChange:e=>Ee(e.target.checked),disabled:a||F.running,className:`w-4 h-4 accent-[#ff7a59]`}),`Retry previously failed records`]}),(0,I.jsxs)(`div`,{className:`flex items-center gap-3 flex-wrap`,children:[(0,I.jsxs)(`button`,{type:`button`,onClick:rt,disabled:!dt,className:`flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff7a59] text-white text-[13px] font-semibold hover:bg-[#e26746] transition disabled:opacity-50 cursor-pointer`,children:[(0,I.jsx)(De,{className:`w-4 h-4`}),Se===`real`?`Run migration`:`Run dry run`]}),F.running&&(0,I.jsxs)(`button`,{type:`button`,onClick:it,className:`flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 text-white text-[13px] font-semibold hover:bg-red-600 transition cursor-pointer`,children:[(0,I.jsx)(ze,{className:`w-4 h-4`}),`Cancel`]})]}),(0,I.jsxs)(`div`,{className:`space-y-2`,children:[(0,I.jsx)(fn,{value:lt}),(0,I.jsxs)(`div`,{className:`flex items-center justify-between text-[12px] text-slate-500 tabular-nums`,children:[(0,I.jsxs)(`span`,{children:[lt,`% — `,(F.completed??0).toLocaleString(),` / `,(F.total??0).toLocaleString(),` records`]}),F.eta&&(0,I.jsx)(`span`,{children:Gn(F.eta)})]}),(F.filesTotal>0||F.contactsTotal>0)&&(0,I.jsxs)(`div`,{className:`flex gap-4 text-[12px] text-slate-400 flex-wrap`,children:[(0,I.jsxs)(`span`,{children:[(0,I.jsx)(Ce,{className:`w-3.5 h-3.5 inline mr-1`}),`Files: `,(F.filesTotal??0).toLocaleString()]}),(0,I.jsxs)(`span`,{children:[(0,I.jsx)(Ye,{className:`w-3.5 h-3.5 inline mr-1`}),`Contacts: `,(F.contactsDone??0).toLocaleString(),` / `,(F.contactsTotal??0).toLocaleString()]}),F.batchesTotal>0&&(0,I.jsxs)(`span`,{children:[`Batches: `,(F.batchesSent??0).toLocaleString(),` / `,(F.batchesTotal??0).toLocaleString()]})]}),(F.running||F.startedAt)&&(0,I.jsxs)(`div`,{className:`flex gap-3 text-[11.5px] text-slate-400`,children:[Fe&&(0,I.jsxs)(`span`,{className:`flex items-center gap-1`,children:[(0,I.jsx)(ve,{className:`w-3.5 h-3.5`}),Fe]}),F.currentOperation&&(0,I.jsx)(`span`,{className:`text-slate-500 italic`,children:F.currentOperation})]})]}),F.error&&(0,I.jsxs)(`div`,{className:`p-3 bg-red-50 border border-red-200 rounded-xl text-[12px] text-red-800`,children:[(0,I.jsxs)(`div`,{className:`font-semibold mb-1 flex items-center gap-2`,children:[(0,I.jsx)(_e,{className:`w-4 h-4`}),` Run error`]}),F.error]}),(0,I.jsxs)(`div`,{className:`flex gap-3 flex-wrap pt-2 border-t border-slate-100`,children:[(0,I.jsxs)(`button`,{type:`button`,onClick:()=>Be(()=>ut(`/api/report`,`monday-file-report.csv`),`Preparing CSV…`),disabled:a||![`complete`,`failed`].includes(F.phase),className:`flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-[12.5px] text-slate-700 hover:bg-slate-50 transition disabled:opacity-50 cursor-pointer`,children:[(0,I.jsx)(be,{className:`w-4 h-4`}),`File report`]}),(0,I.jsxs)(`button`,{type:`button`,onClick:()=>Be(()=>ut(`/api/contact-report`,`monday-contact-report.csv`),`Preparing CSV…`),disabled:a||![`complete`,`failed`].includes(F.phase),className:`flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-[12.5px] text-slate-700 hover:bg-slate-50 transition disabled:opacity-50 cursor-pointer`,children:[(0,I.jsx)(be,{className:`w-4 h-4`}),`Contact report`]})]})]})]}),(0,I.jsxs)(`article`,{className:`bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col`,children:[(0,I.jsxs)(`div`,{className:`flex items-center justify-between px-6 py-4 border-b border-slate-100`,children:[(0,I.jsxs)(`div`,{children:[(0,I.jsx)(`h2`,{className:`font-bold text-slate-800 text-[15px]`,children:`Activity log`}),(0,I.jsx)(`p`,{className:`text-[12px] text-slate-400 mt-0.5`,children:`Live stream from the migration pipeline.`})]}),(0,I.jsxs)(`div`,{className:`flex items-center gap-3`,children:[(0,I.jsxs)(`div`,{className:`flex items-center gap-1.5 text-[11.5px] text-slate-400`,children:[Ke?(0,I.jsx)($e,{className:`w-3.5 h-3.5 text-emerald-500`}):(0,I.jsx)(Ze,{className:`w-3.5 h-3.5 text-slate-300`}),Ke?`Live`:`Disconnected`]}),(0,I.jsxs)(`button`,{type:`button`,onClick:()=>Me([]),disabled:Ae.length===0,className:`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-[12px] text-slate-500 hover:bg-slate-50 transition disabled:opacity-40 cursor-pointer`,children:[(0,I.jsx)(Ue,{className:`w-3.5 h-3.5`}),`Clear`]})]})]}),(0,I.jsx)(`div`,{className:`px-6 py-4 flex-1 min-h-0`,children:(0,I.jsx)(dn,{logs:Ae,emptyText:`Start a dry run or migration to see live activity.`})})]})]}),(0,I.jsxs)(`div`,{className:`flex items-center justify-between mt-6 pt-4 border-t border-slate-200`,children:[(0,I.jsx)(`button`,{type:`button`,onClick:()=>Ve(Math.max(0,r-1)),disabled:r===0||a,className:`px-4 py-2 rounded-lg border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition disabled:opacity-50 cursor-pointer`,children:`← Back`}),(0,I.jsx)(`span`,{className:`text-[12px] text-slate-400`,children:O?`Mappings have unsaved changes.`:h?`${(h.contacts??0).toLocaleString()} contacts · ${h.columns??0} columns`:`Upload a workbook to get started.`}),r<3&&(0,I.jsx)(`button`,{type:`button`,onClick:async()=>{r===1&&O&&await Be(Qe,`Saving mappings…`),Ve(Math.min(3,r+1))},disabled:a||!h&&r===0,className:`px-4 py-2 rounded-xl bg-[#ff7a59] text-white text-[13px] font-semibold hover:bg-[#e26746] transition disabled:opacity-50 cursor-pointer`,children:r===0?`Map columns →`:r===1?`Review & validate →`:`Run & monitor →`})]})]})}function er(){let{showToast:e}=st(),[t,n]=(0,T.useState)(`dashboard`),[r,i]=(0,T.useState)(0),[a,o]=(0,T.useState)(!1);(0,T.useEffect)(()=>{let e=null;function t(){try{e=new EventSource(`/api/progress`),e.onopen=()=>o(!0),e.onerror=()=>o(!1)}catch{o(!1)}}t();let n=()=>{fetch(`/api/status`).then(e=>{e.ok&&o(!0)}).catch(()=>o(!1))};n();let r=setInterval(n,3e3);return()=>{e?.close(),clearInterval(r)}},[]);let s=(0,T.useCallback)(e=>{n(e)},[]),c=(0,T.useCallback)(e=>{n(`monday`),i(e)},[]);return(0,I.jsxs)(`div`,{className:`h-screen bg-slate-50 flex flex-col overflow-hidden`,children:[(0,I.jsx)(ct,{activeModule:t,isConnected:a}),(0,I.jsxs)(`div`,{className:`flex flex-1 min-h-0 overflow-hidden`,children:[(0,I.jsx)(lt,{activeModule:t,onSelectModule:s,mondayStep:r,onSelectMondayStep:c}),(0,I.jsx)(`main`,{className:`flex-1 min-h-0 overflow-y-auto bg-slate-50`,children:(()=>{switch(t){case`dashboard`:return(0,I.jsx)(cn,{onShowToast:e},t);case`data-migrate`:return(0,I.jsx)(Cn,{onShowToast:e},t);case`data-migrate-association`:return(0,I.jsx)(Bn,{onShowToast:e},t);case`monday`:return(0,I.jsx)($n,{onShowToast:e,initialStep:r,onStepChange:i},t);default:return(0,I.jsx)(cn,{onShowToast:e},t)}})()})]})]})}function tr(){return(0,I.jsx)(ot,{children:(0,I.jsx)(er,{})})}it.createRoot(document.getElementById(`root`)).render((0,I.jsx)(T.StrictMode,{children:(0,I.jsx)(tr,{})}));