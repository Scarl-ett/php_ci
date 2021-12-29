<?php

/**
 * Anchor App > Learning history
 * @author Jin Yeong
 */

class Api_learninghistory extends MY_Controller
{
    private $bTest = false;
    private $sOs   = 'android';

    public function __construct()
    {
        parent::__construct();

        $this->load->model('Api/Newapp/api_learninghistory_model');
        $this->load->model('Api/Newapp/api_common_model');
        $this->load->library('securityauth');
    }

    public function index()
    {

    }
}