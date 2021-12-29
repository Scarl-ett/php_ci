<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Reply extends MY_Controller {

    public function __construct()
    {
        parent::__construct();

        $this->load->model(array('board/board_common_model', 'board/reply_model'), '2021082501');
    }
    
    //답글 작성 폼
    public function index()
    {
        //파라미터 검증
        $iParentBoNo = !empty($this->params['no']) ? (int)trim($this->params['no']) : "";
        
        if (empty($iParentBoNo)) {
            locationReplace('/Board/lists', '부모 게시글이 존재하지 않습니다.', 'window');
            exit;
        }
        
        //해당 번호의 게시글 존재여부 확인
        $aData = $this->reply_model->selectParentBoard($this->params);
        
        //해당 게시글이 존재하지 않을 때
        if (empty($aData['bo_no'])) {
            locationReplace('/Board/lists', '존재하지 않는 게시물에는 답글을 작성할 수 없습니다.', 'window');
            exit;
        }
        
        //부모글이 비밀글일 경우 - boardauth 세션의 값이 부모글 번호와 동일한지 확인
        $iBoardauth = $this->session->userdata('boardauth');
        if ($aData['bo_sec'] == 'Y') {
            if ($iBoardauth != $iParentBoNo) {
                historyBack("해당 비밀글의 답글을 작성할 권한이 없습니다.");
                exit;
            }
        }
        
        //부모 게시글이 존재하는 게시글일때
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
    
    //답글 insert
    public function replyInsert()
    {
        //파라미터 검증
        $iParentBoNo = !empty($this->params['no']) ? (int)trim($this->params['no']) : "";
        $sBoTitle    = !empty($this->params['bo_title']) ? trim($this->params['bo_title']) : "";
        $sBoContent  = !empty($this->params['bo_content']) ? $this->params['bo_content'] : "";
        $sBoSec      = !empty($this->params['bo_sec']) ? trim($this->params['bo_sec']) : "";
        $sBoPw       = !empty($this->params['bo_pw']) ? trim($this->params['bo_pw']) : "";
        
        //부모 게시글 번호 누락
        if (empty($iParentBoNo)) {
            locationReplace('/Board/lists', '부모 게시글이 존재하지 않습니다.', 'window');
            exit;
        }
        
        //해당 번호의 부모 게시글 존재여부 확인
        $aData = $this->reply_model->selectParentBoard($this->params);
        
        //해당 번호의 부모 게시글이 존재하지 않을 때
        if (empty($aData['bo_no'])) {
            locationReplace('/Board/lists', '존재하지 않는 게시물에는 답글을 작성할 수 없습니다.', 'window');
            exit;
        }
        
        //부모글이 비밀글일 경우 - boardauth 세션의 값이 부모글 번호와 동일한지 확인
        $iBoardauth = $this->session->userdata('boardauth');
        if ($aData['bo_sec'] == 'Y') {
            if ($iBoardauth != $iParentBoNo) {
                historyBack("해당 비밀글의 답글을 작성할 권한이 없습니다.");
                exit;
            }
        }
        
        //해당 번호의 부모 게시글이 존재할 때
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
        
        
        //답글 파라미터 검증
        if (empty($sBoTitle)) {
            historyBack("제목을 입력해주세요.");
            exit;
        } else if (empty($sBoContent)) {
            historyBack('내용을 입력해주세요.');
            exit;
        }
        
        //부모글이 비밀글일 경우 - 부모글의 비밀번호와 답글의 비밀번호가 동일한지 확인
//         if ($aData['bo_sec'] == 'Y') {
//             if ($aData['bo_pw'] != $this->securityauth->encryptAES256CBC(escape_string($sBoPw))) {
//                 historyBack("원글의 비밀번호와 동일하지 않습니다. 비밀번호를 다시 입력하세요.");
//                 exit;
//             }
//         }
        
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
        
        //그룹내 순서 변경
        $bData = $this->reply_model->updateBoardSeqs($aBoParams);
        
        if ($bData === false) { //update 실패
            historyBack("게시글 작성에 실패했습니다. 잠시 후 다시 시도해주세요.");
            exit;
        }
        
        //update 성공
        //답글 insert
        //자동 생성된 id 중 마지막 쿼리에 사용된 id를 반환
        $iCurrentNo = $this->reply_model->insertReply($this->params, $aBoParams);
        
        if (empty($iCurrentNo)) { //insert 실패
            historyBack("게시글 작성에 실패했습니다. 잠시 후 다시 시도해주세요.");
            exit;
        } else { //insert 성공
            //비밀글일 경우 글작성 완료 후 상세 조회를 위한 인증 세션 부여
            if (!empty($sBoSec)) {
                $this->session->set_userdata(array(
                    'boardauth' => $iCurrentNo
                ));
            }
            
            locationReplace('/Board/read?no='.$iCurrentNo, "게시글 작성이 완료되었습니다.", "window");
            exit;
        }
    }
}