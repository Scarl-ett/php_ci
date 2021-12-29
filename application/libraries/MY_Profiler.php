<?php
/**
 * 프로파일러 확장합니다.
 * 다중 데이터베이스 환경에서 DB서버별로 분리된 쿼리 디버깅이 가능하게 확장
 * 
 * @author junhan Lee <junes@gmail.com>
 */
class MY_Profiler extends CI_Profiler
{
    function __construct()
    {
        parent::__construct();
    }
    
    /**
     * Compile Queries
     *
     * @access    private
     * @return    string
     */    
    function _compile_queries()
    {
        $dbs = array();

        // Let's determine which databases are currently connected to
        foreach (get_object_vars($this->CI) as $CI_object)
        {
            if (is_object($CI_object) && is_subclass_of(get_class($CI_object), 'CI_DB'))
            {
                $dbs[] = $CI_object;
            }
        }
                    
        if (count($dbs) == 0)
        {
            $output  = "\n\n";
            $output .= '<fieldset style="border:1px solid #0000FF;padding:6px 10px 10px 10px;margin:20px 0 20px 0;background-color:#eee">';
            $output .= "\n";
            $output .= '<legend style="color:#0000FF;">&nbsp;&nbsp;'.$this->CI->lang->line('profiler_queries').'&nbsp;&nbsp;</legend>';
            $output .= "\n";        
            $output .= "\n\n<table cellpadding='4' cellspacing='1' border='0' width='100%'>\n";
            $output .="<tr><td width='100%' style='color:#0000FF;font-weight:normal;background-color:#eee;'>".$this->CI->lang->line('profiler_no_db')."</td></tr>\n";
            $output .= "</table>\n";
            $output .= "</fieldset>";
            
            return $output;
        }
        
        // Load the text helper so we can highlight the SQL
        $this->CI->load->helper('text');

        // Key words we want bolded
        $highlight = array('SELECT', 'DISTINCT', 'FROM', 'WHERE', 'AND', 'LEFT&nbsp;JOIN', 'ORDER&nbsp;BY', 'GROUP&nbsp;BY', 'LIMIT', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'OR', 'HAVING', 'OFFSET', 'NOT&nbsp;IN', 'IN', 'LIKE', 'NOT&nbsp;LIKE', 'COUNT', 'MAX', 'MIN', 'ON', 'AS', 'AVG', 'SUM', '(', ')');

        $output  = "\n\n";
            
        foreach ($dbs as $db)
        {
            $output .= '<fieldset style="border:1px solid #0000FF;padding:6px 10px 10px 10px;margin:20px 0 20px 0;background-color:#eee">';
            $output .= "\n";
            $output .= '<legend style="color:#0000FF;">&nbsp;&nbsp;'.$this->CI->lang->line('profiler_database').':&nbsp; '.$db->database.'&nbsp;&nbsp;&nbsp;'.$this->CI->lang->line('profiler_queries').': '.count($db->queries).'&nbsp;&nbsp;&nbsp;</legend>';
            $output .= "\n";        
            $output .= "\n\n<table cellpadding='4' cellspacing='1' border='0' width='100%'>\n";
        
            if (count($db->queries) == 0)
            {
                $output .= "<tr><td width='100%' style='color:#0000FF;font-weight:normal;background-color:#eee;'>".$this->CI->lang->line('profiler_no_queries')."</td></tr>\n";
            }
            else
            {                
                foreach ($db->queries as $key => $val)
                {                    
                    $time = number_format($db->query_times[$key], 4);

                    $val = highlight_code($val, ENT_QUOTES);
    
                    foreach ($highlight as $bold)
                    {
                        $val = str_replace($bold, '<strong>'.$bold.'</strong>', $val);    
                    }
                    
                    $output .= "<tr><td valign='top' style='color:#990000;font-weight:normal;background-color:#ddd;'>".$time."&nbsp;&nbsp;</td><td style='color:#000;font-weight:normal;background-color:#ddd;'>".$val."</td></tr>\n";
                }
            }
            
            $output .= "</table>\n";
            $output .= "</fieldset>";
            
        }
        
        return $output;
    }

    
    // --------------------------------------------------------------------
}

/* End of file */