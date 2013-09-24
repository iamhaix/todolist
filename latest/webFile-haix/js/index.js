/***************************************************/
// index.js
//
// date:2013-9-2
// author:zhang haixi
// func:该类为soeasy网站页面提供交互支持
//**************************************************/

var easy = {

	//标记是否已登录
	isLogin : false,
	
	//标记页面是否被锁定，锁定即其他事件全部失效
	isLock : false,
	
	//缓存编辑之前的任务内容
	temptitle : '';

	//当前时间
	currentTime : null,

	//“登录”，常量，未登录时显示
	LOGINTITLE : '登录',

	//“注册”，常量，未注册时显示
	REGISTERTITLE : '注册',

	//“退出”，常量，已登录时显示
	LOGOUTTITLE : '退出',

	/*
	*初始化
	* 注册信息对象，里面存储用户注册的信息
	*/
	initPage : function(){
		
		//isLogin =  false;

		//isLock = false;
		
		//设置文档顶部时间
		var currentTime = this.getCurrentTime();
		jq("#currentTime").html(currentTime);
	
		//点击登录
		jq(documen).delegate('.login','click',this.loginShow);

		//绑定登录事件
		jq(document).delegate('.loginSubmit','click',this.loginSubmit);

	},

	/*
	 *点击登录按钮后显示登录框
	 *
	 *
	 */
	loginShow : function(){
		
		jq('.loginDiv').show();
		if(base.getCookie('uname')){
			jq('#uname').attr('value',base.getCookie('uname'));
			jq('#passwd').focus();
		};
		jq('#uname').focus();
	},

	/*
	 *提交登录处理
	 *
	 *
	 */
	loginSubmit : function(){ 
			
		var uname = jq('#uname');
		var passwd = jq('#passwd');
		if(user.isRightFormat('username',uname)){
			if(user.isRightFormat('password',passwd)){
				isLogin = user.login({username:uname, password: passwd});
			}else{
				jq("#loginError").text(MSG.LOGIN.UNVALIDPASSWD);
				return false;
			}
		}else{
			jq("#loginError").text(MSG.LOGIN.UNVALIDUNAME);
			return false;
		}
		this.initStatus();
		return true;
	},

	/*
	 *判断登录状态，做处理
	 *
	 *
	 */
	initStatus : function(){

		if (!isLogin) {
			jq('#loginOrName').attr('class','login').text(MSG.LOGINTITLE);
			jq('#registerOrLogout').attr('class','register').text(MSG.REGISTERTITLE);
		}else {
			var uname = base.getCookie('uname');
			jq('#loginOrName').attr('class','uname').text(uname);
			jq('#registerOrLogout').attr('class','logout').text(this.LOGOUTTITLE);
		}
			 
	},

	/*
	 *获取当前时间
	 *format：xxxxx年xx月xx日 星期x
	 *
	 */
	getCurrentTime : function () {
					 
		var today = new Date();
		var arr_week = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
		var time = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日' + ' ' + arr_week[date.getDay()];

		return time;
	},


};


//=============================================
//用户对象
//里面包含用户的各种操作，如登陆注册验证等
//
//=============================================
var	user = {
		
	//用户名
	userName : null;

	//邮箱
	email : null;

	//密码
	passwd : null;

	//令牌
	token : null;

	/*
	*登录
	*loginInfo 登录对象，里面存储用户登录需要的信息
	*{username:xxx, passwd:xxx}
	*
	*/
	login : function(loginInfo){
		
		if (loginInfo.username && loginInfo.password) {
			
			var url = '../User.DB.php';
			jq.getJSON(url, {request:loginInfo}, function(response){
				
				if(response.code == 0){
					return true;
				}
				return false;
			});
		}
		return false;
	},

	/*
	*注册
	*registerInfo 注册信息对象，里面存储用户注册的信息
	*/
	register : function(registerInfo){},

	/*
	*退出
	*
	*/
	logout : function(){},

	/*
	*记住密码，自动登录
	*
	*/
	rememberMyLogin : function(){},

	/*
	*找回密码
	*
	*/
	findMyPassword : function(){},

	/*
	 *检查邮箱是否有效，1、检测格式；2、是否已注册
	 *
	 */
	isRightFormat : function(type, str){
		
		var isOk = false;
		if(type && str){
			switch (type){
				case 'username':
					isOk = (MSG.PATTERN.USERNAME).test(str);
					break;
				case 'password':
					isOk = (MSG.PATTERN.PASSWORD).test(str);
					break;
				case 'email':
					isOk = (MSG.PATTERN.EMAIL).test(str);
					break;
				default:
					break;
			}		
		}

		return isOk;
	}

	/*
	 *检查邮箱是否有效，1、检测格式；2、是否已注册
	 *
	 */
	isValidEmailOrUname : function(emailstr){

		var url = '../Event.DB.php';
		var param = {email:emailstr}
		jq.getJSON(url,{request:param},function(response){
			//code == 0 表示成功
			if(response.code == 0){
				return true;
			}
			return false;
		});

		return false;
	},

	/*
	 *检查密码格式，1、长度； 2、是否弱口令
	 *
	 */
	isValidPasswd : function(passwd){

		//检查是否弱口令	
		//-------waiting---------
		return true;
	},

	/*
	 *确认密码
	 *
	 */
	confirmPasswd : function(confirmpass, firstpass){

		return confirmpass === firstpass ? true : false;
	}

};

//==================================================
//task对象
//里面包含对任务的各种操作方法
//
//==================================================
var	task = {
	
	/*
	*获取今天任务
	*
	*/
	getTodayTask : function(){},
	
	/*
	*获取即将任务
	*
	*/
	getFutureTask : function(){},

	/*
	*获取已完成任务
	*
	*/
	getFinishedTask : function(){},


	/*
	*创建一条任务
	*
	*/
	createOneTask : function(){},

	/*
	*删除一条任务
	*
	*/
	deleteOneTask : function(){},

	/*
	*修改一条任务
	*
	*/
	updateOneTask : function(){},

	/*
	*添加或修改闹钟提醒
	*
	*/
	setClockForTask : function(){},

	/*
	*删除闹钟提醒
	*
	*/
	deleteClcokForTask : function(){},


	/*
	*自动推送今日未完成到明日
	*
	*/
	updateNotFinishedToTommorror : function(){},


	/*
	*
	*
	*/
	 : function(){},
};

//程序入口
var  ez= jQuery.noConflict();
ez(document).ready(function(){
	
	easy.init();	
});

