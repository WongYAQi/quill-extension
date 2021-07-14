import Quill from 'quill'
const Module = Quill.import('core/module')


/**
 * label中用 _ 区分多级级联，icon 显示为前方的图标，keyboard 关键字， disabled 禁用状态
  [
    ['File_Preview'],
    ['File_Setting'],
    // 上面两个表示所属同一个一级菜单 File, 但是是不同的分组, 不会单独定义一级菜单
    ['Format_Formats', 'Format_Font Size'],
    // 上面表示 Formats 和 Font Size 是所属 Format ，并且是同一组的成员
    // 二级标签定义完了，再去定义三级标签
    [ // 这里表示 Bold 和 Italic, Underline 是一组的，但是如何表示 Formats 和其他内容是一组的呢？在前方定义二级菜单
      'Format_Formats_Bold',
      'Format_Formats_Italic',
      'Format_Formats_Underline'
    ]
  ]

  最多三层

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
function attach () {

}
/**
 * 这里只是添加元素，并没有绑定事件、绑定图标等内容
 * 计划修改方式：在 addControls 中填充所有的元素，然后在 attach 的时候，添加点击事件来显示
 */
function addControls (container, options) {
  const mapMenu = new Map()
  options.forEach(group => {
    let groupDom = document.createElement('span')
    let target = container
    groupDom.classList.add('ql-group')
    group.forEach(menu => {
      let parents = menu.split('_')
      if (parents.length < 2) return
      let menuDom = addMenu(container, parents.shift())
      target = menuDom
      while (parents.length) {
        menuDom = addMenu(target, groupDom, parents.shift())
        if (parents.length) target = menuDom
      }
    })
    target.appendChild(groupDom)
  })
}

/**
 * 填充 container 下的主menu菜单
 * @param {HTMLElement} container 要添加菜单的DOM
 * @param {String} menu 
 */
function addMenu (container, group, menu) {
  if (!menu) {
    menu = group
    group = container
  }
  let dom = container.querySelector(`.ql-menu-${menu.replace(/\s/g, '').toLocaleLowerCase()}`)
  if (!dom) {
    dom = document.createElement('div')
    dom.setAttribute('data-label', menu)
    dom.classList.add(`ql-menu-${menu.replace(/\s/g, '').toLocaleLowerCase()}`)
    group.appendChild(dom)
  }
  return dom
}

export default TinyMceMenu