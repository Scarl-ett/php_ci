<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Lists extends MY_Controller {
    //한 페이지당 보여질 리스트 수
    public $iScreenSize;
    //한 화면에 보여질 페이지 수
    public $iBlockSize;
    
    public function __construct()
    {
        parent::__construct();
        
        $this->load->model('board/lists_model');
        
        $this->iScreenSize = 10;
        $this->iBlockSize = 5;
    }
    
    //board_list - 동기
    public function index()
    {
        $this->template_->viewDefine('layout_elsd', 'Board/board_list.tpl');
        $this->js(array('common/regex.js', 'board/board_list.js'));
    }
    
    //board_list - 비동기
    public function boardListAjax()
    {
        //현재 페이지
        $iCurrentPage = !empty($this->params['page']) ? (int)trim($this->params['page']) : 1;
        
        //검색조건
        $sSearchType = !empty($this->params['searchType']) ? trim($this->params['searchType']) : "";
        $sSearchWord = !empty($this->params['searchWord']) ? trim($this->params['searchWord']) : "";
        
        $this->iScreenSize = !empty($this->params['screenSize']) ? (int)trim($this->params['screenSize']) : $this->iScreenSize;
        
        //총 게시글 조회
        $iTotalRecord = $this->lists_model->selectTotalRecord($sSearchType, $sSearchWord);
        
        //페이징 처리에 필요한 변수값
        $aPagingVar = $this->getPagingVar($iTotalRecord, $iCurrentPage);
        
        //게시글 조회
        $aData = $this->lists_model->selectBoardList($this->iScreenSize, $aPagingVar, $sSearchType, $sSearchWord);
        foreach ($aData as $iKey => $aValue) {
            $sTitle = $aData[$iKey]['bo_title'];
        
            //제목이 30자가 넘으면 ...로 대체
            if (strlen($sTitle) > 30) {
                $sTitle = str_replace($sTitle, mb_substr($sTitle, 0, 30, "euckr")."...", $sTitle);
                $aData[$iKey]['bo_title'] = $sTitle;
            }
        
            $aData[$iKey]['bo_num'] = $aPagingVar['iBoNum'];
            $aPagingVar['iBoNum'] -= 1;
        }
        
        $this->template_->viewDefine('board_paging', 'board/board_paging.tpl');
        $this->template_->viewAssign(array(
        	'aPagingVar' => $aPagingVar
        ));
        $sPaging = $this->template_->viewFetch('board_paging');
        
        $aOutput = array(
            'aList'   => $aData,
            'sPaging' => $sPaging
        );
        
        echo json_encode_euckr($aOutput);
    }
    
    //페이징 처리에 필요한 변수
    private function getPagingVar($iTotalRecord = "", $iCurrentPage = "")
    {
        $iTotalPage = ceil($iTotalRecord / $this->iScreenSize);
        
        if ($iCurrentPage > $iTotalPage && $iTotalPage > 0) {
            locationReplace('/Board/lists', '존재하지 않는 페이지입니다.', "window");
            exit;
        }
        
        $iCurrentBlock = ceil($iCurrentPage / $this->iBlockSize);
        $iStartRow     = ceil(($iCurrentPage - 1) * $this->iScreenSize);
        $iEndRow       = ceil($iCurrentPage * $this->iScreenSize);
        $iStartPage    = ceil(($iCurrentBlock - 1) * $this->iBlockSize + 1);
        $iBoNum        = ceil($iTotalRecord - ($this->iScreenSize * ($iCurrentPage - 1)));
        
        //마지막 block에서 startPage와 endPage의 갯수가 blockSize보다 작을 때
        if ($iTotalPage < ceil($iStartPage + $this->iBlockSize - 1)) {
            //마지막 block의 endPage
            $iEndPage = $iTotalPage;
        } else {
            //마지막 block이 아닐때 endPage
            $iEndPage = ceil($iStartPage + $this->iBlockSize - 1);
        }
        
        $aPagingVar = array(
            'iCurrentPage'  => $iCurrentPage,
            'iTotalPage'    => $iTotalPage,
            'iCurrentBlock' => $iCurrentBlock,
            'iStartRow'     => $iStartRow,
            'iEndRow'       => $iEndRow,
            'iStartPage'    => $iStartPage,
            'iBoNum'        => $iBoNum,
            'iEndPage'      => $iEndPage
        );
        
        return $aPagingVar;
    }
} 
?>