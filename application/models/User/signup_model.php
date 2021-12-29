<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Signup_model extends MY_Model {

    public function __construct()
    {
        // Call the Model constructor
        parent::__construct();
    }
    
    //user insert
    public function insertUser($aParam = array(), $sEncode = "", $sUserEmail = "")
    {
        $sSql = "
            INSERT INTO
                user
            SET
                user_id    = '".escape_string($aParam['user_id'])."',
                user_pw    = '".$sEncode."',
                user_name  = '".escape_string($aParam['user_name'])."',
                user_email = '".$sUserEmail."',
                user_tel   = '".escape_string($aParam['user_tel'])."',
                user_zip   = '".escape_string($aParam['user_zip'])."',
                user_addr1 = '".escape_string($aParam['user_addr1'])."',
                user_addr2 = '".escape_string($aParam['user_addr2'])."',
                user_dt    = NOW()
        ";
        
        return $this->excute($sSql, 'exec');
    }
}