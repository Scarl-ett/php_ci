<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class User_common_model extends MY_Model {

    public function __construct()
    {
        // Call the Model constructor
        parent::__construct();
    }
    
    //user Á¶È¸
    public function selectUser($aParam = array())
    {
        $sSql = "
            SELECT 
                user_id,
                user_pw,
                user_name
            FROM 
                user 
            WHERE 
                user_id = '".escape_string($aParam['user_id'])."'
        ";
        
        $aData = $this->excute($sSql, 'row');
        return $aData;
    }
}