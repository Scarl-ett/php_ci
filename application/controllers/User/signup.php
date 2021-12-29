<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Signup extends MY_Controller {
    
    public function __construct()
    {
        parent::__construct();

        $this->load->model(array('user/signup_model', 'user/user_common_model'));
        
        $this->allow = array('index', 'idCheck', 'joinInsert');
    }
    
    //joinForm
    public function index()
    {
        $this->template_->viewDefine('layout_elsd', 'user/join.tpl');
        
        $this->js(array('common/postcode.v2.js', 'common/regex.js', 'user/join.js'));
    }
    
    //idCheck
    public function idCheck()
    {
        $sUserId = !empty($this->params['user_id']) ? trim($this->params['user_id']) : "";
        
        $aResp = array('check' => 'FAIL');
        
        if (empty($sUserId)) {
            $aResp['check'] = 'FAIL';
            echo json_encode_euckr($aResp);
            exit;
        }
        
        $sUserId = escape_string($sUserId);
        
        $aUser = $this->user_common_model->selectUser($this->params, $sUserId);
        
        if (empty($aUser['user_id'])) {
            $aResp['check'] = 'OK';
        }
        
        echo json_encode_euckr($aResp);
    }
    
    //submit
    public function joinInsert()
    {
        //파라미터 검증
        $sUserId     = !empty($this->params['user_id']) ? trim($this->params['user_id']) : "";
        $sUserPw     = !empty($this->params['user_pw']) ? trim($this->params['user_pw']) : "";
        $sUserName   = !empty($this->params['user_name']) ? trim($this->params['user_name']) : "";
        $sUserEmail1 = !empty($this->params['user_email1']) ? trim($this->params['user_email1']) : "";
        $sUserEmail2 = !empty($this->params['user_email2']) ? trim($this->params['user_email2']) : "";
        $sUserTel    = !empty($this->params['user_tel']) ? trim($this->params['user_tel']) : "";
        $sUserZip    = !empty($this->params['user_zip']) ? trim($this->params['user_zip']) : "";
        $sUserAddr1  = !empty($this->params['user_addr1']) ? trim($this->params['user_addr1']) : "";
        $sUserAddr2  = !empty($this->params['user_addr2']) ? trim($this->params['user_addr2']) : "";
        
        //form 검증 rules
        $aConfig = array(
            array(
                'field' => 'user_id',
                'label' => 'User_id',
                'rules' => 'required'
            ),
            array(
                'field' => 'user_pw',
                'label' => 'User_pw',
                'rules' => 'required'
            ),
            array(
                'field' => 'user_name',
                'label' => 'User_name',
                'rules' => 'required'
            )
        );
        
        $this->form_validation->set_rules($aConfig);
        
        //form 검증 
        if ($this->form_validation->run() == FALSE) {
            historyBack("필수 입력사항이 누락되었습니다.");
            exit;
        }
        
        $sEncode = $this->securityauth->encryptAES256CBC(escape_string($sUserPw));
        $sUserEmail = escape_string($sUserEmail1)."@".escape_string($sUserEmail2);
        
        $bData =$this->signup_model->insertUser($this->params, $sEncode, $sUserEmail);
        
        if ($bData === true) {
            locationReplace("/", "회원가입이 완료되었습니다.", "window");
            exit;
        } else {
            historyBack("회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.");
            exit;
        }
    }
} 
?>