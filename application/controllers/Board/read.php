<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Read extends MY_Controller {
    
    public function __construct()
    {
        parent::__construct();
        
        $this->load->model(array('board/board_common_model', 'board/read_model'));
    }
    
    //게시글 상세조회
    public function index()
    {
        //파라미터 검증
        $iBoNo = !empty($this->params['no']) ? (int)trim($this->params['no']) : "";
        
        if (empty($iBoNo)) {
            locationReplace('/Board/lists', '게시글 번호가 누락되었습니다.', 'window');
            exit;
        }
        
        //게시글 존재 여부 확인
        $aData = $this->read_model->selectBoardDetail($this->params);
        
        //게시글이 존재하지 않을 때
        if (empty($aData['bo_no'])) {
            locationReplace('/Board/lists', '존재하지 않는 게시물입니다.', 'window');
            exit;
        }
        
        //게시글이 존재할 때
        //비밀글일 경우 - 권한 확인
        if ($aData['bo_sec'] == 'Y') {
            if ($this->session->userdata("boardauth") === false) { //인증을 거치지 않았다면
                historyBack("해당 비밀글의 열람 권한이 없습니다.");
                exit;
            }  
            
            //인증을 거쳤을때
            //인증을 거쳤지만 해당 게시물의 인증이 아닐때
            if ($this->session->userdata("boardauth") != $iBoNo) {
                historyBack("해당 비밀글의 열람 권한이 없습니다.");
                exit;
            }
            
            //인증을 통과했다면 인증내용을 삭제 - 다시 인증 할 수 있게 한다.
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
    
    //수정 form
    public function updateForm()
    {
        //파라미터 검증
        $iBoNo = !empty($this->params['no']) ? (int)trim($this->params['no']) : "";
        
        if (empty($iBoNo)) {
            locationReplace('/Board/lists', '게시글 번호가 누락되었습니다.', 'window');
            exit;
        }
        
        //게시글 존재 여부 확인
        $aData = $this->read_model->selectBoardDetail($this->params);
        
        //게시글이 존재하지 않을 때
        if (empty($aData['bo_no'])) {
            locationReplace('/Board/lists', '존재하지 않는 게시물입니다.', 'window');
            exit;
        }
        
        //로그인한 정보와 게시글 작성자가 동일한지 확인
        if ($aData['bo_writer'] != $this->session->userdata('session_id')) {
            locationReplace('/Board/lists/boardList', '게시글 작성자만 수정할 수 있습니다.', 'window');
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
        //파라미터 검증
        $iBoNo      = !empty($this->params['no']) ? (int)trim($this->params['no']) : "";
        $sBoTitle   = !empty($this->params['bo_title']) ? trim($this->params['bo_title']) : "";
        $sBoContent = !empty($this->params['bo_content']) ? $this->params['bo_content'] : "";
        $sBoSec     = !empty($this->params['bo_sec']) ? trim($this->params['bo_sec']) : "";
        $sBoPw      = !empty($this->params['bo_pw']) ? trim($this->params['bo_pw']) : "";
        
        $sId = $this->session->userdata('session_id');
        
        if (empty($iBoNo)) {
            locationReplace('/Board/lists', '게시글 번호가 누락되었습니다.', 'window');
            exit;
        } else if (!empty($sId) === false) {
            locationReplace('/', '로그인이 필요합니다.', 'window');
            exit;
        } else if (empty($sBoTitle)) {
            historyBack('제목을 입력해주세요.');
            exit;
        } else if (empty($sBoContent)) {
            historyBack('내용을 입력해주세요.');
            exit;
        }
        
        //게시글 존재 여부 확인
        $aData = $this->read_model->selectBoardDetail($this->params);
        
        //게시글이 존재하지 않을 때
        if (empty($aData['bo_no'])) {
            locationReplace('/Board/lists', '존재하지 않는 게시물입니다.', 'window');
            exit;
        }
        
        //로그인한 정보와 게시글 작성자가 동일한지 확인
        if ($aData['bo_writer'] != $this->session->userdata('session_id')) {
            locationReplace('/Board/lists', '게시글 작성자만 수정할 수 있습니다.', 'window');
            exit;
        }
        
        //비밀글 파라미터 검증
        if (!empty($sBoSec)) {//비밀글일 경우
            if (empty($sBoPw)) { //비밀글인데 비밀번호가 없을 경우
                historyBack("비밀글일 경우 게시글 비밀번호는 필수입니다.");
                exit;
            } else {
                $this->params['bo_pw'] = $this->securityauth->encryptAES256CBC(escape_string($sBoPw));
            }
        } else {
            //비밀글이 아닐때 비밀번호 입력했다면 초기화
            $this->params['bo_sec'] = 'N';
            $this->params['bo_pw']  = "";
        }
        
        //update
        $bData = $this->read_model->updateBoard($this->params);
        
        if ($bData === true) { //update 성공
            //비밀글일 경우 수정 완료후 상세 조회를 위한 인증 세션 부여
            if (!empty($sBoSec)) {
                $this->session->set_userdata(array(
                    'boardauth' => $iBoNo
                ));
            }
            locationReplace('/Board/read?no='.$iBoNo, '게시글 수정이 완료되었습니다.', 'window');
            exit;
        } else {
            historyBack('게시글 수정에 실패했습니다. 잠시 후 다시 시도해주세요.');
            exit;
        }
    }
    
    //게시글 삭제
    public function delete()
    {
        //파라미터 검증
        $iBoNo = !empty($this->params['no']) ?  (int)trim($this->params['no']) : "";
        //게시글 번호 null
        if (empty($iBoNo)) {
            locationReplace('/Board/lists', '게시글 번호가 누락되었습니다.', 'window');
            exit;
        }
        
        //게시글 존재 여부 확인
        $aData = $this->read_model->selectRemoveBoard($this->params);
        
        //게시글이 존재하지 않을 때
        if (empty($aData['bo_no'])) {
            locationReplace('/Board/lists', '존재하지 않는 게시물입니다.', 'window');
            exit;
        }
        
        //로그인한 정보와 게시글 작성자가 동일한지 확인
        if ($aData['bo_writer'] != $this->session->userdata('session_id')) {
            locationReplace('/Board/lists/boardList', '게시글 작성자만 수정할 수 있습니다.', 'window');
            exit;
        }
        
        $iBoChild  = $aData['bo_child'];
        $iBoGrpno  = $aData['bo_grpno'];
        $iBoDepth  = $aData['bo_depth'];
        
        //삭제할 글의 자식글 존재 여부 확인
        if ($iBoChild > 0) { //자식글이 존재한다면
            //자식글이 있다면 update 실행 - 삭제여부 컬럼 Y로 변경
            $bData = $this->read_model->updateBoardStatus($this->params);
            
            if ($bData === true) {
                locationReplace('/Board/lists', '게시글 삭제가 완료되었습니다.', 'window');
                exit;
            } else {
                historyBack('게시글 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
                exit;
            }
        }
        
        //자식글이 존재하지 않는다면
        //delete 실행
        $bData = $this->read_model->deleteBoard($this->params);
        
        //자식글이 없는 게시글 delete 실패
        if ($aData === false) {
            historyBack('게시글 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
            exit;
        }
        
        //자식글이 없는 게시글 delete 성공
        //삭제한 게시글보다 depth가 작은 같은 그룹의 글들중
        //자식이 없고 삭제여부가 Y인 글 삭제
        for ($i = $iBoDepth - 1; $i > 0; $i--) {
            $aData = $this->read_model->selectGrpDelBoard($iBoGrpno, $i);
            
            //삭제할 게시글
            $aDelNos = array();
            $sDelNos = "";
            
            if (count($aData) > 0) {
                foreach ($aData as $aValue) {
                    $aDelNos[] = $aValue['bo_no'];
                }
                
                $sDelNos = implode(',', $aDelNos);

                //삭제
                $bData = $this->read_model->deleteGrpDelBoard($sDelNos);
                
                if ($bData === false) {
                    historyBack('게시글 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
                    exit;
                }
            }
            
        }
        
        //그룹순서 재배치
        $bData = $this->read_model->updateGrpBoardSeqs($iBoGrpno);
        
        if ($bData === true) { //순서재배치 성공
            locationReplace("/Board/lists", "게시글 삭제가 완료되었습니다.", 'window');
            exit;
        } else { //순서재배치 실패
            historyBack('게시글 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
            exit;
        }
    }
} 
?>