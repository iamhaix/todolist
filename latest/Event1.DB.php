<?php
   require_once ("DataBase.php");
   require_once ("DB_Instance.php");
   require_once ("User.DB.php");
   
   
   abstract class todolistDb
    {
        /**/
        const TASKTABLE     = 'tasktable';
        const USERTABLE     = 'usertable';
        const FINTASKTABLE  = 'finishedtasktable';
        
        /*添加一条新的任务*/
        public static function addTask( $taskinfo){
                $taskinfo['androiddbid'] = $taskinfo['id'];
                unset($taskinfo['serverdbid']);
                unset($taskinfo['id']);
				unset($taskinfo['dirty']);

				$str1 = mb_strlen($taskinfo['title'],'UTF-8');
				$str2 = mb_strlen($taskinfo['content'], 'UTF-8');

				if( $str1 == 0 || $str1> 20 )
				{
					$response['code']    = 601;
					$response['message'] = "标题不符合规范";
					echo json_encode($response);
					return false;
				}
				if( $str2 >140 )
				{
					$response['code']    = 602;
					$response['message'] = "备注长度超过140字限制";
					echo json_encode($response);
					return false;
				}

                $condition = 'androiddbid = '.$taskinfo['androiddbid'].' AND userid = '.$taskinfo['userid'];
                $table = 'tasktable';
                
				
       
                $myDB = getInstance();
				$result = $myDB->getRowsCount($table,$condition);
                if($result)
				{  
                   return 0;       
				}

                if(false === $myDB->insert(self::TASKTABLE,$taskinfo))
				{   
					$response['code']    = 603;
					$response['message'] = "向数据库插入任务失败";
					echo json_encode($response);
					return false;

                }
				$taskId = $myDB->getInsertId();
				
                return $taskId;
        }
	
		/*向指定任务修改备注*/
        public static function modifyContent( $taskInfo )
        {   
                $myDB = getInstance();
				$content = $taskinfo['content'];
				$condition = 'Where id = '.$taskinfo['id'];
                $str2 = mb_strlen($taskinfo['content'],'UTF-8');

				if( $str2 >140 )
				{
				      $response['code']    = 6;
					  $response['message'] = "备注长度超过限制";
					  echo json_encode($response);
					  return false;
		        }
				
                $result = $myDB->update(self::TASKTABLE,$content,$condition);

                return $result;
        }
		
        /*根据TaskID获取事件的版本号*/
        public static function getTaskUSN( $taskId )
	    {        
                $myDB = getInstance();
		        $data = $myDB->getRows('SELECT  * FROM ' . self::TASKTABLE . ' WHERE Id=' . $taskId); 
		        if( false === $data )
		        { 
			            return false;
			            //错误处理
    
                }
		        if( 0 === count($data) )
		        {       
		        return array();
		        }
		        else
		        {
		        return $data[0][usn];
		        } 
	    }	
        
		/*根据任务ID获取对应事件*/
        public static function getTaskState( $taskId )
        {       
		       
               $myDB = getInstance();
                $data = $myDB->getRows('SELECT  * FROM ' . self::TASKTABLE . ' WHERE Id=' . $taskId);
				
                if( false === $data )
                {
                        return false;
                        //错误处理
                }
                if( 0 === count($data) )
                {
                        return array();
                }
                else{
                        return $data[0][state];
                }
        }
		
	   /*将当前未完成的任务直接在数据库中删除*/
	   public static function delTask($taskid) 
	   {
	       $myDB = getInstance();
		   $condition = 'id = '.$taskid;
		   $result = $myDB->remove(self::TASKTABLE,$condition);
		   return $result;
	   }
	   
	   /*获取当前用户今天未完成任务的数量*/
	   public static function getTodayUnfinishedTask ($uid)
	   {
	       $myDB = getInstance();
		   $condition = ' USERID = ' .$uid . ' AND DATE = date_format(curdate(),"%Y-%m-%d")' . ' AND STATE = 0 order by DATE ';
		   $table = self::TASKTABLE;
		   $result = $myDB->getRowsCount($table, $condition);
		   return $result;
	   }
	   
	   /*批量插入事件列表*/
	   public static function insertBatchTask( $taskinfo ){
	         $myDB = getInstance();
			 $i = 0;
			 foreach($taskinfo as $singletask)
			 {
			    $id = $singletask[id];
				$taskid= todolistDb::addTask( $singletask );
				$result[$i++] = array(
				                   'androiddbid' => $id,
								   'serverdbid'  => $taskid,
				                );
			 }
			 return $result;	 
	   }
	   
	   	/*将版本号设为tasktable所有USN的最大值*/
	   public static function setMaxUSN( $uid )
      {
          $myDB = getInstance();
 		  $sql = 'SELECT max(usn) as max FROM tasktable';
	
		  if (!empty($uid))
		  {
			  $sql .= ' WHERE userid = '.$uid ;
			
		  }
		  $maxusn = $myDB->getRows($sql);
		  if ($maxusn === false)
		  {   
		      $response['code']    = 12;
              $response['message'] = "获取tasktable最大USN失败";
              echo json_encode($response); 
			  return false;
		  }
		  $max = $maxusn[0][max];
		  $sql = 'update usertable set updatecount = '.$max .' where uid = '.$uid;
		  $result = $myDB->execSql($sql);
		  if(!$result){
		      $response['code']    = 12;
              $response['message'] = "修改最大USN失败";
              echo json_encode($response); 
		  }
		  return $max;
      } 
	  
	   /*获取今天以及即将的任务列表*/
       public static function getBatchTask( $uid )
        {       
                
                $myDB = getInstance();
			
                $data = $myDB->getRows('SELECT  * FROM ' . self::TASKTABLE . ' WHERE USERID = ' .$uid . ' AND DATE = date_format(curdate(),"%Y-%m-%d") AND STATE = 0 order by createtime');
                if( false === $data )
                {
                        return false;
                        //错误处理
                }    
				$data1 = $myDB->getRows('SELECT  * FROM ' . self::TASKTABLE . ' WHERE USERID = ' .$uid . ' AND DATE = date_format(curdate(),"%Y-%m-%d") AND STATE = 1 order by edittimestamp');
                if( false === $data1 )
                {
                        return false;
                        //错误处理
                }    
                $data2 = $myDB->getRows('SELECT  * FROM ' . self::TASKTABLE . ' WHERE USERID = ' . $uid .' AND DATE > date_format(curdate(),"%Y-%m-%d") AND STATE = 0 order by date');
                if( false === $data2 )    
                {
                        return false;
                        //错误处理
				}

                $data3 = $myDB->getRows('SELECT  * FROM ' . self::TASKTABLE . ' WHERE USERID = ' . $uid .' AND DATE > date_format(curdate(),"%Y-%m-%d") AND STATE = 1 order by date');
                if( false === $data3 )    
                {
                        return false;
                        //错误处理
				}
                $result = array(
                                 'todaydata' => $data,
								 'todayfinishdata' => $data1,
								 'futuredata' => $data2,
								 'futurefinishdata' => $data3,
                        );
                return $result;    
        }

        /*使用$taskInfo对TaskID事件进行更新*/
        public static function updateTask( $taskId,$taskInfo )
	    {   
		       $myDB = getInstance();  
		       $ret = $myDB->update( self::TASKTABLE, $taskInfo ,' Id = ' . $taskId );
		       if( false === $ret )
		       { 
			         return false; 
		       }
               else
               { 
                     return true;	
               }
	    }

		
		/*在已完成的列表中获取最近一段时间已完成的任务*/
		public static function getFinishTask( $taskinfo )
		{
		        $myDB = getInstance();
				$uid  = $taskinfo[uid];
				$query= $taskinfo[query];
				switch($query)
				{
				   case "recently":
				      $date = $taskinfo[date];
				      switch( $date ){
					    case "昨天":
						$data = $myDB->getRows('SELECT  * FROM ' . self::FINTASKTABLE . ' WHERE USERID = ' .$uid . ' AND DATE = subdate ( curdate(), interval 1 day ) order by DATE desc');
						break;
						case "最近一周":
						$data = $myDB->getRows('SELECT  * FROM ' . self::FINTASKTABLE . ' WHERE USERID = ' .$uid . ' AND DATE = subdate ( curdate(), interval 1 week ) order by DATE desc');
						break;
						case "最近一月":
						$data = $myDB->getRows('SELECT  * FROM ' . self::FINTASKTABLE . ' WHERE USERID = ' .$uid . ' AND DATE = subdate ( curdate(), interval 1 month ) order by DATE desc');
						break;
					  }
				   break;
				   case "appoint":
				      $date  = $taskinfo[date];
					  $year  = $date['year'];
					  $month = $date['month'];
					  
					  $data = $myDB->getRows('SELECT  * FROM ' . self::FINTASKTABLE . ' WHERE USERID = ' .$uid . ' AND year(DATE) = '.$year . 'AND month(DATE) = '.$month.' order by DATE desc');
					  return $data;
				   break;
				   default:
				      $data = $myDB->getRows('SELECT  * FROM ' . self::FINTASKTABLE . ' WHERE USERID = ' .$uid );
					  return $data;
				   break;
				}
		      
		}
    } 

   /*----------------------------------------------------Task_Operation-----------------------------------------------*/
   function check_array($param)
   {
	   foreach ( $param as $k => $v )
	   {
		   $param[$k] = check_input($v);
	   } 
	   return $param;
   }
   
   /*获取事件相关参数*/
    if ( isset($_POST['jsonstring']))
    {
      $str = $_POST['jsonstring'];  
      $str =  stripslashes($str);
      $Param = gbJsonDecode($str);

   }
		
    /*获取事件操作类型*/
    switch( $Param['dowhat'] )
   {
     case "modifytask":
         modifyTask($Param);
     break;
     case "createtask":
         createTask($Param);
     break;
	 case "finishtask":
         finishTask($Param);
     break;
	 case "deletetask":
         deleteTask($Param);
     break;
	 case "nocompletething":
	     noCompleteThing($Param);
	 break;
	 case "addcontent":
	     addContent($Param);
		 break;
	 case "addknocktasks":
		 addKnockTasks($Param);
		 break;
	 case "gettodayandfuturetasks":
	     getTodayAndFutureTasks($Param); 
     break;
	 case "getfinishedtasks":
	      getFinishedTasks($Param);
	 break;
	 case "synchtask":
	       synchTask($Param);
	 break;
	 case "recoverfinishedtask":
	       recoverFinishedTask($Param);
	 break;
	 case "addandroidid":
		 addAndroidId($Param);
	 break;
	 case "querytask":
	     queryTask( $Param ); 
	 break;
    }    

   /*--------------------------------------------Task_Function--------------------------------------------------------------------*/
	/*创建任务*/

	function queryTask( $Param )
	{
		$id  = $Param['taskid'];
		$sql = 'select * from tasktable where id = '.$id;
		$myDB = getInstance();
		$ret = $myDB->getRows($sql);
	   
		if($ret){
	      $response['data']  = $ret;
          $response['code']    = 1;
          $response['message'] = "查询任务成功";
          echo json_encode($response);
        }
        else 
        {  
          $response['code']    = 22;
          $response['message'] = '查询任务失败';
		  echo json_encode($response);
	    }
	}
         
   function createTask( $Param ){
     
	   $taskinfo = $Param;
	  $id = $taskinfo['id'];
      unset( $taskinfo['dowhat'] );
      $taskid = todolistDb::addTask($taskinfo);

      if($taskid)
      {
         $response['code']    = 1;
		 if($id)
		 {
		       $response['taskid'] =array(
		            'androidid' => $id,
					'serverdbid'=> $taskid,
		       );
	     }
         else{
		
            $response['taskid']  = $taskid;
		 }
		 
         $response['message'] = "添加任务成功";
         echo json_encode($response); 
      }
      else
      {
         $response['code']    = 608;
         $response['message'] = "添加任务失败";
         echo json_encode($response);
      }
   }   
   
   /*批量创建任务 for android*/
   function insertBatchTask($Param ){
   
      $taskinfo = $Param;
      unset( $taskinfo['dowhat'] );
      $ret = todolistDb::insertBatchTask( $taskinfo );
	  if($ret){
	      $response['idmap']  = $ret;
          $response['code']    = 1;
          $response['message'] = "修改任务成功";
          echo json_encode($response);
       }
      else 
       {  
          $response['code']    = 22;
          $response['message'] = '修改任务失败';
          echo json_encode($response);
         
       }  
   }
   /*编辑任务*/ 
   function modifyTask( $Param ){

		  
	  $taskInfo = $Param;
      unset( $taskInfo['dowhat'] );
      $taskId = $taskInfo['id'];
      unset( $taskInfo['id'] );

	  $USN = todolistDb::getTaskUSN( $taskId );
      $USN = $USN + 1;
      $taskInfo['USN'] = $USN;
      $ret = todolistDb::updateTask( $taskId, $taskInfo );
       
       if($ret){
	   
	      $sql = 'select * from tasktable where id = '.$taskId;
          $param = 'userid';
		  $uid = UserDB::getParam($sql,$param); 
		  todolistDb::setMaxUSN($uid);

		  $param = 'androiddbid';
		  $androiddbid = UserDB::getParam($sql,$param); 

		  
		  $response['androiddbid'] = $androiddbid;
		  $response['usn'] = $USN;
          $response['code']    = 1;
          $response['message'] = "修改任务成功";
          echo json_encode($response);
       }
      else 
       {  
          $response['code']    = 7;
          $response['message'] = '修改任务失败';
          echo json_encode($response);
         
       }
    }  
 
  /*标记已完成*/
  function finishTask( $Param ) 
  {
     
      $taskInfo = $Param;  
      unset( $taskInfo['dowhat'] ); 
      $taskId = $taskInfo['id'] ;  
      unset( $taskInfo['id'] );
	  $time = date('Y-m-d H:i:s',time());
	  $taskinfo['edittimestamp'] = $time;

      $state = todolistDb::getTaskState( $taskId );
      if( $state ==0 )
       {   
	       $USN = todolistDb::getTaskUSN( $taskId );
           $USN = $USN +1;
           $taskInfo['usn'] = $USN;
           $taskInfo['State'] = 1;
           $ret = todolistDb::updateTask( $taskId, $taskInfo );
           if($ret){
		   
		       $sql = 'select * from tasktable where id = '.$taskId;
               $param = 'userid';
			   $uid = UserDB::getParam($sql,$param);  
			   todolistDb::setMaxUSN($uid);

			   $param = 'androiddbid';
			   $androiddbid = UserDB::getParam($sql,$param);

			   $response['usn']     = $USN;
			   $response['androiddbid'] = $androiddbid;
               $response['code']    = 1;
               $response['message'] = '任务完成';
               echo json_encode($response);
           }
           else{   
               $response['code']    = 9;
               $response['message'] = '任务失败';
               echo json_encode($response);
           }
   
       }
       else{
             $response['code']    = 9;
             $response['message'] = '任务已经完成';
             echo json_encode($response);
       }
      
   }

  /*删除已完成的任务*/
  function deleteTask($Param ){
      $taskInfo = $Param;
      unset( $taskInfo['dowhat'] );
      $taskId = $taskInfo['id'];
      unset( $taskInfo['id'] );
     
     $state = todolistDb::getTaskState( $taskId );
     
     if( $state == 1 ){

           $taskInfo['State'] = 2;
		   $USN = todolistDb::getTaskUSN( $taskId );
           $USN = $USN +1;
           $taskInfo['usn'] = $USN;
           $ret = todolistDb::updateTask( $taskId, $taskInfo );
		
           if($ret){
		   
		       $sql = 'select * from tasktable where id = '.$taskId;
               $param = 'userid';
			   $uid = UserDB::getParam($sql,$param);
			   
			   todolistDb::setMaxUSN($uid);
               
			   $param = 'androiddbid';
			   $androiddbid = UserDB::getParam($sql,$param);

			   $response['usn']     = $USN;
			   $response['androiddbid'] = $androiddbid;
               $response['code']    = 1;
               $response['message'] = '任务标识完成已删除';
               echo json_encode($response);
           }
           else{
               $response['code']    = 9;
               $response['message'] = '删除任务成功失败';
               echo json_encode($response);
           }
      }
     else if( $state ==0 )
	 {   
	     $ret = todolistDb::delTask($taskId);
		 if($ret)
		 {
           $response['code']    = 1;
           $response['message'] = '任务在数据库中被删除';
           echo json_encode($response);
		 }
		 else{
		       $response['code']    = 9;
               $response['message'] = '删除任务成功失败';
               echo json_encode($response);
		 }
     }
	 else{
	        $response['code']    = 9;
            $response['message'] = '此情况下任务不能被删除';
            echo json_encode($response);
	 }
  }

  /*恢复已完成事件 即state的状态为1时将其变为0*/
  function recoverFinishedTask($Param)
  {
      
      $taskinfo = $Param;
      unset( $taskInfo['dowhat'] );
      $taskid = $taskinfo['id'];
      unset( $taskInfo['id'] );
	 $state = todolistDb::getTaskState( $taskid );

	 if( $state == 1)
	 {
	    $sql['state'] = 0;
	    $USN = todolistDb::getTaskUSN( $taskid );
        $USN = $USN +1;
		$sql['usn'] = $USN;

		$time = date('Y-m-d H:i:s',time());
		$sql['edittimestamp'] = $time;

		$ret = todolistDb::updateTask( $taskid, $sql );
		
		if($ret)
		{ 
           $sql = 'select * from tasktable where id = '.$taskid;
		   $param = 'androiddbid';
		   $androiddbid = UserDB::getParam($sql,$param);
			  
		   $response['usn']     = $USN;
		   $response['androiddbid'] = $androiddbid;
		   
           $response['code']    = 1;
           $response['message'] = '已完成任务被恢复';
           echo json_encode($response);
		 }
		 else{
		       $response['code']    = 9;
               $response['message'] = '已完成任务恢复失败';
               echo json_encode($response);
		 }
	 }
	 else{
	           $response['code']    = 9;
               $response['message'] = '此状态下不允许恢复任务';
               echo json_encode($response);
	 }
  }
  
  /*向指定的任务添加备注*/
  function addContent($Param)
  {
      $taskinfo = $Param;
	  $taskId = $taskinfo['id'];
      unset( $taskinfo['id'] );
	  
	  $USN = todolistDb::getTaskUSN( $taskId );
      $USN = $USN +1;
      $taskinfo['usn'] = $USN;
	  $ret = todolistDb::updateTask( $taskId,$taskinfo );
	  
      if($ret){
	  
	      $sql = 'select * from tasktable where id = '.$taskId;
          $param = 'userid';
		  $uid = UserDB::getParam($sql,$param);  
		  
		  todolistDb::setMaxUSN($uid);

		  
		  $param = 'androiddbid';
		  $androiddbid = UserDB::getParam($sql,$param);
		      
	      $response['usn']     = $USN;
		  $response['androiddbid'] = $androiddbid;
          $response['code']    = 1;
          $response['message'] = '添加备注成功';
		  
          echo json_encode($response);
       }
      else{
          $response['code']    = 8;
          $response['message'] = '添加备注失败';
          echo json_encode($response);
       }
  }
  
 
  
  /*获取今天未完成事件的数量*/
  function noCompleteThing($Param)
  {  
   
      $uid  = $Param['uid'];
      $ret = todolistDb::getTodayUnfinishedTask($uid); 
	 if($ret>0){
	        $response['count']   = $ret;
            $response['code']    = 1;
            $response['message'] = '获取今天未完成任务成功';
            echo json_encode($response);
	 }else if ($ret == 0){
		 $response['count']   = 0;
		$response['code']    = 1;
		 $response['message'] = '获取今天未完成任务成功';
		 echo json_encode($response);
	 }
     else{   
            $response['code']    = 20;
            $response['message'] = '获取今天未完成任务失败';
            echo json_encode($response);
        }
  }
  
  
  /*为指定用户获取今天以及将来的任务列表*/
  function getTodayAndFutureTasks($Param)
  {    
      $uid    = $Param['uid'];
      $data = todolistDb::getBatchTask($uid);
	  if ($data){
	      $response['data'] = $data;
		  $response['code']    = 1;
          $response['message'] = '获取今天和即将任务成功';
		  echo json_encode($response);
	       
	  }
	  else{
	    
		  $response['code']    = 18;
          $response['message'] = '获取今天未完成任务失败';
		  echo json_encode($response);
	  }
  }
  
  
  /*获取已完成任务列表，按最近时间排序*/
  function getFinishedTasks($Param)
  {
      $data = todolistDb::getFinishTask($Param);
	  if ($data){
	      $response['code'] = 1;
          $response['message'] = '获取已完成任务成功';
		  $response['data'] = $data;
		  echo json_encode($response);
	       
	  }
	  else{
	      $response['code'] = 11;
          $response['message'] = '获取已完成任务失败';
	      echo json_encode($response);
	  }
  } 

  function addKnockTasks($param)
  { 
	  unset($param['dowhat']);
	  $uid = $param['uid'];
      
	  $sql = 'select id,title,remindtimestamp from tasktable where userid = '.$uid.' AND time(REMINDTIMESTAMP) != 0 AND DATE = curdate() and REMINDTIMESTAMP < now() AND state = 0';
	 // echo $sql;
	  $myDB = getInstance();
	  $data = $myDB->getRows($sql);
	  $before = $data;

	  $sql = 'select id,title,remindtimestamp from tasktable where userid = '.$uid.' AND time(REMINDTIMESTAMP) != 0 AND DATE = curdate() and REMINDTIMESTAMP > now() AND state = 0';
	  $data = $myDB->getRows($sql);
	  $after = $data;

	  $data = array(

		  'before' => $before,
		  'after'  => $after,
	  );
	  $response['code'] = 1;
	  $response['message'] = "获取闹钟事件成功";
	  $response['data'] = $data;
	  echo json_encode($response);
  }

  /*更新添加到客户端的id号*/
  function  addAndroidId($param)
  {
     
     unset($param['dowhat']);
	 $taskid = $param['serverdbid'];
	 $androiddbid = $param['id'];
	 
	 $myDB = getInstance();
	 $sql = 'update tasktable set androiddbid = '.$androiddbid.' where id = '.$taskid;
	 
	 $result = $myDB->execSql($sql);
	 
     if ($result){
	      
		  $response['code']    = 1;
          $response['message'] = '更新android id成功';
		  echo json_encode($response);
	       
	  }
	  else{
	    
		  $response['code']    = 30;
          $response['message'] = '更新android id 失败';
		  echo json_encode($response);
	  }
  }
  
  /*同步选择函数*/
  function synchTask($param)
  {
     
     $lastupdatecount = $param['lastupdatecount'];
	 $uid = $param['uid'];                                   
	 $mylastupdatecount = UserDB:: getUSN( $uid );
	 FullSync($param);
  }


  /*同步函数*/
  function FullSync($taskinfo)
  {
     $myDB = getInstance();
	 $uid = $taskinfo['uid'];
	 $init_flag = $taskinfo['init'];
	 unset($taskinfo['init']);
	 if( $init_flag )
	 {
		 $sql = 'update tasktable set androiddbid = 0 where userid = '.$uid;
		 $result = $myDB->execSql($sql);
	 }
	 
     /*(1)获取在server数据库中存在，但在android数据库中不存在的未完成、已完成（state=0,1）任务列表*/
	 $data1 = $myDB->getRows('SELECT  * FROM   tasktable  WHERE USERID = '.$uid.' AND ANDROIDDBID = 0 AND STATE != 2');
	
	 $add_to_android = $data1;

	 /*(2)获取android端传递的今天以及即将的任务列表*/
	 $index = 0;
	 $index1 = 0;
	 $index2 = 0;
	 $index3 = 0;
	 
	 $android_datas = $taskinfo['datas'];
	 /*编列android传过来的每一个Task*/
	 //print_r($android_datas);
	 foreach ($android_datas as $single_data)
	 {  
	    /*获取android Task中的serverdbid,判断该ID是否存在tasktable中*/
		$serverdbid = $single_data['serverdbid'];
		
        //print_r($single_data);
		$condition = 'id = '.$serverdbid;
		$table = 'tasktable';
        $myDB = getInstance();
        $result = $myDB->getRowsCount($table,$condition);
		//echo "<<<<<".$result.">>>>>>>";
		/*若id不存在tasktable中，即result的值为NULL*/
		if(!$result)
		{
		   /*(2.1)若事件的serverdbid属性不为空，说明该事件曾经上传到数据库，则说明该事件被web端删除*/
	
		   if( $serverdbid ) 
		   {
		      /*将被删除的的android事件id记录到数组del_andoidid中*/
		      $delete_from_android[$index++] = $single_data['id'];
		   }
		   /*事件从没有上传到数据库，说明任务是android端新增加的，需上传其到server数据库中*/
		   else
		   {     
		         /*去除参数中 dirty serverdbid id 属性，添加androiddbid属性*/
		          $Param = $single_data;
				  $androiddbid = $Param['id'];
                 
				  /*将事件插入到数据库，并在add_androidid中记录 androidid<->数据库id的对应值*/
				  $id = todolistDb::addTask($Param);
				  if(!$id)
				  {
					    continue;
				  }
				  $add_to_server[$index1++] =array(
				       'androiddbid' => $androiddbid,
					   'serverdbid'  => $id,
				   ); 
		   }
		}
		/*若tasktable中已存在对应是task，任务在android端数据库和server端数据库中都存在*/
		else 
		{  
		   /*获取数据库中该事件task的版本号*/
		   $usn = todolistDb::getTaskUSN($serverdbid);
		   if( $single_data['usn'] == $usn )
		   {  
		     // print_r($single_data);
		      /*两端有相同的USN，android端dirty标记为0，即上次同步到现在两端都没有操作过，不动。*/
		      if(!$single_data['dirty'])
			  {
			    continue;
			  }
			  /*有相同的USN，但是android上其dirty不为0，即上次同步到现在，android端对其进行了操作（修改、标记完成或删除），将其上传到server数据库中。*/
			  else 
			  {  
			     if( $single_data['dirty'] == 2 )
				 {  
			         $Param = $single_data;
				     unset($Param ['dirty']);
				     unset($Param ['serverdbid']);
				     unset($Param ['id']);

				     /*上传到数据库，将其对应的版本号+1*/
                     $ret = todolistDb::updateTask( $serverdbid, $Param );
				     if(!$ret)
				     {
				         $response['code']    = 7;
                         $response['message'] = '修改任务失败';
                         echo json_encode($response);
					     return false;
				     }
			     }
			     if( $single_data['dirty'] == 3)
			     {
				    $Param = $single_data;
				    $serverdbid = $Param['serverdbid'];
					
				    $sql = 'delete from tasktable where id = '.$serverdbid;
				    $myDB = getInstance();
				    $result = $myDB->execSql($sql);
			     }  
			 }
		  }

		  /*Server上该任务的USN > android上该任务的USN，并且android上的该任务dirty标记为0，即上次同步到现在，server端对其进行了操作，
		    将server数据中的该任务更新到android端数据库中*/
		  else if( $single_data['usn'] < $usn && !$single_data['dirty'])
		  {  
		      $res = $myDB->getRows('SELECT  * FROM   tasktable  WHERE ID = ' .$serverdbid);
			  $update_to_android[$index2++] = $res[0];
		  }
		  /*Server上该任务的USN > android上该任务的USN，并且android上的该任务dirty标记不为0，即上次同步到现在，server端和android端都对其进行了操作,冲突*/
		  else if( $single_data['usn'] < $usn && $single_data['dirty'])
		  {   
		      
		      $res = $myDB->getRows('SELECT  * FROM   tasktable  WHERE ID = ' .$serverdbid);
			  $conflict_task[$index3++]=$res[0];
		  }
		 
		}
    }

	 $datas = array(
	    'add_to_android' => $add_to_android,
		'add_to_server'  => $add_to_server,
		'delete_from_android' => $delete_from_android,
		
		'update_to_android' => $update_to_android,
		'conflict_task' => $conflict_task,
	);
	// print_r($datas);

	 $var = array_filter($datas);
	 
	 if(!empty($var))
	 {
		 $max = todolistDb::setMaxUSN($uid);
		$time = UserDB::setFullSyncBefore($uid);
	    
		$sql = 'update tasktable set usn = '.$max.' where userid = ' .$uid;
        $myDB = getInstance();
		$result = $myDB->execSql($sql);
		if(!$result)
		{   

		    $response['code']    = 12;
            $response['message'] = "修改USN失败";
            echo json_encode($response);
            return false; 
		}
        
	    
		$final_result = array(
		  
		  'lastupdatecount' => $max,
		  'lastsynctime' => $time,
		  'code' => 0,
		  'message' => "成功",
		  'datas' => $datas,
	    );

	    echo json_encode($final_result);
	 }

	 else
	 {
	   $final_result = array(
		  'code' => 25,
		  'message' => "最新版本不需更新",
	    );
	    echo json_encode($final_result);
	 }
	 
  }

  $Param =array(
	           'uid' => 62,
			   'datas' => array ( 
 			                      '0' => Array ( 'id' => 45,
                  								 'serverdbid' => 0 ,
												 'userid' => 62 ,
												 'title' => 'zzzzzzzzz',
												 'content' =>'',
												 'edittimestamp' => '2013-08-23 14:41:00',
												 'remindtimestamp' => '0000-00-00 00:00:00',
												 'date' => '2013-08-28' ,
												 'state' => 1,
												 'createtime' => '2013-08-23 14:41:00',
												 'usn' => 0 ,
												 'dirty' => 0,), 

								'1' => Array (   'id' => 3 ,
								                 'serverdbid' => 1698 ,
												 'userid' => 62 ,
												 'title' => "my goasdbb",
												 'content' =>'',
												 'edittimestamp' => '2013-08-23 14:42:00',
												 'remindtimestamp' => '0000-00-00 00:00:00' ,
												 'date' => '2013-08-28' ,
												 'state' => 0 ,
												 'createtime' => '2013-08-23 14:42:00' ,
												 'usn' => 2 ,
												 'dirty' => 2,),

							/* '1' => Array (   'id' => 9 ,
								                 'serverdbid' => 0 ,
												 'userid' => 1 ,
												 'title' => "yyyyyyyyyyyyyyyyyyy",
												 'content' =>'',
												 'edittimestamp' => '2013-08-23 14:42:00',
												 'remindtimestamp' => '0000-00-00 00:00:00' ,
												 'date' => '2013-08-28' ,
												 'state' => 0 ,
												 'createtime' => '2013-08-23 14:42:00' ,
												 'usn' => 0 ,
												 'dirty' => 0,),*/
								 ),
	        );
 // FullSync($Param);
