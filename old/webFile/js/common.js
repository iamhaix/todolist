var jq = jQuery.noConflict();
function setCookie(name,value,days)//两个参数，一个是cookie的名子，一个是值

{

    var Days = days; //此 cookie 将被保存 30 天

    var exp = new Date();    //new Date("December 31, 9998");

    exp.setTime(exp.getTime() + Days*24*60*60*1000);

    document.cookie = name + "="+ escape (value) + ";path=/todolist-branch/;expires=" + exp.toGMTString();

}

//取cookies函数       
function getCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));

    if(arr != null) return unescape(arr[2]); return null;
}

//删除cookie
function delCookie(name){
    var exp = -1;

    var cval=getCookie(name);

    if(cval!=null) 
	setCookie(name,cval,exp);
	//console.log("uid===="+getCookie(name));
}


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
			console.log(paras);
			if(uname&&passwd){
			  if(jq("input:checked").length > 0){
			   setCookie("uname",uname,30);
			   //console.log(uname);
			   setCookie("passwd",jq("#passwd").val(),30);
			   }
			jq.post("../Event.DB.php",
				para,
				function(rt) {
					console.log("rt"+rt);
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
			console.log(rt);
				   }
				   else{
		               document.getElementById("loginError").innerHTML=data.message;				     
				   }
				});
            }
			}
	}
jq("#success").live('click',
function(){
	     login(getCookie('uname'),getCookie('passwd'));
	     })

