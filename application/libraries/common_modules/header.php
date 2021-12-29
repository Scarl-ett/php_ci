<?php
/**
 * Header
 */
class Header
{
    private $ci = NULL;
    
    public function __construct()
    {
        $this->ci =& get_instance();

        $this->start();
    }

    private function start()
    {
        $this->ci->template_->viewDefine('header', 'Common/header.tpl');
        $this->ci->template_->viewAssign(array( 

        ));

        $this->ci->js('common/header.js', '2021040701');
    }
}

/* End of file */