/**
 * ex) arbi.util.test();
 */
ARBITER.declare('ARBITER.util', [], function(response) {

    var $ = jQuery;

    var util = {};
    
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    
    // browser detect
    util.browser = function() 
    {
      var s = navigator.userAgent.toLowerCase();
      var match = /(webkit)[ \/](\w.]+)/.exec(s) ||
                  /(opera)(?:.*version)?[ \/](\w.]+)/.exec(s) ||
                  /(msie) ([\w.]+)/.exec(s) ||               
                  /(mozilla)(?:.*? rv:([\w.]+))?/.exec(s) ||
                 [];
      return { name: match[1] || "", version: match[2] || "0" };
    };
    
    util.stringToHex = function(tmp) {
        var str = '',
            i = 0,
            tmp_len = tmp.length,
            c;

        for (; i < tmp_len; i += 1) {
            c = tmp.charCodeAt(i);
            str += c.toString(16) + ' ';
        }
        return str;
    };
    
    util.hexToString = function(tmp) {
        var arr = tmp.split(' '),
            str = '',
            i = 0,
            arr_len = arr.length,
            c;

        for (; i < arr_len; i += 1) {
            c = String.fromCharCode( parseInt(arr[i], 16) );
            str += c;
        }

        return str;
    };
    
    util.base64encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = util.utf8encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);

        }

        return output;        
    };
    
    util.base64decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = util.utf8decode(output);

        return output;
    };    
    
    util.utf8encode = function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    };        
    
    util.utf8decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    };            
    
    /**
     * 동적으로 form 태그를 만들어 submit 해줍니다.
     * 
     * url : 주소
     * data : 넘길 데이터 (배열형식가능)
     * method : POST,GET
     * target : target
     */
    util.formSubmit = function() {

        var args, form;
        
        args = {
            url: arguments[0],
            data: arguments[1],
            method: arguments[2],
            target: arguments[3]
        };                
        
        args.method = args.method === null ? 'GET' : args.method;
        
        args.target = args.target === null ? '_self' : args.target;
        
        if (!args.url) {
            throw new Error('Invalid url type. Expected string, received ' + typeof args.url + ' instead.');
        }

        form = $('<form method="' + args.method.toUpperCase() + '"></form>');

        var input;

        if (args.data) {
            var params = $.param(args.data).split('&'),
                tmp;
            
            for (var inx = 0, limitInx = params.length; inx < limitInx; inx++) {
                tmp = params[inx].split('=');
                if (tmp.length == 2) {
                    input = $('<input name="' + decodeURIComponent(tmp[0]) + '" type="hidden">');
                    input.val(decodeURIComponent(tmp[1]).replace(/\+/g, ' ').replace(/\[\[\:\:plus\:\:\]\]/g, '+'));
                    form.append(input);
                }

            }
            
        }
        
        $(document.body).append(form);
        form.attr('action', args.url);
        form.attr('target', args.target);
        
        form.get(0).submit();    
        
        return;
    };    
    
    /**
     * 날짜 차이 계산 함수
     */
    util.getDateDiff = function(date1,date2)
    {
        var arrDate1 = date1.split("-");
        var getDate1 = new Date(parseInt(arrDate1[0]),parseInt(arrDate1[1])-1,parseInt(arrDate1[2]));
        var arrDate2 = date2.split("-");
        var getDate2 = new Date(parseInt(arrDate2[0]),parseInt(arrDate2[1])-1,parseInt(arrDate2[2]));
        
        var getDiffTime = getDate1.getTime() - getDate2.getTime();
        
        return Math.floor(getDiffTime / (1000 * 60 * 60 * 24));
    };
    
    /**
     * 랜덤 문자열
     */
    util.getRandStr = function (len)
    {
        var string_length = (!len) ? 15 : len;
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";

        var randomstring = '';
        for (var i=0; i<string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum,rnum+1);
        }
        
        return randomstring;
    };
    
    /**
     * 숫자 앞에 0을 붙여 준다.
     * n : 숫자
     * disits : 총 자릿수
     */
    util.leadingZeros = function (n, digits) {
        var zero = '';
        n = n.toString();

        if (n.length < digits) {
          for (var i = 0; i < digits - n.length; i++)
            zero += '0';
        }
        return zero + n;
    }
    
    /**
     *  문자열 자르기
     */
    util.cutString = function (str, len) {
        var s = 0;
        for (var i=0; i<str.length; i++) {
            s += (str.charCodeAt(i) > 128) ? 2 : 1;
            if (s > len) return str.substring(0,i) + "...";
        }        
        return str;
    }    

    // 쿠키 가져오기
    util.getCookie = function (cName) {
         cName = cName + '=';
         var cookieData = document.cookie;
         var start = cookieData.indexOf(cName);
         var cValue = '';
         if(start != -1){
              start += cName.length;
              var end = cookieData.indexOf(';', start);
              if(end == -1)end = cookieData.length;
              cValue = cookieData.substring(start, end);
         }
         return unescape(cValue);
    }    
    
    // 현재 입력한 문자의 byte를 계산한다.
    util.getByte = function (contents)
    {
        var str_character;
        var int_char_count;
        var int_contents_length;
     
        int_char_count = 0;
        int_contents_length = contents.length;
     
        // 한글과 영문 바이트수 계산하는 부분
        // 아래 부터 수정 않아셔도 됩니다.
        for(k=0; k < int_contents_length; k++)
        {
            str_character = contents.charAt(k);
            if(escape(str_character).length > 4)
                int_char_count += 2;  
            else
                int_char_count++;
        }
        // 여기까지는 수정 않아셔도 됩니다.
     
        return int_char_count;
    }    
        
    response.implement = util;
});