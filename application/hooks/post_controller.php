<?php 
/**
 * post_controller
 * 
 * 컨트롤러가 실행된 후 필요한 처리
 * 
 * @author junhan Lee <junes@gmail.com> 
 */
class post_controller {

    private $ci = NULL;

    public function init()
    {
        $this->ci =& get_instance();
        
        # 최종 화면 출력
        $this->_view();
    }
    
    private function _view()
    {
        # elsd 레이아웃
        if ($this->ci->template_->viewDefined('layout_elsd')) {
            
            $aCommonModules = $this->getCommonModules();
            $this->ci->load->library('common_modules', $aCommonModules);
            
            $this->ci->template_->viewDefine('layout', 'Common/layout_elsd.tpl');
            $this->ci->template_->viewAssign($this->ci->optimizer->makeOptimizerScriptTag());

            $this->ci->template_->viewPrint('layout');
            
        # 기본 레이아웃
        } else if ($this->ci->template_->viewDefined('layout_normal')) {
            
            $this->ci->template_->viewDefine('layout', 'Common/layout_normal.tpl');
            $this->ci->template_->viewAssign($this->ci->optimizer->makeOptimizerScriptTag());

            $this->ci->template_->viewPrint('layout');

        # 빈 레이아웃
        } else if ($this->ci->template_->viewDefined('layout_empty')) {

            $this->ci->template_->viewDefine('layout', 'Common/layout_empty.tpl');

            $this->ci->template_->viewPrint('layout');

        # ajax 등 처리
        } else {}
    }

    private function getCommonModules()
    {
        $sPrefix = $this->ci->router->class."/".$this->ci->router->method;

        switch ($sPrefix) {
            /*
            case 'main/index' :
                $aCommonModules = array(
                    'header'
                );
            break;
            */
            default :
                $aCommonModules = array(
                    'header', 'footer'
                );
            break;
        }

        return $aCommonModules;
    }
}
