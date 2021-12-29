<?php 
/**
 * post_controller_constructor
 * 
 * ��Ʈ�ѷ� �޼ҵ尡 ����Ǳ��� �ʿ��� ó��(��Ʈ�ѷ� �ν��Ͻ�ȭ ����)
 * 
 * @author junhan Lee <junes@gmail.com>
 */
class post_controller_constructor {

    private $ci = NULL;

    public function init()
    {
        $this->ci = & get_instance();

        $this->ci->load->helper(array('must', 'url'));

        #�α��� ó��
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
        * isset : ������ null �̸� false, �ƴ϶�� true ��ȯ
        * is_array : ������ Ÿ���� array �̸� true, �ƴ϶�� false ��ȯ
        * in_array : �迭�� �ش� ��Ұ� �ִ��� �˻��Ͽ� �ִٸ� true, ���ٸ� false ��ȯ
        */
        if ($bAllow == false && $bApi == false) {
            //�α��� ����
            $sId = $this->ci->session->userdata("session_id");
            if ( !empty($sId) === false ) {
                //������ ���� ���
                locationReplace("/");
                exit;
            }
        }
    }
}