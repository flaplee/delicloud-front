'use strict';define(['common/kernel/kernel'],function(a){function b(){var b=c.clone(a.location);b.args.p=this.firstChild.data,location.assign(a.buildHash(b))}var c={ajaxSubmit:function ajaxSubmit(b){var d=new XMLHttpRequest,e=b.type||'post',f=b.force?b.url:'/web'+b.url;if('get'===e&&b.data){var g=[];for(var h in b.data)b.data.hasOwnProperty(h)&&g.push(h+'='+b.data[h]);f=f+'?'+g.join('&')}d.open(e,f,!0),b.data||(b.data={}),d.onreadystatechange=function(){var e;if(4===d.readyState){if(200===d.status){try{e=JSON.parse(d.responseText)}catch(a){}e?0==e.code?'function'==typeof b.success&&b.success(e):('function'==typeof b.error?b.error(e):!b.silent&&a.hint(e.msg,'error'),501==e.code&&(c.setUserData(void 0),a.replaceLocation({args:{},id:'loginhome'}))):'function'==typeof b.error?b.error(d,'parse_error'):!b.silent&&a.hint('\u6570\u636E\u89E3\u6790\u5931\u8D25: '+d.responseText,'error')}else'function'==typeof b.error?b.error(d,'network_error'):!b.silent&&a.hint('\u7F51\u7EDC\u6216\u670D\u52A1\u5668\u9519\u8BEF: '+d.status,'error');'function'==typeof b.complete&&b.complete(d),b.silent||a.hideLoading()}},!!window.FormData&&b.data instanceof FormData?(b.dauth&&(d.setRequestHeader('Dauth',b.dauth),d.setRequestHeader('Duagent','_web')),d.send(b.data)):(d.setRequestHeader('Content-Type','application/json'),b.dauth&&(d.setRequestHeader('Dauth',b.dauth),d.setRequestHeader('Duagent','_web')),d.send(JSON.stringify(b.data))),b.silent||a.showLoading()},formatDate:function formatDate(a){if(0>=a)return'';var b,c,e,f;return b=new Date(1e3*a),c=b.getFullYear(),e=b.getMonth()+1,10>e&&(e='0'+e),f=b.getDate(),10>f&&(f='0'+f),c+'-'+e+'-'+f},formatTime:function formatTime(a){if(0>=a)return'';var b,c,e,f,d,g,h;return b=new Date(1e3*a),c=b.getFullYear(),e=b.getMonth()+1,10>e&&(e='0'+e),f=b.getDate(),10>f&&(f='0'+f),d=b.getHours(),10>d&&(d='0'+d),g=b.getMinutes(),10>g&&(g='0'+g),h=b.getSeconds(),10>h&&(h='0'+h),c+'-'+e+'-'+f+' '+d+':'+g+':'+h},setImgCat:function setImgCat(a,b){var c=[],d=[],e=[];for(var f in a)a.hasOwnProperty(f)&&/_img$/.test(f)&&1==b[f].get&&(c.push(a[f]),e.push(b[f].title));for(var g,h=0;h<c.length;h++){g=c[h].split(',');for(var i=0;i<g.length;i++)d.push({src:g[i],title:e[h]})}return d},setFormData:function setFormData(b,c,a){var d,e;for(d in c)if(c.hasOwnProperty(d)&&(b.find('.'+d+' input, .'+d+' select').prop('required',!!c[d].required),'[object Object]'===c[d].stype.toString()))for(e in b.find('.'+d+' .select').html(''),c[d].stype)b.find('.'+d+' .select').append('<option value="'+e+'">'+c[d].stype[e]+'</option>');if(a)for(d in c)c.hasOwnProperty(d)&&b.find('.'+d+' input, .'+d+' select, .'+d+' textarea').val(a[d])},getFormData:function getFormData(b,c){var a,d,e,f={};for(a in c)if(c.hasOwnProperty(a)&&!b.find('.'+a+' input, .'+a+' textarea, .'+a+' select').is(':hidden')&&(e=b.find('.'+a+' input, .'+a+' textarea').val(),f[a]=void 0===e?'':e,'[object Object]'===c[a].stype.toString()))for(d in c[a].stype)f[a]=b.find('.'+a+' input, .'+a+' select').val();return f},formatTimeDiff:function formatTimeDiff(b,c){var d,e,a,f=Math.floor,g=[f(b/86400),f(b/3600)%24,f(b/60)%60,f(b)%60];if(c){for(a=['\u5929','\u5C0F\u65F6','\u5206\u949F','\u79D2'],d=0;d<g.length;d++)if(0<g[d])return g[d]+a[d];return'\u521A\u624D'}for(a=['\u5929','\u65F6','\u5206','\u79D2'],e=!1,d=0;d<g.length;d++)e?g[d]+=a[d]:0<g[d]?(g[d]+=a[d],e=!0):g[d]='';return g.join('')},isNullObj:function isNullObj(a){for(var b in a)if(a.hasOwnProperty(b))return!1;return!0},setDisabledClass:function setDisabledClass(a,b){b?a.addClass('disabled'):a.removeClass('disabled')},setCookie:function setCookie(a,b,c){var d=new Date;d.setDate(d.getDate()+c);var e=escape(b)+'; path=/'+(null==c?'':'; expires='+d.toUTCString());document.cookie=a+'='+e},getCookie:function getCookie(a){var b,c,d,e=document.cookie.split(';');for(b=0;b<e.length;b++)if(c=e[b].substr(0,e[b].indexOf('=')),d=e[b].substr(e[b].indexOf('=')+1),c=c.replace(/^\s+|\s+$/g,''),c==a)return unescape(d)},delCookie:function delCookie(a){var b=this.getCookie(a);null!=b&&this.setCookie(a,b,-9)},clone:function clone(a){var b,d=$.type(a);if('date'===d)b=new Date(a.valueOf());else if('regexp'===d)d='',a.ignoreCase&&(d+='i'),a.multiline&&(d+='m'),a.global&&(d+='g'),a.sticky&&(d+='y'),a.unicode&&(d+='u'),b=RegExp(a.source,d);else if('error'===d)b='RangeError'===a.name?RangeError(a.message):'ReferenceError'===a.name?ReferenceError(a.message):'SyntaxError'===a.name?SyntaxError(a.message):'TypeError'===a.name?TypeError(a.message):'URIError'===a.name?URIError(a.message):Error(a.message);else if('array'===d)for(b=[],d=0;d<a.length;d++)b[d]=c.clone(a[d]);else if('object'===d)for(d in b={},a)b[d]=c.clone(a[d]);else b=a;return b},isEqual:function isEqual(a,b){var d,e=$.type(a);if(e===$.type(b)){if('object'===e){if(Object.keys(a).length===Object.keys(b).length){for(d in a)if(!(d in b)||!c.isEqual(a[d],b[d]))return!1;return!0}return!1}if('array'===e){if(a.length===b.length){for(d=0;d<a.length;d++)if(!c.isEqual(a[d],b[d]))return!1;return!0}return!1}return'regexp'===e?a.source===b.source&&a.global===b.global&&a.ignoreCase===b.ignoreCase&&a.multiline===b.multiline&&a.sticky===b.sticky&&a.unicode===b.unicode:'error'===e?a.message=b.message&&a.name===b.name:'date'===e?a.valueOf()===b.valueOf():a===b}return!1},paging:function paging(d,e,f,g){var h,l,m,n,o,p,i,k,j;if(f>g){for(d.find('.item').remove(),d.find('a').off('click'),d.find('.listnum').text(f),h=Math.ceil(f/g),l=d.find('.first'),m=d.find('.last'),n=d.find('.previous'),o=d.find('.next'),1==e?(l.addClass('disabled'),n.addClass('disabled')):(l.removeClass('disabled'),l.on('click',function(){var b=c.clone(a.location);b.args.p=1,location.assign(a.buildHash(b))}),n.removeClass('disabled'),n.on('click',function(){var b=c.clone(a.location);b.args.p=e-1,location.assign(a.buildHash(b))})),e==h?(m.addClass('disabled'),o.addClass('disabled')):(m.removeClass('disabled'),m.on('click',function(){var b=c.clone(a.location);b.args.p=h,location.assign(a.buildHash(b))}),o.removeClass('disabled'),o.on('click',function(){var b=c.clone(a.location);b.args.p=e+1,location.assign(a.buildHash(b))})),k=Math.max(e-5,1),i=Math.min(e+4,h);9>i-k&&(1<k||i<h);)1<k?k--:i++;for(p=k;p<=i;p++)j=$('<a href="javascript:;" class="item">'+p+'</a>'),p==e&&j.addClass('active'),j.on('click',b),o.before(j);d.css('display','')}else d.css('display','none')}};return!function(){var b;c.setUserData=function(a,d){a!==b&&(a&&b&&a.data.id==b.data.id?!c.isEqual(b,a)&&(a.orgindex==b.orgindex?(b=a,c.userEvents.ondatachange instanceof Function&&c.userEvents.ondatachange({type:'datachange',initiative:d,data:c.clone(a)})):(b=a,c.userEvents.onpagechange instanceof Function&&c.userEvents.onpagechange({type:'pagechange',initiative:d,data:c.clone(a)}))):(b=a,c.userEvents.onstatechange instanceof Function&&c.userEvents.onstatechange({type:'statechange',initiative:d,data:c.clone(a)})))},c.getUserData=function(){return c.clone(b)},c.setToken=function(a){c.token!==a&&(c.token=a,c.setCookie('token',a),'function'==typeof c.userEvents.onstatechange&&c.userEvents.onstatechange({type:'statechange'}))},c.updateUserData=function(d,e,f){'undefined'!=d&&c.ajaxSubmit({type:'get',url:'/v1.0/user/me',dauth:d+' '+new Date().valueOf()+' '+a.buildDauth(d,e,new Date().valueOf()),silent:!0,complete:function complete(g){var h;try{if(h=$.parseJSON(g.responseText),h.data){var j=[],i={data:h.data.result,organization:j};c.ajaxSubmit({type:'get',url:'/v1.0/admin/auth/my',dauth:d+' '+new Date().valueOf()+' '+a.buildDauth(d,e,new Date().valueOf()),data:{type:'group'},silent:!0,success:function success(a){0==a.code&&($.each(a.data.result,function(a,b){(b.is_admin&&!0==b.is_admin||b.department_ids||b.app_ids||b.device_ids)&&j.push(b)}),i.organization=j,i.orgindex=0,c.setUserData(i))},error:function error(){}})}}catch(a){}'function'==typeof f&&f(c.clone(b))}})},c.token=c.getCookie('token'),c.userEvents={}}(),!function(){function a(a,b){for(var c in a)'checkbox'===a[c].type?b[c]=b[c]?b[c].split(','):a[c].des?a[c].des.split(','):[]:'select'===a[c].type?b[c]in a[c].stype||(b[c]=a[c].des||Object.keys(a[c].stype)[0]):(void 0===b[c]||null===b[c])&&(b[c]=a[c].des)}c.setDefaultValue=function(b){var c,d;if(b.attributes)for(c in b.list||(b.list={}),b.attributes)if(b.list[c]||(b.list[c]={}),'array'===$.type(b.list[c]))for(d=0;d<b.list[c].length;d++)a(b.attributes[c],b.list[c][d]);else a(b.attributes[c],b.list[c])},c.getCheckboxValue=function(a,b){var c,d=[],e=a.find('input[type=checkbox]'+(b?b:'')+':enabled:checked');for(c=0;c<e.length;c++)d.push(e[c].value);return d.join(',')},c.setCheckboxValue=function(a,b,c){var d,e=a.find('input[type=checkbox]'+(b?b:''));for(d=0;d<e.length;d++)e[d].checked=0<=c.indexOf(e[d].value)},c.getRadioValue=function(a,b){return a.find('input[type=radio][name='+b+']:enabled:checked').val()},c.setRadioValue=function(a,b,c){a.find('input[type=radio][name='+b+'][value='+c+']').prop('checked',!0)},c.getInputValue=function(a,b){return a.find(b+':enabled').val()},c.makeOptions=function(a){var b,c='';for(b in a)c+='<option value="'+b+'">'+a[b]+'</option>';return c},c.setUrlPort=function(a){var b=location.protocol,c=location.host;return b+'//'+c+':'+a}}(),c});