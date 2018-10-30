'use strict';
define(['common/kernel/kernel', 'site/util/util'], function(kernel, util) {
    var $userlist = $('#header .user-head .nav-top .nav-top-list'),
        $usermenu = $userlist.find('.nav-item'),
        $userteam = $userlist.find('.nav-item-team'),
        $userpanel = $userlist.find('.nav-item-login'),
        $userlogout = $userpanel.find('.nologin'),
        $userlogin = $userpanel.find('.userBtn');
    // ie8 圆角
    if(window.PIE && (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE8.0")){
        $(".nav-item-current").each(function(){
            PIE.attach(this)
        });
        $(".user-wrap").each(function(){
            PIE.attach(this)
        });
        $(".son-nav-list").each(function(){
            PIE.attach(this)
        });
        $(".user-panel").each(function(){
            PIE.attach(this)
        });       
        $(".user-info-avatar").each(function(){
            PIE.attach(this)
        });

        $(".userinfo-avatar").each(function(){
            PIE.attach(this)
        });
    }
    // 顶部导航
    $usermenu.find('a.navlink').on('click',function(e){
        e.stopPropagation();
        var c = $(this);
        if(!c.hasClass('navlink-current')){
            c.parent('li.nav-item').siblings('li').find('>a.navlink').removeClass('navlink-current');
            c.addClass('navlink-current');
        }
    });

    $(document).on('scroll', function() {
        if($(this).scrollTop() > $('#header').height()) {
            $('#header .user-head').addClass('user-head-fixed')
        } else {
            $('#header .user-head').removeClass('user-head-fixed')
        }
    })

    // 我的组织下拉
    $(document).on("mouseover", "li.nav-item-team", function() {
        $("li.nav-item-team .son-nav-wrap").show();       
    })

    $(document).on("mouseout", "li.nav-item-team", function() {
        $("li.nav-item-team .son-nav-wrap").hide();
    })

    $userteam.find('.son-nav-wrap a.sub-nav-item').on('click',function(e){
        var e= e || window.e;
        e.stopPropagation();
        var c = $(this), pid = c.attr('data-pid');
        if(!c.hasClass('current')){
            c.siblings().removeClass('current');
            c.addClass('current');
        }
        $(".son-nav-wrap").hide();
        util.setCookie('parentid', pid);
    });

    // 用户提出
    $userlogin.find('a.logout').on('click', function(e){
        var e = e || window.e;
        e.stopPropagation();
        var uid = util.getUserData().id,
            token = util.getUserData().token;
        // 用户退出 /web/v1.0/cd/logout/web
        /*util.ajaxSubmit({
            type: 'get',
            url: '/v1.0/cd/logout/web',
            dauth: uid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(uid, token, (new Date().valueOf())),
            data: {
                type: 'group'
            },
            success: function(json) {
                if (json.code == 0) {
                    util.delCookie('userid', undefined),
                    util.delCookie('token', undefined),
                    util.delCookie('orgid', undefined),
                    util.delCookie('parentid', undefined);
                    util.setUserData(undefined, true);
                    //kernel.reloadPage('loginhome');
                    window.location.reload();
                } else {
                    kernel.hint(json.msg, 'error');
                }
            }
        });*/
        util.delCookie('userid', undefined),
        util.delCookie('token', undefined),
        util.delCookie('orgid', undefined),
        util.delCookie('orgindex', undefined),
        util.delCookie('orgindexid', undefined),
        util.delCookie('orgindexadmin', undefined),
        util.delCookie('parentid', undefined),
        util.delCookie('orgname', undefined),
        //util.delCookie('device_ids', undefined),
        //util.delCookie('app_ids', undefined),
        util.delCookie('employee_count', undefined),
        util.setUserData(undefined, true);
        kernel.replaceLocation({'args': {},'id': 'loginhome'});
        $('.loginQr').trigger('click');
    });

    //statechange({});

    var historyNav;
    
    //百度统计代码
    /*if (location.host === 'your_production_host') {
        window._hmt = [
            ['_setAutoPageview', false]
        ];
        require(['//hm.baidu.com/hm.js?[your_hmid]'], function() {
            //由于百度统计在head中插入的input标签在ie7中会导致jquery选择器遍历时出错，这里尝试将其移除
            var ipt = head.getElementsByTagName('input')[0];
            if (ipt) {
                head.removeChild(ipt);
            }
        });
    }

    kernel.listeners.add(kernel.pageEvents, 'route', function() {
        historyNav = history.state;
        history.replaceState && history.replaceState(true, null);
        //百度统计接口
        if (window._hmt && _hmt.push) {
            _hmt.push(['_trackPageview', '/' + kernel.buildHash(kernel.location)]);
        }
    });*/

    //在获取用户数据后启动路由
    util.updateUserData(util.getCookie('userid'), util.getCookie('token'),function (data) {
        // init home 
        kernel.init('appentry');
    });
    
    // init home 
    //kernel.init('home');

    kernel.listeners.add(util.userEvents, 'statechange', statechange);
    kernel.listeners.add(util.userEvents, 'datachange', datachange);
    kernel.listeners.add(util.userEvents, 'pagechange', pagechange);

    kernel.listeners.add(kernel.pageEvents, 'routend', function() {
        var h;
        //如果上次访问的页面id和当前页id不同，并且不是在history中导航时，则滚动到页面顶部
        if (kernel.lastLocation && kernel.lastLocation.id !== kernel.location.id && !historyNav) {
            h = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
            if (h > 0) {
                $('html,body').animate({
                    scrollTop: 0
                }, h);
            }
        }
    });

    function showCg(data) {}

    //登录状态变更
    function statechange(evt) {
        //showCg(evt.data);
        if(evt.data){
            $userlogout.hide();
            $userlogin.addClass('hasLogin');
            $userlogin.show();
            $userteam.show();
            datachange(evt);
        }else {
            $userlogout.show();
            $userlogin.removeClass('hasLogin');
            $userlogin.hide();
            $userteam.hide();
        }
    }
    
    //存储数据变更
    function datachange(evt, type) {
        if(evt.data && evt.data.data){
            $userlogin.find('.user-wrap img.user-info-avatar').prop('src', evt.data.data.avatar_url);
            $userlogin.find('.user-panel >.user-info >.userinfo-name-box b').text(evt.data.data.name);
            $userlogin.find('.user-panel >.user-info img').prop('src', evt.data.data.avatar_url);
        }

        /*if(!(evt.data.orgindexadmin && evt.data.orgindexadmin == true)){
            kernel.replaceLocation({'args': {},'id': 'appentry'});
        }*/

        orgdatachange(evt, type);
    }

    //组织信息
    function orgdatachange(evt, type){
        var index = parseInt(util.getCookie('orgindex') ? util.getCookie('orgindex') : 0), indexnum = 0, indexid = util.getCookie('orgindexid');
        var evtdata = ((type && type == 'choose') ? evt : evt.data), indexdata = evtdata.organization;
        for(var i = 0;i < indexdata.length;i++){
            if(indexdata[i].id == indexid){
                index = i;
                util.setCookie('orgindex', i);
                indexnum ++;
            }
        }

        if(indexid && indexdata && indexnum <= 0)index = -1;
        
        if(index >= 0 && evtdata.organization && evtdata.organization.length > 0 && evtdata.organization[index]){
            $('a.nav-item-current .navlink-type').html(evtdata.organization[index].type == 'group' ? '<i class="iconfont icon-group">&#xe643;</i>' : '<i class="iconfont icon-user">&#xe642;</i>');
            $('a.nav-item-current .navlink-name').text(evtdata.organization[index].name);
            $('.nav-item-team .son-nav-wrap .son-nav-list-team').find('>').remove();
            //update 20180522
            evtdata.orgindex = index;
            if(evtdata.organization[evtdata.orgindex].id != evtdata.orgindexid){
                evtdata.orgindexid = evtdata.organization[evtdata.orgindex].id;
            }

            if(evtdata.organization && evtdata.organization.length > 0){
                $.each(evtdata.organization, function(i, item) {
                    var targetIcon =  (item.type == 'group' ? '<i class="iconfont icon-group">&#xe643;</i>' : '<i class="iconfont icon-user">&#xe642;</i>');
                    var $targetHtml = $('<a class="sub-nav-item '+ ((evtdata.organization[index].id == item.id) ? 'current' : '') +'"  href="javascript:;" data-oid="' + item.id + '" data-pid="' + item.top_department_id + '">'+ targetIcon +'' + item.name + '</a>');
                    $('.nav-item-team .son-nav-wrap .son-nav-list-team').append($targetHtml);
                    return function(){
                        // 切换组织
                        $targetHtml.on('click', function(e) {
                            var e = e || window.e;
                            e.stopPropagation();
                            var c = $(this), oname = item.name;
                            if(!c.hasClass('current')){
                                $targetHtml.parents('.nav-item-team').find('a.nav-item-current .navlink-type').html(targetIcon);
                                $targetHtml.parents('.nav-item-team').find('a.nav-item-current .navlink-name').text(oname);
                                c.siblings().removeClass('current');
                                c.addClass('current');
                                // update 20180308 更新相应数据
                                compareData({
                                    userid: evtdata.data.id,
                                    orgid: evtdata.organization[c.index()].id,
                                    token: util.getCookie('token')
                                }, evtdata, c.index());

                                /*evtdata.orgindex = c.index();
                                util.setCookie('orgindex', evtdata.orgindex);
                                util.setCookie('orgindexid', evtdata.organization[evtdata.orgindex].id);
                                util.setCookie('orgindexadmin', evtdata.orgindexadmin);
                                // update 20180313 更新相应数据
                                util.setUserData(evtdata);*/
                                if(kernel.parseHash(location.hash).id == 'imports' && kernel.parseHash(location.hash).args.id) kernel.replaceLocation({'args':{},'id':'imports'});
                            }
                            $('.nav-item-team .son-nav-wrap').hide();
                        });
                    }();
                });
            }else{
                pagechange(evt, type);
            }
        }else{
            $userlogin.find('a.logout').trigger('click');
        }
    }

    //页面数据变更
    function pagechange(evt, type){
        var evtdata = (type && type == 'choose') ? evt : evt.data;
        if(evtdata && evtdata.data && evtdata.data.id){
            util.setCookie('userid', evtdata.data.id),
            util.setCookie('orgid', evtdata.organization[evtdata.orgindex].id),
            util.setCookie('parentid', evtdata.organization[evtdata.orgindex].top_department_id),
            util.setCookie('orgname', evtdata.organization[evtdata.orgindex].name),
            util.setCookie('orgtype', evtdata.organization[evtdata.orgindex].type)
            //util.setCookie('device_ids', (evt.data.organization[evt.data.orgindex].device_ids ? evt.data.organization[evt.data.orgindex].device_ids.length : 0)),
            //util.setCookie('app_ids', (evt.data.organization[evt.data.orgindex].app_ids ? evt.data.organization[evt.data.orgindex].app_ids.length : 0)),
            util.setCookie('employee_count', evtdata.organization[evtdata.orgindex].employee_cnt);
        }

        if(evtdata){
            if(evtdata.orgindexadmin && evtdata.orgindexadmin == true){
                kernel.reloadPage(kernel.parseHash(location.hash).id);
            }else{
                kernel.replaceLocation({'args': {},'id': 'appentry'});
            }
        }
    }

    //组织切换
    function orgchange(evt, type){
        if(kernel.parseHash(location.hash).id == 'appentry'){
            if(evt.orgindexadmin && evt.orgindexadmin == true){
                $usermenu.find('.navlink-user').show()
                $usermenu.find('.navlink-admin').show()
                $usermenu.find('.navlink-group').hide()
            }else{
                $usermenu.find('.navlink-user').show()
                $usermenu.find('.navlink-admin').hide()
                $usermenu.find('.navlink-group').hide()
            }
        }else{
            $usermenu.find('.navlink-user').hide()
            $usermenu.find('.navlink-admin').hide()
            $usermenu.find('.navlink-group').show()
        }
    }

    //切换组织时比较数据变化
    function compareData(params, evt, index){
        var timestamp = (new Date().valueOf()).toString(), data = {};
        (params.orgid) ? (data.org_id = params.orgid ) : '';
        util.ajaxSubmit({
            type: 'get',
            url: '/v1.0/user/me',
            dauth: params.userid + ' ' + timestamp + ' ' + kernel.buildDauth(params.userid, params.token, timestamp),
            data: data,
            success: function(res) {
                if(res.code == 0){
                    var json = res.data.organization;
                    if(json){
                        //切换组织时数据状态发生变化
                        var getUserData = evt, getOrgIndex = index;
                        if(!util.isEqual(getUserData.organization[getUserData.orgindex], json[index])){
                            getUserData.orgindex = index;
                            getUserData.orgindexid = json[index].id;
                            if(getUserData.data.id == json[index].admin_id){
                                console.log("orgindexadmin", true);
                                getUserData.orgindexadmin = true;
                                util.setCookie('orgindex', getUserData.orgindex);
                                util.setCookie('orgindexid', getUserData.orgindexid);
                                util.setCookie('orgindexadmin', true);
                                util.setUserData(getUserData);
                                datachange(getUserData, 'choose');
                                //orgchange(getUserData);
                                //pagechange(evt, 'choose');
                            }else{
                                getAdminList({
                                    userid: params.userid,
                                    token: params.token,
                                    orgid: params.orgid
                                }, function(res){
                                    console.log("orgindexadmin", res);
                                    getUserData.orgindexadmin = res;
                                    util.setCookie('orgindex', getUserData.orgindex);
                                    util.setCookie('orgindexid', getUserData.orgindexid);
                                    util.setCookie('orgindexadmin', res);
                                    util.setUserData(getUserData);
                                    datachange(getUserData, 'choose');
                                    //orgchange(getUserData);
                                    //pagechange(evt, 'choose');
                                });
                            }
                        }
                        util.setCookie('orgname', json[index].name),
                        util.setCookie('orgtype', json[index].type),
                        util.setCookie('employee_count', json[index].employee_cnt);
                    }
                }
            }
        });
    }

    // 获取是否是子管理员
    function getAdminList(data, callback){
        var timestamp = (new Date().valueOf()).toString();
        util.ajaxSubmit({
            type: 'get',
            url: '/v1.0/admin/group/'+ data.orgid +'',
            dauth: data.userid + ' ' + timestamp + ' ' + kernel.buildDauth(data.userid, data.token, timestamp),
            data: {},
            success: function(json) {
                if (json.code == 0) {
                    var admin_ids = [];
                    if(json.data['result'].length > 0){
                        $.each(json.data['result'], function(i, item) {
                            $.each(item.admin_ids, function(j, inner) {
                                admin_ids.push(inner)
                            });
                        });
                    }
                    if(typeof callback === 'function'){
                        callback(($.inArray(data.userid, admin_ids) >= 0) ? true : false);
                    }
                } else {
                    kernel.hint(json.msg);
                }
            },
            error: function(res){
                kernel.hint(res.msg);
            }
        });
    }

});