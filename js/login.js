//登录的js

const loginIdValidator = new FileValidator("txtLoginId", async function (
  value
) {
  // 表单为空时
  if (!value) {
    return "请填写账号";
  }
});

const loginPwdValidator = new FileValidator("txtLoginPwd", function (value) {
  if (!value) {
    return "请输入密码";
  }
});

const form = $(".user-form");
form.onsubmit = async function (e) {
  e.preventDefault();
  const result = await FileValidator.validate(
    loginPwdValidator,
    loginIdValidator
  );

  if (!result) {
    return; //未通过
  }
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  const resp = await API.login(data);
  if (resp.code === 0) {
    alert("登录成功，点击确定跳转首页");
    // 跳转到首页
    location.href = "./index.html";
  } else {
    alert("登录失败，请检查账号密码");
    loginPwdValidator.input.value = "";
  }
};
