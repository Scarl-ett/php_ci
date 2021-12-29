/**
 * 플레이스먼트테스트
 */
ARBITER.declare('ARBITER.placementtest', ['layerpopup', 'ajax'], function(response) {

    var $ = jQuery;

    var placementtest;

    var oPublic = {};

    var oAudio           = new Audio();
    var oAudioClick      = new Audio("https://content.chungchy.com/Placementtest/res/Click.mp3"); // 오디오 객체
    var oAudioCheck      = new Audio("https://content.chungchy.com/Placementtest/res/Check.mp3"); // 오디오 객체
    var oAudioSoundCheck = new Audio("https://content.chungchy.com/Placementtest/res/SoundCheck.mp3"); // 오디오 객체

    var modal;
    var fnTimer;

    placementtest = {}

    // 초기 데이터 세팅
    placementtest.fnSet = function(oData) {
        oPublic = {
            oStatus : oData.oStatus,
            oInfo   : oData.oInfo,
        };

        console.log("초기 세팅 : ");
        console.log(oPublic);

        return oPublic;
    }

    // 공통 : 학습 중간저장
    placementtest.fnSetStudy = function() {
        placementtest.modalOpen();
        clearInterval(fnTimer);

        if (!oAudio.paused) {
            oAudio.pause();
        }

        if (!oAudioClick.paused) {
            oAudioClick.pause();
        }

        ARBITER.ajax('/Learning/Placementtest/placementtest/setStudy',
        {
            TEST_CODE   : oPublic.oInfo.TEST_CODE,
            SAVE_STEP   : oPublic.oStatus.iStep,
            USER_ANSWER : oPublic.oStatus.aAnswer,
            TIME        : oPublic.oStatus.iTime,
        },
        function(ret) {
            var ret = $.parseJSON(ret);
            if (ret.sResultCode != '200') {
                alert("[에러코드 : " + ret.sResultCode + "] 에러가 발생했습니다.\n고객센터(1688-9907)로 문의해주세요.");
                arbi.placementtest.modalClose();
                return false;
            }

            if (ret.iNextStep == "4") {
                $('.wrap').empty();
                $('.wrap').append(oPublic.oInfo.sTemplateSubmit);
                placementtest.fnSetScript('placementtest_submit.js');
                placementtest.modalClose();
                return false;
            }

            oPublic.oInfo.START_INDEX    = ret.START_INDEX;
            oPublic.oInfo.CONTENT        = ret.aData.CONTENT;
            oPublic.oInfo.sTemplateIntro = ret.aData.sTemplateIntro;
            oPublic.oInfo.sTemplate      = ret.aData.sTemplate;
            oPublic.oStatus.iStep        = parseInt(ret.iNextStep);

            console.log("새로운 스텝 세팅 : ");
            console.log(oPublic);

            placementtest.fnSetStep();
        });
    }

    // 공통 : 스텝에 따른 자바스크립트 파일 생성
    placementtest.fnSetStep = function() {
        $('.wrap').empty();

        // 진행 스텝 별 세부 설정
        if (oPublic.oStatus.iStep == 1) {
            $('.wrap').append(oPublic.oInfo.sTemplateIntro);
            placementtest.fnSetScript('placementtest_voca_intro.js');
        } else if (oPublic.oStatus.iStep == 2) {
            $('.wrap').append(oPublic.oInfo.sTemplateIntro);
            placementtest.fnSetScript('placementtest_grammar_intro.js');
        } else if (oPublic.oStatus.iStep == 3) {
            $('.wrap').append(oPublic.oInfo.sTemplateIntro);
            placementtest.fnSetScript('placementtest_reading_intro.js');
        }

        placementtest.modalClose();
    }

    // 공통 : 자바스크립트 동적 생성
    placementtest.fnSetScript = function(sFile) {
        var oScript     = document.createElement('script');
        oScript.type    = "text/javascript";
        oScript.src     = "/public_html/resource/js/learning/placementtest/" + sFile;
        oScript.async   = false;
        oScript.charset = "EUC-KR";

        $('body')[0].append(oScript);
    }

    // 공통 : 상태 가져오기
    placementtest.fnGetStatus = function() {
        return oPublic.oStatus;
    }

    // 공통 : 상태 세팅
    placementtest.fnSetStatus = function(oNewStatus) {
        oPublic.oStatus = oNewStatus;
        return oPublic.oStatus;
    }

    // 공통 : 학습 데이터 가져오기
    placementtest.fnGetData = function() {
        return oPublic.oInfo;
    }

    // 공통 : 학습 데이터 세팅
    placementtest.fnSetData = function(oNewData) {
        oPublic.oInfo = oNewData;
        return oPublic.oInfo;
    }

    // 공통 : 문제 세팅
    placementtest.fnSetQuestion = function(aCurrent, fnCallBack) {
        var iTop = parseInt("-" + aCurrent.DEFAULT_INFO.PNG_Y);

        $('div.question').children('div').css('top', iTop)
        $('div.question').css('height', aCurrent.DEFAULT_INFO.PNG_HEIGHT);

        if (aCurrent.DEFAULT_INFO.PNG_HEIGHT > 1067) {
            $('.q_wrap').css({'overflow-y':'scroll'});
        } else {
            $('.q_wrap').css({'overflow-y':'hidden'});
        }

        // 이 리딩 스텝에서 값이 배열임. 
        var aCurrentIndex = aCurrent.DEFAULT_INFO.INDEX.split(",");

        $.each($('.bottom .bg > span'), function(index, item) {
            var iThisIndex = parseInt($(this).attr('bottom-q-index'));

            if (iThisIndex < parseInt(aCurrentIndex[0])) {
                $(this).removeClass();
                $(this).addClass("done");
            } else if (iThisIndex >= parseInt(aCurrentIndex[0]) && iThisIndex <= parseInt(aCurrentIndex[aCurrentIndex.length - 1])) {
                $(this).removeClass();
                $(this).addClass("now");
            } else {
                $(this).removeClass();
            }
        });

        oAudioCheck.currentTime = 0;
        oAudioCheck.play();

        if (oPublic.oStatus.iStep == 0) {
            oAudioCheck.onended = fnCallBack;
        } else {
            oAudioCheck.onended = function () {};
        }
    }

    // 리스닝 : 문제 음원 오디오 객체
    placementtest.fnGetAudio = function() {
        return oAudio;
    }

    // 리스닝 : 사운드 체크 오디오 객체
    placementtest.fnGetAudioSoundCheck = function() {
        return oAudioSoundCheck;
    }

    // 공통 : 클릭 효과음 오디오 객체
    placementtest.fnGetAudioClick = function() {
        return oAudioClick;
    }

    // 공통 : 체크 효과음 오디오 객체
    placementtest.fnGetAudioCheck = function() {
        return oAudioCheck;
    }

    // 공통 : 볼륨 조절
    placementtest.fnSetAudioVolume = function(iVolume) {
        oAudio.volume           = iVolume / 100;
        oAudioClick.volume      = iVolume / 100;
        oAudioCheck.volume      = iVolume / 100;
        oAudioSoundCheck.volume = iVolume / 100;
    }

    // 공통 : 타이머
    placementtest.fnSetTimer = function() {
        clearInterval(fnTimer);
        fnTimer = setInterval(function() {
            oPublic.oStatus.iTime++;
            placementtest.getMinuteSec(oPublic.oInfo.TIME_LIMIT - oPublic.oStatus.iTime);

            if (oPublic.oStatus.iTime >= oPublic.oInfo.TIME_LIMIT) {
                clearInterval(fnTimer);
                alert("[안내] 시험시간이 완료되어 시험을 종료합니다.\n확인을 누르면 답안을 체크한 문제까지 제출됩니다.\n선생님께 알려주세요.");
                placementtest.fnSetStudy();
            }
        }, 1000);
    }

    // 공통 : 시간 설정
    placementtest.getMinuteSec = function(iData) {
        var iNum = parseInt(iData, 10);
        var iMin = Math.floor(iNum / 60);
        var iSec = iNum - (iMin * 60);
        if (iMin < 10) {iMin = "0" + iMin;}
        if (iSec < 10) {iSec = "0" + iSec;}
        $('.time').text(iMin + ':' + iSec);
    }

    // 공통 : 모달 오픈
    placementtest.modalOpen = function() {
        modal = ARBITER.layerpopup({
            id         : 'loading',
            width      : 278 + 'px', 
            height     : 278 + 'px',
            content    : 'div', //'div', 'ajax', 'iframe',
            modalClose : false,
            opacity    : .0,
            zIndex     : 9995,
            html       : '<div class="layer1" style="text-align:center;"><img src="/public_html/resource/images/ajax_loader/Anchor_English_indicator.png" /></div>'
        });
    }

    // 공통 : 모달 클로즈
    placementtest.modalClose = function() {
        modal.close();
    }

    // 공통 : 크롬 다운로드 팝업
    placementtest.fnCheckIEGoChromePop = function() {
        var agent = navigator.userAgent.toLowerCase();

        if ((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1)) {
            ARBITER.layerpopup({
                id         : 'pop',
                width      : 810 + 'px',
                height     : 570 + 'px',
                scrollBar  : true,
                content    : 'iframe', //'div', 'ajax', 'iframe',
                closeBtn   : false,
                escClose   : false,
                modalClose : false,
                loadUrl    : '/main/chromeDownPopup',
                onClose    : function() {}
            });

            return false;
        } else {
            return true;
        }
    }

    response.implement = placementtest;
});