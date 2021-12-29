/**
 * �÷��̽���Ʈ�׽�Ʈ
 */
ARBITER.declare('ARBITER.placementtest', ['layerpopup', 'ajax'], function(response) {

    var $ = jQuery;

    var placementtest;

    var oPublic = {};

    var oAudio           = new Audio();
    var oAudioClick      = new Audio("https://content.chungchy.com/Placementtest/res/Click.mp3"); // ����� ��ü
    var oAudioCheck      = new Audio("https://content.chungchy.com/Placementtest/res/Check.mp3"); // ����� ��ü
    var oAudioSoundCheck = new Audio("https://content.chungchy.com/Placementtest/res/SoundCheck.mp3"); // ����� ��ü

    var modal;
    var fnTimer;

    placementtest = {}

    // �ʱ� ������ ����
    placementtest.fnSet = function(oData) {
        oPublic = {
            oStatus : oData.oStatus,
            oInfo   : oData.oInfo,
        };

        console.log("�ʱ� ���� : ");
        console.log(oPublic);

        return oPublic;
    }

    // ���� : �н� �߰�����
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
                alert("[�����ڵ� : " + ret.sResultCode + "] ������ �߻��߽��ϴ�.\n������(1688-9907)�� �������ּ���.");
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

            console.log("���ο� ���� ���� : ");
            console.log(oPublic);

            placementtest.fnSetStep();
        });
    }

    // ���� : ���ܿ� ���� �ڹٽ�ũ��Ʈ ���� ����
    placementtest.fnSetStep = function() {
        $('.wrap').empty();

        // ���� ���� �� ���� ����
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

    // ���� : �ڹٽ�ũ��Ʈ ���� ����
    placementtest.fnSetScript = function(sFile) {
        var oScript     = document.createElement('script');
        oScript.type    = "text/javascript";
        oScript.src     = "/public_html/resource/js/learning/placementtest/" + sFile;
        oScript.async   = false;
        oScript.charset = "EUC-KR";

        $('body')[0].append(oScript);
    }

    // ���� : ���� ��������
    placementtest.fnGetStatus = function() {
        return oPublic.oStatus;
    }

    // ���� : ���� ����
    placementtest.fnSetStatus = function(oNewStatus) {
        oPublic.oStatus = oNewStatus;
        return oPublic.oStatus;
    }

    // ���� : �н� ������ ��������
    placementtest.fnGetData = function() {
        return oPublic.oInfo;
    }

    // ���� : �н� ������ ����
    placementtest.fnSetData = function(oNewData) {
        oPublic.oInfo = oNewData;
        return oPublic.oInfo;
    }

    // ���� : ���� ����
    placementtest.fnSetQuestion = function(aCurrent, fnCallBack) {
        var iTop = parseInt("-" + aCurrent.DEFAULT_INFO.PNG_Y);

        $('div.question').children('div').css('top', iTop)
        $('div.question').css('height', aCurrent.DEFAULT_INFO.PNG_HEIGHT);

        if (aCurrent.DEFAULT_INFO.PNG_HEIGHT > 1067) {
            $('.q_wrap').css({'overflow-y':'scroll'});
        } else {
            $('.q_wrap').css({'overflow-y':'hidden'});
        }

        // �� ���� ���ܿ��� ���� �迭��. 
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

    // ������ : ���� ���� ����� ��ü
    placementtest.fnGetAudio = function() {
        return oAudio;
    }

    // ������ : ���� üũ ����� ��ü
    placementtest.fnGetAudioSoundCheck = function() {
        return oAudioSoundCheck;
    }

    // ���� : Ŭ�� ȿ���� ����� ��ü
    placementtest.fnGetAudioClick = function() {
        return oAudioClick;
    }

    // ���� : üũ ȿ���� ����� ��ü
    placementtest.fnGetAudioCheck = function() {
        return oAudioCheck;
    }

    // ���� : ���� ����
    placementtest.fnSetAudioVolume = function(iVolume) {
        oAudio.volume           = iVolume / 100;
        oAudioClick.volume      = iVolume / 100;
        oAudioCheck.volume      = iVolume / 100;
        oAudioSoundCheck.volume = iVolume / 100;
    }

    // ���� : Ÿ�̸�
    placementtest.fnSetTimer = function() {
        clearInterval(fnTimer);
        fnTimer = setInterval(function() {
            oPublic.oStatus.iTime++;
            placementtest.getMinuteSec(oPublic.oInfo.TIME_LIMIT - oPublic.oStatus.iTime);

            if (oPublic.oStatus.iTime >= oPublic.oInfo.TIME_LIMIT) {
                clearInterval(fnTimer);
                alert("[�ȳ�] ����ð��� �Ϸ�Ǿ� ������ �����մϴ�.\nȮ���� ������ ����� üũ�� �������� ����˴ϴ�.\n�����Բ� �˷��ּ���.");
                placementtest.fnSetStudy();
            }
        }, 1000);
    }

    // ���� : �ð� ����
    placementtest.getMinuteSec = function(iData) {
        var iNum = parseInt(iData, 10);
        var iMin = Math.floor(iNum / 60);
        var iSec = iNum - (iMin * 60);
        if (iMin < 10) {iMin = "0" + iMin;}
        if (iSec < 10) {iSec = "0" + iSec;}
        $('.time').text(iMin + ':' + iSec);
    }

    // ���� : ��� ����
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

    // ���� : ��� Ŭ����
    placementtest.modalClose = function() {
        modal.close();
    }

    // ���� : ũ�� �ٿ�ε� �˾�
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