<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Reply_model extends MY_Model {

    public function __construct()
    {
        // Call the Model constructor
        parent::__construct();
    }
    
    //부모글 확인
    public function selectParentBoard($aParam = array())
    {
        $sSql = "
            SELECT
                a.bo_no,
                a.bo_sec,
                a.bo_grpno,
                a.bo_seq,
                a.bo_depth,
                a.bo_pw,
                a.bo_title,
                a.bo_content,
                a.bo_writer,
                b.user_name,
                DATE_FORMAT(a.bo_date, '%Y-%m-%d') bo_date
            FROM
                board a
                INNER JOIN user b
                ON (a.bo_writer = b.user_id)
            WHERE
                bo_no = ".escape_string($aParam['no'])." AND
                bo_del = 'N'
            GROUP BY
                bo_no,
                bo_sec,
                bo_grpno,
                bo_seq,
                bo_depth,
                bo_pw
        ";
        
        $aData = $this->excute($sSql, 'row');
        return $aData;
    }
    
    //답글 달기 - 그룹내 순서 변경
    public function updateBoardSeqs($aBoParams = array())
    {
        $sSql = "
            UPDATE board
            SET
                bo_seq = bo_seq + 1
            WHERE
                bo_grpno = ".escape_string($aBoParams['iBoGrpno'])." AND
                bo_seq > ".escape_string($aBoParams['iParentSeq'])
        ;
        
        return $this->excute($sSql, 'exec');
    }
    
    //reply insert
    public function insertReply($aParam = array(), $aBoParams = array())
    {
        $sSql = "
            INSERT INTO
                board
            SET
                bo_grpno   = ".escape_string($aBoParams['iBoGrpno']).",
                bo_seq     = ".escape_string($aBoParams['iBoSeq']).",
                bo_depth   = ".escape_string($aBoParams['iBoDepth']).",
                bo_parent  = ".escape_string($aParam['no']).",
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
