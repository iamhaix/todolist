<html>
<head>

<meta http-equiv="Content-Type" content="text/html; charset=utf8" />
<style  rel="stylesheet" />
	body{
		/*background:url(webFile/images/acti_bg1.jpg) no-repeat;*/
		background:#0A9AB7;
	}
	#hoho{
		margin:0 auto;
		padding-top:100px;
		padding-left:10px;
		font-size:2em;
		font-family:"微软雅黑";
		text-align:center;
	}
	
	#hoho a{
		text-decoration:underline;
		color:orange;
	}
</style>
<title>激活soeasy账号</title>
<!--<meta http-equiv="Refresh" content="5;URL=http://127.0.0.1/todolist/webnew/demo.html" />-->
<script src="../webFile/js/jquery.1.4.2-min.js"></script>""
<script src="../webFile/js/common.js"></script>
<script type="text/javascript">
/*$("#success").live('click',function(){
	login(getCookie('uname'),getCookie('passwd'));
	})*/
</script>
</head>
<body>
<?php
	require_once ("./base.php");
	require_once ("../User.DB.php");

	$code = @$_GET ["code"]; 
	$key = "soeasymailkey";
	$email = Base::authcode( $code, "DECODE", $key );  

	$userid = UserDB::getIDByEmail ($email);//对数据库查找操作 

	if($userid){
		UserDB::setActive($userid);
		UserDB::setRegisterDate($userid);

		echo "<div id='hoho'>亲爱的，恭喜您！您的".$email."账号激活成功!点击<a id='success' href='http://10.16.15.88:8083/todolist/webFile/main.html'>这里</a>之后跳到soeasy主页....</div><br />";  
	}else{

		echo "<div id='hoho'>亲爱的，对不起！您的".$email."账号激活失败!点击<a href='http://10.16.15.88:8083/todolist/webFile/main.html'>这里</a>返回soeasy主页....</div><br />";  
	}
?>
</body>
</html>


