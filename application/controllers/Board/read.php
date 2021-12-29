<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Read extends MY_Controller {
    
    public function __construct()
    {
        parent::__construct();
        
        $this->load->model(array('board/board_common_model', 'board/read_model'));
    }
    
    //�Խñ� ����ȸ
    public function index()
    {
        //�Ķ���� ����
        $iBoNo = !empty($this->params['no']) ? (int)trim($this->params['no']) : "";
        
        if (empty($iBoNo)) {
            locationReplace('/Board/lists', '�Խñ� ��ȣ�� �����Ǿ����ϴ�.', 'window');
            exit;
        }
        
        //�Խñ� ���� ���� Ȯ��
        $aData = $this->read_model->selectBoardDetail($this->params);
        
        //�Խñ��� �������� ���� ��
        if (empty($aData['bo_no'])) {
            locationReplace('/Board/lists', '�������� �ʴ� �Խù��Դϴ�.', 'window');
            exit;
        }
        
        //�Խñ��� ������ ��
        //��б��� ��� - ���� Ȯ��
        if ($aData['bo_sec'] == 'Y') {
            if ($this->session->userdata("boardauth") === false) { //������ ��ġ�� �ʾҴٸ�
                historyBack("�ش� ��б��� ���� ������ �����ϴ�.");
                exit;
            }  
            
            //������ ��������
            //������ �������� �ش� �Խù��� ������ �ƴҶ�
            if ($this->session->userdata("boardauth") != $iBoNo) {
                historyBack("�ش� ��б��� ���� ������ �����ϴ�.");
                exit;
            }
            
            //������ ����ߴٸ� ���������� ���� - �ٽ� ���� �� �� �ְ� �Ѵ�.
//             $this->session->unset_userdata('boardauth');
        }
        
        $this->template_->viewDefine('layout_elsd', 'board/board_view.tpl');
        $this->template_->viewAssign(array(
            'iBoNo'          => $aData['bo_no'],
            'sUserName'      => $aData['user_name'],
            'sBoWriter'      => $aData['bo_writer'],
            'sBoDate'        => $aData['bo_date'],
            'sBoTitle'       => $aData['bo_title'],
            'sBoContent'     => nl2br(htmlspecialchars($aData['bo_content'])),
            'sBoSec'         => $aData['bo_sec']
        ));
        $this->js(array('common/regex.js', 'board/board_view.js'), '2021082401');
    }
    
    //���� form
    public function updateForm()
    {
        //�Ķ���� ����
        $iBoNo = !empty($this->params['no']) ? (int)trim($this->params['no']) : "";
        
        if (empty($iBoNo)) {
            locationReplace('/Board/lists', '�Խñ� ��ȣ�� �����Ǿ����ϴ�.', 'window');
            exit;
        }
        
        //�Խñ� ���� ���� Ȯ��
        $aData = $this->read_model->selectBoardDetail($this->params);
        
        //�Խñ��� �������� ���� ��
        if (empty($aData['bo_no'])) {
            locationReplace('/Board/lists', '�������� �ʴ� �Խù��Դϴ�.', 'window');
            exit;
        }
        
        //�α����� ������ �Խñ� �ۼ��ڰ� �������� Ȯ��
        if ($aData['bo_writer'] != $this->session->userdata('session_id')) {
            locationReplace('/Board/lists/boardList', '�Խñ� �ۼ��ڸ� ������ �� �ֽ��ϴ�.', 'window');
            exit;
        }
        
        $this->template_->viewDefine('layout_elsd', 'board/board_modify.tpl');
        $this->template_->viewAssign(array(
                'iBoNo'      => $iBoNo,
                'sBoTitle'   => $aData['bo_title'],
                'sBoContent' => $aData['bo_content'],
                'sBoSec'     => $aData['bo_sec']
        ));
        $this->js(array('common/regex.js', 'board/board_modify.js'));
    }
    
    //update
    public function update()
    {
        //�Ķ���� ����
        $iBoNo      = !empty($this->params['no']) ? (int)trim($this->params['no']) : "";
        $sBoTitle   = !empty($this->params['bo_title']) ? trim($this->params['bo_title']) : "";
        $sBoContent = !empty($this->params['bo_content']) ? $this->params['bo_content'] : "";
        $sBoSec     = !empty($this->params['bo_sec']) ? trim($this->params['bo_sec']) : "";
        $sBoPw      = !empty($this->params['bo_pw']) ? trim($this->params['bo_pw']) : "";
        
        $sId = $this->session->userdata('session_id');
        
        if (empty($iBoNo)) {
            locationReplace('/Board/lists', '�Խñ� ��ȣ�� �����Ǿ����ϴ�.', 'window');
            exit;
        } else if (!empty($sId) === false) {
            locationReplace('/', '�α����� �ʿ��մϴ�.', 'window');
            exit;
        } else if (empty($sBoTitle)) {
            historyBack('������ �Է����ּ���.');
            exit;
        } else if (empty($sBoContent)) {
            historyBack('������ �Է����ּ���.');
            exit;
        }
        
        //�Խñ� ���� ���� Ȯ��
        $aData = $this->read_model->selectBoardDetail($this->params);
        
        //�Խñ��� �������� ���� ��
        if (empty($aData['bo_no'])) {
            locationReplace('/Board/lists', '�������� �ʴ� �Խù��Դϴ�.', 'window');
            exit;
        }
        
        //�α����� ������ �Խñ� �ۼ��ڰ� �������� Ȯ��
        if ($aData['bo_writer'] != $this->session->userdata('session_id')) {
            locationReplace('/Board/lists', '�Խñ� �ۼ��ڸ� ������ �� �ֽ��ϴ�.', 'window');
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
        
        //update
        $bData = $this->read_model->updateBoard($this->params);
        
        if ($bData === true) { //update ����
            //��б��� ��� ���� �Ϸ��� �� ��ȸ�� ���� ���� ���� �ο�
            if (!empty($sBoSec)) {
                $this->session->set_userdata(array(
                    'boardauth' => $iBoNo
                ));
            }
            locationReplace('/Board/read?no='.$iBoNo, '�Խñ� ������ �Ϸ�Ǿ����ϴ�.', 'window');
            exit;
        } else {
            historyBack('�Խñ� ������ �����߽��ϴ�. ��� �� �ٽ� �õ����ּ���.');
            exit;
        }
    }
    
    //�Խñ� ����
    public function delete()
    {
        //�Ķ���� ����
        $iBoNo = !empty($this->params['no']) ?  (int)trim($this->params['no']) : "";
        //�Խñ� ��ȣ null
        if (empty($iBoNo)) {
            locationReplace('/Board/lists', '�Խñ� ��ȣ�� �����Ǿ����ϴ�.', 'window');
            exit;
        }
        
        //�Խñ� ���� ���� Ȯ��
        $aData = $this->read_model->selectRemoveBoard($this->params);
        
        //�Խñ��� �������� ���� ��
        if (empty($aData['bo_no'])) {
            locationReplace('/Board/lists', '�������� �ʴ� �Խù��Դϴ�.', 'window');
            exit;
        }
        
        //�α����� ������ �Խñ� �ۼ��ڰ� �������� Ȯ��
        if ($aData['bo_writer'] != $this->session->userdata('session_id')) {
            locationReplace('/Board/lists/boardList', '�Խñ� �ۼ��ڸ� ������ �� �ֽ��ϴ�.', 'window');
            exit;
        }
        
        $iBoChild  = $aData['bo_child'];
        $iBoGrpno  = $aData['bo_grpno'];
        $iBoDepth  = $aData['bo_depth'];
        
        //������ ���� �ڽı� ���� ���� Ȯ��
        if ($iBoChild > 0) { //�ڽı��� �����Ѵٸ�
            //�ڽı��� �ִٸ� update ���� - �������� �÷� Y�� ����
            $bData = $this->read_model->updateBoardStatus($this->params);
            
            if ($bData === true) {
                locationReplace('/Board/lists', '�Խñ� ������ �Ϸ�Ǿ����ϴ�.', 'window');
                exit;
            } else {
                historyBack('�Խñ� ������ �����߽��ϴ�. ��� �� �ٽ� �õ����ּ���.');
                exit;
            }
        }
        
        //�ڽı��� �������� �ʴ´ٸ�
        //delete ����
        $bData = $this->read_model->deleteBoard($this->params);
        
        //�ڽı��� ���� �Խñ� delete ����
        if ($aData === false) {
            historyBack('�Խñ� ������ �����߽��ϴ�. ��� �� �ٽ� �õ����ּ���.');
            exit;
        }
        
        //�ڽı��� ���� �Խñ� delete ����
        //������ �Խñۺ��� depth�� ���� ���� �׷��� �۵���
        //�ڽ��� ���� �������ΰ� Y�� �� ����
        for ($i = $iBoDepth - 1; $i > 0; $i--) {
            $aData = $this->read_model->selectGrpDelBoard($iBoGrpno, $i);
            
            //������ �Խñ�
            $aDelNos = array();
            $sDelNos = "";
            
            if (count($aData) > 0) {
                foreach ($aData as $aValue) {
                    $aDelNos[] = $aValue['bo_no'];
                }
                
                $sDelNos = implode(',', $aDelNos);

                //����
                $bData = $this->read_model->deleteGrpDelBoard($sDelNos);
                
                if ($bData === false) {
                    historyBack('�Խñ� ������ �����߽��ϴ�. ��� �� �ٽ� �õ����ּ���.');
                    exit;
                }
            }
            
        }
        
        //�׷���� ���ġ
        $bData = $this->read_model->updateGrpBoardSeqs($iBoGrpno);
        
        if ($bData === true) { //�������ġ ����
            locationReplace("/Board/lists", "�Խñ� ������ �Ϸ�Ǿ����ϴ�.", 'window');
            exit;
        } else { //�������ġ ����
            historyBack('�Խñ� ������ �����߽��ϴ�. ��� �� �ٽ� �õ����ּ���.');
            exit;
        }
    }
} 
?>