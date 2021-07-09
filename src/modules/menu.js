import Quill from 'quill'
const Module = Quill.import('core/module')


/**
 * label中用 _ 区分多级级联，icon 显示为前方的图标，keyboard 关键字， disabled 禁用状态
    // [{ label: 'File_New Document' }]
    // [
    //   { label: 'Edit_Undo', keyboard: ['ctrl', 'z'] },
    //   { label: 'Edit_Cut', keyboard: ['ctrl', 'x'] }
    // ]
    [{ label: 'Format_Formats_Bold' }]
    [{ label: 'Format_Formats_Italic' }]
    [{ label: 'Format_Formats_Underline' }]
  * FIXME: 不再提供 icon 参数，icon通过 assets 中的内容引入
    FIXME: 暂时不提供 disabled 参数，disabled具有检测是否可以变化的功能
    FIXME: 有子项的不可能具有快捷键
  * 建立一个 Menu 对应的 Icon 图标，存放在 assets 中，通过 tinymce.js 中的 extendMenu 方法完成图标的绑定
    menu 和 toolbar 的区别，menu中的内容，不会因为鼠标的select change而被触发 update ，menu永远只会单向影响 content
    menu 中的 formats 会影响 content, 有的会打开一个弹窗，新增一些内容到当前 select range

    TODO: 当前阶段，只做 formats 的内容，不做弹窗的内容
 */
class TinyMceMenu extends Module {
  constructor (quill, options) {
    super(quill, options)
    // 在 Menu 的时候，创建提前于 toolbar 之前
    if (Array.isArray(this.options.container)) {
      let container = document.createElement('div')
      addControls(container, this.options.container)
      /** @type { HTMLElement } */
      let targetElement = quill.container
      if (targetElement.previousElementSibling.classList.contains('ql-toolbar')) {
        targetElement = targetElement.previousElementSibling
      }
      targetElement.parentNode.insertBefore(container, targetElement)
      this.container = container
    }
    if (!(this.container instanceof HTMLElement)) {
      console.error('TinyMceMenu Module 必须通过数组参数引入的方式')
    }
  }
}
attach () {

}
/**
 * 这里只是添加元素，并没有绑定事件、绑定图标等内容
 */
addControls (container, options) {

}

export default TinyMceMenu