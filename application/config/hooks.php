<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/*
| -------------------------------------------------------------------------
| Hooks
| -------------------------------------------------------------------------
| This file lets you define "hooks" to extend CI without hacking the core
| files.  Please see the user guide for info:
|
|	http://codeigniter.com/user_guide/general/hooks.html
|
*/

/**
 * post_controller_constructor
 * ��Ʈ�ѷ� �ν��Ͻ�ȭ ����
 */
$hook['post_controller_constructor'] = array(
        'class'    => 'post_controller_constructor',
        'function' => 'init',
        'filename' => 'post_controller_constructor.php',
        'filepath' => 'hooks',
        'params'   => ""
);

/**
 * post_controller
 * ��Ʈ�ѷ��� ����� ��
*/
$hook['post_controller'] = array(
        'class'    => 'post_controller',
        'function' => 'init',
        'filename' => 'post_controller.php',
        'filepath' => 'hooks',
        'params'   => ""
);

/* End of file hooks.php */
/* Location: ./application/config/hooks.php */