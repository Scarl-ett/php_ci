<?php
/**
 * Optimizer
 *
 * CSS, JS ���ϵ��� ����ȭ�� �����մϴ�.
 * 
 * @author ������ <junhan127@chungchy.com>
 * @version 1.0
 * @package 
 * 
 */
class Optimizer
{
    private $ci = NULL;
    
    /**
     * JS ���� ���
     */
    private $aJs = array();
    
    /**
     * �ܺ� JS ���� ���
     */    
    private $aExternalJs = array();
    
    /**
     * CSS ���� ���
     */
    private $aCss = array();
    
    public function __construct() {
        
        $this->ci =& get_instance();
        
    }
    
    /**
     * JS, CSS �±� ��ȯ
     */
    public function makeOptimizerScriptTag()
    {
        $sJsTag = $this->_makeTagJs();

        $sCssTag = $this->_makeTagCss();
        
        return array('js_optimizer' => $sJsTag, 'css_optimizer' => $sCssTag);
    }    
    
    /**
     * JS �±�
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
        
        # �ܺ� JS �ε�
        if (!empty($this->aExternalJs)) {
            foreach ($this->aExternalJs as $iKey => $sValue)
            {
                $sResult .= sprintf('<script type="text/javascript" src="%s"></script>', $sValue);
            }
        }
        
        return $sResult;
    }    
    
    /**
     * CSS �±�
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
            $ext = substr(strrchr($sValue,"/"),1);	//Ȯ���ھ� .�� �����ϱ� ���Ͽ� substr()�Լ��� �̿�
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
