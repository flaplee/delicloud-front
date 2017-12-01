'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util', 'common/text/text!page/imports/steps.html!strip'], function(module, kernel, util, html) {
	var userid = util.getCookie('userid'),
        token = util.getCookie('token'),
        orgid = util.getCookie('orgid');
    var dom = $(html),
        $imports = $('#imports .imports-box');
    	$imports.append(dom);
});