// 先封装接口
/**
 * @param {*} userInform 以对象的形式传递信息
 */
var API = (function () {
  const BASE_URL = "http://study.duyiedu.com";
  const TOKEN_VALUE = "token";
  // 直接二次封装了
  /**
   *
   * @param {*} path 用于传递传入的请求路径
   */
  // get请求
  function get(path) {
    //先取出存储在localStorage里面的token值
    const token = localStorage.getItem(TOKEN_VALUE);
    let headers = {};
    if (token) {
      // 如果token有值的话,需要传入请求头以authrozation属性带过去
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, { headers });
  }
  // post请求
  function post(path, obj) {
    const token = localStorage.getItem(TOKEN_VALUE);
    let headers = {
      "Content-Type": "application/JSON",
    };
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, {
      method: "POST",
      headers,
      body: JSON.stringify(obj),
    });
  }

  //注册 （post请求）
  async function reSetUser(inForm) {
    const resp = await post("/api/user/reg", inForm);
    return await resp.json();
  }

  //登录 （post请求）
  async function login(userInform) {
    const resp = await post("/api/user/login", userInform);
    const result = await resp.json();
    if (result.code === 0) {
      //登录成功
      //将响应头中的token保存到localStorage
      const token = resp.headers.get("authorization");
      localStorage.setItem(TOKEN_VALUE, token);
    }
    // 登录失败，返回响应体
    return result;
  }

  // 验证 （get请求）
  async function exitUser(loginId) {
    const resp = await get("/api/user/exists?loginId=" + loginId);
    return await resp.json();
  }

  // 发送信息 （post请求）
  async function sendChat(content) {
    const resp = await post("/api/chat", {
      content,
    });
    return await resp.json();
  }
  // 获取信息记录 （post请求）
  async function getHistory() {
    const resp = await get("/api/chat/history");
    return await resp.json();
  }
  // 获取当前登录信息 （get请求）
  async function getProfile() {
    const resp = await get("/api/user/profile");
    return await resp.json();
  }

  // 退出登录,删掉token
  function outLogin() {
    localStorage.removeItem(TOKEN_VALUE);
  }

  return {
    reSetUser,
    login,
    exitUser,
    sendChat,
    getHistory,
    getProfile,
    outLogin,
  };
})();
