'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util', 'common/text/text!page/imports/member.html!strip'], function(module, kernel, util, html) {
    var loc = kernel.parseHash(location.hash);
    var userid = util.getCookie('userid'),
        token = util.getCookie('token'),
        orgid = util.getCookie('orgid'),
        isImport = false;
    var $dom = $(html),
        $imports = $('#imports .imports-box'),
        $members = $imports.find('.imports-info .imports-inner');
        $members.append($dom);
    
    return function(callback){
        if(typeof callback === 'function'){
            callback();
        }
    }
});