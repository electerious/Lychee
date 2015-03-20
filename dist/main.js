/*! jQuery v2.1.3 | (c) 2005, 2014 jQuery Foundation, Inc. | jquery.org/license */
!function(a,b){"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){var c=[],d=c.slice,e=c.concat,f=c.push,g=c.indexOf,h={},i=h.toString,j=h.hasOwnProperty,k={},l=a.document,m="2.1.3",n=function(a,b){return new n.fn.init(a,b)},o=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,p=/^-ms-/,q=/-([\da-z])/gi,r=function(a,b){return b.toUpperCase()};n.fn=n.prototype={jquery:m,constructor:n,selector:"",length:0,toArray:function(){return d.call(this)},get:function(a){return null!=a?0>a?this[a+this.length]:this[a]:d.call(this)},pushStack:function(a){var b=n.merge(this.constructor(),a);return b.prevObject=this,b.context=this.context,b},each:function(a,b){return n.each(this,a,b)},map:function(a){return this.pushStack(n.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(d.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(0>a?b:0);return this.pushStack(c>=0&&b>c?[this[c]]:[])},end:function(){return this.prevObject||this.constructor(null)},push:f,sort:c.sort,splice:c.splice},n.extend=n.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||n.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(a=arguments[h]))for(b in a)c=g[b],d=a[b],g!==d&&(j&&d&&(n.isPlainObject(d)||(e=n.isArray(d)))?(e?(e=!1,f=c&&n.isArray(c)?c:[]):f=c&&n.isPlainObject(c)?c:{},g[b]=n.extend(j,f,d)):void 0!==d&&(g[b]=d));return g},n.extend({expando:"jQuery"+(m+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===n.type(a)},isArray:Array.isArray,isWindow:function(a){return null!=a&&a===a.window},isNumeric:function(a){return!n.isArray(a)&&a-parseFloat(a)+1>=0},isPlainObject:function(a){return"object"!==n.type(a)||a.nodeType||n.isWindow(a)?!1:a.constructor&&!j.call(a.constructor.prototype,"isPrototypeOf")?!1:!0},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?h[i.call(a)]||"object":typeof a},globalEval:function(a){var b,c=eval;a=n.trim(a),a&&(1===a.indexOf("use strict")?(b=l.createElement("script"),b.text=a,l.head.appendChild(b).parentNode.removeChild(b)):c(a))},camelCase:function(a){return a.replace(p,"ms-").replace(q,r)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b,c){var d,e=0,f=a.length,g=s(a);if(c){if(g){for(;f>e;e++)if(d=b.apply(a[e],c),d===!1)break}else for(e in a)if(d=b.apply(a[e],c),d===!1)break}else if(g){for(;f>e;e++)if(d=b.call(a[e],e,a[e]),d===!1)break}else for(e in a)if(d=b.call(a[e],e,a[e]),d===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(o,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(s(Object(a))?n.merge(c,"string"==typeof a?[a]:a):f.call(c,a)),c},inArray:function(a,b,c){return null==b?-1:g.call(b,a,c)},merge:function(a,b){for(var c=+b.length,d=0,e=a.length;c>d;d++)a[e++]=b[d];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;g>f;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,f=0,g=a.length,h=s(a),i=[];if(h)for(;g>f;f++)d=b(a[f],f,c),null!=d&&i.push(d);else for(f in a)d=b(a[f],f,c),null!=d&&i.push(d);return e.apply([],i)},guid:1,proxy:function(a,b){var c,e,f;return"string"==typeof b&&(c=a[b],b=a,a=c),n.isFunction(a)?(e=d.call(arguments,2),f=function(){return a.apply(b||this,e.concat(d.call(arguments)))},f.guid=a.guid=a.guid||n.guid++,f):void 0},now:Date.now,support:k}),n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(a,b){h["[object "+b+"]"]=b.toLowerCase()});function s(a){var b=a.length,c=n.type(a);return"function"===c||n.isWindow(a)?!1:1===a.nodeType&&b?!0:"array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a}var t=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+1*new Date,v=a.document,w=0,x=0,y=hb(),z=hb(),A=hb(),B=function(a,b){return a===b&&(l=!0),0},C=1<<31,D={}.hasOwnProperty,E=[],F=E.pop,G=E.push,H=E.push,I=E.slice,J=function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1},K="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",L="[\\x20\\t\\r\\n\\f]",M="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",N=M.replace("w","w#"),O="\\["+L+"*("+M+")(?:"+L+"*([*^$|!~]?=)"+L+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+N+"))|)"+L+"*\\]",P=":("+M+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+O+")*)|.*)\\)|)",Q=new RegExp(L+"+","g"),R=new RegExp("^"+L+"+|((?:^|[^\\\\])(?:\\\\.)*)"+L+"+$","g"),S=new RegExp("^"+L+"*,"+L+"*"),T=new RegExp("^"+L+"*([>+~]|"+L+")"+L+"*"),U=new RegExp("="+L+"*([^\\]'\"]*?)"+L+"*\\]","g"),V=new RegExp(P),W=new RegExp("^"+N+"$"),X={ID:new RegExp("^#("+M+")"),CLASS:new RegExp("^\\.("+M+")"),TAG:new RegExp("^("+M.replace("w","w*")+")"),ATTR:new RegExp("^"+O),PSEUDO:new RegExp("^"+P),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+L+"*(even|odd|(([+-]|)(\\d*)n|)"+L+"*(?:([+-]|)"+L+"*(\\d+)|))"+L+"*\\)|)","i"),bool:new RegExp("^(?:"+K+")$","i"),needsContext:new RegExp("^"+L+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+L+"*((?:-\\d)?\\d*)"+L+"*\\)|)(?=[^-]|$)","i")},Y=/^(?:input|select|textarea|button)$/i,Z=/^h\d$/i,$=/^[^{]+\{\s*\[native \w/,_=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,ab=/[+~]/,bb=/'|\\/g,cb=new RegExp("\\\\([\\da-f]{1,6}"+L+"?|("+L+")|.)","ig"),db=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:0>d?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},eb=function(){m()};try{H.apply(E=I.call(v.childNodes),v.childNodes),E[v.childNodes.length].nodeType}catch(fb){H={apply:E.length?function(a,b){G.apply(a,I.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function gb(a,b,d,e){var f,h,j,k,l,o,r,s,w,x;if((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,d=d||[],k=b.nodeType,"string"!=typeof a||!a||1!==k&&9!==k&&11!==k)return d;if(!e&&p){if(11!==k&&(f=_.exec(a)))if(j=f[1]){if(9===k){if(h=b.getElementById(j),!h||!h.parentNode)return d;if(h.id===j)return d.push(h),d}else if(b.ownerDocument&&(h=b.ownerDocument.getElementById(j))&&t(b,h)&&h.id===j)return d.push(h),d}else{if(f[2])return H.apply(d,b.getElementsByTagName(a)),d;if((j=f[3])&&c.getElementsByClassName)return H.apply(d,b.getElementsByClassName(j)),d}if(c.qsa&&(!q||!q.test(a))){if(s=r=u,w=b,x=1!==k&&a,1===k&&"object"!==b.nodeName.toLowerCase()){o=g(a),(r=b.getAttribute("id"))?s=r.replace(bb,"\\$&"):b.setAttribute("id",s),s="[id='"+s+"'] ",l=o.length;while(l--)o[l]=s+rb(o[l]);w=ab.test(a)&&pb(b.parentNode)||b,x=o.join(",")}if(x)try{return H.apply(d,w.querySelectorAll(x)),d}catch(y){}finally{r||b.removeAttribute("id")}}}return i(a.replace(R,"$1"),b,d,e)}function hb(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function ib(a){return a[u]=!0,a}function jb(a){var b=n.createElement("div");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function kb(a,b){var c=a.split("|"),e=a.length;while(e--)d.attrHandle[c[e]]=b}function lb(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||C)-(~a.sourceIndex||C);if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function mb(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function nb(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function ob(a){return ib(function(b){return b=+b,ib(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function pb(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}c=gb.support={},f=gb.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?"HTML"!==b.nodeName:!1},m=gb.setDocument=function(a){var b,e,g=a?a.ownerDocument||a:v;return g!==n&&9===g.nodeType&&g.documentElement?(n=g,o=g.documentElement,e=g.defaultView,e&&e!==e.top&&(e.addEventListener?e.addEventListener("unload",eb,!1):e.attachEvent&&e.attachEvent("onunload",eb)),p=!f(g),c.attributes=jb(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=jb(function(a){return a.appendChild(g.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=$.test(g.getElementsByClassName),c.getById=jb(function(a){return o.appendChild(a).id=u,!g.getElementsByName||!g.getElementsByName(u).length}),c.getById?(d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c=b.getElementById(a);return c&&c.parentNode?[c]:[]}},d.filter.ID=function(a){var b=a.replace(cb,db);return function(a){return a.getAttribute("id")===b}}):(delete d.find.ID,d.filter.ID=function(a){var b=a.replace(cb,db);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}}),d.find.TAG=c.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):c.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){return p?b.getElementsByClassName(a):void 0},r=[],q=[],(c.qsa=$.test(g.querySelectorAll))&&(jb(function(a){o.appendChild(a).innerHTML="<a id='"+u+"'></a><select id='"+u+"-\f]' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+L+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+L+"*(?:value|"+K+")"),a.querySelectorAll("[id~="+u+"-]").length||q.push("~="),a.querySelectorAll(":checked").length||q.push(":checked"),a.querySelectorAll("a#"+u+"+*").length||q.push(".#.+[+~]")}),jb(function(a){var b=g.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+L+"*[*^$|!~]?="),a.querySelectorAll(":enabled").length||q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=$.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&jb(function(a){c.disconnectedMatch=s.call(a,"div"),s.call(a,"[s!='']:x"),r.push("!=",P)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=$.test(o.compareDocumentPosition),t=b||$.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===g||a.ownerDocument===v&&t(v,a)?-1:b===g||b.ownerDocument===v&&t(v,b)?1:k?J(k,a)-J(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,e=a.parentNode,f=b.parentNode,h=[a],i=[b];if(!e||!f)return a===g?-1:b===g?1:e?-1:f?1:k?J(k,a)-J(k,b):0;if(e===f)return lb(a,b);c=a;while(c=c.parentNode)h.unshift(c);c=b;while(c=c.parentNode)i.unshift(c);while(h[d]===i[d])d++;return d?lb(h[d],i[d]):h[d]===v?-1:i[d]===v?1:0},g):n},gb.matches=function(a,b){return gb(a,null,null,b)},gb.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(U,"='$1']"),!(!c.matchesSelector||!p||r&&r.test(b)||q&&q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return gb(b,n,null,[a]).length>0},gb.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},gb.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&D.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},gb.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},gb.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=gb.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=gb.selectors={cacheLength:50,createPseudo:ib,match:X,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(cb,db),a[3]=(a[3]||a[4]||a[5]||"").replace(cb,db),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||gb.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&gb.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return X.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&V.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(cb,db).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+L+")"+a+"("+L+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=gb.attr(d,a);return null==e?"!="===b:b?(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e.replace(Q," ")+" ").indexOf(c)>-1:"|="===b?e===c||e.slice(0,c.length+1)===c+"-":!1):!0}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h;if(q){if(f){while(p){l=b;while(l=l[p])if(h?l.nodeName.toLowerCase()===r:1===l.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){k=q[u]||(q[u]={}),j=k[a]||[],n=j[0]===w&&j[1],m=j[0]===w&&j[2],l=n&&q.childNodes[n];while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if(1===l.nodeType&&++m&&l===b){k[a]=[w,n,m];break}}else if(s&&(j=(b[u]||(b[u]={}))[a])&&j[0]===w)m=j[1];else while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if((h?l.nodeName.toLowerCase()===r:1===l.nodeType)&&++m&&(s&&((l[u]||(l[u]={}))[a]=[w,m]),l===b))break;return m-=e,m===d||m%d===0&&m/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||gb.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?ib(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=J(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:ib(function(a){var b=[],c=[],d=h(a.replace(R,"$1"));return d[u]?ib(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),b[0]=null,!c.pop()}}),has:ib(function(a){return function(b){return gb(a,b).length>0}}),contains:ib(function(a){return a=a.replace(cb,db),function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:ib(function(a){return W.test(a||"")||gb.error("unsupported lang: "+a),a=a.replace(cb,db).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return Z.test(a.nodeName)},input:function(a){return Y.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:ob(function(){return[0]}),last:ob(function(a,b){return[b-1]}),eq:ob(function(a,b,c){return[0>c?c+b:c]}),even:ob(function(a,b){for(var c=0;b>c;c+=2)a.push(c);return a}),odd:ob(function(a,b){for(var c=1;b>c;c+=2)a.push(c);return a}),lt:ob(function(a,b,c){for(var d=0>c?c+b:c;--d>=0;)a.push(d);return a}),gt:ob(function(a,b,c){for(var d=0>c?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=mb(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=nb(b);function qb(){}qb.prototype=d.filters=d.pseudos,d.setFilters=new qb,g=gb.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){(!c||(e=S.exec(h)))&&(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=T.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(R," ")}),h=h.slice(c.length));for(g in d.filter)!(e=X[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?gb.error(a):z(a,i).slice(0)};function rb(a){for(var b=0,c=a.length,d="";c>b;b++)d+=a[b].value;return d}function sb(a,b,c){var d=b.dir,e=c&&"parentNode"===d,f=x++;return b.first?function(b,c,f){while(b=b[d])if(1===b.nodeType||e)return a(b,c,f)}:function(b,c,g){var h,i,j=[w,f];if(g){while(b=b[d])if((1===b.nodeType||e)&&a(b,c,g))return!0}else while(b=b[d])if(1===b.nodeType||e){if(i=b[u]||(b[u]={}),(h=i[d])&&h[0]===w&&h[1]===f)return j[2]=h[2];if(i[d]=j,j[2]=a(b,c,g))return!0}}}function tb(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function ub(a,b,c){for(var d=0,e=b.length;e>d;d++)gb(a,b[d],c);return c}function vb(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;i>h;h++)(f=a[h])&&(!c||c(f,d,e))&&(g.push(f),j&&b.push(h));return g}function wb(a,b,c,d,e,f){return d&&!d[u]&&(d=wb(d)),e&&!e[u]&&(e=wb(e,f)),ib(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||ub(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:vb(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=vb(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?J(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=vb(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):H.apply(g,r)})}function xb(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=sb(function(a){return a===b},h,!0),l=sb(function(a){return J(b,a)>-1},h,!0),m=[function(a,c,d){var e=!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d));return b=null,e}];f>i;i++)if(c=d.relative[a[i].type])m=[sb(tb(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;f>e;e++)if(d.relative[a[e].type])break;return wb(i>1&&tb(m),i>1&&rb(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(R,"$1"),c,e>i&&xb(a.slice(i,e)),f>e&&xb(a=a.slice(e)),f>e&&rb(a))}m.push(c)}return tb(m)}function yb(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,m,o,p=0,q="0",r=f&&[],s=[],t=j,u=f||e&&d.find.TAG("*",k),v=w+=null==t?1:Math.random()||.1,x=u.length;for(k&&(j=g!==n&&g);q!==x&&null!=(l=u[q]);q++){if(e&&l){m=0;while(o=a[m++])if(o(l,g,h)){i.push(l);break}k&&(w=v)}c&&((l=!o&&l)&&p--,f&&r.push(l))}if(p+=q,c&&q!==p){m=0;while(o=b[m++])o(r,s,g,h);if(f){if(p>0)while(q--)r[q]||s[q]||(s[q]=F.call(i));s=vb(s)}H.apply(i,s),k&&!f&&s.length>0&&p+b.length>1&&gb.uniqueSort(i)}return k&&(w=v,j=t),r};return c?ib(f):f}return h=gb.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=xb(b[c]),f[u]?d.push(f):e.push(f);f=A(a,yb(e,d)),f.selector=a}return f},i=gb.select=function(a,b,e,f){var i,j,k,l,m,n="function"==typeof a&&a,o=!f&&g(a=n.selector||a);if(e=e||[],1===o.length){if(j=o[0]=o[0].slice(0),j.length>2&&"ID"===(k=j[0]).type&&c.getById&&9===b.nodeType&&p&&d.relative[j[1].type]){if(b=(d.find.ID(k.matches[0].replace(cb,db),b)||[])[0],!b)return e;n&&(b=b.parentNode),a=a.slice(j.shift().value.length)}i=X.needsContext.test(a)?0:j.length;while(i--){if(k=j[i],d.relative[l=k.type])break;if((m=d.find[l])&&(f=m(k.matches[0].replace(cb,db),ab.test(j[0].type)&&pb(b.parentNode)||b))){if(j.splice(i,1),a=f.length&&rb(j),!a)return H.apply(e,f),e;break}}}return(n||h(a,o))(f,b,!p,e,ab.test(a)&&pb(b.parentNode)||b),e},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=jb(function(a){return 1&a.compareDocumentPosition(n.createElement("div"))}),jb(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||kb("type|href|height|width",function(a,b,c){return c?void 0:a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&jb(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||kb("value",function(a,b,c){return c||"input"!==a.nodeName.toLowerCase()?void 0:a.defaultValue}),jb(function(a){return null==a.getAttribute("disabled")})||kb(K,function(a,b,c){var d;return c?void 0:a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),gb}(a);n.find=t,n.expr=t.selectors,n.expr[":"]=n.expr.pseudos,n.unique=t.uniqueSort,n.text=t.getText,n.isXMLDoc=t.isXML,n.contains=t.contains;var u=n.expr.match.needsContext,v=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,w=/^.[^:#\[\.,]*$/;function x(a,b,c){if(n.isFunction(b))return n.grep(a,function(a,d){return!!b.call(a,d,a)!==c});if(b.nodeType)return n.grep(a,function(a){return a===b!==c});if("string"==typeof b){if(w.test(b))return n.filter(b,a,c);b=n.filter(b,a)}return n.grep(a,function(a){return g.call(b,a)>=0!==c})}n.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?n.find.matchesSelector(d,a)?[d]:[]:n.find.matches(a,n.grep(b,function(a){return 1===a.nodeType}))},n.fn.extend({find:function(a){var b,c=this.length,d=[],e=this;if("string"!=typeof a)return this.pushStack(n(a).filter(function(){for(b=0;c>b;b++)if(n.contains(e[b],this))return!0}));for(b=0;c>b;b++)n.find(a,e[b],d);return d=this.pushStack(c>1?n.unique(d):d),d.selector=this.selector?this.selector+" "+a:a,d},filter:function(a){return this.pushStack(x(this,a||[],!1))},not:function(a){return this.pushStack(x(this,a||[],!0))},is:function(a){return!!x(this,"string"==typeof a&&u.test(a)?n(a):a||[],!1).length}});var y,z=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,A=n.fn.init=function(a,b){var c,d;if(!a)return this;if("string"==typeof a){if(c="<"===a[0]&&">"===a[a.length-1]&&a.length>=3?[null,a,null]:z.exec(a),!c||!c[1]&&b)return!b||b.jquery?(b||y).find(a):this.constructor(b).find(a);if(c[1]){if(b=b instanceof n?b[0]:b,n.merge(this,n.parseHTML(c[1],b&&b.nodeType?b.ownerDocument||b:l,!0)),v.test(c[1])&&n.isPlainObject(b))for(c in b)n.isFunction(this[c])?this[c](b[c]):this.attr(c,b[c]);return this}return d=l.getElementById(c[2]),d&&d.parentNode&&(this.length=1,this[0]=d),this.context=l,this.selector=a,this}return a.nodeType?(this.context=this[0]=a,this.length=1,this):n.isFunction(a)?"undefined"!=typeof y.ready?y.ready(a):a(n):(void 0!==a.selector&&(this.selector=a.selector,this.context=a.context),n.makeArray(a,this))};A.prototype=n.fn,y=n(l);var B=/^(?:parents|prev(?:Until|All))/,C={children:!0,contents:!0,next:!0,prev:!0};n.extend({dir:function(a,b,c){var d=[],e=void 0!==c;while((a=a[b])&&9!==a.nodeType)if(1===a.nodeType){if(e&&n(a).is(c))break;d.push(a)}return d},sibling:function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c}}),n.fn.extend({has:function(a){var b=n(a,this),c=b.length;return this.filter(function(){for(var a=0;c>a;a++)if(n.contains(this,b[a]))return!0})},closest:function(a,b){for(var c,d=0,e=this.length,f=[],g=u.test(a)||"string"!=typeof a?n(a,b||this.context):0;e>d;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&n.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?n.unique(f):f)},index:function(a){return a?"string"==typeof a?g.call(n(a),this[0]):g.call(this,a.jquery?a[0]:a):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(n.unique(n.merge(this.get(),n(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function D(a,b){while((a=a[b])&&1!==a.nodeType);return a}n.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return n.dir(a,"parentNode")},parentsUntil:function(a,b,c){return n.dir(a,"parentNode",c)},next:function(a){return D(a,"nextSibling")},prev:function(a){return D(a,"previousSibling")},nextAll:function(a){return n.dir(a,"nextSibling")},prevAll:function(a){return n.dir(a,"previousSibling")},nextUntil:function(a,b,c){return n.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return n.dir(a,"previousSibling",c)},siblings:function(a){return n.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return n.sibling(a.firstChild)},contents:function(a){return a.contentDocument||n.merge([],a.childNodes)}},function(a,b){n.fn[a]=function(c,d){var e=n.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=n.filter(d,e)),this.length>1&&(C[a]||n.unique(e),B.test(a)&&e.reverse()),this.pushStack(e)}});var E=/\S+/g,F={};function G(a){var b=F[a]={};return n.each(a.match(E)||[],function(a,c){b[c]=!0}),b}n.Callbacks=function(a){a="string"==typeof a?F[a]||G(a):n.extend({},a);var b,c,d,e,f,g,h=[],i=!a.once&&[],j=function(l){for(b=a.memory&&l,c=!0,g=e||0,e=0,f=h.length,d=!0;h&&f>g;g++)if(h[g].apply(l[0],l[1])===!1&&a.stopOnFalse){b=!1;break}d=!1,h&&(i?i.length&&j(i.shift()):b?h=[]:k.disable())},k={add:function(){if(h){var c=h.length;!function g(b){n.each(b,function(b,c){var d=n.type(c);"function"===d?a.unique&&k.has(c)||h.push(c):c&&c.length&&"string"!==d&&g(c)})}(arguments),d?f=h.length:b&&(e=c,j(b))}return this},remove:function(){return h&&n.each(arguments,function(a,b){var c;while((c=n.inArray(b,h,c))>-1)h.splice(c,1),d&&(f>=c&&f--,g>=c&&g--)}),this},has:function(a){return a?n.inArray(a,h)>-1:!(!h||!h.length)},empty:function(){return h=[],f=0,this},disable:function(){return h=i=b=void 0,this},disabled:function(){return!h},lock:function(){return i=void 0,b||k.disable(),this},locked:function(){return!i},fireWith:function(a,b){return!h||c&&!i||(b=b||[],b=[a,b.slice?b.slice():b],d?i.push(b):j(b)),this},fire:function(){return k.fireWith(this,arguments),this},fired:function(){return!!c}};return k},n.extend({Deferred:function(a){var b=[["resolve","done",n.Callbacks("once memory"),"resolved"],["reject","fail",n.Callbacks("once memory"),"rejected"],["notify","progress",n.Callbacks("memory")]],c="pending",d={state:function(){return c},always:function(){return e.done(arguments).fail(arguments),this},then:function(){var a=arguments;return n.Deferred(function(c){n.each(b,function(b,f){var g=n.isFunction(a[b])&&a[b];e[f[1]](function(){var a=g&&g.apply(this,arguments);a&&n.isFunction(a.promise)?a.promise().done(c.resolve).fail(c.reject).progress(c.notify):c[f[0]+"With"](this===d?c.promise():this,g?[a]:arguments)})}),a=null}).promise()},promise:function(a){return null!=a?n.extend(a,d):d}},e={};return d.pipe=d.then,n.each(b,function(a,f){var g=f[2],h=f[3];d[f[1]]=g.add,h&&g.add(function(){c=h},b[1^a][2].disable,b[2][2].lock),e[f[0]]=function(){return e[f[0]+"With"](this===e?d:this,arguments),this},e[f[0]+"With"]=g.fireWith}),d.promise(e),a&&a.call(e,e),e},when:function(a){var b=0,c=d.call(arguments),e=c.length,f=1!==e||a&&n.isFunction(a.promise)?e:0,g=1===f?a:n.Deferred(),h=function(a,b,c){return function(e){b[a]=this,c[a]=arguments.length>1?d.call(arguments):e,c===i?g.notifyWith(b,c):--f||g.resolveWith(b,c)}},i,j,k;if(e>1)for(i=new Array(e),j=new Array(e),k=new Array(e);e>b;b++)c[b]&&n.isFunction(c[b].promise)?c[b].promise().done(h(b,k,c)).fail(g.reject).progress(h(b,j,i)):--f;return f||g.resolveWith(k,c),g.promise()}});var H;n.fn.ready=function(a){return n.ready.promise().done(a),this},n.extend({isReady:!1,readyWait:1,holdReady:function(a){a?n.readyWait++:n.ready(!0)},ready:function(a){(a===!0?--n.readyWait:n.isReady)||(n.isReady=!0,a!==!0&&--n.readyWait>0||(H.resolveWith(l,[n]),n.fn.triggerHandler&&(n(l).triggerHandler("ready"),n(l).off("ready"))))}});function I(){l.removeEventListener("DOMContentLoaded",I,!1),a.removeEventListener("load",I,!1),n.ready()}n.ready.promise=function(b){return H||(H=n.Deferred(),"complete"===l.readyState?setTimeout(n.ready):(l.addEventListener("DOMContentLoaded",I,!1),a.addEventListener("load",I,!1))),H.promise(b)},n.ready.promise();var J=n.access=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===n.type(c)){e=!0;for(h in c)n.access(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,n.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(n(a),c)})),b))for(;i>h;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f};n.acceptData=function(a){return 1===a.nodeType||9===a.nodeType||!+a.nodeType};function K(){Object.defineProperty(this.cache={},0,{get:function(){return{}}}),this.expando=n.expando+K.uid++}K.uid=1,K.accepts=n.acceptData,K.prototype={key:function(a){if(!K.accepts(a))return 0;var b={},c=a[this.expando];if(!c){c=K.uid++;try{b[this.expando]={value:c},Object.defineProperties(a,b)}catch(d){b[this.expando]=c,n.extend(a,b)}}return this.cache[c]||(this.cache[c]={}),c},set:function(a,b,c){var d,e=this.key(a),f=this.cache[e];if("string"==typeof b)f[b]=c;else if(n.isEmptyObject(f))n.extend(this.cache[e],b);else for(d in b)f[d]=b[d];return f},get:function(a,b){var c=this.cache[this.key(a)];return void 0===b?c:c[b]},access:function(a,b,c){var d;return void 0===b||b&&"string"==typeof b&&void 0===c?(d=this.get(a,b),void 0!==d?d:this.get(a,n.camelCase(b))):(this.set(a,b,c),void 0!==c?c:b)},remove:function(a,b){var c,d,e,f=this.key(a),g=this.cache[f];if(void 0===b)this.cache[f]={};else{n.isArray(b)?d=b.concat(b.map(n.camelCase)):(e=n.camelCase(b),b in g?d=[b,e]:(d=e,d=d in g?[d]:d.match(E)||[])),c=d.length;while(c--)delete g[d[c]]}},hasData:function(a){return!n.isEmptyObject(this.cache[a[this.expando]]||{})},discard:function(a){a[this.expando]&&delete this.cache[a[this.expando]]}};var L=new K,M=new K,N=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,O=/([A-Z])/g;function P(a,b,c){var d;if(void 0===c&&1===a.nodeType)if(d="data-"+b.replace(O,"-$1").toLowerCase(),c=a.getAttribute(d),"string"==typeof c){try{c="true"===c?!0:"false"===c?!1:"null"===c?null:+c+""===c?+c:N.test(c)?n.parseJSON(c):c}catch(e){}M.set(a,b,c)}else c=void 0;return c}n.extend({hasData:function(a){return M.hasData(a)||L.hasData(a)},data:function(a,b,c){return M.access(a,b,c)
},removeData:function(a,b){M.remove(a,b)},_data:function(a,b,c){return L.access(a,b,c)},_removeData:function(a,b){L.remove(a,b)}}),n.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=M.get(f),1===f.nodeType&&!L.get(f,"hasDataAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=n.camelCase(d.slice(5)),P(f,d,e[d])));L.set(f,"hasDataAttrs",!0)}return e}return"object"==typeof a?this.each(function(){M.set(this,a)}):J(this,function(b){var c,d=n.camelCase(a);if(f&&void 0===b){if(c=M.get(f,a),void 0!==c)return c;if(c=M.get(f,d),void 0!==c)return c;if(c=P(f,d,void 0),void 0!==c)return c}else this.each(function(){var c=M.get(this,d);M.set(this,d,b),-1!==a.indexOf("-")&&void 0!==c&&M.set(this,a,b)})},null,b,arguments.length>1,null,!0)},removeData:function(a){return this.each(function(){M.remove(this,a)})}}),n.extend({queue:function(a,b,c){var d;return a?(b=(b||"fx")+"queue",d=L.get(a,b),c&&(!d||n.isArray(c)?d=L.access(a,b,n.makeArray(c)):d.push(c)),d||[]):void 0},dequeue:function(a,b){b=b||"fx";var c=n.queue(a,b),d=c.length,e=c.shift(),f=n._queueHooks(a,b),g=function(){n.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return L.get(a,c)||L.access(a,c,{empty:n.Callbacks("once memory").add(function(){L.remove(a,[b+"queue",c])})})}}),n.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?n.queue(this[0],a):void 0===b?this:this.each(function(){var c=n.queue(this,a,b);n._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&n.dequeue(this,a)})},dequeue:function(a){return this.each(function(){n.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=n.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=L.get(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var Q=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,R=["Top","Right","Bottom","Left"],S=function(a,b){return a=b||a,"none"===n.css(a,"display")||!n.contains(a.ownerDocument,a)},T=/^(?:checkbox|radio)$/i;!function(){var a=l.createDocumentFragment(),b=a.appendChild(l.createElement("div")),c=l.createElement("input");c.setAttribute("type","radio"),c.setAttribute("checked","checked"),c.setAttribute("name","t"),b.appendChild(c),k.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,b.innerHTML="<textarea>x</textarea>",k.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue}();var U="undefined";k.focusinBubbles="onfocusin"in a;var V=/^key/,W=/^(?:mouse|pointer|contextmenu)|click/,X=/^(?:focusinfocus|focusoutblur)$/,Y=/^([^.]*)(?:\.(.+)|)$/;function Z(){return!0}function $(){return!1}function _(){try{return l.activeElement}catch(a){}}n.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=L.get(a);if(r){c.handler&&(f=c,c=f.handler,e=f.selector),c.guid||(c.guid=n.guid++),(i=r.events)||(i=r.events={}),(g=r.handle)||(g=r.handle=function(b){return typeof n!==U&&n.event.triggered!==b.type?n.event.dispatch.apply(a,arguments):void 0}),b=(b||"").match(E)||[""],j=b.length;while(j--)h=Y.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o&&(l=n.event.special[o]||{},o=(e?l.delegateType:l.bindType)||o,l=n.event.special[o]||{},k=n.extend({type:o,origType:q,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&n.expr.match.needsContext.test(e),namespace:p.join(".")},f),(m=i[o])||(m=i[o]=[],m.delegateCount=0,l.setup&&l.setup.call(a,d,p,g)!==!1||a.addEventListener&&a.addEventListener(o,g,!1)),l.add&&(l.add.call(a,k),k.handler.guid||(k.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,k):m.push(k),n.event.global[o]=!0)}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=L.hasData(a)&&L.get(a);if(r&&(i=r.events)){b=(b||"").match(E)||[""],j=b.length;while(j--)if(h=Y.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o){l=n.event.special[o]||{},o=(d?l.delegateType:l.bindType)||o,m=i[o]||[],h=h[2]&&new RegExp("(^|\\.)"+p.join("\\.(?:.*\\.|)")+"(\\.|$)"),g=f=m.length;while(f--)k=m[f],!e&&q!==k.origType||c&&c.guid!==k.guid||h&&!h.test(k.namespace)||d&&d!==k.selector&&("**"!==d||!k.selector)||(m.splice(f,1),k.selector&&m.delegateCount--,l.remove&&l.remove.call(a,k));g&&!m.length&&(l.teardown&&l.teardown.call(a,p,r.handle)!==!1||n.removeEvent(a,o,r.handle),delete i[o])}else for(o in i)n.event.remove(a,o+b[j],c,d,!0);n.isEmptyObject(i)&&(delete r.handle,L.remove(a,"events"))}},trigger:function(b,c,d,e){var f,g,h,i,k,m,o,p=[d||l],q=j.call(b,"type")?b.type:b,r=j.call(b,"namespace")?b.namespace.split("."):[];if(g=h=d=d||l,3!==d.nodeType&&8!==d.nodeType&&!X.test(q+n.event.triggered)&&(q.indexOf(".")>=0&&(r=q.split("."),q=r.shift(),r.sort()),k=q.indexOf(":")<0&&"on"+q,b=b[n.expando]?b:new n.Event(q,"object"==typeof b&&b),b.isTrigger=e?2:3,b.namespace=r.join("."),b.namespace_re=b.namespace?new RegExp("(^|\\.)"+r.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=d),c=null==c?[b]:n.makeArray(c,[b]),o=n.event.special[q]||{},e||!o.trigger||o.trigger.apply(d,c)!==!1)){if(!e&&!o.noBubble&&!n.isWindow(d)){for(i=o.delegateType||q,X.test(i+q)||(g=g.parentNode);g;g=g.parentNode)p.push(g),h=g;h===(d.ownerDocument||l)&&p.push(h.defaultView||h.parentWindow||a)}f=0;while((g=p[f++])&&!b.isPropagationStopped())b.type=f>1?i:o.bindType||q,m=(L.get(g,"events")||{})[b.type]&&L.get(g,"handle"),m&&m.apply(g,c),m=k&&g[k],m&&m.apply&&n.acceptData(g)&&(b.result=m.apply(g,c),b.result===!1&&b.preventDefault());return b.type=q,e||b.isDefaultPrevented()||o._default&&o._default.apply(p.pop(),c)!==!1||!n.acceptData(d)||k&&n.isFunction(d[q])&&!n.isWindow(d)&&(h=d[k],h&&(d[k]=null),n.event.triggered=q,d[q](),n.event.triggered=void 0,h&&(d[k]=h)),b.result}},dispatch:function(a){a=n.event.fix(a);var b,c,e,f,g,h=[],i=d.call(arguments),j=(L.get(this,"events")||{})[a.type]||[],k=n.event.special[a.type]||{};if(i[0]=a,a.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,a)!==!1){h=n.event.handlers.call(this,a,j),b=0;while((f=h[b++])&&!a.isPropagationStopped()){a.currentTarget=f.elem,c=0;while((g=f.handlers[c++])&&!a.isImmediatePropagationStopped())(!a.namespace_re||a.namespace_re.test(g.namespace))&&(a.handleObj=g,a.data=g.data,e=((n.event.special[g.origType]||{}).handle||g.handler).apply(f.elem,i),void 0!==e&&(a.result=e)===!1&&(a.preventDefault(),a.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,a),a.result}},handlers:function(a,b){var c,d,e,f,g=[],h=b.delegateCount,i=a.target;if(h&&i.nodeType&&(!a.button||"click"!==a.type))for(;i!==this;i=i.parentNode||this)if(i.disabled!==!0||"click"!==a.type){for(d=[],c=0;h>c;c++)f=b[c],e=f.selector+" ",void 0===d[e]&&(d[e]=f.needsContext?n(e,this).index(i)>=0:n.find(e,this,null,[i]).length),d[e]&&d.push(f);d.length&&g.push({elem:i,handlers:d})}return h<b.length&&g.push({elem:this,handlers:b.slice(h)}),g},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return null==a.which&&(a.which=null!=b.charCode?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,b){var c,d,e,f=b.button;return null==a.pageX&&null!=b.clientX&&(c=a.target.ownerDocument||l,d=c.documentElement,e=c.body,a.pageX=b.clientX+(d&&d.scrollLeft||e&&e.scrollLeft||0)-(d&&d.clientLeft||e&&e.clientLeft||0),a.pageY=b.clientY+(d&&d.scrollTop||e&&e.scrollTop||0)-(d&&d.clientTop||e&&e.clientTop||0)),a.which||void 0===f||(a.which=1&f?1:2&f?3:4&f?2:0),a}},fix:function(a){if(a[n.expando])return a;var b,c,d,e=a.type,f=a,g=this.fixHooks[e];g||(this.fixHooks[e]=g=W.test(e)?this.mouseHooks:V.test(e)?this.keyHooks:{}),d=g.props?this.props.concat(g.props):this.props,a=new n.Event(f),b=d.length;while(b--)c=d[b],a[c]=f[c];return a.target||(a.target=l),3===a.target.nodeType&&(a.target=a.target.parentNode),g.filter?g.filter(a,f):a},special:{load:{noBubble:!0},focus:{trigger:function(){return this!==_()&&this.focus?(this.focus(),!1):void 0},delegateType:"focusin"},blur:{trigger:function(){return this===_()&&this.blur?(this.blur(),!1):void 0},delegateType:"focusout"},click:{trigger:function(){return"checkbox"===this.type&&this.click&&n.nodeName(this,"input")?(this.click(),!1):void 0},_default:function(a){return n.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}},simulate:function(a,b,c,d){var e=n.extend(new n.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?n.event.trigger(e,null,b):n.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},n.removeEvent=function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)},n.Event=function(a,b){return this instanceof n.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?Z:$):this.type=a,b&&n.extend(this,b),this.timeStamp=a&&a.timeStamp||n.now(),void(this[n.expando]=!0)):new n.Event(a,b)},n.Event.prototype={isDefaultPrevented:$,isPropagationStopped:$,isImmediatePropagationStopped:$,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=Z,a&&a.preventDefault&&a.preventDefault()},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=Z,a&&a.stopPropagation&&a.stopPropagation()},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=Z,a&&a.stopImmediatePropagation&&a.stopImmediatePropagation(),this.stopPropagation()}},n.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){n.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return(!e||e!==d&&!n.contains(d,e))&&(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),k.focusinBubbles||n.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){n.event.simulate(b,a.target,n.event.fix(a),!0)};n.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=L.access(d,b);e||d.addEventListener(a,c,!0),L.access(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=L.access(d,b)-1;e?L.access(d,b,e):(d.removeEventListener(a,c,!0),L.remove(d,b))}}}),n.fn.extend({on:function(a,b,c,d,e){var f,g;if("object"==typeof a){"string"!=typeof b&&(c=c||b,b=void 0);for(g in a)this.on(g,b,c,a[g],e);return this}if(null==c&&null==d?(d=b,c=b=void 0):null==d&&("string"==typeof b?(d=c,c=void 0):(d=c,c=b,b=void 0)),d===!1)d=$;else if(!d)return this;return 1===e&&(f=d,d=function(a){return n().off(a),f.apply(this,arguments)},d.guid=f.guid||(f.guid=n.guid++)),this.each(function(){n.event.add(this,a,d,c,b)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,n(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return(b===!1||"function"==typeof b)&&(c=b,b=void 0),c===!1&&(c=$),this.each(function(){n.event.remove(this,a,c,b)})},trigger:function(a,b){return this.each(function(){n.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];return c?n.event.trigger(a,b,c,!0):void 0}});var ab=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,bb=/<([\w:]+)/,cb=/<|&#?\w+;/,db=/<(?:script|style|link)/i,eb=/checked\s*(?:[^=]|=\s*.checked.)/i,fb=/^$|\/(?:java|ecma)script/i,gb=/^true\/(.*)/,hb=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,ib={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};ib.optgroup=ib.option,ib.tbody=ib.tfoot=ib.colgroup=ib.caption=ib.thead,ib.th=ib.td;function jb(a,b){return n.nodeName(a,"table")&&n.nodeName(11!==b.nodeType?b:b.firstChild,"tr")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function kb(a){return a.type=(null!==a.getAttribute("type"))+"/"+a.type,a}function lb(a){var b=gb.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function mb(a,b){for(var c=0,d=a.length;d>c;c++)L.set(a[c],"globalEval",!b||L.get(b[c],"globalEval"))}function nb(a,b){var c,d,e,f,g,h,i,j;if(1===b.nodeType){if(L.hasData(a)&&(f=L.access(a),g=L.set(b,f),j=f.events)){delete g.handle,g.events={};for(e in j)for(c=0,d=j[e].length;d>c;c++)n.event.add(b,e,j[e][c])}M.hasData(a)&&(h=M.access(a),i=n.extend({},h),M.set(b,i))}}function ob(a,b){var c=a.getElementsByTagName?a.getElementsByTagName(b||"*"):a.querySelectorAll?a.querySelectorAll(b||"*"):[];return void 0===b||b&&n.nodeName(a,b)?n.merge([a],c):c}function pb(a,b){var c=b.nodeName.toLowerCase();"input"===c&&T.test(a.type)?b.checked=a.checked:("input"===c||"textarea"===c)&&(b.defaultValue=a.defaultValue)}n.extend({clone:function(a,b,c){var d,e,f,g,h=a.cloneNode(!0),i=n.contains(a.ownerDocument,a);if(!(k.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||n.isXMLDoc(a)))for(g=ob(h),f=ob(a),d=0,e=f.length;e>d;d++)pb(f[d],g[d]);if(b)if(c)for(f=f||ob(a),g=g||ob(h),d=0,e=f.length;e>d;d++)nb(f[d],g[d]);else nb(a,h);return g=ob(h,"script"),g.length>0&&mb(g,!i&&ob(a,"script")),h},buildFragment:function(a,b,c,d){for(var e,f,g,h,i,j,k=b.createDocumentFragment(),l=[],m=0,o=a.length;o>m;m++)if(e=a[m],e||0===e)if("object"===n.type(e))n.merge(l,e.nodeType?[e]:e);else if(cb.test(e)){f=f||k.appendChild(b.createElement("div")),g=(bb.exec(e)||["",""])[1].toLowerCase(),h=ib[g]||ib._default,f.innerHTML=h[1]+e.replace(ab,"<$1></$2>")+h[2],j=h[0];while(j--)f=f.lastChild;n.merge(l,f.childNodes),f=k.firstChild,f.textContent=""}else l.push(b.createTextNode(e));k.textContent="",m=0;while(e=l[m++])if((!d||-1===n.inArray(e,d))&&(i=n.contains(e.ownerDocument,e),f=ob(k.appendChild(e),"script"),i&&mb(f),c)){j=0;while(e=f[j++])fb.test(e.type||"")&&c.push(e)}return k},cleanData:function(a){for(var b,c,d,e,f=n.event.special,g=0;void 0!==(c=a[g]);g++){if(n.acceptData(c)&&(e=c[L.expando],e&&(b=L.cache[e]))){if(b.events)for(d in b.events)f[d]?n.event.remove(c,d):n.removeEvent(c,d,b.handle);L.cache[e]&&delete L.cache[e]}delete M.cache[c[M.expando]]}}}),n.fn.extend({text:function(a){return J(this,function(a){return void 0===a?n.text(this):this.empty().each(function(){(1===this.nodeType||11===this.nodeType||9===this.nodeType)&&(this.textContent=a)})},null,a,arguments.length)},append:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=jb(this,a);b.appendChild(a)}})},prepend:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=jb(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},remove:function(a,b){for(var c,d=a?n.filter(a,this):this,e=0;null!=(c=d[e]);e++)b||1!==c.nodeType||n.cleanData(ob(c)),c.parentNode&&(b&&n.contains(c.ownerDocument,c)&&mb(ob(c,"script")),c.parentNode.removeChild(c));return this},empty:function(){for(var a,b=0;null!=(a=this[b]);b++)1===a.nodeType&&(n.cleanData(ob(a,!1)),a.textContent="");return this},clone:function(a,b){return a=null==a?!1:a,b=null==b?a:b,this.map(function(){return n.clone(this,a,b)})},html:function(a){return J(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a&&1===b.nodeType)return b.innerHTML;if("string"==typeof a&&!db.test(a)&&!ib[(bb.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(ab,"<$1></$2>");try{for(;d>c;c++)b=this[c]||{},1===b.nodeType&&(n.cleanData(ob(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=arguments[0];return this.domManip(arguments,function(b){a=this.parentNode,n.cleanData(ob(this)),a&&a.replaceChild(b,this)}),a&&(a.length||a.nodeType)?this:this.remove()},detach:function(a){return this.remove(a,!0)},domManip:function(a,b){a=e.apply([],a);var c,d,f,g,h,i,j=0,l=this.length,m=this,o=l-1,p=a[0],q=n.isFunction(p);if(q||l>1&&"string"==typeof p&&!k.checkClone&&eb.test(p))return this.each(function(c){var d=m.eq(c);q&&(a[0]=p.call(this,c,d.html())),d.domManip(a,b)});if(l&&(c=n.buildFragment(a,this[0].ownerDocument,!1,this),d=c.firstChild,1===c.childNodes.length&&(c=d),d)){for(f=n.map(ob(c,"script"),kb),g=f.length;l>j;j++)h=c,j!==o&&(h=n.clone(h,!0,!0),g&&n.merge(f,ob(h,"script"))),b.call(this[j],h,j);if(g)for(i=f[f.length-1].ownerDocument,n.map(f,lb),j=0;g>j;j++)h=f[j],fb.test(h.type||"")&&!L.access(h,"globalEval")&&n.contains(i,h)&&(h.src?n._evalUrl&&n._evalUrl(h.src):n.globalEval(h.textContent.replace(hb,"")))}return this}}),n.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){n.fn[a]=function(a){for(var c,d=[],e=n(a),g=e.length-1,h=0;g>=h;h++)c=h===g?this:this.clone(!0),n(e[h])[b](c),f.apply(d,c.get());return this.pushStack(d)}});var qb,rb={};function sb(b,c){var d,e=n(c.createElement(b)).appendTo(c.body),f=a.getDefaultComputedStyle&&(d=a.getDefaultComputedStyle(e[0]))?d.display:n.css(e[0],"display");return e.detach(),f}function tb(a){var b=l,c=rb[a];return c||(c=sb(a,b),"none"!==c&&c||(qb=(qb||n("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement),b=qb[0].contentDocument,b.write(),b.close(),c=sb(a,b),qb.detach()),rb[a]=c),c}var ub=/^margin/,vb=new RegExp("^("+Q+")(?!px)[a-z%]+$","i"),wb=function(b){return b.ownerDocument.defaultView.opener?b.ownerDocument.defaultView.getComputedStyle(b,null):a.getComputedStyle(b,null)};function xb(a,b,c){var d,e,f,g,h=a.style;return c=c||wb(a),c&&(g=c.getPropertyValue(b)||c[b]),c&&(""!==g||n.contains(a.ownerDocument,a)||(g=n.style(a,b)),vb.test(g)&&ub.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0!==g?g+"":g}function yb(a,b){return{get:function(){return a()?void delete this.get:(this.get=b).apply(this,arguments)}}}!function(){var b,c,d=l.documentElement,e=l.createElement("div"),f=l.createElement("div");if(f.style){f.style.backgroundClip="content-box",f.cloneNode(!0).style.backgroundClip="",k.clearCloneStyle="content-box"===f.style.backgroundClip,e.style.cssText="border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute",e.appendChild(f);function g(){f.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute",f.innerHTML="",d.appendChild(e);var g=a.getComputedStyle(f,null);b="1%"!==g.top,c="4px"===g.width,d.removeChild(e)}a.getComputedStyle&&n.extend(k,{pixelPosition:function(){return g(),b},boxSizingReliable:function(){return null==c&&g(),c},reliableMarginRight:function(){var b,c=f.appendChild(l.createElement("div"));return c.style.cssText=f.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",c.style.marginRight=c.style.width="0",f.style.width="1px",d.appendChild(e),b=!parseFloat(a.getComputedStyle(c,null).marginRight),d.removeChild(e),f.removeChild(c),b}})}}(),n.swap=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e};var zb=/^(none|table(?!-c[ea]).+)/,Ab=new RegExp("^("+Q+")(.*)$","i"),Bb=new RegExp("^([+-])=("+Q+")","i"),Cb={position:"absolute",visibility:"hidden",display:"block"},Db={letterSpacing:"0",fontWeight:"400"},Eb=["Webkit","O","Moz","ms"];function Fb(a,b){if(b in a)return b;var c=b[0].toUpperCase()+b.slice(1),d=b,e=Eb.length;while(e--)if(b=Eb[e]+c,b in a)return b;return d}function Gb(a,b,c){var d=Ab.exec(b);return d?Math.max(0,d[1]-(c||0))+(d[2]||"px"):b}function Hb(a,b,c,d,e){for(var f=c===(d?"border":"content")?4:"width"===b?1:0,g=0;4>f;f+=2)"margin"===c&&(g+=n.css(a,c+R[f],!0,e)),d?("content"===c&&(g-=n.css(a,"padding"+R[f],!0,e)),"margin"!==c&&(g-=n.css(a,"border"+R[f]+"Width",!0,e))):(g+=n.css(a,"padding"+R[f],!0,e),"padding"!==c&&(g+=n.css(a,"border"+R[f]+"Width",!0,e)));return g}function Ib(a,b,c){var d=!0,e="width"===b?a.offsetWidth:a.offsetHeight,f=wb(a),g="border-box"===n.css(a,"boxSizing",!1,f);if(0>=e||null==e){if(e=xb(a,b,f),(0>e||null==e)&&(e=a.style[b]),vb.test(e))return e;d=g&&(k.boxSizingReliable()||e===a.style[b]),e=parseFloat(e)||0}return e+Hb(a,b,c||(g?"border":"content"),d,f)+"px"}function Jb(a,b){for(var c,d,e,f=[],g=0,h=a.length;h>g;g++)d=a[g],d.style&&(f[g]=L.get(d,"olddisplay"),c=d.style.display,b?(f[g]||"none"!==c||(d.style.display=""),""===d.style.display&&S(d)&&(f[g]=L.access(d,"olddisplay",tb(d.nodeName)))):(e=S(d),"none"===c&&e||L.set(d,"olddisplay",e?c:n.css(d,"display"))));for(g=0;h>g;g++)d=a[g],d.style&&(b&&"none"!==d.style.display&&""!==d.style.display||(d.style.display=b?f[g]||"":"none"));return a}n.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=xb(a,"opacity");return""===c?"1":c}}}},cssNumber:{columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=n.camelCase(b),i=a.style;return b=n.cssProps[h]||(n.cssProps[h]=Fb(i,h)),g=n.cssHooks[b]||n.cssHooks[h],void 0===c?g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:i[b]:(f=typeof c,"string"===f&&(e=Bb.exec(c))&&(c=(e[1]+1)*e[2]+parseFloat(n.css(a,b)),f="number"),null!=c&&c===c&&("number"!==f||n.cssNumber[h]||(c+="px"),k.clearCloneStyle||""!==c||0!==b.indexOf("background")||(i[b]="inherit"),g&&"set"in g&&void 0===(c=g.set(a,c,d))||(i[b]=c)),void 0)}},css:function(a,b,c,d){var e,f,g,h=n.camelCase(b);return b=n.cssProps[h]||(n.cssProps[h]=Fb(a.style,h)),g=n.cssHooks[b]||n.cssHooks[h],g&&"get"in g&&(e=g.get(a,!0,c)),void 0===e&&(e=xb(a,b,d)),"normal"===e&&b in Db&&(e=Db[b]),""===c||c?(f=parseFloat(e),c===!0||n.isNumeric(f)?f||0:e):e}}),n.each(["height","width"],function(a,b){n.cssHooks[b]={get:function(a,c,d){return c?zb.test(n.css(a,"display"))&&0===a.offsetWidth?n.swap(a,Cb,function(){return Ib(a,b,d)}):Ib(a,b,d):void 0},set:function(a,c,d){var e=d&&wb(a);return Gb(a,c,d?Hb(a,b,d,"border-box"===n.css(a,"boxSizing",!1,e),e):0)}}}),n.cssHooks.marginRight=yb(k.reliableMarginRight,function(a,b){return b?n.swap(a,{display:"inline-block"},xb,[a,"marginRight"]):void 0}),n.each({margin:"",padding:"",border:"Width"},function(a,b){n.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];4>d;d++)e[a+R[d]+b]=f[d]||f[d-2]||f[0];return e}},ub.test(a)||(n.cssHooks[a+b].set=Gb)}),n.fn.extend({css:function(a,b){return J(this,function(a,b,c){var d,e,f={},g=0;if(n.isArray(b)){for(d=wb(a),e=b.length;e>g;g++)f[b[g]]=n.css(a,b[g],!1,d);return f}return void 0!==c?n.style(a,b,c):n.css(a,b)},a,b,arguments.length>1)},show:function(){return Jb(this,!0)},hide:function(){return Jb(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){S(this)?n(this).show():n(this).hide()})}});function Kb(a,b,c,d,e){return new Kb.prototype.init(a,b,c,d,e)}n.Tween=Kb,Kb.prototype={constructor:Kb,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||"swing",this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(n.cssNumber[c]?"":"px")},cur:function(){var a=Kb.propHooks[this.prop];return a&&a.get?a.get(this):Kb.propHooks._default.get(this)},run:function(a){var b,c=Kb.propHooks[this.prop];return this.pos=b=this.options.duration?n.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):Kb.propHooks._default.set(this),this}},Kb.prototype.init.prototype=Kb.prototype,Kb.propHooks={_default:{get:function(a){var b;return null==a.elem[a.prop]||a.elem.style&&null!=a.elem.style[a.prop]?(b=n.css(a.elem,a.prop,""),b&&"auto"!==b?b:0):a.elem[a.prop]},set:function(a){n.fx.step[a.prop]?n.fx.step[a.prop](a):a.elem.style&&(null!=a.elem.style[n.cssProps[a.prop]]||n.cssHooks[a.prop])?n.style(a.elem,a.prop,a.now+a.unit):a.elem[a.prop]=a.now}}},Kb.propHooks.scrollTop=Kb.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},n.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2}},n.fx=Kb.prototype.init,n.fx.step={};var Lb,Mb,Nb=/^(?:toggle|show|hide)$/,Ob=new RegExp("^(?:([+-])=|)("+Q+")([a-z%]*)$","i"),Pb=/queueHooks$/,Qb=[Vb],Rb={"*":[function(a,b){var c=this.createTween(a,b),d=c.cur(),e=Ob.exec(b),f=e&&e[3]||(n.cssNumber[a]?"":"px"),g=(n.cssNumber[a]||"px"!==f&&+d)&&Ob.exec(n.css(c.elem,a)),h=1,i=20;if(g&&g[3]!==f){f=f||g[3],e=e||[],g=+d||1;do h=h||".5",g/=h,n.style(c.elem,a,g+f);while(h!==(h=c.cur()/d)&&1!==h&&--i)}return e&&(g=c.start=+g||+d||0,c.unit=f,c.end=e[1]?g+(e[1]+1)*e[2]:+e[2]),c}]};function Sb(){return setTimeout(function(){Lb=void 0}),Lb=n.now()}function Tb(a,b){var c,d=0,e={height:a};for(b=b?1:0;4>d;d+=2-b)c=R[d],e["margin"+c]=e["padding"+c]=a;return b&&(e.opacity=e.width=a),e}function Ub(a,b,c){for(var d,e=(Rb[b]||[]).concat(Rb["*"]),f=0,g=e.length;g>f;f++)if(d=e[f].call(c,b,a))return d}function Vb(a,b,c){var d,e,f,g,h,i,j,k,l=this,m={},o=a.style,p=a.nodeType&&S(a),q=L.get(a,"fxshow");c.queue||(h=n._queueHooks(a,"fx"),null==h.unqueued&&(h.unqueued=0,i=h.empty.fire,h.empty.fire=function(){h.unqueued||i()}),h.unqueued++,l.always(function(){l.always(function(){h.unqueued--,n.queue(a,"fx").length||h.empty.fire()})})),1===a.nodeType&&("height"in b||"width"in b)&&(c.overflow=[o.overflow,o.overflowX,o.overflowY],j=n.css(a,"display"),k="none"===j?L.get(a,"olddisplay")||tb(a.nodeName):j,"inline"===k&&"none"===n.css(a,"float")&&(o.display="inline-block")),c.overflow&&(o.overflow="hidden",l.always(function(){o.overflow=c.overflow[0],o.overflowX=c.overflow[1],o.overflowY=c.overflow[2]}));for(d in b)if(e=b[d],Nb.exec(e)){if(delete b[d],f=f||"toggle"===e,e===(p?"hide":"show")){if("show"!==e||!q||void 0===q[d])continue;p=!0}m[d]=q&&q[d]||n.style(a,d)}else j=void 0;if(n.isEmptyObject(m))"inline"===("none"===j?tb(a.nodeName):j)&&(o.display=j);else{q?"hidden"in q&&(p=q.hidden):q=L.access(a,"fxshow",{}),f&&(q.hidden=!p),p?n(a).show():l.done(function(){n(a).hide()}),l.done(function(){var b;L.remove(a,"fxshow");for(b in m)n.style(a,b,m[b])});for(d in m)g=Ub(p?q[d]:0,d,l),d in q||(q[d]=g.start,p&&(g.end=g.start,g.start="width"===d||"height"===d?1:0))}}function Wb(a,b){var c,d,e,f,g;for(c in a)if(d=n.camelCase(c),e=b[d],f=a[c],n.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=n.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function Xb(a,b,c){var d,e,f=0,g=Qb.length,h=n.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=Lb||Sb(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;i>g;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),1>f&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:n.extend({},b),opts:n.extend(!0,{specialEasing:{}},c),originalProperties:b,originalOptions:c,startTime:Lb||Sb(),duration:c.duration,tweens:[],createTween:function(b,c){var d=n.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;d>c;c++)j.tweens[c].run(1);return b?h.resolveWith(a,[j,b]):h.rejectWith(a,[j,b]),this}}),k=j.props;for(Wb(k,j.opts.specialEasing);g>f;f++)if(d=Qb[f].call(j,a,k,j.opts))return d;return n.map(k,Ub,j),n.isFunction(j.opts.start)&&j.opts.start.call(a,j),n.fx.timer(n.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}n.Animation=n.extend(Xb,{tweener:function(a,b){n.isFunction(a)?(b=a,a=["*"]):a=a.split(" ");for(var c,d=0,e=a.length;e>d;d++)c=a[d],Rb[c]=Rb[c]||[],Rb[c].unshift(b)},prefilter:function(a,b){b?Qb.unshift(a):Qb.push(a)}}),n.speed=function(a,b,c){var d=a&&"object"==typeof a?n.extend({},a):{complete:c||!c&&b||n.isFunction(a)&&a,duration:a,easing:c&&b||b&&!n.isFunction(b)&&b};return d.duration=n.fx.off?0:"number"==typeof d.duration?d.duration:d.duration in n.fx.speeds?n.fx.speeds[d.duration]:n.fx.speeds._default,(null==d.queue||d.queue===!0)&&(d.queue="fx"),d.old=d.complete,d.complete=function(){n.isFunction(d.old)&&d.old.call(this),d.queue&&n.dequeue(this,d.queue)},d},n.fn.extend({fadeTo:function(a,b,c,d){return this.filter(S).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=n.isEmptyObject(a),f=n.speed(b,c,d),g=function(){var b=Xb(this,n.extend({},a),f);(e||L.get(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=n.timers,g=L.get(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&Pb.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));(b||!c)&&n.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=L.get(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=n.timers,g=d?d.length:0;for(c.finish=!0,n.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;g>b;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),n.each(["toggle","show","hide"],function(a,b){var c=n.fn[b];n.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(Tb(b,!0),a,d,e)}}),n.each({slideDown:Tb("show"),slideUp:Tb("hide"),slideToggle:Tb("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){n.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),n.timers=[],n.fx.tick=function(){var a,b=0,c=n.timers;for(Lb=n.now();b<c.length;b++)a=c[b],a()||c[b]!==a||c.splice(b--,1);c.length||n.fx.stop(),Lb=void 0},n.fx.timer=function(a){n.timers.push(a),a()?n.fx.start():n.timers.pop()},n.fx.interval=13,n.fx.start=function(){Mb||(Mb=setInterval(n.fx.tick,n.fx.interval))},n.fx.stop=function(){clearInterval(Mb),Mb=null},n.fx.speeds={slow:600,fast:200,_default:400},n.fn.delay=function(a,b){return a=n.fx?n.fx.speeds[a]||a:a,b=b||"fx",this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},function(){var a=l.createElement("input"),b=l.createElement("select"),c=b.appendChild(l.createElement("option"));a.type="checkbox",k.checkOn=""!==a.value,k.optSelected=c.selected,b.disabled=!0,k.optDisabled=!c.disabled,a=l.createElement("input"),a.value="t",a.type="radio",k.radioValue="t"===a.value}();var Yb,Zb,$b=n.expr.attrHandle;n.fn.extend({attr:function(a,b){return J(this,n.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){n.removeAttr(this,a)})}}),n.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(a&&3!==f&&8!==f&&2!==f)return typeof a.getAttribute===U?n.prop(a,b,c):(1===f&&n.isXMLDoc(a)||(b=b.toLowerCase(),d=n.attrHooks[b]||(n.expr.match.bool.test(b)?Zb:Yb)),void 0===c?d&&"get"in d&&null!==(e=d.get(a,b))?e:(e=n.find.attr(a,b),null==e?void 0:e):null!==c?d&&"set"in d&&void 0!==(e=d.set(a,c,b))?e:(a.setAttribute(b,c+""),c):void n.removeAttr(a,b))
},removeAttr:function(a,b){var c,d,e=0,f=b&&b.match(E);if(f&&1===a.nodeType)while(c=f[e++])d=n.propFix[c]||c,n.expr.match.bool.test(c)&&(a[d]=!1),a.removeAttribute(c)},attrHooks:{type:{set:function(a,b){if(!k.radioValue&&"radio"===b&&n.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}}}),Zb={set:function(a,b,c){return b===!1?n.removeAttr(a,c):a.setAttribute(c,c),c}},n.each(n.expr.match.bool.source.match(/\w+/g),function(a,b){var c=$b[b]||n.find.attr;$b[b]=function(a,b,d){var e,f;return d||(f=$b[b],$b[b]=e,e=null!=c(a,b,d)?b.toLowerCase():null,$b[b]=f),e}});var _b=/^(?:input|select|textarea|button)$/i;n.fn.extend({prop:function(a,b){return J(this,n.prop,a,b,arguments.length>1)},removeProp:function(a){return this.each(function(){delete this[n.propFix[a]||a]})}}),n.extend({propFix:{"for":"htmlFor","class":"className"},prop:function(a,b,c){var d,e,f,g=a.nodeType;if(a&&3!==g&&8!==g&&2!==g)return f=1!==g||!n.isXMLDoc(a),f&&(b=n.propFix[b]||b,e=n.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){return a.hasAttribute("tabindex")||_b.test(a.nodeName)||a.href?a.tabIndex:-1}}}}),k.optSelected||(n.propHooks.selected={get:function(a){var b=a.parentNode;return b&&b.parentNode&&b.parentNode.selectedIndex,null}}),n.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){n.propFix[this.toLowerCase()]=this});var ac=/[\t\r\n\f]/g;n.fn.extend({addClass:function(a){var b,c,d,e,f,g,h="string"==typeof a&&a,i=0,j=this.length;if(n.isFunction(a))return this.each(function(b){n(this).addClass(a.call(this,b,this.className))});if(h)for(b=(a||"").match(E)||[];j>i;i++)if(c=this[i],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(ac," "):" ")){f=0;while(e=b[f++])d.indexOf(" "+e+" ")<0&&(d+=e+" ");g=n.trim(d),c.className!==g&&(c.className=g)}return this},removeClass:function(a){var b,c,d,e,f,g,h=0===arguments.length||"string"==typeof a&&a,i=0,j=this.length;if(n.isFunction(a))return this.each(function(b){n(this).removeClass(a.call(this,b,this.className))});if(h)for(b=(a||"").match(E)||[];j>i;i++)if(c=this[i],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(ac," "):"")){f=0;while(e=b[f++])while(d.indexOf(" "+e+" ")>=0)d=d.replace(" "+e+" "," ");g=a?n.trim(d):"",c.className!==g&&(c.className=g)}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):this.each(n.isFunction(a)?function(c){n(this).toggleClass(a.call(this,c,this.className,b),b)}:function(){if("string"===c){var b,d=0,e=n(this),f=a.match(E)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else(c===U||"boolean"===c)&&(this.className&&L.set(this,"__className__",this.className),this.className=this.className||a===!1?"":L.get(this,"__className__")||"")})},hasClass:function(a){for(var b=" "+a+" ",c=0,d=this.length;d>c;c++)if(1===this[c].nodeType&&(" "+this[c].className+" ").replace(ac," ").indexOf(b)>=0)return!0;return!1}});var bc=/\r/g;n.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=n.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,n(this).val()):a,null==e?e="":"number"==typeof e?e+="":n.isArray(e)&&(e=n.map(e,function(a){return null==a?"":a+""})),b=n.valHooks[this.type]||n.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=n.valHooks[e.type]||n.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(bc,""):null==c?"":c)}}}),n.extend({valHooks:{option:{get:function(a){var b=n.find.attr(a,"value");return null!=b?b:n.trim(n.text(a))}},select:{get:function(a){for(var b,c,d=a.options,e=a.selectedIndex,f="select-one"===a.type||0>e,g=f?null:[],h=f?e+1:d.length,i=0>e?h:f?e:0;h>i;i++)if(c=d[i],!(!c.selected&&i!==e||(k.optDisabled?c.disabled:null!==c.getAttribute("disabled"))||c.parentNode.disabled&&n.nodeName(c.parentNode,"optgroup"))){if(b=n(c).val(),f)return b;g.push(b)}return g},set:function(a,b){var c,d,e=a.options,f=n.makeArray(b),g=e.length;while(g--)d=e[g],(d.selected=n.inArray(d.value,f)>=0)&&(c=!0);return c||(a.selectedIndex=-1),f}}}}),n.each(["radio","checkbox"],function(){n.valHooks[this]={set:function(a,b){return n.isArray(b)?a.checked=n.inArray(n(a).val(),b)>=0:void 0}},k.checkOn||(n.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})}),n.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){n.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),n.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}});var cc=n.now(),dc=/\?/;n.parseJSON=function(a){return JSON.parse(a+"")},n.parseXML=function(a){var b,c;if(!a||"string"!=typeof a)return null;try{c=new DOMParser,b=c.parseFromString(a,"text/xml")}catch(d){b=void 0}return(!b||b.getElementsByTagName("parsererror").length)&&n.error("Invalid XML: "+a),b};var ec=/#.*$/,fc=/([?&])_=[^&]*/,gc=/^(.*?):[ \t]*([^\r\n]*)$/gm,hc=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,ic=/^(?:GET|HEAD)$/,jc=/^\/\//,kc=/^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,lc={},mc={},nc="*/".concat("*"),oc=a.location.href,pc=kc.exec(oc.toLowerCase())||[];function qc(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(E)||[];if(n.isFunction(c))while(d=f[e++])"+"===d[0]?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function rc(a,b,c,d){var e={},f=a===mc;function g(h){var i;return e[h]=!0,n.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function sc(a,b){var c,d,e=n.ajaxSettings.flatOptions||{};for(c in b)void 0!==b[c]&&((e[c]?a:d||(d={}))[c]=b[c]);return d&&n.extend(!0,a,d),a}function tc(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===d&&(d=a.mimeType||b.getResponseHeader("Content-Type"));if(d)for(e in h)if(h[e]&&h[e].test(d)){i.unshift(e);break}if(i[0]in c)f=i[0];else{for(e in c){if(!i[0]||a.converters[e+" "+i[0]]){f=e;break}g||(g=e)}f=f||g}return f?(f!==i[0]&&i.unshift(f),c[f]):void 0}function uc(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}n.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:oc,type:"GET",isLocal:hc.test(pc[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":nc,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":n.parseJSON,"text xml":n.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?sc(sc(a,n.ajaxSettings),b):sc(n.ajaxSettings,a)},ajaxPrefilter:qc(lc),ajaxTransport:qc(mc),ajax:function(a,b){"object"==typeof a&&(b=a,a=void 0),b=b||{};var c,d,e,f,g,h,i,j,k=n.ajaxSetup({},b),l=k.context||k,m=k.context&&(l.nodeType||l.jquery)?n(l):n.event,o=n.Deferred(),p=n.Callbacks("once memory"),q=k.statusCode||{},r={},s={},t=0,u="canceled",v={readyState:0,getResponseHeader:function(a){var b;if(2===t){if(!f){f={};while(b=gc.exec(e))f[b[1].toLowerCase()]=b[2]}b=f[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return 2===t?e:null},setRequestHeader:function(a,b){var c=a.toLowerCase();return t||(a=s[c]=s[c]||a,r[a]=b),this},overrideMimeType:function(a){return t||(k.mimeType=a),this},statusCode:function(a){var b;if(a)if(2>t)for(b in a)q[b]=[q[b],a[b]];else v.always(a[v.status]);return this},abort:function(a){var b=a||u;return c&&c.abort(b),x(0,b),this}};if(o.promise(v).complete=p.add,v.success=v.done,v.error=v.fail,k.url=((a||k.url||oc)+"").replace(ec,"").replace(jc,pc[1]+"//"),k.type=b.method||b.type||k.method||k.type,k.dataTypes=n.trim(k.dataType||"*").toLowerCase().match(E)||[""],null==k.crossDomain&&(h=kc.exec(k.url.toLowerCase()),k.crossDomain=!(!h||h[1]===pc[1]&&h[2]===pc[2]&&(h[3]||("http:"===h[1]?"80":"443"))===(pc[3]||("http:"===pc[1]?"80":"443")))),k.data&&k.processData&&"string"!=typeof k.data&&(k.data=n.param(k.data,k.traditional)),rc(lc,k,b,v),2===t)return v;i=n.event&&k.global,i&&0===n.active++&&n.event.trigger("ajaxStart"),k.type=k.type.toUpperCase(),k.hasContent=!ic.test(k.type),d=k.url,k.hasContent||(k.data&&(d=k.url+=(dc.test(d)?"&":"?")+k.data,delete k.data),k.cache===!1&&(k.url=fc.test(d)?d.replace(fc,"$1_="+cc++):d+(dc.test(d)?"&":"?")+"_="+cc++)),k.ifModified&&(n.lastModified[d]&&v.setRequestHeader("If-Modified-Since",n.lastModified[d]),n.etag[d]&&v.setRequestHeader("If-None-Match",n.etag[d])),(k.data&&k.hasContent&&k.contentType!==!1||b.contentType)&&v.setRequestHeader("Content-Type",k.contentType),v.setRequestHeader("Accept",k.dataTypes[0]&&k.accepts[k.dataTypes[0]]?k.accepts[k.dataTypes[0]]+("*"!==k.dataTypes[0]?", "+nc+"; q=0.01":""):k.accepts["*"]);for(j in k.headers)v.setRequestHeader(j,k.headers[j]);if(k.beforeSend&&(k.beforeSend.call(l,v,k)===!1||2===t))return v.abort();u="abort";for(j in{success:1,error:1,complete:1})v[j](k[j]);if(c=rc(mc,k,b,v)){v.readyState=1,i&&m.trigger("ajaxSend",[v,k]),k.async&&k.timeout>0&&(g=setTimeout(function(){v.abort("timeout")},k.timeout));try{t=1,c.send(r,x)}catch(w){if(!(2>t))throw w;x(-1,w)}}else x(-1,"No Transport");function x(a,b,f,h){var j,r,s,u,w,x=b;2!==t&&(t=2,g&&clearTimeout(g),c=void 0,e=h||"",v.readyState=a>0?4:0,j=a>=200&&300>a||304===a,f&&(u=tc(k,v,f)),u=uc(k,u,v,j),j?(k.ifModified&&(w=v.getResponseHeader("Last-Modified"),w&&(n.lastModified[d]=w),w=v.getResponseHeader("etag"),w&&(n.etag[d]=w)),204===a||"HEAD"===k.type?x="nocontent":304===a?x="notmodified":(x=u.state,r=u.data,s=u.error,j=!s)):(s=x,(a||!x)&&(x="error",0>a&&(a=0))),v.status=a,v.statusText=(b||x)+"",j?o.resolveWith(l,[r,x,v]):o.rejectWith(l,[v,x,s]),v.statusCode(q),q=void 0,i&&m.trigger(j?"ajaxSuccess":"ajaxError",[v,k,j?r:s]),p.fireWith(l,[v,x]),i&&(m.trigger("ajaxComplete",[v,k]),--n.active||n.event.trigger("ajaxStop")))}return v},getJSON:function(a,b,c){return n.get(a,b,c,"json")},getScript:function(a,b){return n.get(a,void 0,b,"script")}}),n.each(["get","post"],function(a,b){n[b]=function(a,c,d,e){return n.isFunction(c)&&(e=e||d,d=c,c=void 0),n.ajax({url:a,type:b,dataType:e,data:c,success:d})}}),n._evalUrl=function(a){return n.ajax({url:a,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})},n.fn.extend({wrapAll:function(a){var b;return n.isFunction(a)?this.each(function(b){n(this).wrapAll(a.call(this,b))}):(this[0]&&(b=n(a,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstElementChild)a=a.firstElementChild;return a}).append(this)),this)},wrapInner:function(a){return this.each(n.isFunction(a)?function(b){n(this).wrapInner(a.call(this,b))}:function(){var b=n(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=n.isFunction(a);return this.each(function(c){n(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){n.nodeName(this,"body")||n(this).replaceWith(this.childNodes)}).end()}}),n.expr.filters.hidden=function(a){return a.offsetWidth<=0&&a.offsetHeight<=0},n.expr.filters.visible=function(a){return!n.expr.filters.hidden(a)};var vc=/%20/g,wc=/\[\]$/,xc=/\r?\n/g,yc=/^(?:submit|button|image|reset|file)$/i,zc=/^(?:input|select|textarea|keygen)/i;function Ac(a,b,c,d){var e;if(n.isArray(b))n.each(b,function(b,e){c||wc.test(a)?d(a,e):Ac(a+"["+("object"==typeof e?b:"")+"]",e,c,d)});else if(c||"object"!==n.type(b))d(a,b);else for(e in b)Ac(a+"["+e+"]",b[e],c,d)}n.param=function(a,b){var c,d=[],e=function(a,b){b=n.isFunction(b)?b():null==b?"":b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};if(void 0===b&&(b=n.ajaxSettings&&n.ajaxSettings.traditional),n.isArray(a)||a.jquery&&!n.isPlainObject(a))n.each(a,function(){e(this.name,this.value)});else for(c in a)Ac(c,a[c],b,e);return d.join("&").replace(vc,"+")},n.fn.extend({serialize:function(){return n.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=n.prop(this,"elements");return a?n.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!n(this).is(":disabled")&&zc.test(this.nodeName)&&!yc.test(a)&&(this.checked||!T.test(a))}).map(function(a,b){var c=n(this).val();return null==c?null:n.isArray(c)?n.map(c,function(a){return{name:b.name,value:a.replace(xc,"\r\n")}}):{name:b.name,value:c.replace(xc,"\r\n")}}).get()}}),n.ajaxSettings.xhr=function(){try{return new XMLHttpRequest}catch(a){}};var Bc=0,Cc={},Dc={0:200,1223:204},Ec=n.ajaxSettings.xhr();a.attachEvent&&a.attachEvent("onunload",function(){for(var a in Cc)Cc[a]()}),k.cors=!!Ec&&"withCredentials"in Ec,k.ajax=Ec=!!Ec,n.ajaxTransport(function(a){var b;return k.cors||Ec&&!a.crossDomain?{send:function(c,d){var e,f=a.xhr(),g=++Bc;if(f.open(a.type,a.url,a.async,a.username,a.password),a.xhrFields)for(e in a.xhrFields)f[e]=a.xhrFields[e];a.mimeType&&f.overrideMimeType&&f.overrideMimeType(a.mimeType),a.crossDomain||c["X-Requested-With"]||(c["X-Requested-With"]="XMLHttpRequest");for(e in c)f.setRequestHeader(e,c[e]);b=function(a){return function(){b&&(delete Cc[g],b=f.onload=f.onerror=null,"abort"===a?f.abort():"error"===a?d(f.status,f.statusText):d(Dc[f.status]||f.status,f.statusText,"string"==typeof f.responseText?{text:f.responseText}:void 0,f.getAllResponseHeaders()))}},f.onload=b(),f.onerror=b("error"),b=Cc[g]=b("abort");try{f.send(a.hasContent&&a.data||null)}catch(h){if(b)throw h}},abort:function(){b&&b()}}:void 0}),n.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(a){return n.globalEval(a),a}}}),n.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET")}),n.ajaxTransport("script",function(a){if(a.crossDomain){var b,c;return{send:function(d,e){b=n("<script>").prop({async:!0,charset:a.scriptCharset,src:a.url}).on("load error",c=function(a){b.remove(),c=null,a&&e("error"===a.type?404:200,a.type)}),l.head.appendChild(b[0])},abort:function(){c&&c()}}}});var Fc=[],Gc=/(=)\?(?=&|$)|\?\?/;n.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=Fc.pop()||n.expando+"_"+cc++;return this[a]=!0,a}}),n.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(Gc.test(b.url)?"url":"string"==typeof b.data&&!(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&Gc.test(b.data)&&"data");return h||"jsonp"===b.dataTypes[0]?(e=b.jsonpCallback=n.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(Gc,"$1"+e):b.jsonp!==!1&&(b.url+=(dc.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||n.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,Fc.push(e)),g&&n.isFunction(f)&&f(g[0]),g=f=void 0}),"script"):void 0}),n.parseHTML=function(a,b,c){if(!a||"string"!=typeof a)return null;"boolean"==typeof b&&(c=b,b=!1),b=b||l;var d=v.exec(a),e=!c&&[];return d?[b.createElement(d[1])]:(d=n.buildFragment([a],b,e),e&&e.length&&n(e).remove(),n.merge([],d.childNodes))};var Hc=n.fn.load;n.fn.load=function(a,b,c){if("string"!=typeof a&&Hc)return Hc.apply(this,arguments);var d,e,f,g=this,h=a.indexOf(" ");return h>=0&&(d=n.trim(a.slice(h)),a=a.slice(0,h)),n.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(e="POST"),g.length>0&&n.ajax({url:a,type:e,dataType:"html",data:b}).done(function(a){f=arguments,g.html(d?n("<div>").append(n.parseHTML(a)).find(d):a)}).complete(c&&function(a,b){g.each(c,f||[a.responseText,b,a])}),this},n.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){n.fn[b]=function(a){return this.on(b,a)}}),n.expr.filters.animated=function(a){return n.grep(n.timers,function(b){return a===b.elem}).length};var Ic=a.document.documentElement;function Jc(a){return n.isWindow(a)?a:9===a.nodeType&&a.defaultView}n.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=n.css(a,"position"),l=n(a),m={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=n.css(a,"top"),i=n.css(a,"left"),j=("absolute"===k||"fixed"===k)&&(f+i).indexOf("auto")>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),n.isFunction(b)&&(b=b.call(a,c,h)),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},n.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){n.offset.setOffset(this,a,b)});var b,c,d=this[0],e={top:0,left:0},f=d&&d.ownerDocument;if(f)return b=f.documentElement,n.contains(b,d)?(typeof d.getBoundingClientRect!==U&&(e=d.getBoundingClientRect()),c=Jc(f),{top:e.top+c.pageYOffset-b.clientTop,left:e.left+c.pageXOffset-b.clientLeft}):e},position:function(){if(this[0]){var a,b,c=this[0],d={top:0,left:0};return"fixed"===n.css(c,"position")?b=c.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),n.nodeName(a[0],"html")||(d=a.offset()),d.top+=n.css(a[0],"borderTopWidth",!0),d.left+=n.css(a[0],"borderLeftWidth",!0)),{top:b.top-d.top-n.css(c,"marginTop",!0),left:b.left-d.left-n.css(c,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||Ic;while(a&&!n.nodeName(a,"html")&&"static"===n.css(a,"position"))a=a.offsetParent;return a||Ic})}}),n.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(b,c){var d="pageYOffset"===c;n.fn[b]=function(e){return J(this,function(b,e,f){var g=Jc(b);return void 0===f?g?g[c]:b[e]:void(g?g.scrollTo(d?a.pageXOffset:f,d?f:a.pageYOffset):b[e]=f)},b,e,arguments.length,null)}}),n.each(["top","left"],function(a,b){n.cssHooks[b]=yb(k.pixelPosition,function(a,c){return c?(c=xb(a,b),vb.test(c)?n(a).position()[b]+"px":c):void 0})}),n.each({Height:"height",Width:"width"},function(a,b){n.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){n.fn[d]=function(d,e){var f=arguments.length&&(c||"boolean"!=typeof d),g=c||(d===!0||e===!0?"margin":"border");return J(this,function(b,c,d){var e;return n.isWindow(b)?b.document.documentElement["client"+a]:9===b.nodeType?(e=b.documentElement,Math.max(b.body["scroll"+a],e["scroll"+a],b.body["offset"+a],e["offset"+a],e["client"+a])):void 0===d?n.css(b,c,g):n.style(b,c,d,g)},b,f?d:void 0,f,null)}})}),n.fn.size=function(){return this.length},n.fn.andSelf=n.fn.addBack,"function"==typeof define&&define.amd&&define("jquery",[],function(){return n});var Kc=a.jQuery,Lc=a.$;return n.noConflict=function(b){return a.$===n&&(a.$=Lc),b&&a.jQuery===n&&(a.jQuery=Kc),n},typeof b===U&&(a.jQuery=a.$=n),n});
//# sourceMappingURL=jquery.min.map
!function(a){"use strict";function b(a,b){var c=(65535&a)+(65535&b),d=(a>>16)+(b>>16)+(c>>16);return d<<16|65535&c}function c(a,b){return a<<b|a>>>32-b}function d(a,d,e,f,g,h){return b(c(b(b(d,a),b(f,h)),g),e)}function e(a,b,c,e,f,g,h){return d(b&c|~b&e,a,b,f,g,h)}function f(a,b,c,e,f,g,h){return d(b&e|c&~e,a,b,f,g,h)}function g(a,b,c,e,f,g,h){return d(b^c^e,a,b,f,g,h)}function h(a,b,c,e,f,g,h){return d(c^(b|~e),a,b,f,g,h)}function i(a,c){a[c>>5]|=128<<c%32,a[(c+64>>>9<<4)+14]=c;var d,i,j,k,l,m=1732584193,n=-271733879,o=-1732584194,p=271733878;for(d=0;d<a.length;d+=16)i=m,j=n,k=o,l=p,m=e(m,n,o,p,a[d],7,-680876936),p=e(p,m,n,o,a[d+1],12,-389564586),o=e(o,p,m,n,a[d+2],17,606105819),n=e(n,o,p,m,a[d+3],22,-1044525330),m=e(m,n,o,p,a[d+4],7,-176418897),p=e(p,m,n,o,a[d+5],12,1200080426),o=e(o,p,m,n,a[d+6],17,-1473231341),n=e(n,o,p,m,a[d+7],22,-45705983),m=e(m,n,o,p,a[d+8],7,1770035416),p=e(p,m,n,o,a[d+9],12,-1958414417),o=e(o,p,m,n,a[d+10],17,-42063),n=e(n,o,p,m,a[d+11],22,-1990404162),m=e(m,n,o,p,a[d+12],7,1804603682),p=e(p,m,n,o,a[d+13],12,-40341101),o=e(o,p,m,n,a[d+14],17,-1502002290),n=e(n,o,p,m,a[d+15],22,1236535329),m=f(m,n,o,p,a[d+1],5,-165796510),p=f(p,m,n,o,a[d+6],9,-1069501632),o=f(o,p,m,n,a[d+11],14,643717713),n=f(n,o,p,m,a[d],20,-373897302),m=f(m,n,o,p,a[d+5],5,-701558691),p=f(p,m,n,o,a[d+10],9,38016083),o=f(o,p,m,n,a[d+15],14,-660478335),n=f(n,o,p,m,a[d+4],20,-405537848),m=f(m,n,o,p,a[d+9],5,568446438),p=f(p,m,n,o,a[d+14],9,-1019803690),o=f(o,p,m,n,a[d+3],14,-187363961),n=f(n,o,p,m,a[d+8],20,1163531501),m=f(m,n,o,p,a[d+13],5,-1444681467),p=f(p,m,n,o,a[d+2],9,-51403784),o=f(o,p,m,n,a[d+7],14,1735328473),n=f(n,o,p,m,a[d+12],20,-1926607734),m=g(m,n,o,p,a[d+5],4,-378558),p=g(p,m,n,o,a[d+8],11,-2022574463),o=g(o,p,m,n,a[d+11],16,1839030562),n=g(n,o,p,m,a[d+14],23,-35309556),m=g(m,n,o,p,a[d+1],4,-1530992060),p=g(p,m,n,o,a[d+4],11,1272893353),o=g(o,p,m,n,a[d+7],16,-155497632),n=g(n,o,p,m,a[d+10],23,-1094730640),m=g(m,n,o,p,a[d+13],4,681279174),p=g(p,m,n,o,a[d],11,-358537222),o=g(o,p,m,n,a[d+3],16,-722521979),n=g(n,o,p,m,a[d+6],23,76029189),m=g(m,n,o,p,a[d+9],4,-640364487),p=g(p,m,n,o,a[d+12],11,-421815835),o=g(o,p,m,n,a[d+15],16,530742520),n=g(n,o,p,m,a[d+2],23,-995338651),m=h(m,n,o,p,a[d],6,-198630844),p=h(p,m,n,o,a[d+7],10,1126891415),o=h(o,p,m,n,a[d+14],15,-1416354905),n=h(n,o,p,m,a[d+5],21,-57434055),m=h(m,n,o,p,a[d+12],6,1700485571),p=h(p,m,n,o,a[d+3],10,-1894986606),o=h(o,p,m,n,a[d+10],15,-1051523),n=h(n,o,p,m,a[d+1],21,-2054922799),m=h(m,n,o,p,a[d+8],6,1873313359),p=h(p,m,n,o,a[d+15],10,-30611744),o=h(o,p,m,n,a[d+6],15,-1560198380),n=h(n,o,p,m,a[d+13],21,1309151649),m=h(m,n,o,p,a[d+4],6,-145523070),p=h(p,m,n,o,a[d+11],10,-1120210379),o=h(o,p,m,n,a[d+2],15,718787259),n=h(n,o,p,m,a[d+9],21,-343485551),m=b(m,i),n=b(n,j),o=b(o,k),p=b(p,l);return[m,n,o,p]}function j(a){var b,c="";for(b=0;b<32*a.length;b+=8)c+=String.fromCharCode(a[b>>5]>>>b%32&255);return c}function k(a){var b,c=[];for(c[(a.length>>2)-1]=void 0,b=0;b<c.length;b+=1)c[b]=0;for(b=0;b<8*a.length;b+=8)c[b>>5]|=(255&a.charCodeAt(b/8))<<b%32;return c}function l(a){return j(i(k(a),8*a.length))}function m(a,b){var c,d,e=k(a),f=[],g=[];for(f[15]=g[15]=void 0,e.length>16&&(e=i(e,8*a.length)),c=0;16>c;c+=1)f[c]=909522486^e[c],g[c]=1549556828^e[c];return d=i(f.concat(k(b)),512+8*b.length),j(i(g.concat(d),640))}function n(a){var b,c,d="0123456789abcdef",e="";for(c=0;c<a.length;c+=1)b=a.charCodeAt(c),e+=d.charAt(b>>>4&15)+d.charAt(15&b);return e}function o(a){return unescape(encodeURIComponent(a))}function p(a){return l(o(a))}function q(a){return n(p(a))}function r(a,b){return m(o(a),o(b))}function s(a,b){return n(r(a,b))}function t(a,b,c){return b?c?r(b,a):s(b,a):c?p(a):q(a)}"function"==typeof define&&define.amd?define(function(){return t}):a.md5=t}(this);
/* mousetrap v1.4.6 craig.is/killing/mice */
(function(J,r,f){function s(a,b,d){a.addEventListener?a.addEventListener(b,d,!1):a.attachEvent("on"+b,d)}function A(a){if("keypress"==a.type){var b=String.fromCharCode(a.which);a.shiftKey||(b=b.toLowerCase());return b}return h[a.which]?h[a.which]:B[a.which]?B[a.which]:String.fromCharCode(a.which).toLowerCase()}function t(a){a=a||{};var b=!1,d;for(d in n)a[d]?b=!0:n[d]=0;b||(u=!1)}function C(a,b,d,c,e,v){var g,k,f=[],h=d.type;if(!l[a])return[];"keyup"==h&&w(a)&&(b=[a]);for(g=0;g<l[a].length;++g)if(k=
l[a][g],!(!c&&k.seq&&n[k.seq]!=k.level||h!=k.action||("keypress"!=h||d.metaKey||d.ctrlKey)&&b.sort().join(",")!==k.modifiers.sort().join(","))){var m=c&&k.seq==c&&k.level==v;(!c&&k.combo==e||m)&&l[a].splice(g,1);f.push(k)}return f}function K(a){var b=[];a.shiftKey&&b.push("shift");a.altKey&&b.push("alt");a.ctrlKey&&b.push("ctrl");a.metaKey&&b.push("meta");return b}function x(a,b,d,c){m.stopCallback(b,b.target||b.srcElement,d,c)||!1!==a(b,d)||(b.preventDefault?b.preventDefault():b.returnValue=!1,b.stopPropagation?
b.stopPropagation():b.cancelBubble=!0)}function y(a){"number"!==typeof a.which&&(a.which=a.keyCode);var b=A(a);b&&("keyup"==a.type&&z===b?z=!1:m.handleKey(b,K(a),a))}function w(a){return"shift"==a||"ctrl"==a||"alt"==a||"meta"==a}function L(a,b,d,c){function e(b){return function(){u=b;++n[a];clearTimeout(D);D=setTimeout(t,1E3)}}function v(b){x(d,b,a);"keyup"!==c&&(z=A(b));setTimeout(t,10)}for(var g=n[a]=0;g<b.length;++g){var f=g+1===b.length?v:e(c||E(b[g+1]).action);F(b[g],f,c,a,g)}}function E(a,b){var d,
c,e,f=[];d="+"===a?["+"]:a.split("+");for(e=0;e<d.length;++e)c=d[e],G[c]&&(c=G[c]),b&&"keypress"!=b&&H[c]&&(c=H[c],f.push("shift")),w(c)&&f.push(c);d=c;e=b;if(!e){if(!p){p={};for(var g in h)95<g&&112>g||h.hasOwnProperty(g)&&(p[h[g]]=g)}e=p[d]?"keydown":"keypress"}"keypress"==e&&f.length&&(e="keydown");return{key:c,modifiers:f,action:e}}function F(a,b,d,c,e){q[a+":"+d]=b;a=a.replace(/\s+/g," ");var f=a.split(" ");1<f.length?L(a,f,b,d):(d=E(a,d),l[d.key]=l[d.key]||[],C(d.key,d.modifiers,{type:d.action},
c,a,e),l[d.key][c?"unshift":"push"]({callback:b,modifiers:d.modifiers,action:d.action,seq:c,level:e,combo:a}))}var h={8:"backspace",9:"tab",13:"enter",16:"shift",17:"ctrl",18:"alt",20:"capslock",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"ins",46:"del",91:"meta",93:"meta",224:"meta"},B={106:"*",107:"+",109:"-",110:".",111:"/",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"},H={"~":"`","!":"1",
"@":"2","#":"3",$:"4","%":"5","^":"6","&":"7","*":"8","(":"9",")":"0",_:"-","+":"=",":":";",'"':"'","<":",",">":".","?":"/","|":"\\"},G={option:"alt",command:"meta","return":"enter",escape:"esc",mod:/Mac|iPod|iPhone|iPad/.test(navigator.platform)?"meta":"ctrl"},p,l={},q={},n={},D,z=!1,I=!1,u=!1;for(f=1;20>f;++f)h[111+f]="f"+f;for(f=0;9>=f;++f)h[f+96]=f;s(r,"keypress",y);s(r,"keydown",y);s(r,"keyup",y);var m={bind:function(a,b,d){a=a instanceof Array?a:[a];for(var c=0;c<a.length;++c)F(a[c],b,d);return this},
unbind:function(a,b){return m.bind(a,function(){},b)},trigger:function(a,b){if(q[a+":"+b])q[a+":"+b]({},a);return this},reset:function(){l={};q={};return this},stopCallback:function(a,b){return-1<(" "+b.className+" ").indexOf(" mousetrap ")?!1:"INPUT"==b.tagName||"SELECT"==b.tagName||"TEXTAREA"==b.tagName||b.isContentEditable},handleKey:function(a,b,d){var c=C(a,b,d),e;b={};var f=0,g=!1;for(e=0;e<c.length;++e)c[e].seq&&(f=Math.max(f,c[e].level));for(e=0;e<c.length;++e)c[e].seq?c[e].level==f&&(g=!0,
b[c[e].seq]=1,x(c[e].callback,d,c[e].combo,c[e].seq)):g||x(c[e].callback,d,c[e].combo);c="keypress"==d.type&&I;d.type!=u||w(a)||c||t(b);I=g&&"keydown"==d.type}};J.Mousetrap=m;"function"===typeof define&&define.amd&&define(m)})(window,document);

Mousetrap=function(a){var d={},e=a.stopCallback;a.stopCallback=function(b,c,a){return d[a]?!1:e(b,c,a)};a.bindGlobal=function(b,c,e){a.bind(b,c,e);if(b instanceof Array)for(c=0;c<b.length;c++)d[b[c]]=!0;else d[b]=!0};return a}(Mousetrap);

this.basicContext={_overflow:null,_dom:function(t){return null==t?$(".basicContext"):$(".basicContext").find(""+t)},_valid:function(t){return null!=t?(null==t["class"]&&(t["class"]=""),null==t.type&&(t.type="item"),null==t.icon&&(t.icon=""),null==t.title&&(t.title="Undefined"),null==t.fn&&"separator"!==t.type?(console.warn("Missing fn for item '"+t.title+"'"),!1):!0):!1},_build:function(t){var n,e,o;return e=0,n=function(t){var n;if(!basicContext._valid(t))return"";switch(t.num=e++,n="<span class='"+t.icon+"'></span>",""===t.icon&&(n=""),t.type){case"item":return"<tr class='"+t["class"]+"'><td data-num='"+t.num+"'>"+n+t.title+"</td></tr>";case"separator":return"<tr class='separator'></tr>"}},"<div class='basicContextContainer'>\n	<div class='basicContext'>\n		<table>\n			<tbody>\n				"+function(){var e,i,l;for(l=[],e=0,i=t.length;i>e;e++)o=t[e],l.push(n(o));return l}().join("")+"\n			</tbody>\n		</table>\n	</div>\n</div>"},_normalizeEvent:function(t){var n;return null!=t&&"touchend"===t.type&&null==t.pageX&&null==t.pageY&&(n=t.originalEvent.changedTouches,n.length>0&&(t.pageX=n[0].pageX,t.pageY=n[0].pageY)),t},_getPosition:function(t){var n,e,o,i;return t=basicContext._normalizeEvent(t),o=t.pageX,i=t.pageY-$(document).scrollTop(),n={width:$("html").width(),height:$("html").height()},(null==o||0>o)&&(o=0),(null==i||0>i)&&(i=0),o>n.width&&(o=n.width),i>n.height&&(i=n.height),e={width:basicContext._dom().outerWidth(!0),height:basicContext._dom().outerHeight(!0)},o+e.width>n.width&&(o-=e.width),i+e.height>n.height&&(i-=i+e.height-n.height),e.height>n.height&&(i=0,basicContext._dom().addClass("basicContext--scrollable")),{x:o,y:i}},_bind:function(t){return basicContext._dom("td[data-num='"+t.num+"']").click(t.fn)},show:function(t,n,e,o){var i,l,a,s;for($("body").append(basicContext._build(t)),null==basicContext._overflow&&(basicContext._overflow=$("body").css("overflow"),$("body").css("overflow","hidden")),i=basicContext._getPosition(n),basicContext._dom().css({top:""+i.y+"px",left:""+i.x+"px",opacity:1}),null==e&&(e=basicContext.close),basicContext._dom().parent().click(e),a=0,s=t.length;s>a;a++)l=t[a],basicContext._bind(l);return n.preventDefault(),null!=o&&o(),!0},visible:function(){return 0===basicContext._dom().length?!1:!0},close:function(){return basicContext._dom().parent().remove(),null!=basicContext._overflow&&($("body").css("overflow",basicContext._overflow),basicContext._overflow=null),!0}};
/* Browser Detection */
var BrowserDetect={init:function(){this.browser=this.searchString(this.dataBrowser)||"An unknown browser";this.version=this.searchVersion(navigator.userAgent)||this.searchVersion(navigator.appVersion)||"an unknown version";this.OS=this.searchString(this.dataOS)||"an unknown OS"},searchString:function(d){for(var a=0;a<d.length;a++){var b=d[a].string;var c=d[a].prop;this.versionSearchString=d[a].versionSearch||d[a].identity;if(b){if(b.indexOf(d[a].subString)!=-1){return d[a].identity}}else{if(c){return d[a].identity}}}},searchVersion:function(b){var a=b.indexOf(this.versionSearchString);if(a==-1){return}return parseFloat(b.substring(a+this.versionSearchString.length+1))},dataBrowser:[{string:navigator.userAgent,subString:"Chrome",identity:"Chrome"},{string:navigator.userAgent,subString:"OmniWeb",versionSearch:"OmniWeb/",identity:"OmniWeb"},{string:navigator.vendor,subString:"Apple",identity:"Safari",versionSearch:"Version"},{prop:window.opera,identity:"Opera"},{string:navigator.vendor,subString:"iCab",identity:"iCab"},{string:navigator.vendor,subString:"KDE",identity:"Konqueror"},{string:navigator.userAgent,subString:"Firefox",identity:"Firefox"},{string:navigator.vendor,subString:"Camino",identity:"Camino"},{string:navigator.userAgent,subString:"Netscape",identity:"Netscape"},{string:navigator.userAgent,subString:"MSIE",identity:"Explorer",versionSearch:"MSIE"},{string:navigator.userAgent,subString:"Gecko",identity:"Mozilla",versionSearch:"rv"},{string:navigator.userAgent,subString:"Mozilla",identity:"Netscape",versionSearch:"Mozilla"}],dataOS:[{string:navigator.platform,subString:"Win",identity:"Windows"},{string:navigator.platform,subString:"Mac",identity:"Mac"},{string:navigator.userAgent,subString:"iPhone",identity:"iPhone/iPod"},{string:navigator.platform,subString:"Linux",identity:"Linux"}]};BrowserDetect.init();
function mobileBrowser() { if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) return true; else return false; }
/* GET */
function gup(b){b=b.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var a="[\\?&]"+b+"=([^&#]*)",d=new RegExp(a),c=d.exec(window.location.href);if(c===null){return""}else{return c[1]}};
/*! jQuery Retina Plugin */
(function(a){a.fn.retina=function(c){var d={"retina-background":false,"retina-suffix":"@2x"};if(c){a.extend(d,c)}var b=function(f,g){var e=new Image();e.onload=function(){g(e)};e.src=f};if(window.devicePixelRatio>1){this.each(function(){var e=a(this);if(this.tagName.toLowerCase()=="img"&&e.attr("src")){var g=e.attr("src").replace(/\.(?!.*\.)/,d["retina-suffix"]+".");b(g,function(h){e.attr("src",h.src);var i=a("<div>").append(e.clone()).remove().html();if(!(/(width|height)=["']\d+["']/.test(i))){e.attr("width",h.width/2)
}})}if(d["retina-background"]){var f=e.css("background-image");if(/^url\(.*\)$/.test(f)){var g=f.substring(4,f.length-1).replace(/\.(?!.*\.)/,d["retina-suffix"]+".");b(g,function(h){e.css("background-image","url("+h.src+")");if(e.css("background-size")=="auto auto"){e.css("background-size",(h.width/2)+"px auto")}})}}})}}})(jQuery);
(function($) {
	var Swipe = function(el) {
		var self = this;

		this.el = $(el);
		this.pos = { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } };
		this.startTime;

		el.on('touchstart', function(e) { self.touchStart(e); });
		el.on('touchmove',  function(e) { self.touchMove(e); });
		el.on('touchend',   function(e) { self.swipeEnd(); });
		el.on('mousedown',  function(e) { self.mouseDown(e); });
	};

	Swipe.prototype = {
		touchStart: function(e) {
			var touch = e.originalEvent.touches[0];

			this.swipeStart(e, touch.pageX, touch.pageY);
		},

		touchMove: function(e) {
			var touch = e.originalEvent.touches[0];

			this.swipeMove(e, touch.pageX, touch.pageY);
		},

		mouseDown: function(e) {
			var self = this;

			this.swipeStart(e, e.pageX, e.pageY);

			this.el.on('mousemove', function(e) { self.mouseMove(e); });
			this.el.on('mouseup', function() { self.mouseUp(); });
		},

		mouseMove: function(e) {
			this.swipeMove(e, e.pageX, e.pageY);
		},

		mouseUp: function(e) {
			this.swipeEnd(e);

			this.el.off('mousemove');
			this.el.off('mouseup');
		},

		swipeStart: function(e, x, y) {
			this.pos.start.x = x;
			this.pos.start.y = y;
			this.pos.end.x = x;
			this.pos.end.y = y;

			this.startTime = new Date().getTime();

			this.trigger('swipeStart', e);
		},

		swipeMove: function(e, x, y) {
			this.pos.end.x = x;
			this.pos.end.y = y;

			this.trigger('swipeMove', e);
		},

		swipeEnd: function(e) {
			this.trigger('swipeEnd', e);
		},

		trigger: function(e, originalEvent) {
			var self = this;

			var
				event = $.Event(e),
				x = self.pos.start.x - self.pos.end.x,
				y = self.pos.end.y - self.pos.start.y,
				radians = Math.atan2(y, x),
				direction = 'up',
				distance = Math.round(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))),
				angle = Math.round(radians * 180 / Math.PI),
				speed = Math.round(distance / ( new Date().getTime() - self.startTime ) * 1000);

			if ( angle < 0 ) {
				angle = 360 - Math.abs(angle);
			}

			if ( ( angle <= 45 && angle >= 0 ) || ( angle <= 360 && angle >= 315 ) ) {
				direction = 'left';
			} else if ( angle >= 135 && angle <= 225 ) {
				direction = 'right';
			} else if ( angle > 45 && angle < 135 ) {
				direction = 'down';
			}

			event.originalEvent = originalEvent;

			event.swipe = { x: x, y: y, direction: direction, distance: distance, angle: angle, speed: speed };

			$(self.el).trigger(event);
		}
	};

	$.fn.swipe = function() {
		var swipe = new Swipe(this);

		return this;
	};
})(jQuery);
/**
 * @description	Takes care of every action an album can handle and execute.
 * @copyright	2014 by Tobias Reich
 */

var _a = i18n.album;

album = {

	json: null

}

album.getID = function() {

	var id;

	if (photo.json)			id = photo.json.album;
	else if (album.json)	id = album.json.id;
	else					id = $('.album:hover, .album.active').attr('data-id');

	// Search
	if (!id) id = $('.album:hover, .album.active').attr('data-id');
	if (!id) id = $('.photo:hover, .photo.active').attr('data-album-id');

	if (id)	return id;
	else	return false;

}

album.load = function(albumID, refresh) {

	var startTime,
		params,
		durationTime,
		waitTime;

	password.get(albumID, function() {

		if (!refresh) {
			lychee.animate('.album, .photo', 'contentZoomOut');
			lychee.animate('.divider', 'fadeOut');
		}

		startTime = new Date().getTime();

		params = 'getAlbum&albumID=' + albumID + '&password=' + password.value;
		lychee.api(params, function(data) {

			if (data==='Warning: Album private!') {
				if (document.location.hash.replace('#', '').split('/')[1]!=undefined) {
					// Display photo only
					lychee.setMode('view');
				} else {
					// Album not public
					lychee.content.show();
					lychee.goto('');
				}
				return false;
			}

			if (data==='Warning: Wrong password!') {
				album.load(albumID, refresh);
				return false;
			}

			album.json = data;

			// Calculate delay
			durationTime = (new Date().getTime() - startTime);
			if (durationTime>300)	waitTime = 0;
			else					waitTime = 300 - durationTime;

			// Skip delay when refresh is true
			// Skip delay when opening a blank Lychee
			if (refresh===true)											waitTime = 0;
			if (!visible.albums()&&!visible.photo()&&!visible.album())	waitTime = 0;

			setTimeout(function() {

				view.album.init();

				if (!refresh) {
					lychee.animate('.album, .photo', 'contentZoomIn');
					view.header.mode('album');
				}

			}, waitTime);

		});

	});

}

album.parse = function() {

	if (!album.json.title) album.json.title = _a.untitled();

}

album.add = function() {

	var title,
		params,
		buttons,
		isNumber = function(n) { return !isNaN(parseFloat(n)) && isFinite(n) };

	buttons = [
		[_a.createAlbum(), function() {

			title = $('.message input.text').val();

			if (title.length===0) title = _a.untitled();

			modal.close();

			params = 'addAlbum&title=' + escape(encodeURI(title));
			lychee.api(params, function(data) {

				// Avoid first album to be true
				if (data===true) data = 1;

				if (data!==false&&isNumber(data)) {
					albums.refresh();
					lychee.goto(data);
				} else {
					lychee.error(null, params, data);
				}

			});

		}],
		[_a.cancel(), function() {}]
	];

	modal.show(_a.newAlbum(), _a.newAlbumEnter() + ": <input class='text' type='text' maxlength='30' placeholder='" + _a.title() + "' value='" + _a.untitled() + "'>", buttons);

}

album.delete = function(albumIDs) {

	var params,
		buttons,
		albumTitle;

	if (!albumIDs) return false;
	if (albumIDs instanceof Array===false) albumIDs = [albumIDs];

	buttons = [
		['', function() {

			params = 'deleteAlbum&albumIDs=' + albumIDs;
			lychee.api(params, function(data) {

				if (visible.albums()) {

					albumIDs.forEach(function(id) {
						albums.json.num--;
						view.albums.content.delete(id);
						delete albums.json.content[id];
					});

				} else {

					albums.refresh();
					lychee.goto('');

				}

				if (data!==true) lychee.error(null, params, data);

			});

		}],
		['', function() {}]
	];

	if (albumIDs.toString()==='0') {

		buttons[0][0] = _a.clearUnsorted();
		buttons[1][0] = _a.keepUnsorted();

		modal.show(buttons[0][0], _a.clearUnsortedAreYouSure(), buttons);

	} else {

		if (albumIDs.length===1) {
			// Get title
			if (album.json)			albumTitle = album.json.title;
			else if (albums.json)	albumTitle = albums.json.content[albumIDs].title;
		}

		buttons[0][0] = _a.delAlbums({NUM_ALBUMS: albumIDs.length});
		buttons[1][0] = _a.keepAlbums({NUM_ALBUMS: albumIDs.length});

		modal.show(buttons[0][0], _a.delAlbumsAreYouSure({NUM_ALBUMS: albumIDs.length, ALBUM_TITLE: albumTitle}), buttons);

	}

}

album.setTitle = function(albumIDs) {

	var oldTitle = '',
		newTitle,
		params,
		buttons;

	if (!albumIDs) return false;
	if (albumIDs instanceof Array===false) albumIDs = [albumIDs];

	if (albumIDs.length===1) {

		// Get old title if only one album is selected
		if (album.json)			oldTitle = album.json.title;
		else if (albums.json)	oldTitle = albums.json.content[albumIDs].title;

		if (!oldTitle) oldTitle = '';
		oldTitle = oldTitle.replace("'", '&apos;');

	}

	buttons = [
		[_a.setTitle(), function() {

			// Get input
			newTitle = $('.message input.text').val();

			// Remove html from input
			newTitle = lychee.removeHTML(newTitle);

			// Set to Untitled when empty
			newTitle = (newTitle==='') ? _a.untitled() : newTitle;

			if (visible.album()) {

				album.json.title = newTitle;
				view.album.title();

				if (albums.json) {
					var id = albumIDs[0];
					albums.json.content[id].title = newTitle;
				}

			} else if (visible.albums()) {

				albumIDs.forEach(function(id) {
					albums.json.content[id].title = newTitle;
					view.albums.content.title(id);
				});

			}

			params = 'setAlbumTitle&albumIDs=' + albumIDs + '&title=' + escape(encodeURI(newTitle));
			lychee.api(params, function(data) {

				if (data!==true) lychee.error(null, params, data);

			});

		}],
		[_a.cancel(), function() {}]
	];

	modal.show(_a.setTitles({NUM_ALBUMS: albumIDs.length}),
	           _a.setTitlesEnter({NUM_ALBUMS: albumIDs.length}) + "<input class='text' type='text' maxlength='30' placeholder='" + _a.title() + "' value='" + oldTitle + "'>",
	           buttons);

}

album.setDescription = function(photoID) {

	var oldDescription = album.json.description.replace("'", '&apos;'),
		description,
		params,
		buttons;

	buttons = [
		[_a.setDesc(), function() {

			// Get input
			description = $('.message input.text').val();

			// Remove html from input
			description = lychee.removeHTML(description);

			if (visible.album()) {
				album.json.description = description;
				view.album.description();
			}

			params = 'setAlbumDescription&albumID=' + photoID + '&description=' + escape(encodeURI(description));
			lychee.api(params, function(data) {

				if (data!==true) lychee.error(null, params, data);

			});

		}],
		[_a.cancel(), function() {}]
	];

	modal.show(_a.setDesc(),
	           _a.setDescEnter() + ": <input class='text' type='text' maxlength='800' placeholder='" + _a.desc() + "' value='" + oldDescription + "'>", buttons);

}

album.setPublic = function(albumID, e) {

	var params,
		password		= '',
		listed			= false,
		downloadable	= false;

	albums.refresh();

	if (!visible.message()&&album.json.public==0) {

		modal.show(_a.shareAlbum(),
		           _a.willBeShared() + ":</p><form>" +
		           "<div class='choice'><input type='checkbox' name='listed' value='listed' checked><h2>" + _a.visible() + "</h2><p>" + _a.visibleDesc() + "</p></div>" +
		           "<div class='choice'><input type='checkbox' name='downloadable' value='downloadable'><h2>" + _a.downloadable() + "</h2><p>" + _a.downloadableDesc() + "</p></div>" +
		           "<div class='choice'><input type='checkbox' name='password' value='password'><h2>" + _a.passwordProtected() + "</h2><p>" + _a.passwordProtectedDesc() + "<input class='text' type='password' placeholder='" + _a.password() + "' value='' style='display: none;'></p></div>" +
		           "</form><p style='display: none;'>",
		           [[_a.shareAlbum(), function() { album.setPublic(album.getID(), e) }],
		            [_a.cancel(), function() {}]], -170);

		$('.message .choice input[name="password"]').on('change', function() {

			if ($(this).prop('checked')===true)	$('.message .choice input.text').show();
			else								$('.message .choice input.text').hide();

		});

		return true;

	}

	if (visible.message()) {

		if ($('.message .choice input[name="password"]:checked').val()==='password') {
			password			= md5($('.message input.text').val());
			album.json.password	= 1;
		} else {
			password			= '';
			album.json.password	= 0;
		}

		if ($('.message .choice input[name="listed"]:checked').val()==='listed')				listed = true;
		if ($('.message .choice input[name="downloadable"]:checked').val()==='downloadable')	downloadable = true;

	}

	params = 'setAlbumPublic&albumID=' + albumID + '&password=' + password + '&visible=' + listed + '&downloadable=' + downloadable;

	if (visible.album()) {

		album.json.public	= (album.json.public==0) ? 1 : 0;
		album.json.password	= (album.json.public==0) ? 0 : album.json.password;

		view.album.public();
		view.album.password();

		if (album.json.public==1) contextMenu.shareAlbum(albumID, e);

	}

	lychee.api(params, function(data) {

		if (data!==true) lychee.error(null, params, data);

	});

}

album.share = function(service) {

	var link = '',
		url = location.href;

	switch (service) {
		case 0:
			link = 'https://twitter.com/share?url=' + encodeURI(url);
			break;
		case 1:
			link = 'http://www.facebook.com/sharer.php?u=' + encodeURI(url) + '&t=' + encodeURI(album.json.title);
			break;
		case 2:
			link = 'mailto:?subject=' + encodeURI(album.json.title) + '&body=' + encodeURI(url);
			break;
		default:
			link = '';
			break;
	}

	if (link.length>5) location.href = link;

}

album.getArchive = function(albumID) {

	var link,
		url = 'php/api.php?function=getAlbumArchive&albumID=' + albumID;

	if (location.href.indexOf('index.html')>0)	link = location.href.replace(location.hash, '').replace('index.html', url);
	else										link = location.href.replace(location.hash, '') + url;

	if (lychee.publicMode) link += '&password=' + password.value;

	location.href = link;

}

/**
 * @description	Takes care of every action albums can handle and execute.
 * @copyright	2014 by Tobias Reich
 */

var _as = i18n.albums;

albums = {

	json: null

}

albums.load = function() {

	var startTime,
		durationTime,
		waitTime;

	lychee.animate('.album, .photo', 'contentZoomOut');
	lychee.animate('.divider', 'fadeOut');

	startTime = new Date().getTime();

	if (albums.json===null) {

		lychee.api('getAlbums', function(data) {

			/* Smart Albums */
			data.unsortedAlbum = {
				id:			0,
				title:		_as.unsorted(),
				sysdate:	data.unsortedNum + ' photos',
				unsorted: 	'1',
				thumb0:		data.unsortedThumb0,
				thumb1:		data.unsortedThumb1,
				thumb2:		data.unsortedThumb2
			};

			data.starredAlbum = {
				id:			'f',
				title:		_as.starred(),
				sysdate:	data.starredNum + ' photos',
				star:		'1',
				thumb0:		data.starredThumb0,
				thumb1:		data.starredThumb1,
				thumb2:		data.starredThumb2
			};

			data.publicAlbum = {
				id:			's',
				title:		_as.public(),
				sysdate:	data.publicNum + ' photos',
				public:		'1',
				thumb0:		data.publicThumb0,
				thumb1:		data.publicThumb1,
				thumb2:		data.publicThumb2
			};

			data.recentAlbum = {
				id:			'r',
				title:		_as.recent(),
				sysdate:	data.recentNum + ' photos',
				recent:		'1',
				thumb0:		data.recentThumb0,
				thumb1:		data.recentThumb1,
				thumb2:		data.recentThumb2
			};

			albums.json = data;

			// Calculate delay
			durationTime = (new Date().getTime() - startTime);
			if (durationTime>300)	waitTime = 0;
			else					waitTime = 300 - durationTime;

			// Skip delay when opening a blank Lychee
			if (!visible.albums()&&!visible.photo()&&!visible.album())	waitTime = 0;
			if (visible.album()&&lychee.content.html()==='')			waitTime = 0;

			setTimeout(function() {
				view.header.mode('albums');
				view.albums.init();
				lychee.animate('.album, .photo', 'contentZoomIn');
			}, waitTime);
		});

	} else {

		setTimeout(function() {
			view.header.mode('albums');
			view.albums.init();
			lychee.animate('.album, .photo', 'contentZoomIn');
		}, 300);

	}
}

albums.parse = function(album) {

	if (album.password&&lychee.publicMode) {
		album.thumb0 = 'src/images/password.svg';
		album.thumb1 = 'src/images/password.svg';
		album.thumb2 = 'src/images/password.svg';
	} else {
		if (!album.thumb0) album.thumb0 = 'src/images/no_images.svg';
		if (!album.thumb1) album.thumb1 = 'src/images/no_images.svg';
		if (!album.thumb2) album.thumb2 = 'src/images/no_images.svg';
	}

}

albums.refresh = function() {

	albums.json = null;

}

/**
 * @description	This module is used for the context menu.
 * @copyright	2014 by Tobias Reich
 */

var _cm = i18n.contextMenu;

contextMenu = {}

contextMenu.add = function(e) {

	var items = [
		{ type: 'item', title: _cm.uploadPhoto(), icon: 'icon-picture', fn: function() { $('#upload_files').click() } },
		{ type: 'separator' },
		{ type: 'item', title: _cm.importLink(), icon: 'icon-link', fn: upload.start.url },
		{ type: 'item', title: _cm.importDropbox(), icon: 'icon-folder-open', fn: upload.start.dropbox },
		{ type: 'item', title: _cm.importServer(), icon: 'icon-hdd', fn: upload.start.server },
		{ type: 'separator' },
		{ type: 'item', title: _cm.newAlbum(), icon: 'icon-folder-close', fn: album.add }
	];

	basicContext.show(items, e);

	upload.notify();

}

contextMenu.settings = function(e) {

	var items = [
		{ type: 'item', title: _cm.changeLogin(), icon: 'icon-user', fn: settings.setLogin },
		{ type: 'item', title: _cm.changeSort(), icon: 'icon-sort', fn: settings.setSorting },
		{ type: 'item', title: _cm.setDropbox(), icon: 'icon-folder-open', fn: settings.setDropboxKey },
		{ type: 'separator' },
		{ type: 'item', title: _cm.about(), icon: 'icon-info-sign', fn: function() { window.open(lychee.website) } },
		{ type: 'item', title: _cm.diag(), icon: 'icon-dashboard', fn: function() { window.open('plugins/check/') } },
		{ type: 'item', title: _cm.log(), icon: 'icon-list', fn: function() { window.open('plugins/displaylog/') } },
		{ type: 'separator' },
		{ type: 'item', title: _cm.signOut(), icon: 'icon-signout', fn: lychee.logout }
	];

	basicContext.show(items, e);

}

contextMenu.album = function(albumID, e) {

	if (albumID==='0'||albumID==='f'||albumID==='s'||albumID==='r') return false;

	var items = [
		{ type: 'item', title: _cm.rename(), icon: 'icon-edit', fn: function() { album.setTitle([albumID]) } },
		{ type: 'item', title: _cm.delete(), icon: 'icon-trash', fn: function() { album.delete([albumID]) } }
	];

	$('.album[data-id="' + albumID + '"]').addClass('active');

	basicContext.show(items, e, contextMenu.close);

}

contextMenu.albumMulti = function(albumIDs, e) {

	multiselect.stopResize();

	var items = [
		{ type: 'item', title: _cm.renameAll(), icon: 'icon-edit', fn: function() { album.setTitle(albumIDs) } },
		{ type: 'item', title: _cm.deleteAll(), icon: 'icon-trash', fn: function() { album.delete(albumIDs) } }
	];

	basicContext.show(items, e, contextMenu.close);

}

contextMenu.photo = function(photoID, e) {

	// Notice for 'Move':
	// fn must call basicContext.close() first,
	// in order to keep the selection

	var items = [
		{ type: 'item', title: _cm.star(), icon: 'icon-star', fn: function() { photo.setStar([photoID]) } },
		{ type: 'item', title: _cm.tags(), icon: 'icon-tags', fn: function() { photo.editTags([photoID]) } },
		{ type: 'separator' },
		{ type: 'item', title: _cm.rename(), icon: 'icon-edit', fn: function() { photo.setTitle([photoID]) } },
		{ type: 'item', title: _cm.duplicate(), icon: 'icon-copy', fn: function() { photo.duplicate([photoID]) } },
		{ type: 'item', title: _cm.move(), icon: 'icon-folder-open', fn: function() { basicContext.close(); contextMenu.move([photoID], e); } },
		{ type: 'item', title: _cm.delete(), icon: 'icon-trash', fn: function() { photo.delete([photoID]) } }
	];

	$('.photo[data-id="' + photoID + '"]').addClass('active');

	basicContext.show(items, e, contextMenu.close);

}

contextMenu.photoMulti = function(photoIDs, e) {

	// Notice for 'Move All':
	// fn must call basicContext.close() first,
	// in order to keep the selection and multiselect

	multiselect.stopResize();

	var items = [
		{ type: 'item', title: _cm.starAll(), icon: 'icon-star', fn: function() { photo.setStar(photoIDs) } },
		{ type: 'item', title: _cm.tagsAll(), icon: 'icon-tags', fn: function() { photo.editTags(photoIDs) } },
		{ type: 'separator' },
		{ type: 'item', title: _cm.renameAll(), icon: 'icon-edit', fn: function() { photo.setTitle(photoIDs) } },
		{ type: 'item', title: _cm.duplicateAll(), icon: 'icon-copy', fn: function() { photo.duplicate(photoIDs) } },
		{ type: 'item', title: _cm.moveAll(), icon: 'icon-folder-open', fn: function() { basicContext.close(); contextMenu.move(photoIDs, e); } },
		{ type: 'item', title: _cm.deleteAll(), icon: 'icon-trash', fn: function() { photo.delete(photoIDs) } }
	];

	basicContext.show(items, e, contextMenu.close);

}

contextMenu.photoMore = function(photoID, e) {

	var items = [
		{ type: 'item', title: _cm.fullPhoto(), icon: 'icon-resize-full', fn: function() { window.open(photo.getDirectLink()) } },
		{ type: 'item', title: _cm.download(), icon: 'icon-circle-arrow-down', fn: function() { photo.getArchive(photoID) } }
	];

	// Remove download-item when
	// 1) In public mode
	// 2) Downloadable not 1 or not found
	if (!(album.json&&album.json.downloadable&&album.json.downloadable==='1')&&
		lychee.publicMode===true) items.splice(1, 1);

	basicContext.show(items, e);

}

contextMenu.move = function(photoIDs, e) {

	var items = [];

	// Show Unsorted when unsorted is not the current album
	if (album.getID()!=='0') {

		items = [
			{ type: 'item', title: _cm.unsorted(), fn: function() { photo.setAlbum(photoIDs, 0) } },
			{ type: 'separator' }
		];

	}

	lychee.api('getAlbums', function(data) {

		if (data.num===0) {

			// Show only 'Add album' when no album available
			items = [
				{ type: 'item', title: _cm.newAlbum(), fn: album.add }
			];

		} else {

			// Generate list of albums
			$.each(data.content, function(index) {

				var that = this;

				if (!that.thumb0) that.thumb0 = 'src/images/no_cover.svg';
				that.title = "<img class='albumCover' width='16' height='16' src='" + that.thumb0 + "'><div class='albumTitle'>" + that.title + "</div>";

				if (that.id!=album.getID()) items.push({ type: 'item', title: that.title, fn: function() { photo.setAlbum(photoIDs, that.id) } });

			});

		}

		basicContext.show(items, e, contextMenu.close);

	});

}

contextMenu.sharePhoto = function(photoID, e) {

	var link = photo.getViewLink(photoID);
	if (photo.json.public==='2') link = location.href;

	var items = [
		{ type: 'item', title: '<input readonly id="link" value="' + link + '">', fn: function() {}, class: 'noHover' },
		{ type: 'separator' },
		{ type: 'item', title: _cm.makePrivate(), icon: 'icon-eye-close', fn: function() { photo.setPublic(photoID) } },
		{ type: 'separator' },
		{ type: 'item', title: _cm.twitter(), icon: 'icon-twitter', fn: function() { photo.share(photoID, 0) } },
		{ type: 'item', title: _cm.facebook(), icon: 'icon-facebook', fn: function() { photo.share(photoID, 1) } },
		{ type: 'item', title: _cm.mail(), icon: 'icon-envelope', fn: function() { photo.share(photoID, 2) } },
		{ type: 'item', title: _cm.dropbox(), icon: 'icon-hdd', fn: function() { photo.share(photoID, 3) } },
		{ type: 'item', title: _cm.directLink(), icon: 'icon-link', fn: function() { window.open(photo.getDirectLink()) } }
	];

	basicContext.show(items, e);
	$('.basicContext input#link').focus().select();

}

contextMenu.shareAlbum = function(albumID, e) {

	var items = [
		{ type: 'item', title: '<input readonly id="link" value="' + location.href + '">', fn: function() {}, class: 'noHover' },
		{ type: 'separator' },
		{ type: 'item', title: _cm.makePrivate(), icon: 'icon-eye-close', fn: function() { album.setPublic(albumID) } },
		{ type: 'separator' },
		{ type: 'item', title: _cm.twitter(), icon: 'icon-twitter', fn: function() { album.share(0) } },
		{ type: 'item', title: _cm.facebook(), icon: 'icon-facebook', fn: function() { album.share(1) } },
		{ type: 'item', title: _cm.mail(), icon: 'icon-envelope', fn: function() { album.share(2) } }
	];

	basicContext.show(items, e);
	$('.basicContext input#link').focus().select();

}

contextMenu.close = function() {

	if (!visible.contextMenu()) return false;

	basicContext.close();

	$('.photo.active, .album.active').removeClass('active');
	if (visible.multiselect()) multiselect.close();

}

/**
 * @description	This module is used for bindings.
 * @copyright	2014 by Tobias Reich
 */

$(document).ready(function() {

	/* Event Name */
	var event_name = (mobileBrowser()) ? 'touchend' : 'click';

	/* Disable ContextMenu */
	$(document).bind('contextmenu', function(e) { e.preventDefault() });

	/* Multiselect */
	$('#content')	.on('mousedown',	multiselect.show);
	$(document)		.on('mouseup',		multiselect.getSelection);

	/* Header */
	$('#button_share').on(event_name, function(e) {
		if (photo.json.public==1||photo.json.public==2)	contextMenu.sharePhoto(photo.getID(), e);
		else											photo.setPublic(photo.getID(), e);
	});
	$('#button_share_album').on(event_name, function(e) {
		if (album.json.public==1)	contextMenu.shareAlbum(album.getID(), e);
		else						album.setPublic(album.getID(), e);
	});
	$('#button_signin')			.on(event_name, lychee.loginDialog);
	$('#button_settings')		.on(event_name, contextMenu.settings);
	$('#button_info_album')		.on(event_name, view.infobox.show);
	$('#button_info')			.on(event_name, view.infobox.show);
	$('#button_more')			.on(event_name, function(e) { contextMenu.photoMore(photo.getID(), e) });
	$('#button_move')			.on(event_name, function(e) { contextMenu.move([photo.getID()], e) });
	$('#hostedwith')			.on(event_name, function() { window.open(lychee.website) });
	$('#button_trash_album')	.on(event_name, function() { album.delete([album.getID()]) });
	$('#button_trash')			.on(event_name, function() { photo.delete([photo.getID()]) });
	$('#button_archive')		.on(event_name, function() { album.getArchive(album.getID()) });
	$('#button_star')			.on(event_name, function() { photo.setStar([photo.getID()]) });
	$('#button_back_home')		.on(event_name, function() { lychee.goto('') });
	$('#button_back')			.on(event_name, function() { lychee.goto(album.getID()) });

	/* Search */
	$('#search').on('keyup click', function() { search.find($(this).val()) });

	/* Clear Search */
	$('#clearSearch').on(event_name, function () {
		$('#search').focus();
		search.reset();
	});

	/* Image View */
	lychee.imageview
		.on(event_name, '.arrow_wrapper.previous',	photo.previous)
		.on(event_name, '.arrow_wrapper.next',		photo.next);

	/* Infobox */
	$('#infobox')
		.on(event_name, '.header a',				view.infobox.hide)
		.on(event_name, '#edit_title_album',		function() { album.setTitle([album.getID()]) })
		.on(event_name, '#edit_description_album',	function() { album.setDescription(album.getID()) })
		.on(event_name, '#edit_title',				function() { photo.setTitle([photo.getID()]) })
		.on(event_name, '#edit_description',		function() { photo.setDescription(photo.getID()) })
		.on(event_name, '#edit_tags',				function() { photo.editTags([photo.getID()]) })
		.on(event_name, '#tags .tag span',			function() { photo.deleteTag(photo.getID(), $(this).data('index')) });

	/* Keyboard */
	Mousetrap
		.bind('left',			function() { if (visible.photo()) $('#imageview a#previous').click() })
		.bind('right',			function() { if (visible.photo()) $('#imageview a#next').click() })
		.bind(['u', 'ctrl+u'],	function() { $('#upload_files').click() })
		.bind(['s', 'ctrl+s', 'f', 'ctrl+f'], function(e) {
			if (visible.photo()) {
				$('#button_star').click();
			} else if (visible.albums()) {
				e.preventDefault();
				$('#search').focus();
			}
		})
		.bind(['r', 'ctrl+r'], function(e) {
			e.preventDefault();
			if (visible.album())		album.setTitle(album.getID());
			else if (visible.photo())	photo.setTitle([photo.getID()]);
		})
		.bind(['d', 'ctrl+d'], function(e) {
			e.preventDefault();
			if (visible.photo())		photo.setDescription(photo.getID());
			else if (visible.album())	album.setDescription(album.getID());
		})
		.bind(['t', 'ctrl+t'], function(e) {
			if (visible.photo()) {
				e.preventDefault();
				photo.editTags([photo.getID()]);
			}
		})
		.bind(['i', 'ctrl+i'], function() {
			if (visible.infobox())				view.infobox.hide();
			else if (visible.multiselect())		return false;
			else if (visible.infoboxbutton())	view.infobox.show();
		})
		.bind(['command+backspace', 'ctrl+backspace'], function() {
			if (visible.photo()&&!visible.message())		photo.delete([photo.getID()]);
			else if (visible.album()&&!visible.message())	album.delete([album.getID()]);
		})
		.bind(['command+a', 'ctrl+a'], function() {
			if (visible.album()&&!visible.message())		multiselect.selectAll();
			else if (visible.albums()&&!visible.message())	multiselect.selectAll();
		});

	Mousetrap.bindGlobal('enter', function() {
		if ($('.message .button.active').length) $('.message .button.active').addClass('pressed').click()
	});

	Mousetrap.bindGlobal(['esc', 'command+up'], function(e) {
		e.preventDefault();
		if (visible.message()&&$('.message .close').length>0)		modal.close();
		else if (visible.contextMenu())								contextMenu.close();
		else if (visible.infobox())									view.infobox.hide();
		else if (visible.photo())									lychee.goto(album.getID());
		else if (visible.album())									lychee.goto('');
		else if (visible.albums()&&$('#search').val().length!==0)	search.reset();
	});


	if (mobileBrowser()) {

		$(document)

			/* Fullscreen on mobile */
			.on('touchend', '#image', function(e) {
				if (swipe.obj===null||(swipe.offset>=-5&&swipe.offset<=5)) {
					if (visible.controls())	view.header.hide(e, 0);
					else					view.header.show();
				}
			})

			/* Swipe on mobile */
			.swipe().on('swipeStart',	function() { if (visible.photo()) swipe.start($('#image')) })
			.swipe().on('swipeMove',	function(e) { if (visible.photo()) swipe.move(e.swipe) })
			.swipe().on('swipeEnd',		function(e) { if (visible.photo()) swipe.stop(e.swipe, photo.previous, photo.next) });

	}

	/* Document */
	$(document)

		/* Login */
		.on('keyup', '#password', function() { if ($(this).val().length>0) $(this).removeClass('error') })

		/* Header */
		.on(event_name, '#title.editable', function() {
			if (visible.photo())	photo.setTitle([photo.getID()]);
			else					album.setTitle([album.getID()]);
		})

		/* Navigation */
		.on('click', '.album', function() { lychee.goto($(this).attr('data-id')) })
		.on('click', '.photo', function() { lychee.goto(album.getID() + '/' + $(this).attr('data-id')) })

		/* Modal */
		.on(event_name, '.message .close',			modal.close)
		.on(event_name, '.message .button:first',	function() { if (modal.fns!==null) modal.fns[0](); if (!visible.signin()) modal.close() })
		.on(event_name, '.message .button:last',	function() { if (modal.fns!==null) modal.fns[1](); if (!visible.signin()) modal.close() })

		/* Add Dialog */
		.on(event_name, '.button_add', contextMenu.add)

		/* Context Menu */
		.on('contextmenu', '.photo',			function(e) { contextMenu.photo(photo.getID(), e) })
		.on('contextmenu', '.album',			function(e) { contextMenu.album(album.getID(), e) })
		.on(event_name, '.contextmenu_bg',		contextMenu.close)

		/* Infobox */
		.on(event_name, '#infobox_overlay', view.infobox.hide)

		/* Upload */
		.on('change', '#upload_files',				function() { modal.close(); upload.start.local(this.files) })
		.on(event_name, '.upload_message a.close',	upload.close)
		.on('dragover',								function(e) { e.preventDefault(); }, false)
		.on('drop', function(e) {

			e.stopPropagation();
			e.preventDefault();

			// Close open overlays or views which are correlating with the upload
			if (visible.photo())		lychee.goto(album.getID());
			if (visible.contextMenu())	contextMenu.close();

			// Detect if dropped item is a file or a link
			if (e.originalEvent.dataTransfer.files.length>0)				upload.start.local(e.originalEvent.dataTransfer.files);
			else if (e.originalEvent.dataTransfer.getData('Text').length>3)	upload.start.url(e.originalEvent.dataTransfer.getData('Text'));

			return true;

		});

	/* Init */
	lychee.init();

});
/**
 * @description	This module is used to show and hide the loading bar.
 * @copyright	2014 by Tobias Reich
 */

var _lb = i18n.loadingBar;

loadingBar = {

	status: null

}

loadingBar.show = function(status, errorText) {

	if (status==='error') {

		// Set status
		loadingBar.status = 'error';

		// Parse text
		if (errorText)	errorText = errorText.replace('<br>', '');
		if (!errorText)	errorText = _lb.somethingWrong();

		// Move header down
		if (visible.controls()) lychee.header.addClass('error');

		// Modify loading
		lychee.loadingBar
			.removeClass('loading uploading error')
			.addClass(status)
			.html('<h1>' + _lb.error() + ': <span>' + errorText + '</span></h1>')
			.show()
			.css('height', '40px');

		// Set timeout
		clearTimeout(lychee.loadingBar.data('timeout'));
		lychee.loadingBar.data('timeout', setTimeout(function() { loadingBar.hide(true) }, 3000));

		return true;

	}

	if (loadingBar.status===null) {

		// Set status
		loadingBar.status = 'loading';

		// Set timeout
		clearTimeout(lychee.loadingBar.data('timeout'));
		lychee.loadingBar.data('timeout', setTimeout(function() {

			// Move header down
			if (visible.controls()) lychee.header.addClass('loading');

			// Modify loading
			lychee.loadingBar
				.removeClass('loading uploading error')
				.addClass('loading')
				.show();

		}, 1000));

		return true;

	}

}

loadingBar.hide = function(force) {

	if ((loadingBar.status!=='error'&&loadingBar.status!==null)||force) {

		// Remove status
		loadingBar.status = null;

		// Move header up
		if (visible.controls()) lychee.header.removeClass('error loading');

		// Modify loading
		lychee.loadingBar
			.html('')
			.css('height', '3px');

		// Set timeout
		clearTimeout(lychee.loadingBar.data('timeout'));
		setTimeout(function() { lychee.loadingBar.hide() }, 300);

	}

}

/**
 * @description	This module provides the basic functions of Lychee.
 * @copyright	2014 by Tobias Reich
 */

lychee = {

	title:			'',
	version:		'2.7.1',
	version_code:	'020701',

	api_path:		'php/api.php',
	update_path:	'http://lychee.electerious.com/version/index.php',
	updateURL:		'https://github.com/electerious/Lychee',
	website:		'http://lychee.electerious.com',

	publicMode:		false,
	viewMode:		false,
	debugMode:		false,

	checkForUpdates:false,
	username:		'',
	sorting:		'',
	location:		'',

	dropbox:		false,
	dropboxKey:		'',

	loadingBar:		$('#loading'),
	header:			$('header'),
	content:		$('#content'),
	imageview:		$('#imageview'),
	infobox:		$('#infobox')

}

lychee.init = function() {

	var params;

	params = 'init&version=' + lychee.version_code;
	lychee.api(params, function(data) {

		if (data.loggedIn!==true) {
			lychee.setMode('public');
		} else {
			lychee.username		= data.config.username		|| '';
			lychee.sorting		= data.config.sorting		|| '';
			lychee.dropboxKey	= data.config.dropboxKey	|| '';
			lychee.location		= data.config.location		|| '';
		}

		// No configuration
		if (data==='Warning: No configuration!') {
			lychee.header.hide();
			lychee.content.hide();
			$('body').append(build.no_content('cog'));
			settings.createConfig();
			return true;
		}

		// No login
		if (data.config.login===false) {
			settings.createLogin();
		}

		lychee.checkForUpdates = data.config.checkForUpdates;
		$(window).bind('popstate', lychee.load);
		lychee.load();

	});

}

lychee.api = function(params, callback) {

	loadingBar.show();

	$.ajax({
		type:		'POST',
		url:		lychee.api_path,
		data:		'function=' + params,
		dataType:	'text',
		success: function(data) {

			setTimeout(function() { loadingBar.hide() }, 100);

			// Catch errors
			if (typeof data==='string'&&
				data.substring(0, 7)==='Error: ') {
					lychee.error(data.substring(7, data.length), params, data);
					upload.close(true);
					return false;
			}

			// Convert 1 to true and an empty string to false
			if (data==='1')		data = true;
			else if (data==='')	data = false;

			// Convert to JSON if string start with '{' and ends with '}'
			if (typeof data==='string'&&
				data.substring(0, 1)==='{'&&
				data.substring(data.length-1, data.length)==='}') data = $.parseJSON(data);

			// Output response when debug mode is enabled
			if (lychee.debugMode) console.log(data);

			callback(data);

		},
		error: function(jqXHR, textStatus, errorThrown) {

			lychee.error('Server error or API not found.', params, errorThrown);
			upload.close(true);

		}
	});

}

lychee.login = function() {

	var user		= $('input#username').val(),
		password	= md5($('input#password').val()),
		params;

	params = 'login&user=' + user + '&password=' + password;
	lychee.api(params, function(data) {

		if (data===true) {

			// Use 'try' to catch a thrown error when Safari is in private mode
			try { localStorage.setItem('lychee_username', user); }
			catch (err) {}

			window.location.reload();

		} else {

			// Show error and reactive button
			$('#password').val('').addClass('error').focus();
			$('.message .button.active').removeClass('pressed');

		}

	});

}

lychee.loginDialog = function() {

	var local_username;

	$('body').append(build.signInModal());
	$('#username').focus();

	if (localStorage) {
		local_username = localStorage.getItem('lychee_username');
		if (local_username!==null) {
			if (local_username.length>0) $('#username').val(local_username);
			$('#password').focus();
		}
	}

	if (lychee.checkForUpdates==='1') lychee.getUpdate();

}

lychee.logout = function() {

	lychee.api('logout', function() {
		window.location.reload();
	});

}

lychee.goto = function(url) {

	if (url===undefined)	url = '#';
	else					url = '#' + url;

	history.pushState(null, null, url);
	lychee.load();

}

lychee.load = function() {

	var albumID	= '',
		photoID	= '',
		hash	= document.location.hash.replace('#', '').split('/');

	$('.no_content').remove();
	contextMenu.close();
	multiselect.close();

	if (hash[0]!==undefined) albumID = hash[0];
	if (hash[1]!==undefined) photoID = hash[1];

	if (albumID&&photoID) {

		// Trash data
		photo.json = null;

		// Show Photo
		if (lychee.content.html()===''||
			($('#search').length&&$('#search').val().length!==0)) {
				lychee.content.hide();
				album.load(albumID, true);
		}
		photo.load(photoID, albumID);

	} else if (albumID) {

		// Trash data
		photo.json = null;

		// Show Album
		if (visible.photo()) view.photo.hide();
		if (album.json&&albumID==album.json.id) view.album.title();
		else album.load(albumID);

	} else {

		// Trash albums.json when filled with search results
		if (search.code!=='') {
			albums.json = null;
			search.code = '';
		}

		// Trash data
		album.json = null;
		photo.json = null;

		// Show Albums
		if (visible.album()) view.album.hide();
		if (visible.photo()) view.photo.hide();
		albums.load();

	}

}

lychee.getUpdate = function() {

	$.ajax({
		url: lychee.update_path,
		success: function(data) { if (parseInt(data)>parseInt(lychee.version_code)) $('#version span').show(); }
	});

}

lychee.setTitle = function(title, editable) {

	if (lychee.title==='')	lychee.title = document.title;

	if (title==='Albums')	document.title = lychee.title;
	else					document.title = lychee.title + ' - ' + title;

	if (editable)	$('#title').addClass('editable');
	else			$('#title').removeClass('editable');

	$('#title').html(title);

}

lychee.setMode = function(mode) {

	$('#button_settings, #button_settings, #button_search, #search, #button_trash_album, #button_share_album, .button_add, .button_divider').remove();
	$('#button_trash, #button_move, #button_share, #button_star').remove();

	$(document)
		.on('mouseenter',	'#title.editable', function() { $(this).removeClass('editable') })
		.off('click',		'#title.editable')
		.off('touchend',	'#title.editable')
		.off('contextmenu',	'.photo')
		.off('contextmenu',	'.album')
		.off('drop');

	Mousetrap
		.unbind(['u', 'ctrl+u'])
		.unbind(['s', 'ctrl+s'])
		.unbind(['f', 'ctrl+f'])
		.unbind(['r', 'ctrl+r'])
		.unbind(['d', 'ctrl+d'])
		.unbind(['t', 'ctrl+t'])
		.unbind(['command+backspace', 'ctrl+backspace'])
		.unbind(['command+a', 'ctrl+a']);

	if (mode==='public') {

		$('header #button_signin, header #hostedwith').show();
		lychee.publicMode = true;

	} else if (mode==='view') {

		Mousetrap.unbind('esc');
		$('#button_back, a#next, a#previous').remove();
		$('.no_content').remove();

		lychee.publicMode	= true;
		lychee.viewMode		= true;

	}

}

lychee.animate = function(obj, animation) {

	var animations = [
		['fadeIn', 'fadeOut'],
		['contentZoomIn', 'contentZoomOut']
	];

	if (!obj.jQuery) obj = $(obj);

	for (var i = 0; i < animations.length; i++) {
		for (var x = 0; x < animations[i].length; x++) {
			if (animations[i][x]==animation) {
				obj.removeClass(animations[i][0] + ' ' + animations[i][1]).addClass(animation);
				return true;
			}
		}
	}

	return false;

}

lychee.escapeHTML = function(s) {

	return s.replace(/&/g, '&amp;')
			.replace(/"/g, '&quot;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');

}

lychee.loadDropbox = function(callback) {

	if (!lychee.dropbox&&lychee.dropboxKey) {

		loadingBar.show();

		var g = document.createElement('script'),
			s = document.getElementsByTagName('script')[0];

		g.src	= 'https://www.dropbox.com/static/api/1/dropins.js';
		g.id	= 'dropboxjs';
		g.type	= 'text/javascript';
		g.async = 'true';
		g.setAttribute('data-app-key', lychee.dropboxKey);
		g.onload = g.onreadystatechange = function() {
			var rs = this.readyState;
			if (rs&&rs!=='complete'&&rs!=='loaded') return;
			lychee.dropbox = true;
			loadingBar.hide();
			callback();
		};
		s.parentNode.insertBefore(g, s);

	} else if (lychee.dropbox&&lychee.dropboxKey) {

		callback();

	} else {

		settings.setDropboxKey(callback);

	}

}

lychee.removeHTML = function(html) {

	var tmp = document.createElement('DIV');
	tmp.innerHTML = html;
	return tmp.textContent || tmp.innerText;

}

lychee.error = function(errorThrown, params, data) {

	console.error({
		description:	errorThrown,
		params:			params,
		response:		data
	});

	loadingBar.show('error', errorThrown);

}

/**
 * @description	Build, show and hide a modal.
 * @copyright	2014 by Tobias Reich
 */

modal = {

	fns: null

}

modal.show = function(title, text, buttons, marginTop, closeButton) {

	if (!buttons) {
		buttons = [
			['', function() {}],
			['', function() {}]
		];
	}

	modal.fns = [buttons[0][1], buttons[1][1]];

	$('body').append(build.modal(title, text, buttons, marginTop, closeButton));
	$('.message input:first-child').focus().select();

}

modal.close = function() {

	modal.fns = null;
	$('.message_overlay').removeClass('fadeIn').css('opacity', 0);
	setTimeout(function() { $('.message_overlay').remove() }, 300);

}

/**
 * @description	Select multiple albums or photos.
 * @copyright	2014 by Tobias Reich
 */

multiselect = {}

multiselect.position = {

	top:	null,
	right:	null,
	bottom:	null,
	left:	null

}

multiselect.show = function(e) {

	if (mobileBrowser())	return false;
	if (lychee.publicMode)	return false;
	if (visible.search())	return false;
	if (visible.infobox())	return false;
	if (!visible.albums()&&!visible.album)			return false;
	if ($('.album:hover, .photo:hover').length!==0)	return false;
	if (visible.multiselect())						$('#multiselect').remove();

	multiselect.position.top	= e.pageY;
	multiselect.position.right	= -1 * (e.pageX - $(document).width());
	multiselect.position.bottom	= -1 * (multiselect.position.top - $(window).height());
	multiselect.position.left	= e.pageX;

	$('body').append(build.multiselect(multiselect.position.top, multiselect.position.left));
	$(document).on('mousemove', multiselect.resize);

}

multiselect.selectAll = function() {

	var e,
		newWidth,
		newHeight;

	if (mobileBrowser())		return false;
	if (lychee.publicMode)		return false;
	if (visible.search())		return false;
	if (visible.infobox())		return false;
	if (!visible.albums()&&!visible.album)	return false;
	if (visible.multiselect())	$('#multiselect').remove();

	multiselect.position.top	= 70;
	multiselect.position.right	= 40;
	multiselect.position.bottom	= 90;
	multiselect.position.left	= 20;

	$('body').append(build.multiselect(multiselect.position.top, multiselect.position.left));

	newWidth	= $(document).width() - multiselect.position.right + 2;
	newHeight	= $(document).height() - multiselect.position.bottom;

	$('#multiselect').css({
		width: newWidth,
		height: newHeight
	});

	e = {
		pageX: $(document).width() - (multiselect.position.right / 2),
		pageY: $(document).height() - multiselect.position.bottom
	};

	multiselect.getSelection(e);

}

multiselect.resize = function(e) {

	var mouse_x = e.pageX,
		mouse_y = e.pageY,
		newHeight,
		newWidth;

	if (multiselect.position.top===null||
		multiselect.position.right===null||
		multiselect.position.bottom===null||
		multiselect.position.left===null) return false;

	if (mouse_y>=multiselect.position.top) {

		// Do not leave the screen
		newHeight = mouse_y - multiselect.position.top;
		if ((multiselect.position.top+newHeight)>=$(document).height())
			newHeight -= (multiselect.position.top + newHeight) - $(document).height() + 2;

		$('#multiselect').css({
			top:	multiselect.position.top,
			bottom:	'inherit',
			height:	newHeight
		});

	} else {

		$('#multiselect').css({
			top:	'inherit',
			bottom:	multiselect.position.bottom,
			height:	multiselect.position.top - e.pageY
		});

	}

	if (mouse_x>=multiselect.position.left) {

		// Do not leave the screen
		newWidth = mouse_x - multiselect.position.left;
		if ((multiselect.position.left+newWidth)>=$(document).width())
			newWidth -= (multiselect.position.left + newWidth) - $(document).width() + 2;

		$('#multiselect').css({
			right:	'inherit',
			left:	multiselect.position.left,
			width:	newWidth
		});

	} else {

		$('#multiselect').css({
			right:	multiselect.position.right,
			left:	'inherit',
			width:	multiselect.position.left - e.pageX
		});

	}

}

multiselect.stopResize = function() {

	$(document).off('mousemove');

}

multiselect.getSize = function() {

	if (!visible.multiselect()) return false;

	return {
		top:	$('#multiselect').offset().top,
		left:	$('#multiselect').offset().left,
		width:	parseInt($('#multiselect').css('width').replace('px', '')),
		height:	parseInt($('#multiselect').css('height').replace('px', ''))
	};

}

multiselect.getSelection = function(e) {

	var tolerance = 150,
		id,
		ids = [],
		offset,
		size = multiselect.getSize();

	if (visible.contextMenu()) return false;
	if (!visible.multiselect()) return false;

	$('.photo, .album').each(function() {

		offset = $(this).offset();

		if (offset.top>=(size.top-tolerance)&&
			offset.left>=(size.left-tolerance)&&
			(offset.top+206)<=(size.top+size.height+tolerance)&&
			(offset.left+206)<=(size.left+size.width+tolerance)) {

				id = $(this).data('id');

				if (id!=='0'&&id!==0&&id!=='f'&&id!=='s'&&id!=='r'&&id!==null&&id!==undefined) {

					ids.push(id);
					$(this).addClass('active');

				}

			}

	});

	if (ids.length!==0&&visible.album()) contextMenu.photoMulti(ids, e);
	else if (ids.length!==0&&visible.albums()) contextMenu.albumMulti(ids, e);
	else multiselect.close();

}

multiselect.close = function() {

	multiselect.stopResize();

	multiselect.position.top	= null;
	multiselect.position.right	= null;
	multiselect.position.bottom	= null;
	multiselect.position.left	= null;

	lychee.animate('#multiselect', 'fadeOut');
	setTimeout(function() {
		$('#multiselect').remove();
	}, 300);

}
/**
 * @description	Controls the access to password-protected albums and photos.
 * @copyright   2014 by Tobias Reich
 */

var _p = i18n.password;

password = {

	value: ''

}

password.get = function(albumID, callback) {

	var passwd = $('.message input.text').val(),
		params;

	if (!lychee.publicMode)												callback();
	else if (album.json&&album.json.password==false)					callback();
	else if (albums.json&&albums.json.content[albumID].password==false)	callback();
	else if (!albums.json&&!album.json) {

		// Continue without password
		album.json = {password: true};
		callback('');

	} else if (passwd==undefined) {

		// Request password
		password.getDialog(albumID, callback);

	} else {

		// Check password
		params = 'checkAlbumAccess&albumID=' + albumID + '&password=' + md5(passwd);
		lychee.api(params, function(data) {

			if (data===true) {
				password.value = md5(passwd);
				callback();
			} else {
				lychee.goto('');
				loadingBar.show('error', _p.wrongPassword());
			}

		});

	}

}

password.getDialog = function(albumID, callback) {

	var buttons;

	buttons = [
		[_p.enter(), function() { password.get(albumID, callback) }],
		[_p.cancel(), lychee.goto]
	];
	modal.show("<a class='icon-lock'></a> " + _p.enterPassword(),
	           _p.protectedInfo() + ": <input class='text' type='password' placeholder='" + _p.password() + "' value=''>",
	           buttons, -110, false);

}

/**
 * @description	Takes care of every action a photo can handle and execute.
 * @copyright	2014 by Tobias Reich
 */

var _p = i18n.photo;

photo = {

	json:	null,
	cache:	null

}

photo.getID = function() {

	var id;

	if (photo.json) id = photo.json.id;
	else id = $('.photo:hover, .photo.active').attr('data-id');

	if (id) return id;
	else return false;

}

photo.load = function(photoID, albumID) {

	var params,
		checkPasswd;

	params = 'getPhoto&photoID=' + photoID + '&albumID=' + albumID + '&password=' + password.value;
	lychee.api(params, function(data) {

		if (data==='Warning: Wrong password!') {
			checkPasswd = function() {
				if (password.value!=='') photo.load(photoID, albumID);
				else setTimeout(checkPasswd, 250);
			};
			checkPasswd();
			return false;
		}

		photo.json = data;
		if (!visible.photo()) view.photo.show();
		view.photo.init();

		lychee.imageview.show();
		setTimeout(function() {
			lychee.content.show();
			//photo.preloadNext(photoID, albumID);
		}, 300);

	});

}

// Preload the next photo for better response time
photo.preloadNext = function(photoID) {

	var nextPhoto,
		url;

	// Never preload on mobile devices with bare RAM and
	// mostly mobile internet
	if (mobileBrowser()) return false;

	if (album.json &&
	   album.json.content &&
	   album.json.content[photoID] &&
	   album.json.content[photoID].nextPhoto!='') {

		nextPhoto	= album.json.content[photoID].nextPhoto;
		url			= album.json.content[nextPhoto].url;

		photo.cache			= new Image();
		photo.cache.src		= url;
		photo.cache.onload	= function() { photo.cache = null };

	}

}

photo.parse = function() {

	if (!photo.json.title) photo.json.title = _p.untitled();

}

photo.previous = function(animate) {

	var delay = 0;

	if (photo.getID()!==false&&
		album.json&&
		album.json.content[photo.getID()]&&
		album.json.content[photo.getID()].previousPhoto!=='') {

			if (animate===true) {

				delay = 200;

				$('#image').css({
					WebkitTransform:	'translateX(100%)',
					MozTransform:		'translateX(100%)',
					transform:			'translateX(100%)',
					opacity:			0
				});

			}

			setTimeout(function() {
				if (photo.getID()===false) return false;
				lychee.goto(album.getID() + '/' + album.json.content[photo.getID()].previousPhoto)
			}, delay);

	}

}

photo.next = function(animate) {

	var delay = 0;

	if (photo.getID()!==false&&
		album.json&&
		album.json.content[photo.getID()]&&
		album.json.content[photo.getID()].nextPhoto!=='') {

			if (animate===true) {

				delay = 200;

				$('#image').css({
					WebkitTransform:	'translateX(-100%)',
					MozTransform:		'translateX(-100%)',
					transform:			'translateX(-100%)',
					opacity:			0
				});

			}

			setTimeout(function() {
				if (photo.getID()===false) return false;
				lychee.goto(album.getID() + '/' + album.json.content[photo.getID()].nextPhoto);
			}, delay);

	}

}

photo.duplicate = function(photoIDs) {

	var params;

	if (!photoIDs) return false;
	if (photoIDs instanceof Array===false) photoIDs = [photoIDs];

	albums.refresh();

	params = 'duplicatePhoto&photoIDs=' + photoIDs;
	lychee.api(params, function(data) {

		if (data!==true) lychee.error(null, params, data);
		else album.load(album.getID());

	});

}

photo.delete = function(photoIDs) {

	var params,
		buttons,
		photoTitle;

	if (!photoIDs) return false;
	if (photoIDs instanceof Array===false) photoIDs = [photoIDs];

	if (photoIDs.length===1) {

		// Get title if only one photo is selected
		if (visible.photo())	photoTitle = photo.json.title;
		else					photoTitle = album.json.content[photoIDs].title;

		// Fallback for photos without a title
		if (photoTitle==='')	photoTitle = _p.untitled();

	}

	buttons = [
		['', function() {

			var nextPhoto		= '',
				previousPhoto	= '';

			photoIDs.forEach(function(id, index, array) {

				// Change reference for the next and previous photo
				if (album.json.content[id].nextPhoto!==''||album.json.content[id].previousPhoto!=='') {

					nextPhoto		= album.json.content[id].nextPhoto;
					previousPhoto	= album.json.content[id].previousPhoto;

					album.json.content[previousPhoto].nextPhoto = nextPhoto;
					album.json.content[nextPhoto].previousPhoto = previousPhoto;

				}

				album.json.content[id] = null;
				view.album.content.delete(id);

			});

			albums.refresh();

			// Go to next photo if there is a next photo and
			// next photo is not the current one. Show album otherwise.
			if (visible.photo()&&nextPhoto!==''&&nextPhoto!==photo.getID()) lychee.goto(album.getID() + '/' + nextPhoto);
			else if (!visible.albums()) lychee.goto(album.getID());

			params = 'deletePhoto&photoIDs=' + photoIDs;
			lychee.api(params, function(data) {

				if (data!==true) lychee.error(null, params, data);

			});

		}],
		['', function() {}]
	];

	buttons[0][0] = _p.delPhotos({NUM_PHOTOS: photoIDs.length});
	buttons[1][0] = _p.keepPhotos({NUM_PHOTOS: photoIDs.length});

	modal.show(buttons[0][0], _p.delPhotosAreYouSure({NUM_PHOTOS: photoIDs.length, PHOTO_TITLE: photoTitle}), buttons);

}

photo.setTitle = function(photoIDs) {

	var oldTitle = '',
		newTitle,
		params,
		buttons;

	if (!photoIDs) return false;
	if (photoIDs instanceof Array===false) photoIDs = [photoIDs];

	if (photoIDs.length===1) {
		// Get old title if only one photo is selected
		if (photo.json)			oldTitle = photo.json.title;
		else if (album.json)	oldTitle = album.json.content[photoIDs].title;
		oldTitle = oldTitle.replace("'", '&apos;');
	}

	buttons = [
		[_p.setTitle(), function() {

			// Get input
			newTitle = $('.message input.text').val();

			// Remove html from input
			newTitle = lychee.removeHTML(newTitle);

			if (visible.photo()) {
				photo.json.title = (newTitle==='') ? _p.untitled() : newTitle;
				view.photo.title();
			}

			photoIDs.forEach(function(id, index, array) {
				album.json.content[id].title = newTitle;
				view.album.content.title(id);
			});

			params = 'setPhotoTitle&photoIDs=' + photoIDs + '&title=' + escape(encodeURI(newTitle));
			lychee.api(params, function(data) {

				if (data!==true) lychee.error(null, params, data);

			});

		}],
		[_p.cancel(), function() {}]
	];

	modal.show(_p.setTitles({NUM_PHOTOS: photoIDs.length}),
	           _p.setTitlesEnter({NUM_PHOTOS: photoIDs.length}) + "<input class='text' type='text' maxlength='30' placeholder='" + _p.title() + "' value='" + oldTitle + "'>",
	           buttons);

}

photo.setAlbum = function(photoIDs, albumID) {

	var params,
		nextPhoto,
		previousPhoto;

	if (!photoIDs) return false;
	if (visible.photo) lychee.goto(album.getID());
	if (photoIDs instanceof Array===false) photoIDs = [photoIDs];

	photoIDs.forEach(function(id, index, array) {

		// Change reference for the next and previous photo
		if (album.json.content[id].nextPhoto!==''||album.json.content[id].previousPhoto!=='') {

			nextPhoto		= album.json.content[id].nextPhoto;
			previousPhoto	= album.json.content[id].previousPhoto;

			album.json.content[previousPhoto].nextPhoto = nextPhoto;
			album.json.content[nextPhoto].previousPhoto = previousPhoto;

		}

		album.json.content[id] = null;
		view.album.content.delete(id);

	});

	albums.refresh();

	params = 'setPhotoAlbum&photoIDs=' + photoIDs + '&albumID=' + albumID;
	lychee.api(params, function(data) {

		if (data!==true) lychee.error(null, params, data);

	});

}

photo.setStar = function(photoIDs) {

	var params;

	if (!photoIDs) return false;
	if (visible.photo()) {
		photo.json.star = (photo.json.star==0) ? 1 : 0;
		view.photo.star();
	}

	photoIDs.forEach(function(id, index, array) {
		album.json.content[id].star = (album.json.content[id].star==0) ? 1 : 0;
		view.album.content.star(id);
	});

	albums.refresh();

	params = 'setPhotoStar&photoIDs=' + photoIDs;
	lychee.api(params, function(data) {

		if (data!==true) lychee.error(null, params, data);

	});

}

photo.setPublic = function(photoID, e) {

	var params;

	if (photo.json.public==2) {

		modal.show(_p.pubAlbum(), _p.pubAlbumInfo(),
		           [[_p.showAlbum(), function() { lychee.goto(photo.json.original_album) }],
		            [_p.close(), function() {}]]);
		return false;

	}

	if (visible.photo()) {

		photo.json.public = (photo.json.public==0) ? 1 : 0;
		view.photo.public();
		if (photo.json.public==1) contextMenu.sharePhoto(photoID, e);

	}

	album.json.content[photoID].public = (album.json.content[photoID].public==0) ? 1 : 0;
	view.album.content.public(photoID);

	albums.refresh();

	params = 'setPhotoPublic&photoID=' + photoID;
	lychee.api(params, function(data) {

		if (data!==true) lychee.error(null, params, data);

	});

}

photo.setDescription = function(photoID) {

	var oldDescription = photo.json.description.replace("'", '&apos;'),
		description,
		params,
		buttons;

	buttons = [
		[_p.setDesc(), function() {

			// Get input
			description = $('.message input.text').val();

			// Remove html from input
			description = lychee.removeHTML(description);

			if (visible.photo()) {
				photo.json.description = description;
				view.photo.description();
			}

			params = 'setPhotoDescription&photoID=' + photoID + '&description=' + escape(encodeURI(description));
			lychee.api(params, function(data) {

				if (data!==true) lychee.error(null, params, data);

			});

		}],
		[_p.cancel(), function() {}]
	];

	modal.show(_p.setDesc(),
	           _p.setDescEnter() + ": <input class='text' type='text' maxlength='800' placeholder='" + _p.description() + "' value='" + oldDescription + "'>",
	           buttons);

}

photo.editTags = function(photoIDs) {

	var oldTags		= '',
		tags		= '',
		buttons;

	if (!photoIDs) return false;
	if (photoIDs instanceof Array===false) photoIDs = [photoIDs];

	// Get tags
	if (visible.photo())						oldTags = photo.json.tags;
	if (visible.album()&&photoIDs.length===1)	oldTags = album.json.content[photoIDs].tags;
	if (visible.album()&&photoIDs.length>1) {
		var same = true;
		photoIDs.forEach(function(id, index, array) {
			if(album.json.content[id].tags===album.json.content[photoIDs[0]].tags&&same===true) same = true;
			else same = false;
		});
		if (same) oldTags = album.json.content[photoIDs[0]].tags;
	}

	// Improve tags
	oldTags = oldTags.replace(/,/g, ', ');

	buttons = [
		[_p.setTags(), function() {

			tags = $('.message input.text').val();

			photo.setTags(photoIDs, tags);

		}],
		[_p.cancel(), function() {}]
	];

	modal.show(_p.setTags(),
	           _p.setTagsEnter({NUM_PHOTOS: photoIDs.length}) + ": <input class='text' type='text' maxlength='800' placeholder='" + _p.tags() + "' value='" + oldTags + "'>",
	           buttons);

}

photo.setTags = function(photoIDs, tags) {

	var params;

	if (!photoIDs) return false;
	if (photoIDs instanceof Array===false) photoIDs = [photoIDs];

	// Parse tags
	tags = tags.replace(/(\ ,\ )|(\ ,)|(,\ )|(,{1,}\ {0,})|(,$|^,)/g, ',');
	tags = tags.replace(/,$|^,|(\ ){0,}$/g, '');

	// Remove html from input
	tags = lychee.removeHTML(tags);

	if (visible.photo()) {
		photo.json.tags = tags;
		view.photo.tags();
	}

	photoIDs.forEach(function(id, index, array) {
		album.json.content[id].tags = tags;
	});

	params = 'setPhotoTags&photoIDs=' + photoIDs + '&tags=' + tags;
	lychee.api(params, function(data) {

		if (data!==true) lychee.error(null, params, data);

	});

}

photo.deleteTag = function(photoID, index) {

	var tags;

	// Remove
	tags = photo.json.tags.split(',');
	tags.splice(index, 1);

	// Save
	photo.json.tags = tags.toString();
	photo.setTags([photoID], photo.json.tags);

}

photo.share = function(photoID, service) {

	var link		= '',
		url			= photo.getViewLink(photoID),
		filename	= 'unknown';

	switch (service) {
		case 0:
			link = 'https://twitter.com/share?url=' + encodeURI(url);
			break;
		case 1:
			link = 'http://www.facebook.com/sharer.php?u=' + encodeURI(url) + '&t=' + encodeURI(photo.json.title);
			break;
		case 2:
			link = 'mailto:?subject=' + encodeURI(photo.json.title) + '&body=' + encodeURI(url);
			break;
		case 3:
			lychee.loadDropbox(function() {
				filename = photo.json.title + '.' + photo.getDirectLink().split('.').pop();
				Dropbox.save(photo.getDirectLink(), filename);
			});
			break;
		default:
			link = '';
			break;
	}

	if (link.length>5) location.href = link;

}

photo.getSize = function() {

	// Size can be 'big', 'medium' or 'small'
	// Default is big
	// Small is centered in the middle of the screen
	var size		= 'big',
		scaled		= false,
		hasMedium	= photo.json.medium!=='',
		pixelRatio	= window.devicePixelRatio,
		view		= {
			width:	$(window).width()-60,
			height:	$(window).height()-100
		};

	// Detect if the photo will be shown scaled,
	// because the screen size is smaller than the photo
	if (photo.json.width>view.width||
		photo.json.height>view.height) scaled = true;

	// Calculate pixel ratio of screen
	if (pixelRatio!==undefined&&pixelRatio>1) {
		view.width	= view.width * pixelRatio;
		view.height	= view.height * pixelRatio;
	}

	// Medium available and
	// Medium still bigger than screen
	if (hasMedium===true&&
		(1920>view.width&&1080>view.height)) size = 'medium';

	// Photo not scaled
	// Photo smaller then screen
	if (scaled===false&&
		(photo.json.width<view.width&&
		photo.json.width<view.height)) size = 'small';

	return size;

}

photo.getArchive = function(photoID) {

	var link,
		url = 'php/api.php?function=getPhotoArchive&photoID=' + photoID;

	if (location.href.indexOf('index.html')>0)	link = location.href.replace(location.hash, '').replace('index.html', url);
	else										link = location.href.replace(location.hash, '') + url;

	if (lychee.publicMode) link += '&password=' + password.value;

	location.href = link;

}

photo.getDirectLink = function() {

	var url = '';

	if (photo.json&&
		photo.json.url&&
		photo.json.url!=='') url = photo.json.url;

	return url;

}

photo.getViewLink = function(photoID) {

	var url = 'view.php?p=' + photoID;

	if (location.href.indexOf('index.html')>0)	return location.href.replace('index.html' + location.hash, url);
	else										return location.href.replace(location.hash, url);

}

/**
 * @description	Searches through your photos and albums.
 * @copyright	2014 by Tobias Reich
 */

search = {

	code: null

}

search.find = function(term) {

	var params,
		albumsData = '',
		photosData = '',
		code;

	clearTimeout($(window).data('timeout'));
	$(window).data('timeout', setTimeout(function() {

		if ($('#search').val().length!==0) {

			params = 'search&term=' + term;
			lychee.api(params, function(data) {

				// Build albums
				if (data&&data.albums) {
					albums.json = { content: data.albums };
					$.each(albums.json.content, function() {
						albums.parse(this);
						albumsData += build.album(this);
					});
				}

				// Build photos
				if (data&&data.photos) {
					album.json = { content: data.photos };
					$.each(album.json.content, function() {
						photosData += build.photo(this);
					});
				}

				// 1. No albums and photos found
				// 2. Only photos found
				// 3. Only albums found
				// 4. Albums and photos found
				if (albumsData===''&&photosData==='')	code = 'error';
				else if (albumsData==='')				code = build.divider('Photos') + photosData;
				else if (photosData==='')				code = build.divider('Albums') + albumsData;
				else									code = build.divider('Photos') + photosData + build.divider('Albums') + albumsData;

				// Only refresh view when search results are different
				if (search.code!==md5(code)) {

					$('.no_content').remove();

					lychee.animate('.album, .photo', 'contentZoomOut');
					lychee.animate('.divider', 'fadeOut');

					search.code = md5(code);

					setTimeout(function() {

						if (code==='error') {
							lychee.content.html('');
							$('body').append(build.no_content('search'));
						} else {
							lychee.content.html(code);
							lychee.animate('.album, .photo', 'contentZoomIn');
							$('img[data-type!="svg"]').retina();
						}

					}, 300);

				}

			});

		} else search.reset();

	}, 250));

}

search.reset = function() {

	$('#search').val('');
	$('.no_content').remove();

	if (search.code!=='') {

		// Trash data
		albums.json	= null;
		album.json	= null;
		photo.json	= null;
		search.code	= '';

		lychee.animate('.divider', 'fadeOut');
		albums.load();

	}

}

/**
 * @description	Lets you change settings.
 * @copyright	2014 by Tobias Reich
 */

var _s = i18n.settings;

settings = {}

settings.createConfig = function() {

	var dbName,
		dbUser,
		dbPassword,
		dbHost,
		dbTablePrefix,
		buttons,
		params;

	buttons = [
		[_s.connect(), function() {

			dbHost			= $('.message input.text#dbHost').val();
			dbUser			= $('.message input.text#dbUser').val();
			dbPassword		= $('.message input.text#dbPassword').val();
			dbName			= $('.message input.text#dbName').val();
			dbTablePrefix	= $('.message input.text#dbTablePrefix').val();

			if (dbHost.length<1) dbHost = 'localhost';
			if (dbName.length<1) dbName = 'lychee';

			params = 'dbCreateConfig&dbName=' + escape(dbName) + '&dbUser=' + escape(dbUser) + '&dbPassword=' + escape(dbPassword) + '&dbHost=' + escape(dbHost) + '&dbTablePrefix=' + escape(dbTablePrefix);
			lychee.api(params, function(data) {

				if (data!==true) {

					// Configuration failed
					setTimeout(function() {

						// Connection failed
						if (data.indexOf('Warning: Connection failed!')!==-1) {

							buttons = [
								[_s.retry(), function() { setTimeout(settings.createConfig, 400) }],
								['', function() {}]
							];
							modal.show(_s.connFailed(), _s.connFailedInfo(), buttons, null, false);
							return false;

						}

						// Creation failed
						if (data.indexOf('Warning: Creation failed!')!==-1) {

							buttons = [
								[_s.retry(), function() { setTimeout(settings.createConfig, 400) }],
								['', function() {}]
							];
							modal.show(_s.creationFailed(), _s.creationFailedInfo(), buttons, null, false);
							return false;

						}

						// Could not create file
						if (data.indexOf('Warning: Could not create file!')!==-1) {

							buttons = [
								[_s.retry(), function() { setTimeout(settings.createConfig, 400) }],
								['', function() {}]
							];
							modal.show(_s.savingFailed(), _s.savingFailedInfo(), buttons, null, false);
							return false;

						}

						// Something went wrong
						buttons = [
							[_s.retry(), function() { setTimeout(settings.createConfig, 400) }],
							['', function() {}]
						];
						modal.show(_s.configFailed(), _s.configFailedInfo(), buttons, null, false); return false;

					}, 400);

				} else {

					// Configuration successful
					window.location.reload();

				}

			});

		}],
		['', function() {}]
	];

	modal.show(_s.config(), _s.configEnter() + ": " +
	           "<input id='dbHost' class='text less' type='text' placeholder='" + _s.dbHost() + "' value=''>" +
	           "<input id='dbUser' class='text less' type='text' placeholder='" + _s.dbUser() + "' value=''>" +
	           "<input id='dbPassword' class='text more' type='password' placeholder='" + _s.dbPassword() + "' value=''><br>" +
	           _s.dbWillBeCreated() +
	           ":<input id='dbName' class='text less' type='text' placeholder='" + _s.dbName() + "' value=''>" +
	           "<input id='dbTablePrefix' class='text more' type='text' placeholder='" + _s.dbTablePrefix() +"' value=''>",
	           buttons, -235, false);

}

settings.createLogin = function() {

	var username,
		password,
		params,
		buttons;

	buttons = [
		[_s.createLogin(), function() {

			username = $('.message input.text#username').val();
			password = $('.message input.text#password').val();

			if (username.length<1||password.length<1) {

				setTimeout(function() {

					buttons = [
						[_s.retry(), function() { setTimeout(settings.createLogin, 400) }],
						['', function() {}]
					];
					modal.show(_s.wrongInput(), _s.wrongInputInfo(), buttons, null, false);
					return false;

				}, 400);

			} else {

				params = 'setLogin&username=' + escape(username) + '&password=' + md5(password);
				lychee.api(params, function(data) {

					if (data!==true) {

						setTimeout(function() {

							buttons = [
								[_s.retry(), function() { setTimeout(settings.createLogin, 400) }],
								['', function() {}]
							];
							modal.show(_s.creationFailed(), _s.loginCreationFailedInfo(), buttons, null, false);
							return false;

						}, 400);

					}

				});

			}

		}],
		['', function() {}]
	];

	modal.show(_s.createLogin(),
	           _s.loginEnter() + ": <input id='username' class='text less' type='text' placeholder='" + _s.newUsername() + "' value=''>" +
	           "<input id='password' class='text' type='password' placeholder='" + _s.newPassword() + "' value=''>",
	           buttons, -122, false);

}

settings.setLogin = function() {

	var old_password,
		username,
		password,
		params,
		buttons;

	buttons = [
		[_s.changeLogin(), function() {

			old_password	= $('.message input.text#old_password').val();
			username		= $('.message input.text#username').val();
			password		= $('.message input.text#password').val();

			if (old_password.length<1) {
				loadingBar.show('error', _s.wrongOldPassword());
				return false;
			}

			if (username.length<1) {
				loadingBar.show('error', _s.wrongNewUsername());
				return false;
			}

			if (password.length<1) {
				loadingBar.show('error', _s.wrongNewPassword());
				return false;
			}

			params = 'setLogin&oldPassword=' + md5(old_password) + '&username=' + escape(username) + '&password=' + md5(password);
			lychee.api(params, function(data) {

				if (data!==true) lychee.error(null, params, data);

			});

		}],
		[_s.cancel(), function() {}]
	];

	modal.show(_s.changeLogin(),
						 _s.oldPasswordEnter() + ": <input id='old_password' class='text more' type='password' placeholder='" + _s.oldPassword() + "' value=''><br>" +
						 _s.loginWillBeChangedTo() +
						 ": <input id='username' class='text less' type='text' placeholder='" + _s.newUsername() + "' value=''>" +
						 "<input id='password' class='text' type='password' placeholder='" + _s.newPassword() + "' value=''>",
						 buttons, -171);

}

settings.setSorting = function() {

	var buttons,
		sorting,
		params;

	buttons = [
		[_s.changeSorting(), function() {

			sorting[0] = $('select#settings_type').val();
			sorting[1] = $('select#settings_order').val();

			albums.refresh();

			params = 'setSorting&type=' + sorting[0] + '&order=' + sorting[1];
			lychee.api(params, function(data) {

				if (data===true) {
					lychee.sorting = 'ORDER BY ' + sorting[0] + ' ' + sorting[1];
					lychee.load();
				} else lychee.error(null, params, data);

			});

		}],
		[_s.cancel(), function() {}]
	];

	modal.show(_s.changeSorting(),
	           _s.sortBy({
	           OPTIONS: "<select id='settings_type'> \
	                       <option value='id'>" + _s.sortId() + "</option> \
	                       <option value='takestamp'>" + _s.sortTakestamp() + "</option> \
	                       <option value='title'>" + _s.sortTitle() + "</option> \
	                       <option value='description'>" + _s.sortDescription() + "</option> \
	                       <option value='public'>" + _s.sortPublic() + "</option> \
	                       <option value='star'>" + _s.sortStar() +"</option> \
	                       <option value='type'>" + _s.sortType() + "</option> \
	                     </select>",
	           ORDER: "<select id='settings_order'> \
	                     <option value='ASC'>" + _s.sortAsc() + "</option> \
	                     <option value='DESC'>" + _s.sortDesc() + "</option> \
	                   </select>"
	           }),
	           buttons);

	if (lychee.sorting!=='') {

		sorting = lychee.sorting.replace('ORDER BY ', '').split(' ');

		$('select#settings_type').val(sorting[0]);
		$('select#settings_order').val(sorting[1]);

	}

}

settings.setDropboxKey = function(callback) {

	var buttons,
		params,
		key;

	buttons = [
		[_s.setKey(), function() {

			key = $('.message input.text#key').val();

			params = 'setDropboxKey&key=' + key;
			lychee.api(params, function(data) {

				if (data===true) {
					lychee.dropboxKey = key;
					if (callback) lychee.loadDropbox(callback);
				} else lychee.error(null, params, data);

			});

		}],
		[_s.cancel(), function() {}]
	];

	modal.show(_s.setDropboxKey(),
	           _s.setDropboxKeyInfo({WEBSITE: "https://www.dropbox.com/developers/apps/create"}) +
	           ": <input id='key' class='text' type='text' placeholder='" + _s.dropboxKey() + "' value='" + lychee.dropboxKey + "'>",
	           buttons);

}

/**
 * @description	Swipes and moves an object.
 * @copyright	2014 by Tobias Reich
 */

swipe = {

	obj:		null,
	tolerance:	150,
	offset:		0

}

swipe.start = function(obj, tolerance) {

	if (obj)		swipe.obj = obj;
	if (tolerance)	swipe.tolerance = tolerance;

	return true;

}

swipe.move = function(e) {

	if (swipe.obj===null) return false;

	swipe.offset = -1 * e.x;

	swipe.obj.css({
		WebkitTransform:	'translateX(' + swipe.offset + 'px)',
		MozTransform:		'translateX(' + swipe.offset + 'px)',
		transform:			'translateX(' + swipe.offset + 'px)'
	});

}

swipe.stop = function(e, left, right) {

	if (e.x<=-swipe.tolerance)		left(true);
	else if (e.x>=swipe.tolerance)	right(true);
	else if (swipe.obj!==null) {
		swipe.obj.css({
			WebkitTransform:	'translateX(0px)',
			MozTransform:		'translateX(0px)',
			transform:			'translateX(0px)'
		});
	}

	swipe.obj		= null;
	swipe.offset	= 0;

}

/**
 * @description	Takes care of every action an album can handle and execute.
 * @copyright	2014 by Tobias Reich
 */

var _u = i18n.upload;

upload = {}

upload.show = function(title, files, callback) {

	upload.close(true);

	$('body').append(build.uploadModal(title, files));

	if (callback!==null&&callback!==undefined) callback();

}

upload.notify = function(title, text) {

	var popup;

	if (!text||text==='') text = _u.done();

	if (!window.webkitNotifications) return false;

	if (window.webkitNotifications.checkPermission()!==0) window.webkitNotifications.requestPermission();

	if (window.webkitNotifications.checkPermission()===0&&title) {
		popup = window.webkitNotifications.createNotification('', title, text);
		popup.show();
	}

}

upload.start = {

	local: function(files) {

		var albumID	= album.getID(),
			error 	= false,
			process	= function(files, file) {

				var formData		= new FormData(),
					xhr				= new XMLHttpRequest(),
					pre_progress	= 0,
					progress		= 0,
					finish = function() {

						window.onbeforeunload = null;

						$('#upload_files').val('');

						if (error===false) {

							// Success
							upload.close();
							upload.notify(_u.complete());

						} else {

							// Error
							$('.upload_message a.close').show();
							upload.notify(_u.complete(), _u.failed());

						}

						albums.refresh();

						if (album.getID()===false) lychee.goto('0');
						else album.load(albumID);

					};

				// Check if file is supported
				if (file.supported===false) {

					// Skip file
					if (file.next!==null) process(files, file.next);
					else {

						// Look for supported files
						// If zero files are supported, hide the upload after a delay

						var hasSupportedFiles = false;

						for (var i = 0; i < files.length; i++) {

							if (files[i].supported===true) {
								hasSupportedFiles = true;
								break;
							}

						}

						if (hasSupportedFiles===false) setTimeout(finish, 2000);

					}

					return false;

				}

				formData.append('function', 'upload');
				formData.append('albumID', albumID);
				formData.append('tags', '');
				formData.append(0, file);

				xhr.open('POST', lychee.api_path);

				xhr.onload = function() {

					var wait		= false,
						errorText	= '';

					file.ready = true;

					// Set status
					if (xhr.status===200&&xhr.responseText==='1') {

						// Success
						$('.upload_message .rows .row:nth-child(' + (file.num+1) + ') .status')
							.html(_u.finished())
							.addClass('success');

					} else {

						// Error
						$('.upload_message .rows .row:nth-child(' + (file.num+1) + ') .status')
							.html(_u.error())
							.addClass('error');

						if (xhr.responseText.substr(0, 6)==='Error:') errorText = xhr.responseText.substr(6) + ' ' + _u.seeConsole();
						else errorText = _u.unknownResponse() + ' ' + _u.seeConsole();

						$('.upload_message .rows .row:nth-child(' + (file.num+1) + ') p.notice')
							.html(errorText)
							.show();

						// Set global error
						error = true;

						// Throw error
						lychee.error(_u.failedWithStatus({STATUS: xhr.status}), xhr, xhr.responseText);

					}

					// Check if there are file which are not finished
					for (var i = 0; i < files.length; i++) {

						if (files[i].ready===false) {
							wait = true;
							break;
						}

					}

					// Finish upload when all files are finished
					if (wait===false) finish();

				};

				xhr.upload.onprogress = function(e) {

					if (e.lengthComputable) {

						// Calculate progress
						progress = (e.loaded / e.total * 100 | 0);

						// Set progress when progress has changed
						if (progress>pre_progress) {
							$('.upload_message .rows .row:nth-child(' + (file.num+1) + ') .status').html(progress + '%');
							pre_progress = progress;
						}

						if (progress>=100) {

							// Scroll to the uploading file
							var scrollPos = 0;
							if ((file.num+1)>4) scrollPos = (file.num + 1 - 4) * 40
							$('.upload_message .rows').scrollTop(scrollPos);

							// Set status to processing
							$('.upload_message .rows .row:nth-child(' + (file.num+1) + ') .status').html(_u.processing());

							// Upload next file
							if (file.next!==null) process(files, file.next);

						}

					}

				};

				xhr.send(formData);

			};

		if (files.length<=0) return false;
		if (albumID===false||visible.albums()===true) albumID = 0;

		for (var i = 0; i < files.length; i++) {

			files[i].num		= i;
			files[i].ready		= false;
			files[i].supported	= true;

			if (i < files.length-1)	files[i].next = files[i+1];
			else					files[i].next = null;

			// Check if file is supported
			if (files[i].type!=='image/jpeg'&&files[i].type!=='image/jpg'&&files[i].type!=='image/png'&&files[i].type!=='image/gif') {

				files[i].ready		= true;
				files[i].supported	= false;

			}

		}

		window.onbeforeunload = function() { return _u.isUploading(); };

		upload.show('Uploading', files);

		// Upload first file
		process(files, files[0]);

	},

	url: function() {

		var albumID = album.getID(),
			params,
			extension,
			buttons,
			link,
			files = [];

		if (albumID===false) albumID = 0;

		buttons = [
			[_u.import(), function() {

				link = $('.message input.text').val();

				if (link&&link.length>3) {

					extension = link.split('.').pop();
					if (extension!=='jpeg'&&extension!=='jpg'&&extension!=='png'&&extension!=='gif'&&extension!=='webp') {
						loadingBar.show('error', _u.unsupportedLinkFormat());
						return false;
					}

					files[0] = {
						name:		link,
						supported:	true
					}

					upload.show(_u.importingUrl(), files, function() {
						$('.upload_message .rows .row .status').html(_u.importing());
					});

					params = 'importUrl&url=' + escape(encodeURI(link)) + '&albumID=' + albumID;
					lychee.api(params, function(data) {

						upload.close();
						upload.notify(_u.importComplete());

						albums.refresh();

						if (album.getID()===false) lychee.goto('0');
						else album.load(albumID);

						if (data!==true) lychee.error(null, params, data);

					});

				} else loadingBar.show('error', _u.unsupportedLinkLength());

			}],
			['Cancel', function() {}]
		];

		modal.show(_u.importFromLink(), _u.directLinkEnter() + ": <input class='text' type='text' placeholder='http://' value='http://'>", buttons);

	},

	server: function() {

		var albumID = album.getID(),
			params,
			buttons,
			files = [],
			path;

		if (albumID===false) albumID = 0;

		buttons = [
			[_u.import(), function() {

				path = $('.message input.text').val();

				files[0] = {
					name:		path,
					supported:	true
				};

				upload.show(_u.importingServer(), files, function() {
					$('.upload_message .rows .row .status').html('Importing');
				});

				params = 'importServer&albumID=' + albumID + '&path=' + escape(encodeURI(path));
				lychee.api(params, function(data) {

					upload.close();
					upload.notify(_u.importingComplete());

					albums.refresh();

					if (data==='Notice: Import only contains albums!') {
						if (visible.albums()) lychee.load();
						else lychee.goto('');
					}
					else if (album.getID()===false) lychee.goto('0');
					else album.load(albumID);

					if (data==='Notice: Import only contains albums!') return true;
					else if (data==='Warning: Folder empty!') lychee.error(_u.serverFolderEmpty(), params, data);
					else if (data!==true) lychee.error(null, params, data);

				});

			}],
			[_u.cancel(), function() {}]
		];

		modal.show(_u.importFromServer(), _u.importFromServerInfo() + " <input class='text' type='text' maxlength='100' placeholder='" + _u.absPath() + "' value='" + lychee.location + "uploads/import/'>", buttons);

	},

	dropbox: function() {

		var albumID = album.getID(),
			params,
			links = '';

		if (albumID===false) albumID = 0;

		lychee.loadDropbox(function() {
			Dropbox.choose({
				linkType: 'direct',
				multiselect: true,
				success: function(files) {

					for (var i = 0; i < files.length; i++) {

						links += files[i].link + ',';

						files[i] = {
							name:		files[i].link,
							supported:	true
						};

					}

					// Remove last comma
					links = links.substr(0, links.length-1);

					upload.show(_u.importingDropbox(), files, function() {
						$('.upload_message .rows .row .status').html(_u.importing());
					});

					params = 'importUrl&url=' + escape(links) + '&albumID=' + albumID;
					lychee.api(params, function(data) {

						upload.close();
						upload.notify(_u.importingComplete());

						albums.refresh();

						if (album.getID()===false) lychee.goto('0');
						else album.load(albumID);

						if (data!==true) lychee.error(null, params, data);

					});

				}
			});
		});

	}

}

upload.close = function(force) {

	if (force===true) {
		$('.upload_overlay').remove();
	} else {
		$('.upload_overlay').removeClass('fadeIn').css('opacity', 0);
		setTimeout(function() { $('.upload_overlay').remove() }, 300);
	}

}

/**
 * @description	Responsible to reflect data changes to the UI.
 * @copyright	2014 by Tobias Reich
 */

var _v = i18n.view;

window.view = {}

view.header = {

	show: function() {

		var newMargin = -1*($('#imageview #image').height()/2)+20;

		clearTimeout($(window).data('timeout'));

		lychee.imageview.removeClass('full');
		lychee.header.removeClass('hidden');
		lychee.loadingBar.css('opacity', 1);

		// Adjust position or size of photo
		if ($('#imageview #image.small').length>0)	$('#imageview #image').css('margin-top', newMargin);
		else										$('#imageview #image').removeClass('full');

	},

	hide: function(e, delay) {

		var newMargin = -1*($('#imageview #image').height()/2);

		if (delay===undefined) delay = 500;

		if (visible.photo()&&!visible.infobox()&&!visible.contextMenu()&&!visible.message()) {

			clearTimeout($(window).data('timeout'));

			$(window).data('timeout', setTimeout(function() {

				lychee.imageview.addClass('full');
				lychee.header.addClass('hidden');
				lychee.loadingBar.css('opacity', 0);

				// Adjust position or size of photo
				if ($('#imageview #image.small').length>0)	$('#imageview #image').css('margin-top', newMargin);
				else										$('#imageview #image').addClass('full');

			}, delay));

		}

	},

	mode: function(mode) {

		var albumID = album.getID();

		switch (mode) {

			case 'albums':

				lychee.header.removeClass('view');
				$('#tools_album, #tools_photo').hide();
				$('#tools_albums').show();

				break;

			case 'album':

				lychee.header.removeClass('view');
				$('#tools_albums, #tools_photo').hide();
				$('#tools_album').show();

				// Hide download button when album empty
				album.json.content === false ? $('#button_archive').hide() : $('#button_archive').show();

				// Hide download button when not logged in and album not downloadable
				if (lychee.publicMode&&album.json.downloadable==='0') $('#button_archive').hide();

				if (albumID==='s'||albumID==='f'||albumID==='r') {
					$('#button_info_album, #button_trash_album, #button_share_album').hide();
				} else if (albumID==='0') {
					$('#button_info_album, #button_share_album').hide();
					$('#button_trash_album').show();
				} else {
					$('#button_info_album, #button_trash_album, #button_share_album').show();
				}

				break;

			case 'photo':

				lychee.header.addClass('view');
				$('#tools_albums, #tools_album').hide();
				$('#tools_photo').show();

				break;

		}

	}

}

view.infobox = {

	show: function() {

		if (!visible.infobox()) $('body').append("<div id='infobox_overlay' class='fadeIn'></div>");
		lychee.infobox.addClass('active');

	},

	hide: function() {

		lychee.animate('#infobox_overlay', 'fadeOut');
		setTimeout(function() { $('#infobox_overlay').remove() }, 300);
		lychee.infobox.removeClass('active');

	}

}

view.albums = {

	init: function() {

		view.albums.title();
		view.albums.content.init();

	},

	title: function() {

		lychee.setTitle(_v.albums(), false);

	},

	content: {

		scrollPosition: 0,

		init: function() {

			var smartData	= '',
				albumsData	= '';

			/* Smart Albums */
			albums.parse(albums.json.unsortedAlbum);
			albums.parse(albums.json.publicAlbum);
			albums.parse(albums.json.starredAlbum);
			albums.parse(albums.json.recentAlbum);
			if (!lychee.publicMode) smartData = build.divider(_v.smartAlbums()) + build.album(albums.json.unsortedAlbum) + build.album(albums.json.starredAlbum) + build.album(albums.json.publicAlbum) + build.album(albums.json.recentAlbum);

			/* Albums */
			if (albums.json.content&&albums.json.num!==0) {

				$.each(albums.json.content, function() {
					albums.parse(this);

					// Display albums in reverse order
					albumsData = build.album(this) + albumsData;
				});

				if (!lychee.publicMode) albumsData = build.divider(_v.albums()) + albumsData;

			}

			if (smartData===''&&albumsData==='') {
				lychee.content.html('');
				$('body').append(build.no_content('share'));
			} else {
				lychee.content.html(smartData + albumsData);
			}

			$('img[data-type!="nonretina"]').retina();

			// Restore scroll position
			if (view.albums.content.scrollPosition!==null) {
				$(document).scrollTop(view.albums.content.scrollPosition);
			}

		},

		title: function(albumID) {

			var prefix		= '',
				longTitle	= '',
				title		= albums.json.content[albumID].title;

			if (albums.json.content[albumID].password) prefix = "<span class='icon-lock'></span> ";

			if (title!==null&&title.length>18) {
				longTitle	= title;
				title		= title.substr(0, 18) + '...';
			}

			$('.album[data-id="' + albumID + '"] .overlay h1')
				.html(prefix + title)
				.attr('title', longTitle);

		},

		delete: function(albumID) {

			$('.album[data-id="' + albumID + '"]').css('opacity', 0).animate({
				width:		0,
				marginLeft:	0
			}, 300, function() {
				$(this).remove();
				if (albums.json.num<=0) lychee.animate('.divider:last-of-type', 'fadeOut');
			});

		}

	}

}

view.album = {

	init: function() {

		album.parse();

		view.album.infobox();
		view.album.title();
		view.album.public();
		view.album.content.init();

		album.json.init = 1;

	},

	hide: function() {

		view.infobox.hide();

	},

	title: function() {

		if ((visible.album()||!album.json.init)&&!visible.photo()) {

			switch (album.getID()) {
				case 'f':
					lychee.setTitle('Starred', false);
					break;
				case 's':
					lychee.setTitle('Public', false);
					break;
				case 'r':
					lychee.setTitle('Recent', false);
					break;
				case '0':
					lychee.setTitle('Unsorted', false);
					break;
				default:
					if (album.json.init) $('#infobox .attr_title').html(album.json.title + ' ' + build.editIcon('edit_title_album'));
					lychee.setTitle(album.json.title, true);
					break;
			}

		}

	},

	content: {

		init: function() {

			var photosData = '';

			// Save and reset scroll position
			view.albums.content.scrollPosition = $(document).scrollTop();
			$('html, body').scrollTop(0);

			$.each(album.json.content, function() {
				photosData += build.photo(this);
			});
			lychee.content.html(photosData);

			$('img[data-type!="svg"]').retina();

		},

		title: function(photoID) {

			var longTitle	= '',
				title		= album.json.content[photoID].title;

			if (title!==null&&title.length>18) {
				longTitle	= title;
				title		= title.substr(0, 18) + '...';
			}

			$('.photo[data-id="' + photoID + '"] .overlay h1')
				.html(title)
				.attr('title', longTitle);

		},

		star: function(photoID) {

			$('.photo[data-id="' + photoID + '"] .icon-star').remove();
			if (album.json.content[photoID].star==1) $('.photo[data-id="' + photoID + '"]').append("<a class='badge red icon-star'></a>");

		},

		public: function(photoID) {

			$('.photo[data-id="' + photoID + '"] .icon-share').remove();
			if (album.json.content[photoID].public==1) $('.photo[data-id="' + photoID + '"]').append("<a class='badge red icon-share'></a>");

		},

		delete: function(photoID) {

			$('.photo[data-id="' + photoID + '"]').css('opacity', 0).animate({
				width:		0,
				marginLeft:	0
			}, 300, function() {
				$(this).remove();
				// Only when search is not active
				if (!visible.albums()) {
					album.json.num--;
					view.album.num();
					view.album.title();
				}
			});

		}

	},

	description: function() {

		$('#infobox .attr_description').html(album.json.description + ' ' + build.editIcon('edit_description_album'));

	},

	num: function() {

		$('#infobox .attr_images').html(album.json.num);

	},

	public: function() {

		if (album.json.public==1) {
			$('#button_share_album a').addClass('active');
			$('#button_share_album').attr('title', _v.shareAlbum());
			$('.photo .icon-share').remove();
			if (album.json.init) $('#infobox .attr_visibility').html('Public');
		} else {
			$('#button_share_album a').removeClass('active');
			$('#button_share_album').attr('title', _v.makePublic());
			if (album.json.init) $('#infobox .attr_visibility').html('Private');
		}

	},

	password: function() {

		if (album.json.password==1) $('#infobox .attr_password').html('Yes');
		else $('#infobox .attr_password').html('No');

	},

	infobox: function() {

		if ((visible.album()||!album.json.init)&&!visible.photo()) lychee.infobox.html(build.infoboxAlbum(album.json)).show();

	}

}

view.photo = {

	init: function() {

		photo.parse();

		view.photo.infobox();
		view.photo.title();
		view.photo.star();
		view.photo.public();
		view.photo.photo();

		photo.json.init = 1;

	},

	show: function() {

		// Change header
		lychee.content.addClass('view');
		view.header.mode('photo');

		// Make body not scrollable
		$('body').css('overflow', 'hidden');

		// Fullscreen
		$(document)
			.bind('mouseenter', view.header.show)
			.bind('mouseleave', view.header.hide);

		lychee.animate(lychee.imageview, 'fadeIn');

	},

	hide: function() {

		view.header.show();
		if (visible.infobox) view.infobox.hide();

		lychee.content.removeClass('view');
		view.header.mode('album');

		// Make body scrollable
		$('body').css('overflow', 'auto');

		// Disable Fullscreen
		$(document)
			.unbind('mouseenter')
			.unbind('mouseleave');

		// Hide Photo
		lychee.animate(lychee.imageview, 'fadeOut');
		setTimeout(function() {
			lychee.imageview.hide();
			view.album.infobox();
		}, 300);

	},

	title: function() {

		if (photo.json.init) $('#infobox .attr_title').html(photo.json.title + ' ' + build.editIcon('edit_title'));
		lychee.setTitle(photo.json.title, true);

	},

	description: function() {

		if (photo.json.init) $('#infobox .attr_description').html(photo.json.description + ' ' + build.editIcon('edit_description'));

	},

	star: function() {

		$('#button_star a').removeClass('icon-star-empty icon-star');
		if (photo.json.star==1) {
			// Starred
			$('#button_star a').addClass('icon-star');
			$('#button_star').attr('title', _v.unstarPhoto());
		} else {
			// Unstarred
			$('#button_star a').addClass('icon-star-empty');
			$('#button_star').attr('title', _v.starPhoto());
		}

	},

	public: function() {

		if (photo.json.public==1||photo.json.public==2) {
			// Photo public
			$('#button_share a').addClass('active');
			$('#button_share').attr('title', _v.sharePhoto());
			if (photo.json.init) $('#infobox .attr_visibility').html('Public');
		} else {
			// Photo private
			$('#button_share a').removeClass('active');
			$('#button_share').attr('title', _v.makePublic());
			if (photo.json.init) $('#infobox .attr_visibility').html('Private');
		}

	},

	tags: function() {

		$('#infobox #tags').html(build.tags(photo.json.tags));

	},

	photo: function() {

		lychee.imageview.html(build.imageview(photo.json, photo.getSize(), visible.controls()));

		if ((album.json&&album.json.content&&album.json.content[photo.getID()]&&album.json.content[photo.getID()].nextPhoto==='')||lychee.viewMode) $('a#next').hide();
		if ((album.json&&album.json.content&&album.json.content[photo.getID()]&&album.json.content[photo.getID()].previousPhoto==='')||lychee.viewMode) $('a#previous').hide();

	},

	infobox: function() {

		lychee.infobox.html(build.infoboxPhoto(photo.json)).show();

	}

}

/**
 * @name        Visible Module
 * @description	This module is used to check if elements are visible or not.
 * @author		Tobias Reich
 * @copyright	2014 by Tobias Reich
 */

visible = {}

visible.albums = function() {
	if ($('#tools_albums').css('display')==='block') return true;
	return false;
}

visible.album = function() {
	if ($('#tools_album').css('display')==='block') return true;
	return false;
}

visible.photo = function() {
	if ($('#imageview.fadeIn').length>0) return true;
	return false;
}

visible.search = function() {
	if (search.code!==null&&search.code!=='') return true;
	return false;
}

visible.infobox = function() {
	if ($('#infobox.active').length>0) return true;
	return false;
}

visible.infoboxbutton = function() {
	if (visible.albums()) return false;
	if (visible.photo()) return true;
	if (visible.album()&&$('#button_info_album:visible').length>0) return true;
	return false;
}

visible.controls = function() {
	if (lychee.loadingBar.css('opacity')<1) return false;
	return true;
}

visible.message = function() {
	if ($('.message').length>0) return true;
	return false;
}

visible.signin = function() {
	if ($('.message .sign_in').length>0) return true;
	return false;
}

visible.contextMenu = function() {
	return basicContext.visible();
}

visible.multiselect = function() {
	if ($('#multiselect').length>0) return true;
	return false;
}

/*
 * @description	This module is used to generate HTML-Code.
 * @copyright	2014 by Tobias Reich
 */
var _b;

_b = i18n.build;

window.build = {};

build.divider = function(title) {
  return "<div class='divider fadeIn'><h1>" + title + "</h1></div>";
};

build.editIcon = function(id) {
  return "<div id='" + id + "' class='edit'><a class='icon-pencil'></a></div>";
};

build.multiselect = function(top, left) {
  return "<div id='multiselect' style='top: " + top + "px; left: " + left + "px;'></div>";
};

build.album = function(data) {
  var html, longTitle, title, typeThumb;
  if (data == null) {
    return '';
  }
  title = data.title;
  longTitle = '';
  typeThumb = '';
  if ((title != null) && title.length > 18) {
    title = data.title.substr(0, 18) + '&hellip;';
    longTitle = data.title;
  }
  if (data.thumb0.split('.').pop() === 'svg') {
    typeThumb = 'nonretina';
  }
  html = "<div  class='album' data-id='" + data.id + "' data-password='" + data.password + "'>\n	<img src='" + data.thumb2 + "' width='200' height='200' alt='thumb' data-type='nonretina'>\n	<img src='" + data.thumb1 + "' width='200' height='200' alt='thumb' data-type='nonretina'>\n	<img src='" + data.thumb0 + "' width='200' height='200' alt='thumb' data-type='" + typeThumb + "'>\n	<div class='overlay'>";
  if (data.password && lychee.publicMode === false) {
    html += "<h1 title='" + longTitle + "'><span class='icon-lock'></span> " + title + "</h1>";
  } else {
    html += "<h1 title='" + longTitle + "'>" + title + "</h1>";
  }
  html += "	<a>" + data.sysdate + "</a>\n</div>";
  if (lychee.publicMode === false) {
    if (data.star === '1') {
      html += "<a class='badge icon-star'></a>";
    }
    if (data["public"] === '1') {
      html += "<a class='badge icon-share'></a>";
    }
    if (data.unsorted === '1') {
      html += "<a class='badge icon-reorder'></a>";
    }
    if (data.recent === '1') {
      html += "<a class='badge icon-time'></a>";
    }
  }
  html += "</div>";
  return html;
};

build.photo = function(data) {
  var html, longTitle, title;
  if (data == null) {
    return '';
  }
  title = data.title;
  longTitle = '';
  if ((title != null) && title.length > 18) {
    title = data.title.substr(0, 18) + '&hellip;';
    longTitle = data.title;
  }
  html = "<div class='photo' data-album-id='" + data.album + "' data-id='" + data.id + "'>\n	<img src='" + data.thumbUrl + "' width='200' height='200' alt='thumb'>\n	<div class='overlay'>\n		<h1 title='" + longTitle + "'>" + title + "</h1>";
  if (data.cameraDate === '1') {
    html += "<a><span class='icon-camera' title='Photo Date'></span>" + data.sysdate + "</a>";
  } else {
    html += "<a>" + data.sysdate + "</a>";
  }
  html += "</div>";
  if (data.star === '1') {
    html += "<a class='badge icon-star'></a>";
  }
  if (lychee.publicMode === false && data["public"] === '1' && album.json["public"] !== '1') {
    html += "<a class='badge icon-share'></a>";
  }
  html += "</div>";
  return html;
};

build.imageview = function(data, size, visibleControls) {
  var html;
  if (data == null) {
    return '';
  }
  html = "<div class='arrow_wrapper previous'><a id='previous' class='icon-caret-left'></a></div>\n<div class='arrow_wrapper next'><a id='next' class='icon-caret-right'></a></div>";
  if (size === 'big') {
    if (visibleControls === true) {
      html += "<div id='image' style='background-image: url(" + data.url + ")'></div>";
    } else {
      html += "<div id='image' style='background-image: url(" + data.url + ");' class='full'></div>";
    }
  } else if (size === 'medium') {
    if (visibleControls === true) {
      html += "<div id='image' style='background-image: url(" + data.medium + ")'></div>";
    } else {
      html += "<div id='image' style='background-image: url(" + data.medium + ");' class='full'></div>";
    }
  } else if (size === 'small') {
    if (visibleControls === true) {
      html += "<div id='image' class='small' style='background-image: url(" + data.url + "); width: " + data.width + "px; height: " + data.height + "px; margin-top: -" + (parseInt(data.height / 2 - 20)) + "px; margin-left: -" + (data.width / 2) + "px;'></div>";
    } else {
      html += "<div id='image' class='small' style='background-image: url(" + data.url + "); width: " + data.width + "px; height: " + data.height + "px; margin-top: -" + (parseInt(data.height / 2)) + "px; margin-left: -" + (data.width / 2) + "px;'></div>";
    }
  }
  return html;
};

build.no_content = function(typ) {
  var html;
  html = "<div class='no_content fadeIn'>\n	<a class='icon icon-" + typ + "'></a>";
  switch (typ) {
    case 'search':
      html += "<p>" + (_b.noSearch()) + "</p>";
      break;
    case 'share':
      html += "<p>" + (_b.noShare()) + "</p>";
      break;
    case 'cog':
      html += "<p>" + (_b.noCog()) + "</p>";
  }
  html += "</div>";
  return html;
};

build.modal = function(title, text, button, marginTop, closeButton) {
  var custom_style, html;
  if (marginTop != null) {
    custom_style = "style='margin-top: " + marginTop + "px;'";
  } else {
    custom_style = '';
  }
  html = "<div class='message_overlay fadeIn'>\n	<div class='message center' " + custom_style + ">\n		<h1>" + title + "</h1>";
  if (closeButton !== false) {
    html += "<a class='close icon-remove-sign'></a>";
  }
  html += "<p>" + text + "</p>";
  $.each(button, function(index) {
    if (this[0] !== '') {
      if (index === 0) {
        return html += "<a class='button active'>" + this[0] + "</a>";
      } else {
        return html += "<a class='button'>" + this[0] + "</a>";
      }
    }
  });
  html += "	</div>\n</div>";
  return html;
};

build.signInModal = function() {
  var html;
  html = "<div class='message_overlay'>\n	<div class='message center'>\n		<h1><a class='icon-lock'></a> " + (_b.signIn()) + "</h1>\n		<a class='close icon-remove-sign'></a>\n		<div class='sign_in'>\n			<input id='username' type='text' value='' placeholder='" + (_b.username()) + "' autocapitalize='off' autocorrect='off'>\n			<input id='password' type='password' value='' placeholder='" + (_b.password()) + "'>\n		</div>\n		<div id='version'>" + (_b.version()) + " " + lychee.version + "<span> &#8211; <a target='_blank' href='" + lychee.updateURL + "'>" + (_b.updateAvail()) + "</a><span></div>\n		<a onclick='lychee.login()' class='button active'>Sign in</a>\n	</div>\n</div>";
  return html;
};

build.uploadModal = function(title, files) {
  var file, html, i;
  html = "<div class='upload_overlay fadeIn'>\n	<div class='upload_message center'>\n		<h1>" + title + "</h1>\n		<a class='close icon-remove-sign'></a>\n		<div class='rows'>";
  i = 0;
  file = null;
  while (i < files.length) {
    file = files[i];
    if (file.name.length > 40) {
      file.name = file.name.substr(0, 17) + '&hellip;' + file.name.substr(file.name.length - 20, 20);
    }
    html += "<div class='row'>\n	<a class='name'>" + (lychee.escapeHTML(file.name)) + "</a>";
    if (file.supported === true) {
      html += "<a class='status'></a>";
    } else {
      html += "<a class='status error'>" + (_b.notSupported()) + "</a>";
    }
    html += "	<p class='notice'></p>\n</div>";
    i++;
  }
  html += "		</div>\n	</div>\n</div>";
  return html;
};

build.tags = function(tags, forView) {
  var editTagsHTML, html;
  html = '';
  if (forView === true || lychee.publicMode === true) {
    editTagsHTML = '';
  } else {
    editTagsHTML = ' ' + build.editIcon('edit_tags');
  }
  if (tags !== '') {
    tags = tags.split(',');
    tags.forEach(function(tag, index, array) {
      return html += "<a class='tag'>" + tag + "<span class='icon-remove' data-index='" + index + "'></span></a>";
    });
    html += editTagsHTML;
  } else {
    html = "<div class='empty'>" + (_b.noTags()) + editTagsHTML + "</div>";
  }
  return html;
};

build.infoboxPhoto = function(data, forView) {
  var editDescriptionHTML, editTitleHTML, exifHash, html, infos, visible;
  html = "<div class='header'><h1>" + (_b.about()) + "</h1><a class='icon-remove-sign'></a></div>\n<div class='wrapper'>";
  switch (data["public"]) {
    case '0':
      visible = _b.no();
      break;
    case '1':
      visible = _b.yes();
      break;
    case '2':
      visible = _b.yesAlbum();
      break;
    default:
      visible = '-';
  }
  if (forView === true || lychee.publicMode === true) {
    editTitleHTML = '';
  } else {
    editTitleHTML = ' ' + build.editIcon('edit_title');
  }
  if (forView === true || lychee.publicMode === true) {
    editDescriptionHTML = '';
  } else {
    editDescriptionHTML = ' ' + build.editIcon('edit_description');
  }
  infos = [['', _b.basics()], [_b.title(), data.title + editTitleHTML], [_b.uploaded(), data.sysdate], [_b.description(), data.description + editDescriptionHTML], ['', _b.image()], [_b.size(), data.size], [_b.format(), data.type], [_b.resolution(), data.width + ' x ' + data.height], [_b.tags(), build.tags(data.tags, forView)]];
  exifHash = data.takestamp + data.make + data.model + data.shutter + data.aperture + data.focal + data.iso;
  if (exifHash !== '0' || exifHash !== '0') {
    infos = infos.concat([['', _b.camera()], [_b.takedate(), data.takedate], [_b.make(), data.make], [_b.model(), data.model], [_b.shutter(), data.shutter], [_b.aperture(), data.aperture], [_b.focal(), data.focal], [_b.iso(), data.iso]]);
  }
  infos = infos.concat([['', _b.share()], [_b["public"](), visible]]);
  infos.forEach(function(info, i, items) {
    if (info[1] === '' || (info[1] == null)) {
      info[1] = '-';
    }
    switch (info[0]) {
      case '':
        return html += "</table>\n<div class='separator'><h1>" + info[1] + "</h1></div>\n<table>";
      case 'Tags':
        if (forView !== true && lychee.publicMode === false) {
          return html += "</table>\n<div class='separator'><h1>" + info[0] + "</h1></div>\n<div id='tags'>" + info[1] + "</div>";
        }
        break;
      default:
        return html += "<tr>\n	<td>" + info[0] + "</td>\n	<td class='attr_" + (info[0].toLowerCase()) + "'>" + info[1] + "</td>\n</tr>";
    }
  });
  html += "</table>\n<div class='bumper'></div>\n</div>";
  return html;
};

build.infoboxAlbum = function(data, forView) {
  var downloadable, editDescriptionHTML, editTitleHTML, html, infos, password, visible;
  html = "<div class='header'><h1>" + (_b.about()) + "</h1><a class='icon-remove-sign'></a></div>\n<div class='wrapper'>";
  switch (data["public"]) {
    case '0':
      visible = 'No';
      break;
    case '1':
      visible = 'Yes';
      break;
    default:
      visible = '-';
  }
  switch (data.password) {
    case false:
      password = 'No';
      break;
    case true:
      password = 'Yes';
      break;
    default:
      password = '-';
  }
  switch (data.downloadable) {
    case '0':
      downloadable = 'No';
      break;
    case '1':
      downloadable = 'Yes';
      break;
    default:
      downloadable = '-';
  }
  if (forView === true || lychee.publicMode === true) {
    editTitleHTML = '';
  } else {
    editTitleHTML = ' ' + build.editIcon('edit_title_album');
  }
  if (forView === true || lychee.publicMode === true) {
    editDescriptionHTML = '';
  } else {
    editDescriptionHTML = ' ' + build.editIcon('edit_description_album');
  }
  infos = [['', _b.basics()], [_b.title(), data.title + editTitleHTML], [_b.description(), data.description + editDescriptionHTML], ['', _b.album()], [_b.created(), data.sysdate], [_b.images(), data.num], ['', _b.share()], [_b["public"](), visible], [_b.downloadable(), downloadable], [_b.usesPassword(), password]];
  infos.forEach(function(info, i, items) {
    if (info[0] === '') {
      return html += "</table>\n<div class='separator'><h1>" + info[1] + "</h1></div>\n<table id='infos'>";
    } else {
      return html += "<tr>\n	<td>" + info[0] + "</td>\n	<td class='attr_" + (info[0].toLowerCase()) + "'>" + info[1] + "</td>\n</tr>";
    }
  });
  html += "</table>\n<div class='bumper'></div>\n</div>";
  return html;
};
