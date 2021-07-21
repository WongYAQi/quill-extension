const CheckSVG = require('../assets/icons/check.svg')
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
    this.controls = []
  }
  /**
   * plugin 自身就是一个方法，但是方法上具有 _name, _icon, _keyboard, _checked 等属性用来注册
   * _name
   * _icon
   * _keyboard: 只有当存在时，才会为导航栏菜单添加快捷键元素
   * _checked: 只有当存在时，update 才回去检测是否需要显示勾号表示已激活
   * @param {} plugin 
   */
  register (plugin) {
    let pm = this
    let handler = function (range, context) {
      plugin.call(this, range, context)
      if (typeof handler._check === 'boolean') handler._check = !handler._check
      pm.update(plugin._name)
    }
    handler._name = plugin._name
    handler._keyboard = plugin._keyboard
    handler._icon = plugin._icon
    handler._check = plugin._check

    this[plugin._name] = handler
  }

  /**
   * 在外层将 Plugin 和 对应的导航栏菜单绑定到一起
   * @param {*} dom 
   * @param {*} plugin 
   */
  attach (dom, plugin) {
    this.controls.push([dom, plugin])
  }
  /**
   * 每一次的plugin的触发都伴随着 update 的更新
   * @param {*} dom 
   * @param {*} plugin 
   */
  update (pluginName) {
    let pairs = this.controls.find(pairs => pairs[1]._name === pluginName)
    let [dom, plugin] = pairs
    if (typeof plugin._check === 'boolean') {
      if (plugin._check) {
        let checkDom = document.createElement('div')
        checkDom.classList.add('popper-item-check')
        checkDom.innerHTML = CheckSVG
        dom.appendChild(checkDom)
      } else {
        let checkDom = dom.querySelector('.popper-item-check')
        if (checkDom) {
          checkDom.remove()
        }
      }
    }
  }
}

module.exports = new PluginManager()