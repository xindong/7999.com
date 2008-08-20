function clickMail()
{var gm=document.gomail
var vDomain=gm.domains
var vName=gm.uName
var vPw=gm.uPw
if(vDomain.value==""){alert("您没有选择论坛！")
	vDomain.focus()
	return false}
if(vName.value==""){alert("用户名不能为空！")
	vName.focus()
	return false
}
if(vPw.value==""){alert("密码不能为空！")
	vPw.focus()
	return false}
switch(vDomain.value){
case "163":
gm.action="http://reg.163.com/login.jsp"
gm.url.value="http://bbs5.news.163.com/board/postlist.jsp?b=society"
gm.username.value=vName.value
gm.password.value=vPw.value
break
case "126":
gm.action="http://entry.126.com/cgi/login"
gm.domain.value="126.com"
gm.user.value=vName.value
gm.pass.value=vPw.value
break

case "sohu1":
gm.action="http://passport.sohu.com/login.jsp"
gm.url.value=""
gm.UserName.value=vName.value
gm.Password.value=vPw.value
gm.id.value=vName.value
gm.username.value=vName.value
gm.password.value=vPw.value
gm.m.value=vName.value
gm.passwd.value=vPw.value
gm.mpass.value=vPw.value
gm.loginid.value=vName.value+"@sohu.com"
gm.fl.value="1"
gm.vr.value="1|1"
gm.appid.value="1000"
gm.ru.value="http://login.mail.sohu.com/servlet/LoginServlet"
gm.eru.value="http://login.mail.sohu.com/login.jsp"
gm.ct.value="1173080990"
gm.sg.value="5082635c77272088ae7241ccdf7cf062"
break

case "sina":
gm.action="http://bbs.service.sina.com.cn/forum/login.php?url=http://bbs.sina.com.cn/"
gm.loginname.value=vName.value
gm.passwd.value=vPw.value
break

case "sohu":
gm.action="http://passport.sohu.com/login.jsp"
gm.loginid.value=vName.value+"@chinaren.com"
gm.passwd.value=vPw.value
gm.fl.value="1"
gm.vr.value="1|1"
gm.appid.value="1005"
gm.ru.value="http://profile.chinaren.com/urs/setcookie.jsp?burl=http://alumni.chinaren.com/"
gm.ct.value="1174378209"
gm.sg.value="84ff7b2e1d8f3dc46c6d17bb83fe72bd"
break
case "tianya":
gm.action="http://www.tianya.cn/user/loginsubmit.asp"
gm.vwriter.value=vName.value
gm.vpassword.value=vPw.value
break
case "baidu":
gm.action="http://passport.baidu.com/?login"
gm.username.value=vName.value
gm.password.value=vPw.value
break
}
vPw.value=""
return true}
