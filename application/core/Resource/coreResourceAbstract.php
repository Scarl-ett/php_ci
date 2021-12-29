<?php
/**
 * DSN  Data Source Name을 받아가기 위한 추상 클래스
 * 데이터베이스 리소스를 받아가기 위한 추상 클래스입니다.
 * 
 * @author  이준한
 * @package common 
 */
abstract class coreResourceAbstract 
{
    protected $aDbConfig = array();
    
    function __construct()
    {        
        $this->aDbConfig = $this->getDbConfig();
    }
    
    /**
     * Data Source Name을 받아가기 위한 추상화 메소드
     * 이 메소드에 각각의 구성을 작성해 주십시요.
     */
    abstract function getDsn($sSql);
    
    
    /**
     * $sDb   : DB Prefix
     * $sUser : USER Prefix
     */
    protected function getDbConfig() {
        
        // Is the config file in the environment folder?
        if ( ! defined('ENVIRONMENT') OR ! file_exists($file_path = APPPATH.'config/'.ENVIRONMENT.'/database.php'))
        {
            if ( ! file_exists($file_path = APPPATH.'config/database.php'))
            {
                show_error('The configuration file database.php does not exist.');
            }
        }
        
        include $file_path;
        
        if ( ! isset($db) OR count($db) == 0)
        {
            show_error('No database connection settings were found in the database config file.');
        }        
        
        return array(
            'default'   => $db['default'],
            'user_info' => $user_info,
            'db_info'   => $db_info,
            'web_db_link' => $web_db_link
        );
    }
    
    protected function getBalancing($sSql)
    {
                
        if ($this->isSelect($sSql) === true) {
            
            // 실패시
            $cur_DB = 'DB_MAIN';
            
            // 접속 가중치 설정
            $exp_microtime_slave = explode(" ",microtime());
            $web_connect = $exp_microtime_slave[1] % 10;
            
            if ($web_connect > 4) {
                $LV_NUM = 0;
            }else{
                $LV_NUM = 1;
            }
            
            
            if(file_exists("/home/server_moniter/DB_LOAD_INFO.inc")) { //디비 로드정보 파일이 있는 경우에만 작동
        
                $web_name = $_SERVER['SERVER_ADDR'];
                
                $cur_DB = $this->aDbConfig['web_db_link'][$web_name][$LV_NUM]; // web1 = db1, web3 = db3
                
                include "/home/server_moniter/DB_LOAD_INFO.inc";
        
                if ($DB_LOAD_INFO[$cur_DB] > 5) { //load가 5이상일경우 로드밸런싱
                    $cur_DB = $min_load;
                }
        
            }
            
            return $this->aDbConfig['db_info'][$cur_DB];
        
        } else {

            return $this->aDbConfig['db_info']['DB_MAIN'];
            
        }        
    }
    
    protected function isSelect($sSql) {
        
        $bSelect = true;
        if(substr(trim(strtolower($sSql)),0,6) != "select")
        {
            $bSelect = false;
        }
        
        return $bSelect;
    }    
    
}
