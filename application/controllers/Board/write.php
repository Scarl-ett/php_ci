<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Write extends MY_Controller {

    public function __construct()
    {
        parent::__construct();

        $this->load->model('board/write_model');
    }
    
    //게시글 작성 폼
    public function index()
    {   
        $this->template_->viewDefine('layout_elsd', 'board/board_write.tpl');
        $this->js(array('common/regex.js', 'board/board_write.js'));
    }
    
    //게시글 insert
    public function writeInsert()
    {
        //파라미터 검증
        $sBoTitle   = !empty($this->params['bo_title']) ? trim($this->params['bo_title']) : "";
        $sBoContent = !empty($this->params['bo_content']) ? $this->params['bo_content'] : "";
        $sBoSec     = !empty($this->params['bo_sec']) ? trim($this->params['bo_sec']) : "";
        $sBoPw      = !empty($this->params['bo_pw']) ? trim($this->params['bo_pw']) : "";
        
        if (empty($sBoTitle)) {
            historyBack("제목을 입력해주세요.");
            exit;
        } else if (empty($sBoContent)) {
            historyBack("내용을 입력해주세요.");
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
        
        //board insert
        //자동 생성된 id 중 마지막 쿼리에 사용된 id를 반환
        $iCurrentNo = $this->write_model->insertBoard($this->params);
        if (!empty($iCurrentNo) === true) {
            //비밀글일 경우 글작성 완료 후 상세 조회를 위한 인증 세션 부여
            if (!empty($sBoSec)) {
                $this->session->set_userdata(array(
                    'boardauth' => $iCurrentNo
                ));
            }
            
            locationReplace('/Board/read?no='.$iCurrentNo, "게시글 작성이 완료되었습니다.", "window");
            
            //게시판 검색 쿠키 삭제
            if (get_cookie('search')) {
                delete_cookie('search');
            }
            
            exit;
        } else {
            historyBack("게시글 작성에 실패했습니다. 잠시 후 다시 시도해주세요.");
            exit;
        }
    }
}