var MSG = {
	//“登录”，常量，未登录时显示
	LOGINTITLE		:	'登录',
	//“注册”，常量，未注册时显示	
	REGISTERTITLE	:	'注册',
	//“退出”，常量，已登录时显示
	LOGOUTTITLE		:	'退出',

	PATTERN:{
		
		USERNAME		:	/^[a-zA-Z0-9]{3,16}$/,

		EMAIL			:	/^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
	
		PASSWORD		:	/^[a-zA-Z0-9`~!@#$%^&*]{6,16}$/,
	},

	REGISTER:{
			
		UNVALIDEMAIL	:	'邮箱格式不正确',

		UNVALIDPASSWD	:	'密码格式不正确',

		CONFIRMPASSWDFAIL	:	'两次输入的密码不一致',
	},

	LOGIN:{
		
		UNVALIDUNAME	:	'账号格式不正确',

		UNVALIDPASSWD	:	'密码格式不正确',

		WRONGUNAME	:	'账号不存在',

		WRONGPASSWD	:	'密码错误',

	},

	URL:{
		LOGINURL	:	'../User.DB.php',
		REGISTERURL	:	'../User.DB.php',
		LOGOUTURL	:	'../User.DB.php',
		VALIDATEUNAMEURL:	'../User.DB.php',
		VALIDATEEMAILURL:	'../User.DB.php',
	
		
	},
}
