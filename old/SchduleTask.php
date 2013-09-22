<?php
  require_once ("DataBase.php");
  require_once ("DB_Instance.php");
  

/*分析函数，提出想已完成事件表插入所需的信息*/
function insertToFinishTable($items)
  {
        $sFields = '';
		$sValue  = '';
		$item = $items[0];
		
		unset($item[id]);
		unset($item[androiddbid]);
		
        $table = finishedtasktable;
		$keyList = array();
		foreach ($item as $k => $v){
			$sFields .= $k.',';
			$keyList[] = $k;
		}
		$len = count($keyList);
		foreach ($items as $item){
			$sTmp = '';
			for ($i = 0; $i < $len; $i++){
				$v = $item[$keyList[$i]];
				$sTmp .= "'".$v."',";
			}
            $sTmp  = preg_replace( "/,$/", "", $sTmp );
			$sValue .='(' .$sTmp. '),';
		}

        $sFields = preg_replace( "/,$/", "", $sFields );
		$sValue  = preg_replace( "/,$/", "", $sValue );

		$str = 'INSERT INTO '.$table.' ('.$sFields.') VALUES '.$sValue.'';
        return  $str;		
  }
  
  /*定时任务，每天23:40将未完成列表中已完成的任务更新到已完成数据库*/
  function scheduleTask($uid)
  {   
	  $myDB = getInstance();
      $data = $myDB->getRows('SELECT  * FROM ' . tasktable . ' WHERE  DATE < date_format(curdate(),"%Y-%m-%d") AND STATE != 0 AND userid = '.$uid );
	  $var = array_filter($data);
	  if(!empty($var))
	  {
         $result = insertToFinishTable($data);
	     $myDB->execSql($result);
	  }

	  $condition = ' DATE < date_format(curdate(),"%Y-%m-%d") AND STATE != 0 AND userid = '.$uid;
	  $data = $myDB->remove("tasktable",$condition);

	  $sql = 'update tasktable set DATE = date_format(curdate(),"%Y-%m-%d") , REMINDTIMESTAMP = 0 , EDITTIMESTAMP = now() , USN = USN+ 1  WHERE  DATE < date_format(curdate(),"%Y-%m-%d") AND STATE = 0 AND userid = '.$uid;
	  $myDB->execSql($sql); 
  }


  if ( isset($_POST['jsonstring']))
  {
		  $str = $_POST['jsonstring'];
		  $str =  stripslashes($str);
		  $Param = gbJsonDecode($str);
          scheduleTask($Param[uid]);
  }
?>
