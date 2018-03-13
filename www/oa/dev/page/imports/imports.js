'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util','page/imports/steps'], function(module, kernel, util, steps) {
    var userid, token, orgid, orgname, parentid, loc, type, status, imports;
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
        $importsInnerSuccess = $importsInner.find('.imports-inner-success');
        steps(function(){});
    return {
        onload: function(force) {
            userid = util.getCookie('userid'),
            token = util.getCookie('token'),
            orgid = util.getCookie('orgid'),
            orgname = util.getCookie('orgname'),
            parentid = util.getCookie('parentid');
            loc = kernel.parseHash(location.hash),
            type = loc.args.type,
            status = loc.args.status,
            imports = loc.args.imports;
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
        }
    };
});