'use strict';define(['common/kernel/kernel','site/util/util'],function(a,b){var c,d,e,f,g,h,i,j,k,l,m,n=$('#home .home-box'),o=n.find('.home-record'),p=o.find('.record-top div.logo'),q=o.find('.record-top p.text'),r=o.find('.record-main .device span em'),s=o.find('.record-main .app span em'),t=o.find('.record-main .count span em'),u=n.find('.home-index'),v=u.find('.banner'),w=u.find('.bannerNav'),x=function(c){var d=new Date().valueOf().toString(),e={};c.orgid?e.org_id=c.orgid:'',b.ajaxSubmit({type:'get',url:'/v1.0/user/me',dauth:c.userid+' '+d+' '+a.buildDauth(c.userid,c.token,d),data:e,success:function success(a){if(0==a.code){var c=a.data.organization;if(c){var d=b.getUserData(),e=b.getCookie('orgindex');b.isEqual(d.organization[e],c[e])||(d.organization[e]=c[e],b.setUserData(d));b.setCookie('orgname',c[e].name),b.setCookie('employee_count',c[e].employee_cnt),p.html('group'==c[e].type?'<i class="iconfont">&#xe643;</i>':'<i class="iconfont">&#xe642;</i>'),q.text(c[e].name),t.text(c[e].employee_cnt)}}}})};return{onload:function onload(){if(c=a.parseHash(location.hash),d=c.id,e=b.getCookie('userid'),f=b.getCookie('token'),g=b.getCookie('orgid'),h=b.getCookie('orgname'),i=b.getCookie('parentid'),j=b.getCookie('device_ids'),k=b.getCookie('app_ids'),l=b.getCookie('employee_count'),m=b.getCookie('orgindex'),void 0===e||void 0===f||void 0===g)b.setUserData(void 0),a.replaceLocation({args:{},id:'loginhome'});else{var n={userid:e,token:f};if(g&&(n.orgid=g),'home'==d){var o=$('#header .user-head .nav-top .nav-item');o.find('a.navlink').removeClass('navlink-current'),o.find('a.navlink-group').show(),o.find('a.navlink-user').hide(),o.find('a.navlink-admin').hide(),o.find('a.navlink.homeBtn').addClass('navlink-current')}x(n)}}}});