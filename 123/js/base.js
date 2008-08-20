 var days = 36500;
    var expdate = new Date();
    expdate.setTime (expdate.getTime() + (86400 * 1000 * days));
    var  cookieEnabled=(navigator.cookieEnabled)?  true  :  false;
    function getCookieVal (offset) 
    {
    var endstr = document.cookie.indexOf (";", offset);
    if (endstr == -1)
    endstr = document.cookie.length;
    return unescape(document.cookie.substring(offset, endstr));
    };
    function deleteCookie(name,path,domain)
    {
    if(getCookie(name))
    {
    document.cookie = name + "=" +
    ((path) ? "; path=" + path : "") +
    ((domain) ? "; domain=" + domain : "") +
    "; expires=Thu, 01-Jan-70 00:00:01 GMT";
    }
    }
    function getCookie (name) 
    {
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen) 
    {
    var j = i + alen;
    if (document.cookie.substring(i, j) == arg)
    return getCookieVal (j);
    i = document.cookie.indexOf(" ", i) + 1;
    if (i == 0) 
    break; 
    }
    return null;
    }
    function setCookie (name, value) 
    {
    if(cookieEnabled == false){alert(_msg.notOpenCookie);return false;}
    var argv = setCookie.arguments;
    var argc = setCookie.arguments.length;
    var expires = (2 < argc) ? argv[2] : null;
    var path = (3 < argc) ? argv[3] : null;
    var domain = (4 < argc) ? argv[4] : null;
    document.cookie = name + "=" + escape(value) +";expires=" + expires.toGMTString() +";path=" + path + ";domain=" + domain;
    //alert(document.cookie);
    }
var isIE= navigator.userAgent.indexOf("MSIE")>0&&!window.opera;
Function.prototype.bind = function() {
	var args = [];
	for(var i=0,len=arguments.length;i<len;i++)
		args.push(arguments[i]);
    var __method = this, object = args[0];
    return function() {
		return __method.apply(object, args);
    }
};
function G(id){return document.getElementById(id);};
String.prototype.replaceS = function()
{
	if(arguments.length==0)return this;
	for(var i=0,len=arguments.length,s=this;i<len;i++)
	{
	  s = s.replace(new RegExp("#\\{"+ (i+1) +"\\}#"),arguments[i]);
	}
	return s;
};
     function regEvent(regElement,regName,regFun)
        {
            if(isIE)
            regElement.attachEvent(regName,regFun);
            else
            regElement.addEventListener(regName.replace(/^on/,""),regFun,false);
        };
 var aCookieDomain = ["www.hao123.com","www.hao222.com","www.hao222.net","www.hao123.net","hao123.com","hao222.com","hao222.net","hao123.net"];