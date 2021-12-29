<?php
class Footer
{
    private $ci = NULL;

    public function __construct()
    {
        $this->ci =& get_instance();

        $this->start();
    }

    private function start()
    {
        $this->ci->template_->viewDefine('footer', 'Common/footer.tpl');
        $this->ci->template_->viewAssign(array(

        ));

        $this->ci->js('common/footer.js', '2020122301');
    }
}

/* End of file */