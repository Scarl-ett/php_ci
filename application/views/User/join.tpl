<body class="bg-light">
<div class="container">
    <div class="py-5 text-center">
        <h2>ȸ������</h2>
    </div>
    <div class="g-5 d-flex justify-content-center row">
        <div class="col-lg-7">
            <form class="needs-validation" novalidate method="post" id="joinForm" action="/user/signup/joinInsert">
                <div class="form-row">
                    <div class="col-md-9 mb-3">
                        <label for="userId"><span class="red-color">* </span>���̵�</label>
                        <input type="text" data-role="1" name="user_id" class="form-control" id="userId" required>
                        <div class="invalid-feedback">
                            ���̵� �Է����ּ���.(���ҹ��ڷ� �����ϴ� ������, ���� ���� 4~12�ڸ�)
                        </div>
                    </div>
                    <div class="col-md-3 pt-2">
                        <button class="w-100 btn btn-primary mt-4" type="button" id="idCheckBtn">�ߺ��˻�</button>
                    </div>
                </div>
                <div class="form-row">
                    <div class="col-md-12 mb-3">
                        <label for="userPw"><span class="red-color">* </span>��й�ȣ</label>
                        <input type="password" name="user_pw" class="form-control" id="userPw" required>
                        <div class="invalid-feedback">
                            ��й�ȣ�� �Է����ּ���.(���� �ҹ���, ���� �빮��, ����, Ư������(!@$%&* �� ���) 8~12�ڸ�)
                        </div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="col-md-12 mb-3">
                        <label for="userPw2"><span class="red-color">* </span>��й�ȣȮ��</label>
                        <input type="password" name="user_pw2" class="form-control" id="userPw2" required>
                        <div class="invalid-feedback">��й�ȣ�� �Է����ּ���.</div>
                    </div>
                 </div>
                <div class="form-row">
                    <div class="col-md-12 mb-3">
                        <label for="userName"><span class="red-color">* </span>�̸�</label>
                        <input type="text" name="user_name" class="form-control" id="userName" required>
                        <div class="invalid-feedback">�̸��� �Է����ּ���.</div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="col-md-5 mb-3">
                        <label for="userEmail1"><span class="red-color">* </span>�̸���</label>
                        <input type="text" name="user_email1" class="form-control" id="userEmail1" required>
                        <div class="invalid-feedback">�̸����� �Է����ּ���.</div>
                    </div>
                    <div class="col-md-1 mt-4 text-center pt-3">
                        <label>@</label>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label for="userEmail2"><span class="red-color">* </span>�̸���</label>
                        <input type="text" name="user_email2" class="form-control" id="userEmail2" required>
                        <div class="invalid-feedback">�̸����� �����Ͻðų� ���� �Է����ּ���.</div>
                    </div>
                    <div class="col-md-3 mt-4 pt-2">
                        <select class="form-control2" id="emailSelect">
                            <option value="">�̸��ϼ���</option>
                            <option value="naver.com">���̹�</option>
                            <option value="nate.com">����Ʈ</option>
                            <option value="daum.net">����</option>
                            <option value="gmail.com">����</option>
                            <option value="hanmail.com">�Ѹ���</option>
                            <option value="1">�����Է�</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="col-md-12 mb-3">
                        <label for="userTel"><span class="red-color">* </span>��ȭ��ȣ</label>
                        <input type="text" name="user_tel" class="form-control" id="userTel" required>
                        <div class="invalid-feedback">��ȭ��ȣ�� �Է����ּ���.(ex 010-1234-5678)</div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="col-md-4 mb-3">
                        <label for="userZip"><span class="red-color">* </span>�����ȣ</label>
                        <input type="text" name="user_zip" class="form-control" id="userZip" required readonly>
                        <div class="invalid-feedback">�ּҰ˻��� ���� �����ȣ�� �Է����ּ���.</div>
                    </div>
                    <div class="col-md-3 mb-3 mt-2">
                        <button class="btn btn-primary mt-4" id="postcodeBtn" type="button">�ּҰ˻�</button>
                    </div>
                </div>
                <div class="form-row">
                    <div class="col-md-6 mb-3">
                        <label for="userAddr1"><span class="red-color">* </span>�⺻�ּ�</label>
                        <input type="text" name ="user_addr1" class="form-control" id="userAddr1" required readonly>
                        <div class="invalid-feedback">�ּҰ˻��� ���� �⺻�ּҸ� �������ּ���.</div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="userAddr2"><span class="red-color">* </span>���ּ� </label>
                        <input type="text" name="user_addr2" class="form-control" id="userAddr2" required>
                        <div class="invalid-feedback">���ּҸ� �Է����ּ���.</div>
                    </div>
                </div>
                <hr class="my-4">
                <h6><span class="red-color">* </span>����������������</h6>
                <div class="form-group">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="Y" name="user_privacy" id="invalidCheck" required>
                        <label class="form-check-label" for="invalidCheck"> �������������� �����մϴ�. </label>
                        <div class="invalid-feedback">�����������Ǵ� �ʼ��Դϴ�.</div>
                    </div>
                </div>
                <hr class="my-4">
                <div class="row d-flex justify-content-center">
                    <button class="btn btn-secondary btn-lg mb-5 col-lg-5 mr-4" id="cancelBtn" type="button">���</button>
                    <button class="btn btn-primary btn-lg mb-5 col-lg-5 ml-4" id="joinBtn" type="button">ȸ������</button>
                </div>
            </form>
        </div>
    </div>
</div>