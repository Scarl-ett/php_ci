<body class="text-center">
<main class="form-signin">
    <form class="needs-validation" novalidate method="post" id="loginForm" action="/signin/login">
        <h1 class="h3 mb-3 fw-normal">Please sign in</h1>
        <div class="form-floating mb-2">
            <input type="text" name="user_id" class="form-control" placeholder="Id" value="{? _COOKIE.user_id}{_COOKIE.user_id}{/}" required/>
            <div class="invalid-feedback text-left">���̵� �Է����ּ���.</div>
        </div>
        <div class="form-floating">
            <input type="password" name="user_pw" class="form-control" placeholder="Password" required>
            <div class="invalid-feedback text-left">��й�ȣ�� �Է����ּ���.</div>
        </div>
        <div class="checkbox mt-4 mb-3">
            <label>
                <input type="checkbox" name="remember" value="Y" {? _COOKIE.user_id}checked{/}> Remember me
            </label>
        </div>
        <button class="btn btn-secondary" id="joinBtn" type="button">ȸ������</button>
        <button class="btn btn-primary" id="loginBtn" type="button">�α���</button>
    </form>
</main>