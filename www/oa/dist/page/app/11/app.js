'use strict';define(['common/kernel/kernel','site/util/util'],function(a,b){var c,d,e,f,g,h,i,j=$('#app .app-box'),k=j.find('.app-main .app-inner .app-main-list'),l=j.find('.btn-app-back');return l.on('click',function(){window.history.back()}),{onload:function onload(){function j(f){f.find('>').remove();var g=new Date().valueOf().toString();b.ajaxSubmit({type:'get',url:'/v1.0/app',dauth:c+' '+g+' '+a.buildDauth(c,d,g),data:{org_id:e},success:function success(a){for(var b=a.data.result,c=0;c<b.length;c++){var d='',e='';switch(e=!0==b[c].installed?'<a data-appid="'+b[c].id+'" class="btn btn-default btn-uninstall" title="\u5DF2\u5B89\u88C5" href="javascript:;">\u5DF2\u5B89\u88C5</a>':'<a data-appid="'+b[c].id+'" class="btn btn-info btn-install" title="\u5B89\u88C5" href="javascript:;">\u5B89\u88C5</a>',b[c].belong_type){case'group':d='<span class="item-category-name">\u56E2\u961F\u53EF\u7528</span>';break;case'user':d='<span class="item-category-name">\u4E2A\u4EBA\u53EF\u7528</span>';break;case'both':d='<span class="item-category-name">\u56E2\u961F\u53EF\u7528</span><span class="item-category-name">\u4E2A\u4EBA\u53EF\u7528</span>';}var g=$('<li class="item">                                <div class="item-wrap clear">                                    <div class="item-img" title="'+b[c].name+'">                                        <img  src="'+b[c].icon+'" width="80" height="80" />                                    </div>                                    <div class="item-info">                                        <div class="item-title clear">                                            <div class="item-text">'+b[c].name+'</div>                                            <div class="item-category">'+d+'</div>                                        </div>                                        <div class="item-content">'+b[c].slogan+'</div>                                    </div>                                </div>                                <div class="item-btn">                                    '+e+'                                </div>                            </li>');f.append(g),l(g.find('.btn-install'),f,{appid:b[c].id,type:b[c].belong_type})}}})}function l(f,g,h){f.on('click',function(){var f=new Date().valueOf().toString();'group'==h.type||'both'==h.type?b.ajaxSubmit({type:'post',url:'/v1.0/bind/bind',dauth:c+' '+f+' '+a.buildDauth(c,d,f),data:{org_id:e,app_id:h.appid},success:function success(c){0==c.code&&(a.hint('\u5E94\u7528\u5B89\u88C5\u6210\u529F','success'),b.setCookie('app_ids',parseInt(b.getCookie('app_ids'))+1),j(g))}}):a.hint('\u4F01\u4E1A\u7EC4\u7EC7\u65E0\u6CD5\u6DFB\u52A0\u4E2A\u4EBA\u5E94\u7528','info')})}if(c=b.getCookie('userid'),d=b.getCookie('token'),e=b.getCookie('orgid'),f=b.getCookie('orgname'),g=b.getCookie('parentid'),h=b.clone(a.location),i=h.id,void 0===c||void 0===d||void 0===e)b.setUserData(void 0),a.replaceLocation({args:{},id:'loginhome'});else{if('app'==i){var m=$('#header .user-head .nav-top .nav-item');m.find('a.navlink').removeClass('navlink-current'),m.find('a.navlink-group').show(),m.find('a.navlink-user').hide(),m.find('a.navlink-admin').hide(),m.find('a.navlink.appBtn').addClass('navlink-current')}j(k)}}}});