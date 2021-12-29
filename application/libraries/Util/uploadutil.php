<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/* 
 *  ======================================= 
 *  Author     : ������
 *  ======================================= 
 */
class Uploadutil { 
    public function __construct() { 
        $this->ci =& get_instance();
    } 

    // ���� �˻�
    function checkFile($aFile = array())
    {
        $aReturn = array(
        	'bResult' => false,
            'sReason' => ""
        );

        // ������ HTTP ���������� POST����� ���� ���ε�Ǿ������� Ȯ��
        $bSuccessUpload = is_uploaded_file($aFile['tmp_name']);

        if ($bSuccessUpload) {

            $allow_file   = array("gif", "jpeg", "jpg", "png", "zip", "hwp", "doc", "docx", "mp3", "pdf", "xls", "xlsx", "ppt", "pptx");
            $filename_ext = $this->getFileExt($aFile['name']);

            if(!in_array($filename_ext, $allow_file)) {
                $aReturn['sReason'] = '���ε尡 ������ ���� Ȯ���� �Դϴ�.';
                return $aReturn;
            }

            if ($aFile["size"] > 41943040) {
                $aReturn['sReason'] = '���ε� ��� ũ��(40MB)�� �ʰ��� �� �����ϴ�.';
                return $aReturn;
            }

        } else {
            $aReturn['sReason'] = '�߸��� ���� �Դϴ�.';
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

    // Ȯ���� ����
    function getFileExt($sFileName = "") 
    {
        $sFileNameExt = explode('.', $sFileName);
        $sFileNameExt = strtolower(array_pop($sFileNameExt));

        return $sFileNameExt;
    }

    // ���� �˻�
    function checkKorean($sFileName = "")
    {
        $aReturn = array(
            'bResult' => false,
            'sReason' => ""
        );

        if (preg_match("/[\xA1-\xFE][\xA1-\xFE]/", $sFileName) == true) {
            $aReturn['sReason'] = '÷�����ϸ��� �ѱ��� ����Ͻ� �� �����ϴ�.\n���ϸ��� �����̳� ���ڷ� �������ּ���.';
            return $aReturn;
        }

        $aReturn['bResult'] = true;
        return $aReturn;
    }

    // FTP ����
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

    // ��� �˻� �� ��� ����
    function createPath($sCreatePath = "", $sTargetPath = "")
    {
        $aList = $this->ci->ftp->list_files($sTargetPath);
        if (!in_array($sCreatePath, $aList)) {
            $this->ci->ftp->mkdir($sCreatePath.'/', 0777);
            $this->ci->ftp->chmod($sCreatePath.'/', 0777);
        }
    }

    // ���� ���ε�
    function upload($sTmpName = "", $sFullPathFileName = "")
    {
        return $this->ci->ftp->upload($sTmpName, $sFullPathFileName, '', 0777);
    }

    // FTP ���� ����
    function close()
    {
        $this->ci->ftp->close();
    }
}