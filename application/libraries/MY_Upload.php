<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class MY_Upload extends CI_Upload {
    
    /**
     * Prep Filename
     *
     * Prevents possible script execution from Apache's handling of files multiple extensions
     * http://httpd.apache.org/docs/1.3/mod/mod_mime.html#multipleext
     *
     * @param	string
     * @return	string
     */
    protected function _prep_filename($filename)
    {
        if (strpos($filename, '.') === FALSE OR $this->allowed_types == '*')
        {
            return $filename;
        }

        $parts		= explode('.', $filename);
        

        $ext		= array_pop($parts);
        $filename	= array_shift($parts);

        foreach ($parts as $part)
        {

            if ( ! in_array(strtolower($part), $this->allowed_types) OR $this->mimes_types(strtolower($part)) === FALSE)
            {
                $filename .= '.'.$part.'_';
            }
            else
            {
                $filename .= '.'.$part;
            }
        }
    
        $filename .= '.'.$ext;

        // 파일명 euc-kr로 변경
        $sCharCheck = mb_detect_encoding($filename, array("UTF-8", "EUC-KR"));
        if ($sCharCheck == 'UTF-8') {
            $filename = iconv("UTF-8", "EUC-KR", $filename);
        }        
    
        return $filename;
    }
}

/* End of file MY_Upload.php */
/* Location: ./system/libraries/Upload.php */
