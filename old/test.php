<?php
$d=strtotime('15 days');
$time = date("Y-m-d",$d);
$today = date("Y-m-d");

$d1 = strtotime($time);
$d2 = strtotime($today);

if(1)
{ if(1)
  {
	  if($d1<$d2)
	  {
		  ;
	  }
	  else
	  {
		  echo "error1";
		  return false;
	  }
  }
  else
  { 
	  echo "error2";
	  return false;
  }
}

echo "is am here";
?>
