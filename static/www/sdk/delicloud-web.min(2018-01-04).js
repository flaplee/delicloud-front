(function(g){var z=!1,n=null,h=null,k=null;(function(){function a(c,a,b){c+=-1==c.indexOf("?")?"?":"&";return c+=encodeURIComponent(a)+"="+encodeURIComponent(b)}function b(c){var a="",b,d;for(d in c)b=d+"="+c[d],a+=b+"&";return a.slice(0,a.length-1)}var e=function(c){this.config={url:"",type:"get",async:!0,dataType:"json",contentType:"application/x-www-form-urlencoded; charset=UTF-8",data:{}};this.start(c)},d=null;e.init=function(c){new e(c)};e.prototype={constructor:e,createXHR:function(){if("undefined"!= typeof XMLHttpRequest)return new XMLHttpRequest;if("undefined"!=typeof ActiveXObject){if("string"!=typeof arguments.callee.activeXString){var c=["MSXML2.XMLHttp.6.0","MSXML2.XMLHttp.3.0","MSXML2.XMLHttp"],a,b;a=0;for(b=c.length;a<b;a++)try{new ActiveXObject(c[a]);arguments.callee.activeXString=c[a];break}catch(x){}}return new ActiveXObject(arguments.callee.activeXString)}throw Error("No XHR object available.");},start:function(c){d=new this.createXHR;if(c.url)this.config.url=c.url;else throw Error("url cannot be null!"); c.type&&(this.config.type=c.type);c.async&&(this.config.async=c.async);c.dataType&&(this.config.dataType=c.dataType);c.data&&(this.config.data=c.data);c.success&&(this.config.success=c.success);c.fail&&(this.config.fail=c.fail);c.beforeSend&&c.beforeSend();var e=function(){if(4==d.readyState)if(200<=d.status&&300>d.status||304==d.status)c.success&&c.success(d.responseText);else if(c.fail)c.fail();else throw Error("Request was unsucessful:"+d.status);};if("json"==this.config.dataType||"JSON"==this.config.dataType){if("GET"== this.config.type||"get"==this.config.type){for(var f in this.config.data)this.config.url=a(this.config.url,f,this.config.data[f]);d.onreadystatechange=e;d.open(this.config.type,this.config.url,this.config.async);d.send(null)}if("POST"==this.config.type||"post"==this.config.type)d.addEventListener("readystatechange",e),d.open(this.config.type,this.config.url,this.config.async),c.contentType&&(this.config.contentType=c.contentType),d.setRequestHeader("Content-Type",this.config.contentType),d.send(b(this.config.data))}else if("jsonp"== this.config.dataType||"JSONP"==this.config.dataType){if("GET"==this.config.type||"get"==this.config.type){if(c.url&&c.callback)this.config.callback=c.callback;else throw Error("params is illegal!");var x=document.getElementsByTagName("head")[0];this.config[this.config.callback]="callback";var l=document.createElement("script");x.appendChild(l);g.callback=function(a){x.removeChild(l);clearTimeout(l.timer);g.callback=null;c.success&&c.success(a)};c.time&&(l.timer=setTimeout(function(){x.removeChild(l); c.fail&&c.fail({message:"over time"});g.callback=null},c.time));this.config.url+="?callback=callback";for(f in this.config.data)this.config.url=a(this.config.url,f,this.config.data[f]);l.src=this.config.url}}else throw Error("dataType is error!");}};g.deliApi=e})();var t={version:"0.0.1",init:function(a){var b=this;!1===z&&(z=!0,null!==n&&n.sign?deliApi.init({url:"http://t.delicloud.com/web/v1.0/cd/premission/check/public",type:"get",dataType:"jsonp",data:n,callback:"callback",success:function(a){if(0== a.code)void 0===b.util.getQuery("user_id")&&"undefined"==b.util.getCookie("user_id")&&void 0===b.util.getQuery("token")&&"undefined"==b.util.getCookie("token")?(alert("\u7528\u6237\u672a\u767b\u5f55\u6216\u8005\u767b\u5f55\u4fe1\u606f\u5df2\u7ecf\u8fc7\u671f\uff0c\u8bf7\u91cd\u65b0\u767b\u5f55"),g.location.href="http://t.delicloud.com/oauth/?redirect="+location.href):b.prefixLoadTpl(b.util.getQuery("user_id")||b.util.getCookie("user_id"),b.util.getQuery("token")||b.util.getCookie("token")),k&&k({data:a.data}); else{var d=a.msg?a.msg:"\u7f51\u7edc\u6216\u670d\u52a1\u5668\u9519\u8bef",c=a.msg?"-1":"-3";setTimeout(function(){h&&h({message:"\u6743\u9650\u6821\u9a8c\u5931\u8d25 "+d,errorCode:c})})}},fail:function(a){var b=a.msg?a.msg:"\u7f51\u7edc\u6216\u670d\u52a1\u5668\u9519\u8bef",c=a.msg?"-1":"-3";setTimeout(function(){h&&h({message:"\u6743\u9650\u6821\u9a8c\u5931\u8d25 "+b,errorCode:c})})}}):console.log("\u914d\u7f6e\u9519\u8bef\uff0c\u8bf7\u91cd\u65b0\u586b\u5199\u914d\u7f6e",n))},config:function(a){a&& (n={appId:a.appId||-1,timestamp:a.timestamp,noncestr:a.noncestr,sign:a.signature},a.appId&&(n.appId=a.appId),this.init(a))},api:function(a){var b=new XMLHttpRequest,e=a.type||"post",d=a.url;if("get"===e&&a.data){var c=[],u;for(u in a.data)a.data.hasOwnProperty(u)&&c.push(u+"="+a.data[u]);d=d+"?"+c.join("&")}b.open(e,d,!0);a.data||(a.data={});b.onreadystatechange=function(){var c;if(4===b.readyState){if(200===b.status){try{c=JSON.parse(b.responseText)}catch(x){}c?0==c.code?"function"===typeof a.success&& a.success(c):("function"===typeof a.error?a.error(c):a.silent||alert(c.msg),9102112==c.code&&(alert(c.msg),g.location.href="http://t.delicloud.com/oauth/?redirect="+location.href)):"function"===typeof a.error?a.error(b,"parse_error"):a.silent||alert("\u6570\u636e\u89e3\u6790\u5931\u8d25: "+b.responseText)}else"function"===typeof a.error?a.error(b,"network_error"):a.silent||alert("\u7f51\u7edc\u6216\u670d\u52a1\u5668\u9519\u8bef: "+b.status);"function"===typeof a.complete&&a.complete(b)}};a.data instanceof FormData?(a.dauth&&b.setRequestHeader("Dauth",a.dauth),b.send(a.data)):(b.setRequestHeader("content-type","application/json"),a.dauth&&b.setRequestHeader("Dauth",a.dauth),b.send(JSON.stringify(a.data)))},apiJsonp:function(a){a=a||{};if(!a.url||!a.callback)throw Error("\u53c2\u6570\u4e0d\u5408\u6cd5");var b=("jsonp_"+Math.random()).replace(".",""),e=document.getElementsByTagName("head")[0];a.data[a.callback]=b;var d=function(a){var c=[],b;for(b in a)c.push(encodeURIComponent(b)+"="+encodeURIComponent(a[b])); return c.join("&")}(a.data),c=document.createElement("script");e.appendChild(c);g[b]=function(d){e.removeChild(c);clearTimeout(c.timer);g[b]=null;a.success&&a.success(d)};c.src=a.url+"?"+d;a.time&&(c.timer=setTimeout(function(){g[b]=null;e.removeChild(c);a.fail&&a.fail({message:"\u8d85\u65f6"})},time))},error:function(a){h=a},ready:function(a){k=a},prefixLoadTpl:function(a,b){var e=this,d={init:function(){document.head.innerHTML+="<style>body,button,dd,div,dl,dt,fieldset,form,h1,h2,h3,h4,h5,h6,input,legend,li,ol,p,td,textarea,th,ul{margin:0;padding:0}i{font-style:normal}ul{list-style:none}table{border-collapse:collapse;border-spacing:0}body{font-size:12px;font-family:Microsoft YaHei UI,'\u5fae\u8f6f\u96c5\u9ed1',Heiti SC,Droid Sans;color:#666;background-color:#fff}.deli-wrap-header a{color:#666;text-decoration:none;hide-focus:expression(this.hideFocus=true);outline:0}.deli-wrap-header a:hover{text-decoration:none}.deli-wrap-header a img{border:none}.deli-wrap-header .pointer{cursor:pointer}.deli-wrap-header{width:100%;min-height:62px;background-color:#FDFDFD;box-shadow:0 2px 4px 0 rgba(0,0,0,.04)}.deli-wrap-deli-footer{background-color:#cfd2d7;margin:0 auto}.deli-wrap-header.deli-wrap-top{background:#fff}.deli-wrap-header.deli-wrap-top.deli-wrap-top-shadow{-webkit-box-shadow:0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12),0 2px 4px -1px rgba(0,0,0,.2);box-shadow:0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12),0 2px 4px -1px rgba(0,0,0,.2)}.deli-wrap-header .deli-user-head{width:1200px;height:80px;margin:0 auto;background-color:#fff}.deli-clear:after{visibility:hidden;display:block;font-size:0;content:' ';clear:both;height:0}.deli-clear{zoom:1}.deli-wrap-header .user-float{background-color:#fff;position:fixed;width:100%;min-width:1200px;margin:auto;top:0;left:0;z-index:3;box-shadow:0 2px 5px rgba(0,0,0,.2)}.deli-wrap-header #deli-head{height:100%;z-index:1;position:relative;z-index:100;clear:both;height:80px;background:#fff;font-size:12px}.deli-wrap-header #deli-head .deli-logo-box{display:inline-block;float:left;width:235px;height:80px}.deli-wrap-header #deli-head .deli-logo-box .deli-logo{display:inline-block;float:left;width:235px;height:38px;line-height:80px;background:url('http://t.static.delicloud.com/www/home/images/logo.png') no-repeat;background-size:100% 100%;margin:20px 0}.deli-wrap-header #deli-head .deli-nav-top{height:40px;float:right;margin:20px 0}.deli-wrap-header #deli-head .deli-nav-top .deli-nav-item{display:inline-block;-width:85px;height:40px;line-height:40px;margin-left:25px;float:left;position:relative}.deli-wrap-header #deli-head .deli-nav-top .deli-nav-item.deli-nav-item-team{display:none}.deli-wrap-header #deli-head .deli-nav-top .deli-nav-item a.deli-navlink{display:inline-block;width:85px;height:40px;line-height:40px;text-align:center;font-size:16px;color:#666;text-decoration:none;position:relative;border-radius:5px}.deli-wrap-header #deli-head .deli-nav-top .deli-nav-item a.deli-navlink.deli-nav-item-current{width:120px;padding:0 10px;color:#00d8d6;border:1px solid #00d8d6;border-radius:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.deli-wrap-header #deli-head .deli-nav-top .deli-nav-item a.deli-navlink.deli-nav-item-current.larget{width:140px;padding:0 20px}.deli-wrap-header #deli-head .deli-nav-top .deli-nav-item a.deli-navlink.deli-nav-item-current .deli-navlink-icon{font-size:12px;color:#00d8d6;position:absolute;right:10px}.deli-wrap-header #deli-head .deli-nav-top .deli-nav-item a.deli-navlink:hover{-background-color:#55BEBF;color:#00d8d6}.deli-wrap-header #deli-head .deli-nav-top .deli-nav-item a.deli-navlink-current{-background-color:#55BEBF;color:#00d8d6}.deli-wrap-header #deli-head .deli-nav-top .deli-nav-item .son-nav-list{width:150px;position:absolute;z-index:1;background-color:#fff;top:60px;display:none;left:-15px;border:1px solid #d9d9d9;border-top:0}.deli-wrap-header #deli-head .deli-nav-top .deli-nav-item .son-nav-list a.sub-deli-nav-item{display:block;width:150px;padding:0 10px;height:40px;line-height:40px;font-size:14px;text-align:center;color:#333;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.deli-wrap-header #deli-head .deli-nav-top .deli-nav-item .son-nav-list a.sub-deli-nav-item.current,.deli-wrap-header #deli-head .deli-nav-top .deli-nav-item .son-nav-list a.sub-deli-nav-item:hover{color:#00d8d6}.deli-wrap-header #deli-head .deli-nav-top .deli-nologin{display:block;font-size:16px;margin-left:5px;width:100px}.deli-wrap-header #deli-head .deli-nav-top .deli-nologin a{color:#00d8d6;text-decoration:none}.deli-wrap-header #deli-head .deli-nav-top .userBtn.hasLogin:hover{position:relative}.deli-wrap-header #deli-head .deli-nav-top .userBtn.hasLogin:hover>.deli-user-panel{display:block}.deli-wrap-header #deli-head .deli-nav-top .deli-user-panel{display:none;position:relative;top:-20px;right:0;background-color:#fff;z-index:1;width:80px;height:80px;overflow:visible}.deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-info{position:relative;display:inline-block;width:80px;height:50px;overflow:hidden;margin:15px auto}.deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-info .deli-user-info-avatar{width:50px;height:50px;border-radius:50%;-moz-border-radius:50%;-webkit-border-radius:50%;-o-border-radius:50%;display:inline-block}.deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-info i{display:none;position:absolute;top:8px;right:8px}.deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-info.visited i,.deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-info:hover i{display:block}.deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-asset{display:none;border:1px solid #d9d9d9;border-top:0}.deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-asset .deli-user-asset-link{display:inline-block;width:80px;height:40px;line-height:40px;text-align:center;font-size:14px;color:#666;background-color:#fff}.deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-asset .deli-user-asset-link:hover{color:#00d8d6}.deli-wrap-footer{background-color:#cfd2d7}.deli-footer{padding-top:25px;width:1200px;margin:0 auto}.deli-footer-link{-height:100px}.deli-footer-link dl{width:155px;float:left;-height:100px;margin-right:100px;margin-bottom:0}.deli-footer-link dl.deli-attus{position:relative;width:170px;margin-right:0}.deli-footer-link dl.deli-attus .deli-icon-weixin-img{display:none;position:absolute;top:-80px;left:-25px;background-image:url('http://t.static.delicloud.com/www/home/images/weixin.png');width:80px;height:80px}.deli-footer-link dl.deli-attus .deli-icon-qq{margin-right:50px}.deli-footer-link dl.deli-attus .deli-icon-weixin{position:relative}.deli-footer-link dl.deli-attus .deli-icon-qq,.deli-footer-link dl.deli-attus .deli-icon-weixin{font-size:30px;color:#333;cursor:pointer;text-decoration:none}.deli-footer-link dl.deli-attus .deli-icon-qq:hover,.deli-footer-link dl.deli-attus .deli-icon-weixin:hover{color:#55bfbe}.deli-footer-link dl.deli-attus .deli-icon-weixin:hover .deli-icon-weixin-img{display:block}.deli-footer-link dl .deli-kefu-phone{font-size:16px}.deli-footer-link dl dt{font-size:16px;font-weight:700;line-height:26px;color:#666;letter-spacing:5px;margin-bottom:20px;opacity:.6;-moz-opacity:.6;-webkit-opacity:.6;-o-opacity:.6}.deli-footer-link dl dd{line-height:24px;font-size:14px;color:#959799;margin-bottom:15px;letter-spacing:5px}.deli-footer-link dl dd a{font-size:16px;color:#333;letter-spacing:5px;display:inline-block;text-decoration:none}.deli-footer-link dl dd:hover a{color:#fff;text-decoration:none}.deli-footer-copyright{font-size:14px;color:#666;height:50px;padding-top:20px;text-align:center}</style>"; var a=document.createElement("div"),b=document.createElement("div");a.className="deli-wrap-header";b.className="deli-wrap-footer";a.innerHTML='<div class="deli-user-head"><div id="deli-head" class="deli-clear"><div class="deli-logo-box"><a href="javascript:;" class="deli-logo"></a></div><div class="deli-nav-top"><ul class="deli-nav-top-list deli-clear"><li class="deli-nav-item"><a href="http://t.delicloud.com/oa/" class="deli-navlink">\u9996\u9875</a></li><li class="deli-nav-item"><a href="http://t.delicloud.com/oa/" class="deli-navlink">\u7ec4\u7ec7\u901a\u8baf\u5f55</a></li><li class="deli-nav-item"><a href="http://t.delicloud.com/oa/" class="deli-navlink">\u5e94\u7528</a></li><li class="deli-nav-item"><a href="http://t.delicloud.com/oa/" class="deli-navlink">\u8bbe\u5907</a></li><li class="deli-nav-item deli-nav-item-team"><a href="javascript:;" class="deli-navlink deli-nav-item-current"><span class="deli-navlink-name">\u5f97\u529b\u56e2\u961f</span> <span class="deli-navlink-icon"><i class="iconfont">&#xe608;</i></span></a><div class="sun-nav-list sun-nav-list-team"><a class="sub-deli-nav-item current" href="javascript:;">\u5f97\u529b\u56e2\u961f1</a> <a class="sub-deli-nav-item" href="javascript:;">\u5f97\u529b\u56e2\u961f2</a> <a class="sub-deli-nav-item" href="javascript:;">\u5f97\u529b\u56e2\u961f3</a></div></li><li class="deli-nav-item deli-nav-item-login"><div class="deli-nologin"><a href="javascript:;" class="deli-nologin-btn">\u9000\u51fa</a></div><div class="deli-login deli-user-panel"><a href="javascript:;" class="deli-user-info fl" style="display:block"><img class="deli-user-info-avatar" width="50" height="50" src="/images/user.png"><i class="iconfont">\ue608</i></a><div class="deli-user-asset fl" style="display:none"><a class="deli-user-asset-link deli-logout" href="javascript:;">\u9000\u51fa\u767b\u5f55</a></div></div></li></ul></div></div></div>'; b.innerHTML='<div class="deli-footer"><div class="deli-footer-link deli-clear"><dl><dt>\u4f7f\u7528\u5e2e\u52a9</dt><dd><a href="javascript:;">\u53bb\u8d2d\u4e70\u667a\u80fd\u8bbe\u5907</a></dd><dd><a href="javascript:;">App\u4f7f\u7528\u5e2e\u52a9</a></dd><dd><a href="javascript:;">\u7f51\u9875\u4f7f\u7528\u5e2e\u52a9</a></dd></dl><dl><dt>\u5e94\u7528\u5f00\u53d1\u5546</dt><dd><a href="javascript:;">\u5e94\u7528\u63a5\u5165\u6307\u5357</a></dd></dl><dl><dt>\u5173\u4e8e\u6211\u4eec</dt><dd><a href="javascript:;">\u52a0\u5165\u6211\u4eec</a></dd><dd><a href="javascript:;">\u8054\u7cfb\u6211\u4eec</a></dd></dl><dl class="deli-attus"><dt>\u8054\u7cfb\u6211\u4eec</dt><dd class="deli-kefu-phone">400-185-0555</dd><a class="deli-icon-qq" href="javascript:;"><i class="iconfont">&#xe644;</i></a><a class="deli-icon-weixin" href="javascript:;"><i class="iconfont">&#xe609;</i><img class="deli-icon-weixin-img" src="/images/qrcode.png"></a></dl></div><div class="deli-footer-copyright">\u6d59ICP\u590706004512\u53f7 Copyright \u00a92014 \u5f97\u529b\u96c6\u56e2\u6709\u9650\u516c\u53f8 \u7248\u6743\u6240\u6709</div></div>'; document.body.appendChild(b);document.body.insertBefore(a,document.body.firstElementChild);document.querySelector(".deli-wrap-header .deli-nologin a.deli-nologin-btn").addEventListener("click",function(){e.util.setCookie("user_id",void 0);e.util.setCookie("token",void 0);g.location.href="http://t.delicloud.com/oauth/?redirect="+location.href},!1)}};a&&b?deliApi.init({url:"http://t.delicloud.com/web/v1.0/cd/login/"+a+"",type:"get",dataType:"jsonp",data:{},callback:"callback",success:function(c){0== c.code&&(c=c.data.result.token&&0<c.data.result.token.length?"connect":"noconnect","connect"!=c&&e.logout(a,b),k&&k({data:c}),d.init())},fail:function(c){if(0==c.code){var u=c.data.result.token&&0<c.data.result.token.length?"connect":"noconnect";"connect"!=u&&e.logout(a,b);k&&k({data:u});d.init()}else 9102112==c.code?setTimeout(function(){h&&h({message:c.msg,errorCode:-1})}):(alert("\u7528\u6237\u672a\u767b\u5f55\u6216\u8005\u767b\u5f55\u4fe1\u606f\u5df2\u7ecf\u8fc7\u671f\uff0c\u8bf7\u91cd\u65b0\u767b\u5f55"), g.location.href="http://t.delicloud.com/oauth/?redirect="+location.href)}}):(alert("\u7528\u6237\u672a\u767b\u5f55\u6216\u8005\u767b\u5f55\u4fe1\u606f\u5df2\u7ecf\u8fc7\u671f\uff0c\u8bf7\u91cd\u65b0\u767b\u5f55"),g.location.href="http://t.delicloud.com/oauth/?redirect="+location.href)},logout:function(a,b){deliApi.init({url:"http://t.delicloud.com/web/v1.0/cd/logout",type:"get",dataType:"jsonp",data:{Dauth:a+" "+(new Date).valueOf()+" "+this.util.buildDauth(b)},callback:"callback",success:function(a){0== a.code&&k&&k({data:a.data})},fail:function(a){setTimeout(function(){h&&h({message:a.msg,errorCode:-1})})}})},util:{setCookie:function(a,b,e){var d=new Date;d.setDate(d.getDate()+e);b=escape(b)+"; path=/"+(null==e?"":"; expires="+d.toUTCString());document.cookie=a+"="+b},getCookie:function(a){var b,e,d,c=document.cookie.split(";");for(b=0;b<c.length;b++)if(e=c[b].substr(0,c[b].indexOf("=")),d=c[b].substr(c[b].indexOf("=")+1),e=e.replace(/^\s+|\s+$/g,""),e==a)return unescape(d)},buildHash:function(a){var b, e;for(b in a.args)e+=void 0===a.args[b]?"&"+encodeURIComponent(b):"&"+encodeURIComponent(b)+"="+encodeURIComponent(a.args[b]);return e},parseHash:function(a){var b,e,d={args:{}};a=a.substr(1).replace(/[#\?].*$/,"");if(e=a.match(/[^=&]+(=[^&]*)?/g))for("!"===e[0].charAt(0)&&(b=e[0].substr(1),b in pages&&(d.id=decodeURIComponent(b))),a=1;a<e.length;a++)(b=e[a].match(/^([^=]+)(=)?(.+)?$/))&&(d.args[decodeURIComponent(b[1])]=b[2]?decodeURIComponent(b[3]||""):void 0);return d},getQuery:function(a){for(var b= g.location.href,e=b.indexOf("?"),b=b.slice(e+1).split("&"),e=0;e<b.length;e++){var d=b[e].split("=");if(d[0].trim()==a)return d[1].trim()}},SHA256:function(a){function b(a,c){var b=(a&65535)+(c&65535);return(a>>16)+(c>>16)+(b>>16)<<16|b&65535}function e(a,c){return a>>>c|a<<32-c}a=function(a){a=a.replace(/\r\n/g,"\n");for(var c="",b=0;b<a.length;b++){var d=a.charCodeAt(b);128>d?c+=String.fromCharCode(d):(127<d&&2048>d?c+=String.fromCharCode(d>>6|192):(c+=String.fromCharCode(d>>12|224),c+=String.fromCharCode(d>> 6&63|128)),c+=String.fromCharCode(d&63|128))}return c}(a);return function(a){for(var c="",b=0;b<4*a.length;b++)c+="0123456789abcdef".charAt(a[b>>2]>>8*(3-b%4)+4&15)+"0123456789abcdef".charAt(a[b>>2]>>8*(3-b%4)&15);return c}(function(a,c){var d=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986, 2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],f=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635, 1541459225],g=Array(64),l,h,k,v,n,y,q,t,m,p,r;a[c>>5]|=128<<24-c%32;a[(c+64>>9<<4)+15]=c;for(t=0;t<a.length;t+=16){c=f[0];l=f[1];h=f[2];k=f[3];v=f[4];n=f[5];y=f[6];q=f[7];for(m=0;64>m;m++){if(16>m)g[m]=a[m+t];else{p=m;r=g[m-2];r=e(r,17)^e(r,19)^r>>>10;r=b(r,g[m-7]);var w;w=g[m-15];w=e(w,7)^e(w,18)^w>>>3;g[p]=b(b(r,w),g[m-16])}p=v;p=e(p,6)^e(p,11)^e(p,25);p=b(b(b(b(q,p),v&n^~v&y),d[m]),g[m]);q=c;q=e(q,2)^e(q,13)^e(q,22);r=b(q,c&l^c&h^l&h);q=y;y=n;n=v;v=b(k,p);k=h;h=l;l=c;c=b(p,r)}f[0]=b(c,f[0]);f[1]= b(l,f[1]);f[2]=b(h,f[2]);f[3]=b(k,f[3]);f[4]=b(v,f[4]);f[5]=b(n,f[5]);f[6]=b(y,f[6]);f[7]=b(q,f[7])}return f}(function(a){for(var c=[],b=0;b<8*a.length;b+=8)c[b>>5]|=(a.charCodeAt(b/8)&255)<<24-b%32;return c}(a),8*a.length))},buildDauth:function(a){a=g.location.search.substr(1)+a;return this.util.SHA256(a).substr(0,32)}}},A=function(a,b){a=a.split(".");for(var e=t,d=0,c=a.length;d<c;d++)d===c-1&&(e[a[d]]=b),"undefined"===typeof e[a[d]]&&(e[a[d]]={}),e=e[a[d]]};["getLoginStatus","onlogout"].forEach(function(a){A(a, function(a,e,d){})});g.deli=t;g.deliAsyncInit&&function(a){a.__wrapper||(a.__wrapper=function(){try{return a.apply(this,arguments)}catch(b){return g.setTimeout(function(){throw b;},0),!1}});return a.__wrapper}(g.deliAsyncInit)();"object"===typeof module&&module&&"object"===typeof module.exports?module.exports=t:"function"===typeof define&&(define.amd||define.cmd)&&define(function(){return t})})(this);