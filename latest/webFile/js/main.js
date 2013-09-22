/*resolve the conflict of jquery and protype*/
var jq = jQuery.noConflict();
var tag = 0;
//store the before title of updating
var titleBack;
//存储所有的闹钟
var titleValue={};
var clock = new Array();

jq(function() {
	mainFunction();
	var userName = getCookie("uname");
	var userPass = getCookie("passwd");
	var uid = getCookie("uid");
	if (userName != "" && userPass != "" && uid != "" && userName != null && userPass != null && uid != null) {
		document.getElementById("login").innerHTML = userName;
		document.getElementById("register").innerHTML = "退出";
		document.getElementById("register").id = "logout";
		login(userName, userPass, true);
		/*geteventlist();
		noCompleteThing();
		getCompleteThing();
		schduletask();
		getbeforeclock();*/
	}

});

//setTimeout(function(){
//	getafterclock();
//	setTimeout(arguments.callee, 500);
//},500);
setInterval("getafterclock()", 500);
//getafterclock();
function getbeforeclock() {
	var paras = {};
	paras.uid = getCookie("uid");
	paras.dowhat = 'addknocktasks';
	paras = JSON.stringify(paras);
	para = {
		"jsonstring": paras
	};
	jq.post("../Event.DB.php", para, function(data) {
		data = eval("(" + data + ")");
		var beforeclock = data['data']['before'];
		if (beforeclock.length > 0) {
			document.getElementById("clockDiv").innerHTML = "亲爱的,您的以下事件已经过了提醒时间了:<br/>";
			console.log(beforeclock);
			console.log(beforeclock.length);
			console.log(beforeclock[0]);
			if (beforeclock.length == 1) {
				document.getElementById("clockDiv").innerHTML += beforeclock[0].title + '<br/>';
				modifyTime(beforeclock[0].id);
			}
			else {
				document.getElementById("clockDiv").innerHTML += '<ul>';
				for (var i = 0; i < beforeclock.length; i++) {
					
					document.getElementById("clockDiv").innerHTML += '<li>'(i + 1) + ". " + beforeclock[i].title + '</li>';
					modifyTime(beforeclock[i].id);
				}
				document.getElementById("clockDiv").innerHTML += '</ul>';
			}
			jq(".loginDiv").hide();
			jq(".registerDiv").hide();
			jq(".remindDiv").hide();
			jq(".clockDiv").slideToggle("slow");
		}
	});
}

function getafterclock() {
	var paras = {};
	paras.uid = getCookie("uid");
	paras.dowhat = 'addknocktasks';
	paras = JSON.stringify(paras);
	para = {
		"jsonstring": paras
	};
	jq.post("../Event.DB.php", para, function(data) {
		data = eval("(" + data + ")");
		var afterclock = data['data']['after'];
		var arr = {};
		for (var i = 0; i < afterclock.length; i++) {
			var tmp = afterclock[i].remindtimestamp;
			if (typeof(arr[tmp]) == "undefined") {
				arr[tmp] = [afterclock[i].title, afterclock[i].id, 1];
			} else if (arr[tmp][2] == 1) {
				arr[tmp][2] += 1;
				arr[tmp][0] = "<li> 1. " + arr[tmp][0];
				arr[tmp][0] += ("</li><li> " + arr[tmp][2] + ". " + afterclock[i].title);
				arr[tmp][1] += "," + afterclock[i].id;
			}
			else {
				arr[tmp][2] += 1;
				arr[tmp][0] += ("</li><li> " + arr[tmp][2] + ". " + afterclock[i].title+"</li>");
				arr[tmp][1] += "," + afterclock[i].id;
			}
		}

		var startDate = new Date();
		for (var key in arr) { (function(key) {
			console.log(key);
				var allId = arr[key][1].split(",");
				var setClock;
				//setClock="clock"+allId[0];
				var endDate = new Date(key);
				var duration = endDate.getTime() - startDate.getTime();
				var clearId = allId[0];
				var title = arr[key][0];
				//var clock;
				//clearTimeout(clock[allId[0]]);
				setClock = function() {
					jq(".loginDiv").hide();
					jq(".registerDiv").hide();
					jq(".remindDiv").hide();
					jq(".clockDiv").show(500);
					document.getElementById("clockDiv").innerHTML = "亲爱的，到时间该做下面的事情了:<br/><ul> " + title + '</ul><br />';
					for (var j = 0; j < allId.length; j++) {
						modifyTime(allId[j]);
					}
				}
				clock[allId[0]] = setClock;
	setTimeout(setClock, duration);

				//setClock = clock;

			})(key);
		}

	});
}

function schduletask() {
	var paras = {};
	paras.uid = getCookie("uid");
	paras = JSON.stringify(paras);
	para = {
		"jsonstring": paras
	};
	jq.post("../SchduleTask.php", para, function(rt) {
		//		console.log(rt);
	})
}
function geteventlist() {
	var paras = {};
	paras.uid = getCookie("uid");
	//console.log("uidddddd>>>"+paras.uid);
	paras.dowhat = "gettodayandfuturetasks";
	paras = JSON.stringify(paras);
	para = {
		"jsonstring": paras
	};
	//console.log(para);
	jq.post("../Event.DB.php", para, function(rt) {
		rt = eval("(" + rt + ")");
		//console.log(rt['data']['todayfinishdata']);
		if (rt.code == 1) {
			for (var i = rt['data']['todaydata'].length - 1; i >= 0; i--) {
				taskid = rt['data']['todaydata'][i]['id'];
				title = rt['data']['todaydata'][i]['title'];
				title = stripstr(title);
				content = rt['data']['todaydata'][i]['content'];
				time = rt['data']['todaydata'][i]['remindtimestamp'];
				//console.log(taskid+title);
				jq("#today").append("<li id='" + taskid + "'+ state='0' onmouseover='showBlock(this.id)' onmouseout='showNone(this.id)'></li>");
				jq("#" + taskid).append(" <div class='completeIcon' id='completeIcon" + taskid + "'></div>").append("<h3 id='clockDisplay" + taskid + "' style='visibility:hidden;'>00:00</h3>").append("<div class='inline'><img id='clockIcon" + taskid + "' src='images/icon07.png'></div>").append("<dl><dt><input class='eventClass  eventClass" + taskid + "' id='event" + taskid + "' type='text' value='" + title + "' readonly='readonly' size='1' maxlength='20'/></dt></dl>").append("<dl class='dealTask_right' id='editTask" + taskid + "'><img id='edit" + taskid + "' class='edit' title='编辑任务' src='images/icon03.png'> <img id='clockSet" + taskid + "' class='clockSet' title='添加提醒' src='images/icon02.png'><input type='text' id='timepicker" + taskid + "' onclick='WdatePicker({dateFmt:\"HH:mm\"})' class='WdatePicker'/>  <img id='deleteTask" + taskid + "' class='deleteTask' title='删除' src='images/icon04.png'> <a href='javascript:void(0)' class='confirmCompleted' id='confirmCompleted" + taskid + "'>标记完成</a><button id='confirmTask" + taskid + "' class='confirmTask' type='button'>确定</button><button id='cancelTask" + taskid + "' class='cancelTask' type='button'>取消</button><button id='confirmClock" + taskid + "' class='confirmClock' type='button'>确定</button><button id='cancelClock" + taskid + "' class='cancelClock' type='button'>取消</button><span id='clockError" + taskid + "' class='clockError'></span></dl>").append("	<div class='dealTask_left'><span id='updateComment" + taskid + "' style='display:none;margin-left: 325px;'> <textarea class='commentClass' id='commentClass" + taskid + "' name='textarea' rows='10' cols='20' size='1' maxlength='140' placeholder='最多可以输入140字哦……' style='margin-bottom:-10px;overflow-y:hidden;height:80px;'></textarea><button id='confirmComment" + taskid + "' class='confirmComment'  type='button'>添加</button><button id='cancelComment" + taskid + "' class='cancelComment' type='button'>取消</button>	</span>	<pre id='detailComment" + taskid + "'  class='detailComment'></pre><p><a href='javascript:void(0)' id='editComment" + taskid + "' class='editComment' style='margin-left:5px;'>编辑备注</a></p></div>");
				document.getElementById("detailComment" + taskid).innerText = content;
				jq("#editComment" + taskid).css("visibility", "hidden");
				jq("#detailComment" + taskid).css("display", "inline");
				if (time) {
					var arr = time.split(" ")[1].split(":");
					clock = arr[0] + ":" + arr[1];
					document.getElementById('clockDisplay' + taskid).innerHTML = clock;
					if (clock != "00:00") {
						jq("#clockIcon" + taskid).attr("src", "images/icon02.png");
						jq("#clockDisplay" + taskid).css("visibility", "visible");
		                jq("#timepicker"+taskid).val(clock);
					}
				}
			}
			jq('.today').find('h2 a').addClass("rotate");

			for (var i = 0; i < rt['data']['todayfinishdata'].length; i++) {
				taskid = rt['data']['todayfinishdata'][i]['id'];
				title = rt['data']['todayfinishdata'][i]['title'];
				title = stripstr(title);
				content = rt['data']['todayfinishdata'][i]['content'];
				time = rt['data']['todayfinishdata'][i]['remindtimestamp'];
				//console.log(taskid+title);
				jq("#today").append("<li id='" + taskid + "'+ state='0' onmouseover='showBlock(this.id)' onmouseout='showNone(this.id)'></li>");
				jq("#" + taskid).append(" <div class='completeIcon' id='completeIcon" + taskid + "'></div>").append("<h3 id='clockDisplay" + taskid + "' style='visibility:hidden;'>00:00</h3>").append("<div class='inline'><img id='clockIcon" + taskid + "' src='images/icon07.png'></div>").append("<dl><dt><input class='eventClass  eventClass" + taskid + "' id='event" + taskid + "' type='text' value='" + title + "' readonly='readonly' /></dt></dl>").append("<dl class='dealTask_right' id='editTask" + taskid + "'><img id='edit" + taskid + "' class='edit' title='编辑任务'> <img id='clockSet" + taskid + "' class='clockSet' title='添加提醒' > <input type='text' id='timepicker" + taskid + "' onclick='WdatePicker({dateFmt:\"HH:mm\"})' class='WdatePicker'/><img id='deleteTask" + taskid + "' class='deleteTask' title='删除' src='images/icon04.png'> <a href='javascript:void(0)' class='confirmCompleted' id='confirmCompleted" + taskid + "'>标记完成</a><button id='confirmTask" + taskid + "' class='confirmTask' type='button'>确定</button><button id='cancelTask" + taskid + "' class='cancelTask' type='button'>取消</button><button id='confirmClock" + taskid + "' class='confirmClock' type='button'>确定</button><button id='cancelClock" + taskid + "' class='cancelClock' type='button'>取消</button></dl>").append("	<div class='dealTask_left'><span id='updateComment" + taskid + "' style='display:none;margin-left: 325px;'> <textarea class='commentClass' id='commentClass" + taskid + "' name='textarea' rows='10' cols='20' style='margin-bottom:-10px;overflow-y:hidden;height:80px;'></textarea><button id='confirmComment" + taskid + "' class='confirmComment'  type='button'>添加</button><button id='cancelComment" + taskid + "' class='cancelComment' type='button'>取消</button>	</span>	<pre id='detailComment" + taskid + "' class='detailComment'></pre><p><a href='javascript:void(0)' id='editComment" + taskid + "' class='editComment' style='margin-left:5px;'>编辑备注</a></p></div>");
				document.getElementById("detailComment" + taskid).innerText = content;
				jq("#editComment" + taskid).css("visibility", "hidden");
				jq("#edit" + taskid).toggle();
				jq("#clockSet" + taskid).toggle();
				jq("#" + taskid).attr("state", "1");
				jq("#completeIcon" + taskid).css("background", "url(images/icon08.png)");
				jq("#confirmCompleted" + taskid).html("恢复为未完成");
				jq("#event" + taskid).css("color", "#ccc");
				jq("#detailComment" + taskid).css("color", "#ccc");
				jq("#clockIcon" + taskid).attr("src", "images/icon07.png");
				if (time) {
					var arr = time.split(" ")[1].split(":");
					clock = arr[0] + ":" + arr[1];
					document.getElementById('clockDisplay' + taskid).innerHTML = clock;
					if (clock != "00:00") {
						jq("#clockIcon" + taskid).attr("src", "images/icon02.png");
						jq("#clockDisplay" + taskid).css("visibility", "visible");
					}
				}
			}
			for (var i = 0; i < rt['data']['futuredata'].length; i++) {
				var taskid = rt['data']['futuredata'][i]['id'];
				var title = rt['data']['futuredata'][i]['title'];
				title = stripstr(title);
				var time = rt['data']['futuredata'][i]['remindtimestamp'];
				var date = rt['data']['futuredata'][i]['date'];
				var content = rt['data']['futuredata'][i]['content'];
				//console.log(taskid+title);
				jq("#future").append("<li id='" + taskid + "'+ state='0'style='display:none' onmouseover='showBlock(this.id)' onmouseout='showNone(this.id)'></li>");
				jq("#" + taskid).append(" <div class='completeDate' id='completeDate" + taskid + "'></div>").append("<h3 id='clockDisplay" + taskid + "' style='visibility:hidden;'>00:00</h3>").append("<div class='inline'><img id='clockIcon" + taskid + "' src='images/icon07.png'></div>").append("<dl><dt><input class='eventClass  eventClass" + taskid + "' id='event" + taskid + "' type='text' value='" + title + "' readonly='readonly' /></dt></dl>").append("<dl class='dealTask_right' id='editTask" + taskid + "'><img id='edit" + taskid + "' class='edit' title='编辑任务' src='images/icon03.png'> <img id='clockSet" + taskid + "' class='clockSet' title='添加提醒' src='images/icon02.png'> <input type='text' id='timepicker" + taskid + "' onclick='WdatePicker({dateFmt:\"HH:mm\"})' class='WdatePicker'/><img id='deleteTask" + taskid + "' class='deleteTask' title='删除' src='images/icon04.png'><a href='javascript:void(0)' class='confirmCompleted' id='confirmCompleted" + taskid + "'>标记完成</a><button id='confirmTask" + taskid + "' class='confirmTask' type='button'>确定</button><button id='cancelTask" + taskid + "' class='cancelTask' type='button'>取消</button><button id='confirmClock" + taskid + "' class='confirmClock' type='button'>确定</button><button id='cancelClock" + taskid + "' class='cancelClock' type='button'>取消</button><span id='clockError" + taskid + "' class='clockError'></span></dl>").append("	<div class='dealTask_left'><span  id='updateComment" + taskid + "' style='display:none;margin-left: 325px;'> <textarea class='commentClass' id='commentClass" + taskid + "' name='textarea' rows='10' cols='20' size='1' maxlength='140' placeholder='最多可以输入140字哦……'  style='margin-bottom:-10px;overflow-y:hidden;height:80px;'></textarea><button id='confirmComment" + taskid + "' class='confirmComment'  type='button'>添加</button><button id='cancelComment" + taskid + "' class='cancelComment' type='button'>取消</button>	</span>	<pre id='detailComment" + taskid + "'  class='detailComment'></pre><p><a href='javascript:void(0)' id='editComment" + taskid + "' class='editComment' style='margin-left:5px;'>编辑备注</a></p></div>");

				document.getElementById("detailComment" + taskid).innerText = content;
				document.getElementById("completeDate" + taskid).innerHTML = date.split(" ")[0];
				if (time) {
					var arr = time.split(" ")[1].split(":");
					clock = arr[0] + ":" + arr[1];
					document.getElementById('clockDisplay' + taskid).innerHTML = clock;
					if (clock != "00:00") {
						jq("#clockIcon" + taskid).attr("src", "images/icon02.png");
						jq("#clockDisplay" + taskid).css("visibility", "visible");
		                jq("#timepicker"+taskid).val(clock);
					}
				}
			}
			for (var i = 0; i < rt['data']['futurefinishdata'].length; i++) {
				var taskid = rt['data']['futurefinishdata'][i]['id'];
				var title = rt['data']['futurefinishdata'][i]['title'];
				var date = rt['data']['futurefinishdata'][i]['date'];
				var content = rt['data']['futurefinishdata'][i]['content'];
				//console.log(taskid+title);
				jq("#future").append("<li id='" + taskid + "'+ state='0'style='display:none' onmouseover='showBlock(this.id)' onmouseout='showNone(this.id)'></li>");
				jq("#" + taskid).append(" <div class='completeDate' id='completeDate" + taskid + "'></div>").append("<h3 id='clockDisplay" + taskid + "' style='visibility:hidden;'>00:00</h3>").append("<div class='inline'><img id='clockIcon" + taskid + "' src='images/icon07.png'></div>").append("<dl><dt><input class='eventClass  eventClass" + taskid + "' id='event" + taskid + "' type='text' value='" + title + "' readonly='readonly' /></dt></dl>").append("<dl class='dealTask_right' id='editTask" + taskid + "'><img id='edit" + taskid + "' class='edit' title='编辑任务'> <img id='clockSet" + taskid + "' class='clockSet' title='添加提醒' > <input type='text' id='timepicker" + taskid + "' onclick='WdatePicker({dateFmt:\"HH:mm\"})' class='WdatePicker'/><img id='deleteTask" + taskid + "' class='deleteTask' title='删除' src='images/icon04.png'> <a href='javascript:void(0)' class='confirmCompleted' id='confirmCompleted" + taskid + "'>标记完成</a><button id='confirmTask" + taskid + "' class='confirmTask' type='button'>确定</button><button id='cancelTask" + taskid + "' class='cancelTask' type='button'>取消</button><button id='confirmClock" + taskid + "' class='confirmClock' type='button'>确定</button><button id='cancelClock" + taskid + "' class='cancelClock' type='button'>取消</button></dl>").append("	<div class='dealTask_left'><span id='updateComment" + taskid + "' style='display:none;margin-left: 325px;'> <textarea class='commentClass' id='commentClass" + taskid + "' name='textarea' rows='10' cols='20' style='margin-bottom:-10px;overflow-y:hidden;height:80px;'></textarea><button id='confirmComment" + taskid + "' class='confirmComment'  type='button'>添加</button><button id='cancelComment" + taskid + "' class='cancelComment' type='button'>取消</button>	</span>	<pre id='detailComment" + taskid + "' class='detailComment'></pre><p><a href='javascript:void(0)' id='editComment" + taskid + "' class='editComment' style='margin-left:5px;'>编辑备注</a></p></div>");
				document.getElementById("detailComment" + taskid).innerText = content;
				document.getElementById("completeDate" + taskid).innerHTML = date.split(" ")[0];
				jq("#editComment" + taskid).css("visibility", "hidden");
				jq("#edit" + taskid).hide();
				jq("#clockSet" + taskid).hide();
				jq("#" + taskid).attr("state", "1");
				jq("#completeIcon" + taskid).css("background", "url(images/icon08.png)");
				jq("#confirmCompleted" + taskid).html("恢复为未完成");
				jq("#event" + taskid).css("color", "#ccc");
				jq("#completeDate" + taskid).css("color", "#ccc");
				jq("#detailComment" + taskid).css("color", "#ccc");
				jq("#clockIcon" + taskid).attr("src", "images/icon07.png");
				if (time) {
					var arr = time.split(" ")[1].split(":");
					clock = arr[0] + ":" + arr[1];
					document.getElementById('clockDisplay' + taskid).innerHTML = clock;
					//		if (clock != "00:00") {
					//			jq("#clockIcon" + taskid).attr("src", "images/icon02.png");
					//			jq("#clockDisplay" + taskid).css("visibility", "visible");
					//		}
				}
			}
		}
	});
}

function getCompleteThing() {
	var paras = {};
	paras.uid = getCookie("uid");
	paras.dowhat = "getfinishedtasks";
	paras = JSON.stringify(paras);
	para = {
		"jsonstring": paras
	};
	//console.log(para);
	jq.post("../Event.DB.php", para, function(rt) {
		rt = eval("(" + rt + ")");
		//console.log(rt['data']);
		//console.log(rt);
		if (rt.code == 1) {
			for (var i = rt['data'].length - 1; i >= 0; i--) {
				taskid = rt['data'][i]['id'];
				title = rt['data'][i]['title'];
				content = rt['data'][i]['content'];
				time = rt['data'][i]['edittimestamp'];
				//console.log(taskid+title);
				jq("#complete").append("<li id='" + taskid + "'+ state='0' style='display:none' onmouseover='showBlock(this.id)' onmouseout='showNone(this.id)'></li>");
				jq("#" + taskid).append(" <div class='completeDate' id='completeDate" + taskid + "'></div>").append("<h3 id='clockDisplay" + taskid + "' style='visibility:hidden;'>00:00</h3>").append("<div class='inline'><img id='clockIcon" + taskid + "' src='images/icon07.png'></div>").append("<dl><dt><input class='eventClass  eventClass" + taskid + "' id='event" + taskid + "' type='text' value='" + title + "' readonly='readonly' /></dt></dl>").append("	<div class='dealTask_left'><pre id='detailComment" + taskid + "'  class='detailComment'></pre></div>");
				document.getElementById("detailComment" + taskid).innerText = content;
				document.getElementById("completeDate" + taskid).innerHTML = time.split(" ")[0];
				var tmp = time.split(" ")[1].split(":");
				document.getElementById("clockDisplay" + taskid).innerHTML = tmp[0] + ":" + tmp[1];
				jq("#clockDisplay" + taskid).css("visibility", "visible");
			}
		}
	});
}

/*when the mouse moves away*/
function showNone(id) {
	//	jq('#editComment' + id).hide();
	document.getElementById('editComment' + id).style.visibility = "hidden";
	jq('#detailComment' + id).show();
	document.getElementById('editTask' + id).style.visibility = "hidden";
	if (jq("#timepicker" + id).attr("state") == 0) {
		document.getElementById('timepicker' + id).style.visibility = "visible";
		document.getElementById('confirmClock' + id).style.visibility = "visible";
		document.getElementById('cancelClock' + id).style.visibility = "visible";
	}
	if (jq("#confirmTask" + id).attr("state") == 0) {
		document.getElementById('confirmTask' + id).style.visibility = "visible";
		document.getElementById('cancelTask' + id).style.visibility = "visible";
	}
}

/*when the mouse comes*/
function showBlock(id) {
	document.getElementById('editTask' + id).style.visibility = "visible";
	if (jq("#" + id).attr("state") == 0) {
		document.getElementById('editComment' + id).style.visibility = "visible";
	}
	//	jq("#editComment" + id).show();
}

/*the no completed task*/
function noCompleteThing() {
	var paras = {};
	paras.uid = getCookie("uid");
	paras.dowhat = "nocompletething";
	paras = JSON.stringify(paras);
	para = {
		"jsonstring": paras
	};
	jq.post("../Event.DB.php", para, function(rt) {
		//console.log(rt);
		rt = eval("(" + rt + ")");
		//console.log(typeof(rt));					  
		if (rt.code == 1) {
			//console.log("!!!!!=" + rt.count);
			document.getElementById("noCompleteThing").innerHTML = rt.count;
		}
	});
}
function modifyTime(taskid) {
	clearTimeout(clock[taskid]);
	var paras = {};
	var date = new Date();
	var modifytime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ":" + date.getSeconds();
	paras.edittimestamp = modifytime;
	paras.id = taskid;
	paras.remindtimestamp = "";
	paras.dowhat = 'modifytask';
	paras = JSON.stringify(paras);
	para = {
		"jsonstring": paras
	};
	jq.post("../Event.DB.php", para, function(data) {});
}

/*function modifyDate(taskid){
	      var paras={};
		  var date = new Date();
		  var modifytime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ":" + date.getSeconds();
		  paras.date =date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
		  paras.edittimestamp = modifytime;
		  paras.id=taskid;
		  paras.dowhat = 'modifytask';
		       paras = JSON.stringify(paras);
			      para = {
					     "jsonstring": paras
					           };
						     jq.post("../Event.DB.php",
							 para,
							   function(data) {
								   alert(data);
									    });
	}
*/
function mainFunction() {
	/*the slide effect*/
	if (!jq(".history").length) {
		return;
	}
	var jqwarpEle = jq(".history-date"),
	jqwarpEle0 = jq(".today"),
	jqwarpEle1 = jq(".other"),
	jqtargetA = jqwarpEle.find("h2 a,ul li dl dt a"),
	parentH,
	eleTop = [];

	parentH = jqwarpEle0.parent().height();
	//jqwarpEle0.parent().css({"height":59});
	jqwarpEle1.find("ul li").css({
		"display": "none"
	});

	//jqwarpEle0.find('h2 a').addClass("rotate");
	var date = new Date();
	var arr_week = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
	var currenttime = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日' + ' ' + arr_week[date.getDay()];

	jq("#currentTime").html(currenttime);
	jqwarpEle0.find("ul").children(":not('h2:first')").addClass("bounceInDown").css({
		"-webkit-animation-duration": "2s",
		"-webkit-animation-delay": "0",
		"-webkit-animation-timing-function": "ease",
		"-webkit-animation-fill-mode": "both"
	}).end().children("h2").css({
		"position": "relative"
	});

	jqtargetA.click(function() {

		jq(this).toggleClass("rotate");
		jq(this).parent().css({
			"position": "relative"
		});
		jq(this).parent().siblings().slideToggle();
		jqwarpEle.parent().removeAttr("style");
		return false;
	});

	/* login action*/
	jq(".logingo").live("click", function() {
		if (jq(this).html() == "登录") {
			document.getElementById("loginError").innerHTML = "";
			jq(".remindDiv").hide();
			jq(".registerDiv").hide();
			jq(".clockDiv").hide();
			jq('#uname').attr("value", getCookie("uname"));
			jq(".loginDiv").slideToggle("slow");
		}
	});
	/* login function*/
	jq("#loginsubmit").live('click', function() {
		var uname = jq("#uname").val();
		var passwd = jq("#passwd").val();
		login(uname, passwd, false);
	});

	jq("#logout").live('click', function() {

		var paras = {};

		paras.username = getCookie("uname");
		paras.logway = '1';
		paras.dowhat = 'logout';
		paras = JSON.stringify(paras);

		para = {
			"jsonstring": paras
		};
		jq.post("../User.DB.php", para, function(rt) {
			console.log("4444>>>" + rt);
			data = eval("(" + rt + ")");

			delCookie("passwd");
			delCookie("uid");
			if (data.code == 0) {
				//console.log("111>>>"+data);
				document.getElementById("login").innerHTML = "登录";
				document.getElementById("logout").innerHTML = "注册";
				document.getElementById("logout").id = "register";
				jq(".loginDiv").hide(500);
				location.reload();
			} else {
				jq("#loginError").innerHTML = data.message;
			}
		});
	});
	/* register action*/
	jq("#register").click(function() {
		document.getElementById("registerError").innerHTML = "";
		jq("#unameRegister").val("");
		jq("#passwdRegister").val("");
		jq("#passwdagain").val("");
		jq(".remindDiv").hide();
		jq(".loginDiv").hide();
		jq(".clockDiv").hide();
		jq(".registerDiv").slideToggle("slow");
	});
	/* register function*/
	jq("#registersumbit").live('click', function() {
		document.getElementById("registerError").innerHTML = "";
		var uname = jq("#unameRegister").val();
		var passwd = jq("#passwdRegister").val();
		var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
		if (!reg.test(uname)) {
			document.getElementById("registerError").innerHTML = "请输入正确的邮箱";
		}
		else {
			var reg = /[a-zA-Z0-9!@#$%^&*()_+~<>?]{6,16}/;
			if (!reg.test(passwd)) {
				document.getElementById("registerError").innerHTML = "密码格式不正确";
			}
			else {
				var passwdagain = jq("#passwdagain").val();
				if (passwd != passwdagain) {
					document.getElementById("registerError").innerHTML = "两次输入的密码不一致";
				}
				else {
					var paras = {};
					paras.username = uname;
					paras.email = uname;
					paras.password = hex_sha1(passwd);
					paras.dowhat = 'register';
					paras = JSON.stringify(paras);
					para = {
						"jsonstring": paras
					};
					//console.log(paras);
					jq.post("../User.DB.php", para, function(data) {
						//console.log(data);
						data = eval("(" + data + ")");
						if (data.code == 0) {
							//jq(".registerDiv").hide(500);
							document.getElementById("registerError").innerHTML = "注册成功！" + "<a href='#' id='activeUrl'>先去您的注册邮箱激活您的账号吧。</a>";
							var mail = uname.split("@")[1];
							    if (mail != "qq.com"&&mail!="sina.com"&&mail!="yahoo.com.cn"&&mail!="163.com"&&mail!="126.com") {
								            jq("#activeUrl").css("cursor","default");
								        }
							setCookie("uname", uname, 30);
							setCookie("passwd", hex_sha1(passwd), 30);
						}
						else {
							document.getElementById("registerError").innerHTML = data.message;
						}
					});
				}
			}
		}
	});

	jq("#activeUrl").live('click', function() {
		var mail = getCookie('uname').split("@")[1];
		if (mail == "qq.com") {
			window.location.href = "https://mail.qq.com";
		}
		else if (mail == "sina.com") {
			window.location.href = "http://mail.sina.com.cn";
		}
		else if (mail == "yahoo.com.cn") {
			window.location.href = "http://mail.cn.yahoo.com/";
		}
		else if (mail == "163.com") {
			window.location.href = "http://email.163.com/";
		}
		else if (mail == "126.com") {
			window.location.href = "http://www.126.com/";
		}

	})

	/*close the login and register div*/
	jq(".close").click(function() {
		jq(".remindDiv").hide(500);
		jq(".loginDiv").hide(500);
		jq(".clockDiv").hide(500);
		jq(".registerDiv").hide(500);
		location.reload();
	});
	jq("#setting").click(function() {
		jq(".loginDiv").slideToggle("slow");
	});

	jq("#addTask").click(function() {
		jq("#text").val("");
		jq("#timepicker").val("");
		document.getElementById("textError").innerHTML = "";
		jq(".listThing").toggle();
		jq(".newTask").slideToggle();
	})
	/*set the clock when the task is created*/
	jq("#clockSet").click(function() {
		jq("#timepicker").show();
		//WdatePicker({el:$dp.$('#timepicker'),dateFmt:"HH:mm"};
		jq("#clockSet").hide();
		  var date = new Date();
		  var dateHour = date.getHours();
		  if(dateHour<9){
                dateHour="0"+dateHour;			   
		  }
		  var dateMinute = date.getMinutes();
		  if(dateMinute<9){
		       dateMinute = "0"+dateMinute;   
		  }
		  clockValue = dateHour + ':' + dateMinute;
		  jq("#timepicker").val(clockValue);
		//jq("#confirmCreateTask").hide();
		//jq("#cancelCreateTask").hide();
		//jq("#confirmSetClock").show();
		//jq("#cancelSetClock").show();
	})
	jq("#confirmSetClock").click(function() {
		if (jq("#timepicker").val() == "") {
			document.getElementById("errorInfo").innerHTML = "请选择要设置的闹钟时间";
		}
		else {
			document.getElementById("errorInfo").innerHTML = "";
			jq("#timepicker").hide();
			jq("#clockSet").show();
			jq("#confirmCreateTask").show();
			jq("#cancelCreateTask").show();
			jq("#confirmSetClock").hide();
			jq("#cancelSetClock").hide();
		}
	})
	jq("#cancelSetClock").click(function() {
		document.getElementById("errorInfo").innerHTML = "";
		jq("#timepicker").hide();
		jq("#clockSet").show();
		jq("#confirmCreateTask").show();
		jq("#cancelCreateTask").show();
		jq("#confirmSetClock").hide();
		jq("#cancelSetClock").hide();
		document.getElementById("timepicker").value = "";
	})

	jq("#addTaskFuture").click(function() {
		jq("#textFuture").val("");
		jq("#timepickerFuture").val("");
		document.getElementById("textErrorFuture").innerHTML = "";
		var date = new Date();
		var month = date.getMonth() + 1;
		var day = date.getDate() + 1;
		if (month <= 9) month = "0" + 9;
		if (day <= 9) day = "0" + 9;
		dateFuture = date.getFullYear() + '-' + month + '-' + day;
		jq("#dateFuture").val(dateFuture);
		jq(".newTaskFuture").slideToggle();
	})
	/*set the clock when the task is created*/
	jq("#clockSetFuture").click(function() {
		jq("#timepickerFuture").show();
		jq("#clockSetFuture").hide();
		  var date = new Date();
		  var dateHour = date.getHours();
		  if(dateHour<9){
                dateHour="0"+dateHour;			   
		  }
		  var dateMinute = date.getMinutes();
		  if(dateMinute<9){
		       dateMinute = "0"+dateMinute;   
		  }
		  clockValue = dateHour + ':' + dateMinute;
		  jq("#timepickerFuture").val(clockValue);
		//	 jq("#confirmCreateTaskFuture").hide();
		//	 jq("#cancelCreateTaskFuture").hide();
		//	 jq("#confirmSetClockFuture").show();
		//	 jq("#cancelSetClockFuture").show();
	})
	jq("#confirmSetClockFuture").click(function() {
		if (jq("#timepickerFuture").val() == "") {
			document.getElementById("errorInfoFuture").innerHTML = "请选择要设置的闹钟时间";
		}
		else {
			document.getElementById("errorInfoFuture").innerHTML = "";
			jq("#timepickerFuture").hide();
			jq("#clockSetFuture").show();
			jq("#confirmCreateTaskFuture").show();
			jq("#cancelCreateTaskFuture").show();
			jq("#confirmSetClockFuture").hide();
			jq("#cancelSetClockFuture").hide();
		}
	})
	jq("#cancelSetClockFuture").click(function() {
		document.getElementById("errorInfoFuture").innerHTML = "";
		jq("#timepickerFuture").hide();
		jq("#clockSetFuture").show();
		jq("#confirmCreateTaskFuture").show();
		jq("#cancelCreateTaskFuture").show();
		jq("#confirmSetClockFuture").hide();
		jq("#cancelSetClockFuture").hide();
		document.getElementById("timepickerFuture").value = "";
	})

	/*create the task*/
	jq("#confirmCreateTask").live('click', function() {
		if (!getCookie("uid")) {
			jq(".loginDiv").hide();
			jq(".registerDiv").hide();
			jq(".remindDiv").slideToggle("slow");
			//	jq(".newTask").hide(500);
			//	jq(".listThing").show();
			document.getElementById("remindDiv").innerHTML = "亲爱的，您还没有登录，登录后才能使用哟~" + "点击<a href='#' class='logingo'>登录</a>";
		}
		else {
			var paras = {};
			var title = jq("#text").val();
			if (title.trim(" ") == "") {
				document.getElementById("textError").innerHTML = "内容不能为空";
			}
			else {
				document.getElementById("textError").innerHTML = "";
				var time = jq("#timepicker").val();
				var date = new Date();

				paras.title = title;

				title = stripstr(title);
				console.log('data:'+title);

				tmp = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
				paras.date = tmp;
				paras.createtime = tmp + ' ' + date.getHours() + ':' + date.getMinutes();
				if (time != "" && (new Date(tmp + " " + time)) <= date) {
					document.getElementById("textError").innerHTML = "闹钟时间过期";
				}
				else {
					paras.dowhat = "createtask";
					paras.androiddbid = 0;
					paras.userid = getCookie("uid");
					paras.content = "";
					paras.edittimestamp = tmp + ' ' + date.getHours() + ':' + date.getMinutes();
					paras.remindtimestamp = tmp + " " + time;

					//console.log(paras.remindtimestamp);
					paras = JSON.stringify(paras);
					para = {
						"jsonstring": paras
					};
					//console.log(paras);
					jq.post("../Event.DB.php", para, function(data) {
						//			alert(data.message);
						console.log("data2:"+data);
						rt = eval("(" + data + ")");
						if (rt.code == 1) {
							noCompleteThing();

							//展开当前的tab
							jqwarpEle0.find("ul li").css({
								"display": "block"
							});
							jqwarpEle0.find('h2 a').addClass('rotate');
							jq("#today h2").after("<li id='" + rt.taskid + "'+ state='0' onmouseover='showBlock(this.id)' onmouseout='showNone(this.id)'></li>");
							jq("#" + rt.taskid).append(" <div class='completeIcon' id='completeIcon" + rt.taskid + "'></div>").append("<h3 id='clockDisplay" + rt.taskid + "' style='visibility:hidden;'>00:00</h3>").append("<div class='inline'><img id='clockIcon" + rt.taskid + "' src='images/icon07.png'></div>").append("<dl><dt><input class='eventClass  eventClass" + rt.taskid + "' id='event" + rt.taskid + "' type='text' value='" + title + "' readonly='readonly' size='1' maxlength='20'/></dt></dl>").append("<dl class='dealTask_right' id='editTask" + rt.taskid + "'><img id='edit" + rt.taskid + "' class='edit' title='编辑任务' src='images/icon03.png'> <img id='clockSet" + rt.taskid + "' class='clockSet' title='添加提醒' src='images/icon02.png'> <input type='text' id='timepicker" + rt.taskid + "' onclick='WdatePicker({dateFmt:\"HH:mm\"})' class='WdatePicker'/> <img id='deleteTask" + rt.taskid + "' class='deleteTask' title='删除' src='images/icon04.png'> <a href='javascript:void(0)' class='confirmCompleted' id='confirmCompleted" + rt.taskid + "'>标记完成</a><button id='confirmTask"+ rt.taskid + "' class='confirmTask' type='button'>确定</button><button id='cancelTask" + rt.taskid + "' class='cancelTask' type='button'>取消</button><button id='confirmClock" + rt.taskid + "' class='confirmClock' type='button'>确定</button><button id='cancelClock" + rt.taskid + "' class='cancelClock' type='button'>取消</button><span id='clockError" + rt.taskid + "' class='clockError'></span></dl>").append("<div class='dealTask_left'><span id='updateComment" + rt.taskid + "' style='display:none;margin-left: 325px;'> <textarea class='commentClass' id='commentClass" + rt.taskid + "' name='textarea' rows='10' cols='20' placeholder='最多可以添加140字哦……' size='1' maxlength='140' style='margin-bottom:-10px;overflow-y:hidden;height:80px;'></textarea><button id='confirmComment" + rt.taskid + "' class='confirmComment'  type='button'>添加</button><button id='cancelComment" + rt.taskid + "' class='cancelComment' type='button'>取消</button></span><pre id='detailComment" + rt.taskid + "'  class='detailComment'></pre><p><a href='javascript:void(0)' id='editComment" + rt.taskid + "' class='editComment' style='margin-left:5px;'>编辑备注</a></p></div>");
							//jq('#event'+rt.taskid).val(title);
							jq(".listThing").toggle();
							jq(".newTask").toggle(500);
							if (time) {

								document.getElementById('clockDisplay' + rt.taskid).innerHTML = jq("#timepicker").val();
								jq("#clockIcon" + rt.taskid).attr("src", "images/icon02.png");
								jq("#clockDisplay" + rt.taskid).css("visibility", "visible");
							}
						}
					});
				}
			}
		}
	})
	/*cancel the creating of the task*/
	jq("#cancelCreateTask").live('click', function() {
		document.getElementById("text").value = "";
		document.getElementById("errorInfo").innerHTML = "";
		jq("#timepicker").hide();
		jq("#clockSet").show();
		jq("#confirmCreateTask").show();
		jq("#cancelCreateTask").show();
		jq("#confirmSetClock").hide();
		jq("#cancelSetClock").hide();
		document.getElementById("timepicker").value = "";
		document.getElementById("textError").innerHTML = "";
		jq(".newTask").toggle(500);
		jq(".listThing").show();
	})

	jq("#confirmCreateTaskFuture").click(function() {
		if (!getCookie("uid")) {
			jq(".loginDiv").hide();
			jq(".registerDiv").hide();
			jq(".remindDiv").show("500");
			//jq(".newTaskFuture").slideToggle();
			document.getElementById("remindDiv").innerHTML = "亲爱的，您还没有登录，登录后才能使用哟~" + "点击<a href='#' class='logingo'>登录</a>";
		}
		else {
			var paras = {};
			var title = jq("#textFuture").val();
			var dateFuture = jq("#dateFuture").val();

			if (title.replace(" ", "") == "") {
				document.getElementById("textErrorFuture").innerHTML = "内容不能为空";
			}
			else {
				document.getElementById("textErrorFuture").innerHTML = "";
				var time = jq("#timepickerFuture").val();
				var date = new Date();

				title = stripstr(title);
				paras.title = title;
				tmp = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
				if (dateFuture == "") {
					var month = date.getMonth() + 1;
					var day = date.getDate() + 1;
					if (month <= 9) month = "0" + 9;
					if (day <= 9) day = "0" + 9;
					dateFuture = date.getFullYear() + '-' + month + '-' + day;
				}
				paras.date = dateFuture;
				paras.createtime = tmp + ' ' + date.getHours() + ':' + date.getMinutes();
				paras.dowhat = "createtask";
				paras.androiddbid = 0;
				paras.userid = getCookie("uid");
				paras.content = "";
				paras.edittimestamp = tmp + ' ' + date.getHours() + ':' + date.getMinutes();
				
				if(time != ""){
					paras.remindtimestamp = dateFuture + " " + time;
				}
				console.log(paras);
				paras = JSON.stringify(paras);
				para = {
					"jsonstring": paras
				};
				jq.post("../Event.DB.php", para, function(data) {
					rt = eval("(" + data + ")");
					if (rt.code == 1) { //console.log(title);
						//展开当前的tab
						jq('.future').find("ul li").css({
							"display": "block"
						});
						jq('.future h2 a').addClass('rotate');
						jq("#future h2").after("<li id='" + rt.taskid + "'+ state='0' onmouseover='showBlock(this.id)' onmouseout='showNone(this.id)'></li>");
						jq("#" + rt.taskid).append(" <div class='completeDate' id='completeDate" + rt.taskid + "'></div>").append("<h3 id='clockDisplay" + rt.taskid + "' style='visibility:hidden;'>00:00</h3>").append("<div class='inline'><img id='clockIcon" + rt.taskid + "' src='images/icon07.png'></div>").append("<dl><dt><input class='eventClass  eventClass" + rt.taskid + "' id='event" + rt.taskid + "' type='text' value='" + title + "' readonly='readonly' size='1' maxlength='20'/></dt></dl>").append("<dl class='dealTask_right' id='editTask" + rt.taskid + "'><img id='edit" + rt.taskid + "' class='edit' title='编辑任务' src='images/icon03.png'><img id='clockSet" + rt.taskid + "' class='clockSet' title='添加提醒' src='images/icon02.png'><input type='text' id='timepicker" + rt.taskid + "' onclick='WdatePicker({dateFmt:\"HH:mm\"})' class='WdatePicker'/><img id='deleteTask" + rt.taskid + "' class='deleteTask' title='删除' src='images/icon04.png'> <a href='javascript:void(0)' class='confirmCompleted' id='confirmCompleted" + rt.taskid + "'>标记完成</a><button id='confirmTask" + rt.taskid + "' class='confirmTask' type='button'>确定</button><button id='cancelTask" + rt.taskid + "' class='cancelTask' type='button'>取消</button><button id='confirmClock" + rt.taskid + "' class='confirmClock' type='button'>确定</button><button id='cancelClock" + rt.taskid + "' class='cancelClock' type='button'>取消</button><span id='clockError" + rt.taskid + "' class='clockError'></span></dl>").append("	<div class='dealTask_left'><span id='updateComment" + rt.taskid + "' style='display:none;margin-left: 325px;'> <textarea class='commentClass' id='commentClass" + rt.taskid + "' name='textarea' rows='10' cols='20' placeholder='最多可以添加140字哦……' size='1' maxlength='140' style='margin-bottom:-10px;overflow-y:hidden;height:80px;'></textarea><button id='confirmComment" + rt.taskid + "' class='confirmComment'  type='button'>添加</button><button id='cancelComment" + rt.taskid + "' class='cancelComment' type='button'>取消</button>	</span>	<pre id='detailComment" + rt.taskid + "'  class='detailComment'></pre><p><a href='javascript:void(0)' id='editComment" + rt.taskid + "' class='editComment' style='margin-left:5px;'>编辑备注</a></p></div>");
						//document.getElementById("detailComment"+rt.taskid).innerHTML=rt.content;		
						//jq('#event'+rt.taskid).val(title);
						document.getElementById("completeDate" + rt.taskid).innerHTML = dateFuture;
						//jq(".listThingFuture").toggle();
						jq(".newTaskFuture").toggle(500);
						if (time) {
							document.getElementById('clockDisplay' + rt.taskid).innerHTML = jq("#timepickerFuture").val();
							jq("#clockIcon" + rt.taskid).attr("src", "images/icon02.png");
							jq("#clockDisplay" + rt.taskid).css("visibility", "visible");
						}
					}
				});

				//console.log(paras);      
			}

		}
	})
	/*cancel the creating of the task*/
	jq("#cancelCreateTaskFuture").click(function() {
		jq("#timepickerFuture").hide();
		jq("#clockSetFuture").show();
		document.getElementById("textFuture").value = "";
		document.getElementById("textErrorFuture").innerHTML = "";
		jq(".newTaskFuture").toggle(500);
	})
	bindAllEvent();
}

/*the action of every thing*/
//绑定各种事件
function bindAllEvent() {
	//编辑任务 
	jq(".edit").live('click', function() {
		var id = (jq(this).attr("id")).replace(/[^0-9]+/ig, "");
		titleBack = jq("#event" + id).val();
		/*	jq("#event" + id).removeAttr("readonly");
		jq(".eventClass" + id).css("border", "1px solid #B0E2FF");
		jq(".dealTask_right img,.dealTask_right a").toggle();
		jq("#confirmTask" + id).toggle();
		jq("#cancelTask" + id).toggle();
    */
		jq("#event" + id).removeAttr("readonly");
		jq(".eventClass" + id).css("border", "1px solid #B0E2FF");
		jq("#edit" + id).toggle();
		jq("#clockSet" + id).toggle();
		jq("#deleteTask" + id).toggle();
		jq("#confirmCompleted" + id).toggle();
		jq("#confirmTask" + id).toggle();
		jq("#cancelTask" + id).toggle();
		document.getElementById("confirmTask" + id).setAttribute("state", "0");
		document.getElementById("cancelTask" + id).setAttribute("state", "0");
	});

	//确认编辑完成 
	jq(".confirmTask").live('click', function() {
		if (!getCookie("uid")) {
			jq(".loginDiv").hide();
			jq(".registerDiv").hide();
			jq(".remindDiv").slideToggle("slow");
			document.getElementById("remindDiv").innerHTML = "您还没有登录，登录后才能使用！";

		}
		else {
			var id = (jq(this).attr("id")).replace(/[^0-9]+/ig, "");
			var paras = {};
			var title = jq("#event" + id).val();
			if (title.replace(" ", "") == "") {
				document.getElementById("clockError"+id).innerHTML = "内容不能为空";
			}
			else {
				var date = new Date();
				var modifytime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
				paras.title = title;
				titleValue[id]=title;
				paras.edittimestamp = modifytime;
				paras.id = id;
				paras.dowhat = 'modifytask';
				paras = JSON.stringify(paras);
				para = {
					"jsonstring": paras
				};
				//console.log(paras);
				//通信 
				jq.post("../Event.DB.php", para, function(data) {
					document.getElementById("textError").innerHTML = "";
				});

				/*			jq("#event" + id).attr("readonly", "readonly");
			jq(".eventClass" + id).css("border", "0");
			jq(".dealTask_right img").toggle();
			jq("#confirmCompleted" + id).toggle()
			jq("#confirmTask" + id).toggle();
			jq("#cancelTask" + id).toggle();*/
				jq("#event" + id).attr("readonly", "readonly");
				jq(".eventClass" + id).css("border", "0");
				jq("#edit" + id).toggle();
				jq("#clockSet" + id).toggle();
				jq("#deleteTask" + id).toggle();
				jq("#confirmCompleted" + id).toggle()
				jq("#confirmTask" + id).toggle();
				jq("#cancelTask" + id).toggle();
				document.getElementById("clockError"+id).innerHTML = "";
				document.getElementById("confirmTask" + id).setAttribute("state", "1");
				document.getElementById("cancelTask" + id).setAttribute("state", "1");
			}
		}
	});

	//取消编辑任务
	jq(".cancelTask").live('click', function() {

		var id = (jq(this).attr("id")).replace(/[^0-9]+/ig, "");
		document.getElementById("textError").innerHTML = "";
		jq("#event" + id).val(titleBack);
		jq("#event" + id).attr("readOnly", "readonly");
		jq(".eventClass" + id).css("border", "0");
		//jq(".dealTask_right img").toggle();
		jq("#edit" + id).toggle();
		jq("#clockSet" + id).toggle();
		jq("#deleteTask" + id).toggle();
		jq("#confirmCompleted" + id).toggle();
		jq("#confirmTask" + id).toggle();
		jq("#cancelTask" + id).toggle();
		document.getElementById("clockError"+id).innerHTML = "";
		document.getElementById("confirmTask" + id).setAttribute("state", "1");
		document.getElementById("cancelTask" + id).setAttribute("state", "1");
	});

	//编辑备注 
	jq(".editComment").live('click', function() {
		var id = (jq(this).attr("id")).replace(/[^0-9]+/ig, "");
		//document.getElementById('editComment' + id).style.visibility = "hidden";
		jq("#editComment" + id).css("display", "none");
		document.getElementById('detailComment' + id).style.visibility = "hidden";
		document.getElementById('updateComment' + id).style.display = "inline";
		jq('#commentClass' + id).html(document.getElementById('detailComment' + id).innerHTML);
	})
	jq(".confirmComment").live('click', function() {
		if (!getCookie("uid")) {
			jq(".loginDiv").hide();
			jq(".registerDiv").hide();
			jq(".remindDiv").slideToggle("slow");
			document.getElementById("remindDiv").innerHTML = "您还没有登录，登录后才能使用！";

		}
		else {
			var id = (jq(this).attr("id")).replace(/[^0-9]+/ig, "");
			jq("#updateComment" + id).toggle();
			//	document.getElementById('editComment' + id).style.visibility = "visible";
			jq("#editComment" + id).css("display", "block");
			jq('#detailComment' + id).text(jq("#commentClass" + id).val());
			document.getElementById('detailComment' + id).style.visibility = "visible";
			//document.getElementById('editComment' + id).style.display = "inline";
			var paras = {};
			var content = jq("#commentClass" + id).val();
			var date = new Date();
			var modifytime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
			paras.content = content;
			paras.edittimestamp = modifytime;
			paras.id = id;
			paras.dowhat = 'modifytask';
			paras = JSON.stringify(paras);
			para = {
				"jsonstring": paras
			};
			//console.log(paras);
			//通信 
			jq.post("../Event.DB.php", para, function(data) {});

		}
	})
	jq(".cancelComment").live('click', function() {
		var id = (jq(this).attr("id")).replace(/[^0-9]+/ig, "");
		document.getElementById('editComment' + id).style.visibility = "visible";
		jq("#updateComment" + id).hide();
		document.getElementById('detailComment' + id).style.visibility = "visible";
		jq("#editComment" + id).css("display", "block");
		//	document.getElementById('editComment' + id).style.display = "inline";
	})

	//添加提醒
	jq(".clockSet").live('click', function() {
		var id = (jq(this).attr("id")).replace(/[^0-9]+/ig, "");
		document.getElementById("clockError" + id).innerHTML = "";
		document.getElementById("timepicker" + id).setAttribute("state", "0");
		if(!jq("#timepicker"+id).val()){
		  var date = new Date();
		  var dateHour = date.getHours();
		  if(dateHour<9){
                dateHour="0"+dateHour;			   
		  }
		  var dateMinute = date.getMinutes();
		  if(dateMinute<9){
		       dateMinute = "0"+dateMinute;   
		  }
		  clockValue = dateHour + ':' + dateMinute;
		  jq("#timepicker"+id).val(clockValue);
		}
		jq("#edit" + id).toggle();
		jq("#deleteTask" + id).toggle();
		jq("#clockSet" + id).toggle();
		jq("#confirmCompleted" + id).toggle();
		jq("#confirmClock" + id).show();
		jq("#cancelClock" + id).show();
		jq("#timepicker" + id).show();
		jq(".clockChose").show();

	});

	//确认编辑提醒
	jq(".confirmClock").live('click', function() {
		if (!getCookie("uid")) {
			jq(".loginDiv").hide();
			jq(".registerDiv").hide();
			jq(".remindDiv").slideToggle("slow");
			document.getElementById("remindDiv").innerHTML = "您还没有登录，登录后才能使用！";

		}
		else {
			var id = (jq(this).attr("id")).replace(/[^0-9]+/ig, "");
			//console.log(jq("#timepicker" + id).val());
			var paras = {};
			var date = new Date();
			/*hourselect = jq("#hourselect" + id).val();
			minuteselect = jq("#minuteselect" + id).val();*/

			var tmp = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
			var time = jq("#timepicker" + id).val();
			if (time != "" && (new Date(tmp + " " + time)) <= date && (document.getElementById("completeDate" + id)) == null) {
				document.getElementById("clockError" + id).innerHTML = "闹钟时间过期";
			}
			else {
				var modifytime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ":" + date.getSeconds();
				paras.remindtimestamp = tmp + " " + time;
				if (document.getElementById("completeDate" + id) != null) {
					var futureDate = document.getElementById("completeDate" + id).innerHTML;
					if (futureDate != tmp) {
						time = futureDate + ' ' + jq("#timepicker" + id).val();
						paras.remindtimestamp = time;
					}
				}
				paras.edittimestamp = modifytime;
				paras.id = id;
				paras.dowhat = 'modifytask';
				paras = JSON.stringify(paras);
				para = {
					"jsonstring": paras
				};
				jq.post("../Event.DB.php", para, function(data) {
					/*  rt=eval("(" + data + ")");			
			               clearTimeout("clock"+id);
						   var startDate= new Date();
                           var endDate= new Date(time); 
                           var duration=endDate.getTime()-startDate.getTime();
						   var setClock="clock"+id;
                           setClock=function(){
						   		    jq(".loginDiv").hide();
		                            jq(".registerDiv").hide();	
			                        jq(".remindDiv").hide();
		                            jq(".clockDiv").show("500");
									title=jq("#event"+id).val();
						            document.getElementById("clockDiv").innerHTML="亲爱的，到时间该做"+'\"'+title+'\"'+"了"; 
						   }
                           setTimeout(setClock,duration);*/
					document.getElementById("clockError" + id).innerHTML = "";
				});
				var clockDisplay = jq("#timepicker" + id).val();
				if (clockDisplay == "") {
					clockDisplay = "00:00";
					jq("#clockIcon" + id).attr("src", "images/icon07.png");
					//jq("#clockIcon" + id).css("visibility", "hidden");
					jq("#clockDisplay" + id).css("visibility", "hidden");
				}
				else {
					jq("#clockIcon" + id).attr("src", "images/icon02.png");
					jq("#clockIcon" + id).css("visibility", "visible");
					jq("#clockDisplay" + id).css("visibility", "visible");
				}
				document.getElementById("clockDisplay" + id).innerHTML = clockDisplay;
				jq("#timepicker" + id).toggle();
				//jq("#timeselect" + id).toggle();
				jq("#edit" + id).toggle();
				jq("#clockSet" + id).toggle();
				jq("#deleteTask" + id).toggle();
				jq("#confirmCompleted" + id).toggle();
				jq("#confirmClock" + id).toggle();
				jq("#cancelClock" + id).toggle();
				//jq("#clockSet" + id).show();
				jq(".clockChose").hide();
				document.getElementById("timepicker" + id).setAttribute("state", "1");
				document.getElementById("confirmClock" + id).setAttribute("state", "1");
				document.getElementById("cancelClock" + id).setAttribute("state", "1");
			}
		}
	});

	//取消编辑提醒
	jq(".cancelClock").live('click', function() {
		var id = (jq(this).attr("id")).replace(/[^0-9]+/ig, "");
		document.getElementById("clockError" + id).innerHTML = "";
		jq("#timepicker" + id).toggle();
		//jq("#clockSet"+id).toggole();
		//jq("#timeselect" + id).toggle();
		jq("#edit" + id).toggle();
		jq("#clockSet" + id).toggle();
		jq("#deleteTask" + id).toggle();
		jq("#confirmClock" + id).hide();
		jq("#cancelClock" + id).hide();
		jq("#confirmCompleted" + id).toggle();
		jq(".clockChose").hide();
		document.getElementById("timepicker" + id).setAttribute("state", "1");
		document.getElementById("confirmClock" + id).setAttribute("state", "1");
		document.getElementById("cancelClock" + id).setAttribute("state", "1");
	});

	//标记完成
	jq(".confirmCompleted").live('click', function() {
		if (!getCookie("uid")) {
			jq(".loginDiv").hide();
			jq(".registerDiv").hide();
			jq(".remindDiv").slideToggle("slow");
			document.getElementById("remindDiv").innerHTML = "您还没有登录，登录后才能使用！";

		}
		else {
			var id = (jq(this).attr("id")).replace(/[^0-9]+/ig, "");
			var paras = {};
			paras.taskid = id;
			paras.dowhat = 'querytask';
			paras = JSON.stringify(paras);
			para = {
				"jsonstring": paras
			};
			jq.post("../Event.DB.php", para, function(data) {
				//	alert(data);
				rlt = eval("(" + data + ")");
				if (rlt.code == 1) {
					var dateNow = new Date();
					var dateThis = new Date(rlt['data'][0].date);
					//如果当前未完成状态
					if (jq("#" + id).attr("state") == 0) {
						var obj = jq("#" + id).html();
						if (dateThis > dateNow) {
							jq("#future").append("<li id='" + id + "' state='1' onmouseover='showBlock(this.id)' onmouseout='showNone(this.id)'>");
						}
						else {
							jq("#today").append("<li id='" + id + "' state='1' onmouseover='showBlock(this.id)' onmouseout='showNone(this.id)'>");
						}
						if (document.getElementById("completeDate" + id) != null) {
						var objCompleteDate=document.getElementById("completeDate"+id).innerHTML;
						}
						if(titleValue[id]!=undefined){
						    if (document.getElementById("completeDate" + id) !=null) {
							jq("#" + id).remove();
							jq("#"+id).append("<div class='completeDate' id='completeDate" + id + "'></div>").append("<h3 id='clockDisplay" + id + "'style='visibility:hidden;'>00:00</h3>").append("<div class='inline'><img id='clockIcon" + id + "' src='images/icon07.png'></div>").append("<dl><dt><input class='eventClass  eventClass" + id + "' id='event" + id + "' type='text' value='" + titleValue[id] + "' readonly='readonly' size='1' maxlength='20'/></dt></dl>").append("<dl class='dealTask_right' id='editTask" + id + "'><img id='edit" + id + "' class='edit' title='编辑任务' src='images/icon03.png'> <img id='clockSet" + id + "' class='clockSet' title='添加提醒' src='images/icon02.png'> <input type='text' id='timepicker"+id + "' onclick='WdatePicker({dateFmt:\"HH:mm\"})' class='WdatePicker'/> <img id='deleteTask" + id + "' class='deleteTask' title='删除' src='images/icon04.png'> <a href='javascript:void(0)' class='confirmCompleted' id='confirmCompleted" + id + "'>标记完成</a><button id='confirmTask" + id + "' class='confirmTask' type='button'>确定</button><button id='cancelTask" + id + "'class='cancelTask' type='button'>取消</button><button id='confirmClock" + id + "' class='confirmClock' type='button'>确定</button><button id='cancelClock" + id + "' class='cancelClock' type='button'>取消</button><span id='clockError" + id + "' class='clockError'></span></dl>").append("<div class='dealTask_left'><span id='updateComment" + id + "' style='display:none;margin-left:325px;'> <textarea class='commentClass' id='commentClass" + id + "' name='textarea' rows='10' cols='20' style='margin-bottom:-10px;overflow-y:hidden;height:80px;'></textarea><button id='confirmComment" + id + "' class='confirmComment'  type='button'>添加</button><button id='cancelComment" + id + "' class='cancelComment' type='button'>取消</button> </span><pre id='detailComment" + id + "'class='detailComment'></pre><a href='javascript:void(0)' id='editComment" + id + "' class='editComment' style='margin-left:5px;'>编辑备注</a></div>");
						    document.getElementById("completeDate" + id).innerHTML=objCompleteDate;
							jq("#completeDate" + id).show();
						}
						    else{
							jq("#" + id).remove();
							jq("#"+id).append("<div class='completeIcon' id='completeIcon" + id + "'></div>").append("<h3 id='clockDisplay" + id + "'style='visibility:hidden;'>00:00</h3>").append("<div class='inline'><img id='clockIcon" + id + "' src='images/icon07.png'></div>").append("<dl><dt><input class='eventClass  eventClass" + id + "' id='event" + id + "' type='text' value='" + titleValue[id] + "' readonly='readonly' size='1' maxlength='20'/></dt></dl>").append("<dl class='dealTask_right' id='editTask" + id + "'><img id='edit" + id + "' class='edit' title='编辑任务' src='images/icon03.png'> <img id='clockSet" + id + "' class='clockSet' title='添加提醒' src='images/icon02.png'> <input type='text' id='timepicker"+id + "' onclick='WdatePicker({dateFmt:\"HH:mm\"})' class='WdatePicker'/> <img id='deleteTask" + id + "' class='deleteTask' title='删除' src='images/icon04.png'> <a href='javascript:void(0)' class='confirmCompleted' id='confirmCompleted" + id + "'>标记完成</a><button id='confirmTask" + id + "' class='confirmTask' type='button'>确定</button><button id='cancelTask" + id + "'class='cancelTask' type='button'>取消</button><button id='confirmClock" + id + "' class='confirmClock' type='button'>确定</button><button id='cancelClock" + id + "' class='cancelClock' type='button'>取消</button><span id='clockError" + id + "' class='clockError'></span></dl>").append("<div class='dealTask_left'><span id='updateComment" + id + "' style='display:none;margin-left:325px;'> <textarea class='commentClass' id='commentClass" + id + "' name='textarea' rows='10' cols='20' style='margin-bottom:-10px;overflow-y:hidden;height:80px;'></textarea><button id='confirmComment" + id + "' class='confirmComment'  type='button'>添加</button><button id='cancelComment" + id + "' class='cancelComment' type='button'>取消</button> </span><pre id='detailComment" + id + "'class='detailComment'></pre><a href='javascript:void(0)' id='editComment" + id + "' class='editComment' style='margin-left:5px;'>编辑备注</a></div>");
								}
						}
						else{
							    obj=jq("#"+id).html();
							    jq("#" + id).remove();
							    jq("#" + id).append(obj);
							}
						jq("#editComment" + id).css("visibility", "hidden");
						jq("#edit" + id).hide();
						jq("#clockSet" + id).hide();
						//jq("#confirmCompleted"+id).hide();
						//jq("#deleteTask"+id).hide();
						jq("#" + id).attr("state", "1");
						jq("#completeIcon" + id).css("background", "url(images/icon08.png)");
						jq("#confirmCompleted" + id).html("恢复为未完成");
						jq("#event" + id).css("color", "#ccc");
						jq("#completeDate" + id).css("color", "#ccc");
						jq("#detailComment" + id).css("color", "#ccc");
						jq("#clockDisplay" + id).css("visibility", "hidden");
						jq("#clockIcon" + id).attr("src", "images/icon07.png");
						jq("#"+id).trigger("mouseover");
						jq("#"+id).trigger("mouseout");
						var paras = {};
						paras.id = id;
						paras.dowhat = 'finishtask';
						paras = JSON.stringify(paras);
						para = {
							"jsonstring": paras
						};
						//console.log(paras);
						jq.post("../Event.DB.php", para, function(data) {
							console.log(id);
							rt = eval("(" + data + ")");
							if (rt.code == 1) {
								modifyTime(id);
								console.log(id);
								clearTimeout(clock[id]);

								noCompleteThing();
							}
						});

						//如果当前状态为已完成
					} else if (jq("#" + id).attr("state") == 1) {
						jq("#editComment" + id).css("visibility", "visible");
						jq("#edit" + id).show();
						jq("#edit" + id).attr("src", "images/icon03.png");
						jq("#clockSet" + id).show();
						jq("#clockSet" + id).attr("src", "images/icon02.png");
						//jq("#" + id).attr("state", "0");
						jq("#completeIcon" + id).css("background", "#ffffff");
						jq("#confirmCompleted" + id).html("标记完成");
						jq("#event" + id).css("color", "#000");
						jq("#completeDate" + id).css("color", "#4E96F1");
						if (clock != "00:00") {
							jq("#clockDisplay" + id).css("color", "#ccc");
							jq("#clockDisplay" + taskid).css("visibility", "visible");
						}
						jq("#detailComment" + id).css("color", "#888");
						jq("#"+id).trigger("mouseover");
						jq("#"+id).trigger("mouseout");
						var paras = {};
						paras.id = id;
						paras.dowhat = 'recoverfinishedtask';
						paras = JSON.stringify(paras);
						para = {
							"jsonstring": paras
						};
						console.log(paras);
						jq.post("../Event.DB.php", para, function(data) {
							rt = eval("(" + data + ")");
							if (rt.code == 1) {
								noCompleteThing();
								if (dateThis > dateNow) {
									var obj = document.getElementById("future").getElementsByTagName("li");
								}
								else {
									var obj = document.getElementById("today").getElementsByTagName("li");
								}
								var arr = obj[0];
								for (var i = 0; i < obj.length; i++) {
									if (jq("#" + obj[0].id).attr('state') == 1) {
										var ob = jq("#" + id).html();
										jq("#" + id).remove();
										if (dateThis > dateNow) {
											jq("#future h2").after("<li id='" + id + "' state='0' onmouseover='showBlock(this.id)' onmouseout='showNone(this.id)'>");
										}
										else {
											jq("#today h2").after("<li id='" + id + "' state='0' onmouseover='showBlock(this.id)' onmouseout='showNone(this.id)'>");
										}
										jq("#" + id).append(ob);
										break;
									}
									else {
										if (i == 0) {
											continue;
										}
										else {
											var ob = jq("#" + id).html();
											arr = obj[i - 1];
											console.log(arr);
											if (jq("#" + obj[i].id).attr('state') == 1) {
												jq("#" + id).remove();
												console.log(arr);
												//alert(arr.id);
												jq("#" + arr.id).after("<li id='" + id + "' state='0' onmouseover='showBlock(this.id)' onmouseout='showNone(this.id)'>");
												jq("#" + id).append(ob);
												break;
											}
										}
									}
								}

							}
						});
					} else {

						alert("对不起亲爱的，我的程序有问题了,呜呜呜...");
					}
				}
			});
			//location.reload();
		}
	});

	//删除任务
	jq(".deleteTask").live('click', function() {
		if (!getCookie("uid")) {
			jq(".loginDiv").hide();
			jq(".registerDiv").hide();
			jq(".remindDiv").slideToggle("slow");
			document.getElementById("remindDiv").innerHTML = "您还没有登录，登录后才能使用！";

		}
		else {
			var id = (jq(this).attr("id")).replace(/[^0-9]+/ig, "");

			//给服务器传参
			var paras = {};
			paras.id = id;
			paras.dowhat = 'deletetask';
			paras = JSON.stringify(paras);
			para = {
				"jsonstring": paras
			};
			//console.log(paras);
			jq.post("../Event.DB.php", para, function(data) {
				rt = eval("(" + data + ")");
				if (rt.code = 1) {
					noCompleteThing();
					modifyTime(id);
					jq("#" + id).remove();
				}
			});
		}
	});
};

