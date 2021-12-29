<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Lists_model extends MY_Model {

    public function __construct()
    {
        // Call the Model constructor
        parent::__construct();
    }
    
    //��ü ����Ʈ ���� ��ȸ
    public function selectTotalRecord($sSearchType = "", $sSearchWord = "")
    {
        //�˻�����
        $sSearch = "";
        if (!empty($sSearchWord)) { //�˻��ܾ ���� ��
            if (empty($sSearchType)) { //�˻������� ��ü�϶�
                $sSearch = "
                    AND (
                        a.bo_title LIKE '%".escape_string($sSearchWord)."%' OR
                        a.bo_writer LIKE '%".escape_string($sSearchWord)."%' OR
                        b.user_name LIKE '%".escape_string($sSearchWord)."%' OR
                        a.bo_content LIKE '%".escape_string($sSearchWord)."%')
                ";
            } else if ($sSearchType == "bo_writer") {
                $sSearch = "
                    AND (
                        a.bo_writer LIKE '%".escape_string($sSearchWord)."%' OR
                        b.user_name LIKE '%".escape_string($sSearchWord)."%')
                ";
            } else {
                $sSearch = "
                    AND ".escape_string($sSearchType)."
                    LIKE '%".escape_string($sSearchWord)."%'
                ";
            }
        }
        
        $sSql = "
            SELECT
                COUNT(*) AS cnt
            FROM
                board a
                INNER JOIN user b
                ON (a.bo_writer = b.user_id)
            WHERE
                1=1
                ".$sSearch
        ;
        
        $aData = $this->excute($sSql, 'row');
        return $aData['cnt'];
    }
    
    //�Խñ� ��ȸ
    public function selectBoardList($iScreenSize = 10, $aPagingVar = array(), $sSearchType = "", $sSearchWord = "")
    {
        //�˻�����
        $sSearch = "";
        if (!empty($sSearchWord)) { //�˻��ܾ ���� ��
            if (empty($sSearchType)) { //�˻������� ��ü�϶�
                $sSearch = "
                    AND (
                        a.bo_title LIKE '%".escape_string($sSearchWord)."%' OR
                        a.bo_writer LIKE '%".escape_string($sSearchWord)."%' OR
                        b.user_name LIKE '%".escape_string($sSearchWord)."%' OR
                        a.bo_content LIKE '%".escape_string($sSearchWord)."%')
                ";
            } else if ($sSearchType == "bo_writer") {
                $sSearch = "
                    AND (
                        a.bo_writer LIKE '%".escape_string($sSearchWord)."%' OR
                        b.user_name LIKE '%".escape_string($sSearchWord)."%')
                ";
            } else {
                $sSearch = "
                    AND ".escape_string($sSearchType)."
                    LIKE '%".escape_string($sSearchWord)."%'
                ";
            }
        }
       
        $sSql = "
            SELECT
                a.bo_no,
                a.bo_depth,
                a.bo_parent,
                a.bo_title,
                a.bo_writer,
                b.user_name,
                a.bo_sec,
                a.bo_date,
                a.bo_del
            FROM
                board a
                INNER JOIN user b
                ON (a.bo_writer = b.user_id)
            WHERE
                1=1
                ".$sSearch."
            ORDER BY
                bo_grpno DESC,
                bo_seq ASC
            LIMIT
                ".$aPagingVar['iStartRow'].", ".$iScreenSize
        ;
        
        $aData = $this->excute($sSql, 'rows');
        return $aData;
    }
}
