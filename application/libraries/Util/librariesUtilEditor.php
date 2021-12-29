<?php
/**
 * Security Replace code
 * 웹에디터로부터 img와 media 만 허용되며
 * 태그가변경되어 들어간것을 원래태그로 복원
 * 
 * @author 이준한
 * @date 2014-06-10
 */
class librariesUtilEditor {

	public function __construct() {

	}

	static public function strInnerHTML($str) {
	    return str_replace("'", "\'", preg_replace("/\r\n|\r|\n/", "", $str));
	}
	
	static public function stripScript($str) {
	    return preg_replace( "#<script(.+?)/script>#ies", "" , $str);
	}
	
	/**
	 * security code 치환
	 * @param String $text
	 * @return String
	 */
	static public function securityReplace($text)
	{
		$text = stripslashes($text);
		$code = array(
			"/\[b\](.*?)\[\/b\]/is" => "<strong>$1</strong>",
			"/\[u\](.*?)\[\/u\]/is" => "<u>$1</u>",
			"/\[IMG\](.*?)\[\/IMG\]/is" => '<img src="$1" width="" height="" />',
			"/\[MEDIA\](.*?)\[\/MEDIA\]/is" => '',
			"/\[url\=(.*?)\](.*?)\[\/b\]/is" => "<a href='$1'>$2</a>"
		);
		$text = preg_replace_callback(array_keys($code), 'librariesUtilEditor::securityReplaceCallback', $text);
		return $text;
	}
	
	/**
	 * callback
	 * @param String $text
	 * @return String
	 */
	static public function securityReplaceCallback($text)
	{
		if( eregi('\[IMG\]', $text[0]) ) {
			$arr = explode('|', $text[1]);
			if( $arr[1] > 0 ) {
				return '<img alt="" src="' . $arr[0] . '" width="' . $arr[1] . '" height= "' . $arr[2] . '" />';
			} else {
				return '<img alt="" src="' . $arr[0] . '" />';
			}
		} elseif( eregi('\[MEDIA\]', $text[0]) ) {
			$arr = explode('|', $text[1]);
			$arr[0] = str_replace('_sub_', 'src', $arr[0]);
			if( !$arr[3] || $arr[3] == 'src' ) {
				return rawurldecode($arr[0]);
			} else{
				return '<embed src="' . $arr[0] . '" width="' . $arr[1] . '" height="' . $arr[2] . '" allowScriptAccess="always" type="application/x-shockwave-flash" allowFullScreen="true" bgcolor="#000000"></embed>';			
			}
		}
	}
}
?>