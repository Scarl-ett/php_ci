<?php
    function getContentUrl()
    {
        //CDN
        //$sUrl = CONTENT_CDN;

        //origin
        $sUrl = CONTENT;

        return $sUrl;
    }

    function locationReplace($url, $msg="", $position="top")
    {
        if ($position) {
            $position = $position.'.';
        }
        echo "
                <!DOCTYPE html>
                <html lang='ko'>
                <head>
                <meta http-equiv='Content-Type' content='text/html; charset=EUC-KR'>
                <meta http-equiv='X-UA-Compatible' content='IE=Edge'>
                <script type='text/javascript'>
                    if('".$msg."' != ''){ alert('".$msg."'); }
                    ".$position."location.replace('".$url."');
                </script>
                </head>
                <body>
                </body>
                </html>
            ";        
    }

    function locationReplaceClose($url, $msg="", $position="top")
    {
        if ($position) {
            $position = $position.'.';
        }
        echo "
                <!DOCTYPE html>
                <html lang='ko'>
                <head>
                <meta http-equiv='Content-Type' content='text/html; charset=EUC-KR'>
                <script type='text/javascript'>
                    if('".$msg."' != ''){ alert('".$msg."');self.close(); }
                    ".$position."location.replace('".$url."');
                </script>
                </head>
                <body>
                </body>
                </html>
            ";
    }
    
    function windowClose()
    {
        echo "
                <!DOCTYPE html>
                <html lang='ko'>
                <head>
                <meta http-equiv='Content-Type' content='text/html; charset=EUC-KR'>
                <script type='text/javascript'>
                    opener = window;
                    window.close();
                </script>
                </head>
                <body>
                </body>
                </html>
            ";        
    }
    
    function selfClose($msg="")
    {
        echo "
                <!DOCTYPE html>
                <html lang='ko'>
                <head>
                <meta http-equiv='Content-Type' content='text/html; charset=EUC-KR'>
                <script type='text/javascript'>
                    if('".$msg."' != ''){ alert('".$msg."'); }
                    self.close();
                </script>
                </head>
                <body>
                </body>
                </html>
            ";        
    }

    function parentSelfClose($sMsg = "")
    {
        echo "
                <!DOCTYPE html>
                <html lang='ko'>
                <head>
                <meta http-equiv='Content-Type' content='text/html; charset=EUC-KR'>
                <script type='text/javascript'>
                    if ('".$sMsg."' != '') {
                        alert('".$sMsg."');
                    }

                    parent.window.open('', '_self', '');
                    parent.window.close();
                </script>
                </head>
                <body>
                </body>
                </html>
        ";
    }

    function submitClose($url, $formArray = array(), $msg="", $position="top", $formName='')
    {
        if ($position) {
            $position = $position.'.';
        }
        
        /* $formArrayKeys = array_keys($formArray);
        
        $formInputData = "";
        for ($i=0; $i<count($formArray); $i++) {
            $formInputData .= "<input type='hidden' name='".$formArrayKeys[$i]."' id='".$formArrayKeys[$i]."' value='".$formArray[$formArrayKeys[$i]]."'>";
        } */
        
        echo "
                <!DOCTYPE html>
                <html lang='ko'>
                <head>
                <meta http-equiv='Content-Type' content='text/html; charset=EUC-KR'>
                </head>
                <body>
                <script type='text/javascript'>
                    if('".$msg."' != ''){ alert('".$msg."'); }
                    var form = ".$position."document.".$formName.";
                            
                    form.login_type.value = '".$formArray['login_type']."';
                    form.login_id.value = '".$formArray['login_id']."';
                    form.login_pw.value = '".$formArray['login_pw']."';
                            
                    form.action = '".$url."';
                    form.submit();
                            
                    self.close();
                </script>
                </body>
                </html>
            ";
    }
    
    function historyBack($msg="")
    {
        echo "
                <!DOCTYPE html>
                <html lang='ko'>
                <head>
                <meta http-equiv='Content-Type' content='text/html; charset=EUC-KR'>
                <script type='text/javascript'>
                    if('".$msg."' != ''){ alert('".$msg."'); }
                    history.back();
                </script>
                </head>
                <body>
                </body>
                </html>
            ";        
    }

    function alert($msg, $url = '', $target = '')
    {
        if ($url) {
            if ($target) {
                $target = $target.'.';
            }
            if($url == 'back') {
                $url = 'history.back(-1);'; 
            } else {
                $url = $target.'document.location="'.$url.'";';
            }
        }
        $sAlert = '';
        if ($msg) {
            $sAlert = "alert('".str_replace("\n", '\\n', $msg)."');";
        }
        echo "
                <!DOCTYPE html>
                <html lang='ko'>
                <head>
                <meta http-equiv='Content-Type' content='text/html; charset=EUC-KR'>
                <script type='text/javascript'>
                    $sAlert
                ".$url."
                </script>
                </head>
                <body>
                </body>
                </html>
            ";
    }
    
    function documentWrite($msg, $url = '', $target = '')
    {
        if ($url) {
            if ($target) {
                $target = $target.'.';
            }
            if($url == 'back') {
                $url = 'history.back(-1);'; 
            } else 
                $url = $target.'document.location="'.$url.'";';
        }

        echo "
                <!DOCTYPE html>
                <html lang='ko'>
                <head>
                <meta http-equiv='Content-Type' content='text/html; charset=EUC-KR'>
                <script type='text/javascript'>
                    document.write('".str_replace("\n", '\\n', $msg)."');
                ".$url."
                </script>
                </head>
                <body>
                </body>
                </html>
            ";
    }    
    
    function javascript($sCommand = '')
    {
        echo "
                <!DOCTYPE html>
                <html lang='ko'>
                <head>
                <meta http-equiv='Content-Type' content='text/html; charset=EUC-KR'>
                <script type='text/javascript'>
                    ".$sCommand."
                </script>
                </head>
                <body>
                </body>
                </html>
            ";
    }    
    


    function endloding()
    {

        echo "
                <!DOCTYPE html>
                <html lang='ko'>
                <head>
                <meta http-equiv='Content-Type' content='text/html; charset=EUC-KR'>
                <script type='text/javascript' src='/js/ec.js?load=ajax'></script>
                <script type='text/javascript'>
                    parent.EC.AJAX.Loader.end();
                </script>
                </head>
                <body>
                </body>
                </html>
            ";
    }
?>
