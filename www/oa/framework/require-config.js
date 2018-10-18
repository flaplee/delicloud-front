'use strict';
define(['module'], function(module) {
	//请确保modules第一个被赋值
	var modules = {"common/kernel":7,"common/slider":1,"common/text":1,"page/app":11,"page/appdetail":3,"page/appentry":1,"page/apphome":10,"page/contacts":34,"page/device":10,"page/home":10,"page/imports":29,"page/loginhome":21,"panel/adduser":1,"panel/editdept":1,"popup/adddept":1,"popup/deldept":1,"popup/deldevice":1,"popup/deluser":1,"popup/editdept":1,"popup/editdevice":1,"popup/finduser":1,"popup/loginInfo":1,"popup/loginPopup":1,"popup/renamedept":1,"popup/seluser":1,"site/import":3,"site/index":20,"site/pages":2,"site/panels":1,"site/popups":1,"site/util":13},
		//请确保srcRoot第二个被赋值
		srcRoot = 'dev/',
		//请确保productRoot第三个被赋值
		productRoot = 'dist/',
		//请确保siteVersion第四个被赋值
		siteVersion = "1.0.49",
		//请确保debug第五个被赋值
		debug = true,
		prefix = module.id.replace(/framework\/[^\/]+$/, ''),
		cfg = {
			waitSeconds: 0,
			baseUrl: prefix + srcRoot
		};

	if (!debug) {
		for (var n in modules) {
			modules[n] = prefix + productRoot + n + '/' + modules[n];
		}
		cfg.paths = modules;
	}
	require.config(cfg);
	//用于外部访问的基本信息
	require.data = {
		siteVersion: siteVersion,
		debug: debug
	};
	//若需要从外部获得模块路径请使用require.toUrl('family/name')
});