/*--------------------------------------
 *base：基本库，独立的功能，可复用
 *
 *author：zhang haixi
 *date: 2013-09-08
 *---------------------------------------*/




var base = {}

/*
 *模拟jsp中的include标签，在一个js文件中引入另一个js文件
 *如 include("scripts/b.js")
 */
base.include = function(path){ 
    var a=document.createElement("script");
    a.type = "text/javascript"; 
    a.src=path; 
    var head=document.getElementsByTagName("head")[0];
    head.appendChild(a);
}

/*
 *设置cookie
 *
 */
base.setCookie = function(params){
	
	var s = "";
	params.name && params.value ? (s = params.name + "=" + encodeURIComponent(params.value)): return false;

	params.date ? s += ";expires=" + (param.date).toGMTString() : "";
	params.path ? s += ";path=" + params.path : "";

	params.domain ? s += ";domain=" + params.domain : "";

	params.secure ? s += ";secure" : "";

	document.cookie = s;

	return true;
}

/*
 *获取cookie
 *
 */
base.getCookie = function (name) {

	var reg_s = "(?:;)?" + name + "=([^;]*);?"
	var reg = new  RegExp(reg_s);

	if (reg.test(document.cookie)) {

		return decodeURIComponent(RegExp["$1"]);
	}else {

		return null;
	}
}

/*
 *删除cookie
 *注意！此处比粗domain和path匹配的情况下，name为iname的cookie才可以被删除
 */
base.deleteCookie = function(iname, idomain, ipath){
	
	var s = iname + "=;" + ";expires=-1";
	s += (idomain != null ? ";domain=" + idomain);
	s += (ipath != null ? ";path=" + ipath);
	
	document.cookie = s;
}
