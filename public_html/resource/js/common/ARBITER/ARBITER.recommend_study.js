/**
 * ��õ �н�
 */
ARBITER.declare('ARBITER.recommend_study', ['layerpopup', 'ajax'], function(response) {
    var $ = jQuery;
    var recommend_study = {}
    var oPublic = {};
    var modal;  // �ε�������

    // ����
    var oPlayer = $('video')[0];
    recommend_study.oPlayer      = oPlayer;

    // ������ �ʿ��� ����
    var oRecordRtc;
    var oAudioStream;

    recommend_study.oRecordRtc   = oRecordRtc;      // �� RTC ��ü
    recommend_study.oAudioStream = oAudioStream;    // ����� ���� ��ü

    // ���� : ���� ���� GET
    recommend_study.fnGetStatus = function() {
        return oPublic.oStatus;
    }

    // ���� : �н� ������ GET
    recommend_study.fnGetData = function() {
        return oPublic.oInfo;
    }

    // �ʱ� ������ ����
    recommend_study.fnSet = function(oData) {
        oPublic = {
            oInfo   : oData,
            oStatus : {
                bStuck    : false,                                      // ��ư �ߺ� Ŭ�� ����
                sStep     : oData.SAVE_STEP,                            // �߰����� ����
                fRate     : 1,                                          // ��� �ӵ�
                bKor      : true,                                       // �ѱ� ǥ�� �÷���
                iCurrent  : 0,                                          // ���� ���� �ε���
                iProgress : 0,                                          // ������ �����
                oVideo    : {                                           // ���� �̺�Ʈ ������ �Լ� (���ܸ��� �ʱ�ȭ �� �缳��)
                    fnPlay           : function () {},
                    fnPause          : function () {},
                    fnUpdate         : function () {},
                    fnEnded          : function () {},
                },
                oStep1    : {
                    iNow             : 1,                               // ���� ��� Ƚ��
                    iLimit           : 1,                               // ��� Ƚ�� ���� (��� �ݺ� Ƚ��)
                    iTime            : oData.TIME.L1,                   // �н� �ð�
                    bNext            : false,                           // ���� ��� ���� �÷���
                },
                oStep2    : {
                    iPlay            : 0,                               // ��� ī��Ʈ 0->1 ���� ���, 1->2 ��ũ��Ʈ ���
                    iTryMax          : 5,                               // ���� �ִ� ��
                    iTryUser         : 5,                               // �л� ���� ���� ��,
                    iWrong           : 0,                               // ���� Ƚ��
                    aScore           : oData.SCORE.L2_SENTENCE,         // ��ũ���� ����
                    iScore           : oData.SCORE.L2,                  // ȹ������
                    iTime            : oData.TIME.L2,                   // �н��ð�
                    bNext            : false,                           // ���� ��� ���� �÷���
                },
                oStep3    : {
                    iPlay            : 0,                               // ��� ī��Ʈ 0->1 ���� ���, 1->2 ��ũ��Ʈ ���
                    iMaxIndex        : 0,                               // �ִ� ���� ���� (���ο� ������ ����� ������ ���� �����ֱ� ����)
                    aAnswerOrg       : oData.L3_ANSWER_ORG,             // ���� ���
                    aAnswerUser      : oData.L3_ANSWER_USER,            // ���� ���
                    iScore           : oData.SCORE.L3,                  // ȹ������
                    iTime            : oData.TIME.L3,                   // �н��ð�
                    bNextSentence    : false,                           // ���� ��� ���� �÷���
                    bNext            : false                            // ���� ��� ���� �÷���
                },
                oStep4    : {
                    iPlay            : 0,                               // ��� ī��Ʈ 0->1 ���� ���, 1->2 ��ũ��Ʈ ���
                    iNow             : 1,                               // ���� ��� Ƚ��
                    iLimit           : oData.OPTION.S2_PLAY_LIMIT,      // ��� Ƚ�� ���� (���� �ݺ� Ƚ��)
                    iFail            : 0,                               // ���� ���� Ƚ��
                    iFailLimit       : oData.OPTION.S2_PASS_CNT,        // ���� ��� Ƚ��
                    aScore           : [],                              // ���� ����
                    iScoreLimit      : oData.OPTION.S2_SCORE_LIMIT,     // ��� ���� ����
                    iScore           : oData.SCORE.S2_ACOUSCTIC,        // ȹ������
                    iScoreHolistic   : oData.SCORE.S2_HOLISTIC,         // ȹ������
                    iScoreIntonation : oData.SCORE.S2_INTONATION,       // ȹ������
                    iScoreSegmental  : oData.SCORE.S2_SEGMENTAL,        // ȹ������
                    iScoreSpeed      : oData.SCORE.S2_SPEED,            // ȹ������
                    iScoreRhythm     : oData.SCORE.S2_RHYTHM,           // ȹ������
                    iTime            : oData.TIME.S2,                   // �н��ð�
                    bNext            : false,                           // ���� ��� ���� �÷���
                },
            },
        }

        console.log("�ʱ� ���� : ");
        console.log(oPublic);

        // ������ �ҽ� �Է�
        oPlayer.src = oPublic.oInfo.CONTENT.MP4_URL;

        // ������ ��Ÿ �����͸� �о��� �� ���� ������ ����
        oPlayer.addEventListener('loadedmetadata', (event) => {
            // ���� ��ũ�� ������ ���� ���̺��� �� ��� �߻��ϴ� �̽��� �ذ��ϱ� ���� ó�� (������ ���� ������ ���忡�� �߻�)
            // ������ ���� -0.1 ó���Ͽ� ���� ��ũ�� ��ü�Ѵ�.
            for (var i = 0; i < oPublic.oInfo.CONTENT.SYNC.length; i++) {
                if (oPublic.oInfo.CONTENT.SYNC[i].FINAL === 'T' && oPlayer.duration > 0 && oPlayer.duration < oPublic.oInfo.CONTENT.SYNC[i].E_SYNC + 0.2) {
                    oPublic.oInfo.CONTENT.SYNC[i].E_SYNC = oPlayer.duration - 0.2;
                    oPublic.oInfo.CONTENT.TIME_END       = oPlayer.duration - 0.2;
                }
            }

            // ���� ����
            recommend_study.fnSetStep();
        }, {once: true});

        return oPublic;
    }

    // ���� : �н� ������Ʈ �� ���� ���� ���ø� GET
    recommend_study.fnSetStudy = function() {
        // �ε�ȭ�� SET
        $('.view').after(oPublic.oInfo.sTemplateLoading);

        // ���� ���� ���ϱ�
        var aStep      = oPublic.oInfo.OPTION.STEP.split('|');
        var iStepIndex = aStep.indexOf(oPublic.oStatus.sStep);
        var sNextStep  = aStep[iStepIndex + 1] ? aStep[iStepIndex + 1] : "RESULT";

        // ���� ������ ����
        var oSendData  = {
            MEM_CD        : oPublic.oInfo.USER.MEM_CD,
            MU_CD         : oPublic.oInfo.USER.MU_CD,
            RECOMMEND_DAY : oPublic.oInfo.RECOMMEND_DAY,
            RECOMMEND_CD  : oPublic.oInfo.RECOMMEND_CD,
            STUDY_CD      : oPublic.oInfo.STUDY_CD,
            STEP_STUDIED  : oPublic.oStatus.sStep,
            STEP_NEXT     : sNextStep,
        };

        // ���� 1 : ����������
        if (oPublic.oStatus.sStep === "L1") {
            oSendData.TIME_L1 = oPublic.oStatus.oStep1.iTime;

        // ���� 2 : ��ũ����
        } else if (oPublic.oStatus.sStep === "L2") {
            var iSumL2Score = 0;
            for (var i = 0; i < oPublic.oStatus.oStep2.aScore.length; i++) {
                iSumL2Score += oPublic.oStatus.oStep2.aScore[i];
            }

            iAvgL2Score = Math.floor(iSumL2Score / oPublic.oStatus.oStep2.aScore.length);

            oPublic.oStatus.oStep2.iScore = iAvgL2Score; 

            oSendData.L2_SCORE = oPublic.oStatus.oStep2.aScore;
            oSendData.TIME_L2  = oPublic.oStatus.oStep2.iTime;

        // ���� 3 : �����̼�
        } else if (oPublic.oStatus.sStep === "L3") {
            oSendData.L3_ANSWER_ORG  = oPublic.oInfo.L3_ANSWER_ORG;
            oSendData.L3_ANSWER_USER = oPublic.oStatus.oStep3.aAnswerUser;
            oSendData.L3_SCORE       = oPublic.oStatus.oStep3.iScore;
            oSendData.TIME_L3        = oPublic.oStatus.oStep3.iTime;

        // ���� 3 : ���ٽ����ڵ�
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
            alert("[�����ڵ� : 002] ���� ���� �� ���� ������ ã�� �� �����ϴ�.\n������(1688-9907)�� �������ּ���.");
            return false;
        }

        console.log("���� ���� ������ : ");
        console.log(oSendData);

        ARBITER.ajax('/Learning/Recommend/study/setStudyAndNext', oSendData, function(ret) {
            var ret = $.parseJSON(ret);

            if (ret.sResultCode !== '200') {
                if (ret.sResultCode === "001") {
                    alert("[�ȳ� : " + ret.sResultCode + "] �л� ������ ã�� �� �����ϴ�.\n��α��� �� �н��� �������ּ���.");
                } else if (ret.sResultCode === "002") {
                    alert("[�ȳ� : " + ret.sResultCode + "] ��õ ������ ã�� �� �����ϴ�.\n���� �������� ��õ�޾��ּ���.");
                } else if (ret.sResultCode === "003") {
                    alert("[�ȳ� : " + ret.sResultCode + "] ���ο� �������� ��õ ���� �� �н��� �������ּ���.");
                } else if (ret.sResultCode === "004") {
                    alert("[�ȳ� : " + ret.sResultCode + "] ������Ʈ�� �ʿ��� �����Ͱ� �����ϴ�.\n�н��� �ٽ� �������ּ���.\n������ ���ӵ� ��� ������(1688-9907)�� �������ּ���.");
                } else if (ret.sResultCode === "005") {
                    alert("[�ȳ� : " + ret.sResultCode + "] �н������� ã�� �� �����ϴ�.\n�̹� ����� �н��� �� �ֽ��ϴ�.\n�н��� �ٽ� �������ּ���.\n������ ���ӵ� ��� ������(1688-9907)�� �������ּ���.");
                } else if (ret.sResultCode === "006") {
                    alert("[�ȳ� : " + ret.sResultCode + "] ���� ������ �߸��Ǿ����ϴ�. 1\n�н��� �ٽ� �������ּ���.\n������ ���ӵ� ��� ������(1688-9907)�� �������ּ���.");
                } else if (ret.sResultCode === "007") {
                    alert("[�ȳ� : " + ret.sResultCode + "] ���� ������ �߸��Ǿ����ϴ�. 2\n�н��� �ٽ� �������ּ���.\n������ ���ӵ� ��� ������(1688-9907)�� �������ּ���.");
                } else if (ret.sResultCode === "008") {
                    alert("[�ȳ� : " + ret.sResultCode + "] Unscramble �н� ������Ʈ�� �ʿ��� �����Ͱ� �����ϴ�.\n�н��� �ٽ� �������ּ���.\n������ ���ӵ� ��� ������(1688-9907)�� �������ּ���.");
                } else if (ret.sResultCode === "009") {
                    alert("[�ȳ� : " + ret.sResultCode + "] Dictation �н� ������Ʈ�� �ʿ��� �����Ͱ� �����ϴ�.\n�н��� �ٽ� �������ּ���.\n������ ���ӵ� ��� ������(1688-9907)�� �������ּ���.");
                } else if (ret.sResultCode === "010") {
                    alert("[�ȳ� : " + ret.sResultCode + "] Sentence Recording �н� ������Ʈ�� �ʿ��� �����Ͱ� �����ϴ�.\n�н��� �ٽ� �������ּ���.\n������ ���ӵ� ��� ������(1688-9907)�� �������ּ���.");
                } else if (ret.sResultCode === "011") {
                    alert("[�ȳ� : " + ret.sResultCode + "] DB : �н� ������Ʈ�� �����Ͽ����ϴ�.\n�н��� �ٽ� �������ּ���.\n������ ���ӵ� ��� ������(1688-9907)�� �������ּ���.");
                } else {
                    alert("[�ȳ� : 9999] �н� ������Ʈ �� ���� ���� �߻�\n������(1688-9907)�� �������ּ���.");
                }

                return false;
            }

            oPublic.oInfo.sTemplate      = ret.sTemplate;
            oPublic.oInfo.sTemplateIntro = ret.sTemplateIntro;

            console.log("���ο� ���� ���� : " + sNextStep);
            recommend_study.fnSetStep(sNextStep);
        });
    }

    // ���� : �ʱ�ȭ �� ���� ���� JS ���� ����
    recommend_study.fnSetStep = function(sNextStep) {
        // ���� �̺�Ʈ �ʱ�ȭ
        recommend_study.fnRemovePlayerEvent();

        // ���� ���� �ʱ�ȭ
        oPublic.oStatus.iCurrent = 0;

        // ��� ��� �ʱ�ȭ
        oPublic.oStatus.fRate = 1;
        oPlayer.playbackRate  = 1;

        // STEP TPL SET
        // STEP �̵� �� ��� ������ ���
        if (sNextStep === 'RESULT') {
            $('.wrap').append(oPublic.oInfo.sTemplate);
            $('#oStep'+ oPublic.oStatus.sStep).remove();
            $('#oStep'+ sNextStep).show();

            oPublic.oStatus.sStep = sNextStep;

        // STEP �̵� ��
        } else if (sNextStep) {
            $('.wrap').append(oPublic.oInfo.sTemplate);
            $('#oStep'+ sNextStep +' #oViewVideo').prepend($('#oVideoBox'));
            $('#oStep'+ oPublic.oStatus.sStep).remove();
            $('#oStep'+ sNextStep).show();

            $('#oStep'+ sNextStep).append(oPublic.oInfo.sTemplateIntro);

            oPublic.oStatus.sStep = sNextStep;

        // ó�� STEP ���� �� (sNextStep ����)
        } else {
            $('.wrap').append(oPublic.oInfo.sTemplate);
            $('#oStep'+ oPublic.oStatus.sStep +' #oViewVideo').prepend($('#oVideoBox'));
        }

        // ��������
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
            alert("[�ȳ� : 9999] ���� ���� �� ���� ������ ã�� �� �����ϴ�.\n������(1688-9907)�� �������ּ���.");
        }
    }

    // ���� : �÷��̾� �̺�Ʈ ������ �ʱ�ȭ
    recommend_study.fnRemovePlayerEvent = function() {
        oPlayer.removeEventListener('play', oPublic.oStatus.oVideo.fnPlay);
        oPlayer.removeEventListener('pause', oPublic.oStatus.oVideo.fnPause);
        oPlayer.removeEventListener('timeupdate', oPublic.oStatus.oVideo.fnUpdate);
        oPlayer.removeEventListener('ended', oPublic.oStatus.oVideo.fnEnded);
        console.log("�÷��̾� �̺�Ʈ �ʱ�ȭ");
    }

    // ���� : ������ �غ�ǰ� ���� ��� ������ �� �ε�ȭ�� ����
    recommend_study.fnCanPlay = function() {
        oPlayer.addEventListener('canplaythrough', function() {
            if (oPlayer.readyState === 4) {
                // �̺�Ʈ ������ ����
                oPlayer.removeEventListener('canplaythrough', arguments.callee);

                // �ε�ȭ�� ����
                $('[name=oPopLoading]').remove();

                oPublic.oStatus.bStuck = false;
                console.log("STEP READY COMPLETE");
            }
        });
    }

    // ���� : ����ũ üũ �� �� RTC ��ü ���� �ݹ� ����
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

    // ���� : JS ����
    recommend_study.fnSetScript = function(sFile) {
        var oScript     = document.createElement('script');
        oScript.type    = "text/javascript";
        oScript.src     = "/public_html/resource/js/learning/recommend/study/" + sFile;
        oScript.async   = false;
        oScript.charset = "EUC-KR";

        $('body')[0].append(oScript);
    }

    // ���� : ��Ŀ �ε� �ε������� ����
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

    // ���� : ��Ŀ �ε� �ε������� �ݱ�
    recommend_study.fnModalClose = function() {
        modal.close();
    }

    // ���� : �佺Ʈ �˾�
    recommend_study.fnToastPop = function(sNotice) {
        $('#oPopError').text(sNotice);
        $('#oPopError').fadeIn(400).delay(1000).fadeOut(400);
    }

    // ���� : �ð� ���� �Լ� (ii:ss) 
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