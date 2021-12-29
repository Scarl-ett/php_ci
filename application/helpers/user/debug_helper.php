<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
 
/**
 * Outputs an array or variable
 *
 * @param    $var array, string
 * @return    string
 */
function d($var = '', $ip = '')
{
    // 실서버 디버깅
    if (!empty($ip) && $_SERVER['REMOTE_ADDR'] != $ip) {
        return;
    }
    
    echo _before();
    if (is_array($var) || is_object($var))
    {
        print_r($var);
    }
    else
    {
        if (is_bool($var)) {
            echo $var ? 'bool(true)' : 'bool(false)';
        } else {
            echo $var;
        }
    }
    echo _after();
}
 

/**
 * _before
 *
 * @return    string
 */
function _before()
{
    $before = '<div style="padding:10px 20px 10px 20px; background-color:#fbe6f2; border:1px solid #d893a1; color: #000; font-size: 12px;>'."\n";
    $before .= '<h5 style="font-family:verdana,sans-serif; font-weight:bold; font-size:18px;">Debug Helper Output - by June</h5>'."\n";
    $before .= '<pre>'."\n";
    return $before;
}
 
/**
 * _after
 *
 * @return    string
 */
 
function _after()
{
    $after = '</pre>'."\n";
    $after .= '</div>'."\n";
    return $after;
}
 
 
//------------------------------------------------------------------------------