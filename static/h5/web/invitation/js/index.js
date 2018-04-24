seajs.config({base:"https://static.delicloud.com/h5/web/invitation/",alias:{zepto:"js/zepto.min.js",dialog:"js/dialog.min.js",fastclick:"js/fastclick.js",region:"js/region.js"}}),seajs.use(["zepto","dialog","fastclick","region"],function(a,b,c,d){var e={params:{hintmo:0},init:function(){var a=this;FastClick.attach(document.body),a.bindEvt()},bindEvt:function(){function H(a){var f,g,h,b=document.getElementById("code"),c=b.getContext("2d"),d=b.width,e=b.height;for(c.clearRect(0,0,d,e),c.fillStyle="#f2f2f2",c.fillRect(0,0,d,e),c.fillStyle="#3297fd",f=1,c.font="italic bolder 16px 'Arial'",g=6,h=0;g>h;h++)f=h%2?-1:1,c.save(),c.rotate(Math.round(3*Math.random())*f*Math.PI/180),c.fillText(a[h],d*(.1+.14*h),18+Math.round(8*Math.random()),76),c.restore()}function I(c,d){a.ajax({type:"GET",url:c,data:d,dataType:"jsonp",jsonp:"callback",success:function(a){0==a.code?H(a.data.result):b.tip(a.msg)}})}var F,G,c=this,f=a("#page"),g=f.find("header"),h=g.find("#avatar img"),i=g.find("#slogon"),j=f.find(".content"),k=j.filter(".content-input"),l=j.filter(".content-complete"),m=k.find("input#phone"),n=k.find("input#name"),o=k.find("input#reason"),p=k.find("input#captcha"),q=k.find("#code"),r=k.find(".phoneCode"),s=r.find("span"),t=k.find("#submit"),v=(k.find(".download-app"),a("#areaCode")),w=v.find(".back"),x=v.find(".box"),y=x.find("#scroll"),z=x.find(".nav-right .nav-inner"),A=decodeURIComponent(c.getQuery("name")),B=decodeURIComponent(c.getQuery("t")),C=decodeURIComponent(c.getQuery("o")),D=decodeURIComponent(c.getQuery("oname")),E=d.region;b.tip=function(a){b({type:"info",message:a})},h.attr("src",B),i.find("p .name").text(A),i.find("p.group").text(D),I("http://www.delicloud.com/web/v1.0/cd/"+C+"/code/public"),q.on("click",function(){I("http://www.delicloud.com/web/v1.0/cd/"+C+"/code/public")}),t.on("click",function(){if(e.isMobile(m.val()))if(n.val().length>0&&p.val().length>0){var c={mobile_region:r.find("span").data("region"),mobile:m.val(),code:p.val(),name:n.val(),remark:o.val()};a.ajax({type:"GET",url:"http://www.delicloud.com/web/v1.0/cd/"+C+"/public",data:c,dataType:"jsonp",jsonp:"callback",success:function(a){0==a.code?(k.hide(),l.show()):(b.tip(a.msg),I("http://www.delicloud.com/web/v1.0/cd/"+C+"/code/public"))}})}else b.tip("请填写正确信息~");else b.tip("手机号格式错误~")}),r.on("click",function(){f.css("display","none"),v.css("display","block")}),w.on("click",function(){f.css("display","block"),v.css("display","none")}),y.children().remove(),z.children().remove(),F=function(a){var d,b=this,c=a,e=[];for(d=0;d<c.length;d++)c[d].isHot&&e.push(c[d]);for(b.areaKey=["HOT"],b.areaMap={HOT:e},d=65;90>=d;)b.areaMap[String.fromCharCode(d)]=[],b.areaKey.push(String.fromCharCode(d++));b.areaCode=c.reduce(function(a,b){var c=b.spellFirst.toUpperCase();return a[c].push(b),a},b.areaMap),G()},G=function(){var b=this,c=a("#areaCode"),d=c.find(".left-inner"),e=c.find(".nav-inner"),f=b.areaKey,g=b.areaMap,h=44,i=40;f.forEach(function(b){g[b].length&&(d.append(a("<div/>",{"class":"cat border-bottom",id:"_anchor_"+b}).append("HOT"==b?"热门国家和地区":b)),e.append(a("<li/>",{"data-target":b,text:"HOT"==b?"#":b})).addClass("show")),g[b].sort(function(a,b){return a.name.localeCompare(b.name)}).forEach(function(b){d.append(a("<a/>",{"class":(b.countryId===i?"item selected":"item")+" border-bottom",text:b.name,href:"javascript:","data-name":b.name,"data-intlCode":b.intlCode,"data-id":b.countryId}).append(a("<i/>",{"class":"intl-code",text:b.intlCode.replace(/^00/,"")})))})}),e.on("touchstart",function(b){var d,f,g,i,c=b.touches[0].clientX;a(this).addClass("active");try{d=b.target.dataset.target,f=a("#_anchor_"+d),a("#scroll").scrollTop(f.offset().top-h-a("#scroll").scrollTop())}catch(b){}return g=function(b){var e,f,d=document.elementFromPoint(c,b.touches[0].clientY);try{e=d.dataset.target,f=a("#_anchor_"+e),a("#scroll").scrollTop(f.offset().top-h-a("#scroll").scrollTop())}catch(b){}return!1},i=function(){e.off("touchmove",g).off("touchend",i).removeClass("active")},e.on("touchmove",g).on("touchend",i),!1})},F(E),x.find("a.item").on("click",function(){f.css("display","block");var c=a(this),d=c.attr("data-name"),e=c.attr("data-intlcode");c.hasClass("selected")||(c.siblings("a").removeClass("selected"),c.addClass("selected")),s.text("+"+e.replace(/^00/,"")),s.data("region",e.replace(/^00/,"")),v.css("display","none"),b.tip(d+"国际码:"+e.replace(/^00/,""))}),k.show(),l.hide()},isMobile:function(a){var b=/^1[3,4,5,7,8]{1}[0-9]{9}$/;return b.test(a)},hint:function(a,b){var c=this,d=c.params.hintmo,e=document.getElementById("hint");e.querySelector(":scope>.text").firstChild.data=a,d?clearTimeout(d):e.style.opacity=1,d=setTimeout(function(){e.style.opacity="",d=void 0},b?b:5e3)},getQuery:function(a){var e,f,b=window.location.href,c=b.indexOf("?"),d=b.slice(c+1).split("&");for(e=0;e<d.length;e++)if(f=d[e].split("="),f[0].trim()==a)return f[1].trim()},setUrlPort:function(a){var b=location.protocol,c=location.host;return b+"//"+c+":"+a},getTargetUrl:function(a,b){var c=location.protocol,d=location.host,e=location.pathname.replace(a,b);return c+"//"+d+e}};e.init()});