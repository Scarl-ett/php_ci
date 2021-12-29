<?php
class Arbiter extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
    
        $this->allow = array('index');
    }
        
    public function index()
    {
        if (empty($this->params['files'])) die();
        
        $files = explode("-", $this->params['files']);
        
        // 로컬일땐 캐쉬 안함
        //if ($_SERVER['REMOTE_ADDR'] == '127.0.0.1') {
        //    $expires = 0;
        //} else {
        //    $expires = date('D, j M Y H:i:s GMT', time() + 60 * 60 * 24);
        //}
        
        //ob_clean();
        /*
         Content-Type: application/x-javascript; charset=utf-8
         Last-Modified: Fri, 10 Feb 2012 20:04:33 GMT
         Cache-Control: public, max-age=31190890
         Expires: Tue, 12 Feb 2013 06:31:38 GMT
         Date: Fri, 17 Feb 2012 06:23:28 GMT
         Connection: keep-alive
         Vary: Accept-Encoding
         */
        header('Content-Type: application/x-javascript; charset=euc-kr');
        //header('Expires: ' . $expires);
        
        if (OS == 'WIN') {
            $tmp_common_wwwroot_folder = 'D:\Development\workspace\test\public_html';
        } else {
            $tmp_common_wwwroot_folder = '/home/elsd/public_html_new/test/public_html';
        }        

        $path = $tmp_common_wwwroot_folder."/resource/js/common/ARBITER/";
        
        self::pathThrough($files, $path, '.js');
    }

    private static function pathThrough($files, $path, $postfix = '')
    {
        foreach ($files as $eachFile) {
            
            /*
             * prevent malicious attacks, only allow JS files
             */
            $filename = basename(trim($eachFile));
            
            $filePath = $path . $filename . $postfix;
            if (file_exists($filePath)) {
                $fp = fopen($filePath, 'r');
                fpassthru($fp);
                echo "\n";
                fclose($fp);
            }
        }
    }

}