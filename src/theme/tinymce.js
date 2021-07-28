import extend from 'extend';
import Quill from 'quill'
import '../format'
const SnowTheme = Quill.import('themes/snow')
const icons = Quill.import('ui/icons')
const Picker = Quill.import('ui/picker')
import Menu from '../modules/menu'
import { createPopper, clearOtherPopper } from '../utils/popper'
import * as plugins from '../plugins'

import '../assets/tinymce.styl'

Quill.register('modules/menu', Menu)

const TOOLBAR_CONFIG = [
  [{ header: ['1', '2', '3', false] }],
  ['bold', 'italic', 'underline', 'link'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ 'color': [] }, { 'background': [] }],
  [{ align: [] }],
  ['clean'],
];
const MENU_CONFIG = [
  ['File_New Document'],
  ['File_Preview'],
  ['File_Export', 'File_Print'],
  ['File_Export_Pdf'],
  ['Edit_Undo', 'Edit_Redo'],
  ['Edit_Cut', 'Edit_Copy', 'Edit_Paste', 'Edit_Paste as text'],
  ['Edit_Select all'],
  ['View_Preview', 'View_Fullscreen'],
  ['View_Show comments'],
  ['Insert_Image', 'Insert_Link', 'Insert_Media', 'Insert_Add comment', 'Insert_Code sample', 'Insert_Table'],
  ['Format_Bold', 'Format_Italic', 'Format_Underline', 'Format_Code'],
  [
    // 'Format_Formats',
    'Format_Font sizes',
    // 'Format_Fonts',
    // 'Format_Blocks',
    'Format_Align'
  ],
  ['Format_Text color', 'Format_Background color'],
  ['Format_Clear formatting'],
  ['Table_Table'],
  ['Table_Cell', 'Table_Row', 'Table_Column'],
  ['Table_Sort'],
  ['Table_Table properties', 'Table_Delete Table'],
  ['Comments_Add comment', 'Comments_Show comments'],
  ['Help_Help']
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
    console.log(options.modules.menu.container)
    let container = document.createElement('div')

    super(quill, options);
    this.quill.boundary = container
    container.classList.add('ql-tinymce-container')

    this.quill.container.parentNode.insertBefore(container, this.quill.container)
    container.appendChild(this.quill.container)

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
    this.buildPopper(menu.container.querySelectorAll('.ql-menu > div[class^=ql-menu]'))
  }
  extendToolbar(toolbar) {
    super.extendToolbar(toolbar)
    toolbar.container.classList.remove('ql-snow');
    toolbar.container.classList.add('ql-tinymce')
  }
  buildPopper (doms) {
    doms.forEach(createPopper)
    document.addEventListener('click', evt => {
      clearOtherPopper()
    })
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