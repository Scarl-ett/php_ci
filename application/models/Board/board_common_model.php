<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Board_common_model extends MY_Model {

    public function __construct()
    {
        // Call the Model constructor
        parent::__construct();
    }

    //비밀글 비밀번호 확인
    public function selectBoardPassword($aParam = array())
    {
        $sSql = "
            SELECT
                bo_pw
            FROM
                board
            WHERE
                bo_no = ".escape_string($aParam['bo_no'])
        ;
        
        $aData = $this->excute($sSql, 'row');
        return $aData['bo_pw'];
    }
}