'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util'], function(module, kernel, util) {
    var loc, type, keyword;
    var departmentid = util.getCookie('departmentid');
    var thisPopup = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
        $dom = $('#' + thisPopup),
        $inputSearch = $dom.find('.search-box input.search'),
        $btnSearch = $dom.find('.btn-user-search'),
        $btnSetAdmin = $dom.find('.btn-edit-dept-setadmin'),
        $btnCancel = $dom.find('.btn-edit-dept-cancel'),
        $userTable = $dom.find('.user-main .user-main-innner .user-main-table .user-main-tbody');

    //关键字搜索
    $dom.on("submit", "form", function(e) {
        e.preventDefault()
        var loc = kernel.parseHash(location.hash);
        var params = {};
        params.key_search = $inputSearch.val();
        checkUrlParams(params, loc);
        kernel.replaceLocation(loc);
    });

    //检查是否空对象
    function isNullObj(obj) {
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                return false;
            }
        }
        return true;
    }

    //检查URL参数
    function checkUrlParams(params, loc) {
        if (!isNullObj(params)) {
            for (var x in params) {
                if (params[x] != '' && params[x] != null) {
                    delete loc.args.p;
                    loc.args[x] = params[x];
                } else {
                    delete loc.args[x];
                }
            }
        }
    }

    $btnSetAdmin.on('click',function(e){
        e.stopPropagation();
        var ids = [];
        $userTable.find('tr.main-item td input[name="director"]:checked').each(function(i, dom){
            ids.push($(dom).attr('data-id'));
        });
        //设置部门主管 /v1.0/org/department/{department_id}/director
        util.ajaxSubmit({
            type:'post',
            url: '/v1.0/org/department/{department_id}/director',
            data: {
                'director_ids': ids.join(',')
            },
            success: function(res) {
                console.log("res",res);
                setTimeout(function(){
                    kernel.closePopup('seluser', {
                        type: 'seluser'
                    });
                },1000);
            }
        });
    });

    $btnCancel.on('click',function(){
        kernel.closePopup('seluser', {
            type: 'seluser'
        });
    });
    return {
        onload: function(force) {
            loc = kernel.parseHash(location.hash),
            type = loc.args.type,
            keyword = loc.args.key_search;
            console.log("type", type);
        }
    };
});