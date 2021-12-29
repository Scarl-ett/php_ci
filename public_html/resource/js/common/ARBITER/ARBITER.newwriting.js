/**
 * ������ Ʈ���̴�
 */
ARBITER.declare('ARBITER.newwriting', ['layerpopup', 'ajax'], function(response) {

    var $ = jQuery;

    var newwriting;

    var oPublic = {};

    var oAudio      = new Audio();
    var oAudioClick = new Audio("https://content.chungchy.com/Placementtest//res/Click.mp3"); // ����� ��ü

    var modal;
    var fnTimer;
    var aHintStorage = [];

    newwriting = {}


    // �ʱ� ������ ����
    newwriting.fnSet = function(oData) {
        oPublic = {
            oStatus : oData.oStatus,
            oInfo   : oData.oInfo
        };

        //console.log("�ʱ� ���� : ");
        //console.log(oPublic);

        return oPublic;
    }

    // ���� : �н� �߰�����
    newwriting.fnSetStudy = function() {
        newwriting.modalOpen();
        //���ܺ� �н��ð� Ÿ�̸�
        clearInterval(fnTimer);

        if (!oAudioClick.paused) {
            oAudioClick.pause();
        }

        ARBITER.ajax('/Learning/Writing/new_writing/setStudy',
        {
            INFO_CD         : oPublic.oInfo.WRITING_INFO.INFO_CD,
            COMPLETE_STEP   : oPublic.oStatus.iStep,
            STATE           : oPublic.oStatus.iState,
            TIME            : Math.floor(oPublic.oStatus.iTime),
            HINT            : oPublic.oStatus.iHint,
            RESULT_INFO     : oPublic.oStatus.sTestInfo,
            TEST_SCORE      : oPublic.oStatus.iTestScore
        },
        function(ret) {
            var ret = $.parseJSON(ret);
            if (ret.sResultCode != '200') {
                //�����
                if (ret.sResultCode == '300') {
                    try {
                        var aSendData = [];
                        aSendData['sLearn']  = 'WT';
                        aSendData['sTarget'] = oPublic.oInfo.WRITING_INFO.LECTURE_CD;
                        aSendData['sInfo']   = oPublic.oInfo.WRITING_INFO.INFO_CD;

                        opener.ARBITER.get('LEARNING').changeBtnStatus(aSendData);

                        alert("[�ȳ�] ���� �Ϸ�");
                        parent.window.open('', '_self', '');
                        parent.window.close();
                    } catch (error) {
                        alert("[�ȳ�] ���� �Ϸ�");
                        parent.window.open('', '_self', '');
                        parent.window.close();
                    }
                    return false;
                }
                alert("[�����ڵ� : " + ret.sResultCode + "] ������ �߻��߽��ϴ�.\n������(1688-9907)�� �������ּ���.");
                newwriting.modalClose();
                return false;
            }

            oPublic.oStatus.iHint  = 0;
            oPublic.oStatus.iStep  = ret.iStep;
            oPublic.oStatus.iState = ret.iState;
            oPublic.oInfo          = ret.aInfo;

            aHintStorage = [];

            //console.log("���ο� ���� ���� : ");
            //console.log(oPublic);

            newwriting.fnSetStep();
        });
    }

    // ���� : ü�� ���� �н�
    newwriting.fnSetExperience = function() {
        newwriting.modalOpen();
        //���ܺ� �н��ð� Ÿ�̸�
        clearInterval(fnTimer);

        if (!oAudioClick.paused) {
            oAudioClick.pause();
        }

        ARBITER.ajax('/Learning/Writing/new_writing_experience/setStudy',
        {
            INFO            : oPublic.oInfo,
            COMPLETE_STEP   : oPublic.oStatus.iStep,
            STATE           : oPublic.oStatus.iState,
            TIME            : Math.floor(oPublic.oStatus.iTime),
            HINT            : oPublic.oStatus.iHint,
            RESULT_INFO     : oPublic.oStatus.sTestInfo,
            TEST_SCORE      : oPublic.oStatus.iTestScore
        },
        function(ret) {
            var ret = $.parseJSON(ret);
            if (ret.sResultCode != '200') {
                //ü�� �Ϸ� �����
                if (ret.sResultCode == '300') {
                    alert('[�ȳ�]\nü���ϱ�� �������� �������� �ʽ��ϴ�.\nü���ϱ⸦ �����մϴ�.');
                    window.close();
                    return false;
                }
                alert("[�����ڵ� : " + ret.sResultCode + "] ������ �߻��߽��ϴ�.\n������(1688-9907)�� �������ּ���.");
                newwriting.modalClose();
                return false;
            }

            oPublic.oStatus.iHint  = 0;
            oPublic.oStatus.iStep  = ret.iStep;
            oPublic.oStatus.iState = ret.iState;
            oPublic.oInfo          = ret.aInfo;

            aHintStorage = [];

            newwriting.fnSetStep();
        });
    }


    // ���� : ���� submit
    newwriting.fnSetReview = function() {
        newwriting.modalOpen();
        //���ܺ� �н��ð� Ÿ�̸�
        clearInterval(fnTimer);

        if (!oAudioClick.paused) {
            oAudioClick.pause();
        }

        ARBITER.ajax('/Learning/Writing/new_writing_experience/setReviewSubmit',
        {
            INFO            : oPublic.oInfo,
            COMPLETE_STEP   : oPublic.oStatus.iStep,
            STATE           : oPublic.oStatus.iState,
            TIME            : Math.floor(oPublic.oStatus.iTime),
            HINT            : oPublic.oStatus.iHint,
            RESULT_INFO     : oPublic.oStatus.sTestInfo,
            TEST_SCORE      : oPublic.oStatus.iTestScore
        },
        function(ret) {
            var ret = $.parseJSON(ret);

            if (ret.sResultCode == '200') {
                alert("[�ȳ�] ���� �Ϸ�");
                parent.window.open('', '_self', '');
                parent.window.close();
                return false
            } else {
                alert("[�����ڵ� : " + ret.sResultCode + "] ������ �߻��߽��ϴ�.\n������(1688-9907)�� �������ּ���.");
                newwriting.modalClose();
                return false;
            }

            oPublic.oStatus.iHint  = 0;
            oPublic.oStatus.iStep  = ret.iStep;
            oPublic.oStatus.iState = ret.iState;
            oPublic.oInfo          = ret.aInfo;

            aHintStorage = [];

            newwriting.fnSetStep();
        });
    }

    // ���� : ���ܿ� ���� �ڹٽ�ũ��Ʈ ���� ����
    newwriting.fnSetStep = function() {
        $('.wrap').empty();

        if (oPublic.oStatus.iState == '1' || oPublic.oStatus.iState == '2') {
            //TPL
            $('.wrap').append(oPublic.oInfo.sTemplate);

            //JS
            if (oPublic.oStatus.iStep == '0') {
                newwriting.fnSetScript('new_writing_step1.js');
            } else if (oPublic.oStatus.iStep == '2') {
                newwriting.fnSetScript('new_writing_step2.js');
            } else if (oPublic.oStatus.iStep == '3') {
                newwriting.fnSetScript('new_writing_step3.js');
            } else if (oPublic.oStatus.iStep == '4') {
                newwriting.fnSetScript('new_writing_step4.js');
            } else if (oPublic.oStatus.iStep == '5') {
                newwriting.fnSetScript('new_writing_step5.js');
            } else if (oPublic.oStatus.iStep == '6') {
                newwriting.fnSetScript('new_writing_step6.js');
            } else if (oPublic.oStatus.iStep == '7') {
                newwriting.fnSetScript('new_writing_step7.js');
            } else if (oPublic.oStatus.iStep == '8') {
                newwriting.fnSetScript('new_writing_step8.js');
            } else if (oPublic.oStatus.iStep == '9') {
                newwriting.fnSetScript('new_writing_step9.js');
            } else if (oPublic.oStatus.iStep == '10') {
                newwriting.fnSetScript('new_writing_step10.js');
            } else {
                alert("[�����ڵ� : 0] ������ �߻��߽��ϴ�.\n������(1688-9907)�� �������ּ���.");
            }
        //���� �н�
        } else if (oPublic.oStatus.iState == '3') {
            //TPL
            $('.wrap').append(oPublic.oInfo.sTemplate);
            //JS
            newwriting.fnSetScript('new_writing_step11.js');
        //��� ������
        } else if (oPublic.oStatus.iState == '4') {
            //TPL
            $('.wrap').append(oPublic.oInfo.sTemplate);
            //JS
            newwriting.fnSetScript('new_writing_step12.js');
        } else {
            alert("[�����ڵ� : 1] ������ �߻��߽��ϴ�.\n������(1688-9907)�� �������ּ���.");
        }

        //�н� �ð� Ÿ�̸� ����
        newwriting.fnSetTimer();

        newwriting.modalClose();
    }

    // ���� : �ڹٽ�ũ��Ʈ ���� ����
    newwriting.fnSetScript = function(sFile) {
        var oScript     = document.createElement('script');
        oScript.type    = "text/javascript";
        oScript.src     = "/public_html/resource/js/learning/writing/" + sFile;
        oScript.async   = false;
        oScript.charset = "EUC-KR";

        $('body')[0].append(oScript);
    }

    // ���� : ���� ��������
    newwriting.fnGetStatus = function() {
        return oPublic.oStatus;
    }

    // ���� : ���� ����
    newwriting.fnSetStatus = function(oNewStatus) {
        oPublic.oStatus = oNewStatus;
        return oPublic.oStatus;
    }

    // ���� : �н� ������ ��������
    newwriting.fnGetData = function() {
        return oPublic.oInfo;
    }

    // ���� : �н� ������ ����
    newwriting.fnSetData = function(oNewData) {
        oPublic.oInfo = oNewData;
        return oPublic.oInfo;
    }

    // ���� : Ŭ�� ȿ���� ����� ��ü
    newwriting.fnGetAudioClick = function() {
        return oAudioClick;
    }

    // ���� : ��Ʈ �˾�
    newwriting.fnGetHint = function(iQuizPos) {
        oPublic.oStatus.iHintCnt = oPublic.oInfo.OPTION_INFO.HINT_REPEAT;
        $('[data-role=iRepeat]').text(oPublic.oInfo.OPTION_INFO.HINT_REPEAT);

        $('.popup_hint').addClass('act');

        //����
        var sAnsEng = oPublic.oInfo.LEARNING_INFO.SENTENCE_INFO[iQuizPos].ENG;

        $('[data-role=oHintEng]').text(sAnsEng);
        $('[data-role=oHintInput]').focus();

        if (!aHintStorage.includes(iQuizPos)) {
            oPublic.oStatus.iHint += 1;
        }

        aHintStorage.push(iQuizPos);
    }

    // ���� : ��� ����
    newwriting.modalOpen = function() {
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

    // ���� : ��� ����
    newwriting.modalClose = function() {
        modal.close();
    }

    // ���� : Ÿ�̸�(��)
    newwriting.fnSetTimer = function() {
        clearInterval(fnTimer);
        fnTimer = setInterval(function() {
            oPublic.oStatus.iTime++;
            newwriting.getMinuteSec(oPublic.oStatus.iTime);
        }, 1000);
    }

    // ���� : �ð� ����
    newwriting.getMinuteSec = function(iData) {
        var iNum = parseInt(iData, 10);
        var iHou = Math.floor(iNum / 3600);
        var iMin = Math.floor((iNum - (iHou * 3600)) / 60);
        var iSec = iNum - (iHou * 3600) - (iMin * 60);
        if (iHou < 10) {iHou   = "0"+iHou;}
        if (iMin < 10) {iMin   = "0"+iMin;}
        if (iSec < 10) {iSec   = "0"+iSec;}

        //html �� �� �� ���� ���������� �ٲ��
        if (iHou > 00) {iHou = '<span style="color:#e82c00;">'+iHou+'</span>'}
        if ((iMin > 00 || iHou > 00) && iSec >= 00) {iMin = '<span style="color:#e82c00;">'+iMin+'</span>'}
        if (iSec >= 00) {iSec = '<span style="color:#e82c00;">'+iSec+'</span>'}

        $('.time_img').html(iHou + ':' + iMin + ':' + iSec);

        //�ð� ��ũ���� ���� �� ��� ������ Ÿ�̸� ���߱�
        if (oPublic.oStatus.iState == '4') {
            clearInterval(fnTimer);
        }
    }

    response.implement = newwriting;
});