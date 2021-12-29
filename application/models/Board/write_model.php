<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Write_model extends MY_Model {

    public function __construct()
    {
        // Call the Model constructor
        parent::__construct();
    }
    
    //게시글 작성
    public function insertBoard($aParam = array())
    {
        $sSql = "
            INSERT INTO
                board
            SET
                bo_grpno   = (SELECT IFNULL(MAX(bo_grpno) + 1, 1) FROM board b),
                bo_seq     = 0,
                bo_depth   = 1,
                bo_parent  = null,
                bo_title   = '".escape_string($aParam['bo_title'])."',
                bo_writer  = '".escape_string($this->session->userdata('session_id'))."',
                bo_content = '".escape_string($aParam['bo_content'])."',
                bo_sec     = '".escape_string($aParam['bo_sec'])."',
                bo_pw      = '".escape_string($aParam['bo_pw'])."',
                bo_date    = NOW()
        ";
        
        $bResult = $this->excute($sSql, 'exec');
        
        $iCurrentNo = "";
        if ($bResult === true) {
            $iCurrentNo = $this->getLastInsertId();
        }
        
        return $iCurrentNo;
    }
    
    //last_insert_id
    private function getLastInsertId()
    {
        $sSql = "SELECT LAST_INSERT_ID() FROM board";
        
        $aData = $this->excute($sSql, 'row');
        return $aData['LAST_INSERT_ID()'];
    }
}
