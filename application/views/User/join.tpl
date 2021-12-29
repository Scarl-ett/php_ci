<body class="bg-light">
<div class="container">
    <div class="py-5 text-center">
        <h2>회원가입</h2>
    </div>
    <div class="g-5 d-flex justify-content-center row">
        <div class="col-lg-7">
            <form class="needs-validation" novalidate method="post" id="joinForm" action="/user/signup/joinInsert">
                <div class="form-row">
                    <div class="col-md-9 mb-3">
                        <label for="userId"><span class="red-color">* </span>아이디</label>
                        <input type="text" data-role="1" name="user_id" class="form-control" id="userId" required>
                        <div class="invalid-feedback">
                            아이디를 입력해주세요.(영소문자로 시작하는 영문자, 숫자 조합 4~12자리)
                        </div>
                    </div>
                    <div class="col-md-3 pt-2">
                        <button class="w-100 btn btn-primary mt-4" type="button" id="idCheckBtn">중복검사</button>
                    </div>
                </div>
                <div class="form-row">
                    <div class="col-md-12 mb-3">
                        <label for="userPw"><span class="red-color">* </span>비밀번호</label>
                        <input type="password" name="user_pw" class="form-control" id="userPw" required>
                        <div class="invalid-feedback">
                            비밀번호를 입력해주세요.(영문 소문자, 영문 대문자, 숫자, 특수문자(!@$%&* 만 허용) 8~12자리)
                        </div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="col-md-12 mb-3">
                        <label for="userPw2"><span class="red-color">* </span>비밀번호확인</label>
                        <input type="password" name="user_pw2" class="form-control" id="userPw2" required>
                        <div class="invalid-feedback">비밀번호를 입력해주세요.</div>
                    </div>
                 </div>
                <div class="form-row">
                    <div class="col-md-12 mb-3">
                        <label for="userName"><span class="red-color">* </span>이름</label>
                        <input type="text" name="user_name" class="form-control" id="userName" required>
                        <div class="invalid-feedback">이름을 입력해주세요.</div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="col-md-5 mb-3">
                        <label for="userEmail1"><span class="red-color">* </span>이메일</label>
                        <input type="text" name="user_email1" class="form-control" id="userEmail1" required>
                        <div class="invalid-feedback">이메일을 입력해주세요.</div>
                    </div>
                    <div class="col-md-1 mt-4 text-center pt-3">
                        <label>@</label>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label for="userEmail2"><span class="red-color">* </span>이메일</label>
                        <input type="text" name="user_email2" class="form-control" id="userEmail2" required>
                        <div class="invalid-feedback">이메일을 선택하시거나 직접 입력해주세요.</div>
                    </div>
                    <div class="col-md-3 mt-4 pt-2">
                        <select class="form-control2" id="emailSelect">
                            <option value="">이메일선택</option>
                            <option value="naver.com">네이버</option>
                            <option value="nate.com">네이트</option>
                            <option value="daum.net">다음</option>
                            <option value="gmail.com">구글</option>
                            <option value="hanmail.com">한메일</option>
                            <option value="1">직접입력</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="col-md-12 mb-3">
                        <label for="userTel"><span class="red-color">* </span>전화번호</label>
                        <input type="text" name="user_tel" class="form-control" id="userTel" required>
                        <div class="invalid-feedback">전화번호를 입력해주세요.(ex 010-1234-5678)</div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="col-md-4 mb-3">
                        <label for="userZip"><span class="red-color">* </span>우편번호</label>
                        <input type="text" name="user_zip" class="form-control" id="userZip" required readonly>
                        <div class="invalid-feedback">주소검색을 통해 우편번호를 입력해주세요.</div>
                    </div>
                    <div class="col-md-3 mb-3 mt-2">
                        <button class="btn btn-primary mt-4" id="postcodeBtn" type="button">주소검색</button>
                    </div>
                </div>
                <div class="form-row">
                    <div class="col-md-6 mb-3">
                        <label for="userAddr1"><span class="red-color">* </span>기본주소</label>
                        <input type="text" name ="user_addr1" class="form-control" id="userAddr1" required readonly>
                        <div class="invalid-feedback">주소검색을 통해 기본주소를 선택해주세요.</div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="userAddr2"><span class="red-color">* </span>상세주소 </label>
                        <input type="text" name="user_addr2" class="form-control" id="userAddr2" required>
                        <div class="invalid-feedback">상세주소를 입력해주세요.</div>
                    </div>
                </div>
                <hr class="my-4">
                <h6><span class="red-color">* </span>개인정보수집동의</h6>
                <div class="form-group">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="Y" name="user_privacy" id="invalidCheck" required>
                        <label class="form-check-label" for="invalidCheck"> 개인정보수집에 동의합니다. </label>
                        <div class="invalid-feedback">개인정보동의는 필수입니다.</div>
                    </div>
                </div>
                <hr class="my-4">
                <div class="row d-flex justify-content-center">
                    <button class="btn btn-secondary btn-lg mb-5 col-lg-5 mr-4" id="cancelBtn" type="button">취소</button>
                    <button class="btn btn-primary btn-lg mb-5 col-lg-5 ml-4" id="joinBtn" type="button">회원가입</button>
                </div>
            </form>
        </div>
    </div>
</div>