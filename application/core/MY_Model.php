<?php
/**
 * 모델 확장합니다.
 * 모든 모델은 이 클래스를 상속 받아야 합니다.
 * 
 * @author junhan Lee <junes127@gmail.com>
 */
class MY_Model extends CI_Model
{
    protected $ci = null;
    
    private $db_conn = null;
    
    public function __construct()
    {
        $this->ci =& get_instance();
        
        parent::__construct();
    }
    
    /**
     * 다중 데이터베이스 접속
     * @see CI_Model::__get()
     */
    /*
    function __get($name)
    {
        # 싱글톤 패턴으로 동일한 객체의 중복 생성을 막고 Static 하게 생성
        foreach (get_object_vars($this) as $CI_object_name => $CI_object)
        {
            
            if (is_object($CI_object) && is_subclass_of(get_class($CI_object), 'CI_DB') && $CI_object_name == $name)
            {
                return $CI_object;
            }
        }
        
        $this->$name = $this->load->database($name, TRUE);
        
        return $this->$name;
    }
    */
    
    protected function excute($sSql = '', $sType = 'rows', $sPrefix = null)
    {
        $aDsn = $this->getDsn($sSql, $sPrefix);
        
        if(!empty($aDsn))
        {
            $this->db_conn = $this->getDbInstance($aDsn);
        
        } else {
            
            throw new Exception('Select Query : aDsn can not be empty !');
            
        }        
        
        return $this->_excute($sSql, $sType);
    }
    
    private function _excute($sSql = '', $sType = 'rows')
    {
        if (empty($sSql)) return false;
        
        if ($this->isSelect($sSql) === true) {
            if ($sType == 'rows') {
                return $this->db_conn->query($sSql)->result_array();
            } else if ($sType == 'row') {
                return $this->db_conn->query($sSql)->row_array();
            } else {
                throw new Exception('Select Query : sType can not be exec or empty !');
            }
        } else {
            
            if ($sType == 'exec') {
                return $this->db_conn->query($sSql);
            } elseif ($sType == 'proc') {
                return $this->db_conn->query($sSql);
            } else {
                throw new Exception('Insert/Update/Delete Query : sType can not be row or rows !');
            }
        }
    }
    
    private function isSelect($sSql = '') {
        $bSelect = true;
        if(substr(trim(strtolower($sSql)),0,6) != "select")
        {
            $bSelect = false;
        }
    
        return $bSelect;
    }    
    
    private function getDsn($sSql = '', $sPrefix = null)
    {
        // Facade Pattern 패턴을 이용하여 단순화 처리함 
        $aDsn = coreResourceTest::getInstance($sSql);
        
        if (empty($aDsn) || empty($aDsn['hostname'])) {
            throw new Exception('Undefiend Prefix !!!');
        }

        return $aDsn;
    }
    
    private function getDbInstance($aDsn = array())
    {
        $prefix = str_replace(".", "", $aDsn['hostname'])."_".$aDsn['database'];

        foreach (get_object_vars($this->ci) as $CI_object_name => $CI_object)
        {
        
            if (is_object($CI_object) && is_subclass_of(get_class($CI_object), 'CI_DB') && $CI_object_name == $prefix)
            {
                return $CI_object;
            }
        }        
        
        $this->ci->{$prefix} = $this->ci->load->database($aDsn, TRUE);
        
        return $this->ci->{$prefix};
    }

    /**
     * Insert Query문을 만들어줍니다.
     *
     */
    public function getInsertQuery($table, $aData)
    {
        if(empty($aData)) return false;
    
        $sFields = "";
        $sValues = "";
    
        foreach($aData as $field => $value)
        {
            $sFields.= $field.",";
            $sValues.= self::checkValue($value).",";
        }
        return "INSERT INTO ".$table." (".substr($sFields, 0, -1).") VALUES (".substr($sValues, 0, -1).")";
    }
    
    /**
     * Update Query문을 만들어줍니다.
     *
     */
    public static function getUpdateQuery($table, $aData, $sWhere="")
    {
        $str = "";
        if(!count($aData)) return;
        
        foreach($aData as $field => $value)
        {
            $str .= $field." = ".self::checkValue($value).",";
        }
        
        return "UPDATE ".$table." SET ".substr($str, 0, -1)." ".($sWhere ? " WHERE ".$sWhere : "");                       
    }    
    
    private static function checkValue($value){

        //예외처리
        if($value == "null" || strtolower($value) == "now()"){
            return $value;
        }
        
        switch (strtolower(gettype($value))){
            case 'string':
                settype($value, 'string');
                $value = "'".escape_string($value)."'";
                break;
            case 'integer':
                settype($value, 'integer');
                break;
            case 'double' || 'float':
                settype($value, 'float');
                break;
            case 'boolean':
                settype($value, 'boolean');
                break;
            case 'array':
                $value = "'".escape_string($value)."'";
                break;
        }
        
        return $value;      
    }    
}