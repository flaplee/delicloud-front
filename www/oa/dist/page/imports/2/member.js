'use strict';define(['common/kernel/kernel','site/util/util','common/text/text!page/imports/member.html!strip'],function(a,b,c){var d=a.parseHash(location.hash),e=b.getCookie('userid'),f=b.getCookie('token'),g=b.getCookie('orgid'),h=$(c),i=$('#imports .imports-box'),j=i.find('.imports-info .imports-inner');return j.append(h),function(a){'function'==typeof a&&a()}});