'use strict';define(['module','common/kernel/kernel','site/util/util','page/device/device'],function(a,b,c,d){var e=a.id.replace(/^[^/]+\/|\/[^/]+/g,''),f=$('#'+e),g=f.find('.form-group input.devicename'),h=f.find('.btn-confirm'),i=f.find('.btn-close'),j=c.getCookie('userid'),k=c.getCookie('token'),l=c.getCookie('orgid');return{onload:function onload(a){console.log('params',a);var e=a.data;g.val(e.name),h.off('click').on('click',function(){c.ajaxSubmit({type:'post',url:'/v1.0/device/'+e.devid+'/name',dauth:j+' '+new Date().valueOf()+' '+b.buildDauth(j,k,new Date().valueOf()),data:{name:g.val()},success:function success(a){b.closePopup('editdevice'),0==a.code?(b.hint('\u4FDD\u5B58\u6210\u529F~','success'),d.getDeviceSub(j,k,l,$('#device .dev-box').find('.dev-main .dev-installed .dev-wrap table.table tbody.tbody'))):b.hint(a.msg,'error')},error:function error(a){b.closePopup('editdevice'),b.hint(a.msg,'error')}})}),i.off('click').on('click',function(){b.closePopup('editdevice')})}}});