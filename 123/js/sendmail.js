function clickMail()
{var gm=document.gomail
var vDomain=gm.domains
var vName=gm.uName
var vPw=gm.uPw
if(vDomain.value==""){alert("您没有选择邮箱！")
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
gm.action="http://reg.163.com/CheckUser.jsp"
gm.url.value="http://fm163.163.com/coremail/fcg/ntesdoor2?lightweight=1&verifycookie=1&language=-1&style=15"
gm.username.value=vName.value
gm.password.value=vPw.value
gm.enterVip.value=''
break
case "126":
gm.action="http://entry.126.com/cgi/login"
gm.domain.value="126.com"
gm.user.value=vName.value
gm.pass.value=vPw.value
break
case "yeah":
gm.action="http://entry.yeah.net/cgi/login"
gm.domain.value="yeah.net"
gm.user.value=vName.value
gm.pass.value=vPw.value
break
case "188":
gm.action="http://reg.mail.188.com/servlet/coremail/login?language=0&style=1"
gm.user.value=vName.value
gm.pass.value=vPw.value
break
case "sohu":
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
case "yahoo":
gm.action="http://edit.bjs.yahoo.com/config/login"
gm.login.value=vName.value
gm.passwd.value=vPw.value
break
case "yahoocn":
gm.action="http://edit.bjs.yahoo.com/config/login"
gm.login.value=vName.value+"@yahoo.cn"
gm.passwd.value=vPw.value
break
case "tom":
gm.action="http://bjweb.163.net/cgi/163/login_pro.cgi"
gm.user.value=vName.value
gm.pass.value=vPw.value
break
case "21cn":
gm.action="http://passport.21cn.com/maillogin.jsp"
gm.LoginName.value=vName.value
gm.passwd.value=vPw.value
gm.domainname.value="21cn.com"
gm.UserName.value=vName.value+'@21cn.com'
break
case "sina":
gm.action="http://mail.sina.com.cn/cgi-bin/login.cgi"
gm.u.value=vName.value
gm.psw.value=vPw.value
break
case "gmail":
gm.action="https://www.google.com/accounts/ServiceLoginAuth?service=mail"
gm.Email.value=vName.value
gm.Passwd.value=vPw.value
break
case "chinaren":
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
case "xiaonei":
gm.action="http://login.xiaonei.com/Login.do"
gm.email.value=vName.value
gm.password.value=vPw.value
break
case "51com":
gm.action="http://passport.51.com/login.5p"
gm.passport_51_user.value=vName.value
gm.passport_51_password.value=vPw.value
gm.gourl.value="http%3A%2F%2Fmy.51.com%2Fwebim%2Findex.php"
break
}
vPw.value=""
return true}
