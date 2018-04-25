'use strict';define(['common/kernel/kernel','site/util/util'],function(a,b){function c(a){if(!!window.WebSocket&&window.WebSocket.prototype.send){var c=new WebSocket(a.ws_url);c.onopen=function(){console.log('\u5DF2\u8FDE\u63A5\u4E0A'),c.send('{"cmd": "register","data": "'+a.session_id+'"}')},c.onmessage=function(a){var d=JSON.parse(a.data);console.log('json',d),d&&(d.id&&(s.data=d,i.hide(),l.hide(),j.find('div.success-img').css({"background-image":'url('+d.avatar_url+')'}).attr('title',d.name),j.show()),d.user_id&&(r=d,'web'==r.type&&(b.setCookie('token',r.token),b.setCookie('userid',r.user_id),b.setCookie('expire',r.expire)),e(o,{userid:r.user_id,token:r.token,type:'websocket'},c)))},c.onclose=function(){console.log('\u8FDE\u63A5\u5DF2\u5173\u95ED...')},c.onerror=function(a){console.log('\u53D1\u751F\u5F02\u5E38:',a)}}else var f=setInterval(function(){d('/ws/'+a.session_id+'',f)},5e3)}function d(a,c){b.ajaxSubmit({url:a,silent:!0,type:'get',force:!0,complete:function complete(a){if(200==a.status){var d=JSON.parse(a.responseText);if(1<d.length){var f=d[0],g=d[1];f&&g&&(f.id&&(s.data=f,i.hide(),l.hide(),j.find('div.success-img').css({"background-image":'url('+f.avatar_url+')'}).attr('title',f.name),j.show()),g.user_id&&(r=g,'web'==r.type&&(b.setCookie('token',r.token),b.setCookie('userid',r.user_id),b.setCookie('expire',r.expire)),e(o,{userid:r.user_id,token:r.token,type:'polling'},function(){clearInterval(c)})))}else if(1==d.length){var h=d[0];h&&(h.id&&(s.data=h,i.hide(),l.hide(),j.find('div.success-img').css({"background-image":'url('+h.avatar_url+')'}).attr('title',h.name),j.show()),h.user_id&&(r=h,'web'==r.type&&(b.setCookie('token',r.token),b.setCookie('userid',r.user_id),b.setCookie('expire',r.expire)),e(o,{userid:r.user_id,token:r.token,type:'polling'},function(){clearInterval(c)})))}}}})}function e(c,d,e){var f=new Date().valueOf().toString();b.ajaxSubmit({type:'get',url:'/v1.0/admin/auth/my',dauth:d.userid+' '+f+' '+a.buildDauth(d.userid,d.token,f),data:{type:'group'},success:function success(f){if(0==f.code){c.find('>').remove('');var h=f.data.result;if(h&&h.length&&0<h.length){var k=[],m=h.length,o=0;$.each(h,function(d,e){if(e.is_admin&&!0==e.is_admin||e.department_ids||e.app_ids||e.device_ids){o=d;var f=$('<li class="list-item"><a class="list-item-inner noline" href="javascript:;" title="'+e.org_name+'" data-oid="'+e.org_id+'" data-pid="'+e.top_department_id+'">'+e.org_name+'</a></li>');return k.push(e),c.append(f),function(){var c={name:e.org_name,orgid:e.org_id,parentid:e.top_department_id,app_ids:e.app_ids?e.app_ids.length:0,device_ids:e.device_ids?e.device_ids.length:0,employee_count:e.employee_count};f.find('a.list-item-inner').on('click',function(d){d.stopPropagation(),b.setCookie('orgid',c.orgid),b.setCookie('parentid',c.parentid),b.setCookie('orgname',c.name),b.setCookie('device_ids',c.device_ids),b.setCookie('app_ids',c.app_ids),b.setCookie('employee_count',c.employee_count),s.orgindex=$(this).parent('li.list-item').index(),b.setCookie('orgindex',s.orgindex),b.setUserData(s),a.replaceLocation({args:{},id:'home'})})}()}m--}),s.organization=k,0>=m?(g.show(),n.hide(),i.hide(),j.hide(),j.find('div.success-img').css({"background-image":'url('+f.avatar_url+')'}).attr('title',f.name),l.show()):1==m?(g.show(),n.hide(),i.show(),j.hide(),l.hide(),b.setCookie('orgid',h[o].org_id),b.setCookie('parentid',h[o].top_department_id),b.setCookie('orgname',h[o].org_name),b.setCookie('device_ids',h[o].device_ids?h[o].device_ids.length:0),b.setCookie('app_ids',h[o].app_ids?h[o].app_ids.length:0),b.setCookie('employee_count',h[o].employee_count),s.orgindex=o,b.setUserData(s),a.replaceLocation({args:{},id:'home'})):(g.hide(),n.show(),i.show(),j.hide(),l.hide(),4>=m?c.addClass('org-list-seldom'):c.addClass('org-list-plenty'))}else g.show(),n.hide(),i.hide(),j.hide(),j.find('div.success-img').css({"background-image":'url('+f.avatar_url+')'}).attr('title',f.name),l.show();'websocket'==d.type?e.close():'polling'==d.type&&'function'==typeof e&&e()}else a.hint(f.msg)},error:function error(a){console.log('res',a)}})}var f=$('#loginhome'),g=f.find('.login-box'),h=g.find('#loginQr'),i=h.find('.login-doing'),j=h.find('.login-success'),k=j.find('.success-btn'),l=h.find('.login-fail'),m=l.find('.fail-btn'),n=f.find('.org-box'),o=n.find('.org-wrap .org-inner .org-list'),p=$('#header .nav-top .nav-top-list .nav-item-team'),q=p.find('.son-nav-list-team'),r={},s={data:{},organization:{}},t=function(d){d.addClass('login-loading'),b.ajaxSubmit({url:'/v1.0/barcode_login/public?v='+new Date().getTime(),silent:!1,type:'get',success:function success(b){if(d.removeClass('login-loading'),0==b.code){var e=b.data.result,f=e.cid,g=e.data,h=e.session;g?(d.html(''),new QRCode(document.getElementById('qrcode'),{text:g,width:234,height:234,correctLevel:QRCode.CorrectLevel.L}),c(h)):d.html('')}else a.hint(b.msg)},error:function error(){d.removeClass('login-loading'),a.hint('\u7F51\u7EDC\u6216\u670D\u52A1\u5668\u9519\u8BEF~','error')}})};return t(g.find('.loginQr')),$(document).on('click','.loginQr',function(){var a=this,b=g.find('.loginQr'),c=b[this===b[0]?1:0];0===this.childNodes.length?c&&0<c.childNodes.length?this.innerHTML=c.innerHTML:t(g.find('.loginQr')):t(g.find('.loginQr'))}),k.on('click',function(){t(g.find('.loginQr')),l.hide(),j.hide(),i.show()}),m.on('click',function(){t(g.find('.loginQr')),l.hide(),j.hide(),i.show()}),{onload:function onload(){var a,c,d,e,f;a=b.getCookie('userid'),c=b.getCookie('token'),d=b.getCookie('orgid'),e=b.getCookie('orgname'),f=b.getCookie('parentid'),'undefined'!=a&&'undefined'!=c&&'undefined'!=d&&'undefined'!=e&&'undefined'!=f&&(g.show(),n.hide())}}});