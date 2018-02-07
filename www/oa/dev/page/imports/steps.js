'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util', 'common/text/text!page/imports/steps.html!strip'], function(module, kernel, util, html) {
	var userid = util.getCookie('userid'),
        token = util.getCookie('token'),
        orgid = util.getCookie('orgid');
    var $dom = $(html),
    	$imports = $('#imports .imports-box'),
    	$downloadBtn = $dom.find('.btn-step-download'),
        $uploadBtn = $dom.find('.btn-step-upload'),
        $uploadForm = $dom.find('#upload-form'),
    	$uploadHideBtn = $dom.find('#upload-file');
    	$imports.append($dom);

    $uploadForm.on('change','#upload-file', function(){
        ajaxFileUpload(orgid);
    });

    return function(force){}

    function ajaxFileUpload(orgid) {
        var scnt, fcnt;
        $.ajaxFileUpload({
            url: '/web/v1.0/import/employee', //用于文件上传的服务器端请求地址
            secureuri: false, //是否需要安全协议，一般设置为false
            fileElementId: 'upload-file', //文件上传域的ID
            dataType: 'json', //返回值类型 一般设置为json
            beforeSend:function(xhr){
                xhr.setRequestHeader("dauth", userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token));
            },
            data: {
                org_id: orgid,
                admin_id: userid
            },
            success: function (res, status)  //服务器成功响应处理函数
            {
                var json = $.parseJSON(jQuery(res).text());
                if(json.code == 0){
                    scnt = json.data['result'].success_cnt;
                    fcnt = json.data['result'].fail_cnt;
                    kernel.hint('成功导入成员数:'+ scnt +'人, 导入失败成员数:'+ fcnt +'人');
                }else{
                    kernel.hint(json.msg, 'error');
                }
            },
            error: function (res, status, e)//服务器响应失败处理函数
            {
                var json = $.parseJSON(jQuery(res.responseText).text());
                /*if(json.code == 0){
                    fcnt = json.data['result'].fail_cnt;
                    if(fcnt && fcnt > 0){
                        kernel.hint('导入失败成员数:'+ fcnt +'人')
                    }else{
                        kernel.hint('导入失败', 'error');
                    }
                }else{
                    kernel.hint('导入失败', 'error');
                }*/
                if(json.code == 0){
                    scnt = json.data['result'].success_cnt;
                    fcnt = json.data['result'].fail_cnt;
                    kernel.hint('成功导入成员数:'+ scnt +'人, 导入失败成员数:'+ fcnt +'人');
                }else{
                    kernel.hint(json.msg, 'error');
                }
            }
        });
        return false;
    }
});