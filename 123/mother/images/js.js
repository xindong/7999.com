var lusername	=location.search.split("=")[1];
if(!lusername){
	lusername="张三";
}
else{
	lusername=unescape(lusername);
}

function check(obj){
	if (obj.stra.value.length>8) {
		alert('太长'); 
		return false;
	}
	if (obj.stra.value.length==0) {
		alert('还没填姓名呀'); 
		return false;
	}
	var url	=location.protocol + "//" + location.host + location.pathname+"?stra="+escape(obj.stra.value);
	window.clipboardData.setData("Text",url);
	alert('网址已生成并替您复制好了，直接粘贴到QQ、MSN、邮箱就可以了\n\n 您的母亲一定会很惊喜，快快发送吧！');
	window.location.replace(url);
	return false;
}