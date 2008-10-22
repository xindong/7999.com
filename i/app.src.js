
function errorHandler(msg, url, line) {
	 // pro env
	if (location.hostname.indexOf('local') == -1 && location.hostname.indexOf('192') == -1) { return true }
	// dev env
	var txt ="Error: " + msg + "\n"
	txt +="URL: " + url + "\n"
	txt +="Line: " + line + "\n\n"
	txt +="Click OK to continue.\n\n"
	alert(txt)
	return false
}
onerror = errorHandler

// 防止 JS 操作造成重新载入时页面编码错乱
if ($.browser.msie && document.charset.toUpperCase() == "UTF-8") { location.reload(false) }

// 初始化 Google Analytics 的实例化变量，防止调用时出现未定义的变量
function track(url) {  }
function trackOutLink(l) { track("/out" + location.pathname + l.replace(/^https?:\/\//, '/').replace('https://', '/')) }
function trackSearch(wd, by) {
   $('#kwh').hide()
   if (!$.trim(wd)) { wd = 'NULL' }
   track("/search?by=" + by + "&at=" + location.pathname + "&wd=" + wd)
//   track("/search?by=" + by)
}

// 10年的日期对象，用于之后存 Cookie 保存设置
var $10y = new Date(); $10y.setFullYear($10y.getFullYear() + 10)

function fetchWeatherRPCDone() {
	if (arguments.length == 3) {
		jsid = arguments[0]
		city = arguments[1]
		info = arguments[2]
	} else {
		return
	}
	var str = city
	if (info[0].desc && info[0].desc != '暂无预报') {
		str +=  ': ' + info[0].desc + ' ' + info[0].temp[1] + '~' + info[0].temp[0]
	}
	$('#weather-info').text(str)
}

var $fs = $.cookie('B')
var $_i = -1
var $lk, $kw
var $ce = 'bd'
var $ck = $('#sb-' + $ce + '-kw')
var $bd = 'myiee_10553_pg'

if (Math.floor(Math.random() * 10) < 10) { $bd = 'verycd_pg'; } // 全部用 verycd_pg ... 

function hint(keyword, evt) {
	if ($fs == '1') { return }
	if ($.browser.msie && document.readyState != "complete") { return }
	if (16 <= evt.keyCode && evt.keyCode <= 18) { return }
	var so = $('#kwh')
	if (!keyword.value || !keyword.value.length || evt.keyCode == 27) { // 27 is escape (evt.DOM_VK_ESCAPE)
		so.hide()
	}
	if (evt.keyCode == 38 || evt.keyCode == 40) { // up or down
		if (so.is(':hidden')) { return }
		var wy = $('#kwh-wy'); var yc = wy.children()
		var wz = $('#kwh-wz'); var zc = wz.children()
		var al = yc.length + zc.length
		yc.removeClass('c'); zc.removeClass('c')
		if (evt.keyCode == 38) { // up
			if ($_i < 0) { $_i = al - 1 }
			else { $_i-- }
		} else { // down
			if ($_i > al - 2) { $_i = -1 }
			else { $_i++ }
		}
		if (-1 < $_i && $_i < yc.length) { // 网页
			yc.eq($_i).addClass('c')
			if (yc.eq($_i).children().length) {
				$kw = yc.eq($_i).children().eq(0).html()
				$kw = $kw.replace(/<span>/, '')
				$kw = $kw.replace(/<\/span>/, '')
				$lk = null
			}
		} else if ($_i == yc.length) { // 提示
			if (evt.keyCode == 38) {
				yc.eq(--$_i).addClass('c')
				$kw = yc.eq($_i).children().eq(0).html()
				$kw = $kw.replace(/<span>/, '')
				$kw = $kw.replace(/<\/span>/, '')
				$lk = null
			} else {
				zc.eq(++$_i - yc.length).addClass('c')
				$lk = zc.eq($_i - yc.length).children().eq(1).html()
			}
		} else if (yc.length < $_i && $_i < al) { // 网址
			zc.eq($_i - yc.length).addClass('c')
			if (zc.eq($_i - yc.length).children().length) {
				$lk = zc.eq($_i - yc.length).children().eq(1).html()
			}
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
	if ($lk != undefined && $lk) { // 网址快速导航部分
		window.open($lk)
		$ck.val('')
		$('#kwh').hide()
		$kw = ''; $lk = ''; $_i = -1
		trackOutLink($lk)
		track('/stat/feellucky/kb')
	} else { // 关键词 suggest 部分
		if ($_i == -1) { return }
		$ck.val($kw)
		$('#form-' + $ce).submit()
		$ck.select()
		trackSearch($kw, $ce)
		track('/stat/suggest/kb')
	}
	return false
}

function gh(key) {
	if ($fs == '1') { return }
	if ($.browser.msie && document.readyState != "complete") { return }
	$('#sg1').attr('src', 'http://www.google.cn/complete/search?hl=zh-CN&client=suggest&js=true&q=' + encodeURIComponent(key))
	$('#sg2').attr('src', 'http://daohang.google.cn/suggest?num=60&partid=Moma&q=' + encodeURIComponent(key))
	
}
window.google = { ac: {} }
window.google.ac.Suggest_apply = function(a, b, c, d) {
	if ($.browser.msie && document.readyState != "complete") { return }
	if (!c || c.length < 3) { return }
	if (b != $ck.val()) { return }
	$('#kwh-wy').empty()
	for (var i = 1; i < c.length && i < 13; i += 2) {
		var kwd = c[i]; var num = c[i+1]
		$('#kwh-wy').append($('<li/>')
			.append($('<span/>').addClass('l').html(kwd))
			.append($('<span/>').addClass('r').html(num))
			.data('kwd', kwd)
			.addClass('wy')
			.mouseover(function(e) { $(this).addClass('c') })
			.mouseout(function(e) { $(this).removeClass('c') })
			.click(function(e) {
				$('#kwh').hide()
				$ck.val($(this).data('kwd'))
				$('#form-' + $ce).submit()
				$ck.select()
				track('/stat/suggest/click')
			})
		)
	}
	$('#kwh').show()
}
function _handleAjaxMoma(res) {
	if ($fs == '1') { return }
	var row = res.split("|")
	if (row.length < 3) { return }
	$('#kwh-wz').empty()
	for (var i = 1; i < row.length && i < 13; i += 2) {
		if (i == 1) {
			$('#kwh-wz').append($('<li/>').addClass('t')
				.append($('<span/>').html('网址快速导航'))
			)
		}
		var url = row[i]; var tit = row[i+1]
		$('#kwh-wz').append($('<li/>')
			.append($('<span/>').addClass('l').html(tit))
			.append($('<span/>').addClass('r').html(url))
			.data('url', url)
			.addClass('wz')
			.mouseover(function(e) { $(this).addClass('c') })
			.mouseout(function(e) { $(this).removeClass('c') })
			.click(function(e) {
				$('#kwh').hide()
				window.open($(this).data('url'))
				trackOutLink($(this).data('url'))
				track('/stat/feellucky/click')
			})
		)
	}
	$('#kwh').show()
}

// 切换默认网页搜索标签
function toggleWYSE(en) {
	var eg = ['bd', 'gg']
	$ce = eg.toString().indexOf(en) == -1 ? eg[0] : en
	for (var i = 0; i < eg.length; i++) {
		_e = eg[i]
		if (_e == $ce) {
			continue
		}
		$('#sb-' + _e).hide()
		$('#tab-' + _e).removeClass('c')
	}
	$ck = $('#sb-' + $ce + '-kw')
	$('#sb-' + $ce).show()
	$('#tab-' + $ce).addClass('c')
	$.cookie('G', $ce, { expires: $10y, path: '/' })
	track('/stat/set/sb-tab/' + $ce)
}
// 切换搜索标签
function checkSearchTab(tab) {
	var tabs = ['gg', 'bd', 'yy', 'tp', 'sp', 'xz', 'gw', 'dt']
	for (var i = 0; i < tabs.length; i++) {
		var t = '#tab-' + tabs[i]
		var s = '#sb-' + tabs[i]
		if (('#' + tab.id) == t) {
			if (tabs[i] == 'gg' || tabs[i] == 'bd') {
				toggleWYSE(tabs[i])
			}
			$(t).addClass('c')
			$(s).show()
			$(s + '-kw').select()
		} else {
			$(t).removeClass('c')
			$(s).hide()
		}
	}
}

function tbLink(el) {
	if ($(el).is('a')) {
		if ($(el).attr('href').indexOf('allyes') != -1) {
			return true
		}
		r = Math.random()
		r = Math.floor(r * 10)
		if (r <= 0) {
			return true
		}
		$(el).attr('href', 'http://adtaobao.allyes.cn/main/adfclick?db=adtaobao&bid=1720,1677,333&cid=31811,469,1&sid=59310&ref=11575102&show=ignore&url=' + $(el).attr('href'))
	}
	return true
}

var $citySites = [{ 'link': 'http://www.chinaren.com/', 'name': 'ChinaRen' }, { 'link': 'http://www.online.sh.cn/', 'name': '上海热线' }, { 'link': 'http://sina.allyes.com/main/adfclick?db=sina&bid=131618,166554,171501&cid=0,0,0&sid=158775&advid=358&camid=22145&show=ignore&url=http://sports.sina.com.cn/z/paralympic2008/', 'name': '北京残奥会' }, { 'link': 'http://www.qihoo.com.cn/', 'name': '奇虎'}, {'link': 'http://www.vnet.cn/', 'name': '互联星空'}, {'link': 'http://www.pchome.net/', 'name': '电脑之家' }]
function citySiteRPCDone(name, pinyin, sites) {
	for (var i = 0; i < sites.length; i++) {
		$citySites[i] = sites[i]
	}
	$citySites[$citySites.length - 1] = { 'link': '/difang/' + pinyin + '/', 'name': name + '导航' }
}
var _e = $.cookie('E')
if (!_e) document.writeln('<script type="text/javascript" src="/api/get/area.php?mod=city"></scr' + 'ipt>')//$('<script/>').attr('src', "/api/get/area.php?mod=city").attr('charset', 'gb2312').appendTo(document)
else if (_e != 'unknow') document.writeln('<script type="text/javascript" src="/difang/' + _e + '/mingzhan.js"></scr' + 'ipt>')//$('<script/>').attr('src', "/difang/" + _e + "/mingzhan.js").attr('charset', 'gb2312').appendTo(document)

$('#sb-tab').ready(function(e) {
	$('#sb-tab li').click(function(e) { checkSearchTab(this); return false })
})
$('#sb-container').ready(function(e) {
	if ($.cookie('F')) { $.cookie('F', null); $.cookie('F', null, { path: '/' }) }
	var _se = $.cookie('G')
	if (_se != "gg" && _se != "bd") {
		if (_se == "google") {
			_se = "gg"
		} else {
			_se = "bd"
		}
	}
	if (!_se) {
		var _ref = /^http:\/\/([a-z0-9\-\.]+)\/.*$/.test(document.referrer) ? RegExp.$1 : ""
		if (_ref.indexOf("google.") != -1) { // Google 过来的
			if ($.browser.msie) { // IE 内核
				if (navigator.userAgent.indexOf('Tencent') || navigator.userAgent.indexOf('Maxthon')) {
					// 从 Google 过来的腾讯 TT 和 Maxthon 用户，认为他们喜欢用 Google
					_se = 'google'
				} else {
					// 从 Google 过来，并且不是装了 Google 工具条的纯 IE 用户（排除被 Google 强奸的用户），才认为是 Google 用户
					_se = navigator.userAgent.indexOf('Google') == -1 ? 'google' : 'baidu'
				}
			} else { // Firefox / Opera / Safari 则直接认为是 Google 用户
				_se = 'google'
			}
		}
	}
	toggleWYSE(_se)
	// 搜索框 onmouseover 时聚焦
	$('#sb-container input.kw').mouseover(function(e) { $(this).select() })
	// 搜索框搜索按钮效果
	$('#sb-container input.btn')
		.mouseover(function(e) { $(this).removeClass('btn-d').addClass('btn-o')    })
		.mouseup(  function(e) { $(this).removeClass('btn-d').removeClass('btn-o') })
		.mousedown(function(e) { $(this).removeClass('btn-o').addClass('btn-d')    })
		.mouseout( function(e) { $(this).removeClass('btn-o').removeClass('btn-d') })
	// 聚焦搜索框
	$('#sb-' + $ce + '-kw').focus()
})
$(document).ready(function(e) {
	$('*').click(function(e) {
		if ($.browser.msie && document.charset.toUpperCase() == "UTF-8") {
			// IE，点击任意位置，使页面编码该回 gb2312
			document.charset = 'gb2312'
		}
		$('#kwh').hide()
	})
	// 跟踪本页内全部 <a> 的点出
	$('a').click(function(e) { trackOutLink($(this).attr('href')) })
	// 统计24小时内第二次访问的激活用户
	var _3m = new Date()
	var _ts = _3m.getTime()
	_3m.setTime(_ts + (1000 * 3600 * 24 * 90))
	var _lv = $.cookie('A')
	var _as = $.cookie('T')
	if (_lv && !_as && _ts - _lv < (1000 * 3600 * 24)) { // 激活
		$('#ga-stat1').attr('src', 'http://www.googleadservices.com/pagead/conversion/1039906861/?label=aRZ8CIHxWxCt8O7vAw&script=0')
		track("/stat/conversion/24h")
		$.cookie('T', '1', { expires: _3m, path: '/' })
	}
	$.cookie('A', _ts, { expires: $10y, path: '/' })
	// 调整窗口大小，未最后确定
	if ($.browser.msie && (typeof screen.availWidth == "number")) {
		var _w = document.documentElement.clientWidth + 29
		var _h = document.documentElement.clientHeight
		if (_w < 1021 && screen.availWidth >= 1021) {
			var _tw = screen.availWidth < 1024 ? screen.availWidth : 1024
			var _th = Math.round(_tw * screen.availHeight / screen.availWidth)
			//moveTo(0, 0); resizeTo(_tw, _th) // 未最后确定，先统计起来
			track('/stat/resize-window/'
				+ screen.availWidth+ 'x' + screen.availHeight + '/'
				+ _w + 'x' + _h + '/' + _tw + 'x' + _th)
		} else if (_h < 500 && screen.availHeight > 500) {
			var _tw = _w
			var _th = Math.round(_tw * screen.availHeight / screen.availWidth)
			//moveTo(0, 0); resizeTo(_tw, _th)
			track('/stat/resize-window/'
				+ screen.availWidth + 'x' + screen.availHeight + '/'
				+ _w + 'x' + _h + '/' + _tw + 'x' + _th)
		}
	}
	// 统计来路
	var _fr = $.cookie('D')
	if (_fr) {
		track('/from/' + _fr)
		$.cookie('D', null, { path: '/' })
	}
})
