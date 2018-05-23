'use strict';define(['common/kernel/kernel','site/util/util'],function(a,b){function c(a){a.data&&a.data.data&&(k.find('.user-wrap img.user-info-avatar').prop('src',a.data.data.avatar_url),k.find('.user-panel >.user-info >.userinfo-name-box b').text(a.data.data.name),k.find('.user-panel >.user-info img').prop('src',a.data.data.avatar_url)),d(a)}function d(d){var c=parseInt(b.getCookie('orgindex')?b.getCookie('orgindex'):0);0<=c&&d.data.organization&&0<d.data.organization.length&&(d.data.organization[c]?($('a.nav-item-current .navlink-name').text(d.data.organization[c].org_name),$('.nav-item-team .son-nav-wrap .son-nav-list-team').find('>').remove(),d.data.orgindex=c,f(d),$.each(d.data.organization,function(e,g){var h=$('<a class="sub-nav-item '+(d.data.organization[c].org_id==g.org_id?'current':'')+'"  href="javascript:;" data-oid="'+g.org_id+'" data-pid="'+g.top_department_id+'">'+g.org_name+'</a>');return $('.nav-item-team .son-nav-wrap .son-nav-list-team').append(h),function(){h.on('click',function(g){var g=g||window.e;g.stopPropagation();var e=$(this),c=e.text();e.hasClass('current')||(h.parents('.nav-item-team').find('a.nav-item-current .navlink-name').text(c),e.siblings().removeClass('current'),e.addClass('current'),d.data.orgindex=e.index(),b.setCookie('orgindex',d.data.orgindex),b.setUserData(d.data),'imports'==a.parseHash(location.hash).id&&a.parseHash(location.hash).args.id&&a.replaceLocation({args:{},id:'imports'}),f(d)),$('.nav-item-team .son-nav-wrap').hide()})}()})):k.find('a.logout').trigger('click'))}function f(c){b.setCookie('userid',c.data.data.id),b.setCookie('orgid',c.data.organization[c.data.orgindex].org_id),b.setCookie('parentid',c.data.organization[c.data.orgindex].top_department_id),b.setCookie('orgname',c.data.organization[c.data.orgindex].org_name),b.setCookie('device_ids',c.data.organization[c.data.orgindex].device_ids?c.data.organization[c.data.orgindex].device_ids.length:0),b.setCookie('app_ids',c.data.organization[c.data.orgindex].app_ids?c.data.organization[c.data.orgindex].app_ids.length:0),b.setCookie('employee_count',c.data.organization[c.data.orgindex].employee_count),a.reloadPage(a.parseHash(location.hash).id)}var e=$('#header .user-head .nav-top .nav-top-list'),g=e.find('.nav-item'),h=e.find('.nav-item-team'),i=e.find('.nav-item-login'),j=i.find('.nologin'),k=i.find('.userBtn');window.PIE&&'Microsoft Internet Explorer'==navigator.appName&&'MSIE8.0'==navigator.appVersion.split(';')[1].replace(/[ ]/g,'')&&($('.nav-item-current').each(function(){PIE.attach(this)}),$('.user-wrap').each(function(){PIE.attach(this)}),$('.son-nav-list').each(function(){PIE.attach(this)}),$('.user-panel').each(function(){PIE.attach(this)}),$('.user-info-avatar').each(function(){PIE.attach(this)}),$('.userinfo-avatar').each(function(){PIE.attach(this)})),g.find('a.navlink').on('click',function(a){a.stopPropagation();var b=$(this);b.hasClass('navlink-current')||(b.parent('li.nav-item').siblings('li').find('>a.navlink').removeClass('navlink-current'),b.addClass('navlink-current'))}),$(document).on('scroll',function(){$(this).scrollTop()>$('#header').height()?$('#header .user-head').addClass('user-head-fixed'):$('#header .user-head').removeClass('user-head-fixed')}),$(document).on('mouseover','li.nav-item-team',function(){$('li.nav-item-team .son-nav-wrap').show()}),$(document).on('mouseout','li.nav-item-team',function(){$('li.nav-item-team .son-nav-wrap').hide()}),h.find('.son-nav-wrap a.sub-nav-item').on('click',function(a){var a=a||window.e;a.stopPropagation();var d=$(this),c=d.attr('data-pid');d.hasClass('current')||(d.siblings().removeClass('current'),d.addClass('current')),$('.son-nav-wrap').hide(),b.setCookie('parentid',c)}),k.find('a.logout').on('click',function(c){var c=c||window.e;c.stopPropagation();var d=b.getUserData().id,e=b.getUserData().token;b.delCookie('userid',void 0),b.delCookie('token',void 0),b.delCookie('orgid',void 0),b.delCookie('orgindex',void 0),b.delCookie('parentid',void 0),b.delCookie('orgname',void 0),b.delCookie('device_ids',void 0),b.delCookie('app_ids',void 0),b.delCookie('employee_count',void 0),b.setUserData(void 0,!0),a.replaceLocation({args:{},id:'loginhome'}),$('.loginQr').trigger('click')});var l;b.updateUserData(b.getCookie('userid'),b.getCookie('token'),function(){a.init('home')}),a.listeners.add(b.userEvents,'statechange',function(a){a.data?(c(a),j.hide(),k.addClass('hasLogin'),k.show()):(j.show(),k.removeClass('hasLogin'),k.hide()),a.data?h.show():h.hide()}),a.listeners.add(b.userEvents,'datachange',c),a.listeners.add(b.userEvents,'pagechange',f),a.listeners.add(a.pageEvents,'routend',function(){var b;a.lastLocation&&a.lastLocation.id!==a.location.id&&!l&&(b=Math.max(document.body.scrollTop,document.documentElement.scrollTop),0<b&&$('html,body').animate({scrollTop:0},b))})});