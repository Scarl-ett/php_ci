<?
class Securityauth {
    
    private $ci = NULL;
    private $key256 = 'abcdefghijklmnopqrstuvwxyz123456';
    
    public function __construct() {
        $this->ci =& get_instance();
    }
        
	public static function encrypt($input, $key) {
		$size = mcrypt_get_block_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_ECB);
		$input = Securityauth::pkcs5_pad($input, $size);
		$td = mcrypt_module_open(MCRYPT_RIJNDAEL_128, '', MCRYPT_MODE_ECB, '');
		$iv = mcrypt_create_iv (mcrypt_enc_get_iv_size($td), MCRYPT_RAND);
		mcrypt_generic_init($td, $key, $iv);
		$data = mcrypt_generic($td, $input); 
		mcrypt_generic_deinit($td); 
		mcrypt_module_close($td); 
		$data = base64_encode($data); 
		return $data; 
	}


	private static function pkcs5_pad ($text, $blocksize) { 
		$pad = $blocksize - (strlen($text) % $blocksize); 
		return $text . str_repeat(chr($pad), $pad); 
	} 


	public static function decrypt($sStr, $sKey) {
		$decrypted= mcrypt_decrypt(
			MCRYPT_RIJNDAEL_128,
			$sKey, 
			base64_decode($sStr), 
			MCRYPT_MODE_ECB
		);
		$dec_s = strlen($decrypted); 
		$padding = ord($decrypted[$dec_s-1]); 
		$decrypted = substr($decrypted, 0, -$padding);
		return $decrypted;
	}
	
	public function encryptAES256CBC($plain_text)
	{
		if( function_exists('openssl_encrypt') ){
			return base64_encode(openssl_encrypt($plain_text, "aes-256-cbc", $this->key256, true, str_repeat(chr(0), 16)));	
		}else{
			$padSize = 16 - (strlen ($value) % 16);
		    $plain_text = $plain_text . str_repeat (chr ($padSize), $padSize);
		    $output = mcrypt_encrypt (MCRYPT_RIJNDAEL_128, $key, $plain_text, MCRYPT_MODE_CBC, str_repeat(chr(0),16));
		    return base64_encode ($output);
		}
	}

	public function decryptAES256CBC($base64_text)
	{
		if( function_exists('openssl_decrypt') ){
			return openssl_decrypt(base64_decode($base64_text), "aes-256-cbc", $this->key256, true, str_repeat(chr(0), 16));
		}else{
			$value = base64_decode ($base64_text);
		    $output = mcrypt_decrypt (MCRYPT_RIJNDAEL_128, $key, $value, MCRYPT_MODE_CBC, str_repeat(chr(0),16));
		    
		    $valueLen = strlen ($output);
		    if ( $valueLen % 16 > 0 )
		        $output = "";
		
		    $padSize = ord ($output{$valueLen - 1});
		    if ( ($padSize < 1) or ($padSize > 16) )
		        $output = "";                // Check padding.                
		
		    for ($i = 0; $i < $padSize; $i++)
		    {
		        if ( ord ($output{$valueLen - $i - 1}) != $padSize )
		            $output = "";
		    }
		    $output = substr ($output, 0, $valueLen - $padSize);
		
		    return $output;
		}
	}
}
?>
