<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Board_common extends MY_Controller {
    
    public function __construct()
    {
        parent::__construct();
        
        $this->load->model('board/board_common_model');
    }
    
    public function index()
    {
        
    }
    
    //비밀글 비밀번호 확인
    public function pwCheck()
    {
        //파라미터 검증
        $sBoPw = !empty($this->params['bo_pw']) ? trim($this->params['bo_pw']) : "";
        $iBoNo = !empty($this->params['bo_no']) ? (int)trim($this->params['bo_no']) : "";
        
        $aResp = array('check' => 'FAIL');
        
        if (empty($iBoNo)) {
            $aResp['check'] = 'FAIL';
            echo json_encode_euckr($aResp);
            exit;
        }
        
        $sEncodePw = $this->securityauth->encryptAES256CBC(escape_string($sBoPw));
        $sData = $this->board_common_model->selectBoardPassword($this->params);
        
        if ($sData === $sEncodePw) {
            $aResp['check'] = 'OK';
            
            $this->session->set_userdata(array(
                'boardauth' => $iBoNo
            ));
        }
        
        echo json_encode_euckr($aResp);
    }
} 
?>