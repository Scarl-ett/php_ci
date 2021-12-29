<?php
/**
 * @package : 
 * @author  : 이준한
 * @version : 1.0
 * @date    : 2013-09-26
 * 
 * @todo : 모든 컨트롤러는 이클래스를 상속 받아 사용합니다.
 */
class MY_Controller extends CI_Controller
{
    # Parameter reference
    public $params = array();
    
    # 인증 처리 예외
    public $allow = array();
    
    public function __construct() {

        parent::__construct();

        $this->load->helper('url');
        
        # Parameter
        $this->params = $this->getParams();
    }
    
    private function getParams() {
        
        $bXss = true; // xss 검사 여부
        $bInjection = true; // SQL Injection 검사 여부

        // api 폴더 여부
        if (strstr($this->router->uri->uri_string, 'Api/') !== false) {
            $bXss = false;
            $bInjection = false;
        }

        $aParams = array_merge($this->doGet($bXss), $this->doPost($bXss));
        $aParams = $this->recursiveArrayCharConvert($aParams);
        
        if ($bInjection === true) {
            $this->sql_injection_filter($aParams);
        }
        
        return $aParams;
    }                
    
    // sql 인젝션 필터링
    private function sql_injection_filter($str)
    {
        /*
         * Is the string an array?
        *
        */
        if (is_array($str))
        {
            while (list($key) = each($str))
            {
                $str[$key] = $this->sql_injection_filter($str[$key]);
            }
    
            return $str;
        }
         
        $aPatterns = array(
            "delete[[:space:]]+from",
            "drop[[:space:]]+database",
            "drop[[:space:]]+table",
            "drop[[:space:]]+column",
            "drop[[:space:]]+procedure",
            "create[[:space:]]+table",
            "update[[:space:]]+.*[[:space:]]+set",
            "insert[[:space:]]+into.*[[:space:]]+values",
            "select[[:space:]]+.*[[:space:]]+from",
            "bulk[[:space:]]+insert",
            "union[[:space:]]+select",
            "union+.*select",
            "select+.*concat",
            "union/\*\*/[[:space:]]+select/\*\*/",
            "/\*[[:space:]]+\*/",
            "/\*\*/",
            "or+[[:space:]]+[a-zA-Z]+[[:space:]]*['\"]?[[:space:]]*=[[:space:]]*\(?['\"]?[[:space:]]*[a-zA-Z]+",
            "or+[[:space:]]+[0-9]+[[:space:]]*['\"]?[[:space:]]*=[[:space:]]*\(?['\"]?[[:space:]]*[0-9]+",
            "alter[[:space:]]+table",
            "into[[:space:]]+outfile",
            "load[[:space:]]+data",
            "declare.+varchar.+set"
                
        );
         
        foreach ($aPatterns as $regexp)
        {
            $esc_regexp = str_replace("/", "\/", $regexp);
    
            if (preg_match("/$esc_regexp/", strtolower($str))) {
                exit('error : sql injection attack');
            }
        }
    }    
    
    /**
     * UTF-8 로 넘어온 파라미터 모두 EUC-KR 로 변환
     * @param unknown $input
     * @return string
     */
    private function recursiveArrayCharConvert($input){
        
        $aChar = array(
            "UTF-8",
            "EUC-KR"
        );
                
        foreach($input as $key => $array){
            if(is_array($array)){
                $input[$key] = $this->recursiveArrayCharConvert($array);
            } else {
                $sCharCheck = mb_detect_encoding($array, $aChar);
                if ($sCharCheck == 'UTF-8' && $array != '정윤정') {
                    $input[$key] = iconv("utf-8", "euc-kr", $array);
                }                
            }
        }
        return $input;
    }    
    
    private function doGet($bXss = true)
    {
        $aGetData = $this->input->get(NULL, $bXss);
        return (empty($aGetData)) ? array() : $aGetData;
    }
    
    private function doPost($bXss = true)
    {
        $aPostData = $this->input->post(NULL, $bXss);
        return (empty($aPostData)) ? array() : $aPostData;
    }    
    
    public function js($file, $v = '')
    {
        if (is_array($file)) {
            foreach ($file as $iKey => $sValue) {
                $this->optimizer->setJs($sValue, $v);
            }
        } else {
            $this->optimizer->setJs($file, $v);
        }
    }    
    
    public function externaljs( $file )
    {
        if (is_array($file)) {
            foreach ($file as $iKey => $sValue) {
                $this->optimizer->setExternalJs($sValue);
            }
        } else {
            $this->optimizer->setExternalJs($file);
        }
    }    
    
    public function css( $file, $v = '')
    {
        if (is_array($file)) {
            foreach ($file as $iKey => $sValue) {
                $this->optimizer->setCss($sValue, $v);
            }
        } else {
            $this->optimizer->setCss($file, $v);
        }        
    }
}
?>
