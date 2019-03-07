!function(a){"use strict";function p(a,b,c,d){var e,f,g,h,i,j,k;if("undefined"==typeof WebViewJavascriptBridge)return console.log("未定义WebViewJavascriptBridge");if(e=b||{},f=function(b){console.log("默认成功回调",a,b)},g=function(b){console.log("默认失败回调",a,b)},c&&(f=c),d&&(g=d),h=function(a){var b,c,d;console.log("统一响应：",a),m.ios?(b=a||{},c=b.code,d=JSON.parse(b.result).data,"0"===d.code?f&&f.call(null,d):g&&g.call(null,d,c)):m.android&&("string"==typeof a?(b=JSON.parse(a)||{},c=b.code,d=b.data):(b=b=a||{},c=b.code,d=b.type&&"callback"==b.type?JSON.parse(b.result).data:b.data),"0"===d.code?f&&f.call(null,d):g&&g.call(null,d,c))},i=!0,m.android)switch(a){case"common.image.preview":for(j=[],k=0;k<e.urls.length;k++)j.push("http"==e.urls[k].split("://")[0]?e.urls[k]:e.urls[k].split(",")[1]?e.urls[k].split(",")[1]:e.urls[k]);e.urls=j}m.android?i?(WebViewJavascriptBridge.registerHandler(a,function(a,b){h({code:"0",msg:"成功",result:a,type:"callback"}),b&&b({code:"0",msg:"成功"})}),WebViewJavascriptBridge.callHandler(a,e,h)):WebViewJavascriptBridge.callHandler(a,e,h):m.ios&&(i?(WebViewJavascriptBridge.registerHandler(a,function(a,b){h({code:"0",msg:"成功",result:a,type:"callback"}),b&&b({code:"0",msg:"成功"})}),WebViewJavascriptBridge.callHandler(a,e,h)):WebViewJavascriptBridge.callHandler(a,e,h))}var g,h,i,j,k,l,m,n,b=["backbutton"],c=["common.navigation.setTitle","common.navigation.setRight","common.navigation.close","common.navigation.setColors","common.image.choose","common.image.upload","common.image.preview","common.image.save","common.file.choose","app.disk.choose","common.file.upload","common.location.open","common.location.get","common.message.share","common.phone.vibrate","common.connection.getNetworkType","common.phone.getUUID","common.phone.getInterface","common.screen.keepAwake","common.screen.breakAwake","app.device.bind","app.user.telephoneCall","app.user.chatOpen","app.user.select","app.department.select","common.notification.showPreloader","common.notification.hidePreloader","common.notification.toast","common.notification.prompt","app.organization.create","app.organization.select","app.config.init","app.method.transit","app.method.orgCreate","app.method.checkJsApis","app.session.get","app.user.get","app.organization.get","app.code.scan","common.navigation.hide","common.navigation.show","common.navigation.goBack","common.webview.close","common.modal.show","app.storage.get","app.storage.getInfo","app.storage.set","app.storage.remove","app.storage.clear","device.sdk.init","device.sdk.api","device.sdk.destory"],d="1.0.6",e=a.navigator.userAgent,f=e.match(/DeliAppv+[a-zA-Z0-9.-]+/);null===f&&(f=e.match(/DeliAppv+[a-zA-Z0-9.-]+/)),g=f,h=!1,i=null,j="app.method.checkJsApis",k=null,l=!1,m={ios:/iPhone|iPad|iPod/i.test(e),android:/Android/i.test(e),version:g,isDeliApp:function(){return this.version&&this.version.length>0?!0:!1},type:function(a){return Object.prototype.toString.call(a).match(/^\[object\s(.*)\]$/)[1]},config:function(a){a&&(i={appId:a.appId||-1,timestamp:a.timestamp,noncestr:a.noncestr,sign:a.signature})},error:function(a){k=a},ready:function(c){var e=function(a){if(!a)return console.log("bridge初始化失败");if(null!==i&&i.sign){if(m.ios)a.callHandler(j,i,function(b){var d=b||{},e=d.code,f=d.msg||"",g=d.data.result;0==e&&1==g?c(a):setTimeout(function(){k&&k({code:-1,msg:"权限校验失败 "+f})})});else if(m.android){var e={path:"/app/premission/check/public",type:"get",params:i};a.callHandler(j,e,function(b){var d=JSON.parse(b)||{},e=d.code,f=d.msg||"",g=d.data.data.result;0==e&&1==g?c(a):setTimeout(function(){k&&k({code:-1,msg:"权限校验失败 "+f})})})}}else setTimeout(function(){k&&k({code:-1,msg:"权限校验失败 配置签名对象错误"})});h===!1&&(h=!0,b.forEach(function(b){a.registerHandler(b,function(a,c){var d=document.createEvent("HTMLEvents");d.data=a,d.initEvent(b),document.dispatchEvent(d),c&&c({code:"0",msg:"成功"})})}),null===i&&{url:encodeURIComponent(window.location.href),js:d})},f=function(a){if(window.WebViewJavascriptBridge)return a(WebViewJavascriptBridge);if(window.WVJBCallbacks)return window.WVJBCallbacks.push(a);window.WVJBCallbacks=[a];var b=document.createElement("iframe");b.style.display="none",b.src="wvjbscheme://__BRIDGE_LOADED__",document.documentElement.appendChild(b),setTimeout(function(){document.documentElement.removeChild(b)},0)};if(m.ios&&a.WebViewJavascriptBridge){try{WebViewJavascriptBridge.init(function(a,b){console.log("WebViewJavascriptBridge init: ",a,b)})}catch(g){console.log(g.msg)}return e(WebViewJavascriptBridge)}if(m.android&&a.WebViewJavascriptBridge){try{WebViewJavascriptBridge.init(function(a,b){console.log("WebViewJavascriptBridge init: ",a,b)})}catch(g){console.log(g.msg)}return e(WebViewJavascriptBridge)}if(m.ios)console.log("开始监听WebViewJavascriptBridgeReady事件"),f(function(){l=!0,e(WebViewJavascriptBridge)});else{if(!m.android)return console.log("很抱歉，尚未支持您所持设备");console.log("开始监听WebViewJavascriptBridgeReady事件"),document.addEventListener("WebViewJavascriptBridgeReady",function(){if("undefined"==typeof WebViewJavascriptBridge)return console.log("WebViewJavascriptBridge 未定义");try{WebViewJavascriptBridge.init(function(){})}catch(a){console.log(a.msg)}l=!0,e(WebViewJavascriptBridge)},!1)}}},n=function(a,b){var e,f,c=a.split("."),d=m;for(e=0,f=c.length;f>e;e++)e===f-1&&(d[c[e]]=b),"undefined"==typeof d[c[e]]&&(d[c[e]]={}),d=d[c[e]]},c.forEach(function(a){n(a,function(b,c,d){p(a,b,c,d)})}),a.deli=m,"object"==typeof module&&module&&"object"==typeof module.exports?module.exports=m:"function"==typeof define&&(define.amd||define.cmd)&&define(function(){return m})}(this);