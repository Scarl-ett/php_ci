<?php

class Api_common_model extends MY_Model {

    public function __construct()
    {
        // Call the Model constructor
        parent::__construct();
    }

    // 마일리지
    public function getUserMileage($iUserCode = 0)
    {
        $sSql = "
        ";

        $aData = $this->excute($sSql, 'row');

        return $aData;
    }
}

/* End of file */