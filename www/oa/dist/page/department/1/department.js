'use strict';define(['common/kernel/kernel','site/util/util'],function(a,b){return{onload:function onload(){var c=$('#department .department-box'),d=c.find('.department-menu'),e=c.find('.department-team'),f=c.find('.department-info'),g=f.find('.btn-dept-addsub'),h=f.find('.btn-dept-delete'),i=f.find('.btn-dept-rename'),j=f.find('.btn-dept-setadmin');g.on('click',function(){b.ajaxSubmit({type:'post',url:'/v1.0/org/department',data:{org_id:350236083323142140,name:'\u7814\u53D1\u90E8ios\u7EC4',parent_id:352479372986286100},success:function success(a){console.log('res',a)}})}),h.on('click',function(){b.ajaxSubmit({type:'post',url:'/v1.0/org/department/delete',data:{department_id:35248040954560510000},success:function success(a){console.log('res',a)}})}),i.on('click',function(){a.openPopup('renamedept',{model:{attr:'renamedept'}})}),j.on('click',function(){b.ajaxSubmit({type:'post',url:'/v1.0/org/department/352480409545605120',data:{director_ids:[349944153787858940]},success:function success(a){console.log('res',a)}})})}}});