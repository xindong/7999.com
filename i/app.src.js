
function errorHandler(msg, url, line) {
	 // pro env
	if (location.hostname.indexOf('local') == -1) { return true }
	// dev env
	var txt ="Error: " + msg + "\n"
	txt +="URL: " + url + "\n"
	txt +="Line: " + line + "\n\n"
	txt +="Click OK to continue.\n\n"
	alert(txt)
	return false
}
onerror = errorHandler

var $id = function(el) {
	if (el && (el.nodeType || el.item)) {
		return el
	}
	if (typeof el === "string" || !el) {
		return document.getElementById(el)
	}
	if (el.length !== undefined) {
		var c = []
		for (var i = 0, len = el.length; i < len; ++i) {
			c[c.length] = $id(el[i])
		}
		return c
	}
	return el
}

// jquery.cookie.js
jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};

// 初始化 Google Analytics 的实例化变量，防止调用时出现未定义的变量
var track = function(url) {  }
// 防止 JS 操作造成重新载入时页面编码错乱
if ($.browser.msie && document.charset.toUpperCase() == "UTF-8") { location.reload(false) }

function trackOutLink(l) { track("\/out" + location.pathname + l.replace(/^https?:\/\//, '\/').replace('https:\/\/', '\/')) }

var $10y = new Date()
$10y.setFullYear($10y.getFullYear() + 10)
$clicked = false

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
			f.action = "http:\/\/reg.163.com\/CheckUser.jsp"
			f.url.value = "http:\/\/fm163.163.com\/coremail\/fcg\/ntesdoor2?lightweight=1&verifycookie=1&language=-1&style=15"
			f.username.value = n.value
			f.password.value = p.value
			f.enterVip.value = ''
			break
		case "126":
			f.action = "http:\/\/entry.126.com\/cgi\/login"
			f.domain.value = "126.com"
			f.user.value = n.value
			f.pass.value = p.value
			break
		case "yeah":
			f.action = "http:\/\/entry.yeah.net\/cgi\/login"
			f.domain.value = "yeah.net"
			f.user.value = n.value
			f.pass.value = p.value
			break
		case "188":
			f.action = "http:\/\/reg.mail.188.com\/servlet\/coremail\/login?language=0&style=1"
			f.user.value = n.value
			f.pass.value = p.value
			break
		case "sohu":
			f.action = "http:\/\/passport.sohu.com\/login.jsp"
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
			f.ru.value = "http:\/\/login.mail.sohu.com\/servlet\/LoginServlet"
			f.eru.value = "http:\/\/login.mail.sohu.com\/login.jsp"
			f.ct.value = "1173080990"
			f.sg.value = "5082635c77272088ae7241ccdf7cf062"
			break
		case "yahoo":
			f.action = "http:\/\/edit.bjs.yahoo.com\/config\/login"
			f.login.value = n.value
			f.passwd.value = p.value
			break
		case "yahoocn":
			f.action = "http:\/\/edit.bjs.yahoo.com\/config\/login"
			f.login.value = n.value+"@yahoo.cn"
			f.passwd.value = p.value
			break
		case "tom":
			f.action = "http:\/\/bjweb.163.net\/cgi\/163\/login_pro.cgi"
			f.user.value = n.value
			f.pass.value = p.value
			break
		case "21cn":
			f.action = "http:\/\/passport.21cn.com\/maillogin.jsp"
			f.LoginName.value = n.value
			f.passwd.value = p.value
			f.domainname.value = "21cn.com"
			f.UserName.value = n.value + '@21cn.com'
			break
		case "sina":
			f.action = "http:\/\/mail.sina.com.cn\/cgi-bin\/login.cgi"
			f.u.value = n.value
			f.psw.value = p.value
			break
		case "gmail":
			f.action = "https:\/\/www.google.com\/accounts\/ServiceLoginAuth"
			f.Email.value = n.value
			f.Passwd.value = p.value
			break
		case "chinaren":
			f.action = "http:\/\/passport.sohu.com\/login.jsp"
			f.loginid.value = n.value+"@chinaren.com"
			f.passwd.value = p.value
			f.fl.value = "1"
			f.vr.value = "1|1"
			f.appid.value = "1005"
			f.ru.value = "http:\/\/profile.chinaren.com\/urs\/setcookie.jsp?burl=http:\/\/alumni.chinaren.com\/"
			f.ct.value = "1174378209"
			f.sg.value = "84ff7b2e1d8f3dc46c6d17bb83fe72bd"
			break
		case "tianya":
			f.action = "http:\/\/www.tianya.cn\/user\/loginsubmit.asp"
			f.vwriter.value = n.value
			f.vpassword.value = p.value
			break
		case "baidu":
			f.action = "http:\/\/passport.baidu.com\/?login"
			f.username.value = n.value
			f.password.value = p.value
			break
	}
	p.value = ""
	track("\/out\/checkmail\/" + d.value)
	return true
}
function checkSearchTab(tab) {
	var tabs = ['gg', 'bd', 'yy', 'tp', 'sp', 'xz', 'gw', 'dt']
	for (var i = 0; i < tabs.length; i++) {
		var t = 'tab-' + tabs[i]
		var s = 'sb-' + tabs[i]
		if (tab.id == t) {
			if (tabs[i] == 'gg' || tabs[i] == 'bd') {
				toggleWYSE(tabs[i])
			}
			$id(t).className = 'c'
			$id(s).style.display = ''
			$id('sb-' + tabs[i] + '-kw').focus()
		} else {
			$id(t).className = ''
			$id(s).style.display = 'none'
		}
		
	}
	return false
}
function getBit(m, n) { return (m >> n) & 1 }
function lunar(d) { // 计算农历
	var nums = "一二三四五六七八九十"
	var mons = "正二三四五六七八九十冬腊"
	var Cal = [0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D, 0x5192B, 0xA95, 0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57, 0x52B, 0xA93, 0x40E95]
	var madd = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
	var total, m, n, k
	var isEnd = false
	var t = d.getYear()
	if (t < 1900) { t += 1900 }
	total = (t - 2001) * 365 + Math.floor((t - 2001) / 4) + madd[d.getMonth()] + d.getDate() - 23
	if (d.getYear() % 4 == 0 && d.getMonth() > 1) { total++ }
	for (m = 0; ; m++) {
		k = (Cal[m] < 0xfff) ? 11 : 12
		for (n = k; n >= 0; n--) {
			if (total <= 29 + getBit(Cal[m], n)) {
				isEnd = true
				break
			}
			total = total - 29 - getBit(Cal[m], n)
		}
		if (isEnd) { break }
	}
//	var cYear = 2001 + m
	var cMonth = k - n + 1
	var cDay = total
	if (k == 12) {
  	if (cMonth == Math.floor(Cal[m]/0x10000) + 1) { cMonth = 1 - cMonth }
  	if (cMonth > Math.floor(Cal[m]/0x10000) + 1) { cMonth-- }
	}
//	var cHour = Math.floor((d.getHours() + 3) / 2)
	t = ""
	if (cMonth < 1) {
		t += "闰"
		t += mons.charAt( - cMonth - 1)
	} else {
		t += mons.charAt(cMonth - 1)
	}
	t += "月"
	t += (cDay < 11) ? "初" : ((cDay < 20) ? "十" : ((cDay < 30) ? "廿" : "卅"))
	if (cDay % 10 != 0 || cDay == 10) { t += nums.charAt((cDay - 1) % 10) }
	return t
}
function getFullDate() {
	var d = new Date()
	var y = d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日"
	var w = ['日', '一', '二', '三', '四', '五', '六']
	w = "星期" + w[d.getDay()]
	var l = "农历" + lunar(d)
	return { date: y, week: w, cd: l }
}
function trackSearch(wd, by) {
   $id('kwh').style.display ='none'
   track("\/search?by=" + by + "&at=" + location.pathname + "&wd=" + wd)
}
function fetchWeatherRPCDone() {
	if (arguments.length == 3) {
		jsid = arguments[0]
		city = arguments[1]
		info = arguments[2]
	} else if (arguments.length == 2) {
		city = arguments[0]
		info = arguments[1]
	} else {
		return
	}
	var str = city
	if (info[0].desc && info[0].desc != '暂无预报') {
		str +=  ': ' + info[0].desc + ' ' + info[0].temp[1] + '~' + info[0].temp[0]
	}
	$id('weather-info').innerHTML = str
}

var $fs = $cookie('B')
var $_i = -1
var $lk, $kw
var $ce = 'bd'
var $ck = $id('sb-' + $ce + '-kw')

function hint(keyword, evt) {
	if ($fs == '1') { return }
	if ($.browser.msie && document.readyState != "complete") { return }
	if (16 <= evt.keyCode && evt.keyCode <= 18) { return }
	var h = $id('kwh')
	if (!keyword.value || !keyword.value.length || evt.keyCode == 27) { // 27 is escape (evt.DOM_VK_ESCAPE)
		h.style.display = 'none'
	}
	if (evt.keyCode == 38 || evt.keyCode == 40) { // up or down
		if (h.style.display == 'none') { return }
		var wy = $id('kwh-wy'); var wz = $id('kwh-wz')
		var yl = 0; var zl = 0
		if (wy) { yl = wy.childNodes.length }
		if (wz) { zl = wz.childNodes.length }
		var al = yl + zl
		for (var i = 0; i < al; i++) {
			if (i < yl) { $(wy.childNodes[i]).removeClass('c') }
			else { $(wz.childNodes[i - yl]).removeClass('c') }
		}
		if (evt.keyCode == 38) { // up
			if ($_i < 0) { $_i = al - 1 }
			else { $_i-- }
		} else { // down
			if ($_i > al - 2) { $_i = -1 }
			else { $_i++ }
		}
		if (-1 < $_i && $_i < yl) {
			$(wy.childNodes[$_i]).addClass('c')
			if (wy.childNodes[$_i].childNodes[0]) {
				$kw = wy.childNodes[$_i].childNodes[0].innerHTML
				$kw = $kw.replace(/<span>/, '')
				$kw = $kw.replace(/<\/span>/, '')
				$lk = null
			}
		} else if ($_i == yl) {
			if (evt.keyCode == 38) { $(wy.childNodes[--$_i]).addClass('c') }
			else { $(wz.childNodes[++$_i - yl]).addClass('c') }
			$kw = null
			$lk = null
		} else if (yl < $_i && $_i < al) {
			$(wz.childNodes[$_i - yl]).addClass('c')
			$lk = wz.childNodes[$_i - yl].childNodes[1].innerHTML
			$kw = null
		}
	} else {
		if (!keyword.value || !keyword.value.length) { return }
		$_i = -1
		$kw = keyword.value
		gh($kw)
	}
}

function press(keyword, evt) {
	if ($fs == '1') { return }
	if (evt.keyCode != 13) { return	} // 13 is enter
	if ($lk != null && $lk != undefined) { // 网址快速导航部分
		window.open($lk)
		$ck.value = ''
		$id('kwh').style.display = 'none'
		$kw = ''; $lk = ''; $_i = -1
		trackOutLink($lk)
		track('\/stat\/feellucky\/kb')
	} else { // 关键词 suggest 部分
		if ($_i == -1) { return }
		$ck.value = $kw
		$id('form-' + $ce).submit()
		$ck.select()
		trackSearch($kw, $ce)
		track('\/stat\/suggest\/kb')
	}
	return false
}

function gh(key) {
	if ($fs == '1') { return }
	if ($.browser.msie && document.readyState != "complete") { return }
	if ($id('sg1')) { $('#sg1').remove() }
  	if ($id('sg2')) { $('#sg2').remove() }
	var sg1 = document.body.appendChild(document.createElement('script'))
	sg1.id  = 'sg1'
	sg1.charset = 'utf-8'
	sg1.src = 'http:\/\/www.google.cn\/complete\/search?hl=zh-CN&client=suggest&js=true&q=' + encodeURIComponent(key)
	var sg2 = document.body.appendChild(document.createElement('script'))
	sg2.id  = 'sg2'
	sg2.charset = 'utf-8'
	sg2.src = 'http:\/\/daohang.google.cn\/suggest?num=60&partid=Moma&q=' + encodeURIComponent(key)
}
window.google = { ac: {} }
window.google.ac.Suggest_apply = function(a, b, c, d) {
	if ($.browser.msie && document.readyState != "complete") { return }
	if (!c || c.length < 3) { return }
	if (b != $ck.value) { return }
	old_wy_trs = getElementsByClassName('wy', 'ul', 'kwh')
	for (var i = 0; i < old_wy_trs.length; i++) {
		var e = old_wy_trs[i]
		e.parentNode.removeChild(e)
	}
	var tr = ''
	for (var j = 1; j < c.length && j < 13; j += 2) {
		tr += '<li class="wy" onmouseover="$(this).addClass(\'c\')" onmouseout="$(this).removeClass(\'c\');" onclick="$id(\'kwh\').style.display = \'none\'; $ck.value = \'' + c[j] + '\'; $id(\'form-\' + $ce).submit(); $ck.select(); track(\'\/stat\/suggest\/click\')"><span class="l">' + c[j] + '</span><span class="r">' + c[j + 1] + '</span></li>'
	}
	if ($id('kwh-wy')) {
		$id('kwh-wy').parentNode.removeChild($id('kwh-wy'))
	}
	var newdiv
	if ($id('kwh-wz')) {
		newdiv = document.createElement("ul")
		newdiv.id = "kwh-wy"
		$id('kwh').insertBefore(newdiv, $id('kwh-wz'))
		newdiv.innerHTML = tr
	} else {
		newdiv = document.createElement("ul")
		newdiv.id = "kwh-wy"
		$id('kwh').appendChild(newdiv)
		newdiv.innerHTML = tr
	}
	$id('kwh').style.display = "block"
}
var _handleAjaxMoma = function(res) {
	if ($fs == '1') { return }
	var row = res.split("|")
	if (row.length < 3) {
		return
	}
	old_wz_trs = getElementsByClassName('wz', 'tr', 'kwh')
	if ($id('kwh-wy-th') !== null) { $id('kwh-wy-th').parentNode.removeChild($id('kwh-wy-th')) }
	for (var i = 0; i < old_wz_trs.length; i++) {
   		var e = old_wz_trs[i]
  		e.parentNode.removeChild(e)
	}
	var tr
	for (var i = 1; i < row.length && i < 13; i += 2) {
		if (i == 1) { tr = '<li id="tip"><span>网址快速导航</span></li>' }
		var url = row[i]
		var tit = row[i+1]
		tr += '<li class="wz" onmouseover="$(this).addClass(\'c\');" onmouseout="$(this).removeClass(\'c\');" onclick="$id(\'kwh\').style.display = \'none\'; window.open(\'' + url +'\'); trackOutLink(\'' + url + '\'); track(\'\/stat\/feellucky/click\')"><span class="l">' + tit +'</span><span class="r">' + url +'</span></li>'
	}
	if ($id('kwh-wz')) {
		$id('kwh-wz').parentNode.removeChild($id('kwh-wz'))
	}
	var newdiv = document.createElement("ul")
	newdiv.id = "kwh-wz"
	$id('kwh').appendChild(newdiv)
	newdiv.innerHTML = tr
	$id('kwh').style.display = "block"
}

// 自定义样式
var _cl = $.cookie('C')
var _sz = $.cookie('S')
var _css = ''
if (!_cl || _cl == '0') {
	_css += '#layout-alpha a:visited, #layout-beta a:visited, #layout-gamma a:visited, #layout-delta a:visited { color: #752481; }\n'
}
if (_sz == '1') {
	_css += '#layout-beta .section table td, #layout-gamma .section td { font-size: 12px; }\n'
	_css += '#layout-gamma .section td.cm { font-size: 12px; }'
}
document.write('<style type="text\/css">\n' + _css + '<\/style>')

// 切换默认网页搜索标签
var toggleWYSE = function(en) {
	var eg = ['bd', 'gg']
	$ce = eg.toString().indexOf(en) == -1 ? eg[0] : en
	for (var i = 0; i < eg.length; i++) {
		_e = eg[i]
		if (_e == $ce) {
			continue
		}
		$id('sb-' + _e).style.display = 'none'
		$id('tab-' + _e).className = ''
	}
	$ck = $id('sb-' + $ce + '-kw')
	$id('sb-' + $ce).style.display = 'block'
	$id('tab-' + $ce).className = 'c'
	$.cookie('G', $ce, { expires: $10y, path: '/' })
	track('\/stat\/set\/sb-tab\/' + $ce)
}

/* Windows 下样式需要调整 */
if (/Windows/.test(navigator.userAgent)) {
	_css = '<style type="text\/css" media="all">\n'
		 	+ '#layout-alpha .section th { font: bold 14px "宋体"; }\n'
		 	+ '#layout-alpha .section tfoot td { padding: 6px 0px 9px; }\n'
		 	+ '<\/style>'
	document.write(_css)
}

var $citySites = [{ 'link': 'http:\/\/www.chinaren.com\/', 'name': 'ChinaRen' }, { 'link': 'http:\/\/www.online.sh.cn\/', 'name': '上海热线' }, { 'link': 'http:\/\/sina.allyes.com\/main\/adfclick?db=sina&bid=131618,166554,171501&cid=0,0,0&sid=158775&advid=358&camid=22145&show=ignore&url=http:\/\/sports.sina.com.cn\/z\/paralympic2008\/', 'name': '北京残奥会' }, { 'link': 'http:\/\/www.qihoo.com.cn\/', 'name': '奇虎'}, {'link': 'http:\/\/www.vnet.cn\/', 'name': '互联星空'}, {'link': 'http:\/\/www.pchome.net\/', 'name': '电脑之家' }]
var citySiteRPCDone = function(name, pinyin, sites) {
	for (var i = 0; i < sites.length; i++) {
		$citySites[i] = sites[i]
	}
	$citySites[$citySites.length - 1] = { 'link': '\/difang\/' + pinyin + '\/', 'name': name + '导航' }
}
var _e = $.cookie('E')
if (!_e) {
	document.writeln('<scr' + 'ipt type="text\/javascript" src="\/api\/get\/area.php?mod=city"><\/scr' + 'ipt>')
} else if (_e != 'unknow') {
	document.writeln('<scr' + 'ipt type="text\/javascript" src="\/difang\/' + _e + '\/mingzhan.js"><\/scr' + 'ipt>')
}
