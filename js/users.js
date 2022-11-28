/**
 * 用户登录和注册的表单项的通用代码
 */

class FileValidator {
  /**
   *
   * @param {string} txtTagName 验证表单的id
   * @param {function} validatefun 一个验证规则函数，获取验证的元素
   */
  //这是一个构造函数
  constructor(txtTagName, validatefun) {
    // 获取这个tagname的input和它的p元素
    this.input = $("#" + txtTagName);
    this.p = this.input.nextElementSibling;
    this.validatefun = validatefun;
    // 表单验证发生在表单失去聚焦和提交验证时
    this.input.onblur = () => {
      this.validate();
    };
  }

  //验证函数成功True，失败False
  async validate() {
    const err = await this.validatefun(this.input.value);
    if (err) {
      // 有错误则传入p元素
      this.p.innerHTML = err;
      return false;
    } else {
      this.p.innerHTML = "";
      return true;
    }
  }
  //用一个静态方法实现一次性全部验证
  /**
   * 所有的验证都通过返回true 否则返回false
   * @param {validators} validators 验证器数组
   */
  static async validate(...validators) {
    const paras = validators.map((v) => v.validate());
    const result = await Promise.all(paras);
    return result.every((r) => r);
  }
}

