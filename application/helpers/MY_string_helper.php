<?php
    error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED & ~E_USER_DEPRECATED);
    
    /**
     * String ���� Helper Ȯ�� �մϴ�.
     * 
     * function test() {
     * } 
     * Helper�� Ŭ������ �������� �ʰ� ���� ���� �Լ��� ���� �մϴ�.
     * Core�� Helper�� ������ �� �� �ֽ��ϴ�.
     * 
     * @author junhan Lee <junes127@gmail.com>
     */
    
    /**
     * ���� ���ڿ��� �����մϴ�.
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
     *  MySQL���� SELECT �� ���ڼ��� EUC-KR�� ��� json_encode() �� JSON �������� ��ȯ�� null �� ��ȯ�Ǵ� ������ �߻��Ѵ�. 
     *  JSON�� UTF-8�� ä���ϰ� �ֱ� ������...
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
                //$obj_tmp = mb_convert_encoding( $obj_tmp, $tocharset, mb_detect_encoding( $obj_tmp ) ); //ª�� ���� ����� �ν����� ����..
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
        $result = substr($str, $start, $end); // �ϴ� ���ڿ��� �ڸ���.
        preg_match('/^([\x00-\x7e]|.{2})*/', $result, $string); // �ѱ۾���� �߸� �� �ڿ� ���� ?�� ����
        
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
        