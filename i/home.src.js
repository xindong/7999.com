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
	track("/out/checkmail/" + d.value)
	return true
}
function getBit(m, n) { return (m >> n) & 1 }
function lunar(d) { // 计算农历
	var nums = "一二三四五六七八九十"
	var mons = "正二三四五六七八九十冬腊"
	var cala = [0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D, 0x5192B, 0xA95, 0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57, 0x52B, 0xA93, 0x40E95]
	var madd = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
	var total, m, n, k
	var isEnd = false
	var t = d.getYear()
	if (t < 1900) { t += 1900 }
	total = (t - 2001) * 365 + Math.floor((t - 2001) / 4) + madd[d.getMonth()] + d.getDate() - 23
	if (d.getYear() % 4 == 0 && d.getMonth() > 1) { total++ }
	for (m = 0; ; m++) {
		k = (cala[m] < 0xfff) ? 11 : 12
		for (n = k; n >= 0; n--) {
			if (total <= 29 + getBit(cala[m], n)) {
				isEnd = true
				break
			}
			total = total - 29 - getBit(cala[m], n)
		}
		if (isEnd) { break }
	}
//	var cYear = 2001 + m
	var cMonth = k - n + 1
	var cDay = total
	if (k == 12) {
  	if (cMonth == Math.floor(cala[m] / 0x10000) + 1) { cMonth = 1 - cMonth }
  	if (cMonth > Math.floor(cala[m] / 0x10000) + 1) { cMonth-- }
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

var $letterSites = ''
function toggleBeta(el) {
	var _id = $(el).attr('id').replace(/^bt-/, 'bs-')
	var _bs = $('#' + _id)
	if (_bs.length == 0) {
//		$('#layout-beta .tip').show()
		$('#bs-alpha').load('/i/alpha-sites.html?v=0.4', function(data) {
//			$('#layout-beta .tip').hide()
			$('#' + _id).show()
		})
	}
	$(el).addClass('c')
	$('#layout-beta .t > a').not(el).removeClass('c')
	$('#layout-beta ul.s').not(':hidden').hide()
	if (_bs.length == 1) { _bs.show() }
}

var $citySites = [{ 'link': 'http://www.chinaren.com/', 'name': 'ChinaRen' }, { 'link': 'http://www.online.sh.cn/', 'name': '上海热线' }, { 'link': 'http://sina.allyes.com/main/adfclick?db=sina&bid=131618,166554,171501&cid=0,0,0&sid=158775&advid=358&camid=22145&show=ignore&url=http://sports.sina.com.cn/z/paralympic2008/', 'name': '北京残奥会' }, { 'link': 'http://www.qihoo.com.cn/', 'name': '奇虎'}, {'link': 'http://www.vnet.cn/', 'name': '互联星空'}, {'link': 'http://www.pchome.net/', 'name': '电脑之家' }]
function citySiteRPCDone(name, pinyin, sites) {
	$citySites[0] = { 'link': '/difang/' + pinyin + '/', 'name': name + '导航' }
	for (var i = 0; i < sites.length; i++) {
		$citySites[i+1] = sites[i]
	}
}
var _e = $.cookie('E')
if (!_e) document.writeln('<script type="text/javascript" src="/api/get/area.php?mod=city"></scr' + 'ipt>')
else if (_e != 'unknow') document.writeln('<script type="text/javascript" src="/difang/' + _e + '/mingzhan.js"></scr' + 'ipt>')

var _css
/* Windows 下样式需要调整 */
if (/Windows/.test(navigator.userAgent)) {
	_css += '#layout-alpha .s th { font: bold 14px "宋体"; }\n'
		 +  '#layout-alpha .s tfoot td { padding: 6px 0px 9px; }\n'
}
// 自定义样式
var _cl = $.cookie('C')
var _sz = $.cookie('S')
var _css = ''
if (!_cl || _cl == '0') {
	_css += '#layout-alpha a:visited, #layout-beta a:visited, #layout-gamma a:visited, #layout-delta a:visited { color: #752481; }\n'
}
if (_sz == '1') {
	_css += '#layout-beta .s, #layout-gamma .s td { font-size: 12px; }\n'
	_css += '#layout-gamma .s td.cm { font-size: 12px; }'
}
document.write('<style type="text/css">\n' + _css + '</style>')

$('#layout-beta').ready(function(e) {
	// “名站"，”历史记录“，字母导航 的标签点击事件
	$('#layout-beta > div.t > a').click(function(e) { toggleBeta(this); return false })
})
