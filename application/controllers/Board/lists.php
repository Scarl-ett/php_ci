<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Lists extends MY_Controller {
    //�� �������� ������ ����Ʈ ��
    public $iScreenSize;
    //�� ȭ�鿡 ������ ������ ��
    public $iBlockSize;
    
    public function __construct()
    {
        parent::__construct();
        
        $this->load->model('board/lists_model');
        
        $this->iScreenSize = 10;
        $this->iBlockSize = 5;
    }
    
    //board_list - ����
    public function index()
    {
        $this->template_->viewDefine('layout_elsd', 'Board/board_list.tpl');
        $this->js(array('common/regex.js', 'board/board_list.js'));
    }
    
    //board_list - �񵿱�
    public function boardListAjax()
    {
        //���� ������
        $iCurrentPage = !empty($this->params['page']) ? (int)trim($this->params['page']) : 1;
        
        //�˻�����
        $sSearchType = !empty($this->params['searchType']) ? trim($this->params['searchType']) : "";
        $sSearchWord = !empty($this->params['searchWord']) ? trim($this->params['searchWord']) : "";
        
        $this->iScreenSize = !empty($this->params['screenSize']) ? (int)trim($this->params['screenSize']) : $this->iScreenSize;
        
        //�� �Խñ� ��ȸ
        $iTotalRecord = $this->lists_model->selectTotalRecord($sSearchType, $sSearchWord);
        
        //����¡ ó���� �ʿ��� ������
        $aPagingVar = $this->getPagingVar($iTotalRecord, $iCurrentPage);
        
        //�Խñ� ��ȸ
        $aData = $this->lists_model->selectBoardList($this->iScreenSize, $aPagingVar, $sSearchType, $sSearchWord);
        foreach ($aData as $iKey => $aValue) {
            $sTitle = $aData[$iKey]['bo_title'];
        
            //������ 30�ڰ� ������ ...�� ��ü
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
    
    //����¡ ó���� �ʿ��� ����
    private function getPagingVar($iTotalRecord = "", $iCurrentPage = "")
    {
        $iTotalPage = ceil($iTotalRecord / $this->iScreenSize);
        
        if ($iCurrentPage > $iTotalPage && $iTotalPage > 0) {
            locationReplace('/Board/lists', '�������� �ʴ� �������Դϴ�.', "window");
            exit;
        }
        
        $iCurrentBlock = ceil($iCurrentPage / $this->iBlockSize);
        $iStartRow     = ceil(($iCurrentPage - 1) * $this->iScreenSize);
        $iEndRow       = ceil($iCurrentPage * $this->iScreenSize);
        $iStartPage    = ceil(($iCurrentBlock - 1) * $this->iBlockSize + 1);
        $iBoNum        = ceil($iTotalRecord - ($this->iScreenSize * ($iCurrentPage - 1)));
        
        //������ block���� startPage�� endPage�� ������ blockSize���� ���� ��
        if ($iTotalPage < ceil($iStartPage + $this->iBlockSize - 1)) {
            //������ block�� endPage
            $iEndPage = $iTotalPage;
        } else {
            //������ block�� �ƴҶ� endPage
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