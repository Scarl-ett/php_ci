/**
 * 추천 학습
 */
ARBITER.declare('ARBITER.recommend_study', ['layerpopup', 'ajax'], function(response) {
    var $ = jQuery;
    var recommend_study = {}
    var oPublic = {};
    var modal;  // 인디케이터

    // 영상
    var oPlayer = $('video')[0];
    recommend_study.oPlayer      = oPlayer;

    // 녹음에 필요한 변수
    var oRecordRtc;
    var oAudioStream;

    recommend_study.oRecordRtc   = oRecordRtc;      // 웹 RTC 객체
    recommend_study.oAudioStream = oAudioStream;    // 오디오 제어 객체

    // 공통 : 상태 정보 GET
    recommend_study.fnGetStatus = function() {
        return oPublic.oStatus;
    }

    // 공통 : 학습 데이터 GET
    recommend_study.fnGetData = function() {
        return oPublic.oInfo;
    }

    // 초기 데이터 세팅
    recommend_study.fnSet = function(oData) {
        oPublic = {
            oInfo   : oData,
            oStatus : {
                bStuck    : false,                                      // 버튼 중복 클릭 방지
                sStep     : oData.SAVE_STEP,                            // 중간저장 스텝
                fRate     : 1,                                          // 재생 속도
                bKor      : true,                                       // 한글 표시 플래그
                iCurrent  : 0,                                          // 현재 문장 인덱스
                iProgress : 0,                                          // 컨텐츠 재생율
                oVideo    : {                                           // 비디오 이벤트 리스너 함수 (스텝마다 초기화 후 재설정)
                    fnPlay           : function () {},
                    fnPause          : function () {},
                    fnUpdate         : function () {},
                    fnEnded          : function () {},
                },
                oStep1    : {
                    iNow             : 1,                               // 현재 재생 횟수
                    iLimit           : 1,                               // 재생 횟수 제한 (재생 반복 횟수)
                    iTime            : oData.TIME.L1,                   // 학습 시간
                    bNext            : false,                           // 스텝 통과 가능 플래그
                },
                oStep2    : {
                    iPlay            : 0,                               // 재생 카운트 0->1 비디오 재생, 1->2 스크립트 재생
                    iTryMax          : 5,                               // 도전 최대 수
                    iTryUser         : 5,                               // 학생 도전 가능 수,
                    iWrong           : 0,                               // 오답 횟수
                    aScore           : oData.SCORE.L2_SENTENCE,         // 언스크램블 점수
                    iScore           : oData.SCORE.L2,                  // 획득점수
                    iTime            : oData.TIME.L2,                   // 학습시간
                    bNext            : false,                           // 스텝 통과 가능 플래그
                },
                oStep3    : {
                    iPlay            : 0,                               // 재생 카운트 0->1 비디오 재생, 1->2 스크립트 재생
                    iMaxIndex        : 0,                               // 최대 진행 문장 (새로운 문장을 재생할 때에만 영상 보여주기 위함)
                    aAnswerOrg       : oData.L3_ANSWER_ORG,             // 정답 답안
                    aAnswerUser      : oData.L3_ANSWER_USER,            // 유저 답안
                    iScore           : oData.SCORE.L3,                  // 획득점수
                    iTime            : oData.TIME.L3,                   // 학습시간
                    bNextSentence    : false,                           // 문장 통과 가능 플래그
                    bNext            : false                            // 스텝 통과 가능 플래그
                },
                oStep4    : {
                    iPlay            : 0,                               // 재생 카운트 0->1 비디오 재생, 1->2 스크립트 재생
                    iNow             : 1,                               // 현재 재생 횟수
                    iLimit           : oData.OPTION.S2_PLAY_LIMIT,      // 재생 횟수 제한 (문장 반복 횟수)
                    iFail            : 0,                               // 녹음 실패 횟수
                    iFailLimit       : oData.OPTION.S2_PASS_CNT,        // 실패 통과 횟수
                    aScore           : [],                              // 점수 정보
                    iScoreLimit      : oData.OPTION.S2_SCORE_LIMIT,     // 통과 점수 제한
                    iScore           : oData.SCORE.S2_ACOUSCTIC,        // 획득점수
                    iScoreHolistic   : oData.SCORE.S2_HOLISTIC,         // 획득점수
                    iScoreIntonation : oData.SCORE.S2_INTONATION,       // 획득점수
                    iScoreSegmental  : oData.SCORE.S2_SEGMENTAL,        // 획득점수
                    iScoreSpeed      : oData.SCORE.S2_SPEED,            // 획득점수
                    iScoreRhythm     : oData.SCORE.S2_RHYTHM,           // 획득점수
                    iTime            : oData.TIME.S2,                   // 학습시간
                    bNext            : false,                           // 스텝 통과 가능 플래그
                },
            },
        }

        console.log("초기 세팅 : ");
        console.log(oPublic);

        // 컨텐츠 소스 입력
        oPlayer.src = oPublic.oInfo.CONTENT.MP4_URL;

        // 컨텐츠 메타 데이터를 읽었을 때 스텝 세팅을 진행
        oPlayer.addEventListener('loadedmetadata', (event) => {
            // 종료 싱크가 컨텐츠 실제 길이보다 긴 경우 발생하는 이슈를 해결하기 위한 처리 (컨텐츠 제일 마지막 문장에서 발생)
            // 컨텐츠 길이 -0.1 처리하여 종료 싱크를 대체한다.
            for (var i = 0; i < oPublic.oInfo.CONTENT.SYNC.length; i++) {
                if (oPublic.oInfo.CONTENT.SYNC[i].FINAL === 'T' && oPlayer.duration > 0 && oPlayer.duration < oPublic.oInfo.CONTENT.SYNC[i].E_SYNC + 0.2) {
                    oPublic.oInfo.CONTENT.SYNC[i].E_SYNC = oPlayer.duration - 0.2;
                    oPublic.oInfo.CONTENT.TIME_END       = oPlayer.duration - 0.2;
                }
            }

            // 스텝 세팅
            recommend_study.fnSetStep();
        }, {once: true});

        return oPublic;
    }

    // 공통 : 학습 업데이트 및 다음 스텝 템플릿 GET
    recommend_study.fnSetStudy = function() {
        // 로딩화면 SET
        $('.view').after(oPublic.oInfo.sTemplateLoading);

        // 다음 스텝 구하기
        var aStep      = oPublic.oInfo.OPTION.STEP.split('|');
        var iStepIndex = aStep.indexOf(oPublic.oStatus.sStep);
        var sNextStep  = aStep[iStepIndex + 1] ? aStep[iStepIndex + 1] : "RESULT";

        // 전송 데이터 세팅
        var oSendData  = {
            MEM_CD        : oPublic.oInfo.USER.MEM_CD,
            MU_CD         : oPublic.oInfo.USER.MU_CD,
            RECOMMEND_DAY : oPublic.oInfo.RECOMMEND_DAY,
            RECOMMEND_CD  : oPublic.oInfo.RECOMMEND_CD,
            STUDY_CD      : oPublic.oInfo.STUDY_CD,
            STEP_STUDIED  : oPublic.oStatus.sStep,
            STEP_NEXT     : sNextStep,
        };

        // 스텝 1 : 프리리스닝
        if (oPublic.oStatus.sStep === "L1") {
            oSendData.TIME_L1 = oPublic.oStatus.oStep1.iTime;

        // 스텝 2 : 언스크램블
        } else if (oPublic.oStatus.sStep === "L2") {
            var iSumL2Score = 0;
            for (var i = 0; i < oPublic.oStatus.oStep2.aScore.length; i++) {
                iSumL2Score += oPublic.oStatus.oStep2.aScore[i];
            }

            iAvgL2Score = Math.floor(iSumL2Score / oPublic.oStatus.oStep2.aScore.length);

            oPublic.oStatus.oStep2.iScore = iAvgL2Score; 

            oSendData.L2_SCORE = oPublic.oStatus.oStep2.aScore;
            oSendData.TIME_L2  = oPublic.oStatus.oStep2.iTime;

        // 스텝 3 : 딕테이션
        } else if (oPublic.oStatus.sStep === "L3") {
            oSendData.L3_ANSWER_ORG  = oPublic.oInfo.L3_ANSWER_ORG;
            oSendData.L3_ANSWER_USER = oPublic.oStatus.oStep3.aAnswerUser;
            oSendData.L3_SCORE       = oPublic.oStatus.oStep3.iScore;
            oSendData.TIME_L3        = oPublic.oStatus.oStep3.iTime;

        // 스텝 3 : 센텐스레코딩
        } else if (oPublic.oStatus.sStep === "S2") {
            var iAcoustic   = 0;
            var iHolistic   = 0;
            var iIntonation = 0;
            var iSegment    = 0;
            var iRate       = 0;
            var iPitch      = 0;

            $.each(oPublic.oStatus.oStep4.aScore, function(index, item) {
                iAcoustic   += item.ACOUSTIC;
                iHolistic   += item.HOLISTIC;
                iIntonation += item.INTONATION;
                iSegment    += item.SEGMENTAL;
                iRate       += item.SPEED;
                iPitch      += item.RHYTHM;
            });

            oPublic.oStatus.oStep4.iScore           = Math.floor((iAcoustic / oPublic.oStatus.oStep4.aScore.length));
            oPublic.oStatus.oStep4.iScoreHolistic   = Math.floor((iHolistic / oPublic.oStatus.oStep4.aScore.length) * 100) / 100;
            oPublic.oStatus.oStep4.iScoreIntonation = Math.floor((iIntonation / oPublic.oStatus.oStep4.aScore.length) * 100) / 100;
            oPublic.oStatus.oStep4.iScoreSegmental  = Math.floor((iSegment / oPublic.oStatus.oStep4.aScore.length) * 100) / 100;
            oPublic.oStatus.oStep4.iScoreSpeed      = Math.floor((iRate / oPublic.oStatus.oStep4.aScore.length) * 100) / 100;
            oPublic.oStatus.oStep4.iScoreRhythm     = Math.floor((iPitch / oPublic.oStatus.oStep4.aScore.length) * 100) / 100;

            oSendData.S2_SCORE = oPublic.oStatus.oStep4.aScore;
            oSendData.TIME_S2  = oPublic.oStatus.oStep4.iTime;

        } else {
            alert("[에러코드 : 002] 스텝 저장 중 스텝 정보를 찾을 수 없습니다.\n고객센터(1688-9907)로 문의해주세요.");
            return false;
        }

        console.log("서버 전송 데이터 : ");
        console.log(oSendData);

        ARBITER.ajax('/Learning/Recommend/study/setStudyAndNext', oSendData, function(ret) {
            var ret = $.parseJSON(ret);

            if (ret.sResultCode !== '200') {
                if (ret.sResultCode === "001") {
                    alert("[안내 : " + ret.sResultCode + "] 학생 정보를 찾을 수 없습니다.\n재로그인 후 학습을 실행해주세요.");
                } else if (ret.sResultCode === "002") {
                    alert("[안내 : " + ret.sResultCode + "] 추천 정보를 찾을 수 없습니다.\n먼저 컨텐츠를 추천받아주세요.");
                } else if (ret.sResultCode === "003") {
                    alert("[안내 : " + ret.sResultCode + "] 새로운 컨텐츠를 추천 받은 후 학습을 실행해주세요.");
                } else if (ret.sResultCode === "004") {
                    alert("[안내 : " + ret.sResultCode + "] 업데이트에 필요한 데이터가 없습니다.\n학습을 다시 실행해주세요.\n현상이 지속될 경우 고객센터(1688-9907)로 문의해주세요.");
                } else if (ret.sResultCode === "005") {
                    alert("[안내 : " + ret.sResultCode + "] 학습정보를 찾을 수 없습니다.\n이미 제출된 학습일 수 있습니다.\n학습을 다시 실행해주세요.\n현상이 지속될 경우 고객센터(1688-9907)로 문의해주세요.");
                } else if (ret.sResultCode === "006") {
                    alert("[안내 : " + ret.sResultCode + "] 스텝 정보가 잘못되었습니다. 1\n학습을 다시 실행해주세요.\n현상이 지속될 경우 고객센터(1688-9907)로 문의해주세요.");
                } else if (ret.sResultCode === "007") {
                    alert("[안내 : " + ret.sResultCode + "] 스텝 정보가 잘못되었습니다. 2\n학습을 다시 실행해주세요.\n현상이 지속될 경우 고객센터(1688-9907)로 문의해주세요.");
                } else if (ret.sResultCode === "008") {
                    alert("[안내 : " + ret.sResultCode + "] Unscramble 학습 업데이트에 필요한 데이터가 없습니다.\n학습을 다시 실행해주세요.\n현상이 지속될 경우 고객센터(1688-9907)로 문의해주세요.");
                } else if (ret.sResultCode === "009") {
                    alert("[안내 : " + ret.sResultCode + "] Dictation 학습 업데이트에 필요한 데이터가 없습니다.\n학습을 다시 실행해주세요.\n현상이 지속될 경우 고객센터(1688-9907)로 문의해주세요.");
                } else if (ret.sResultCode === "010") {
                    alert("[안내 : " + ret.sResultCode + "] Sentence Recording 학습 업데이트에 필요한 데이터가 없습니다.\n학습을 다시 실행해주세요.\n현상이 지속될 경우 고객센터(1688-9907)로 문의해주세요.");
                } else if (ret.sResultCode === "011") {
                    alert("[안내 : " + ret.sResultCode + "] DB : 학습 업데이트에 실패하였습니다.\n학습을 다시 실행해주세요.\n현상이 지속될 경우 고객센터(1688-9907)로 문의해주세요.");
                } else {
                    alert("[안내 : 9999] 학습 업데이트 중 예외 에러 발생\n고객센터(1688-9907)로 문의해주세요.");
                }

                return false;
            }

            oPublic.oInfo.sTemplate      = ret.sTemplate;
            oPublic.oInfo.sTemplateIntro = ret.sTemplateIntro;

            console.log("새로운 스텝 세팅 : " + sNextStep);
            recommend_study.fnSetStep(sNextStep);
        });
    }

    // 공통 : 초기화 및 진행 스텝 JS 파일 생성
    recommend_study.fnSetStep = function(sNextStep) {
        // 영상 이벤트 초기화
        recommend_study.fnRemovePlayerEvent();

        // 진행 문장 초기화
        oPublic.oStatus.iCurrent = 0;

        // 재생 배속 초기화
        oPublic.oStatus.fRate = 1;
        oPlayer.playbackRate  = 1;

        // STEP TPL SET
        // STEP 이동 시 결과 스텝일 경우
        if (sNextStep === 'RESULT') {
            $('.wrap').append(oPublic.oInfo.sTemplate);
            $('#oStep'+ oPublic.oStatus.sStep).remove();
            $('#oStep'+ sNextStep).show();

            oPublic.oStatus.sStep = sNextStep;

        // STEP 이동 시
        } else if (sNextStep) {
            $('.wrap').append(oPublic.oInfo.sTemplate);
            $('#oStep'+ sNextStep +' #oViewVideo').prepend($('#oVideoBox'));
            $('#oStep'+ oPublic.oStatus.sStep).remove();
            $('#oStep'+ sNextStep).show();

            $('#oStep'+ sNextStep).append(oPublic.oInfo.sTemplateIntro);

            oPublic.oStatus.sStep = sNextStep;

        // 처음 STEP 진입 시 (sNextStep 없음)
        } else {
            $('.wrap').append(oPublic.oInfo.sTemplate);
            $('#oStep'+ oPublic.oStatus.sStep +' #oViewVideo').prepend($('#oVideoBox'));
        }

        // 컨텐츠명
        $('#oContentName').text(oPublic.oInfo.CONTENT.NAME);

        // JS SET
        var sContentType = oPublic.oInfo.CONTENT.UCC_EUM === 1 ? "multi" : "basic";

        if (oPublic.oStatus.sStep === 'L1') {
            recommend_study.fnSetScript('study_l1_'+ sContentType +'.js');
        } else if (oPublic.oStatus.sStep === 'L2') {
            recommend_study.fnSetScript('study_l2_'+ sContentType +'.js');
        } else if (oPublic.oStatus.sStep === 'L3') {
            recommend_study.fnSetScript('study_l3_'+ sContentType +'.js');
        } else if (oPublic.oStatus.sStep === 'S2') {
            recommend_study.fnSetScript('study_s2_'+ sContentType +'.js');
        } else if (oPublic.oStatus.sStep === 'RESULT') {
            recommend_study.fnSetScript('study_result.js');
        } else {
            alert("[안내 : 9999] 스텝 세팅 중 스텝 정보를 찾을 수 없습니다.\n고객센터(1688-9907)로 문의해주세요.");
        }
    }

    // 공통 : 플레이어 이벤트 리스너 초기화
    recommend_study.fnRemovePlayerEvent = function() {
        oPlayer.removeEventListener('play', oPublic.oStatus.oVideo.fnPlay);
        oPlayer.removeEventListener('pause', oPublic.oStatus.oVideo.fnPause);
        oPlayer.removeEventListener('timeupdate', oPublic.oStatus.oVideo.fnUpdate);
        oPlayer.removeEventListener('ended', oPublic.oStatus.oVideo.fnEnded);
        console.log("플레이어 이벤트 초기화");
    }

    // 공통 : 스텝이 준비되고 비디오 재생 가능할 때 로딩화면 제거
    recommend_study.fnCanPlay = function() {
        oPlayer.addEventListener('canplaythrough', function() {
            if (oPlayer.readyState === 4) {
                // 이벤트 리스너 제거
                oPlayer.removeEventListener('canplaythrough', arguments.callee);

                // 로딩화면 제거
                $('[name=oPopLoading]').remove();

                oPublic.oStatus.bStuck = false;
                console.log("STEP READY COMPLETE");
            }
        });
    }

    // 공통 : 마이크 체크 후 웹 RTC 객체 생성 콜백 실행
    recommend_study.fnMicCheck = function(fnCallback) {
        navigator.mediaDevices.getUserMedia({audio: true})
        .then(function(oStream) {
            recommend_study.oAudioStream = oStream

            var oOptions = {
                recorderType          : StereoAudioRecorder,
                mimeType              : 'audio/wav',
                numberOfAudioChannels : 1,
                desiredSampRate       : 16000,
            };

            recommend_study.oRecordRtc = RecordRTC(recommend_study.oAudioStream, oOptions);

            fnCallback();
        })
        .catch(function(error) {
            console.log(error.name + ": " + error.message);
            $('.view').append(oPublic.oInfo.sTemplateCheck);
        });
    }

    // 공통 : JS 생성
    recommend_study.fnSetScript = function(sFile) {
        var oScript     = document.createElement('script');
        oScript.type    = "text/javascript";
        oScript.src     = "/public_html/resource/js/learning/recommend/study/" + sFile;
        oScript.async   = false;
        oScript.charset = "EUC-KR";

        $('body')[0].append(oScript);
    }

    // 공통 : 앵커 로딩 인디케이터 열기
    recommend_study.fnModalOpen = function() {
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

    // 공통 : 앵커 로딩 인디케이터 닫기
    recommend_study.fnModalClose = function() {
        modal.close();
    }

    // 공통 : 토스트 팝업
    recommend_study.fnToastPop = function(sNotice) {
        $('#oPopError').text(sNotice);
        $('#oPopError').fadeIn(400).delay(1000).fadeOut(400);
    }

    // 공통 : 시간 포맷 함수 (ii:ss) 
    recommend_study.fnGetMinuteSec = function(iData) {
        var iNum = parseInt(iData, 10);
        var iMin = Math.floor(iNum / 60);
        var iSec = iNum - (iMin * 60);
        if (iMin < 10) {iMin = "0" + iMin;}
        if (iSec < 10) {iSec = "0" + iSec;}
        return iMin + ' : ' + iSec;
    }

    response.implement = recommend_study;
});