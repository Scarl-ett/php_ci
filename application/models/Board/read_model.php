<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Read_model extends MY_Model {

    public function __construct()
    {
        // Call the Model constructor
        parent::__construct();
    }

    //게시글 상세조회
    public function selectBoardDetail($aParam = array())
    {
        $sSql = "
            SELECT
                a.bo_no,
                a.bo_title,
                a.bo_writer,
                b.user_name,
                a.bo_content,
                DATE_FORMAT(a.bo_date, '%Y-%m-%d') bo_date,
                a.bo_sec
            FROM
                board a
                INNER JOIN user b
                ON (a.bo_writer = b.user_id)
            WHERE
                bo_no = ".escape_string($aParam['no'])
        ;
        
        $aData = $this->excute($sSql, 'row');
        return $aData;
    }
    
    //수정할 게시글 update
    public function updateBoard($aParam = array())
    {
        $sSql = "
            UPDATE board
            SET
                bo_title   = '".escape_string($aParam['bo_title'])."',
                bo_content = '".escape_string($aParam['bo_content'])."',
                bo_sec     = '".escape_string($aParam['bo_sec'])."',
                bo_pw      = '".escape_string($aParam['bo_pw'])."'
            WHERE
                bo_no = ".escape_string($aParam['no'])
        ;
        
        return $this->excute($sSql, 'exec');
    }
    
    //삭제할 게시글 조회
    public function selectRemoveBoard($aParam = array())
    {
        $sSql = "
            SELECT
                a.bo_no,
                a.bo_writer,
                COUNT(b.bo_no) AS bo_child,
                a.bo_grpno,
                a.bo_depth
            FROM
                board a
                LEFT JOIN board b
                ON (a.bo_no = b.bo_parent)
            WHERE
                a.bo_no  = ".escape_string($aParam['no'])." AND
                a.bo_del = 'N'
        ";
        
        $aData = $this->excute($sSql, 'row');
        return $aData;
    }
    
    //삭제할 글의 자식글이 있다면 삭제여부 컬럼 'Y'로 update
    public function updateBoardStatus($aParam = array())
    {
        $sSql = "
            UPDATE board
            SET
                bo_del = 'Y'
            WHERE
                bo_no = ".escape_string($aParam['no'])
        ;
        
        return $this->excute($sSql, 'exec');
    }
    
    //삭제할 글의 자식글이 없다면 삭제
    public function deleteBoard($aParam = array())
    {
        $sSql = "
            DELETE
            FROM
                board
            WHERE
                bo_no = ".escape_string($aParam['no'])
        ;
        
        return $this->excute($sSql, 'exec');
    }
    
    //삭제한 게시글 같은 그룹의 삭제여부가 Y이고 자식글이 없는 글 조회
    public function selectGrpDelBoard($iBoGrpno = 0, $iBoDepth = 0)
    {
        $sSql = "
            SELECT  
                a.bo_no
            FROM
                board a
                LEFT JOIN board b
                ON (a.bo_no = b.bo_parent)
            WHERE
                a.bo_grpno =".escape_string($iBoGrpno)." AND
                b.bo_no IS NULL AND
                a.bo_del   = 'Y' AND
                a.bo_depth = ".escape_string($iBoDepth)
        ;
        
        return $this->excute($sSql, 'rows');
    }
    
    //삭제한 게시글 같은 그룹의 삭제여부가 Y이고 자식글이 없는 글 삭제
    public function deleteGrpDelBoard($sDelNos = "")
    {
        $sSql = "
            DELETE
            FROM
                board
            WHERE
                bo_no IN (".$sDelNos.")
        ";
        
        return $this->excute($sSql, 'exec');
    }
    
    
    //삭제후 그룹 순서 재배치
    public function updateGrpBoardSeqs($iBoGrpno = 0) {
        $sSql = "
            SELECT @bo_seq := -1;
        ";

        $this->excute($sSql, 'row');
        
        $sSql = "
            UPDATE 
                board 
            SET
                bo_seq = @bo_seq := @bo_seq + 1 
            WHERE
                bo_grpno = ".escape_string($iBoGrpno)."
            ORDER BY
                bo_seq ASC
        ";
        
        return $this->excute($sSql, 'exec');
    }
}
