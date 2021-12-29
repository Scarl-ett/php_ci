<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Write extends MY_Controller {

    public function __construct()
    {
        parent::__construct();

        $this->load->model('board/write_model');
    }
    
    //�Խñ� �ۼ� ��
    public function index()
    {   
        $this->template_->viewDefine('layout_elsd', 'board/board_write.tpl');
        $this->js(array('common/regex.js', 'board/board_write.js'));
    }
    
    //�Խñ� insert
    public function writeInsert()
    {
        //�Ķ���� ����
        $sBoTitle   = !empty($this->params['bo_title']) ? trim($this->params['bo_title']) : "";
        $sBoContent = !empty($this->params['bo_content']) ? $this->params['bo_content'] : "";
        $sBoSec     = !empty($this->params['bo_sec']) ? trim($this->params['bo_sec']) : "";
        $sBoPw      = !empty($this->params['bo_pw']) ? trim($this->params['bo_pw']) : "";
        
        if (empty($sBoTitle)) {
            historyBack("������ �Է����ּ���.");
            exit;
        } else if (empty($sBoContent)) {
            historyBack("������ �Է����ּ���.");
            exit;
        }
        
        //��б� �Ķ���� ����
        if (!empty($sBoSec)) {//��б��� ���
            if (empty($sBoPw)) { //��б��ε� ��й�ȣ�� ���� ���
                historyBack("��б��� ��� �Խñ� ��й�ȣ�� �ʼ��Դϴ�.");
                exit;
            } else {
                $this->params['bo_pw'] = $this->securityauth->encryptAES256CBC(escape_string($sBoPw));
            }
        } else {
            //��б��� �ƴҶ� ��й�ȣ �Է��ߴٸ� �ʱ�ȭ
            $this->params['bo_sec'] = 'N';
            $this->params['bo_pw']  = "";
        }
        
        //board insert
        //�ڵ� ������ id �� ������ ������ ���� id�� ��ȯ
        $iCurrentNo = $this->write_model->insertBoard($this->params);
        if (!empty($iCurrentNo) === true) {
            //��б��� ��� ���ۼ� �Ϸ� �� �� ��ȸ�� ���� ���� ���� �ο�
            if (!empty($sBoSec)) {
                $this->session->set_userdata(array(
                    'boardauth' => $iCurrentNo
                ));
            }
            
            locationReplace('/Board/read?no='.$iCurrentNo, "�Խñ� �ۼ��� �Ϸ�Ǿ����ϴ�.", "window");
            
            //�Խ��� �˻� ��Ű ����
            if (get_cookie('search')) {
                delete_cookie('search');
            }
            
            exit;
        } else {
            historyBack("�Խñ� �ۼ��� �����߽��ϴ�. ��� �� �ٽ� �õ����ּ���.");
            exit;
        }
    }
}