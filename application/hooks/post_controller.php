<?php 
/**
 * post_controller
 * 
 * ��Ʈ�ѷ��� ����� �� �ʿ��� ó��
 * 
 * @author junhan Lee <junes@gmail.com> 
 */
class post_controller {

    private $ci = NULL;

    public function init()
    {
        $this->ci =& get_instance();
        
        # ���� ȭ�� ���
        $this->_view();
    }
    
    private function _view()
    {
        # elsd ���̾ƿ�
        if ($this->ci->template_->viewDefined('layout_elsd')) {
            
            $aCommonModules = $this->getCommonModules();
            $this->ci->load->library('common_modules', $aCommonModules);
            
            $this->ci->template_->viewDefine('layout', 'Common/layout_elsd.tpl');
            $this->ci->template_->viewAssign($this->ci->optimizer->makeOptimizerScriptTag());

            $this->ci->template_->viewPrint('layout');
            
        # �⺻ ���̾ƿ�
        } else if ($this->ci->template_->viewDefined('layout_normal')) {
            
            $this->ci->template_->viewDefine('layout', 'Common/layout_normal.tpl');
            $this->ci->template_->viewAssign($this->ci->optimizer->makeOptimizerScriptTag());

            $this->ci->template_->viewPrint('layout');

        # �� ���̾ƿ�
        } else if ($this->ci->template_->viewDefined('layout_empty')) {

            $this->ci->template_->viewDefine('layout', 'Common/layout_empty.tpl');

            $this->ci->template_->viewPrint('layout');

        # ajax �� ó��
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
