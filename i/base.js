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
	el = (el && (el.tagName || el.item)) ? el : $(el)
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
	return batch(el, f)
}
var removeClass = function(el, className) {
	var re = getClassRegEx(className)
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
			var rootNode = el.ownerDocument
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
					if (!accountForBody && $ua.webkit && getStyle(parentNode, 'position') == 'absolute' ) {
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
var getMouseXY = function(e) {
	if ($ua.ie > 0) {
		x = event.clientX + document.body.scrollLeft
		y = event.clientY + document.body.scrollTop
	} else {
		x = e.pageX
		y = e.pageY
	}  
	if (x < 0) { tempX = 0 }
	if (y < 0) { tempY = 0 }
	return [x, y]
}
var getCookie = function(name) {
	var arg  = name + "="
	var alen = arg.length
	var clen = document.cookie.length
	var i = 0
	while (i < clen) {
		var j = i + alen
		if (document.cookie.substring(i, j) == arg) {
			var endstr = document.cookie.indexOf(";", j)
			if (endstr == -1) {
				endstr = document.cookie.length
			}
			return decodeURIComponent(document.cookie.substring(j, endstr))
		}
		i = document.cookie.indexOf(" ", i) + 1
		if (i == 0) {
			break
		}
	}
	return null
}
var setCookie = function(name, value) {
	var argv   = arguments
	var argc   = arguments.length
	var expr   = (argc > 2) ? argv[2] : null
	var path   = (argc > 3) ? argv[3] : null
	var domain = (argc > 4) ? argv[4] : null
	var secure = (argc > 5) ? argv[5] : false
	document.cookie = name + "=" + encodeURIComponent(value) +
		((expr   == null) ? "" : ("; expires=" + expr.toGMTString())) +
		((path   == null) ? "" : ("; path=" + path)) +
		((domain == null) ? "" : ("; domain=" + domain)) +
		((secure == true) ? "; secure" : "")
}
var deleteCookie = function(name, path, domain) {
	if (!getCookie(name)) { return }
	document.cookie = name + "=" +
		((path) ? "; path=" + path : "") +
		((domain) ? "; domain=" + domain : "") +
		"; expires=Thu, 01-Jan-70 00:00:01 GMT"
}
