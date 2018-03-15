'use strict';
define(['common/kernel/kernel', 'site/util/util'], function(kernel, util) {
    var userid, token, orgid, parentid, loc, locid, orgNavNull = 0;
    var $userlist = $('#header .user-head .nav-top .nav-top-list'),
        $userteam = $userlist.find('.nav-item-team'),
        $userpanel = $userlist.find('.nav-item-login'),
        $userlogout = $userpanel.find('.nologin'),
        $userlogin = $userpanel.find('.hasLogin');
    var $orgBox = $('#orghome .org-box'),
        $orgList = $orgBox.find('.org-wrap .org-inner .org-list'),
        $navTeam = $('#header .nav-top .nav-top-list .nav-item-team'),
        $orgNavList = $navTeam.find('.son-nav-list-team');
    return {
        onload: function(force) {
            userid = util.getCookie('userid'),
            token = util.getCookie('token'),
            orgid = util.getCookie('orgid'),
            parentid = util.getCookie('parentid');
            loc = util.clone(kernel.location), locid = loc.id;
            if(userid === undefined || token === undefined){
                util.setUserData(undefined);
                kernel.replaceLocation({'args': {},'id': 'loginhome'});
            }else{
                if(util.getCookie('tempInfo')){
                    var userTemp = JSON.parse(util.getCookie('tempInfo'));
                    //$userteam.show();
                    $userlogin.show();
                    $userlogout.hide();
                }
                initOrgs($orgList, $orgNavList, {
                    userid: userid,
                    token: token
                });
            }
            console.log("tempInfo", JSON.parse(util.getCookie('tempInfo')));
        },
        switchOrgs : function(o, data){
            var uid = data.userid, token = data.token, orgid = data.orgid, orgname = data.orgname;
            //查看我能管理的部门 /v1.0/admin/auth/my
            util.ajaxSubmit({
                type: 'get',
                url: '/v1.0/admin/auth/my',
                dauth: uid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token),
                data: {
                    type: 'group'
                },
                success: function(json) {
                    if (json.code == 0) {
                        $userteam.show();
                        o.find('>').remove('');
                        var orgInfo = json.data.result;
                        $.each(orgInfo, function(i, item) {
                            if(item.is_admin != undefined){
                                var newIdata = {
                                    employee_count: item.employee_count,
                                    app_ids: item.app_usable,
                                    device_ids: item.device_usable,
                                    department_ids: item.department_ids
                                };
                                var $itemHtml = $('<a class="sub-nav-item '+((orgid == item.org_id)?'current':'')+'"  href="javascript:;" data-oid="' + item.org_id + '" data-pid="' + item.top_department_id + '">' + item.org_name + '</a>');
                                o.append($itemHtml);
                                setOrgNav($itemHtml, {
                                    name: item.org_name,
                                    orgid : item.org_id,

                                });
                                // 切换组织
                                function setOrgNav(o, d, data) {
                                    o.on('click', function(e) {
                                        var e = e || window.e;
                                        e.stopPropagation();
                                        var c = $(this), pid = c.attr('data-pid'), oid = c.attr('data-oid'), oname = c.text();
                                        if(!c.hasClass('current')){
                                            o.parent('.nav-item-team').find('a.nav-item-current .navlink-name').text(oname);
                                            c.siblings().removeClass('current');
                                            c.addClass('current');
                                            // 获取组织adminid
                                            /*util.ajaxSubmit({
                                                type: 'get',
                                                url: '/v1.0/org/'+ orgid +'',
                                                dauth: uid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token),
                                                success: function(json) {
                                                    if (json.code == 0) {
                                                        util.setCookie('adminid', json.data.result['admin_id']);
                                                    }
                                                }
                                            });*/
                                            util.setCookie('parentid', pid);
                                            util.setCookie('orgid', oid);
                                            util.setCookie('orgname', oname);
                                            util.setCookie('idata', JSON.stringify(newIdata));
                                            location.reload();
                                        }
                                        $(".son-nav-list-team").hide();
                                    });
                                }
                            }
                        });
                        o.parent('.nav-item-team').find('a.nav-item-current .navlink-name').text(orgname);
                        /*util.updateUserData(uid, token, function(data){
                            console.log("data", data);
                        });*/
                        // 获取组织adminid
                        /*util.ajaxSubmit({
                            type: 'get',
                            url: '/v1.0/org/'+ orgid +'',
                            dauth: uid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token),
                            success: function(json) {
                                if (json.code == 0) {
                                    util.setCookie('adminid', json.data.result['admin_id']);
                                }
                            }
                        });*/
                        console.log("getUserData", util.getUserData());
                    } else {
                        kernel.hint(json.msg, 'error');
                    }
                }
            });
        }
    };
    //选择并切换组织 
    function initOrgs(o, os, data){
        //查看我能管理的部门 /v1.0/admin/auth/my
        util.ajaxSubmit({
            type: 'get',
            url: '/v1.0/admin/auth/my',
            dauth: data.userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(data.token),
            data: {
                type: 'group'
            },
            success: function(json) {
                if (json.code == 0) {
                    var orgInfo = json.data.result,
                        length = orgInfo.length,
                        tempInfo = [];
                    o.find('>').remove('');
                    os.find('>').remove('');
                    // 组织列表
                    //(length <= 3) ? ((length == 1) ? kernel.replaceLocation({'args': {},'id': 'contacts'}) && (util.setCookie('orgid', orgInfo[0].org_id), util.setCookie('parentid', orgInfo[0].top_department_id), util.setCookie('orgname', orgInfo[0].org_name)) : o.addClass('org-list-seldom')) : o.addClass('org-list-plenty');
                    (length <= 3) ? ((length == 1) ? (util.setCookie('orgid', orgInfo[0].org_id), util.setCookie('parentid', orgInfo[0].top_department_id), util.setCookie('orgname', orgInfo[0].org_name), kernel.replaceLocation({'args': {},'id': 'home'})) : o.addClass('org-list-seldom')) : o.addClass('org-list-plenty');
                    
                    $.each(orgInfo, function(i, item) {
                        if(item.is_admin){
                            var idata = {
                                employee_count: item.employee_count,
                                app_ids: item.app_usable,
                                device_ids: item.device_usable,
                                department_ids: item.department_ids
                            };
                            var $tempOrg = $('<li class="list-item"><a class="list-item-inner" href="javascript:;" data-oid="' + item.org_id + '" data-pid="' + item.top_department_id + '">' + item.org_name + '</a></li>');
                            var $tempOrgNav = $('<a class="sub-nav-item"  href="javascript:;" data-oid="' + item.org_id + '" data-pid="' + item.top_department_id + '">' + item.org_name + '</a>');
                            o.append($tempOrg), os.append($tempOrgNav);
                            setOrgList($tempOrg), setOrgNav($tempOrgNav, o.parent('.nav-item-team'), {
                                name: item.org_name,
                                orgid : item.org_id
                            });

                            orgNavNull++;

                            // 切换组织
                            function setOrgNav(o, d, data) {
                                o.on('click', function(e) {
                                    var e= e || window.e;
                                    e.stopPropagation();
                                    var c = $(this), pid = c.attr('data-pid');
                                    if(!c.hasClass('current')){
                                        c.siblings().removeClass('current');
                                        c.addClass('current');
                                    }
                                    $(".son-nav-list-team").hide();
                                    util.setCookie('parentid', pid);
                                    d.find('a.nav-item-current .navlink-name').text(data.name);
                                });
                            }

                            // 选择组织
                            function setOrgList(o) {
                                o.find('a.list-item-inner').on('click', function(e) {
                                    e.stopPropagation();
                                    util.setCookie('orgid', item.org_id);
                                    util.setCookie('parentid', item.top_department_id);
                                    util.setCookie('orgname', item.org_name);
                                    util.setCookie('idata', JSON.stringify(idata));
                                    // 获取组织adminid
                                    /*util.ajaxSubmit({
                                        type: 'get',
                                        url: '/v1.0/org/'+ orgid +'',
                                        dauth: data.userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(data.token),
                                        success: function(json) {
                                            if (json.code == 0) {
                                                util.setCookie('adminid', json.data.result['admin_id']);
                                            }
                                        }
                                    });*/
                                    kernel.replaceLocation({
                                        'args': {},
                                        'id': 'home'// contacts
                                    });
                                });
                            }
                            
                        }
                    });
                    if(orgNavNull == 0){}
                    // 获取组织adminid
                    /*util.ajaxSubmit({
                        type: 'get',
                        url: '/v1.0/org/'+ orgid +'',
                        dauth: data.userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(data.token),
                        success: function(json) {
                            if (json.code == 0) {
                                util.setCookie('adminid', json.data.result['admin_id']);
                            }
                        }
                    });*/
                } else {
                    kernel.hint(json.msg);
                }
            }
        });
    }
});