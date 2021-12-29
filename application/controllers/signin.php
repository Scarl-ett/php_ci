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
        //�α��� ���� Ȯ��
        $sSessionId = $this->session->userdata('session_id');
        if (!empty($sSessionId)) {
            locationReplace("/Board/lists", "�̹� �α��� �����Դϴ�.", "window");
            exit;
        }
        
        $this->template_->viewDefine('layout_elsd', 'login.tpl');
        
        $this->css('signin.css');
        $this->js(array('common/regex.js', 'login.js'), '2021081201');
    }
    
    public function login()
    {
        //�Ķ���� ����
        $sUserId   = !empty($this->params['user_id']) ? trim($this->params['user_id']) : "";
        $sUserPw   = !empty($this->params['user_pw']) ? trim($this->params['user_pw']) : "";
        $sRemember = !empty($this->params['remember']) ? trim($this->params['remember']) : "";
        
        if (empty($sUserId)) {
            locationReplace("/", "���̵� �Է����ּ���.", "window");
            exit;
        } else if (empty($sUserPw)) {
            locationReplace("/", "��й�ȣ�� �Է����ּ���.", "window");
            exit;
        }
        
        $aUser = $this->user_common_model->selectUser($this->params);
        
        //�������� �ʴ� ���̵�
        if (empty($aUser['user_id'])) {
            locationReplace("/", "�Է��Ͻ� ���̵�� �������� �ʽ��ϴ�.", "window");
            exit;
        }
        
        $sUserPw = $this->securityauth->encryptAES256CBC($sUserPw);
        $sDataPw = $aUser['user_pw'];
         
        //��й�ȣ Ȯ��
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
            locationReplace("/", "��й�ȣ�� ��ġ���� �ʽ��ϴ�.", "window");
            exit;
        }
    }
    
    public function logout()
    {
        $this->session->sess_destroy();
    
        //�Խ��� ��Ű ����
        if (get_cookie('search')) {
            delete_cookie('search');
        }
        
        redirect('/');
    }
} 
?>