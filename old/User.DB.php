<?php

require_once ("DataBase.php");
require_once ("DB_Instance.php"); 

abstract class UserDB{

   
   
   const userTB='usertable';
    
    /*向数据库中添加用户信息*/	
    public static function addUser( $userinfo )
	{    
        $myDB = getInstance();
		$userinfo['isactive'] = 0;
		$userinfo['islogin']  = 0;
		$userinfo['isopeniconwarn'] = 1;
		$userinfo['fullsyncbefore'] = 0;
		$userinfo['updatecount'] = 0;

		$d=strtotime('15 days');
		$registerdate = date("Y-m-d",$d);
		$userinfo['registerdate'] = $registerdate;

	    $ret = $myDB->insert(self::userTB, $userinfo);
		$taskId = $myDB->getInsertId();
		return $taskId;
	} 
	
	
     /*根据用户ID获取用户的名称*/
    public static function getUserById($uid)
    {
        $myDB = getInstance();
        $ret = $myDB->getRows('SELECT * FROM ' . self::userTB . ' WHERE uid = '.$uid);  
	    if( false === $ret )
	    {   
                echo "Uid is not exsit!"; 
		return false; 
	    }	
	    if( 0 === count($ret) )
	    { 
		return array();
	    }
	    else
	    { 
		return $ret[0][username];
	    } 

   }
   
   /*根据用户ID设置激活状态*/
   public static function setActive($uid)
   {
      $sql = 'update usertable set isactive = 1 where uid = ' .$uid;
	  $myDB = getInstance();
	  $result = $myDB->execSql($sql);
	  if( $result ){
		  
		  	$response['code']    = 1;
            $response['message'] = "激活成功";
            
			return true;
		  
		}
		else{
		    $response['code']    = 14;
            $response['message'] = "激活失败";
            
			return false;
		}
	  
   }

   public static function setRegisterDate($uid)
   {
		 $sql = 'update usertable set registerdate = 0 where uid = ' .$uid;
		 $myDB = getInstance();
		 $result = $myDB->execSql($sql);
		 if( $result ){

			  $response['code']    = 1;
			  $response['message'] = "更新注册时间成功";
			      
	          return true;
		 }
	     else{
		     $response['code']    = 14;
		     $response['message'] = "更新注册时间失败";
				  
			 return false;
	     	 } 
  }

    
    /*根据用户名称获取用户的ID*/
    public static function getIDByName( $userName )
	{   
	    $myDB = getInstance();	
        $ret = $myDB->getRows('SELECT * FROM ' . self::userTB . " WHERE username ='{$userName}'"); 
		if( false === $ret )
		{      
            echo "userName is not exist!"; 
			return false;
		}	 
		if( 0 === count($ret) )
		{ 
			return array();
		}
		else
		{ 
			return $ret[0][uid];
		} 
	}
	
	/*获取sql语句搜索记录中指定的参数*/
    public static function getParam( $sql ,$param)
	{   
	    $myDB = getInstance();	
        $ret = $myDB->getRows($sql); 
		if( false === $ret )
		{      
            echo "param is not exist!"; 
			return false;
		}	 
		if( 0 === count($ret) )
		{ 
			return array();
		}
		else
		{ 
			return $ret[0][$param];
		} 
	}
	
	/*获取当前登录的状态*/
    public static function getLogState( $userName )
	{   
	    $myDB = getInstance();	
        $ret = $myDB->getRows('SELECT * FROM ' . self::userTB . " WHERE username ='{$userName}'"); 
		if( false === $ret )
		{      
            echo "userName is not exist!"; 
			return false;
		}	 
		if( 0 === count($ret) )
		{ 
			return array();
		}
		else
		{ 
			return $ret[0][islogin];
		} 
	}
	
    /*根据邮箱名称获取用户的ID*/
    public static function getIDByEmail( $Email )
   {
        $myDB = getInstance();
        $ret = $myDB->getRows('SELECT * FROM ' . self::userTB . " WHERE Email ='{$Email}'");
        if( false === $ret )
        {
            echo "userName is not exist!";
            return false;
        }
        if( 0 === count($ret) )
        {
            return array();
        }
        else
        {   
            return $ret[0][uid];
        }
    }
     
     /*更新用户存储在数据库中的信息*/
     public static function updateUserData( $uid, $userInfo )
	{      
        $myDB = getInstance();
		$ret = $myDB->update( self::userTB, $userInfo, " uid = $uid ");
		if( false === $ret )
		{       
            echo "updateUserData() is Error!"; 
			return false; 
		}	 
		$ret = self::getUserById($uid); 
		if( false === $ret)
		{
			return false;
		}
		return $ret; 
	}
	
     /*根据用户的ID获取用户是否被激:活*/
     public static function getStateById( $uid )
    {
        $myDB = getInstance();
        $ret = $myDB->getRows('SELECT * FROM ' . self::userTB . " WHERE uid = $uid ");
        if( false === $ret )
        {
            echo "Uid is not exsit!";
            return false;
        }
        if( 0 === count($ret) )
        {
            return array();
        }
        else
        {   
		    
            return $ret[0][isactive];
        }
    }
      /*根据用户的ID获取用户Email地址*/
    public static function getEmailById( $uid )
    {
        $myDB = getInstance();
        $ret = $myDB->getRows('SELECT * FROM ' . self::userTB . " WHERE uid = $uid ");
        if( false === $ret )
        {
           echo "Uid is not exsit!";
           return false;
        }
        if( 0 === count($ret) )
        {
           return array();
        }
        else
        {
            return $ret[0][email];
        }
    } 
	 
    /*获取版本号*/
    public static function getUSN( $uid )
    {
        $myDB = getInstance();
        $ret = $myDB->getRows('SELECT * FROM ' . self::userTB . " WHERE uid = $uid");
        if( false === $ret )
        {
           echo "Uid is not exsit!";
           return false;
        }
        if( 0 === count($ret) )
        {
           return array();
        }
        else
        {  
            return $ret[0][updatecount];
        }
    } 
	
    /*设置同步时间*/
	public static function setFullSyncBefore($uid)
	{   
	   
	    $sql = 'update usertable set fullsyncbefore = now() where uid = '.$uid;
		$myDB = getInstance();
		$result = $myDB->execSql($sql);
		if(!$result){
		    $response['code']    = 12;
            $response['message'] = "修改最近同步时间失败";
            echo json_encode($response); 
		}
		
		$sql = 'select fullsyncbefore from usertable where uid ='.$uid;
		$ret = $myDB->getRows($sql);
		if( false === $ret )
        {
           echo "Uid is not exsit!";
           return false;
        }
        if( 0 === count($ret) )
        {
           return array();
        }
        else
        {
            return $ret[0][fullsyncbefore];
        }
	}
	
    /*判断用户名是否在数据库中存在*/
    public static function isNameExist( $userName )
      {
             $myDB = getInstance();
             $ret = $myDB->getRows('SELECT * FROM ' . self::userTB . " WHERE username='{$userName}'");
                if( false === $ret )
                {
                        echo "error";
                        return false;
                }
                if( 0 === count($ret) )
                {
                        return 0;
                }
                else
                {
                        return 1;
                }
      }
    /*判断邮箱是否已经被使用*/
    public static function isEmailExist( $Email )
      {
             $myDB = getInstance();
             $ret = $myDB->getRows('SELECT * FROM ' . self::userTB . " WHERE Email='{$Email}'");
                if( false === $ret )
                {
                        echo "error";
                        return false;
                }
                if( 0 === count($ret) )
                {
                        return 0;
                }
                else
                {
                        return 1;
                }
      }
	  
	 /*比较函数，判断密码是否存在*/
     public static function isPasswdExist( $passwd )
      {
             $myDB = getInstance();
             $ret = $myDB->getRows('SELECT * FROM ' . self::userTB . " WHERE Password='{$passwd}'");
                if( false === $ret )
                {
                        echo "error";
                        return false;
                }
                if( 0 === count($ret) )
                {
                        return 0;
                }
                else
                {
                        return 1;
                }
      }
	  
	  /*判断用户ID是否存在*/
      public static function isUserIDExist( $userid )
      {
             $myDB = getInstance();
             $ret = $myDB->getRows('SELECT * FROM ' . self::userTB . " WHERE Uid = $userid");
                if( false === $ret )
                {
                        echo "error";
                        return false;
                }
                if( 0 === count($ret) )
                {
                        return 0;
                }
                else
                {
                        return 1;
                }
      }
	 
	 /*检查Email的格式*/
	  public static function isEmail($email)
	  {

            if(preg_match("/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/",$email )){
			  
			   return 1;
            }      
			else{
               return 0;
            }
      }
  
  }
/***************************************User Operation*****************************************/

if ( isset($_POST['jsonstring']))
  {
      $str = $_POST['jsonstring'];  
      $str =  stripslashes($str);
      $Param = gbJsonDecode($str);
     
  }

switch($Param['dowhat'])
  {
     case "register":
         register($Param);
     break;
	 case "login":
	     login($Param);
	 break;
	 case "logout":
	     logout($Param);
	 break;
	 case "modifyname":
	     modifyName( $Param );
	 break;
	 case "modifypasswd":
	    modifyPasswd($Param);
	 break;
  }    
/********************************************User Function**************************************/

   /*注册新用户*/
   function register($Param)
   {  
	  require_once ("lib/base.php");
	   $userinfo = $Param;
	   unset( $userinfo['dowhat']);
       $username= str_replace(" ","", $userinfo["username"]);
       $emailaddr= str_replace(" ","", $userinfo["email"]);
       
	   $ret0= UserDB::isEmail($emailaddr);	
	   $ret2= UserDB::isEmailExist($emailaddr);
	   if(!$ret0)
	   {
		   $response['code'] = 1;
		   $response['message'] = "邮箱格式不正确";
		   echo json_encode($response);
		   return false;
	   }

	   if($ret2)
	   {
		   $response['code'] = 1;
		   $response['message'] = "邮箱已经被注册";
		   echo json_encode($response);
		   return false;
	   }
  
	   if( $emailaddr != $username )
        { 
          $response['code']    = 1;
          $response['message'] = "邮箱用户名不匹配";
          echo json_encode($response);
          return false;  
        }
     
     $query = UserDB::addUser( $userinfo );

     if( $query ){
	 
	      $response['code']    = 0;
          $response['message'] = "注册成功";
		  $response['userid']  = $query;
		  
	    $key = "soeasymailkey";
		$safeEmail = Base::authcode($emailaddr, "ENCODE", $key, 86400);//激活期限一天
		$urlEnSafeEmail = urlencode($safeEmail);
		
		
		$link = "<a href='http://10.16.15.88:8083/todolist/lib/activation.php?code=$urlEnSafeEmail'>http://10.16.15.88:8083/todolist/lib/activation.php?code=$urlEnSafeEmail</a>";
		Base::smtp_send_mail($emailaddr,"激活soeasy账号","您好，请点击这里激活您的soeasy账号：".$link,"soeasy官方");
        
		echo json_encode($response); 
    }
  }
  
  
  /*用户登录*/
  function login($Param)
  {
     
	   $userinfo = $Param;
	   unset($userinfo['dowhat']);
       $passwd = $userinfo['password'];
       $username = $userinfo['username'];	 
      
	   $ret = UserDB::isEmail($username);
	   if( $ret )
	   {
	       $ret1 = UserDB::isEmailExist($username);
		   if( !$ret1 )
		   {
		       $response['code']    = 4;
               $response['message'] = "该邮箱尚未注册";
               echo json_encode($response); 
		       return false;
		    }
			$sql = 'SELECT * from usertable where Email = '.'"'.$username.'"';
	   }
	   else
	   {
	     $ret1 = UserDB::isNameExist($username);
	     if( !$ret1 )
         {  
		      $response['code']    = 3;
              $response['message'] = "用户名不存在";
              echo json_encode($response);
              return false;			  
         }
		 $sql = 'SELECT * from usertable where username = '.'"'.$username.'"';
	   }
	  
	   $param = "isactive";
	   $isactive = UserDB::getParam($sql,$param);
	  
	   $logway = $userinfo['logway'];
	   if(!$logway)
	   {  
		   $response['code']    = 4;
		   $response['message'] = "选择一种登录方式";
		   echo json_encode($response);
		   return false;	
       }
	  
	   if( !$isactive )
	   {
	      if($logway == 2)
		  {
			  $param = "registerdate";
			  $registerdate = UserDB::getParam($sql,$param); 
			  $today = date("Y-m-d");

			  $d1 = strtotime($registerdate);
			  $d2 = strtotime($today);

			  if( $d1 > $d2 )
			  {
				 ;
			  }
              else 
			  {
				  $response['code']    = 2;
				  $response['message'] = "账号未激活”";
				  echo json_encode($response);
				  return false;
			  }

	      }
	      else
		  {
	          $response['code']    = 2;
              $response['message'] = "账号未激活”";
              echo json_encode($response);
		      return false;
		  }
	   }
	
       $sql = 'SELECT * from usertable where username = '.'"'.$username.'"';
	   $param = "password";
	   $password = UserDB::getParam($sql,$param);
	  
	   if( $password != $passwd )
	   {
	     $response['code']    = 5;
         $response['message'] = "密码错误";
         echo json_encode($response);
         return false;   
	   }
	
	   $logstate = UserDB::getLogState($username);
	   $logway = $userinfo['logway'];
	
	  
	   $param = "uid";
	   $uid = UserDB::getParam($sql,$param);
	 
	   $response['uid']    = $uid;
	   $response['code']    = 0;
       $response['message'] = "登录成功";
	   $response['username'] = $username;
	   
       echo json_encode($response); 
   }

  
  /*退出登录*/
  function logout($Param){
     $userinfo = $Param;
	 unset($userinfo['dowhat']);
     $logway = $userinfo['logway'];
	 $username = $Param['username'];  /*********************************************/
         
     $response['code']    = 0;
     $response['message'] = "退出登录成功";
	 $response['username'] = $username;
     echo json_encode($response); 
	
       
  }
  
  
  /*修改用户名*/
  function modifyName( $Param )
  {
    $userinfo = $Param;
	unset($userinfo['dowhat']);
	
	$username = $userinfo['username'];
	$userid =  $userinfo['uid'];  /**************************************************************/
	
	if( strlen($username)<3 || strlen($username)>16)
	{
	   $response['code']    = 4;
       $response['message'] = "该用户名不符合要求";
       echo json_encode($response); 
	   return false; 
	}
	$ret1 = UserDB::isNameExist($username);
	if( $ret1 )
	{
		$response['code']    = 4;
        $response['message'] = "该用户名存在";
        echo json_encode($response); 
		return false;
	}
	else
	{   

	    $sql = 'update usertable set username = '.'"'.$username .'"'.'where uid = ' .$userid;
		$myDB = getInstance();
		$result = $myDB->execSql($sql);
		if( $result ){
		  
		  	$response['code']    = 1;
            $response['message'] = "修改昵称成功";
            echo json_encode($response); 
		  
		}
		else{
		    $response['code']    = 12;
            $response['message'] = "修改昵称失败";
            echo json_encode($response); 
		}
		
	}
	
  }
  
  /*修改密码*/
  function modifyPasswd ($Param){
     
	 $userinfo = $Param;
     $oldpasswd = $userinfo['oldpasswd'];
	 $newpasswd = $userinfo['newpasswd'];
	 $userid =  $userinfo['uid'];  /**************************************************************/
	 
	 $ret = UserDB::isPasswdExist($oldpasswd);
	 if($ret)
	 {
	    $sql = 'update usertable set password = '.'"'.$newpasswd .'"'.'where uid = ' .$userid;
		$myDB = getInstance();
		$result = $myDB->execSql($sql);
		if( $result ){
		  
		  	$response['code']    = 1;
            $response['message'] = "修改密码成功";
            echo json_encode($response); 
		  
		}
		else{
		    $response['code']    = 14;
            $response['message'] = "修改密码失败";
            echo json_encode($response); 
		}
	    
	 }
	 else
	 {
	    $response['code']    = 13;
        $response['message'] = "旧密码输入错误";
        echo json_encode($response); 
	    
	 }
	 
  }
/*   $param = array(
     'username' => 'haix',
	 'password' => '12312',
	 'logway'   => 1,
  );
  login($param); */

?>
