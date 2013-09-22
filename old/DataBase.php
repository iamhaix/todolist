<?php   

class DB
{
      
    	private $host_port; /*数据库机器ip：端口号  @var  string*/

	
	    private $user;      /* 用户名      @var string*/
        private $password;  /* 密码        @var string*/ 

	    private $db_name;   /*数据库名称    @var string*/
        private $con;       /*数据库连接    @var object*/

	
	/*构造函数，初始化成员变量，并建立数据库连接*/
	public function __construct($host_port, $db_name, $user, $password)
	{
		$this->host_port = $host_port;
		$this->db_name = $db_name;
		$this->user = $user;
		$this->password = $password;  
		
        $this->con=mysql_connect( $this->host_port, $this->user,              
        $this->password) or die("不能连接到数据库服务器！可能是数据库服务没有启动，或者用户名密码有误!".mysql_error());
            
             $db_selected=mysql_select_db($this->db_name,$this->con);
             if(!$db_selected){
                echo "数据库选择失败";
             }

	}

	/*析构函数*/
	public function __destruct()
	{
	    if ($this->con) {
		   return mysql_close($this->con);
		}
		return true;
	}
     

   /*****************************CREATE TABLE*************************************/
      
       /*数据库建立数据表*/ 
       public function createTable($sql)
       {
          
           $this->checkConnection(); 
           return $this->execSql($sql);
          
       }
        /*关闭数据库连接*/
       public function closeDB()
        {
                if ($this->con) {
                        return mysql_close($this->con);
                }
                return true;
        }

        /*检查数据库连接,是否有效*/
       public function checkConnection()
        {
                if (!mysql_ping($this->con))
                {
                        $this->closeDB();

                }
                return true;
        }

   /******************************INSERT*******************************************/
    
       /*获取$data中key-value值，拼接inser 语句*/
	private function getInsertString($table, $data)
	{
		$k_str = '';
		$v_str = '';
		foreach ($data as $k => $v)
		{
			$k_str .= $k.",";
			$v_str .= "'".$v."',";
		}
                
                /*去除表达式最后一个，例如(key1,key2,)处理后变成(key1,key2)*/               
                $k_str = preg_replace( "/,$/", "", $k_str );
		$v_str = preg_replace( "/,$/", "", $v_str );

		$str = 'INSERT INTO '.$table.' ('.$k_str.') VALUES('.$v_str.')';
		return $str;
	}

       /*mysql_insert函数封装*/
	public function insert($table, $data)
	{   
		$sql = $this->getInsertString($table, $data); 
		//echo $sql;
		return $this->execSql($sql);
	}

     /*----------------------BATCH INSERT---------------------------*/
	/*将多个insert函数拼装成单一insert实现批量insert处理*/
       private function getBatchInsertString($table, $items)
	{
		$sFields = '';
		$sValue  = '';
		$item = $items[0];
		

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
		return $str;
	}

	public function batchInsert($table, $items)
	{
		$sql = $this->getBatchInsertString($table, $items);
		return $this->execSql($sql);
	}
   /****************************************UPDATE***********************************/

	/* 根据参数拼装update的sql语句*/
	private function getUpdateString($table, $data, $condtion)
	{
		$str = '';
		foreach ($data as $k => $v)
		{
			$str .= $k."='".$v."',";
		}
		$str = preg_replace("/,$/", "", $str);
    	    $sql = 'UPDATE '.$table.' SET '.$str;
    	    if (!empty($condtion) && is_string($condtion))
    	    {
    		$sql .= ' WHERE '.$condtion;
    	     }
		return $sql;
	}

	public function update($table, $data, $condition)
	{   
		$sql = $this->getUpdateString($table, $data, $condition);
        //echo $sql;		
		return $this->execSql($sql);
	}

   /***************************INSERT OR UPDATE*********************************/

	/*拼装insert or update的sql语句 */
	private function getInsertOrUpdateString($table, $idata, $udata)
	{
		$k_str = '';
		$v_str = '';
		$u_str = '';

		foreach ($idata as $k => $v)
		{
			$k_str .= $k.",";
			$v_str .= "'".$v."',";
		}

                $k_str = preg_replace( "/,$/", "", $k_str );
		$v_str = preg_replace( "/,$/", "", $v_str );

		foreach ($udata as $k => $v)
		{
			$u_str .= $k."='".$v."',";
		}

               $u_str = preg_replace("/,$/", "", $u_str);

    	$sql = 'INSERT INTO '.$table.' ('.$k_str.') VALUES('.$v_str.') ON DUPLICATE KEY UPDATE '.$u_str;

		return $sql;
	}

   public function insertOrUpdate($table, $insert_array, $update_array)
	{
    	$sql = $this->getInsertOrUpdateString($table, $insert_array,  $update_array);
    	return $this->execSql( $sql );
	}

  /**************************************DELETE**********************************/

     	public function remove($table, $condtion)
	{
		$sql = 'DELETE FROM '.$table.' WHERE '.$condtion;
		return $this->execSql($sql);
	}

  /*************************mysql_query**********************************/
   /*执行相应的sql语句*/
	public function execSql($sql)
	{   
	    //echo $sql;
		$result = mysql_query($sql,$this->con);
		if($result === false){
			echo "create table flase";
			return false;
		}
        else
            return true;
	}
 /**************************数据库其他函数*******************************/
   
   /*数据库选择函数*/
   public function selectDB($db_name){
		return mysql_select_db($this->con, $db_name);
	}
   /**/
   /** 返回上一步insert产生的ID*/
   public function getInsertId()
	{
		return mysql_insert_id($this->con);
	}

   /*获取上一操作受影响的行数*/
     public function  getAffectedRows()
	{
		return mysql_affected_rows($this->con);
	}	

  /* 根据查询sql语句获得指定的数据 */
	public function getRows($sql)
	{   
		$result = mysql_query($sql,$this->con);
		if(!$result)
		{
	      return array();
		}
		$data = array();
		while ($row = mysql_fetch_assoc($result))
		{
		    $ret = array_change_key_case($row,CASE_LOWER);
			$data[] = $ret;
		}
		mysql_free_result($result);
		return $data;
	}

   /* 获得满足条件的记录数量*/
	public function getRowsCount($table, $condtion)
	{   
	    
		$sql = 'SELECT count(*) as sum FROM '.$table;
	
		if (!empty($condtion))
		{
			$sql .= ' WHERE '.$condtion;
			
		}
		//echo $sql;
		$data = $this->getRows($sql);
		if ($data === false)
		{
			return false;
		}
		//echo "sum=".$data[0]['sum'];
		return ((count($data)<0) ? 0 : $data[0]['sum']);
	}

	/* 直接返回结果集*/
	public function getRS($sql) {
	
       //echo $sql;	
       $result = mysql_query($sql,$this->con);
	  // echo $result;
	   if($result === false)
        {
		   return false;

		}
		
		return $result;
		
	}
 } 
?>
