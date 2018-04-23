'use strict';
define(['common/kernel/kernel', 'site/util/util','page/imports/steps'], function(kernel, util, steps) {
    var userid, token, orgid, orgname, parentid, loc, locid, type, status, imports;
    var $imports = $('#imports'),
        $importsMenu = $imports.find('.imports-menu'),
        $importsSteps = $imports.find('.imports-steps'),
        $importsInfo = $imports.find('.imports-info'),
        $importsCrumbs = $importsInfo.find('.imports-crumbs'),
        $importsCrumbsUser = $importsCrumbs.find('.imports-crumbs-user'),
        $importsCrumbsInfo = $importsCrumbs.find('.imports-crumbs-info'),
        $importsInner = $importsInfo.find('.imports-inner'),
        $importsInnerData = $importsInner.find('.imports-inner-data'),
        $importsInnerNav = $importsInnerData.find('.imports-nav'),
        $importsInnerTable = $importsInnerData.find('.imports-table'),
        $importsInnerError = $importsInner.find('.imports-inner-error'),
        $importsInnerSuccess = $importsInner.find('.imports-inner-success'),
        $stepsInner = $importsSteps.find('.steps-inner');
        steps(function(){});
    return {
        onload: function(force) {
            userid = util.getCookie('userid'),
            token = util.getCookie('token'),
            orgid = util.getCookie('orgid'),
            orgname = util.getCookie('orgname'),
            parentid = util.getCookie('parentid');
            loc = kernel.parseHash(location.hash),
            locid = loc.id,
            type = loc.args.type,
            status = loc.args.status,
            imports = loc.args.imports;
            if(locid == 'imports'){
                var $usermenu = $('#header .user-head .nav-top .nav-item');
                $usermenu.find('a.navlink').removeClass('navlink-current');
                $usermenu.find('a.navlink.orgBtn').addClass('navlink-current');
            };
            if(type){
                switch(type){
                    case 'info':
                        $importsInfo.hide();
                        $importsSteps.show();
                        break;
                    case 'steps':
                        $importsInfo.show();
                        $importsSteps.hide();
                        switch(status){
                            case 'data':
                                $importsInnerData.show();
                                $importsInnerError.hide();
                                $importsInnerSuccess.hide();
                                switch(imports){
                                    case 'enable':
                                        if(!$importsInnerNav.find('.nav-enable').hasClass('active')){
                                            $importsInnerNav.find('.nav-enable').addClass('active').siblings().removeClass('active');
                                            $importsInnerTable.find('.imports-table-enable').addClass('active').siblings().removeClass('active');
                                        }
                                    break;
                                    case 'unable':
                                        if(!$importsInnerNav.find('.nav-unable').hasClass('active')){
                                            $importsInnerNav.find('.nav-unable').addClass('active').siblings().removeClass('active');
                                            $importsInnerTable.find('.imports-table-unable').addClass('active').siblings().removeClass('active');
                                        }
                                    break;
                                    default:
                                        if(!$importsInnerNav.find('.nav-enable').hasClass('active')){
                                            $importsInnerNav.find('.nav-enable').addClass('active').siblings().removeClass('active');
                                            $importsInnerTable.find('.imports-table-enable').addClass('active').siblings().removeClass('active');
                                        };
                                }
                            break;
                            case 'error':
                                $importsInnerData.hide();
                                $importsInnerError.show();
                                $importsInnerSuccess.hide();
                            break;
                            case 'success':
                                $importsInnerData.hide();
                                $importsInnerError.hide();
                                $importsInnerSuccess.show();
                            break;
                            default:
                                $importsInnerData.show();
                                $importsInnerError.hide();
                                $importsInnerSuccess.hide();
                        }
                        break;
                    default:;
                };
            }else{
                $importsInfo.hide();
                $importsSteps.show();
            }

            // 获取屏幕的可见区域高度减去其他部分的高度
            $importsSteps.css({
                'padding-top': (document.body.clientHeight - 80 - 60 - $stepsInner.height())*0.5,
                'padding-bottom': (document.body.clientHeight - 80 - 60 - $stepsInner.height())*0.5
            });
        }
    };
});