'use strict';define(['module','common/kernel/kernel','site/util/util','page/device/device'],function(a,b,c,d){var e,f,g,h;e=c.getCookie('userid'),f=c.getCookie('token'),g=c.getCookie('orgid');var i=a.id.replace(/^[^/]+\/|\/[^/]+/g,''),j=$('#'+i),k=j.find('.del-title'),l=j.find('.btn-confirm'),m=j.find('.btn-close');return{onload:function onload(a){console.log('params',a),h=a.data,k.text(h.title),l.off('click').on('click',function(){c.ajaxSubmit({type:'post',url:'/v1.0/bind/unbind/device/'+h.devid,dauth:e+' '+new Date().valueOf()+' '+b.buildDauth(e,f,new Date().valueOf()),data:{},success:function success(a){console.log('res',a),0==a.code?b.hint('\u5220\u9664\u8BBE\u5907\u6210\u529F','success'):b.hint('\u5220\u9664\u8BBE\u5907\u5931\u8D25','error'),b.closePopup('deldevice'),d.getDeviceSub(e,f,g,$('#device .dev-box .dev-main .dev-installed .dev-wrap table.table tbody.tbody'))},error:function error(a){b.hint(a.msg,'error')}})}),m.off('click').on('click',function(){b.closePopup('deldevice')})}}});