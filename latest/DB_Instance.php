<?php
   
    /*加载DataBase文件，并防止多次加载*/
    require_once ("DataBase.php");
	
   
    /*记录数据库相关信�*/
    $mysqlDB = array(
            'IP_PORT' => '127.0.0.1',
                 'DB' => 'f9db',
               'USER' => 'f9db',
             'PASSWD' => 'f9db',
          );
    
    /*创建数据库连接实�*/
    $myDB=new DB($mysqlDB['IP_PORT'], $mysqlDB['DB'], $mysqlDB['USER'], $mysqlDB['PASSWD']);

    /*返回数据库对象，为user.db.php返回数据库对�*/
    function getInstance(){
         
          global $myDB;      
          return $myDB;
       
      }
    function gbJsonDecode( $data ){
            $data = str_replace("\r\n", "", $data);
            $data = str_replace("\t", "", $data);
            $data = mb_convert_encoding($data, "UTF-8","auto");
            $data = json_decode($data, true);
            return empty($data) ? "" : _gbJsonDecode( $data );
        }
   function _gbJsonDecode( $data ){
            if( is_array( $data) ){
                  $res = array();

                  foreach( $data as $key => $value)
                  $res[$key] =_gbJsonDecode( $value );
                        return $res;
                }
                else
                        return mb_convert_encoding($data,  "UTF-8","auto");
        }
?>
