/**
 * Plugin 需要提供注册 handler, 注册 icon, 注册 keyboard
 * plugins 的内容自动执行后注册
 * 根据 Menu 中的class名称绑定，一对一
 * 每一个 Plugin 中都是一个个方法，方法就是他们的 handlers, 然后通过对方法添加属性来获取其他内容
 * 
 * plugin 的触发会在 quill 的父对象上触发, this.quill => quill, 然后如果涉及到了快捷键，就会有 range, context 等常规参数在方法中
 */
class PluginManager {
  constructor () {
  }
  /**
   * plugin 自身就是一个方法，但是方法上具有 _name, _icon, _keyboard 等属性用来注册
   * @param {} plugin 
   */
  register (plugin) {
    this[plugin._name] = plugin
  }
}

module.exports = new PluginManager()