'use strict';
define(['common/kernel/kernel', 'site/util/util',  'page/imports/member', 'common/text/text!page/imports/steps.html!strip'], function(kernel, util, member, html) {
    var loc = kernel.parseHash(location.hash);
	var userid = util.getCookie('userid'),
        token = util.getCookie('token'),
        orgid = util.getCookie('orgid'),
        scnt, fcnt, isImport = false;

    member(function(){
        var $dom = $(html),
            $imports = $('#imports .imports-box'),
            $importsInfo = $imports.find('.imports-info'),
            $importsCrumbs = $importsInfo.find('.imports-crumbs'),
            $importsCrumbsUser = $importsCrumbs.find('.imports-crumbs-user'),
            $importsCrumbsInfo = $importsCrumbs.find('.imports-crumbs-info'),
            $importsInner = $importsInfo.find('.imports-inner'),
            $downloadBtn = $dom.find('.btn-step-download'),
            $uploadBtn = $dom.find('.btn-step-upload'),
            $uploadForm = $dom.find('#upload-form'),
            $uploadHideBtn = $dom.find('#upload-file');
            $imports.append($dom);
        var $importsSteps = $imports.find('.imports-steps');
        var $importsNav = $importsInner.find('.imports-inner-data .imports-nav a'),
            $importsTable = $importsInner.find('.imports-inner-data .imports-table'),
            $reUploadBtn = $importsInner.find('.imports-upload button.btn-upload'),
            $scntBtn = $importsInner.find('.imports-nav a.nav-enable'),
            $fcntBtn = $importsInner.find('.imports-nav a.nav-unable'),
            $scntTarget = $importsInner.find('.imports-inner-data .imports-table .imports-table-enable .table-data-wrap table.table-data tbody.tbody'),
            $fcntTarget = $importsInner.find('.imports-inner-data .imports-table .imports-table-unable .table-data-wrap table.table-data tbody.tbody');

        $importsNav.on('click', function(e){
            e.stopPropagation();
            var c = $(this),index = c.index();
            if(!c.hasClass('active')){
                c.addClass('active').siblings().removeClass('active');
                $importsTable.find('div').eq(index).addClass('active').siblings().removeClass('active');
            }
            loc.args.imports = (index == 0) ? 'enable' : 'unable';
            kernel.replaceLocation(loc);
        });

        $uploadForm.on('change','#upload-file', function(){
            ajaxFileUpload(orgid);
        });

        $importsCrumbsUser.on('click', function(){
            loc.args.type = 'info';
            loc.args.status = 'data';
            kernel.replaceLocation(loc);
        });

        $importsCrumbsInfo.on('click', function(){
            loc.args.type = 'steps';
            loc.args.status = 'data';
            kernel.replaceLocation(loc);
        });

        $reUploadBtn.on('click', function(e){
            e.stopPropagation();
            $('#upload-file').val('');
            loc.args.type = 'info';
            loc.args.status = 'data';
            loc.args.imports = 'unable';
            kernel.replaceLocation(loc);
        });

        function ajaxFileUpload(orgid) {
            kernel.showLoading();
            var timestamp = (new Date().valueOf()).toString();
            $.ajaxFileUpload({
                url: '/web/v1.0/import/employee', //用于文件上传的服务器端请求地址
                secureuri: false, //是否需要安全协议，一般设置为false
                fileElementId: 'upload-file', //文件上传域的ID
                dataType: 'json', //返回值类型 一般设置为json
                beforeSend:function(xhr){
                    xhr.setRequestHeader("dauth", userid + ' ' + timestamp + ' ' + kernel.buildDauth(userid, token, timestamp));
                },
                data: {
                    org_id: orgid,
                    admin_id: userid
                },
                success: function (res, status)  //服务器成功响应处理函数
                {
                    kernel.hideLoading();
                    $('#upload-file').val('');
                    var json = $.parseJSON(jQuery(res).text());
                    if(json.code == 0){
                        scnt = json.data['result'].success_list;
                        fcnt = json.data['result'].fail_list;
                        isImport = true;
                        $scntBtn.find('span.nav-enable-num').text(scnt.length);
                        $fcntBtn.find('span.nav-unable-num').text(fcnt.length);
                        if(scnt.length > 0){
                            util.setCookie('employee_count', (parseInt(util.getCookie('employee_count')) + scnt.length));
                            kernel.hint('成员导入成功~');
                            loc.args.type = 'steps';
                            loc.args.status = 'success';
                        }else{
                            kernel.hint('部分成员导入失败~', 'error');
                            loc.args.type = 'steps';
                            loc.args.status = 'error';
                        }
                        setTargetHtml($scntTarget, 'enable', scnt);
                        setTargetHtml($fcntTarget, 'unable', fcnt);
                        setTimeout(function(){
                            loc.args.type = 'steps';
                            loc.args.status = 'data';
                            loc.args.imports = (scnt.length > 0) ? 'enable' : 'unable';
                            kernel.replaceLocation(loc);
                        }, 1000);
                    }else{
                        isImport = false;
                        loc.args.type = 'steps';
                        loc.args.status = 'error';
                        kernel.hint(json.msg, 'error');
                        setTimeout(function(){
                            loc.args.type = 'steps';
                            loc.args.status = 'data';
                            loc.args.imports = 'unable';
                            kernel.replaceLocation(loc);
                        }, 1000);
                    }
                    kernel.replaceLocation(loc);
                },
                error: function (res, status, e)//服务器响应失败处理函数
                {
                    kernel.hideLoading();
                    $('#upload-file').val('');
                    var json = $.parseJSON(jQuery(res.responseText).text());
                    if(json.code == 0){
                        scnt = json.data['result'].success_list;
                        fcnt = json.data['result'].fail_list;
                        isImport = true;
                        $scntBtn.find('span.nav-enable-num').text(scnt.length);
                        $fcntBtn.find('span.nav-unable-num').text(fcnt.length);
                        if(scnt.length > 0){
                            util.setCookie('employee_count', (parseInt(util.getCookie('employee_count')) + scnt.length));
                            kernel.hint('成员导入成功~');
                            loc.args.type = 'steps';
                            loc.args.status = 'success';
                        }else{
                            kernel.hint('部分成员导入失败~', 'error');
                            loc.args.type = 'steps';
                            loc.args.status = 'error';
                        }
                        setTargetHtml($scntTarget, 'enable', scnt);
                        setTargetHtml($fcntTarget, 'unable', fcnt);
                        setTimeout(function(){
                            loc.args.type = 'steps';
                            loc.args.status = 'data';
                            loc.args.imports = (scnt.length > 0) ? 'enable' : 'unable';
                            kernel.replaceLocation(loc);
                        }, 1000);
                    }else{
                        isImport = false;
                        loc.args.type = 'steps';
                        loc.args.status = 'error';
                        kernel.hint(json.msg, 'error');
                        if(json.code == '9103101'){
                            $importsInner.find('p.user-error-title').hide();
                            $importsInner.find('p.authority-error-title').show();
                        }else{
                            $importsInner.find('p.user-error-title').show();
                            $importsInner.find('p.authority-error-title').hide();
                        }
                    }
                    kernel.replaceLocation(loc);
                }
            });
            return false;
        }

        // 处理上传表格数据
        function setTargetHtml(o, type, data){
            o.find('>').remove();
            if(data && data.length > 0){
                var targetHtml = '';
                $.each(data, function(i, n){
                    targetHtml += '<tr>\
                        <td class="user-index">'+ (i + 1) +'</td>\
                        <td class="user-name">'+ data[i].name +'</td>\
                        <td class="user-employeenum">'+ data[i].employee_num +'</td>\
                        <td class="user-deptname" title="'+ data[i].dept_name +'">'+ data[i].dept_name +'</td>\
                        <td class="user-title" title="'+ data[i].title +'">'+ data[i].title +'</td>\
                        <td class="user-mobile">'+ data[i].mobile +'</td>\
                        '+ ((type && type == 'unable') ? '<td class="user-error"><span class="red">通讯录中已存在该手机号码的员工</span></td>' : '') +'\
                    </tr>';
                });
                o.append(targetHtml);
            }
        }
    });

    return function(callback){
        if(isImport && isImport == true){
            $importsInfo.show();
            $importsSteps.hide();
            /*member(function(){});
            if(typeof callback === 'function'){
                callback();
            }*/
        }
    }
});