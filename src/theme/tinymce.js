import Quill from 'quill'
const BaseTheme = Quill.import('core/theme')
import TinyMCEToolbar from '../modules/toolbar'
Quill.register({
  'modules/toolbar': TinyMCEToolbar
}, true)
/**
 * Tinymce 相比 snow 主题，多出了什么？
 * 1. toolbar 的按钮激活样式, 直接修改样式表? 还是重写一份 Toolbar, 相对于以前的toolbar，我产生了什么新的内容？File等菜单栏
 * 2. 下拉框的样式
 * 3. tooltip 的样式
 * 4. 激活的popper，popper 中可以是表单，可以是输入矿，
 */
class TinyMceTheme extends BaseTheme {
  constructor (quill, options) {
    if (
      options.modules.toolbar != null &&
      options.modules.toolbar.container == null
    ) {
      options.modules.toolbar.container = TOOLBAR_CONFIG;
    }
    super(quill, options);
    this.quill.container.classList.add('ql-tinymce');
  }

  extendToolbar(toolbar) {
    toolbar.container.classList.add('ql-snow');
    this.buildButtons(toolbar.container.querySelectorAll('button'), icons);
    this.buildPickers(toolbar.container.querySelectorAll('select'), icons);
    this.tooltip = new SnowTooltip(this.quill, this.options.bounds);
    if (toolbar.container.querySelector('.ql-link')) {
      this.quill.keyboard.addBinding(
        { key: 'k', shortKey: true },
        (range, context) => {
          toolbar.handlers.link.call(toolbar, !context.format.link);
        },
      );
    }
  }
}

export {
  TinyMceTheme
}