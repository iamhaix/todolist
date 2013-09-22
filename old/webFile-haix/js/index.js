/***************************************************/
// main.js
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
	LOGOUT : '退出',

	/*
	*初始化
	* 注册信息对象，里面存储用户注册的信息
	*/
	initPage : function(){
		
		isLogin =  false;

		isLock = false;

		var today = new Date();
		currentTime = today.get
	},
	
	/*
	*检查邮箱是否有效，1、检测格式；2、是否已注册
	*
	*/
	isValidEmailOrUname : function(){},

	/*
	*检查密码格式，1、长度； 2、是否弱口令
	*
	*/
	isValidPasswd : function(){},

	/*
	*确认密码
	*
	*/
	confirmPasswd : function(){},


	//用户类
	user : {
		
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
		*/
		login : function(loginInfo){},

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
		*检查邮箱
		*
		*/
		isValidEmailOrUname : function(){},

		/*
		*检查密码
		*
		*/
		isValidPasswd : function(){},

		/*
		*
		*
		*/
	},

	task : {
	
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
	},

},

//入口
var  ez= jQuery.noConflict();
ez(document).ready(function(){
	
	easy.init();	
});


function login(uname,passwd){
	//alert(uname+passwd);
	    document.getElementById("loginError").innerHTML="";
		if(uname==""){
	//alert("1"+uname+passwd);
		  document.getElementById("loginError").innerHTML="请输入登录邮箱";
		}
		else if(passwd==""){
	//alert("2"+uname+passwd);
		  document.getElementById("loginError").innerHTML="请输入登录密码";
		}
		else{
	//alert("3"+uname+passwd);
		var passwd=hex_sha1(passwd);
		var uid;
		var paras = {};
			paras.username = uname;
			paras.password = passwd;
			paras.logway   = '1';
			paras.dowhat = 'login';
			paras = JSON.stringify(paras);
	//		alert(paras);
			para = {
				"jsonstring": paras
			};
			//console.log(paras);
			if(uname&&passwd){
			  if(jq("input:checked").length > 0){
			   setCookie("uname",uname,30);
			   //console.log(uname);
			   setCookie("token",hex_sha1(jq("#passwd").val()),30);
			   }
			jq.post("../Event.DB.php",
				para,
				function(rt) {
				data=eval("("+rt+")");				
				   if(data.code==0){
				   setCookie("uid",data.uid,30);
			          getbeforeclock();
				      schduletask();
	                  geteventlist();
	                  noCompleteThing();
	                  getCompleteThing();
				      document.getElementById("login").innerHTML=uname;
					  document.getElementById("register").innerHTML="退出";
					  document.getElementById("register").id="logout";
					  jq(".loginDiv").hide(500);
			//console.log(rt);
				   }
				   else{
		               document.getElementById("loginError").innerHTML=data.message;				     
				   }
				});
            }
			}
	}

