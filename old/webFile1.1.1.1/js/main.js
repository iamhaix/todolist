/*resolve the conflict of jquery and protype*/
var jq = jQuery.noConflict(); 
var tag = 0;
//store the before title of updating
var title; 
jq(function(){
	geteventlist();
	mainFunction();
	noCompleteThing();
	getCompleteThing();
	  var userName = getCookie("uname");  
		console.log(userName);
        document.getElementById("uname").value = userName;  
        var userPass = getCookie("passwd");  
        document.getElementById("passwd").value = userPass;  
		var uid = getCookie("uid");  
});

	
function setCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function getCookie( name ) { 
    var start = document.cookie.indexOf( name + "=" ); 
    var len = start + name.length + 1; 
    if ( ( !start ) && ( name != document.cookie.substring( 0, name.length ) ) ) { 
        return null; 
    } 
    if ( start == -1 ) return null; 
    var end = document.cookie.indexOf( ';', len ); 
    if ( end == -1 ) end = document.cookie.length; 
    return unescape( document.cookie.substring( len, end ) ); 
} 

function deleteCookie(name) {
    setCookie(name,"",-1);
}


function geteventlist(){
               var paras={};
			   paras.uid=1;
			   paras.dowhat="gettodayandfuturetasks";
               paras=JSON.stringify(paras);
		       para={"jsonstring":paras};
			   console.log(para);
     		   jq.post("../Event.DB.php", 
			           para,
		              function(rt) {
					  rt=eval("("+rt+")");
					  					  console.log(rt['data']['todaydata']);
					  console.log(rt);
				      if(rt.code==1){
				         for(var i=0;i<rt['data']['todaydata'].length;i++){
						  taskid=rt['data']['todaydata'][i]['id'];
						  title=rt['data']['todaydata'][i]['title'];
						  content=rt['data']['todaydata'][i]['content'];
						  time=rt['data']['todaydata'][i]['remindtimestamp'];
						  console.log(taskid+title);
						  jq("#today").append("<li id='"+taskid+"'+ state='0' onmouseover='showBlock(this.id)' onmouseout='showNone(this.id)'></li>");
					     jq("#"+taskid).append(" <div class='completeIcon' id='completeIcon"+taskid+"'></div>").append("<h3 id='clockDisplay"+taskid+"' style='visibility:hidden;'>00:00</h3>").append(
				         "<div class='inline'><img id='clockIcon"+taskid+"' src='images/icon07.png'></div>").append("<dl><dt><input class='eventClass  eventClass"+taskid+"' id='event"+taskid+"' type='text' value='"+title+"' readonly='readonly' /></dt></dl>").append("<dl class='dealTask_right' id='editTask"+taskid+"'><img id='edit"+taskid+"' class='edit' title='编辑任务' src='images/icon03.png'> <img id='clockSet"+taskid+"' class='clockSet' title='添加提醒' src='images/icon02.png'> <span id='timeselect"+taskid+"'></span><img id='deleteTask"+taskid+"' class='deleteTask' title='删除' src='images/icon04.png'> <a href='#' class='confirmCompleted' id='confirmCompleted"+taskid+"'>标记完成</a><button id='confirmTask"+taskid+"' class='confirmTask' type='button'>确定</button><button id='cancelTask"+taskid+"' class='cancelTask' type='button'>取消</button><button id='confirmClock"+taskid+"' class='confirmClock' type='button'>确定</button><button id='cancelClock"+taskid+"' class='cancelClock' type='button'>取消</button></dl>").append(
				         "	<div class='dealTask_left'><span id='updateComment"+taskid+"' style='display:none;margin-left: 325px;'> <textarea class='commentClass' id='commentClass"+taskid+"' name='textarea' rows='10' cols='20' style='margin-bottom:-10px;overflow-y:hidden;height:80px;'>升级极速内核到21.0；全新默认界面；新增小窗口播放功能</textarea><button id='confirmComment"+taskid+"' class='confirmComment'  type='button'>添加</button><button id='cancelComment"+taskid+"' class='cancelComment' type='button'>取消</button>	</span>	<span id='detailComment"+taskid+"'></span><a href='#' id='editComment"+taskid+"' class='editComment' style='margin-left:5px;'>编辑备注</a></div>");				
 				         document.getElementById("detailComment"+taskid).innerHTML=content;		
                        if(time){
				               var arr=time.split(" ")[1].split(":");
                               clock=arr[0]+":"+arr[1];						
				   		 	   document.getElementById('clockDisplay'+taskid).innerHTML=clock;
							   if(clock!="00:00"){
		                       jq("#clockIcon"+taskid).attr("src","images/icon02.png");
		                       jq("#clockDisplay"+taskid).css("visibility","visible");
							   }
			         	}							 
				        }
						for(var i=0;i<rt['data']['todayfinishdata'].length;i++){
						  taskid=rt['data']['todayfinishdata'][i]['id'];
						  title=rt['data']['todayfinishdata'][i]['title'];
						  content=rt['data']['todayfinishdata'][i]['content'];
						  time=rt['data']['todayfinishdata'][i]['remindtimestamp'];
						  console.log(taskid+title);
						  jq("#today").append("<li id='"+taskid+"'+ state='0' onmouseover='showBlock(this.id)' onmouseout='showNone(this.id)'></li>");
					     jq("#"+taskid).append(" <div class='completeIcon' id='completeIcon"+taskid+"'></div>").append("<h3 id='clockDisplay"+taskid+"' style='visibility:hidden;'>00:00</h3>").append(
				         "<div class='inline'><img id='clockIcon"+taskid+"' src='images/icon07.png'></div>").append("<dl><dt><input class='eventClass  eventClass"+taskid+"' id='event"+taskid+"' type='text' value='"+title+"' readonly='readonly' /></dt></dl>").append("<dl class='dealTask_right' id='editTask"+taskid+"'><img id='edit"+taskid+"' class='edit' title='编辑任务' src='images/icon03.png'> <img id='clockSet"+taskid+"' class='clockSet' title='添加提醒' src='images/icon02.png'> <span id='timeselect"+taskid+"'></span><img id='deleteTask"+taskid+"' class='deleteTask' title='删除' src='images/icon04.png'> <a href='#' class='confirmCompleted' id='confirmCompleted"+taskid+"'>标记完成</a><button id='confirmTask"+taskid+"' class='confirmTask' type='button'>确定</button><button id='cancelTask"+taskid+"' class='cancelTask' type='button'>取消</button><button id='confirmClock"+taskid+"' class='confirmClock' type='button'>确定</button><button id='cancelClock"+taskid+"' class='cancelClock' type='button'>取消</button></dl>").append(
				         "	<div class='dealTask_left'><span id='updateComment"+taskid+"' style='display:none;margin-left: 325px;'> <textarea class='commentClass' id='commentClass"+taskid+"' name='textarea' rows='10' cols='20' style='margin-bottom:-10px;overflow-y:hidden;height:80px;'>升级极速内核到21.0；全新默认界面；新增小窗口播放功能</textarea><button id='confirmComment"+taskid+"' class='confirmComment'  type='button'>添加</button><button id='cancelComment"+taskid+"' class='cancelComment' type='button'>取消</button>	</span>	<span id='detailComment"+taskid+"'></span><a href='#' id='editComment"+taskid+"' class='editComment' style='margin-left:5px;'>编辑备注</a></div>");				
 				         document.getElementById("detailComment"+taskid).innerHTML=content;	
			             			            jq("#editComment"+taskid).css("visibility","hidden");
			jq("#edit"+taskid).toggle();
			jq("#clockSet"+taskid).toggle();
			jq("#"+taskid).attr("state","1");
			jq("#completeIcon" + taskid).css("background", "url(images/icon08.png)");
			jq("#confirmCompleted" + taskid).html("恢复为未完成");
			jq("#event"+taskid).css("color","#ccc");
			jq("#detailComment"+taskid).css("color","#ccc");	
			jq("#clockIcon" + taskid).attr("src", "images/icon07.png");			
                        if(time){
				               var arr=time.split(" ")[1].split(":");
                               clock=arr[0]+":"+arr[1];						
				   		 	   document.getElementById('clockDisplay'+taskid).innerHTML=clock;
							   if(clock!="00:00"){
		                       jq("#clockIcon"+taskid).attr("src","images/icon02.png");
		                       jq("#clockDisplay"+taskid).css("visibility","visible");
							   }
			         	}							 
				        }
						for(var i=0;i<rt['data']['futuredata'].length;i++){
						  taskid=rt['data']['futuredata'][i]['id'];
						  title=rt['data']['futuredata'][i]['title'];
						  time=rt['data']['futuredata'][i]['remindtimestamp'];						  
						  console.log(taskid+title);
						  jq("#future").append("<li id='"+taskid+"'+ state='0' onmouseover='showBlock(this.id)' onmouseout='showNone(this.id)'></li>");
					      jq("#"+taskid).append(" <div class='completeIcon' id='completeIcon"+taskid+"'></div>").append("<h3 id='clockDisplay"+taskid+"' style='visibility:hidden;'>00:00</h3>").append(
				         "<div class='inline'><img id='clockIcon"+taskid+"' src='images/icon07.png'></div>").append("<dl><dt><input class='eventClass  eventClass"+taskid+"' id='event"+taskid+"' type='text' value='"+title+"' readonly='readonly' /></dt></dl>").append("<dl class='dealTask_right' id='editTask"+taskid+"'><img id='edit"+taskid+"' class='edit' title='编辑任务' src='images/icon03.png'> <img id='clockSet"+taskid+"' class='clockSet' title='添加提醒' src='images/icon02.png'> <span id='timeselect"+taskid+"'></span><img id='deleteTask"+taskid+"' class='deleteTask' title='删除' src='images/icon04.png'> <a href='#' class='confirmCompleted' id='confirmCompleted"+taskid+"'>标记完成</a><button id='confirmTask"+taskid+"' class='confirmTask' type='button'>确定</button><button id='cancelTask"+taskid+"' class='cancelTask' type='button'>取消</button><button id='confirmClock"+taskid+"' class='confirmClock' type='button'>确定</button><button id='cancelClock"+taskid+"' class='cancelClock' type='button'>取消</button></dl>").append(
				         "	<div class='dealTask_left'><span class='editComment'  id='updateComment"+taskid+"' style='display:none;margin-left: 325px;'> <textarea class='commentClass' id='commentClass"+taskid+"' name='textarea' rows='10' cols='20' style='margin-bottom:-10px;overflow-y:hidden;height:80px;'>升级极速内核到21.0；全新默认界面；新增小窗口播放功能</textarea><button id='confirmComment"+taskid+"' class='confirmComment'  type='button'>添加</button><button id='cancelComment"+taskid+"' class='cancelComment' type='button'>取消</button>	</span>	<span id='detailComment"+taskid+"'></span><a href='#' id='editComment"+taskid+"' class='editComment' style='margin-left:5px;'>编辑备注</a></div>");				
 				         document.getElementById("detailComment"+taskid).innerHTML=content;		
                         if(time){
				               var arr=time.split(" ")[1].split(":");
                               clock=arr[0]+":"+arr[1];						
				   		 	   document.getElementById('clockDisplay'+taskid).innerHTML=clock;
							   if(clock!="00:00"){
		                       jq("#clockIcon"+taskid).attr("src","images/icon02.png");
		                       jq("#clockDisplay"+taskid).css("visibility","visible");
							   }
			         	}							 
				        }
					}
			   });
}

function getCompleteThing(){
               var paras={};
			   paras.uid=1;
			   paras.dowhat="getfinishedtasks";
               paras=JSON.stringify(paras);
		       para={"jsonstring":paras};
			   console.log(para);
     		   jq.post("../Event.DB.php", 
			           para,
		              function(rt) {
					  rt=eval("("+rt+")");
					  console.log(rt['data']);
					  console.log(rt);
				      if(rt.code==1){				
				         for(var i=0;i<rt['data'].length;i++){
						  taskid=rt['data'][i]['id'];
						  title=rt['data'][i]['title'];
						  content=rt['data'][i]['content'];
						  console.log(taskid+title);
						 jq("#complete").append("<li id='"+taskid+"'+ state='0' onmouseover='showBlock(this.id)' onmouseout='showNone(this.id)'></li>");
					     jq("#"+taskid).append(" <div class='completeIcon' id='completeIcon"+taskid+"'></div>").append("<h3 id='clockDisplay"+taskid+"' style='visibility:hidden;'>00:00</h3>").append(
				         "<div class='inline'><img id='clockIcon"+taskid+"' src='images/icon07.png'></div>").append("<dl><dt><input class='eventClass  eventClass"+taskid+"' id='event"+taskid+"' type='text' value='"+title+"' readonly='readonly' /></dt></dl>").append(
				         "	<div class='dealTask_left'><span id='detailComment"+taskid+"'></span></div>");				
 				         document.getElementById("detailComment"+taskid).innerHTML=content;				 
				        }
					}
			   });
}


/*when the mouse moves away*/
function showNone(id){
		jq('#editComment'+id).hide();
		jq('#detailComment'+id).show();
		document.getElementById('editTask'+id).style.visibility = "hidden";
}
	
/*when the mouse comes*/
function showBlock(id){
		document.getElementById('editTask'+id).style.visibility = "visible";
		jq("#editComment"+id).show();		
}

	/*the no completed task*/   
function noCompleteThing(){
               var paras={};
			   paras.uid=1;
			   paras.dowhat="nocompletething";
               paras=JSON.stringify(paras);
		       para={"jsonstring":paras};	
     		   jq.post("../Event.DB.php", 
			           para,
		              function(rt) {
					  console.log(rt);						  
					  rt=eval("("+rt+")");	
					  console.log(typeof(rt));					  
				      if(rt.code==1){
				      document.getElementById("noCompleteThing").innerHTML=rt.count;
				   }
			   });
}
function mainFunction(){
    /*the slide effect*/
	if(!jq(".history").length){
		return;
	}
	var jqwarpEle = jq(".history-date"),
	    jqwarpEle0 = jq(".today"),
	    jqwarpEle1 = jq(".other"),		
		jqtargetA = jqwarpEle.find("h2 a,ul li dl dt a"),
		parentH,
		eleTop = [];
	
	parentH = jqwarpEle0.parent().height();
	jqwarpEle0.parent().css({"height":59});
	
	jqwarpEle1.find("ul li").css({"display":"none"});
	
	setTimeout(function(){
		
		jqwarpEle0.find("ul").children(":not('h2:first')").each(function(idx){
			eleTop.push(jq(this).position().top);
			jq(this).css({"margin-top":-eleTop[idx]}).children().hide();
		}).animate({"margin-top":0}, 1600).children().fadeIn();

		jqwarpEle0.parent().animate({"height":parentH}, 2600);

		jqwarpEle0.find("ul").children(":not('h2:first')").addClass("bounceInDown").css({"-webkit-animation-duration":"2s","-webkit-animation-delay":"0","-webkit-animation-timing-function":"ease","-webkit-animation-fill-mode":"both"}).end().children("h2").css({"position":"relative"});
		
	});

	jqtargetA.click(function(){
		jq(this).parent().css({"position":"relative"});
		jq(this).parent().siblings().slideToggle();
		jqwarpEle.parent().removeAttr("style");
		return false;
	});

	/* login action*/
    jq("#login").click(function(){
	    document.getElementById("loginError").innerHTML="";
		jq(".registerDiv").hide();	
		jq(".loginDiv").slideToggle("slow");	
    });
	/* login function*/	
	jq("#loginsubmit").live('click',function(){
	    document.getElementById("loginError").innerHTML="";
		var uname=jq("#uname").val();	
		var passwd=jq("#passwd").val();
		var passwd=hex_sha1(passwd);	
		var uid;
		var paras = {};
			paras.username = uname;
			paras.password = passwd;
			paras.logway   = '1';
			paras.dowhat = 'login';
			paras = JSON.stringify(paras);
			para = {
				"jsonstring": paras
			};
			console.log(paras);
			if(uname&&passwd){
			  if(jq("input:checked").length > 0){
			   setCookie("uname",uname,30);
			   console.log(uname);
			   setCookie("passwd",jq("#passwd").val(),30);
			   }
			jq.post("../Event.DB.php",
				para,
				function(rt) {
				data=eval("("+rt+")");				
				   if(data.code==0){				  
				      setCookie("uid",data.uid,30);
				      document.getElementById("login").innerHTML=uname;
					  document.getElementById("register").innerHTML="退出";
					  document.getElementById("register").id="logout";
					  jq(".loginDiv").hide(500);
				   }
				   else{
		               document.getElementById("loginError").innerHTML=data.message;				     
				   }
				});
            }
    });
	
	jq("#logout").live('click',function(){	
	        var paras = {};
			paras.username = getCookie("uname");
			console.log(paras.username);
			paras.logway   = '1';
			paras.dowhat = 'logout';
			paras = JSON.stringify(paras);
			para = {
				"jsonstring": paras
			};
				jq.post("../Event.DB.php",
				para,
				function(rt) {
				   data=eval("("+rt+")");	
				   deleteCookie("uid");
				   if(data.code==0){
				      document.getElementById("login").innerHTML="登录";
					  document.getElementById("logout").innerHTML="注册";
					  document.getElementById("logout").id="register";
					  jq(".loginDiv").hide(500);
				   }
				   else{
		               jq("#loginError").innerHTML=data.message;				     
				   }
				});
			location.reload();
    });	
	/* register action*/
    jq("#register").click(function(){
	document.getElementById("registerError").innerHTML="";
		jq(".loginDiv").hide();
		jq(".registerDiv").slideToggle("slow");
    });	
	/* register function*/
	jq("#registersumbit").live('click',function(){
		document.getElementById("registerError").innerHTML="";
		var uname=jq("#unameRegister").val();
		var passwd=jq("#passwdRegister").val();		
        var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
        if(!reg.test(uname)){
		  document.getElementById("registerError").innerHTML="请输入正确的邮箱";
		}
		else{
		  var reg = /[a-zA-Z0-9!@#$%^&*()_+~<>?]{6,16}/;
		  if(!reg.test(passwd)) {
		   document.getElementById("registerError").innerHTML="密码格式不正确";
		  }
        else{
		var passwdagain=jq("#passwdagain").val();
	 	if(passwd!=passwdagain){
		   document.getElementById("registerError").innerHTML="两次输入的密码不一致";
		}
		else{	
		    var paras = {};
			paras.username = uname;
			paras.email=uname;
			paras.password = hex_sha1(passwd);;
			paras.dowhat = 'register';
			paras = JSON.stringify(paras);
			para = {
				"jsonstring": paras
			};
			console.log(paras);
			jq.post("../User.DB.php",
				para,
				function(data) {
				console.log(data);
				   data=eval("("+data+")");
				   if(data.code==0){
					  jq(".registerDiv").hide(500);
				   }
				   else{
				      document.getElementById("registerError").innerHTML=data.message;   
				   }
				});
				}
		}
		}
    });
	
	/*close the login and register div*/
	jq(".close").click(function(){
		jq(".loginDiv").hide(500);
		jq(".registerDiv").hide(500);
    });	
    jq("#setting").click(function(){
		jq(".loginDiv").slideToggle("slow");
    });
	
	jq("#addTask").click(function(){
	     jq(".listThing").toggle();
		 jq(".newTask").slideToggle(); 
	})
	/*set the clock when the task is created*/   
    jq("#clockSet").click(function(){
	     jq("#timepicker").show();
		 jq("#clockSet").hide();
		 jq("#confirmCreateTask").hide();
		 jq("#cancelCreateTask").hide();
		 jq("#confirmSetClock").show();
		 jq("#cancelSetClock").show();
    })
    jq("#confirmSetClock").click(function(){
	    if(jq("#timepicker").val()=="")
		{
		 document.getElementById("errorInfo").innerHTML="请选择要设置的闹钟时间";
		}
		else{
		 document.getElementById("errorInfo").innerHTML="";
		 jq("#timepicker").hide();
		 jq("#clockSet").show();
		 jq("#confirmCreateTask").show();
		 jq("#cancelCreateTask").show();
		 jq("#confirmSetClock").hide();
		 jq("#cancelSetClock").hide();
		}
	})
	jq("#cancelSetClock").click(function(){
	     document.getElementById("errorInfo").innerHTML="";
		 jq("#timepicker").hide();
		 jq("#clockSet").show();
		 jq("#confirmCreateTask").show();
		 jq("#cancelCreateTask").show();
		 jq("#confirmSetClock").hide();
		 jq("#cancelSetClock").hide();
		 document.getElementById("timepicker").value="";
	})
	
	jq("#addTaskFuture").click(function(){
		 jq(".newTaskFuture").slideToggle(); 
	})
	/*set the clock when the task is created*/   
    jq("#clockSetFuture").click(function(){
	     jq("#timepickerFuture").show();
		 jq("#clockSetFuture").hide();
		 jq("#confirmCreateTaskFuture").hide();
		 jq("#cancelCreateTaskFuture").hide();
		 jq("#confirmSetClockFuture").show();
		 jq("#cancelSetClockFuture").show();
    })
    jq("#confirmSetClockFuture").click(function(){
	    if(jq("#timepickerFuture").val()=="")
		{
		 document.getElementById("errorInfoFuture").innerHTML="请选择要设置的闹钟时间";
		}
		else{
		 document.getElementById("errorInfoFuture").innerHTML="";
		 jq("#timepickerFuture").hide();
		 jq("#clockSetFuture").show();
		 jq("#confirmCreateTaskFuture").show();
		 jq("#cancelCreateTaskFuture").show();
		 jq("#confirmSetClockFuture").hide();
		 jq("#cancelSetClockFuture").hide();
		}
	})
	jq("#cancelSetClockFuture").click(function(){
	     document.getElementById("errorInfoFuture").innerHTML="";
		 jq("#timepickerFuture").hide();
		 jq("#clockSetFuture").show();
		 jq("#confirmCreateTaskFuture").show();
		 jq("#cancelCreateTaskFuture").show();
		 jq("#confirmSetClockFuture").hide();
		 jq("#cancelSetClockFuture").hide();
		 document.getElementById("timepicker").value="";
	})
	
	
	/*create the task*/   	
    jq("#confirmCreateTask").live('click',function(){	
        if(!getCookie("uid")){
		    jq(".loginDiv").hide();
		    jq(".registerDiv").hide();	
		    jq(".remindDiv").slideToggle("slow");
		    document.getElementById("remindDiv").innerHTML="您还没有登录，登录后才能使用！";
		}	
		else{
	            var paras = {};
				var title = jq("#text").val();
				if(title.replace(" ","")==""){
				 document.getElementById("textError").innerHTML="添加事件内容不能为空";
				}
				else{
				document.getElementById("textError").innerHTML="";
				var time = jq("#timepicker").val();
				var date = new Date();
				
                paras.title = title;
				
				tmp=date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
				paras.date=tmp;
				paras.createtime = tmp+' '+date.getHours()+':'+date.getMinutes();
				paras.dowhat="createtask";
				paras.androiddbid=0;
				paras.userid= getCookie("uid");
				paras.content="";
				paras.edittimestamp = tmp+' '+date.getHours()+':'+date.getMinutes();
				paras.remindtimestamp = time;
		        paras=JSON.stringify(paras);
		        para={"jsonstring":paras};		 
		        console.log(paras);
		        jq.post("../Event.DB.php", 
		                para,
		                function(data) {
						console.log(data);
						rt=eval("(" + data + ")");
						if(rt.code==1){
						
        			    jq("#today h2").after("<li id='"+rt.taskid+"'+ state='0' onmouseover='showBlock(this.id)' onmouseout='showNone(this.id)'></li>");
					    jq("#"+rt.taskid).append(" <div class='completeIcon' id='completeIcon"+rt.taskid+"'></div>").append("<h3 id='clockDisplay"+rt.taskid+"' style='visibility:hidden;'>00:00</h3>").append(
				         "<div class='inline'><img id='clockIcon"+rt.taskid+"' src='images/icon07.png'></div>").append("<dl><dt><input class='eventClass  eventClass"+rt.taskid+"' id='event"+rt.taskid+"' type='text' value='"+title+"' readonly='readonly' /></dt></dl>").append("<dl class='dealTask_right' id='editTask"+rt.taskid+"'><img id='edit"+rt.taskid+"' class='edit' title='编辑任务' src='images/icon03.png'> <img id='clockSet"+rt.taskid+"' class='clockSet' title='添加提醒' src='images/icon02.png'> <span id='timeselect"+rt.taskid+"'></span><img id='deleteTask"+rt.taskid+"' class='deleteTask' title='删除' src='images/icon04.png'> <a href='#' class='confirmCompleted' id='confirmCompleted"+rt.taskid+"'>标记完成</a><button id='confirmTask"+rt.taskid+"' class='confirmTask' type='button'>确定</button><button id='cancelTask"+rt.taskid+"' class='cancelTask' type='button'>取消</button><button id='confirmClock"+rt.taskid+"' class='confirmClock' type='button'>确定</button><button id='cancelClock"+rt.taskid+"' class='cancelClock' type='button'>取消</button></dl>").append(
				         "	<div class='dealTask_left'><span id='updateComment"+rt.taskid+"' style='display:none;margin-left: 325px;'> <textarea class='commentClass' id='commentClass"+rt.taskid+"' name='textarea' rows='10' cols='20' style='margin-bottom:-10px;overflow-y:hidden;height:80px;'></textarea><button id='confirmComment"+rt.taskid+"' class='confirmComment'  type='button'>添加</button><button id='cancelComment"+rt.taskid+"' class='cancelComment' type='button'>取消</button>	</span>	<span id='detailComment"+rt.taskid+"'></span><a href='#' id='editComment"+rt.taskid+"' class='editComment' style='margin-left:5px;'>编辑备注</a></div>");				
 				         document.getElementById("detailComment"+rt.taskid).innerHTML=content;				
                         jq(".listThing").toggle();
		                 jq(".newTask").toggle(500); 
				         if(time){
				
				   		 	   document.getElementById('clockDisplay'+rt.taskid).innerHTML=jq("#timepicker").val();
		                       jq("#clockIcon"+rt.taskid).attr("src","images/icon02.png");
		                       jq("#clockDisplay"+rt.taskid).css("visibility","visible");
			         	}	
                        }
									});    
				  	  /* rt={"taskid":"05","title":"升级极速内核到19.0","content":"升级极速内核到21.0；全新默认界面；新增小窗口播放功能"};
                    jq("#today").append("<li id='"+rt.taskid+"'+ state='0' onmouseover='showBlock(this.id)' onmouseout='showNone(this.id)'></li>");
					jq("#"+rt.taskid).append(" <div class='completeIcon' id='completeIcon"+rt.taskid+"'></div>").append("<h3 id='clockDisplay"+rt.taskid+"' style='visibility:hidden;'>00:00</h3>").append(
				         "<div class='inline'><img id='clockIcon"+rt.taskid+"' src='images/icon07.png'></div>").append("<dl><dt><input class='eventClass  eventClass"+rt.taskid+"' id='event"+rt.taskid+"' type='text' value='"+title+"' readonly='readonly' /></dt></dl>").append("<dl class='dealTask_right' id='editTask"+rt.taskid+"'><img id='edit"+rt.taskid+"' class='edit' title='编辑任务' src='images/icon03.png'> <img id='clockSet"+rt.taskid+"' class='clockSet' title='添加提醒' src='images/icon02.png'> <span id='timeselect"+rt.taskid+"'></span><img id='deleteTask"+rt.taskid+"' class='deleteTask' title='删除' src='images/icon04.png'> <a href='#' class='confirmCompleted' id='confirmCompleted"+rt.taskid+"'>标记完成</a><button id='confirmTask"+rt.taskid+"' class='confirmTask' type='button'>确定</button><button id='cancelTask"+rt.taskid+"' class='cancelTask' type='button'>取消</button><button id='confirmClock"+rt.taskid+"' class='confirmClock' type='button'>确定</button><button id='cancelClock"+rt.taskid+"' class='cancelClock' type='button'>取消</button></dl>").append(
				         "	<div class='dealTask_left'><span class='editComment'  id='updateComment"+rt.taskid+"' style='display:none;margin-left: 325px;'> <textarea class='commentClass' id='commentClass"+rt.taskid+"' name='textarea' rows='10' cols='20' style='margin-bottom:-10px;overflow-y:hidden;height:80px;'>升级极速内核到21.0；全新默认界面；新增小窗口播放功能</textarea><button id='confirmComment"+rt.taskid+"' class='confirmComment'  type='button'>添加</button><button id='cancelComment"+rt.taskid+"' class='cancelComment' type='button'>取消</button>	</span>	<span id='detailComment"+rt.taskid+"'></span><a href='#' id='editComment"+rt.taskid+"' class='editComment' style='margin-left:5px;'>编辑备注</a></div>");				
 				         //document.getElementById("detailComment"+rt.taskid).innerHTML=rt.content;				
                         jq(".listThing").toggle();
		                 jq(".newTask").toggle(500); 
				         if(paras.time){
				   		 	   document.getElementById('clockDisplay'+rt.taskid).innerHTML=jq("#timepicker").val();
		                       jq("#clockIcon"+rt.taskid).attr("src","images/icon02.png");
		                       jq("#clockDisplay"+rt.taskid).css("visibility","visible");
			         	} */ 
			}
			}
				})				
    /*cancel the creating of the task*/   	
	jq("#cancelCreateTask").live('click',function(){
		 document.getElementById("text").value="";
		 document.getElementById("textError").innerHTML="";
		 jq(".newTask").toggle(500); 
		 jq(".listThing").show();
	})
	
	jq("#confirmCreateTaskFuture").click(function(){		
	            var paras = {};
				var title = jq("#textFuture").val();
				if(title.replace(" ","")==""){
				 document.getElementById("textError").innerHTML="添加事件内容不能为空";
				}
				else{
				document.getElementById("textError").innerHTML="";
				var time = jq("#timepickerFuture").val();
				var date = new Date();
				
                paras.title = title;
				
				tmp=date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
				paras.date=jq("#dateFuture").val();
				paras.createtime = tmp+' '+date.getHours()+':'+date.getMinutes();
				paras.dowhat="createtask";
				paras.androiddbid=0;
				paras.userid=1;
				paras.content="";
				paras.edittimestamp = tmp+' '+date.getHours()+':'+date.getMinutes();
				paras.remindtimestamp = time;
		        paras=JSON.stringify(paras);
		        para={"jsonstring":paras};		 
		        console.log(paras);
		        jq.post("../Event.DB.php", 
		                para,
		                function(data) {
						rt=eval("(" + data + ")");
						console.log(typeof(data));
						console.log("data:"+data);
						console.log(typeof(rt));
						console.log(rt.code);
						if(rt.code==1){console.log(title);
        			    jq("#future h2").after("<li id='"+rt.taskid+"'+ state='0' onmouseover='showBlock(this.id)' onmouseout='showNone(this.id)'></li>");
					    jq("#"+rt.taskid).append(" <div class='completeIcon' id='completeIcon"+rt.taskid+"'></div>").append("<h3 id='clockDisplay"+rt.taskid+"' style='visibility:hidden;'>00:00</h3>").append(
				         "<div class='inline'><img id='clockIcon"+rt.taskid+"' src='images/icon07.png'></div>").append("<dl><dt><input class='eventClass  eventClass"+rt.taskid+"' id='event"+rt.taskid+"' type='text' value='"+title+"' readonly='readonly' /></dt></dl>").append("<dl class='dealTask_right' id='editTask"+rt.taskid+"'><img id='edit"+rt.taskid+"' class='edit' title='编辑任务' src='images/icon03.png'> <img id='clockSet"+rt.taskid+"' class='clockSet' title='添加提醒' src='images/icon02.png'> <span id='timeselect"+rt.taskid+"'></span><img id='deleteTask"+rt.taskid+"' class='deleteTask' title='删除' src='images/icon04.png'> <a href='#' class='confirmCompleted' id='confirmCompleted"+rt.taskid+"'>标记完成</a><button id='confirmTask"+rt.taskid+"' class='confirmTask' type='button'>确定</button><button id='cancelTask"+rt.taskid+"' class='cancelTask' type='button'>取消</button><button id='confirmClock"+rt.taskid+"' class='confirmClock' type='button'>确定</button><button id='cancelClock"+rt.taskid+"' class='cancelClock' type='button'>取消</button></dl>").append(
				         "	<div class='dealTask_left'><span id='updateComment"+rt.taskid+"' style='display:none;margin-left: 325px;'> <textarea class='commentClass' id='commentClass"+rt.taskid+"' name='textarea' rows='10' cols='20' style='margin-bottom:-10px;overflow-y:hidden;height:80px;'></textarea><button id='confirmComment"+rt.taskid+"' class='confirmComment'  type='button'>添加</button><button id='cancelComment"+rt.taskid+"' class='cancelComment' type='button'>取消</button>	</span>	<span id='detailComment"+rt.taskid+"'></span><a href='#' id='editComment"+rt.taskid+"' class='editComment' style='margin-left:5px;'>编辑备注</a></div>");				
 				         //document.getElementById("detailComment"+rt.taskid).innerHTML=rt.content;				
                         jq(".listThingFuture").toggle();
		                 jq(".newTaskFuture").toggle(500); 
				         if(time){
				   		 	   document.getElementById('clockDisplay'+rt.taskid).innerHTML=jq("#timepickerFuture").val();
		                       jq("#clockIcon"+rt.taskid).attr("src","images/icon02.png");
		                       jq("#clockDisplay"+rt.taskid).css("visibility","visible");
			         	}	
                        }
									});   

				
				console.log(paras);           
				}
				})				
    /*cancel the creating of the task*/   	
	jq("#cancelCreateTaskFuture").click(function(){
	     document.getElementById("textError").innerHTML="";
		 document.getElementById("textFuture").value="";
		 jq(".newTaskFuture").toggle(500); 
	})
	bindAllEvent();
}


/*the action of every thing*/
//绑定各种事件
function bindAllEvent() {
	//编辑任务 
	jq(".edit").live('click',function() {
		var id = (jq(this).attr("id")).replace(/[^0-9]+/ig, "");
		title = jq("#event" + id).val();
		jq("#event" + id).removeAttr("readonly");
		jq(".eventClass" + id).css("border", "1px solid #B0E2FF");
		jq(".dealTask_right img,.dealTask_right a").toggle();
		jq("#confirmTask" + id).toggle();
		jq("#cancelTask" + id).toggle();
	});


	//确认编辑完成 
	jq(".confirmTask").live('click',function() {
		var id = (jq(this).attr("id")).replace(/[^0-9]+/ig, "");
		var paras = {};
		var title = jq("#event" + id).val();
		var date = new Date();
		var modifytime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
		paras.title = title;
		paras.edittimestamp = modifytime;
		paras.id = id;
		paras.dowhat = 'modifytask';
		paras = JSON.stringify(paras);
		para = {
			"jsonstring": paras
		};
		console.log(paras);
		//通信 
		jq.post("../Event.DB.php",
			para,
			function(data) {
			});

		jq("#event" + id).attr("readonly", "readonly");
		jq(".eventClass" + id).css("border", "0");
		jq(".dealTask_right img").toggle();
		jq("#confirmCompleted" + id).toggle()
		jq("#confirmTask"+id).toggle();
		jq("#cancelTask"+id).toggle();

	});

	//取消编辑任务
	jq(".cancelTask").live('click',function() {

		var id = (jq(this).attr("id")).replace(/[^0-9]+/ig, "");
		jq("event" + id).value = title;
		jq("event" + id).attr("readOnly", "readonly");
		jq(".eventClass" + id).css("border", "0");
		jq(".dealTask_right img").toggle();
		jq("#confirmCompleted" + id).toggle();
		jq("#confirmTask"+id).toggle();
		jq("#cancelTask"+id).toggle();
	});

	//编辑备注 
	jq(".editComment").live('click',function(){	
	     var id = (jq(this).attr("id")).replace(/[^0-9]+/ig, "");
	     document.getElementById('detailComment'+id).style.visibility = "hidden";
	     document.getElementById('editComment'+id).style.visibility = "hidden";
		 document.getElementById('updateComment'+id).style.display = "inline";
	})
	jq(".confirmComment").live('click',function(){
		 var id = (jq(this).attr("id")).replace(/[^0-9]+/ig, "");
		 jq("#updateComment"+id).toggle();
		 document.getElementById('editComment'+id).style.visibility = "visible";
	     document.getElementById('detailComment'+id).innerHTML=jq("#commentClass"+id).val();
		 document.getElementById('detailComment'+id).style.visibility = "visible";
		 document.getElementById('editComment'+id).style.display = "inline";
	})
	jq(".cancelComment").live('click',function(){
	     var id = (jq(this).attr("id")).replace(/[^0-9]+/ig, "");
		 document.getElementById('editComment'+id).style.visibility = "visible";
	     jq("#updateComment"+id).hide();
	     document.getElementById('detailComment'+id).style.visibility = "visible";
		 document.getElementById('editComment'+id).style.display = "inline";
	})

	//添加提醒
	jq(".clockSet").live('click',function() {
		var id = (jq(this).attr("id")).replace(/[^0-9]+/ig, "");
		jq("#edit" + id).toggle();
		jq("#deleteTask" + id).toggle();
		jq("#confirmCompleted" + id).toggle();
		jq("#confirmClock").toggle();
		jq("#cancelClock").toggle();

		var date = new Date();
		var hour = date.getHours();
		var minute = date.getMinutes();
		document.getElementById("timeselect"+id).innerHTML="";
		var options = '<select id="hourselect" name="hourselect">';
		for (var i = 1; i < 24; i++) {
			if(i == hour){
				options += '<option value="' + i + '" selected="selected">' + i + '</option>';				
			}else{
				options += '<option value="' + i + '">' + i + '</option>';				
			}
		}
		options += '</select>点<select id="minuteselect" name="minuteselect">';

		for (var i = 0; i < 59; i++) {
			if(i == minute){
					options += '<option value="' + i + '" selected="selected">' + i + '</option>';				
				}else{
					options += '<option value="' + i + '">' + i + '</option>';				
				}
			}
		options += '</select>分';
		console.log(options);
		jq("#timeselect"+id).append(options).show();
				jq("#confirmClock"+id).toggle();
		jq("#cancelClock"+id).toggle();
	});


	//确认编辑提醒
	jq(".confirmClock").live('click',function() {
		var id = (jq(this).attr("id")).replace(/[^0-9]+/ig, "");
		//console.log(jq("#timepicker" + id).val());
		var paras = {};
		var date = new Date();
		hourselect = jq("#hourselect").val();
		minuteselect =jq("#minuteselect").val();

		var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + hourselect + ':' + minuteselect;
		var modifytime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ":" + date.getSeconds();
		paras.remindtimestamp = time;
		paras.edittimestamp = modifytime;
		paras.id = id;
		paras.dowhat = 'modifytask';
		paras = JSON.stringify(paras);
		para = {
			"jsonstring": paras
		};
		console.log(paras);
		jq.post("../Event.DB.php",
			para,
			function(data) {
			});
		jq("#clockIcon" + id).attr("src", "images/icon02.png");
		jq("#clockDisplay" + id).css("visibility", "visible");
		document.getElementById("clockDisplay" + id).innerHTML=hourselect+":"+minuteselect;
 		//jq("#timepicker" + id).toggle();
		jq("#timeselect"+id).toggle();
		jq("#edit" + id).toggle();
		jq("#deleteTask" + id).toggle();
		jq("#confirmCompleted" + id).toggle();
		jq("#confirmClock" + id).toggle();
		jq("#cancelClock" + id).toggle();
	});

	//取消编辑提醒
	jq(".cancelClock").live('click',function() {
		var id = (jq(this).attr("id")).replace(/[^0-9]+/ig, "");
		//jq("#timepicker" + id).hide();
		jq("#timeselect"+id).toggle();
		jq("#edit" + id).toggle();
		jq("#deleteTask" + id).toggle();
		jq("#confirmClock" + id).toggle();
		jq("#cancelClock" + id).toggle();
		jq("#confirmCompleted" + id).toggle();
	});

	//标记完成
	jq(".confirmCompleted").live('click', function() {

		var id = (jq(this).attr("id")).replace(/[^0-9]+/ig, "");
		//如果当前未完成状态
		if (jq("#"+id).attr("state")==0) {
            jq("#editComment"+id).css("visibility","hidden");
			jq("#edit"+id).toggle();
			jq("#clockSet"+id).toggle();
			jq("#"+id).attr("state","1");
			jq("#completeIcon" + id).css("background", "url(images/icon08.png)");
			jq("#confirmCompleted" + id).html("恢复为未完成");
			jq("#event"+id).css("color","#ccc");
			jq("#detailComment"+id).css("color","#ccc");
			jq("#clockIcon" + id).attr("src", "images/icon07.png");
			var obj=jq("#"+id).html();
			jq("#"+id).remove();
		    jq("#today").append("<li id='"+id+"' state='1' onmouseover='showBlock(this.id)' onmouseout='showNone(this.id)'>");
			jq("#"+id).append(obj);
			var paras = {};
			paras.id = id;
			paras.dowhat = 'finishtask';
			paras = JSON.stringify(paras);
			para = {
				"jsonstring": paras
			};
			console.log(paras);
			jq.post("../Event.DB.php",
				para,
				function(data) {});

		//如果当前状态为已完成
		}else if (jq("#"+id).attr("state")==1) {
		    jq("#editComment"+id).css("visibility","visible");
			jq("#edit"+id).toggle();
			jq("#clockSet"+id).toggle();
			jq("#"+id).attr("state","0");
			jq("#completeIcon" + id).css("background", "#ffffff");
			jq("#confirmCompleted" + id).html("标记完成");
			jq("#event"+id).css("color","#000");
			jq("#detailComment"+id).css("color","#888");
			var paras = {};
			paras.id = id;
			paras.dowhat = 'recoverfinishedtask';
			paras = JSON.stringify(paras);
			para = {
				"jsonstring": paras
			};
			console.log(paras);
			jq.post("../Event.DB.php",
				para,
				function(data) {});
		}else{

			alert("对不起亲爱的，我的程序有问题了,呜呜呜...");
		}

	});

	//删除任务
	jq(".deleteTask").live('click',function() {
		
		var id = (jq(this).attr("id")).replace(/[^0-9]+/ig, "");
		
		//给服务器传参
		var paras = {};
		paras.id = id;
		paras.dowhat = 'deletetask';
		paras = JSON.stringify(paras);
		para = {
			"jsonstring": paras
		};
		console.log(paras);
		jq.post("../Event.DB.php",
			para,
			function(data) {
                rt=eval("(" + data + ")");
				if (rt.code=1) {
					jq("#" + id).remove();
				}
			});
	});

};