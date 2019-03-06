'use strict';
define(['common/kernel/kernel', 'site/util/util', 'common/text/text!page/imports/member.html!strip'], function(kernel, util, html) {
    var taskid = kernel.parseHash(location.hash).args.id;
    var userid = util.getCookie('userid'),
        token = util.getCookie('token'),
        orgid = util.getCookie('orgid'),
        isImport = false;
    var tempPage = 0, tempSize = 50, tempGoon = false, tempNePage = 0, tempNeGoon = false;
    var $dom = $(html),
        $imports = $('#imports .imports-box'),
        $members = $imports.find('.imports-info .imports-inner');
        $members.append($dom);
    var $importsNav = $members.find('.imports-inner-data .imports-nav a'),
        $importsTable = $members.find('.imports-inner-data .imports-table'),
        $reUploadBtn = $members.find('.imports-upload button.btn-upload');
    //导入数据
    $importsNav.on('click', function(e){
        e.stopPropagation();
        var loc = kernel.parseHash(location.hash), task_id = loc.args.id;
        var c = $(this),index = c.index();
        if(!c.hasClass('active')){
            c.addClass('active').siblings().removeClass('active');
            $importsTable.find('>div').eq(index).addClass('active').siblings().removeClass('active');
            $importsTable.find('>div').eq(index).find('.table-data-wrap').addClass('active');
            $importsTable.find('>div').eq(index).siblings().find('.table-data-wrap').removeClass('active');
            loc.args.imports = (index == 0) ? 'enable' : 'unable';
            kernel.replaceLocation(loc);
        }
    });

    //重新上传
    $reUploadBtn.on('click', function(e){
        e.stopPropagation();
        var loc = kernel.parseHash(location.hash);
        loc = {'id':'imports','args':{}};
        //resetUploadFile();
        kernel.replaceLocation(loc);
    });

    if(taskid){
        getRecordInfo({
            status: 1,
            task_id: taskid,
            userid: userid,
            token: token,
            url: '/v1.0/importtask/item/byTask',
            orgid: orgid,
            page: tempPage,
            size: tempSize,
            $target: $members.find('.imports-inner-data')
        });

        getRecordInfo({
            status: -1,
            task_id: taskid,
            userid: userid,
            token: token,
            url: '/v1.0/importtask/item/byTask',
            orgid: orgid,
            page: tempNePage,
            size: tempSize,
            $target: $members.find('.imports-inner-data')
        });

        //导入数据分页处理
        $members.find('.imports-inner-data .imports-table .imports-table-enable .table-data-wrap').off('scroll').scroll(function () {
            var t = $(this).height(),
                e = $(this)[0].scrollHeight;
            if ($(this)[0].scrollTop + t + 150 >= e && $(this)[0].scrollTop != 0 && tempGoon) {
                tempGoon = false;
                //$(this).scrollTop(0);
                getRecordInfo({
                    status: 1,
                    task_id: taskid,
                    userid: userid,
                    token: token,
                    url: '/v1.0/importtask/item/byTask',
                    orgid: orgid,
                    page: ++tempPage,
                    size: tempSize,
                    $target: $members.find('.imports-inner-data')
                });
            }
        });

        $members.find('.imports-inner-data .imports-table .imports-table-unable .table-data-wrap').off('scroll').scroll(function () {
            var t = $(this).height(),
                e = $(this)[0].scrollHeight;
            if ($(this)[0].scrollTop + t + 150 >= e && $(this)[0].scrollTop != 0 && tempNeGoon) {
                tempNeGoon = false;
                //$(this).scrollTop(0);
                getRecordInfo({
                    status: -1,
                    task_id: taskid,
                    userid: userid,
                    token: token,
                    url: '/v1.0/importtask/item/byTask',
                    orgid: orgid,
                    page: ++tempNePage,
                    size: tempSize,
                    $target: $members.find('.imports-inner-data')
                });
            }
        });
    }

    return function(callback){
        //resetUploadFile();
    }

    //导入成员信息
    function getRecordInfo(data){
        var timestamp = (new Date().valueOf()).toString();
        util.ajaxSubmit({
            type: 'get',
            url: data.url,
            dauth: data.userid + ' ' + timestamp + ' ' + kernel.buildDauth(data.userid, data.token, timestamp),
            data: {
                task_id: data.task_id,
                status: data.status,
                size: data.size,
                page: data.page
            },
            success: function(res) {
                if(data.status == 1 && data.page == 0){
                    data.$target.find('.imports-table-enable table.table tbody.tbody >').remove();
                }else if(data.status == -1 && data.page == 0){
                    data.$target.find('.imports-table-unable table.table tbody.tbody >').remove();
                }
                if(res.code == 0){
                    var json = res.data['result'], targetHtml = '';
                    (data.status == 1) ? data.$target.find('span.nav-enable-num').text(json.total) : data.$target.find('span.nav-unable-num').text(json.total);
                    if(json.total >= 0 && (json.rows && json.rows.length > 0)){
                        $.each(json.rows, function(i, n){
                            targetHtml += '<tr>\
                                <td class="user-index">'+ (data.page * data.size  + i + 1) +'</td>\
                                <td class="user-name"><p>'+ n.name +'</p></td>\
                                <td class="user-employeenum">'+ n.employee_num +'</td>\
                                <td class="user-deptname" title="'+ n.dept_name +'"><p>'+ n.dept_name +'</p></td>\
                                <td class="user-title" title="'+ n.title +'"><p>'+ n.title +'</p></td>\
                                <td class="user-mobile">'+ n.mobile +'</td>\
                                '+ ((data.status && data.status != 1) ? '<td class="user-error"><span class="red">'+ ((n.msg && n.msg != '') ? n.msg : '通讯录中已存在该手机号码的员工') +'</span></td>' : '') +'\
                            </tr>';
                        });
                        (data.status == 1) ? data.$target.find('.imports-table-enable .table-data-wrap .table-data tbody.tbody').append(targetHtml) : data.$target.find('.imports-table-unable .table-data-wrap .table-data tbody.tbody').append(targetHtml);
                        if (json.rows.length >= tempSize) {
                            (data.status == 1) ? tempGoon = true : tempNeGoon = true;
                        }else{
                            if(data.status == 1 && tempPage > 0){
                                if(data.$target.find('.imports-table-enable .table-data-wrap .table-data tbody.tbody tr').length == 0){
                                    data.$target.find('.imports-table-enable .table-data-wrap .table-data tbody.tbody').append('<tr class="empty"><td rowspan="3" colspan="5">没有更多了</td></tr>')
                                }
                            }else if(data.status == 1 && tempNePage > 0){
                                if(data.$target.find('.imports-table-unable .table-data-wrap .table-data tbody.tbody tr').length == 0){
                                    data.$target.find('.imports-table-unable .table-data-wrap .table-data tbody.tbody').append('<tr class="empty"><td rowspan="3" colspan="6">没有更多了</td></tr>')
                                }
                            }
                        }
                    }else{
                        if(data.status == 1){
                            if(data.$target.find('.imports-table-enable .table-data-wrap .table-data tbody.tbody tr').length == 0){
                                data.$target.find('.imports-table-enable .table-data-wrap .table-data tbody.tbody').append('<tr class="empty"><td rowspan="3" colspan="5">暂无已导入数据</td></tr>')
                            }
                        }else{
                            if(data.$target.find('.imports-table-unable .table-data-wrap .table-data tbody.tbody tr').length == 0){
                                data.$target.find('.imports-table-unable .table-data-wrap .table-data tbody.tbody').append('<tr class="empty"><td rowspan="3" colspan="6">暂无不可导入数据</td></tr>')
                            }
                        }
                    }
                }else{
                    kernel.hint('查看历史导入任务失败', 'error');
                }
            }
        });
    }
});