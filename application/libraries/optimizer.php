<?php
/**
 * Optimizer
 *
 * CSS, JS 파일들의 최적화를 제공합니다.
 * 
 * @author 이준한 <junhan127@chungchy.com>
 * @version 1.0
 * @package 
 * 
 */
class Optimizer
{
    private $ci = NULL;
    
    /**
     * JS 파일 목록
     */
    private $aJs = array();
    
    /**
     * 외부 JS 파일 목록
     */    
    private $aExternalJs = array();
    
    /**
     * CSS 파일 목록
     */
    private $aCss = array();
    
    public function __construct() {
        
        $this->ci =& get_instance();
        
    }
    
    /**
     * JS, CSS 태그 반환
     */
    public function makeOptimizerScriptTag()
    {
        $sJsTag = $this->_makeTagJs();

        $sCssTag = $this->_makeTagCss();
        
        return array('js_optimizer' => $sJsTag, 'css_optimizer' => $sCssTag);
    }    
    
    /**
     * JS 태그
     *
     * @param $sJs
     * @return string
     */
    private function _makeTagJs()
    {
        //if (empty($this->aJs)) return '';

        $sResult = '';
        foreach ($this->aJs as $iKey => $sValue)
        {
            $sResult .= sprintf('<script type="text/javascript" src="/public_html/resource/js/%s"></script>', $sValue);
        }
        
        # 외부 JS 로드
        if (!empty($this->aExternalJs)) {
            foreach ($this->aExternalJs as $iKey => $sValue)
            {
                $sResult .= sprintf('<script type="text/javascript" src="%s"></script>', $sValue);
            }
        }
        
        return $sResult;
    }    
    
    /**
     * CSS 태그
     *
     * @param $sCss
     * @return string
     */
    private function _makeTagCss()
    {
        //if (empty($this->aCss)) return '';

        $sResult = '';
        foreach ($this->aCss as $iKey => $sValue)
        {    
            $ext = '';
            $ext = substr(strrchr($sValue,"/"),1);	//확장자앞 .을 제거하기 위하여 substr()함수를 이용
            $ext_pos = substr(strrpos($ext, "."),0);
            $ext = substr($ext,0,$ext_pos);

            if ($ext == 'print') {
                $sResult .= sprintf('<link rel="stylesheet" type="text/css" href="/public_html/resource/css/%s" media="print" />', $sValue);
            } else {
                $sResult .= sprintf('<link rel="stylesheet" type="text/css" href="/public_html/resource/css/%s" />', $sValue);
            }
        }        
        
        return $sResult;
    }    
    
    public function setJs($file, $v='')
    {
        if (empty($file)) {
            return;
        }
        
        $fileFullPath  = PUBLICPATH . '/resource/js/' . $file;

        if ( file_exists( $fileFullPath ) ) {
            $file = !empty($v) ? $file."?v=".$v : $file;
            $this->aJs[] = $file;
        }                            
    }    
    
    public function setExternalJs($file)
    {
        if (empty($file)) {
            return;
        }

        $this->aExternalJs[] = $file;
    }    
    
    public function setCss($file, $v='')
    {
        if (empty($file)) {
            return;
        }

        $fileFullPath  = PUBLICPATH . '/resource/css/' . $file;

        if ( file_exists( $fileFullPath ) ) {
            $file = !empty($v) ? $file."?v=".$v : $file;
            $this->aCss[] = $file;
        }
    }
}
