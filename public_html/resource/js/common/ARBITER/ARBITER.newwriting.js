/**
 * 라이팅 트레이닝
 */
ARBITER.declare('ARBITER.newwriting', ['layerpopup', 'ajax'], function(response) {

    var $ = jQuery;

    var newwriting;

    var oPublic = {};

    var oAudio      = new Audio();
    var oAudioClick = new Audio("https://content.chungchy.com/Placementtest//res/Click.mp3"); // 오디오 객체

    var modal;
    var fnTimer;
    var aHintStorage = [];

    newwriting = {}


    // 초기 데이터 세팅
    newwriting.fnSet = function(oData) {
        oPublic = {
            oStatus : oData.oStatus,
            oInfo   : oData.oInfo
        };

        //console.log("초기 세팅 : ");
        //console.log(oPublic);

        return oPublic;
    }

    // 공통 : 학습 중간저장
    newwriting.fnSetStudy = function() {
        newwriting.modalOpen();
        //스텝별 학습시간 타이머
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
                //서브밋
                if (ret.sResultCode == '300') {
                    try {
                        var aSendData = [];
                        aSendData['sLearn']  = 'WT';
                        aSendData['sTarget'] = oPublic.oInfo.WRITING_INFO.LECTURE_CD;
                        aSendData['sInfo']   = oPublic.oInfo.WRITING_INFO.INFO_CD;

                        opener.ARBITER.get('LEARNING').changeBtnStatus(aSendData);

                        alert("[안내] 제출 완료");
                        parent.window.open('', '_self', '');
                        parent.window.close();
                    } catch (error) {
                        alert("[안내] 제출 완료");
                        parent.window.open('', '_self', '');
                        parent.window.close();
                    }
                    return false;
                }
                alert("[에러코드 : " + ret.sResultCode + "] 에러가 발생했습니다.\n고객센터(1688-9907)로 문의해주세요.");
                newwriting.modalClose();
                return false;
            }

            oPublic.oStatus.iHint  = 0;
            oPublic.oStatus.iStep  = ret.iStep;
            oPublic.oStatus.iState = ret.iState;
            oPublic.oInfo          = ret.aInfo;

            aHintStorage = [];

            //console.log("새로운 스텝 세팅 : ");
            //console.log(oPublic);

            newwriting.fnSetStep();
        });
    }

    // 공통 : 체험 다음 학습
    newwriting.fnSetExperience = function() {
        newwriting.modalOpen();
        //스텝별 학습시간 타이머
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
                //체험 완료 서브밋
                if (ret.sResultCode == '300') {
                    alert('[안내]\n체험하기는 저장기능이 지원되지 않습니다.\n체험하기를 종료합니다.');
                    window.close();
                    return false;
                }
                alert("[에러코드 : " + ret.sResultCode + "] 에러가 발생했습니다.\n고객센터(1688-9907)로 문의해주세요.");
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


    // 공통 : 복습 submit
    newwriting.fnSetReview = function() {
        newwriting.modalOpen();
        //스텝별 학습시간 타이머
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
                alert("[안내] 복습 완료");
                parent.window.open('', '_self', '');
                parent.window.close();
                return false
            } else {
                alert("[에러코드 : " + ret.sResultCode + "] 에러가 발생했습니다.\n고객센터(1688-9907)로 문의해주세요.");
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

    // 공통 : 스텝에 따른 자바스크립트 파일 생성
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
                alert("[에러코드 : 0] 에러가 발생했습니다.\n고객센터(1688-9907)로 문의해주세요.");
            }
        //오답 학습
        } else if (oPublic.oStatus.iState == '3') {
            //TPL
            $('.wrap').append(oPublic.oInfo.sTemplate);
            //JS
            newwriting.fnSetScript('new_writing_step11.js');
        //결과 페이지
        } else if (oPublic.oStatus.iState == '4') {
            //TPL
            $('.wrap').append(oPublic.oInfo.sTemplate);
            //JS
            newwriting.fnSetScript('new_writing_step12.js');
        } else {
            alert("[에러코드 : 1] 에러가 발생했습니다.\n고객센터(1688-9907)로 문의해주세요.");
        }

        //학습 시간 타이머 시작
        newwriting.fnSetTimer();

        newwriting.modalClose();
    }

    // 공통 : 자바스크립트 동적 생성
    newwriting.fnSetScript = function(sFile) {
        var oScript     = document.createElement('script');
        oScript.type    = "text/javascript";
        oScript.src     = "/public_html/resource/js/learning/writing/" + sFile;
        oScript.async   = false;
        oScript.charset = "EUC-KR";

        $('body')[0].append(oScript);
    }

    // 공통 : 상태 가져오기
    newwriting.fnGetStatus = function() {
        return oPublic.oStatus;
    }

    // 공통 : 상태 세팅
    newwriting.fnSetStatus = function(oNewStatus) {
        oPublic.oStatus = oNewStatus;
        return oPublic.oStatus;
    }

    // 공통 : 학습 데이터 가져오기
    newwriting.fnGetData = function() {
        return oPublic.oInfo;
    }

    // 공통 : 학습 데이터 세팅
    newwriting.fnSetData = function(oNewData) {
        oPublic.oInfo = oNewData;
        return oPublic.oInfo;
    }

    // 공통 : 클릭 효과음 오디오 객체
    newwriting.fnGetAudioClick = function() {
        return oAudioClick;
    }

    // 공통 : 힌트 팝업
    newwriting.fnGetHint = function(iQuizPos) {
        oPublic.oStatus.iHintCnt = oPublic.oInfo.OPTION_INFO.HINT_REPEAT;
        $('[data-role=iRepeat]').text(oPublic.oInfo.OPTION_INFO.HINT_REPEAT);

        $('.popup_hint').addClass('act');

        //정답
        var sAnsEng = oPublic.oInfo.LEARNING_INFO.SENTENCE_INFO[iQuizPos].ENG;

        $('[data-role=oHintEng]').text(sAnsEng);
        $('[data-role=oHintInput]').focus();

        if (!aHintStorage.includes(iQuizPos)) {
            oPublic.oStatus.iHint += 1;
        }

        aHintStorage.push(iQuizPos);
    }

    // 공통 : 모달 오픈
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

    // 공통 : 모달 종료
    newwriting.modalClose = function() {
        modal.close();
    }

    // 공통 : 타이머(초)
    newwriting.fnSetTimer = function() {
        clearInterval(fnTimer);
        fnTimer = setInterval(function() {
            oPublic.oStatus.iTime++;
            newwriting.getMinuteSec(oPublic.oStatus.iTime);
        }, 1000);
    }

    // 공통 : 시간 설정
    newwriting.getMinuteSec = function(iData) {
        var iNum = parseInt(iData, 10);
        var iHou = Math.floor(iNum / 3600);
        var iMin = Math.floor((iNum - (iHou * 3600)) / 60);
        var iSec = iNum - (iHou * 3600) - (iMin * 60);
        if (iHou < 10) {iHou   = "0"+iHou;}
        if (iMin < 10) {iMin   = "0"+iMin;}
        if (iSec < 10) {iSec   = "0"+iSec;}

        //html 시 분 초 각각 빨간색으로 바뀌도록
        if (iHou > 00) {iHou = '<span style="color:#e82c00;">'+iHou+'</span>'}
        if ((iMin > 00 || iHou > 00) && iSec >= 00) {iMin = '<span style="color:#e82c00;">'+iMin+'</span>'}
        if (iSec >= 00) {iSec = '<span style="color:#e82c00;">'+iSec+'</span>'}

        $('.time_img').html(iHou + ':' + iMin + ':' + iSec);

        //시간 마크업에 붙인 후 결과 페이지 타이머 멈추기
        if (oPublic.oStatus.iState == '4') {
            clearInterval(fnTimer);
        }
    }

    response.implement = newwriting;
});