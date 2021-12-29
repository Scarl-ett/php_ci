<?php
/**
 * 공통적으로 쓰이는 모델 집합
 * 
 * 해당 모델은 CI 구동시 자동으로 로드되기 때문에 컨트롤러에서 로드 시킬필요 없음
 * 
 * @author junhan Lee <junes@gmail.com>
 */
class Common_model extends MY_Model {

    public function __construct()
    {
        // Call the Model constructor
        parent::__construct();
    }
    
}

/* End of file */