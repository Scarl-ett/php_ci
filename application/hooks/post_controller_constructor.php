<?php 
/**
 * post_controller_constructor
 * 
 * 컨트롤러 메소드가 실행되기전 필요한 처리(컨트롤러 인스턴스화 직후)
 * 
 * @author junhan Lee <junes@gmail.com>
 */
class post_controller_constructor {

    private $ci = NULL;

    public function init()
    {
        $this->ci = & get_instance();

        $this->ci->load->helper(array('must', 'url'));

        #로그인 처리
        $this->getLogin();
    }

    private function getLogin()
    {
        $bAllow = false;
        if (is_object($this->ci->allow) === true && strtolower(get_class($this->ci->allow)) == $this->ci->router->class) {
            $bAllow = true;
        }
                
        if (isset($this->ci->allow) === true && is_array($this->ci->allow) === true && in_array($this->ci->router->method, $this->ci->allow) === true) {
            $bAllow = true;
        }

        $bApi = strstr($this->ci->router->directory, 'Api');
        
        /*
        * isset : 변수가 null 이면 false, 아니라면 true 반환
        * is_array : 변수의 타입이 array 이면 true, 아니라면 false 반환
        * in_array : 배열에 해당 요소가 있는지 검사하여 있다면 true, 없다면 false 반환
        */
        if ($bAllow == false && $bApi == false) {
            //로그인 여부
            $sId = $this->ci->session->userdata("session_id");
            if ( !empty($sId) === false ) {
                //세션이 없을 경우
                locationReplace("/");
                exit;
            }
        }
    }
}