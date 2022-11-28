//先验证是否有登录
(async function () {
  const resp = await API.getProfile();
  const uesr = resp.data;
  if (!uesr) {
    alert("未登录或登录已过期，请重新登录");
    location.href = "./login.html";
    return;
  }
  //   获取dom
  const doms = {
    aside: {
      nickName: $("#nickname"),
      loginId: $("#loginId"),
    },
    close: $(".close"),
    chatContainer: $(".chat-container"),
    txtMsg: $("#txtMsg"),
    messageContainer: $(".msg-container"),
  };

  //   设置用户信息
  function setUserInform() {
    doms.aside.nickName.innerText = uesr.nickName;
    doms.aside.loginId.innerText = uesr.loginId;
  }
  setUserInform();

  //   注销事件
  doms.close.onclick = function () {
    // 删除token
    API.outLogin();
    location.href = "./login.html";
  };
  await localHistory();
  //   添加历史记录
  async function localHistory() {
    const resp = await API.getHistory();
    for (const item of resp.data) {
      addChat(item);
    }
    scrollBottom();
  }
  // 让聊天滚动到最后
  function scrollBottom() {
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
  }

  //   发送消息
  async function sendMessage() {
    const content = doms.txtMsg.value.trim();
    if (!content) {
      return;
    }
    addChat({
      from: uesr.loginId,
      to: null,
      createAt: Date.now(),
      content,
    });
    doms.txtMsg.value = "";
    scrollBottom();
    const resp = await API.sendChat(content);
    addChat({
      from: null,
      to: uesr.loginId,
      ...resp.data,
    });
    scrollBottom();
  }

  // 表单提交事件
  doms.messageContainer.onsubmit = function (e) {
    e.preventDefault();
    sendMessage();
  };

  //添加消息
  function addChat(chatinfo) {
    const div = $$$("div");
    div.classList.add("chat-item");
    if (chatinfo.from) {
      div.classList.add("me");
    }

    const img = $$$("img");
    img.className = "chat-avatar";
    img.src = chatinfo.from ? "./asset/avatar.png" : "./asset/robot-avatar.jpg";
    const content = $$$("div");
    content.className = "chat-content";
    content.innerText = chatinfo.content;

    const data = $$$("div");
    data.className = "chat-date";
    data.innerText = formatDate(chatinfo.createdAt);

    div.appendChild(img);
    div.appendChild(content);
    div.appendChild(data);

    doms.chatContainer.appendChild(div);
  }

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
})();
