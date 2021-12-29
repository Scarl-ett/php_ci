<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Signin extends MY_Controller {
    
    public function __construct()
    {
        parent::__construct();
        
        $this->load->model(array('user/user_common_model', 'user/signin_model'));
        
        $this->allow = array('index', 'login');
    }
    
    public function index()
    {
        //로그인 여부 확인
        $sSessionId = $this->session->userdata('session_id');
        if (!empty($sSessionId)) {
            locationReplace("/Board/lists", "이미 로그인 상태입니다.", "window");
            exit;
        }
        
        $this->template_->viewDefine('layout_elsd', 'login.tpl');
        
        $this->css('signin.css');
        $this->js(array('common/regex.js', 'login.js'), '2021081201');
    }
    
    public function login()
    {
        //파라미터 검증
        $sUserId   = !empty($this->params['user_id']) ? trim($this->params['user_id']) : "";
        $sUserPw   = !empty($this->params['user_pw']) ? trim($this->params['user_pw']) : "";
        $sRemember = !empty($this->params['remember']) ? trim($this->params['remember']) : "";
        
        if (empty($sUserId)) {
            locationReplace("/", "아이디를 입력해주세요.", "window");
            exit;
        } else if (empty($sUserPw)) {
            locationReplace("/", "비밀번호를 입력해주세요.", "window");
            exit;
        }
        
        $aUser = $this->user_common_model->selectUser($this->params);
        
        //존재하지 않는 아이디
        if (empty($aUser['user_id'])) {
            locationReplace("/", "입력하신 아이디는 존재하지 않습니다.", "window");
            exit;
        }
        
        $sUserPw = $this->securityauth->encryptAES256CBC($sUserPw);
        $sDataPw = $aUser['user_pw'];
         
        //비밀번호 확인
        if ($sUserPw === $sDataPw) { //pass
            //session
            $this->session->set_userdata(array(
                'session_id'   => $sUserId,
                'session_name' => $aUser['user_name']
            ));
            
            //cookie
            if (!empty($sRemember)) { //cookie check
                set_cookie('user_id', $sUserId, '86400','cw.test.com');
            } else {
                //cookie delete
                if (get_cookie('user_id')) {
                    delete_cookie('user_id', 'cw.test.com');
                }
            }
            
            redirect('/Board/lists');
        } else {
            locationReplace("/", "비밀번호가 일치하지 않습니다.", "window");
            exit;
        }
    }
    
    public function logout()
    {
        $this->session->sess_destroy();
    
        //게시판 쿠키 삭제
        if (get_cookie('search')) {
            delete_cookie('search');
        }
        
        redirect('/');
    }
} 
?>