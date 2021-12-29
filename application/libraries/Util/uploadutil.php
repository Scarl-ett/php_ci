<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/* 
 *  ======================================= 
 *  Author     : 박정규
 *  ======================================= 
 */
class Uploadutil { 
    public function __construct() { 
        $this->ci =& get_instance();
    } 

    // 파일 검사
    function checkFile($aFile = array())
    {
        $aReturn = array(
        	'bResult' => false,
            'sReason' => ""
        );

        // 파일이 HTTP 프르토콜의 POST방식을 통해 업로드되었는지를 확인
        $bSuccessUpload = is_uploaded_file($aFile['tmp_name']);

        if ($bSuccessUpload) {

            $allow_file   = array("gif", "jpeg", "jpg", "png", "zip", "hwp", "doc", "docx", "mp3", "pdf", "xls", "xlsx", "ppt", "pptx");
            $filename_ext = $this->getFileExt($aFile['name']);

            if(!in_array($filename_ext, $allow_file)) {
                $aReturn['sReason'] = '업로드가 허용되지 않은 확장자 입니다.';
                return $aReturn;
            }

            if ($aFile["size"] > 41943040) {
                $aReturn['sReason'] = '업로드 허용 크기(40MB)를 초과할 수 없습니다.';
                return $aReturn;
            }

        } else {
            $aReturn['sReason'] = '잘못된 접근 입니다.';
            return $aReturn;
        }

        $aReturn['bResult'] = true;
        return $aReturn;
    }

    function getFileName($sFileName = "")
    {
        $sDestName = date('YmdHis')."_".uniqId('file_').".".$this->getFileExt($sFileName);

        return array (
            'file_name'     => $sDestName,
            'file_name_ori' => $sFileName,
        );
    }

    // 확장자 정보
    function getFileExt($sFileName = "") 
    {
        $sFileNameExt = explode('.', $sFileName);
        $sFileNameExt = strtolower(array_pop($sFileNameExt));

        return $sFileNameExt;
    }

    // 파일 검사
    function checkKorean($sFileName = "")
    {
        $aReturn = array(
            'bResult' => false,
            'sReason' => ""
        );

        if (preg_match("/[\xA1-\xFE][\xA1-\xFE]/", $sFileName) == true) {
            $aReturn['sReason'] = '첨부파일명에는 한글을 사용하실 수 없습니다.\n파일명을 영문이나 숫자로 변경해주세요.';
            return $aReturn;
        }

        $aReturn['bResult'] = true;
        return $aReturn;
    }

    // FTP 연결
    function connect()
    {
        $this->ci->load->library('ftp');

        $config['hostname'] =  OS == 'WIN' ? '114.203.87.168' : '192.168.0.2';
        $config['username'] = 'content';
        $config['password'] = 'cjdcnlektzja0125$%^(';
        $config['debug']    = TRUE;
        $config['port']     = 21;
        $config['passive']  = TRUE;

        $s1ConnetcFlag = $this->ci->ftp->connect($config);

        if(!$s1ConnetcFlag) {
            $s2ConnetcFlag = $this->ci->ftp->connect($config);
            if(!$s2ConnetcFlag) {
                return false;
            }
        }

        return true;
    }

    // 경로 검사 및 경로 생성
    function createPath($sCreatePath = "", $sTargetPath = "")
    {
        $aList = $this->ci->ftp->list_files($sTargetPath);
        if (!in_array($sCreatePath, $aList)) {
            $this->ci->ftp->mkdir($sCreatePath.'/', 0777);
            $this->ci->ftp->chmod($sCreatePath.'/', 0777);
        }
    }

    // 파일 업로드
    function upload($sTmpName = "", $sFullPathFileName = "")
    {
        return $this->ci->ftp->upload($sTmpName, $sFullPathFileName, '', 0777);
    }

    // FTP 접속 종료
    function close()
    {
        $this->ci->ftp->close();
    }
}