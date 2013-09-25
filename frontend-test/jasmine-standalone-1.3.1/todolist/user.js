//=============================================
//用户对象
//里面包含用户的各种操作，如登陆注册验证等
//
//=============================================

base.include('todolist/msg.js');
var	user = {};
		

	/*
	 *检查邮箱是否有效，1、检测格式；2、是否已注册
	 *
	 */
user.isRightFormat = function(type, str){
		
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