<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Reply extends MY_Controller {

    public function __construct()
    {
        parent::__construct();

        $this->load->model(array('board/board_common_model', 'board/reply_model'), '2021082501');
    }
    
    //��� �ۼ� ��
    public function index()
    {
        //�Ķ���� ����
        $iParentBoNo = !empty($this->params['no']) ? (int)trim($this->params['no']) : "";
        
        if (empty($iParentBoNo)) {
            locationReplace('/Board/lists', '�θ� �Խñ��� �������� �ʽ��ϴ�.', 'window');
            exit;
        }
        
        //�ش� ��ȣ�� �Խñ� ���翩�� Ȯ��
        $aData = $this->reply_model->selectParentBoard($this->params);
        
        //�ش� �Խñ��� �������� ���� ��
        if (empty($aData['bo_no'])) {
            locationReplace('/Board/lists', '�������� �ʴ� �Խù����� ����� �ۼ��� �� �����ϴ�.', 'window');
            exit;
        }
        
        //�θ���� ��б��� ��� - boardauth ������ ���� �θ�� ��ȣ�� �������� Ȯ��
        $iBoardauth = $this->session->userdata('boardauth');
        if ($aData['bo_sec'] == 'Y') {
            if ($iBoardauth != $iParentBoNo) {
                historyBack("�ش� ��б��� ����� �ۼ��� ������ �����ϴ�.");
                exit;
            }
        }
        
        //�θ� �Խñ��� �����ϴ� �Խñ��϶�
        $this->template_->viewDefine('layout_elsd', 'board/board_reply.tpl');
        $this->template_->viewAssign(array(
            'sBoTitle'    => $aData['bo_title'],
            'sBoContent'  => nl2br(htmlspecialchars($aData['bo_content'])),
            'sBoWriter'   => $aData['bo_writer'],
            'sUserName'   => $aData['user_name'],
            'sBoDate'     => $aData['bo_date'],
            'sBoSec'      => $aData['bo_sec'],
            'iParentBoNo' => $aData['bo_no']
        ));
        $this->js(array('common/regex.js', 'board/board_reply.js'));
    }
    
    //��� insert
    public function replyInsert()
    {
        //�Ķ���� ����
        $iParentBoNo = !empty($this->params['no']) ? (int)trim($this->params['no']) : "";
        $sBoTitle    = !empty($this->params['bo_title']) ? trim($this->params['bo_title']) : "";
        $sBoContent  = !empty($this->params['bo_content']) ? $this->params['bo_content'] : "";
        $sBoSec      = !empty($this->params['bo_sec']) ? trim($this->params['bo_sec']) : "";
        $sBoPw       = !empty($this->params['bo_pw']) ? trim($this->params['bo_pw']) : "";
        
        //�θ� �Խñ� ��ȣ ����
        if (empty($iParentBoNo)) {
            locationReplace('/Board/lists', '�θ� �Խñ��� �������� �ʽ��ϴ�.', 'window');
            exit;
        }
        
        //�ش� ��ȣ�� �θ� �Խñ� ���翩�� Ȯ��
        $aData = $this->reply_model->selectParentBoard($this->params);
        
        //�ش� ��ȣ�� �θ� �Խñ��� �������� ���� ��
        if (empty($aData['bo_no'])) {
            locationReplace('/Board/lists', '�������� �ʴ� �Խù����� ����� �ۼ��� �� �����ϴ�.', 'window');
            exit;
        }
        
        //�θ���� ��б��� ��� - boardauth ������ ���� �θ�� ��ȣ�� �������� Ȯ��
        $iBoardauth = $this->session->userdata('boardauth');
        if ($aData['bo_sec'] == 'Y') {
            if ($iBoardauth != $iParentBoNo) {
                historyBack("�ش� ��б��� ����� �ۼ��� ������ �����ϴ�.");
                exit;
            }
        }
        
        //�ش� ��ȣ�� �θ� �Խñ��� ������ ��
        $iBoGrpno   = $aData['bo_grpno'];
        $iParentSeq = $aData['bo_seq'];
        $iBoDepth   = $aData['bo_depth'] + 1;
        $iBoSeq     = $iParentSeq + 1;
        
        $aBoParams = array(
        	'iBoGrpno'   => $iBoGrpno,
            'iParentSeq' => $iParentSeq,
            'iBoDepth'   => $iBoDepth,
            'iBoSeq'     => $iBoSeq
        ); 
        
        
        //��� �Ķ���� ����
        if (empty($sBoTitle)) {
            historyBack("������ �Է����ּ���.");
            exit;
        } else if (empty($sBoContent)) {
            historyBack('������ �Է����ּ���.');
            exit;
        }
        
        //�θ���� ��б��� ��� - �θ���� ��й�ȣ�� ����� ��й�ȣ�� �������� Ȯ��
//         if ($aData['bo_sec'] == 'Y') {
//             if ($aData['bo_pw'] != $this->securityauth->encryptAES256CBC(escape_string($sBoPw))) {
//                 historyBack("������ ��й�ȣ�� �������� �ʽ��ϴ�. ��й�ȣ�� �ٽ� �Է��ϼ���.");
//                 exit;
//             }
//         }
        
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
        
        //�׷쳻 ���� ����
        $bData = $this->reply_model->updateBoardSeqs($aBoParams);
        
        if ($bData === false) { //update ����
            historyBack("�Խñ� �ۼ��� �����߽��ϴ�. ��� �� �ٽ� �õ����ּ���.");
            exit;
        }
        
        //update ����
        //��� insert
        //�ڵ� ������ id �� ������ ������ ���� id�� ��ȯ
        $iCurrentNo = $this->reply_model->insertReply($this->params, $aBoParams);
        
        if (empty($iCurrentNo)) { //insert ����
            historyBack("�Խñ� �ۼ��� �����߽��ϴ�. ��� �� �ٽ� �õ����ּ���.");
            exit;
        } else { //insert ����
            //��б��� ��� ���ۼ� �Ϸ� �� �� ��ȸ�� ���� ���� ���� �ο�
            if (!empty($sBoSec)) {
                $this->session->set_userdata(array(
                    'boardauth' => $iCurrentNo
                ));
            }
            
            locationReplace('/Board/read?no='.$iCurrentNo, "�Խñ� �ۼ��� �Ϸ�Ǿ����ϴ�.", "window");
            exit;
        }
    }
}