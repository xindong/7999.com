$ua = { ie: 0, opera: 0, gecko: 0, webkit: 0, air: 0, mobile: null }
var ua = navigator.userAgent, m
if ((/KHTML/).test(ua)) {
    $ua.webkit = 1
}
m = ua.match(/AppleWebKit\/([^\s]*)/)
if (m && m[1]) {
    $ua.webkit = parseFloat(m[1])
    if (/ Mobile\//.test(ua)) {
        $ua.mobile = "Apple"
    } else {
        m = ua.match(/NokiaN[^\/]*/)
        if (m) {
            $ua.mobile = m[0]
        }
    }
    m = ua.match(/AdobeAIR\/([^\s]*)/)
    if (m) {
        $ua.air = m[0]
    }
}

if (!$ua.webkit) {
    m = ua.match(/Opera[\s\/]([^\s]*)/)
    if (m && m[1]) {
        $ua.opera = parseFloat(m[1])
        m = ua.match(/Opera Mini[^;]*/)
        if (m) {
            $ua.mobile = m[0]
        }
    } else {
        m = ua.match(/MSIE\s([^;]*)/)
        if (m && m[1]) {
            $ua.ie = parseFloat(m[1])
        } else {
            m = ua.match(/Gecko\/([^\s]*)/)
            if (m) {
                $ua.gecko = 1
                m = ua.match(/rv:([^\s\)]*)/)
                if (m && m[1]) {
                    $ua.gecko = parseFloat(m[1])
                }
            }
        }
    }
}
var $ = function(el) {
    if (el && (el.nodeType || el.item)) {
        return el
    }
    if (typeof el === "string" || !el) {
        return document.getElementById(el)
    }
    if (el.length !== undefined) {
        var c = []
        for (var i = 0, len = el.length; i < len; ++i) {
            c[c.length] = $(el[i])
        }
        return c
    }
    return el
}
var C = { reClassName: {}, property: {} }
var getClassRegEx = function(className) {
    var re = C.reClassName[className]
    if (!re) {
        re = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)')
        C.reClassName[className] = re
    }
    return re
}
var getElementsByClassName = function(className, tag, root) {
    tag = tag || '*'
    root = (root) ? $(root) : null || document
    if (!root) {
        return []
    }
    var nodes = [],
        elements = root.getElementsByTagName(tag),
        re = getClassRegEx(className)

    for (var i = 0, len = elements.length; i < len; ++i) {
        if (re.test(elements[i].className)) {
            nodes[nodes.length] = elements[i]
        }
    }
    return nodes
}
var trim = function(s) {
    try {
        return s.replace(/^\s+|\s+$/g, "")
    } catch(e) {
        return s
    }
}
var batch = function(el, method) {
    el = (el && (el.tagName || el.item)) ? el : $(el);
    if (!el || !method) {
        return false
    }
    var scope = window
    if (el.tagName || el.length === undefined) {
        return method.call(scope, el)
    } 
    var collection = []
    for (var i = 0, len = el.length; i < len; ++i) {
        collection[collection.length] = method.call(scope, el[i])
    }
    return collection
}
var hasClass = function(el, className) {
    var re = getClassRegEx(className)
    var f = function(el) {
        return re.test(el.className)
    }
    return batch(el, f)
}
var addClass = function(el, className) {
    var f = function(el) {
        if (hasClass(el, className)) {
            return false
        }
        el.className = trim([el.className, className].join(' '))
        return true
    }
    return batch(el, f);
}
var removeClass = function(el, className) {
    var re = getClassRegEx(className);
    var f = function(el) {
        if (!className || !hasClass(el, className)) {
            return false
        }                 
        var c = el.className
        el.className = c.replace(re, ' ')
        if (hasClass(el, className) ) {
            removeClass(el, className)
        }
        el.className = trim(el.className); // remove any trailing spaces
        return true
    }
    return batch(el, f)
}
var replaceClass = function(el, oldClassName, newClassName) {
    if (!newClassName || oldClassName === newClassName) {
        return false
    }
    var re = getClassRegEx(oldClassName)
    var f = function(el) {
        if (!hasClass(el, oldClassName)) {
            addClass(el, newClassName)
            return true
        }
        el.className = el.className.replace(re, ' ' + newClassName + ' ')
        if (hasClass(el, oldClassName) ) {
            replaceClass(el, oldClassName, newClassName)
        }
        el.className = trim(el.className)
        return true
    }
    return batch(el, f)
}

var patterns = {
    HYPHEN: /(-[a-z])/i,
    ROOT_TAG: /^body|html$/i,
    OP_SCROLL: /^(?:inline|table-row)$/i
}
var toCamel = function(property) {
    if (!patterns.HYPHEN.test(property) ) {
        return property
    }
    if (C.property[property]) {
        return C.property[property]
    }
    var converted = property
    while (patterns.HYPHEN.exec(converted)) {
        converted = converted.replace(RegExp.$1, RegExp.$1.substr(1).toUpperCase())
    }
    C.property[property] = converted
    return converted
}

var getStyle = function(){}
if (document.defaultView && document.defaultView.getComputedStyle) {
    getStyle = function(el, property) {
        var value = null
        if (property == 'float') {
            property = 'cssFloat'
        }
        var computed = el.ownerDocument.defaultView.getComputedStyle(el, '')
        if (computed) {
            value = computed[toCamel(property)]
        }
        return el.style[property] || value
    }
} else if (document.documentElement.currentStyle && $ua.ie > 0) {
    getStyle = function(el, property) {                         
        switch( toCamel(property) ) {
            case 'opacity' :
                var val = 100
                try {
                    val = el.filters['DXImageTransform.Microsoft.Alpha'].opacity
                } catch(e) {
                    try {
                        val = el.filters('alpha').opacity
                    } catch(e) {
                    }
                }
                return val / 100
            case 'float':
                property = 'styleFloat'
            default: 
                var value = el.currentStyle ? el.currentStyle[property] : null
                return ( el.style[property] || value )
        }
    }
} else {
    getStyle = function(el, property) { return el.style[property] }
}
var getDocumentScrollLeft = function(doc) {
    doc = doc || document
    return Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft)
}
var getDocumentScrollTop = function(doc) {
    doc = doc || document
    return Math.max(doc.documentElement.scrollTop, doc.body.scrollTop)
}

var _getXY = function() {
    if (document.documentElement.getBoundingClientRect) {
        return function(el) {
            var box = el.getBoundingClientRect()
            var rootNode = el.ownerDocument;
            return [box.left + getDocumentScrollLeft(rootNode), box.top + getDocumentScrollTop(rootNode)]
        }
    } else {
        return function(el) {
            var pos = [el.offsetLeft, el.offsetTop]
            var parentNode = el.offsetParent
            var accountForBody = ($ua.webkit && getStyle(el, 'position') == 'absolute' && el.offsetParent == el.ownerDocument.body)
            if (parentNode != el) {
                while (parentNode) {
                    pos[0] += parentNode.offsetLeft
                    pos[1] += parentNode.offsetTop
                    if (!accountForBody && $ua.webkit && getStyle(parentNode,'position') == 'absolute' ) {
                        accountForBody = true
                    }
                    parentNode = parentNode.offsetParent
                }
            }
            if (accountForBody) {
                pos[0] -= el.ownerDocument.body.offsetLeft
                pos[1] -= el.ownerDocument.body.offsetTop
            } 
            parentNode = el.parentNode
            while (parentNode.tagName && !patterns.ROOT_TAG.test(parentNode.tagName)) {
                if (parentNode.scrollTop || parentNode.scrollLeft) {
                    if (!patterns.OP_SCROLL.test(getStyle(parentNode, 'display'))) {
                        if (!isOpera || getStyle(parentNode, 'overflow') !== 'visible') {
                            pos[0] -= parentNode.scrollLeft
                            pos[1] -= parentNode.scrollTop
                        }
                    }
                }
                parentNode = parentNode.parentNode
            }
            return pos
        }
    }
}()
var getXY = function(el) {
    var f = function(el) {
        if ((el.parentNode === null || el.offsetParent === null ||
                getStyle(el, 'display') == 'none') && el != el.ownerDocument.body) {
            return false
        }
        return _getXY(el)
    }
    return batch(el, f)
}

// 初始化 Google Analytics 的实例化变量，防止调用时出现未定义的变量
pageTracker = { _trackPageview: function(url) {} }
// 防止 JS 操作造成重新载入时页面编码错乱
if ($ua.ie > 0 && document.charset.toUpperCase() == "UTF-8") location.reload(false)

function signinMail(f) {
    var d = f.__dd
    var n = f.__uu
    var p = f.__pp
    if (n.value == "") {
        alert("请输入用户名！")
        n.focus()
        return false
    }
    if (d.value == "") {
        alert("请选择邮箱！")
        d.focus()
        return false
    }
    if (p.value == "") {
        alert("请输入密码！")
        p.focus()
        return false
    }
    switch (d.value) {
        case "163":
            f.action = "http://reg.163.com/CheckUser.jsp"
            f.url.value = "http://fm163.163.com/coremail/fcg/ntesdoor2?lightweight=1&verifycookie=1&language=-1&style=15"
            f.username.value = n.value
            f.password.value = p.value
            f.enterVip.value = ''
            break
        case "126":
            f.action = "http://entry.126.com/cgi/login"
            f.domain.value = "126.com"
            f.user.value = n.value
            f.pass.value = p.value
            break
        case "yeah":
            f.action = "http://entry.yeah.net/cgi/login"
            f.domain.value = "yeah.net"
            f.user.value = n.value
            f.pass.value = p.value
            break
        case "188":
            f.action = "http://reg.mail.188.com/servlet/coremail/login?language=0&style=1"
            f.user.value = n.value
            f.pass.value = p.value
            break
        case "sohu":
            f.action = "http://passport.sohu.com/login.jsp"
            f.url.value = ""
            f.UserName.value = n.value
            f.Password.value = p.value
            f.id.value = n.value
            f.username.value = n.value
            f.password.value = p.value
            f.m.value = n.value
            f.passwd.value = p.value
            f.mpass.value = p.value
            f.loginid.value = n.value+"@sohu.com"
            f.fl.value = "1"
            f.vr.value = "1|1"
            f.appid.value = "1000"
            f.ru.value = "http://login.mail.sohu.com/servlet/LoginServlet"
            f.eru.value = "http://login.mail.sohu.com/login.jsp"
            f.ct.value = "1173080990"
            f.sg.value = "5082635c77272088ae7241ccdf7cf062"
            break
        case "yahoo":
            f.action = "http://edit.bjs.yahoo.com/config/login"
            f.login.value = n.value
            f.passwd.value = p.value
            break
        case "yahoocn":
            f.action = "http://edit.bjs.yahoo.com/config/login"
            f.login.value = n.value+"@yahoo.cn"
            f.passwd.value = p.value
            break
        case "tom":
            f.action = "http://bjweb.163.net/cgi/163/login_pro.cgi"
            f.user.value = n.value
            f.pass.value = p.value
            break
        case "21cn":
            f.action = "http://passport.21cn.com/maillogin.jsp"
            f.LoginName.value = n.value
            f.passwd.value = p.value
            f.domainname.value = "21cn.com"
            f.UserName.value = n.value + '@21cn.com'
            break
        case "sina":
            f.action = "http://mail.sina.com.cn/cgi-bin/login.cgi"
            f.u.value = n.value
            f.psw.value = p.value
            break
        case "gmail":
            f.action = "https://www.google.com/accounts/ServiceLoginAuth"
            f.Email.value = n.value
            f.Passwd.value = p.value
            break
        case "chinaren":
            f.action = "http://passport.sohu.com/login.jsp"
            f.loginid.value = n.value+"@chinaren.com"
            f.passwd.value = p.value
            f.fl.value = "1"
            f.vr.value = "1|1"
            f.appid.value = "1005"
            f.ru.value = "http://profile.chinaren.com/urs/setcookie.jsp?burl=http://alumni.chinaren.com/"
            f.ct.value = "1174378209"
            f.sg.value = "84ff7b2e1d8f3dc46c6d17bb83fe72bd"
            break
        case "tianya":
            f.action = "http://www.tianya.cn/user/loginsubmit.asp"
            f.vwriter.value = n.value
            f.vpassword.value = p.value
            break
        case "baidu":
            f.action = "http://passport.baidu.com/?login"
            f.username.value = n.value
            f.password.value = p.value
            break
    }
    p.value = ""
    pageTracker._trackPageview("\/out\/checkmail\/" + d.value)
    return true
}
function checkSearchTab(tab) {
    var tabs = ["wy", "yy", "tp", "sp", "xz", "gw", "dt"]
    for (var i = 0; i < tabs.length; i++) {
        var t = "tab-" + tabs[i]
        var s = "sb-" + tabs[i]
        if (tab.id == t) {
            $(t).className = "c"
            $(s).style.display = ""
            $("sb-" + tabs[i] + "-kw").focus()
        } else {
            $(t).className = ""
            $(s).style.display = "none"
        }
    }
    return false
}
function getBit(m, n) { return (m >> n) & 1 }
function lunar(d) {//计算农历
    var nums = "一二三四五六七八九十";
    var mons = "正二三四五六七八九十冬腊";
    var Cal = [0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D, 0x5192B, 0xA95, 0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57, 0x52B, 0xA93, 0x40E95];
    var madd = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    var total, m, n, k;
    var isEnd = false;
    var t = d.getYear();
    if (t < 1900) t += 1900;
    total = (t - 2001) * 365 + Math.floor((t - 2001) / 4) + madd[d.getMonth()] + d.getDate() - 23;
    if (d.getYear() % 4 == 0 && d.getMonth() > 1) total++;
    for (m = 0; ; m++) {
        k = (Cal[m] < 0xfff) ? 11 : 12;
        for (n = k; n >= 0; n--) {
            if (total <= 29 + getBit(Cal[m], n)) {
                isEnd = true;
                break;
            }
            total = total - 29 - getBit(Cal[m], n);
        }
        if (isEnd) break;
    }
    var cYear = 2001 + m;
    var cMonth = k - n + 1;
    var cDay = total;
    if (k == 12) {
      if (cMonth == Math.floor(Cal[m]/0x10000) + 1) cMonth = 1 - cMonth;
      if (cMonth > Math.floor(Cal[m]/0x10000) + 1)  cMonth--;
    }
    var cHour = Math.floor((d.getHours() + 3) / 2);
    var t = "";
    if (cMonth < 1) {
        t += "闰";
        t += mons.charAt( - cMonth - 1);
    } else {
        t += mons.charAt(cMonth - 1);
    }
    t += "月";
    t += (cDay < 11) ? "初" : ((cDay < 20) ? "十" : ((cDay < 30) ? "廿" : "卅"));
    if (cDay % 10 != 0 || cDay == 10) t += nums.charAt((cDay - 1) % 10);
    return t;
}
function getFullDate() {
    var d = new Date();
    var ymd = d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日";
    var week = ['日', '一', '二', '三', '四', '五', '六'];
    var w = "星期" + week[d.getDay()];
    var l = "农历" + lunar(d);
    return ymd + " " + l + " " + w;
}
function trackSearch(wd, by) {
    $('kwh').style.display ='none'
    pageTracker._trackPageview("\/search/" + by + "/" + wd)
}
function hint(keyword, evt) {
    var h = $('kwh')
    if (!keyword.value || !keyword.value.length || evt.keyCode == 27 || evt.keyCode == 13) {
        h.style.display = 'none'
        return
    }
    if (evt.keyCode == 38 || evt.keyCode == 40) {
        if (h.style.display == 'none') return
        if (evt.keyCode == 38) {
            if (h._i == -1) {
                h._i = h.firstChild.rows.length - 1
            } else {
                h._i--
            }
        } else {
            h._i++
        }
        for (var i = 0; i < h.firstChild.rows.length; i++) {
            var e = h.firstChild.rows[i]
            removeClass(e, 'c')
        }
        var e = h.firstChild.rows[h._i]
        if (h._i >= 0 && h._i < h.firstChild.rows.length) {
            addClass(e, 'c')
            //if ($ua.ie) keyword.value = e.cells[0].innerText
            //else keyword.value = e.cells[0].textContent
        } else {
            //keyword.value = h._kw
            h._i = - 1
        }
    } else {
        h._i =- 1
        h._kw = keyword.value
        gh(keyword.value)
        var p = getXY(keyword)
        with (h.style) {
            left = p[0] + 'px'
            top = p[1] + keyword.offsetHeight - 2 + 'px'
            width = keyword.offsetWidth + 'px'
        }
    }
}
function gh(key) {
   if ($('sg1')) {
        var tmp = $('sg1').parentNode
        tmp.removeChild($('sg1'))
   }
   if ($('sg2')) {
   		var tmp = $('sg2').parentNode
   		tmp.removeChild($('sg2'))
   }
   var sg1 = document.body.appendChild(document.createElement('script'))
   sg1.id  = 'sg1'
   sg1.charset = 'utf-8'
   sg1.src = 'http:\/\/www.google.cn/complete/search?hl=zh-CN&client=suggest&js=true&q=' + encodeURIComponent(key)
   var sg2 = document.body.appendChild(document.createElement('script'))
   sg2.charset = 'utf-8'
   sg2.id  = 'sg2'
   sg2.src = 'http:\/\/daohang.google.cn/suggest?num=60&partid=Moma&q=' + encodeURIComponent(key)
}
window.google = { ac: {} }
window.google.ac.Suggest_apply = function(a, b, c, d) {
    if (!c || c.length < 3) {
    	$('kwh-wy').display = 'none'
    	return
    }
    $('kwh-wy').display = 'block'
    if (b != $('sb-wy-kw').value) return
    var tr = ''
    for (var j = 1; j < c.length && j < 13; j += 2) {
        tr += '<tr onmouseover="addClass(this, \'c\')" onmouseout="removeClass(this, \'c\');" onclick="$(\'kwh\').style.display = \'none\'; $(\'form-baidu\').submit()"><td class="l">' + c[j] + '</td><td class="r">' + c[j + 1] + '</td></tr>'
    }
    $('kwh-wy').innerHTML = '<table width="100%" border="0" cellpadding="3" cellspacing="0">' + tr + '</table>'
    $('kwh').style.display = "block"
}
var _handleAjaxMoma = function(res) {
	var row = res.split("|")
	if (row.length < 3) {
		$('kwh-wz').display = 'none'
		return
	}
	$('kwh-wz').display = 'block'
	var tr = '<tr><td colspan="2" style="color: #666; text-align: center;">以下是网站快速导航</td></tr>'
	for (var i = 1; i < row.length && i < 13; i += 2) {
		url = row[i]
		tit = row[i+1]
		tr += '<tr onmouseover="addClass(this, \'c\')" onmouseout="removeClass(this, \'c\');" onclick="$(\'kwh\').style.display = \'none\'; window.open(\'' + url + '\')"><td class="l">' + tit + '</td><td class="r">' + url + '</td></tr>'
	}
    $('kwh-wz').innerHTML = '<table width="100%" border="0" cellpadding="3" cellspacing="0">' + tr + '</table>'
    $('kwh').style.display = "block"
}