import extend from 'extend';
import Quill from 'quill'
const SnowTheme = Quill.import('themes/snow')
const icons = Quill.import('ui/icons')
const Picker = Quill.import('ui/picker')
import Menu from '../modules/menu'
import Icons from '../core/icon'
import Handlers from '../core/handler'
import Keyboards from '../core/keyboard'
import { createPopper } from '../utils/popper'

import '../assets/tinymce.styl'

Quill.register('modules/menu', Menu)

const TOOLBAR_CONFIG = [
  [{ header: ['1', '2', '3', false] }],
  ['bold', 'italic', 'underline', 'link'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['clean'],
];
const MENU_CONFIG = [
  ['File_Preview'],
  ['File_Setting'],
  // 上面两个表示所属同一个一级菜单 File, 但是是不同的分组
  ['Format_Formats', 'Format_Font sizes'],
  // 上面表示 Formats 和 Font Size 是所属 Format ，并且是同一组的成员
  // 二级标签定义完了，再去定义三级标签
  [ // 这里表示 Bold 和 Italic, Underline 是一组的，但是如何表示 Formats 和其他内容是一组的呢？在前方定义二级菜单
    'Format_Formats_Bold',
    'Format_Formats_Italic',
    'Format_Formats_Underline'
  ]
]

class TinyMceTooltip {

}

/**
 * Tinymce 相比 snow 主题，多出了什么？
 * 1. toolbar 的按钮激活样式, 直接修改样式表? 还是重写一份 Toolbar, 相对于以前的toolbar，我产生了什么新的内容？File等菜单栏
 * 2. 下拉框的样式
 * 3. tooltip 的样式
 * 4. 激活的popper，popper 中可以是表单，可以是输入矿，
 */
class TinyMceTheme extends SnowTheme {
  constructor (quill, options) {
    if (
      options.modules.toolbar != null &&
      options.modules.toolbar.container == null
    ) {
      options.modules.toolbar.container = TOOLBAR_CONFIG;
    }
    if (options.modules.menu != null && options.modules.menu.container == null) {
      options.modules.menu.container = MENU_CONFIG
    }
    super(quill, options);
    this.quill.container.classList.remove('ql-snow');
    this.quill.container.classList.add('ql-tinymce');
  }

  addModule(name) {
    const module = super.addModule(name);
    if (name === 'menu') {
      this.extendMenu(module);
    }
    return module;
  }

  extendMenu(menu) {
    menu.container.classList.add('ql-menu')
    menu.container.classList.add('ql-tinymce')
    this.bindIcons(menu.container.querySelectorAll('.ql-menu span'), Icons)
    this.bindHandlers(menu.container.querySelectorAll('.ql-menu span'), Handlers)
    this.bindKeyboards(menu.container.querySelectorAll('.ql-menu span'), Keyboards)
    this.buildPopper(menu.container.querySelectorAll('.ql-menu span[class^=ql-menu-]'))
  }
  extendToolbar(toolbar) {
    super.extendToolbar(toolbar)
    toolbar.container.classList.remove('ql-snow');
    toolbar.container.classList.add('ql-tinymce')
  }
  bindIcons (doms, icons) {
    doms.forEach(dom => {
      let format = dom.getAttribute('class') || ''
      format = /ql-menu-(.*?)/.exec(format)
      if (format) format = format[1]
      if (format && icons[format]) {
        dom.appendChild(icons[format])
      }
    })
  }
  bindHandlers (doms, handlers) {

  }
  bindKeyboards (doms, handlers) {

  }
  buildPopper (doms) {
    doms.forEach(createPopper)
  }
}

/**
 * 判断 popper 是向下，还是向右
 * @param {HTMLElement} dom 
 */
function bindDomPopper (dom) {
  let children = dom.querySelectorAll('span[class^=ql-menu]')
  if (children) {
  }
}

TinyMceTheme.DEFAULTS = extend(true, {}, SnowTheme.DEFAULTS, {
  modules: {
    menu: true
  }
});

export {
  TinyMceTheme
}