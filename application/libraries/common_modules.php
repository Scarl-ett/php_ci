<?php
/**
 * @author junhan Lee <junes@gmail.com>
 */
class Common_modules
{
    private $ci = NULL;
    
    public function __construct($common_modules)
    {
        $this->ci =& get_instance();
        
        if (empty($common_modules)) {
            return;
        }
        
        foreach ($common_modules as $value) {
            $this->ci->load->library('common_modules/'.$value);
        }
    }
}

/* End of file */