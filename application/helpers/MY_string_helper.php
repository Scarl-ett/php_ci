<?php
    error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED & ~E_USER_DEPRECATED);
    
    /**
     * String 관련 Helper 확장 합니다.
     * 
     * function test() {
     * } 
     * Helper는 클래스를 선언하지 않고 위와 같이 함수만 정의 합니다.
     * Core의 Helper를 재정의 할 수 있습니다.
     * 
     * @author junhan Lee <junes127@gmail.com>
     */
    
    /**
     * 랜덤 문자열을 생성합니다.
     * @param type $length
     * @return 
     */
    function GenerateString($length)  
    {  
        $characters  = "0123456789";  
        $characters .= "abcdefghijklmnopqrstuvwxyz";  
        //$characters .= "ABCDEFGHIJKLMNOPQRSTUVWXYZ";  
    
        $string_generated = "";  
    
        $nmr_loops = $length;  
        while ($nmr_loops--)  
        {  
            $string_generated .= $characters[mt_rand(0, strlen($characters))];  
        }  
    
        return $string_generated;  
    }  
    
    /**
     *  MySQL에서 SELECT 시 문자셋이 EUC-KR인 경우 json_encode() 로 JSON 형식으로 변환시 null 로 변환되는 문제가 발생한다. 
     *  JSON이 UTF-8을 채택하고 있기 때문에...
     */
    function json_encode_euckr($aData)
    {
        $tmp = obj_change_charset($aData, 'utf-8', true);
        $tmp = json_encode( $tmp );
        return $tmp;
    }
    
    function json_decode_euckr($aData) 
    {
        $tmp = obj_change_charset($aData, 'utf-8', true);
        $tmp = json_decode( $tmp, true );
        obj_change_charset( $tmp, 'euc-kr' );
        return $tmp;
    }    
    
    function &obj_change_charset(&$obj, $tocharset = 'utf-8', $clone = false) 
    {
        $obj_tmp = NULL;
        if ($clone) {
            $obj_tmp = is_object($obj) ? clone $obj : $obj;
        }else{
            $obj_tmp =& $obj;
        }
    
        switch ( gettype($obj_tmp) ) {
            case 'string' :
                //$obj_tmp = mb_convert_encoding( $obj_tmp, $tocharset, mb_detect_encoding( $obj_tmp ) ); //짧은 값은 제대로 인식하지 못함..
                if ('euc-kr'==$tocharset) {
                    $obj_tmp = ToEucKr($obj_tmp);
                }else{
                    $obj_tmp = ToUTF8($obj_tmp);
                }
                break;
            case 'array':
                foreach ($obj_tmp as &$val) {
                    $val = obj_change_charset( $val, $tocharset, $clone );
                }
                break;
            case 'object':
                $object_vars = get_object_vars( $obj_tmp );
                foreach ($object_vars as $key=>$val) {
                    $obj_tmp->$key = obj_change_charset( $val, $tocharset, $clone );
                }
                break;
        }
    
        return $obj_tmp;
    }    
    
    function ToEucKr($val)
    {
        return iconv("UTF-8","euc-kr//IGNORE",$val );
    }
    
    function ToUTF8($val)
    {
        return iconv("euc-kr","UTF-8//IGNORE",$val );
    }    
    
    /**
     * mysql_escape_string
     * 
     * @param unknown $str
     * @return mixed
     */
    function escape_string($str) {
        return str_replace(array('\\', "\0", "\n", "\r", "'", '"', "\x1a"), array('\\\\', '\\0', '\\n', '\\r', "\\'", '\\"', '\\Z'), $str);
    }
    
    function euckrCutString($str, $start, $end, $tailmark=''){
        $strcnt = strlen($str);
        $result = substr($str, $start, $end); // 일단 문자열을 자른다.
        preg_match('/^([\x00-\x7e]|.{2})*/', $result, $string); // 한글어설프게 잘릴 때 뒤에 오는 ?를 제거
        
        if($strcnt > $end){ 
            return $string[0].$tailmark;
        } else { 
            return $string[0];
        }
    }
    
    function isEmpty($val)
    {
        if (!isset($val) || is_null($val) || ($allow_ws == false && trim($val) == "" && !is_bool($val)) || ($allow_false === false && is_bool($val) && $val === false) || (is_array($val) && empty($val))) {
            return true;
        } else {
            return false;
        }
    }    
        