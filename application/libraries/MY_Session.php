<?php  if (!defined('BASEPATH')) exit('No direct script access allowed');

/**
 * using native PHP session
 */
class MY_Session {
    
    function MY_Session()
    {
        $this->_sess_run();
    }
    
    /**
     * Starts up the session system for current request
     */
    function _sess_run()
    {
        session_start();
    }    

    /**
     * all session data
     */
    function all_userdata()
    {
        return $_SESSION;
    }
    
    
    /**
     * Reads given session attribute value
     */    
    function userdata($item)
    {
        return ( ! isset($_SESSION[$item])) ? false : $_SESSION[$item];
    }
    
    /**
     * Sets session attributes to the given values
     */
    function set_userdata($newdata = array(), $newval = '')
    {
        if (is_string($newdata))
        {
            $newdata = array($newdata => $newval);
        }
    
        if (count($newdata) > 0)
        {
            foreach ($newdata as $key => $val)
            {
                $_SESSION[$key] = $val;
            }
        }
    }
    
    /**
     * Erases given session attributes
     */
    function unset_userdata($newdata = array())
    {
        if (is_string($newdata))
        {
            $newdata = array($newdata => '');
        }
    
        if (count($newdata) > 0)
        {
            foreach ($newdata as $key => $val)
            {
                unset($_SESSION[$key]);
            }
        }        
    }
    
    /**
     * Destroys the session and erases session storage
     */
    function sess_destroy()
    {
        //unset($_SESSION);
        session_unset();
        if ( isset( $_COOKIE[session_name()] ) )
        {
            setcookie(session_name(), '', time()-42000, '/');
        }
        session_destroy();
    }    
    
}
?>