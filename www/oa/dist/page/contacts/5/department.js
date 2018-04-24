'use strict';define(['common/kernel/kernel','site/util/util','common/text/text!page/contacts/department.html!strip'],function(a,b,c){var d,e,f,g,h,i,j,k=$(c),l=$('#contacts .contacts-box');l.append($(k));var m=$(k).find('.department-form .form-title'),n=$(k).find('.department-form .form-btns .btn-dept-add'),o=$(k).find('.department-inner'),p=o.find('.department-list .department-list-inner');return function(){if(d=b.getCookie('userid'),e=b.getCookie('token'),f=b.getCookie('orgid'),h=b.getCookie('orgname'),g=b.getCookie('parentid'),i=a.parseHash(location.hash),j=i.id,'contacts'==j){var c=function(a,b){console.log('initTopDept');var c=b.status,d=b.relation,e=b.parentid,f=b.orgid,g=b.index+1,h=b.orgname,i='parent'==d?e:f;a.find('>').remove(),'parent'==d?m.text(h):d='son',k(a,{orgid:i,title:b.orgname,index:g,relation:d})},k=function(j,l){b.ajaxSubmit({type:'get',url:'/v1.0/org/department/'+l.orgid+'/departments',dauth:d+' '+new Date().valueOf()+' '+a.buildDauth(d,e,new Date().valueOf()),data:{},success:function success(b){var d=b.data.result;if(0<d.length)for(var e=function(){function b(a,b,c){b.hasClass('current')||(a.find('li.select-item div.item-info').removeClass('current'),b.addClass('current'));var d='parent'==l.relation?a:b;'onload'==d.attr('data-status')&&d.attr('data-status','loaded'),'function'==typeof c&&c()}i=d[m].directors&&d[m].directors[0].name?'<span class="item-admin"><span class="item-admin-name">'+d[m].directors[0].name+'</span>(<em>\u4E3B\u7BA1</em>)</span>':'<span class="null">\u7A7A\u7F3A</span>',n=$('<li class="select-item clear" data-orgid="'+d[m].id+'" data-status="onload" data-expand="false">                                    <div class="item-info clear" data-status="onload">                                        <div class="item-text fl">                                            <i class="iconfont item-class">&#xe608;</i><span class="text"><span class="item-name">'+d[m].name+'</span><span class="item-count">(<em>'+d[m].employee_cnt+'\u4EBA</em>)</span></span>/'+i+'                                        </div>                                        <div class="item-setup fr">                                            <a class="setup-admin" title="\u8BBE\u7F6E\u4E3B\u7BA1" href="javascript:;"><i class="iconfont">&#xe634;</i></a>                                            <a class="setup-rename" title="\u91CD\u547D\u540D" href="javascript:;"><i class="iconfont">&#xe618;</i></a>                                            <a class="setup-add" title="\u6DFB\u52A0\u5B50\u90E8\u95E8" href="javascript:;"><i class="iconfont">&#xe73e;</i></a>                                            <a class="setup-del" title="\u5220\u9664\u90E8\u95E8" href="javascript:;"><i class="iconfont">&#xe6df;</i></a>                                        </div>                                    </div>                                    <ul class="item-select-inner-son" data-index="'+l.index+'" data-status="onload"></ul>                                </li>'),j.append(n),function(d,i){d.on('click',function(a){var b=a||window.event;b.stopPropagation();var d=b.target||b.srcElement,e=$(this),c=e.find('> div.item-info'),f=e.find('> ul.item-select-inner-son');o(e),c.hasClass('current')||(p.find('li.select-item div.item-info').removeClass('current'),c.addClass('current')),'loaded'==e.attr('data-status')||(e.attr('data-status','loaded'),e.attr('data-expand',!0),k(f,{orgid:i.orgid,title:i.name,index:i.index+1}))}),d.on('click','.item-setup .setup-admin',function(){var d=$(this).parent('.item-setup').parent('.item-info');b(p,d,function(){a.openPopup('seluser',{type:'seluser',data:{orgid:i.orgid,adnull:!!(0<d.find('.item-text .item-admin').length),$target:$(0<d.find('.item-text .item-admin').length?d.find('.item-text .item-admin'):d.find('.item-text .null'))},func:function func(){c(p,{status:'onload',relation:'parent',orgid:f,orgname:h,parentid:g,index:0})}})})}),d.on('click','.item-setup .setup-rename',function(){var d=$(this).parent('.item-setup').parent('.item-info');b(p,d,function(){a.openPopup('editdept',{type:'rename',data:{id:i.orgid,pid:g,text:'\u8BF7\u8F93\u5165\u65B0\u7684\u90E8\u95E8\u540D\u79F0',name:d.find('.item-text span.text .item-name').text()},$target:$(d.find('.item-text span.text .item-name'))})})}),d.on('click','.item-setup .setup-add',function(){var d=$(this).parent('.item-setup').parent('.item-info');b(p,d,function(){a.openPopup('editdept',{type:'add',data:{id:i.orgid,pid:g,text:'\u8BF7\u8F93\u5165\u90E8\u95E8\u540D\u79F0',name:''},func:function func(){c(p,{status:'onload',relation:'parent',orgid:f,orgname:h,parentid:g,index:0})},idNeedId:!0,isNeedLoad:!0})})}),d.on('click','.item-setup .setup-del',function(d){d.stopPropagation();var e=$(this),j=e.parent('.item-setup').parent('.item-info'),k=e.parent('.item-setup').attr('data-id'),l=e.parent('.item-setup').siblings('a.item-info').find('.item-name').text();b(p,j,function(){a.openPopup('deldept',{type:'group',data:{id:i.orgid,pid:g,name:i.name,title:'\u662F\u5426\u5220\u9664\u8BE5\u90E8\u95E8\uFF1F'},func:function func(){c(p,{status:'onload',relation:'parent',orgid:f,orgname:h,parentid:g,index:0})},isNeedLoad:!0})})})}(n,{orgid:d[m].id,title:'',index:l.index,relation:l.relation,name:d[m].name}),o=function(a){'loaded'==a.attr('data-status')&&('false'==a.attr('data-expand')?(a.attr('data-expand',!0),a.find('.item-info .item-text > i.iconfont').html('&#xe608;'),a.find('ul.item-select-inner-son').toggle()):(a.attr('data-expand',!1),a.find('.item-info .item-text > i.iconfont').html('&#xe641;'),a.find('ul.item-select-inner-son').toggle()))}},m=0;m<d.length;m++){var i,n,o;e()}else if('parent'==l.relation){j.find('>').remove();j.append($('<li class="empty empty-dept"><div class="empty-item empty-item-dept"><div class="empty-img empty-img-dept"></div><p class="empty-text">\u6682\u65E0\u90E8\u95E8</p></div></li>'))}}})},l=$('#header .user-head .nav-top .nav-item');l.find('a.navlink').removeClass('navlink-current'),l.find('a.navlink.orgBtn').addClass('navlink-current'),c(p,{status:'onload',relation:'parent',orgid:f,orgname:h,parentid:g,index:0})}}});