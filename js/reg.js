//注册的js
//创建实例，调用
const loginIdValidator = new FileValidator("txtLoginId", async function (
  value
) {
  // 表单为空时
  if (!value) {
    return "请填写账号";
  }
  //验证表单是否已注册
  const resp = await API.exitUser(value);
  if (resp.data) {
    return "该账号已被占用，请重新选择一个账号名";
  }
});

const txtNicknameValidator = new FileValidator("txtNickname", function (value) {
  if (!value) {
    return "请输入昵称";
  }
});

const loginPwdValidator = new FileValidator("txtLoginPwd", function (value) {
  if (!value) {
    return "请输入密码";
  }
});
const loginPwdConfirmValidator = new FileValidator(
  "txtLoginPwdConfirm",
  function (value) {
    if (!value) {
      return "请输入确认密码";
    }
    if (value !== loginPwdValidator.input.value) {
      return "两次密码不一致";
    }
  }
);

const form = $(".user-form");
form.onsubmit = async function (e) {
  e.preventDefault();
  const result = await FileValidator.validate(
    loginPwdValidator,
    loginIdValidator,
    txtNicknameValidator,
    loginPwdConfirmValidator
  );
  console.log(result);
  if (!result) {
    return; //未通过
  }
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  console.log(data);
  const resp = await API.reSetUser(data);
  if (resp.code === 0) {
    alert("注册成功");
    // 跳转到登录页
    location.href = "./login.html";
  }
};
