<?php
class coreResourceTest extends coreResourceAbstract  
{
    private static $instance;
    
    /**
     * 데이터 베이스 접속하기 위한 DSN 정보를 리턴해줍니다.
     */
    public static function getInstance($sSql = '')
    {
        //singleton
        if(!isset(self::$instance)) {
            self::$instance = new self();
        }
        
        return self::$instance->getDsn($sSql);
    }
    
    public function getDsn($sSql)
    {     
        $aDsn = array_merge($this->aDbConfig['default'], $this->aDbConfig['user_info']['USER_TEST']);
        $aDsn['hostname'] = $this->aDbConfig['db_info']['DB_TEST'];        
        
        return $aDsn;
    }

}