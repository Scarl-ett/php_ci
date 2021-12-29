<?php
/**
 * Template_ 클래스를 확장합니다.
 * 
 * @author junhan Lee <junes@gmail.com>
 */
class MY_Template_ extends CI_Template_
{
    public function __construct() {
        
        parent::__construct();
        
    }
    
    /**
     * Initialize Preferences
     *
     * @access    public
     */
    public function initialize()
    {
        $this->compile_check    = TRUE;
        $this->compile_dir     = APPPATH."cache/_compile";
        $this->compile_ext     = 'php';
        $this->skin        = '';
        $this->notice       = FALSE;
        $this->path_digest     = FALSE;

        $this->template_dir    = APPPATH."views";
        $this->prefilter      = '';
        $this->postfilter     = '';
        $this->permission     = 0755;
        $this->safe_mode      = FALSE;
        $this->auto_constant    = FALSE;

        $this->caching       = FALSE;
        $this->cache_dir      = APPPATH."cache/_cache";
        $this->cache_expire    = 3600;

        $this->scp_        = '';
        $this->var_        = array(''=>array());
        $this->obj_        = array();
    }
    
    public function viewDefine($fid, $file)
    {
        /*
        $this->define(array($fid => $file));
        
        # 개발자 캐쉬 동작 안함
        if (OS != 'WIN' && $_SERVER['SERVER_ADDR'] != '127.0.0.1' && $_SERVER['HTTP_HOST'] != 'dev.elsd.co.kr') {
            //$this->setCache($fid);
        }
        */
        
        if ($this->viewDefined($fid) === true) {
            $this->exit_('', 'template id <b>"'.$fid.'"</b> is duplicated.');
        }
                
        $this->define(array($fid => $file));
        $this->setScope($fid); // 스코프 설정 (tpl간 변수 충돌 방지 - https://www.xtac.net/tutorial5/#scope)
    }    
    public function viewDefined($fid)
    {
        return $this->defined($fid);
    }    
    
    public function viewAssign($key, $value = NULL)
    {
        if (is_array($key) && $value == NULL) {
            $this->assign($key);
        } else {
            $this->assign(array($key => $value));
        }
        $this->setScope(); // 스코프 초기화
    }        
        
    public function viewPrint($fid)
    {
        if ($this->viewDefined($fid)) {
            $this->print_($fid);
        }
    }
    
    /**
     * 출력하지 않고 html 내용을 변수로 담을 수 있다.
     * @param type $fid
     * @return type
     */
    public function viewFetch($fid)
    {
        if ($this->viewDefined($fid)) {
            return $this->fetch($fid);
        }
    }    
    
}

/* End of file */